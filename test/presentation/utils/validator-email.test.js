const { assert } = require('chai')
const validator = require('validator')
const sinon = require('sinon')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const sandbox = sinon.createSandbox()

describe('Email Validator', () => {
  it('Should return true when validator returns true', () => {
    const sut = new EmailValidator()

    const isEmailValid = sut.isValid('valid_email@email.com')

    assert.isTrue(isEmailValid)
  })

  it('Should return false when validator returns false', () => {
    sandbox.stub(validator, 'isEmail').returns(false)
    const sut = new EmailValidator()

    const isEmailValid = sut.isValid('invalid_email@email.com')

    assert.isFalse(isEmailValid)
  })
})
