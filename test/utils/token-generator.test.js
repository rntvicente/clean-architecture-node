const jwt = require('jsonwebtoken')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const chai = require('chai')

const Encrypter = require('../../src/utils/helpers/token-generator')
const TokenGenerator = require('../../src/utils/helpers/token-generator')

const makeSut = () => {
  return new Encrypter('secret')
}

const sandbox = sinon.createSandbox()
chai.use(chaiAsPromised)

describe('Token Generator', () => {
  afterEach(() => sandbox.restore())

  it('should return null when JWT returns null', async () => {
    sandbox.stub(jwt, 'sign').returns(null)

    const sut = makeSut()
    const token = await sut.generate('any_id')

    chai.assert.isNull(token)
  })

  it('should return a token when JWT returns token', async () => {
    sandbox.stub(jwt, 'sign').returns('valid_token')

    const sut = makeSut()
    const isValid = await sut.generate('any_id')

    chai.assert.strictEqual(isValid, 'valid_token')
  })

  it('should call JWT with correct values', async () => {
    const signSpy = sandbox.spy(jwt, 'sign')

    const sut = makeSut()
    await sut.generate('any_id')

    chai.assert.isTrue(signSpy.calledOnceWith('any_id', sut.secret))
  })

  it('should return throw when no secret is provided', async () => {
    const sut = new TokenGenerator()
    chai.assert.isRejected(sut.generate('any_id'))
  })

  it('should return throw when no id is provided', async () => {
    const sut = makeSut()
    chai.assert.isRejected(sut.generate())
  })
})
