# Mrs. Hudson's Class

A writing journal built for 9th grade English students — structured around the novels and texts they're actually reading, with an AI layer that pushes their thinking rather than replacing it.

The problem it addresses is specific: most student writing tools treat writing as a submission act. A student opens a Google Doc, types until the word count looks right, and submits. There's no structured space between the initial draft and the final version, no mechanism for a teacher to guide reflection at scale, and no accommodation for students who think better by speaking than by typing. Mrs. Hudson's Class is an attempt to redesign that workflow — keeping the teacher in the loop as the author of writing prompts and reading plans, while giving each student a private journal, a progress tracker, and an AI coach that asks follow-up questions rather than generating answers.

The app is a working prototype, currently in development toward a long-term goal of co-creating a scalable tool with teachers, students, schools, and districts.

---

## What it does today

**Reading Plans** — The teacher's curriculum is encoded as "Plans": sequential writing prompt sets organized around a text. The current prototype includes four: *Lord of the Flies*, *I Know Why the Caged Bird Sings*, *Hamlet*, and a Bell Ringers set for daily warm-up writing. Each plan has 6–7 prompts that scaffold the reading arc from pre-reading prediction through post-reading reflection.

**Private Journal** — Students write to prompts (or free-write) in a focused editor that auto-saves every 800ms to local storage. Entries track word count, tags, streak, and total writing volume. Entries can be archived and restored. Journal data exports as JSON.

**Socratic Coach (AI)** — On Socratic-enabled prompts (currently Lord of the Flies), students can invoke an AI coach after drafting. The coach sends the prompt text and the student's entry to Gemini 2.5 Flash Lite, which returns exactly three follow-up questions — each referencing something specific from what the student wrote, each pushing toward evidence, nuance, or personal connection. The coach does not generate prose or suggest answers. Students are told to revise before submitting. Entries written with the coach are tagged `🧠 Socratic` in the journal.

**Community Feed** — A class-scoped feed where the teacher (author role) can post announcements and students can share writing and react to each other's posts with likes and comments. In the current prototype, social state is client-side only.

**PWA** — Installable on iOS and Android home screens. Service worker handles offline asset caching with an explicit "Update now" banner rather than silent forced updates, so students aren't dropped mid-session.

---

## A real product decision worth calling out

The Socratic Coach is only enabled for the Lord of the Flies plan — not for all four. This was a deliberate sequencing choice, not a missing feature. Activating AI coaching across every plan before seeing how students actually respond to it in one context would make it harder to understand what's working and why. A tighter initial scope also forces the question of which prompts are best suited for Socratic questioning versus direct expression — the Bell Ringers, for instance, are designed for raw personal writing, and it's not clear that layering follow-up questions on top serves the goal. Keeping the flag off by default (the `socratic` property is only set to `true` on `lord_of_flies`) makes the feature easy to extend, but only with intent.

The same logic applied to voice input. Voice-to-journal was built and wired up (the mic button, recording state, Web Speech API integration, and UI are all in the codebase) but is gated behind `FEATURES.voiceInput = false` pending resolution of technical reliability issues across student devices. The intent behind the feature is specific: students who think out loud, who draft better by speaking than typing, or who have writing-related learning differences shouldn't be locked out of a journaling tool. That's the reason it was built first and disabled second, rather than left off the roadmap entirely.

---

## What went wrong and got fixed

The first deployed version of the app returned a 404 on every page load. The initial Vercel configuration pointed at a subdirectory that didn't exist in the repo structure. Once the file layout was corrected and `vercel.json` was added, the app loaded — but the Socratic Coach API route immediately failed with a runtime error. The cause: the serverless function was written with `module.exports` (CommonJS), but the deployment environment was treating it as an ES module. A one-line fix (`module.exports = async function handler...` confirmed explicitly) resolved it. Neither of these were architectural problems, but both would have been invisible without a live deployment — they're the kind of issues a local dev environment silently papers over.

