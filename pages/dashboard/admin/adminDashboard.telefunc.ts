import * as drizzleQueries from "../../../database/drizzle/queries";
import { requireAdmin } from "../../../server/telefunc/ctx";
import {Abort} from "telefunc";
import { validateComponentSpecificData } from "../../../database/drizzle/util/componentFieldConfig";

export async function getAdminInfoAndData() {
    const { c, userId } = await requireAdmin();

    const admin = await drizzleQueries.getUserProfile(c.db, userId);

    if (!admin) throw new Error();

    const pendingBuilds = await drizzleQueries.getPendingBuilds(c.db);
    const userBuilds = await drizzleQueries.getUserBuilds(c.db, userId);
    const componentSuggestions = await drizzleQueries.getComponentSuggestions(c.db);

    return {
        admin,
        pendingBuilds,
        userBuilds,
        componentSuggestions
    };
}

export async function onSetBuildApprovalStatus({ buildId, isApproved }
                                                 : { buildId: number; isApproved: boolean }) {
    const { c, userId } = await requireAdmin()

    if (!Number.isInteger(buildId) || buildId <= 0) throw Abort();

    const result = await drizzleQueries.setBuildApprovalStatus(c.db, buildId, isApproved);

    if (!result) throw Abort();

    return { success: true };
}

export async function onSetComponentSuggestionStatus({ suggestionId, status, adminComment }
                                                : { suggestionId: number; status: string; adminComment: string }) {
    const { c, userId } = await requireAdmin()


    if(!Number.isInteger(suggestionId) || suggestionId <= 0) throw Abort();

    const result = await drizzleQueries.setComponentSuggestionStatus(c.db, suggestionId, userId, status, adminComment);

    if (!result) throw Abort();

    return { success: true };
}

export async function onCreateNewComponent({ name, brand, price, imgUrl, type, specificData }
                                            : { name: string; brand: string; price: number; imgUrl: string; type: string, specificData: any }) {

    const { c, userId } = await requireAdmin()

    if(!validateComponentSpecificData(type, specificData)) throw Abort();

    const newComponentId = await drizzleQueries.addNewComponent(c.db, name, brand, price, imgUrl, type, specificData);

    if(!newComponentId) throw Abort();

    return { success: true };
}
