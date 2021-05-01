const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const { MissingParamError } = require('../../../src/utils/errors')
chai.use(chaiAsPromised)

class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

describe('Auth Usecase', () => {
  it('should return throws when no email is provided', async () => {
    const sut = new AuthUseCase()

    return chai.assert.isRejected(sut.auth())
  })
})
