# Day 14: Automatic tests with Vitest (3h)

**Goal:** write small automatic tests for the rules you built, so a mistake is caught in seconds without opening a browser.
**New today (max 2):** a test runner (Vitest); `expect(...)` checks.
**Reused:** pure functions, `validateSearch`, `readSearchFromUrl`, `pickOptions`.
**Branch:** `day-14`, from `develop`.
**Time:** recall 10 min; setup 20; tiny test 15; real tests 70; run and break 25; PR and notes 20; design 10; optional DSA 10 = 180 min.

**Prerequisite:** [Day 13](./day-13.md). Run commands inside `shubh-yatra-cabs`.

## Recall (10 min)
1. What is a pure function?
2. Why does `validateSearch` take `today` as an input instead of reading the clock?
3. Why is "exactly enough seats" an important case for `pickOptions`?

<details><summary>Answers</summary>

1. Same inputs always give the same output, and it changes nothing outside itself.
2. A fixed `today` makes the answer the same every day, so tests never break next year.
3. It tells `>=` apart from `>`. A 4-seat car must fit 4 passengers.
</details>

## Picture: a test has three parts

```text
Arrange : set up the input        { from: "haridwar", ..., passengers: 0 }
Act     : call the function       validateSearch(input, "2027-01-10")
Assert  : check the answer        the errors object has a "passengers" message
```

If the assert fails, the test goes red and tells you what it expected and what it got.

## Step 1: Branch and install (20 min)

**What:** add a test runner.
**Why:** tests you have to remember to run do not protect you. Day 15 will run them automatically on every pull request.
**How:**

```bash
git switch develop
git pull --ff-only
git switch -c day-14
npm install --save-dev vitest
```

In `package.json`, add these lines **inside** the existing `"scripts"` block (keep what is there):

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

Create `vitest.config.ts` in the app folder:

```ts
// WHAT: Settings for the test runner.
// WHY: Our code imports like "@/lib/...", so the runner must know what "@" means.
// HOW: Point "@" at the src folder and look for *.test.ts files there.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
```

`npm test` runs every test once and stops. `npm run test:watch` stays open and re-runs when you save.

## Step 2: One tiny test (15 min)

Create `src/lib/practice.test.ts`:

```ts
import { expect, test } from "vitest";

test("2 + 2 is 4", () => {
  expect(2 + 2).toBe(4);
});
```

Run `npm test`. You should see one passing test.

Now change `4` to `5` and run again. Read the failure message: it shows the value it **expected** and the one it **received**. Put `4` back.

Pieces:
- `test("name", () => { ... })` is one test. The name should say what the rule is.
- `expect(actual).toBe(expected)` checks that the two are the same.

Delete `practice.test.ts` once the real tests below pass.

## Step 3: Test `pickOptions` (15 min)

**What:** create `src/lib/sampleOptions.test.ts`.
**Why:** this tests the "seats are enough" rule.
**How:**

```ts
// WHAT: Check which cars fit a group.
// WHY: A wrong comparison (> instead of >=) would hide cars that really fit.
// HOW: Use two cars made up just for the test, so changing the demo list cannot break these.
import { expect, test } from "vitest";
import { pickOptions, type CarOption } from "@/lib/sampleOptions";

const sedan: CarOption = { id: "sedan", name: "Test sedan", vehicle: "sedan", seats: 4, priceInr: 2400 };
const suv: CarOption = { id: "suv", name: "Test SUV", vehicle: "suv", seats: 6, priceInr: 3100 };

test("a car with exactly enough seats is included", () => {
  const result = pickOptions([sedan, suv], 4);
  expect(result.map((car) => car.id)).toEqual(["sedan", "suv"]);
});

test("a car that is too small is left out", () => {
  expect(pickOptions([sedan, suv], 5)).toEqual([suv]);
});

test("nothing fits a very large group", () => {
  expect(pickOptions([sedan, suv], 7)).toEqual([]);
});

test("cheapest car comes first", () => {
  const result = pickOptions([suv, sedan], 2);
  expect(result[0].id).toBe("sedan");
});
```

- `toEqual` compares the **contents** of lists and objects. `toBe` is for simple values such as numbers and text.
- If you use different `vehicle` names in your own `VehicleType`, use ones your type allows.

Run `npm test`. If "exactly enough seats" fails, open `pickOptions` and change `>` to `>=`. **Fix the code, not the test.**

## Step 4: Test `validateSearch` (25 min)

Create `src/lib/validateSearch.test.ts`:

```ts
// WHAT: Check the search rules.
// WHY: These rules protect the form and the results page.
// HOW: Start from one good search, change one thing, and check the message.
import { expect, test } from "vitest";
import type { SearchInput } from "@/lib/search";
import { validateSearch } from "@/lib/validateSearch";

const today = "2027-01-10";   // a fixed day, so the tests give the same answer every day
const good: SearchInput = { from: "haridwar", to: "badrinath", date: "2027-01-20", passengers: 2 };

test("a good search has no errors", () => {
  expect(validateSearch(good, today)).toEqual({});
});

test("today is allowed", () => {
  expect(validateSearch({ ...good, date: today }, today)).toEqual({});
});

test("yesterday is not allowed", () => {
  const errors = validateSearch({ ...good, date: "2027-01-09" }, today);
  expect(errors.date).toBeDefined();
});

test("pick-up and drop must be different", () => {
  expect(validateSearch({ ...good, to: good.from }, today).to).toBeDefined();
});

test("1 and 30 passengers are allowed", () => {
  expect(validateSearch({ ...good, passengers: 1 }, today)).toEqual({});
  expect(validateSearch({ ...good, passengers: 30 }, today)).toEqual({});
});

test("0, 31, 2.5 and NaN passengers are not allowed", () => {
  expect(validateSearch({ ...good, passengers: 0 }, today).passengers).toBeDefined();
  expect(validateSearch({ ...good, passengers: 31 }, today).passengers).toBeDefined();
  expect(validateSearch({ ...good, passengers: 2.5 }, today).passengers).toBeDefined();
  expect(validateSearch({ ...good, passengers: NaN }, today).passengers).toBeDefined();
});

test("an empty search reports every field", () => {
  const empty: SearchInput = { from: "", to: "", date: "", passengers: 0 };
  expect(Object.keys(validateSearch(empty, today))).toEqual(["from", "to", "date", "passengers"]);
});
```

