/* eslint-disable @typescript-eslint/no-unused-vars */
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    usuarios: {
      id: string;
      nome_usuario: string;
      session_id?: string;
      created_at: string;
    };
    refeicoes: {
      id: string;
      nome_refeicao: string;
      descricao: string;
      dieta: string;
      created_at: string;
      usuario_id: string;
      updated_at: string;
    };
  }
}
