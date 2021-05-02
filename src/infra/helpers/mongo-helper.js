const { MongoClient } = require('mongodb')

module.exports = class MongoDb {
  async connect (mongoUri, databaseName) {
    this.mongoUri = mongoUri
    this.databaseName = databaseName
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    this.client = await MongoClient.connect(mongoUri, opts)
    this.db = this.client.db(databaseName)
  }

  async disconnect () {
    this.client.close()
    this.client = null
    this.db = null
  }

  async getCollection (name) {
    if (!this.client?.isConnected()) {
      await this.connect(this.mongoUri, this.databaseName)
    }

    const collection = await this.db.collection(name)
    return collection
  }
}
