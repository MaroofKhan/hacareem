
'use strict'

var Express = require ('express');
var Path = require('path');

var routes = function (application) {
    // application.post('/', function (request, response) {
    //     require('./models/Promotion').Handlers.add()
    // })
    application.use (function (request, response, next) {
        //404 goes here!
        response.status(404).send('Not found!');
    });

    
}

module.exports = routes;