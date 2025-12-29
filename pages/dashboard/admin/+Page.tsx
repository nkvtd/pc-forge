import React, {useEffect, useState} from 'react';
import {
    Container, Grid, Paper, Typography, Box, Avatar, Divider, Button,
    CircularProgress, Table, TableBody, TableCell, TableHead, TableRow,
    Chip, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BuildIcon from '@mui/icons-material/Build';
import MemoryIcon from '@mui/icons-material/Memory';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    getAdminInfoAndData,
    onSetBuildApprovalStatus,
    onSetComponentSuggestionStatus
} from './adminDashboard.telefunc';

import BuildCard from '../../../components/BuildCard';
import BuildDetailsDialog from '../../../components/BuildDetailsDialog';
import {onDeleteBuild} from "../user/userDashboard.telefunc";
import AddComponentDialog from "../../../components/AddComponentDialog";

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean,
        buildId: number | null,
        buildName: string
    }>({open: false, buildId: null, buildName: ''});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [buildApprovalDialog, setBuildApprovalDialog] = useState<{
        open: boolean,
        buildId: number | null,
        buildName: string
    }>({open: false, buildId: null, buildName: ''});
    const [rejectReason, setRejectReason] = useState('');
    const [approvalLoading, setApprovalLoading] = useState(false);

    const [suggestionDialog, setSuggestionDialog] = useState<{
        open: boolean,
        id: number | null,
        action: 'approved' | 'rejected'
    }>({open: false, id: null, action: 'approved'});
    const [adminComment, setAdminComment] = useState("");

    const loadData = () => {
        setLoading(true);
        getAdminInfoAndData()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to load admin data. Are you an admin?");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const openBuildApproval = (buildId: number, buildName: string) => {
        setBuildApprovalDialog({open: true, buildId, buildName});
        setRejectReason('');
    };

    const handleApproveBuild = async () => {
        if (!buildApprovalDialog.buildId) return;
        setApprovalLoading(true);
        try {
            await onSetBuildApprovalStatus({buildId: buildApprovalDialog.buildId, isApproved: true});
            setBuildApprovalDialog({open: false, buildId: null, buildName: ''});
            loadData();
        } catch (e) {
            alert("Approve failed");
        } finally {
            setApprovalLoading(false);
        }
    };

    const handleRejectBuild = async () => {
        if (!buildApprovalDialog.buildId || !rejectReason.trim()) return;
        setApprovalLoading(true);
        try {
            await onSetBuildApprovalStatus({buildId: buildApprovalDialog.buildId, isApproved: false});
            setBuildApprovalDialog({open: false, buildId: null, buildName: ''});
            loadData();
        } catch (e) {
            alert("Reject failed");
        } finally {
            setApprovalLoading(false);
        }
    };

    const openSuggestionReview = (id: number, action: 'approved' | 'rejected') => {
        setSuggestionDialog({open: true, id, action});
        setAdminComment(action === 'approved' ? "" : "");
    };

    const submitSuggestionReview = async () => {
        if (!suggestionDialog.id) return;
        try {
            await onSetComponentSuggestionStatus({
                suggestionId: suggestionDialog.id,
                status: suggestionDialog.action,
                adminComment: adminComment
            });
            setSuggestionDialog({...suggestionDialog, open: false});
            loadData();
        } catch (e) {
            alert("Failed to update suggestion");
        }
    };

    const openDeleteDialog = (buildId: number, buildName: string) => {
        setDeleteDialog({open: true, buildId, buildName});
    };

    const handleDelete = async () => {
        if (!deleteDialog.buildId) return;
        setDeleteLoading(true);
        try {
            await onDeleteBuild({buildId: deleteDialog.buildId});
            setDeleteDialog({open: false, buildId: null, buildName: ''});
            loadData();
            setSelectedBuildId(null);
        } catch (e) {
            alert("Failed to delete build");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{mt: 4, mb: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
                <CircularProgress />
            </Container>
        );
    }

    if (!data) {
        return (
            <Container maxWidth="xl" sx={{mt: 4, mb: 10, textAlign: 'center', p: 5}}>
                <Typography variant="h6" color="error">
                    Access Denied - Admin privileges required
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{mt: 4, mb: 10}}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        bgcolor: '#1e1e1e',
                        color: 'white'
                    }}>
                        <Avatar sx={{width: 120, height: 120, mb: 2, bgcolor: 'error.main'}}>
                            <AdminPanelSettingsIcon sx={{fontSize: 70}}/>
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold">{data.admin?.username || 'Admin'}</Typography>
                        <Typography variant="body2" sx={{opacity: 0.7, mb: 3}}>
                            {data.admin?.email || 'admin@example.com'}
                        </Typography>

                        <Chip label="ADMINISTRATOR" color="error" variant="outlined" sx={{fontWeight: 'bold'}}/>
                        <Divider sx={{width: '100%', my: 3, bgcolor: 'rgba(255,255,255,0.1)'}}/>

                        <Box sx={{width: '100%', textAlign: 'center'}}>
                            <Typography variant="h3" fontWeight="bold" color="primary.main">
                                {data.pendingBuilds?.length || 0}
                            </Typography>
                            <Typography variant="caption">Pending Builds</Typography>
                        </Box>

                        <Box sx={{width: '100%', textAlign: 'center', mt: 3}}>
                            <Button
                                variant="contained"
                                color="warning"
                                size="large"
                                fullWidth
                                startIcon={<BuildIcon />}
                                onClick={() => setAddDialogOpen(true)}
                                sx={{ mb: 2 }}
                            >
                                Add Component
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Grid container spacing={4} direction="column">
                        <Grid item xs={12}>
                            <Paper sx={{p: 3, borderLeft: '6px solid #9c27b0'}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <MemoryIcon color="secondary" sx={{mr: 1}}/>
                                    <Typography variant="h6" fontWeight="bold">
                                        Suggested Components ({data.componentSuggestions?.length || 0})
                                    </Typography>
                                </Box>

                                {data.componentSuggestions?.length === 0 ? (
                                    <Typography color="text.secondary">No pending suggestions.</Typography>
                                ) : (
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Link/Description</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.componentSuggestions?.map((sug: any) => (
                                                <TableRow key={sug.id}>
                                                    <TableCell sx={{maxWidth: 300}}>
                                                        <a
                                                            href={sug.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title={sug.link}
                                                            style={{textDecoration: 'none', color: 'inherit'}}
                                                        >
                                                            {sug.description || sug.link}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>{sug.componentType?.toUpperCase()}</TableCell>
                                                    <TableCell>{sug.userId}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => openSuggestionReview(sug.id, 'approved')}
                                                        >
                                                            <CheckCircleIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => openSuggestionReview(sug.id, 'rejected')}
                                                        >
                                                            <CancelIcon/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{p: 3, borderLeft: '6px solid #ed6c02', bgcolor: '#121212'}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <BuildIcon color="warning" sx={{mr: 1}}/>
                                    <Typography variant="h6" fontWeight="bold">
                                        Builds Waiting for Approval ({data.pendingBuilds?.length || 0})
                                    </Typography>
                                </Box>

                                {data.pendingBuilds?.length === 0 ? (
                                    <Typography color="text.secondary">No pending builds.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {data.pendingBuilds.map((build: any) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={build.id}>
                                                <Box sx={{position: 'relative'}}>
                                                    <BuildCard
                                                        build={build}
                                                        onClick={() => setSelectedBuildId(build.id)}
                                                    />
                                                    <Box sx={{
                                                        mt: 1,
                                                        display: 'flex',
                                                        gap: 1,
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Button
                                                            variant="contained"
                                                            color="warning"
                                                            size="small"
                                                            startIcon={<BuildIcon />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openBuildApproval(build.id, build.name);
                                                            }}
                                                        >
                                                            Review
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{p: 3, borderLeft: '6px solid #2e7d32'}}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    My Builds / Sandbox
                                </Typography>
                                {data.userBuilds?.length === 0 ? (
                                    <Typography color="text.secondary">No builds created by admin.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {data.userBuilds.slice(0, 4).map((build: any) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={build.id}>
                                                <Box sx={{position: 'relative'}}>
                                                    <BuildCard
                                                        build={build}
                                                        onClick={() => setSelectedBuildId(build.id)}
                                                    />
                                                    <Box sx={{mt: 1, display: 'flex', justifyContent: 'center'}}>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDeleteDialog(build.id, build.name);
                                                            }}
                                                            fullWidth
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={suggestionDialog.open} onClose={() => setSuggestionDialog({...suggestionDialog, open: false})}>
                <DialogTitle>Review Component Suggestion</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Status: <b>{suggestionDialog.action.toUpperCase()}</b></Typography>
                    <TextField
                        fullWidth
                        label="Admin Comment"
                        multiline
                        rows={3}
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuggestionDialog({...suggestionDialog, open: false})}>Cancel</Button>
                    <Button variant="contained" onClick={submitSuggestionReview}>Submit</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={buildApprovalDialog.open}
                onClose={() => setBuildApprovalDialog({open: false, buildId: null, buildName: ''})}
            >
                <DialogTitle>Review Build</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>{buildApprovalDialog.buildName}</Typography>
                    <Typography color="text.secondary" sx={{mb: 2}}>
                        Build ID: {buildApprovalDialog.buildId}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Reject reason (optional)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Why reject this build?"
                        sx={{mt: 1}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setBuildApprovalDialog({open: false, buildId: null, buildName: ''})}
                        disabled={approvalLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRejectBuild}
                        variant="outlined"
                        color="error"
                        disabled={approvalLoading || !rejectReason.trim()}
                    >
                        {approvalLoading ? <CircularProgress size={20}/> : 'Reject'}
                    </Button>
                    <Button
                        onClick={handleApproveBuild}
                        variant="contained"
                        color="success"
                        disabled={approvalLoading}
                    >
                        {approvalLoading ? <CircularProgress size={20}/> : 'Approve'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({open: false, buildId: null, buildName: ''})}
            >
                <DialogTitle>Delete Build</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>{deleteDialog.buildName}</Typography>
                    <Typography color="text.secondary">
                        Are you sure you want to permanently delete this build? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialog({open: false, buildId: null, buildName: ''})}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20}/> : <DeleteIcon />}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Build'}
                    </Button>
                </DialogActions>
            </Dialog>

            <BuildDetailsDialog
                open={!!selectedBuildId}
                buildId={selectedBuildId!}
                currentUser={data.admin}
                onClose={() => setSelectedBuildId(null)}
                isDashboardView={true}
            />

            <AddComponentDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onSuccess={() => {
                    loadData();
                    setAddDialogOpen(false);
                }}
            />
        </Container>
    );
}
