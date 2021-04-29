const { assert } = require('chai')
const sinon = require('sinon')
const validator = require('validator')

const EmailValidator = require('../../../src/utils/email-validator')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  const sandbox = sinon.createSandbox()

  afterEach(() => sandbox.restore())

  it('Should return true when validator returns true', () => {
    const sut = makeSut()

    const isEmailValid = sut.isValid('valid_email@email.com')

    assert.isTrue(isEmailValid)
  })

  it('Should return false when validator returns false', () => {
    sandbox.stub(validator, 'isEmail').returns(false)
    const sut = makeSut()

    const isEmailValid = sut.isValid('invalid_email@email.com')

    assert.isFalse(isEmailValid)
  })

  it('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = sandbox.spy(validator, 'isEmail')

    sut.isValid('any_email@email.com')
    assert.isTrue(isEmailSpy.calledOnceWith('any_email@email.com'))
  })
})
