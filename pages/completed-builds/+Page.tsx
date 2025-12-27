import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, TextField, MenuItem, Select,
    Slider, Button, Paper, InputAdornment, CircularProgress
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
                onGetApprovedBuilds({q: searchQuery})
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
        } catch (e) {
            console.error("Failed to load builds", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBuilds();
    }, [sortBy, searchQuery]);

    const handleClone = async (buildId: number) => {
        if (!userId) return alert("Please login to clone builds!");
        if (confirm(`Clone this build?`)) {
            await onCloneBuild({buildId});
            alert("Build cloned!");
            setSelectedBuildId(null);
        }
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 10, px: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Completed Builds</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Browse community configurations. Filter by price, components, or popularity.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>

                <Box sx={{
                    width: { xs: '100%', md: '280px' },
                    flexShrink: 0
                }}>
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
                </Box>

                <Box sx={{ flexGrow: 1 }}>
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
                        <Box sx={{ p: 5, textAlign: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            sx={{
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
                            }}
                        >
                            {builds.map((build) => (
                                <BuildCard
                                    key={build.id}
                                    build={build}
                                    onClick={() => setSelectedBuildId(build.id)}
                                />
                            ))}
                            {builds.length === 0 && (
                                <Box sx={{ gridColumn: '1 / -1', p: 5, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                    <Typography>No builds found matching your filters.</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* @ts-ignore */}
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