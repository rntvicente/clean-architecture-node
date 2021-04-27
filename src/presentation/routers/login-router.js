const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { body: { emai, password } } = httpRequest

    if (!emai) {
      return HttpResponse.badRequest('email')
    }

    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}
