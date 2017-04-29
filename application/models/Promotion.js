'use strict'


const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const ObjectId = Mongoose.Types.ObjectId

const Promise = require('bluebird')

const schema = new Schema({
    category: {
        type: String,
        required: true,
        enum: ['BOGO', 'PERCENT']
    },
    offer: {
        percent: {
            value: {
                type: Number,
                required: false
            },
            item: {
                type: String,
                required: false
            }
        },
        bogo: {
            item: {
                type: String,
                required: false
            }
        }
    },
    brand: {
        category: {
            type: String,
            required: true,
            enum: ['FOOD', 'LIFESTYLE', 'ENTERTAINMENT', 'BEAUTY']
        },
        title: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        },
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
schema.index({ 'brand.location': '2dsphere' })

schema.pre('save', function (next) {
    Promo.ensureIndexes()
    next()
})

schema.virtual('discount').get(function () {
    switch(this.category) {
        case 'BOGO':
            return 'Buy 1 ' + this.offer.bogo.item + ' get 1 ' + this.offer.bogo.item + ' free!'
            break
        case 'PERCENT':
            return 'Upto ' + this.offer.percent.value + '% off on ' + this.offer.percent.item + '!'
            break
    }
})

schema.virtual('promotion').get(function () {
    return {
        id: this.id,
        discount: this.discount,
        brand: {
            title: this.brand.title,
            logo: this.brand.logo,
            location: {
                latitude: this.brand.location.coordinates[1],
                longitude: this.brand.location.coordinates[0]
            }
        }
    }
})

const Promo = Mongoose.model('Promo', schema)

// function add () {
//     let promo = {
//         category: 'BOGO',
//         offer: {
//             // percent: {
//             //     value: 30,
//             //     item: 'casual wear'
//             // }
//             bogo: {
//                 item: 'Nepali Thali'
//             }
//         },
//         brand: {
//             category: 'FOOD',
//             title: 'ChaChaJee',
//             logo: 'https://pbs.twimg.com/profile_images/726518318929199106/n9FvGU5P.jpg',
//             address: 'Dolmen Mall - Food Court',
//             location: {
//                 coordinates: [24.8767702, 67.0624586]
//             }
//         }
//     }

//     new Promo(promo).save()
// }

function promos (location, interests, excluded) {
    return new Promise(function (resolve, reject) {
        let center = {
            type: 'Point',
            coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)]
        }
        let options = {
            spherical: true,
            maxDistance: 1000,
            minDistance: 0,
            num: 3,
            query: {
                _id: {
                    $nin: excluded
                },
                'brand.category': {
                    $in: interests
                }
            }
        }
        Promo.geoNear(center, options, function (error, results, statistics) {
            if (error) {
                reject(error)
            } else {
                let promos = results.map(function (result) {
                    let promotion = result.obj.promotion;
                    promotion ["distance"] = result.dis
                    return promotion
                })
                resolve(promos)
            }
        })
    })
} 

module.exports = {
    Model: Promo,
    Handlers: {
        promos: promos
        // add: add
    }
}