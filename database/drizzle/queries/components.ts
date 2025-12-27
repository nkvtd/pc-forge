import type { Database } from "../db";
import {
    buildComponentsTable,
    buildsTable, cablesTable, caseMoboFormFactorsTable, casePsFormFactorsTable, caseStorageFormFactorsTable,
    componentsTable, coolerCPUSocketsTable, coolersTable,
    CPUTable,
    GPUTable, memoryCardsTable,
    memoryTable, motherboardsTable,
    networkAdaptersTable,
    networkCardsTable, opticalDrivesTable, pcCasesTable, powerSupplyTable,
    ratingBuildsTable, soundCardsTable, storageTable
} from "../schema";
import {and, asc, desc, eq, ilike, SQL, sql} from "drizzle-orm";
import {typeConfigMap, ComponentType} from "../util/componentFieldConfig";
import {AnyPgColumn} from "drizzle-orm/pg-core";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
export async function getAllComponents(db: Database, limit?: number, componentType?: string, sort?: string, q?: string) {
    let queryConditions = [];
    let sortConditions = [];

    if (q) {
        queryConditions.push(
            ilike(componentsTable.name, `%${q}%`)
        );
    }

    switch(sort) {
        case 'price_asc':
            sortConditions.push(
                asc(buildsTable.totalPrice)
            );
            break;
        case 'price_desc':
            sortConditions.push(
                desc(buildsTable.totalPrice)
            );
            break;
        default:
            sortConditions.push(
                desc(buildsTable.createdAt)
            );
            break;
    }

    if(componentType && componentType.trim() !== 'all') {
        queryConditions.push(
            eq(componentsTable.type, componentType.trim().toLowerCase())
        );
    }

    const components = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
        })
        .from(componentsTable)
        .where(
            queryConditions.length > 0 ?
                and (
                    ...queryConditions
                )
                : undefined
        )
        .orderBy(
            ...sortConditions
        )
        .limit(limit || 100); // 100 placeholder

    return components;
}

export async function getComponentDetails(db: Database, componentId: number) {
    const [component] = await db
        .select()
        .from(componentsTable)
        .where(
            eq(componentsTable.id, componentId)
        )
        .limit(1);

    if(!component) return null;

    const config = typeConfigMap[component.type as ComponentType];

    const [details] = await db
        .select()
        .from(config.table)
        .where(
            eq(config.table.componentId, componentId)
        )
        .limit(1);

    if (component.type === 'case') {
        details.storageFormFactors = await db.select().from(caseStorageFormFactorsTable).where(eq(caseStorageFormFactorsTable.caseId, componentId));
        details.psFormFactors = await db.select().from(casePsFormFactorsTable).where(eq(casePsFormFactorsTable.caseId, componentId));
        details.moboFormFactors = await db.select().from(caseMoboFormFactorsTable).where(eq(caseMoboFormFactorsTable.caseId, componentId));
    }

    if (component.type === 'cooler') {
        details.cpuSockets = await db.select().from(coolerCPUSocketsTable).where(eq(coolerCPUSocketsTable.coolerId, componentId));
    }

    return {
        ...component,
        details: details
    };
}

export async function addNewComponent(db: Database, name: string, brand: string, price: number, imgUrl: string, type: string, specificData: any) {
    return db.transaction(async (tx) => {
        const [newComponent] = await tx
            .insert(componentsTable)
            .values({
                name: name,
                brand: brand,
                price: price.toFixed(2),
                imgUrl: imgUrl,
                type: type
            })
            .returning({
                id: componentsTable.id
            });

        const componentId = newComponent.id;

        const config = typeConfigMap[type as ComponentType];

        await tx
            .insert(config.table)
            .values({
                componentId: componentId,
                ...specificData
            });

        if (type === 'case') {
            if (specificData.storageFormFactors) {
                await tx.insert(caseStorageFormFactorsTable).values(
                    specificData.storageFormFactors.map((sf: any) => ({
                        caseId: componentId,
                        formFactor: sf.formFactor,
                        numSlots: sf.numSlots,
                    }))
                );
            }
            if (specificData.psFormFactors) {
                await tx.insert(casePsFormFactorsTable).values(
                    specificData.psFormFactors.map((pf: any) => ({
                        caseId: componentId,
                        formFactor: pf.formFactor,
                    }))
                );
            }
            if (specificData.moboFormFactors) {
                await tx.insert(caseMoboFormFactorsTable).values(
                    specificData.moboFormFactors.map((mf: any) => ({
                        caseId: componentId,
                        formFactor: mf.formFactor,
                    }))
                );
            }
        }

        if (type === 'cooler' && specificData.cpuSockets) {
            await tx.insert(coolerCPUSocketsTable).values(
                specificData.cpuSockets.map((socket: any) => ({ coolerId: componentId, socket }))
            );
        }

        return componentId;
    });
}

