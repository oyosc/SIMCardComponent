/**
 * Created by Administrator on 2016/5/19.
 */

/**
 * @apiDefine BatchNumber BatchNumber
 *
 * 批次号(BatchNumber)资源是SIM卡批次号
 *
 */
var common = require('./common');
var contentType = require('./common').retContentType;
var returnResources = require('./returnResources');
var utils= require('../common/utils');
var config = require("../config/config.js");
var batchNumbersProxy = require("../proxy/batchNumberOperator");
var moment = require('moment');
var serialNumbersModel = require("../models/serialNumberDB");
var batchNORuleProxy = require("../proxy/batchNORuleOperator");
var tenantProxy = require("../proxy/tenantOperator");
var eventProxy = require('eventproxy');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');

function isTenantExist(tenantUUID){
    var queryStr = 'uuid=\'' + tenantUUID + '\'';
    return Promise.resolve(tenantProxy.queryBy('uuid', queryStr))
        .then((results) =>{
            var judge = common.isOnly(null, results.length);
            if(judge.is) {
                return results[0];
            }
            if(judge.flag == 1) {
                judge.error.description = 'Could not find the resources you want to query tenant.the query string: ' + queryStr;
            } else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query tenant. the query string: ' + queryStr;
            }
            return judge;
        });
}

var isExist = (name, uuid) => {
    var queryStr ;
    if(name) {
        queryStr = 'name=\''+ name + '\'';
    } else{
        queryStr = 'uuid=\''+ uuid + '\'';
    }
    return new Promise((resolve) => {
        batchNumbersProxy.queryBy(null, queryStr).then((results) => {
            var judge = common.isOnly(null, results.length);
            if(judge.is) {
                resolve(results[0]);
            }
            var error = judge.error;
            if(judge.flag == 1) {
                error.description = 'Could not find the resources you want to query Organization.the query string: ' + queryStr;
            } else if(judge.flag == 2) {
                error.description = 'Find much resource when query Organization. the query string: ' + queryStr;
            }
            resolve( error);
        });
    })
}

var isValidQueryCondition = (queryCondition) => {
    for(var item in queryCondition) {
        switch(item) {
            case 'uuid' : case 'name' :case 'status':
            case 'createAt' :  case 'modifiedAt' :
            case 'expand':case 'offset': case 'limit':
            break;
            default:
                return false;
        }
    }
    return true;
}

var getBatchNORule = (batchNORuleUUID, tenantUUID) =>{
    return Promise.resolve(batchNORuleProxy.retrieveBatchNoRule(tenantUUID, batchNORuleUUID));
}

var getTenant = (tenantUUID) => {
    return Promise.resolve(tenantProxy.retrieveTenant(tenantUUID));
}

function getExpandStr(expandStr, data,  tenantUUID){
    var result = new Array;
    var i = 0;
    var expandArray = expandStr.split(';');
    for(var x in expandArray){
        var retExpand = common.getExpand(expandArray[x]);
        if(retExpand[0] == 'batchNORule'){
            result[i] = getBatchNORule(data.batchNORuleUUID, tenantUUID).then(function(result){
                if(result.length == 0){
                    return result;
                }
                result[0].tag = 'batchNORule';
                return result[0];
            });
            i++;
        }
        if(retExpand[0] == 'tenant'){
            result[i] = getBatchNORule(data.batchNORuleUUID, tenantUUID).then(function(batchNORuleResult){
                if(batchNORuleResult.length == 0){
                    return batchNORuleResult;
                }
                return getTenant(batchNORuleResult[0].tenantUUID);
            }).then(function(result){
                if(result.length == 0){
                    return result;
                }
                result[0].tag = 'tenant';
                return result[0];
            });
            i++;
        }
    }
    return Promise.all(result);
}

