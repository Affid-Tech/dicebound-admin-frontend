/**
 * Design tokens for the D&D Admin Panel
 * 2026 design trends: glassmorphism, dark mode, purposeful animations
 */

// Brand colors
export const brand = {
  teal: '#28D8C4',
  lavender: '#B79FFF',
  purple: '#7C6FFF',
  orange: '#FFA857',
} as const;

// Light mode palette
export const lightPalette = {
  background: {
    default: '#F5F3F0', // Cloud Dancer white
    paper: '#FFFFFF',
    elevated: 'rgba(255, 255, 255, 0.8)',
  },
  surface: {
    glass: 'rgba(255, 255, 255, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    glassHover: 'rgba(255, 255, 255, 0.75)',
  },
  text: {
    primary: '#1B1033',
    secondary: '#5A5A72',
    muted: '#7C8799',
    accent: brand.teal,
    onGlass: '#1B1033',
  },
  primary: {
    main: '#18628A',
    light: '#2A7BA6',
    dark: '#0F4D6E',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#48B8C4',
    light: '#6BCDD7',
    dark: '#329AA5',
    contrastText: '#FFFFFF',
  },
  divider: 'rgba(27, 16, 51, 0.09)',
} as const;

// Dark mode palette - deep mystical purples
export const darkPalette = {
  background: {
    default: '#0A0612', // Deepest purple-black
    paper: '#150F1F',
    elevated: '#1B1033',
  },
  surface: {
    glass: 'rgba(27, 16, 51, 0.65)',
    glassBorder: 'rgba(183, 159, 255, 0.15)',
    glassHover: 'rgba(27, 16, 51, 0.75)',
  },
  text: {
    primary: '#F5F3F0',
    secondary: '#B8B5C4',
    muted: '#7C7891',
    accent: brand.teal,
    onGlass: '#F5F3F0',
  },
  primary: {
    main: brand.teal,
    light: '#5CE8D7',
    dark: '#1EB8A8',
    contrastText: '#0A0612',
  },
  secondary: {
    main: brand.lavender,
    light: '#D4C4FF',
    dark: '#9A7FE8',
    contrastText: '#0A0612',
  },
  divider: 'rgba(183, 159, 255, 0.12)',
} as const;

// Iridescent gradient for buttons and accents
export const gradients = {
  iridescent: `linear-gradient(135deg, ${brand.teal} 0%, ${brand.purple} 50%, ${brand.lavender} 100%)`,
  iridescentHover: `linear-gradient(135deg, ${brand.teal} 0%, ${brand.purple} 60%, ${brand.lavender} 100%)`,
  iridescentSubtle: `linear-gradient(135deg, rgba(40, 216, 196, 0.1) 0%, rgba(124, 111, 255, 0.1) 50%, rgba(183, 159, 255, 0.1) 100%)`,
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  glassDark: 'linear-gradient(135deg, rgba(27, 16, 51, 0.3) 0%, rgba(27, 16, 51, 0.15) 100%)',
} as const;

// Glass effect tokens
export const glass = {
  blur: 'blur(16px)',
  blurStrong: 'blur(24px)',
  blurSubtle: 'blur(8px)',
} as const;

// Shadow tokens
export const shadows = {
  light: {
    sm: '0 2px 8px rgba(12, 8, 21, 0.06)',
    md: '0 4px 16px rgba(12, 8, 21, 0.08)',
    lg: '0 8px 32px rgba(12, 8, 21, 0.12)',
    glow: `0 4px 20px rgba(40, 216, 196, 0.15)`,
    glowLavender: `0 4px 20px rgba(183, 159, 255, 0.15)`,
  },
  dark: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: `0 4px 20px rgba(40, 216, 196, 0.25)`,
    glowLavender: `0 4px 20px rgba(183, 159, 255, 0.25)`,
  },
} as const;

// Motion tokens - durations in ms
export const motion = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    pageTransition: 400,
  },
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    spring: [0.175, 0.885, 0.32, 1.275],
  },
} as const;

// Border radius tokens
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
