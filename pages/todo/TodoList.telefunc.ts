// We use Telefunc (https://telefunc.com) for data mutations.

import * as drizzleQueries from "../../database/drizzle/queries/todos";
import { getContext } from "telefunc";

export async function onNewTodo({ text }: { text: string }) {
  const context = getContext();
  await drizzleQueries.insertTodo(context.db, text);
}
