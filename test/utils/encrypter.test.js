const bcrypt = require('bcrypt')
const sinon = require('sinon')
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')

const Encrypter = require('../../src/utils/helpers/encrypter')

const makeSut = () => {
  return new Encrypter()
}

const sandbox = sinon.createSandbox()
chai.use(chaiAsPromised)

describe('Encrypter', () => {
  afterEach(() => sandbox.restore())

  it('should return true when bcrypt return true', async () => {
    const sut = makeSut()
    sandbox.stub(bcrypt, 'compare').returns(true)
    const isValid = await sut.compare('any_value', 'hashed_value')

    chai.assert.strictEqual(isValid, true)
  })

  it('should return false when bcrypt return false', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'hashed_value')

    chai.assert.strictEqual(isValid, false)
  })

  it('should call bcrypt with correct values', async () => {
    const compareSpy = sandbox.spy(bcrypt, 'compare')
    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')

    chai.assert.isTrue(compareSpy.calledOnceWith('any_value', 'hashed_value'))
  })

  it('should throw when no params are provided', async () => {
    const sut = makeSut()
    chai.assert.isRejected(sut.compare())
    chai.assert.isRejected(sut.compare('any_value'))
  })
})
