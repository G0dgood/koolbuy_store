# KoolBuy Store: Design Guide

This file is the source of truth for how the store looks. It follows the Koolboks
design system shared with the Sales CRM (`koolboks_sales_crm_web/DESIGN.md`):
clean white surfaces, charcoal text, soft grays, rounded cards, with **Koolboks
orange** as the accent. New pages and components should follow these rules so the
store and the CRM feel like one family.

Tokens live in `app/globals.css`, on `:root` (light) and `.dark`. Use the token or
its Tailwind class, never a hard-coded hex.

---

## 1. Brand colors

| Token | Tailwind class | Light | Use |
|---|---|---|---|
| `--brand-orange` | `brand-orange` | `#F57E16` | The accent: focus rings, active states, highlights, the key CTA. Sampled from the Koolboks logo. |
| `--brand-orange-hover` | `brand-orange-hover` | `#DC6C0B` | Hover or pressed state of anything orange. |
| `--brand-orange-soft` | `brand-orange-soft` | `#FEF1E6` | Tinted backgrounds: selected items, active nav, badges. |
| `--brand-orange-text` | `brand-orange-text` | `#B85A0A` | Orange **text** (links, small labels). Deeper so it stays readable on white. |
| `--brand-charcoal` | `brand-charcoal` | `#050711` | Primary text, dark buttons, dark sections. |
| `--brand-on-orange` | n/a | `#FFFFFF` | Text and icons on orange. |

**Orange vs charcoal**

- **Charcoal is the workhorse.** Headings, body text, dark buttons and dark bands (header strips, footer) are charcoal.
- **Orange is the spark.** Use it for links, focus rings, the active nav item, price highlights, small badges and at most **one** orange CTA per section (e.g. *Add to cart*, *Checkout*).
- Keep orange to roughly **10% of a screen**. If a page looks orange, there's too much.
- Never put orange body text on an orange-soft background. Use charcoal on orange-soft.
- Pure `--brand-orange` on white is only 2.7:1 contrast. Use it for fills, borders, icons and focus rings, **not text**. For orange text use `--brand-orange-text` (4.7:1, passes WCAG AA).

**No blue, no teal.** The store used to be blue-led with a teal accent. Both are gone from
the code: accents are orange, dark fills are charcoal. `brand-blue` / `brand-blue-light` still
exist in `globals.css` as aliases (charcoal / light gray) only so stray old classes don't
break. Never use them in new code.

**On dark bands** (charcoal sections, photo heroes with a dark overlay):

- Orange text uses the bright `brand-orange` (6.7:1 on charcoal), not `brand-orange-text`.
- The CTA is an orange button. A charcoal button disappears on a charcoal band.
- Icon tiles use `bg-white/10`, or orange when they are the focal point.
- A second tone inside a white heading is `text-white/60`, not orange.

## 2. Neutral palette

| Token | Light | Use |
|---|---|---|
| `--accent-white` | `#FFFFFF` | Cards, panels, header |
| `--off-white` | `#F8F9FA` | Page background (`--background`), muted areas |
| `--light-gray` | `#E9ECEF` | Borders, dividers (`--border`) |
| `--medium-gray` | `#DEE2E6` | Disabled fills, stronger borders |
| `--text-primary` | `#050711` | Headings, body |
| `--text-secondary` | `#495057` | Secondary text |
| `--text-tertiary` | `#6C757D` | Hints, captions, placeholders |

Tailwind classes: `bg-off-white`, `border-light-gray`, `bg-medium-gray`, `text-subtle`
(secondary text) and `text-faint` (tertiary text). Tailwind's `gray-*` scale is fine for
neutrals too.

The shadcn-style tokens (`--background`, `--card`, `--primary`, `--border`, `--ring`,
`--chart-*`, …) are wired to these. `--primary`, `--ring` and `--chart-1` are orange.

## 3. Status colors

| Token | Value | Use |
|---|---|---|
| `--status-success` | `#6C8B7D` (sage) | Success, in stock, positive deltas |
| `--status-warning` | `#FD7E14` | Warnings (close to brand orange, so always pair with an icon or label) |
| `--status-error` | `#DC3545` | Errors, destructive actions, out of stock (`brand-red` aliases this) |
| `--status-info` | `#6C757D` | Neutral info |

