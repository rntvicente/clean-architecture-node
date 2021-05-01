const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
chai.use(chaiAsPromised)

const AuthUseCase = require('../../../src/domain/usescases/auth-usecase')

const makeEncrypter = () => {
  class Encrypter {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypter = new Encrypter()
  encrypter.isValid = true

  return encrypter
}

const makeEncrypterWithError = () => {
  class Encrypter {
    async compare () {
      throw new Error()
    }
  }

  return new Encrypter()
}

const makeLoadUserbyEmailRepository = () => {
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepository()
  loadUserByEmailRepository.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepository
}

const makeLoadUserbyEmailRepositoryWithError = () => {
  class LoadUserByEmailRepository {
    async load () {
      return true
    }
  }

  return new LoadUserByEmailRepository()
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGenerator()
  tokenGenerator.accessToken = 'any_token'

  return tokenGenerator
}

const makeTokenGeneratorWithError = () => {
  class TokenGenerator {
    async generate () {
      throw new Error()
    }
  }

  return new TokenGenerator()
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepository {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  return new UpdateAccessTokenRepository()
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepository {
    async update () {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepository()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserbyEmailRepository()
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

const sandbox = sinon.createSandbox()

describe('Auth Usecase', () => {
  afterEach(() => sandbox.restore())

  it('should return throws when no email is provided', async () => {
    const { sut } = makeSut()
    return chai.assert.isRejected(sut.auth())
  })

  it('should return throws when no password is provided', async () => {
    const { sut } = makeSut()
    return chai.assert.isRejected(sut.auth('any_email@email.com'))
  })

  it('should call LoadUserByEmailRepository with email correct', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const spy = sandbox.spy(loadUserByEmailRepositorySpy, 'load')

    sut.auth('any_email@email.com', 'any_password')
    chai.assert.isTrue(spy.calledOnceWith('any_email@email.com'))
  })

  it('should null when an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null

    const accessToken = await sut.auth('invalid_email@email.com', 'any_password')
    chai.assert.isNull(accessToken)
  })

  it('should null when an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')
    chai.assert.isNull(accessToken)
  })

  it('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()

    await sut.auth('valid_email@email.com', 'any_password')

    chai.assert.deepEqual(encrypterSpy.password, 'any_password')
    chai.assert.deepEqual(encrypterSpy.hashedPassword, loadUserByEmailRepositorySpy.user.password)
  })

  it('should call TokenGenerator with correct UserId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth('valid_email@email.com', 'valid_password')
    chai.assert.deepEqual(tokenGeneratorSpy.userId, loadUserByEmailRepositorySpy.user.id)
  })

  it('should return an accessToken when correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()

    const accessToken = await sut.auth('valid_email@email.com', 'valid_password')

    chai.assert.isOk(accessToken)
    chai.assert.deepEqual(accessToken, tokenGeneratorSpy.accessToken)
  })

  it('should call UpdateAccessTokenRepository wwith correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut()

    await sut.auth('valid_email@email.com', 'valid_password')

    chai.assert.isOk(updateAccessTokenRepositorySpy)
    chai.assert.deepEqual(updateAccessTokenRepositorySpy.userId, loadUserByEmailRepositorySpy.user.id)
    chai.assert.deepEqual(updateAccessTokenRepositorySpy.accessToken, tokenGeneratorSpy.accessToken)
  })

  it('should throws when invalid dependencies are provided', async () => {
    const invalid = null
    const loadUserByEmailRepository = makeLoadUserbyEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({ loadUserByEmailRepository }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository: invalid })
    )

    for (const sut of suts) {
      chai.assert.isRejected(sut.auth('any_email@email.com', 'any_password'))
    }
  })

  it('should throws when dependency throws', async () => {
    const loadUserByEmailRepository = makeLoadUserbyEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserbyEmailRepositoryWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: makeEncrypterWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: makeTokenGeneratorWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError() })
    )

    for (const sut of suts) {
      chai.assert.isRejected(sut.auth('any_email@email.com', 'any_password'))
    }
  })
})
