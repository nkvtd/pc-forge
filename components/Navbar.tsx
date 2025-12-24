import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import LogoUrl from '../assets/projectlogo.png';
import {onGetAuthState} from "../pages/+Layout.telefunc";


type AuthState = { isLoggedIn: boolean; username: string | null };

export default function Navbar() {
    const [auth, setAuth] = useState<AuthState | null>(null);

    const handleLogout = async (e: React.MouseEvent) => { // funkcija za logout da go resetira auth state, za da ne go pise username-ot u navbar, plus te vrakja na login nazad
        e.preventDefault();

        setAuth({ isLoggedIn: false, username: null });
        window.location.href = "/api/auth/signout?callbackUrl=/auth/login";
    };

    useEffect(() => {
        let active = true;
        onGetAuthState()
            .then((data) => active && setAuth({ isLoggedIn: data.isLoggedIn, username: data.username }))
            .catch(() => active && setAuth({ isLoggedIn: false, username: null }));
        return () => { active = false; };
    }, []);

    const onHoverNav = {
        color: 'inherit',
        '&:hover': {
            backgroundColor: '#ff8201',
            color: 'white',
            fontWeight: 'bold',
        }
    };

    return (
        <AppBar position="static" color="default" enableColorOnDark>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                    <Box
                        component="img"
                        src={LogoUrl}
                        alt="PC Forge Logo"
                        sx={{ height: 40, mr: 2, cursor: 'pointer' }}
                    />
                    <Typography
                        variant="h6"
                        component="a"
                        href="/"
                        sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
                    >
                        PC Forge
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2}}>
                    <Button color="inherit" href="/forge" sx={onHoverNav}>Forge</Button>
                    <Button color="inherit" href="/components" sx={onHoverNav}>Components</Button>
                    <Button color="inherit" href="/completed-builds" sx={onHoverNav}>Completed Builds</Button>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {auth?.isLoggedIn ? (
                        <>
                            <Button sx={onHoverNav} color="inherit" href="/dashboard/user">{auth.username}</Button>
                            <Button sx={onHoverNav} color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" href="/auth/login">Login</Button>
                            <Button color="inherit" href="/auth/register">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
