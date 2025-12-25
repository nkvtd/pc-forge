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
import {and, desc, eq, ilike} from "drizzle-orm";
export async function getAllComponents(db: Database, limit?: number, componentType?: string, q?: string) {
    let queryConditions = [];

    if (q) {
        queryConditions.push(
            ilike(componentsTable.name, `%${q}%`)
        );
    }

    if(componentType && componentType.trim() !== 'all') {
        queryConditions.push(
            eq(componentsTable.type, componentType.trim().toLowerCase())
        );
    }

    const componentsList = await db
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
            desc(componentsTable.price)
        )
        .limit(limit || 100); // 100 placeholder

    return componentsList;
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

    let details: any = {};

    switch (component.type) {
        case 'cpu':
            [details] = await db.select().from(CPUTable).where(eq(CPUTable.componentId, componentId));
            break;
        case 'gpu':
            [details] = await db.select().from(GPUTable).where(eq(GPUTable.componentId, componentId));
            break;
        case 'memory':
            [details] = await db.select().from(memoryTable).where(eq(memoryTable.componentId, componentId));
            break;
        case 'power_supply':
            [details] = await db.select().from(powerSupplyTable).where(eq(powerSupplyTable.componentId, componentId));
            break;
        case 'case':
            [details] = await db.select().from(pcCasesTable).where(eq(pcCasesTable.componentId, componentId));
            if (details) {
                details.storageFormFactors = await db.select().from(caseStorageFormFactorsTable).where(eq(caseStorageFormFactorsTable.caseId, componentId));
                details.psFormFactors = await db.select().from(casePsFormFactorsTable).where(eq(casePsFormFactorsTable.caseId, componentId));
                details.moboFormFactors = await db.select().from(caseMoboFormFactorsTable).where(eq(caseMoboFormFactorsTable.caseId, componentId));
            }
            break;
        case 'cooler':
            [details] = await db.select().from(coolersTable).where(eq(coolersTable.componentId, componentId));
            if (details) {
                details.cpuSockets = await db.select().from(coolerCPUSocketsTable).where(eq(coolerCPUSocketsTable.coolerId, componentId));
            }
            break;
        case 'motherboard':
            [details] = await db.select().from(motherboardsTable).where(eq(motherboardsTable.componentId, componentId));
            break;
        case 'storage':
            [details] = await db.select().from(storageTable).where(eq(storageTable.componentId, componentId));
            break;
        case 'memory_card':
            [details] = await db.select().from(memoryCardsTable).where(eq(memoryCardsTable.componentId, componentId));
            break;
        case 'optical_drive':
            [details] = await db.select().from(opticalDrivesTable).where(eq(opticalDrivesTable.componentId, componentId));
            break;
        case 'sound_card':
            [details] = await db.select().from(soundCardsTable).where(eq(soundCardsTable.componentId, componentId));
            break;
        case 'cables':
            [details] = await db.select().from(cablesTable).where(eq(cablesTable.componentId, componentId));
            break;
        case 'network_adapter':
            [details] = await db.select().from(networkAdaptersTable).where(eq(networkAdaptersTable.componentId, componentId));
            break;
        case 'network_card':
            [details] = await db.select().from(networkCardsTable).where(eq(networkCardsTable.componentId, componentId));
            break;
    }

    return {
        ...component,
        details: details || null
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

        switch (type) {
            case 'cpu':
                await tx.insert(CPUTable).values({
                    componentId,
                    socket: specificData.socket,
                    cores: specificData.cores,
                    threads: specificData.threads,
                    baseClock: specificData.baseClock,
                    boostClock: specificData.boostClock,
                    tdp: specificData.tdp,
                });
                break;

            case 'gpu':
                await tx.insert(GPUTable).values({
                    componentId,
                    vram: specificData.vram,
                    tdp: specificData.tdp,
                    baseClock: specificData.baseClock,
                    boostClock: specificData.boostClock,
                    chipset: specificData.chipset,
                    length: specificData.length,
                });
                break;

            case 'memory':
                await tx.insert(memoryTable).values({
                    componentId,
                    type: specificData.type,
                    speed: specificData.speed,
                    capacity: specificData.capacity,
                    modules: specificData.modules,
                });
                break;

            case 'power_supply':
                await tx.insert(powerSupplyTable).values({
                    componentId,
                    type: specificData.type,
                    wattage: specificData.wattage,
                    formFactor: specificData.formFactor,
                });
                break;

            case 'case':
                await tx.insert(pcCasesTable).values({
                    componentId,
                    coolerMaxHeight: specificData.coolerMaxHeight,
                    gpuMaxLength: specificData.gpuMaxLength,
                });

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
                break;

            case 'cooler':
                await tx.insert(coolersTable).values({
                    componentId,
                    type: specificData.type,
                    height: specificData.height,
                    maxTdpSupported: specificData.maxTdpSupported,
                });

                if (specificData.cpuSockets) {
                    await tx.insert(coolerCPUSocketsTable).values(
                        specificData.cpuSockets.map((socket: string) => ({
                            coolerId: componentId,
                            socket: socket,
                        }))
                    );
                }
                break;

            case 'motherboard':
                await tx.insert(motherboardsTable).values({
                    componentId,
                    socket: specificData.socket,
                    chipset: specificData.chipset,
                    formFactor: specificData.formFactor,
                    ramType: specificData.ramType,
                    numRamSlots: specificData.numRamSlots,
                    maxRamCapacity: specificData.maxRamCapacity,
                    pciExpressSlots: specificData.pciExpressSlots,
                });
                break;

            case 'storage':
                await tx.insert(storageTable).values({
                    componentId,
                    type: specificData.type,
                    capacity: specificData.capacity,
                    formFactor: specificData.formFactor,
                });
                break;

            case 'memory_card':
                await tx.insert(memoryCardsTable).values({
                    componentId,
                    numSlots: specificData.numSlots,
                    interface: specificData.interface,
                });
                break;

            case 'optical_drive':
                await tx.insert(opticalDrivesTable).values({
                    componentId,
                    formFactor: specificData.formFactor,
                    type: specificData.type,
                    interface: specificData.interface,
                    writeSpeed: specificData.writeSpeed,
                    readSpeed: specificData.readSpeed,
                });
                break;

            case 'sound_card':
                await tx.insert(soundCardsTable).values({
                    componentId,
                    sampleRate: specificData.sampleRate,
                    bitDepth: specificData.bitDepth,
                    chipset: specificData.chipset,
                    interface: specificData.interface,
                    channel: specificData.channel,
                });
                break;

            case 'cables':
                await tx.insert(cablesTable).values({
                    componentId,
                    lengthCm: specificData.lengthCm,
                    type: specificData.type,
                });
                break;

            case 'network_adapter':
                await tx.insert(networkAdaptersTable).values({
                    componentId,
                    wifiVersion: specificData.wifiVersion,
                    interface: specificData.interface,
                    numAntennas: specificData.numAntennas,
                });
                break;

            case 'network_card':
                await tx.insert(networkCardsTable).values({
                    componentId,
                    numPorts: specificData.numPorts,
                    speed: specificData.speed,
                    interface: specificData.interface,
                });
                break;

            default:
                return null;
        }

        return componentId;
    });
}

export async function getCompatibleComponents(db: Database, buildId: number, componentType: string) {
    return db.transaction(async (tx) => {
        const [build] = await tx
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


    return null;
    });
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

