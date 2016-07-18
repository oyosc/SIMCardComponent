/**
 * Created by yansha on 2016/5/25.
 */
"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var knex = require('../models/knex').knex;
var utils = require('../common/utils');
var flowModel = require('../models/flowDB');
var organizationMembershipModel= require('../models/organizationMembershipDB');
//var storeMappingModel= require('../models/storeMappings');
var directoryModel= require('../models/directoryDB');
var groupMembershipProxy= require('../proxy/groupMembershipOperator');

function convert2DBInfo(info, isCreate) {
    var flowArray = [
        'uuid',
        'type',
        'beginTime',
        'endTime',
        'total',
        'simCardUUID',
        'createAt',
        'modifiedAt'
    ];
    info =common.saveCustomData(info, flowArray);
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();
    var dbInfo = {
        'uuid' : utils.ifReturnStr(info.uuid, uuid),
        'type' : utils.ifReturnStr(info.type),
        'beginTime' : utils.ifReturnStr(info.beginTime),
        'endTime' : utils.ifReturnStr(info.endTime),
        'total' : utils.ifReturnNum(info.total),
        'simCardUUID' : utils.ifReturnStr(info.simCardUUID),
        'modifiedAt' : dateTime,
        'customData' :utils.ifReturnJson(info.customData)
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
    }

    return dbInfo;
}

