/**
 * MUI theme type augmentation for custom palette colors
 */

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accentTurquoise: Palette['primary'];
    accentLavender: Palette['primary'];
    accentOrange: Palette['primary'];
  }

  interface PaletteOptions {
    accentTurquoise?: PaletteOptions['primary'];
    accentLavender?: PaletteOptions['primary'];
    accentOrange?: PaletteOptions['primary'];
  }
}
