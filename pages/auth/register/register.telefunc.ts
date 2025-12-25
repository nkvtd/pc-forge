import * as drizzleQueries from "../../../database/drizzle/queries/users";
import { ctx } from "../../../server/telefunc/ctx";
import { Abort } from "telefunc";
import bcrypt from "bcrypt";

export async function registerNewUser({ username, email, password }
                                      : { username: string; email: string; password: string }) {
    const c = ctx();

    if (c.session?.user?.id) throw Abort();

    if(!username || !email || !password) throw Abort();

    const passwordHash = await bcrypt.hash(password, 8);
    const result = await drizzleQueries.createUser(c.db, username, email, passwordHash);

    if(!result) throw Abort();

    return { success: true };
}