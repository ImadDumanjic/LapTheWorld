import sequelize from '../../config/database.js'

export async function runMigrations() {
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "totpSecret" VARCHAR(255);`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "banned" BOOLEAN NOT NULL DEFAULT FALSE;`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "bannedBy" UUID REFERENCES users(id) ON DELETE SET NULL;`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "bannedAt" TIMESTAMPTZ;`)

  // Google Sign-In columns
  await sequelize.query(`
    DO $$ BEGIN
      CREATE TYPE "enum_users_auth_provider" AS ENUM ('password', 'google');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "auth_provider" "enum_users_auth_provider" NOT NULL DEFAULT 'password';`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "google_sub" VARCHAR(255);`)
  await sequelize.query(`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password' AND is_nullable = 'NO'
      ) THEN
        ALTER TABLE users ALTER COLUMN "password" DROP NOT NULL;
      END IF;
    END $$;
  `)
}
