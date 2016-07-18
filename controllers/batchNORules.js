/**
 * Created by Administrator on 2016/5/19.
 */
"use strict";
var common = require('./common');
var contentType = require('./common').retContentType;
var log = require("../common/log").getLogger();
var returnResources = require('./returnResources');
var errorCodeTable = require('../common/errorCodeTable');
var utils= require('../common/utils');
var batchNORuleProxy = require('../proxy/batchNORuleOperator');
var tenantProxy = require("../proxy/tenantOperator");
var batchNumberProxy = require('../proxy/batchNumberOperator');
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
function isValidQueryCondition(queryCondition) {
    for(var item in queryCondition) {
        switch(item) {
            case 'uuid' : case 'rule' :case 'complementCode':
            case 'createAt' :  case 'modifiedAt' :
            case 'expand':case 'offset': case 'limit':
            break;
            default:
                return false;
        }
    }
    return true;
}
var charReg = function(string, char){
    if(char == 'M'||char == 'W'||char == 'D'){
        char = char + '{2}';
    } else{
        char = char + '+';
    }
    var reg=new RegExp(char,"g");
    var arr = string.match(reg);
    var charArr = new Array;
    if(char == 'Y'){
        if(arr.length>4){
            return length = 0;
        }
    }
    if(!arr){
        return length = 0;
    }
    for(let i = 0;i<arr.length;i++){
        charArr.push(arr[i]);
    }
    var charString = charArr.join("");
    var reg1 = new RegExp(charString,"g")
    var length = string.match(reg1);
    if(!length){
        return length = 0;
    }
    return length;
}
var validRule = function(info){
    var retData = {'is': true, 'error': '', 'flag':0};
    var error = null;
    var arr = ['Y','M','D','W'];
    if(info.indexOf('0')>0&&info.indexOf('F')>0){
        retData.err = '同时存在F跟0';
        retData.flag = 4;
        return retData;
    }else if(info.indexOf('0')>0){
        arr.push('0');
    }else if(info.indexOf('F')>0){
        arr.push('F');
    }
    for(let i = 0;i<info.length;i++){
        if(info[i] == 'Y'||info[i] == 'M'||info[i] == 'W'||info[i] == 'D'||info[i] == 'F'||info[i] == '0'){
            continue;
        }else{
            retData.err = '存在不合法的字符';
            retData.flag = 4;
            return retData;
        }
    }
    var charLength = new Array;
    for(var x in arr){
        charLength.push(charReg(info, arr[x]));
    }
    for(var length in charLength){
        if(!charLength[length]){
            error = new Error();
            error.name = 'Error';
            error.status = 400;
            error.message = errorCodeTable.errorCode2Text( error.code );
            error.description = '';

            retData.error = error;
            retData.is = false;
            retData.flag = 4;
            return retData;
        }
    }
    return retData;
}
var validateParams = function(info) {
    var judgeResult;
    judgeResult = common.mandatoryParams(info, [ 'rule', 'complementCode']);
    return judgeResult;
}

function isExist(rule, tenantUUID, uuid) {
    var queryStr ='tenantUUID=\'' + tenantUUID + '\'';
    if(rule) {
        queryStr = 'rule=\''+ rule + '\'';
    } else {
        queryStr = 'uuid=\''+ uuid + '\'';
    }
    return new Promise(function(resolve){
        batchNORuleProxy.queryBy(null, queryStr)
            .then(function(results){
                var judge = common.isOnly(null, results.length);
                if(judge.is) {
                    resolve(results[0]);
                    return;
                }

                var error = judge.error;
                if(judge.flag == 1) {
                    error.description = 'Could not find the resources you want to query BatchNORule.the query string: ' + queryStr;
                } else if(judge.flag == 2) {
                    error.description = 'Find much resource when query group. the BatchNORule string: ' + queryStr;
                }
                resolve( judge);
            })
    });
}
/**
 * @apiDefine BatchNORule BatchNORule
 *
 * 批次号规则(BatchNORule)资源是批次号生成规则；
 * 它可以用来指导设备[SIMCard](#api-SIMCard)的批次号生成；
 *
 */

