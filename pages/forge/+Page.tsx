import React, {useState, useEffect, useMemo} from 'react';
import {
    Container, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Avatar, TextField, Grid, Chip, CircularProgress,
    Menu, MenuItem, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import AlbumIcon from "@mui/icons-material/Album";
import CableIcon from "@mui/icons-material/Cable";
import RouterIcon from "@mui/icons-material/Router";
import MemoryIcon from "@mui/icons-material/Memory";

import {
    saveBuildState,
    onAddComponentToBuild,
    onRemoveComponentFromBuild,
    onDeleteBuild,
    onGetBuildState,
    onGetBuildComponents
} from './forge.telefunc';

import ComponentDialog from '../../components/ComponentDialog';
import ComponentDetailsDialog from '../../components/ComponentDetailsDialog';
import {onAddNewBuild, onGetComponentDetails} from "../+Layout.telefunc";
import {onEditBuild} from "../dashboard/user/userDashboard.telefunc";
import {BuildSlot, INITIAL_SLOTS} from "./types/buildTypes";
import {renderSpecs} from "./utils/RenderSpecs";
import {
    getMaxRamSlots,
    calculateUsedRamSlots,
    calculateUsedStorageSlots
} from "./utils/componentCalculations";
import {Snackbar, Alert} from '@mui/material';

export default function ForgePage() {
    const [slots, setSlots] = useState<BuildSlot[]>(INITIAL_SLOTS);
    const [buildId, setBuildId] = useState<number | null>(null);
    const [buildName, setBuildName] = useState("");
    const [description, setDescription] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [browserOpen, setBrowserOpen] = useState(false);
    const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [tempDescription, setTempDescription] = useState("");
    const isSubmittedRef = React.useRef(false);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'error' | 'warning' | 'info' | 'success';
    }>({
        open: false,
        message: '',
        severity: 'info'
    });

    useEffect(() => {
        const price = slots.reduce((sum, slot) => {
            const quantity = slot.component?.quantity || 1;
            return sum + (Number(slot.component?.price) || 0) * quantity;
        }, 0);
        setTotalPrice(price);
    }, [slots]);

    useEffect(() => {
        if (buildId && buildName.trim()) {
            const timeoutId = setTimeout(() => {
                saveBuildState({buildId, name: buildName.trim(), description});
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [buildId, buildName, description]);

    useEffect(() => {
        if (!buildId) return;

        const handleBeforeUnload = () => {
            if (!isSubmittedRef.current) {
                onDeleteBuild({buildId}).catch(() => {
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (!isSubmittedRef.current) {
                onDeleteBuild({buildId}).catch(() => {
                });
            }
        };
    }, [buildId]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlBuildId = urlParams.get('buildId');

        if (urlBuildId && Number.isInteger(Number(urlBuildId)) && Number(urlBuildId) > 0) {
            const loadBuildId = Number(urlBuildId);

            onGetBuildState({buildId: loadBuildId})
                .then((buildState) => {
                    if (buildState) {
                        setBuildId(loadBuildId);
                        setBuildName(buildState.build.name);
                        setDescription(buildState.build.description || "");
                    }
                })
                .catch(() => {
                })
                .finally(() => {
                    onGetBuildComponents({buildId: loadBuildId})
                        .then(async (components) => {
                            if (components && components.length > 0) {
                                const detailedComponents = await Promise.all(
                                    components.map(async (c: any) => {
                                        const full = await onGetComponentDetails({componentId: c.id}).catch(() => null);
                                        return full ? {
                                            ...c,
                                            ...full,
                                            details: full?.details,
                                            quantity: c.quantity || 1
                                        } : {...c, quantity: c.quantity || 1};
                                    })
                                );

                                const componentMap = new Map();
                                detailedComponents.forEach((c: any) => componentMap.set(c.type, c));

                                setSlots(prevSlots => prevSlots.map(slot => {
                                    const match = componentMap.get(slot.type);
                                    return match ? {...slot, component: match} : slot;
                                }));

                                window.history.replaceState({}, document.title, "/forge");
                            }
                        })
                        .catch(() => {
                        });
                });
        }
    }, []);

    const handlePickPart = (slotId: string) => {
        setActiveSlotId(slotId);
        setTimeout(() => setBrowserOpen(true), 0);
    };

    const handleSelectComponent = async (component: any) => {
        if (!activeSlotId) return;

        try {
            let id = buildId;
            if (!id) {
                const result = await onAddNewBuild({
                    name: buildName.trim() || "New Build",
                    description: description || "Work in progress"
                });
                id = typeof result === 'number' ? result : (result as any)?.buildId;
                if (!id || !Number.isInteger(id) || id <= 0) {
                    setSnackbar({
                        open: true,
                        message: 'Failed to create draft build. Please try again.',
                        severity: 'error'
                    });
                    return;
                }
                setBuildId(id);
            }

            const full = await onGetComponentDetails({componentId: component.id}).catch(() => null);
            const merged = full ? {...component, ...full, details: full.details, quantity: 1} : {
                ...component,
                quantity: 1
            };

            setSlots(prev => prev.map(slot =>
                slot.id === activeSlotId ? {...slot, component: merged} : slot
            ));
            setBrowserOpen(false);

            await onAddComponentToBuild({buildId: id, componentId: component.id});
        } catch (e) {
            setSnackbar({
                open: true,
                message: 'Failed to add component to build. Please try again.',
                severity: 'error'
            });
        } finally {
            setActiveSlotId(null);
        }
    };

    const handleRemovePart = async (slotId: string) => {
        const slot = slots.find(s => s.id === slotId);
        if (!slot?.component || !buildId) return;

        const quantity = slot.component.quantity || 1;

        setSlots(prev => prev.map(s =>
            s.id === slotId ? {...s, component: null} : s
        ));

        try {
            for (let i = 0; i < quantity; i++) {
                await onRemoveComponentFromBuild({
                    buildId,
                    componentId: slot.component.id
                });
            }
        } catch (e) {
            console.error("Failed to remove component from server", e);
        }
    };

    const handleIncrementComponent = async (slotId: string) => {
        const slot = slots.find(s => s.id === slotId);
        if (!slot?.component || !buildId) return;

        if (slot.type === 'memory') {
            const maxSlots = getMaxRamSlots(slots);
            const currentUsed = calculateUsedRamSlots(slots);
            const modules = Number(slot.component.details?.modules || slot.component.modules || 1);

            if (maxSlots && (currentUsed + modules > maxSlots)) {
                setSnackbar({
                    open: true,
                    message: `Cannot add more RAM. Motherboard has only ${maxSlots} slots and ${currentUsed} are currently used.`,
                    severity: 'error'
                });
                return;
            }
        }

        if (slot.type === 'storage') {
            const formFactor = slot.component.details?.formFactor || slot.component.formFactor;
            const maxSlots = 4;
            const currentUsed = calculateUsedStorageSlots(slots, formFactor);

            if (maxSlots && (currentUsed + 1 > maxSlots)) {
                setSnackbar({
                    open: true,
                    message: `Cannot add more ${formFactor} storage. Motherboard has only ${maxSlots} slots and ${currentUsed} are currently used.`,
                    severity: 'error'
                });
                return;
            }
        }

        try {
            await onAddComponentToBuild({buildId, componentId: slot.component.id});

            setSlots(prev => prev.map(s =>
                s.id === slotId && s.component
                    ? {...s, component: {...s.component, quantity: (s.component.quantity || 1) + 1}}
                    : s
            ));
        } catch (e) {
            setSnackbar({
                open: true,
                message: 'Failed to increment component. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleDecrementComponent = async (slotId: string) => {
        const slot = slots.find(s => s.id === slotId);
        if (!slot?.component || !buildId) return;

        const currentQuantity = slot.component.quantity || 1;
        if (currentQuantity <= 1) return;

        try {
            await onRemoveComponentFromBuild({buildId, componentId: slot.component.id});

            setSlots(prev => prev.map(s =>
                s.id === slotId && s.component
                    ? {...s, component: {...s.component, quantity: (s.component.quantity || 1) - 1}}
                    : s
            ));
        } catch (e) {
            setSnackbar({
                open: true,
                message: 'Failed to decrement component. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleAddSlot = (type: string, label: string) => {
        const count = slots.filter(s => s.type === type).length;
        const newSlot: BuildSlot = {
            id: `${type}_${count + 1}`,
            type,
            label: `${label} ${count > 0 ? count + 1 : ''}`,
            component: null,
            required: false
        };
        setSlots(prev => [...prev, newSlot]);
        setAnchorEl(null);
    };

    const handleDeleteSlot = (slotId: string) => {
        const slot = slots.find(s => s.id === slotId);
        if (slot?.component) {
            handleRemovePart(slotId);
        }
        setSlots(prev => prev.filter(s => s.id !== slotId));
    };

    const handleSubmit = () => {
        if (!buildName.trim()) {
            setSnackbar({
                open: true,
                message: 'Please give your build a name!',
                severity: 'warning'
            });
            return;
        }
        if (!buildId) {
            setSnackbar({
                open: true,
                message: 'Please add at least one component to your build before submitting!',
                severity: 'warning'
            });
            return;
        }

        setTempDescription(description || "");
        setSubmitDialogOpen(true);
    };

    const handleSubmitConfirm = async () => {
        if (!buildId) return;

        setIsSubmitting(true);
        setSubmitDialogOpen(false);

        try {
            await saveBuildState({buildId, name: buildName.trim(), description: tempDescription});
            const result = await onEditBuild({buildId});
            if (!result) throw new Error("Failed to save build");

            isSubmittedRef.current = true;
            window.location.href = "/dashboard/user";
        } catch (e) {
            console.error(e);
            setSnackbar({
                open: true,
                message: 'Failed to save build. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeSlotType = useMemo(() => {
        if (!activeSlotId) return null;
        return slots.find(s => s.id === activeSlotId)?.type || null;
    }, [slots, activeSlotId]);

    return (
        <Container maxWidth="xl" sx={{mt: 0, mb: 10}}>
            <Paper sx={{p: 4, mb: 0, bgcolor: '#ff8201', border: '1px solid #1e1e1e', color: 'white'}}>
                <Typography variant="h4" align="center" fontWeight="bold">Forge Your Machine</Typography>
                <Grid container spacing={2} justifyContent="center" sx={{mt: 2}}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Build Name *"
                            value={buildName}
                            onChange={e => setBuildName(e.target.value)}
                            sx={{bgcolor: '#1e1e1e', borderRadius: 1, color: 'white'}}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{minWidth: 650}}>
                    <TableHead sx={{bgcolor: '#1e1e1e'}}>
                        <TableRow>
                            <TableCell sx={{color: 'white', fontWeight: 'bold'}}>Component</TableCell>
                            <TableCell sx={{color: 'white', fontWeight: 'bold'}}>Selection & Specs</TableCell>
                            <TableCell sx={{color: 'white', fontWeight: 'bold'}}>Price</TableCell>
                            <TableCell sx={{color: 'white', fontWeight: 'bold'}} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {slots.map((slot) => (
                            <TableRow key={slot.id} hover>
                                <TableCell width="15%" sx={{
                                    fontWeight: 'bold',
                                    bgcolor: '#1e1e1e',
                                    color: 'white',
                                    verticalAlign: 'top',
                                    pt: 3,
                                    borderRight: '1px solid #333'
                                }}>
                                    {slot.label}
                                    {slot.required &&
                                        <Chip label="Required" size="small" color="error" sx={{ml: 1, height: 20}}/>}
                                </TableCell>

                                <TableCell>
                                    {slot.component ? (
                                        <Box sx={{display: 'flex', gap: 2, alignItems: 'flex-start'}}>
                                            <Avatar
                                                variant="rounded"
                                                src={slot.component.imgUrl || slot.component.img_url}
                                                sx={{width: 60, height: 60, bgcolor: '#eee'}}
                                            >
                                                {slot.component.brand?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                    sx={{cursor: 'pointer', color: 'primary.main'}}
                                                    onClick={() => setDetailsOpen(slot.component)}
                                                >
                                                    {slot.component.name}
                                                </Typography>
                                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5}}>
                                                    {renderSpecs(slot.component, slot.type)}
                                                </Box>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon/>}
                                            onClick={() => handlePickPart(slot.id)}
                                            sx={{textTransform: 'none', color: '#666', borderColor: '#ccc'}}
                                        >
                                            Choose {slot.label}
                                        </Button>
                                    )}
                                </TableCell>

                                <TableCell width="10%" sx={{verticalAlign: 'top', pt: 3}}>
                                    {slot.component ? (
                                        <>
                                            ${(Number(slot.component.price) * (slot.component.quantity || 1)).toFixed(2)}
                                            {(slot.component.quantity || 1) > 1 && (
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    ${Number(slot.component.price).toFixed(2)} each
                                                </Typography>
                                            )}
                                        </>
                                    ) : '-'}
                                </TableCell>

                                <TableCell align="right" width="15%" sx={{verticalAlign: 'top', pt: 2}}>
                                    {slot.component && (
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: 'flex-end',
                                            alignItems: 'center'
                                        }}>
                                            {(slot.type === 'memory' || slot.type === 'storage') && (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleDecrementComponent(slot.id)}
                                                        disabled={(slot.component.quantity || 1) <= 1}
                                                        sx={{
                                                            bgcolor: 'action.hover',
                                                            '&:disabled': {bgcolor: 'action.disabledBackground'}
                                                        }}
                                                    >
                                                        <RemoveIcon/>
                                                    </IconButton>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            minWidth: '20px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {slot.component.quantity || 1}
                                                    </Typography>

                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleIncrementComponent(slot.id)}
                                                        sx={{bgcolor: 'action.hover'}}
                                                    >
                                                        <AddIcon/>
                                                    </IconButton>
                                                </>
                                            )}

                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemovePart(slot.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>

                                            {!slot.required && (
                                                <IconButton
                                                    color="warning"
                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                >
                                                    <CloseIcon/>
                                                </IconButton>
                                            )}
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                <Button variant="outlined" startIcon={<AddIcon/>} onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{mr: 2}}>
                    Add Optional Component
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    {/*Removed RAM & Storage from optional components*/}
                    <Typography sx={{px: 2, py: 1, display: 'block', color: 'text.secondary'}}>
                        Accessories
                    </Typography>
                    <MenuItem onClick={() => handleAddSlot('optical_drive', 'Optical Drive')}>
                        <ListItemIcon><AlbumIcon/></ListItemIcon>
                        Optical Drive
                    </MenuItem>
                    <MenuItem onClick={() => handleAddSlot('cables', 'Cable')}>
                        <ListItemIcon><CableIcon/></ListItemIcon>
                        Cables
                    </MenuItem>

                    <Typography sx={{px: 2, py: 1, display: 'block', color: 'text.secondary', mt: 1}}>
                        Expansion Cards
                    </Typography>
                    <MenuItem onClick={() => handleAddSlot('memory_card', 'Storage Card')}>
                        <ListItemIcon><MemoryIcon/></ListItemIcon>
                        Storage Card
                    </MenuItem>
                    <MenuItem onClick={() => handleAddSlot('sound_card', 'Sound Card')}>
                        <ListItemIcon><RouterIcon/></ListItemIcon>
                        Sound Card
                    </MenuItem>
                    <MenuItem onClick={() => handleAddSlot('network_card', 'Network Card')}>
                        <ListItemIcon><RouterIcon/></ListItemIcon>
                        Network Card
                    </MenuItem>
                    <MenuItem onClick={() => handleAddSlot('network_adapter', 'WiFi Adapter')}>
                        <ListItemIcon><RouterIcon/></ListItemIcon>
                        WiFi Adapter
                    </MenuItem>
                </Menu>
            </Box>

            <Box sx={{mt: 4, p: 4, bgcolor: '#1e1e1e', textAlign: 'center', borderRadius: 2}}>
                <Typography variant="h5" sx={{mb: 2, fontWeight: 'bold', color: 'white'}}>
                    Total: ${totalPrice.toFixed(2)}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24}/> : 'Submit Build For Review'}
                </Button>
            </Box>

            <ComponentDialog
                open={browserOpen}
                category={activeSlotType}
                onClose={() => {
                    setBrowserOpen(false);
                    setActiveSlotId(null);
                }}
                mode="forge"
                onSelect={handleSelectComponent}
                currentBuildId={buildId}
            />

            <ComponentDetailsDialog
                open={!!detailsOpen}
                component={detailsOpen}
                onClose={() => setDetailsOpen(null)}
            />

            <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{bgcolor: '#ff8201', color: 'white', fontWeight: 'bold'}}>
                    Build Description
                </DialogTitle>
                <DialogContent sx={{p: 3}}>
                    <Typography variant="body1" sx={{mb: 2, color: 'text.secondary'}}>
                        Add some notes about your build (optional):
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="e.g. Workstation monster, great for crunching numbers!"
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{p: 3, pt: 0}}>
                    <Button onClick={() => setSubmitDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={20} sx={{mr: 1}}/>
                                Submitting...
                            </>
                        ) : (
                            'Submit Build'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}