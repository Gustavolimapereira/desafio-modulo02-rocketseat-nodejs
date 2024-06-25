/* eslint-disable camelcase */
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usuariosRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUsuarioBodySchema = z.object({
      nome_usuario: z.string(),
    });

    const { nome_usuario } = createUsuarioBodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("usuarios").insert({
      id: randomUUID(),
      nome_usuario,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });

  app.get("/", async () => {
    const usuarios = await knex("usuarios").select();

    return { usuarios };
  });
}