export async function getBuildComponents(db: Database, buildId: number) {
    const [build] = await db
        .select({
            buildId: buildsTable.id,
            userId: buildsTable.userId,
        })
        .from(buildsTable)
        .where(
            eq(buildsTable.id, buildId)
        )
        .limit(1);

    if(!build) return null;

    const components = await db
        .select({
            id: componentsTable.id,
            type: componentsTable.type,
        })
        .from(buildComponentsTable)
        .where(
            eq(buildComponentsTable.buildId, buildId)
        )
        .innerJoin(
            componentsTable,
            eq(buildComponentsTable.componentId, componentsTable.id)
        );

    const componentsDetails = [];

    for (const comp of components) {
        const config = typeConfigMap[comp.type as ComponentType];

        const [details] = await db
            .select()
            .from(config.table)
            .where(
                eq(config.table.componentId, comp.id)
            )
            .limit(1);

        if (comp.type === 'case') {
            details.storageFormFactors = await db.select().from(caseStorageFormFactorsTable).where(eq(caseStorageFormFactorsTable.caseId, comp.id));
            details.psFormFactors = await db.select().from(casePsFormFactorsTable).where(eq(casePsFormFactorsTable.caseId, comp.id));
            details.moboFormFactors = await db.select().from(caseMoboFormFactorsTable).where(eq(caseMoboFormFactorsTable.caseId, comp.id));
        }

        if (comp.type === 'cooler') {
            details.cpuSockets = await db.select().from(coolerCPUSocketsTable).where(eq(coolerCPUSocketsTable.coolerId, comp.id));
        }

        componentsDetails.push({
            ...comp,
            details: details
        });
    }

    return componentsDetails;
}

export async function getCompatibleComponents(db: Database, buildId: number, componentType: string, limit?: number, sort?: string) {
    let sortCondition: any;

    switch(sort) {
        case 'price_asc':
            sortCondition = asc(componentsTable.price);
            break;
        case 'price_desc':
            sortCondition = desc(componentsTable.price);
            break;
        default:
            sortCondition = desc(componentsTable.price);
            break;
    }

    const existingComponents = await getBuildComponents(db, buildId);

    if(!existingComponents) return null;

    const existing = {
        cpu: existingComponents.find(c => c.type === 'cpu'),
        motherboard: existingComponents.find(c => c.type === 'motherboard'),
        case: existingComponents.find(c => c.type === 'case'),
        cooler: existingComponents.find(c => c.type === 'cooler'),
        psu: existingComponents.find(c => c.type === 'power_supply'),
        gpu: existingComponents.find(c => c.type === 'gpu'),
        memory: existingComponents.filter(c => c.type === 'memory'),
        storage: existingComponents.filter(c => c.type === 'storage'),
        networkCards: existingComponents.filter(c => c.type === 'network_card'),
        networkAdapters: existingComponents.filter(c => c.type === 'network_adapter'),
        soundCards: existingComponents.filter(c => c.type === 'sound_card'),
    };

    const pciExpressSlotsUsed = [
        existing.gpu,
        ...existing.networkCards,
        ...existing.networkAdapters,
        ...existing.soundCards
    ].filter(Boolean).length;

    const existingTDP = existingComponents.reduce((sum, c) => {
        const tdp = c.details?.tdp ? Number(c.details.tdp) : 0;
        return sum + tdp;
    }, 0);


    let compatibleComponents: any[] = [];

    switch (componentType) {
        case 'cpu':
            compatibleComponents = await getCompatibleCPUs(db, existing, limit, sortCondition);
            break;
        case 'motherboard':
            compatibleComponents = await getCompatibleMotherboards(db, existing, pciExpressSlotsUsed, limit, sortCondition);
            break;
        case 'cooler':
            compatibleComponents = await getCompatibleCoolers(db, existing, limit, sortCondition);
            break;
        case 'gpu':
            compatibleComponents = await getCompatibleGPUs(db, existing, pciExpressSlotsUsed, limit, sortCondition);
            break;
        case 'memory':
            compatibleComponents = await getCompatibleMemory(db, existing, limit, sortCondition);
            break;
        case 'storage':
            compatibleComponents = await getCompatibleStorage(db, existing, limit, sortCondition);
            break;
        case 'case':
            compatibleComponents = await getCompatibleCases(db, existing, limit, sortCondition);
            break;
        case 'power_supply':
            compatibleComponents = await getCompatiblePSUs(db, existing, existingTDP, limit, sortCondition);
            break;
        case 'network_card':
        case 'network_adapter':
        case 'sound_card':
            compatibleComponents = await getCompatiblePCIeComponents(db, existing, componentType, pciExpressSlotsUsed, limit, sortCondition);
            break;
        default:
            compatibleComponents = [];
    }

    if(compatibleComponents.length === 0) return null;

    return compatibleComponents;
}