Tailwind classes: `text-success`, `bg-success`, `bg-success-soft` (`#EDF3EF`), `text-error`,
`bg-error-soft` (`#FDECEE`), `text-warning`. Done / delivered / paid / published / active
states are **success (sage)**, never orange. Orange is for in-progress states (pending,
shipped) and accents.

## 4. Typography

- **Font:** Work Sans, self-hosted in `public/fonts` with `@font-face` at the top of `app/globals.css`. Never load fonts from Google (no `next/font/google`). Montserrat Black (`font-brand`) is for brand lockups only.
- **One typeface everywhere** (storefront, admin, charts, as in the CRM): `font-inter`, `font-lato`,
  `font-outfit`, `font-sans`, `font-heading` and `font-mono` all resolve to Work Sans. `font-mono` (IDs, SKUs,
  amounts) adds tabular figures and a slashed zero instead of switching typeface. Chart.js defaults to Work
  Sans (set in the shared chart modules). Don't add new font families or inline `fontFamily` styles.
- **Scale:**

| Role | Size / weight |
|---|---|
| Page title | 32px / 700, line-height 1.2 |
| Section title | 20px / 600 |
| Product card title | 14–16px / 600 |
| Body | 14px / 400, line-height 1.5 |
| Caption / helper | 12px / 400–500 |

- **Weights:** 400 for body, 500 for emphasis and table names, 600 for titles, buttons and values, and **700 at most**.
  No `font-black` or `font-extrabold` (both were removed from the codebase), as in the CRM.
- **Smallest text is 11px** in the admin. No 9–10px labels, and no letter-spacing wider than `tracking-wider`.
- **Admin type tiers** (copied from the CRM, in `admin.css`): on screens up to 1440px wide (or 880px tall) the
  admin's `html` font size drops to 14px, and to 13px up to 1280px, so dense pages fit on laptops.
- Headings use `--text-primary`. Never set a heading in orange.

## 5. Spacing, radius, elevation

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 40px (Tailwind `1, 2, 3, 4, 6, 8, 10`). Cards use 16–24px padding.
- **Radius:** `--radius: 12px` for cards, inputs and buttons (`rounded-lg`). Tailwind's `rounded-sm` / `md` / `xl` / `2xl` are derived from it. Don't invent new values like `rounded-[40px]`.
- **Shadow:** soft only, e.g. `0 2px 8px rgba(0,0,0,.1)` or `shadow-sm`. No heavy drop shadows (`shadow-2xl`).

## 6. Logo

The store logo is `public/images/koolboks/koolbuy_logo.webp`.

| Placement | Height | Alignment |
|---|---|---|
| Header, mobile | 36px (`h-9`) | Left, vertically centered with the menu button |
| Header, desktop | 40–44px (`h-10 xl:h-11`) | Left, vertically centered with the search bar |
| Footer | match the header | Left-aligned with the footer columns |

- Keep clear space of about ¼ of the logo height around it.
- Don't recolor, stretch, add shadows to it, or place it on orange.
- Don't repeat "KoolBuy" as text next to the logo.

## 7. Components

