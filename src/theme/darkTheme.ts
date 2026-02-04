/**
 * Dark theme configuration - deep mystical purples
 */

import { createTheme } from '@mui/material/styles';
import { darkPalette, brand, shadows, radii } from './palette';
import { createTypography } from './typography';
import { createComponents } from './components';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: darkPalette.primary,
    secondary: darkPalette.secondary,
    background: darkPalette.background,
    text: {
      primary: darkPalette.text.primary,
      secondary: darkPalette.text.secondary,
    },
    divider: darkPalette.divider,
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
  typography: createTypography(darkPalette.text.primary, darkPalette.text.secondary),
  shape: {
    borderRadius: radii.lg,
  },
  components: createComponents({
    mode: 'dark',
    glassBackground: darkPalette.surface.glass,
    glassBorder: darkPalette.surface.glassBorder,
    glassHover: darkPalette.surface.glassHover,
    shadowSm: shadows.dark.sm,
    shadowMd: shadows.dark.md,
    shadowGlow: shadows.dark.glow,
    inputBackground: 'rgba(21, 15, 31, 0.8)',
    inputBorder: darkPalette.divider,
    divider: darkPalette.divider,
  }),
});

export default darkTheme;
