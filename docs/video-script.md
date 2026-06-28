# Video Script — Mrs. Hudson's Class
### Product Development Process (~5 min)
**Format**: Slides + voiceover narration

---

## SLIDE 1
**Visual**: App name "Mrs. Hudson's Class" on a clean, dark sage background. Subtitle: *A writing journal for 9th grade English students.*

**Voiceover:**
I want to tell you about a product I built — but to explain why I built it, I have to start with two people.

The first is my mother. I watched her graduate with her associate's degree when I was a toddler. I didn't understand the significance then, but I understood it later — because she never stopped. She kept going. She built a career in education, became a leader in it, and she's now finishing her doctorate. Her entire career has been a lesson in what it looks like to take education seriously. That shaped what I care about building.

The second is Mrs. Hudson — my third grade teacher. She was the kind of teacher you remember for the rest of your life. I named this product after her because she earned it.

---

## SLIDE 2
**Visual**: A simple two-column layout. Left: *The way most student writing works.* Right: *What's missing.*

**Voiceover:**
Here's the problem I was trying to solve.

Most student writing tools treat writing as a submission act. A student opens a document, writes until the word count looks right, and hits submit. There's no structured space between the first draft and the final version. There's no mechanism for a teacher to guide reflection at scale. And there's no real accommodation for students who think differently — who draft better by speaking than typing, or who need a different kind of push to go deeper.

The result is that writing becomes a compliance exercise instead of a thinking exercise. And that's the problem Mrs. Hudson's Class is designed to address.

---

## SLIDE 3
**Visual**: App screenshot or simple diagram showing the three core pieces: Reading Plans → Journal → Socratic Coach.

**Voiceover:**
The product is a progressive web app — installable on any phone, no app store required — organized around three things.

First, Reading Plans: the teacher's curriculum, encoded as a set of writing prompts that scaffold the arc of a text — from pre-reading prediction through post-reading reflection. The current prototype includes plans for Lord of the Flies, I Know Why the Caged Bird Sings, Hamlet, and daily warm-up prompts.

Second, a private student journal with auto-save, word count, streak tracking, and a JSON export so students own their data.

Third — and this is the feature I'm most invested in — a Socratic AI coach.

---

## SLIDE 4
**Visual**: Screenshot or mockup of the Socratic Coach UI — student entry on one side, three follow-up questions on the other.

**Voiceover:**
The Socratic Coach is not a writing assistant. It doesn't complete sentences or suggest edits. What it does is read what the student wrote and generate exactly three follow-up questions — each one referencing something specific from their draft, each one pushing toward evidence, nuance, or personal connection.

The model is Gemini 2.5 Flash Lite. The prompt is tightly constrained: no yes-or-no questions, approachable for a 9th grader, referenced to what the student actually wrote. Students are told to revise before submitting. Entries written with the coach are flagged in the journal.

The design principle is that AI should make the student think harder, not think less.

---

## SLIDE 5
**Visual**: Simple text slide. Header: *How I built it.* Three lines: Claude Code · Custom agentic PM tools · Deployed on Vercel.

**Voiceover:**
I built this using an AI-augmented development workflow. The application itself — the frontend, the AI integration, the service worker, the test suite — was built and deployed using Claude Code, Anthropic's agentic coding tool. I also used custom agentic product management tools to help me refine the product vision and strategy, work through tradeoffs, and move from concept to working prototype faster than I could have working traditionally.

This isn't a case where AI generated a vibe and I called it a product. Every feature was a decision — what to build, what to leave out, what to gate, and why. The voice input feature, for example, is fully built in the codebase but currently disabled — because the technical reliability wasn't there yet, and shipping an accessibility feature that's unreliable does more harm than good.

---

## SLIDE 6
**Visual**: Header: *What would success look like in a pilot?* Bullet list of metrics.

**Voiceover:**
This is a prototype. No real students have used it yet. So when I think about success, I think about what I'd actually measure in a pilot with one class.

The quantitative signals: Are students writing more — higher word counts, more entries per week — compared to a baseline? Are they invoking the Socratic Coach and then actually revising? Is there a measurable difference in the depth of writing between coached and uncoached entries?

But the qualitative signals matter just as much: Do teachers feel like the prompt structure reduces their planning load? Do students describe the coach as helpful or annoying? Are there students who engage more through this tool than they do in traditional class writing — particularly students who've historically been reluctant writers?

If the answer to those questions is yes, that's a product worth building further.

---

## SLIDE 7
**Visual**: Header: *What's next.* Simple numbered list.

**Voiceover:**
The roadmap is honest about what's missing. Right now, all data lives in the browser — there's no real backend, no real authentication, no cross-device sync. That's the first thing to build before a real pilot.

After that: a teacher view, so a teacher can see which students have written, who's used the coach, and where engagement is dropping — without reading individual private entries.

Then: enabling voice input, which is already built and waiting, for students who express themselves better out loud than on a keyboard.

And eventually: opening the platform so any teacher can configure their own reading plans, run their own pilot, and contribute to what this product becomes. Because the goal was never to build something for one classroom. It was to co-create something with teachers and students that actually changes the relationship between young people and writing.

That's what my mother's career taught me education can do. That's why I named it after Mrs. Hudson.

---

## SLIDE 8
**Visual**: App icon on dark sage background. Text: *Mrs. Hudson's Class — github.com/ytsmith221/mrs-hudsons-class*

**Voiceover:**
Thank you.

---

*Total estimated runtime: ~5 minutes at a natural speaking pace.*
*Adjust slide timing: Slides 1–2 (~45s each), Slides 3–5 (~60s each), Slide 6 (~70s), Slide 7 (~70s), Slide 8 (~10s).*
