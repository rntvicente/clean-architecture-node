const { assert } = require('chai')

const LoginRouter = require('../../../src/presentation/routers/login-router')
const { UnauthorizedError, ServerError } = require('../../../src/presentation/errors')
const { MissingParamError, InvalidParamError } = require('../../../src/utils/errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidateSpy = makeEmailValidator()

  const sut = new LoginRouter(authUseCaseSpy, emailValidateSpy)

  return {
    authUseCaseSpy,
    emailValidateSpy,
    sut
  }
}

const makeEmailValidator = () => {
  class EmailValidator {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidator = new EmailValidator()
  emailValidator.isEmailValid = true

  return emailValidator
}

const makeEmailValidatorWithError = () => {
  class EmailValidator {
    isValid (email) {
      throw new Error()
    }
  }

  const emailValidator = new EmailValidator()
  emailValidator.isEmailValid = true

  return emailValidator
}

const makeAuthUseCase = () => {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  const authUseCase = new AuthUseCase()
  authUseCase.accessToken = 'valid_token'

  return authUseCase
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

  it('should return 400 when no email invalid', async () => {
    const { sut, emailValidateSpy } = makeSut()

    emailValidateSpy.isEmailValid = false

    const httpResquest = {
      body: {
        password: 'any_password',
        email: 'invalid_email@email.com'
      }
    }

    const httpResponse = await sut.route(httpResquest)

    assert.strictEqual(httpResponse.statusCode, 400)
    assert.deepInclude(httpResponse.body, new InvalidParamError('email'))
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

  it('should return 500 when EmailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy)

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

  it('should return 500 when EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})

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

  it('should return 500 when EmailValidator throws', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorWithErrorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorWithErrorSpy)

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

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidateSpy } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    await sut.route(httpResquest)

    assert.strictEqual(emailValidateSpy.email, 'any_email@email.com')
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
