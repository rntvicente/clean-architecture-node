const jwt = require('jsonwebtoken')

module.exports = class TokenGenerator {
  async generate (id) {
    this.id = id
    return jwt.sign(id, 'secret')
  }
}
