'use strict'

const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const ObjectId = Mongoose.Types.ObjectId

const Promise = require('bluebird')

const schema = new Schema({
    from: {
        address: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                required: true,
                default: 'Point'
            },
            coordinates: [Number]
        }
    },
    to: {
        address: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                required: true,
                default: 'Point'
            },
            coordinates: [Number]
        }
    }
}, {
    __v: false
})

schema.methods.getPromotions = function () {
    return new Promise(function (resolve, reject) {
        
    })
}

const Ride = Mongoose.model('Ride', schema)


module.exports = {
    Model: Ride,
    Handlers: {

    }
}