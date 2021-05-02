const { MongoMemoryServer } = require('mongodb-memory-server')
const { MongoClient } = require('mongodb')
const { assert } = require('chai')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = this.userModel.findOne({ email })
    return user
  }
}

let con
let db
let mongoServer
const opts = { useNewUrlParser: true, useUnifiedTopology: true }

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail Repository', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()
    con = await MongoClient.connect(mongoUri, opts)

    db = con.db(await mongoServer.getDbName())
  })

  after(async () => {
    if (con) {
      con.close()
    }

    if (mongoServer) {
      await mongoServer.stop()
    }
  })

  afterEach(async () => db.collection('users').deleteMany())

  it('should return null when no user found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@email.com')

    assert.isNull(user)
  })

  it('should return an user when user found', async () => {
    const { userModel, sut } = makeSut()

    await userModel.insertOne({ email: 'valid_email@email.com' })
    const user = await sut.load('valid_email@email.com')

    assert.isOk(user)
    assert.strictEqual(user.email, 'valid_email@email.com')
  })
})