/**
 * @api {post} /:version/tenants/:tenantUUID/batchNORules CreateBatchNORule
 * @apiName CreateBatchNORule
 * @apiVersion 1.0.0
 * @apiGroup BatchNORule
 * @apiDescription  创建一个批次号规则（年Y、月M、周W、日D、流水号F/0）
 * @apiParam (input) {string} rule　如YYYYMMWWDDFFF,F表示十六进制，0表示十进制
 * @apiParam (input) {string} complementCode 流水号补位码
 *
 * @apiParam (input) {string} rule　如YYYYMMWWDDFFF,F表示十六进制，0表示十进制
 * @apiParam (input) {string} complementCode 流水号补位码
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} batchNumbers该规则下所有的批次号URL链接，见[BatchNumber](#api-BatchNumber)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "rule": 'YYYYMMWWDDFFF',
 *   "complementCode": '0'
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F",
 *   "rule": 'YYYYMMWWDDFFF',
 *   "complementCode": '0'
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "batchNumbers" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
var createBatchNORuleV1 = function (req, res){
    var info = req.body;
    if ( !utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    info.tenantUUID=tenantUUID;
    var datavalidRule = validRule(info.rule)
    var judgeResult = validateParams(info);
    var getExist=isExist(info.rule, tenantUUID, null);

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
    Promise.all([datavalidRule, judgeResult, getExist]).then(function(result){
        if(result[0] == 4){
            throw  result[0];
        }
        if(result[1].flag==4){
            throw result[1];
        }
        if(result[2].flag!=0){
            if(result[2].error && result[2].error.status == 404) {
                return Promise.resolve(batchNORuleProxy.createBatchNoRules(info));
            }
            var retData = {};
            var error = new Error();
            error.name = 'InternalError';
            error.status = 409;
            error.code = 7037;
            error.message = errorCodeTable.errorCode2Text( error.code );
            error.description = 'The resource is exist! the resource name is: ' + info.name;

            retData.error = error;
            retData.is = false;
            retData.flag = 2;
            throw retData;
        }
    }).then(function(result){
            var bodyDataJson = returnResources.generateBatchNORuleRetInfo(result);
            ep.emit('send_Message', bodyDataJson);
            res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
            res.write(JSON.stringify(bodyDataJson));
            res.end();
            return;
        })
        .catch(function(err) {
            if(!err.flag){
                log.error(err);
                err = common.isDBError(err);
            }
            common.errorReturn(res, err.error.status, err.error);
            return;
        });
};

exports.createBatchNORule = function(req, res, next) {
    var version = req.params.version;
    if(version == common.VERSION100){
        createBatchNORuleV1(req, res);
        if(config.record == true){
            next();
        }
    }
};


/**
 * @api {get} /:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID RetrieveBatchNORule
 * @apiName RetrieveBatchNORule
 * @apiVersion 1.0.0
 * @apiGroup BatchNORule
 * @apiDescription  获取指定批次号规则信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNumbers[offset,limit]、tenant或他们的组合，中间用','号隔开
 *
 * @apiParam (input) {string} rule　如YYYYMMWWDDFFF,F表示十六进制，0表示十进制
 * @apiParam (input) {string} complementCode 流水号补位码
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} batchNumbers该规则下所有的批次号URL链接，见[BatchNumber](#api-BatchNumber)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F",
 *   "rule": 'YYYYMMWWDDFFF',
 *   "complementCode": '0'
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "batchNumbers" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */

function isExpandStrVail(expandStr){
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        var retExpand = common.getExpand(expandArray[i]);
        switch (retExpand[0]) {
            case 'batchNumbers':
            case 'tenant':
                break;
            default:
                return false;
        }
    }
    return true;
}

var getTenant = (tenantUUID) => {
    return Promise.resolve(tenantProxy.retrieveTenant(tenantUUID));
}

var getBatchNumbers = (batchRuleUUID) => {
    return Promise.resolve(batchNumberProxy.getBatchNumberByRule(batchRuleUUID));
}


