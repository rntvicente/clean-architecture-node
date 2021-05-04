const request = require('supertest')

const app = require('../../../src/main/config/app')

describe('JSON Parser Middleware', () => {
  it('should parser body at body', async () => {
    const body = { name: 'teste parser JSON' }

    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send(body)
      .expect({ name: 'teste parser JSON' })
  })
})
