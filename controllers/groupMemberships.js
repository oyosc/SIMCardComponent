/**
 * Created by Administrator on 2016/5/26.
 */
"use strict";
var common = require('./common');
var log = require("../common/log").getLogger();
var contentType = require('./common').retContentType;
var utils= require('../common/utils');
var returnResources = require('./returnResources');
var groupMembershipProxy = require('../proxy/groupMembershipOperator');
var tenantProxy=require('../proxy/tenantOperator');
var errorCodeTable = require('../common/errorCodeTable');
var simCardProxy = require('../proxy/simCardOperator');
var groupsProxy = require('../proxy/groupOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');


var mainParam = function(info) {
    var judgeResult;
    judgeResult = common.mandatoryParams(info, ['simCard', 'group']);
    return judgeResult;
}


function isTenantExist(tenantUUID){
    var queryStr = 'uuid=\'' + tenantUUID + '\'';
    return new Promise(function (resolve) {
        tenantProxy.queryBy(null, queryStr)
            .then(function(results){
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    resolve(results[0]);
                    return;
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query tenant.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query tenant. the query string: ' + queryStr;
                }
                resolve( judge);
            });
    });
}

function isExist(simCard, group, tenantUUID, uuid){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\'';
    if(simCard && group){
        var simCardUUID, groupUUID;
        if(simCard && simCard.href){
            if(simCard.href.indexOf('simCards/')>-1){
                simCardUUID=utils.getUUIDInHref(simCard.href, 'simCards/');
            }
        }
        if(group && group.href){
            if(group.href.indexOf('groups/')>-1){
                groupUUID=utils.getUUIDInHref(group.href, 'groups/');
            }
        }
        queryStr += ' and simCardUUID=\''+ simCardUUID + '\' and groupUUID=\''+ groupUUID + '\'';
    }else{
        queryStr += ' and uuid=\''+ uuid + '\'';
    }

    return new Promise(function (resolve) {
        groupMembershipProxy.queryBy(null, queryStr)
            .then(function(results){
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    resolve(results[0]);
                    return;
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query groupMembership.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query groupMembership. the query string: ' + queryStr;
                }
                resolve( judge);
            });
    });
}
function isValidQueryCondition(queryCondition) {
    for(var item in queryCondition){
        switch(item){
            case 'uuid' : case 'deviceURL' :case 'groupURL':case 'type':
            case 'createAt' :  case 'modifiedAt' :
            case 'expand':case 'offset': case 'limit':
            case 'deviceBy':
                break;
            default:
                return false;
        }
    }
    return true;
}


