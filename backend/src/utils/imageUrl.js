// TODO: Legacy blog images stored as /uploads/... will need manual re-upload to Supabase.
// They will 404 in production but won't crash anything.
export function resolveImageUrl(stored) {
  if (!stored) return null
  if (/^https?:\/\//.test(stored)) return stored
  return stored
}
