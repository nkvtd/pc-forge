import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Typography,
    IconButton, Tab, Tabs, Table, TableBody, TableCell, TableRow, Rating, TextField, Avatar, Chip, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from "@mui/icons-material/Person";
import {onGetBuildDetails, onSetReview, onToggleFavorite, onCloneBuild, onSetRating} from '../pages/+Layout.telefunc';

const formatPrice = (price: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price) || 0);

export default function BuildDetailsDialog({ open, buildId, onClose, currentUser }: any) {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
    const [cloningBuildId, setCloningBuildId] = useState<number | null>(null);

    const [reviewText, setReviewText] = useState("");
    const [ratingVal, setRatingVal] = useState(5);

    useEffect(() => {
        if (open && buildId) {
            setLoading(true);
            setReviewText("");
            setRatingVal(5);

            onGetBuildDetails({ buildId })
                .then(data => {
                    setDetails(data);
                    if (data.userRating) setRatingVal(data.userRating);
                    if (data.userReview) setReviewText(data.userReview);
                })
                .finally(() => setLoading(false));
        }
    }, [open, buildId]);

    const handleFavorite = async () => {
        if (!currentUser) return alert("Please login to favorite builds.");
        const res = await onToggleFavorite({ buildId });
        setDetails((prev: any) => ({ ...prev, isFavorite: res }));
    };

    const handleSubmitReview = async () => {
        if (!currentUser) return alert("Please login to review.");

        await onSetReview({
            buildId,
            content: reviewText,
            // rating: ratingVal
        });

        await onSetRating({
            buildId,
            value: ratingVal
        })

        const refreshed = await onGetBuildDetails({ buildId });
        setDetails(refreshed);
    };

    const handleCloneConfirm = async () => {
        if (!cloningBuildId) return;

        try {
            const newBuildId = await onCloneBuild({ buildId: cloningBuildId });

            window.location.href = `/forge?buildId=${newBuildId}`;

            setCloneDialogOpen(false);
            setCloningBuildId(null);
        } catch (e) {
            alert("Failed to clone build. Please try again.");
        }
    };


    if (!open) return null;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
                {loading || !details ? (
                    <Box sx={{ p: 5, textAlign: 'center' }}>Loading Forge Schematics...</Box>
                ) : (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#ff8201' }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">{details.name}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                        by {details.creator}
                                    </Typography>
                                    <Chip label={formatPrice(details.totalPrice)} size="small" color="primary" variant="outlined" />
                                </Box>
                            </Box>
                            <IconButton onClick={onClose}><CloseIcon /></IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ p: 0 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'primary', position: 'sticky', top: 0, zIndex: 1 }}>
                                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
                                    <Tab label="Specs" />
                                    <Tab label={`Reviews (${details.ratingStatistics.ratingCount})`} />
                                </Tabs>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {tabIndex === 0 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={8}>
                                            <Table size="small">
                                                <TableBody>
                                                    {details.components.map((comp: any) => (
                                                        <TableRow key={comp.id}>
                                                            <TableCell sx={{ width: 50 }}>
                                                                <Avatar
                                                                    src={comp.img_url || undefined}
                                                                    variant="rounded"
                                                                    sx={{ width: 45, height: 45, bgcolor: '#ff8201'}}
                                                                >
                                                                    {comp.type?.substring(0, 3)?.toUpperCase()}
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                                    {comp.type}
                                                                </Typography>
                                                                <Typography variant="body1" fontWeight="500">
                                                                    {comp.brand} {comp.name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#ff8201' }}>
                                                                {formatPrice(comp.price)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow sx={{ bgcolor: '#424343' }}>
                                                        <TableCell colSpan={2} sx={{ fontWeight: 'bold', color: '#ff8201' }}>TOTAL</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'primary.main' }}>
                                                            {formatPrice(details.totalPrice)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ bgcolor: '#424343', p: 2, borderRadius: 2, mb: 2 }}>
                                                <Typography color="primary.main" gutterBottom fontWeight="bold">Builder's Notes</Typography>
                                                <Typography color="primary.main" variant="body2" sx={{ fontStyle: 'italic' }}>
                                                    "{details.description || "No notes provided."}"
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                    startIcon={<AutoFixHighIcon />}
                                                    onClick={() => {
                                                        setCloningBuildId(details.id);
                                                        setCloneDialogOpen(true);
                                                    }}
                                                >
                                                    Clone & Edit
                                                </Button>
                                                <Button
                                                    variant={details.isFavorite ? "contained" : "outlined"}
                                                    color={details.isFavorite ? "error" : "primary"}
                                                    startIcon={details.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                    onClick={handleFavorite}
                                                >
                                                    {details.isFavorite ? "Favorited" : "Add to Favorites"}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}

                                {tabIndex === 1 && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, bgcolor: '#5e5e5e', borderRadius: 2 }}>
                                            <Typography variant="h3" fontWeight="bold">{details.ratingStatistics.averageRating.toFixed(1)}</Typography>
                                            <Box>
                                                <Rating value={details.ratingStatistics.averageRating} readOnly precision={0.5} />
                                                <Typography variant="body2" color="text.secondary">{details.ratingStatistics.ratingCount} ratings</Typography>
                                            </Box>
                                        </Box>

                                        {currentUser && details.userId !== currentUser.id && (
                                            <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                                <Typography variant="subtitle2" gutterBottom>Your Review</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Rating value={ratingVal} onChange={(_, v) => setRatingVal(v || 5)} />
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    placeholder="Share your thoughts on this build..."
                                                    value={reviewText}
                                                    onChange={(e) => setReviewText(e.target.value)}
                                                    sx={{ mb: 1 }}
                                                />
                                                <Button size="small" variant="contained" onClick={handleSubmitReview}>
                                                    Submit Review
                                                </Button>
                                            </Box>
                                        )}

                                        {currentUser && details.userId === currentUser.id && (
                                            <Alert severity="info" sx={{ mb: 4 }}>
                                                You cannot rate your own builds.
                                            </Alert>
                                        )}

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {details.reviews.map((rev: any, i: number) => (
                                                <Box key={i} sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography fontWeight="bold" variant="body2">{rev.username}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{rev.createdAt}</Typography>
                                                    </Box>
                                                    <Typography variant="body2">{rev.content}</Typography>
                                                </Box>
                                            ))}
                                            {details.reviews.length === 0 && (
                                                <Typography color="text.secondary" align="center">No reviews yet. Be the first!</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            <Dialog open={cloneDialogOpen} onClose={() => setCloneDialogOpen(false)}>
                <DialogTitle>Clone Build</DialogTitle>
                <DialogContent>
                    <Typography>
                        This will create a copy of "{details?.name}" in your Forge so you can edit it.
                        All components will be copied over.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCloneDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCloneConfirm}
                        disabled={!cloningBuildId}
                    >
                        Clone Build
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
