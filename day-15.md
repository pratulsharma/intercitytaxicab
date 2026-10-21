# Day 15: Review day - tests in CI and a Vercel preview (3h)

**Goal:** require automated rule checks on pull requests and demonstrate the prototype through a non-production deployment.
**New today (max 2):** preview deployments; CI checks as merge gates.
**Reused:** Git branches, GitHub Actions, npm scripts, tests and browser checks.
**Branch:** `day-15`, from `develop`.
**Time:** recall 10 min; rebuild 20; CI 30; deploy 35; acceptance checks 25; checkpoint 20; notes and PR 15; design 10; optional DSA 15 = 180 min.

Prerequisite: [Day 14](./day-14.md). This is still a sample-data prototype. No real bookings, payments, availability or persistent customer records.

## Recall (10 min)
1. Why use `npm ci` in a pipeline?
2. What is the difference between tests and a build?
3. Why doesn't a passing local test guarantee the deployed app works?

<details><summary>Answers</summary>

1. Reproducible lockfile-based installation; mismatched manifests fail.
2. Tests check assertions; a build checks whether a deployable artifact can be produced.
3. Environment, routing, build configuration and runtime behavior may differ.
</details>

## Picture: checking is not deploying

```text
day-15 branch -> PR into develop -> GitHub Actions
                                     |
                         npm ci -> lint -> typecheck -> tests -> build
                                     |
                               required CI passes
                                     |
                              merge into develop

GitHub integration -> Vercel Preview deployment -> browser smoke test
main branch        -> Vercel Production deployment (only when deliberately released)
```

With the usual Git integration, Vercel and GitHub Actions run independently. A preview can be created before CI finishes; **a preview URL is not proof of passing CI**. A deployment pipeline that waits for tests before every deploy is a separate configuration, not something this lesson silently guarantees.

## Step 1: Branch and rebuild from memory (20 min)

```bash
git switch develop
git pull --ff-only
git switch -c day-15
```

Without looking, write a test for the exact-seat-capacity rule. Then compare it to Day 14 and remove the duplicate practice test.

Draw the flow: form -> URL -> server validation -> options -> selected vehicle -> local details draft. Explain which parts run in the browser and which on the server.

## Step 2: Add checks to the existing CI job (30 min)

**What:** edit `.github/workflows/ci.yml` in the app's GitHub repository root.
**Why:** tests that only run when you remember to run them cannot protect merges.
**How:** retain the current checkout/setup-node actions, Node 22 configuration, triggers and job name. Replace the existing run-step block with:

```yaml
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

Keep `pull_request` enabled for PRs into `develop` and `main`. The current workflow runs on all PR targets, which is fine. Preserve the existing push triggers for `develop` and `main`.

**Important repository-root check**

```bash
git rev-parse --show-toplevel
```

If it prints the app directory, `.github/workflows/ci.yml` belongs directly inside that directory and npm commands need no working-directory override.

If your GitHub repository instead contains the whole course, the workflow must live at the **course repository's** `.github/workflows/ci.yml`. Set:

```yaml
defaults:
  run:
    working-directory: shubh-yatra-cabs
