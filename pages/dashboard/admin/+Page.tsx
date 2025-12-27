import React, { useEffect, useState } from 'react';
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

import {
    getAdminInfoAndData,
    onSetBuildApprovalStatus,
    onSetComponentSuggestionStatus
} from './adminDashboard.telefunc';

import BuildCard from '../../../components/BuildCard';
import BuildDetailsDialog from '../../../components/BuildDetailsDialog';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

    const [suggestionDialog, setSuggestionDialog] = useState<{ open: boolean, id: number | null, action: 'approved' | 'rejected' }>({ open: false, id: null, action: 'approved' });
    const [adminComment, setAdminComment] = useState("");

    const loadData = () => {
        getAdminInfoAndData()
            .then(res => { setData(res); setLoading(false); })
            .catch(err => {
                console.error(err);
                alert("Failed to load admin data. Are you an admin?");
            });
    };

    useEffect(() => { loadData(); }, []);

    const handleBuildReview = async (buildId: number, isApproved: boolean) => {
        if (!confirm(`Are you sure you want to ${isApproved ? 'APPROVE' : 'REJECT'} this build?`)) return;
        try {
            await onSetBuildApprovalStatus({ buildId, isApproved });
            loadData();
        } catch (e) { alert("Action failed"); }
    };

    const openSuggestionReview = (id: number, action: 'approved' | 'rejected') => {
        setSuggestionDialog({ open: true, id, action });
        setAdminComment(action === 'approved' ? "Approved by admin." : "Rejected: ");
    };

    const submitSuggestionReview = async () => {
        if (!suggestionDialog.id) return;
        try {
            await onSetComponentSuggestionStatus({
                suggestionId: suggestionDialog.id,
                status: suggestionDialog.action,
                adminComment: adminComment
            });
            // console.error("Test za admincomment: ", adminComment);
            setSuggestionDialog({ ...suggestionDialog, open: false });
            loadData();
        } catch (e) { alert("Failed to update suggestion"); }
    };

    if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;
    if (!data) return <Box sx={{ p: 5, textAlign: 'center' }}>Access Denied</Box>;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', bgcolor: '#1e1e1e', color: 'white' }}>
                        <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: 'error.main' }}>
                            <AdminPanelSettingsIcon sx={{ fontSize: 70 }} />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold">{data.admin.username}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>{data.admin.email}</Typography>

                        <Chip label="ADMINISTRATOR" color="error" variant="outlined" sx={{ fontWeight: 'bold' }} />
                        <Divider sx={{ width: '100%', my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="primary.main">
                                {data.pendingBuilds?.length || 0}
                            </Typography>
                            <Typography variant="caption">Pending Builds</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Grid container spacing={4} direction="column">
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, borderLeft: '6px solid #9c27b0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <MemoryIcon color="secondary" sx={{ mr: 1 }} />
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
                                            {data.componentSuggestions.map((sug: any) => (
                                                <TableRow key={sug.id}>
                                                    <TableCell sx={{ maxWidth: 300 }}>
                                                        <a href={sug.link} title={sug.link} style={{textDecoration: 'none', color: 'inherit'}}>
                                                            {sug.description || sug.link}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>{sug.componentType}</TableCell>
                                                    <TableCell>{sug.userId}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small" color="success" onClick={() => openSuggestionReview(sug.id, 'approved')}>
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => openSuggestionReview(sug.id, 'rejected')}>
                                                            <CancelIcon />
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
                            <Paper sx={{ p: 3, borderLeft: '6px solid #ed6c02', bgcolor: '#121212' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BuildIcon color="warning" sx={{ mr: 1 }} />
                                    <Typography variant="h6" fontWeight="bold">
                                        Builds Waiting for Approval ({data.pendingBuilds?.length || 0})
                                    </Typography>
                                </Box>

                                {data.pendingBuilds?.length === 0 ? (
                                    <Typography color="text.secondary">No pending builds.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {data.pendingBuilds.map((build: any) => (
                                            <Grid item xs={12} md={4} key={build.id}>
                                                <Box sx={{ position: 'relative' }}>
                                                    <BuildCard
                                                        build={build}
                                                        onClick={() => setSelectedBuildId(build.id)}
                                                    />
                                                    <Box sx={{
                                                        mt: 1, display: 'flex', gap: 1,
                                                        justifyContent: 'center', bgcolor: '#121212', p: 1, borderRadius: 1
                                                    }}>
                                                        <Button variant="contained" color="success" size="small" onClick={() => handleBuildReview(build.id, true)}>
                                                            Approve
                                                        </Button>
                                                        <Button variant="contained" color="error" size="small" onClick={() => handleBuildReview(build.id, false)}>
                                                            Reject
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
                            <Paper sx={{ p: 3, borderLeft: '6px solid #2e7d32' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    My Builds / Sandbox
                                </Typography>
                                {data.userBuilds?.length === 0 ? (
                                    <Typography color="text.secondary">No builds created by admin.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {data.userBuilds.slice(0, 4).map((build: any) => (
                                            <Grid item xs={12} md={3} key={build.id}>
                                                <BuildCard
                                                    build={build}
                                                    onClick={() => setSelectedBuildId(build.id)}
                                                />
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
                <DialogTitle>Review Suggestion</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Status: <b>{suggestionDialog.action.toUpperCase()}</b></Typography>
                    <TextField
                        fullWidth label="Admin Comment" multiline rows={3}
                        value={adminComment} onChange={(e) => setAdminComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuggestionDialog({...suggestionDialog, open: false})}>Cancel</Button>
                    <Button variant="contained" onClick={submitSuggestionReview}>Submit</Button>
                </DialogActions>
            </Dialog>

            <BuildDetailsDialog
                open={!!selectedBuildId}
                buildId={selectedBuildId}
                currentUser={data.admin?.id}
                onClose={() => setSelectedBuildId(null)}
                onClone={() => alert("Clone disabled in admin view")}
            />
        </Container>
    );
}
