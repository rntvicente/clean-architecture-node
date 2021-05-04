const helmet = require('helmet')
const { cors, jsonParser, contentType } = require('../middlewares')

module.exports = (app) => {
  app.use(helmet())
  app.use(cors)
  app.use(jsonParser())
  app.use(contentType)
}
