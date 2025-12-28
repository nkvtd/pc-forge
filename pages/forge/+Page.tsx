import React, {useState, useEffect, useMemo} from 'react';
import {
    Container, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Avatar, TextField, Grid, Chip, CircularProgress,
    Menu, MenuItem, ListItemIcon
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
    onGetBuildState, onGetBuildComponents
} from './forge.telefunc';

import ComponentDialog from '../../components/ComponentDialog';
import ComponentDetailsDialog from '../../components/ComponentDetailsDialog';
import {onAddNewBuild, onGetComponentDetails} from "../+Layout.telefunc";
import {onEditBuild} from "../dashboard/user/userDashboard.telefunc";

type BuildSlot = {
    id: string;
    type: string;
    label: string;
    component: any | null;
    required: boolean;
};

const INITIAL_SLOTS: BuildSlot[] = [
    {id: 'cpu', type: 'cpu', label: 'CPU', component: null, required: true},
    {id: 'cooler', type: 'cooler', label: 'CPU Cooler', component: null, required: true},
    {id: 'motherboard', type: 'motherboard', label: 'Motherboard', component: null, required: true},
    {id: 'memory_1', type: 'memory', label: 'Memory', component: null, required: true},
    {id: 'gpu', type: 'gpu', label: 'Video Card', component: null, required: true},
    {id: 'storage_1', type: 'storage', label: 'Storage', component: null, required: true},
    {id: 'powersupply', type: 'power_supply', label: 'Power Supply', component: null, required: true},
    {id: 'case', type: 'case', label: 'Case', component: null, required: true},
];

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
    const isSubmittedRef = React.useRef(false);

    useEffect(() => {
        const price = slots.reduce((sum, slot) => sum + (Number(slot.component?.price) || 0), 0);
        setTotalPrice(price);
    }, [slots]);

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
            onGetBuildComponents({ buildId: loadBuildId })
                .then(async (components) => {
                    if (components && components.length > 0) {
                        setBuildId(loadBuildId);
                        setBuildName("Cloned Build");
                        setDescription("");

                        const detailedComponents = await Promise.all(
                            components.map(async (c: any) => {
                                const full = await onGetComponentDetails({ componentId: c.id }).catch(() => null);
                                return full ? { ...c, ...full, details: full?.details } : c;
                            })
                        );

                        const componentMap = new Map();
                        detailedComponents.forEach((c: any) => componentMap.set(c.type, c));

                        setSlots(prevSlots => prevSlots.map(slot => {
                            const match = componentMap.get(slot.type);
                            return match ? { ...slot, component: match } : slot;
                        }));

                        window.history.replaceState({}, document.title, "/forge");
                    }
                })
                .catch(() => {});
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
                const result = await onAddNewBuild({name: "Draft Build", description: "Work in progress"});
                id = typeof result === 'number' ? result : (result as any)?.buildId;
                if (!id || !Number.isInteger(id) || id <= 0) {
                    alert("Failed to create draft build.");
                    return;
                }
                setBuildId(id);
            }

            const full = await onGetComponentDetails({componentId: component.id}).catch(() => null);
            const merged = full ? {...component, ...full, details: full.details} : component;

            setSlots(prev => prev.map(slot =>
                slot.id === activeSlotId ? {...slot, component: merged} : slot
            ));
            setBrowserOpen(false);

            await onAddComponentToBuild({buildId: id, componentId: component.id});
        } catch (e) {
            // console.error("Failed to add component to server build", e);
            alert("Failed to add component. Please try again.");
        } finally {
            setActiveSlotId(null);
        }
    };

    const handleRemovePart = async (slotId: string) => {
        const slot = slots.find(s => s.id === slotId);
        if (!slot?.component || !buildId) return;

        setSlots(prev => prev.map(s =>
            s.id === slotId ? {...s, component: null} : s
        ));

        try {
            await onRemoveComponentFromBuild({
                buildId,
                componentId: slot.component.id
            });
        } catch (e) {
            console.error("Failed to remove component from server", e);
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

    const handleSubmit = async () => {
        if (!buildName.trim()) return alert("Please name your build!");
        if (!buildId) return alert("You must add at least one component before submitting.");

        setIsSubmitting(true);
        try {
            const result = await onEditBuild({buildId});

            if (!result) throw new Error("Failed to save build");

            isSubmittedRef.current = true;
            window.location.href = "/dashboard/user";
        } catch (e) {
            console.error(e);
            alert("Failed to save build.");
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
                                    {slot.component ? `$${Number(slot.component.price).toFixed(2)}` : '-'}
                                </TableCell>

                                <TableCell align="right" width="10%" sx={{verticalAlign: 'top', pt: 2}}>
                                    {slot.component && (
                                        <IconButton color="error" onClick={() => handleRemovePart(slot.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                    {!slot.required && (
                                        <IconButton color="warning" onClick={() => handleDeleteSlot(slot.id)}>
                                            <CloseIcon/>
                                        </IconButton>
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
                    <Typography sx={{px: 2, py: 1, display: 'block', color: 'text.secondary'}}>
                        Memory & Storage
                    </Typography>
                    <MenuItem onClick={() => handleAddSlot('memory', 'Memory')}>
                        <ListItemIcon><MemoryIcon/></ListItemIcon>
                        Additional Memory
                    </MenuItem>
                    <MenuItem onClick={() => handleAddSlot('storage', 'Storage')}>
                        <ListItemIcon><AlbumIcon/></ListItemIcon>
                        Additional Storage
                    </MenuItem>

                    <Typography sx={{px: 2, py: 1, display: 'block', color: 'text.secondary', mt: 1}}>
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
        </Container>
    );
}

function renderSpecs(c: any, type: string) {
    if (!c) return null;
    const data = {...c, ...(c.details || {})};
    const chipStyle = {height: 24, fontSize: '0.75rem', bgcolor: 'rgba(0,0,0,0.05)'};
    const specs: string[] = [];
    const val = (k: string) => data[k] || data[k.toLowerCase()] || data[k.replace('_', '')];

    switch (type) {
        case 'cpu':
            if (val('socket')) specs.push(val('socket'));
            if (val('cores')) specs.push(`${val('cores')} Cores / ${val('threads')} Threads`);
            const base = data.baseclock || data.baseClock || data.base_clock;
            const boost = data.boostclock || data.boostClock || data.boost_clock;
            if (base) specs.push(`Base: ${base}GHz`);
            if (boost) specs.push(`Boost: ${boost}GHz`);
            break;
        case 'gpu':
            if (val('vram')) specs.push(`${val('vram')}GB VRAM`);
            if (val('chipset')) specs.push(val('chipset'));
            if (val('length')) specs.push(`L: ${val('length')}mm`);
            break;
        case 'motherboard':
            if (val('socket')) specs.push(val('socket'));
            if (val('formfactor')) specs.push(val('formfactor'));
            if (val('ramtype')) specs.push(val('ramtype'));
            break;
        case 'memory':
            if (val('capacity')) specs.push(`${val('capacity')}GB`);
            if (val('type')) specs.push(val('type'));
            if (val('speed')) specs.push(`${val('speed')} MHz`);
            if (val('modules')) specs.push(`${val('modules')}x`);
            break;
        case 'storage':
            if (val('capacity')) specs.push(`${val('capacity')}GB`);
            if (val('type')) specs.push(val('type'));
            break;
        case 'power_supply':
            if (val('wattage')) specs.push(`Wattage: ${val('wattage')}W`);
            if (val('type')) specs.push(val('type'));
            break;
        case 'case':
            if (val('gpuMaxLength')) specs.push(`Max GPU Length: ${val('gpuMaxLength')}mm`);
            if (val('coolerMaxHeight')) specs.push(`Max CPU Cooler Height: ${val('coolerMaxHeight')}mm`);
            break;
        case 'cooler':
            if (val('type')) specs.push(`${val('type')} Cooler`);
            if (val('height')) specs.push(`${val('height')}mm`);
            break;
        default:
            if (data.brand) specs.push(data.brand);
    }

    if (specs.length === 0) {
        if (data.brand) return <Chip label={data.brand} sx={chipStyle}/>;
        return <Typography variant="caption" color="text.secondary">...</Typography>;
    }

    return specs.map((label, i) => <Chip key={i} label={label} sx={chipStyle}/>);
}
