# Design System - Digital Dicebound Admin Panel

## Overview

This document describes the 2026 UI modernization of the D&D admin panel, implementing cutting-edge design trends while preserving the gaming aesthetic.

---

## Design Philosophy

### Core Principles

1. **Immersive Gaming Atmosphere** - Deep, mystical colors that evoke fantasy worlds
2. **Modern Glassmorphism** - Frosted glass effects creating depth and layering
3. **Purposeful Animation** - Motion that guides attention, not distracts
4. **Accessibility First** - All features respect user preferences (reduced motion, color contrast)
5. **Dark Mode Native** - Designed for dark mode first, with excellent light mode support

---

## Color Palette

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Teal | `#28D8C4` | Primary accent, CTAs, active states |
| Lavender | `#B79FFF` | Secondary accent, highlights |
| Purple | `#7C6FFF` | Gradient midpoint, hover states |
| Orange | `#FFA857` | Warnings, special highlights |

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F5F3F0` | Cloud Dancer white - page background |
| Paper | `#FFFFFF` | Cards, elevated surfaces |
| Glass | `rgba(255, 255, 255, 0.65)` | Glassmorphism surfaces |
| Glass Border | `rgba(255, 255, 255, 0.4)` | Glass element borders |
| Text Primary | `#1B1033` | Headings, body text |
| Text Secondary | `#5A5A72` | Captions, labels |
| Divider | `rgba(27, 16, 51, 0.09)` | Separators |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0612` | Deepest purple-black |
| Paper | `#150F1F` | Cards, elevated surfaces |
| Elevated | `#1B1033` | Higher elevation surfaces |
| Glass | `rgba(27, 16, 51, 0.65)` | Glassmorphism surfaces |
| Glass Border | `rgba(183, 159, 255, 0.15)` | Glass element borders (lavender tint) |
| Text Primary | `#F5F3F0` | Headings, body text |
| Text Secondary | `#B8B5C4` | Captions, labels |
| Divider | `rgba(183, 159, 255, 0.12)` | Separators |

### Gradients

```css
/* Iridescent - Primary buttons, accents */
linear-gradient(135deg, #28D8C4 0%, #7C6FFF 50%, #B79FFF 100%)

/* Glass overlay - Light mode */
linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)

/* Glass overlay - Dark mode */
linear-gradient(135deg, rgba(27, 16, 51, 0.3) 0%, rgba(27, 16, 51, 0.15) 100%)
```

---

## Glassmorphism

### Concept

Glassmorphism creates a frosted glass effect that adds depth while maintaining content visibility. Elements appear to float above the background.

### Implementation

```css
/* Glass Card */
background: rgba(255, 255, 255, 0.65);     /* or rgba(27, 16, 51, 0.65) for dark */
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.4); /* or rgba(183, 159, 255, 0.15) for dark */
border-radius: 24px;
box-shadow: 0 4px 16px rgba(12, 8, 21, 0.08);
```

### Blur Levels

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `blur(8px)` | Input backgrounds, tooltips |
| Standard | `blur(16px)` | Cards, navigation, dialogs |
| Strong | `blur(24px)` | Modal overlays, full-screen dialogs |

### When to Use

- **Cards** - Content containers, list items
- **Navigation** - AppBar, Drawer
- **Dialogs** - Modal windows, popups
- **Forms** - Input containers on desktop

### When NOT to Use

- Mobile views where performance matters
- Dense data tables (reduces readability)
- Over busy/patterned backgrounds

---

## Animation

### Philosophy

Animations should be:
- **Purposeful** - Guide user attention, provide feedback
- **Subtle** - Enhance, not distract
- **Performant** - Use GPU-accelerated properties (transform, opacity)
- **Accessible** - Respect `prefers-reduced-motion`

### Motion Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| Instant | 100ms | Reduced motion fallback |
| Fast | 200ms | Hover states, micro-interactions |
| Normal | 300ms | State changes, reveals |
| Slow | 500ms | Complex transitions |
| Page | 400ms | Route transitions |

### Easing Functions

```javascript
easeOut: [0.0, 0.0, 0.2, 1]      // Deceleration - entering elements
easeIn: [0.4, 0.0, 1, 1]         // Acceleration - exiting elements
easeInOut: [0.4, 0.0, 0.2, 1]    // Symmetric - moving elements
spring: [0.175, 0.885, 0.32, 1.275] // Bouncy - playful interactions
```

### Animation Patterns

#### Page Transitions
- Fade + slide up (12px) on enter
- Fade + slide up (-12px) on exit
- Duration: 400ms

#### List Items (Staggered)
- Fade + slide up (20px)
- Stagger delay: 80ms between items
- Duration: 300ms per item

#### Hover Effects
- Cards: translateY(-4px) + glow shadow
- Buttons: translateY(-1px) + enhanced shadow
- Duration: 200ms

#### Loading Spinner (D20)
- Outer ring rotation: 2s linear infinite
- Inner D20 pulse: 1.5s ease-in-out infinite
- Arc dash animation: 1.5s ease-in-out infinite

### Reduced Motion

When `prefers-reduced-motion: reduce`:
- All animations use 100ms duration
- Slide/transform animations become simple fades
- Infinite animations stop or become static

---

## Typography

### Font Stack

```css
font-family: "Exo 2 Variable", "Exo 2", Inter, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
```

### Variable Font

Exo 2 Variable supports weights 100-900, enabling smooth weight transitions and precise control.

