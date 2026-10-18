# Review and recall: quizzes, flashcards and routine

Re-reading feels like learning but isn't. **Pulling answers out of your own head is.** This file is your recall toolkit. Day files already open with a "yesterday" quiz; this file adds the longer-term review.

## 1. The routine (about 10 minutes a day, built into the 3 hours)
| When | What | How long |
|---|---|---|
| Start of every day | "Yesterday" quiz at the top of the day file | 10 min |
| Start of every day | **Spaced card:** 3 random cards from the bank below, from 3+ days ago | 5 min |
| End of every week (review day) | Weekly mixed quiz + rebuild from memory + teach-back | in the review day |
| Every 2 weeks | Redo the weekly quizzes you scored under 8/10 on | 20 min |

**How to answer:** on paper or aloud, **before** opening the answer. Write a score next to each card: ✅ knew it, 🟡 partly, ❌ missed. Cards you miss come back the next day. Cards you get right three times in a row move to "every 2 weeks".

## 2. Spaced schedule (when each topic comes back)
| Topic first learned | Review on |
|---|---|
| Day 1 (Git, CI, routing) | Day 2, Day 4, Day 8, Day 15 |
| Day 2 (components, props, Tailwind) | Day 3, Day 5, Day 9, Day 15 |
| Day 3 (grid, forms) | Day 4, Day 7, Day 10, Day 15 |
| Day 4 (JavaScript, money formatting) | Day 5, Day 8, Day 11, Day 15 |
| Day 5 (array tools, pure functions) | Day 6, Day 9, Day 12, Day 15 |
| Day 6 (TypeScript types, `?.` and `??`) | Day 7, Day 9, Day 13, Day 20 |
| Day 7 (typed props, `children`, extracting components) | Day 8, Day 11, Day 14, Day 20 |
| Day 8 (`useState`, events, `"use client"`) | Day 9, Day 12, Day 15, Day 20 |
| Day 9 (controlled inputs, lifting state up, validation) | Day 10, Day 13, Day 16, Day 20 |

For Days 10 onward, I add the new topics to this table when I write that week.

## 3. Flashcard bank: Week 1
Cover the answer, say yours aloud, then open it.

### Day 1: Git, CI, routing
1. **You edited a file and want to see what changed. Which command?**
   <details><summary>Answer</summary>`git diff` (unstaged changes) or `git status` for the list of changed files.</details>
2. **Why do we work on a `day-XX` branch and not on `develop` directly?**
   <details><summary>Answer</summary>`develop` stays working. If the day goes wrong, you throw the branch away and nothing is lost.</details>
3. **CI went red at the `build` step. What do you do first?**
   <details><summary>Answer</summary>Open the log, read the first error, run the same command (`npm run build`) locally and fix it there.</details>
4. **A file is at `src/app/prices/page.tsx`. What URL shows it?**
   <details><summary>Answer</summary>`/prices` (file-based routing).</details>
5. **What is the difference between `layout.tsx` and `page.tsx`?**
   <details><summary>Answer</summary>`layout.tsx` wraps pages with shared parts (like the header or fonts). `page.tsx` is the content for one URL.</details>

### Day 2: components, props, Tailwind
1. **Explain props in one sentence to a friend.**
   <details><summary>Answer</summary>Inputs a parent passes down to a child component; the child reads them but doesn't change them.</details>
2. **Which way does data flow, and why does that help?**
   <details><summary>Answer</summary>Parent to child. You can always trace where a value came from.</details>
3. **What does `rounded-xl border border-slate-200 bg-white shadow-sm` produce?**
   <details><summary>Answer</summary>The "card" look: rounded corners, thin light border, white background, soft shadow.</details>
4. **What does a `key` do in a list?**
   <details><summary>Answer</summary>Lets React tell items apart when the list changes.</details>
5. **What is a preview deployment good for?**
   <details><summary>Answer</summary>Seeing a branch live (and on your phone) before it touches `develop` or production.</details>

