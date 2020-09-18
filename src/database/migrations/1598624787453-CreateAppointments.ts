import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateAppointments1598624787453 implements MigrationInterface {

    // o que ser feito  no banco de dados quando a migration for executada
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'appointments',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'provider',
              type: 'varchar',
            },
            {
              name: 'date',
              type: 'timestamp with time zone',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      );
    }

    // fallback, desfazer o que foi feito no método up
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('appointments');
    }
}

/**
 * Linha do tempo
 *
 * 1a semana: Tabela de agendamentos
 * 2a semana: Tabela de usuários
 * (NOVO DEV) 3a semana: Edição na tabela de agendamentos
 * 4a semana: Tabela de compras
 * --- Como controlar a versão do banco de dados ---
 * ---   Usando as migrations, funcionam como o  ---
 * ---     git, só que para o banco de dados     ---
 */
