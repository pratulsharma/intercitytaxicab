# Day 12: Results cards, loading, empty and error states (3h)

**Goal:** make search results readable and make every outcome visible, not just the successful one.
**New today (max 2):** UI states; route loading/error boundaries.
**Reused:** props, array mapping, server pages, validation and Tailwind.
**Branch:** `day-12`, from `develop`.
**Time:** recall 10 min; state sketch 20; build 65; checks 30; PR and notes 25; design 10; optional DSA 20 = 180 min.

Prerequisite: [Day 11](./day-11.md). Commands run in `shubh-yatra-cabs`.

## Recall (10 min)
1. What does `safeParse` return on failure?
2. Why can't the results page trust a URL?
3. What does `key` do in a list?

<details><summary>Answers</summary>

1. A failure result with validation issues. 2. Anyone can edit it.
3. Helps React identify items across renders; use a stable unique ID.
</details>

## Picture: four outcomes, not one

```text
Request -> validate
             |
       invalid? -> "Check your search" (expected, actionable)
             |
          loading -> visible progress
             |
          success -> cars found -> cards
             |         |
             |         +-> zero cars -> empty message
             |
          unexpected failure -> error boundary + retry
```

An empty list is not a server error. Invalid input is not an exception. Unexpected failures must not be disguised as successful empty results.

## Step 1: Branch and practice (20 min)

```bash
git switch develop
git pull --ff-only
git switch -c day-12
```

On paper, draw the success, empty, loading and failure views. For each, answer: "What can the traveler do next?" Loading should announce progress; the other three should offer a next action.

## Step 2: Extract a card (25 min)

**What:** create `src/components/OptionCard.tsx`.
**Why:** the page chooses which options to show; the card only presents one.
**How:**

```tsx
// WHAT: Display one sample vehicle option.
// WHY: Keep presentation separate from search rules.
// HOW: Receive a typed option; do not calculate fares here.
import type { CarOption } from "@/lib/sampleOptions";

export default function OptionCard({ option }: { option: CarOption }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">{option.name}</h2>
      <p className="mt-2">{option.seats} passenger seats</p>
      <p className="mt-2 font-bold">INR {option.priceInr}</p>
      <p className="mt-2 text-sm text-slate-600">Sample fare, not a confirmed booking.</p>
    </article>
  );
}
```

Do not add a clickable-looking button that does nothing. Day 13 will add the real navigation link.

In `results/page.tsx`, import the card and replace the old list mapping:

```tsx
<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {options.map((option) => (
    <li key={option.id}>
      <OptionCard option={option} />
    </li>
  ))}
</ul>
```

Keep the outer search description, demo warning and Change search link.

## Step 3: Prepare a data boundary (15 min)

**What:** create `src/lib/getDemoOptions.ts`.
**Why:** later we can replace sample reads with database reads without putting database logic in the card.
**How:**

```ts
// WHAT: Return demo vehicles for a validated search.
// WHY: Keep the data source behind one small function.
// HOW: Use sample cars today; real route fares replace this in the database lessons.
import type { SearchInput } from "@/lib/search";
import { pickOptions, sampleOptions, type CarOption } from "@/lib/sampleOptions";

export async function getDemoOptions(input: SearchInput): Promise<CarOption[]> {
  return pickOptions(sampleOptions, input.passengers);
}
```

In the results page, replace the sample-options import with `getDemoOptions` and use:

```ts
const options = await getDemoOptions(input);
```

The async interface prepares for a network data source. It does not make these in-memory values slow or turn them into live fares. Keep validation before the call.

## Step 4: Loading and unexpected errors (25 min)

**What:** create `src/app/results/loading.tsx`.
**Why:** route navigation should not look frozen while server content is pending.
**How:**

```tsx
// WHAT: A route-level loading fallback.
// WHY: Tell the traveler the search is in progress.
// HOW: Next.js places this UI in a loading boundary for the route segment.
export default function Loading() {
  return <p role="status" className="p-6">Loading sample cab options...</p>;
}
```

Keep Day 10's inner `Suspense` too: it encloses the request-dependent work when Cache Components is enabled. Its fallback may be the message you actually see. Neither boundary guarantees a visible pause for an instant data source.

