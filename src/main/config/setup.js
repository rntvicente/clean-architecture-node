const helmet = require('helmet')
const { cors, jsonParser } = require('../middlewares')

module.exports = (app) => {
  app.use(helmet())
  app.use(cors)
  app.use(jsonParser())
}
