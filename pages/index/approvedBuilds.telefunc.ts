import * as drizzleQueries from "../../database/drizzle/queries";
import { ctx } from "../../server/telefunc/ctx";

export async function getApprovedBuildCards( { limit }
                                       : { limit?: number }) {
    const context = ctx();

    const approvedBuilds = await drizzleQueries.getApprovedBuilds(context.db, limit);

    return approvedBuilds;
}