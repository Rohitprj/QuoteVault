---
name: Etheric Quotes
colors:
  surface: '#11131c'
  surface-dim: '#11131c'
  surface-bright: '#373943'
  surface-container-lowest: '#0c0e16'
  surface-container-low: '#191b24'
  surface-container: '#1e1f28'
  surface-container-high: '#282933'
  surface-container-highest: '#33343e'
  on-surface: '#e2e1ee'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#e2e1ee'
  inverse-on-surface: '#2e303a'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002388'
  primary-container: '#1349ec'
  on-primary-container: '#ced4ff'
  inverse-primary: '#164aed'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffb5a0'
  on-tertiary: '#601400'
  tertiary-container: '#af2d00'
  on-tertiary-container: '#ffcbbd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a0'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#872100'
  background: '#11131c'
  on-background: '#e2e1ee'
  surface-variant: '#33343e'
  background-dark: '#101522'
  surface-card: '#1c243a'
  surface-accent: '#232c48'
  mesh-indigo: '#1349ec'
  mesh-violet: '#6366f1'
  mesh-blue: '#3b82f6'
typography:
  display-hero:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  button-text:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 1rem
  element-gap: 1rem
  section-margin: 1.5rem
  touch-target: 2.5rem
---

## Brand & Style

Etheric Quotes is a premium, inspirational platform designed to evoke a sense of clarity, motivation, and modern sophistication. The brand personality is **modern, refined, and professional**, targeting individuals seeking personal growth through high-quality editorial content.

The design style is **Glassmorphic Modernism**. It blends deep, dark-mode surfaces with vibrant mesh gradients and blurred translucent layers. The aesthetic is clean and organized, yet feels energetic and high-end through the use of vivid indigo and cobalt accents paired with crisp, high-contrast typography. It avoids the heaviness of traditional dark modes by using "deep blue" neutrals rather than pure blacks, creating an atmospheric, immersive experience.

## Colors

The color palette is built on a foundation of **Deep Space Neutrals** and **Electric Indigo** accents. 

- **Primary & Secondary:** The core brand identity uses `#1349ec` (Electric Blue) and `#6366f1` (Indigo). These are used for high-impact actions, active states, and as base colors for vibrant mesh gradients.
- **Surface Palette:** Instead of pure black, the system uses a tiered navy-slate scale. `#101522` serves as the primary background, while `#1c243a` and `#232c48` provide structural depth for cards and input fields.
- **Glassmorphism:** Components frequently use semi-transparent white overlays (e.g., `white/20`) combined with backdrop blurs to create a sense of layering and "light" within a dark environment.

## Typography

The system relies exclusively on **Manrope**, a modern geometric sans-serif that balances technical precision with warmth.

- **Hero Typography:** Large quotes use an extra-bold, slightly italicized weight to emphasize the editorial nature of the content.
- **Hierarchy:** We use high-contrast weight distribution (ExtraBold for headers, Medium for body) to ensure clear information architecture in a dark-mode environment.
- **Utility Text:** Small labels and metadata use an all-caps, tracked-out style to provide a "technical" or "historical" feel without cluttering the UI.

## Layout & Spacing

The layout follows a **Fluid Mobile-First Model** with a safe-area margin of 16px (1rem). 

- **Grid:** On mobile, a single-column layout is used. For tablet and wider displays, a multi-column staggered "masonry" grid is preferred for quote cards.
- **Rhythm:** A base-4 unit system is employed. Standard component padding is 20px (1.25rem) to ensure content feels breathable. 
- **Sticky Elements:** The top navigation bar and bottom tab bar use `backdrop-blur-xl` to maintain context of the content scrolling beneath them.

## Elevation & Depth

Hierarchy is established through **Tonal Elevation** and **Ambient Shadows** rather than traditional drop shadows.

- **Level 0 (Background):** `#101522` - The canvas.
- **Level 1 (Cards/Inputs):** `#1c243a` or `#232c48` - Used for primary interaction areas. These have subtle 1px borders (`white/5` or `gray/800`) to define edges against the background.
- **Level 2 (Active Overlays):** Uses `shadow-lg` with a color-tinted glow (e.g., `shadow-primary/20`) to make active elements like selected categories feel like they are floating or emitting light.
- **The Hero Layer:** High-depth mesh gradients with `shadow-xl` to create a "focal point" for the daily featured content.

## Shapes

The shape language is **generously rounded**, reinforcing the friendly and premium feel of the brand.

- **Standard Cards:** 1rem (16px) or 1.5rem (24px) for larger hero units.
- **Interaction Elements:** Buttons and small icons are typically fully rounded (pill-shaped) or use 0.75rem (12px) for a "squircle" look.
- **Visual Continuity:** Every interactive element—from the search bar to the author avatars—must maintain soft edges to avoid visual tension.

## Components

- **Buttons:** 
  - *Primary:* Pill-shaped, background `#1349ec`, white text, soft shadow glow.
  - *Glass:* Semi-transparent white (`white/20`) with 20px backdrop blur for secondary actions over gradients.
- **Quote Cards:** Feature a top-left `format_quote` icon in a low-opacity primary tint. Content is centered or left-aligned with ample leading.
- **Category Chips:** Horizontal scrolling list. Active chips use the primary color with shadow; inactive chips use `#232c48` with neutral text.
- **Search Bar:** Integrated into a single rounded-xl container. Icons are tinted `#92a0c9` to distinguish from active text.
- **Bottom Navigation:** A signature "Floating Action Button" (FAB) in the center, elevated with a ring offset matching the background color to create a "cutout" effect.
- **Avatars:** Always circular with a subtle 1px border to ensure they pop against dark backgrounds.