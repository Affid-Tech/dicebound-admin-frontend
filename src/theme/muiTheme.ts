import { createTheme } from '@mui/material/styles';

// Light theme palette
const palette = {
    primary: {
        main: '#18628A',      // Deep blue for light theme primary
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#48B8C4',      // Lighter teal for light theme
        contrastText: '#FFFFFF',
    },
    accentTurquoise: {
        main: '#28D8C4',      // Keep your brand accent
    },
    accentLavender: {
        main: '#B79FFF',
    },
    accentOrange: {
        main: '#FFA857',
    },
    background: {
        default: '#F8F9FB',   // light gray background
        paper: '#FFFFFF',     // cards, dialogs, etc.
        light: '#F3EFE7',     // parchment for cards (optional)
    },
    text: {
        primary: '#1B1033',   // dark purple for contrast
        secondary: '#7C8799', // softer gray for secondary text
        accent: '#28D8C4',
        orange: '#FFA857',
    },
};

const theme = createTheme({
    palette: {
        ...palette,
        mode: 'light', // important for contrast
        background: {
            default: '#F8F9FB',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: [
            '"Exo 2"',
            'Inter',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
            fontSize: 'clamp(2rem, 6vw, 3rem)', // 32-48px
            letterSpacing: '0.03em',
            color: '#1B1033',
        },
        h2: {
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            letterSpacing: '0.03em',
            color: '#1B1033',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
            color: '#1B1033',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#1B1033',
        },
        body1: {
            fontWeight: 400,
            fontSize: '1.125rem', // 18px
            letterSpacing: '0.3px',
            color: '#1B1033',
        },
        body2: {
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.3px',
            color: '#7C8799',
        },
        button: {
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '0.03em',
            color: '#1B1033',
        },
    },
    shape: {
        borderRadius: 16, // cards
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background: '#FFFFFF',
                    borderRadius: 24,
                    boxShadow: '0 2px 12px 0 rgba(12, 8, 21, 0.08)', // softer shadow for light mode
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 600,
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #28D8C4 0%, #B79FFF 100%)',
                    boxShadow: '0 2px 6px 0 rgba(12, 8, 21, 0.12)',
                    '&:hover': {
                        filter: 'brightness(0.98)',
                        boxShadow: '0 4px 16px 0 rgba(12, 8, 21, 0.16)',
                    },
                },
                outlined: {
                    borderColor: '#28D8C4',
                    color: '#28D8C4',
                    '&:hover': {
                        backgroundColor: 'rgba(40,216,196,0.07)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    background: '#F3F6FA', // subtle light background
                    border: '1px solid rgba(27,16,51,0.09)',
                    color: '#1B1033',
                    '&.Mui-focused': {
                        border: '2px solid #28D8C4',
                        boxShadow: '0 0 4px 0 #28D8C4',
                    },
                },
                input: {
                    fontFamily: '"Exo 2", Inter, Arial, sans-serif',
                },
            },
        },
    },
});

export default theme;
