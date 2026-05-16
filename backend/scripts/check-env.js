import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

function mask(value, label) {
  if (!value) return `${label}: *** NOT SET ***`
  if (value.length <= 8) return `${label}: ${'*'.repeat(value.length)} (${value.length} chars)`
  return `${label}: ${value.slice(0, 4)}...${'*'.repeat(value.length - 8)}...${value.slice(-4)} (${value.length} chars)`
}

function show(value, label) {
  if (!value) return `${label}: *** NOT SET ***`
  return `${label}: ${value}`
}

function maskUrl(value, label) {
  if (!value) return `${label}: *** NOT SET ***`
  try {
    const u = new URL(value)
    if (u.password) u.password = '****'
    return `${label}: ${u.toString()}`
  } catch {
    return `${label}: (unparseable URL — ${value.slice(0, 20)}...)`
  }
}

console.log('\n=== ENV CHECK ===\n')
console.log(show(process.env.NODE_ENV, 'NODE_ENV'))
console.log(maskUrl(process.env.DATABASE_URL, 'DATABASE_URL'))
console.log(show(process.env.SUPABASE_URL, 'SUPABASE_URL'))
console.log(mask(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY'))
console.log(show(process.env.SUPABASE_BUCKET, 'SUPABASE_BUCKET'))
console.log()

const missing = ['NODE_ENV', 'DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_BUCKET']
  .filter(k => !process.env[k])

if (missing.length) {
  console.log('MISSING vars:', missing.join(', '))
} else {
  console.log('All 5 vars are set.')
}
console.log('=================\n')
