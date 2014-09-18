var settings = require('../settings');
var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    port     : settings.mySqlPort,
    host     : settings.mySqlHost,
    user     : settings.mySqlUser,
    password : settings.mySqlPWD
});

module.exports = pool;