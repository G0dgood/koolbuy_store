# Koolbuy Design System — "Kool & Delicious"

> A Chowdeck-inspired visual language for Koolbuy.
> Chowdeck's whole brand fits in one word: **delight**. Bold type, a warm,
> saturated palette on a creamy canvas, big friendly rounded shapes, playful
> sticker-style tags and little squiggle accents. We borrow that *feeling* and
> apply it to Koolbuy's own identity (Kool Orange + solar-powered cold storage).
> We do not copy Chowdeck's logo, illustrations or brand assets.

Everything below is implemented as tokens in `app/globals.css`. Use the tokens,
not raw hex codes, in new code.

---

## 1. Principles

1. **Warm, not sterile.** The canvas is cream, never cold grey-blue. Neutrals are
   warm (stone), borders are soft and barely there.
2. **Bold type does the talking.** Headlines are heavy (800), tight, confident.
   Body copy is calm and readable.
3. **Round and friendly.** Generous radii everywhere; pills for actions and tags.
4. **Two hero colors, used with intent.** Kool Orange = action. Deep Kool (forest ink) =
   structure and trust. Mustard, tomato and frost are *accents*, used sparingly.
5. **Soft depth.** Cards float on warm, diffuse shadows, and lift on hover.
6. **Delight in the details.** Sticker badges, a squiggle under a section title,
   springy hover states — small touches, never noise.

---

## 2. Color

### Core
| Token | Hex | Use |
|---|---|---|
| `--brand-orange` / `primary` | `#FF7A00` | Primary buttons, prices, active states, key highlights |
| `--brand-orange-hover` | `#EA6A00` | Hover/pressed on orange |
| `--brand-orange-light` | `#FFF1E3` | Orange tint backgrounds, chips |
| `--ink` (Deep Kool) | `#0F3D2E` | Headings, dark sections, footer, admin sidebar, secondary buttons |
| `--ink-soft` | `#1E5A45` | Hover on ink, secondary text on light |
| `--brand-blue`* | `#0F3D2E` | *Legacy name*, now maps to Deep Kool |
| `--brand-blue-light`* | `#E7F3EC` | *Legacy name*, now the Mint tint |

### Accents (sparingly: badges, illustrations, category tiles)
| Token | Hex | Use |
|---|---|---|
| `--mustard` | `#FFC23D` | "Hot deal" stickers, ratings, highlights |
| `--tomato` | `#F0533A` | Discounts, sale badges, destructive |
| `--frost` | `#D6EEF8` | Cold-chain / freezer cues, info tints |
| `--mint` | `#E7F3EC` | Success tints, soft green panels |

### Neutrals (warm)
| Token | Hex | Use |
|---|---|---|
| `--cream` / `background` | `#FFF8EF` | Page canvas |
| `--card` | `#FFFFFF` | Cards, inputs, popovers |
| `--foreground` | `#1C1917` | Body text |
| `--muted-foreground` | `#78716C` | Secondary text |
| `--border` | `#F0E6D8` | Hairlines and card borders |

Tailwind's `gray-*` and `slate-*` scales are re-tuned to warm stone tones, so
existing `text-gray-500`, `bg-gray-50` etc. automatically feel warm.

**Contrast:** body text on cream ≥ 12:1; white on orange is for bold/large text
and buttons (use weight 700+). Never put orange text on mustard.

---

## 3. Typography

**Family:** Plus Jakarta Sans (the open-source sibling of Chowdeck's Plus Jakarta
Display) for everything. Geist Mono for codes/IDs only.

| Role | Size (desktop / mobile) | Weight | Tracking |
|---|---|---|---|
| Display (hero) | 56 / 36 px | 800 | -0.03em |
| H1 | 40 / 30 px | 800 | -0.025em |
| H2 (section title) | 28 / 22 px | 800 | -0.02em |
| H3 (card title) | 18 / 16 px | 700 | -0.01em |
| Body | 15–16 px | 500 | 0 |
| Small / meta | 13 px | 500 | 0 |
| Eyebrow / tag | 11–12 px | 800, UPPERCASE | 0.08em |

Section titles get the **squiggle underline** (`.kb-squiggle`) in orange.

---

## 4. Shape & spacing

- Base radius `--radius: 0.875rem` (14px). Scale: sm 8 · md 12 · lg 14 · xl 18 · 2xl 22 · 3xl 26.
- Product and content cards: `rounded-3xl` feel (22–26px).
- Buttons, search, chips, tags: **pill** (`rounded-full`).
- Spacing on a 4px grid; section gap 64–96px desktop, 40px mobile.
- Content max width 1440px, gutters 16 / 40 / 64px.

## 5. Elevation

| Token | Value | Use |
|---|---|---|
| `--shadow-soft` | `0 1px 2px rgba(28,25,23,.04), 0 8px 24px -12px rgba(28,25,23,.12)` | Resting cards |
| `--shadow-lift` | `0 2px 4px rgba(28,25,23,.04), 0 20px 40px -16px rgba(28,25,23,.22)` | Hover, popovers |
| `--shadow-pop` | `0 10px 24px -8px rgba(255,122,0,.55)` | Primary CTA glow |

Utility classes: `.kb-card` (white, border, soft shadow, lifts on hover).

## 6. Components

**Buttons**
- Primary: orange fill, white 700 text, pill, orange glow; hover darker + lift 1px.
- Secondary: Deep Kool fill, white text, pill.
- Ghost: transparent, ink text, warm-border pill; hover cream-dark fill.

**Product card:** white, 22px radius, 1px warm border, soft shadow; image area on a
cream-tinted well with rounded corners; name 600, price 800 in ink; on hover the card
lifts 4px and the image zooms 4%. Discount sticker in tomato, top-left, pill.

**Tags / stickers** (`.kb-sticker`): 800 uppercase 11px, pill, slight -2° rotation
for "street-sign" personality (Chowdeck's restaurant tags idea). Colors: mustard/ink,
tomato/white, mint/ink.

**Header:** white with blur, soft bottom border; search is a pill field with the
orange pill button nested inside. Marquee strip in Deep Kool with mustard highlights.

**Section header:** eyebrow sticker + H2 + squiggle; "See all" is a ghost pill with
an arrow that nudges on hover.

**Footer:** Deep Kool background, cream text, orange accents, rounded-top.

**Admin:** same tokens. Sidebar in Deep Kool with cream text; active item is an
orange pill. Canvas cream, cards white with soft shadow, stat numbers 800 weight.

## 7. Motion

- Standard ease `cubic-bezier(.2,.8,.2,1)`, 200–300ms.
- Hover: lift (translateY -2 to -4px) + shadow-lift. Buttons press down 1px on active.
- Respect `prefers-reduced-motion`: all decorative animation off.

## 8. Voice

Warm, short, a little playful: "Keep it kool.", "Fresh deals, just landed",
"Sell more, stress less." Avoid corporate filler.
