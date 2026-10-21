# Day 14: Unit tests with Vitest - protect the rules (3h)

**Goal:** automatically test fixed-fare quoting, exact seat capacity, URL parsing and search validation without opening a browser.
**New today (max 2):** unit tests; assertions and boundary cases.
**Reused:** pure functions, schemas, TypeScript and fixed sample fares.
**Branch:** `day-14`, from `develop`.
**Time:** recall 10 min; setup 20; tiny test 15; rules and tests 65; verification 25; PR and notes 20; design 10; optional DSA 15 = 180 min.

Prerequisite: [Day 13](./day-13.md). Commands run inside `shubh-yatra-cabs`.

## Recall (10 min)
1. What is a pure function?
2. Why is an exact-capacity case important?
3. How do you keep date tests from failing next year?

<details><summary>Answers</summary>

1. Same inputs give the same output without outside changes.
2. It distinguishes `>=` from the incorrect `>`.
3. Pass a fixed "today" to the validator.
</details>

## Picture: arrange, act, assert

```text
Arrange: a four-seat car costing INR 2400
    |
Act: getQuotedPrice(car, 4)
    |
Assert: result is 2400, not an error and not 9600
```

The business model is a fixed **vehicle fare**, not a per-passenger fare. More passengers affect eligibility, not multiplication of the price.

## Step 1: Branch and install (20 min)

**What:** add a test runner.
**Why:** a failing rule should stop the pipeline before deployment.
**How:**

```bash
git switch develop
git pull --ff-only
git switch -c day-14
npm install --save-dev vitest
```

Use Node 22 locally to match the course CI. Add these scripts alongside existing scripts in `package.json`; preserve the existing scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

Create `vitest.config.ts`:

```ts
// WHAT: Run focused Node-based tests for library code.
// WHY: Pure rule tests do not require a browser or a DOM.
// HOW: Resolve the same @ alias as the app and include only library tests.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/lib/**/*.test.ts"],
  },
});
```

No DOM library, React test renderer or coverage plugin is needed for these tests.

## Step 2: Tiny practice (15 min)

Create `src/lib/practice.test.ts`:

```ts
import { expect, test } from "vitest";

test("adds two numbers", () => {
  expect(2 + 2).toBe(4);
});
```

Run `npm test -- src/lib/practice.test.ts`. Change the expected value to `5`, read the failure, then restore it. Delete this practice file after the real tests below pass.

## Step 3: Add a small pricing rule (20 min)

**What:** create `src/lib/pricing.ts`.
**Why:** make the fixed-vehicle-fare rule explicit and reject corrupt sample records.
**How:**

```ts
// WHAT: Quote a fixed whole-rupee vehicle fare for a fitting group.
// WHY: Capacity is checked separately from price; fare is not per passenger.
// HOW: Reject invalid records and inputs rather than inventing fallback prices.
import type { CarOption } from "@/lib/sampleOptions";

export function getQuotedPrice(option: CarOption, passengers: number): number {
  if (!Number.isSafeInteger(option.priceInr) || option.priceInr <= 0) {
    throw new RangeError("Vehicle fare must be a positive whole-rupee amount.");
  }
  if (!Number.isSafeInteger(option.seats) || option.seats < 1) {
    throw new RangeError("Vehicle capacity must be a positive whole number.");
  }
  if (!Number.isSafeInteger(passengers) || passengers < 1 || passengers > option.seats) {
    throw new RangeError("Passenger count must fit the selected vehicle.");
  }
  return option.priceInr;
}
```

In `trip-details/page.tsx`, import `getQuotedPrice`. After the `if (!selected)` branch, add:

```ts
const quotedPrice = getQuotedPrice(selected, input.passengers);
```

Display `quotedPrice` instead of `selected.priceInr` in the trip summary. The selection remains validated before quoting. Corrupt data is an unexpected error and reaches the error boundary; it should not appear as a free ride.

This helper enforces a rule; it does not replace the authoritative database lookup and recomputation needed when a real booking is submitted.

## Step 4: Write real tests (45 min)

Create `src/lib/pricing.test.ts`:

```ts
// WHAT: Protect the fixed-fare and eligibility rules.
// WHY: Boundary mistakes can show wrong prices or exclude fitting vehicles.
// HOW: Use explicit fixtures independent of the changing demo list.
import { describe, expect, test } from "vitest";
import { getQuotedPrice } from "@/lib/pricing";
import { pickOptions, type CarOption } from "@/lib/sampleOptions";

const sedan: CarOption = {
  id: "test-sedan", name: "Test sedan", vehicle: "sedan", seats: 4, priceInr: 2400,
};
const suv: CarOption = {
  id: "test-suv", name: "Test SUV", vehicle: "suv", seats: 6, priceInr: 3100,
};

describe("getQuotedPrice", () => {
  test("returns the whole vehicle fare, not fare times passengers", () => {
    expect(getQuotedPrice(sedan, 1)).toBe(2400);
    expect(getQuotedPrice(sedan, 4)).toBe(2400);
  });
  test.each([0, -1, 2.5, 5, NaN, Infinity])("rejects passenger count %s", (count) => {
    expect(() => getQuotedPrice(sedan, count)).toThrow(RangeError);
  });
  test.each([0, -100, 2400.5, NaN, Infinity])("rejects invalid fare %s", (fare) => {
    expect(() => getQuotedPrice({ ...sedan, priceInr: fare }, 2)).toThrow(RangeError);
  });
  test("rejects corrupt capacity", () => {
    expect(() => getQuotedPrice({ ...sedan, seats: 0 }, 1)).toThrow(RangeError);
  });
});

describe("pickOptions", () => {
  test("includes an exact-capacity car and sorts cheapest first", () => {
    expect(pickOptions([suv, sedan], 4).map((car) => car.id))
      .toEqual(["test-sedan", "test-suv"]);
  });
  test("excludes vehicles that are too small", () => {
    expect(pickOptions([sedan, suv], 5)).toEqual([suv]);
    expect(pickOptions([sedan, suv], 7)).toEqual([]);
  });
  test("does not reorder or edit its input", () => {
    const input = [suv, sedan];
    const before = structuredClone(input);
    pickOptions(input, 2);
    expect(input).toEqual(before);
  });
});
```

