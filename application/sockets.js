'use strict'

function setup (server) {
    let io = require ('socket.io')(server)
    socket(io)
}

const Promo = require('./models/Promotion').Handlers

function socket (io) {
    io.on('connection', function (client) {
        console.log('CLIENT CONNECTED!')
        client.sent = []
        client.on('location', function (location) {
            console.log(location)
            Promo.promos(location, ['FOOD', 'LIFESTYLE', 'ENTERTAINMENT', 'BEAUTY'], client.sent).then(function (promos) {
                promos.map(function (promo) {
                    client.sent.push(promo.id)
                    console.log(promo)
                    client.emit('promo', promo)
                })
            })
        })
    })
}
module.exports.setup = setup;