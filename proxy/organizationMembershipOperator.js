/**
 * Copyright(C),
 * FileName:  organizationMembershipOperator.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/4/19  15:45
 * Description:
 */

"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var organizationMembershipModel = require('../models/organizationMembershipDB');

function convert2DBInfo(info, isCreate) {
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();
    var storeUUID, organizationUUID, type;
    if(info.store && info.store.href){
        if(info.store.href.indexOf('directories/')>-1) {
            storeUUID=utils.getUUIDInHref(info.store.href, 'directories/');
            type='directory';
        }
        if(info.store.href.indexOf('groups/')>-1) {
            storeUUID=utils.getUUIDInHref(info.store.href, 'groups/');
            type='group';
        }
    }
    if(info.organization && info.organization.href){
        if(info.organization.href.indexOf('organizations/')>-1){
            organizationUUID=utils.getUUIDInHref(info.organization.href, 'organizations/');
        }
    }
    var dbInfo = {
        'uuid': utils.ifReturnStr(info.uuid, uuid),
        'organizationUUID': utils.ifReturnStr(organizationUUID),
        'storeUUID': utils.ifReturnStr(storeUUID),
        'type': utils.ifReturnStr(type),
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
        'organizationUUID': utils.ifReturnStr(dbInfo.organizationUUID),
        'storeUUID': utils.ifReturnStr(dbInfo.storeUUID),
        'type': utils.ifReturnStr(dbInfo.type),
        'tenantUUID' : utils.ifReturnStr(dbInfo.tenantUUID),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt)
    };
    return info;
}

function generateQueryCondition(queryCondition) {
    var size = 0;
    for (var conditionItem in queryCondition) {
        if (conditionItem == 'offset' || conditionItem == 'limit' || conditionItem == 'expand' || conditionItem == 'orderBy'){
            continue;
        }
        ++size;
    }
    var queryStr = '';
    var i = 0;
    for (var condition in queryCondition) {
        var isContinue = false;
        switch (condition) {
            case 'uuid' :case 'status':case 'tenantUUID':case 'organizationUUID':case 'storeUUID':
            queryStr += condition + '= \'' + queryCondition[condition] + '\'';
            break;
            case 'organizationURL':
                var organizationUUID;
                if(queryCondition[condition].indexOf('organizations/')>-1){
                    organizationUUID=utils.getUUIDInHref(queryCondition[condition].href, 'organizations/');
                }
                queryStr += 'organizationUUID = \'' +organizationUUID+ '\'';
                break;

            case 'storeURL':
                var storeUUID, type;
                if(queryCondition[condition].indexOf('directories/')>-1){
                   storeUUID=utils.getUUIDInHref(queryCondition[condition], 'directories/');
                    type='directory';
                }else if(queryCondition[condition].indexOf('groups/')>-1){
                    storeUUID=utils.getUUIDInHref(queryCondition[condition], 'groups/');
                    type='group';
                }
                queryStr += 'storeUUID = \'' +storeUUID+ '\' and type = \'' +type+ '\'';
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

exports.createOrganizationMembership = (info) => {
    var data = convert2DBInfo(info, true);
    return Promise.resolve(organizationMembershipModel.createOrganizationMembership(data))
        .then((result) => {
            return convert2LogicInfo(data);
        });
};

exports.updateOrganizationMembership=(info) =>{
    var data=convert2DBInfo(info);
    return Promise.resolve(organizationMembershipModel.updateOrganizationMembership(data))
        .then((result) =>{
            return convert2LogicInfo(data);
        });
}

exports.deleteOrganizationMembership=(uuid) =>{
    //只逻辑删除
    return Promise.resolve(organizationMembershipModel.delOrganizationMembership(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.retrieveOrganizationMembership = (tenantUUID, uuid) =>{
        return Promise.resolve(organizationMembershipModel.retrieveOrganizationMembership(uuid, tenantUUID))
            .then( (results) => {
                var infos = [];
                for (var i = 0; i < results.length; ++i) {
                    infos.push(convert2LogicInfo(results[i]));
                }
                return infos;
            });
};

exports.getCount = (tenantUUID, queryConditions, organizationUUID, storeUUID) =>{
    var queryStr = generateQueryCondition(queryConditions);
    if(queryStr!=''){
        queryStr +=' and tenantUUID =\'' + tenantUUID + '\'';
    }
    if(organizationUUID){
        queryStr +=' and organizationUUID =\'' + organizationUUID + '\'';
    }
    if(storeUUID){
        queryStr +=' and storeUUID =\'' + storeUUID + '\'';
    }
    return Promise.resolve(organizationMembershipModel.getCount(queryStr))
        .then((results) => {
            return results[0].count;
        });
};

exports.queryOrganizationMemberships = (tenantUUID, queryConditions, offset, limit, organizationUUID, storeUUID) =>{
    var queryStr = generateQueryCondition(queryConditions);
    if(queryStr!=''){
        queryStr +=' and tenantUUID =\'' + tenantUUID + '\'';
    }
    if(organizationUUID){
        queryStr +=' and organizationUUID =\'' + organizationUUID + '\'';
    }
    if(storeUUID){
        queryStr +=' and storeUUID =\'' + storeUUID + '\'';
    }
    return Promise.resolve(organizationMembershipModel.queryOrganizationMemberships(queryStr, offset, limit, queryConditions.orderBy))
        .then( (results)  =>{
            var infos = [];
            for (var i = 0; i < results.length; ++i) {
                infos.push(convert2LogicInfo(results[i]));
            }
            return infos;
        })
};

exports.queryBy = (retRaw, queryStr) =>{
    return Promise.resolve(organizationMembershipModel.queryBy(retRaw, queryStr));
};

exports.getOrganizationMemberships = (retRaw, queryConditions) =>{
    var queryStr = generateQueryCondition(queryConditions);
        return Promise.resolve(organizationMembershipModel.queryOrganizationMemberships(retRaw, queryStr))
            .then( (results) => {
                var infos = [];
                for (var i = 0; i < results.length; ++i) {
                    infos.push(convert2LogicInfo(results[i]));
                }
                return infos;
            });
};