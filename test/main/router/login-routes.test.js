const request = require('supertest')
const bcrypt = require('bcrypt')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../../../src/main/config/app')
const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

let mongoServer

describe('Login Routes ', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri('mocha')

    await MongoHelper.connect(mongoUri)
  })

  after(async () => {
    await MongoHelper.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    const userModel = await MongoHelper.getCollection('users')
    userModel.deleteMany()
  })

  it('should return 200 when valoid credentials provided', async () => {
    const hashToken = bcrypt.hashSync('secret', 10)

    const userModel = await MongoHelper.getCollection('users')
    const { ops: [fakeUser] } = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: hashToken
    })

    await request(app)
      .post('/api/login')
      .send({
        email: fakeUser.email,
        password: 'secret'
      })
      .expect(200)
  })

  it('should return 401 when valoid credentials provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'any_email@email.com',
        password: 'hashed_password'
      })
      .expect(401)
  })
})