/**
 * @api {post} /:version/tenants/:tenantUUID/groupMemberships CreateGroupMembership
 * @apiName CreateGroupMembership
 * @apiVersion 1.0.0
 * @apiGroup GroupMembership
 * @apiDescription  创建一个SIM卡与组的关系
 * @apiParam (input) {url} simCard SIM卡，见[SIMCard](#api-SIMCard)资源
 * @apiParam (input) {url} group 组，见[Group](#api-Group)资源
 *
 * @apiParam (output) {url} simCard SIM卡，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} group 组，见[Group](#api-Group)资源
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParamExample  Example Request
 * POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships
 * Content-Type: application/json;charset=UTF-8
 * {
 *   'simCard' : {
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'
 *   },
 *   'group':{
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F'
 *   }
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F',
 *   'simCard' : {
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'
 *   },
 *   'group':{
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F'
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
var createGroupMembershipV1 = function(req, res) {
    var info = req.body;
    if ( !utils.checkUUID(req.params.tenantUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    info.tenantUUID=tenantUUID;
    var directoryUUID;
    if(info.simCard && info.simCard.href){
        if(info.simCard.href.indexOf('simCards/')>-1){
            directoryUUID = utils.getUUIDInHref(info.simCard.href, 'directories/', '/simCards');
        }
    }
    var judgeResult = mainParam(info);
    var isTenant = isTenantExist(tenantUUID);
    var getExist=isExist(info.simCard, info.group, tenantUUID, null);

    var topic='';
    Promise.all([judgeResult, isTenant, getExist]).then(function(result){
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false){
            throw result[1];
        }
        topic=result[1].topic;
        if(result[2].flag!=0){
            if(result[2].error && result[2].error.status == 404){
                return Promise.resolve(groupMembershipProxy.createGroupMembership(info));
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
        result.directoryUUID=directoryUUID;
        var bodyDataJson = returnResources.generateGroupMembershipRetInfo(tenantUUID, result);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
        return;
    }).catch(function(err) {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.createGroupMembership = function(req, res, next) {
    var version = req.params.version;
    if(version == common.VERSION100){
        createGroupMembershipV1(req, res);
        if(config.record == true){
            next();
        }
    }
};


/**
 * @api {get} /:version/tenants/:tenantUUID/groupMemberships/:groupMembershipUUID RetrieveGroupMembership
 * @apiName RetrieveGroupMembership
 * @apiVersion 1.0.0
 * @apiGroup GroupMembership
 * @apiDescription  获取指定SIM卡与组的关系信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是group,simCard或他们的组合，中间用','号隔开
 *
 * @apiParam (output) {url}  simCard SIM卡，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} group 组，见[Group](#api-Group)资源
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F',
 *   'simCard' : {
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'
 *   },
 *   'group':{
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F'
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
function isExpandStrVail(expandStr){
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        switch (expandArray[i]) {
            case 'group':
            case 'simCard':
                break;
            default:
                return false;
        }
    }
    return true;
}
function getGroup(tenantUUID, groupUUID ){
    return new Promise(function (resolve) {
        groupsProxy.retrieveGroup(groupUUID)
            .then(function(results){
                var judge = common.isOnly(null, results);
                if(judge.is == false){
                    throw (judge);
                }
                var bodyInfo = returnResources.generateGroupRetInfo(tenantUUID, results[0]);
                resolve(bodyInfo);
            })
    })
}
var getSimCardForExpand = (tenantUUID, simCardUUID) => {
    return new Promise(function (resolve) {
        simCardProxy.getSIMCard(simCardUUID)
            .then(function(results){
                var judge = common.isOnly(null, results);
                if(judge.is == false){
                    throw (judge);
                }
                var bodyInfo = returnResources.generateSIMCardRetInfo(tenantUUID, results[0]);
                resolve(bodyInfo);
            })
    })
}

function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){

    return new Promise(function(resolve){
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i){
            switch(expandArray[i]){
                case 'group':
                    getGroup(tenantUUID, data.groupUUID).then(function(result){
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.group = result;
                            }else{
                                retInfo.items[itemIndex].group = result;
                            }
                            index += 1;
                            if(index == expandArray.length)  {
                                resolve(retInfo);
                            }else{
                                return retInfo;
                            }
                        }
                    });
                    break;
                case 'simCard':
                    getSimCardForExpand(tenantUUID, data.simCardUUID).then(function(result){
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.simCard = result;
                            }else{
                                retInfo.items[itemIndex].simCard = result;
                            }
                            index += 1;
                            if(index == expandArray.length)  {
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

var getSimCard = (simCardUUID) => {
    return Promise.resolve(simCardProxy.getSIMCard(simCardUUID));
}

var retrieveGroupMembershipV1=function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.groupMembershipUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;

    var groupMembershipUUID=req.params.groupMembershipUUID;
    var expandStr = req.query.expand;
    var judgeParams = common.isValidQueryParams(req, null, isExpandStrVail);
    var retOrganization=Promise.resolve(groupMembershipProxy.retrieveGroupMembership(tenantUUID, groupMembershipUUID));
    Promise.all([judgeParams, retOrganization]).then(function(results){
        if(results[0].is==false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is){
           return   getSimCard(results[1][0].simCardUUID).then((result) =>{
                 if(result.length == 0){
                     return result;
                 }
                results[1][0].directoryUUID = result[0].directoryUUID;
                  var bodyInfo = returnResources.generateGroupMembershipRetInfo(tenantUUID, results[1][0]);
                  if(!results[0].isExpand){
                      return bodyInfo;
                  }
                  return new Promise(function(resolve){
                      getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID)
                          .then(function(data){
                              return resolve(data);
                          });
                  })
            })
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve groupMembership.the uuid: ' + groupMembershipUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve groupMembership. the uuid: ' + groupMembershipUUID;
        }
        throw judge;
    }).then(function(bodyInfo){
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
    }).catch(function(err) {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.retrieveGroupMembership=function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveGroupMembershipV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {delete} /:version/tenants/:tenantUUID/groupMemberships/:groupMembershipUUID DeleteGroupMembership
 * @apiName DeleteGroupMembership
 * @apiVersion 0.0.1
 * @apiGroup GroupMembership
 * @apiDescription  删除指定SIM卡与组的关系
 * @apiParamExample Example Request
 * Delete https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */

