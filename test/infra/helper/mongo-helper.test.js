const { assert } = require('chai')
const { MongoMemoryServer } = require('mongodb-memory-server')

const sut = require('../../../src/infra/helpers/mongo-helper')

describe('MongoDb Helper', () => {
  before(async () => {
    const mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri('mocha')
    const databaseName = await mongoServer.getDbName()

    await sut.connect(mongoUri, databaseName)
  })

  after(async () => {
    await sut.disconnect()
  })

  it('should reconnect when getCollection() is involked and client is disconnected', async () => {
    assert.isOk(sut.db)

    await sut.disconnect()
    assert.isNotOk(sut.db)

    await sut.getCollection('collection')
    assert.isOk(sut.db)
  })
})