If your union uses different vehicle names, use supported literals in the fixtures. Do not weaken the type with a cast.

Create `src/lib/searchSchema.test.ts`:

```ts
// WHAT: Protect the shared runtime search rules.
// WHY: Browser checks alone do not protect the server.
// HOW: Keep today's date fixed and vary one field at a time.
import { expect, test } from "vitest";
import { parseSearch } from "@/lib/searchSchema";
import { validateSearch } from "@/lib/validateSearch";

const today = "2027-01-10";
const good = {
  from: "haridwar", to: "badrinath", date: "2027-01-20", passengers: 2,
};

test("accepts a valid search, today, and the maximum allowed group", () => {
  expect(parseSearch(good, today).success).toBe(true);
  expect(parseSearch({ ...good, date: today, passengers: 12 }, today).success).toBe(true);
});

test.each([
  { ...good, date: "2027-01-09" },
  { ...good, date: "2027-02-30" },
  { ...good, from: "not-a-city" },
  { ...good, to: good.from },
  { ...good, passengers: 0 },
  { ...good, passengers: 13 },
  { ...good, passengers: "2" },
])("rejects invalid search %#", (input) => {
  expect(parseSearch(input, today).success).toBe(false);
});

test("attaches the same-city error to the To field", () => {
  expect(validateSearch({ ...good, to: good.from }, today).to).toBeDefined();
  expect(validateSearch(good, today)).toEqual({});
});
```

Create `src/lib/searchQuery.test.ts`:

```ts
// WHAT: Protect URL parsing and serialization.
// WHY: Shared links must preserve values and reject ambiguous inputs.
// HOW: Test round trips, missing fields and malformed passenger values.
import { expect, test } from "vitest";
import { readSearchQuery, searchToQuery } from "@/lib/searchQuery";

const input = {
  from: "haridwar", to: "badrinath", date: "2027-01-20", passengers: 4,
};
const query = Object.fromEntries(searchToQuery(input));

test("round-trips a search", () => {
  expect(readSearchQuery(query)).toEqual({ success: true, data: input });
});
test("rejects missing and repeated values", () => {
  expect(readSearchQuery({ ...query, from: undefined }).success).toBe(false);
  expect(readSearchQuery({ ...query, passengers: ["2", "4"] }).success).toBe(false);
});
test.each(["", "2.5", "-1", "2people", "9007199254740992"])(
  "rejects malformed passenger text %s",
  (passengers) => {
    expect(readSearchQuery({ ...query, passengers }).success).toBe(false);
  },
);
```

## Step 5: Verify and investigate failures (25 min)

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

For fast iteration use `npm test -- src/lib/pricing.test.ts`. `npm run test:watch` stays open and reruns changed tests; `npm test` runs once and exits, suitable for CI.

If the exact-capacity test fails, inspect `pickOptions`: the rule must be `seats >= passengers`. Fix the rule, not the expected result. Do not update an assertion just to make a real bug green.

Revisit the trip-details page once in the browser: the selected price should be unchanged. Remove the practice test.

## Break it / common errors
- Multiply fare by passengers: the first pricing test fails. Restore the fixed fare.
- Remove the past-date check: a schema test fails. Restore it.
- `No test files found`: check filenames end in `.test.ts` under `src/lib`.
- Alias resolution failure: keep the `@` alias in `vitest.config.ts`.
- A passing unit suite does not prove keyboard navigation, deployment or database behavior.

## Finish (20 min)
- [ ] Tests catch the deliberate rule changes.
- [ ] Exact-capacity and non-mutation tests pass with your implementation.
- [ ] Practice test removed; lint, typecheck and build pass.

```bash
git add src vitest.config.ts package.json package-lock.json
git commit -m "Day 14: unit tests for quotes search rules and URL parsing"
git push -u origin day-14
```

PR into `develop`, wait for existing CI, merge. Day 15 adds the test command to CI. Write `docs/day-14.md`: arrange/act/assert, one boundary case, one real failure and its fix.

## System design corner (10 min): The test pyramid
Many fast unit tests cover rules; fewer integration tests cover connections between parts; a small set of end-to-end tests covers real user journeys. Today's Node tests do not render React and do not replace browser checks.

## DSA (optional, 15 min): Move Zeroes
Implement `moveZeroes(values: number[]): void`, preserving nonzero order.
- `[0, 1, 0, 3, 12]` -> `[1, 3, 12, 0, 0]`.
- Write nonzeros with one pointer, then fill the remaining positions with zero.
- O(n) time, O(1) extra space; **this task intentionally mutates its input**, unlike `pickOptions`.

## Interview Q&A
1. **What is a unit test?** A focused automated check of a small behavior in isolation.
2. **Why boundary values?** Off-by-one bugs often live at exact limits.
3. **Why independent fixtures?** Changing demo data should not rewrite the business contract.
4. **Behavioral:** Explain a test that revealed a bug rather than merely confirming your code.

Next: [Day 15](./day-15.md).
