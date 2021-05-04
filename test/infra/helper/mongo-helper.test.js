const { assert } = require('chai')
const { MongoMemoryServer } = require('mongodb-memory-server')

const MongoHelper = require('../../../src/infra/helpers/mongo-helper')
const env = require('../../../src/main/config/env')

describe('MongoDb Helper', () => {
  it('should reconnect when getCollection() is involked and client is disconnected', async () => {
    const mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri(env.DATABASE_NAME)
    const sut = new MongoHelper()

    console.log('mongoUri ', mongoUri)

    await sut.connect(mongoUri)
    assert.isOk(sut.db)

    await sut.disconnect()
    assert.isNotOk(sut.db)

    await sut.getCollection('collection')
    assert.isOk(sut.db)

    await sut.disconnect()
  })
})