var deleteGroupMembershipV1=function(req, res) {
    if (!utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.groupMembershipUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var groupMembershipUUID = req.params.groupMembershipUUID;
    var isMembership = isExist(null, null, tenantUUID, groupMembershipUUID);
    var delGroupMembership = Promise.resolve(groupMembershipProxy.deleteGroupMembership(groupMembershipUUID));
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
    Promise.all([isMembership, delGroupMembership]).then(function (result) {
        if(result[0].is==false){
            throw result[0];
        }
        var judge = common.isOnly(null, result[1]);
        if (judge.is) {
            ep.emit('send_Message');
            res.writeHead(204, {'Content-Type': contentType});
            res.end();
            return;
        }
        var error = judge.error;
        if (judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve groupMembership.the uuid: ' + tenantUUID;
        }else if (judge.flag == 2) {
            error.description = 'Find much resource when retrieve groupMembership. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch(function (err) {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.deleteGroupMembership=function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteGroupMembershipV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listGroupMembershipsV1 = function(req, res) {
    if (!utils.checkUUID(req.params.tenantUUID)) {
        var error={
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
    var isTenant = isTenantExist(tenantUUID);
    var listSuccess = Promise.resolve(groupMembershipProxy.queryGroupMemberships(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(groupMembershipProxy.getCount(tenantUUID, queryConditions));

    Promise.all([judgeQuery, isTenant, listSuccess, countSuccess]).then(function (results) {
        if (results[0].is == false) {
            throw results[0];
        }
        if (results[1].is == false) {
            throw results[1];
        }
        if (results[2].length == 0) {
            results[2] = new Array();
        }
        var simCardResult = new Array;
        for(let i in results[2]) {
            simCardResult[i] = getSimCard(results[2][i].simCardUUID).then((result) => {
                if (result.length == 0) {
                    throw result;
                }
                results[2][i].directoryUUID = result[0].directoryUUID;
                return results[2][i];
            })
        }
      return  Promise.all(simCardResult).then((simResults) => {
            var bodyInfo = returnResources.generateListGroupMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], simResults);
            if (!results[0].isExpand || simResults.length == 0) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            }
            var count = 0;
            new Promise(function(resolve){
                for (var i = 0; i < results[2].length; ++i) {
                    getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                        ++count;
                        if (count == results[2].length) {
                            return resolve(datas);
                        }
                    })
                }
            }).then(function (bodyInfo) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            });
        });
    }).catch(function (err) {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.listGroupMemberships=function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        listGroupMembershipsV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

function isGroupExist(tenantUUID, groupUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + groupUUID + '\'';
    return new Promise(function (resolve) {
        groupsProxy.queryBy(null, queryStr)
            .then(function(results){
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    resolve(results[0]);
                    return;
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query group.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query group. the query string: ' + queryStr;
                }
                resolve( judge);
            });
    });
}

var listGroupMembershipsByGroupV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.groupUUID) ) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var groupUUID=req.params.groupUUID;

    var queryConditions = req.query;
    var expandStr  = req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var judgeQuery=common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var isGroup = isGroupExist(tenantUUID, groupUUID);
    var listSuccess=Promise.resolve(groupMembershipProxy.queryGroupMemberships(tenantUUID, queryConditions, offset, limit, groupUUID));
    var countSuccess=Promise.resolve(groupMembershipProxy.getCount(tenantUUID, queryConditions, groupUUID));

    Promise.all([judgeQuery, isGroup, listSuccess, countSuccess]).then(function(results){
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var simCardResult = new Array;
        for(let i in results[2]) {
            simCardResult[i] = getSimCard(results[2][i].simCardUUID).then((result) => {
                if (result.length == 0) {
                    throw result;
                }
                results[2][i].directoryUUID = result[0].directoryUUID;
                return results[2][i];
            })
        }
        return  Promise.all(simCardResult).then((simResults) => {
            var bodyInfo = returnResources.generateListGroupMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], simResults);
            if (!results[0].isExpand || simResults.length == 0) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            }
            var count = 0;
            new Promise(function(resolve){
                for (var i = 0; i < results[2].length; ++i) {
                    getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                        ++count;
                        if (count == results[2].length) {
                            return resolve(datas);
                        }
                    })
                }
            }).then(function (bodyInfo) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            });
        });
    }).catch(function(err) {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listGroupMembershipsByGroup=function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        listGroupMembershipsByGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listGroupMembershipsBysimCardV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.groupUUID) ) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var simCardUUID = req.params.simCardUUID;
    var queryConditions = req.query;
    var expandStr  = req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var judgeQuery=common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var listSuccess=Promise.resolve(groupMembershipProxy.queryGroupMemberships(tenantUUID, queryConditions, offset, limit, null, simCardUUID));
    var countSuccess=Promise.resolve(groupMembershipProxy.getCount(tenantUUID, queryConditions, null));
    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function(results){
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var simCardResult = new Array;
        for(let i in results[2]) {
            simCardResult[i] = getSimCard(results[2][i].simCardUUID).then((result) => {
                if (result.length == 0) {
                    throw result;
                }
                results[2][i].directoryUUID = result[0].directoryUUID;
                return results[2][i];
            })
        }
        return  Promise.all(simCardResult).then((simResults) => {
            var bodyInfo = returnResources.generateListGroupMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], simResults);
            if (!results[0].isExpand || simResults.length == 0) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            }
            var count = 0;
            new Promise(function(resolve){
                for (var i = 0; i < results[2].length; ++i) {
                    getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                        ++count;
                        if (count == results[2].length) {
                            return resolve(datas);
                        }
                    })
                }
            }).then(function (bodyInfo) {
                res.writeHead(200, {'Content-Type': contentType});
                res.write(JSON.stringify(bodyInfo));
                res.end();
                return;
            });
        });
    }).catch(function(err) {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listGroupMembershipsBysimCard=function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        listGroupMembershipsBysimCardV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var bulkCreateGroupMembership =function(tenantUUID,  info, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    var directoryUUID;
    if(info.simCard && info.simCard.href){
        if(info.simCard.href.indexOf('simCards/')>-1){
            directoryUUID = utils.getUUIDInHref(info.simCard.href, 'directories/', '/simCards');
        }
    }
    var judgeResult = mainParam(info);
    var isTenant = isTenantExist(tenantUUID);
    var getExist=isExist(info.simCard, info.group, tenantUUID, null);
    var topic='';
    Promise.all([judgeResult, isTenant, getExist]).then(function(result){
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false){
            throw result[1];
        }
        topic=result[1].topic;
        if(result[2].flag!=0){
            if(result[2].error && result[2].error.status == 404){
                return Promise.resolve(groupMembershipProxy.createGroupMembership(info));
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
        result.directoryUUID=directoryUUID;
        var bodyDataJson = returnResources.generateGroupMembershipRetInfo(tenantUUID, result);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        callback(null, bodyDataJson);
        return;
    }).catch(function(err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteGroupMembership=function(tenantUUID, groupMembershipUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(groupMembershipUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var isMembership = isExist(null, null, tenantUUID, groupMembershipUUID);
    var delGroupMembership = Promise.resolve(groupMembershipProxy.deleteGroupMembership(groupMembershipUUID));

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
    Promise.all([isMembership, delGroupMembership]).then(function (result) {
        if(result[0].is==false){
            throw result[0];
        }
        var judge = common.isOnly(null, result[1]);
        if (judge.is) {
            ep.emit('send_Message');
            callback(null, 204);
            return;
        }
        var error = judge.error;
        if (judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve groupMembership.the uuid: ' + tenantUUID;
        }else if (judge.flag == 2) {
            error.description = 'Find much resource when retrieve groupMembership. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch(function (err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkRetrieveGroupMembership =function(tenantUUID, groupMembershipUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(groupMembershipUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, null, isExpandStrVail);
    var retOrganization=Promise.resolve(groupMembershipProxy.retrieveGroupMembership(tenantUUID, groupMembershipUUID));
    Promise.all([judgeParams, retOrganization]).then(function(results){
        if(results[0].is==false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is){
            return   getSimCard(results[1][0].simCardUUID).then((result) =>{
                if(result.length == 0){
                    return result;
                }
                results[1][0].directoryUUID = result[0].directoryUUID;
                var bodyInfo = returnResources.generateGroupMembershipRetInfo(tenantUUID, results[1][0]);
                if(!results[0].isExpand){
                    return bodyInfo;
                }
                return new Promise(function(resolve){
                    getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID)
                        .then(function(data){
                            return resolve(data);
                        });
                })
            })
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve groupMembership.the uuid: ' + groupMembershipUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve groupMembership. the uuid: ' + groupMembershipUUID;
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

var bulkListGroupMembership =function( tenantUUID, queryConditions, callback){
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
    var isTenant = isTenantExist(tenantUUID);
    var listSuccess = Promise.resolve(groupMembershipProxy.queryGroupMemberships(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(groupMembershipProxy.getCount(tenantUUID, queryConditions));

    Promise.all([judgeQuery, isTenant, listSuccess, countSuccess]).then(function (results) {
        if (results[0].is == false) {
            throw results[0];
        }
        if (results[1].is == false) {
            throw results[1];
        }
        if (results[2].length == 0) {
            results[2] = new Array();
        }
        var simCardResult = new Array;
        for(let i in results[2]) {
            simCardResult[i] = getSimCard(results[2][i].simCardUUID).then((result) => {
                if (result.length == 0) {
                    throw result;
                }
                results[2][i].directoryUUID = result[0].directoryUUID;
                return results[2][i];
            })
        }
        return  Promise.all(simCardResult).then((simResults) => {
            var bodyInfo = returnResources.generateListGroupMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], simResults);
            if (!results[0].isExpand || simResults.length == 0) {
                callback(null, bodyInfo);
                return;
            }
            var count = 0;
            new Promise(function(resolve){
                for (var i = 0; i < results[2].length; ++i) {
                    getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                        ++count;
                        if (count == results[2].length) {
                            return resolve(datas);
                        }
                    })
                }
            }).then(function (bodyInfo) {
                callback(null, bodyInfo);
                return;
            });
        });
    }).catch(function (err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, groupMembershipUUID= '', queryConditions='';
    if(utils.isGroupMembershipsURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/groupMemberships');
        groupMembershipUUID=utils.getUUIDInHref(urlPath, 'groupMemberships/');
    }else if(utils.isGroupMembershipURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/groupMemberships');
        isList=true;
    }
    if(active=='post'){
        bulkCreateGroupMembership(tenantUUID,  params, callback);
    }else if(active=='delete'){
        bulkDeleteGroupMembership(tenantUUID, groupMembershipUUID, callback);
    } else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListGroupMembership(tenantUUID, queryConditions, callback);
        }else{
            bulkRetrieveGroupMembership(tenantUUID, groupMembershipUUID, queryConditions, callback);
        }
    }
}