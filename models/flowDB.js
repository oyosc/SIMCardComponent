/**
 * Copyright(C),
 * FileName:  FlowDB.js
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

exports.createFlow = (info) => {
    return knex('Flow').insert(info);
}
if(config.cache){
    cache.clear(exports, 'createFlow', 'FlowDB');
}
exports.updateFlow = (info) =>{
    return  knex('Flow').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateFlow', 'FlowDB');
}


exports.retrieveFlow = (uuid, simCardUUID) =>{
    return knex('Flow').select().whereRaw('uuid=\''+uuid+'\' and simCardUUID=\''+simCardUUID+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveFlow', 'FlowDB', config.cacheTime);
}

exports.getFlow = (uuid) =>{
    return knex('Flow').select().whereRaw('uuid=\''+uuid+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveFlow', 'FlowDB', config.cacheTime);
}

exports.queryFlows = (queryStr, offset, limit, orderBy, retRaw) => {
    if(orderBy){
        if(retRaw){
            return knex('Flow').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);

        }else{
            return knex('Flow').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    }else{
        if(retRaw) {
            return knex('Flow').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);
        }else{
            return knex('Flow').select().whereRaw(queryStr).offset(offset).limit(limit);
        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryFlows', 'FlowDB', config.cacheTime);
}

exports.getCount = (queryStr) => {
    return knex('Flow')
        .whereRaw(queryStr)
        .count('uuid as count');
}
exports.getMonthFlows = (isTime, queryStr) => {
    if(isTime){
        return knex('Flow')
            .whereRaw(queryStr)
            .sum('total as sum');
    }else{
        var str=' DATE_FORMAT( createAt, \'%Y%m\'  ) = DATE_FORMAT( CURDATE( ) , \'%Y%m\' )';
        if(queryStr){
            queryStr +=' and '+ str;
        }else{
            queryStr =str;
        }
        return knex('Flow')
            .whereRaw( queryStr)
            .sum('total as sum');
    }
}
if(config.cache){
    cache.cacheable(exports, 'getCount', 'FlowDB', config.cacheTime);
}

exports.delFlow = (uuid,  key, value) =>{
    return knex('Flow').update(key, value).where('uuid', uuid)
}
if(config.cache){
    cache.clear(exports, 'delFlow', 'FlowDB');
}

exports.queryBy = (retRaw, queryStr) =>{
    return  knex('Flow')
        .select(retRaw)
        .whereRaw(queryStr)
        .then(function (rows) {
            return rows;
        });
}
