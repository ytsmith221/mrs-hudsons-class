# The Way of Asking — UX Audit & User Journey Map

> Generated: June 2026  
> Purpose: Input for UX redesign process ahead of book launch  
> Scope: Full audit of current app state including user journeys, known issues, and design system gaps

---

## PART 1: USER JOURNEY MAP

### 1.1 Authentication Flow

**Screen**: `#auth-screen` (Initial landing)

**What the user sees**:
- App logo (🌿 in sage box)
- Title: "The Way of Asking"
- Subtitle: "A journaling companion for the book"
- Two tabs: "Sign in" (active) and "Join"
- Email input, Password input
- Name input (hidden by default, shows on "Join" tab)
- Primary button: "Sign in"
- Secondary button: "Continue with Google"
- Helper text: "Your journal entries are private by default."

**User Actions**:
- Click "Join" tab → reveals Name input field
- Enter credentials → click "Sign in" or "Continue with Google" → both call `enterApp()`
- `enterApp()` validates name if visible, stores in localStorage, hides auth screen, shows main app

**What Happens Next**: User lands on Home screen with `renderAll()` populating all screens.

---

### 1.2 Home Screen

**Screen**: `#screen-home`

**What the user sees**:
- Greeting: "Good morning" + user name
- Two stat pills: 🔥 Streak (days) · 🪶 Entry count
- Fixed inspirational quote card (dark sage)
- "This Week's Prompt" section — latest prompt card with Write button
- "Your Plans" — first 2 plans from localStorage (or CTA if empty)
- "Continue Writing" — most recent journal entry excerpt
- Bottom navigation bar

**User Actions**:
- Click prompt card or "Write to this" → opens journal editor scoped to that prompt
- Click "All prompts →" → Prompts screen
- Click "All plans →" → Plans screen
- Click "All entries →" → Journal screen
- Click continue-writing card → opens that entry in editor
- Click profile icon (top right) → opens profile overlay

---

### 1.3 Prompts Screen

**Screen**: `#screen-prompts`

**What the user sees**:
- Intro text explaining the weekly prompt cadence
- List of available prompt cards (Week 1, Week 2, etc.):
  - Week badge + topic tags
  - Title and quote excerpt
  - Comment count
  - "Written ✓" badge if user has an entry for this prompt
- "Coming Soon" section — locked future prompts (padlock icon)

**User Actions**:
- Click prompt card → `openPrompt(promptId)` → opens full prompt detail overlay
- Click comment toggle → inline comment preview expands/collapses

---

### 1.4 Prompt Detail Overlay

**Overlay**: `#prompt-detail` (slides up full-screen)

**Two tabs: Write | Board**

**Write Tab**:
- Prompt hero (dark, with title, quote, tags)
- Full prompt body text
- Buttons:
  - "🪶 Start writing" / "✏️ Continue writing" (context-aware)
  - "Share prompt" (stub — shows alert)
  - "Join discussion" (switches to Board tab)

**Board Tab**:
- Comment input textarea + Post button
- Comment list:
  - Avatar, author name, "Author" or "You" badge, time, text
  - Like button, Delete button (own comments only)
  - "Pinned by author" label where applicable

**User Actions**:
- Write/Continue → `openEditor(promptId)` or `openEditor(promptId, entryId)`
- Post comment → `submitComment()` → adds to in-memory `localComments`
- Like comment → `toggleCommentLike()`
- Delete own comment → `deleteBoardComment()` with confirm dialog
- Close → `closeDetail()`

---

### 1.5 Journal Screen (Entry List)

**Screen**: `#screen-journal`

