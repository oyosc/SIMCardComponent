/**
 * Created by Administrator on 2016/5/30.
 */
"use strict";
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createBatchNORules = (info) => {
    return knex('BatchNORule').insert(info);
}
if(config.cache){
    cache.clear(exports, 'createBatchNORules', 'batchNORuleDB');
}

exports.delBatchNORule = function(uuid, key, value){
    return knex('BatchNORule').update(key, value).where('uuid', uuid);
};
if(config.cache){
    cache.clear(exports, 'delBatchNORule', 'batchNORuleDB');
}

exports.retrieveBatchNORule = function(uuid, tenantUUID){
    return knex('BatchNORule').select().whereRaw('uuid=\'' + uuid + '\' and tenantUUID=\'' + tenantUUID + '\'');
}
if(config.cache){
    cache.cacheable(exports, 'retrieveBatchNORule', 'batchNORuleDB', config.cacheTime);
}

exports.updateBatchNORules = function(info){
    return knex('BatchNORule').update(info).where('uuid', info.uuid);
}
if(config.cache){
    cache.clear(exports, 'updateBatchNORules', 'batchNORuleDB');
}

exports.queryBatchNORule = function(queryStr, offset, limit, orderBy, retRaw){
    if(orderBy){
        if(retRaw) {
            return knex('BatchNORule').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        } else{
            return knex('BatchNORule').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
        }
    } else{
        if(retRaw) {
            return knex('BatchNORule').select(retRaw).whereRaw(queryStr).offset(offset).limit(limit);
        }else{
            return knex('BatchNORule').select().whereRaw(queryStr).offset(offset).limit(limit);
        }
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryBatchNORule', 'batchNORule', config.cacheTime);
}

exports.queryBy = function(retRaw, queryStr){
    return  knex('BatchNORule').select(retRaw).whereRaw(queryStr);
};

exports.getCount = function(queryStr){
    return knex('BatchNORule').whereRaw(queryStr).count('uuid as count');
}