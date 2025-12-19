import * as drizzleQueries from "../../../database/drizzle/queries";
import { requireAdmin } from "../../../server/telefunc/ctx";
import {Abort} from "telefunc";

export async function getAdminInfoAndData() {
    const { c, userId } = await requireAdmin();

    const admin = await drizzleQueries.getUserProfile(c.db, userId);

    if (!admin) throw new Error();

    const pendingBuilds = await drizzleQueries.getPendingBuilds(c.db);
    const userBuilds = await drizzleQueries.getUserBuilds(c.db, userId);
    // const componentSuggestions = await drizzleQueries.getComponentSuggestions(c.db);

    return {
        admin,
        pendingBuilds,
        userBuilds,
        // componentSuggestions
    };
}

export async function setPopupBuildApprovalStatus({ buildId, isApproved }
                                                 : { buildId: number; isApproved: boolean }) {
    const { c, userId } = await requireAdmin()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.setBuildApprovalStatus(c.db, buildId, isApproved);

    if (!result) throw Abort();

    return { success: true };
}

export async function setComponentSuggestionStatus({ suggestionId, status, adminComment }
                                                : { suggestionId: number; status: string; adminComment: string }) {
    const { c, userId } = await requireAdmin()


    // setComponentSuggestionStatus
}