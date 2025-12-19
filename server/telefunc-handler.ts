import type { Database } from "../database/drizzle/db";
import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { telefunc } from "telefunc";
import type { Session } from "@auth/core/types";

const telefuncHandler: UniversalHandler = enhance(
  async (request, context, runtime) => {
    const httpResponse = await telefunc({
      url: request.url.toString(),
      method: request.method,
      body: await request.text(),
      context: {
          ...(context as { db: Database; session?: Session | null }),
          ...runtime,
          session: (context as { session?: Session | null }).session ?? null,
          request,
      }
    });
    const { body, statusCode, contentType } = httpResponse;
    return new Response(body, {
      status: statusCode,
      headers: {
        "content-type": contentType,
      },
    });
  },
  {
    name: "pc-forge:telefunc-handler",
    path: `/_telefunc`,
    method: ["GET", "POST"],
    immutable: false,
  },
);
export default telefuncHandler