/**
 * @api {post} /:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers CreateBatchNumber
 * @apiName CreateBatchNumber
 * @apiVersion 1.0.0
 * @apiGroup BatchNumber
 * @apiDescription  创建一个批次号
 *
 * @apiParam (input) {string} batchNumber 批次号
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} batchNORule批次号规则URL链接，见[BatchNORule](#api-BatchNORule)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers
 * Content-Type: application/json;charset=UTF-8
 * {
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F",
 *   "batchNumber": "2015091007",
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "batchNORule" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
var createBatchNumberV1 = (req, res) => {
    var info = req.body;
    if (!utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error.status = 400;
        error.description = '输入参数有误';
        return common.errorReturn(res, error.status, error);
    }
    var  tenantUUID = req.params.tenantUUID;
    info.batchNORuleUUID = req.params.batchNORuleUUID;
    var dateFormat = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    var queryStr = 'createAt= \'' + dateFormat + '\'';
    var getBatchNORules = batchNumbersProxy.getBatchNORules(info.batchNORuleUUID);
    var dateJudge = serialNumbersModel.getSerialNumber(queryStr);
    function createBatchNumber(info) {
        return Promise.resolve(batchNumbersProxy.createBatchNumber(info));
    }
    var ep = new eventProxy();
    ep.on('send_Message', function(bodyDataJson){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    Promise.all([dateJudge, getBatchNORules]).then((result) =>{
        if(!result[1]){
            throw result[1];
        }else {
            var batchRule = result[1][0].rule;
            var complementCode = result[1][0].complementCode;
            var yChars = '', fChars = '';
            var batchArray = batchRule.split('');
            for (var i = 0; i < batchArray.length; i++) {
                switch (batchArray[i]) {
                    case 'Y':
                        yChars += 'Y';
                        break;
                    case 'F':
                        fChars += 'F';
                        break;
                    case '0':
                        fChars += '0';
                        break;
                        break;
                }
            }
            var judgeSerial;
            if (result[0].length> 0) {
                if (result[0][0].batchNumber < parseInt(fChars, 16)) {
                    judgeSerial = serialNumbersModel.updateSerialNumber(result[0][0].createAt, 'batchNumber', (result[0][0].batchNumber + 1));
                } else {
                    return false;
                }
            } else {
                var infoSerial = {
                    'batchNumber': 1,
                    'createAt': dateFormat
                }
                judgeSerial = serialNumbersModel.createSerialNumber(infoSerial);
            }
            return Promise.all([judgeSerial, info, fChars, batchRule, complementCode, yChars]);
        }
    }).then((allResult) =>{
        if(allResult[0].length<1){
            throw allResult[0]
        }else{
            var batchRule = allResult[3];
            var fChars = allResult[2];
            var complementCode = allResult[4];
            var year = new Date().getFullYear().toString();
            var yChars = allResult[5];
            var serialLength;
            var batchRuleByChange;
            return  dateJudge.then((dateResult) => {
                switch (yChars.length){
                    case 1:
                        batchRuleByChange = batchRule.replace(/Y/, year.substr(4,1));
                        break;
                    case 2:
                        batchRuleByChange =  batchRule.replace(/YY/,year.substr(3,2));
                        break;
                    case 4:
                        batchRuleByChange = batchRule.replace(/YYYY/, 2016);
                        break
                        break;
                }
                var reg = new RegExp(fChars);
                if(fChars.indexOf('F')>=0){
                    if(dateResult[0].batchNumber.toString(16).length < fChars.length) {
                        serialLength = fChars.length - dateResult[0].batchNumber.toString(16).length;
                        for (var i = 0; i < fChars.length - 1; i++) {
                            complementCode += complementCode;
                        }
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else if(dateResult[0].batchNumber.toString(16).length == fChars.length){
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else{
                        return false;
                    }
                }else  if(fChars.indexOf('0')>=0){
                    if(dateResult[0].batchNumber.length < fChars.length){
                        serialLength = fChars.length - dateResult[0].batchNumber.length;
                        for(var i =0;i<serialLength; i++){
                            complementCode += complementCode;
                        }
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else if(dateResult[0].batchNumber.toString(16).length == fChars.length){
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                var month = new Date().getMonth() + 1;
                var week = new Date().getDay();
                var monthChange = (month<10?'0':'') +month;
                var weekChange = '0' + week;
                batchRuleByChange = batchRuleByChange.replace(/WW/, weekChange);
                batchRuleByChange = batchRuleByChange.replace(/MM/, monthChange);
                batchRuleByChange = batchRuleByChange.replace(/DD/, new Date().getDate());
                info.batchNumber = batchRuleByChange;
                return createBatchNumber(info);
            });
        }
    }).then((Result)=> {
        var bodyDataJson = returnResources.generateBatchNumbersRetInfo(tenantUUID, Result[0]);
        ep.emit('send_Message', bodyDataJson);
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
    }).catch((err) => {
        if(!err.flag){
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.status, err);
        return;
    });
}

exports.createBatchNumber = function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        createBatchNumberV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers/:batchNumberUUID RetrieveBatchNumber
 * @apiName RetrieveBatchNumber
 * @apiVersion 1.0.0
 * @apiGroup BatchNumber
 * @apiDescription  获取指定批次号信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNORule、tenant或他们的组合，中间用','号隔开
 *
 * @apiParam (input) {string} batchNumber 批次号
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} batchNORule批次号规则URL链接，见[BatchNORule](#api-BatchNORule)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F",
 *   "batchNumber": "2015091007",
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "batchNORule" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
var retrieveBatchNumberV1= (req, res) => {
    var info = req.body;
    info.uuid = req.params.batchNumberUUID;
    var getExist = isExist(null, info.uuid);
    var expandStr=req.query.expand;
    if ( !utils.checkUUID(req.params.batchNumberUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        return common.errorReturn(res, error.status, error);
    }
    info.tenantUUID = req.params.tenantUUID;
    var tenantUUID = info.tenantUUID;
    const retrieveBatchNumber = (uuid ) => {
        return Promise.resolve(batchNumbersProxy.retrieveBatchNumber(uuid ));
    }
    retrieveBatchNumber(info.uuid).then((results) => {
        var judge = common.isOnly(null, results.length);
        if(judge.is) {
            var bodyDataJson = returnResources.generateBatchNumbersRetInfo(tenantUUID, results[0]);
            if(!expandStr){
                return bodyDataJson;
            }
            return getExpandStr(expandStr, results[0], tenantUUID).then(function(result){
                for(var x in result){
                    if(result[x].tag =='tenant'){
                        var resultTenant = returnResources.generateTenantRetInfo( result[x])
                        bodyDataJson['tenants'] =resultTenant;
                    }
                    if(result[x].tag =='batchNORule'){
                        var resultBatchNORule = returnResources.generateBatchNORuleRetInfo(result[x]);
                        bodyDataJson['batchNORules'] =resultBatchNORule;
                    }
                }
                return bodyDataJson;
            });
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve batchNumber.the uuid: ' + info.uuid;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve batchNumber. the uuid: ' + info.uuid;
        }
    }).then((bodyInfo) => {
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
        return;
    }).catch((err) => {
        if(!err.flag){
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.status, err);
        return;
    });
}

exports.retrieveBatchNumber = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveBatchNumberV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {delete} /:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers/:batchNumberUUID DeleteBatchNumber
 * @apiName DeleteBatchNumber
 * @apiVersion 1.0.0
 * @apiGroup BatchNumber
 * @apiDescription  删除指定批次号信息
 * @apiParamExample Example Request
 * Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */
