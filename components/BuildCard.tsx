import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardMedia, Typography, Box, Chip, CircularProgress} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import {onGetBuildDetails} from "../pages/+Layout.telefunc";

export default function BuildCard({build, onClick}: { build: any, onClick?: () => void }) {
    const [caseImage, setCaseImage] = useState<string>("https://placehold.co/600x400?text=PC+Build");
    const [imageLoading, setImageLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
    }).format(build.total_price || 0);

    useEffect(() => {
        setImageLoading(true);
        onGetBuildDetails({buildId: build.id})
            .then(fullDetails => {
                setDetails(fullDetails);

                const caseComponent = fullDetails.components?.find((c: any) => c.type === 'case');
                setCaseImage(
                    caseComponent?.imgUrl ||
                    "https://placehold.co/600x400?text=PC+Build"
                );
            })
            .catch((error) => {
                console.error("Failed to load build details:", error);
                setDetails(null);
            })
            .finally(() => {
                setImageLoading(false);
            });
    }, [build.id]);

    if (imageLoading) {
        return (
            <Card sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress />
            </Card>
        );
    }

    return (
        <Card
            onClick={onClick}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                } : {},
                position: 'relative'
            }}
        >
            <Box sx={{position: 'relative', paddingTop: '75%'}}>
                <CardMedia
                    component="img"
                    image={caseImage}
                    alt={build.name}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        p: 2,
                        bgcolor: '#f5f5f5'
                    }}
                />
            </Box>

            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box sx={{mb: 1}}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        {build.name}
                    </Typography>
                </Box>

                <Box sx={{mb: 2}}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{fontStyle: 'italic', fontSize: '0.875rem'}}
                    >
                        {details?.description || "No description provided."}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto'}}>
                    <Chip
                        label={formattedPrice}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{fontWeight: 'bold'}}
                    />
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <StarIcon sx={{color: '#faaf00', fontSize: 20, ml: 1}}/>
                        <Typography variant="body2" fontWeight="bold">
                            {Number(build.avgRating || 0).toFixed(1)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
