const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { MongoMemoryServer } = require('mongodb-memory-server')

const UserFixture = require('../../commons/fixture/users-fixture')
const MongoHelper = require('../../../src/infra/helpers/mongo-helper')
const UpdateAccessTokenRepository = require('../../../src/infra/repositories/update-access-token-repository')

let mongoServer
chai.use(chaiAsPromised)

const makeSut = async () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessToken Repository', () => {
  let fakeUserId

  before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri('mocha')

    await MongoHelper.connect(mongoUri)
  })

  after(async () => {
    await MongoHelper.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    const userModel = await MongoHelper.getCollection('users')
    const { ops: [fakeUser] } = await userModel.insertOne(UserFixture)
    fakeUserId = fakeUser._id
  })

  afterEach(async () => {
    const userModel = await MongoHelper.getCollection('users')
    userModel.deleteMany()
  })

  it('should update the user with the given accessToken', async () => {
    const sut = await makeSut()
    const userModel = await MongoHelper.getCollection('users')
    await sut.update(fakeUserId, 'valid_token')

    const user = await userModel.findOne({ _id: fakeUserId })
    chai.assert.strictEqual(user.accessToken, 'valid_token')
  })

  it('should return throw when no params are provided', async () => {
    const sut = await makeSut()

    chai.assert.isRejected(sut.update())
    chai.assert.isRejected(sut.update(fakeUserId))
  })
})