**What the user sees**:
- Two stat cards: total entries · total word count
- "🪶 New entry" button
- Entry cards (reverse chronological):
  - Prompt label or "Free write"
  - Date and word count
  - Title (bold, if present)
  - Body excerpt (first ~200 chars, markdown rendered inline)
  - Tags as chips (#tag)
  - Archive button (🗂)
- "🗂 Archived" collapsible section at bottom
  - Expand to see archived entries with Restore button per entry

**User Actions**:
- "New entry" → `openEditor(null)` — blank editor
- Click entry card → `openEditor(promptId, entryId)` — open existing entry
- Click 🗂 → `archiveEntry(id)` with confirm → entry hidden from main list
- Click "▸ Show" → `toggleArchivedSection()` → expands archived list
- Click "Restore" → `restoreEntry(id)` → entry returns to main list

---

### 1.6 Journal Editor Overlay

**Overlay**: `#journal-editor` (full-screen)

**What the user sees**:
- Header: ← Back | ✓ Saved status | Done · Done & Share →
- Prompt banner (dark sage, if writing to a prompt) — shows prompt title
- Title input (optional)
- Tags input (comma-separated, optional)
- Textarea with placeholder: "Begin here. There's no wrong way to do this…"
- Footer: word count · character count

**User Actions**:
- Type → auto-saves every 800ms to localStorage
- Click "Done" → `closeEditor(false)` — saves and closes
- Click "Done & Share →" → `closeEditor(true)` — saves, marks `shared: true`, shows toast
- Click ← Back → same as Done

**Auto-save behavior**: Debounced 800ms, shows "✓ Saved" for 2 seconds.

---

### 1.7 Plans Screen

**Screen**: `#screen-plans`

**What the user sees**:
- "My Plans" header with "+ New plan" button
- Plan cards (or "No plans yet" empty state):
  - Title (bold)
  - Body excerpt (150 chars)
  - Relative time saved
  - Edit and Delete buttons
- Inline plan editor (hidden by default):
  - Title input
  - Body textarea
  - Cancel / Save plan buttons

**User Actions**:
- "+ New plan" → `openPlanEditor(null)` — blank editor inline
- Click "Edit" → `openPlanEditor(planId)` — loads plan into editor
- Click "Save plan" → `savePlan()` — persists to `twa_plans` in localStorage
- Click "Cancel" → `closePlanEditor()` — dismisses without saving
- Click "Delete" → `deletePlan(id)` with confirm

---

### 1.8 Community Feed Screen

**Screen**: `#screen-feed` (nav label: Community)

**What the user sees**:
- "+ Share with the community…" button at top
- Feed posts (reverse chronological):
  - Avatar with initials
  - Author name, "Author" badge (book author) or "You" badge (current user)
  - Relative time
  - ⋯ menu (own posts only) → Edit / Delete
  - Post body text
  - Media pill if image/audio type
  - Action bar: 🤍/❤️ Like count · 💬 Comment count · ↗ Share
  - Comments section (collapsed by default):
    - Comment bubbles: author, time, text
    - ✏️ Edit / 🗑 Delete buttons (own comments only)
    - "Add a comment…" input (press Enter to submit)

**User Actions**:
- "Share with community" → `openPostComposer()` — modal with 500-char textarea + live counter
- Post → `submitFeedPost()` — prepends to feed, saves to localStorage
- Like → `toggleLike(postId)` — toggles heart, updates count (in-memory only)
- Comment toggle → shows/hides comment section
- Add comment + Enter → `addFeedComment(postId, input)`
- Edit own post → re-opens composer in edit mode
- Delete own post → confirm → removes from feed + localStorage
- Edit own comment → inline edit mode (input appears in place)
- Share post → Web Share API or copies link to clipboard

---

### 1.9 Profile Overlay

**Overlay**: `#profile-overlay` (slides in from right)

**What the user sees**:
- Header: "Profile" · ✕ close
- User card: avatar (initials), username, email, status (editable)
- Stats: streak · entry count
- Notifications list:
  - Each with description, time, × dismiss button
  - Unread vs. read styling
  - "You're all caught up ✓" when all dismissed
- Action buttons:
  - "🪶 Export my journal" → downloads JSON
  - "✏️ Update profile information" → reveals inline form
- Inline profile form (hidden): Name + Email inputs, Cancel / Save
- "Sign out" button at bottom

**User Actions**:
- Click status text → inline input appears → Enter or blur saves
- "Export my journal" → `exportJournal()` → downloads `journal_export_[timestamp].json`
- "Update profile information" → reveals form
- Save profile → `saveProfileInfo()` — saves name to localStorage
- Dismiss notification → removes from list (in-memory only)
- Sign out → hides app, shows auth screen

---

### 1.10 PWA Update Banner

**Feature**: Fixed banner at top of screen (hidden by default)

**Trigger**: Service worker detects a new version in the installed state.

**What the user sees**: "🌿 A new version is available." + "Update now" button

**User Action**: Click "Update now" → posts SKIP_WAITING to SW → page reloads with new version

---

## PART 2: KNOWN ISSUES & UNIMPLEMENTED FUNCTIONALITY

### Critical (Data Loss / Broken Behavior)

| # | Issue | Screen | Element | Expected | Actual |
|---|-------|--------|---------|----------|--------|
| 2.1 | **Prompt board comments not persisted** | Prompt Board | Comment list | Persist to localStorage | In-memory only, lost on reload |
| 2.2 | **User status not persisted** | Profile | Status text | Save to localStorage | In-memory only, resets on reload |
| 2.3 | **Like state not persisted** | Feed + Board | Like button | Save likes per item | In-memory only, lost on reload |
| 2.4 | **Email not saved in profile form** | Profile | Email input | Save to localStorage | Read-only display, save does nothing |
| 2.5 | **"Done & Share" doesn't actually share** | Journal editor | "Done & Share →" button | Add entry to Community Feed or share flow | Sets `shared: true` flag that is never used; toast is misleading |

### Stub / Not Implemented

| # | Issue | Screen | Element | Status |
|---|-------|--------|---------|--------|
| 2.6 | **"Share prompt" button** | Prompt detail | "Share prompt" button | `alert('Sharing coming soon!')` |
| 2.7 | **"Continue with Google" auth** | Auth screen | Google button | Calls same `enterApp()` as Sign in — no OAuth |
| 2.8 | **Notifications are static seed data** | Profile | Notifications list | Hardcoded; no integration with real user activity |
| 2.9 | **Plan card color headers** | Plans | Plan cards | CSS defines `.plan-header.sage/bark/moss` but never applied |
| 2.10 | **Tags not searchable/filterable** | Journal | Tag chips | Display only; no filter or search by tag |

### Visual / UX Bugs

| # | Issue | Screen | Detail |
|---|-------|--------|--------|
| 2.11 | **`--text-muted` CSS variable undefined** | Archived, Plans, misc | Used in inline styles but never declared → falls back to browser default |
| 2.12 | **Archived entry timestamps stale** | Journal (archived) | Shows `e.relTime` which was set at save time ("just now"), not recalculated |
| 2.13 | **Markdown strips newlines** | Journal entry list | `mdToHtml()` replaces `\n` with space — multi-paragraph entries render as one paragraph in preview |
| 2.14 | **Ellipsis always appended on prompt title** | Prompts, Feed | `substring(0,40)+'…'` appends "…" even on short titles |
| 2.15 | **Post ownership based on name matching** | Feed | Edit/delete access checked by matching `currentUserName` string — not a real user ID |
| 2.16 | **Dismissed notifications not persisted** | Profile | `dismissedNotifs` Set is in-memory; reappear on reload |

---

## PART 3: DESIGN SYSTEM AUDIT

### 3.1 Color Tokens — Defined ✅

```css
/* Defined in :root */
--sage-50  --sage-100  --sage-200  --sage-500  --sage-600  --sage-700  --sage-800  --sage-900
--bark-100  --bark-200  --bark-500  --bark-600
--earth-100  --earth-700
--cream: #FAF7F2
--parchment: #F0E9DC
--text: #2C2416
--muted: #7a6e64
```

**Missing / Undefined** (used in code but never declared):
- `--text-muted` — used in archived section, plans cards, inline styles
- No error/danger color token (hardcoded `#c0392b` used inline)
- No success color token

---

### 3.2 Typography — No Tokens ❌

All font sizes, weights, line heights are hardcoded. No CSS variables defined for typography.

| Element | Size | Weight | Family |
|---------|------|--------|--------|
| h1 | 26px | — | Lora (serif) |
| h2 | 20px | — | Lora |
| h3 | 17px | — | Lora |
| Body | 15px | — | Inter |
| Small | 12px | — | Inter |
| Muted | 13px | — | Inter |
| Label | 11px | 600 | Inter |
| Badge | 11px | 500 | Inter |
| Topbar | 17px | — | Lora |
| Nav label | 11px | 500 | Inter |

**Recommendation**: Define `--font-size-xs/sm/base/md/lg/xl` and `--font-weight-normal/medium/semibold/bold`.

---

### 3.3 Spacing — No Tokens ❌

All padding/margin values hardcoded in pixels. Utility classes exist (`.px`, `.pt`, `.pb`, `.mt`, `.gap`, `.gap-sm`) but values are static in CSS.

**Common values in use**: 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px

**Recommendation**: Define an 8px-base spacing scale: `--space-1: 4px` through `--space-8: 64px`.

---

### 3.4 Border Radius — Inconsistent ❌

| Usage | Value |
|-------|-------|
| Cards | 16px |
| Buttons | 12px |
| Small buttons | 10px |
| Inputs | 12px |
| Badges | 999px |
| Avatars | 50% |
| Stat pills | 14px |
| Auth modal | 24px |
| Post composer | 20px 20px 0 0 |

No CSS variables. Values range from 10px to 999px with no consistent scale.

---

### 3.5 Shadows — Minimal, Hardcoded

| Element | Value |
|---------|-------|
| App container | `0 0 40px rgba(0,0,0,.08)` |
| Plan cards | `0 2px 16px rgba(92,122,82,.08)` |
| Post menu | `0 4px 16px rgba(0,0,0,.12)` |
| Auth tab | `0 1px 4px rgba(0,0,0,.08)` |

All hardcoded. No shadow tokens.

---

### 3.6 Icons — Mixed & Inconsistent ❌

| Type | Usage | Problem |
|------|-------|---------|
| **Inline SVG** | Nav bar icons, profile icon | Good practice but paths are hardcoded, no reuse |
| **Emoji** | 🌿 🪶 🔥 💬 🗂 🎙 | Renders differently per OS/device |
| **Unicode symbols** | ❤️ 🤍 ✏️ 🗑 ↗ ✕ ✓ ▸ ▾ × | Sizing/alignment inconsistent |

No icon library or SVG sprite sheet. Heavy emoji usage is a design and accessibility liability.

---

### 3.7 Button Variants — Partially Defined

**Defined in CSS**:
- `.btn` — base
- `.btn-primary` — sage-600 filled
- `.btn-secondary` — sage-100 tinted with border
- `.btn-full` — 100% width
- `.btn-sm` — compact

**Missing / Inline-only**:
- `.btn-ghost` — used throughout in inline styles, never in CSS
- `.btn-danger` — hardcoded `color:#c0392b; border:1px solid #c0392b` inline
- No disabled state (`:disabled`)
- No loading/pending state

---

### 3.8 Card Variants

**Defined in CSS**:
- `.card` — standard white card, 16px radius, 18px padding
- `.card-sm` — compact padding
- `.card-dark` — sage-800 background
- `.card-parchment` — parchment background (**defined but never used in HTML**)

---

### 3.9 Responsive Design — Mobile Only ❌

- App has fixed `max-width: 430px` (hardcoded)
- Only one media query exists: profile overlay on `max-width:430px`
- No tablet or desktop layouts
- No responsive typography or spacing

---

### 3.10 Accessibility — Not Addressed ❌

- No `aria-label` on icon-only buttons
- No `:focus` styles defined
- No `role` attributes on custom interactive components
- Emoji used as primary icons (screen reader unfriendly)
- No visible form labels (placeholders only)
- No error/validation messages

---

### Design System Maturity Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| Color tokens | ✅ Good | 19 vars defined; `--text-muted` missing |
| Typography tokens | ❌ None | All hardcoded |
| Spacing tokens | ❌ None | All hardcoded |
| Shadow tokens | ❌ None | 4 one-off values |
| Border radius tokens | ❌ None | 7+ inconsistent values |
| Icon system | ❌ Mixed | Emoji + SVG, no unified system |
| Button variants | ⚠️ Partial | Core variants defined; ghost/danger missing |
| Card variants | ⚠️ Partial | 4 defined; 1 unused; limited range |
| Responsive | ❌ Mobile only | Fixed 430px, single breakpoint |
| Accessibility | ❌ Not started | No ARIA, no focus states |

---

*End of Audit — The Way of Asking, June 2026*
