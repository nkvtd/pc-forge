export type ComponentType =
    | 'cpu'
    | 'gpu'
    | 'memory'
    | 'storage'
    | 'power_supply'
    | 'motherboard'
    | 'case'
    | 'cooler'
    | 'memory_card'
    | 'optical_drive'
    | 'sound_card'
    | 'cables'
    | 'network_adapter'
    | 'network_card';

export const requiredFields: Record<ComponentType, string[]> = {
    cpu: ['socket', 'cores', 'threads', 'baseClock', 'tdp'],
    gpu: ['vram', 'tdp', 'chipset', 'length'],
    memory: ['type', 'speed', 'capacity', 'modules'],
    storage: ['type', 'capacity', 'formFactor'],
    power_supply: ['type', 'wattage', 'formFactor'],
    motherboard: ['socket', 'chipset', 'formFactor', 'ramType', 'numRamSlots', 'maxRamCapacity', 'pciExpressSlots'],
    case: ['coolerMaxHeight', 'gpuMaxLength'],
    cooler: ['type', 'height', 'maxTdpSupported'],
    memory_card: ['numSlots', 'interface'],
    optical_drive: ['formFactor', 'type', 'interface', 'writeSpeed', 'readSpeed'],
    sound_card: ['sampleRate', 'bitDepth', 'chipset', 'interface', 'channel'],
    cables: ['lengthCm', 'type'],
    network_adapter: ['wifiVersion', 'interface', 'numAntennas'],
    network_card: ['numPorts', 'speed', 'interface']
};

export function validateComponentSpecificData(type: string, specificData: any): boolean {
    if (!(type in requiredFields)) {
        return false;
    }

    const fields = requiredFields[type as ComponentType];

    for (const field of fields) {
        const value = specificData[field];
        if (value === undefined || value === null || value === '') {
            return false;
        }
    }

    if (type === 'case') {
        if (specificData.storageFormFactors && !Array.isArray(specificData.storageFormFactors)) return false;
        if (specificData.psFormFactors && !Array.isArray(specificData.psFormFactors)) return false;
        if (specificData.moboFormFactors && !Array.isArray(specificData.moboFormFactors)) return false;
    }

    if (type === 'cooler') {
        if (specificData.cpuSockets && !Array.isArray(specificData.cpuSockets)) return false;
    }

    return true;
}

export function getValidationError(type: string, specificData: any): string | null {
    if (!(type in requiredFields)) {
        return `Invalid component type: ${type}`;
    }

    const fields = requiredFields[type as ComponentType];
    const missingFields: string[] = [];

    for (const field of fields) {
        const value = specificData[field];
        if (value === undefined || value === null || value === '') {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        return `Missing required fields: ${missingFields.join(', ')}`;
    }

    return null;
}