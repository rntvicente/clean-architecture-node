const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('../main/config/env')

const mongodb = new MongoHelper()

mongodb.connect(env.MONGO_URI, env.DATABASE_NAME)
  .then(() => {
    const app = require('./config/app')
    console.log('-> MongoDB connect')
    app.listen(3000, () => console.log('-> Server Express routing port 3000'))
  })
  .catch(console.error)
  .finally(() => mongodb.disconnect)
