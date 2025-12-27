import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ListItemText
} from "@mui/material";

import MemoryIcon from '@mui/icons-material/Memory';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import StorageIcon from '@mui/icons-material/Storage';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import RouterIcon from '@mui/icons-material/Router';
import LanIcon from '@mui/icons-material/Lan';
import SpeakerIcon from '@mui/icons-material/Speaker';
import AlbumIcon from '@mui/icons-material/Album';
import SdCardIcon from '@mui/icons-material/SdCard';
import CableIcon from '@mui/icons-material/Cable';

import LogoUrl from '../assets/projectlogo.png';
import { onGetAuthState } from "../pages/+Layout.telefunc";

import ComponentDialog from "./ComponentDialog";

type AuthState = { isLoggedIn: boolean; username: string | null; isAdmin?: boolean };

const COMPONENT_CATEGORIES = [
    { id: 'cpu', label: 'Processors', icon: <MemoryIcon fontSize="small" /> },
    { id: 'gpu', label: 'Graphics Cards', icon: <DeveloperBoardIcon fontSize="small" /> },
    { id: 'motherboard', label: 'Motherboards', icon: <DeveloperBoardIcon fontSize="small" /> },
    { id: 'memory', label: 'Memory (RAM)', icon: <SdStorageIcon fontSize="small" /> },
    { id: 'storage', label: 'Storage', icon: <StorageIcon fontSize="small" /> },
    { id: 'case', label: 'Cases', icon: <StorageIcon fontSize="small" /> },
    { id: 'power_supply', label: 'Power Supplies', icon: <StorageIcon fontSize="small" /> },
    { id: 'cooler', label: 'Cooling', icon: <StorageIcon fontSize="small" /> },

    // Peripherals / Accessories (Missing ones)
    { id: 'network_adapter', label: 'Network Adapters (WiFi)', icon: <RouterIcon fontSize="small" /> },
    { id: 'network_card', label: 'Network Cards (Ethernet)', icon: <LanIcon fontSize="small" /> },
    { id: 'sound_card', label: 'Sound Cards', icon: <SpeakerIcon fontSize="small" /> },
    { id: 'optical_drive', label: 'Optical Drives', icon: <AlbumIcon fontSize="small" /> },
    { id: 'memory_card', label: 'Memory Cards', icon: <SdCardIcon fontSize="small" /> },
    { id: 'cables', label: 'Cables', icon: <CableIcon fontSize="small" /> },
];


export default function Navbar() {
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const [browserOpen, setBrowserOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleComponentsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setBrowserOpen(true);
        handleMenuClose();
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpenLogoutDialog(true);
    };

    const confirmLogout = async () => {
        setAuth({ isLoggedIn: false, username: null, isAdmin: false });
        setOpenLogoutDialog(false);
        const csrfRes = await fetch("/api/auth/csrf");
        const { csrfToken } = await csrfRes.json();
        await fetch("/api/auth/signout", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ csrfToken: csrfToken, callbackUrl: "/" }),
        });
        window.location.href = "/";
    };

    useEffect(() => {
        let active = true;
        onGetAuthState()
            .then((data) => active && setAuth({
                isLoggedIn: data.isLoggedIn,
                username: data.username,
                isAdmin: data.isAdmin
            }))
            .catch(() => active && setAuth({ isLoggedIn: false, username: null, isAdmin: false }));
        return () => { active = false; };
    }, []);

    const checkDashboardUrl = auth?.isAdmin ? '/dashboard/admin' : '/dashboard/user';
    const onHoverNav = {
        color: 'inherit',
        '&:hover': { backgroundColor: '#ff8201', color: 'white', fontWeight: 'bold' }
    };

    return (
        <>
            <AppBar position="static" color="default" enableColorOnDark>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Box component="img" src={LogoUrl} alt="PC Forge Logo" sx={{ height: 40, mr: 2, cursor: 'pointer' }} onClick={() => window.location.href='/'} />
                        <Typography variant="h6" component="a" href="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
                            PC Forge
                        </Typography>
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <Button color="inherit" href="/forge" sx={onHoverNav}>Forge</Button>

                        <Button
                            color="inherit"
                            onClick={handleComponentsClick}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={onHoverNav}
                        >
                            Components
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                        >
                            {COMPONENT_CATEGORIES.map((cat) => (
                                <MenuItem key={cat.id} onClick={() => handleCategorySelect(cat.id)}>
                                    {/*<ListItemIcon>{cat.icon}</ListItemIcon>*/}
                                    <ListItemText>{cat.label}</ListItemText>
                                </MenuItem>
                            ))}
                        </Menu>

                        <Button color="inherit" href="/completed-builds" sx={onHoverNav}>Completed Builds</Button>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {auth?.isLoggedIn ? (
                            <>
                                <Button sx={onHoverNav} color="inherit" href={checkDashboardUrl}>{auth.username}</Button>
                                <Button sx={onHoverNav} color="inherit" onClick={handleLogoutClick}>Logout</Button>
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

            <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to leave the Forge?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
                    <Button onClick={confirmLogout} color="error" variant="contained" autoFocus>Logout</Button>
                </DialogActions>
            </Dialog>

            <ComponentDialog
                open={browserOpen}
                category={selectedCategory}
                onClose={() => setBrowserOpen(false)}
            />
        </>
    );
}
