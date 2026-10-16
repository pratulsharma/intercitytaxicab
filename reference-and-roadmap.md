# Reference comparison and realistic, learning-first roadmap

**Source:** `intercitycab-main.zip` (you said it was an early idea, not the final implementation). It contains **docs only, no code**: architecture, flow diagrams, wireframes, frontend prompts, an infra plan. Files it mentions but does not include: the product spec, backend prompts B00–B18, the intern 30-day plan and the task board.

## 1. What the reference describes (summary)
- A multi-tenant intercity taxi platform; Shubh Yatra Travels is the first operator.
- Customer flow (8 screens): search → results (Sedan/SUV/Tempo, fare, ETA) → trip details → OTP login → payment → confirmed → track ride → history.
- Admin flow (5 screens): login → dashboard → booking management (confirm / assign driver / cancel) → drivers → revenue.
- Driver app (4 screens) and notifications by WhatsApp, SMS, email and push.
- Stack: Turborepo monorepo, Next.js 16, separate Node/NestJS API, Prisma, Postgres, Redis, Razorpay, Google Maps, Expo mobile, Docker, AWS.
- Its own plan: 30 working days **with a mentor 1 h/day and a team**.

## 2. Honest assessment
All of that is a **team project of several months**. You are one complete beginner at 3 h/day: 40 days ≈ 120 hours, and a large share goes to learning the basics. Building everything in 40 days would give you an unfinished, unsafe app and little real understanding. So the plan is phased: **Phase 1 ends with something real that Shubh Yatra can use**, and later phases add the rest of the reference.

## 3. How the course is designed for learning (not just for finishing)
| Technique | How it shows up |
|---|---|
| **Max 2 new concepts per day** | Day files list "New today" (≤ 2) and "Reused from before" so nothing arrives all at once |
| **Learn → See → Do → Recall** in every day | 10 min recall quiz of yesterday, 30–40 min concept with a tiny isolated example, 90 min building the project, 20 min write-up and Q&A |
| **Tiny practice before the real feature** | Each new idea is first tried in a 10-line sandbox file, then used in the project |
| **Same words, same order** | Every file starts with WHAT / WHY / HOW comments; every step has What / Why / How |
| **Spaced review** | Every 5th day is a review day: redo one earlier task from memory without looking |
| **Weekly checkpoint** | End of each week: a demo to yourself, a 10-question quiz and a "teach it back" note |
| **Break things on purpose** | Each day has a "break it" exercise (delete a class, change a type, use a wrong key) to learn from the error message |
| **Visible progress** | The app works end to end early (with sample data on Day 10) and gets more real each week |
| **Errors get their own lesson** | A short "common errors and what they mean" box in each day |
| **No mentor? I am the mentor** | Self-check lists replace code review; reference solutions are tagged per day |

## 4. Keep / Simplify / Defer
| Reference item | Decision | Why |
|---|---|---|
| Search → results → trip details → confirmed screens | **Keep** (Phase 1); history in Phase 2 | Core of what you want |
| Cab options (Sedan / SUV / Tempo) with fare and seats | **Keep** | Matches your request |
| Versioned API `/api/v1/*`, no business logic in UI components, loading and error states | **Keep** | Teaches a real frontend/backend boundary; lets a mobile app reuse the API later |
| Standard error format (`code`, `message`, `errors`) | **Keep** | Easy to teach and good interview material |
| Booking statuses pending → confirmed → cancelled | **Keep** | A simple state machine is a great learning example |
| Admin: bookings list, confirm, cancel | **Keep** (Phase 1) | Staff need it on launch day |
| Admin: fares and vehicles management | **Add** | Needed for the fixed fare table |
| Separate NestJS backend, Turborepo monorepo, shared packages | **Simplify**: one Next.js app whose route handlers are the backend (`/api/v1/...`), Supabase Postgres, one repo | One language, one repo, one deploy; you still learn HTTP, JSON, REST and databases |
| Prisma ORM | **Simplify**: plain SQL and the Supabase client | Learn real SQL first; can add Prisma later |
| Multi-tenant (`fleet_id` everywhere) | **Defer** (Phase 4) | One operator for now; it adds security complexity |
| OTP login at checkout | **Defer** (Phase 2); Phase 1 collects name and phone | SMS in India usually needs DLT registration |
| Online payments (Razorpay) | **Defer** (Phase 3) | Business KYC, webhooks, refunds |
| Driver mobile app, driver assignment | **Defer** (Phase 4); admin assigns drivers in Phase 2 | Separate platform |
| Real-time tracking, Redis, dispatch algorithm | **Defer** | Admin status updates cover the need first |
| Google Maps ETA and per-km pricing | **Defer**: store `distance_km` and `duration_min` per route | Cheaper, predictable |
| WhatsApp / SMS / push | **Simplify**: email plus WhatsApp click-to-chat links; real WhatsApp API later | No approvals needed |

