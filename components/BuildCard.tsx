import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

export default function BuildCard({ build, onClick }: { build: any, onClick: () => void }) {
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(build.total_price || 0);

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}
            onClick={onClick}
        >
            <CardMedia
                component="img"
                height="160"
                image={build.img_url || "https://placehold.co/600x400?text=PC+Build"}
                alt={build.name}
            />
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography gutterBottom variant="h6" noWrap title={build.name}>
                    {build.name}
                </Typography>

                {/*Ne se renderira user-ot*/}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                {/*    <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />*/}
                {/*    <Typography variant="caption">{build.user || 'Unknown'}</Typography>*/}
                    <Typography variant="h6" gutterBottom noWrap title={build.cpu}>{build.cpu}</Typography>
                    <Typography variant="h6" gutterBottom noWrap title={build.gpu}>{build.gpu}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Chip label={formattedPrice} size="small" color="primary" variant="outlined" />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" sx={{ color: '#faaf00', mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="bold">
                            {Number(build.avg_rating || 5).toFixed(1)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
