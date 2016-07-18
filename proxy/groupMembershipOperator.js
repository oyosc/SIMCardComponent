/**
 * Created by Administrator on 2016/5/31.
 */
"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var groupMembershipModel = require('../models/groupMembershipDB');

function convert2DBInfo(info, isCreate) {
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();
    var groupUUID, simCardUUID;
    if(info.group && info.group.href){
        if(info.group.href.indexOf('groups/') > -1){
            groupUUID = utils.getUUIDInHref(info.group.href, 'groups/');
        }
    }
    if(info.simCard && info.simCard.href){
        if(info.simCard.href.indexOf('simCards/') > -1){
            simCardUUID = utils.getUUIDInHref(info.simCard.href, 'simCards/');
        }
    }
    var dbInfo = {
        'uuid': utils.ifReturnStr(info.uuid, uuid),
        'simCardUUID': utils.ifReturnStr(simCardUUID),
        'groupUUID': utils.ifReturnStr(groupUUID),
        'tenantUUID' : utils.ifReturnStr(info.tenantUUID),
        'modifiedAt': dateTime
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
    }

    return dbInfo;
}

function convert2LogicInfo(dbInfo) {
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'simCardUUID': utils.ifReturnStr(dbInfo.simCardUUID),
        'groupUUID': utils.ifReturnStr(dbInfo.groupUUID),
        'tenantUUID' : utils.ifReturnStr(dbInfo.tenantUUID),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt)
    };
    return info;
}

function generateQueryCondition(queryCondition) {
    var size = 0;
    for (var conditionItem in queryCondition) {
        if (conditionItem == 'offset' || conditionItem == 'limit'  || conditionItem == 'orderBy' || conditionItem == 'expand' ){
            continue;
        }
        ++size;
    }
    var queryStr = '';
    var i = 0;
    for (var condition in queryCondition) {
        var isContinue = false;
        switch (condition) {
            case 'uuid' :case 'status':case 'tenantUUID':case 'deviceUUID':case 'groupUUID':case 'type':
            queryStr += condition + '= \'' + queryCondition[condition] + '\'';
            break;
            case 'groupURL':
                var groupUUID;
                if(queryCondition[condition].indexOf('groups/')>-1){
                    groupUUID=utils.getUUIDInHref(queryCondition[condition].href, 'groups/');
                }
                queryStr += 'groupUUID = \'' +groupUUID+ '\'';
                break;
            case 'deviceURL':
                var deviceUUID;
                if(queryCondition[condition].indexOf('devices/')>-1){
                    deviceUUID=utils.getUUIDInHref(queryCondition[condition].href, 'devices/');
                }
                queryStr += 'deviceUUID = \'' +deviceUUID+ '\'';
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
    return queryStr;
}

exports.createGroupMembership = function(info) {
    var data = convert2DBInfo(info, true);
    return Promise.resolve(groupMembershipModel.createGroupMembership(data)).then(() => {
        return convert2LogicInfo(data);
    });
    //return new Promise(function (resolve) {
    //    groupMembershipModel.createGroupMembership(data)
    //        .then(function () {
    //            resolve(convert2LogicInfo(data));
    //        })
    //});
};

exports.updateGroupMembership=function(info){
    var data=convert2DBInfo(info);
    return Promise.resolve( groupMembershipModel.updateGroupMembership(data)).then(() => {
        return convert2LogicInfo(data);
    });
}

exports.deleteGroupMembership=function(uuid){
    //只逻辑删除
    return  Promise.resolve(groupMembershipModel.delGroupMembership(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.retrieveGroupMembership = function(tenantUUID, uuid){
    return groupMembershipModel.retrieveGroupMembership(uuid, tenantUUID).then((results) => {
        var infos = [];
        for (var i = 0; i < results.length; ++i) {
            infos.push(convert2LogicInfo(results[i]));
        }
        return infos;
    });
    //return new Promise(function (resolve) {
    //    groupMembershipModel.retrieveGroupMembership(uuid, tenantUUID)
    //        .then(function (results) {
    //            var infos = [];
    //            for (var i = 0; i < results.length; ++i) {
    //                infos.push(convert2LogicInfo(results[i]));
    //            }
    //            resolve(infos);
    //        })
    //});
};

exports.getCount = function(tenantUUID, queryConditions, groupUUID){
    var queryStr = generateQueryCondition(queryConditions);
    if(queryStr!=''){
        queryStr +=' and tenantUUID =\'' + tenantUUID + '\'';
    }
    if(groupUUID){
        queryStr +=' and groupUUID =\'' + groupUUID + '\'';
    }
    return Promise.resolve(groupMembershipModel.getCount(queryStr))
        .then(function (results) {
            return results[0].count;
        });
};

exports.queryGroupMemberships = function(tenantUUID, queryConditions, offset, limit, groupUUID, simCardUUID){

    var queryStr = generateQueryCondition(queryConditions);
    if(queryStr!=''){
        queryStr +=' and tenantUUID =\'' + tenantUUID + '\'';
    }
    if(groupUUID){
        queryStr +=' and groupUUID =\'' + groupUUID + '\'';
    }
    if(simCardUUID){
        queryStr +=' and simCardUUID =\'' + simCardUUID + '\'';
    }
    return groupMembershipModel.queryGroupMemberships(queryStr, offset, limit, queryConditions.orderBy)
        .then((results) => {
            var infos = [];
            for (var i = 0; i < results.length; ++i) {
                infos.push(convert2LogicInfo(results[i]));
            }
            return infos;
        });
    //return new Promise(function (resolve) {
    //    groupMembershipModel.queryGroupMemberships(queryStr, offset, limit, queryConditions.orderBy)
    //        .then(function (results) {
    //            var infos = [];
    //            for (var i = 0; i < results.length; ++i) {
    //                infos.push(convert2LogicInfo(results[i]));
    //            }
    //            resolve(infos);
    //        })
    //});
};

exports.queryBy = function(retRaw, queryStr){
    return Promise.resolve(groupMembershipModel.queryBy(retRaw, queryStr));
};