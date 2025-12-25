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
import {typeConfigMap, ComponentType} from "../config/componentFieldConfig";
import {AnyPgColumn} from "drizzle-orm/pg-core";
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
            desc(componentsTable.price)
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

export async function getCompatibleComponents(db: Database, buildId: number, componentType: string) {
    // TO BE IMPLEMENTED
    return null;
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

