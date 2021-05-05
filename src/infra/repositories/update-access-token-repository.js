const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId) {
      throw MissingParamError('userId')
    }

    if (!accessToken) {
      throw MissingParamError('accessToken')
    }

    const userModel = await MongoHelper.getCollection('users')
    const filter = { _id: userId }
    const set = { $set: { accessToken } }

    userModel.updateOne(filter, set)
  }
}
