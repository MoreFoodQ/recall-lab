# Claude consultation: midterm prep site

- **Author:** Claude Opus 5.5 (model ID `claude-opus-5-5`), consulted alongside Codex.
- **Date:** 2026-10-28
- **Deliverables:** `public/questions.json` (100 items) and this note. I changed no other files and made no git operations.

---

## 1. Question bank summary

| Topic | Count | Basic / Applied | Main sources |
| --- | --- | --- | --- |
| foundations | 16 | 11 / 5 | 341595 (LLM / clinical NLP talk), 343399, 343400, L1 p.5, L2 p.22 |
| models | 10 | 5 / 5 | 344615 (KNN), 338742 (model list), 341595 (BERT / fine-tune), **SVM and learning rate are supplemental** |
| preprocessing | 28 | 16 / 12 | L4 pp. 8–36, 343399, 344615, 341595 (tokenization) |
| representation | 22 | 12 / 10 | L4 pp. 38–57, 76; 341595; 344615 |
| evaluation | 14 | 6 / 8 | L4 pp. 56–57 (kappa), 341595 (imbalance, LOOCV), 343400 (metric list), **confusion-matrix items are supplemental** |
| python | 10 | 6 / 4 | L3 pp. 4, 11; L4 pp. 45–46; 338742; 343400 |
| **Total** | **100** | | |

- **Answer positions:** index 0 / 1 / 2 / 3 each appear 25 times. Every consecutive block of 4 ids is a permutation, so position cannot be guessed.
- **Diagram items (7):** ids 84–90 use `diagram: {type:"confusion", tp, fp, fn, tn}`. They ask what a denominator is or what a cell or metric means. None needs more than one-step arithmetic.
- **Supplemental items (13):** ids 21–26 (SVM margin, support vectors, kernel role, kernel choices, learning rate too large, learning rate definition) and ids 84–90 (precision/recall).
  - Each has `supplemental:true` and a `url` (scikit-learn SVM page, scikit-learn model-evaluation page, or the Google ML Crash Course hyperparameters page).
  - The local anchor is `materials/exam-notes-original.txt` with its chat-timestamp entry. Id 85 anchors to transcript 343400 [07:33.9], where precision is named.
- **Kernel item (id 24):** this answers "What is the main kernel of the SVM?" without claiming one universal kernel. It lists linear / polynomial / RBF / sigmoid and notes that scikit-learn's `SVC` default is RBF.
- **Cosine range (id 72):** the stem explicitly says nonnegative vectors.
- **Locators were checked against the files:**
  - PDF pages via the `--- Page N ---` markers in `materials/extracted/*.txt`. `source.file` points to the PDF in `materials/lectures/` because that is what students open.
  - Transcript ranges use the file's own `[mm:ss.s]` markers, from the segment's start marker to the next marker.
- **No exam-admin content.** Room, time, devices and the like are not asked about.

### Data contract notes for the front end
- `source.url` exists only when `supplemental` is true. Show a small "Supplemental / 補充" tag, because this content goes beyond what was taught so far.
- Turn file paths into friendly labels, e.g. `4. Preprocessing and Representation.pdf` + `p. 17` → "L4 · p.17". Transcript IDs map as:
  - 338742 = W1 course intro
  - 341595 = W2 LLM / clinical NLP talk
  - 343400 = W3 Python playground
  - 343399 = W3 preprocessing part 1
  - 344615 = W4 preprocessing and representation
- **Transcript 341595 has two recordings.** Its timestamps restart at `[04:20.3]` after the break, so some locators say `part 2 [...]`.
- Some strings contain `\"` (ids 27–29) and Unicode (√, ≈, ⏹). Render with `textContent`, never `innerHTML`.

---

## 2. Architecture recommendation (static GitHub Pages)

- **Stack:** plain HTML + CSS + ES modules, no framework. If Codex prefers Vite, set `base: './'` (or the repo name) so `public/questions.json` is copied to the site root and fetched with a relative URL (`./questions.json`). Do not use an absolute `/questions.json`, because it breaks on `user.github.io/repo/`.
- **Modules:** `data.js` (fetch + validate), `store.js` (localStorage), `quiz.js` (session engine), `render.js` (question, diagram, feedback), `views/` (home, practice, review, stats).
- **Routing:** hash routes (`#/practice`, `#/quiz?n=20&topic=evaluation`, `#/review`, `#/q/57`). These work on Pages without 404 tricks.
- **Persistence:** keep everything under one versioned key, `mlprep:v1`:
  ```json
  {"v":1,"lang":"en","attempts":{"57":[{"c":2,"ok":true,"t":1730000000}]},"flags":[12,84],"lastSession":{...}}
  ```
  - A question counts as "mastered" after 2 consecutive correct answers.
  - The wrong-answer set is "last attempt wrong, or never correct since the last miss". Do not just use "ever wrong"; otherwise the review list never shrinks.
  - Add Export / Import JSON and a Reset button with a confirm dialog.
