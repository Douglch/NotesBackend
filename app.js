// Dictates default port and URI
const config = require('./utils/config')
// Importing express as express
const express = require('express')
const app = express()
// refactor the code to eliminate catch from try-catch methods
require('express-async-errors')
// Allows cross server and data references
const cors = require('cors')
// Controller import
const notesRouter = require('./controllers/note')
const usersRouter = require('./controllers/users')
// Custom error handler
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(cors())
// Frontend production build import
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app