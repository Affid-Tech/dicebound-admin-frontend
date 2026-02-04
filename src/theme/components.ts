/**
 * MUI component overrides with glassmorphism styling
 */

import type { Components, Theme } from '@mui/material/styles';
import { brand, gradients, glass, radii } from './palette';

type ThemeMode = 'light' | 'dark';

interface CreateComponentsOptions {
  mode: ThemeMode;
  glassBackground: string;
  glassBorder: string;
  glassHover: string;
  shadowSm: string;
  shadowMd: string;
  shadowGlow: string;
  inputBackground: string;
  inputBorder: string;
  divider: string;
}

export function createComponents(options: CreateComponentsOptions): Components<Theme> {
  const {
    mode,
    glassBackground,
    glassBorder,
    glassHover,
    shadowSm,
    shadowMd,
    shadowGlow,
    inputBackground,
    inputBorder,
    divider,
  } = options;

  const isDark = mode === 'dark';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: glassBackground,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: `1px solid ${glassBorder}`,
          borderRadius: radii.xl,
          boxShadow: shadowMd,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadowGlow,
            background: glassHover,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: radii.lg,
        },
        elevation1: {
          boxShadow: shadowSm,
        },
        elevation2: {
          boxShadow: shadowMd,
        },
        elevation3: {
          boxShadow: shadowMd,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: gradients.iridescent,
          boxShadow: shadowSm,
          color: isDark ? '#0A0612' : '#FFFFFF',
          '&:hover': {
            background: gradients.iridescentHover,
            boxShadow: shadowGlow,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderColor: brand.teal,
          color: brand.teal,
          backdropFilter: glass.blurSubtle,
          '&:hover': {
            backgroundColor: `${brand.teal}12`,
            borderColor: brand.teal,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: `${brand.teal}12`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: glassBackground,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          borderBottom: `1px solid ${glassBorder}`,
          boxShadow: shadowSm,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: glassBackground,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          borderRight: `1px solid ${glassBorder}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: glassBackground,
          backdropFilter: glass.blurStrong,
          WebkitBackdropFilter: glass.blurStrong,
          border: `1px solid ${glassBorder}`,
          borderRadius: radii.xl,
          boxShadow: shadowMd,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          background: inputBackground,
          border: `1px solid ${inputBorder}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&.Mui-focused': {
            borderColor: brand.teal,
            boxShadow: `0 0 0 3px ${brand.teal}25`,
          },
        },
        input: {
          '&::placeholder': {
            opacity: 0.6,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: inputBorder,
            transition: 'border-color 0.2s ease',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.teal,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.teal,
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            background: inputBackground,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          fontWeight: 500,
        },
        filled: {
          background: `${brand.teal}20`,
          color: brand.teal,
        },
        outlined: {
          borderColor: brand.teal,
          color: brand.teal,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            borderBottom: `2px solid ${divider}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: `${brand.teal}08`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${divider}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          backdropFilter: glass.blurSubtle,
        },
        standardSuccess: {
          background: `${brand.teal}15`,
          border: `1px solid ${brand.teal}30`,
        },
        standardError: {
          background: isDark ? 'rgba(244, 67, 54, 0.15)' : 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.3)',
        },
        standardWarning: {
          background: `${brand.orange}15`,
          border: `1px solid ${brand.orange}30`,
        },
        standardInfo: {
          background: `${brand.lavender}15`,
          border: `1px solid ${brand.lavender}30`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: glassBackground,
          backdropFilter: glass.blur,
          border: `1px solid ${glassBorder}`,
          borderRadius: radii.sm,
          boxShadow: shadowSm,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: radii.sm,
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              background: gradients.iridescent,
              color: isDark ? '#0A0612' : '#FFFFFF',
            },
            '&:hover': {
              background: `${brand.teal}20`,
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: brand.teal,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: radii.full,
          background: `${brand.teal}20`,
        },
        bar: {
          borderRadius: radii.full,
          background: gradients.iridescent,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          background: isDark ? 'rgba(183, 159, 255, 0.1)' : 'rgba(27, 16, 51, 0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: divider,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          margin: '2px 8px',
          transition: 'all 0.15s ease',
          '&.Mui-selected': {
            background: `${brand.teal}15`,
            '&:hover': {
              background: `${brand.teal}25`,
            },
          },
          '&:hover': {
            background: `${brand.teal}10`,
          },
        },
      },
    },
  };
}
