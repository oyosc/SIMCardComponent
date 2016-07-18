/**
 * Copyright(C),
 * FileName:  common.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/25  13:56
 * Description:
 */
"use strict";
//var fs = require('fs');
var config = require('../config/config');
var common = require('../controllers/common');

exports.options = {
    host: config.server_domain,
    port: config.server_port,
    path: '/'+common.VERSION100+'/',
    method: 'POST',
    auth : 'mGldhwkSw8MtDFLhbk1i4Q:mGldhwkSw8MtDFLhbk1i4Q',
    //key: fs.readFileSync(__dirname+'/clientSSLkey/client-key.pem'),
    //cert: fs.readFileSync(__dirname+'/clientSSLkey/client-cert.pem'),
    rejectUnauthorized:false,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
};

//exports.requestLog = function(tastName, options, bodyDataJSON){
    //console.log('\r\n');
    //console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    //console.log('Tast: "'+ tastName + '" Request: ');
    //var requestHeaders = 'host: ' + options.host + '\r\n';
    //requestHeaders += 'port: ' + options.port + '\r\n';
    //requestHeaders += 'method: ' + options.method + '\r\n';
    //requestHeaders += 'path: ' + options.path + '\r\n';
    //requestHeaders += 'Content-Type: ' + options.headers['Content-Type'];
    //console.log(requestHeaders);
    //console.log('body:');
    //console.log(JSON.stringify(bodyDataJSON));
    //console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//};

exports.clientCallback = function(tastName, res, done, checkCallback){
    //console.log('instance-id: '+ res.headers['instance-id']);
    res.setEncoding('utf8');
    //console.log('---------------------------------------------');
    //console.log('Tast: "'+ tastName + '" Response:');
    var headers = 'HTTP' + res.httpVersion +' '+ res.statusCode+' '+res.statusMessage + '\r\n';
    headers += 'Connection: '+res.headers['connection'] +'\r\n';
    headers += 'Content-Length: '+res.headers['content-length'] +'\r\n';
    headers += 'Content-Type: '+res.headers['content-type'] + '\r\n';
    headers += 'Date: '+res.headers.date;
    //console.log(headers);

    var data = '';
    var count = 0;
    res.on('data', function (chunk) {
        data += chunk;
        count++;
    });
    res.on('end', function(){
        //console.log('body:');
        //console.log(data);

        if(data.length> 0){
            var dataJson = {};
            try{
                dataJson = JSON.parse(data)
            }catch(err){

            }
            checkCallback(dataJson);
        }else{
            checkCallback(data);
        }
        //console.log('---------------------------------------------');
        done();
    });
};

exports.clientCallback1 = function(tastName, res, checkCallback){
    //console.log('instance-id: '+ res.headers['instance-id']);
    res.setEncoding('utf8');
    //console.log('---------------------------------------------');
    //console.log('Tast: "'+ tastName + '" Response:');
    var headers = 'HTTP' + res.httpVersion +' '+ res.statusCode+' '+res.statusMessage + '\r\n';
    headers += 'Connection: '+res.headers['connection'] +'\r\n';
    headers += 'Content-Length: '+res.headers['content-length'] +'\r\n';
    headers += 'Content-Type: '+res.headers['content-type'] + '\r\n';
    headers += 'Date: '+res.headers.date;
    //console.log(headers);

    var data = '';
    var count = 0;
    res.on('data', function (chunk) {
        data += chunk;
        count++;
    });
    res.on('end', function(){
        //console.log('body:');
        //console.log(data);

        if(data.length> 0){
            var dataJson = {};
            try{
                dataJson = JSON.parse(data)
            }catch(err){

            }
            checkCallback(dataJson);
        }else{
            checkCallback(data);
        }
    });
};

//var http = require('http');
//var https = require('https');

var httpServer = null;
if(config.is_https){
    httpServer = require('https');
}else{
    httpServer = require('http');
}

exports.request = httpServer.request;
