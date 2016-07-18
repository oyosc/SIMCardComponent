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
var directoryProxy = require('../proxy/directoryOperator');
var organizationProxy=require('../proxy/organizationOperator');
var simCardProxy =require('../proxy/simCardOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');
var tenantProxy= require('../proxy/tenantOperator');


/**
 * @apiDefine Directory Directory
 *
 * 目录(Directory)资源是一个容器类资源；
 * 它可以用来对设备[SIMCard](#api-SIMCard)进行存储；
 *
 * Directory资源在一个Tenant中是唯一的，包括：name字段
 */
function isValidQueryCondition(queryCondition) {
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

var validateParams = function(info, isCreate) {
    var judgeResult;
    if(isCreate){
        judgeResult = common.mandatoryParams(info, [ 'name', 'description']);
    }else {
        judgeResult = common.mandatoryParams(info, [ 'name', 'description', 'status']);
    }
    return judgeResult;
}

function isTenantExist(tenantUUID){
    var queryStr = 'uuid=\'' + tenantUUID + '\'';
    return Promise.resolve(tenantProxy.queryBy(null, queryStr))
        .then((results) =>{
            var judge = common.isOnly(null, results.length);
            if(judge.is){
                return results[0] ;
            }
            if(judge.flag == 1){
                judge.error.description = 'Could not find the resources you want to query tenant.the query string: ' + queryStr;
            }else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query tenant. the query string: ' + queryStr;
            }
            return judge ;
        });
}

function isOrganizationExist(tenantUUID, organizationUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + organizationUUID + '\'';
    return new Promise(function (resolve) {
        organizationProxy.queryBy(null, queryStr)
            .then(function(results){
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    resolve(results[0]);
                    return;
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query organization.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query organization. the query string: ' + queryStr;
                }
                resolve( judge);
            });
    });
}

function isExist(name, tenantUUID, uuid) {
    var queryStr ='tenantUUID=\'' + tenantUUID + '\'';
    if(name) {
        queryStr = 'name=\''+ name + '\'';
    } else {
        queryStr = 'uuid=\''+ uuid + '\'';
    }
    return new Promise(function(resolve){
        directoryProxy.queryBy(null, queryStr)
            .then(function(results){
                var judge = common.isOnly(null, results.length);
                if(judge.is) {
                    resolve(results[0]);
                    return;
                }

                var error = judge.error;
                if(judge.flag == 1) {
                    error.description = 'Could not find the resources you want to query directory.the query string: ' + queryStr;
                } else if(judge.flag == 2) {
                    error.description = 'Find much resource when query group. the directory string: ' + queryStr;
                }
                resolve( judge);
            })
    });
}

