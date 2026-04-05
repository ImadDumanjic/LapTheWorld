export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password) {
  const failed = []
  if (password.length < 8) failed.push('At least 8 characters')
  if (!/[A-Z]/.test(password)) failed.push('At least one uppercase letter')
  if (!/[a-z]/.test(password)) failed.push('At least one lowercase letter')
  if (!/\d/.test(password)) failed.push('At least one number')
  if (!/[^A-Za-z0-9]/.test(password)) failed.push('At least one special character')
  return failed
}

export function validatePhone(phone) {
  return /^\+?[\d\s\-().]{7,15}$/.test(phone)
}
