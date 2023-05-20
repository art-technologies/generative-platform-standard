const finalhandler = require("finalhandler")
const http = require("http")
const serveStatic = require("serve-static")
const path = require('path')

const PLATFORM_PORT = 8080
const PROJECT_PORT = 8081

const servePlatform = serveStatic(path.join(__dirname, "./platform"))
http.createServer(function onRequest (req, res) {
    servePlatform(req, res, finalhandler(req, res))
}).listen(PLATFORM_PORT)

const serveProject = serveStatic(path.join(__dirname, "./project"))
http.createServer(function onRequest (req, res) {
    serveProject(req, res, finalhandler(req, res))
}).listen(PROJECT_PORT)