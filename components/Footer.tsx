import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import footerLogoUrl from '../assets/projectlogo.png';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>

                <Box
                    component="img"
                    src={footerLogoUrl}
                    alt="Footer Logo"
                    sx={{
                        height: 30,
                        mr: 2
                    }}
                />

                <Typography variant="body2" color="text.secondary">
                    {'© '}
                    {new Date().getFullYear()}
                    {' PC Forge. All rights reserved.'}
                </Typography>

            </Box>
        </Box>
    );
}
