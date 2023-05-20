import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(cors, {
  origin: true /* todos URLs de front-end poderão acessar nosso back-end */,
});
app.register(jwt, {
  secret: "spacetime" /* o secret é uma maneira de assinar o token */,
});
app.register(memoriesRoutes);
app.register(authRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0" /* para funcionar no mobile */,
  })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });
