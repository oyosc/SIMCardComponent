/**
 * Created by yansha on 2016/5/25.
 */
var common = require('./common');
var contentType = require('./common').retContentType;
var returnResources = require('./returnResources');
var utils= require('../common/utils');
var log = require("../common/log").getLogger();
var errorCodeTable = require("../common/errorCodeTable");
var tenantProxy = require('../proxy/tenantOperator');
var directoryProxy=require('../proxy/directoryOperator');
var simCardProxy=require('../proxy/simCardOperator');
var flowProxy=require('../proxy/flowOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');

/**
 * @apiDefine Flow Flow
 *
 * 流量(Flow)资源（使用流量记录）
 */

var validateParams =(info, isCreate)  => {
    var judgeResult;
    if(isCreate){
        judgeResult = common.mandatoryParams(info, [ 'type','beginTime','endTime','total' ]);
    } else{
        judgeResult = common.mandatoryParams(info, [ 'type','beginTime','endTime','total']);
    }
    return judgeResult;
}

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

function isDirectoryExist(tenantUUID, uuid){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + uuid + '\'';
    return Promise.resolve(directoryProxy.queryBy('uuid', queryStr))
        .then((results) =>{
            var judge = common.isOnly(null, results.length);
            if(judge.is) {
                return results[0];
            }
            if(judge.flag == 1) {
                judge.error.description = 'Could not find the resources you want to query directory.the query string: ' + queryStr;
            } else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query directory. the query string: ' + queryStr;
            }
            return judge;
        });
}

function isSIMCardExist(directoryUUID, uuid){
    var queryStr='directoryUUID=\''+directoryUUID +'\' and uuid=\''+ uuid + '\'';
    return Promise.resolve(simCardProxy.queryBy(null, queryStr))
        .then(function(results){
            var judge = common.isOnly(null, results.length);
            if(judge.is) {
                return results[0];
            }
            if(judge.flag == 1) {
                judge.error.description = 'Could not find the resources you want to query simCard.the query string: ' + queryStr;
            } else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query simCard. the query string: ' + queryStr;
            }
            return judge ;
        });
}

function isExist(name, simCardUUID, uuid){
    var queryStr='simCardUUID=\''+simCardUUID +'\'';
    if(uuid){
        queryStr += ' and uuid=\''+ uuid + '\'';
    }
    return Promise.resolve(flowProxy.queryBy(null, queryStr))
        .then(function(results){
            var judge = common.isOnly(null, results.length);
            if(judge.is) {
                return results[0];
            }
            if(judge.flag == 1) {
                judge.error.description = 'Could not find the resources you want to query Flow.the query string: ' + queryStr;
            } else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query Flow. the query string: ' + queryStr;
            }
            return judge ;
        });
}
function isOrganizationExist(tenantUUID, organizationUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + organizationUUID + '\'';
    return Promise.resolve(organizationProxy.queryBy(null, queryStr))
        .then(function(results){
            var judge = common.isOnly(null, results.length);
            if(judge.is){
                return results[0];
            }
            if(judge.flag == 1){
                judge.error.description = 'Could not find the resources you want to query organization.the query string: ' + queryStr;
            }else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query organization. the query string: ' + queryStr;
            }
            return judge;
        });
}