// Helper functions for checking component-specific compatibility
async function getCompatibleCPUs(db: Database, existing: any, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'cpu')];

    if (existing.motherboard) {
        conditions.push(
            eq(CPUTable.socket, existing.motherboard.details.socket)
        );
    }

    if (existing.cooler) {
        conditions.push(
            sql`${CPUTable.tdp} <= ${existing.cooler.details.maxTdpSupported}`
        );
    }

    const cpus = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            socket: CPUTable.socket,
            cores: CPUTable.cores,
            threads: CPUTable.threads,
            baseClock: CPUTable.baseClock,
            boostClock: CPUTable.boostClock,
            tdp: CPUTable.tdp,
        })
        .from(componentsTable)
        .innerJoin(
            CPUTable,
            eq(componentsTable.id, CPUTable.componentId)
        )
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if (existing.cooler?.details?.cpuSockets) {
        const coolerSockets = existing.cooler.details.cpuSockets.map((s: any) => s.socket);
        return cpus.filter(cpu => coolerSockets.includes(cpu.socket));
    }

    return cpus;
}

async function getCompatibleMotherboards(db: Database, existing: any, pciExpressSlotsUsed: number, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'motherboard')];

    if (existing.cpu) {
        conditions.push(
            eq(motherboardsTable.socket, existing.cpu.details.socket)
        );
    }

    if (existing.memory.length > 0) {
        const ramType = existing.memory[0].details.type;
        conditions.push(
            eq(motherboardsTable.ramType, ramType)
        );
    }

    if (pciExpressSlotsUsed > 0) {
        conditions.push(
            sql`${motherboardsTable.pciExpressSlots} >= ${pciExpressSlotsUsed}`
        );
    }

    const motherboards = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            socket: motherboardsTable.socket,
            chipset: motherboardsTable.chipset,
            formFactor: motherboardsTable.formFactor,
            ramType: motherboardsTable.ramType,
            numRamSlots: motherboardsTable.numRamSlots,
            maxRamCapacity: motherboardsTable.maxRamCapacity,
            pciExpressSlots: motherboardsTable.pciExpressSlots,
        })
        .from(componentsTable)
        .innerJoin(
            motherboardsTable,
            eq(componentsTable.id, motherboardsTable.componentId)
        )
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    const compatibleMotherboards = motherboards.filter(mobo => {
        if (existing.memory.length > 0) {
            const totalModules = existing.memory.reduce((sum: number, m: any) =>
                sum + Number(m.details.modules), 0
            );
            const totalCapacity = existing.memory.reduce((sum: number, m: any) =>
                sum + Number(m.details.capacity), 0
            );

            if (totalModules > Number(mobo.numRamSlots)) return false;
            if (totalCapacity > Number(mobo.maxRamCapacity)) return false;
        }

        return true;
    });

    if (existing.case?.details?.moboFormFactors) {
        const caseFormFactors = existing.case.details.moboFormFactors.map((f: any) => f.formFactor);
        return compatibleMotherboards.filter(mobo => caseFormFactors.includes(mobo.formFactor));
    }

    return compatibleMotherboards;
}

