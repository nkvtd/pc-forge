import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BuildIcon from '@mui/icons-material/Build';
import ViewListIcon from '@mui/icons-material/ViewList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
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
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [mobileComponentsOpen, setMobileComponentsOpen] = useState(false);

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
        setMobileDrawerOpen(false);
        setMobileComponentsOpen(false);
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpenLogoutDialog(true);
        setMobileDrawerOpen(false);
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, md: 4 } }}>
                        <Box
                            component="img"
                            src={LogoUrl}
                            alt="PC Forge Logo"
                            sx={{ height: 40, mr: { xs: 1, md: 2 }, cursor: 'pointer' }}
                            onClick={() => window.location.href='/'}
                        />
                        <Typography
                            variant="h6"
                            component="a"
                            href="/"
                            sx={{
                                textDecoration: "none",
                                color: "inherit",
                                fontWeight: "bold",
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
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
                                    <ListItemIcon>{cat.icon}</ListItemIcon>
                                    <ListItemText>{cat.label}</ListItemText>
                                </MenuItem>
                            ))}
                        </Menu>

                        <Button color="inherit" href="/completed-builds" sx={onHoverNav}>Completed Builds</Button>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {auth?.isLoggedIn ? (
                            <>
                                <Button sx={onHoverNav} color="inherit" href={checkDashboardUrl}>{auth.username}</Button>
                                <Button sx={onHoverNav} color="inherit" onClick={handleLogoutClick}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" href="/auth/login" sx={onHoverNav}>Login</Button>
                                <Button color="inherit" href="/auth/register" sx={onHoverNav}>Register</Button>
                            </>
                        )}
                    </Box>

                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={() => setMobileDrawerOpen(true)}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: 280 , height: '60%'}
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Menu</Typography>
                    <IconButton onClick={() => setMobileDrawerOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />

                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { window.location.href = '/forge'; }}>
                            <ListItemIcon><BuildIcon /></ListItemIcon>
                            <ListItemText primary="Forge" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setMobileComponentsOpen(!mobileComponentsOpen)}>
                            <ListItemIcon><ViewListIcon /></ListItemIcon>
                            <ListItemText primary="Components" />
                            {mobileComponentsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={mobileComponentsOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {COMPONENT_CATEGORIES.map((cat) => (
                                <ListItemButton
                                    key={cat.id}
                                    sx={{ pl: 4 }}
                                    onClick={() => handleCategorySelect(cat.id)}
                                >
                                    <ListItemIcon>{cat.icon}</ListItemIcon>
                                    <ListItemText primary={cat.label} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { window.location.href = '/completed-builds'; }}>
                            <ListItemIcon><ViewListIcon /></ListItemIcon>
                            <ListItemText primary="Completed Builds" />
                        </ListItemButton>
                    </ListItem>

                    <Divider sx={{ my: 1 }} />

                    {auth?.isLoggedIn ? (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { window.location.href = checkDashboardUrl; }}>
                                    <ListItemIcon><PersonIcon /></ListItemIcon>
                                    <ListItemText primary={"My Profile"} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogoutClick}>
                                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { window.location.href = '/auth/login'; }}>
                                    <ListItemIcon><LoginIcon /></ListItemIcon>
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { window.location.href = '/auth/register'; }}>
                                    <ListItemIcon><PersonAddIcon /></ListItemIcon>
                                    <ListItemText primary="Register" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>

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
