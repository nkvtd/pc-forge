import {Chip, Typography} from '@mui/material';
import React from "react";

export function renderSpecs(c: any, type: string) {
    if (!c) return null;
    const data = {...c, ...(c.details || {})};
    const chipStyle = {height: 24, fontSize: '0.75rem', bgcolor: 'rgba(0,0,0,0.05)'};
    const specs: string[] = [];
    const val = (k: string) => data[k] || data[k.toLowerCase()] || data[k.replace('_', '')];

    switch (type) {

        case 'cpu':
            if (val('socket')) specs.push(`Socket: ${val('socket')}`);
            if (val('cores')) specs.push(`${val('cores')} Cores / ${val('threads')} Threads`);
            const base = data.baseclock || data.baseClock || data.base_clock;
            const boost = data.boostclock || data.boostClock || data.boost_clock;
            if (base) specs.push(`Base Clock Speed: ${base}GHz`);
            if (boost) specs.push(`Boost Clock Speed: ${boost}GHz`);
            break;
        case 'gpu':
            if (val('vram')) specs.push(`VRAM: ${val('vram')}GB`);
            if (val('tdp')) specs.push(`Card TDP: ${val('tdp')}W`);
            if (val('length')) specs.push(`Length: ${val('length')}mm`);
            if (val('baseClock')) specs.push(`Base Clock Speed: ${val('baseClock')}GHz`);
            if (val('boostClock')) specs.push(`Boost Clock Speed: ${val('boostClock')}GHz`);
            break;
        case 'motherboard':
            if (val('socket')) specs.push(`Socket: ${val('socket')}`);
            if (val('formFactor')) specs.push(`Form Factor: ${val('formFactor')}`);
            if (val('ramType')) specs.push(`RAM Type: ${val('ramType')}`);
            if (val('numRamSlots')) specs.push(`RAM Slots: ${val('numRamSlots')}`);
            if (val('maxRamCapacity')) specs.push(`Max Ram Caacity: ${val('maxRamCapacity')}GB`);
            break;
        case 'memory':
            if (val('capacity')) specs.push(`Size Per Stick: ${val('capacity')}GB`);
            if (val('type')) specs.push(`RAM Type: ${val('type')}`);
            if (val('speed')) specs.push(`RAM Speed: ${val('speed')} MHz`);
            if (val('modules')) specs.push(`Modules: ${val('modules')}`);
            break;
        case 'storage':
            if (val('capacity')) specs.push(`Capacity: ${val('capacity')}GB`);
            if (val('type')) specs.push(`Type: ${val('type')}`);
            break;
        case 'power_supply':
            if (val('wattage')) specs.push(`Wattage: ${val('wattage')}W`);
            if (val('type')) specs.push(`Type: ${val('type')}`);
            if (val('formFactor')) specs.push(`Form Factor: ${val('formFactor')}`);
            break;
        case 'case':
            if (val('gpuMaxLength')) specs.push(`Max GPU Length: ${val('gpuMaxLength')}mm`);
            if (val('coolerMaxHeight')) specs.push(`Max CPU Cooler Height: ${val('coolerMaxHeight')}mm`);
            break;
        case 'cooler':
            if (val('type')) specs.push(`Cooler Type: ${val('type')} Cooler`);
            if (val('height')) specs.push(`Height: ${val('height')}mm`);
            if (val('maxTdpSupported')) specs.push(`Max TDP: ${val('maxTdpSupported')}W`);
            break;
        case 'network_card':
            if (val('interface')) specs.push(`Interface: ${val('interface')}`);
            if (val('numPorts')) specs.push(`Number of Ports: ${val('numPorts')}`);
            if (val('speed')) specs.push(`Speed: ${val('speed')}Mbps`);
            break;
        case 'network_adapter':
            if (val('interface')) specs.push(`Interface: ${val('interface')}`);
            if (val('numAntennas')) specs.push(`Number of Antennas: ${val('numAntennas')}`);
            if (val('wifiVersion')) specs.push(`Wi-Fi Version: ${val('wifiVersion')}`);
            break;
        case 'sound_card':
            if (val('interface')) specs.push(`Interface: ${val('interface')}`);
            if (val('chipset')) specs.push(`Chipset: ${val('chipset')}`);
            if (val('channel')) specs.push(`Channels: ${val('channel')}`);
            break;
        case 'memory_card':
            if (val('interface')) specs.push(`Interface: ${val('interface')}`);
            if (val('numSlots')) specs.push(`Number of Slots: ${val('numSlots')}`);
            break;
        case 'optical_drive':
            if (val('interface')) specs.push(`Interface: ${val('interface')}`);
            if (val('type')) specs.push(`Type: ${val('type')}`);
            if (val('formFactor')) specs.push(`Form Factor: ${val('formFactor')}`);
            break;
        case 'cables':
            if (val('type')) specs.push(`Type of Cables: ${val('type')}`);
            if (val('lengthCm')) specs.push(`Length: ${val('lengthCm')}cm`);
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