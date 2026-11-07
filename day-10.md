# Day 10: Review day - routing, URLs and your first results page (3h)

**Goal:** submit the search form, open `/results`, and show sample cars that fit the passenger count. Refreshing or sharing the URL must keep the search.
**New today (max 2):** routing; URL query parameters.
**Reused:** controlled inputs, `SearchInput`, `validateSearch`, `pickOptions`, typed props.
**Branch:** `day-10`, from `develop`.
**Time:** recall 10 min; URL practice 20; build 65; browser checks 20; checkpoint 20; PR and notes 20; system design 10; optional DSA 15 = 180 min.

> These lessons extend the reference code in Days 6-9. Your current app may not have all those changes yet. Finish those prerequisites first; do not replace your custom styling unnecessarily.
>
> Commands below run inside `shubh-yatra-cabs`. Code examples are teaching material, not changes already applied to your app. Prices and vehicle data remain placeholders through Day 15; this is not a live booking system.

## Recall (10 min)
1. Who owns the passenger count after Day 9?
2. Why does a controlled input need `onChange`?
3. Why must the server validate even if the browser already did?

<details><summary>Answers</summary>

1. `SearchForm`, the closest common parent.
2. Its displayed value comes from state, which must be updated.
3. Anyone can edit a URL or bypass your form.
</details>

Take three older cards from [review-and-recall.md](./review-and-recall.md).

## Picture: the URL becomes the search's memory

```text
SearchForm state
  from: haridwar   to: badrinath   date: future date   passengers: 4
        |
        | URLSearchParams encodes these values
        v
/results?from=haridwar&to=badrinath&date=2027-01-20&passengers=4
        |
        | Next.js matches src/app/results/page.tsx
        v
Read strings -> reject malformed input -> validate -> pickOptions -> HTML
```

Use a future date relative to the day you do the exercise, not necessarily the example date.

## Step 1: Branch and check prerequisites (10 min)

**What:** start from the completed Day 9 app.
**Why:** navigation should replace a working submit handler, not hide broken validation.
**How:**

```bash
git switch develop
git pull --ff-only
git switch -c day-10
```

Confirm you have `src/lib/dates.ts`, `src/lib/validateSearch.ts`, and the Day 9 controlled `SearchForm`. Day 6 added `"typecheck": "tsc --noEmit"` to the package scripts; add that script if you skipped it.

## Step 2: Tiny practice - query strings (20 min)

**What:** convert values to URL text.
**Why:** manually joining text can break when values contain spaces or `&`.
**How:** try this in the browser console:

```js
const query = new URLSearchParams({
  from: "haridwar",
  to: "badrinath",
  date: "2027-01-20",
  passengers: String(4),
});
console.log(query.toString());
console.log(query.get("passengers")); // "4", not the number 4
```

`/results` is the path. Everything after `?` is the query string. `&` separates fields. Query strings are visible in browser history, logs and shared links: do not put names, phone numbers, passwords or secrets there.

## Step 3: Give URL parsing one home

**What:** create `src/lib/searchQuery.ts`.
**Why:** the results page and tomorrow's trip-details page must interpret URLs consistently. Missing or repeated fields should not silently become defaults.
**How:**

```ts
// WHAT: Convert URL fields into a search and serialize a search back into a URL.
// WHY: URLs are untrusted strings, not automatically valid TypeScript values.
// HOW: Reject missing/repeated fields and parse the passenger count explicitly.
import type { SearchInput } from "@/lib/search";

export type SearchQuery = Record<string, string | string[] | undefined>;
type ReadResult =
  | { success: true; data: SearchInput }
  | { success: false; message: string };

export function readSearchQuery(query: SearchQuery): ReadResult {
  const { from, to, date, passengers } = query;
  if (
    typeof from !== "string" ||
    typeof to !== "string" ||
    typeof date !== "string" ||
    typeof passengers !== "string"
  ) {
    return { success: false, message: "Provide each search field exactly once." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d+$/.test(passengers)) {
    return { success: false, message: "Use a date and a whole passenger count." };
  }
  const count = Number(passengers);
  if (!Number.isSafeInteger(count)) {
    return { success: false, message: "The passenger count is too large." };
  }
  return { success: true, data: { from, to, date, passengers: count } };
}

export function searchToQuery(input: SearchInput): URLSearchParams {
  return new URLSearchParams({
    from: input.from,
    to: input.to,
    date: input.date,
    passengers: String(input.passengers),
  });
}
```

