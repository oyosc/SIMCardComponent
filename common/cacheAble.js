/**
 * Created by ljw on 2016/5/9.
 */
'use strict';
var _=require('lodash');
var redis = require('./redis');
var log = require('./log').getLogger();
var config = require('../config/config');

/**=====<1.缓存实现开始==========**/
function toCache(time, key, value) {
    if(value){
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
    }
}

function fromCache(key){
    return new Promise(function(resolve){
        var t = new Date();

        redis.get(key, function(err, data) {
            if (!data) {
                return resolve(null);
            }

            data = JSON.parse(data);

            if (config.debug) {
                var duration = new Date() - t;
                log.info('Cache get ' + key + ' ' + duration);
            }
            return resolve(data);
        });
    })
}
function loadAndCacheData(time, key, fn, args) {
    var _cacheData = _.partial(toCache, time, key);
    return new Promise(function (resolve) {
        fn.apply(null, args).then(function(data){
            _cacheData(data);
            return resolve(data);
        }).catch(function(err){
            console.log(err);
        });
    });
}

function getKey(args) {
    if(arguments.length != 0){
        var key = arguments[arguments.length - 1]
    }
    return key;
}

function withCache(time, keyBuilder, fn) {
    var args, key;
    args = Array.prototype.slice.call(arguments, 3);//转化成数组
    key  = keyBuilder.apply(null, args);  // compute cache key
    return new Promise(function(resolve){
        fromCache(key).then(function(datas){
            if (datas) {// cache hit
                console.log('cache hit');
                return resolve(datas);
            }else {// cache missed
                console.log('cache missed');
                return resolve(loadAndCacheData.call(null, time, key, fn, args));
            }
        }).catch(function(err){
            console.log(err);
        })
    })
}

function cacheable(fn, time){
    return  _.partial(withCache, time, getKey, fn);
}
/**=====缓存实现结束==========>**/

/**<=====2.清空缓存实现开始=============**/
function clear(key){
    redis.del(key);
}
function getDelKey(args) {
    var key;
    if(arguments.length != 0){
        key = arguments[0]
    }
    return key;
}
function withClear(keyBuilder, fn) {
    var args = Array.prototype.slice.call(arguments, 2);
    var key  = keyBuilder.apply(null, args);
    clear(key);//先清缓存然后调用具体业务
    return  new Promise(function (resolve) {
        fn.apply(null, args).then(function(data){
            return resolve(data);
        }).catch(function(err){
            console.log(err);
        });
    });
}

function clearable(fn){
    return _.partial(withClear, getDelKey, fn);
}
/**=====清空缓存实现结束=============>**/

module.exports = {
    /**
     * 声明式缓存
     * 使用方式：（前提是fn的最后一个参数是回调函数,回调函数第一个参数是err类似function(err,data1,data2,data3){}）
     * var cache = require('./cacheable');
     * var service  = require('../service/service1');
     * cache.cacheable(service,    'method1',       time);
     * @param m ：module对象
     * @param fn ：要缓存的函数名
     * @param opts   1000
     * key:缓存命名空间，time:过期时间
     */
    cacheable:function(m, fn, time){
        if(!m){
            throw 'm 不能为空';
        }
        if(!fn){
            throw 'fn 不能为空';
        }
        if(!m[fn]){
            throw 'm 不存在fn函数';
        }
        if(!time || isNaN(time)){//默认缓存一小时
            time = 1000 * 60 * 60;
        }

        m[fn] = cacheable(m[fn], time);
    },
    /**
     * 当调用某个方法时自动清空缓存
     * 使用方式：
     * var cache = require('./cacheable');
     * var service  = require('../service/service1');
     * cache.clear(service,    'method1','forum.service.service1');
     * @param m ：module对象
     * @param fn ：函数名
     * @param 缓存命名空间
     */
    clear:function(m, fn){
        if(!m){
            throw 'm 不能为空';
        }
        if(!fn){
            throw 'fn 不能为空';
        }
        if(!m[fn]){
            throw 'm 不存在fn函数';
        }
        m[fn] = clearable(m[fn]);
    }
}
