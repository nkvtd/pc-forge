import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent,
    CardActions, Chip, Rating, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import HardwareIcon from '@mui/icons-material/Memory';
import ListIcon from '@mui/icons-material/List'; // Icon for "Show All"

// --- PLACEHOLDER ASSETS ---
const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=Gaming+PC";

import { onGetHighestRankedBuilds, onCloneBuild } from './buildCards.telefunc';
import { onGetApprovedBuilds } from '../+Layout.telefunc';
import {getAuthState} from "../../server/telefunc/ctx"; //

export default function HomePage() {
    const [data, setData] = useState<any>(null);
    const [selectedBuild, setSelectedBuild] = useState<any>(null); // For Detail Popup
    const [openDetailPopup, setOpenDetailPopup] = useState(false);

    // NEW: Popup for "All Top Ranked Builds"
    const [openRankedPopup, setOpenRankedPopup] = useState(false);

    useEffect(() => {
        async function loadSite(){
            try{
                const [
                    authData, highestRankedBuilds, commnityBuilds
                ] = await Promise.all([
                    getAuthState(),
                    onGetHighestRankedBuilds({ limit: 3 }),
                    onGetApprovedBuilds({ limit: 12 })
                ]);

                setData({
                    isLoggedIn: authData.isLoggedIn,
                    userId: authData.userId,
                    prebuilts: highestRankedBuilds,
                    communityBuilds: commnityBuilds
                });
            } catch (error) {
                console.error("Error loading homepage data:", error);
            }
    }

    loadSite();
}, []);

    // Open Build Details
    const handleCardClick = (build: any) => {
        setSelectedBuild(build);
        setOpenDetailPopup(true);
    };

    const handleClone = async () => {
        if (!data?.isLoggedIn) return alert("Please login to clone builds!");
        if (confirm(`Clone "${selectedBuild.name}" to your dashboard?`)) {
            await onCloneBuild({ buildId: selectedBuild.id });
            alert("Build cloned! Check your dashboard.");
            setOpenDetailPopup(false);
        }
    };

    if (!data) return <Box sx={{ p: 10, textAlign: 'center' }}>Loading Forge...</Box>;

    return (
        <Box>
            <Box sx={{
                position: 'relative', height: '500px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' }
            }}>
                <Box sx={{ position: 'relative', textAlign: 'center', zIndex: 1, p: 2 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>Forge Your Ultimate Machine</Typography>
                    <Typography variant="h5" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        Build, share, discuss, and discover custom PC configurations.
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 1, maxWidth: '800px', mx: 'auto' }}>
                        Join the community today.
                    </Typography>

                    <Button variant="contained" size="large" href="/forger" startIcon={<AutoFixHighIcon />} sx={{ fontSize: '1.2rem', px: 4, py: 1.5 }}>
                        Start Forging
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 6, mb: 10 }}>
                <Box sx={{ mb: 4, borderLeft: '5px solid #ff8201', pl: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">Hall of Fame</Typography>
                        <Typography variant="subtitle1" color="text.secondary">The highest rated configurations from across the community.</Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<ListIcon />}
                        onClick={() => setOpenRankedPopup(true)}
                    >
                        Show All Top Ranked
                    </Button>
                </Box>

                <Grid container spacing={3} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            height: '100%', p: 3, bgcolor: '#ff8201', color: 'black', borderRadius: 2,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center'
                        }}>
                            <Typography color={'black'} variant="h4" fontWeight="bold" gutterBottom>The Elite</Typography>
                            <Typography fontWeight={'bold'}>
                                These 3 builds represent the pinnacle of performance and looks as voted by the PC Forge community.
                            </Typography>
                        </Box>
                    </Grid>

                    {data.prebuilts.map((build: any) => (
                        <Grid item xs={12} sm={6} md={3} key={build.id}>
                            <BuildCard build={build} onClick={() => handleCardClick(build)} />
                        </Grid>
                    ))}
                </Grid>

                <SectionHeader title="Community Forge" subtitle="Fresh builds from users around the world."/>
                <Grid container spacing={3}>
                    {data.communityBuilds.map((build: any) => (
                        <Grid item xs={12} sm={6} md={3} key={build.id}>
                            <BuildCard build={build} onClick={() => handleCardClick(build)} />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Button variant="outlined" size="large" href="/completed-builds">View All Community Builds</Button>
                </Box>

            </Container>

            <Dialog open={openDetailPopup} onClose={() => setOpenDetailPopup(false)} maxWidth="md" fullWidth>
                {selectedBuild && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">{selectedBuild.name}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">By {selectedBuild.username || "Unknown"}</Typography>
                            </Box>
                            <IconButton onClick={() => setOpenDetailPopup(false)}><CloseIcon /></IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Box component="img" src={selectedBuild.imageUrl || PLACEHOLDER_IMG} sx={{ width: '100%', borderRadius: 2, mb: 2 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Rating value={Number(selectedBuild.avgRating) || 0} readOnly precision={0.5} />
                                        <Typography>({selectedBuild.ratingCount || 0} reviews)</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>Build Specs</Typography>
                                    <ComponentRow name="CPU" value="Intel Core i9-13900K" /> {/* Placeholder */}
                                    <ComponentRow name="GPU" value="NVIDIA RTX 4090" />    {/* Placeholder */}

                                    <Box sx={{ mt: 4, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Button size="small" variant="outlined" startIcon={<StarIcon />}>Rate</Button>
                                            <Button size="small" variant="outlined" startIcon={<CommentIcon />}>Review</Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            {data.userId === selectedBuild.userId ? (
                                <Button variant="contained" href={`/forger?edit=${selectedBuild.id}`}>Edit</Button>
                            ) : (
                                <Button variant="contained" color="secondary" startIcon={<AutoFixHighIcon />} onClick={null}>
                                    Clone & Edit
                                </Button>
                            )}
                            <Button href={`/build/${selectedBuild.id}`}>View Full Details</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>


            <Dialog open={openRankedPopup} onClose={() => setOpenRankedPopup(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Hall of Fame (All Top Ranked)
                    <IconButton onClick={() => setOpenRankedPopup(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>

                        {data.prebuilts.concat(data.communityBuilds).map((build: any) => (
                            <Grid item xs={12} sm={6} md={3} key={`popup-${build.id}`}>
                                <BuildCard build={build} onClick={() => {
                                    setOpenRankedPopup(false);
                                    handleCardClick(build);
                                }} />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>

        </Box>
    );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <Box sx={{ mb: 4, borderLeft: '5px solid #1976d2', pl: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">{title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{subtitle}</Typography>
        </Box>
    );
}

function BuildCard({ build, onClick }: { build: any, onClick: () => void }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }} onClick={onClick}>
            <CardMedia component="img" height="160" image={build.imageUrl || PLACEHOLDER_IMG} alt={build.name} />
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography gutterBottom variant="h6" noWrap>{build.name}</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1, borderRadius: 1 }}>
                        <StarIcon fontSize="small" sx={{ color: '#faaf00', mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="bold">{Number(build.avgRating || 0).toFixed(1)}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {build.commentCount || 0} reviews
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

function ComponentRow({ name, value }: { name: string, value: string }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
            <Typography variant="body2" color="text.secondary">{name}</Typography>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
        </Box>
    );
}
