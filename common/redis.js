/**
 * Copyright(C),
 * FileName:  redis.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/30  10:27
 * Description:
 */

"use strict";
var config = require('../config/config');
var Redis = require('ioredis');

var client = new Redis({
    host : config.redis_host,
    port : config.redis_port,
    db : config.redis_db,
    password : config.redis_password
});

client.on('error', function(err) {
    console.log(err);
});

exports = module.exports = client;