'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GOOGLE_CLIENT_ID: '"678965545492-j3av4n43usb1e67gsd8odkt2oge21e34.apps.googleusercontent.com"'
})
