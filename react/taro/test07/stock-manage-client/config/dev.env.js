'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const testEnv = require('./test.env')


module.exports = merge(testEnv, prodEnv, {
    NODE_ENV: '"development"',
    API_HOST: '"http://192.168.16.3:8081"',
    API_IMG: '"http://192.168.16.103:9999/"',
    PORT: '9898',
    HOST: '192.168.21.94'
})