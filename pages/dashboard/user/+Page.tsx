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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {getUserInfoAndData, onDeleteBuild} from "./userDashboard.telefunc";

import BuildCard from "../../../components/BuildCard";
import BuildDetailsDialog from "../../../components/BuildDetailsDialog";

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
    const [openFavoritesDialog, setOpenFavoritesDialog] = useState(false);
    const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, buildId: number | null, buildName: string }>({ open: false, buildId: null, buildName: '' });
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const openDeleteDialog = (buildId: number, buildName: string) => {
        setDeleteDialog({ open: true, buildId, buildName });
    };

    const handleDelete = async () => {
        if (!deleteDialog.buildId) return;
        setDeleteLoading(true);
        try {
            await onDeleteBuild({buildId: deleteDialog.buildId});
            setDeleteDialog({ open: false, buildId: null, buildName: '' });
            loadData();
            setSelectedBuildId(null);
        } catch (e) {
            alert("Failed to delete build");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <Box sx={{display: 'flex', justifyContent: 'center', mt: 10}}><CircularProgress/></Box>;
    if (error || !data) return <Container sx={{mt: 5, textAlign: 'center'}}><Typography color="error" variant="h6">{error}</Typography><Button href="/auth/login" variant="contained">Login</Button></Container>;

    return (
        <Container maxWidth="xl" sx={{mb: 4, color: 'white'}}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '280px 1fr'
                },
                gap: 2
            }}>
                <Box>
                    <Paper elevation={3} sx={{p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
                        <Avatar sx={{width: 100, height: 100, mb: 2, bgcolor: 'primary.main'}}>
                            <PersonIcon sx={{fontSize: 60}}/>
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{data.user.username}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{data.user.email}</Typography>
                        <Divider sx={{width: '100%', my: 2}}/>
                    </Paper>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <Paper elevation={3} sx={{p: 3, minHeight: '300px', bgcolor: '#1e1e1e'}}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <FavoriteIcon color="error" sx={{mr: 1}}/>
                                <Typography variant="h6" fontWeight="bold">Favorited Builds</Typography>
                            </Box>

                            {data.favoriteBuilds.length > 6 && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setOpenFavoritesDialog(true)}
                                >
                                    See All ({data.favoriteBuilds.length})
                                </Button>
                            )}
                        </Box>
                        <Divider sx={{mb: 2}}/>

                        {data.favoriteBuilds.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{mt: 4}}>
                                You haven't favorited any builds yet.
                            </Typography>
                        ) : (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)',
                                    xl: 'repeat(6, 1fr)'
                                },
                                gap: 2
                            }}>
                                {data.favoriteBuilds.slice(0, 6).map((build: any) => (
                                    <BuildCard
                                        key={build.id}
                                        build={build}
                                        onClick={() => setSelectedBuildId(build.id)}
                                    />
                                ))}
                            </Box>
                        )}
                    </Paper>

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

                            {data.userBuilds.length > 6 && (
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
                                <Typography color="text.secondary" gutterBottom>
                                    You haven't created any builds yet.
                                </Typography>
                                <Button variant="contained" href="/forge" sx={{color: 'white', fontWeight: 'bolder'}}>
                                    Start Forging
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)',
                                    xl: 'repeat(6, 1fr)'
                                },
                                gap: 2
                            }}>
                                {data.userBuilds.slice(0, 6).map((build: any) => (
                                    <Box key={build.id} sx={{ display: 'flex', flexDirection: 'column', pb: 2 }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <BuildCard
                                                build={build}
                                                onClick={() => setSelectedBuildId(build.id)}
                                            />
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon/>}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteDialog(build.id, build.name);
                                            }}
                                            sx={{ mt: 1, width: '100%' }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>

            <Dialog open={openMyBuildsDialog} onClose={() => setOpenMyBuildsDialog(false)} maxWidth="xl" fullWidth>
                <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    All My Builds
                    <IconButton onClick={() => setOpenMyBuildsDialog(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                            xl: 'repeat(5, 1fr)'
                        },
                        gap: 2,
                        mt: 1,
                    }}>
                        {data.userBuilds.map((build: any) => (
                            <Box key={build.id} sx={{ pb: 4 }}>
                                <BuildCard
                                    build={build}
                                    onClick={() => {
                                        setOpenMyBuildsDialog(false);
                                        setSelectedBuildId(build.id);
                                    }}
                                />
                                <Box sx={{mt: 1, display: 'flex', justifyContent: 'center'}}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon/>}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDeleteDialog(build.id, build.name);
                                        }}
                                        sx={{width: '100%'}}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMyBuildsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFavoritesDialog} onClose={() => setOpenFavoritesDialog(false)} maxWidth="xl" fullWidth>
                <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    All Favorited Builds
                    <IconButton onClick={() => setOpenFavoritesDialog(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                            xl: 'repeat(5, 1fr)'
                        },
                        gap: 2,
                        mt: 1
                    }}>
                        {data.favoriteBuilds.map((build: any) => (
                            <BuildCard
                                key={build.id}
                                build={build}
                                onClick={() => {
                                    setOpenFavoritesDialog(false);
                                    setSelectedBuildId(build.id);
                                }}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFavoritesDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, buildId: null, buildName: '' })}>
                <DialogTitle>Delete Build</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>{deleteDialog.buildName}</Typography>
                    <Typography color="text.secondary">
                        Are you sure you want to permanently delete this build? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, buildId: null, buildName: '' })}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Build'}
                    </Button>
                </DialogActions>
            </Dialog>

            <BuildDetailsDialog
                open={!!selectedBuildId}
                buildId={selectedBuildId}
                currentUser={data?.user?.id ? Number(data.user.id) : undefined}
                onClose={() => {
                    setSelectedBuildId(null);
                    loadData();
                }}
                isDashboardView={true}
            />
        </Container>
    );
}
