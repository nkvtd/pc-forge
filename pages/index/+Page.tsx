import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ListIcon from '@mui/icons-material/List';

import BuildDetailsDialog from '../../components/BuildDetailsDialog';
import BuildCard from '../../components/BuildCard';

import { onGetApprovedBuilds, onGetAuthState, onCloneBuild } from '../+Layout.telefunc';

export default function HomePage() {
    const [data, setData] = useState<any>(null);

    const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

    const [openRankedPopup, setOpenRankedPopup] = useState(false);

    useEffect(() => {
        async function loadSite() {
            try {
                const [
                    authData, highestRankedBuilds, communityBuilds
                ] = await Promise.all([
                    onGetAuthState(),
                    onGetApprovedBuilds({ limit: 3 , sort: 'rating_desc' }),
                    onGetApprovedBuilds({ limit: 12 })
                ]);

                setData({
                    isLoggedIn: authData.isLoggedIn,
                    userId: authData.userId,
                    prebuilts: highestRankedBuilds,
                    communityBuilds: communityBuilds
                });
            } catch (error) {
                console.error("Error loading homepage data:", error);
            }
        }
        loadSite();
    }, []);

    const handleCloneWrapper = async (buildId: number) => {
        if (!data?.isLoggedIn) return alert("Please login to clone builds!");
        if (confirm(`Clone this build to your dashboard?`)) {
            await onCloneBuild({ buildId });
            alert("Build cloned! Check your dashboard.");
            setSelectedBuildId(null);
        }
    };

    if (!data) return <Box sx={{ p: 10, textAlign: 'center' }}>Loading Forge...</Box>;

    return (
        <Box>
            <Box sx={{
                position: 'relative', height: '500px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                '&::before': {
                    content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }
            }}>
                <Box sx={{ position: 'relative', textAlign: 'center', zIndex: 1, p: 2 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>Forge Your Ultimate Machine</Typography>
                    <Typography variant="h5" sx={{ maxWidth: '800px', mx: 'auto', mb: 1 }}>
                        Build, share, discuss, and discover custom PC configurations.
                    </Typography>
                    <Button variant="contained" size="large" href="/forger" startIcon={<AutoFixHighIcon />}
                            sx={{ fontSize: '1.2rem', px: 4, py: 1.5, mt: 2 }}>
                        Start Forging
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 6, mb: 10 }}>
                <Box sx={{
                    mb: 4, borderLeft: '5px solid #ff8201', pl: 2,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'end'
                }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">Hall of Fame</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            The highest rated configurations from across the community.
                        </Typography>
                    </Box>
                    <Button variant="outlined" startIcon={<ListIcon />} onClick={() => setOpenRankedPopup(true)}>
                        Show All Top Ranked
                    </Button>
                </Box>

                <Grid container spacing={2} sx={{ mb: 8, alignItems: 'stretch' }}>
                    {/*<Grid item xs={12} md={3} sx={{ display: 'flex' }}>*/}
                    {/*    <Box sx={{*/}
                    {/*        width: '100%', p: 3, bgcolor: '#ff8201', color: 'black', borderRadius: 2,*/}
                    {/*        display: 'flex', flexDirection: 'column', justifyContent: 'center'*/}
                    {/*    }}>*/}
                    {/*        <Typography color={'black'} variant="h5" fontWeight="bold" gutterBottom>The Elite</Typography>*/}
                    {/*        <Typography variant="body1" fontWeight="bold">The top 3 community-voted builds.</Typography>*/}
                    {/*    </Box>*/}
                    {/*</Grid>*/}

                    {data.prebuilts.slice(0, 3).map((build: any) => (
                        <Grid item xs={12} sm={6} md={3} key={build.id} sx={{ display: 'flex' }}>
                            <Box sx={{ width: '100%' }}>
                                <BuildCard
                                    build={build}
                                    onClick={() => setSelectedBuildId(build.id)}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>


                <SectionHeader title="Community Forge" subtitle="Fresh builds from users around the world."/>
                <Grid container spacing={3}>
                    {data.communityBuilds.map((build: any) => (
                        <Grid item xs={12} sm={6} md={3} key={build.id}>
                            <BuildCard
                                build={build}
                                onClick={() => setSelectedBuildId(build.id)}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Button variant="outlined" size="large" href="/completed-builds">View All Community Builds</Button>
                </Box>
            </Container>


            <BuildDetailsDialog
                open={!!selectedBuildId}
                buildId={selectedBuildId}
                currentUser={data.userId}
                onClose={() => setSelectedBuildId(null)}
                onClone={handleCloneWrapper}
            />


            <Dialog open={openRankedPopup} onClose={() => setOpenRankedPopup(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Hall of Fame (All Top Ranked)
                    <IconButton onClick={() => setOpenRankedPopup(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {data.prebuilts.concat(data.communityBuilds).map((build: any) => (
                            <Grid item xs={12} sm={6} md={3} key={`popup-${build.id}`}>
                                <BuildCard
                                    build={build}
                                    onClick={() => {
                                        setOpenRankedPopup(false);
                                        setSelectedBuildId(build.id); // Open details from popup
                                    }}
                                />
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
