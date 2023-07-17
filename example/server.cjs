var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')

const PLATFORM_PORT = 8080
const PROJECT_PORT = 8081

const platformApp = express()
const projectApp = express()

platformApp.use(serveStatic(path.join(__dirname, './platform')))
platformApp.use(serveStatic(path.join(__dirname, '../src')))
platformApp.listen(PLATFORM_PORT)
console.log(`Example platform is running at http://localhost:${PLATFORM_PORT}`)

projectApp.use(serveStatic(path.join(__dirname, './project')))
projectApp.use(serveStatic(path.join(__dirname, '../src')))
projectApp.listen(PROJECT_PORT)
console.log(`Example project is running at http://localhost:${PROJECT_PORT}`)