A later pass caught a WCAG AA color contrast failure across the design system. Several text/background combinations in the sage and muted palette didn't meet the 4.5:1 ratio required for normal text. Those were corrected before the prototype was shared.

---

## Stack and architecture

| Layer | Choice |
|---|---|
| Frontend | Vanilla JS + CSS custom properties, single HTML file, no build step |
| AI | Google Gemini 2.5 Flash Lite via REST |
| API | Vercel serverless function (`api/gemini.js`) |
| Storage | Browser `localStorage` (client-only; no backend database) |
| PWA | Service worker with cache-first strategy, Web App Manifest |
| Testing | Playwright — 25 E2E tests covering auth, journaling, prompts, feed, profile, and PWA |
| Deployment | Vercel |

The single-file architecture was a deliberate tradeoff: zero build tooling means the app deploys from a repo clone with no configuration, runs in any browser without a bundler, and stays readable without a framework mental model. The cost is that the HTML/CSS/JS is monolithic and will need structural decomposition before a multi-teacher version is realistic.

The AI API key (`GEMINI_API_KEY`) is an environment variable set in Vercel and never exposed client-side. The serverless function validates that both `promptText` and `entryText` are present before making the upstream call, and surfaces real Gemini error messages to the UI rather than generic failures.

Student data lives entirely in `localStorage` — there is no user database, no authentication backend, and no server-side persistence. Sign-in and "Continue with Google" are UI stubs that call the same `enterApp()` function. This was an appropriate choice for a single-developer prototype, but it means no student data persists across devices or browsers, and it sets a hard ceiling on the multi-class vision until a real backend is introduced.

---

## Trying it

The prototype is deployed on Vercel — visit the live URL to use the app as a student would. No install required; it can be added to an iOS or Android home screen from the browser.

VERCEL URL: https://mrs-hudsons-class.vercel.app

**A note on the AI feature:** The Socratic Coach calls a Vercel serverless function (`/api/gemini`) that proxies to Gemini 2.5 Flash Lite using a server-side API key — the key is never exposed to the client. However, the endpoint currently has no authentication and no rate limiting. It validates only that `promptText` and `entryText` are present. For a single-class prototype with a small audience this is an acceptable tradeoff; adding an auth check or request quota is a prerequisite before a broader pilot.


---

## Known limitations

These are real gaps in the current prototype:

- **No persistence layer.** Community comments, likes, and notification dismissals are in-memory only and reset on page reload. A real deployment needs a backend.
- **Auth is a stub.** Sign-in stores only a name in localStorage. There's no real identity, which means no cross-device sync and no meaningful "your journal is private" guarantee.
- **"Done & Share" doesn't share.** The button sets a `shared: true` flag on the entry but doesn't route anything to the Community Feed. The toast is misleading.
- **Design system is partially tokenized.** Color variables are defined; typography, spacing, and border radius are hardcoded. Accessibility (ARIA labels, focus states) is not yet implemented.
- **Mobile only.** The app has a fixed 430px max-width with no responsive layout for tablet or desktop.

---

## What's next

The near-term roadmap, in rough priority order:

1. **Backend and real auth** — localStorage is the single largest constraint. A lightweight backend (user accounts, journal persistence, real social state) is the prerequisite for a real pilot.
2. **Teacher admin view** — a teacher needs to see which students have written to each prompt, who's used the Socratic coach, and overall engagement without reading individual entries.
3. **Voice input** — re-enable `FEATURES.voiceInput` once cross-device reliability is confirmed. The implementation is already in the codebase.
4. **Multi-class support** — allow a teacher to configure their own reading plans rather than editing the `planData` object directly. This is the architectural shift that moves the product from "one classroom tool" to "a platform."
5. **Pilot with real students** — co-design iteration with a teacher and class to validate whether the prompt cadence, Socratic coach behavior, and community feed actually change how students write.

The goal is a product that a teacher can hand to a class, confident that it meets students where they are — not a technology solution looking for an education problem to justify it.
