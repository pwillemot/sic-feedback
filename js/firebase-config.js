// ---------------------------------------------------------------------------
// Firebase configuration — SIC Use-Case Feedback
// ---------------------------------------------------------------------------
// This app reuses the SAME Firebase project as the quiz, but writes under a
// completely separate top-level node ("feedback/..."), so it never touches the
// quiz's "games/..." data. (Open item: a dedicated project can be swapped in
// later by just replacing the values below.)
//
// If any value still contains REPLACE_ME, the app runs in LOCAL PREVIEW mode:
// the form works and shows the thank-you screen, but submissions are kept only
// in this browser (localStorage) instead of being sent to Firebase. That lets
// us review the page design before wiring the live database.
// ---------------------------------------------------------------------------

export const firebaseConfig = {
  apiKey: "AIzaSyBPDuyommf0wsUkmAoYUbCljIUWQ3Zo0Nc",
  authDomain: "sf-quiz-63d9f.firebaseapp.com",
  databaseURL: "https://sf-quiz-63d9f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sf-quiz-63d9f",
  storageBucket: "sf-quiz-63d9f.firebasestorage.app",
  messagingSenderId: "582390570147",
  appId: "1:582390570147:web:fdf3b67de4cd336616f316",
};

export const isConfigured = !Object.values(firebaseConfig).some(
  (v) => typeof v === "string" && v.includes("REPLACE_ME")
);
