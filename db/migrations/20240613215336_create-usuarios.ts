import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("usuarios", (table) => {
    table.uuid("id").primary();
    table.text("nome_usuario").notNullable();
    table.uuid("session_id").after("id").index();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("usuarios");
}
