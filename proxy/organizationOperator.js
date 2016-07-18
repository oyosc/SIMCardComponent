/**
 * Copyright(C),
 * FileName:  organizationOperator.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/17  19:00
 * Description:
 */

"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var organizationModel = require('../models/organizationDB');
var organizationMembershipModel = require('../models/organizationMembershipDB');
//var storeMappingModel= require('../models/storeMappings');

function convert2DBInfo(info, isCreate){
    var orgArray = [
        'uuid',
        'name',
        'description',
        'status',
        'tenantUUID',
        'createAt',
        'modifiedAt'
    ];
    info =common.saveCustomData(info, orgArray);
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();

    var dbInfo = {
        'uuid': utils.ifReturnStr(info.uuid, uuid),
        'name': utils.ifReturnStr(info.name),
        'status': utils.ifReturnStr(info.status, 'ENABLED'),
        'description': utils.ifReturnStr(info.description),
        'tenantUUID' : utils.ifReturnStr(info.tenantUUID),
        'modifiedAt': dateTime,
        'customData' :utils.ifReturnJson(info.customData)
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
    }

    return dbInfo;
}

function convert2LogicInfo(dbInfo) {
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'name': utils.ifReturnStr(dbInfo.name),
        'status': utils.ifReturnStr(dbInfo.status),
        'description': utils.ifReturnStr(dbInfo.description),
        'tenantUUID' : utils.ifReturnStr(dbInfo.tenantUUID),
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

    var size = 0;
    for (var conditionItem in queryCondition) {
        if (conditionItem == 'offset' || conditionItem == 'limit' || conditionItem == 'expand' || conditionItem == 'orderBy' || conditionItem == 'directoryUUID'  || conditionItem == 'groupUUID' || conditionItem == 'applicationUUID' ){
            continue;
        }
        ++size;
    }
    var queryStr = '', directoryStr='';//,applicationStr='';
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
                }else {
                    var reg = /\*/g;
                    var str = queryCondition[condition].replace(reg, '%');
                    queryStr += 'name  like \'' + str + '\'';
                }
                break;
            case 'organizationUUIDArray':
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
                queryStr += 'uuid  in (' + tmpStr + ')';
                break;

            case 'directoryUUID' :
                directoryStr += 'storeUUID = \'' + queryCondition[condition] + '\' and type= \'directory\'';
                isContinue = true;
                break;
            case 'groupUUID' :
                directoryStr += 'storeUUID = \'' + queryCondition[condition] + '\' and type= \'group\'';
                isContinue = true;
                break;
           /* case 'applicationUUID' :
                applicationStr += 'applicationUUID = \'' + queryCondition[condition] + '\' and storeType= \'organization\'';
                isContinue = true;
                break;*/

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

    if(directoryStr!=''){
        return Promise.resolve(organizationMembershipModel.queryBy('organizationUUID', directoryStr))
            .then((results) =>{
                if (queryStr != '') {
                    queryStr += ' and ';
                }
                if (results.length > 0){
                    queryStr += 'uuid in (';
                    for (var i = 0; i < results.length; ++i) {
                        queryStr += '\'' + results[i].organizationUUID + '\'';
                        if (i < results.length - 1) {
                            queryStr += ',';
                        }
                    }
                    queryStr += ')';
                }else{
                    queryStr += 'uuid in (\'\')';
                }
                return queryStr;
            });
    } else{
        return queryStr;
    }
}

exports.createOrganization = (info) =>{
    var data = convert2DBInfo(info, true);
        return Promise.resolve(organizationModel.createOrganization(data))
            .then( (rows) =>{
                return convert2LogicInfo(data);
            });
};

exports.updateOrganization=(info) =>{
    var data=convert2DBInfo(info);
        return Promise.resolve(organizationModel.updateOrganization(data))
            .then( (result) =>{
                return convert2LogicInfo(data);
            });
}

exports.deleteOrganization=(uuid) =>{
    //只逻辑删除
    return Promise.resolve(organizationModel.delOrganization(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.retrieveOrganization = (tenantUUID, uuid) =>{
        return Promise.resolve(organizationModel.retrieveOrganization(uuid, tenantUUID))
            .then( (results) => {
                var infos = [];
                for (var i = 0; i < results.length; ++i) {
                    infos.push(convert2LogicInfo(results[i]));
                }
                return infos;
            });
};

exports.getCount = (tenantUUID, queryConditions, directoryUUID, groupUUID) =>{
        if(directoryUUID){
            queryConditions.directoryUUID=directoryUUID;
        }
        if(groupUUID){
            queryConditions.groupUUID=groupUUID;
        }
        return Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) =>{
            delete queryConditions.directoryUUID;
            delete queryConditions.groupUUID;
            if(queryStr!=''){
                queryStr +=' and tenantUUID =\'' + tenantUUID + '\'';
            }
            return  Promise.resolve(organizationModel.getCount(queryStr)).then( (results) => {
                return results[0].count;
            });
        });
};

exports.queryOrganizations = (tenantUUID, queryConditions, offset, limit, directoryUUID, groupUUID, applicationUUID) =>{
        if(directoryUUID){
            queryConditions.directoryUUID=directoryUUID;
        }
        if(groupUUID){
            queryConditions.groupUUID=groupUUID;
        }
        if(applicationUUID){
            queryConditions.applicationUUID=applicationUUID;
        }
      return Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) =>{
            delete queryConditions.directoryUUID;
            delete queryConditions.groupUUID;
            delete queryConditions.applicationUUID;
            if(queryStr!=''&&queryStr.indexOf('tenantUUID')<0){
                queryStr +=' and tenantUUID =\'' + tenantUUID + '\'';
            }
          return Promise.resolve(organizationModel.queryOrganizations(queryStr, offset, limit, queryConditions.orderBy))
                .then( (results) => {
                    var infos = [];
                    for (var i = 0; i < results.length; ++i) {
                        infos.push(convert2LogicInfo(results[i]));
                    }
                    return infos;
                })
        });
};

exports.queryBy = (retRaw, queryStr) =>{
   return Promise.resolve(organizationModel.queryBy(retRaw, queryStr));
};

exports.getOrganizationByTenant = (tenantUUID) => {
    var infos = [];
    return Promise.resolve(organizationModel.getOrganizationByTenant(tenantUUID)).then( (results) => {
        if (results.length == 0) {
            return results;
        }
        infos.push(convert2LogicInfo(results[0]));
        return infos;
    });
}