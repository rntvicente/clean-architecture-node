const { assert } = require('chai')

const LoginRouter = require('../../../src/presentation/routers/login-router')
const MissingParamError = require('../../../src/presentation/helpers/missing-param-error')
const UnauthorizedError = require('../../../src/presentation/helpers/unauthorized-error')
const ServerError = require('../../../src/presentation/helpers/server-error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    authUseCaseSpy,
    sut
  }
}

const makeAuthUseCase = () => {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  return new AuthUseCase()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCase {
    auth (email, password) {
      throw new Error()
    }
  }

  return new AuthUseCase()
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

  it('should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
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

  it('should return 500 when no httpRequest is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route()
    assert.strictEqual(httpResponse.statusCode, 500)
    assert.deepInclude(httpResponse.body, new ServerError())
  })

  it('should return 500 when httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResquest = {}

    const httpResponse = await sut.route(httpResquest)
    assert.strictEqual(httpResponse.statusCode, 500)
    assert.deepInclude(httpResponse.body, new ServerError())
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

  it('should return 500 when no AuthUseCase is provided', async () => {
    const sut = new LoginRouter({})

    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpResquest)
    assert.strictEqual(httpResponse.statusCode, 500)
    assert.deepInclude(httpResponse.body, new ServerError())
  })

  it('should return 500 when AuthUseCase has no auth method', async () => {
    const sut = new LoginRouter({})

    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpResquest)
    assert.strictEqual(httpResponse.statusCode, 500)
    assert.deepInclude(httpResponse.body, new ServerError())
  })

  it('should return 500 when AuthUseCase throws', async () => {
    const authUseCaseWithError = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseWithError)

    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpResquest)
    assert.strictEqual(httpResponse.statusCode, 500)
    assert.deepInclude(httpResponse.body, new ServerError())
  })

  it('should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpResquest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpResquest)

    assert.strictEqual(httpResponse.statusCode, 200)
    assert.deepEqual(httpResponse.body.accessToken, authUseCaseSpy.accessToken)
  })
})
