/**
 * Blog routes test suite
 * Covers: GET/POST/PUT/DELETE /api/blogs/*
 *
 * Strategy:
 *  - Blog.findAndCountAll / Blog.findByPk / Blog.create / Blog.findOne
 *    are stubbed on the model class (same cached ESM export the services use).
 *  - Authenticated routes receive a valid JWT; requireAuth verifies it without
 *    hitting the DB.
 *  - multer is bypassed by sending JSON (non-multipart requests pass through
 *    multer unchanged, and express.json() has already parsed req.body).
 *  - The fire-and-forget email notifications (.catch()) absorb any email
 *    failures silently, so no email stubs are needed.
 */

import { describe, it, afterEach } from 'node:test'
import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'

import app from '../src/app.js'
import Blog from '../models/Blog.js'
import User from '../models/User.js'
import {
  TEST_USER_ID,
  TEST_BLOG_ID,
  makeToken,
} from './helpers/authHelper.js'

// Reusable mock objects
const mockBlog = () => ({
  id:        TEST_BLOG_ID,
  title:     'Test Blog',
  content:   'Test content for the blog post.',
  image_url: null,
  author_id: TEST_USER_ID,
  status:    'approved',
  author: {
    id:        TEST_USER_ID,
    username:  'testuser',
    email:     'test@example.com',
    firstName: 'Test',
    lastName:  'User',
  },
})

const mockBlogInstance = () => ({
  ...mockBlog(),
  save: sinon.stub().resolves(),
})

const mockUserForEmail = () => ({
  id:        TEST_USER_ID,
  username:  'testuser',
  email:     'test@example.com',
  firstName: 'Test',
  lastName:  'User',
})

// ---------------------------------------------------------------------------
// GET /api/blogs
// ---------------------------------------------------------------------------

describe('GET /api/blogs', () => {
  afterEach(() => sinon.restore())

  it('returns 200 with paginated blog list', async () => {
    sinon.stub(Blog, 'findAndCountAll').resolves({
      count: 2,
      rows:  [
        { ...mockBlog(), id: 'blog-1', title: 'First'  },
        { ...mockBlog(), id: 'blog-2', title: 'Second' },
      ],
    })

    const res = await request(app).get('/api/blogs')
    expect(res.status).to.equal(200)
    expect(res.body.blogs).to.have.lengthOf(2)
    expect(res.body).to.include({ total: 2, page: 1 })
    expect(res.body).to.have.property('totalPages')
  })

  it('returns 200 for a specific page query param', async () => {
    sinon.stub(Blog, 'findAndCountAll').resolves({ count: 0, rows: [] })

    const res = await request(app).get('/api/blogs?page=3')
    expect(res.status).to.equal(200)
    expect(res.body).to.include({ page: 3, total: 0 })
  })

  it('returns 500 when the database query fails', async () => {
    sinon.stub(Blog, 'findAndCountAll').rejects(new Error('DB connection lost'))

    const res = await request(app).get('/api/blogs')
    expect(res.status).to.equal(500)
    expect(res.body.message).to.equal('DB connection lost')
  })
})

// ---------------------------------------------------------------------------
// GET /api/blogs/:id
// ---------------------------------------------------------------------------

