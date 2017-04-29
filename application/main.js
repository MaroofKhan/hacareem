'use strict'

const Express = require('express')
const application = Express()

const BodyParser = require('body-parser')
application.use(BodyParser.urlencoded ({ extended: true }))
application.use(BodyParser.json())

const Morgan = require('morgan')
application.use(Morgan('dev'))

// const Cors = require('cors')
// application.use(Cors())

const BlueBird = require('bluebird')
const PORT = process.env.PORT || 3000

require('./utilities/Extensions')

const server = require('http').createServer(application);

const Mongoose = require('mongoose')
Mongoose.set('debug', true)
Mongoose.connect('mongodb://localhost:3001/direem')

Mongoose.connection.on('connected', function () {
    console.log('MongoDB connected!')
    require('./routes')(application)
    require('./sockets').setup(server);
    server.listen(PORT, function () {
        console.log('Server runing @ ' + PORT + '!')
    })
})

Mongoose.connection.on('error', console.error)