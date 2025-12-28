import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogContent, IconButton, Grid, Box, Typography,
    Slider, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
    Card, CardContent, CardMedia, Button, CircularProgress, Divider, AppBar, Toolbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

import {onGetAllComponents} from '../pages/+Layout.telefunc';
import ComponentDetailsDialog from "./ComponentDetailsDialog";

const formatMoney = (amount: number) => `$${amount}`;

export default function ComponentBrowserDialog({open, category, onClose}: any) {
    const [components, setComponents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedComponent, setSelectedComponent] = useState<any>(null);
    const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);

    const [sortOrder, setSortOrder] = useState<string>('default');

    useEffect(() => {
        if (open && category) {
            setLoading(true);
            setSortOrder('price_desc');

            onGetAllComponents({componentType: category})
                .then((data) => {
                    setComponents(data);

                    const brands = Array.from(new Set(data.map((c: any) => c.brand)));
                    setAvailableBrands(brands as string[]);

                    const maxPrice = data.length > 0 ? Math.max(...data.map((c: any) => Number(c.price))) : 2000;
                    setPriceRange([0, Math.ceil(maxPrice)]);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [open, category]);

    let processedComponents = components.filter(comp => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(comp.brand);
        const matchesPrice = Number(comp.price) >= priceRange[0] && Number(comp.price) <= priceRange[1];
        return matchesBrand && matchesPrice;
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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            sx={{height: '90vh'}}
        >
            <AppBar position="relative" sx={{bgcolor: '#ff8201'}}>
                <Toolbar>
                    <Typography sx={{ml: 2, flex: 1, textTransform: 'capitalize'}} variant="h6" component="div">
                        Browsing: <b>{category === 'gpu' ? 'Graphics Cards' : category?.toUpperCase()}</b>
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
                    display: {xs: 'none', md: 'block'}
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <SortIcon sx={{mr: 1}}/>
                        <Typography variant="h6">Sort By</Typography>
                    </Box>
                    <FormControl fullWidth size="small" sx={{mb: 4}}>
                        <InputLabel>Price</InputLabel>
                        <Select
                            value={sortOrder}
                            label="Price"
                            onChange={(e) => setSortOrder(e.target.value)}>
                            {/*<MenuItem value="default">Featured</MenuItem>*/}
                            <MenuItem value="price_asc">Price: Low to High</MenuItem>
                            <MenuItem value="price_desc">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{mb: 3}}/>

                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <FilterListIcon sx={{mr: 1}}/>
                        <Typography variant="h6">Filters</Typography>
                    </Box>

                    <Typography gutterBottom fontWeight="bold">Price Range</Typography>
                    <Slider
                        value={priceRange}
                        onChange={(_, newValue) => setPriceRange(newValue as number[])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={components.length > 0 ? Math.max(...components.map(c => Number(c.price))) : 2000}
                        sx={{color: '#ff8201', mb: 2}}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                        <Typography variant="caption">{formatMoney(priceRange[0])}</Typography>
                        <Typography variant="caption">{formatMoney(priceRange[1])}</Typography>
                    </Box>

                    <FormControl fullWidth size="small">
                        <InputLabel>Brands</InputLabel>
                        <Select
                            multiple
                            value={selectedBrands}
                            onChange={handleBrandChange}
                            renderValue={(selected) => selected.join(', ')}
                            label="Brands"
                        >
                            {availableBrands.map((brand) => (
                                <MenuItem key={brand} value={brand}>
                                    <Checkbox checked={selectedBrands.indexOf(brand) > -1}/>
                                    <ListItemText primary={brand}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{flex: 1, p: 3, overflowY: 'auto'}}>
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 10}}>
                            <CircularProgress sx={{color: '#ff8201'}}/>
                        </Box>
                    ) : (
                        <Grid container spacing={1}>
                            {processedComponents.map((comp) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={comp.id}>
                                    <Card elevation={1} sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: 220,
                                        width: 220,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            // image={`https://placehold.co/400x400?text=${encodeURIComponent(comp.name)}`}
                                            image={comp.imgUrl}
                                            alt={comp.name}
                                            sx={{p: 2, objectFit: 'contain'}}
                                        />
                                        <CardContent sx={{flexGrow: 1}}>
                                            <Typography variant="caption" color="text.secondary"
                                                        sx={{textTransform: 'uppercase'}}>
                                                {comp.brand}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{
                                                lineHeight: 1.2,
                                                mb: 1,
                                            }}>
                                                {comp.name}
                                            </Typography>

                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 2
                                            }}>
                                                <Typography variant="h6" color="primary.main">
                                                    {formatMoney(comp.price)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <Box sx={{p: 2, pt: 0}}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => setSelectedComponent(comp)}
                                                sx={{
                                                    backgroundColor: '#ff8201',
                                                    color: 'white',
                                                    borderColor: '#ff8201',
                                                    onHover: {backgroundColor: '#e67300', borderColor: '#e67300'}
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                            {processedComponents.length === 0 && (
                                <Box sx={{width: '100%', textAlign: 'center', mt: 5}}>
                                    <Typography variant="h6" color="text.secondary">No components match.</Typography>
                                </Box>
                            )}
                        </Grid>
                    )}
                </Box>
            </DialogContent>
            <ComponentDetailsDialog
                open={!!selectedComponent}
                component={selectedComponent}
                onClose={() => setSelectedComponent(null)}
            />
        </Dialog>
    );
}
