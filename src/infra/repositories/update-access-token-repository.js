const { MissingParamError } = require('../../utils/errors')
module.exports = class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw MissingParamError('userId')
    }

    if (!accessToken) {
      throw MissingParamError('accessToken')
    }

    const filter = { _id: userId }
    const set = { $set: { accessToken } }

    await this.userModel.updateOne(filter, set)
  }
}
