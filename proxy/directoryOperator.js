/**
 * Created by ljw on 2016/4/15.
 */
"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var directoryModel = require('../models/directoryDB');
var organizationMembershipModel= require('../models/organizationMembershipDB');
//var storeMappingModel= require('../models/storeMappings');

function convert2LogicInfo(dbInfo) {
    dbInfo.createAt  = moment(dbInfo.createAt).format('YYYY-MM-DD HH:mm:ss');
    dbInfo.modifiedAt = moment(dbInfo.modifiedAt).format('YYYY-MM-DD HH:mm:ss');
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'name': utils.ifReturnStr(dbInfo.name),
        'status': utils.ifReturnStr(dbInfo.status),
        'description': utils.ifReturnStr(dbInfo.description),
        'tenantUUID' : utils.ifReturnStr(dbInfo.tenantUUID),
        'snRuleUUID' : utils.ifReturnStr(dbInfo.snRuleUUID),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt)
    };

    if (dbInfo.customData) {
        info.customData = JSON.parse(dbInfo.customData);
        info = common.getCustomData(info);
    }
    return info;
}

function convert2DBInfo(info, isCreate) {
    var dirArray = [
        'uuid',
        'name',
        'description',
        'status',
        'tenantUUID',
        'createAt',
        'modifiedAt'
    ];
    info =common.saveCustomData(info, dirArray);
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();

    var dbInfo = {
        'uuid' : utils.ifReturnStr(info.uuid, uuid),
        'name' : utils.ifReturnStr(info.name),
        'status' : utils.ifReturnStr(info.status, 'ENABLED'),
        'description': utils.ifReturnStr(info.description),
        'tenantUUID' : utils.ifReturnStr(info.tenantUUID),
        'modifiedAt' : dateTime,
        'customData' :utils.ifReturnJson(info.customData)
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
    }

    return dbInfo;
}
function generateQueryCondition(queryCondition){
    var size = 0;
    for(var conditionItem in queryCondition) {
        if(conditionItem =='offset' || conditionItem == 'limit' || conditionItem == 'expand' || conditionItem == 'organizationUUID'){//|| conditionItem == 'applicationUUID'
            continue;
        }
        ++size;
    }
    var queryStr = '', organizationStr='';
    var i = 0;
    for(var condition in queryCondition){
        var isContinue = false;
        switch(condition){
            case 'uuid':case 'status':case 'tenantUUID':
            queryStr += condition + '= \'' + queryCondition[condition] + '\'';
            break;
            case 'name':
                if(queryCondition[condition].indexOf('*') == -1){
                    queryStr += 'name = \'' + queryCondition[condition] + '\'';
                } else{
                    var reg = /\*/g;
                    var str = queryCondition[condition].replace(reg, '%');
                    queryStr += 'name like \'' + str + '\'';
                }
                break;
            case 'organizationUUID':
                organizationStr += 'organizationUUID = \'' + queryCondition[condition] + '\' and type=\'directory\'';
                isContinue = true;
                break;
            case 'expand':case 'offset':case 'limit':
            isContinue = true;
            break;
        }
        if(isContinue){
            continue;
        }
        ++i;
        if(i<size){
            queryStr += 'and';
        }
    }
    if(i != 0){
        queryStr += 'and deleteFlag != \'' + common.m_logicDeleteFlag + '\'';
    } else{
        queryStr += 'deleteFlag != \'' + common.m_logicDeleteFlag + '\'';
    }
    if(organizationStr!=''){
        return Promise.resolve(organizationMembershipModel.queryBy('storeUUID', organizationStr))
            .then(function (results) {
                if (queryStr != '') {
                    queryStr += ' and ';
                }
                if (results.length > 0){
                    queryStr += 'uuid in (';
                    for (var i=0; i<results.length; ++i) {
                        queryStr += '\'' + results[i].storeUUID + '\'';
                        if (i < results.length-1) {
                            queryStr += ',';
                        }
                    }
                    queryStr += ')';
                }else{
                    queryStr += 'uuid in (\'\')';
                }
                return queryStr;
            });
    }else {
        return queryStr;
    }

}

exports.createDirectories = function(info){
    var data = convert2DBInfo(info, true);
    return Promise.resolve(directoryModel.createDirectories(data)).then(function(){
        return convert2LogicInfo(data);
    });
}

exports.updateDirectories = function(info){
    var data = convert2DBInfo(info);
    return Promise.resolve(directoryModel.updateDirectories(data)).then(()=>{
        return convert2LogicInfo(data)
    })
}

exports.deleteDirectory = function(uuid){
    return Promise.resolve(directoryModel.delDirectory(uuid, 'deleteFlag', common.m_logicDeleteFlag));
};

exports.retrieveDirectory = function(tenantUUID, uuid){
    return Promise.resolve(directoryModel.retrieveDirectory(uuid, tenantUUID)).then((result) => {
        var infos = [];
        for (var i = 0; i < result.length; i++) {
            infos.push(convert2LogicInfo(result[i]));
        }
        return infos;
    })
}

exports.queryBy = function(retRaw, queryStr){
    return Promise.resolve(directoryModel.queryBy(retRaw, queryStr))
            .then(function (results) {
                return results;
    });
};

exports.queryDirectory = function(tenantUUID, queryConditions, offset, limit, organizationUUID){
    if(organizationUUID){
        queryConditions.organizationUUID = organizationUUID;
    }
    return Promise.resolve(generateQueryCondition(queryConditions)).then(function(queryStr){
        delete queryConditions.organizationUUID;
        if(queryStr != ''){
            queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
        }
        return Promise.resolve(directoryModel.queryDirectory(queryStr, offset, limit, queryConditions.orderBy)).then(function(results){
            var infos = [];
            if(results != null){
                for (var i = 0; i < results.length; i++) {
                    infos.push(convert2LogicInfo(results[i]));
                }
            }
            return infos;
        });
    })
}

exports.getCount = function(tenantUUID, queryConditions, organizationUUID){
    if(organizationUUID){
        queryConditions.organizationUUID = organizationUUID;
    }
    return Promise.resolve(generateQueryCondition(queryConditions)).then(function(queryStr){
        delete queryConditions.organizationUUID;
        if(queryStr != ''){
            queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
        }
        return Promise.resolve(directoryModel.getCount(queryStr)).then(function (results){
            if(results != null){
                return results[0].count;
            }
        })
    })
};

exports.getDirectoryByTenant = function(tenantUUID){
    var infos = [];
    return Promise.resolve(directoryModel.getDirectoryByTenant(tenantUUID)).then(function(result){
        if(result.length == 0){
            return result;
        }
        infos.push(convert2LogicInfo(result[0]));
        return infos;
    });
};

