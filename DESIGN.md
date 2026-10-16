# KoolBuy Store: Design Guide

This is the source of truth for how KoolBuy looks. It combines two influences on one set of Koolboks
foundations:

- **Apple's design language** (clarity, deference, depth): calm surfaces, large confident type, generous
  space, soft materials and motion that feels physical. This shapes the whole product, and most visibly the
  **storefront**.
- **The Koolboks Sales CRM** (`koolboks_sales_crm_web/DESIGN.md`): the same tokens, Work Sans, charcoal and
  Koolboks orange, and the CRM's components. This shapes the **admin**, so the store and the CRM feel like one
  family.

There are two surfaces built on the same foundations:

| | Storefront (customers) | Admin (`/admin`, staff) |
|---|---|---|
| Feel | Apple store: spacious, editorial | CRM: dense, efficient, flat |
| Primary colour | **Koolboks orange** | **Charcoal** |
| Radius | 10 / 14 / 20px tiles, pill buttons | 12px cards, 12px buttons |
| Card edge | 1px `light-gray` border (as the CRM) | 1px `light-gray` border (as the CRM) |
| Type | Large display headlines (34–52px) | 20px page titles, 13–14px UI text |
| Theme | Light | Light or dark (header toggle) |

Tokens live in `app/globals.css` (`:root` light, `.dark` dark). Always use a token or its Tailwind class,
never a hard-coded hex.

---

## Principles

1. **Clarity.** One idea per section, one primary action per view. Text is legible (11px minimum), contrast
   passes WCAG AA, and nothing is uppercase-shouted.
2. **Deference.** The products and the data are the content. Chrome stays quiet: no heavy borders, no
   decorative shadows, no ornamental icons or dead buttons.
3. **Depth through restraint.** Hierarchy comes from size, weight, space and soft surfaces (white on off-white,
   frosted bars), not from lines and colour. Shadows appear only to lift something you can act on.
4. **One brand.** Koolboks orange is the accent everywhere and the primary on the storefront; charcoal carries
   text and the admin. No other accent colours (no blue, no teal).
5. **Honest UI.** Controls that look interactive do something. Placeholder data is labelled "Sample data".

---

## 1. Colour

### Brand

| Token | Class | Light | Use |
|---|---|---|---|
| `--brand-orange` | `brand-orange` | `#F57E16` | Storefront primary fill; accent fills, focus rings, active marks, charts. From the Koolboks logo. |
| `--brand-orange-hover` | `brand-orange-hover` | `#DC6C0B` | Hover or pressed state of anything orange. |
| `--brand-orange-soft` | `brand-orange-soft` | `#FEF1E6` | Tinted backgrounds: hover rows, selected items, badges. |
| `--brand-orange-text` | `brand-orange-text` | `#B85A0A` | Orange **text** (links, small labels): 4.7:1 on white. |
| `--brand-charcoal` | `brand-charcoal` | `#050711` | Text, admin primary fill, dark bands. |
| `--brand-on-orange` | – | `#FFFFFF` | Text and icons on orange. |

- **Orange on white** is 2.7:1: use it for fills, borders, icons and rings, never for text. Orange text is
  `brand-orange-text`. On a charcoal band, orange text is the bright `brand-orange` (6.7:1).
- **How much orange:** on the storefront, orange is the primary, so main buttons, active chips, selected
  options and the current carousel dot are orange. Keep it to actions and marks; surfaces stay white and grey.
  In the admin, orange is only an accent (about 10% of a screen) and buttons are charcoal.
- Never orange body text on `brand-orange-soft`; use charcoal there.
- `brand-blue` / `brand-blue-light` are legacy aliases (charcoal / light grey). Don't use them.

### Neutrals and materials

| Token | Light | Class | Use |
|---|---|---|---|
| `--accent-white` | `#FFFFFF` | `bg-white` | Cards, tiles, panels |
| `--off-white` | `#F8F9FA` | `bg-off-white` | Page background, image stages, footer |
| `--light-gray` | `#E9ECEF` | `border-light-gray` | Borders and dividers |
| `--medium-gray` | `#DEE2E6` | `bg-medium-gray` | Disabled fills, stronger borders |
| `--text-primary` | `#050711` | `text-brand-charcoal` | Headings and body |
| `--text-secondary` | `#495057` | `text-subtle` | Secondary text, subtitles |
| `--text-tertiary` | `#6C757D` | `text-faint` | Hints, captions, meta |