function convertToProxyInfo(dbInfo) {
    dbInfo.createAt  = moment(dbInfo.createAt).format('YYYY-MM-DD HH:mm:ss');
    dbInfo.modifiedAt = moment(dbInfo.modifiedAt).format('YYYY-MM-DD HH:mm:ss');
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'type' : utils.ifReturnStr(dbInfo.type),
        'beginTime' : utils.ifReturnStr(dbInfo.beginTime),
        'endTime' : utils.ifReturnStr(dbInfo.endTime),
        'total' : utils.ifReturnNum(dbInfo.total),
        'simCardUUID' : utils.ifReturnStr(dbInfo.simCardUUID),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt)
    };

    if (dbInfo.customData) {
        info.customData = JSON.parse(dbInfo.customData);
        info = common.getCustomData(info);
    }
    return info;
}
function generateQueryCondition(queryCondition){

    var size = 0;
    for(var conditionItem in queryCondition) {
        if(conditionItem =='offset' || conditionItem == 'limit' || conditionItem == 'expand' || conditionItem == 'tenantUUID'|| conditionItem == 'count' ){
            continue;
        }
        ++size;
    }
    var queryStr = '',  tenantStr='';//, applicationStr=''
    var i = 0;
    for(var condition in queryCondition){
        var isContinue = false;
        switch(condition){
            case 'uuid':case 'status':
            queryStr += condition + '= \'' + queryCondition[condition] + '\'';
            break;
            case 'name':case 'carrier':
            if(queryCondition[condition].indexOf('*') == -1){
                queryStr += 'name = \'' + queryCondition[condition] + '\'';
            } else{
                var reg = /\*/g;
                var str = queryCondition[condition].replace(reg, '%');
                queryStr += 'name like \'' + str + '\'';
            }
            break;
            case 'flowUUIDArray':
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
                if(condition=='flowUUIDArray'){
                    queryStr +=  'uuid  in (' + tmpStr + ')';
                }
                break;
            case 'tenantUUID':
                tenantStr += 'tenantUUID = \'' + queryCondition[condition] + '\'';
                isContinue = true;
                break;

            case 'expand':case 'offset':case 'limit': case 'count':
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
    if(tenantStr!=''){
        return Promise.resolve(directoryModel.queryBy('tenantUUID', tenantStr))
            .then((results) => {
                if (queryStr != '') {
                    queryStr += ' and ';
                }
                if (results.length > 0){
                    queryStr += 'directoryUUID in (';
                    for (var i=0; i<results.length; ++i) {
                        queryStr += '\'' + results[i].uuid + '\'';
                        if (i < results.length-1) {
                            queryStr += ',';
                        }
                    }
                    queryStr += ')';
                }else{
                    queryStr += 'directoryUUID in (\'\')';
                }
                return queryStr;
            });
    }else {
        return queryStr;
    }

}

exports.createFlow = (info)  =>{
    var data=convert2DBInfo(info, true);
    return Promise.resolve(flowModel.createFlow(data)).then( (result) => {
        return  convertToProxyInfo(data);
    })
};

exports.updateFlow=(info) =>{
    var data=convert2DBInfo(info);
    return Promise.resolve(flowModel.updateFlow(data)).then((result) => {
        return convertToProxyInfo(data);
    });
}

exports.deleteFlow=(uuid) =>{
    //只逻辑删除
    return Promise.resolve(flowModel.delFlow(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.retrieveFlow = (simCardUUID, uuid) =>{
    return Promise.resolve(flowModel.retrieveFlow(uuid, simCardUUID)).then((results) => {
        var infos = [];
        for (var i = 0; i < results.length; ++i) {
            infos.push(convertToProxyInfo(results[i], true));
        }
        return infos;
    })
};

exports.getFlow = (uuid) =>{
    return Promise.resolve(flowModel.getFlow(uuid)).then((results) =>{
        var infos = [];
        for (var i = 0; i < results.length; ++i) {
            infos.push(convertToProxyInfo(results[i], true));
        }
        return infos;
    });
};

exports.getCount = (simCardUUID, queryConditions, directoryUUID, tenantUUID) =>{
    if(directoryUUID){
        queryConditions.directoryUUID = directoryUUID;
    }
    if(tenantUUID){
        queryConditions.tenantUUID = tenantUUID;
    }
    return  Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
        delete  queryConditions.directoryUUID;
        delete  queryConditions.tenantUUID;
        if ( simCardUUID != null) {
            queryStr += 'and simCardUUID = \'' + simCardUUID + '\'';
        }
        return Promise.resolve(flowModel.getCount(queryStr)).then((results) => {
            return results[0].count;
        });
    })
};

exports.queryFlows = (simCardUUID, queryConditions, offset, limit, directoryUUID, tenantUUID) =>{

    if(tenantUUID){
        queryConditions.tenantUUID = tenantUUID;
    }
    if(directoryUUID){
        queryConditions.directoryUUID = directoryUUID;
    }
    return  Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) =>{
        delete  queryConditions.directoryUUID;
        delete  queryConditions.tenantUUID;
        if( simCardUUID != null){
            queryStr += 'and simCardUUID = \'' + simCardUUID + '\'';
        }
        return  Promise.resolve(flowModel.queryFlows(queryStr, offset, limit, queryConditions.orderBy, null))
            .then((results) => {
                var infos = [];
                for (var i = 0; i < results.length; ++i) {
                    infos.push(convertToProxyInfo(results[i]));
                }
                return infos;
            })
    })
};

exports.queryBy = (retRaw, queryStr) =>{
    return Promise.resolve(flowModel.queryBy(retRaw, queryStr));
};

exports.getFlows= (retRaw, queryConditions) =>{
    var queryStr = generateQueryCondition(queryConditions);
    return Promise.resolve(flowModel.queryBy(retRaw, queryStr));
};
exports.getMonthFlows=(simCardUUID, queryConditions, directoryUUID, tenantUUID)=>{
    if(directoryUUID){
        queryConditions.directoryUUID = directoryUUID;
    }
    if(tenantUUID){
        queryConditions.tenantUUID = tenantUUID;
    }
    var isTime=false;
    if(queryConditions.beginTime || queryConditions.endTime){
        isTime=true;
    }
    return  Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
        delete  queryConditions.directoryUUID;
        delete  queryConditions.tenantUUID;
        if ( simCardUUID != null) {
            queryStr += ' and simCardUUID = \'' + simCardUUID + '\'';
        }
        return Promise.resolve(flowModel.getMonthFlows(isTime, queryStr)).then((results) => {
            return results[0].sum;
        });
    })
};
