# CSS Primer (running guide): grows every day until you say "stop"

**Use with:** [css-lab.html](./css-lab.html). Open it in a browser, edit a class, save, refresh. Reading is 30%; changing classes and seeing what breaks is the other 70%.

**What Tailwind is:** normal CSS looks like `padding: 1.5rem;`. Tailwind gives that a short class name, `p-6`, so you write it directly in the HTML/JSX: `<div className="p-6">`. Same CSS underneath.

---

## Rule 1: Everything is a box
Every element (paragraph, button, card) is a rectangle made of four layers:

```
┌──────────────────────── margin (space OUTSIDE) ────────────────────────┐
│  ┌──────────────────────── border (the line) ───────────────────────┐  │
│  │  ┌────────────────────── padding (space INSIDE) ───────────────┐ │  │
│  │  │                                                             │ │  │
│  │  │                      content (your text)                    │ │  │
│  │  │                                                             │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```
| Layer | Tailwind | Example |
|---|---|---|
| margin | `m-4`, `mt-4` (top), `mb-4` (bottom), `mx-auto` (left+right) | space between this box and its neighbours |
| border | `border`, `border-4`, `border-slate-200` | `border border-slate-200` = thin light grey line |
| padding | `p-6`, `px-6` (left+right), `py-3` (top+bottom) | breathing room inside a card or button |

**Why we use it:** cards and buttons look cramped without padding, and sections run into each other without margin.

## Rule 2: The spacing scale
**1 unit = 4px (0.25rem).** So `p-1`=4px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `p-16`=64px, `p-20`=80px.
**Why:** a fixed scale keeps the design consistent, so you never pick random numbers like 17px.

Prefixes: `p`=padding, `m`=margin, `x`=left+right, `y`=top+bottom, `t/b/l/r`=one side, `gap`=space between children.

## Rule 3: Text and colour
| Class | Meaning |
|---|---|
| `text-sm`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`, `text-5xl` | size: 14, 18, 20, 24, 36, 48 px |
| `font-medium`, `font-semibold`, `font-bold` | weight: 500, 600, 700 |
| `text-center` | align text in the middle |
| `text-slate-600` | text colour (grey) |
| `bg-amber-50` | background colour |
| `border-slate-200` | border colour |

Colour names run from **50 (lightest) to 950 (darkest)**. Rule of thumb: backgrounds light (50–200), text dark (600–900), buttons mid-dark (600–700) with white text.

## Rule 4: Flexbox, "put things in a row or column"
```
flex                       → children sit in a ROW
flex flex-col              → children stack in a COLUMN
justify-*  moves along the main direction:   justify-between = spread to the ends, justify-center = middle
items-*    moves across it:                  items-center = vertically centred (in a row)
gap-4      space between children
```
```
flex justify-between items-center       flex flex-col items-center gap-2
[Brand ................ Link]               [ A ]
                                            [ B ]
