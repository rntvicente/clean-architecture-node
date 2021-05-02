module.exports = class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    const filter = { _id: userId }
    const set = { $set: { accessToken } }

    await this.userModel.updateOne(filter, set)
  }
}
