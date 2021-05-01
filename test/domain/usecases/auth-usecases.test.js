const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
chai.use(chaiAsPromised)

const { MissingParamError } = require('../../../src/utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    await this.loadUserByEmailRepository.load(email)
  }
}

const sandbox = sinon.createSandbox()

describe('Auth Usecase', () => {
  afterEach(() => sandbox.restore())

  it('should return throws when no email is provided', async () => {
    const sut = new AuthUseCase()

    return chai.assert.isRejected(sut.auth())
  })

  it('should return throws when no password is provided', async () => {
    const sut = new AuthUseCase()

    return chai.assert.isRejected(sut.auth('any_email@email.com'))
  })

  it('should call LoadUserByEmailRepository with email correct', async () => {
    class LoadUserByEmailRepository {
      async load (email) {
        this.email = email
      }
    }

    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const sut = await new AuthUseCase(loadUserByEmailRepository)

    const loadUserByEmailRepositorySpy = sandbox.spy(loadUserByEmailRepository, 'load')
    sut.auth('any_email@email.com', 'any_password')

    chai.assert.isTrue(loadUserByEmailRepositorySpy.calledOnceWith('any_email@email.com'))
  })
})
