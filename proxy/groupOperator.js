/**
 * Created by Administrator on 2016/5/31.
 */
'use strict';
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var groupsModel = require('../models/groupDB');
var errorCodeTable = require('../common/errorCodeTable');
var organizationMembershipProxy = require('../proxy/organizationMembershipOperator');
var groupMembershipProxy = require('../proxy/groupMembershipOperator');


const convert2DBInfo = (info, isCreate) => {
    var groupArray = [
        'uuid',
        'name',
        'description',
        'status',
        'tenantUUID',
        'createAt',
        'modifiedAt'
    ];
    info =common.saveCustomData(info, groupArray);
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();

    var dbInfo = {
        'uuid': utils.ifReturnStr(info.uuid, uuid),
        'name': utils.ifReturnStr(info.name),
        'status': utils.ifReturnStr(info.status, 'ENABLED'),
        'description': utils.ifReturnStr(info.description),
        'modifiedAt': dateTime,
        'customData' :utils.ifReturnJson(info.customData)
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
        dbInfo.tenantUUID = utils.ifReturnStr(info.tenantUUID)
    }

    return dbInfo;
}

const convert2LogicInfo = (dbInfo) => {
    dbInfo.createAt  = moment(dbInfo.createAt).format('YYYY-MM-DD HH:mm:ss');
    dbInfo.modifiedAt = moment(dbInfo.modifiedAt).format('YYYY-MM-DD HH:mm:ss');
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'name': utils.ifReturnStr(dbInfo.name),
        'status': utils.ifReturnStr(dbInfo.status),
        'description': utils.ifReturnStr(dbInfo.description),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt),
        'tenantUUID': utils.ifReturnStr(dbInfo.tenantUUID)
    };

    if (dbInfo.customData) {
        info.customData = JSON.parse(dbInfo.customData);
        info = common.getCustomData(info);
    }
    return info;
}

