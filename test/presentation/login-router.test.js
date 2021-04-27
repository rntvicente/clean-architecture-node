const { assert } = require('chai')

class LoginRouter {
  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500
      }
    }

    const { body: { emai, password } } = httpRequest

    if (!emai || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login Router', () => {
  it('should return 400 when no email is provided', async () => {
    const sut = new LoginRouter()
    const httpResquest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpResquest)
    assert.equal(httpResponse.statusCode, 400)
  })

  it('should return 400 when no password is provided', async () => {
    const sut = new LoginRouter()
    const httpResquest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = await sut.route(httpResquest)
    assert.equal(httpResponse.statusCode, 400)
  })

  it('should return 500 when no httpRequest is provided', async () => {
    const sut = new LoginRouter()

    const httpResponse = await sut.route()
    assert.equal(httpResponse.statusCode, 500)
  })

  it('should return 500 when httpRequest has no body', async () => {
    const sut = new LoginRouter()
    const httpResquest = {}

    const httpResponse = await sut.route(httpResquest)
    assert.equal(httpResponse.statusCode, 500)
  })
})
