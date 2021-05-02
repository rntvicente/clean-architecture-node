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
    this.db = null
  }

  getCollection (name) {
    return this.db.collection(name)
  }
}
