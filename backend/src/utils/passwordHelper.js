import bcrypt from 'bcrypt'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword)
}
