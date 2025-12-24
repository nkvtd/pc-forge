import React from 'react';
import { PageContextProvider } from './usePageContext';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EmotionCache } from '@emotion/cache';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export function PageShell({children, pageContext, emotionCache,}: {
    children: React.ReactNode;
    pageContext: any;
    emotionCache: EmotionCache;
}) {
    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <CacheProvider value={emotionCache}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '100vh',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                            }}
                        >
                            <Navbar />
                            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                                {children}
                            </Box>
                            <Footer />
                        </Box>
                    </ThemeProvider>
                </CacheProvider>
            </PageContextProvider>
        </React.StrictMode>
    );
}
