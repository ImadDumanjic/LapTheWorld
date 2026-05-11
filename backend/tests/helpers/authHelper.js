import jwt from 'jsonwebtoken'

export const TEST_USER_ID   = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
export const TEST_ADMIN_ID  = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
export const TEST_TARGET_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
export const TEST_BLOG_ID   = 'dddddddd-dddd-dddd-dddd-dddddddddddd'

export function makeToken(overrides = {}) {
  return jwt.sign(
    { id: TEST_USER_ID, ...overrides },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export function makeAdminToken() {
  return makeToken({ id: TEST_ADMIN_ID })
}
