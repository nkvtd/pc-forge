import type { Database } from "../db";
import {buildsTable, componentsTable } from "../schema";
import {and, desc, eq, ilike} from "drizzle-orm";

export async function getAllComponents(db: Database, limit?: number,  q?: string, componentType?: string) {
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
    const [componentDetails] = await db
        .select()
        .from(componentsTable)
        .where(
            eq(componentsTable.id, componentId)
        )
        .limit(1);

    return componentDetails ?? null;
}