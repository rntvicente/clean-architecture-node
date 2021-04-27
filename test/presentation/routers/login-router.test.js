const { assert } = require('chai')

const LoginRouter = require('../../../src/presentation/routers/login-router')
const MissingParamError = require('../../../src/presentation/helpers/missing-param-error')
const UnauthorizedError = require('../../../src/presentation/helpers/unauthorized-error')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    authUseCaseSpy,
    sut
  }
}

describe('Login Router', () => {
  it('should return 400 when no email is provided', async () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()

    const httpResponse = await sut.route()
    assert.strictEqual(httpResponse.statusCode, 500)
  })

  it('should return 500 when httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResquest = {}

    const httpResponse = await sut.route(httpResquest)
    assert.strictEqual(httpResponse.statusCode, 500)
  })

  it('should call AuthUseCase with correct param', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    await sut.route(httpResquest)

    assert.strictEqual(authUseCaseSpy.email, 'any_email@email.com')
    assert.strictEqual(authUseCaseSpy.password, 'any_password')
  })

  it('should return 401 when invalid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = await sut.route(httpResquest)

    assert.strictEqual(httpResponse.statusCode, 401)
    assert.deepInclude(httpResponse.body, new UnauthorizedError())
  })
})
