import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardMedia, Typography, Box, Chip} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import {onGetBuildDetails} from "../pages/+Layout.telefunc";

export default function BuildCard({build, onClick}: { build: any, onClick?: () => void }) {
    const [caseImage, setCaseImage] = useState<string>("https://placehold.co/600x400?text=PC+Build");
    const [imageLoading, setImageLoading] = useState(true);

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
    }).format(build.total_price || 0);

    useEffect(() => {
        onGetBuildDetails({buildId: build.id})
            .then(details => {
                const caseComponent = details.components.find((c: any) => c.type === 'case');
                setCaseImage(caseComponent?.imgUrl || caseComponent?.imgUrl || "https://placehold.co/600x400?text=PC+Build");
            })
            .catch(() => {
            })
            .finally(() => setImageLoading(false));
    }, [build.id]);

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
                    image={caseImage || '/placeholder-pc.png'}
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
                <Box sx={{mb: 2}}>
                    <Typography variant="h6" component="div" fontWeight="bold" wrap title={build.name}>
                        {build.name}
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
                        <StarIcon sx={{color: '#faaf00', fontSize: 20, mr: 0.5}}/>
                        <Typography variant="body2" fontWeight="bold">
                            {Number(build.avgRating || 5).toFixed(1)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
