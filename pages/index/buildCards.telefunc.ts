import {ctx, requireUser} from "../../server/telefunc/ctx";
import * as drizzleQueries from "../../database/drizzle/queries";
import {Abort} from "telefunc";

export async function onGetHighestRankedBuilds({ limit }
                                               : { limit?: number }) {
    const context = ctx();

    const highestRankedBuilds = await drizzleQueries.getHighestRankedBuilds(context.db, limit);

    return highestRankedBuilds;
}

export async function onCloneBuild({ buildId }
                                   : { buildId: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const newBuild = await drizzleQueries.cloneBuild(c.db, userId, buildId);

    if (!newBuild) throw Abort();

    return newBuild;
}