**Apple-style translucent tints** (storefront): `bg-black/[0.04]` for resting fills (search, chips, inputs),
`bg-black/[0.06–0.08]` for hover, `border-black/[0.06]` for hairlines. They sit naturally on white or
off-white.

### Status

| Token | Value | Use |
|---|---|---|
| `--status-success` | `#6C8B7D` sage | Done, delivered, paid, published, active, in stock |
| `--status-warning` | `#FD7E14` | Warnings (pair with an icon or label: it's close to orange) |
| `--status-error` | `#DC3545` | Errors, destructive actions, out of stock |
| `--status-info` | `#6C757D` | Neutral info |

Classes: `text-success`, `bg-success-soft`, `text-error`, `bg-error-soft`, `text-warning`. Finished states are
always **success**, never orange; orange means in progress (pending, shipped) or "act here".

### Dark mode (admin)

The admin header toggle adds `.dark` to `<html>` while you're in `/admin` (saved per browser, applied before
paint; the storefront is always light). Dark tokens: page `#0F172A`, cards `#1E293B`, borders `#334155`, text
`#F1F5F9` / `#CBD5E1` / `#94A3B8`. "Charcoal" becomes the light ink, so charcoal fills turn light with dark text,
as in the CRM. Fixed utility colours (`bg-white`, `text-gray-900`, `border-gray-100`, …) are mapped in
`app/admin/admin.css` §7. Charts and the map switch to dark ink.

## 2. Typography

**Work Sans everywhere** (self-hosted, `@font-face` in `globals.css`; never Google Fonts). `font-inter`,
`font-lato`, `font-outfit`, `font-sans`, `font-heading` and `font-mono` all resolve to Work Sans; `font-mono` adds
tabular figures and a slashed zero. Chart.js defaults to Work Sans. Montserrat Black (`font-brand`) is for brand
lockups only.

| Role | Storefront | Admin |
|---|---|---|
| Display / hero headline | 44–52px, 600, `tracking-[-0.03em]`, leading 1.05 | – |
| Section headline | 26–34px, 600, `tracking-[-0.025em]` | 15px, 600 (card titles) |
| Page title | 24–28px, 600 | 20px, 600 |
| Subtitle under a headline | 14–15px, 400, `text-subtle` | 12–14px, `text-faint` |
| Body | 15–17px, 400, leading 1.5 | 13–14px, 400 |
| Product name / row name | 14–15px, 600 | 13–14px, 500 |
| Caption, meta | 12–13px, `text-faint` | 11–12px, `text-faint` |

- **Weights:** 400 body, 500 emphasis, 600 titles, buttons and values; **700 at most**. Never `font-black` or
  `font-extrabold`.
- **Case:** sentence case everywhere (labels, buttons, headings). Storefront headlines end with a full stop
  ("Introducing our products."). No uppercase labels or buttons, and no letter-spacing wider than
  `tracking-wider` (headlines use negative tracking).
- **Admin type tiers** (from the CRM, `admin.css` §6): on screens up to 1440px wide (or 880px tall) the admin's
  root size drops to 14px, and to 13px up to 1280px.
- Headings are charcoal. Never set a heading in orange.

## 3. Space and layout

- **Scale:** 4, 8, 12, 16, 24, 32, 40px, plus 64/96/112px between storefront sections.
- **Storefront:** content width `max-w-360` with `px-4 sm:px-6 md:px-10 lg:px-16`; sections 64px apart on phones
  and 112px on desktop (`gap-16 md:gap-28`); tiles in a grid 12–16px apart. Let things breathe.
- **Admin:** the CRM grid shell (side nav, 70px header, scrolling `<main>` with 20–32px padding); cards 16–20px
  padding, 12–24px gaps.

## 4. Logo

