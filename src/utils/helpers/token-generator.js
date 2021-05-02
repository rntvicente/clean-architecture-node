const jwt = require('jsonwebtoken')

const { MissingParamError } = require('../errors')

module.exports = class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      throw MissingParamError('secret')
    }

    if (!id) {
      throw MissingParamError('id')
    }

    return jwt.sign(id, this.secret)
  }
}
