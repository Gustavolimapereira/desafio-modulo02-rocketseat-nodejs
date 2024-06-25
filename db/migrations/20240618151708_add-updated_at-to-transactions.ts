import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("refeicoes", (table) => {
    table.timestamp("updated_at");
  });

  await knex("refeicoes").update({ updated_at: knex.fn.now() });

  await knex.schema.alterTable("refeicoes", (table) => {
    table.timestamp("updated_at").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("refeicoes", (table) => {
    table.dropColumn("updated_at");
  });
}
