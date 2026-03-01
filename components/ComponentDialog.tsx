import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogContent, IconButton, Box, Typography,
    Slider, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
    Card, CardContent, CardMedia, Button, CircularProgress, AppBar, Toolbar, InputAdornment, TextField,
    TextField as MuiTextField, DialogTitle, DialogActions, Snackbar, Alert, Drawer, Badge
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from "@mui/icons-material/Search";

import {onGetAllComponents, onGetAuthState, onSuggestComponent} from '../pages/+Layout.telefunc'
import {onGetCompatibleComponents} from '../pages/forge/forge.telefunc';
import ComponentDetailsDialog from "./ComponentDetailsDialog";

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
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    useEffect(() => {
        if (open && category) {
            setSuggestForm({
                link: '',
                description: '',
                componentType: category
            });
        }
    }, [open, category]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(tempSearchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [tempSearchQuery]);

    useEffect(() => {
        if (open && category) {
            setSelectedBrands([]);
            setSortOrder('price_desc');
            setTempSearchQuery('');
            setSearchQuery('');
            setPriceRange([0, 2000]);
        }
    }, [open, category]);


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
    }

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

    const activeFiltersCount = selectedBrands.length + (sortOrder !== 'default' ? 1 : 0);

    const FilterContent = React.useMemo(() => (
        <Box sx={{width: {xs: 280, md: 300}, p: 3, bgcolor: 'transparent'}}>
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
                <Select
                    value={sortOrder}
                    label="Sort By"
                    onChange={(e) => setSortOrder(e.target.value)}
                    MenuProps={{
                        container: typeof window !== 'undefined' ? document.body : undefined,
                        disablePortal: false,
                        sx: {
                            zIndex: 1500
                        }
                    }}
                >
                    <MenuItem value="price_asc">Price: Low to High</MenuItem>
                    <MenuItem value="price_desc">Price: High to Low</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{mb: 2}}>
                <InputLabel>Brands</InputLabel>
                <Select
                    multiple
                    value={selectedBrands}
                    onChange={handleBrandChange}
                    label="Brands"
                    renderValue={(s) => s.join(', ')}
                    MenuProps={{
                        container: typeof window !== 'undefined' ? document.body : undefined,
                        disablePortal: false,
                        sx: {
                            zIndex: 1500
                        },
                        PaperProps: {
                            sx: {
                                maxHeight: 300
                            }
                        }
                    }}
                >
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

            {userId && (
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
            )}
        </Box>
    ), [tempSearchQuery, sortOrder, selectedBrands, availableBrands, priceRange, userId]);

    if (!open) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xl"
                fullWidth
                fullScreen
                sx={{
                    '& .MuiDialog-paper': {
                        height: {xs: '100%', md: '90vh'},
                        m: {xs: 0, md: 2}
                    }
                }}
            >
                <AppBar position="relative" sx={{bgcolor: '#ff8201'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setMobileFiltersOpen(true)}
                            sx={{
                                display: {xs: 'flex', md: 'none'},
                                mr: 2
                            }}
                        >
                            <Badge badgeContent={activeFiltersCount} color="error">
                                <FilterListIcon/>
                            </Badge>
                        </IconButton>

                        <Typography
                            sx={{ml: {xs: 0, md: 2}, flex: 1, fontSize: {xs: '1rem', sm: '1.25rem'}}}
                            variant="h6"
                            component="div"
                        >
                            <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}}}>
                                Browsing:
                            </Box>
                            <b> {
                                category === 'gpu' ? 'GRAPHICS CARDS'
                                    : category === 'memory_card' ? 'STORAGE EXPANSION CARDS'
                                        : category === 'power_supply' ? 'POWER SUPPLIES'
                                            : category === 'network_card' ? 'NETWORK CARDS'
                                                : category === 'network_adapters' ? 'NETWORK ADAPTERS'
                                                    : category === 'sound_card' ? 'SOUND CARDS'
                                                        : category === 'optical_drive' ? 'OPTICAL DRIVES'
                                                            : category?.toUpperCase()}</b>
                            {mode === 'forge' && currentBuildId && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        ml: {xs: 1, sm: 2},
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        display: {xs: 'none', sm: 'inline-block'}
                                    }}
                                >
                                    COMPATIBILITY MODE
                                </Typography>
                            )}
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={onClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <DialogContent sx={{p: 0, display: 'flex', height: '100%', overflow: 'hidden'}}>
                    <Box sx={{
                        display: {xs: 'none', md: 'block'},
                        borderRight: '1px solid #ddd',
                        overflowY: 'auto',
                        bgcolor: '#1e1e1e'
                    }}>
                        {FilterContent}
                    </Box>
                    <Box sx={{flex: 1, p: {xs: 1.5, sm: 2, md: 3}, overflowY: 'auto', bgcolor: '#121212'}}>
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
                                    md: 'repeat(2, 1fr)',
                                    lg: 'repeat(3, 1fr)',
                                    xl: 'repeat(4, 1fr)'
                                },
                                gap: {xs: 1.5, sm: 2, md: 3},
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
                                                        p: {xs: 1, sm: 2}
                                                    }}
                                                />
                                            </Box>

                                            <CardContent sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                p: {xs: 1.5, sm: 2}
                                            }}>
                                                <Box>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 0.5,
                                                            fontSize: {xs: '0.65rem', sm: '0.75rem'}
                                                        }}
                                                    >
                                                        {comp.brand}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                        sx={{
                                                            lineHeight: 1.2,
                                                            mt: 0.5,
                                                            mb: 1,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            minHeight: '2.4em',
                                                            fontSize: {xs: '0.875rem', sm: '1rem'}
                                                        }}
                                                    >
                                                        {comp.name}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    color="primary.main"
                                                    fontWeight="bold"
                                                    sx={{fontSize: {xs: '1rem', sm: '1.25rem'}}}
                                                >
                                                    {formatMoney(comp.price)}
                                                </Typography>
                                            </CardContent>

                                            <Box sx={{
                                                p: {xs: 1.5, sm: 2},
                                                pt: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => setSelectedComponent(comp)}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#ff8201',
                                                        fontWeight: 'bold',
                                                        fontSize: {xs: '0.75rem', sm: '0.875rem'},
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
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#4caf50',
                                                            fontWeight: 'bold',
                                                            fontSize: {xs: '0.75rem', sm: '0.875rem'},
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
                                        <Typography variant="h6" color="text.secondary"
                                                    sx={{fontSize: {xs: '1rem', sm: '1.25rem'}}}>
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

            <Drawer
                anchor="left"
                open={mobileFiltersOpen && open}
                onClose={() => setMobileFiltersOpen(false)}
                sx={{zIndex: 1400}}
                PaperProps={{
                    sx: {
                        bgcolor: '#1e1e1e'
                    }
                }}
                disableScrollLock={true}
            >
                <Box sx={{pt: 2, width: 280}}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 3,
                        pb: 2
                    }}>
                        <Typography variant="h6" fontWeight="bold">Filters</Typography>
                        <IconButton onClick={() => setMobileFiltersOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                    {FilterContent}
                </Box>
            </Drawer>

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