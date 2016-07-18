/**
 * Copyright(C),
 * FileName:  config.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/30  10:32
 * Description:
 */
"use strict";
var config = {
    //程序支持NODE的最低版本
    node_low_version : 'v6.2.2',
    //程序支持NODE的最高版本
    node_high_version : 'v7.0.0',
    //是否发送消息
    is_sendMessage : false,

    //debug 为true时，用于本地调试
    debug : true,
    //接口统计开关
    record : false,
    //缓存开关控制
    cache : false,
    //缓存失效时间
    cacheTime : 1000,
    //服务器配置
    server_domain : 'localhost',
    server_port : 3013,

    //http配置
    is_https : false,

    //knex配置
    knex_client : 'mysql',
    knex_connection : {
        host : '192.168.6.222',
        user : 'reader',
        password : '123456',
        database : 'SIMCardComponent',
        port : 3306
    },
    knex_pool : {
        min : 0,
        max : 7
    },

    //redis配置
    redis_host : '192.168.6.17',
    redis_port : 6379,
    redis_db : 1,
    redis_password : '123456',

    //kafka
    kafkaConfig: {
        host: '192.168.6.16',
        port: '2181'
    }
};

if (process.env.server_port) {
    config.server_port = process.env.server_port;
}
if (process.env.server_domain) {
    config.server_domain = process.env.server_domain;
}
if (process.env.knex_client) {
    config.knex_client = process.env.knex_client;
}
if (process.env.knex_host) {
    config.knex_connection.host = process.env.knex_host;
}
if (process.env.knex_port) {
    config.knex_connection.port = process.env.knex_port;
}
if (process.env.knex_user) {
    config.knex_connection.user = process.env.knex_user;
}
if (process.env.knex_password) {
    config.knex_connection.password = process.env.knex_password;
}
if (process.env.knex_database) {
    config.knex_connection.database = process.env.knex_database;
}
if (process.env.knex_pool_min) {
    config.knex_pool.min = process.env.knex_pool_min;
}
if (process.env.knex_pool_max) {
    config.knex_pool.max = process.env.knex_pool_max;
}

module.exports = config;