describe('GET /api/blogs/:id', () => {
  afterEach(() => sinon.restore())

  it('returns 200 with the blog when it exists', async () => {
    sinon.stub(Blog, 'findByPk').resolves(mockBlog())

    const res = await request(app).get(`/api/blogs/${TEST_BLOG_ID}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('id', TEST_BLOG_ID)
    expect(res.body).to.have.property('title', 'Test Blog')
  })

  it('returns 404 when the blog does not exist', async () => {
    sinon.stub(Blog, 'findByPk').resolves(null)

    const res = await request(app).get('/api/blogs/nonexistent-id')
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Blog not found')
  })

  it('returns 500 when the database query fails', async () => {
    sinon.stub(Blog, 'findByPk').rejects(new Error('Query failed'))

    const res = await request(app).get(`/api/blogs/${TEST_BLOG_ID}`)
    expect(res.status).to.equal(500)
    expect(res.body).to.have.property('message', 'Query failed')
  })
})

// ---------------------------------------------------------------------------
// POST /api/blogs
// ---------------------------------------------------------------------------

describe('POST /api/blogs', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({ title: 'Test', content: 'Content' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Authentication required')
  })

  it('returns 401 for an expired or invalid token', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', 'Bearer this.is.invalid')
      .send({ title: 'Test', content: 'Content' })
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid or expired token')
  })

  it('returns 400 when title is missing', async () => {
    const token = makeToken()
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Some content without a title' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Title is required')
  })

  it('returns 400 when content is missing', async () => {
    const token = makeToken()
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'A title without content' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Content is required')
  })

  it('returns 400 when title exceeds 200 characters', async () => {
    const token = makeToken()
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'A'.repeat(201), content: 'Content' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.include('200 characters')
  })

  it('returns 201 with the created blog on success', async () => {
    const createdBlog = mockBlog()
    sinon.stub(Blog, 'create').resolves(createdBlog)
    sinon.stub(User, 'findByPk').resolves(mockUserForEmail())

    const token = makeToken()
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Blog', content: 'Test content for the blog post.' })
    expect(res.status).to.equal(201)
    expect(res.body).to.have.property('id', TEST_BLOG_ID)
    expect(res.body).to.have.property('title', 'Test Blog')
  })

  it('returns 500 when the database insert fails', async () => {
    sinon.stub(Blog, 'create').rejects(new Error('Insert failed'))
    sinon.stub(User, 'findByPk').resolves(mockUserForEmail())

    const token = makeToken()
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Blog', content: 'Test content for the blog post.' })
    expect(res.status).to.equal(500)
    expect(res.body.message).to.equal('Insert failed')
  })
})

// ---------------------------------------------------------------------------
// GET /api/blogs/my
// ---------------------------------------------------------------------------

describe('GET /api/blogs/my', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when not authenticated', async () => {
    const res = await request(app).get('/api/blogs/my')
    expect(res.status).to.equal(401)
  })

  it('returns 200 with the authenticated user\'s blogs', async () => {
    sinon.stub(Blog, 'findAndCountAll').resolves({
      count: 1,
      rows:  [{ ...mockBlog(), title: 'My Blog' }],
    })

    const token = makeToken()
    const res = await request(app)
      .get('/api/blogs/my')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).to.equal(200)
    expect(res.body.blogs).to.have.lengthOf(1)
    expect(res.body.blogs[0]).to.have.property('title', 'My Blog')
  })
})

// ---------------------------------------------------------------------------
// PUT /api/blogs/:id
// ---------------------------------------------------------------------------

describe('PUT /api/blogs/:id', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .put(`/api/blogs/${TEST_BLOG_ID}`)
      .send({ title: 'Updated', content: 'Updated content' })
    expect(res.status).to.equal(401)
  })

  it('returns 404 when the blog does not exist', async () => {
    sinon.stub(Blog, 'findByPk').resolves(null)

    const token = makeToken()
    const res = await request(app)
      .put(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'Updated content' })
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Blog not found')
  })

  it('returns 404 when the blog is soft-deleted', async () => {
    sinon.stub(Blog, 'findByPk').resolves({ ...mockBlog(), status: 'deleted' })

    const token = makeToken()
    const res = await request(app)
      .put(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'Updated content' })
    expect(res.status).to.equal(404)
  })

  it('returns 403 when the authenticated user does not own the blog', async () => {
    sinon.stub(Blog, 'findByPk').resolves({
      ...mockBlog(),
      author_id: 'someone-else-uuid',
    })

    const token = makeToken()
    const res = await request(app)
      .put(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'Updated content' })
    expect(res.status).to.equal(403)
    expect(res.body.message).to.equal('Forbidden')
  })

  it('returns 400 when the updated title is empty', async () => {
    sinon.stub(Blog, 'findByPk').resolves(mockBlog())

    const token = makeToken()
    const res = await request(app)
      .put(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', content: 'Some content' })
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Title is required')
  })

  it('returns 200 with the updated blog on success', async () => {
    const updatedBlog = mockBlogInstance()

    // findByPk is called first by getBlogById (ownership check)
    sinon.stub(Blog, 'findByPk').resolves(mockBlog())
    // findOne is called inside the updateBlog service
    sinon.stub(Blog, 'findOne').resolves(updatedBlog)
    sinon.stub(User, 'findByPk').resolves(mockUserForEmail())

    const token = makeToken()
    const res = await request(app)
      .put(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', content: 'Updated content body.' })
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('id', TEST_BLOG_ID)
  })
})

// ---------------------------------------------------------------------------
// DELETE /api/blogs/:id
// ---------------------------------------------------------------------------

describe('DELETE /api/blogs/:id', () => {
  afterEach(() => sinon.restore())

  it('returns 401 when not authenticated', async () => {
    const res = await request(app).delete(`/api/blogs/${TEST_BLOG_ID}`)
    expect(res.status).to.equal(401)
  })

  it('returns 404 when the blog does not exist', async () => {
    sinon.stub(Blog, 'findByPk').resolves(null)

    const token = makeToken()
    const res = await request(app)
      .delete(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Blog not found')
  })

  it('returns 403 when the authenticated user does not own the blog', async () => {
    sinon.stub(Blog, 'findByPk').resolves({
      ...mockBlog(),
      author_id: 'someone-else-uuid',
    })

    const token = makeToken()
    const res = await request(app)
      .delete(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).to.equal(403)
    expect(res.body.message).to.equal('Forbidden')
  })

  it('returns 204 with no body on successful deletion', async () => {
    sinon.stub(Blog, 'findByPk').resolves(mockBlog())
    sinon.stub(Blog, 'findOne').resolves(mockBlogInstance())

    const token = makeToken()
    const res = await request(app)
      .delete(`/api/blogs/${TEST_BLOG_ID}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).to.equal(204)
    expect(res.text).to.equal('')
  })
})
