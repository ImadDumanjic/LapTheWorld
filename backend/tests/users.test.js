/**
 * User routes test suite
 * Covers: GET /api/users/me
 *         PUT  /api/users/:id
 *         DELETE /api/users/:id
 *         POST   /api/users/:id/verify-password
 *         PATCH  /api/users/:id/password
 *
 * All routes require a valid JWT. bcrypt runs for real (SALT_ROUNDS=1 → fast).
 */

import { describe, it, before, afterEach } from 'node:test'
import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'
import bcrypt from 'bcrypt'

import app from '../src/app.js'
import User from '../models/User.js'
import { TEST_USER_ID, TEST_TARGET_ID, makeToken } from './helpers/authHelper.js'

// ---------------------------------------------------------------------------
// GET /api/users/me
// ---------------------------------------------------------------------------

describe('GET /api/users/me', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/users/me')
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Authentication required')
  })

  it('returns 200 with the user profile when authenticated', async () => {
    sinon.stub(User, 'findByPk').resolves({
      id:                TEST_USER_ID,
      username:          'testuser',
      firstName:         'Test',
      lastName:          'User',
      email:             'test@example.com',
      phone:             null,
      role:              'User',
      createdAt:         new Date('2024-01-01'),
      passwordChangedAt: null,
    })

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.include({ username: 'testuser', email: 'test@example.com', role: 'User' })
  })

  it('returns 404 when the token references a deleted user', async () => {
    sinon.stub(User, 'findByPk').resolves(null)

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('User not found')
  })

  it('returns 500 when the database query throws', async () => {
    sinon.stub(User, 'findByPk').rejects(new Error('DB error'))

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`)
    expect(res.status).to.equal(500)
    expect(res.body).to.have.property('message', 'DB error')
  })
})

// ---------------------------------------------------------------------------
// PUT /api/users/:id
// ---------------------------------------------------------------------------

describe('PUT /api/users/:id', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .put(`/api/users/${TEST_USER_ID}`)
      .send({ firstName: 'New' })
    expect(res.status).to.equal(401)
  })

  it('returns 403 when the token user id does not match the route param', async () => {
    const res = await request(app)
      .put(`/api/users/${TEST_TARGET_ID}`)        // different ID
      .set('Authorization', `Bearer ${makeToken()}`) // token has TEST_USER_ID
      .send({ firstName: 'Hacked' })
    expect(res.status).to.equal(403)
    expect(res.body.message).to.equal('Forbidden')
  })

  it('returns 400 for an invalid email address', async () => {
    sinon.stub(User, 'findByPk').resolves({
      id: TEST_USER_ID, email: 'old@example.com',
    })

    const res = await request(app)
      .put(`/api/users/${TEST_USER_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ email: 'not-an-email' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Invalid email address')
  })

  it('returns 409 when the new email is already taken by another user', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, email: 'old@example.com' })
    sinon.stub(User, 'findOne').resolves({ id: TEST_TARGET_ID }) // conflict

    const res = await request(app)
      .put(`/api/users/${TEST_USER_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ email: 'taken@example.com' })
    expect(res.status).to.equal(409)
    expect(res.body.message).to.include('already in use')
  })

  it('returns 400 for an invalid phone number', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, email: 'test@example.com' })

    const res = await request(app)
      .put(`/api/users/${TEST_USER_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ phone: 'abc' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Invalid phone number')
  })

  it('returns 200 with the updated user on success', async () => {
    const mockUser = {
      id:        TEST_USER_ID,
      username:  'testuser',
      firstName: 'Updated',
      lastName:  'Name',
      email:     'same@example.com',
      phone:     null,
      role:      'User',
      update:    sinon.stub().resolves(),
    }
    sinon.stub(User, 'findByPk').resolves(mockUser)

    const res = await request(app)
      .put(`/api/users/${TEST_USER_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ firstName: 'Updated', lastName: 'Name', email: 'same@example.com' })
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('id', TEST_USER_ID)
    expect(res.body).to.have.property('role', 'User')
  })
})

// ---------------------------------------------------------------------------
// DELETE /api/users/:id
// ---------------------------------------------------------------------------

describe('DELETE /api/users/:id', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).delete(`/api/users/${TEST_USER_ID}`)
    expect(res.status).to.equal(401)
  })

  it('returns 403 when the token user id does not match the route param', async () => {
    const res = await request(app)
      .delete(`/api/users/${TEST_TARGET_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
    expect(res.status).to.equal(403)
    expect(res.body.message).to.equal('Forbidden')
  })

  it('returns 404 when the user no longer exists', async () => {
    sinon.stub(User, 'findByPk').resolves(null)

    const res = await request(app)
      .delete(`/api/users/${TEST_USER_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('User not found')
  })

  it('returns 204 on successful account deletion', async () => {
    sinon.stub(User, 'findByPk').resolves({
      id:      TEST_USER_ID,
      destroy: sinon.stub().resolves(),
    })

    const res = await request(app)
      .delete(`/api/users/${TEST_USER_ID}`)
      .set('Authorization', `Bearer ${makeToken()}`)
    expect(res.status).to.equal(204)
    expect(res.text).to.equal('')
  })
})

// ---------------------------------------------------------------------------
// POST /api/users/:id/verify-password
// ---------------------------------------------------------------------------

describe('POST /api/users/:id/verify-password', () => {
  let hashedPassword

  before(async () => {
    hashedPassword = await bcrypt.hash('TestPass123!', 1)
  })

  afterEach(() => sinon.restore())

  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post(`/api/users/${TEST_USER_ID}/verify-password`)
      .send({ currentPassword: 'TestPass123!' })
    expect(res.status).to.equal(401)
  })

  it('returns 403 when the token user id does not match the route param', async () => {
    const res = await request(app)
      .post(`/api/users/${TEST_TARGET_ID}/verify-password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'TestPass123!' })
    expect(res.status).to.equal(403)
  })

  it('returns 400 when currentPassword field is missing', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword })

    const res = await request(app)
      .post(`/api/users/${TEST_USER_ID}/verify-password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({})
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Current password required')
  })

  it('returns 401 when the password is incorrect', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword })

    const res = await request(app)
      .post(`/api/users/${TEST_USER_ID}/verify-password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'WrongPass999!' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Incorrect password')
  })

  it('returns 200 with valid: true when the password is correct', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword })

    const res = await request(app)
      .post(`/api/users/${TEST_USER_ID}/verify-password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'TestPass123!' })
    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal({ valid: true })
  })
})

// ---------------------------------------------------------------------------
// PATCH /api/users/:id/password
// ---------------------------------------------------------------------------

describe('PATCH /api/users/:id/password', () => {
  let hashedPassword

  before(async () => {
    hashedPassword = await bcrypt.hash('TestPass123!', 1)
  })

  afterEach(() => sinon.restore())

  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .patch(`/api/users/${TEST_USER_ID}/password`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'NewPass456@' })
    expect(res.status).to.equal(401)
  })

  it('returns 403 when the token user id does not match the route param', async () => {
    const res = await request(app)
      .patch(`/api/users/${TEST_TARGET_ID}/password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'NewPass456@' })
    expect(res.status).to.equal(403)
  })

  it('returns 400 when both password fields are missing', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword, passwordChangeCount: 0 })

    const res = await request(app)
      .patch(`/api/users/${TEST_USER_ID}/password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({})
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Both passwords required')
  })

  it('returns 401 when the current password is wrong', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword, passwordChangeCount: 0 })

    const res = await request(app)
      .patch(`/api/users/${TEST_USER_ID}/password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'WrongPass999!', newPassword: 'NewPass456@' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Incorrect current password')
  })

  it('returns 400 when the new password does not meet requirements', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword, passwordChangeCount: 0 })

    const res = await request(app)
      .patch(`/api/users/${TEST_USER_ID}/password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'weak' })
    expect(res.status).to.equal(400)
    expect(res.body).to.have.property('errors').that.is.an('array').that.is.not.empty
  })

  it('returns 400 when the new password is the same as the current one', async () => {
    sinon.stub(User, 'findByPk').resolves({ id: TEST_USER_ID, password: hashedPassword, passwordChangeCount: 0 })

    const res = await request(app)
      .patch(`/api/users/${TEST_USER_ID}/password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'TestPass123!' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('must differ')
  })

  it('returns 200 on a successful password change', async () => {
    sinon.stub(User, 'findByPk').resolves({
      id:                  TEST_USER_ID,
      password:            hashedPassword,
      passwordChangeCount: 0,
      update:              sinon.stub().resolves(),
    })

    const res = await request(app)
      .patch(`/api/users/${TEST_USER_ID}/password`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'NewPass456@' })
    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Password updated successfully')
  })
})
