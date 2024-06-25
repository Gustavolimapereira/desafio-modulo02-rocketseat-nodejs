import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("refeicoes", (table) => {
    table.uuid("id").primary();
    table.text("nome_refeicao").notNullable();
    table.text("descricao").notNullable();
    table.text("dieta").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table
      .uuid("usuario_id")
      .notNullable()
      .references("id")
      .inTable("usuarios")
      .onDelete("CASCADE")
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("refeicoes");
}
