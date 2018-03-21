const path = require('path')

const envName = process.env.BUILD_ENV || 'browser'
const envPath = path.resolve(`src/env/${envName}`)

module.exports = require(envPath)