async function getCompatibleCoolers(db: Database, existing: any, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'cooler')];

    if (existing.cpu) {
        conditions.push(
            sql`${coolersTable.maxTdpSupported} >= ${existing.cpu.details.tdp}`
        );
    }

    if (existing.case) {
        conditions.push(
            sql`${coolersTable.height} <= ${existing.case.details.coolerMaxHeight}`
        );
    }

    const coolers = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            coolerType: coolersTable.type,
            height: coolersTable.height,
            maxTdpSupported: coolersTable.maxTdpSupported,
        })
        .from(componentsTable)
        .innerJoin(
            coolersTable,
            eq(componentsTable.id, coolersTable.componentId)
        )
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);


    if(existing.cpu && coolers.length > 0) {
        const coolerIds = coolers.map(c => c.id);

        const allSockets = await db
            .select({
                coolerId: coolerCPUSocketsTable.coolerId,
                socket: coolerCPUSocketsTable.socket
            })
            .from(coolerCPUSocketsTable)
            .where(
                inArray(coolerCPUSocketsTable.coolerId, coolerIds)
            );
        const socketsByCooler = allSockets.reduce((acc, { coolerId, socket }) => {
            if (!acc[coolerId]) acc[coolerId] = [];
            acc[coolerId].push(socket);
            return acc;
        }, {} as Record<number, string[]>);

        return coolers.filter(cooler => {
            const sockets = socketsByCooler[cooler.id] || [];
            return sockets.includes(existing.cpu.details.socket);
        });
    }

    return coolers;
}

async function getCompatibleGPUs(db: Database, existing: any, pciExpressSlotsUsed: number, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'gpu')];

    if (existing.case) {
        conditions.push(
            sql`${GPUTable.length} <= ${existing.case.details.gpuMaxLength}`
        );
    }

    const gpus = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            vram: GPUTable.vram,
            tdp: GPUTable.tdp,
            baseClock: GPUTable.baseClock,
            boostClock: GPUTable.boostClock,
            chipset: GPUTable.chipset,
            length: GPUTable.length,
        })
        .from(componentsTable)
        .innerJoin(
            GPUTable,
            eq(componentsTable.id, GPUTable.componentId)
        )
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if (existing.motherboard) {
        const availableSlots = Number(existing.motherboard.details.pciExpressSlots);
        return gpus.filter(() => (pciExpressSlotsUsed + 1) <= availableSlots);
    }

    return gpus;
}

async function getCompatibleMemory(db: Database, existing: any, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'memory')];

    if (existing.motherboard) {
        conditions.push(
            eq(memoryTable.type, existing.motherboard.details.ramType)
        );
    }

    const memory = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            memoryType: memoryTable.type,
            speed: memoryTable.speed,
            capacity: memoryTable.capacity,
            modules: memoryTable.modules,
        })
        .from(componentsTable)
        .innerJoin(
            memoryTable,
            eq(componentsTable.id, memoryTable.componentId)
        )
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if (existing.motherboard) {
        const existingModules = existing.memory.reduce((sum: number, m: any) =>
            sum + Number(m.details.modules), 0
        );
        const existingCapacity = existing.memory.reduce((sum: number, m: any) =>
            sum + Number(m.details.capacity), 0
        );
        const maxSlots = Number(existing.motherboard.details.numRamSlots);
        const maxCapacity = Number(existing.motherboard.details.maxRamCapacity);

        return memory.filter(mem => {
            const newModules = existingModules + Number(mem.modules);
            const newCapacity = existingCapacity + Number(mem.capacity);
            return newModules <= maxSlots && newCapacity <= maxCapacity;
        });
    }

    return memory;
}

async function getCompatibleStorage(db: Database, existing: any, limit?: number, sortCondition?: any) {
    const storage = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            storageType: storageTable.type,
            capacity: storageTable.capacity,
            formFactor: storageTable.formFactor,
        })
        .from(componentsTable)
        .innerJoin(
            storageTable,
            eq(componentsTable.id, storageTable.componentId
            )
        )
        .where(
            eq(componentsTable.type, 'storage')
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if (existing.case?.details?.storageFormFactors) {
        return storage.filter(stor => {
            const caseStorageFormFactor = existing.case.details.storageFormFactors.find(
                (sf: any) => sf.formFactor === stor.formFactor
            );

            if (!caseStorageFormFactor) return false;

            const usedSlots = existing.storage.filter(
                (s: any) => s.details.formFactor === stor.formFactor
            ).length;

            return usedSlots < Number(caseStorageFormFactor.numSlots);
        });
    }

    return storage;
}

