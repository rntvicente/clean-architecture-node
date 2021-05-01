const bcrypt = require('bcrypt')
const sinon = require('sinon')
const { assert } = require('chai')
class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

const makeSut = () => {
  return new Encrypter()
}

const sandbox = sinon.createSandbox()

describe('Encrypter', () => {
  afterEach(() => sandbox.restore())

  it('should return true when bcrypt return true', async () => {
    const sut = makeSut()
    sandbox.stub(bcrypt, 'compare').returns(true)
    const isValid = await sut.compare('any_value', 'hashed_value')

    assert.strictEqual(isValid, true)
  })

  it('should return false when bcrypt return false', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'hashed_value')

    assert.strictEqual(isValid, false)
  })

  it('should call bcrypt with correct values', async () => {
    const compareSpy = sandbox.spy(bcrypt, 'compare')
    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')

    assert.isTrue(compareSpy.calledOnceWith('any_value', 'hashed_value'))
  })
})
