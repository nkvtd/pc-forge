import * as drizzleQueries from "../../database/drizzle/queries";
import {ctx, getAuthState, requireUser} from "../../server/telefunc/ctx";
import {Abort} from "telefunc";
import type {Database} from "../../database/drizzle/db";
import {removeComponentFromBuild} from "../../database/drizzle/queries";

export async function onSaveNewBuild({ name, description, componentIds }
                                       : { name: string; description: string; componentIds: number[] }) {
    const { c, userId } = requireUser()

    const newBuildId = await drizzleQueries.addNewBuild(c.db, userId, name, description, componentIds);

    if(!newBuildId) throw Abort();

    return { success: true };
}

export async function onRemoveComponentFromBuild({ buildId, componentId }
                                                 : { buildId: number, componentId: number }) {
    const { c, userId } = requireUser()

    const result = await drizzleQueries.removeComponentFromBuild(c.db, buildId, componentId);

    if(!result) throw Abort();

    return { success: true };
}

export async function onDeleteBuild({ buildId }: { buildId: number }) {
    const { c, userId } = requireUser()

    const result = await drizzleQueries.deleteBuild(c.db, userId, buildId);
    if(!result) throw Abort();

    return { success: true };
}

export async function onGetBuildComponents({ buildId }
                                           : { buildId: number }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const buildComponents = await drizzleQueries.getBuildComponents(c.db, buildId);

    if(!buildComponents) throw Abort();

    return buildComponents;
}

export async function onAddComponentToBuild({ buildId, componentId }: { buildId: number, componentId: number }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();
    if(!Number.isInteger(componentId) || componentId <= 0) throw Abort();

    const result = await drizzleQueries.addComponentToBuild(c.db, buildId, componentId);

    if(!result) throw Abort();

    return { success: true };
}

export async function onGetCompatibleComponents({ buildId, componentType }: { buildId: number, componentType: string }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const compatibleComponents = await drizzleQueries.getCompatibleComponents(c.db, buildId, componentType);

    if(!compatibleComponents) throw Abort();

    return compatibleComponents;
}