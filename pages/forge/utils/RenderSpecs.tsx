import { Chip, Typography } from '@mui/material';
import React from "react";

export function renderSpecs(c: any, type: string) {
    if (!c) return null;
    const data = {...c, ...(c.details || {})};
    const chipStyle = {height: 24, fontSize: '0.75rem', bgcolor: 'rgba(0,0,0,0.05)'};
    const specs: string[] = [];
    const val = (k: string) => data[k] || data[k.toLowerCase()] || data[k.replace('_', '')];

    switch (type) {
        case 'cpu':
            if (val('socket')) specs.push(val('socket'));
            if (val('cores')) specs.push(`${val('cores')} Cores / ${val('threads')} Threads`);
            const base = data.baseclock || data.baseClock || data.base_clock;
            const boost = data.boostclock || data.boostClock || data.boost_clock;
            if (base) specs.push(`Base: ${base}GHz`);
            if (boost) specs.push(`Boost: ${boost}GHz`);
            break;
        case 'gpu':
            if (val('vram')) specs.push(`${val('vram')}GB VRAM`);
            if (val('chipset')) specs.push(val('chipset'));
            if (val('length')) specs.push(`L: ${val('length')}mm`);
            break;
        case 'motherboard':
            if (val('socket')) specs.push(val('socket'));
            if (val('formfactor')) specs.push(val('formfactor'));
            if (val('ramtype')) specs.push(val('ramtype'));
            break;
        case 'memory':
            if (val('capacity')) specs.push(`${val('capacity')}GB`);
            if (val('type')) specs.push(val('type'));
            if (val('speed')) specs.push(`${val('speed')} MHz`);
            if (val('modules')) specs.push(`${val('modules')}x`);
            break;
        case 'storage':
            if (val('capacity')) specs.push(`${val('capacity')}GB`);
            if (val('type')) specs.push(val('type'));
            break;
        case 'power_supply':
            if (val('wattage')) specs.push(`Wattage: ${val('wattage')}W`);
            if (val('type')) specs.push(val('type'));
            break;
        case 'case':
            if (val('gpuMaxLength')) specs.push(`Max GPU Length: ${val('gpuMaxLength')}mm`);
            if (val('coolerMaxHeight')) specs.push(`Max CPU Cooler Height: ${val('coolerMaxHeight')}mm`);
            break;
        case 'cooler':
            if (val('type')) specs.push(`${val('type')} Cooler`);
            if (val('height')) specs.push(`${val('height')}mm`);
            break;
        default:
            if (data.brand) specs.push(data.brand);
    }

    if (specs.length === 0) {
        if (data.brand) return <Chip label={data.brand} sx={chipStyle}/>;
        return <Typography variant="caption" color="text.secondary">...</Typography>;
    }

    return specs.map((label, i) => <Chip key={i} label={label} sx={chipStyle}/>);
}