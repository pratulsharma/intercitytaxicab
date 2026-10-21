# Day 13: Trip details - connect the next step without pretending to book (3h)

**Goal:** choose a sample vehicle, open `/trip-details`, and fill a local booking-request draft. No request is stored or sent yet.
**New today (max 2):** multi-step URL flow; form submission with `FormData`.
**Reused:** schemas, typed props, client state, server validation, `Link`.
**Branch:** `day-13`, from `develop`.
**Time:** recall 10 min; flow sketch 15; build 80; checks 25; PR and notes 20; design 10; optional DSA 20 = 180 min.

Prerequisite: [Day 12](./day-12.md). Run commands inside `shubh-yatra-cabs`.

## Recall (10 min)
1. Why is an empty list different from an error?
2. Why should an option card not fetch its own fare?
3. What information is unsafe to place in a URL?

<details><summary>Answers</summary>

1. Zero matches is a valid result. 2. Keep data/business rules separate from presentation.
3. Personal details, credentials and secrets.
</details>

## Picture: route state versus private form state

```text
/results?from=...&to=...&date=...&passengers=2
                       |
                       | select option.id
                       v
/trip-details?from=...&to=...&date=...&passengers=2&option=car
                       |
                       | server validates search + selected option
                       v
Trip summary + name / phone / pickup fields
                       |
                       | local submit only
                       v
"Draft checked. Nothing has been sent or saved."
```

Use your actual sample option ID, not necessarily `car` or the reference's `sedan`.

## Step 1: Branch and sketch (15 min)

```bash
git switch develop
git pull --ff-only
git switch -c day-13
```

Draw the screens above. Decide which values can be reconstructed from the URL and which must stay out of it. A real server-created booking reference arrives on Day 21, not today.

## Step 2: Give each card a real next action (15 min)

**What:** extend `OptionCard` with `href: string`.
**Why:** use navigation semantics for navigation; do not use a button with no handler.
**How:** add the import and update the props:

```tsx
import Link from "next/link";

type Props = { option: CarOption; href: string };
// Replace the old function signature:
export default function OptionCard({ option, href }: Props) {
  // Keep the existing article content.
}
```

Inside the existing article, after the demo warning, add:

```tsx
<Link href={href} className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white">
  Choose this vehicle
</Link>
```

In `results/page.tsx`, import `searchToQuery` alongside `readSearchQuery`. Change the mapping to a block that builds each URL:

```tsx
{options.map((option) => {
  const query = searchToQuery(input);
  query.set("option", option.id);
  return (
    <li key={option.id}>
      <OptionCard option={option} href={`/trip-details?${query.toString()}`} />
    </li>
  );
})}
```

Do not include a price in the URL. On the next page, look it up again from the sample source.

## Step 3: Create the trip-details route (30 min)

**What:** create `src/app/trip-details/page.tsx`.
**Why:** someone can open this URL directly, without visiting the results page.
**How:**

```tsx
// WHAT: Validate a selected sample vehicle and display the trip-details form.
// WHY: URLs can be edited and client-provided prices cannot be trusted.
// HOW: Re-read the options for the validated search and find the selected ID.
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import TripDetailsForm from "@/components/TripDetailsForm";
import { todayAsIsoDate } from "@/lib/dates";
import { getDemoOptions } from "@/lib/getDemoOptions";
import { describeSearch } from "@/lib/search";
import { readSearchQuery, searchToQuery, type SearchQuery } from "@/lib/searchQuery";
import { validateSearch } from "@/lib/validateSearch";

type Props = { searchParams: Promise<SearchQuery> };

async function TripDetails({ searchParams }: Props) {
  await connection();
  const query = await searchParams;
  const parsed = readSearchQuery(query);
  if (!parsed.success) {
    return <p role="alert">{parsed.message} <Link href="/">Edit search</Link></p>;
  }
  const input = parsed.data;
  const errors = validateSearch(input, todayAsIsoDate());
  if (Object.keys(errors).length > 0) {
    return (
      <section>
        <h1>Check your search</h1>
        <ul>{Object.entries(errors).map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}</ul>
        <Link href="/">Edit search</Link>
      </section>
    );
  }

  const options = await getDemoOptions(input);
  const selected = typeof query.option === "string"
    ? options.find((option) => option.id === query.option)
    : undefined;
  const backHref = `/results?${searchToQuery(input).toString()}`;
  if (!selected) {
    return (
      <p role="alert">
        Choose a vehicle that fits this search. <Link href={backHref}>Back to options</Link>
      </p>
    );
  }
  return (
    <section>
      <h1 className="text-2xl font-bold">Trip details</h1>
      <p>{describeSearch(input)}</p>
      <p>{selected.name} - sample fare INR {selected.priceInr}</p>
      <p className="my-4">Practice only: this does not reserve a vehicle.</p>
      <TripDetailsForm />
      <Link href={backHref} className="mt-6 inline-block underline">Back to options</Link>
    </section>
  );
}

export default function TripDetailsPage(props: Props) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Suspense fallback={<p role="status">Reading trip details...</p>}>
        <TripDetails {...props} />
      </Suspense>
    </main>
  );
}
```

This checks capacity again because `getDemoOptions` filters by passengers before the ID lookup. A made-up ID, duplicated `option` field, or too-small car must not produce a valid selection.

For unexpected errors, create `src/app/trip-details/error.tsx` using the Day 12 boundary pattern. Change the log label to `"Trip details page failed"` and the heading to `"We couldn't load trip details"`; keep retry, logging and the home link. Do not convert data-source failures into "invalid vehicle".