- **Modes:**
  1. **Full bank:** id order, filterable by topic and difficulty. Resume where you left off.
  2. **Random quiz:** sizes 10 / 20 / 50, Fisher–Yates shuffle. Stratify across topics by default so a 20-question quiz is not all preprocessing.
  3. **Wrong-answer review:** only items in the wrong set, shuffled.
  4. **Optional "Exam sim":** English only, no instant feedback, results at the end. Useful because the real exam is all-English.
- **Option shuffling:** leave options in their original order in full-bank mode so review stays stable. In random quiz mode, shuffle options and map back to `answer`. The bank is already position-balanced, so shuffling is a bonus, not a requirement.
- **Instant feedback:** after the student picks an option, lock all options, mark the chosen one and the correct one, then reveal the explanation and source. Never reveal before the answer is committed.

---

## 3. UX critique of the proposed "editorial dark cockpit"

I agree with the direction. Oversized editorial type, hairline rules, a moss/lime accent and restrained motion suit focused, nighttime revision. My refinements:

1. **English first, Chinese on demand.**
   - The exam is entirely in English, so the default question view should be EN, with a per-question 中 peek (keyboard `L`) plus a global toggle EN / 中 / EN+中.
   - "Both" is good for first study passes. "EN" should be the default for quiz and exam-sim modes.
2. **Keep the hero big and the question canvas calm.**
   - Oversized type belongs in the hero and section headers only.
   - Question stems should be 20–24 px with a max width of about 68ch for English and about 36em for Chinese. Use line-height 1.55 for EN and 1.75 for 中.
   - Long stems at display size break the cockpit feel.
3. **Separate the accent from correctness.**
   - If lime is the brand accent, it cannot also be the only signal for "correct".
   - Use lime plus a ✓ icon plus the word "Correct", and a warm coral plus ✕ plus "Incorrect". Never rely on colour alone (red/green colour blindness).
   - Suggested OKLCH tokens (hue 140; check sRGB gamut and clamp chroma if needed):
     - `--bg: oklch(0.17 0.012 140)`, `--surface: oklch(0.21 0.015 140)`
     - `--rule: oklch(0.34 0.02 140)` (hairlines need at least this lightness to survive low-DPI screens)
     - `--text: oklch(0.95 0.01 140)`, `--muted: oklch(0.72 0.02 140)`
     - `--moss: oklch(0.58 0.09 140)`, `--lime: oklch(0.88 0.17 135)`
     - `--wrong: oklch(0.72 0.15 35)`, `--focus: oklch(0.9 0.12 100)`
4. **Give the abstract hero diagram meaning.**
   - Draw it in CSS as the course pipeline: Data → Preprocess → Represent → Learn → Evaluate.
   - A 2D feature-space scatter (the height–weight KNN example) or a 2×2 confusion grid would also work.
   - It then doubles as a mental model; decoration alone does not.
   - Animate it once on load; never animate it on question pages.
5. **Progress matrix, 10 × 10.** I like this.
   - Each cell is one question id, with states unseen / correct / wrong / mastered / flagged.
   - Encode the states with fill plus pattern (e.g. diagonal hatch for wrong), not just hue.
   - Clicking a cell jumps to that question. Per-topic progress sits on the topic rail.
   - On mobile, move the matrix into a bottom sheet.
6. **Topic rail.**
   - Desktop: a sticky left column showing topic name (EN / 中), count and mastery bar.
   - Mobile: horizontally scrollable chips.
7. **Confusion-matrix component.**
   - Render it as a real `<table>` with `<th scope>` labels: "Actual +/−" rows and "Predicted +/−" columns. This order matches the scikit-learn convention; state it in a caption.
   - After the answer is revealed, highlight the relevant cells. Example: outline TP + FN for a recall-denominator item.
   - That one interaction teaches the concept better than any formula.