- **Buttons** (`app/components/Button`, the same as the Sales CRM's `components/ui/Button.tsx`):
  - `primary` (default): charcoal fill, white text. The everyday button.
  - `accent`: Koolboks orange, for **the one key call-to-action** on a screen (Add to cart, Complete order, Submit inquiry).
  - `outline`: charcoal border and text; fills charcoal with white text on hover.
  - `secondary`: light grey fill. `ghost`: text only, light grey on hover. `danger`: red. `link`: orange text link.
  - Text is semibold, 12px on desktop and 10px on phones. `md` (16×8px padding, about 34px tall) is the standard,
    `sm` (12×8px) is for table rows and tight spots, and `lg` is only for hero banners. Don't add height
    overrides (`h-12`, `py-4`) or uppercase and tracking to buttons.
  - `blue` / `emerald` are legacy names for `primary`, and `rose` is a soft red. Don't use them in new code.
- **Checkboxes:** always `app/components/Checkbox` (the CRM's checkbox, styles in `globals.css`), never a bare
  `<input type="checkbox">`. It's a white box with a grey border; checked is charcoal black (`--brand-charcoal`) with a
  white tick. Use `size="small"` (18px, the default) for table rows, filters, lists and permission checklists, and
  `size="medium"` (22px) for an option in a form. A checkbox with no visible label gets `ariaLabel`.
- **Links:** `.brand-link` (orange text, 500 weight, 80% opacity on hover).
- **Inputs:** 1px `--light-gray` border, orange (`--ring`) on focus.
- **Active nav item:** charcoal fill with white text; hover is `--brand-orange-soft` (as in the CRM).
- **Prices:** charcoal, 600–700 weight. A sale price or discount badge may use orange.
- **Charts:** series 1 is `--chart-1` (orange). Keep other series neutral so orange leads.

## 7a. Admin dashboard

The admin (`/admin`) uses the same frame as the Koolboks Sales CRM:

- **Grid shell** (`app/admin/admin.css`): side nav on the left spanning the full height, a
  70px header, and `<main>` (off-white, 32px padding) as the only scrolling area.
- **Side nav** (`app/components/Admin/AdminSidebar.tsx`, matching the CRM's `DashboardSideNav.tsx`): white,
  250px wide (260px on very wide screens), collapsing to 70px icons-only (remembered in `localStorage`, key
  `admin-sidenav-collapsed`). One continuous list with no group titles. Thin rules separate the store's four
  sections. Rows are 13px medium `text-subtle` with grey Radix icons, 6px apart. Hover is `brand-orange-soft`.
  The **active item, and an open group, are a charcoal fill with white text** (the CRM's `--primary`).
  Sub-items have their own icons, sit under a 2px `light-gray` left rule, and are charcoal when active.
  Opening a group also goes to its first page. In icon-only mode, labels show as tooltips and sub-items
  open in a floating menu.
- **Header** (`AdminHeader.tsx`): white, `light-gray` bottom border, page title at
  20px / 600 in charcoal (not uppercase), then search, notifications, theme and profile.
- **Tables** (all tables in the admin, from `admin.css`, as in the CRM): an `off-white` header row with
  12px semibold `text-faint` labels (normal case), 16×10px header cells, 14px rows with 16×12px cells,
  `light-gray` dividers between rows and `off-white` on hover. Cell text is regular, and names and key values
  are medium (500), never bold. The first and last columns get 24px padding to line up with the card.
- **Pagination** (`Admin/Pagination.tsx`, as in the CRM): text "Previous" / "Next", small grey page
  buttons, and the current page as a charcoal button. It only shows pages that exist.
- Don't override brand tokens inside the admin. It shares the storefront palette.

**Dashboard pieces** (match the CRM dashboard):

- **`StatCard`**: a white bordered tile with a 13px `text-faint` label, a change pill
  (`▲ 12.5%` on `success-soft`, `▼` on `error-soft`), a 26px semibold value, a 12px hint
  (`periodLabel`) and an orange sparkline. **No icons and no menus.** Pass `onViewDetails`
  to make the whole tile clickable. Lay tiles out in `grid-cols-2 lg:grid-cols-3` (or 4).
- **`ChartCard`** (`DashboardUi.tsx`): a 15px semibold title, a 12px subtitle, and on the
  right any controls plus a `ChartTypePicker` (bar / area / line) that really switches the
  chart. Charts use `chartBaseOptions` (Work Sans, grey ticks, light grid, charcoal
  tooltip). Series 1 is orange, series 2 is `--chart-neutral` grey.
- **`Segmented`**: joined tabs, with the selected one orange-soft and an orange underline.
- **`SmartChart`** (`DashboardUi.tsx`, ported from the CRM): one component draws bar, line, area, pie and
  donut charts. Pass `compact` for a bare sparkline. Donuts show each slice's share in a legend on the right
  (clicking a slice hides it) and can show a total in the hole (`centerLabel`).
- **Chart colours**: one measure over time is Koolboks orange (`BRAND`). Categories use the CRM palette
  `SERIES` in a fixed order: blue `#2a78d6`, orange `#eb6834`, green `#1baf7a`, amber `#eda100`, pink
  `#e87ba4`, dark green `#008300`, indigo `#4a3aa7`, red `#e34948`. Order statuses use `STATUS_COLORS`:
  delivered green, shipped blue, processing amber, pending grey, cancelled red. When comparing periods, only
  the current one is filled.
- **Motion**: `AnimatedNumber` counts tiles up when the period changes. The dashboard uses static sample data
  (`dashboardData.ts`) with a "Sample data" tag; no live timers until the API is connected.
- No decorative toolbar buttons (zoom, reset, ⋯, ☰) unless they do something.

### Icons

Use **Radix Icons** (`@radix-ui/react-icons`), the pack the Sales CRM side nav uses:
15×15 outline glyphs that take `className` (size with `w-4 h-4` / `w-5 h-5`, colour
with `currentColor`). Side nav icons are `w-5 h-5`, header icons `w-5 h-5`, inline
icons `w-4 h-4`.

| Use | Icon |
|---|---|
| Dashboard | `DashboardIcon` |
| Orders / fulfilment | `ArchiveIcon` |
| Vendors | `IdCardIcon` |
| Accounting | `ReaderIcon` |
| Customers | `PersonIcon` |
| Wishlist | `HeartIcon` |
| Reports | `BarChartIcon` |
| Location / service area | `SewingPinIcon` |
| Settings / configuration | `GearIcon`, `MixerHorizontalIcon` |
| Catalog / products | `CubeIcon` |
| Payments | `CardStackIcon` |
| Roles / permissions | `LockClosedIcon` |
| Audit logs | `ClockIcon` |
| Search, notifications, menu | `MagnifyingGlassIcon`, `BellIcon`, `HamburgerMenuIcon` |
| Expand / collapse | `ChevronRightIcon` / `ChevronDownIcon`, `DoubleArrowLeftIcon` / `DoubleArrowRightIcon` |

`react-icons` is still used on older pages. Use Radix for new admin UI.

## 8. Helper classes (in `app/globals.css`)

| Class | Effect |
|---|---|
| `.text-brand` | Orange text (`--brand-orange-text`) |
| `.bg-brand` | Orange background, white text, hover state |
| `.brand-link` | Orange link with hover state |
| `.brand-divider` | 1×24px vertical divider in `--light-gray` |

## 9. Migration status

The storefront and admin were moved onto this guide in October 2026:

- Navy `#1D3557`, slate `#1E293B`/`#0F172A` and `brand-blue` fills became `brand-charcoal`.
- Teal `#00BCD4`, `#FF7A00`, `#2196F3`, Tailwind `blue-*`/`sky-*`/`indigo-*`/`cyan-*`/`orange-*` and `text-brand-blue` became orange tokens (`brand-orange` for fills, `brand-orange-text` for text, `brand-orange-soft` for tints).
- Slate grays (`#94A3B8`, `#64748B`) and off-whites became the neutral tokens.
- Chart colors (canvas can't read CSS variables) use the literal values: `#F57E16`, `#DC6C0B`, `#050711`, `#6C757D`, `#495057`.
- Radii above 20px became `rounded-3xl`. `shadow-xl` / `shadow-2xl` became `shadow-md`.

Left as they are on purpose:

- Status colors: amber warnings, green success, red errors.
- Payment and social brand colors: Visa, Mastercard, PayPal, Google.
- The colour pickers in `admin/app-styling` (the mobile app's settings) and the `color-test` dev page.
- Photos and banners whose artwork is itself colored (e.g. the blue *Keep it fresh* card, the About and Help hero photos).

## 10. Dark mode

The store has no dark-mode toggle yet. `.dark` in `globals.css` already defines the
brand and neutral tokens, so if a toggle is added, components that use tokens will
switch over without changes.

## 11. Illustrations

The Sales CRM uses custom Koolboks SVG illustrations for empty states. If you add
empty-state art to the store (empty cart, empty wishlist, no search results), follow
the CRM's style rules (`koolboks_sales_crm_web/DESIGN.md` §10): 200×160 canvas,
charcoal 2.5px rounded outlines, one or two orange focal points, soft orange fills, no
stock art.

## 12. Checklist for new UI

- [ ] Colors come from tokens, not hex. No `brand-blue`, navy or teal.
- [ ] On dark bands: bright orange text, an orange CTA, nothing charcoal.
- [ ] At most one orange CTA per section; orange for accents, not large fills.
- [ ] Orange text uses `brand-orange-text`, not `brand-orange`.
- [ ] Work Sans only; no new font imports.
- [ ] Radius from the `--radius` scale, spacing on the 4px scale, soft shadows.
- [ ] Buttons use `app/components/Button`: `primary` by default, `accent` for the one key CTA, at `md` (or `sm` when tight).
- [ ] No `font-black` / `font-extrabold`; weights stop at 700.
- [ ] Done / delivered / paid states use `success`, not orange.
- [ ] Admin icons come from `@radix-ui/react-icons`.
