/**
 * Copyright(C),
 * FileName:  directoryDB.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/26  14:40
 * Description:
 */
"use strict";
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createDirectories = function(info){
    return knex('Directory').insert(info).then(function (rows) {
        return rows;
    });
};
if(config.cache){
    cache.clear(exports, 'createDirectories', 'directoryDB');
}

exports.delDirectory = function(uuid, key, value){
    return knex('Directory').update(key, value).where('uuid', uuid);
};
if(config.cache){
    cache.clear(exports, 'delDirectory', 'directoryDB');
}

exports.retrieveDirectory = function(uuid, tenantUUID){
    return knex('Directory').select().whereRaw('uuid=\'' + uuid + '\' and tenantUUID=\'' + tenantUUID + '\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveDirectory', 'directoryDB', config.cacheTime);
}

exports.updateDirectories = function(info){
    return knex('Directory').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateDirectories', 'directoryDB');
}

exports.queryDirectory = function(queryStr, offset, limit, orderBy, retRaw){
    if(orderBy){
        if(retRaw) {
            return knex('Directory').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        } else{
            return knex('Directory').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    } else{
        if(retRaw) {
            return knex('Directory').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);
        }else{
            return knex('Directory').select().whereRaw(queryStr).offset(offset).limit(limit);
        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryDirectory', 'directoryDB', config.cacheTime);
}

exports.queryBy = function(retRaw, queryStr){
    return  knex('Directory').select(retRaw).whereRaw(queryStr);
};

exports.getCount = function(queryStr){
    return knex('Directory').whereRaw(queryStr).count('uuid as count');
}

exports.getDirectoryByTenant = function(tenantUUID){
    return knex('Directory').select().where('tenantUUID', tenantUUID);
}
if(config.cache){
    cache.cacheable(exports, 'getDirectoryByTenant', 'directoryDB', config.cacheTime);
}

exports.getDirectoryBySnRule = function(snRuleUUID){
    return knex('Directory').select().where('snRuleUUID', snRuleUUID);
}
if(config.cache){
    cache.cacheable(exports, 'getDirectoryBySnRule', 'directoryDB', config.cacheTime);
}