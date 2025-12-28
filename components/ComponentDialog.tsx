import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogContent, IconButton, Box, Typography, Chip,
    Slider, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
    Card, CardContent, CardMedia, Button, CircularProgress, AppBar, Toolbar, InputAdornment, TextField,
    TextField as MuiTextField, DialogTitle, DialogActions, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import {onGetAllComponents, onGetAuthState, onSuggestComponent} from '../pages/+Layout.telefunc'
import {onGetCompatibleComponents} from '../pages/forge/forge.telefunc';
import ComponentDetailsDialog from "./ComponentDetailsDialog";
import SearchIcon from "@mui/icons-material/Search";

const formatMoney = (amount: number) => `$${Number(amount).toFixed(2)}`;

export default function ComponentDialog({open, category, onClose, mode, onSelect, currentBuildId}: any) {
    const [components, setComponents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<any>(null);
    const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<string>('default');

    const [tempSearchQuery, setTempSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [suggestOpen, setSuggestOpen] = useState(false);
    const [suggestForm, setSuggestForm] = useState({
        link: '',
        description: '',
        componentType: category || ''
    });
    const [suggestLoading, setSuggestLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(tempSearchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [tempSearchQuery]);

    // Load user auth
    useEffect(() => {
        if (open) {
            onGetAuthState().then(userData => {
                setUserId(userData.userId);
            });
        }
    }, [open]);

    useEffect(() => {
        if (open && category) {
            setLoading(true);
            setSortOrder('price_desc');

            const shouldUseCompatibility = mode === 'forge' && currentBuildId;
            const fetcher = shouldUseCompatibility
                ? onGetCompatibleComponents({
                    buildId: currentBuildId,
                    componentType: category,
                    limit: 100,
                    sort: 'price_desc'
                })
                : onGetAllComponents({
                    componentType: category,
                    limit: 100,
                    sort: 'price_desc'
                });

            fetcher
                .then((data) => {
                    const comps = data || [];
                    setComponents(comps);

                    const brands = Array.from(new Set(comps.map((c: any) => c.brand)));
                    setAvailableBrands(brands as string[]);
                    const maxPrice = comps.length > 0 ? Math.max(...comps.map((c: any) => Number(c.price))) : 2000;
                    setPriceRange([0, Math.ceil(maxPrice)]);
                })
                .catch((err) => {
                    console.error('[Dialog] fetch error:', err);
                    setComponents([]);
                })
                .finally(() => setLoading(false));
        }
    }, [open, category, mode, currentBuildId]);

    const handleSuggestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSuggestForm({
            ...suggestForm,
            [e.target.name]: e.target.value
        });
    };

    const submitSuggestion = async () => {
        if (!userId) {
            setSnackbarMessage("Please login to submit suggestions!");
            setSnackbarOpen(true);
            return;
        }

        if (!suggestForm.link || !suggestForm.description) {
            setSnackbarMessage("Please fill in all fields!");
            setSnackbarOpen(true);
            return;
        }

        setSuggestLoading(true);
        try {
            const suggestionId = await onSuggestComponent({
                link: suggestForm.link,
                description: suggestForm.description,
                componentType: suggestForm.componentType
            });

            setSnackbarMessage("Suggestion submitted! Admin will review it.");
            setSnackbarOpen(true);
            setSuggestOpen(false);
            setSuggestForm({link: '', description: '', componentType: category || ''});
        } catch (error) {
            console.error('Suggestion error:', error);
            setSnackbarMessage("Failed to submit suggestion. Try again.");
            setSnackbarOpen(true);
        } finally {
            setSuggestLoading(false);
        }
    };

    let processedComponents = components.filter(comp => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(comp.brand);
        const matchesPrice = Number(comp.price) >= priceRange[0] && Number(comp.price) <= priceRange[1];
        const matchesSearch = searchQuery === "" ||
            comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.brand.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesBrand && matchesPrice && matchesSearch;
    });

    if (sortOrder === 'price_asc') {
        processedComponents.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === 'price_desc') {
        processedComponents.sort((a, b) => Number(b.price) - Number(a.price));
    }

    const handleBrandChange = (event: any) => {
        const value = event.target.value;
        setSelectedBrands(typeof value === 'string' ? value.split(',') : value);
    };

    if (!open) return null;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth sx={{height: '90vh'}}>
                <AppBar position="relative" sx={{bgcolor: '#ff8201'}}>
                    <Toolbar>
                        <Typography sx={{ml: 2, flex: 1, textTransform: 'capitalize'}} variant="h6" component="div">
                            Browsing: <b>{category === 'gpu' ? 'Graphics Cards' : category?.toUpperCase()}</b>
                            {mode === 'forge' && currentBuildId && (
                                <Typography variant="caption"
                                            sx={{ml: 2, bgcolor: 'rgba(0,0,0,0.2)', px: 1, borderRadius: 1}}>
                                    COMPATIBILITY MODE ON
                                </Typography>
                            )}
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={onClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <DialogContent sx={{p: 0, display: 'flex', height: '100%'}}>
                    <Box sx={{
                        width: 300,
                        borderRight: '1px solid #ddd',
                        p: 3,
                        bgcolor: '#1e1e1e',
                        display: {xs: 'none', md: 'block'},
                        overflowY: 'auto'
                    }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search components..."
                            value={tempSearchQuery}
                            onChange={(e) => setTempSearchQuery(e.target.value)}
                            sx={{mb: 2}}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                            }}
                        />


                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortOrder} label="Sort By" onChange={(e) => setSortOrder(e.target.value)}>
                                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                            <InputLabel>Brands</InputLabel>
                            <Select multiple value={selectedBrands} onChange={handleBrandChange} label="Brands"
                                    renderValue={(s) => s.join(', ')}>
                                {availableBrands.map((brand) => (
                                    <MenuItem key={brand} value={brand}>
                                        <Checkbox checked={selectedBrands.indexOf(brand) > -1}/>
                                        <ListItemText primary={brand}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography gutterBottom fontWeight="bold">Price Range</Typography>
                        <Slider value={priceRange} onChange={(_, v) => setPriceRange(v as number[])} min={0} max={2000}
                                sx={{color: '#ff8201'}}/>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}>
                            <Typography variant="caption">${priceRange[0]}</Typography>
                            <Typography variant="caption">${priceRange[1]}+</Typography>
                        </Box>
                        {/*TO BE FINISHED*/}
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<AddCircleIcon/>}
                            onClick={() => setSuggestOpen(true)}
                            sx={{
                                mt: 2,
                                bgcolor: '#ff8201',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                '&:hover': {bgcolor: '#e67300'}
                            }}
                        >
                            Suggest Component
                        </Button>
                    </Box>

                    <Box sx={{flex: 1, p: 3, overflowY: 'auto', bgcolor: '#121212'}}>
                        {loading ? (
                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 10}}>
                                <CircularProgress sx={{color: '#ff8201'}}/>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)',
                                    xl: 'repeat(5, 1fr)'
                                },
                                gap: 3,
                                width: '100%'
                            }}>
                                {processedComponents.map((comp) => (
                                    <Box key={comp.id} sx={{width: '100%'}}>
                                        <Card
                                            elevation={3}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 6
                                                }
                                            }}
                                        >
                                            <Box sx={{position: 'relative', paddingTop: '75%', bgcolor: '#1e1e1e'}}>
                                                <CardMedia
                                                    component="img"
                                                    image={comp.imgUrl || comp.img_url || `https://placehold.co/400x400?text=${comp.name}`}
                                                    alt={comp.name}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        p: 2
                                                    }}
                                                />
                                            </Box>

                                            <CardContent sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary"
                                                                sx={{textTransform: 'uppercase', letterSpacing: 0.5}}>
                                                        {comp.brand}
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold" sx={{
                                                        lineHeight: 1.2,
                                                        mt: 0.5,
                                                        mb: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        minHeight: '2.4em'
                                                    }}>
                                                        {comp.name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                    {formatMoney(comp.price)}
                                                </Typography>
                                            </CardContent>

                                            <Box sx={{p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1}}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => setSelectedComponent(comp)}
                                                    sx={{
                                                        bgcolor: '#ff8201',
                                                        fontWeight: 'bold',
                                                        '&:hover': {bgcolor: '#e67300'}
                                                    }}
                                                >
                                                    Details
                                                </Button>
                                                {mode === 'forge' && onSelect && (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={() => onSelect(comp)}
                                                        sx={{
                                                            bgcolor: '#4caf50',
                                                            fontWeight: 'bold',
                                                            '&:hover': {bgcolor: '#388e3c'}
                                                        }}
                                                    >
                                                        Add
                                                    </Button>
                                                )}
                                            </Box>
                                        </Card>
                                    </Box>
                                ))}
                                {processedComponents.length === 0 && (
                                    <Box sx={{gridColumn: '1 / -1', width: '100%', textAlign: 'center', mt: 5}}>
                                        <Typography variant="h6" color="text.secondary">
                                            No compatible components found.
                                        </Typography>
                                        {mode === 'forge' && (
                                            <Typography variant="body2" color="error">
                                                (Try removing incompatible parts)
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <ComponentDetailsDialog
                    open={!!selectedComponent}
                    component={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                />
            </Dialog>

            <Dialog open={suggestOpen} onClose={() => setSuggestOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Suggest a New Component</DialogTitle>
                <DialogContent>
                    <MuiTextField
                        fullWidth
                        label="Product Link *"
                        name="link"
                        value={suggestForm.link}
                        onChange={handleSuggestChange}
                        placeholder="https://example.com/product"
                        sx={{mt: 1}}
                        size="small"
                    />
                    <MuiTextField
                        fullWidth
                        label="Description *"
                        name="description"
                        value={suggestForm.description}
                        onChange={handleSuggestChange}
                        multiline
                        rows={3}
                        placeholder="Why should we add this component? Any specs/details?"
                        sx={{mt: 2}}
                        size="small"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
                        Category: <b>{category?.toUpperCase()}</b>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuggestOpen(false)}>Cancel</Button>
                    <Button
                        onClick={submitSuggestion}
                        disabled={suggestLoading || !userId}
                        variant="contained"
                        startIcon={suggestLoading ? <CircularProgress size={20}/> : null}
                    >
                        {suggestLoading ? 'Submitting...' : 'Submit Suggestion'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert onClose={() => setSnackbarOpen(false)} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