### Day 3: grid, forms
1. **What does `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` do?**
   <details><summary>Answer</summary>1 column on phones, 2 from 640px, 4 from 1024px (mobile-first).</details>
2. **Why `<label htmlFor="...">`?**
   <details><summary>Answer</summary>Screen readers know what the field is, and tapping the label focuses the input.</details>
3. **Why are From and To dropdowns, not text boxes?**
   <details><summary>Answer</summary>Free text can't be matched to the fare table; a dropdown guarantees a valid place.</details>
4. **A form uses `method="get"` and the user submits. Where do the values go?**
   <details><summary>Answer</summary>Into the URL as `?name=value&name2=value2`, so the search can be bookmarked.</details>
5. **Flex or grid for a 4-field form? Why?**
   <details><summary>Answer</summary>Grid, because it arranges rows and columns together and the layout changes by screen width.</details>

### Day 4: JavaScript basics
1. **`const` vs `let`?**
   <details><summary>Answer</summary>`const` can't be reassigned, `let` can.</details>
2. **What does `formatPrice(1200)` return and why do we keep that logic in one function?**
   <details><summary>Answer</summary>`"₹1,200"`. One place to fix or change formatting for the whole site.</details>
3. **Array or object: how do you store one route's name, from, to and price?**
   <details><summary>Answer</summary>An object (named properties). A list of such objects is an array.</details>
4. **`"2" === 2`: true or false? And `"2" == 2`?**
   <details><summary>Answer</summary>`false` for `===` (type differs). `true` for `==` because of silent conversion, which is why we avoid `==`.</details>
5. **Why store money as a whole number?**
   <details><summary>Answer</summary>Exact arithmetic with no decimal rounding bugs; format it only when showing it.</details>

### Day 5: array tools and pure functions
1. **`[3, 1, 2].filter(n => n > 1)` returns what?**
   <details><summary>Answer</summary>`[3, 2]`.</details>
2. **`[3, 1, 2].map(n => n * 2)` returns what?**
   <details><summary>Answer</summary>`[6, 2, 4]`.</details>
3. **You call `list.sort()` and your original list changes. Why, and how do you avoid it?**
   <details><summary>Answer</summary>`sort` mutates the array. Copy first: `[...list].sort(...)`.</details>
4. **What makes a function pure?**
   <details><summary>Answer</summary>Same input gives the same output, and it changes nothing outside itself.</details>
5. **In `pickOptions`, why filter by seats before sorting by price?**
   <details><summary>Answer</summary>Fewer items to sort, and a cheap car that can't fit the group should never appear.</details>

## 3b. Flashcard bank: Week 2 (Days 6–9)
Same method: cover the answer, say yours aloud, then open it.

### Day 6: TypeScript basics
1. **What does `type VehicleType = "sedan" | "suv" | "tempo"` stop you from doing?**
   <details><summary>Answer</summary>Using any other value, such as `"bus"` or a typo like `"suvv"`. It is a compile error.</details>
2. **`cities.find(...)` returns what type, and how do you use the result safely?**
   <details><summary>Answer</summary>`string | undefined`. Check it (`if (x !== undefined)`), use `x?.something`, or give a fallback with `x ?? "default"`.</details>
3. **What do `?.` and `??` each do?**
   <details><summary>Answer</summary>`?.` stops and gives `undefined` if the left side is missing. `??` uses the right side when the left is `undefined` or `null`.</details>
4. **Are types checked while the site is running?**
   <details><summary>Answer</summary>No. They are erased. Data from outside (forms, URLs, APIs) must still be validated at runtime.</details>
5. **Why store a city as a slug (`"haridwar"`) and not its display name?**
   <details><summary>Answer</summary>A slug is a stable id. Renaming "Kedarnath (Sonprayag)" doesn't break saved searches or fare rows.</details>

### Day 7: components and typed props
1. **How do you make a prop optional with a default?**
   <details><summary>Answer</summary>`?` in the type and a default when destructuring: `{ variant = "primary" }`.</details>
