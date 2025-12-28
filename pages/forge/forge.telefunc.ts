import * as drizzleQueries from "../../database/drizzle/queries";
import {ctx, getAuthState, requireUser} from "../../server/telefunc/ctx";
import {Abort} from "telefunc";
import type {Database} from "../../database/drizzle/db";
import {removeComponentFromBuild} from "../../database/drizzle/queries";

export async function onRemoveComponentFromBuild({ buildId, componentId }
                                                 : { buildId: number, componentId: number }) {
    const { c, userId } = requireUser()

    const result = await drizzleQueries.removeComponentFromBuild(c.db, userId, buildId, componentId);

    if(!result) throw Abort();

    return { success: true };
}

export async function onAddComponentToBuild({ buildId, componentId }: { buildId: number, componentId: number }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();
    if(!Number.isInteger(componentId) || componentId <= 0) throw Abort();

    const result = await drizzleQueries.addComponentToBuild(c.db, userId, buildId, componentId);

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

export async function onGetCompatibleComponents({ buildId, componentType, limit, sort }
                                                : { buildId: number, componentType: string, limit?: number, sort?: string }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const compatibleComponents = await drizzleQueries.getCompatibleComponents(c.db, buildId, componentType, limit, sort);

    if(!compatibleComponents) throw Abort();

    return compatibleComponents;
}

export async function onGetBuildState({ db, buildId}
                                      :{ db: Database, buildId: number }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const buildState = await drizzleQueries.getBuildState(c.db, userId, buildId);

    if(!buildState) throw Abort();

    return buildState;
}

export async function saveBuildState({ db, buildId, name, description }
                                     :{ db: Database, buildId: number, name: string, description: string }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.saveBuildState(c.db, userId, buildId, name, description);

    if(!result) throw Abort();

    return { success: true };
}