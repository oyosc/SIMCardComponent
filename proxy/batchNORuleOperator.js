/**
 * Created by Administrator on 2016/5/30.
 */
"use strict";
var common = require('../controllers/common');
var moment = require('moment');
var utils = require('../common/utils');
var batchNoRulesModel = require('../models/batchNORuleDB');

var convert2LogicInfo = (dbInfo) => {
    dbInfo.createAt  = moment(dbInfo.createAt).format('YYYY-MM-DD HH:mm:ss');
    dbInfo.modifiedAt = moment(dbInfo.modifiedAt).format('YYYY-MM-DD HH:mm:ss');
    var info = {
        'uuid': utils.ifReturnStr(dbInfo.uuid),
        'rule': utils.ifReturnStr(dbInfo.rule),
        'complementCode': utils.ifReturnStr(dbInfo.complementCode),
        'tenantUUID' : utils.ifReturnStr(dbInfo.tenantUUID),
        'createAt' : utils.ifReturnStr(dbInfo.createAt),
        'modifiedAt': utils.ifReturnStr(dbInfo.modifiedAt)
    };
    return info;
}

var convert2DBInfo = (info, isCreate) => {
    var dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var uuid = utils.createUUID();

    var dbInfo = {
        'uuid' : utils.ifReturnStr(info.uuid, uuid),
        'rule' : utils.ifReturnStr(info.rule),
        'complementCode' : utils.ifReturnStr(info.complementCode),
        'tenantUUID' : utils.ifReturnStr(info.tenantUUID),
        'modifiedAt' : dateTime
    };
    if(isCreate) {
        dbInfo.createAt = dateTime;
    }

    return dbInfo;
}

var  generateQueryCondition = (queryCondition) => {
    var size = 0;
    for(var conditionItem in queryCondition) {
        if(conditionItem =='offset' || conditionItem == 'limit' || conditionItem == 'expand'){
            continue;
        }
        ++size;
    }
    var queryStr = '';//, organizationStr=''
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

    return queryStr;

}

exports.createBatchNoRules = (info) => {
    var data = convert2DBInfo(info, true);
    return Promise.resolve(batchNoRulesModel.createBatchNORules(data)).then(() => {
        return convert2LogicInfo(data);
    })
}

exports.updateBatchNoRules = (info) =>{
    var data = convert2DBInfo(info);
    return Promise.resolve(batchNoRulesModel.updateBatchNORules(data)).then(() => {
        data.tenantUUID = info.tenantUUID;
        return  convert2LogicInfo(data);
    });
}

exports.deleteBatchNoRule = (uuid) => {
    return Promise.resolve(
        batchNoRulesModel.delBatchNORule(uuid, 'deleteFlag', common.m_logicDeleteFlag)
    );
};

exports.retrieveBatchNoRule = (tenantUUID, uuid) => {
    return Promise.resolve(batchNoRulesModel.retrieveBatchNORule(uuid, tenantUUID)).then((results) => {
        var infos = [];
                for (var i = 0; i < results.length; i++) {
                    infos.push(convert2LogicInfo(results[i]));
                }
                return infos;
    });
    //return new Promise((resolve) => {
    //    batchNoRulesModel.retrieveBatchNORule(uuid, tenantUUID).then(function(results){
    //        var infos = [];
    //        for (var i = 0; i < results.length; i++) {
    //            infos.push(convert2LogicInfo(results[i]));
    //        }
    //        return infos;
    //    }).then(function (result) {
    //        return resolve(result);
    //    });
    //});
}

exports.queryBy = (retRaw, queryStr) => {
    return Promise.resolve(batchNoRulesModel.queryBy(retRaw, queryStr));
    //return new Promise( (resolve) => {
    //    batchNoRulesModel.queryBy(retRaw, queryStr)
    //        .then((results) => {
    //            resolve(results);
    //        });
    //});
};

exports.queryBatchNoRule = (tenantUUID, queryConditions, offset, limit) => {
    return Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) =>{
        if(queryStr != ''){
                        queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
                    }
        return Promise.resolve(batchNoRulesModel.queryBatchNORule(queryStr, offset, limit, queryConditions.orderBy));
    }).then((results) =>{
        var infos = [];
                        if(results != null){
                            for (var i = 0; i < results.length; i++) {
                                infos.push(convert2LogicInfo(results[i]));
                            }
                        }
        return infos;
    });
    //return new Promise( (resolve) => {
    //    Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
    //        if(queryStr != ''){
    //            queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
    //        }
    //        Promise.resolve(batchNoRulesModel.queryBatchNORule(queryStr, offset, limit, queryConditions.orderBy))
    //            .then((results) => {
    //                var infos = [];
    //                if(results != null){
    //                    for (var i = 0; i < results.length; i++) {
    //                        infos.push(convert2LogicInfo(results[i]));
    //                    }
    //                }
    //                resolve(infos);
    //            });
    //    }).catch((err) => {
    //        console.log('BatchNoRule:'+err);
    //    });
    //})
}

exports.getCount = (tenantUUID, queryConditions) => {
    return Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
        if(queryStr != ''){
                        queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
                    }
        return  batchNoRulesModel.getCount(queryStr);
    }).then((results) => {
        if(results != null){
                                return results[0].count;
    }
    });
    //return new Promise( (resolve) => {
    //    Promise.resolve(generateQueryCondition(queryConditions)).then((queryStr) => {
    //        if(queryStr != ''){
    //            queryStr += 'and tenantUUID = \'' + tenantUUID + '\'';
    //        }
    //        Promise.resolve(
    //            batchNoRulesModel.getCount(queryStr).then( (results) => {
    //                if(results != null){
    //                    resolve(results[0].count);
    //                }
    //            })
    //        );
    //    }).catch((err) => {
    //        console.log('BatchNoRule:'+err);
    //    });
    //})
};
