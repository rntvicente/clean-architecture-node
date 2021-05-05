const { MongoMemoryServer } = require('mongodb-memory-server')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const MongoHelper = require('../../../src/infra/helpers/mongo-helper')
const LoadUserByEmailRepository = require('../../../src/infra/repositories/load-user-by-email-repository')
const UserFixture = require('../../commons/fixture/users-fixture')

let mongoServer
chai.use(chaiAsPromised)

const makeSut = async () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri('mocha')
    const databaseName = await mongoServer.getDbName()

    await MongoHelper.connect(mongoUri, databaseName)
  })

  after(async () => {
    await MongoHelper.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    const userModel = await MongoHelper.getCollection('users')
    userModel.deleteMany()
  })

  it('should return null when no user found', async () => {
    const sut = await makeSut()
    const user = await sut.load('invalid_email@email.com')

    chai.assert.isNull(user)
  })

  it('should return an user when user found', async () => {
    const sut = await makeSut()
    const userModel = await MongoHelper.getCollection('users')

    const { ops: [fakeUser] } = await userModel.insertOne(UserFixture)

    const user = await sut.load('valid_email@email.com')

    chai.assert.isOk(user)
    chai.assert.deepEqual(user, fakeUser)
  })

  it('should return throw when no email is provided', async () => {
    const sut = await makeSut()
    chai.assert.isRejected(sut.load())
  })
})
