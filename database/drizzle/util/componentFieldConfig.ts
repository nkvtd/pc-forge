import {
    cablesTable, caseMoboFormFactorsTable, casePsFormFactorsTable,
    caseStorageFormFactorsTable, coolerCPUSocketsTable, coolersTable,
    CPUTable,
    GPUTable, memoryCardsTable,
    memoryTable, motherboardsTable,
    networkAdaptersTable,
    networkCardsTable, opticalDrivesTable, pcCasesTable, powerSupplyTable,
    soundCardsTable, storageTable
} from "../schema";

export type ComponentConfig<SelectType = any, InsertType = any> = {
    table: any;
    multiTables?: {
        storageFormFactors?: typeof caseStorageFormFactorsTable;
        psFormFactors?: typeof casePsFormFactorsTable;
        moboFormFactors?: typeof caseMoboFormFactorsTable;
        cpuSockets?: typeof coolerCPUSocketsTable;
    }
};

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

export const typeConfigMap: Record<ComponentType, ComponentConfig> = {
    cpu: { table: CPUTable },
    gpu: { table: GPUTable },
    memory: { table: memoryTable },
    storage: { table: storageTable },
    power_supply: { table: powerSupplyTable },
    motherboard: { table: motherboardsTable },
    case: {
        table: pcCasesTable,
        multiTables: {
            storageFormFactors: caseStorageFormFactorsTable,
            psFormFactors: casePsFormFactorsTable,
            moboFormFactors: caseMoboFormFactorsTable,
        },
    },
    cooler: {
        table: coolersTable,
        multiTables: {
            cpuSockets: coolerCPUSocketsTable,
        },
    },
    memory_card: { table: memoryCardsTable },
    optical_drive: { table: opticalDrivesTable },
    sound_card: { table: soundCardsTable },
    cables: { table: cablesTable },
    network_adapter: { table: networkAdaptersTable },
    network_card: { table: networkCardsTable },
};

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