Parsing answers "is it the right basic shape?" Validation answers "does it obey our rules?" Tomorrow, Zod strengthens the date and city checks.

## Step 4: Navigate after a valid submit

**What:** change only the relevant parts of `SearchForm`.
**Why:** retain Day 9's field errors and Clear behavior.
**How:** add these imports and call the hook inside the component:

```tsx
import { useRouter } from "next/navigation";
import { searchToQuery } from "@/lib/searchQuery";

// Inside SearchForm, alongside the existing hooks:
const router = useRouter();
```

In the existing submit handler, keep `preventDefault`, `today`, `validationErrors`, `setErrors` and `hasErrors`. Replace the final `if (hasErrors) ... else ...` block with:

```tsx
if (!hasErrors) {
  router.push(`/results?${searchToQuery(search).toString()}`);
}
```

Remove the now-unused `submitted` state, every `setSubmitted` call, the green summary JSX, and the `describeSearch` import if nothing else uses it. Keep all the input state, `updateSearch`, Clear and validation logic.

## Step 5: Create the results route (65 min total for Steps 3-5)

**What:** create `src/app/results/page.tsx`.
**Why:** a folder plus `page.tsx` creates a route in the Next.js App Router.
**How:**

```tsx
// WHAT: Render validated search criteria and sample vehicle options.
// WHY: The URL should survive refresh and be shareable.
// HOW: Read request data inside Suspense, validate, then filter sample cars.
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { todayAsIsoDate } from "@/lib/dates";
import { findCity } from "@/lib/locations";
import { describeSearch } from "@/lib/search";
import { readSearchQuery, type SearchQuery } from "@/lib/searchQuery";
import { pickOptions, sampleOptions } from "@/lib/sampleOptions";
import { validateSearch } from "@/lib/validateSearch";

type Props = { searchParams: Promise<SearchQuery> };

async function Results({ searchParams }: Props) {
  await connection();
  const parsed = readSearchQuery(await searchParams);
  if (!parsed.success) {
    return <p role="alert">{parsed.message} <Link href="/">Edit search</Link></p>;
  }
  const input = parsed.data;
  const errors = validateSearch(input, todayAsIsoDate());
  if (!findCity(input.from)) errors.from = "Choose a supported starting city.";
  if (!findCity(input.to)) errors.to = "Choose a supported destination.";

  if (Object.keys(errors).length > 0) {
    return (
      <section>
        <h1 className="text-2xl font-bold">Check your search</h1>
        <ul>{Object.entries(errors).map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}</ul>
        <Link href="/">Edit search</Link>
      </section>
    );
  }

  const options = pickOptions(sampleOptions, input.passengers);
  return (
    <section>
      <h1 className="text-2xl font-bold">Sample cab options</h1>
      <p>{describeSearch(input)}</p>
      <p className="my-4">Demo data only. Prices are not route-specific quotes.</p>
      {options.length === 0 ? <p>No sample vehicles fit this group.</p> : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {options.map((option) => (
            <li key={option.id} className="rounded-xl border p-5">
              <h2>{option.name}</h2>
              <p>{option.seats} seats - INR {option.priceInr}</p>
            </li>
          ))}
        </ul>
      )}
      <Link href="/">Change search</Link>
    </section>
  );
}

export default function ResultsPage(props: Props) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Suspense fallback={<p role="status">Reading your search...</p>}>
        <Results {...props} />
      </Suspense>
    </main>
  );
}
```

