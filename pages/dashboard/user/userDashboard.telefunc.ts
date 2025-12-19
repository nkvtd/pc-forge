import * as drizzleQueries from "../../../database/drizzle/queries";
import {requireUser} from "../../../server/telefunc/ctx";

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