/**
 * Auth routes test suite
 * Covers: POST /api/auth/register, /login, /forgot-password
 *         POST /api/admin-auth/login
 *
 * Strategy: stub User.findOne / User.create on the Sequelize model class.
 * Because ESM caches the same module instance, the stubs affect the exact
 * same object the services use. bcrypt runs for real (SALT_ROUNDS=1 → fast).
 */

import { describe, it, before, afterEach } from 'node:test'
import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'
import bcrypt from 'bcrypt'

import app from '../src/app.js'
import User from '../models/User.js'
import { TEST_USER_ID, TEST_ADMIN_ID } from './helpers/authHelper.js'

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

describe('POST /api/auth/register', () => {
  afterEach(() => sinon.restore())

  it('returns 400 when required field username is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'StrongPass1!' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('username')
  })

  it('returns 400 when required field email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'user', password: 'StrongPass1!' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('email')
  })

  it('returns 400 when required field password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'user', email: 'user@example.com' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('password')
  })

  it('returns 400 for an invalid email address', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'user', email: 'not-an-email', password: 'StrongPass1!' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Invalid email address')
  })

  it('returns 400 with errors array for a weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'user', email: 'user@example.com', password: 'weak' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Password does not meet requirements')
    expect(res.body.errors).to.be.an('array').that.is.not.empty
  })

  it('returns 500 when username or email is already taken', async () => {
    sinon.stub(User, 'findOne').resolves({ id: 'existing-id' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'taken', email: 'taken@example.com', password: 'StrongPass1!' })
    expect(res.status).to.equal(500)
    expect(res.body.message).to.include('already in use')
  })

  it('returns 201 with a JWT token and user object on success', async () => {
    sinon.stub(User, 'findOne').resolves(null)
    sinon.stub(User, 'create').resolves({
      id:       TEST_USER_ID,
      username: 'newuser',
      email:    'new@example.com',
      role:     'User',
    })

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username:  'newuser',
        email:     'new@example.com',
        password:  'StrongPass1!',
        firstName: 'New',
        lastName:  'User',
      })
    expect(res.status).to.equal(201)
    expect(res.body).to.have.property('token').that.is.a('string')
    expect(res.body.user).to.include({ username: 'newuser', email: 'new@example.com', role: 'User' })
  })
})

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

describe('POST /api/auth/login', () => {
  let hashedPassword

  before(async () => {
    hashedPassword = await bcrypt.hash('TestPass123!', 1)
  })

  afterEach(() => sinon.restore())

  const baseUser = () => ({
    id:                  TEST_USER_ID,
    username:            'testuser',
    email:               'test@example.com',
    password:            hashedPassword,
    role:                'User',
    failedLoginAttempts: 0,
    lockUntil:           null,
    banned:              false,
    update:              sinon.stub().resolves(),
  })

  it('returns 400 when email field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'TestPass123!' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('email')
  })

  it('returns 400 when password field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('password')
  })

  it('returns 401 when user does not exist', async () => {
    sinon.stub(User, 'findOne').resolves(null)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'TestPass123!' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid credentials')
  })

  it('returns 401 for an incorrect password', async () => {
    sinon.stub(User, 'findOne').resolves({ ...baseUser(), update: sinon.stub().resolves() })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'WrongPassword9!' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid credentials')
  })

  it('returns 429 when the account is temporarily locked', async () => {
    sinon.stub(User, 'findOne').resolves({
      ...baseUser(),
      lockUntil: new Date(Date.now() + 900_000),
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'TestPass123!' })
    expect(res.status).to.equal(429)
    expect(res.body.message).to.include('failed login attempts')
  })

  it('returns 403 when the account is banned', async () => {
    sinon.stub(User, 'findOne').resolves({ ...baseUser(), banned: true })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'TestPass123!' })
    expect(res.status).to.equal(403)
    expect(res.body.message).to.include('banned')
  })

  it('returns 403 when an admin attempts to log in via the user portal', async () => {
    sinon.stub(User, 'findOne').resolves({ ...baseUser(), role: 'Admin' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'TestPass123!' })
    expect(res.status).to.equal(403)
    expect(res.body.message).to.include('admin portal')
  })

  it('returns 200 with token and user on a successful login', async () => {
    sinon.stub(User, 'findOne').resolves(baseUser())

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'TestPass123!' })
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('token').that.is.a('string')
    expect(res.body.user).to.include({ username: 'testuser', role: 'User' })
  })
})

