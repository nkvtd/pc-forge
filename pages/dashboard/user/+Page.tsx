import React, {useEffect, useState} from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Divider,
    Button,
    CircularProgress,
    Card,
    CardContent,
    CardActionArea,
    IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {getUserInfoAndData, onDeleteBuild} from "./userDashboard.telefunc";

type DashboardData = {
    user: { username: string; email?: string; [key: string]: any };
    userBuilds: any[];
    favoriteBuilds: any[];
};

export default function UserDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openMyBuildsDialog, setOpenMyBuildsDialog] = useState(false);

    const loadData = () => {
        getUserInfoAndData()
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load dashboard. Please log in.");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (buildId: number) => {
        if (!confirm("Are you sure you want to delete this build?")) return;
        try {
            await onDeleteBuild({buildId});
            loadData();
        } catch (e) {
            alert("Failed to delete build");
        }
    };

    if (loading) return <Box sx={{display: 'flex', justifyContent: 'center', mt: 10}}><CircularProgress/></Box>;
    if (error || !data) return <Container sx={{mt: 5, textAlign: 'center'}}><Typography color="error"
                                                                                        variant="h6">{error}</Typography><Button
        href="/auth/login" variant="contained">Login</Button></Container>;

    // @ts-ignore
    return (
        <Container maxWidth="xl" sx={{mt: 4, mb: 4, color: 'white'}}>
            <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
                    <Paper elevation={3}
                           sx={{p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
                        <Avatar sx={{width: 100, height: 100, mb: 2, bgcolor: 'primary.main'}}><PersonIcon
                            sx={{fontSize: 60}}/></Avatar>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{data.user.username}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{data.user.email}</Typography>
                        <Divider sx={{width: '100%', my: 2}}/>
                        {/*<Button variant="outlined" fullWidth color="primary" sx={{mb: 1}}>Edit Profile</Button>*/}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Grid container spacing={3} direction="column">

                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{p: 3, minHeight: '300px', bgcolor: '#1e1e1e'}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <FavoriteIcon color="error" sx={{mr: 1}}/>
                                    <Typography variant="h6" fontWeight="bold">Favorited Builds</Typography>
                                </Box>
                                <Divider sx={{mb: 2}}/>

                                {data.favoriteBuilds.length === 0 ? (
                                    <Typography color="text.secondary" align="center" sx={{mt: 4}}>You haven't favorited
                                        any builds yet.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {data.favoriteBuilds.map((build: any) => (
                                            <Grid item xs={12} sm={6} md={4} key={build.id}>
                                                <BuildCard build={build}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{p: 3, minHeight: '300px', bgcolor: '#1e1e1e'}}>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <ComputerIcon color="primary" sx={{mr: 1}}/>
                                        <Typography variant="h6" fontWeight="bold">My Builds</Typography>
                                    </Box>

                                    {data.userBuilds.length > 4 && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => setOpenMyBuildsDialog(true)}
                                        >
                                            See All ({data.userBuilds.length})
                                        </Button>
                                    )}
                                </Box>
                                <Divider sx={{mb: 2}}/>

                                {data.userBuilds.length === 0 ? (
                                    <Box sx={{textAlign: 'center', mt: 4}}>
                                        <Typography color="text.secondary" gutterBottom>You haven't created any builds
                                            yet.</Typography>
                                        <Button variant="contained" href="/forge"
                                                sx={{color: 'white', fontWeight: 'bolder'}}>Start Forging</Button>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {data.userBuilds.slice(0, 3).map((build: any) => (
                                            <Grid item xs={12} sm={6} md={3} key={build.id}>
                                                <BuildCard
                                                    build={build}
                                                    onDelete={() => handleDelete(build.id)}
                                                    isOwner={true}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>

                        <Dialog open={openMyBuildsDialog} onClose={() => setOpenMyBuildsDialog(false)} maxWidth="md"
                                fullWidth>
                            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>All
                                My Builds
                                <IconButton onClick={() => setOpenMyBuildsDialog(false)}>
                                    <CloseIcon/>
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={2} sx={{mt: 1}}>
                                    {data.userBuilds.map((build: any) => (
                                        <Grid item xs={12} sm={6} md={4} key={build.id}>
                                            <BuildCard
                                                build={build}
                                                onDelete={() => handleDelete(build.id)}
                                                isOwner={true}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => setOpenMyBuildsDialog(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>

                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

function BuildCard({build, onDelete, isOwner}: { build: any, onDelete?: () => void, isOwner?: boolean }) {
    return (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardActionArea href={`/build/${build.id}`} sx={{flexGrow: 1}}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {build.name || `Build #${build.id}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created: {build.createdAt ? new Date(build.createdAt).toLocaleDateString() : 'Unknown'}
                    </Typography>
                </CardContent>
            </CardActionArea>

            {isOwner && (
                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 1, borderTop: '1px solid #eee'}}>
                    <IconButton size="small" href={`/build/edit/${build.id}`} color="primary">
                        <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton size="small" onClick={onDelete} color="error">
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </Box>
            )}
        </Card>
    );
}