import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import {CssBaseline} from "@mui/material";
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <CssBaseline />
            <App />
    </React.StrictMode>,
);
