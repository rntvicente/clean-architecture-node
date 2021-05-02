const { MongoMemoryServer } = require('mongodb-memory-server')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const MongoHelper = require('../../../src/infra/helpers/mongo')
const LoadUserByEmailRepository = require('../../../src/infra/repositories/load-user-by-email-repository')

let mongoServer
let database
chai.use(chaiAsPromised)

const makeSut = () => {
  const userModel = database.getCollection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail Repository', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri(true)
    const databaseName = await mongoServer.getDbName()

    database = new MongoHelper()
    await database.connect(mongoUri, databaseName)
  })

  after(async () => {
    await database.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await database.getCollection('users').deleteMany()
  })

  it('should return null when no user found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@email.com')

    chai.assert.isNull(user)
  })

  it('should return an user when user found', async () => {
    const { userModel, sut } = makeSut()

    const { ops: [fakeUser] } = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 50,
      password: 'hashed_password',
      state: 'any_state'
    })

    const user = await sut.load('valid_email@email.com')

    chai.assert.isOk(user)
    chai.assert.deepEqual(user, fakeUser)
  })

  it('should return throw when no usermodel is provided', async () => {
    const sut = new LoadUserByEmailRepository()

    chai.assert.isRejected(sut.load('any_email@email.com'))
  })

  it('should return throw when no email is provided', async () => {
    const { sut } = makeSut()

    chai.assert.isRejected(sut.load())
  })
})
