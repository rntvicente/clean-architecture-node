const { assert } = require('chai')

class LoginRouter {
  async route (httpRequest) {
    if (!httpRequest.body.emai || !httpRequest.body.password) {
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
})