var deleteBatchNumberV1=(req, res) => {
    if ( !utils.checkUUID(req.params.batchNumberUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        return common.errorReturn(res, error.status, error);
    }
    var uuid= req.params.batchNumberUUID;
    var getExist = isExist(null, uuid);
    const deleteBatchNumber= (batchNumberUUID) => {
        return Promise.resolve(batchNumbersProxy.deleteBatchNumber(batchNumberUUID));
    }
    var ep = new eventProxy();
    ep.on('send_Message', function(){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Delete_Service_Success, 204);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    getExist.then((results) => {
        if(results.flag==4){
            throw results;
        } else{
            return deleteBatchNumber(uuid);
        }
    }).then(() => {
        ep.emit('send_Message');
        res.writeHead(204, {'Content-Type' : contentType});
        res.end();
    }).catch((err) => {
        if (!err.flag) {
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.status, err);
        return;
    })
}

exports.deleteBatchNumber = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteBatchNumberV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers ListBatchNumbers
 * @apiName ListBatchNumbers
 * @apiVersion 1.0.0
 * @apiGroup BatchNumber
 * @apiDescription  获取指定批次号信息列表
 * @apiParam  {int} [offset]　偏移量
 * @apiParam  {int} [limit] 获取条数
 * @apiParam  {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNORule、tenant或他们的组合，中间用','号隔开
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers",
 *      "offset":"0",
 *      "limit":"25",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/0000CqrNgrzcIGYs1PfP4F",
 *          "bigClass": 1,
 *          "subClass": 2,
 *          ...
 *      },
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/0000CqrNgrzcIGYs1PfP4F",
 *          "bigClass": 1,
 *          "subClass": 2,
 *          ... remaining BatchNumber name/value pairs ...
 *      },
 *      ... remaining items of BatchNumber ...
 *    ]
 *  }
 */
