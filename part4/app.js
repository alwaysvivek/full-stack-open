const express = require('express')
const server = express()
const cors = require('cors')
const mongoose = require('mongoose')
const postsRouter = require('./controllers/posts')
const accountsRouter = require('./controllers/accounts')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('Connecting to MongoDB at', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

server.use(cors())
server.use(express.json())
server.use(middleware.requestLogger)
server.use(middleware.tokenExtractor)

server.use('/api/blogs', postsRouter)
server.use('/api/users', accountsRouter)
server.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  server.use('/api/testing', testingRouter)
}

server.use(middleware.unknownEndpoint)
server.use(middleware.errorHandler)

module.exports = server