8. **Keyboard and accessibility.**
   - `1–4` / `A–D` choose an option, `Enter` goes to the next question, `F` flags it, `L` swaps language.
   - Use `aria-live="polite"` for feedback, visible focus rings, at least 44 px targets, and `prefers-reduced-motion` respected globally.
9. **Fonts.**
   - Latin display face for the hero and a neutral grotesk for body text.
   - For Chinese, use the system stack (`"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif`). Don't ship a multi-MB CJK webfont on a static site.
10. **Awwwards reference.**
    - I did not browse in this run, so I cannot vouch for a specific Awwwards URL.
    - I endorse Codex's pick if it meets these criteria: (a) dark editorial layout with an asymmetric grid; (b) one restrained accent; (c) typography-led, not illustration-led; (d) readable long-form text blocks (a study site is read, not skimmed).
    - Record the chosen URL in the README or design note so the reference is traceable.

---

## 4. Source gaps (important for the "don't test what wasn't taught" note)

- **SVM, learning rate, precision / recall / confusion matrix** are not taught in any provided lecture or transcript.
  - The lecturer said metrics would come "maybe next month" (343400 [07:33.9]).
  - Model lectures (Naive Bayes, Decision Tree, Logistic Regression, SVM) are announced but not included (338742 [18:51.0]).
  - These items rely only on the user's exam notes plus basic official documentation, and are flagged supplemental.
  - **When the model and metric lectures are added, those items should be re-grounded.**
- **Exam notes cover only the second half** of the review session (15:32–15:46). The first half of the scope is unknown.
- **Feature selection** (filter: chi-square / MI / PMI; wrapper: forward / backward) was only previewed for "next week". It is covered by one conceptual item (id 48), with no detail.
- **Image-only slides.** Many slides have figures but almost no extractable text (L2 most pages; L3 pp. 2–3, 5–6, 13; L4 pp. 7, 14, 16, 18, 21, 32, 34–35, 44, 51, 54, 58–59, 62–74, 80–89). I avoided questions that depend on content visible only in those images, except where a transcript describes the figure (e.g. the label vs one-hot table on L4 p.21, described in 344615 [14:49.9]).
- **NumPy reshape / stack / slicing / broadcasting** (L4 appendix pp. 80–89) is image-only and was skipped in class ("NumPy, I think we no need talk about here", 344615 [49:43.5]), so I did not test it.

## 5. Source errors and inconsistencies found

| Location | Issue | How the bank handles it |
| --- | --- | --- |
| L4 p.17 | Min-max formula prints `man(x)`; should be `max(x)` | Noted in id 43's explanation |
| L4 p.50 | Euclidean example computes `√(1+9) = 3.16`, but (3−1)² = 4, so the answer is √13 ≈ 3.61 | Id 70 tests this and names the slide slip |
| L4 p.52 | "Range of cosine similarity is [0,1]" holds only for nonnegative vectors; in general it is [−1, 1] | Id 72 says "nonnegative" explicitly |
| L4 p.53 | Spelling "Consine Distance" | Cosmetic; quoted in the locator note |
| L4 p.57 vs 344615 [59:32.8] | Slide computes κ = 0.776 ("fair" band 0.67–0.8); lecturer said 0.78 is "good enough" | Id 78 uses κ = 0.85 to avoid the ambiguity |
| 344615 [03:12.1] | "Z-score is now zero to one": almost certainly "not zero to one" | Id 44 explanation flags it |
| 338742 [18:51.0] | Says "five classic models" but names four | Id 18 uses only the four named models |
| 344615 [24:37.2] | Titanic label counts transcribed as "more than a hundred not survive, five hundred survived" (titanic3 has about 809 / 500) | Not used in any item |
| 343400 | ASR writes "live coding" where the slides say "vibe coding" | Bank uses "vibe coding" |
| 341595 | Timestamps reset at [04:20.3] after the break (two recordings in one file) | Locators say "part 2" |
| L4 p.84 (extracted text) | The "stack along axis 2" panel appears labelled `axis=1` | Possible slide typo; check in the PDF; not tested |

## 6. Suggested next steps for Codex
1. Build against `public/questions.json` as-is. Validate on load that there are 4 options, `answer` is in 0–3, and ids are unique. If the file fails, show a friendly error.
2. Build the confusion-matrix table component first. It is the most distinctive piece of the UI and it is tied to the lecturer's "picture with recall" hint.
3. Add a "Supplemental" filter so students can study taught-only material separately.
4. After lectures on models and metrics arrive, ask me (or regenerate) to replace the supplemental anchors with real slide or transcript locators.