Create `src/app/results/error.tsx`:

```tsx
// WHAT: Recover from an unexpected results-page failure.
// WHY: A server failure must not look like "no cars".
// HOW: Log the error and offer a boundary retry or a return to search.
"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ResultsError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Results page failed", error);
  }, [error]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-bold">We couldn't load the results</h1>
      <p role="alert">Please try again. Your booking has not been created.</p>
      <button type="button" onClick={reset} className="mt-4 rounded border p-3">
        Try again
      </button>
      <Link href="/" className="ml-4 underline">Change search</Link>
    </section>
  );
}
```

`error.tsx` must be a Client Component. The boundary catches unexpected failures below it, not its own errors or errors in a parent layout. Production server errors are sanitized; do not show raw stack traces to customers. Console logging is a learning-stage diagnostic, not a replacement for production monitoring.

## Step 5: Exercise each state (30 min)

```bash
npm run lint
npm run typecheck
npm run build
npm run dev
```

| State | How to exercise it | Expected |
|---|---|---|
| Success | Valid future search for 2 passengers | Cards with stable IDs, capacity, sample price |
| Invalid | Edit URL to an unknown city | Validation feedback, not the error boundary |
| Empty | Temporarily return `[]` from `getDemoOptions` | Honest no-options message and Change search link |
| Failure | Temporarily throw `new Error("Demo failure")` inside `getDemoOptions` | Error UI, diagnostic log, retry control |
| Loading | In a separate temporary test, await a short timeout before returning | A loading fallback, then cards |

For the loading drill only, add `await new Promise((resolve) => setTimeout(resolve, 1500));` inside `getDemoOptions`. **Remove all injected delays, throws and empty returns afterward.** Do not ship test-only query flags or hide failures with `catch { return [] }`.

The dev error overlay may appear during the failure drill; dismiss it to inspect the boundary. For a production check, stop the dev server and use `npm run build && npm start`. After removing the intentional error, reload; a persistent failure is not fixed merely by clicking Retry.

With the reference's 12-seat sample vehicle, every allowed passenger count may fit something. Use the temporary empty source rather than treating invalid `passengers=13` as an empty search.

## Break it / common errors
- Remove `"use client"` from the error boundary: the hooks/event handler become invalid. Restore it.
- Remove list keys: inspect the console warning; restore stable keys.
- Show "No cars" for a thrown exception: explain why that hides an outage.
- Your own sample names and capacities may differ; test behavior, not exact card text.

## Finish (25 min)
- [ ] All four states and invalid input exercised.
- [ ] Fault injections removed.
- [ ] Keyboard navigation, headings and narrow-screen layout checked.
- [ ] Lint, typecheck and build pass after cleanup.

```bash
git add src
git commit -m "Day 12: option cards and explicit results states"
git push -u origin day-12
```

PR into `develop`, wait for CI, merge. Write `docs/day-12.md`: empty versus failure, how you tested loading, one screenshot or sketch.

## System design corner (10 min): Graceful degradation
Separate independent page sections so one failing source need not erase the whole page. But "graceful" does not mean inventing availability, prices or success. Preserve reliable content, clearly label unavailable functions, and record unexpected errors.

## DSA (optional, 20 min): Merge Sorted Array
Implement `mergeSorted(a: number[], b: number[]): number[]` using two pointers.
- `[1, 4, 7]` and `[2, 4, 8]` -> `[1, 2, 4, 4, 7, 8]`.
- Test an empty side, both empty, duplicates and unequal lengths.
- O(n + m) time and O(n + m) output space.
- Extension: solve the interview variant in place where the first array has spare slots; fill from the back so you do not overwrite unread values.

## Interview Q&A
1. **Empty versus error?** A successful request with zero matches versus a failed request.
2. **Why a data function?** Keeps fetching separate from presentation and makes replacing the source easier.
3. **Does Suspense handle every exception?** No; it handles waiting. An error boundary handles unexpected render failures.
4. **Behavioral:** Explain a failure drill and what it taught you.

Next: [Day 13](./day-13.md).
