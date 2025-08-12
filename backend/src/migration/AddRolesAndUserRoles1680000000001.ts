import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRolesAndUserRoles1680000000001 implements MigrationInterface {
  name = 'AddRolesAndUserRoles1680000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        )
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS user_roles (
          user_id INTEGER NOT NULL,
          role_id INTEGER NOT NULL,
          PRIMARY KEY (user_id, role_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        )
      `);

      await queryRunner.query(`
        INSERT OR IGNORE INTO roles (name)
        SELECT DISTINCT role
        FROM users
        WHERE role IS NOT NULL AND TRIM(role) <> ''
      `);

      await queryRunner.query(`
        INSERT OR IGNORE INTO user_roles (user_id, role_id)
        SELECT u.id, r.id
        FROM users u
        JOIN roles r ON r.name = u.role
        WHERE u.role IS NOT NULL AND TRIM(u.role) <> ''
      `);

    } catch (error) {
      console.error('Migration up error (AddRolesAndUserRoles):', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Try to restore users.role from user_roles if empty/null (keep first role per user)
      // This is safe even if user_roles/roles contain nothing.
      await queryRunner.query(`
        UPDATE users
        SET role = (
          SELECT r.name
          FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          WHERE ur.user_id = users.id
          LIMIT 1
        )
        WHERE role IS NULL OR TRIM(role) = ''
      `);

      await queryRunner.query(`DROP TABLE IF EXISTS user_roles`);
      await queryRunner.query(`DROP TABLE IF EXISTS roles`);
    } catch (error) {
      console.error('Migration down error (AddRolesAndUserRoles):', error);
      throw error;
    }
  }
}
