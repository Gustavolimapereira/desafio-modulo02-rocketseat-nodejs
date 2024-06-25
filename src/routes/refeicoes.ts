/* eslint-disable camelcase */
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { checkUsuarioIdExist } from "../middlewares/check-usuario-id-exist";

export async function refeicoesRoutes(app: FastifyInstance) {
  // ROTA QUE CRIA UMA NOVA REFEIÇÃO
  app.post(
    "/",
    { preHandler: [checkUsuarioIdExist] },
    async (request, reply) => {
      const createRefeicaoBodySchema = z.object({
        nome_refeicao: z.string(),
        descricao: z.string(),
        dieta: z.string(),
        usuario_id: z.string(),
      });

      const { nome_refeicao, descricao, dieta, usuario_id } =
        createRefeicaoBodySchema.parse(request.body);

      await knex("refeicoes").insert({
        id: randomUUID(),
        nome_refeicao,
        descricao,
        dieta,
        usuario_id,
        updated_at: knex.fn.now(),
      });

      return reply.status(201).send();
    },
  );

  // ROTA QUE LISTA TODAS AS REFEIÇÕES
  app.get("/", { preHandler: [checkUsuarioIdExist] }, async () => {
    const refeicoes = await knex("refeicoes").select();

    return { refeicoes };
  });

  // ROTA QUE BUSCA APENAS UMA REFEIÇÃO PELO USUARIO
  app.get(
    "/refeicao/:id",
    { preHandler: [checkUsuarioIdExist] },
    async (request) => {
      const getRefeicaoIdParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getRefeicaoIdParamsSchema.parse(request.params);

      const getRefeicao = await knex("refeicoes").where({ id }).select();

      return getRefeicao;
    },
  );

  // ROTA QUE BUSCA TODAS AS REFEIÇÕES DE UM USUARIO
  app.get("/:id", { preHandler: [checkUsuarioIdExist] }, async (request) => {
    const getUserIdParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getUserIdParamsSchema.parse(request.params);

    const getAllUserRefeicoes = await knex("refeicoes")
      .where({ usuario_id: id })
      .select("*");

    return getAllUserRefeicoes;
  });

  // ROTA USADA PARA DELETAR UMA REFEIÇÃO
  app.delete(
    "/:id",
    { preHandler: [checkUsuarioIdExist] },
    async (request, reply) => {
      const deleteRefeicaoParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteRefeicaoParamsSchema.parse(request.params);
      const deleteRefeicaoBodySchema = z.object({
        usuario_id: z.string(),
      });

      const { usuario_id } = deleteRefeicaoBodySchema.parse(request.body);

      const deleteRow = await knex("refeicoes")
        .where({ id, usuario_id })
        .delete();

      if (!deleteRow) {
        return reply.status(400).send({
          error: "Algo deu errado, não foi possivel deletar a refeição",
        });
      }

      return reply.status(204).send();
    },
  );

  // ROTA USADA PARA EDITAR UMA REFEIÇÃO
  app.put(
    "/:id",
    { preHandler: [checkUsuarioIdExist] },
    async (request, reply) => {
      const updateRefeicaoParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const updateRefeicaoBodySchema = z.object({
        nome_refeicao: z.string(),
        descricao: z.string(),
        dieta: z.string(),
        usuario_id: z.string(),
      });

      const { id } = updateRefeicaoParamsSchema.parse(request.params);
      const { nome_refeicao, descricao, dieta, usuario_id } =
        updateRefeicaoBodySchema.parse(request.body);

      const updated = await knex("refeicoes").where({ id, usuario_id }).update({
        nome_refeicao,
        descricao,
        dieta,
        updated_at: knex.fn.now(),
      });

      if (!updated) {
        return reply.status(400).send({ error: "Refeição não encontrada" });
      }

      return reply.status(201).send();
    },
  );
}
