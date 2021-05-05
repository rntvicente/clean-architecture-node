const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const UpdateAccessTokenRepository = require('../../infra/repositories/load-user-by-email-repository')
const AuthUsecase = require('../../domain/usescases/auth-usecase')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoginRouter = require('../../presentation/routers/login-router')
const env = require('../config/env')

const loadUserByEmailRepository = new LoadUserByEmailRepository()
const encrypter = new Encrypter()
const tokenGenerator = new TokenGenerator(env.TOKEN_SECRET)
const updateAccessTokenRepository = new UpdateAccessTokenRepository()
const authUsecase = new AuthUsecase({
  loadUserByEmailRepository,
  encrypter,
  tokenGenerator,
  updateAccessTokenRepository
})

const emailValidator = new EmailValidator()

const loginRouter = new LoginRouter(authUsecase, emailValidator)

module.exports = loginRouter
