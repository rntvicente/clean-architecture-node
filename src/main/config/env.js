module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/clean-architecture-node',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret'
}