function isExpandStrVail(expandStr){
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        var retExpand = common.getExpand(expandArray[i]);
        switch (retExpand[0]) {
            case 'organizations':
            case 'simCards':
                break;
            default:
                return false;
        }
    }
    return true;
}
function getSIMCards(tenantUUID, directoryUUID, offset, limit){
    return new Promise(function (resolve) {
        simCardProxy.querySIMCards(directoryUUID, {}, offset, limit)
            .then(function(results){
                if (results.length == 0) {
                    results = new Array();
                }
                var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, directoryUUID, {}, offset, limit, results);
                resolve(bodyInfo);
            })
    })
}
function getOrganization(tenantUUID, directoryUUID, offset, limit){
    return new Promise(function (resolve) {
        organizationProxy.queryOrganizations(tenantUUID, {}, offset, limit, directoryUUID )
            .then(function(results){
                if (results.length == 0) {
                    results = new Array();
                }
                var bodyInfo = returnResources.generateListOrganizationRetInfo(tenantUUID, {}, offset, limit, results, directoryUUID);
                resolve(bodyInfo);
            })
    })
}
function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){

    return new Promise(function(resolve){
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i) {
            var retExpand = common.getExpand(expandArray[i]);
            switch(retExpand[0]) {
                case 'organizations':
                    getOrganization(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then(function(result){
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.organizations = result;
                            } else{
                                retInfo.items[itemIndex].organizations = result;
                            }
                            index += 1;
                            if(index == expandArray.length) {
                                resolve(retInfo);
                            }else{
                                return retInfo;
                            }
                        }
                    });
                    break;
                case 'simCards':
                    getSIMCards(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then(function(result){
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.simCards = result;
                            }else{
                                retInfo.items[itemIndex].simCards = result;
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
                    return;
            }
        }
    });
}
/**
 * @api {post} /:version/tenants/:tenantUUID/directories CreateDirectory
 * @apiName CreateDirectory
 * @apiVersion 1.0.0
 * @apiGroup Directory
 * @apiDescription  创建一个目录
 * @apiParam (input) {string} name　名称 (1<N<=255)，唯一性
 * @apiParam (input) {string} [status] 状态（值为ENABLED、DISABLED）,默认为ENABLED
 * @apiParam (input) {string} description　描述 (0<=N<1000)
 * @apiParam (input) {json} [customData] 扩展自定义数据,默认为{}
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards 该目录下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} organizations 该目录所在组织列表，见[Organization](#api-Organization)资源
 * @apiParam (output) {url} organizationMemberships 该目录所在组织关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData" : {}
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *  "organizations" : {
 *     "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizations"
 *  },
 *  "organizationMemberships" : {
 *     "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *  },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */

var createDirectoryV1 = (req, res) => {
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

    var judgeResult = validateParams(info, true);
    var getExist=isExist(info.name, tenantUUID, null);
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
    Promise.all([judgeResult, getExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag!=0){
            if(result[1].error && result[1].error.status == 404) {
                return Promise.resolve(directoryProxy.createDirectories(info));
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
    }).then((result) => {
            var bodyDataJson = returnResources.generateDirectoryRetInfo(result);
            ep.emit('send_Message', bodyDataJson);
            res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
            res.write(JSON.stringify(bodyDataJson));
            res.end();
            return;
        })
        .catch(function(err) {
            common.errReturnCommon(err, res);
            return;
        });
};

exports.createDirectory = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        createDirectoryV1(req, res);
        if(config.record == true){
            next();
        }
    }
};


/**
 * @api {put} /:version/tenants/:tenantUUID/directories/:directoryUUID UpdateDirectory
 * @apiName UpdateDirectory
 * @apiVersion 1.0.0
 * @apiGroup Directory
 * @apiDescription  更新目录信息
 * @apiParam (input) {string} name　名称 (1<N<=255)，唯一性
 * @apiParam (input) {string} status 状态（值为ENABLED、DISABLED）,默认为ENABLED
 * @apiParam (input) {string} description　描述 (0<=N<1000)
 * @apiParam (input) {json} customData 扩展自定义数据,默认为{}
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards 该目录下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} organizations 该目录所在组织列表，见[Organization](#api-Organization)资源
 * @apiParam (output) {url} organizationMemberships 该目录所在组织关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * PUT https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "组名称",
 *   "status": "ENABLED",
 *   "description": "组描述",
 *   "customData":{}
 * }
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *  "organizations" : {
 *     "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizations"
 *  },
 *  "organizationMemberships" : {
 *     "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *  },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
var updateDirectoryV1 = (req, res) => {
    var info = req.body;
    if ( !utils.checkUUID(req.params.tenantUUID) &&  !utils.checkUUID(req.params.directoryUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var directoryUUID = req.params.directoryUUID;
    info.uuid = directoryUUID;
    var tenantUUID=req.params.tenantUUID;
    info.tenantUUID=tenantUUID;

    var judgeResult = validateParams(info, true);
    var getExist=isExist(null, tenantUUID, info.uuid);
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
    Promise.all([judgeResult, getExist]).then(function(result){
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(directoryProxy.updateDirectories(info));
        }
    }).then(function(result){
            var bodyDataJson = returnResources.generateDirectoryRetInfo(result);
            ep.emit('send_Message', bodyDataJson);
            res.writeHead(200, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
            res.write(JSON.stringify(bodyDataJson));
            res.end();
            return;
        })
        .catch(function(err) {
            common.errReturnCommon(err, res);
            return;
        });
}

exports.updateDirectory = function(req, res, next ) {
    var version = req.params.version;
    if(version == common.VERSION100){
        updateDirectoryV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/directories/:directoryUUID RetrieveDirectory
 * @apiName RetrieveDirectory
 * @apiVersion 1.0.0
 * @apiGroup Directory
 * @apiDescription  获取指定目录信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCard[offset, limit]、organizations[offset, limit]、tenant或他们的组合，中间用','号隔开
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards该目录下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} organizations 该目录所在组织列表，见[Organization](#api-Organization)资源
 * @apiParam (output) {url} organizationMemberships 该目录所在组织关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 * {
 *   "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *  "organizations" : {
 *     "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizations"
 *  },
 *  "organizationMemberships" : {
 *     "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *  },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   }
 * }
 */
