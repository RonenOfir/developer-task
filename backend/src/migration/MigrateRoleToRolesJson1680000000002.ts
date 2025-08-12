import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersRoleToRolesJson1680000000003 implements MigrationInterface {
  name = 'AlterUsersRoleToRolesJson1680000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        ALTER TABLE users
        ADD COLUMN roles TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(roles))
      `);


      await queryRunner.query(`
        ALTER TABLE users
        DROP COLUMN role
      `);
    } catch (error) {
      console.error('Migration up error (AlterUsersRoleToRolesJson):', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      
      await queryRunner.query(`
        ALTER TABLE users
        ADD COLUMN role TEXT NOT NULL DEFAULT 'User'
      `);

      
      await queryRunner.query(`
        ALTER TABLE users
        DROP COLUMN roles
      `);
    } catch (error) {
      console.error('Migration down error (AlterUsersRoleToRolesJson):', error);
      throw error;
    }
  }
}
