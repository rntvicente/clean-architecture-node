const { assert } = require('chai')
const { MongoMemoryServer } = require('mongodb-memory-server')

const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

describe('MongoDb Helper', () => {
  it('should reconnect when getCollection() is involked and client is disconnected', async () => {
    const mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri('mocha')
    const databaseName = await mongoServer.getDbName()
    const sut = new MongoHelper()

    await sut.connect(mongoUri, databaseName)
    assert.isOk(sut.db)

    await sut.disconnect()
    assert.isNotOk(sut.db)

    await sut.getCollection('collection')
    assert.isOk(sut.db)
  })
})
