/**
 * Created by Administrator on 2016/5/31.
 */
'use strict';
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createGroup = (info) => {
    return knex('Group').insert(info);
};
if(config.cache){
    cache.clear(exports, 'createGroup', 'groupDB');
}

exports.updateGroup = (info) => {
    return  knex('Group').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateGroup', 'groupDB');
}

exports.queryGroup = (queryStr, offset, limit, orderBy) => {
    if (orderBy) {
        return knex('Group').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
    } else {
        return knex('Group').select().whereRaw(queryStr).offset(offset).limit(limit);
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryGroup', 'groupDB', config.cacheTime);
}

exports.retrieveGroup = (groupUUID) => {
    return  knex('Group').select().where('uuid', groupUUID);
};
if(config.cache){
    cache.cacheable(exports, 'retrieveGroup', 'groupDB', config.cacheTime);
}

exports.getCount = (queryStr) => {
    return knex('Group').whereRaw(queryStr).count('uuid as count');
};

exports.deleteGroup = (uuid, key, value) => {
    return knex('Group').update(key, value).where('uuid', uuid);
};
if(config.cache){
    cache.clear(exports, 'deleteGroup', 'groupDB');
}

exports.queryBy = (retRaw, queryStr) => {
    return knex('Group')
        .select(retRaw)
        .whereRaw(queryStr);
};

exports.getGroupByTenant = (tenantUUID) => {
    return knex('Group').select().where('tenantUUID', tenantUUID);
}
