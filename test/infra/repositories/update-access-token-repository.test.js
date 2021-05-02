const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { MongoMemoryServer } = require('mongodb-memory-server')

const UserFixture = require('../../commons/fixture/users-fixture')
const MongoHelper = require('../../../src/infra/helpers/mongo-helper')
const UpdateAccessTokenRepository = require('../../../src/infra/repositories/update-access-token-repository')

let database
let mongoServer
chai.use(chaiAsPromised)

const makeSut = async () => {
  const userModel = await database.getCollection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    userModel,
    sut
  }
}

describe('UpdateAccessToken Repository', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri('mocha')
    const databaseName = await mongoServer.getDbName()

    database = new MongoHelper()
    await database.connect(mongoUri, databaseName)
  })

  after(async () => {
    await database.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    const collection = await database.getCollection('users')
    collection.deleteMany()
  })

  it('should update the user with the given accessToken', async () => {
    const { sut, userModel } = await makeSut()
    const { ops: [fakeUser] } = await userModel.insertOne(UserFixture)

    await sut.update(fakeUser._id, 'valid_token')
    const user = await userModel.findOne({ _id: fakeUser._id })

    chai.assert.strictEqual(user.accessToken, 'valid_token')
  })

  it('should return throw when no usermodel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()

    chai.assert.isRejected(sut.update('valid_id', 'access_token'))
  })

  it('should return throw when no params are provided', async () => {
    const { sut, userModel } = await makeSut()
    const { ops: [fakeUser] } = await userModel.insertOne(UserFixture)

    chai.assert.isRejected(sut.update())
    chai.assert.isRejected(sut.update(fakeUser._id))
  })
})
