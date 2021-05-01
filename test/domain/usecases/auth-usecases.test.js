const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
chai.use(chaiAsPromised)

const AuthUseCase = require('../../../src/domain/usescases/auth-usecase')

const makeSut = () => {
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepository()
  loadUserByEmailRepository.user = {}

  const sut = new AuthUseCase(loadUserByEmailRepository)

  return {
    sut,
    loadUserByEmailRepository
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
    const { sut, loadUserByEmailRepository } = makeSut()
    const loadUserByEmailRepositorySpy = sandbox.spy(loadUserByEmailRepository, 'load')

    sut.auth('any_email@email.com', 'any_password')
    chai.assert.isTrue(loadUserByEmailRepositorySpy.calledOnceWith('any_email@email.com'))
  })

  it('should throw when no LoadUserByEmailRepository provided', async () => {
    const sut = new AuthUseCase()
    chai.assert.isRejected(sut.auth('any_email@email.com', 'any_password'))
  })

  it('should throw when LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    chai.assert.isRejected(sut.auth('any_email@email.com', 'any_password'))
  })

  it('should null when an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository.user = null

    const accessToken = await sut.auth('invalid_email@email.com', 'any_password')
    chai.assert.isNull(accessToken)
  })

  it('should null when an invalid password is provided', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')
    chai.assert.isNull(accessToken)
  })
})
