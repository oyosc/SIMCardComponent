/**
 * Created by ljw on 2016/5/31.
 */
'use strict';
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createTenant = function(info) {
    return  knex('Tenant').insert(info);
};
if(config.cache){
    cache.clear(exports, 'createTenant', 'tenants');
}

exports.updateTenant = function(info){
    return knex('Tenant').update(info).where('uuid', info.uuid);
};
if(config.cache){
    cache.clear(exports, 'updateTenant', 'tenants');
}

exports.retrieveTenant = function(uuid){
    return  knex('Tenant').select().where('uuid', uuid);
};
if(config.cache){
    cache.cacheable(exports, 'retrieveTenant', 'tenants', config.cacheTime);
}

exports.queryTenants = function(queryStr, offset, limit, orderBy) {
    if (orderBy) {
        return knex('Tenant').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
    } else {
        return knex('Tenant').select().whereRaw(queryStr).offset(offset).limit(limit);
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryTenants', 'tenants', config.cacheTime);
}

exports.getCount = function(queryStr) {
    return knex('Tenant').whereRaw(queryStr).count('uuid as count');
};
if(config.cache){
    cache.cacheable(exports, 'getCount', 'tenants', config.cacheTime);
}

exports.deleteTenant = function(uuid, key, value){
    return  knex('Tenant').update(key, value).where('uuid', uuid);
};
if(config.cache){
    cache.clear(exports, 'deleteTenant', 'tenants');
}

exports.authenticateTenantApiKey = function (apikey_id, apikey_secret) {
    return knex('Tenant').select().whereRaw('apikey_id =\''+ apikey_id +'\' and apikey_secret =\''+ apikey_secret +'\'');
};
if(config.cache){
    cache.cacheable(exports, 'authenticateTenantApiKey', 'tenants', config.cacheTime);
}

exports.queryBy = function(retRaw, queryStr){
    return knex('Tenant').select(retRaw).whereRaw(queryStr);
};