// ---------------------------------------------------------------------------
// POST /api/auth/forgot-password
// ---------------------------------------------------------------------------

describe('POST /api/auth/forgot-password', () => {
  afterEach(() => sinon.restore())

  it('returns 400 when email field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({})
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('email')
  })

  it('returns 200 with a generic message regardless of whether the email exists', async () => {
    sinon.stub(User, 'findOne').resolves(null)

    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'anybody@example.com' })
    expect(res.status).to.equal(200)
    expect(res.body.message).to.include("we've sent a reset link")
  })
})

// ---------------------------------------------------------------------------
// POST /api/admin-auth/login
// ---------------------------------------------------------------------------

describe('POST /api/admin-auth/login', () => {
  let hashedAdminPassword

  before(async () => {
    hashedAdminPassword = await bcrypt.hash('AdminPass123!', 1)
  })

  afterEach(() => sinon.restore())

  const baseAdmin = () => ({
    id:                  TEST_ADMIN_ID,
    email:               'admin@example.com',
    password:            hashedAdminPassword,
    role:                'Admin',
    failedLoginAttempts: 0,
    lockUntil:           null,
    banned:              false,
    totpSecret:          null,
    update:              sinon.stub().resolves(),
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/admin-auth/login')
      .send({ email: 'admin@example.com' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('password')
  })

  it('returns 401 when the email does not belong to an admin', async () => {
    sinon.stub(User, 'findOne').resolves({
      id: TEST_USER_ID, email: 'user@example.com', role: 'User',
    })

    const res = await request(app)
      .post('/api/admin-auth/login')
      .send({ email: 'user@example.com', password: 'AdminPass123!' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid credentials')
  })

  it('returns 401 when the password is incorrect', async () => {
    sinon.stub(User, 'findOne').resolves(baseAdmin())

    const res = await request(app)
      .post('/api/admin-auth/login')
      .send({ email: 'admin@example.com', password: 'WrongPassword9!' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid credentials')
  })

  it('returns 429 when the admin account is locked', async () => {
    sinon.stub(User, 'findOne').resolves({
      ...baseAdmin(),
      lockUntil: new Date(Date.now() + 900_000),
    })

    const res = await request(app)
      .post('/api/admin-auth/login')
      .send({ email: 'admin@example.com', password: 'AdminPass123!' })
    expect(res.status).to.equal(429)
    expect(res.body.message).to.include('locked')
  })

  it('returns requiresTotp and tempToken when TOTP is already configured', async () => {
    sinon.stub(User, 'findOne').resolves({
      ...baseAdmin(),
      totpSecret: 'JBSWY3DPEHPK3PXP',
    })

    const res = await request(app)
      .post('/api/admin-auth/login')
      .send({ email: 'admin@example.com', password: 'AdminPass123!' })
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('requiresTotp', true)
    expect(res.body).to.have.property('tempToken').that.is.a('string')
  })

  it('returns requiresSetup, qrDataUrl and tempToken for a first-time admin', async () => {
    sinon.stub(User, 'findOne').resolves({
      ...baseAdmin(),
      totpSecret: null,
    })

    const res = await request(app)
      .post('/api/admin-auth/login')
      .send({ email: 'admin@example.com', password: 'AdminPass123!' })
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('requiresSetup', true)
    expect(res.body).to.have.property('tempToken').that.is.a('string')
    expect(res.body).to.have.property('qrDataUrl').that.is.a('string')
    expect(res.body).to.have.property('manualSecret').that.is.a('string')
  })
})
