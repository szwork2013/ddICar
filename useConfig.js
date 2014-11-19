var config = require('./config'),
    config_dev = require('./config_dev');

process.env.NODE_ENV === 'production'
    ? module.exports = config
    : module.exports = config_dev;

