const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) {
      throw MissingParamError('email')
    }

    const userModel = await MongoHelper.getCollection('users')

    const user = await userModel.findOne({ email })
    return user
  }
}
