const { assert } = require('chai')
const request = require('supertest')

const app = require('../../../src/main/config/app')

describe('CORS Middleware', () => {
  it('should enable CORS', async () => {
    app.get('/test_enable_cors', (req, res) => {
      res.send().end()
    })

    const result = await request(app)
      .get('/test_enable_cors')
      .expect(200)

    assert.deepEqual(result.headers['access-control-allow-origin'], '*')
    assert.deepEqual(result.headers['access-control-allow-methods'], 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    assert.deepEqual(result.headers['access-control-allow-headers'], 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  })
})
