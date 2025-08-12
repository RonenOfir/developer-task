import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillUsersRolesFromJoinTables1680000000005 implements MigrationInterface {
  name = 'BackfillUsersRolesFromJoinTables1680000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
    
      await queryRunner.query(`
        UPDATE users
        SET roles = COALESCE(
          (
            SELECT json_group_array(name)
            FROM (
              SELECT DISTINCT r.name AS name
              FROM user_roles ur
              JOIN roles r ON r.id = ur.role_id
              WHERE ur.user_id = users.id
              ORDER BY r.name
            )
          ),
          '[]'
        )
      `);

      
      await queryRunner.query(`
        UPDATE users
        SET roles = '[]'
        WHERE roles IS NULL OR TRIM(roles) = '' OR json_valid(roles) = 0
      `);
    } catch (error) {
      console.error('Migration up error (BackfillUsersRolesFromJoinTables):', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
    
      await queryRunner.query(`
        UPDATE users
        SET roles = '[]'
      `);
    } catch (error) {
      console.error('Migration down error (BackfillUsersRolesFromJoinTables):', error);
      throw error;
    }
  }
}