2. **What is `children`?**
   <details><summary>Answer</summary>Whatever is written between a component's opening and closing tags.</details>
3. **What does `Record<ButtonVariant, string>` guarantee?**
   <details><summary>Answer</summary>An entry exists for every variant, so adding a variant and forgetting its style fails to compile.</details>
4. **When should you extract a component?**
   <details><summary>Answer</summary>When the same markup repeats, or one piece has a clear single job and the file is getting hard to read.</details>
5. **Why must a label's `htmlFor` match the input's `id`?**
   <details><summary>Answer</summary>So clicking the label focuses the input and screen readers know which label belongs to which field.</details>

### Day 8: state and events
1. **What does `useState(0)` give you?**
   <details><summary>Answer</summary>A pair: the current value and the only function that should change it.</details>
2. **`onClick={setCount(count + 1)}` is wrong. Why, and what is right?**
   <details><summary>Answer</summary>It calls the setter immediately while drawing. Pass a function: `onClick={() => setCount(count + 1)}`.</details>
3. **Two `setCount(count + 1)` in one click add how much? How do you fix it?**
   <details><summary>Answer</summary>Only 1, because both read the same old value. Use `setCount((current) => current + 1)`.</details>
4. **What does `"use client"` do?**
   <details><summary>Answer</summary>Makes the file (and what it imports) run in the browser, which state and click handlers need.</details>
5. **What is derived state and why is `carsThatFit` an example?**
   <details><summary>Answer</summary>A value calculated from existing state on every draw. Storing it separately would let it drift out of sync with `count`.</details>

### Day 9: controlled inputs and validation
1. **What makes an input "controlled"?**
   <details><summary>Answer</summary>Its `value` comes from React state and `onChange` reports every change back to that state.</details>
2. **What does "lifting state up" mean, and why did the stepper lose its `useState`?**
   <details><summary>Answer</summary>Shared state moves to the closest common parent. The form needs the passenger count to validate and search, so the form owns it and passes `value` and `onChange` down.</details>
3. **Why `change({ ...search, from })` and not `search.from = from`?**
   <details><summary>Answer</summary>React redraws when it sees a new value. Editing in place gives it nothing new, so the screen goes stale (and the linter flags it).</details>
4. **Why is `today` passed into `validateSearch` instead of read inside it?**
   <details><summary>Answer</summary>That keeps it a pure function: same input, same output, easy to test with any date.</details>
5. **If browser validation can be bypassed, why write it?**
   <details><summary>Answer</summary>It gives instant, friendly feedback. The server repeats the checks because the server is the real gate.</details>

## 4. Weekly review-day template (copy into `docs/week-XX-review.md`)
1. **Score:** quiz result and the cards I missed.
2. **Rebuild from memory:** what I rebuilt (no looking), how long it took, what I forgot.
3. **Teach-back:** explain this week's main flow in 5 sentences, aloud or in writing, as if to a friend who doesn't code.
4. **Draw it:** this week's data flow on paper, then compare with the diagram in the day file.
5. **Top 3 gaps and the plan to fix them** (which buffer day or which cards).

## 5. Teach-back prompts
### Week 1
- "How does the browser go from typing a URL to seeing the home page?"
- "How does the price get from `routes.ts` to the screen as `₹1,200`?"
- "What happens when I push a branch to GitHub?"

### Week 2 so far
- "What is the difference between props and state? Use the passenger stepper as the example."
- "Walk through what happens, step by step, from clicking Search with a past date to seeing the red message."
- "Why does the search form own the passenger count instead of the stepper?"

## 6. Rules for how this grows
- Every review day (5, 10, 15 ...) has a cumulative quiz of 10 questions that includes at least 3 from earlier weeks.
- Each week adds about 25 cards here, grouped by day, with answers.
- Cards you keep missing become part of the next review day's rebuild-from-memory task.