var listBatchNumbersV1 = (req, res) => {
    var queryConditions = req.query;
    var tenantUUID = req.params.tenantUUID;
    var uuid= req.params.batchNumberUUID;
    var batchNORuleUUID = req.params.batchNORuleUUID;
    var expandStr=req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, null);
    var listSuccess = Promise.resolve(batchNumbersProxy.queryBatchNumber(queryConditions, offset, limit));
    var countSuccess = Promise.resolve(batchNumbersProxy.getCount(queryConditions));
    Promise.all([judgeQuery, listSuccess, countSuccess]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        if(!expandStr){
            return  returnResources.generateListBatchNumbersRetInfo(tenantUUID, batchNORuleUUID, queryConditions, offset, result[2][0], result[1]);
        }
        var listResult = new Array;
        var item;
        for ( item in result[1]) {
            (function(item){
                listResult[item] = getExpandStr(expandStr, result[1][item], tenantUUID).then(function (resultExpand) {
                    for (var x in resultExpand) {
                        if (resultExpand[x].tag == 'tenant') {
                            result[1][item].tenants = returnResources.generateTenantRetInfo( resultExpand[x])
                        }
                        if (resultExpand[x].tag == 'batchNORule') {
                            result[1][item].batchNORules = returnResources.generateBatchNORuleRetInfo(resultExpand[x])
                        }
                    }
                    return result[1][item];
                });
            }(item));
        }
        return Promise.all(listResult).then(function(bodyResult){
            return  returnResources.generateListBatchNumbersRetInfo(tenantUUID, batchNORuleUUID, queryConditions, offset, result[2], bodyResult);
        });
    }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
    ).catch( (err) => {
        if (!err.flag) {
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.error.status, err.error);
        return;
    });
}

