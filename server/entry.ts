import "dotenv/config";
import { authjsHandler, authjsSessionMiddleware } from "./authjs-handler";
import { dbMiddleware } from "./db-middleware";
import telefuncHandler from "./telefunc-handler";
import { apply, serve } from "@photonjs/hono";
import { Hono } from "hono";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export default startServer() as unknown;

function startServer() {
  const app = new Hono();

  apply(app, [
    dbMiddleware,

    authjsSessionMiddleware,

    authjsHandler,

    telefuncHandler,
  ]);

  return serve(app, {
    port,
      hostname: '0.0.0.0',
  });
}