## Step 4: Build a local draft form (35 min)

**What:** create `src/components/TripDetailsForm.tsx`.
**Why:** learn submission separately from persistence and booking confirmation.
**How:**

```tsx
// WHAT: Check a local customer-details draft without sending or saving it.
// WHY: Practice form submission before introducing the booking API.
// HOW: Read FormData on submit, validate, and display explicit draft feedback.
"use client";

import { useState } from "react";
import { z } from "zod";

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number."),
  pickup: z.string().trim().min(10, "Enter a more complete pickup address.").max(500),
});

type Errors = { name?: string; phone?: string; pickup?: string };
const inputClass = "mt-1 block w-full rounded border border-slate-300 p-3";

export default function TripDetailsForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [checked, setChecked] = useState(false);

  return (
    <form
      noValidate
      onChange={() => setChecked(false)}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const result = detailsSchema.safeParse({
          name: data.get("name"), phone: data.get("phone"), pickup: data.get("pickup"),
        });
        const next: Errors = {};
        if (!result.success) {
          for (const issue of result.error.issues) {
            const field = issue.path[0];
            if (field === "name" || field === "phone" || field === "pickup") {
              next[field] ??= issue.message;
            }
          }
        }
        setErrors(next);
        setChecked(result.success);
      }}
      className="mt-6 space-y-4"
    >
      <div>
        <label htmlFor="customer-name">Name</label>
        <input id="customer-name" name="name" autoComplete="name" maxLength={100}
          className={inputClass} aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined} />
        {errors.name && <p id="name-error" className="text-red-700">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="customer-phone">Mobile number (India, 10 digits)</label>
        <input id="customer-phone" name="phone" type="tel" inputMode="tel"
          autoComplete="tel-national" maxLength={10}
          className={inputClass} aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined} />
        {errors.phone && <p id="phone-error" className="text-red-700">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="pickup-address">Pickup address</label>
        <textarea id="pickup-address" name="pickup" rows={3} maxLength={500}
          className={inputClass} aria-invalid={!!errors.pickup}
          aria-describedby={errors.pickup ? "pickup-error" : undefined} />
        {errors.pickup && <p id="pickup-error" className="text-red-700">{errors.pickup}</p>}
      </div>
      <button type="submit" className="rounded bg-slate-900 px-4 py-3 text-white">
        Check draft details
      </button>
      {checked && <p role="status">Draft checked. Nothing has been sent or saved.</p>}
    </form>
  );
}
```

These are **uncontrolled fields**: the browser holds their values, and we read them on submit. That is a valid choice when no other component needs live field values. React still owns the errors and draft-check feedback.

The phone rule is a clearly labeled prototype restriction, not proof that a phone exists or belongs to the traveler. International numbers, verification, consent and production address rules need separate requirements. Do not use `type="number"` for a phone number.

## Step 5: Verify (25 min)

```bash
npm run lint
npm run typecheck
npm run build
```

Browser checks:
1. Choose a car; route criteria and option ID reach `/trip-details`.
2. Refresh the details URL; the selection still loads.
3. Change the option ID to nonsense, duplicate it, or choose a car too small for the passengers: useful feedback.
4. Add `price=1` to the URL: the displayed sample fare does not change.
5. Submit blank details: field errors appear.
6. Use fictitious valid-format details: feedback says **nothing sent or saved**.
7. Edit a field: the old "Draft checked" feedback disappears.
8. Back to options preserves search criteria. Refreshing the details page may lose private draft fields; that is intentional today.
9. Inspect the URL and network: no private details in query strings, no booking POST, no local-storage writes.

## Break it / common errors
- Remove `event.preventDefault()`: the browser may submit the form's fields to the current URL. Restore it; do not send private data using a GET form.
- Forget an input's `name`: `FormData.get()` returns `null`.
- Look up the vehicle in the unfiltered list: a too-small car can be selected. Restore capacity-aware lookup.
- Never show "Booking confirmed" for this local exercise.

## Finish (20 min)
- [ ] Selection is revalidated on direct entry.
- [ ] Private fields stay out of URLs and persistent storage.
- [ ] Labels, error associations and keyboard submit work.
- [ ] No real booking is implied; validation commands pass.

```bash
git add src
git commit -m "Day 13: validated trip selection and local details draft"
git push -u origin day-13
```

PR into `develop`, wait for CI, merge. Write `docs/day-13.md`: URL versus local state, what survives refresh, and what a real booking endpoint must do.

## System design corner (10 min): Multi-step state
URLs suit public trip criteria. Browser memory suits temporary private drafts. Server storage suits authoritative booking records. Adding persistence later means addressing consent, retention, access control and stale drafts, not simply placing everything in local storage.

## DSA (optional, 20 min): Climbing Stairs
For `n` steps, with moves of 1 or 2, implement `climbStairs(n: number): number`.
- Use `ways(0) = 1`, `ways(1) = 1`; each next value is the previous two added.
- Expected: `n=2` -> 2; `n=3` -> 3; `n=5` -> 8.
- Use two running values: O(n) time, O(1) extra space. Limit this exercise to integers from 0 to 40.
- This is an algorithm analogy, not how you model a booking workflow.

## Interview Q&A
1. **Controlled versus uncontrolled?** React owns each value versus the browser holding it until read.
2. **Why revalidate selection?** URLs can be edited and data may change between steps.
3. **Why no client-provided fare?** Price authority belongs on the server.
4. **Behavioral:** Explain a deliberate prototype limitation and how the UI makes it clear.

Next: [Day 14](./day-14.md).
