import * as drizzleQueries from "../database/drizzle/queries";
import {ctx, getAuthState, requireUser} from "../server/telefunc/ctx";
import {Abort} from "telefunc";

export async function getAuthenticationState() {
    const context = getAuthState();

    return context;
}

export async function getPopupAllComponents({ componentType, limit, q }
                                            : { componentType?: string; limit?: number; q?: string }) {
    const c = ctx();

    const components = await drizzleQueries.getAllComponents(c.db, limit, q, componentType);

    return components;
}

export async function getPopupComponentDetails({ componentId }
                                           : { componentId: number }) {
    const context = ctx();

    if(!Number.isInteger(componentId) || componentId <= 0) throw Abort();

    const componentDetails = await drizzleQueries.getComponentDetails(context.db, componentId);

    if(!componentDetails) throw Abort();

    return componentDetails;
}

export async function getPopupSuggestComponent({ link, description, componentType }
                                               : { link: string; description: string; componentType: string }) {
    const { c, userId } = requireUser()

    const newSuggestionId = await drizzleQueries.addComponentSuggestion(c.db, userId, link, description, componentType);

    if(!newSuggestionId) throw Abort();

    return newSuggestionId;
}

export async function getPopupAllApprovedBuilds({ limit, q }
                                                 : { limit?: number; q?: string }) {
    const context = ctx();

    const approvedBuilds = await drizzleQueries.getApprovedBuilds(context.db, limit, q);

    return approvedBuilds;
}

export async function getPopupHighestRankedBuilds({ limit }
                                                  : { limit?: number }) {
    const context = ctx();

    const highestRankedBuilds = await drizzleQueries.getHighestRankedBuilds(context.db, limit);

    return highestRankedBuilds;
}

// Shared

export async function getPopupBuildDetails({ buildId }
                                           : { buildId: number }) {
    const context = getAuthState();

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const buildDetails = await drizzleQueries.getBuildDetails(context.db, buildId, context.userId ?? undefined);

    if(!buildDetails) throw Abort();

    return buildDetails;
}

export async function togglePopupFavorite({ buildId }
                                          : { buildId: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const isFavorite = await drizzleQueries.toggleFavoriteBuild(c.db, userId, buildId);

    return isFavorite.favorite;
}

export async function setPopupRating({ buildId, value }
                                     : { buildId: number; value: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    if (!Number.isInteger(value) || value < 1 || value > 5) throw Abort();

    const result = await drizzleQueries.setBuildRating(c.db, userId, buildId, value);

    return { success: true };
}

export async function setPopupReview({ buildId, content }
                                     : { buildId: number; content: string }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.setBuildReview(c.db, userId, buildId, content);

    return { success: true };
}

export async function clonePopupBuild({ buildId }
                                      : { buildId: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const newBuildId = await drizzleQueries.cloneBuild(c.db, userId, buildId);

    if (!newBuildId) throw Abort();

    return newBuildId;
}
