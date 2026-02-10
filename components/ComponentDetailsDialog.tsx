import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Typography, Box, Chip, CircularProgress, IconButton,
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
            if (val.length === 0) return 'None';

            if (typeof val[0] === 'string') {
                return val.join(', ');
            }

            if (typeof val[0] === 'object') {
                const parts = val
                    .map((v: any) =>
                        v.socket ||
                        v.formFactor ||
                        v.name ||
                        v.type ||
                        Object.values(v)[0]
                    )
                    .filter(Boolean);
                return parts.length > 0 ? parts.join(', ') : 'None';
            }

            return val.join(', ');
        }

        const strVal = String(val);
        const lowerKey = key.toLowerCase();

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
            maxWidth="md"
            fullWidth
            scroll="body"
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

            <DialogContent
                sx={{
                    p: 1,
                    overflow: 'visible'
                }}
            >
                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 5}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr'
                            },
                            gap: 4,
                            width: '100%'
                        }}
                    >
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Box
                                component="img"
                                src={displayData.imgUrl}
                                alt={displayData.name}
                                sx={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'contain',
                                    mb: 1,
                                    mt: 7,
                                    p: 1
                                }}
                            />
                            <Chip
                                label={displayData.type?.toUpperCase()}
                                color="primary"
                                sx={{fontWeight: 'bold'}}
                            />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '70%'
                        }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    borderBottom: '2px solid #ff8201',
                                    mb: 1,
                                    mt: 1,
                                    textAlign: 'center',
                                    width: '100%'
                                }}
                            >
                                Technical Specifications
                            </Typography>

                            <TableContainer
                                component={Paper}
                                variant="outlined"
                                sx={{
                                    maxWidth: '100%',
                                    width: '100%'
                                }}
                            >
                                <Table size="medium">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    width: '50%',
                                                    bgcolor: '#1e1e1e',
                                                    textAlign: 'center',
                                                    px: 2
                                                }}
                                            >
                                                Brand
                                            </TableCell>
                                            <TableCell sx={{
                                                textAlign: 'center',
                                                px: 2,
                                                width: '50%'
                                            }}>
                                                {displayData.brand}
                                            </TableCell>
                                        </TableRow>

                                        {Object.entries(specs).map(([key, val]) => {
                                            if (key === 'componentId' || key === 'id') return null;

                                            return (
                                                <TableRow key={key}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            width: '50%',
                                                            bgcolor: '#1e1e1e',
                                                            textAlign: 'center',
                                                            px: 2
                                                        }}
                                                    >
                                                        {formatKey(key)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        textAlign: 'center',
                                                        px: 2,
                                                        width: '50%'
                                                    }}>
                                                        {renderValue(key, val)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 1,
                                width: '100%'
                            }}>
                                <Typography variant="h4" color="primary.main" fontWeight="bold">
                                    {formatMoney(displayData.price)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{p: 2}}>
                <Button onClick={onClose} variant="contained"
                        sx={{
                            backgroundColor: '#ff8201',
                            color: 'white',
                            borderColor: '#ff8201',
                            '&:hover': {backgroundColor: '#ba5d02', borderColor: '#ba5d02'}
                        }}
                >Close</Button>
            </DialogActions>
        </Dialog>
    );
}
