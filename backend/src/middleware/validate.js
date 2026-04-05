import { validateEmail, validatePassword } from '../utils/validators.js'

export function validateBody(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter(field => {
      const value = req.body[field]
      return value === undefined || value === null || value === ''
    })

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    next()
  }
}

export function validateRegisterInput(req, res, next) {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ 
      message: 'Invalid email address' 
    })
  }

  const passwordErrors = validatePassword(password);

  if (passwordErrors.length) {
    return res.status(400).json({ 
      message: 'Password does not meet requirements', 
      errors: passwordErrors 
    });
  }

  next()
} 