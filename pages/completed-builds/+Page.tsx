import React, { useEffect, useState } from 'react';
import {
    Container, Grid, Box, Typography, TextField, MenuItem, Select,
    Slider, Button, Paper, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import BuildCard from '../../components/BuildCard';
import BuildDetailsDialog from '../../components/BuildDetailsDialog';

import { onGetApprovedBuilds, onCloneBuild, onGetAuthState } from '../+Layout.telefunc';

export default function CompletedBuildsPage() {
    const [builds, setBuilds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

    const [sortBy, setSortBy] = useState('price_asc');
    const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
    const [searchQuery, setSearchQuery] = useState("");

    const loadBuilds = async () => {
        setLoading(true);
        try {
            const [userData, data] = await Promise.all([
                onGetAuthState(),
                onGetApprovedBuilds({ q: searchQuery })
            ]);
            setUserId(userData.userId);

            let sortedData = [...data];

            switch (sortBy) {
                case 'price_asc':
                    sortedData.sort((a, b) => Number(a.total_price) - Number(b.total_price));
                    break;
                case 'price_desc':
                    sortedData.sort((a, b) => Number(b.total_price) - Number(a.total_price));
                    break;
                case 'rating_desc':
                    sortedData.sort((a, b) => (Number(b.avgRating) || 0) - (Number(a.avgRating) || 0));
                    break;
                case 'oldest':
                    sortedData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                    break;
                case 'newest':
                default:
                    sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    break;
            }

            sortedData = sortedData.filter(b => {
                const price = Number(b.total_price);
                return price >= priceRange[0] && price <= priceRange[1];
            });

            setBuilds(sortedData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBuilds();
    }, [sortBy, priceRange, searchQuery]);

    useEffect(() => {
        loadBuilds();
    }, [sortBy, searchQuery]);

    const handleClone = async (buildId: number) => {
        if (!userId) return alert("Please login to clone builds!");
        if (confirm(`Clone this build?`)) {
            await onCloneBuild({ buildId });
            alert("Build cloned!");
            setSelectedBuildId(null);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Completed Builds</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Browse community configurations. Filter by price, components, or popularity.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper variant="outlined" sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FilterListIcon sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="bold">Filters</Typography>
                        </Box>

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search builds..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Typography gutterBottom fontWeight="bold">Price Range</Typography>
                        <Box sx={{ px: 1, mb: 3 }}>
                            <Slider
                                value={priceRange}
                                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                                valueLabelDisplay="auto"
                                min={0}
                                max={5000}
                                step={100}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption">${priceRange[0]}</Typography>
                                <Typography variant="caption">${priceRange[1]}+</Typography>
                            </Box>
                        </Box>

                        <Button variant="contained" fullWidth onClick={loadBuilds}>
                            Apply Filters
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    {/* Toolbar */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography fontWeight="bold">{builds.length} Builds Found</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">Sort by:</Typography>
                            <Select
                                size="small"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                sx={{ minWidth: 150, bgcolor: 'background.paper' }}
                            >
                                <MenuItem value="newest">Newest First</MenuItem>
                                <MenuItem value="oldest">Oldest First</MenuItem>
                                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                <MenuItem value="rating_desc">Highest Rated</MenuItem>
                            </Select>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box sx={{ p: 5, textAlign: 'center' }}>Loading...</Box>
                    ) : (
                        <Grid container spacing={3}>
                            {builds.map((build) => (
                                <Grid item xs={12} sm={6} lg={4} key={build.id} sx={{ display: 'flex' }}>
                                    <Box sx={{ width: '100%' }}>
                                        <BuildCard
                                            build={build}
                                            onClick={() => setSelectedBuildId(build.id)}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                            {builds.length === 0 && (
                                <Grid item xs={12}>
                                    <Box sx={{ p: 5, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                        <Typography>No builds found matching your filters.</Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Grid>

            <BuildDetailsDialog
                open={!!selectedBuildId}
                buildId={selectedBuildId}
                currentUser={userId}
                onClose={() => setSelectedBuildId(null)}
                onClone={handleClone}
            />
        </Container>
    );
}

