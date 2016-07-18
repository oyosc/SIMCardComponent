/**
 * Created by Administrator on 2016/6/1.
 */
'use strict';
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var batchNumbersModel = require('../models/batchNumberDB');
var errorCodeTable = require('../common/errorCodeTable');

var convert2LogicInfo = (dbInfo) => {
    dbInfo.createAt  = moment(dbInfo.createAt).format('YYYY-MM-DD HH:mm:ss');
    dbInfo.modifiedAt = moment(dbInfo.modifiedAt).format('YYYY-MM-DD HH:mm:ss');
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'batchNumber' : utils.ifReturnStr(dbInfo.batchNumber),
        'batchNORuleUUID': utils.ifReturnStr(dbInfo.batchNORuleUUID),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt),
    };
    return info;
}

const generateQueryCondition = (queryCondition) => {
    var size = 0;
    for (var conditionItem in queryCondition) {
        if (conditionItem == 'offset' || conditionItem == 'limit' || conditionItem == 'expand' || conditionItem == 'orderBy' || conditionItem == 'orderUUID'|| conditionItem == 'orderURL') {
            continue;
        }
        ++size;
    }
    var queryStr = '';
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

var convert2DBInfo = (info, isCreate) => {
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();
    var dbInfo = {
        'uuid': utils.ifReturnStr(info.uuid, uuid),
        'batchNumber' : utils.ifReturnStr(info.batchNumber),
        'modifiedAt': dateTime
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
        dbInfo.batchNORuleUUID = utils.ifReturnStr(info.batchNORuleUUID)
    }
    return dbInfo;
}

exports.addSerialNumber = (serialNumberAdd, serialNumber) => {
    return Promise.resolve(batchNumbersModel.addSerialNumber(serialNumberAdd, serialNumber));
};

exports.queryBy = (retRaw, queryStr) => {
    return Promise.resolve(batchNumbersModel.queryBy(retRaw, queryStr));
};

exports.getBatchNORules = (batchNORuleUUID) => {
    return Promise.resolve(batchNumbersModel.getBatchNORules(batchNORuleUUID));
};

exports.createBatchNumber= (info) => {
    var data = convert2DBInfo(info, true);
    var data1 = convert2LogicInfo(data, info.tenantUUID);
    return  Promise.all([data1, batchNumbersModel.createBatchNumber(data)]);
}

exports.retrieveBatchNumber = (uuid) => {
    var infos = [];
    return Promise.resolve(batchNumbersModel.retrieveBatchNumber(uuid)).then((results) => {
        if(results.length == 0) {
            return results
        }
        infos.push(convert2LogicInfo(results[0]));
        return infos;
    });
};

exports.deleteBatchNumber=(uuid) => {
    //只逻辑删除
    return Promise.resolve(batchNumbersModel.deleteBatchNumber(uuid, 'deleteFlag', common.m_logicDeleteFlag));
}

exports.queryBatchNumber = (queryConditions, offset, limit) => {
    return Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
        return batchNumbersModel.queryBatchNumber(queryStr, offset, limit, queryConditions.orderBy).then((results) => {
            var infos = [];
            if(results != null) {
                for (var i = 0; i < results.length; i++) {
                    infos.push(convert2LogicInfo(results[i]));
                }
            }
            return infos;
        });
    });
    //return new Promise((resolve) =>{
    //    Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr)=>{
    //        Promise.resolve(batchNumbersModel.queryBatchNumber(queryStr, offset, limit, queryConditions.orderBy))
    //            .then((results)=>{
    //                var infos = [];
    //                if(results != null){
    //                    for (var i = 0; i < results.length; i++) {
    //                        infos.push(convert2LogicInfo(results[i]));
    //                    }
    //                }
    //                resolve(infos);
    //            });
    //    }).catch((err)=>{
    //        console.log('BatchNumber:'+err);
    //    });
    //})
}

exports.getCount = function(queryConditions){
    var queryStr = generateQueryCondition(queryConditions);
    return Promise.resolve(batchNumbersModel.getCount(queryStr));
};

exports.getBatchNumberByRule = (batchNORuleUUID) => {
    return Promise.resolve(batchNumbersModel.getBatchNumberByRule(batchNORuleUUID));
};