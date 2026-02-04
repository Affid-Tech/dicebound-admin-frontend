/**
 * Typography configuration with Exo 2 Variable font
 */

// Font family stack
export const fontFamily = [
  '"Exo 2 Variable"',
  '"Exo 2"',
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  'Arial',
  'sans-serif',
].join(',');

// Font weights for variable font
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// Create typography config for theme
export function createTypography(textPrimary: string, textSecondary: string) {
  return {
    fontFamily,
    fontWeightLight: fontWeights.light,
    fontWeightRegular: fontWeights.regular,
    fontWeightMedium: fontWeights.medium,
    fontWeightBold: fontWeights.bold,
    h1: {
      fontWeight: fontWeights.bold,
      fontSize: 'clamp(2rem, 6vw, 3rem)',
      letterSpacing: '0.03em',
      lineHeight: 1.2,
      color: textPrimary,
    },
    h2: {
      fontWeight: fontWeights.bold,
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      letterSpacing: '0.03em',
      lineHeight: 1.3,
      color: textPrimary,
    },
    h3: {
      fontWeight: fontWeights.semibold,
      fontSize: '2rem',
      letterSpacing: '0.02em',
      lineHeight: 1.3,
      color: textPrimary,
    },
    h4: {
      fontWeight: fontWeights.semibold,
      fontSize: '1.5rem',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
      color: textPrimary,
    },
    h5: {
      fontWeight: fontWeights.semibold,
      fontSize: '1.25rem',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
      color: textPrimary,
    },
    h6: {
      fontWeight: fontWeights.semibold,
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      color: textPrimary,
    },
    body1: {
      fontWeight: fontWeights.regular,
      fontSize: '1.125rem',
      letterSpacing: '0.3px',
      lineHeight: 1.6,
      color: textPrimary,
    },
    body2: {
      fontWeight: fontWeights.regular,
      fontSize: '1rem',
      letterSpacing: '0.3px',
      lineHeight: 1.6,
      color: textSecondary,
    },
    button: {
      fontWeight: fontWeights.semibold,
      fontSize: '1rem',
      letterSpacing: '0.03em',
      textTransform: 'none' as const,
      color: textPrimary,
    },
    caption: {
      fontWeight: fontWeights.regular,
      fontSize: '0.875rem',
      letterSpacing: '0.02em',
      lineHeight: 1.5,
      color: textSecondary,
    },
    overline: {
      fontWeight: fontWeights.semibold,
      fontSize: '0.75rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: textSecondary,
    },
  };
}
