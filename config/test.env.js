'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  GOOGLE_CLIENT_ID: '"678965545492-j3av4n43usb1e67gsd8odkt2oge21e34.apps.googleusercontent.com"'
})
