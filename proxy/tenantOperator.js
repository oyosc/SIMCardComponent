/**
 * Created by ljw on 2016/5/31.
 */
'use strict';
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var tenantModel = require('../models/tenantDB');
var crypto = require('crypto');

function md5Encode (str){
    var md5= crypto.createHash('md5');
    md5.update(str);
    var textmd5 = md5.digest("base64");

    return textmd5.substr(0, textmd5.length-2);
}

function convert2DBInfo(info, isCreate) {
    var tenantArray = [
        'uuid',
        'name',
        'status',
        'description',
        'apikey_id',
        'apikey_secret',
        'createAt',
        'modifiedAt'
    ];
    info =common.saveCustomData(info, tenantArray);
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();

    var dbInfo = {
        'uuid': utils.ifReturnStr(info.uuid, uuid),
        'name': utils.ifReturnStr(info.name),
        'status': utils.ifReturnStr(info.status, 'ENABLED'),
        'description': utils.ifReturnStr(info.description),
        //'key': utils.ifReturnStr(info.key),
        'modifiedAt': dateTime,
        'customData' :utils.ifReturnJson(info.customData)
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
        dbInfo.apikey_id = md5Encode(Date.now() + uuid);
        dbInfo.apikey_secret =  md5Encode(info.name + Date.now() );
    }

    return dbInfo;
}

function convert2LogicInfo(dbInfo) {
    dbInfo.createAt  = moment(dbInfo.createAt).format('YYYY-MM-DD HH:mm:ss');
    dbInfo.modifiedAt = moment(dbInfo.modifiedAt).format('YYYY-MM-DD HH:mm:ss');
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'name': utils.ifReturnStr(dbInfo.name),
        'status': utils.ifReturnStr(dbInfo.status),
        'description': utils.ifReturnStr(dbInfo.description),
        //'key': utils.ifReturnStr(dbInfo.key),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt)
    };

    if (dbInfo.customData) {
        info.customData = JSON.parse(dbInfo.customData);
        info = common.getCustomData(info);
    }
    return info;
}

function generateQueryCondition(queryCondition) {
    if(!queryCondition) {
        return '';
    }

    var size = 0;
    for (var conditionItem in queryCondition) {
        if (conditionItem == 'offset' || conditionItem == 'limit' ||  conditionItem == 'orderBy'|| conditionItem == 'expand') {
            continue;
        }
        ++size;
    }
    var queryStr = '';
    var i = 0;
    for (var condition in queryCondition) {
        var isContinue = false;
        switch (condition) {
            case 'uuid' :
                queryStr += condition + '=\'' + queryCondition[condition] + '\'';
                break;
            case 'name' :case 'description' :
            if (queryCondition[condition].indexOf('*') == -1) {
                queryStr += 'name=\'' + queryCondition[condition] + '\'';
            } else {
                var reg = /\*/g;
                var str = queryCondition[condition].replace(reg, '%');
                queryStr += 'name like \'' + str + '\'';
            }
            break;
            case 'offset':case'limit':case 'orderBy':case 'expand':
            isContinue = true;
            break;
        }
        if (isContinue) {
            continue;
        }
        ++i;
        if (i < size) {
            queryStr += ' and ';
        }
    }
    //避免已经逻辑删除的数据被检索
    if(i != 0) {
        queryStr += 'and deleteFlag != \'' + common.m_logicDeleteFlag + '\'';
    } else {
        queryStr += 'deleteFlag != \'' + common.m_logicDeleteFlag + '\'';
    }
    return queryStr;
}

exports.createTenant = function(info) {
    var data = convert2DBInfo(info, true);
    var data1 = convert2LogicInfo(data);
    return Promise.all([data1, tenantModel.createTenant(data)]);
};

exports.updateTenant=function(info){
    var data=convert2DBInfo(info);
    var data1=convert2LogicInfo(data);
    return Promise.all([data1, tenantModel.updateTenant(data)]);
}

exports.deleteTenant=function(uuid){
    return Promise.resolve(tenantModel.deleteTenant(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.retrieveTenant = function(uuid){
    var infos = [];
    return Promise.resolve(tenantModel.retrieveTenant(uuid)).then(function(results){
        for (var i = 0; i < results.length; ++i) {
            infos.push(convert2LogicInfo(results[i], true));
        }
        return infos;
    });
};

exports.getCount = function(queryConditions){
    var queryStr = generateQueryCondition(queryConditions);
    return Promise.resolve(tenantModel.getCount(queryStr));
};

exports.queryTenants = function(queryConditions, offset, limit){
    var infos = [];
    var queryStr = generateQueryCondition(queryConditions);
    return Promise.resolve(tenantModel.queryTenants(queryStr, offset, limit, queryStr.orderBy)).then(function(results){
        for (var i = 0; i < results.length; ++i) {
            infos.push(convert2LogicInfo(results[i], true));
        }
        return Promise.resolve(infos);
    });
};

exports.authenticateTenantApiKey = function(apikey_id, apikey_secret){
    return Promise.resolve(tenantModel.authenticateTenantApiKey(apikey_id, apikey_secret)).then(function(results){
        if(results.length == 1){
            return convert2LogicInfo(results[0]);
        }else{
            var error = new Error('apikey error!');
            error.status = 401;
            throw error;
        }
    });
};

exports.queryBy = function(retRaw, queryStr){
    return Promise.resolve(tenantModel.queryBy(retRaw,queryStr));
};