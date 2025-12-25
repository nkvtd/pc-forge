import * as drizzleQueries from "../database/drizzle/queries";
import {ctx, getAuthState, parseSessionUserId, requireUser} from "../server/telefunc/ctx";
import {Abort} from "telefunc";
import type {Database} from "../database/drizzle/db";

export async function onGetAuthState() {
    const context = getAuthState();

    return context;
}

export async function onGetAllComponents({ componentType, limit, q }
                                            : { componentType?: string; limit?: number; q?: string }) {
    const c = ctx();

    const components = await drizzleQueries.getAllComponents(c.db, limit, componentType, q);

    return components;
}



export async function onSuggestComponent({ link, description, componentType }
                                               : { link: string; description: string; componentType: string }) {
    const { c, userId } = requireUser()

    const newSuggestionId = await drizzleQueries.addNewComponentSuggestion(c.db, userId, link, description, componentType);

    if(!newSuggestionId) throw Abort();

    return { success: true };
}

export async function onGetApprovedBuilds({ limit, sort, q }
                                                 : { limit?: number; sort?: string; q?: string }) {
    const context = ctx();

    const approvedBuilds = await drizzleQueries.getApprovedBuilds(context.db, limit, sort, q);

    return approvedBuilds;
}

export async function onGetComponentDetails({ componentId }
                                            : { componentId: number }) {
    const context = ctx();

    if(!Number.isInteger(componentId) || componentId <= 0) throw Abort();

    const componentDetails = await drizzleQueries.getComponentDetails(context.db, componentId);

    if(!componentDetails) throw Abort();

    return componentDetails;
}

export async function onGetBuildDetails({ buildId }
                                           : { buildId: number }) {
    const context = ctx();

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const userId = parseSessionUserId(context.session?.user?.id);
    const buildDetails = await drizzleQueries.getBuildDetails(context.db, buildId, userId);

    if(!buildDetails) throw Abort();

    return buildDetails;
}

export async function onToggleFavorite({ buildId }
                                          : { buildId: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const isFavorite = await drizzleQueries.toggleFavoriteBuild(c.db, userId, buildId);

    return isFavorite;
}

export async function onSetRating({ buildId, value }
                                     : { buildId: number; value: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    if (!Number.isInteger(value) || value < 1 || value > 5) throw Abort();

    const result = await drizzleQueries.setBuildRating(c.db, userId, buildId, value);

    return { success: true };
}

export async function onSetReview({ buildId, content }
                                     : { buildId: number; content: string }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.setBuildReview(c.db, userId, buildId, content);

    return { success: true };
}

export async function onCloneBuild({ buildId }
                                      : { buildId: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const newBuild = await drizzleQueries.cloneBuild(c.db, userId, buildId);

    if (!newBuild) throw Abort();

    return newBuild;
}