## 5. Data model (Phase 1, aligned with the reference)
- `locations` (id, name, slug)
- `vehicle_types` (id, name, seats, notes)
- `fares` (id, from, to, vehicle_type, price_inr, distance_km, duration_min, active)
- `bookings` (id, reference like `IC-20261015-4821`, from, to, travel_date, passengers, vehicle_type, quoted_price_inr, customer_name, phone, pickup_address, notes, status, created_at)
- `featured_routes` (id, from, to, sort_order, active): which popular cards the home page shows; the card price is the cheapest active fare
- `season_rules` (start_date, end_date, multiplier), later in Phase 1
- Staff come from Supabase Auth with a staff role.

## 6. Realistic roadmap
| Phase | Days (3 h each) | Outcome | Calendar* |
|---|---|---|---|
| **1. Launchable core** | 1–40 | Search → priced options → booking request → staff admin → email and WhatsApp links → dev and prod → live | ~8 weeks; plan for 10 |
| 2. Accounts and tracking | 41–65 | OTP login, history, status page, drivers table, assign driver, cancellations | ~5 weeks |
| 3. Payments | 66–85 | Razorpay order, verify, webhook, refunds, revenue screen | ~4 weeks |
| 4. Driver app and scale | 86–120+ | Driver app, real-time updates, multi-tenant if a second operator joins | ~7+ weeks |

*Assumes 3 focused hours, 5 days a week. **The full reference vision is about 4–5 months; Phase 1 alone is about 2 months.** Some days will run over, so the plan has buffer days.

## 7. Phase 1: draft day outline (40 days)
"New" = the at-most-2 new ideas of that day.

| Week | Day | Topic | New today |
|---|---|---|---|
| **1 Foundations** | 1 | Tools, Git, first CI *(written)* | Git, CI |
| | 2 | HTML and CSS, landing page *(written)* | components, Tailwind |
| | 3 | Search form layout *(written)* | grid, form fields |
| | 4 | JavaScript basics *(written)* | functions, arrays and objects |
| | 5 | **Review day**; array tools, `pickOptions`, Week 1 checkpoint *(written)* | filter / map / sort, pure functions |
| **2 React and Next** | 6 | TypeScript basics | types, interfaces |
| | 7 | React components and props | props |
| | 8 | State and events | `useState` |
| | 9 | SearchForm (From, To, date, passengers) | controlled inputs |
| | 10 | **Review day**; Next.js routing and `searchParams` → `/results` with sample data | routing, URL params |
| **3 Results and booking UI** | 11 | Validation with Zod | schemas |
| | 12 | Results page: OptionCard, loading, empty, error states | UI states |
| | 13 | Trip details page | forms, multi-step flow |
| | 14 | Testing basics (Vitest) on a pure pricing function | unit tests |
| | 15 | **Review day**; tests in CI; dev deploy on Vercel | preview deploys |
| **4 Database and API** | 16 | SQL and Postgres basics (Supabase) | tables, SELECT |
| | 17 | Schema, seed data, migrations | migrations, joins |
| | 18 | Read data from the server, replace sample data (incl. home-page popular cards) | server components |
| | 19 | `/api/v1/search` and `getOptions` | HTTP, route handlers |
| | 20 | **Review day**; dev and prod Supabase projects, env vars | environments, secrets |
| **5 Booking and staff login** | 21 | Create booking (server recalculates price), reference ID | POST, server-side trust |
| | 22 | Confirmation page | dynamic routes |
| | 23 | Auth concepts, staff login | sessions, cookies |
| | 24 | Protecting admin routes, database rules (RLS) | authorization |
| | 25 | **Review day**; admin bookings list and filters | filtering |
| **6 Admin and notifications** | 26 | Confirm and cancel (status transitions) | state machine |
| | 27 | Admin: manage fares, vehicles and featured routes | CRUD |
| | 28 | Email on new request and on confirmation | third-party APIs |
| | 29 | WhatsApp click-to-chat links; peak-season rule | URL encoding, date logic |
| | 30 | **Review and refactor day** | refactoring |
| **7 Hardening** | 31 | Security: validation, RLS review, rate limiting, secrets | threat thinking |
| | 32 | Error handling, logging, 404 and 500 pages | observability |
| | 33 | Accessibility, SEO, performance | Lighthouse |
| | 34 | End-to-end test (Playwright), happy path | E2E tests |
| | 35 | **Buffer day** for anything that slipped | none |
| **8 Launch** | 36 | CI/CD: environments, migrations in the pipeline, branch protection | release process |
| | 37 | Production setup, domain, hosting terms and cost check | DNS, domains |
| | 38 | Monitoring (Sentry), backups, uptime check | alerts, backups |
| | 39 | Launch checklist and acceptance test with the owner | UAT |
| | 40 | Go live, rollback drill, retrospective, interview prep | rollback |

This is a draft. I'll refine it as I write each lesson.
