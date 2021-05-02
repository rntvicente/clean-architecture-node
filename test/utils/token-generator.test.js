const jwt = require('jsonwebtoken')
const sinon = require('sinon')
const { assert } = require('chai')

const Encrypter = require('../../src/utils/helpers/token-generator')

const makeSut = () => {
  return new Encrypter()
}

const sandbox = sinon.createSandbox()

describe('Token Generator', () => {
  afterEach(() => sandbox.restore())

  it('should return null when JWT returns null', async () => {
    sandbox.stub(jwt, 'sign').returns(null)

    const sut = makeSut()
    const token = await sut.generate('any_id')

    assert.isNull(token)
  })

  it('should return a token when JWT returns token', async () => {
    sandbox.stub(jwt, 'sign').returns('valid_token')

    const sut = makeSut()
    const isValid = await sut.generate('any_id')

    assert.strictEqual(isValid, 'valid_token')
  })
})
