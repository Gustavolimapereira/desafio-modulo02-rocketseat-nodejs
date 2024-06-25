/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database";

export async function checkUsuarioIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId;

  // const usuarioId = request.body // usuarioId.usuarioId - outra opção para pegar o ID

  if (!sessionId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const user = await knex("usuarios").where({ session_id: sessionId }).first();

  if (!user) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}
