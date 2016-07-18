/**
 * Copyright(C),
 * FileName:  organizationMembershipDB.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/26  14:40
 * Description:
 */
"use strict";
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createOrganizationMembership = function(info) {
    return  knex('OrganizationMembership').insert(info);
}
if(config.cache){
    cache.clear(exports, 'createOrganizationMembership', 'organizationMembershipDB');
}

exports.updateOrganizationMembership = function(info){
    return  knex('OrganizationMembership').update(info).where('uuid', info.uuid);

}
if(config.cache){
    cache.clear(exports, 'createOrganizationMembership', 'organizationMembershipDB');
}

exports.retrieveOrganizationMembership = function(uuid, tenantUUID){
    return knex('OrganizationMembership').select().whereRaw('uuid=\''+uuid+'\' and tenantUUID=\''+tenantUUID+'\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveOrganizationMembership', 'organizationMembershipDB', config.cacheTime);
}

exports.queryOrganizationMemberships = function(queryStr, offset, limit, orderBy, retRaw) {
    if(orderBy){
        if(retRaw) {
            return knex('OrganizationMembership').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }else{
            return knex('OrganizationMembership').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    }else{
        if(retRaw) {
            return knex('OrganizationMembership').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);

        }else{
            return knex('OrganizationMembership').select().whereRaw(queryStr).offset(offset).limit(limit);

        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryOrganizationMemberships', 'organizationMembershipDB', config.cacheTime);
}

exports.getCount = function(queryStr) {
    return knex('OrganizationMembership')
        .whereRaw(queryStr)
        .count('uuid as count');
}

exports.delOrganizationMembership = function(uuid,  key, value){
    return knex('OrganizationMembership').update(key, value).where('uuid', uuid)
}
if(config.cache){
    cache.clear(exports, 'createOrganizationMembership', 'organizationMembershipDB');
}

exports.queryBy = function(retRaw, queryStr){
    return  knex('OrganizationMembership')
        .select(retRaw)
        .whereRaw(queryStr);

}