function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){

    return new Promise(function(resolve){
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i){
            var retExpand = common.getExpand(expandArray[i]);
            switch(retExpand[0]){
                case 'tenant':
                    getTenant(tenantUUID).then(function(result){
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.tenant = result;
                            }else {
                                retInfo.items[itemIndex].tenant = result;
                            }
                            index += 1;
                            if(index == expandArray.length){
                                resolve(retInfo);
                            }else{
                                return retInfo;
                            }
                        }
                    });
                    break;
                case 'batchNumbers':
                    getBatchNumbers(data.uuid).then(function(result){
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.batchNumbers = result;
                            }else {
                                retInfo.items[itemIndex].batchNumbers = result;
                            }
                            index += 1;
                            if(index == expandArray.length){
                                resolve(retInfo);
                            }else{
                                return retInfo;
                            }
                        }
                    });
                    break;
                default:
                    var err = new Error('the params of expand is error!');
                    err.status = 400;
                    throw err;
            }
        }
    });
}
var retrieveBatchNORuleV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.batchNORuleUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var batchNORuleUUID = req.params.batchNORuleUUID;
    var expandStr = req.query.expand;
    var judgeParams = common.isValidQueryParams(req, null, isExpandStrVail);
    var retBatchNORule = Promise.resolve(batchNORuleProxy.retrieveBatchNoRule(tenantUUID, batchNORuleUUID));
    Promise.all([judgeParams, retBatchNORule]).then(function(results){
        if(results[0].is == false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateBatchNORuleRetInfo(results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return new Promise(function(resolve){
                getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID)
                    .then(function(result){
                        resolve(result);
                    });
            })
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve BatchNORule.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve BatchNORule. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).then(function(bodyInfo){
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
        return;
    }).catch(function(err) {
        if(!err.flag){
            log.error(err);
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.error.status, err.error);
        return;
    });
}
exports.retrieveBatchNORule = function(req, res, next ){
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveBatchNORuleV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


/**
 * @api {delete} /:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID DeleteBatchNORule
 * @apiName DeleteBatchNORule
 * @apiVersion 1.0.0
 * @apiGroup BatchNORule
 * @apiDescription  删除指定批次号规则信息
 * @apiParamExample Example Request
 * Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */
var deleteBatchNORuleV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.batchNORuleUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var batchNORuleUUID = req.params.batchNORuleUUID;
    var delBatchNORule = Promise.resolve(batchNORuleProxy.deleteBatchNoRule(batchNORuleUUID));
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
    delBatchNORule.then(function(result){
        var judge = common.isOnly(null, result);
        if(judge.is) {
            ep.emit('send_Message');
            res.writeHead(204, {'Content-Type': contentType});
            res.end();
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve batchNORule.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve batchNORule. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch(function(err) {
        if(!err.flag){
            log.error(err);
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.error.status, err.error);
        return;
    });
}
exports.deleteBatchNORule=function(req, res, next ){
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteBatchNORuleV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/batchNORules ListBatchNORules
 * @apiName ListBatchNORules
 * @apiVersion 1.0.0
 * @apiGroup BatchNORule
 * @apiDescription  获取指定批次号规则信息列表
 * @apiParam  {int} [offset]　偏移量
 * @apiParam  {int} [limit] 获取条数
 * @apiParam  {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNumbers[offset, limit]、tenant或他们的组合，中间用','号隔开
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules",
 *      "offset":"0",
 *      "limit":"25",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/0000CqrNgrzcIGYs1PfP4F",
 *          "rule": 'YYYYMMWWDDFFF',
 *          ...
 *      },
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/0000CqrNgrzcIGYs1PfP4F",
 *          "rule": 'YYYYMMWWDDFFF',
 *          ... remaining batchNORule name/value pairs ...
 *      },
 *      ... remaining items of batchNORule ...
 *    ]
 *  }
 */
var listBatchNORulesV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) ) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var queryConditions = req.query;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var expandStr = req.query.expand;

    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var listSuccess = Promise.resolve(batchNORuleProxy.queryBatchNoRule(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(batchNORuleProxy.getCount(tenantUUID, queryConditions))

    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function(result){
        if(result[0].is ==  false){
            throw result[0];
        }
        if(result[1].length == 0){
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListBatchNORuleRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
        if (!result[0].isExpand) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise(function(resolve) {
            for (var i = 0; i < result[1].length; ++i) {
                getExpandInfo(expandStr, result[1][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                    ++count;
                    if (count == result[1].length) {
                        resolve(datas);
                    }
                })
            }
        }).then(function (bodyInfo) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        })

    }).catch(function(err) {
        if(!err.flag){
            log.error(err);
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.error.status, err.error);
        return;
    });
}

exports.listBatchNORules = function(req, res, next ){
    var version = req.params.version;
    if(version == common.VERSION100){
        listBatchNORulesV1(req, res);
        if(config.record == true){
            next();
        }
    }
};

