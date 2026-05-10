/**
 * Guide routes test suite
 * Covers: GET /api/guides  and  GET /api/guides/:slug
 *
 * Both routes are public (no auth required).
 * The guideService transforms each DB row via toApiShape() so response fields
 * differ from the model fields — the tests assert the API shape.
 */

import { describe, it, afterEach } from 'node:test'
import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'

import app from '../src/app.js'
import Guide from '../models/Guide.js'

// A row as it comes out of the database (Sequelize model fields)
const mockGuideRow = () => ({
  slug:             'monaco',
  title:            'Monaco Grand Prix',
  country:          'Monaco',
  city:             'Monte Carlo',
  circuit:          'Circuit de Monaco',
  lat:              '43.734722',
  lng:              '7.420556',
  weather_location: 'Monaco',
  circuit_info:     { laps: 78, length: '3.337 km' },
  guide_sections:   { gettingThere: 'Fly to Nice.' },
  hotels:           [{ name: 'Hotel de Paris', stars: 5 }],
})

// What the API returns after toApiShape() transforms the row
const expectedApiShape = {
  slug:          'monaco',
  title:         'Monaco Grand Prix',
  country:       'Monaco',
  city:          'Monte Carlo',
  circuit:       'Circuit de Monaco',
  coordinates:   { lat: 43.734722, lng: 7.420556 },
  weather:       { location: 'Monaco' },
  circuitInfo:   { laps: 78, length: '3.337 km' },
  guideSections: { gettingThere: 'Fly to Nice.' },
  hotels:        [{ name: 'Hotel de Paris', stars: 5 }],
}

// ---------------------------------------------------------------------------
// GET /api/guides
// ---------------------------------------------------------------------------

describe('GET /api/guides', () => {
  afterEach(() => sinon.restore())

  it('returns 200 with an array of guides in API shape', async () => {
    sinon.stub(Guide, 'findAll').resolves([mockGuideRow()])

    const res = await request(app).get('/api/guides')
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array').with.lengthOf(1)
    expect(res.body[0]).to.deep.include(expectedApiShape)
  })

  it('returns 200 with an empty array when there are no guides', async () => {
    sinon.stub(Guide, 'findAll').resolves([])

    const res = await request(app).get('/api/guides')
    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal([])
  })

  it('returns 500 when the database query fails', async () => {
    sinon.stub(Guide, 'findAll').rejects(new Error('DB unavailable'))

    const res = await request(app).get('/api/guides')
    expect(res.status).to.equal(500)
    expect(res.body.message).to.equal('DB unavailable')
  })
})

// ---------------------------------------------------------------------------
// GET /api/guides/:slug
// ---------------------------------------------------------------------------

describe('GET /api/guides/:slug', () => {
  afterEach(() => sinon.restore())

  it('returns 200 with the guide in API shape when it exists', async () => {
    sinon.stub(Guide, 'findByPk').resolves(mockGuideRow())

    const res = await request(app).get('/api/guides/monaco')
    expect(res.status).to.equal(200)
    expect(res.body).to.deep.include(expectedApiShape)
    expect(res.body.coordinates).to.deep.equal({ lat: 43.734722, lng: 7.420556 })
  })

  it('returns 404 when the slug does not match any guide', async () => {
    sinon.stub(Guide, 'findByPk').resolves(null)

    const res = await request(app).get('/api/guides/nonexistent-gp')
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Guide not found')
  })

  it('returns 500 when the database query fails', async () => {
    sinon.stub(Guide, 'findByPk').rejects(new Error('Query timeout'))

    const res = await request(app).get('/api/guides/monaco')
    expect(res.status).to.equal(500)
    expect(res.body.message).to.equal('Query timeout')
  })
})
