// ---------------------------------------------------------------------------
// Firebase Realtime Database wrapper — SIC Use-Case Feedback
// ---------------------------------------------------------------------------
// Adapted from the quiz's db.js. Fully independent data tree:
//
//   feedback/{ucId}/responses/{anonId}: {
//       value, effort,            // 1..5
//       data[], channels[], actions[],   // selected chip labels (+ any "other")
//       submittedAt
//   }
//
// One anonymous id per browser (sessionStorage) → re-submitting a use case
// overwrites that browser's previous answer (one vote per phone per use case).
// NO name, NO identity is ever stored.
//
// If Firebase is not configured, every function degrades to localStorage so the
// page can be reviewed locally. saveResponse() returns the mode used.
// ---------------------------------------------------------------------------

import { firebaseConfig, isConfigured } from "./firebase-config.js";

export { isConfigured };

let db = null;
let fb = null; // lazily imported SDK bindings

async function ensureDb() {
  if (!isConfigured) return null;
  if (db) return db;
  const appMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const dbMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
  fb = dbMod;
  const app = appMod.initializeApp(firebaseConfig);
  db = dbMod.getDatabase(app);
  return db;
}

// A stable anonymous id for this browser (kept in sessionStorage). Not a name,
// not tied to any person — only used so a re-submit overwrites cleanly.
export function anonId() {
  const KEY = "sic-feedback-anon-id";
  let id = null;
  try { id = sessionStorage.getItem(KEY); } catch (e) {}
  if (!id) {
    id = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
    try { sessionStorage.setItem(KEY, id); } catch (e) {}
  }
  return id;
}

const LOCAL_KEY = "sic-feedback-local-v1";
function localAll() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}"); } catch (e) { return {}; }
}
function localWrite(all) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(all)); } catch (e) {}
}

// Save one anonymous response for a use case. Returns "firebase" | "local".
export async function saveResponse(ucId, response) {
  const id = anonId();
  const payload = { ...response, submittedAt: Date.now() };

  if (isConfigured) {
    const database = await ensureDb();
    const r = fb.ref(database, `feedback/${ucId}/responses/${id}`);
    await fb.set(r, { ...payload, submittedAt: fb.serverTimestamp() });
    return "firebase";
  }

  // local-preview fallback
  const all = localAll();
  all[ucId] = all[ucId] || {};
  all[ucId][id] = payload;
  localWrite(all);
  return "local";
}

// Has this browser already answered this use case? Returns the saved response
// or null. (Used to pre-fill when re-opening the same use case.)
export async function getMyResponse(ucId) {
  const id = anonId();
  if (isConfigured) {
    const database = await ensureDb();
    const snap = await fb.get(fb.ref(database, `feedback/${ucId}/responses/${id}`));
    return snap.exists() ? snap.val() : null;
  }
  const all = localAll();
  return (all[ucId] && all[ucId][id]) || null;
}

// Normalise the raw feedback tree into:
//   { [ucId]: [ {value, effort, data[], channels[], actions[], submittedAt}, ... ] }
function shape(raw) {
  const out = {};
  Object.keys(raw || {}).forEach((ucId) => {
    const responses = (raw[ucId] && raw[ucId].responses) || {};
    out[ucId] = Object.keys(responses).map((id) => {
      const r = responses[id] || {};
      return {
        value: Number(r.value) || null,
        effort: Number(r.effort) || null,
        data: Array.isArray(r.data) ? r.data : [],
        channels: Array.isArray(r.channels) ? r.channels : [],
        actions: Array.isArray(r.actions) ? r.actions : [],
        submittedAt: r.submittedAt || null,
      };
    });
  });
  return out;
}

// Read every response once (results view / export). NEVER deletes anything.
export async function getAllFeedback() {
  if (isConfigured) {
    const database = await ensureDb();
    const snap = await fb.get(fb.ref(database, "feedback"));
    return shape(snap.exists() ? snap.val() : {});
  }
  // local-preview fallback: wrap flat {ucId:{id:resp}} into {ucId:{responses:{...}}}
  const all = localAll();
  const wrapped = {};
  Object.keys(all).forEach((ucId) => { wrapped[ucId] = { responses: all[ucId] }; });
  return shape(wrapped);
}

// Subscribe to live updates. Calls back with the shaped map on every change.
// Returns an unsubscribe function. Falls back to polling localStorage locally.
export async function watchFeedback(cb) {
  if (isConfigured) {
    const database = await ensureDb();
    const r = fb.ref(database, "feedback");
    // onValue returns its own unsubscribe function in the modular SDK
    return fb.onValue(r, (snap) => cb(shape(snap.exists() ? snap.val() : {})));
  }
  let last = "";
  const tick = async () => {
    const data = await getAllFeedback();
    const json = JSON.stringify(data);
    if (json !== last) { last = json; cb(data); }
  };
  tick();
  const t = setInterval(tick, 1500);
  return () => clearInterval(t);
}
