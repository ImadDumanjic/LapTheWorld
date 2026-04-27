import sequelize from '../../config/database.js'

export async function runMigrations() {
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "totpSecret" VARCHAR(255);`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "banned" BOOLEAN NOT NULL DEFAULT FALSE;`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "bannedBy" UUID REFERENCES users(id) ON DELETE SET NULL;`)
  await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "bannedAt" TIMESTAMPTZ;`)
}
