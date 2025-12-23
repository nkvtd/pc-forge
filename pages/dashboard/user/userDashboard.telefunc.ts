import * as drizzleQueries from "../../../database/drizzle/queries";
import {requireUser} from "../../../server/telefunc/ctx";
import {Abort} from "telefunc";

export async function getUserInfoAndData() {
    const { c, userId } = requireUser()

    const user = await drizzleQueries.getUserProfile(c.db, userId);

    if (!user) throw new Error();

    const userBuilds = await drizzleQueries.getUserBuilds(c.db, userId);
    const favoriteBuilds = await drizzleQueries.getFavoriteBuilds(c.db, userId);

    return {
        user,
        userBuilds,
        favoriteBuilds
    };
}

export async function onDeleteBuild({ buildId }
                                  : { buildId: number }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.deleteBuild(c.db, userId, buildId);

    return { success: true };
}

export async function onEditBuild({ buildId }
                                  : { buildId: number }) {
    const { c, userId } = requireUser()

    if(!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const buildDetails = await drizzleQueries.getBuildDetails(c.db, buildId, userId);

    if(!buildDetails) throw Abort();

    return buildDetails;
}

export async function onSaveEditBuild({ buildId, name, description, componentIds }
                                      : { buildId: number; name: string; description: string; componentIds: number[] }) {
    const { c, userId } = requireUser()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.editBuild(c.db, userId, buildId, name, description, componentIds);

    if(!result) throw Abort();

    return { success: true };
}