**Read the unfamiliar lines**
- `searchParams` is a promise in this project's Next.js version: `await` it before reading fields.
- `Suspense` lets request-dependent content have a loading fallback. Keep the request read inside its child; the app has Cache Components enabled.
- `connection()` explicitly waits for a request before reading the current clock. We are not caching today's date as static HTML.
- On the server, `todayAsIsoDate()` uses the server's timezone. For this prototype accept that limitation; the real booking rules must consistently use the operator's timezone (India), not whichever timezone the server happens to use.
- No `"use client"` is needed for this page. The form needs browser interaction; the page can prepare HTML on the server.

**Check your existing helpers:** `describeSearch` must look up `input.to` for the destination, not `input.from` twice. `pickOptions` must use `option.seats >= passengers`, not `>`. A car with exactly four seats fits four passengers. Keep your own sample IDs and capacities; do not assume they match the reference's Sedan/SUV/Tempo data.

## Step 6: Browser acceptance checks (20 min)

```bash
npm run lint
npm run typecheck
npm run build
npm run dev
```

1. Submit a future-dated search; the address changes to `/results?...`.
2. Refresh: the same search appears.
3. Paste the URL in a new tab: same criteria and cars.
4. Change passengers to exactly one vehicle's capacity: that car still appears.
5. Edit the URL to `passengers=2.5`, `passengers=`, or a duplicated `passengers`: clear invalid-search feedback.
6. Try unknown cities, identical cities, a past date and missing fields: no results.
7. Browser Back returns to the home page; do not assume client form values survive every full reload.

## Week 2 checkpoint (20 min, no notes first)
1. What is a union type?
2. What does `find()` return when there is no match?
3. What are props?
4. What makes an input controlled?
5. Why lift state?
6. Why use a functional setter when depending on previous state?
7. What route does `app/results/page.tsx` create?
8. Is `passengers=4` a string or a number initially?
9. Why validate a shared URL?
10. What does `"use client"` mark?

<details><summary>Answers</summary>

1. One of several allowed types or values. 2. `undefined`. 3. Parent-to-child inputs.
4. State supplies `value`, a handler updates it. 5. Share one source of truth.
6. It receives the pending value rather than relying on a stale closure.
7. `/results`. 8. String. 9. It can be edited. 10. A client-module boundary.
</details>

Rebuild `searchToQuery` from memory. Score the quiz in [the tracker](./learning-progress-and-interview-tracker.md).

## Break it and common errors
- Remove `String(input.passengers)` in serialization: TypeScript rejects a numeric query value. Restore it.
- Remove `await searchParams`: observe the diagnostic, then restore it.
- Use `>` instead of `>=`: an exact-capacity car disappears. Restore it.
- A blank page is not valid empty-state handling: ensure invalid inputs and empty arrays produce visible messages.

## Finish (20 min)
- [ ] Refresh/share works; malformed URLs show useful feedback.
- [ ] All three validation commands pass.
- [ ] Week 2 quiz and rebuild completed.

```bash
git add src
git commit -m "Day 10: URL-based search and sample results"
git push -u origin day-10
```

Open a PR into `develop`, wait for CI, merge. Write your own `docs/day-10.md`: what you built, what the URL stores, one bug, and your checkpoint score.

## System design corner (10 min)
**URL as state; stateless HTTP.** A server can reconstruct a search from each request without remembering the previous click. Stateless does not mean the entire application has no database or sessions. Static assets may be CDN-cached; this request-dependent page is not automatically a public cached response.

## DSA (optional, 15 min): Binary Search
In `sandbox/dsa/day-10.ts`, write `binarySearch(values: number[], target: number): number`. Return the index or `-1`.
- Maintain `left` and `right`; inspect the middle; discard one half each iteration.
- Check `[]`, `[4]`, `[1, 3, 5, 7]` with targets `1`, `7`, `4`.
- Expected indices: `-1`, `0` for target 4 in `[4]`, then `0`, `3`, `-1`.
- Time O(log n), extra space O(1). **The list must already be sorted.**

## Interview Q&A
1. **Why keep search in the URL?** Refresh, sharing and browser navigation.
2. **Parsing versus validation?** Converting external representations versus checking allowed values and business rules.
3. **Why not store a fare in the URL?** A customer can change it; the server must determine the fare.
4. **Behavioral:** Explain one bug you caught by editing a URL manually.

Next: [Day 11](./day-11.md).