`public/images/koolboks/koolbuy_logo.webp`. Storefront header 36–40px tall, admin side nav 32–36px, footer 36px;
always left-aligned and vertically centred. Keep clear space of about a quarter of its height. Don't recolour,
stretch, shadow or place it on orange; on dark backgrounds it sits on a small white rounded plate. Don't repeat
"KoolBuy" as text beside it. The storefront logo goes home; the admin logo goes to the storefront.

## 5. Shape, elevation and materials

| Token / class | Value | Use |
|---|---|---|
| `rounded-lg` (`--radius`) | 12px | Admin cards, inputs, buttons; storefront inputs |
| `rounded-stage` | 10px | Image stages inside tiles, small tiles, option cards |
| `rounded-tile` | 14px | Storefront tiles, product cards, panels |
| `rounded-hero` | 20px | Large storefront tiles and the hero (from `md:`) |
| `rounded-full` | – | Pill buttons, chips, search, avatars |

- **Card edge (as in the CRM):** every white rounded card, on the storefront and in the admin, has a 1px
  `light-gray` border (applied by rules in `globals.css` and `admin.css`). Photo tiles, the hero and pills
  don't. No resting shadows on cards or buttons.
- **Lift on hover only:** `shadow-lift` (`0 10px 30px rgb(0 0 0 / 8%)`) for things you can click.
  **Floating panels** (dropdowns, popovers, carousel arrows) use `shadow-float`.
- **Frosted material:** `.material-frosted` (or `bg-white/80 backdrop-blur-xl backdrop-saturate-150`) for the
  sticky header, mega menus, carousel arrows and overlays on photos.

## 6. Motion

- Easing `ease-apple` (`cubic-bezier(0.16, 1, 0.3, 1)`): fast start, soft landing.
- Durations: 150–200ms for colour and hover, 300–500ms for images and panels, 700ms for hero crossfades.
- Images scale 1.03–1.04 on hover; content eases in once (fade and 16px rise) as it scrolls into view;
  carousels crossfade rather than slide. No bouncing springs, wobbles or scale tricks on buttons.
- Respect `prefers-reduced-motion` (marquee, glows and pulses stop).

## 7. Components (shared)

- **Button** (`app/components/Button`, the CRM's button): `primary` (default), `accent` (orange: the one key
  action), `outline`, `secondary`, `ghost`, `danger`, `link`. Semibold, normal case. Sizes: `md` standard, `sm`
  tight spots, `lg` for a single big CTA. Shapes: `rounded` (admin) or `pill` (storefront).
  - **Storefront:** `primary` renders **orange** (a `globals.css` rule turns any charcoal-filled button or link
    orange outside the admin). Pills everywhere.
  - **Admin:** `primary` is **charcoal**; `accent` orange only where one action must stand out.
