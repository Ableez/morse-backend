import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { contentsRouter } from "./routers/content";
import { usersRouter } from "./routers/user";

const app = new Elysia()
  .use(swagger())
  .use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://morse-web3.vercel.app",
        "https://morse-backend.vercel.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .group("/api", (app) =>
    app
      .use(contentsRouter)
      .use(usersRouter)
      .use(
        new Elysia({ prefix: "/", analytic: true }).get(
          "/",
          ({ request, response }) => {
            console.log(
              `${new Date().toISOString()} : ${request.url} : ${
                request.method
              } ${request.url}`
            );
          }
        )
      )
  )
  .listen(process.env.BACK_PORT || 3030);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
