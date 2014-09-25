/**
 * Created by amberglasses on 14-9-19.
 */
var settings = require('../settings');
var request = require('request');

exports.getToken = function (req, res, next) {
    if (req.session.access_token) {
        next();
    }

    request(
        { method: 'POST',
            uri: settings.hxURI + '/token',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"grant_type": "client_credentials", "client_id": "YXA6feANIDc0EeSaK6PzQWBvmA", "client_secret": "YXA6LijimVeXvLvRAghrCAv8zIm9EUw"})
        }
        , function (error, response, body) {
            req.session.access_token = JSON.parse(body).access_token;
            next();
        }
    );
};