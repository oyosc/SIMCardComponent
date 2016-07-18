/**
 * Created by yansha on 2016/5/25.
 */
"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var knex = require('../models/knex').knex;
var utils = require('../common/utils');
var simCardModel = require('../models/simCardDB');
var organizationMembershipModel= require('../models/organizationMembershipDB');
//var storeMappingModel= require('../models/storeMappings');
var directoryModel= require('../models/directoryDB');
var groupMembershipProxy= require('../proxy/groupMembershipOperator');

function convert2DBInfo(info, isCreate) {
    var simArray = [
        'uuid',
        'ICCID',
        'IMSI',
        'phone',
        'openCardData',
        'packageType',
        'batchNO',
        'carrier',
        'package',
        'status',
        'businessStatus',
        'activeData',
        'useData',
        'SN',
        'directoryUUID',
        'createAt',
        'modifiedAt'
    ];
    info =common.saveCustomData(info, simArray);
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();
    var dbInfo = {
        'uuid' : utils.ifReturnStr(info.uuid, uuid),
        'ICCID' : utils.ifReturnStr(info.ICCID),
        'IMSI' : utils.ifReturnStr(info.IMSI),
        'phone': utils.ifReturnStr(info.phone),
        'openCardData': info.openCardData ? utils.ifReturnStr(moment(info.openCardData.getData()).format('YYYY-MM-DD HH:mm:ss')):null,
        'packageType' : utils.ifReturnStr(info.packageType),
        'batchNO' : utils.ifReturnStr(info.batchNO),
        'carrier' : utils.ifReturnStr(info.carrier),
        'package' : utils.ifReturnStr(info.package),
        'status' : utils.ifReturnStr(info.status),
        'businessStatus' : utils.ifReturnStr(info.businessStatus),
        'activeData' :  info.activeData ?utils.ifReturnStr(moment(info.activeData.getData()).format('YYYY-MM-DD HH:mm:ss')):null,
        'useData' :  info.useData ?utils.ifReturnStr(moment(info.useData.getData()).format('YYYY-MM-DD HH:mm:ss')):null,
        'SN': utils.ifReturnStr(info.SN),//需要获取
        'directoryUUID' : utils.ifReturnStr(info.directoryUUID),
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
        'ICCID' : utils.ifReturnStr(dbInfo.ICCID),
        'IMSI' : utils.ifReturnStr(dbInfo.IMSI),
        'phone': utils.ifReturnStr(dbInfo.phone),
        'openCardData': dbInfo.openCardData?utils.ifReturnStr(dbInfo.openCardData):'',
        'packageType' : utils.ifReturnStr(dbInfo.packageType),
        'batchNO' : utils.ifReturnStr(dbInfo.batchNO),
        'carrier' : utils.ifReturnStr(dbInfo.carrier),
        'package' : utils.ifReturnStr(dbInfo.package),
        'status' : utils.ifReturnStr(dbInfo.status),
        'businessStatus' : utils.ifReturnStr(dbInfo.businessStatus),
        'activeData' : dbInfo.activeData?utils.ifReturnStr(dbInfo.activeData):'',
        'useData' : dbInfo.useData?utils.ifReturnStr(dbInfo.useData):'',
        'SN': utils.ifReturnStr(dbInfo.SN),//需要获取
        'directoryUUID' : utils.ifReturnStr(dbInfo.directoryUUID),
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
        if(conditionItem =='offset' || conditionItem == 'limit' || conditionItem == 'expand'|| conditionItem == 'organizationUUID'|| conditionItem == 'groupUUID'|| conditionItem == 'tenantUUID'){
            continue;
        }
        ++size;
    }
    var queryStr = '', organizationStr='', tenantStr='', groupStr='';//, applicationStr=''
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
            case 'simCardUUIDArray':
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
                if(condition=='simCardUUIDArray'){
                    queryStr +=  'uuid  in (' + tmpStr + ')';
                }
                break;
            case 'organizationUUID':
                organizationStr += 'organizationUUID = \'' + queryCondition[condition] + '\' and type=\'directory\'';
                isContinue = true;
                break;
            case 'groupUUID':
                groupStr += 'groupUUID = \'' + queryCondition[condition] + '\'';
                isContinue = true;
                break;
           /* case 'applicationUUID':
                applicationStr += 'applicationUUID = \'' + queryCondition[condition] + '\' and storeType=\'directory\'';
                isContinue = true;
                break;*/

            case 'tenantUUID':
                tenantStr += 'tenantUUID = \'' + queryCondition[condition] + '\'';
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
    if(organizationStr!='') {
        return Promise.resolve(organizationMembershipModel.queryBy('storeUUID', organizationStr))
            .then((results) => {
                if (queryStr != '') {
                    queryStr += ' and ';
                }
                if (results.length > 0) {
                    queryStr += 'directoryUUID in (';
                    for (var i = 0; i < results.length; ++i) {
                        queryStr += '\'' + results[i].storeUUID + '\'';
                        if (i < results.length - 1) {
                            queryStr += ',';
                        }
                    }
                    queryStr += ')';
                } else {
                    queryStr += 'directoryUUID in (\'\')';
                }
                return queryStr;
            });
        }else if(groupStr){
            return Promise.resolve(groupMembershipProxy.queryBy('simCardUUID', groupStr))
                .then((results) => {
                    if (queryStr != '') {
                        queryStr += ' and ';
                    }
                    if (results.length > 0){
                        queryStr += 'uuid in (';
                        for (var i=0; i<results.length; ++i) {
                            queryStr += '\'' + results[i].simCardUUID + '\'';
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
    /*}else if(applicationStr!=''){
        return Promise.resolve(storeMappingModel.queryBy('storeUUID', applicationStr))
            .then((results) => {
                if (queryStr != '') {
                    queryStr += ' and ';
                }
                if (results.length > 0){
                    queryStr += 'directoryUUID in (';
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
            });*/
    }else if(tenantStr!=''){
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

exports.createSIMCard = (info)  =>{
    var data=convert2DBInfo(info, true);
    return Promise.resolve(simCardModel.createSIMCard(data)).then( (result) => {
        return  convertToProxyInfo(data);
    })
    /*return new Promise(function (resolve) {
        simCardModel.createSIMCard(data)
            .then(function () {
                resolve(convertToProxyInfo(data));
            })
    })*/
};

exports.updateSIMCard=(info) =>{
    var data=convert2DBInfo(info);
    return Promise.resolve(simCardModel.updateSIMCard(data)).then((result) => {
        return convertToProxyInfo(data);
    });
   /* return new Promise(function (resolve) {
        simCardModel.updateSIMCard(data)
            .then(function () {
                resolve(convertToProxyInfo(data));
            });
    });*/
}

exports.deleteSIMCard=(uuid) =>{
    //只逻辑删除
    return Promise.resolve(simCardModel.delSIMCard(uuid, 'deleteFlag', common.m_logicDeleteFlag));
   /* return new Promise(function (resolve) {
        simCardModel.delSIMCard(uuid, 'deleteFlag', common.m_logicDeleteFlag)
            .then(function (result) {
                resolve(result);
            });
    });*/
}

exports.retrieveSIMCard = (directoryUUID, uuid) =>{
    return Promise.resolve(simCardModel.retrieveSIMCard(uuid, directoryUUID)).then((results) => {
        var infos = [];
        for (var i = 0; i < results.length; ++i) {
            infos.push(convertToProxyInfo(results[i], true));
        }
        return infos;
    })
   /* return new Promise(function (resolve) {
        simCardModel.retrieveSIMCard(uuid, directoryUUID)
            .then((results) => {
                var infos = [];
                for (var i = 0; i < results.length; ++i) {
                    infos.push(convertToProxyInfo(results[i], true));
                }
                return infos;
            }).then(function (result) {
            resolve(result);
        });
    });*/
};

exports.getSIMCard = (uuid) =>{
    return Promise.resolve(simCardModel.getSIMCard(uuid)).then((results) =>{
        var infos = [];
        for (var i = 0; i < results.length; ++i) {
            infos.push(convertToProxyInfo(results[i], true));
        }
        return infos;
    });
};

exports.getCount = (directoryUUID, queryConditions, groupUUID, organizationUUID, carrierUUID, tenantUUID) =>{
    //return new Promise(function (resolve) {
        if(organizationUUID){
            queryConditions.organizationUUID = organizationUUID;
        }
        if(groupUUID){
            queryConditions.groupUUID = groupUUID;
        }
        if(tenantUUID){
            queryConditions.tenantUUID = tenantUUID;
        }
        return  Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
            delete  queryConditions.organizationUUID;
            delete  queryConditions.groupUUID;
           // delete  queryConditions.applicationUUID;
            delete  queryConditions.tenantUUID;
            if ( directoryUUID != null) {
                queryStr += 'and directoryUUID = \'' + directoryUUID + '\'';
            }
            return Promise.resolve(simCardModel.getCount(queryStr)).then((results) => {
                return results[0].count;
            });
           /* Promise.resolve(
                simCardModel.getCount(queryStr).then((results) => {
                    if(results != null){
                        resolve(results[0].count);

                    }
                })
            );*/
       /* }).catch(function(err){
            console.log('err:'+err);
        });*/
    })
};

exports.querySIMCards = (directoryUUID, queryConditions, offset, limit, groupUUID, organizationUUID, carrierUUID, tenantUUID) =>{
    //return new Promise(function (resolve) {
        if(organizationUUID){
            queryConditions.organizationUUID = organizationUUID;
        }
        if(groupUUID){
            queryConditions.groupUUID = groupUUID;
        }
       /* if(applicationUUID){
            queryConditions.applicationUUID = applicationUUID;
        }*/
        if(tenantUUID){
            queryConditions.tenantUUID = tenantUUID;
        }
        return  Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) =>{
            delete  queryConditions.organizationUUID;
            //delete  queryConditions.applicationUUID;
            delete  queryConditions.groupUUID;
            delete  queryConditions.tenantUUID;
            if( directoryUUID != null){
                queryStr += 'and directoryUUID = \'' + directoryUUID + '\'';
            }
            return  Promise.resolve(simCardModel.querySIMCards(queryStr, offset, limit, queryConditions.orderBy, null))
                .then((results) => {
                    var infos = [];
                    for (var i = 0; i < results.length; ++i) {
                        infos.push(convertToProxyInfo(results[i]));
                    }
                    return infos;
                    //resolve(infos);
                })
       /* }).catch(function(err){
            console.log('err:'+err);
        });*/
    })
};

exports.queryBy = (retRaw, queryStr) =>{
    return Promise.resolve(simCardModel.queryBy(retRaw, queryStr));
};

exports.getSIMCards= (retRaw, queryConditions) =>{
    var queryStr = generateQueryCondition(queryConditions);
    return Promise.resolve(simCardModel.queryBy(retRaw, queryStr));
};
