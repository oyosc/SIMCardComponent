/**
 * Created by Administrator on 2016/6/1.
 */
var knex = require('./knex').knex;
var cache = require('../common/cacheAble');
var config = require('../config/config');

exports.createSerialNumber = function(info){
    return knex('SerialNumber').insert(info);
};

exports.getSerialNumber  = function(queryStr){
    return knex('SerialNumber').select().whereRaw(queryStr);
}

exports.updateSerialNumber = function(createAt, key, value){
    return knex('SerialNumber').update(key, value).where('createAt', createAt);
}