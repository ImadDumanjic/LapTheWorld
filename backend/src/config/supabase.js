import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_BUCKET) {
  throw new Error(
    'Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET'
  )
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .slice(0, 80)
}

export async function uploadToSupabase({ buffer, mimetype, originalName, folder }) {
  const sanitized = sanitizeName(originalName)
  const storagePath = `${folder}/${Date.now()}-${crypto.randomUUID()}-${sanitized}`

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(storagePath, buffer, { contentType: mimetype, upsert: false })

  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(storagePath)
  return { path: storagePath, publicUrl: data.publicUrl }
}

export async function deleteFromSupabase(pathOrUrl) {
  if (!pathOrUrl) return

  let storagePath = pathOrUrl
  if (pathOrUrl.startsWith('http')) {
    const url = new URL(pathOrUrl)
    const marker = `/object/public/${SUPABASE_BUCKET}/`
    const idx = url.pathname.indexOf(marker)
    if (idx === -1) {
      console.warn('deleteFromSupabase: could not extract path from URL', pathOrUrl)
      return
    }
    storagePath = decodeURIComponent(url.pathname.slice(idx + marker.length))
  }

  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([storagePath])
  if (error && !error.message.includes('Not Found')) {
    console.error('deleteFromSupabase error:', error.message)
  }
}

export default supabase
