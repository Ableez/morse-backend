// File: index.ts
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { contentsRouter } from "./routers/content";
import webhookRouter from "./routers/webhookController";
import { usersRouter } from "./routers/user";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .group("/api", (app) => app.use(contentsRouter).use(usersRouter))
  .listen(process.env.BACK_PORT || 3030);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
