// ---------------------------------------------------------------------------
// SIC use-case feedback — use cases + answer options
// ---------------------------------------------------------------------------
// The 10 use cases are the canonical list from the SIC use-case map
// (SIC-usecases-site/index.html, the BEATS array). Keep ids as "UC01".."UC10".
//
// Themes (act) match the use-case map:
//   sell  = Sell & Quote      (orange)
//   know  = Knowledge & Quality (magenta)
//   every = Agents Everywhere  (ember red)
//
// The chip lists below (data / channels / actions) are shared across all use
// cases so the form is identical and fast everywhere. Edit freely before the
// session — order here is the order shown on the phone.
// ---------------------------------------------------------------------------

export const THEMES = {
  sell:  { label: "Sell & Quote",        solid: "#ff6a13", grad: "linear-gradient(135deg,#ff9a2e,#ff6a13)" },
  know:  { label: "Knowledge & Quality", solid: "#b0186b", grad: "linear-gradient(135deg,#d63c8f,#8e1e6a)" },
  every: { label: "Agents Everywhere",   solid: "#e4002b", grad: "linear-gradient(135deg,#ff5a4d,#e4002b)" },
};

// `dep` = dependency on ArcelorMittal back-end systems (manual, business-set guidance):
//   low | medium | high. Higher dependency = more integration effort → the results
//   page discounts the priority score accordingly. Edit these freely.
export const USE_CASES = [
  { id: "UC01", act: "sell",  dep: "low",    tag: "Inbound Email → Quote",    title: "Automatic Quote From an Email",
    lead: "An inbound quote-request email becomes a full project and drafts a priced quote on its own." },
  { id: "UC02", act: "sell",  dep: "low",    tag: "Natural-Language Quote",   title: "Natural-Language Quote Creation",
    lead: "Describe the quote in plain language and get a configured, priced quote from the catalog." },
  { id: "UC03", act: "sell",  dep: "low",    tag: "Voice Visit Report",       title: "Voice Visit Report",
    lead: "After a visit, a voice note (and/or a photo) becomes a structured visit report in the CRM." },
  { id: "UC04", act: "sell",  dep: "medium", tag: "Natural-Language Analytics", title: "Steer the Business by Asking",
    lead: "Ask the numbers in plain language and see the answer visualised right in the conversation." },
  { id: "UC05", act: "sell",  dep: "high",   tag: "Order Tracking",           title: "Where Is My Order?",
    lead: "The agent answers order, shipment and delivery questions — status, ETA, truck location, driver." },
  { id: "UC06", act: "know",  dep: "low",    tag: "Data Quality",             title: "AI-Driven Data Quality",
    lead: "Native rules catch the obvious, an AI scan flags the subtle, a cockpit + agent help fix it." },
  { id: "UC07", act: "know",  dep: "low",    tag: "Onboarding Coach",         title: "Onboarding / Process-Explainer",
    lead: "A new joiner asks how a task is done and gets an answer grounded in approved documents." },
  { id: "UC08", act: "know",  dep: "low",    tag: "Agentforce Co-worker",     title: "Agentforce Co-worker",
    lead: "The out-of-the-box Agentforce co-worker agent, shown against this org's own data." },
  { id: "UC09", act: "every", dep: "low",    tag: "Agentforce in Teams",      title: "Agentforce & Teams",
    lead: "The same account intelligence surfaced inside Microsoft Teams, where people already work." },
  { id: "UC10", act: "every", dep: "low",    tag: "Claudeforce",              title: "Claudeforce",
    lead: "Talk to — and build against — Salesforce itself, conversationally, live in the session." },
];

export function getUseCase(id) {
  if (!id) return null;
  const want = String(id).toUpperCase();
  return USE_CASES.find((u) => u.id === want) || null;
}

// --- Answer options (chips) ------------------------------------------------
// Shown as tappable chips; multi-select. Each group also offers a free-text
// "Other" so nothing is lost.

export const DATA_OPTIONS = [
  "ERP / SAP",
  "CRM (Salesforce)",
  "Email",
  "Documents / PDFs",
  "Pricing / catalog",
  "Orders / inventory",
  "Logistics / shipping",
  "Customer master",
  "Contacts / people",
];

export const CHANNEL_OPTIONS = [
  "Mobile",
  "Web / desktop",
  "By phone / voice",
  "Microsoft Teams",
  "Email",
];

export const ACTION_OPTIONS = [
  "Draft a quote",
  "Create / update a record",
  "Answer a question",
  "Summarise",
  "Notify someone",
  "Trigger an approval",
  "Schedule a task / follow-up",
];