async function getCompatibleCases(db: Database, existing: any, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'case')];

    if (existing.gpu) {
        conditions.push(
            sql`${pcCasesTable.gpuMaxLength} >= ${existing.gpu.details.length}`
        );
    }

    if (existing.cooler) {
        conditions.push(
            sql`${pcCasesTable.coolerMaxHeight} >= ${existing.cooler.details.height}`
        );
    }

    const cases = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            coolerMaxHeight: pcCasesTable.coolerMaxHeight,
            gpuMaxLength: pcCasesTable.gpuMaxLength,
        })
        .from(componentsTable)
        .innerJoin(
            pcCasesTable,
            eq(componentsTable.id, pcCasesTable.componentId)
        )
        .where(
            and(
                ...conditions)
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if(cases.length === 0) return [];

    const caseIds = cases.map(c => c.id);

    const [allStorageFF, allPsFF, allMoboFF] = await Promise.all([
        db.select().from(caseStorageFormFactorsTable)
            .where(
                inArray(caseStorageFormFactorsTable.caseId, caseIds)
            ),
        db.select().from(casePsFormFactorsTable)
            .where(
                inArray(casePsFormFactorsTable.caseId, caseIds)
            ),
        db.select().from(caseMoboFormFactorsTable)
            .where(
                inArray(caseMoboFormFactorsTable.caseId, caseIds)
            )
    ]);

    const storageByCase = allStorageFF.reduce((acc, ff) => {
        if (!acc[ff.caseId]) acc[ff.caseId] = [];
        acc[ff.caseId].push(ff);
        return acc;
    }, {} as Record<number, any[]>);

    const psByCase = allPsFF.reduce((acc, ff) => {
        if (!acc[ff.caseId]) acc[ff.caseId] = [];
        acc[ff.caseId].push(ff);
        return acc;
    }, {} as Record<number, any[]>);

    const moboByCase = allMoboFF.reduce((acc, ff) => {
        if (!acc[ff.caseId]) acc[ff.caseId] = [];
        acc[ff.caseId].push(ff);
        return acc;
    }, {} as Record<number, any[]>);

    const casesWithDetails = cases.map(pcCase => ({
        ...pcCase,
        storageFormFactors: storageByCase[pcCase.id] || [],
        psFormFactors: psByCase[pcCase.id] || [],
        moboFormFactors: moboByCase[pcCase.id] || []
    }));

    let filteredCases = casesWithDetails;

    if (existing.motherboard) {
        filteredCases = filteredCases.filter(pcCase =>
            pcCase.moboFormFactors.some((f: any) => f.formFactor === existing.motherboard.details.formFactor)
        );
    }

    if (existing.psu) {
        filteredCases = filteredCases.filter(pcCase =>
            pcCase.psFormFactors.some((f: any) => f.formFactor === existing.psu.details.formFactor)
        );
    }

    if (existing.storage.length > 0) {
        filteredCases = filteredCases.filter(pcCase => {
            return existing.storage.every((stor: any) => {
                const storageFF = pcCase.storageFormFactors.find(
                    (sf: any) => sf.formFactor === stor.details.formFactor
                );
                if (!storageFF) return false;

                const usedSlots = existing.storage.filter(
                    (s: any) => s.details.formFactor === stor.details.formFactor
                ).length;

                return usedSlots <= Number(storageFF.numSlots);
            });
        });
    }

    return filteredCases;
}

async function getCompatiblePSUs(db: Database, existing: any, existingTDP: number, limit?: number, sortCondition?: any) {
    const conditions = [eq(componentsTable.type, 'power_supply')];

    const minWattage = existingTDP * 1.2;
    conditions.push(
        sql`${powerSupplyTable.wattage} >= ${minWattage}`
    );

    const psus = await db
        .select({
            id: componentsTable.id,
            name: componentsTable.name,
            brand: componentsTable.brand,
            price: componentsTable.price,
            imgUrl: componentsTable.imgUrl,
            type: componentsTable.type,
            psuType: powerSupplyTable.type,
            wattage: powerSupplyTable.wattage,
            formFactor: powerSupplyTable.formFactor,
        })
        .from(componentsTable)
        .innerJoin(
            powerSupplyTable,
            eq(componentsTable.id, powerSupplyTable.componentId)
        )
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if (existing.case?.details?.psFormFactors) {
        const casePSFormFactors = existing.case.details.psFormFactors.map((f: any) => f.formFactor);
        return psus.filter(psu => casePSFormFactors.includes(psu.formFactor));
    }

    return psus;
}

