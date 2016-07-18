/**
 * Copyright(C),
 * FileName:  cache.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/30  10:10
 * Description:
 */

"use strict";
var redis = require('./redis');
var log = require('./log').getLogger();
var config = require('../config/config');

var get = function(key, callback) {
    var t = new Date();

    redis.get(key, function(err, data) {
        if (err) {
            return callback(err);
        }
        if (!data) {
            return callback(null, null);
        }

        data = JSON.parse(data);

        if (config.debug) {
            var duration = new Date() - t;
            log.info('Cache get ' + key + ' ' + duration);
        }

        callback(null, data);
    });
}

exports.get = get;

//value为JSON格式数据
//time参数可选，秒为单位
var set = function(key, value, time) {
    var t = new Date();

    value = JSON.stringify(value);

    redis.set(key, value);
    if (time) {
        redis.expire(key, time);
    }

    if (config.debug) {
        var duration = new Date() - t;
        log.info('Cache set ' + key + ' ' + duration);
    }
};

exports.set = set;

var del = function(key) {
    redis.del(key);
};

exports.del = del;