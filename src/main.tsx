import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/muiTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* убирает стандартные стили браузера, делает фон dark */}
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);
