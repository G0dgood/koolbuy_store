# Koolbuy Design System: Apple-inspired

> Adapted from the Apple DESIGN.md analysis in
> [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/apple),
> applied to Koolbuy. We borrow Apple's *grammar* (restraint, one accent, tight
> type, hairlines, full-bleed tiles). We do not copy Apple's logos, product imagery
> or copy.
>
> The previous Chowdeck-inspired system lives in git history (commit `bf7bb8f`).

Every token below is implemented in `app/globals.css` (storefront) and
`app/admin/admin.css` (admin overrides). Use tokens, not raw hex codes.

---

## 1. Principles

1. **The product is the hero.** UI chrome recedes. Photography and product renders carry the page.
2. **One accent.** Action Blue `#0066cc` is the only "click me" color: links, pill CTAs, focus, selection.
3. **Flat by default.** Cards get a 1px hairline, never a shadow. Only floating layers (menus, modals) get a soft shadow.
4. **Tight, quiet type.** Headlines weigh 600 with negative tracking. Body is 17px / 400 / 1.47.
5. **The color change is the divider.** Sections alternate white, parchment `#f5f5f7` and near-black tiles instead of using borders.
6. **Press = scale(0.95).** That is the only micro-interaction on buttons.

## 2. Color

| Token | Hex | Use |
|---|---|---|
| `action` | `#0066cc` | Every interactive element: pills, links, selection, focus root |
| `action-hover` | `#0058b0` | Hover on blue pills |
| `action-light` | `#f0f7ff` | Selected rows and sub-items (admin) |
| `action-on-dark` | `#2997ff` | Links and accents on dark tiles only |
| focus ring | `#0071e3` | 2px outline on keyboard focus; 2px border on selected chips |
| `ink` | `#1d1d1f` | All text on light surfaces |
| `gray-600` / `gray-500` | `#6e6e73` / `#86868b` | Secondary text, taglines, captions |
| `cream` (parchment) | `#f5f5f7` | Page canvas, footer, image wells, admin canvas |
| `pearl` | `#fafafc` | Quiet secondary button fill |
| `white` | `#ffffff` | Cards, header glass, newsletter tile |
| `tile` / `tile-2` | `#272729` / `#2a2a2c` | Near-black tiles (vendor block, dark sections) |
| `hairline` | `#e0e0e0` | 1px card borders and dividers |
| `eyebrow` | `#b64400` | "New" / "Save 8%" labels only. Text, never interactive. It nods to Koolbuy's orange logo. |

Tailwind's `gray-*` and `slate-*` scales are remapped to Apple's neutrals and `blue-*` to the
Action Blue scale, so existing utility classes follow the system. Legacy tokens (`brand-blue`,
`brand-orange`, `mustard`, …) are aliased into this palette so older markup keeps working.

## 3. Typography

**Stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, …`
SF Pro renders on Apple devices, and Inter (loaded via `next/font`) renders elsewhere.

| Role | Size (desktop / mobile) | Weight | Tracking | Where |
|---|---|---|---|---|
| Hero display | 48–56 / 32–34 px | 600 | -0.025em | "Introducing our products.", newsletter |
| Display | 40 / 28 px | 600 | -0.02em | Tile headlines, product title |
| Section head | 34 / 24 px | 600 | -0.02em | Two-tone shelf headers |
| Tagline | 21–24 / 19 px | 400 | -0.01em | Grey sub-lines |
| Body | 17 px | 400 | -0.015em | Default |
| Card title | 15 px | 600 | — | Product names |
| Caption | 12–14 px | 400/600 | — | Meta, eyebrows, footer |

**Weight ladder is 300 / 400 / 600 / 700.** Tailwind's `font-medium` maps to 400,
`font-bold`/`font-extrabold` to 600 and `font-black` to 700, so legacy classes stay inside the ladder.

**Two-tone headline pattern** (store shelves):
`<span class="text-ink">New products.</span> <span class="text-gray-500">Fresh from verified vendors.</span>`

## 4. Shape

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 5px | Tiny chips |
| `rounded-md` | 8px | Utility buttons, inner image wells |
| `rounded-lg` | 11px | Inputs, small cards |
| `rounded-2xl` / `3xl` | 18px | Store utility cards, feature tiles, modals |
| `rounded-full` | pill | Every primary CTA, search, option chips |
| none | 0 | Full-bleed hero and tiles |

Admin forces a single 12px card radius (see `admin.css` §3).

## 5. Elevation

- **Flat:** `shadow-xs`, `shadow-sm` and `shadow` resolve to `none`, and cards use a hairline.
- **Floating layers:** `shadow-md` … `shadow-2xl` are whisper-soft, for menus, dropdowns and modals.
- **Glass:** header, admin header and admin sidebar use `bg-white/80 + backdrop-blur-xl + saturate(180%)`.
- **Product images** sit on a parchment well with `mix-blend-mode: multiply` (`.kb-product-img`), so
  white-background photos blend into the well.

## 6. Components

**Buttons** (`Button.tsx`, default shape = pill)
- `primary`: blue pill, white 400 label.
- `secondary`: ghost pill (blue text and 1px blue border).
- `outline`: pearl capsule.
- `ghost`: blue text.
- Press is `scale(0.95)`. Focus is a 2px `#0071e3` ring.

**Text link:** `.kb-link`: blue, with a chevron in the copy ("See all ›", "Learn more ›").

**Header:** 56–64px frosted white bar with a hairline bottom and 13px text links. Its only
colored element is the blue "Marketplace" pill. Above it sits a thin black announcement strip
with a Sky Blue "Join now ›".

**Hero:** full-bleed, no rounding. Controls are 44px translucent chips `rgba(210,210,215,.64)`.

**Option chips** (categories): white pill, 1px `#d2d2d7`; selected = 2px `#0071e3` border.

**Store utility card** (`.kb-card`): white, 1px hairline, 18px radius, 16–20px padding.
Image well is parchment with 8–11px radius. Content order: eyebrow (optional), then name (600),
then vendor (12px grey), then price (400), then a small blue "Buy" pill.

**Dark tile:** `bg-tile`, white 600 headline, `#cccccc` body, blue pill CTA.

**Footer:** parchment, 12px dense link columns (line-height 2.2), hairline dividers, legal row.

**Admin:** macOS-style glass sidebar with 11px grey section labels, 13px items and a blue
selected row. The canvas is parchment, with white hairline cards and 600-weight stat numbers.

## 7. Don'ts

- No second accent color, no gradients, no decorative blobs, stickers or squiggles.
- No shadows on cards, buttons or text.
- Don't round full-bleed sections.
- Don't use `action-on-dark` on light surfaces.
- Avoid uppercase letter-spaced labels in new work. Apple sets labels in sentence case.