- **Checkbox** (`app/components/Checkbox`, the CRM's checkbox; `Form/Checkbox` for form-prop usage): white box,
  grey border, **checked is black** with a white tick. `small` (18px, default) for tables, filters, lists;
  `medium` (22px) for a form option. Never a bare `<input type="checkbox">`. On/off settings use switches.
- **Inputs:** storefront `h-10–11 rounded-xl bg-black/[0.04]`, turning white with a border and a soft orange
  ring on focus; admin 1px `light-gray` border, orange ring on focus.
- **Selectable option cards** (payment, delivery): `rounded-stage` with `ring-1 ring-black/[0.08]`, selected
  `ring-2 ring-brand-orange`.
- **Links:** orange text (`brand-orange-text`), 500 weight, underline on hover. Storefront "See all ›",
  "Shop now ›", "Join now ›".
- **Tabs:** storefront category chips and pill switches (selected orange); admin tabs are `TabFilter` (the
  CRM's segmented control: joined, bordered, selected orange-soft with an orange underline).
- **Prices:** charcoal, tabular figures, 600 for the main price. A sale price or BNPL "₦…/month" line may use
  `brand-orange-text`.
- **Icons:** Radix Icons (`@radix-ui/react-icons`) for new UI, `w-4 h-4` inline and `w-5 h-5` in nav;
  `currentColor`. `react-icons` remains on older pages. The shared `Icon` component maps missing legacy names
  to existing files or Radix icons.
- **Charts** (`SmartChart`): one measure over time is orange; categories use the CRM palette `SERIES` (blue,
  orange, green, amber, pink, dark green, indigo, red) in that order; order statuses use `STATUS_COLORS`;
  comparisons fill only the current period.
- **Empty states / illustrations:** follow the CRM's illustration rules (200×160, charcoal 2.5px outlines,
  one or two orange focal points, soft orange fills, no stock art).

## 8. Storefront: Apple store × Koolboks

- **Header:** sticky, frosted, hairline bottom border, 56–64px tall. Logo left; a soft grey search pill with
  an orange Search button; 13px medium grey nav links (active `brand-orange-text`); Marketplace as a compact
  pill; profile and cart as round icon buttons with no labels. Below it, a thin light announcement line with
  one sentence and an orange "Join now ›". Mega menus are frosted with small grey column titles and 15px
  semibold links.
- **Hero:** a `rounded-hero` tile at the artwork's own aspect ratio (12:5) so baked-in text is never cropped;
  crossfades; frosted arrows on hover; slim dots under the tile (active dot orange).
- **Sections:** a display headline with a subtitle, then content. Product rows use `StoreSectionHeader`,
  `StoreProductCard` and `StoreProductGrid` (`app/components/Home/StoreUi.tsx`).
- **Product tile:** a white `rounded-tile` card with the 1px `light-gray` card border and `overflow-hidden`. The
  photo fills the top of the card **edge to edge, with no padding** (an `off-white` area behind it, the photo
  `object-contain` with `mix-blend-multiply` so baked-in white backgrounds disappear); only the text below
  (name, vendor, price) is padded (`px-4 pt-3 pb-4`). In list rows the photo runs full height down the left
  edge. `shadow-lift` and a 1.04 image scale on hover. Small line-item thumbnails (cart, order summary) keep a
  rounded stage.
- **Feature tiles:** full-bleed photo tiles with the text and a white frosted "Shop now" pill at the top;
  eyebrow 13px semibold in sentence case; title 24–28px semibold.
- **Products page:** white rounded filter panel with hairline sections; pill sort and view controls; pill
  category chips; product tiles as above (list view uses the same language).
- **Product detail:** gallery on an off-white stage with rounded thumbnails (active ring orange); big tight
  product name; price above the BNPL box; quantity as a soft pill; **Add to cart** as the orange pill; specs as
  hairline label/value rows; pill tabs; calm review cards.
- **Cart and checkout:** big tight page title; white `rounded-tile` blocks; hairline-separated line items with
  off-white image stages; Remove / Save for later as quiet orange text links; summary with a hairline above a
  22px total; one orange pill for **Checkout** / **Complete order**; form fields as soft grey `rounded-xl`
  inputs in white sections; selectable payment cards.
- **Carousels:** frosted round arrows appear on hover; dots or scrolling are quiet.
- **Newsletter and footer:** a centred "Stay in the loop." block with a pill email field; the footer is
  `off-white`, 12px, sentence-case column titles, hairline dividers.
- **Dark bands** (charcoal sections, photos with dark overlays): white headline with a `text-white/60` second
  tone, bright orange accents, an orange CTA, icon tiles `bg-white/10`.

## 9. Admin: Sales CRM × Apple restraint

- **Shell** (`app/admin/admin.css`): side nav spanning the full height, a 70px header, off-white `<main>` as the
  only scrolling area. Every white rounded card has a 1px `light-gray` border and no shadow.
- **Side nav** (`AdminSidebar.tsx`, the CRM's `DashboardSideNav`): white, 250px (260px very wide), collapsing to
  70px icons-only (`localStorage` key `admin-sidenav-collapsed`). One list, thin rules between the four
  sections, 13px medium labels with grey Radix icons, soft orange hover. **Active item and open group: charcoal
  fill, white text.** Sub-items have icons, sit under a left rule, open their group's first page. Icon-only
  mode shows tooltips and a floating sub-menu.
- **Header** (`AdminHeader.tsx`): page title 20px / 600, search, the CRM bell (thin line, red count badge), the
  light/dark switch and profile.
- **Tables** (`admin.css`, as in the CRM): off-white header row, 12px semibold `text-faint` labels in normal
  case; 14px rows with `light-gray` dividers and off-white hover; cell text never bold; first and last columns
  24px in. Icon-only row actions are 32px, light-bordered, 16px grey icons, soft orange hover. View/open is an
  arrow (→), not an eye.
- **Pagination** (`Admin/Pagination.tsx`, the CRM's): text Previous / Next, small grey numbers, current page as
  a charcoal button; no border of its own.
- **Dashboard** (`app/admin/page.tsx`, `DashboardUi.tsx`): period switch (`Segmented`), `StatCard` tiles (label,
  change pill, 26px value, hint, orange sparkline; no icons or menus), `ChartCard`s with a working chart-type
  picker, donuts with a centre total, the Mapbox revenue map, recent orders and top products. Static sample data
  with a "Sample data" tag; `AnimatedNumber` counts tiles up on period change.

## 10. Helper classes (`app/globals.css`)

| Class | Effect |
|---|---|
| `.material-frosted` | Frosted white surface (sticky bars, floating panels) |
| `.text-brand` | Orange text (`--brand-orange-text`) |
| `.bg-brand` | Orange background, white text, hover state |
| `.brand-link` | Orange link with hover state |
| `.brand-divider` | 1×24px vertical divider in `--light-gray` |
| `.checkbox-*` | The CRM checkbox (use the `Checkbox` component) |
| `.font-mono` | Work Sans with tabular figures and slashed zero |

Tailwind tokens added for this guide: `rounded-stage`, `rounded-tile`, `rounded-hero`, `shadow-lift`,
`shadow-float`, `ease-apple`, plus `text-subtle`, `text-faint`, `bg-off-white`, `border-light-gray`,
`text-success`, `bg-success-soft`, `text-error`, `bg-error-soft`.

## 11. Migration notes

The store moved onto this guide in October 2026. Navy, slate and `brand-blue` fills became charcoal; teal, old
orange `#FF7A00` and Tailwind blues became the orange tokens; slate greys became the neutral tokens; chart colours
use literal brand hexes because canvas can't read CSS variables. Left on purpose: status colours, payment and
social brand colours, the mobile-app colour pickers in `admin/app-styling`, and photos whose artwork is coloured.
Storefront code written before the tokens existed uses arbitrary values such as `rounded-[22px]`,
`rounded-[16px]`, `rounded-[32px]` and `hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]`; they equal
`rounded-tile`, `rounded-stage`, `rounded-hero` and `shadow-lift`. Prefer the tokens in new code.

## 12. Checklist for new UI

**Everywhere**
- [ ] Colours from tokens; no hex, no `brand-blue`, navy, teal or other blues.
- [ ] Work Sans only; weights ≤ 700; sentence case; nothing under 11px.
- [ ] One primary action per view; finished states use `success`, not orange.
- [ ] Orange text uses `brand-orange-text`; headings are charcoal.
- [ ] No resting shadows or decorative borders; `shadow-lift` only on hover, `shadow-float` for floating panels.
- [ ] Shared components: `Button`, `Checkbox`, `Icon`, Radix icons. No dead buttons.

**Storefront**
- [ ] Large tight headline with a subtitle; generous section spacing.
- [ ] White cards `rounded-tile` with the 1px `light-gray` CRM border (photo tiles and the hero without); card photos edge to edge (no padding) with `mix-blend-multiply`.
- [ ] Pill buttons; main action orange; text links "… ›" in orange.
- [ ] Frosted bars and arrows; `ease-apple` motion; respects reduced motion.

**Admin**
- [ ] CRM components: `StatCard`, `ChartCard` / `SmartChart`, `TabFilter`, `Pagination`, tables via `admin.css`.
- [ ] Charcoal primary buttons and active states; 12px radius; 1px `light-gray` card borders.
- [ ] Works in dark mode (tokens or a mapped utility).
