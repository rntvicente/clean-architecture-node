const express = require('express')

const defineConfig = require('./setup')
const defineRoutes = require('./routes')

const app = express()

defineConfig(app)
defineRoutes(app)

module.exports = app
