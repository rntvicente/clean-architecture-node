const express = require('express')

const defineConfig = require('./setup')

const app = express()

defineConfig(app)

module.exports = app
