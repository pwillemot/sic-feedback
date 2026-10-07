# SIC Use-Case Feedback

Live, **anonymous** audience feedback for the ArcelorMittal Long SIC session. After each
use-case demo, attendees scan a QR / open a link on their phone and rate the use case; a
projector screen shows a live **Value × Effort heat map** and an **auto-ranked priority
list**.

Plain HTML/JS, no build step. Firebase Realtime Database for live sync. Hosted on GitHub
Pages.

## Pages

- **`feedback.html?uc=UC03`** — the mobile feedback form for one use case (anonymous — no
  name). One link / QR per use case: `UC01` … `UC10`.
- **`results.html`** — the projector view: heat map + priority ranking, with **CSV** and
  **results image (PNG)** export.
- **`index.html`** — redirects to `results.html`.

## How it works

- Each use case collects independently under `feedback/{ucId}/responses/{anonId}` in
  Firebase. No name or identity is stored; an anonymous id in `sessionStorage` means a
  re-submit from the same phone overwrites that phone's answer (one vote per phone per use
  case).
- **Business Value** and **Effort today** are 1–5 tap scales. *Effort today* = how much
  manual effort the task takes **now**, i.e. the pain the use case removes.
- Priority score = `value × effort`. On the heat map, **top-right (high value + high manual
  effort) = DO FIRST**.
- Data **persists** — it is never auto-cleared.

## Config

`js/firebase-config.js` holds the Firebase project (shared with the quiz, but writes under a
separate `feedback/` node). The database rules must allow read/write on the `feedback` node.

## The 10 use cases

UC01 Automatic Quote From an Email · UC02 Natural-Language Quote Creation · UC03 Voice Visit
Report · UC04 Steer the Business by Asking · UC05 Where Is My Order? · UC06 AI-Driven Data
Quality · UC07 Onboarding / Process-Explainer · UC08 Agentforce Co-worker · UC09 Agentforce
& Teams · UC10 Claudeforce.
