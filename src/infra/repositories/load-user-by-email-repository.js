const { MissingParamError } = require('../../utils/errors')

module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!email) {
      throw MissingParamError('email')
    }
    const user = this.userModel.findOne({ email })
    return user
  }
}
