/**
 * Created by Administrator on 2016/6/1.
 */
'use strict';
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');


exports.queryBy = (retRaw, queryStr) => {
    return knex('BatchNumber')
        .select(retRaw)
        .whereRaw(queryStr);
};

exports.retrieveBatchNumber= (uuid) => {
    return  knex('BatchNumber').select().where('uuid', uuid);
};
if(config.cache){
    cache.cacheable(exports, 'retrieveBatchNumber', 'batchNumberDB', config.cacheTime);
}


exports.getBatchNORules = ( batchNORuleUUID) => {
    return knex('BatchNORule')
        .select().where('uuid', batchNORuleUUID);
};

exports.createBatchNumber = (info) => {
    return knex('BatchNumber').insert(info);
};
if(config.cache){
    cache.clear(exports, 'createBatchNumber', 'batchNumberDB');
}

exports.deleteBatchNumber = (uuid, key, value) => {
    return knex('BatchNumber').update(key, value).where('uuid', uuid);
};
if(config.cache){
    cache.clear(exports, 'deleteBatchNumber', 'batchNumberDB');
}

exports.queryBatchNumber = (queryStr, offset, limit, orderBy) => {
    if (orderBy) {
        return knex('BatchNumber').select().whereRaw(queryStr).offset(offset).limit(limit).orderByRaw(orderBy);
    } else {
        return knex('BatchNumber').select().whereRaw(queryStr).offset(offset).limit(limit);
    }
}
if(config.cache){
    cache.cacheable(exports, 'queryBatchNumber', 'batchNumberDB', config.cacheTime);
}

exports.getCount = (queryStr) => {
    return knex('BatchNumber').whereRaw(queryStr).count('uuid as count');
};
if(config.cache){
    cache.cacheable(exports, 'getCount', 'batchNumberDB', config.cacheTime);
}

exports.getBatchNumberByRule = ( batchNORuleUUID) => {
    return knex('BatchNumber')
        .select().where('batchNORuleUUID', batchNORuleUUID );
};
