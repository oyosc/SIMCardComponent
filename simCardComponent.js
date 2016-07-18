/**
 * Created by Administrator on 2016/5/12.
 */

"use strict";
var app = require('./app');
var debug = require('debug')('SIMCardComponent:server');
var http = require('http');

var config = require('./config/config');
var https = require('https');
var fs = require('fs');

var privateKey  = fs.readFileSync('./ssl/privatekey.pem', 'utf8');
var certificate = fs.readFileSync('./ssl/certificate.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

if (process.version < config.node_low_version) {
    console.log("node version is too low!");
    process.exit(1);
}
if (process.version > config.node_high_version) {
    console.log("node version is too high!");
    process.exit(1);
}

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(config.server_port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = null;
if(config.is_https){
    server = https.createServer(credentials, app);
}else{
    server = http.createServer(app);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
console.log("SIMCardComponent https server listen port " + port);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}