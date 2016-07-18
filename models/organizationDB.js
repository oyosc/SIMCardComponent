/**
 * Copyright(C),
 * FileName:  organizationDB.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/26  14:30
 * Description:
 */

"use strict";
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createOrganization = function(info) {
    return  knex('Organization').insert(info);
}
if(config.cache){
    cache.clear(exports, 'createOrganization', 'organizationDB');
}
exports.updateOrganization = function(info){
    return  knex('Organization').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateOrganization', 'organizationDB');
}


exports.retrieveOrganization = function(uuid, tenantUUID){
    return knex('Organization').select().whereRaw('uuid=\''+uuid+'\' and tenantUUID=\''+tenantUUID+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveOrganization', 'organizationDB', config.cacheTime);
}

exports.queryOrganizations = function(queryStr, offset, limit, orderBy, retRaw) {
    if(orderBy){
        if(retRaw){
            return knex('Organization').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);

        }else{
            return knex('Organization').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    }else{
        if(retRaw) {
            return knex('Organization').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);
        }else{
            return knex('Organization').select().whereRaw(queryStr).offset(offset).limit(limit);
        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryOrganizations', 'organizationDB', config.cacheTime);
}

exports.getCount = function(queryStr) {
    return knex('Organization')
        .whereRaw(queryStr)
        .count('uuid as count');
}
if(config.cache){
    cache.cacheable(exports, 'getCount', 'organizationDB', config.cacheTime);
}

exports.delOrganization = function(uuid,  key, value){
    return knex('Organization').update(key, value).where('uuid', uuid)
}
if(config.cache){
    cache.clear(exports, 'delOrganization', 'organizationDB');
}

exports.queryBy = function(retRaw, queryStr){
    return  knex('Organization')
        .select(retRaw)
        .whereRaw(queryStr)
        .then(function (rows) {
            return rows;
        });
}

exports.getOrganizationByTenant = function(tenantUUID) {
    return knex('Organization').select().where('tenantUUID', tenantUUID);
}
if(config.cache){
    cache.cacheable(exports, 'getOrganizationByTenant', 'organizationDB', config.cacheTime);
}