```

at workflow level, and set `cache-dependency-path: shubh-yatra-cabs/package-lock.json` under setup-node's `with`. Do not use an absolute path from your Mac in the pipeline. A workflow nested inside a non-root app folder is not automatically discovered.

Do not change action versions solely for this lesson; verify that the versions already in your workflow resolve when the job runs.

### Prove the gate works

1. Push the branch and open the PR into `develop`.
2. Temporarily change one expected price to the wrong value and commit/push it.
3. Inspect GitHub Actions: the `npm test` step must fail and the job must be red.
4. Restore the correct assertion in a new commit and push again.
5. Confirm the latest PR commit is green. Do not merge the intentional failure.

Make the existing job (currently `check`; use the name shown by GitHub) required in the branch rulesets for `develop` and `main`. Require a PR, prevent force pushes/deletion, and avoid bypasses. For a solo project, zero reviewer approvals can still require a PR and passing checks.

Rule availability depends on your GitHub plan and repository visibility. If enforcement is unavailable, document that limitation; do not claim pushes are blocked merely because a workflow exists.

## Step 3: Deploy a preview on Vercel (35 min)

**What:** connect the GitHub repository to Vercel.
**Why:** test a real build and a URL outside your development machine.
**How:**

1. Sign in to Vercel and import the repository that actually contains the app.
2. Select Next.js as the framework if detection does not do it automatically.
3. Set **Root Directory** to the app directory: leave it at repository root for an app-only repo; use `shubh-yatra-cabs` for a course-root repo.
4. Use the app's standard `npm run build` command. Match Node 22 if supported by your selected platform settings.
5. Keep `main` as the production branch. Branches such as `day-15` and `develop` should produce **Preview**, not Production, deployments.
6. If the initial import offers only a production deployment, do not mistake that for the requested preview. Configure the Git integration, then push the feature branch/PR and open the deployment labeled **Preview**.
7. Open the resulting preview URL and run the checks below.

No database or secret environment variables are needed for this week's sample-only app. Never add Supabase service-role keys or other secrets to Git or `NEXT_PUBLIC_*` variables.

The course calls `develop` the dev environment. Today that means Vercel's Preview environment/branch deployment, not a separately isolated production-grade staging stack. Vercel may protect previews behind authentication; that is fine, but an owner testing it may need authorized access.

Hosting plans, commercial-use permissions and pricing can change. Check the current terms before using a plan for a real taxi business. Production hosting and real dev/prod database isolation come later.

## Step 4: Preview acceptance checks (25 min)

Use fictitious details only. Test on desktop and a phone:

| Journey | Expected |
|---|---|
| Open home page | Header, hero, form, routes and footer render |
| Blank search | Field errors, no navigation |
| Future valid search | Results URL contains the four public criteria |
| Refresh / share URL | Same criteria and sample options |
| Exact-capacity group | A vehicle with exactly enough seats is included |
| Malformed/duplicated URL field | Useful invalid-input feedback |
| Select a vehicle | Trip details and sample price match |
| Made-up / too-small option | Rejected, not accepted by default |
| Submit empty customer fields | Field errors |
| Submit valid-format fictitious details | "Nothing has been sent or saved" |
| Inspect URL | No customer name, phone or pickup address |
| Keyboard / narrow screen | Controls reachable; no horizontal overflow |

Loading/error/empty drills were performed locally on Day 12; do not ship intentional errors to a shared preview. Check browser console and deployment runtime logs for unexpected errors.

## Week 3 checkpoint (20 min)
1. What does a runtime schema do?
2. Why validate on both client and server?
3. What is the difference between invalid, empty and error?
4. Why isn't a sample fare live availability?
5. What does `FormData.get()` use to find a value?
6. Why keep private data out of the URL?
7. What rule does `getQuotedPrice` protect?
8. Why test exact capacity?
9. How is CI different from CD?
10. Does a preview deployment imply tests passed?

<details><summary>Answers</summary>

1. Checks real values at runtime. 2. Fast UX plus a trusted server boundary.
3. Bad input; successful zero matches; unexpected failed operation.
4. It is a placeholder, not an authoritative inventory check.
5. The field's `name` attribute. 6. URLs are shared and recorded.
7. A fitting group pays the fixed vehicle fare, not fare times passengers.
8. Catches `>` versus `>=`. 9. Automated checks versus delivery/deployment.
10. No; independent pipelines can run in parallel.
</details>

Update Week 3 and skill ratings in [the tracker](./learning-progress-and-interview-tracker.md). Add any question missed twice to [review cards](./review-and-recall.md).

## Break it / common errors
- CI cannot find `package.json`: fix repository-relative working directory.
- `npm ci` reports a lockfile mismatch: run `npm install` locally after a manifest change and commit the resulting lockfile; do not replace CI with `npm install`.
- Tests run forever: use `npm test` (`vitest run`), not the watch script.
- A required check never appears: confirm PR triggers, workflow root location and exact check name.
- Preview 404 on a direct details URL: inspect the route path and build/deployment logs, not only client navigation.
- A deployment succeeded while tests failed: this is possible with independent integrations; fix the failing PR before merging.

## Finish (15 min)
- [ ] Intentional test failure visibly failed CI; restored tests pass.
- [ ] Latest PR has lint, typecheck, tests and build passing.
- [ ] Merge rules require the correct check, or their plan limitation is documented.
- [ ] A non-production preview works on a direct URL and a phone.
- [ ] No real customer data, bookings, credentials or injected failures.
- [ ] Week 3 checkpoint and teach-back completed.

```bash
git add .github/workflows/ci.yml
git commit -m "Day 15: run unit tests and typecheck in CI"
git push -u origin day-15
```

For a course-root repository, stage the root workflow from that root instead. Avoid creating a duplicate nested workflow.

Merge the green PR into `develop`. Confirm its latest branch preview too. Write `docs/day-15.md`: preview URL, commit tested, checks performed, CI failure drill result, limitations, and one gap to revisit. Do not put secrets in your notes.

## System design corner (10 min): Preview versus production
Preview verifies a particular build in a non-production environment. Production serves real customers and needs controlled configuration, data, access, monitoring and rollback. Promoting a commit should be intentional, not "the preview looked okay once".

## DSA (optional, 15 min): Two Sum II
Implement `twoSumSorted(values: number[], target: number): [number, number] | null`, returning **zero-based indices** for this exercise.
- Put pointers at both ends; move left forward if the sum is small, otherwise move right backward.
- `[2, 7, 11, 15]`, target `9` -> `[0, 1]`.
- `[1, 2, 3]`, target `20` -> `null`; `[3, 3]`, target `6` -> `[0, 1]`.
- O(n) time, O(1) extra space. Inputs must be sorted; standard interview versions may ask for one-based indices.

## Interview Q&A
1. **Why run tests in CI?** Everyone's changes are checked in a reproducible environment.
2. **What makes a check a merge gate?** A branch rule requiring that exact status/check.
3. **Preview versus production?** A review environment versus the live customer environment.
4. **Behavioral:** Describe a deployment problem, the evidence you checked, and the fix.

## Next week
Day 16 begins SQL and Supabase. Keep the app explicitly in demo mode until real fares, server-side booking creation, staff access controls and the later launch checks exist. The remaining scope is in [the roadmap](./reference-and-roadmap.md).
