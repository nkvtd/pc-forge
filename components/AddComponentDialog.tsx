import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Grid, Box, Typography, MenuItem, IconButton, Avatar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { onCreateNewComponent, onGetDetailsForNewComponent } from '../pages/dashboard/admin/adminDashboard.telefunc';

const COMPONENT_TYPES = [
    { value: 'cpu', label: 'CPU' },
    { value: 'gpu', label: 'Graphics Card' },
    { value: 'motherboard', label: 'Motherboard' },
    { value: 'memory', label: 'Memory' },
    { value: 'storage', label: 'Storage' },
    { value: 'power_supply', label: 'Power Supply' },
    { value: 'case', label: 'Case' },
    { value: 'cooler', label: 'CPU Cooler' },
];

export default function AddComponentDialog({ open, onClose, onSuccess }: {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [type, setType] = useState('');

    const [requiredFields, setRequiredFields] = useState<any[]>([]);
    const [multiTables, setMultiTables] = useState<any>({});
    const [specificData, setSpecificData] = useState<any>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (type) {
            setLoading(true);
            onGetDetailsForNewComponent({ type })
                .then((details) => {
                    console.log('Component details:', details);

                    setRequiredFields(details.requiredFields || []);
                    setMultiTables(details.multiTables || {});

                    const initialData: any = {};

                    (details.requiredFields || []).forEach((field: any) => {
                        const fieldName = typeof field === 'string' ? field : field.name;
                        initialData[fieldName] = '';
                    });

                    Object.keys(details.multiTables || {}).forEach((tableName) => {
                        initialData[tableName] = [];
                    });

                    setSpecificData(initialData);
                })
                .catch((err) => {
                    console.error('Field load error:', err);
                    setError('Failed to load component fields');
                })
                .finally(() => setLoading(false));
        }
    }, [type]);

    const handleFieldChange = (fieldName: string, value: any) => {
        setSpecificData((prev: any) => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleAddMultiTableRow = (tableName: string) => {
        const tableConfig = multiTables[tableName];
        const newRow: any = {};

        tableConfig.forEach((field: string) => {
            newRow[field] = '';
        });

        setSpecificData((prev: any) => ({
            ...prev,
            [tableName]: [...(prev[tableName] || []), newRow]
        }));
    };

    const handleRemoveMultiTableRow = (tableName: string, index: number) => {
        setSpecificData((prev: any) => ({
            ...prev,
            [tableName]: prev[tableName].filter((_: any, i: number) => i !== index)
        }));
    };

    const handleMultiTableFieldChange = (tableName: string, index: number, fieldName: string, value: any) => {
        setSpecificData((prev: any) => {
            const updated = [...prev[tableName]];
            updated[index] = { ...updated[index], [fieldName]: value };
            return { ...prev, [tableName]: updated };
        });
    };

    const handleSubmit = async () => {
        setError('');

        if (!name.trim()) return setError('Name is required');
        if (!brand.trim()) return setError('Brand is required');
        if (!price || isNaN(Number(price)) || Number(price) <= 0) return setError('Valid price is required');
        if (!imgUrl.trim()) return setError('Image URL is required');
        if (!type) return setError('Component type is required');

        setLoading(true);
        try {
            await onCreateNewComponent({
                name: name.trim(),
                brand: brand.trim(),
                price: Number(price),
                imgUrl: imgUrl.trim(),
                type,
                specificData
            });

            onSuccess();
            handleClose();
        } catch (err) {
            setError('Failed to create component. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName('');
        setBrand('');
        setPrice('');
        setImgUrl('');
        setType('');
        setSpecificData({});
        setRequiredFields([]);
        setMultiTables({});
        setError('');
        onClose();
    };

    const formatFieldLabel = (fieldName: string): string => {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str: string) => str.toUpperCase());
    };

    const renderAllFields = () => {
        const allFields = [...(requiredFields || []), ...(Object.values(multiTables).flat() || [])];

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {allFields.map((field: any, index: number) => {
                    const fieldName = typeof field === 'string' ? field : field.name;

                    const isNumber = fieldName.includes('height') || fieldName.includes('length') ||
                        fieldName.includes('wattage') || fieldName.includes('capacity') ||
                        fieldName.includes('speed') || fieldName.includes('cores') ||
                        fieldName.includes('threads') || fieldName.includes('vram') ||
                        fieldName.includes('slots') || fieldName.includes('numSlots');

                    return (
                        <TextField
                            key={`${fieldName}-${index}`}
                            fullWidth
                            label={formatFieldLabel(fieldName)}
                            value={specificData[fieldName] || ''}
                            onChange={(e) => handleFieldChange(fieldName, isNumber ? Number(e.target.value) : e.target.value)}
                            type={isNumber ? 'number' : 'text'}
                            required
                            sx={{ mb: 2 }}
                        />
                    );
                })}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle sx={{ bgcolor: '#ff8201', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'column' }}>
                <Typography variant="h6" fontWeight="bold">Add New Component</Typography>
                <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Basic Information
                        </Typography>

                        <TextField
                            fullWidth
                            select
                            label="Component Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        >
                            {COMPONENT_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Price (EUR)"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    inputProps={{ step: '0.01', min: '0' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Image URL"
                                    value={imgUrl}
                                    onChange={(e) => setImgUrl(e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {imgUrl && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Avatar
                                src={imgUrl}
                                variant="rounded"
                                sx={{ width: 120, height: 120, bgcolor: '#f5f5f5' }}
                            />
                        </Box>
                    )}

                    {type && (requiredFields.length > 0 || Object.keys(multiTables).length > 0) && (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                                {COMPONENT_TYPES.find(ct => ct.value === type)?.label} Specifications
                            </Typography>
                            {renderAllFields()}
                        </Box>
                    )}

                    {Object.keys(multiTables).map((tableName) => (
                        <Box key={tableName}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {tableName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddMultiTableRow(tableName)}
                                    variant="outlined"
                                >
                                    Add Row
                                </Button>
                            </Box>

                            {(specificData[tableName] || []).map((row: any, index: number) => (
                                <Box key={index} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            Row {index + 1}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveMultiTableRow(tableName, index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {multiTables[tableName].map((fieldName: string) => (
                                            <Grid item xs={12} sm={6} md={4} key={fieldName}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    value={row[fieldName] || ''}
                                                    onChange={(e) => handleMultiTableFieldChange(tableName, index, fieldName, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || !type}
                >
                    {loading ? 'Creating...' : 'Create Component'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
