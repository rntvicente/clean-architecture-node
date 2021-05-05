const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('../main/config/env')

MongoHelper.connect(env.MONGO_URI)
  .then(() => {
    const app = require('./config/app')
    console.log('-> MongoDB connect')
    app.listen(3000, () => console.log('-> Server Express routing port 3000'))
  })
  .catch(console.error)
  .finally(() => MongoHelper.disconnect)