const generateQueryCondition = (queryCondition) => {

    var size = 0;
    for (var conditionItem in queryCondition) {
        if (conditionItem == 'offset' || conditionItem == 'limit' || conditionItem == 'expand' || conditionItem == 'orderBy' ||  conditionItem == 'organizationUUID'|| conditionItem == 'applicationUUID' || conditionItem == 'simCardUUID' ) {
            continue;
        }
        ++size;
    }
    var queryStr = '', orderStr='', logisticsStr='',organizationStr='',applicationStr='';
    var i = 0;
    for (var condition in queryCondition) {
        var isContinue = false;
        switch (condition) {
            case 'uuid' :case 'status':case 'tenantUUID':
            queryStr += condition + '= \'' + queryCondition[condition] + '\'';
            break;
            case 'name' :
                if (queryCondition[condition].indexOf('*') == -1){
                    queryStr += 'name = \'' + queryCondition[condition] + '\'';
                } else {
                    var reg = /\*/g;
                    var str = queryCondition[condition].replace(reg, '%');
                    queryStr += 'name  like  \'' + str + '\'';
                }
                break;
            case 'groupUUIDArray':case 'directoryUUIDArray':
            var arrayStr = queryCondition[condition];
            var tmpStr = '';
            if(arrayStr.length>0){
                for (var j = 0; j < arrayStr.length; ++j) {
                    tmpStr += '\'' + arrayStr[j] + '\'';
                    if (j < arrayStr.length - 1) {
                        tmpStr += ',';
                    }
                }
            }else{
                tmpStr = '\'\''
            }
            if(condition=='directoryUUIDArray'){
                queryStr +=  'directoryUUID  in (' + tmpStr + ')';
            }else{
                queryStr += 'uuid  in (' + tmpStr + ')';
            }
            break;
            case 'simCardUUID':
                orderStr += 'simCardUUID = \'' + queryCondition[condition] + '\'';
                isContinue = true;
                break;
            case 'organizationUUID':
                organizationStr += 'organizationUUID = \'' + queryCondition[condition] + '\' and type=\'group\'';
                isContinue = true;
                break;
            case 'applicationUUID':
                applicationStr += 'applicationUUID = \'' + queryCondition[condition] + '\' and storeType=\'group\'';
                isContinue = true;
                break;
            case 'expand':case 'offset':case'limit':case 'orderBy':
            isContinue = true;
            break;
        }
        if (isContinue){
            continue;
        }
        ++i;
        if (i < size) {
            queryStr += ' and ';
        }
    }
    //避免已经逻辑删除的数据被检索
    if(i != 0){
        queryStr += 'and deleteFlag != \'' + common.m_logicDeleteFlag + '\'';
    }else{
        queryStr += 'deleteFlag != \'' + common.m_logicDeleteFlag + '\'';
    }
    if(organizationStr!=''){
        return Promise.resolve(organizationMembershipProxy.queryBy('storeUUID', organizationStr))
            .then( (results) => {
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
    }else if(orderStr!=''){
        return Promise.resolve(groupMembershipProxy.queryBy('groupUUID', orderStr))
            .then(function (results) {
                if (queryStr != '') {
                    queryStr += ' and ';
                }
                if (results.length > 0){
                    queryStr += 'uuid in (';
                    for (var i=0; i<results.length; ++i) {
                        queryStr += '\'' + results[i].groupUUID + '\'';
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

    }
    return queryStr;

}

exports.createGroup= (info) => {
    var data = convert2DBInfo(info, true);
    var data1 = convert2LogicInfo(data);
    return  Promise.all([data1, groupsModel.createGroup(data)]);
}

exports.updateGroup=(info) => {
    var data = convert2DBInfo(info);
    var data1 = convert2LogicInfo(data);
    data1.tenantUUID = info.tenantUUID;
    return Promise.all([data1, groupsModel.updateGroup(data)]);
}

exports.queryBy = (retRaw, queryStr) => {
    return Promise.resolve(groupsModel.queryBy(retRaw, queryStr));
};

exports.queryGroup = (tenantUUID, queryConditions, offset, limit, simCardUUID, organizationUUID) => {
    if(organizationUUID){
                queryConditions.organizationUUID = organizationUUID;
            }
    if(simCardUUID) {
        queryConditions.simCardUUID = simCardUUID;
    }
    return Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
            delete queryConditions.organizationUUID;
            delete queryConditions.simCardUUID;
            if(queryStr != ''){
                queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
            }
            return groupsModel.queryGroup(queryStr, offset, limit, queryConditions.orderBy).then((results) => {
                var infos = [];
                if(results != null) {
                    for (var i = 0; i < results.length; i++) {
                        infos.push(convert2LogicInfo(results[i]));
                    }
                }
                return infos;
            });
    })

}

exports.retrieveGroup = (groupUUID) => {
    var infos = [];
    return Promise.resolve(groupsModel.retrieveGroup(groupUUID)).then((results) => {
        if(results.length == 0) {
            return results
        }
        infos.push(convert2LogicInfo(results[0]));
        return infos;
    });
};

exports.getCount = function(tenantUUID, queryConditions, simCardUUID, organizationUUID){
    if(organizationUUID){
        queryConditions.organizationUUID = organizationUUID;
    }
    if(simCardUUID){
        queryConditions.simCardUUID = simCardUUID;
    }
    return  Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
        delete queryConditions.organizationUUID;
        delete queryConditions.simCardUUID;
        if(queryStr != '') {
            queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
        }
        return groupsModel.getCount(queryStr).then((results) => {
            return results[0].count;
        });
    });
    //return new Promise((resolve) =>{
    //if(organizationUUID){
    //    queryConditions.organizationUUID = organizationUUID;
    //}
    //if(simCardUUID){
    //    queryConditions.simCardUUID = simCardUUID;
    //}
    //    Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr)=>{
    //        delete queryConditions.organizationUUID;
    //        delete queryConditions.simCardUUID;
    //        if(queryStr != ''){
    //            queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
    //        }
    //        Promise.resolve(groupsModel.getCount(queryStr).then(function (results) {
    //                resolve(results[0].count);
    //            })
    //        );
    //    });
    //});
};


exports.deleteGroup=(uuid) => {
    //只逻辑删除
    return Promise.resolve(groupsModel.deleteGroup(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.getGroups = function(retRaw, queryConditions, offset, limit){
    var queryStr = generateQueryCondition(queryConditions);
    return Promise.resolve(groupsModel.queryBy(retRaw, queryStr, offset, limit));
};