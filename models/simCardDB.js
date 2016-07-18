/**
 * Copyright(C),
 * FileName:  simCardDB.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/26  14:30
 * Description:
 */

"use strict";
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');
var log = require("../common/log").getLogger();

exports.createSIMCard = (info) => {
    return knex('SIMCard').insert(info);
}
if(config.cache){
    cache.clear(exports, 'createSIMCard', 'simCardDB');
}
exports.updateSIMCard = (info) =>{
    return  knex('SIMCard').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateSIMCard', 'simCardDB');
}


exports.retrieveSIMCard = (uuid, directoryUUID) =>{
    return knex('SIMCard').select().whereRaw('uuid=\''+uuid+'\' and directoryUUID=\''+directoryUUID+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveSIMCard', 'simCardDB', config.cacheTime);
}

exports.getSIMCard = (uuid) =>{
    return knex('SIMCard').select().whereRaw('uuid=\''+uuid+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveSIMCard', 'simCardDB', config.cacheTime);
}

exports.querySIMCards = (queryStr, offset, limit, orderBy, retRaw) => {
    if(orderBy){
        if(retRaw){
            return knex('SIMCard').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);

        }else{
            return knex('SIMCard').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    }else{
        if(retRaw) {
            return knex('SIMCard').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);
        }else{
            return knex('SIMCard').select().whereRaw(queryStr).offset(offset).limit(limit);
        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'querySIMCards', 'simCardDB', config.cacheTime);
}

exports.getCount = (queryStr) => {
    return knex('SIMCard')
        .whereRaw(queryStr)
        .count('uuid as count');
}
if(config.cache){
    cache.cacheable(exports, 'getCount', 'simCardDB', config.cacheTime);
}

exports.delSIMCard = (uuid,  key, value) =>{
    return knex('SIMCard').update(key, value).where('uuid', uuid)
}
if(config.cache){
    cache.clear(exports, 'delSIMCard', 'simCardDB');
}

exports.queryBy = (retRaw, queryStr) =>{
    return  knex('SIMCard')
        .select(retRaw)
        .whereRaw(queryStr)
        .then(function (rows) {
            return rows;
        });
}

exports.getSIMCardByTenant = (directoryUUID) =>{
    return knex('SIMCard').select().where('directoryUUID', directoryUUID);
}
if(config.cache){
    cache.cacheable(exports, 'getSIMCardByTenant', 'simCardDB', config.cacheTime);
}