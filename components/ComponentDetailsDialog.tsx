import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Typography, Box, Grid, Chip, CircularProgress, IconButton,
    Table, TableBody, TableCell, TableContainer, TableRow, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {onGetComponentDetails} from '../pages/+Layout.telefunc';

export default function ComponentDetailsDialog({open, component, onClose}: any) {
    const [fullData, setFullData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && component) {
            setLoading(true);
            onGetComponentDetails({componentId: component.id})
                .then(data => setFullData(data))
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setFullData(null);
        }
    }, [open, component]);

    if (!open || !component) return null;

    const displayData = fullData || component;
    const specs = fullData?.details || {};

    const formatMoney = (amount: number) => `$${Number(amount).toFixed(2)}`;

    const renderValue = (key: string, val: any) => {
        if (Array.isArray(val)) {
            if (val.length > 0 && typeof val[0] === 'object') {
                return val.map((v: any) => v.formFactor || v.socket || JSON.stringify(v)).join(', ');
            }
            return val.join(', ');
        }

        const strVal = String(val);
        const lowerKey = key.toLowerCase();

        // Dodava merni edinici vo zavisnost koja komponenta e
        if (lowerKey.includes('capacity') || lowerKey.includes('vram') || lowerKey === 'memory') {
            return `${strVal} GB`;
        }

        if (lowerKey.includes('tdp') || lowerKey.includes('wattage')) {
            return `${strVal} W`;
        }

        if (lowerKey.includes('length') || lowerKey.includes('height') || lowerKey.includes('width')) {
            return `${strVal} mm`;
        }

        if (lowerKey.includes('clock')) {
            return `${strVal} GHz`;
        }
        if (lowerKey.includes('speed')) {
            return `${strVal} MHz`;
        }

        return strVal;
    };

    const formatKey = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            // fullWidth
            sx={{zIndex: 1400}}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#333',
                color: 'white'
            }}>
                <Box>
                    <Typography variant="caption" sx={{textTransform: 'uppercase', opacity: 0.7}}>
                        {displayData.brand}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                        {displayData.name}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{color: 'white'}}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 5}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Box
                                component="img"
                                // src={`https://placehold.co/400x400?text=${encodeURIComponent(displayData.name)}`}
                                src={displayData.imgUrl}
                                alt={displayData.name}
                                sx={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'contain',
                                    mb: 2,
                                    // border: '1px solid #eee',
                                    // borderRadius: 2,
                                    p: 2
                                }}
                            />
                            <Chip
                                label={displayData.type?.toUpperCase()}
                                color="primary"
                                sx={{fontWeight: 'bold'}}
                            />
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom
                                        sx={{borderBottom: '2px solid #ff8201', display: 'inline-block', mb: 0.5}}>
                                Technical Specifications
                            </Typography>

                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row"
                                                       sx={{fontWeight: 'bold', width: '30%', bgcolor: '#1e1e1e'}}>
                                                Brand
                                            </TableCell>
                                            <TableCell>{displayData.brand}</TableCell>
                                        </TableRow>

                                        {Object.entries(specs).map(([key, val]) => {
                                            if (key === 'componentId' || key === 'id') return null;

                                            return (
                                                <TableRow key={key}>
                                                    <TableCell component="th" scope="row" sx={{
                                                        fontWeight: 'bold',
                                                        width: '30%',
                                                        bgcolor: '#1e1e1e'
                                                    }}>
                                                        {formatKey(key)}
                                                    </TableCell>
                                                    <TableCell>{renderValue(key, val)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5}}>
                                <Typography variant="h4" color="primary.main" fontWeight="bold">
                                    {formatMoney(displayData.price)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{p: 2}}>
                <Button onClick={onClose} variant="contained"
                        sx={{
                            backgroundColor: '#ff8201',
                            color: 'white',
                            borderColor: '#ff8201',
                            onHover: {backgroundColor: '#ba5d02', borderColor: '#ba5d02'}
                        }}
                >Close</Button>
            </DialogActions>
        </Dialog>
    );
}