```
**Why:** the Header needs the brand on the left and the link on the right; `flex justify-between` does exactly that.

## Rule 5: Grid, "make columns"
`grid gap-4 sm:grid-cols-2 lg:grid-cols-3` = a grid where the cards are 1 column on phones, 2 from 640px, 3 from 1024px.

## Rule 6: Responsive = mobile-first
No prefix = applies to **all** screens. A prefix means **from this width upwards**:
| Prefix | Starts at |
|---|---|
| (none) | phones |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |

`text-4xl sm:text-5xl` = 36px on phones, 48px from 640px up.
**Why:** most Uttarakhand pilgrims will book from a phone. We design for the phone first.

## Rule 7: Sizing and centering
| Class | Meaning |
|---|---|
| `min-h-screen` | at least as tall as the browser window |
| `max-w-xl` / `max-w-5xl` | never wider than 36rem / 64rem |
| `mx-auto` | centre a width-limited block (auto left/right margin) |

## Rule 8: Looks and states
| Class | Meaning |
|---|---|
| `rounded-lg`, `rounded-xl` | rounded corners (8px, 12px) |
| `shadow-sm` | soft shadow |
| `hover:bg-amber-800` | only when the mouse is over it |
| `inline-block` | lets a link have padding and margins like a box |

---

## Class dictionary (grows daily)
| Class | Plain CSS | First used | Why |
|---|---|---|---|
| `flex` | `display: flex` | Day 1 page | lay out children in a row |
| `flex-col` | `flex-direction: column` | Day 1 page | stack vertically |
| `items-center` | `align-items: center` | Day 1 page | centre across the main direction |
| `justify-center` | `justify-content: center` | Day 1 page | centre along the main direction |
| `gap-4` | `gap: 1rem` | Day 1 page | space between children |
| `min-h-screen` | `min-height: 100vh` | Day 1 page | fill the whole window so we can centre vertically |
| `p-6` | `padding: 1.5rem` | Day 1 page | space inside |
| `text-center` | `text-align: center` | Day 1 page | centred text |
| `text-4xl` | `font-size: 2.25rem` | Day 1 page | big heading |
| `font-bold` | `font-weight: 700` | Day 1 page | strong heading |
| `text-lg` | `font-size: 1.125rem` | Day 1 page | slightly bigger paragraph |
| `text-slate-600` | `color: slate-600` | Day 1 page | softer grey for secondary text |
| `justify-between` | `justify-content: space-between` | Day 2 Header | brand left, link right |
| `border-b` | `border-bottom-width: 1px` | Day 2 Header | line under the header |
| `px-6 py-4` | left/right 1.5rem, top/bottom 1rem | Day 2 Header | different space on each axis |
| `text-amber-700` | `color: amber-700` | Day 2 Header | brand colour |
| `hover:underline` | underline on hover | Day 2 Header | shows it is clickable |
| `bg-amber-50` | `background: amber-50` | Day 2 Hero | very light warm background |
| `py-20` | top/bottom 5rem | Day 2 Hero | a big, airy banner |
| `mx-auto max-w-xl` | centred, 36rem wide | Day 2 Hero | readable line length |
| `mt-4 / mt-8` | `margin-top: 1rem / 2rem` | Day 2 Hero | space above elements |
| `inline-block` | `display: inline-block` | Day 2 Hero button | give a link padding like a button |
| `rounded-lg` | `border-radius: 0.5rem` | Day 2 Hero button | rounded corners |
| `bg-amber-700 text-white` | dark amber + white text | Day 2 Hero button | clear call to action |
| `hover:bg-amber-800` | darker on hover | Day 2 Hero button | feedback |
| `grid` | `display: grid` | Day 2 route list | columns |
| `sm:grid-cols-2 lg:grid-cols-3` | 2/3 columns | Day 2 route list | responsive columns |
| `rounded-xl border border-slate-200 shadow-sm` | corners + line + soft shadow | Day 2 RouteCard | looks like a card |
| `max-w-4xl` | `max-width: 56rem` | Day 3 SearchForm | form never gets too wide |
| `mt-10` | `margin-top: 2.5rem` | Day 3 SearchForm | space under the subtitle |
| `rounded-2xl` | `border-radius: 1rem` | Day 3 SearchForm | a softer card |
| `shadow-lg` | big soft shadow | Day 3 SearchForm | floats above the hero |
| `text-left` | `text-align: left` | Day 3 SearchForm | labels read better left-aligned inside a centred hero |
| `sm:grid-cols-2 lg:grid-cols-4` | 2 columns from 640px, 4 from 1024px | Day 3 form grid | one markup for phone, tablet, laptop |
| `block` | `display: block` | Day 3 label | label takes a full line above the field |
| `w-full` | `width: 100%` | Day 3 fields | fields fill their grid cell |
| `border-slate-300` | border colour | Day 3 fields | visible but quiet outline |
| `focus:ring-2 focus:ring-amber-200` | glow while the field is active | Day 3 fields | shows where you are typing |
| `focus:outline-none` | removes the browser's default outline | Day 3 fields | we replaced it with our own ring (always keep a visible focus style) |
| `sm:w-auto` | `width: auto` from 640px | Day 3 button | full width on phones, natural width on bigger screens |
| `min-h-screen` (on the page wrapper) | `min-height: 100vh` | Day 2 page fix | stops a black band below a short page in dark mode |
| `font-semibold text-amber-700` | 600 weight, amber | Day 4 price | price stands out from grey text |