var bulkCreateBatchNORule=function(tenantUUID,  params, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback);
    }
    params.tenantUUID=tenantUUID;
    var datavalidRule = validRule(params.rule)
    var judgeResult = validateParams(params);
    var getExist=isExist(params.rule, tenantUUID, null);

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
    Promise.all([datavalidRule, judgeResult, getExist]).then(function(result){
        if(result[0] == 4){
            throw  result[0];
        }
        if(result[1].flag==4){
            throw result[1];
        }
        if(result[2].flag!=0){
            if(result[2].error && result[2].error.status == 404) {
                return Promise.resolve(batchNORuleProxy.createBatchNoRules(params));
            }
            var retData = {};
            var error = new Error();
            error.name = 'InternalError';
            error.status = 409;
            error.code = 7037;
            error.message = errorCodeTable.errorCode2Text( error.code );
            error.description = 'The resource is exist! the resource name is: ' + params.name;

            retData.error = error;
            retData.is = false;
            retData.flag = 2;
            throw retData;
        }
    }).then(function(result){
            var bodyDataJson = returnResources.generateBatchNORuleRetInfo(result);
            ep.emit('send_Message', bodyDataJson);
            callback(null, bodyDataJson);
            return;
        })
        .catch(function(err) {
            common.errReturnCallback(err, callback);
            return;
        });
};

var bulkDeleteBatchNORule=function(tenantUUID, batchNORuleUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(batchNORuleUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var delBatchNORule = Promise.resolve(batchNORuleProxy.deleteBatchNoRule(batchNORuleUUID));

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
    delBatchNORule.then(function(result){
        var judge = common.isOnly(null, result);
        if(judge.is) {
            ep.emit('send_Message');
            callback(null, 204);
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve batchNORule.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve batchNORule. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch(function(err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkRetrieveBatchNORule=function(tenantUUID, batchNORuleUUID , queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(batchNORuleUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, null, isExpandStrVail);
    var retBatchNORule = Promise.resolve(batchNORuleProxy.retrieveBatchNoRule(tenantUUID, batchNORuleUUID));
    Promise.all([judgeParams, retBatchNORule]).then(function(results){
        if(results[0].is == false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateBatchNORuleRetInfo(results[1][0]);
            if(!results[0].isExpand){
                callback(null, bodyInfo);
                return;
            }
            return new Promise(function(resolve){
                getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID)
                    .then(function(result){
                        resolve(result);
                    });
            })
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve BatchNORule.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve BatchNORule. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).then(function(bodyInfo){
        callback(null, bodyInfo);
        return;
    }).catch(function(err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkListBatchNORule =function( tenantUUID, queryConditions, callback){
    if (!utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback);
    }
    var offset = common.ifNotReturnNum(Number(queryConditions.offset), 0);
    var limit = common.ifNotReturnNum(Number(queryConditions.limit), 25);
    var expandStr = queryConditions.expand;

    var judgeQuery = common.isValidQueryParams2(queryConditions, isValidQueryCondition, isExpandStrVail);
    var listSuccess = Promise.resolve(batchNORuleProxy.queryBatchNoRule(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(batchNORuleProxy.getCount(tenantUUID, queryConditions))

    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function(result){
        if(result[0].is ==  false){
            throw result[0];
        }
        if(result[1].length == 0){
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListBatchNORuleRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
        if (!result[0].isExpand) {
            callback(null, bodyInfo);
            return;
        }
        var count = 0;
        new Promise(function(resolve) {
            for (var i = 0; i < result[1].length; ++i) {
                getExpandInfo(expandStr, result[1][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                    ++count;
                    if (count == result[1].length) {
                        resolve(datas);
                    }
                })
            }
        }).then(function (bodyInfo) {
            callback(null, bodyInfo);
            return;
        })

    }).catch(function(err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='',isList=false, batchNORuleUUID = '',  queryConditions='';
    if(utils.isBatchNORulesURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath,'tenants/','/batchNORules');
        batchNORuleUUID =utils.getUUIDInHref(urlPath,'batchNORules/');
    }else if(utils.isBatchNORuleURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath,'tenants/','/batchNORules');
        isList=true;
    }
    if(active=='post'){
        bulkCreateBatchNORule(tenantUUID, params, callback);
    }else if(active=='delete'){
        bulkDeleteBatchNORule(tenantUUID, batchNORuleUUID,  callback);
    }else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListBatchNORule(tenantUUID, queryConditions, callback);
        }else{
            bulkRetrieveBatchNORule(tenantUUID, batchNORuleUUID, queryConditions, callback);
        }
    }
}