### Scale

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | clamp(2rem, 6vw, 3rem) | 700 | Page titles |
| H2 | clamp(1.5rem, 4vw, 2.5rem) | 700 | Section headers |
| H3 | 2rem | 600 | Card titles |
| H4 | 1.5rem | 600 | Subsections |
| H5 | 1.25rem | 600 | List headers |
| H6 | 1rem | 600 | Small headers |
| Body1 | 1.125rem | 400 | Primary content |
| Body2 | 1rem | 400 | Secondary content |
| Button | 1rem | 600 | Button labels |
| Caption | 0.875rem | 400 | Helper text |
| Overline | 0.75rem | 600 | Labels, tags |

### Gradient Text

For hero titles, apply the iridescent gradient:

```css
background: linear-gradient(135deg, #28D8C4 0%, #7C6FFF 50%, #B79FFF 100%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Components

### GlassCard

Animated glassmorphism container with hover lift effect.

**Props:**
- `hoverable` - Enable hover animation (default: true)
- `glowColor` - Custom glow color on hover
- `padding` - Inner padding (default: 3 = 24px)
- `borderRadius` - Corner radius (default: 24px)

**Usage:**
```tsx
<GlassCard hoverable glowColor="rgba(40, 216, 196, 0.2)">
  <Typography variant="h5">Card Title</Typography>
  <Typography variant="body2">Card content...</Typography>
</GlassCard>
```

### PageTransition

Wraps route content with enter/exit animations.

**Features:**
- Automatic animation on route change
- Respects reduced motion preference
- Fade + slide animation

**Usage:**
```tsx
<PageTransition>
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
</PageTransition>
```

### AnimatedList

Renders children with staggered entrance animations.

**Props:**
- `staggerDelay` - Delay between items (default: 80ms)

**Usage:**
```tsx
<AnimatedList>
  {items.map(item => (
    <ListItem key={item.id}>{item.name}</ListItem>
  ))}
</AnimatedList>
```

### AnimatedListItem

Single animated item with configurable delay.

**Props:**
- `delay` - Animation delay in seconds

**Usage:**
```tsx
<AnimatedListItem delay={0.2}>
  <Typography>Animated content</Typography>
</AnimatedListItem>
```

### LoadingSpinner

D20-themed loading indicator with D&D aesthetic.

**Props:**
- `size` - Spinner size in pixels (default: 64)
- `text` - Loading message (default: "Загрузка...")
- `showText` - Show/hide text (default: true)

**Features:**
- Rotating outer ring with iridescent gradient
- Pulsing D20 shape in center
- Animated inner lines
- Theme-aware colors

### ThemeToggle

Dark/Light/System mode switcher.

**Props:**
- `iconColor` - Icon color (default: "inherit")

**Features:**
- Dropdown menu with three options
- Shows current mode icon (sun/moon)
- Persists choice to localStorage
- Respects system preference when set to "System"

---

## Shadows

### Light Mode

```css
--shadow-sm: 0 2px 8px rgba(12, 8, 21, 0.06);
--shadow-md: 0 4px 16px rgba(12, 8, 21, 0.08);
--shadow-lg: 0 8px 32px rgba(12, 8, 21, 0.12);
--shadow-glow: 0 4px 20px rgba(40, 216, 196, 0.15);
--shadow-glow-lavender: 0 4px 20px rgba(183, 159, 255, 0.15);
```

### Dark Mode

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 4px 20px rgba(40, 216, 196, 0.25);
--shadow-glow-lavender: 0 4px 20px rgba(183, 159, 255, 0.25);
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Chips, small buttons |
| md | 12px | Buttons, inputs |
| lg | 16px | Cards, dialogs |
| xl | 24px | Large cards, hero sections |
| full | 9999px | Pills, avatars |

---

## Dark Mode Implementation

### System Detection

```typescript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for changes
mediaQuery.addEventListener('change', (e) => {
  setSystemTheme(e.matches ? 'dark' : 'light');
});
```

### Persistence

Theme mode is stored in `localStorage` with key `theme-mode`.

Values: `"light"` | `"dark"` | `"system"`

### CSS Variables

The `data-theme` attribute is set on `<html>`:
```html
<html data-theme="dark">
```

Use in CSS:
```css
[data-theme="dark"] .element {
  background: var(--color-background);
}
```

---

## Accessibility

### Reduced Motion

All animations check `prefers-reduced-motion`:

```typescript
const prefersReducedMotion = useReducedMotion();

const duration = prefersReducedMotion
  ? 0.1  // 100ms
  : 0.3; // 300ms
```

CSS fallback:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid #28D8C4;
  outline-offset: 2px;
}
```

### Color Contrast

- Text on dark backgrounds maintains 4.5:1 contrast ratio
- Interactive elements have 3:1 contrast minimum
- Focus indicators are clearly visible in both modes

---

## File Structure

```
src/theme/
├── palette.ts       # Color tokens, gradients, shadows, motion
├── typography.ts    # Font configuration
├── components.ts    # MUI component overrides
├── lightTheme.ts    # Light mode theme
├── darkTheme.ts     # Dark mode theme
├── muiTheme.ts      # Re-exports for compatibility
└── theme.d.ts       # TypeScript declarations

src/context/
└── ThemeContext.tsx # Theme provider with system detection

src/hooks/
└── useReducedMotion.ts # Accessibility hook

src/components/
├── GlassCard.tsx      # Glassmorphism card
├── PageTransition.tsx # Route animations
├── AnimatedList.tsx   # Staggered list animations
├── LoadingSpinner.tsx # D20-themed spinner
└── ThemeToggle.tsx    # Dark/light switcher
```

---

## Browser Support

- Chrome 88+ (backdrop-filter)
- Firefox 103+ (backdrop-filter)
- Safari 15+ (backdrop-filter)
- Edge 88+

For older browsers, glassmorphism degrades gracefully to solid backgrounds.