function isGroupExist(tenantUUID, groupUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + groupUUID + '\'';
    return Promise.resolve(groupProxy.queryBy(null, queryStr))
        .then(function(results){
            var judge = common.isOnly(null, results.length);
            if(judge.is){
                return results[0];
            }
            if(judge.flag == 1){
                judge.error.description = 'Could not find the resources you want to query group.the query string: ' + queryStr;
            }else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query group. the query string: ' + queryStr;
            }
            return judge;
        });
}
function isValidQueryCondition(queryCondition) {
    for(var item in queryCondition) {
        switch(item) {
            case 'uuid' : case 'sn' :case 'status':
            case 'createAt' :  case 'modifiedAt' :
            case 'expand':case 'offset': case 'limit': case 'count':
            break;
            default:
                return false;
        }
    }
    return true;
}
/**
 * @api {post} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/flows CreateFlow
 * @apiName CreateFlow
 * @apiVersion 1.0.0
 * @apiGroup Flow
 * @apiDescription  创建一个流量记录
 * @apiParam {int} type 流量类型，如1：基础流量，2：叠加流量
 * @apiParam {datetime} beginTime 开始时间
 * @apiParam {datetime} endTime 结束时间
 * @apiParam {int} total 流量
 * @apiParam {json} [customData] 扩展字段
 *
 * @apiParam (output) {int} type 流量类型，如1：基础流量，2：叠加流量
 * @apiParam (output) {datetime} beginTime 开始时间
 * @apiParam (output) {datetime} endTime 结束时间
 * @apiParam (output) {int} total 流量
 * @apiParam (output) {json} [customData] 扩展字段
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCard 该流量对应的卡，见资源[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'type' : 1,
 *   'beginTime' : '20160608 15:30:20',
 *   'endTime' : '20160608 15:30:20',
 *   'total' : 250,
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F',
 *   'type' : 1,
 *   'beginTime' : '20160608 15:30:20',
 *   'endTime' : '20160608 15:30:20',
 *   'total' : 250,
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   'simCard' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g"
 *   },
 *   'tenant' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */

var createFlowsV1 = (req, res) =>{
    var info = req.body;
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID)&& !utils.checkUUID(req.params.simCardUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var directoryUUID=req.params.directoryUUID;
    var simCardUUID=req.params.simCardUUID;
    info.tenantUUID=tenantUUID;
    info.directoryUUID=directoryUUID;
    info.simCardUUID=simCardUUID;

    var judgeResult = validateParams(info, true);
    var getSIMCardExist=isSIMCardExist(directoryUUID, simCardUUID);
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
    Promise.all([judgeResult, getSIMCardExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false) {
            throw result[1];
        }
        return Promise.resolve(flowProxy.createFlow(info));
    }).then((result) => {
        var bodyDataJson = returnResources.generateFlowRetInfo(tenantUUID, directoryUUID,  result);
        ep.emit('send_Message', bodyDataJson);
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
        return;
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.createFlows = (req, res, next)  => {
    var version = req.params.version;
    if(version == common.VERSION100){
        createFlowsV1(req, res);
        if(config.record == true){
            next();
        }
    }
};

/**
 * @api {put} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/flows/:flowUUID UpdateFlow
 * @apiName UpdateFlow
 * @apiVersion 1.0.0
 * @apiGroup Flow
 * @apiDescription  更新一流量记录
 * @apiParam {int} type 流量类型，如1：基础流量，2：叠加流量
 * @apiParam {datetime} beginTime 开始时间
 * @apiParam {datetime} endTime 结束时间
 * @apiParam {int} total 流量
 * @apiParam {json} [customData] 扩展字段
 *
 * @apiParam (output) {int} type 流量类型，如1：基础流量，2：叠加流量
 * @apiParam (output) {datetime} beginTime 开始时间
 * @apiParam (output) {datetime} endTime 结束时间
 * @apiParam (output) {int} total 流量
 * @apiParam (output) {json} [customData] 扩展字段
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCard 该流量对应的卡，见资源[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * put:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'ICCID' : 'W9047090024',
 *   'IMSI' : '18666291303',
 *   'batchNO' : '2015091007',
 *   'status' : '销卡',
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F',
 *   'type' : 1,
 *   'beginTime' : '20160608 15:30:20',
 *   'endTime' : '20160608 15:30:20',
 *   'total' : 250,
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   'simCard' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g"
 *   },
 *   'tenant' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
var updateFlow = (req, res) => {
    var info = req.body;

    if ( !utils.checkUUID(req.params.tenantUUID) &&  !utils.checkUUID(req.params.directoryUUID) &&  !utils.checkUUID(req.params.simCardUUID)&&  !utils.checkUUID(req.params.flowUUID) ) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var directoryUUID=req.params.directoryUUID;
    var simCardUUID = req.params.simCardUUID;
    var flowUUID = req.params.flowUUID;
    info.tenantUUID=tenantUUID;
    info.directoryUUID=directoryUUID;
    info.simCardUUID=simCardUUID;
    info.uuid = flowUUID;

    var judgeResult = validateParams(info, true);
    var getExist=isExist(null, simCardUUID, flowUUID);
    var ep = new eventProxy();
    ep.on('send_Message', function(bodyDataJson){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Update_Service_Success, bodyDataJson);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    Promise.all([judgeResult, getExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(flowProxy.updateFlow(info));
        }
    }).then((result) => {
            var bodyDataJson = returnResources.generateFlowRetInfo(tenantUUID, directoryUUID,  result);
            ep.emit('send_Message', bodyDataJson);
            res.writeHead(200, {'Content-Type': contentType, 'Location': bodyDataJson.href});
            res.write(JSON.stringify(bodyDataJson));
            res.end();
            return;
        })
        .catch((err) => {
            common.errReturnCommon(err, res);
            return;
        });
}
exports.updateFlow  = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        updateFlow(req , res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/flows/:flowUUID  RetrieveFlow
 * @apiName RetrieveFlow
 * @apiVersion 1.0.0
 * @apiGroup Flow
 * @apiDescription  获取指定流量记录
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCard或他们的组合，中间用','号隔开。
 *
 * @apiParam (output) {int} type 流量类型，如1：基础流量，2：叠加流量
 * @apiParam (output) {datetime} beginTime 开始时间
 * @apiParam (output) {datetime} endTime 结束时间
 * @apiParam (output) {int} total 流量
 * @apiParam (output) {json} [customData] 扩展字段
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCard 该流量对应的卡，见资源[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F

 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F',
 *   'type' : 1,
 *   'beginTime' : '20160608 15:30:20',
 *   'endTime' : '20160608 15:30:20',
 *   'total' : 250,
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   'simCard' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g"
 *   },
 *   'tenant' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
function isExpandStrVail(expandStr) {
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        var retExpand = common.getExpand(expandArray[i]);
        switch (retExpand[0]) {
            case 'directory':
            case 'simCard':
                break;
            default:
                return false;
        }
    }
    return true;
}
function getDirectory(tenantUUID, directoryUUID ){
    return Promise.resolve(directoryProxy.retrieveDirectory(tenantUUID, directoryUUID)).then((results) => {
        if (results.length == 0) {
            results = new Array();
        }
        var bodyInfo = returnResources.generateDirectoryRetInfo(results[0]);
        return bodyInfo;
    })
}
function getSIMCard(tenantUUID, directoryUUID, simCardUUID ){
    return Promise.resolve(simCardProxy.retrieveSIMCard(directoryUUID, simCardUUID)).then((results) => {
        if (results.length == 0) {
            results = new Array();
        }
        var bodyInfo = returnResources.generateSIMCardRetInfo(tenantUUID, results[0]);
        return bodyInfo;
    })
}

/*function getGroups(tenantUUID, directoryUUID, simCardUUID, offset, limit){
    return Promise.resolve( groupProxy.queryGroup(tenantUUID, {}, offset, limit, simCardUUID ))
        .then((results) => {
            if (results.length == 0) {
                results = new Array();
            }
            var bodyInfo = returnResources.generateListGroupRetInfo(tenantUUID, {}, offset, limit, results, directoryUUID, simCardUUID);
            return bodyInfo;
        })
}
function getGroupMemberships(tenantUUID, directoryUUID, simCardUUID, offset, limit ){
    return Promise.resolve(groupMembershipProxy.queryGroupMemberships(tenantUUID, {}, offset, limit ))
        .then((results) =>{
            if (results.length == 0) {
                results = new Array();
            }
            var bodyInfo = returnResources.generateListGroupMembershipRetInfo(tenantUUID, {}, offset, limit, results, directoryUUID, simCardUUID);
            return bodyInfo;
        })
}*/

function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID, directoryUUID){

    return new Promise((resolve) => {
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i){
            var retExpand = common.getExpand(expandArray[i]);
            switch(retExpand[0]){
                case 'directory':
                    getDirectory(tenantUUID, directoryUUID).then((result) => {
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.directory = result;
                            }else{
                                retInfo.items[itemIndex].directory = result;
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

                case 'simCard':
                    getSIMCard(tenantUUID, directoryUUID, data.simCardUUID).then((result) => {
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.simCard = result;
                            }else{
                                retInfo.items[itemIndex].simCard = result;
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
/*
                case 'groupMemberships':
                    getGroupMemberships(tenantUUID, data.directoryUUID, data.uuid, retExpand[1], retExpand[2]).then((result) => {
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.groupMemberships = result;
                            }else {
                                retInfo.items[itemIndex].groupMemberships = result;
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
                case 'groups':
                    getGroups(tenantUUID, data.directoryUUID, data.uuid, retExpand[1], retExpand[2]).then((result) => {
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.groups = result;
                            }else {
                                retInfo.items[itemIndex].groups = result;
                            }
                            index += 1;
                            if(index == expandArray.length){
                                resolve(retInfo);
                            }else{
                                return retInfo;
                            }
                        }
                    });
                    break;*/
                default:
                    var err = new Error('the params of expand is error!'+retExpand[0]);
                    err.status = 400;
                    throw err;
            }
        }
    });
}

var retrieveFlowV1 = (req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID) && !utils.checkUUID(req.params.simCardUUID)&& !utils.checkUUID(req.params.flowUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var flowUUID = req.params.flowUUID;
    var simCardUUID = req.params.simCardUUID;
    var directoryUUID = req.params.directoryUUID;
    var tenantUUID = req.params.tenantUUID;
    var expandStr = req.query.expand;

    var judgeParams = common.isValidQueryParams(req, null, isExpandStrVail);
    var retFlow = Promise.resolve(flowProxy.retrieveFlow(simCardUUID, flowUUID));
    Promise.all([judgeParams, retFlow]).then((results) => {
        if(results[0].is==false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateFlowRetInfo(tenantUUID, directoryUUID, results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID, directoryUUID));
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve Flow.the uuid: ' + flowUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve Flow. the uuid: ' + flowUUID;
        }
        throw judge;

    }).then((bodyInfo) => {
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
        return;
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.retrieveFlow = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveFlowV1(req, res);
        if(config.record == true){
            next();
        }
    }
}



/**
 * @api {delete} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/flows/:flowUUID DeleteFlow
 * @apiName DeleteFlow
 * @apiGroup Flow
 * @apiDescription  删除指定SIM卡
 * @apiParamExample  Example Request
 * DELETE:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F

 * @apiSuccessExample Example Response
 * HTTP/1.1 204 NoContent
 */

var deleteFlowV1 = (req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID) && !utils.checkUUID(req.params.simCardUUID)&& !utils.checkUUID(req.params.flowUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var simCardUUID= req.params.simCardUUID;
    var flowUUID = req.params.flowUUID;
    var delFlow = Promise.resolve(flowProxy.deleteFlow(flowUUID));
    var getExist=isExist(null, simCardUUID, flowUUID);
    var ep = new eventProxy();
    ep.on('send_Message', function(){
        Promise.resolve(isTenantExist(req.params.tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Delete_Service_Success, 204);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    Promise.all([getExist, delFlow]).then((results) => {
        if(results[0].is ==  false){
            throw results[0];
        }
        var judge = common.isOnly(null, results[1]);
        if(judge.is) {
            ep.emit('send_Message');
            res.writeHead(204, {'Content-Type': contentType});
            res.end();
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve Flow.the uuid: ' + flowUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve Flow. the uuid: ' + flowUUID;
        }
        throw judge;
    }).catch((err) =>  {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.deleteFlow=(req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteFlowV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/flows ListFlows
 * @apiName ListFlows
 * @apiGroup Flow
 * @apiDescription  根据特定的字段，获取一系列流量记录详情信息。
 * @apiParam {int} [offset] 偏移量
 * @apiParam {int} [limit] 获取记录条数
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCard或他们的组合，中间用','号隔开。
 * @apiParam {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 * @apiParam {string} [count] 统计 count的值 month本月消耗流量
 * @apiParamExample  Example Request
 * GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows',
 *   'offset':0,
 *   'limit':25,
 *   'items':[
 *      {
 *          'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows/aaruleqrNgrzcIGYs1PfP4F',
  *         'type' : 1,
  *         'beginTime' : '2016-01-10 12:30:00',
 *          …… remaining key/value of flows……
 *      }，
 *      …… remaining item of flows……
 *    ]
 * }

 * @apiParamExample  Example Request
 * GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows?count=month
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows?count=month',
 *   'count':100
 * }
 */


var listFlowsV1 = (req, res) => {
    if (!utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID)&& !utils.checkUUID(req.params.simCardUUID)) {
        var error;
        error = {
            status: 400,
            description: '输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var simCardUUID = req.params.simCardUUID;
    var directoryUUID = req.params.directoryUUID;
    var tenantUUID = req.params.tenantUUID;
    var queryConditions = req.query;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var expandStr = req.query.expand;

    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var getSIMCardExist=isSIMCardExist(directoryUUID, simCardUUID);
    if(req.query.count && req.query.count=='month'){
        var getMonthFlows = Promise.resolve(flowProxy.getMonthFlows(simCardUUID, queryConditions));
        Promise.all([judgeQuery, getSIMCardExist, getMonthFlows]).then((result) => {
            if (result[0].is == false) {
                throw result[0];
            }
            if (result[1].is == false) {
                throw result[1];
            }
            var bodyInfo = returnResources.generateMonthFlowRetInfo(tenantUUID, directoryUUID, simCardUUID, queryConditions, result[2]);
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;

        }).catch( (err) => {
            common.errReturnCommon(err, res);
            return;
        });
    }else{
        var listSuccess = Promise.resolve(flowProxy.queryFlows(simCardUUID, queryConditions, offset, limit));
        var countSuccess = Promise.resolve(flowProxy.getCount(simCardUUID, queryConditions));
        Promise.all([judgeQuery, getSIMCardExist, listSuccess, countSuccess]).then((result) => {
            if (result[0].is == false) {
                throw result[0];
            }
            if (result[1].is == false) {
                throw result[1];
            }
            if (result[2].length == 0) {
                result[2] = new Array();
            }
            var bodyInfo = returnResources.generateListFlowRetInfo(tenantUUID, directoryUUID, simCardUUID, queryConditions, offset, result[3], result[2]);
            if (!result[0].isExpand) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            }
            var count = 0;
            new Promise((resolve) => {
                for (var i = 0; i < result[2].length; ++i) {
                    getExpandInfo(expandStr, result[2][i], bodyInfo, true, i, tenantUUID, directoryUUID).then((datas) => {
                        ++count;
                        if (count == result[2].length) {
                            resolve(datas);
                        }
                    })
                }
            }).then( (bodyInfo) => {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            })
        }).catch( (err) => {
            common.errReturnCommon(err, res);
            return;
        });
    }

}
exports.listFlows = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listFlowsV1(req, res);
        if(config.record == true){
            next();
        }
    }
};


var listAllFlowsV1 = (req, res) => {
    if (!utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error = {
            status: 400,
            description: '输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var queryConditions = req.query;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var expandStr = req.query.expand;

    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var getTenantExist=isTenantExist(tenantUUID);
    var listSuccess = Promise.resolve(flowProxy.queryFlows(null, queryConditions, offset, limit, tenantUUID));
    var countSuccess = Promise.resolve(flowProxy.getCount(null, queryConditions, tenantUUID));

    Promise.all([judgeQuery, getTenantExist, listSuccess, countSuccess]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].is == false) {
            throw result[1];
        }
        if (result[2].length == 0) {
            result[2] = new Array();
        }
        var simCardUUIDArray = [];
        result[2].forEach(function(element){
            simCardUUIDArray.push(element.simCardUUID);
        });
        var bodyInfo = returnResources.generateListFlowRetInfo(tenantUUID, null, null, queryConditions, offset, result[3], result[2]);
        if (!result[0].isExpand) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) => {
            for (var i = 0; i < result[2].length; ++i) {
                getExpandInfo(expandStr, result[2][i], bodyInfo, true, i, tenantUUID, directoryUUID).then((datas) => {
                    ++count;
                    if (count == result[2].length) {
                        resolve(datas);
                    }
                })
            }
        }).then( (bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        })
    }).catch( (err) => {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.listAllFlows = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listFlowsV1(req, res);
        if(config.record == true){
            next();
        }
    }
};

var bulkCreateFlow=function(tenantUUID, directoryUUID, simCardUUID, params, callback){
    if ( !utils.checkUUID(tenantUUID) && !utils.checkUUID(directoryUUID) && !utils.checkUUID(simCardUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    params.tenantUUID=tenantUUID;
    params.directoryUUID=directoryUUID;
    params.simCardUUID=simCardUUID;
    var judgeResult = validateParams(params, true);
    var getSIMCardExist=isSIMCardExist(directoryUUID, simCardUUID);
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
    Promise.all([judgeResult, getSIMCardExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false) {
            throw result[1];
        }
        return Promise.resolve(flowProxy.createFlow(params));
    }).then((result) => {
        var bodyDataJson = returnResources.generateFlowRetInfo(tenantUUID, directoryUUID,  result);
        ep.emit('send_Message', bodyDataJson);
        callback(null, bodyDataJson);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteFlow=function(tenantUUID, directoryUUID, simCardUUID, flowUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(directoryUUID)&& !utils.checkUUID(simCardUUID)&& !utils.checkUUID(flowUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var delFlow = Promise.resolve(flowProxy.deleteFlow(flowUUID));
    var getExist=isExist(null, simCardUUID, flowUUID);
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
    Promise.all([getExist, delFlow]).then((results) => {
        if(results[0].is ==  false){
            throw results[0];
        }
        var judge = common.isOnly(null, results[1]);
        if(judge.is) {
            ep.emit('send_Message');
            callback(null, 204);
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve Flow.the uuid: ' + flowUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve Flow. the uuid: ' + flowUUID;
        }
        throw judge;
    }).catch((err) =>  {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkUpdateFlow=function(tenantUUID, directoryUUID, simCardUUID, flowUUID,  info, callback){
    if (  !utils.checkUUID(tenantUUID)&& !utils.checkUUID(directoryUUID)&& !utils.checkUUID(simCardUUID)&& !utils.checkUUID(flowUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    info.directoryUUID=directoryUUID;
    info.simCardUUID=simCardUUID;
    info.uuid = flowUUID;

    var judgeResult = validateParams(info, true);
    var getExist=isExist(null, simCardUUID, flowUUID);
    var ep = new eventProxy();
    ep.on('send_Message', function(bodyDataJson){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Update_Service_Success, bodyDataJson);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    Promise.all([judgeResult, getExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(flowProxy.updateFlow(info));
        }
    }).then((result) => {
            var bodyDataJson = returnResources.generateFlowRetInfo(tenantUUID, directoryUUID,  result);
            ep.emit('send_Message', bodyDataJson);
            callback(null, bodyDataJson);
            return;
        })
        .catch((err) => {
            common.errReturnCallback(err, callback);
            return;
        });
};

var bulkRetrieveFlow=function(tenantUUID, directoryUUID, simCardUUID, flowUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(directoryUUID)&&!utils.checkUUID(simCardUUID)&&!utils.checkUUID(flowUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, null, isExpandStrVail);
    var retFlow = Promise.resolve(flowProxy.retrieveFlow(simCardUUID, flowUUID));
    Promise.all([judgeParams, retFlow]).then((results) => {
        if(results[0].is==false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateFlowRetInfo(tenantUUID, directoryUUID, results[1][0]);
            if(!results[0].isExpand){
                callback(null, bodyInfo);
                return;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID, directoryUUID));
           }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve Flow.the uuid: ' + flowUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve Flow. the uuid: ' + flowUUID;
        }
        throw judge;

    }).then((bodyInfo) => {
        callback(null, bodyInfo);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkListFlow=function( tenantUUID, directoryUUID, simCardUUID,  queryConditions, callback){
    if (!utils.checkUUID(tenantUUID)&&!utils.checkUUID(directoryUUID) &&!utils.checkUUID(simCardUUID)) {
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
    var getSIMCardExist=isSIMCardExist(directoryUUID, simCardUUID);
    if(queryConditions.count && queryConditions.count=='month'){
        var getMonthFlows = Promise.resolve(flowProxy.getMonthFlows(simCardUUID, queryConditions));
        Promise.all([judgeQuery, getSIMCardExist, getMonthFlows]).then((result) => {
            if (result[0].is == false) {
                throw result[0];
            }
            if (result[1].is == false) {
                throw result[1];
            }
            var bodyInfo = returnResources.generateMonthFlowRetInfo(tenantUUID, directoryUUID, simCardUUID, queryConditions, result[2]);
            callback(null, bodyInfo);
            return;

        }).catch( (err) => {
            common.errReturnCallback(err, callback);
            return;
        });
    }else{
        var listSuccess = Promise.resolve(flowProxy.queryFlows(simCardUUID, queryConditions, offset, limit));
        var countSuccess = Promise.resolve(flowProxy.getCount(simCardUUID, queryConditions));
        Promise.all([judgeQuery, getSIMCardExist, listSuccess, countSuccess]).then((result) => {
            if (result[0].is == false) {
                throw result[0];
            }
            if (result[1].is == false) {
                throw result[1];
            }
            if (result[2].length == 0) {
                result[2] = new Array();
            }
            var bodyInfo = returnResources.generateListFlowRetInfo(tenantUUID, directoryUUID, simCardUUID, queryConditions, offset, result[3], result[2]);
            if (!result[0].isExpand) {
                callback(null, bodyInfo);
                return;
            }
            var count = 0;
            new Promise((resolve) => {
                for (var i = 0; i < result[2].length; ++i) {
                    getExpandInfo(expandStr, result[2][i], bodyInfo, true, i, tenantUUID, directoryUUID).then((datas) => {
                        ++count;
                        if (count == result[2].length) {
                            resolve(datas);
                        }
                    })
                }
            }).then( (bodyInfo) => {
                callback(null, bodyInfo);
                return;
            })
        }).catch( (err) => {
            common.errReturnCallback(err, callback);
            return;
        });
    }
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, directoryUUID= '', simCardUUID= '', flowUUID='',  queryConditions='';
    if(utils.isFlowsURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/directories');
        directoryUUID =utils.getUUIDInHref(urlPath, 'directories/', '/simCards');
        simCardUUID =utils.getUUIDInHref(urlPath, 'simCards/', '/flows');
        flowUUID=utils.getUUIDInHref(urlPath, 'flows/');
    }else if(utils.isFlowURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/directories');
        directoryUUID =utils.getUUIDInHref(urlPath, 'directories/', '/simCards');
        simCardUUID =utils.getUUIDInHref(urlPath, 'simCards/', '/flows');
        isList=true;
    }
    if(active=='post'){
        bulkCreateFlow(tenantUUID, directoryUUID, simCardUUID,  params, callback);
    }else if(active=='delete'){
        bulkDeleteFlow(tenantUUID, directoryUUID, simCardUUID, flowUUID,  callback);
    }else if(active=='put'){
        bulkUpdateFlow(tenantUUID, directoryUUID, simCardUUID, flowUUID, params, callback);
    } else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListFlow(tenantUUID, directoryUUID, simCardUUID, queryConditions, callback);
        }else{
            bulkRetrieveFlow(tenantUUID, directoryUUID, simCardUUID, flowUUID, queryConditions, callback);
        }
    }
}