async function getCompatiblePCIeComponents(db: Database, existing: any, componentType: string, pciExpressSlotsUsed: number, limit?: number, sortCondition?: any) {
    let table: any;
    let selectFields: any = {
        id: componentsTable.id,
        name: componentsTable.name,
        brand: componentsTable.brand,
        price: componentsTable.price,
        imgUrl: componentsTable.imgUrl,
        type: componentsTable.type,
    };

    switch (componentType) {
        case 'network_card':
            table = networkCardsTable;
            selectFields = {
                ...selectFields,
                numPorts: networkCardsTable.numPorts,
                speed: networkCardsTable.speed,
                interface: networkCardsTable.interface,
            };
            break;
        case 'network_adapter':
            table = networkAdaptersTable;
            selectFields = {
                ...selectFields,
                wifiVersion: networkAdaptersTable.wifiVersion,
                interface: networkAdaptersTable.interface,
                numAntennas: networkAdaptersTable.numAntennas,
            };
            break;
        case 'sound_card':
            table = soundCardsTable;
            selectFields = {
                ...selectFields,
                sampleRate: soundCardsTable.sampleRate,
                bitDepth: soundCardsTable.bitDepth,
                chipset: soundCardsTable.chipset,
                interface: soundCardsTable.interface,
                channel: soundCardsTable.channel,
            };
            break;
        default:
            return [];
    }

    const components = await db
        .select(selectFields)
        .from(componentsTable)
        .innerJoin(
            table,
            eq(componentsTable.id, table.componentId)
        )
        .where(
            eq(componentsTable.type, componentType)
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100);

    if (existing.motherboard) {
        const availableSlots = Number(existing.motherboard.details.pciExpressSlots);
        return components.filter(() => (pciExpressSlotsUsed + 1) <= availableSlots);
    }

    return components;
}

export async function addComponentToBuild(db: Database, buildId: number, componentId: number) {
    const [build] = await db
        .select()
        .from(buildsTable)
        .where(
            eq(buildsTable.id, buildId)
        )
        .limit(1);

    if(!build) return null;

    const [component] = await db
        .select()
        .from(componentsTable)
        .where(
            eq(componentsTable.id, componentId)
        )
        .limit(1);

    if(!component) return null;

    const existing = await db
        .select()
        .from(buildComponentsTable)
        .where(
            and(
                eq(buildComponentsTable.buildId, buildId),
                eq(buildComponentsTable.componentId, componentId)
            )
        )
        .limit(1);

    if(existing.length > 0) return null;

    const [result] = await db
        .insert(buildComponentsTable)
        .values({
            buildId,
            componentId
        })
        .returning({
            id: buildComponentsTable.buildId
        });

    const buildComponents = await db
        .select({
            price:  componentsTable.price,
        })
        .from(buildComponentsTable)
        .innerJoin(
            componentsTable,
            eq(buildComponentsTable.componentId, componentsTable.id)
        )
        .where(
            eq(buildComponentsTable.buildId, buildId)
        );

    const totalPrice = buildComponents.reduce((sum, c) => sum + Number(c.price), 0);

     await db
        .update(buildsTable)
        .set({
            totalPrice: totalPrice.toFixed(2)
        })
        .where(
            eq(buildsTable.id, buildId)
        );

    return result?.id ?? null;
}

export async function removeComponentFromBuild(db: Database, buildId: number, componentId: number) {
    const [build] = await db
        .select()
        .from(buildsTable)
        .where(
            eq(buildsTable.id, buildId)
        )
        .limit(1);

    if(!build) return null;

    const [component] = await db
        .select()
        .from(componentsTable)
        .where(
            eq(componentsTable.id, componentId)
        )
        .limit(1);

    if(!component) return null;

    const result = await db
        .delete(buildComponentsTable)
        .where(
            and(
                eq(buildComponentsTable.buildId, buildId),
                eq(buildComponentsTable.componentId, componentId)
            )
        );

    if(result.rowCount === 0) return null;

    const buildComponents = await db
        .select({
            price:  componentsTable.price,
        })
        .from(buildComponentsTable)
        .innerJoin(
            componentsTable,
            eq(buildComponentsTable.componentId, componentsTable.id)
        )
        .where(
            eq(buildComponentsTable.buildId, buildId)
        );

    const totalPrice = buildComponents.reduce((sum, c) => sum + Number(c.price), 0);

    await db
        .update(buildsTable)
        .set({
            totalPrice: totalPrice.toFixed(2)
        })
        .where(
            eq(buildsTable.id, buildId)
        );

    return result;
}

