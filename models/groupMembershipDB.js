/**
 * Created by Administrator on 2016/5/31.
 */
"use strict";
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createGroupMembership = function(info) {
    return  knex('GroupMembership').insert(info);
}
if(config.cache){
    cache.clear(exports, 'createGroupMembership', 'groupMembershipDB');
}

exports.updateGroupMembership = function(info){
    return  knex('GroupMembership').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateGroupMembership', 'groupMembershipDB');
}

exports.retrieveGroupMembership = function(uuid, tenantUUID){
    return knex('GroupMembership').select().whereRaw('uuid=\''+uuid+'\' and tenantUUID=\''+tenantUUID+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveGroupMembership', 'groupMembershipDB', config.cacheTime);
}

exports.queryGroupMemberships = function(queryStr, offset, limit, orderBy, retRaw) {
    if(orderBy){
        if(retRaw){
            return knex('GroupMembership').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }else{
            return knex('GroupMembership').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    }else{
        if(retRaw) {
            return knex('GroupMembership').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);

        }else{
            return knex('GroupMembership').select().whereRaw(queryStr).offset(offset).limit(limit);

        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryGroupMemberships', 'groupMembershipDB', config.cacheTime);
}

exports.getCount = function(queryStr) {
    return knex('GroupMembership')
        .whereRaw(queryStr)
        .count('uuid as count');
}
if(config.cache){
    cache.cacheable(exports, 'getCount', 'groupMembershipDB', config.cacheTime);
}

exports.delGroupMembership = function(uuid,  key, value){
    return knex('GroupMembership').update(key, value).where('uuid', uuid)
}
if(config.cache){
    cache.clear(exports, 'delGroupMembership', 'groupMembershipDB');
}

exports.queryBy = function(retRaw, queryStr){
    return  knex('GroupMembership')
        .select(retRaw)
        .whereRaw(queryStr);

}