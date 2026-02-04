/**
 * Light theme configuration
 */

import { createTheme } from '@mui/material/styles';
import { lightPalette, brand, shadows, radii } from './palette';
import { createTypography } from './typography';
import { createComponents } from './components';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: lightPalette.primary,
    secondary: lightPalette.secondary,
    background: lightPalette.background,
    text: {
      primary: lightPalette.text.primary,
      secondary: lightPalette.text.secondary,
    },
    divider: lightPalette.divider,
    // Custom palette extensions
    accentTurquoise: {
      main: brand.teal,
    },
    accentLavender: {
      main: brand.lavender,
    },
    accentOrange: {
      main: brand.orange,
    },
  },
  typography: createTypography(lightPalette.text.primary, lightPalette.text.secondary),
  shape: {
    borderRadius: radii.lg,
  },
  components: createComponents({
    mode: 'light',
    glassBackground: lightPalette.surface.glass,
    glassBorder: lightPalette.surface.glassBorder,
    glassHover: lightPalette.surface.glassHover,
    shadowSm: shadows.light.sm,
    shadowMd: shadows.light.md,
    shadowGlow: shadows.light.glow,
    inputBackground: 'rgba(243, 246, 250, 0.8)',
    inputBorder: lightPalette.divider,
    divider: lightPalette.divider,
  }),
});

export default lightTheme;
