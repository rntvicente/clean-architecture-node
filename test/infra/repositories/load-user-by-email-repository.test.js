const { MongoMemoryServer } = require('mongodb-memory-server')
const { assert } = require('chai')

const MongoHelper = require('../../../src/infra/helpers/mongo')
const LoadUserByEmailRepository = require('../../../src/infra/repositories/load-user-by-email-repository')

let mongoServer
let database

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

    assert.isNull(user)
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

    assert.isOk(user)
    assert.deepEqual(user, fakeUser)
  })
})
