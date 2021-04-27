const { assert } = require('chai')

const LoginRouter = require('../../../src/presentation/routers/login-router')
const MissingParamError = require('../../../src/presentation/helpers/missing-param-error')

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
