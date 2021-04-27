const { assert } = require('chai')

class LoginRouter {
  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { body: { emai, password } } = httpRequest

    if (!emai) {
      return HttpResponse.badRequest('email')
    }

    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}

class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
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

    assert.strictEqual(httpResponse.statusCode, 400)
    assert.deepInclude(httpResponse.body, new MissingParamError('email'))
  })

  it('should return 400 when no password is provided', async () => {
    const sut = new LoginRouter()
    const httpResquest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = await sut.route(httpResquest)

    assert.strictEqual(httpResponse.statusCode, 400)
    assert.deepInclude(httpResponse.body, new MissingParamError('password'))
  })

  it('should return 500 when no httpRequest is provided', async () => {
    const sut = new LoginRouter()

    const httpResponse = await sut.route()
    assert.strictEqual(httpResponse.statusCode, 500)
  })

  it('should return 500 when httpRequest has no body', async () => {
    const sut = new LoginRouter()
    const httpResquest = {}

    const httpResponse = await sut.route(httpResquest)
    assert.strictEqual(httpResponse.statusCode, 500)
  })
})
