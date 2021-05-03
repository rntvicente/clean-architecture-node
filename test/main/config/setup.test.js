const { assert } = require('chai')
const request = require('supertest')

const app = require('../../../src/main/config/app')

describe('App Setup', () => {
  it('should disable x-powered-by header', async () => {
    app.get('/test_x_powered_by', (req, res) => {
      res.send().end()
    })

    const result = await request(app)
      .get('/test_x_powered_by')
      .expect(200)

    assert.isUndefined(result.headers['x-powered-by'])
  })
})
