import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#ff8201' },
        background: { default: '#121212', paper: '#1e1e1e' },
    },
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
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
    );
}