var retrieveDirectoryV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var directoryUUID = req.params.directoryUUID;
    var expandStr = req.query.expand;

    var judgeParams = common.isValidQueryParams(req, null, isExpandStrVail);
    var retDirectory = Promise.resolve(directoryProxy.retrieveDirectory(tenantUUID, directoryUUID));
    Promise.all([judgeParams, retDirectory]).then(function(results){
        if(results[0].is == false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateDirectoryRetInfo(results[1][0]);
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
            error.description = 'Could not find the resources you want to retrieve directory.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve directory. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).then(function(bodyInfo){
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
        return;
    }).catch(function(err) {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.retrieveDirectory = function(req, res, next ){
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveDirectoryV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {delete} /:version/tenants/:tenantUUID/directories/:directoryUUID DeleteDirectory
 * @apiName DeleteDirectory
 * @apiVersion 1.0.0
 * @apiGroup Directory
 * @apiDescription  删除指定目录信息
 * @apiParamExample Example Request
 * Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */
var deleteDirectoryV1 = (req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var directoryUUID = req.params.directoryUUID;
    var delDirectory = Promise.resolve(directoryProxy.deleteDirectory(directoryUUID));
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
    delDirectory.then((result) => {
        var judge = common.isOnly(null, result);
        if(judge.is) {
            ep.emit('send_Message');
            res.writeHead(204, {'Content-Type': contentType});
            res.end();
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve Directory.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve Directory. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch((err) => {
        common.errReturnCommon(err,res);
        return;
    });
}
exports.deleteDirectory = (req, res, next ) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteDirectoryV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/directories ListDirectories
 * @apiName ListDirectories
 * @apiVersion 1.0.0
 * @apiGroup Directory
 * @apiDescription  获取指定目录信息列表
 * @apiParam  {int} [offset]　偏移量
 * @apiParam  {int} [limit] 获取条数
 * @apiParam  {string} [name]　组名称,支持模糊查询，如 '*名称*'
 * @apiParam  {string} [type]　类型
 * @apiParam  {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCard[offset, limit]、organizations[offset, limit]或他们的组合，中间用','号隔开
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories",
 *      "offset":"0",
 *      "limit":"25",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "名称",
 *          "status": "ENABLED",
 *          "description": "描述",
 *          "customData":{},
 *          ...
 *      },
 *      {
 *          "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "名称",
 *          "description": "描述",
 *          ... remaining directories name/value pairs ...
 *      },
 *      ... remaining items of directories ...
 *    ]
 *  }
 */
var listDirectoriesV1 = function(req, res){
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
    var listSuccess = Promise.resolve(directoryProxy.queryDirectory(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(directoryProxy.getCount(tenantUUID, queryConditions))

    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function(result){
        if(result[0].is ==  false){
            throw result[0];
        }
        if(result[1].length == 0){
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListDirectoryRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
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
        }).catch(function(err) {
            common.errReturnCommon(err, res);
            return;
        })
    }).catch(function(err) {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.listDirectories = function(req, res, next ){
    var version = req.params.version;
    if(version == common.VERSION100){
        listDirectoriesV1(req, res);
        if(config.record == true){
            next();
        }
    }
};

var listDirectoriesByOrganizationV1 = function(req, res){
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.organizationUUID) ) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var organizationUUID=req.params.organizationUUID;

    var queryConditions = req.query;
    var expandStr  = req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);

    var judgeQuery=common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var isOrganization = isOrganizationExist(tenantUUID, organizationUUID);
    var listSuccess=Promise.resolve(directoryProxy.queryDirectory(tenantUUID, queryConditions, offset, limit, organizationUUID));
    var countSuccess=Promise.resolve(directoryProxy.getCount(tenantUUID, queryConditions, organizationUUID));

    Promise.all([judgeQuery, isOrganization, listSuccess, countSuccess]).then(function(results){
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListDirectoryRetInfo(tenantUUID, queryConditions, offset, results[3], results[2], organizationUUID);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise(function(resolve){
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID)
                    .then(function (datas) {
                        ++count;
                        if (count == results[2].length) {
                            resolve(datas);
                        }
                    })
            }
        }).then(function (bodyInfo) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        });
    }).catch(function(err) {
        common.errReturnCommon(err, res)
        return;
    });
};
exports.listDirectoriesByOrganization=function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        listDirectoriesByOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var bulkCreateDirectory =function(tenantUUID,  params, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    params.tenantUUID=tenantUUID;
    var judgeResult = validateParams(params, true);
    var getExist=isExist(params.name, tenantUUID, null);
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

    Promise.all([judgeResult, getExist]).then(function(result){
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag!=0){
            if(result[1].error && result[1].error.status == 404) {
                return Promise.resolve(directoryProxy.createDirectories(params));
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
            var bodyDataJson = returnResources.generateDirectoryRetInfo(result);
            ep.emit('send_Message', bodyDataJson);
            callback(null, bodyDataJson);
            return;
        })
        .catch(function(err) {
            common.errReturnCallback(err, callback);
            return;
        });
};

var bulkUpdateDirectory =function(tenantUUID, directoryUUID, info, callback) {
    if ( !utils.checkUUID(tenantUUID) &&  !utils.checkUUID(directoryUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        common.errReturnCallback(error, callback);
    }
    info.uuid = directoryUUID;
    info.tenantUUID=tenantUUID;
    var judgeResult = validateParams(info, true);
    var getExist=isExist(null, tenantUUID, info.uuid);

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

    Promise.all([judgeResult, getExist]).then(function(result){
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(directoryProxy.updateDirectories(info));
        }
    }).then(function(result){
            var bodyDataJson = returnResources.generateDirectoryRetInfo(result);
            ep.emit('send_Message', bodyDataJson);
            callback(null, bodyDataJson);
            return;
        })
        .catch(function(err) {
            common.errReturnCallback(err, callback);
            return;
        });
}
var bulkDeleteDirectory=function(tenantUUID, directoryUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(directoryUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var delDirectory = Promise.resolve(directoryProxy.deleteDirectory(directoryUUID));
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
    delDirectory.then(function(result){
        var judge = common.isOnly(null, result);
        if(judge.is) {
            ep.emit('send_Message');
            callback(null, 204);
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve Directory.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve Directory. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch(function(err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkRetrieveDirectory =function(tenantUUID, directoryUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(directoryUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, null, isExpandStrVail);
    var retdirectory = Promise.resolve(directoryProxy.retrieveDirectory(tenantUUID, directoryUUID));
    Promise.all([judgeParams, retdirectory]).then(function(results){
        if(results[0].is == false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateDirectoryRetInfo(results[1][0]);
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
            error.description = 'Could not find the resources you want to retrieve directory.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve directory. the uuid: ' + tenantUUID;
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

var bulkListDirectory =function( tenantUUID, queryConditions, callback){
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
    var listSuccess = Promise.resolve(directoryProxy.queryDirectory(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(directoryProxy.getCount(tenantUUID, queryConditions))

    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function(result){
        if(result[0].is ==  false){
            throw result[0];
        }
        if(result[1].length == 0){
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListDirectoryRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
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
    var tenantUUID ='', isList=false, directoryUUID= '', queryConditions='';
    if(utils.isDirectoriesURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/directories');
        directoryUUID=utils.getUUIDInHref(urlPath, 'directories/');
    }else if(utils.isDirectoryURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/directories');
        isList=true;
    }
    if(active=='post'){
        bulkCreateDirectory(tenantUUID,  params, callback);
    }else if(active=='delete'){
        bulkDeleteDirectory(tenantUUID, directoryUUID, callback);
    }else if(active=='put'){
        bulkUpdateDirectory(tenantUUID, directoryUUID, params, callback);
    } else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListDirectory(tenantUUID, queryConditions, callback);
        }else{
            bulkRetrieveDirectory(tenantUUID, directoryUUID, queryConditions, callback);
        }
    }
}