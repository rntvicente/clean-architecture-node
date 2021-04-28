const { assert } = require('chai')

class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  it('Should return true when validator returns true', () => {
    const sut = new EmailValidator()

    const isEmailValid = sut.isValid('valid_email@email.com')

    assert.isTrue(isEmailValid)
  })
})