exports.listBatchNumbers = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listBatchNumbersV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var bulkCreateBatchNumber=function(tenantUUID, batchNORuleUUID,  params, callback){
    if ( !utils.checkUUID(tenantUUID) && !utils.checkUUID(batchNORuleUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    var info = params;
    info.batchNORuleUUID = batchNORuleUUID;
    var dateFormat = moment(new Date()).format('YYYY-MM-DD');
    var queryStr = 'createAt= \'' + dateFormat + '\'';
    var getBatchNORules = batchNumbersProxy.getBatchNORules(info.batchNORuleUUID);
    var dateJudge = serialNumbersModel.getSerialNumber(queryStr);
    function createBatchNumber(info) {
        return new Promise( (resolve) => {
            batchNumbersProxy.createBatchNumber(info).then((result) => {
                resolve(result);
            })
        });
    }
    var ep = new eventProxy();
    ep.on('send_Message', function(bodyDataJson){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    Promise.all([dateJudge, getBatchNORules]).then((result) =>{
        if(!result[1]){
            throw result[1];
        }else {
            var batchRule = result[1][0].rule;
            var complementCode = result[1][0].complementCode;
            var yChars = '', fChars = '';
            var batchArray = batchRule.split('');
            for (var i = 0; i < batchArray.length; i++) {
                switch (batchArray[i]) {
                    case 'Y':
                        yChars += 'Y';
                        break;
                    case 'F':
                        fChars += 'F';
                        break;
                    case '0':
                        fChars += '0';
                        break;
                        break;
                }
            }
            var judgeSerial;
            if (result[0].length> 0&&result[0][0].createAt == dateFormat) {
                if (result[0][0].batchNumber < parseInt(fChars, 16)) {
                    judgeSerial = serialNumbersModel.updateSerialNumber(result[0][0].createAt, 'batchNumber', (result[0][0].batchNumber + 1));
                } else {
                    return false;
                }
            } else {
                var infoSerial = {
                    'batchNumber': 1,
                    'createAt': dateFormat
                }
                judgeSerial = serialNumbersModel.createSerialNumber(infoSerial);
            }
            return Promise.all([judgeSerial,info, fChars, batchRule, complementCode, yChars]);
        }
    }).then((allResult) =>{
        if(allResult[0].length<1){
            throw allResult[0]
        }else{
            var batchRule = allResult[3];
            var fChars = allResult[2];
            var complementCode = allResult[4];
            var year = new Date().getFullYear().toString();
            var yChars = allResult[5];
            var serialLength;
            var batchRuleByChange;
            return  dateJudge.then((dateResult) => {
                switch (yChars.length){
                    case 1:
                        batchRuleByChange = batchRule.replace(/Y/, year.substr(4,1));
                        break;
                    case 2:
                        batchRuleByChange =  batchRule.replace(/YY/,year.substr(3,2));
                        break;
                    case 4:
                        batchRuleByChange = batchRule.replace(/YYYY/, 2016);
                        break
                        break;
                }
                var reg = new RegExp(fChars);
                if(fChars.indexOf('F')>=0){
                    if(dateResult[0].batchNumber.toString(16).length < fChars.length) {
                        serialLength = fChars.length - dateResult[0].batchNumber.toString(16).length;
                        for (var i = 0; i < fChars.length - 1; i++) {
                            complementCode += complementCode;
                        }
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else if(dateResult[0].batchNumber.toString(16).length == fChars.length){
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else{
                        return false;
                    }
                }else  if(fChars.indexOf('0')>=0){
                    if(dateResult[0].batchNumber.length < fChars.length){
                        serialLength = fChars.length - dateResult[0].batchNumber.length;
                        for(var i =0;i<serialLength; i++){
                            complementCode += complementCode;
                        }
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else if(dateResult[0].batchNumber.toString(16).length == fChars.length){
                        batchRuleByChange = batchRuleByChange.replace(reg, complementCode.concat(dateResult[0].batchNumber));
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                var month = new Date().getMonth() + 1;
                var week = new Date().getDay();
                var monthChange = (month<10?'0':'') +month;
                var weekChange = '0' + week;
                batchRuleByChange = batchRuleByChange.replace(/WW/, weekChange);
                batchRuleByChange = batchRuleByChange.replace(/MM/, monthChange);
                batchRuleByChange = batchRuleByChange.replace(/DD/, new Date().getDate());
                info.batchNumber = batchRuleByChange;
                return createBatchNumber(info);
            });
        }
    }).then((Result)=> {
        var bodyDataJson = returnResources.generateBatchNumbersRetInfo(tenantUUID, Result[0]);
        ep.emit('send_Message', bodyDataJson);
        callback(null, bodyDataJson);
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteBatchNumber=function(tenantUUID, batchNORuleUUID, batchNumberUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(batchNumberUUID)&& !utils.checkUUID(batchNORuleUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var uuid= batchNumberUUID;
    var getExist = isExist(null, uuid);
    var ep = new eventProxy();
    ep.on('send_Message', function(){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Delete_Service_Success, 204);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    const deleteBatchNumber= (batchNumberUUID) => {
        return Promise.resolve(batchNumbersProxy.deleteBatchNumber(batchNumberUUID));
    }
    getExist.then((results) => {
        if(results.flag==4){
            throw results;
        } else{
            return deleteBatchNumber(uuid);
        }
    }).then(() => {
        ep.emit('send_Message');
        callback(null, 204);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    })
};

var bulkRetrieveBatchNumber=function(tenantUUID, batchNORuleUUID, batchNumberUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(batchNumberUUID)&&!utils.checkUUID(batchNORuleUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var getExist = isExist(null, batchNumberUUID);
    var expandStr=queryConditions.expand;
    const retrieveBatchNumber = (uuid ) => {
        return Promise.resolve(batchNumbersProxy.retrieveBatchNumber(uuid ));
    }
    retrieveBatchNumber(batchNumberUUID).then((results) => {
        var judge = common.isOnly(null, results.length);
        if(judge.is) {
            var bodyDataJson = returnResources.generateBatchNumbersRetInfo(tenantUUID, results[0]);
            if(!expandStr){
                return bodyDataJson;
            }
            return getExpandStr(expandStr, results[0], tenantUUID).then(function(result){
                for(var x in result){
                    if(result[x].tag =='tenant'){
                        var resultTenant = returnResources.generateTenantRetInfo( result[x])
                        bodyDataJson['tenants'] =resultTenant;
                    }
                    if(result[x].tag =='batchNORule'){
                        var resultBatchNORule = returnResources.generateBatchNORuleRetInfo(result[x]);
                        bodyDataJson['batchNORules'] =resultBatchNORule;
                    }
                }
                return bodyDataJson;
            });
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve batchNumber.the uuid: ' + batchNumberUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve batchNumber. the uuid: ' + batchNumberUUID;
        }
    }).then((bodyInfo) => {
        callback(null, bodyInfo);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkListBatchNumber=function( tenantUUID, batchNORuleUUID,  queryConditions, callback){
    if (!utils.checkUUID(tenantUUID)&&!utils.checkUUID(batchNORuleUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback);
    }
    var expandStr=queryConditions.expand;
    var offset = common.ifNotReturnNum(Number(queryConditions.offset), 0);
    var limit = common.ifNotReturnNum(Number(queryConditions.limit), 25);
    var judgeQuery = common.isValidQueryParams2(queryConditions, isValidQueryCondition, null);
    var listSuccess = Promise.resolve(batchNumbersProxy.queryBatchNumber(queryConditions, offset, limit));
    var countSuccess = Promise.resolve(batchNumbersProxy.getCount(queryConditions));
    Promise.all([judgeQuery, listSuccess, countSuccess]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        if(!expandStr){
            return  returnResources.generateListBatchNumbersRetInfo(tenantUUID, batchNORuleUUID, queryConditions, offset, result[2][0], result[1]);
        }
        var listResult = new Array;
        var item;
        for ( item in result[1]) {
            (function(item){
                listResult[item] = getExpandStr(expandStr, result[1][item], tenantUUID).then(function (resultExpand) {
                    for (var x in resultExpand) {
                        if (resultExpand[x].tag == 'tenant') {
                            result[1][item].tenants = returnResources.generateTenantRetInfo( resultExpand[x])
                        }
                        if (resultExpand[x].tag == 'batchNORule') {
                            result[1][item].batchNORules = returnResources.generateBatchNORuleRetInfo(resultExpand[x])
                        }
                    }
                    return result[1][item];
                });
            }(item));
        }
        return Promise.all(listResult).then(function(bodyResult){
            return  returnResources.generateListBatchNumbersRetInfo(tenantUUID, batchNORuleUUID, queryConditions, offset, result[2], bodyResult);
        });
    }).then((bodyInfo) => {
            callback(null, bodyInfo);
            return;
        }
    ).catch( (err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, batchNORuleUUID= '', batchNumberUUID= '',  queryConditions='';
    if(utils.isBatchNumbersURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/batchNORules');
        batchNORuleUUID =utils.getUUIDInHref(urlPath, 'batchNORules/', '/batchNumbers');
        batchNumberUUID=utils.getUUIDInHref(urlPath, 'batchNumbers/');
    }else if(utils.isBatchNumberURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/batchNORules');
        batchNORuleUUID =utils.getUUIDInHref(urlPath, 'batchNORules/', '/batchNumbers');
        isList=true;
    }
    if(active=='post'){
        bulkCreateBatchNumber(tenantUUID, batchNORuleUUID,  params, callback);
    }else if(active=='delete'){
        bulkDeleteBatchNumber(tenantUUID, batchNORuleUUID, batchNumberUUID,  callback);
    }else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListBatchNumber(tenantUUID, batchNORuleUUID, queryConditions, callback);
        }else{
            bulkRetrieveBatchNumber(tenantUUID, batchNORuleUUID, batchNumberUUID, queryConditions, callback);
        }
    }
}