- `{ ...good, date: "2027-01-09" }` copies `good` and changes only the date. This is the same copy-and-change trick as in the form.
- `toBeDefined()` means "there is a message here". We do not copy the whole sentence into the test, so rewording a message does not break it.
- Tests at the **edges** (1 and 30, today, yesterday) catch the most mistakes.

## Step 5: Test reading the URL (15 min)

Create `src/lib/searchQuery.test.ts`:

```ts
// WHAT: Check that URL text becomes the right search object.
// WHY: A shared link must give back the same search.
// HOW: Try a normal URL, a round trip, and some odd ones.
import { expect, test } from "vitest";
import { readSearchFromUrl, searchToQuery } from "@/lib/searchQuery";

const search = { from: "haridwar", to: "badrinath", date: "2027-01-20", passengers: 4 };

test("reads a normal URL, turning passengers into a number", () => {
  const query = { from: "haridwar", to: "badrinath", date: "2027-01-20", passengers: "4" };
  expect(readSearchFromUrl(query)).toEqual(search);
});

test("a search survives a trip into the URL and back", () => {
  const query = Object.fromEntries(searchToQuery(search));
  expect(readSearchFromUrl(query)).toEqual(search);
});

test("a missing value becomes empty", () => {
  const result = readSearchFromUrl({ to: "badrinath", date: "2027-01-20", passengers: "4" });
  expect(result.from).toBe("");
});

test("a repeated value is treated as missing", () => {
  const result = readSearchFromUrl({ ...search, passengers: ["2", "4"] });
  expect(result.passengers).toBe(0);
});

test("passengers that are not a number become NaN", () => {
  const result = readSearchFromUrl({ ...search, passengers: "abc" });
  expect(Number.isNaN(result.passengers)).toBe(true);
});
```

`Object.fromEntries(searchToQuery(search))` turns URL text back into a plain object, like the results page receives.

## Step 6: Run, then break things on purpose (25 min)

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Now prove the tests are useful. For each change: run `npm test`, see a test fail, read the message, then **undo the change**.

| Change | Which test should fail |
|---|---|
| In `pickOptions`, use `>` instead of `>=` | "exactly enough seats" |
| In `validateSearch`, change `<` to `>` in the date check | "yesterday is not allowed" |
| In `validateSearch`, set `MAX_PASSENGERS` to 12 | "1 and 30 passengers are allowed" |
| In `readSearchFromUrl`, remove the `Number(...)` | "reads a normal URL" |

If a test does not fail, it is not protecting that rule. Make it stricter.

If a **real** bug shows up (for example the `>` one), fix the code. Never change a test just to make it green.

## Common errors
- `No test files found`: file names must end in `.test.ts` and live under `src`.
- `Failed to resolve import "@/lib/..."`: check the `alias` in `vitest.config.ts`.
- A test fails only on some days: something reads the real clock. Pass `today` in instead.
- `toBe` fails on two lists that look equal: use `toEqual` for lists and objects.
- A passing test suite does not prove the page looks right or that the site is deployed. It checks the rules only.

## Finish (20 min)
- [ ] All tests pass, and each deliberate break made one fail.
- [ ] `practice.test.ts` is deleted.
- [ ] Lint, typecheck and build pass.

```bash
git add src vitest.config.ts package.json package-lock.json
git commit -m "Day 14: unit tests for search rules"
git push -u origin day-14
```

PR into `develop`, wait for CI, merge. Write `docs/day-14.md`: arrange / act / assert in your own words, one edge case you tested, and one test you saw fail on purpose.

## System design corner (10 min): The test pyramid
Many small, fast tests for rules (like today). A few tests that check several parts together. Very few tests that click through the real site in a browser. The small ones are cheap and quick, so there should be lots of them. Today's tests do not draw React and do not replace trying the site yourself.

## DSA (optional, 10 min): Move Zeroes
Write `moveZeroes(values: number[]): void` that moves all zeros to the end and keeps the other numbers in order.
- `[0, 1, 0, 3, 12]` becomes `[1, 3, 12, 0, 0]`.
- Use one pointer to place the non-zero numbers, then fill the rest with zeros.
- O(n) time. This one **changes** the list it is given, unlike `pickOptions`.
- Write two tests for it.

## Interview Q&A
1. **What is a unit test?** A small automatic check of one function's behavior.
2. **Why test edge values like exactly 4 seats?** Off-by-one mistakes (`>` versus `>=`) live at the limits.
3. **Why use made-up cars in the tests?** Then changing the demo list cannot break the tests.
4. **Behavioral:** Tell me about a test that found a real bug.

Next: [Day 15](./day-15.md).
