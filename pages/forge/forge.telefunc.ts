import * as drizzleQueries from "../../database/drizzle/queries";
import {ctx, getAuthState, requireUser} from "../../server/telefunc/ctx";
import {Abort} from "telefunc";
import type {Database} from "../../database/drizzle/db";

export async function onSaveNewBuild({ name, description, componentIds }
                                       : { name: string; description: string; componentIds: number[] }) {
    const { c, userId } = requireUser()

    const newBuildId = await drizzleQueries.addNewBuild(c.db, userId, name, description, componentIds);

    if(!newBuildId) throw Abort();

    return { success: true };
}