/**
 * Created by yansha on 2016/5/25.
 */

"use strict";
var common = require('./common');
var log = require("../common/log").getLogger();
var contentType = require('./common').retContentType;
var utils= require('../common/utils');
var returnResources = require('./returnResources');
var errorCodeTable = require('../common/errorCodeTable');
var tenantProxy = require('../proxy/tenantOperator');
var organizationProxy=require('../proxy/organizationOperator');
var directoryProxy=require('../proxy/directoryOperator');
var organizationMembershipProxy =require('../proxy/organizationMembershipOperator');
var simCardProxy =require('../proxy/simCardOperator');
var groupProxy =require('../proxy/groupOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');

/**
 * @apiDefine Organization Organization
 *
 * 组织(Organization)资源是一个管理类资源；
 * 它可以用来对目录[Directory](#api-Directory)或组[Group](#api-Group)进行管理；
 *
 * Organization资源在一个Tenant中是唯一的，包括：name字段
 */

var mainParam = (info, isCreate) => {
    var judgeResult;
    if(isCreate){
        judgeResult = common.mandatoryParams(info, ['name', 'description']);
    }else{
        judgeResult = common.mandatoryParams(info, ['name', 'description', 'status']);
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
function isDirectoryExist(tenantUUID, directoryUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + directoryUUID + '\'';
        return Promise.resolve(directoryProxy.queryBy(null, queryStr))
            .then((results) =>{
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    return results[0];
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query directory.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query directory. the query string: ' + queryStr;
                }
                return judge;
            });
}
function isGroupExist(tenantUUID, groupUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + groupUUID + '\'';
        return Promise.resolve(groupProxy.queryBy(null, queryStr))
            .then((results) =>{
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
function isSIMCardExist( directoryUUID, simCardUUID ){
    var queryStr = 'directoryUUID=\'' + directoryUUID + '\' and uuid=\'' + simCardUUID + '\'';
        return Promise.resolve(simCardProxy.queryBy(null, queryStr))
            .then((results) =>{
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    return results[0];
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query SIMCard.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query SIMCard. the query string: ' + queryStr;
                }
                return judge;
            });
}

function isExist(name, tenantUUID, uuid){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\'';
    if(name){
        queryStr += ' and name=\''+ name + '\'';
    } else {
        queryStr += ' and uuid=\''+ uuid + '\'';
    }
        return Promise.resolve(organizationProxy.queryBy(null, queryStr))
            .then((results) =>{
                var judge = common.isOnly(null, results.length);
                if(judge.is) {
                    return results[0];
                }
                if(judge.flag == 1) {
                    judge.error.description = 'Could not find the resources you want to query Organization.the query string: ' + queryStr;
                } else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query Organization. the query string: ' + queryStr;
                }
                return judge;
            });
}
function isValidQueryCondition(queryCondition) {
    for(var item in queryCondition){
        switch(item){
            case 'uuid' : case 'name' :
            case 'createAt' :  case 'modifiedAt' :
            case 'expand':case 'offset': case 'limit':
            case 'orderBy':
                break;
            default:
                return false;
        }
    }
    return true;
}


/**
 * @api {post} /:version/tenants/:tenantUUID/organizations CreateOrganization
 * @apiName CreateOrganization
 * @apiVersion 1.0.0
 * @apiGroup Organization
 * @apiDescription  创建一个组织
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
 * @apiParam (output) {url} simCards 该组织下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} groups 该组织下所有的组URL链接，见[Group](#api-Group)资源
 * @apiParam (output) {url} directories 该组织下所有的目录URL链接，见[Directory](#api-Directory)资源
 * @apiParam (output) {url} organizationMemberships 与该组织关联的关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组织的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations
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
 * Location: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{},
 *   "simCards"  : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *   "groups"  : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/groups"
 *   },
 *   "directories" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/directories"
 *   },
 *   "organizationMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */

var createOrganizationV1 = (req, res) => {
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

    var judgeResult = mainParam(info, true);
    var isTenant = isTenantExist(tenantUUID);
    var getExist=isExist(info.name, tenantUUID, null);
    var topic='';
    Promise.all([ judgeResult, isTenant, getExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false){
            throw result[1];
        }
        topic=result[1].topic;
        if(result[2].flag!=0){
            if(result[2].error && result[2].error.status == 404){
                return Promise.resolve(organizationProxy.createOrganization(info));

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
    }).then((result) =>{
        var bodyDataJson = returnResources.generateOrganizationRetInfo(result);
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
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.createOrganization=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        createOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {put} /:version/tenants/:tenantUUID/organizations/:organizationUUID UpdateOrganization
 * @apiName UpdateOrganization
 * @apiVersion 1.0.0
 * @apiGroup Organization
 * @apiDescription  更新组织信息
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
 * @apiParam (output) {url} simCards 该组织下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} groups 该组织下所有的组URL链接，见[Group](#api-Group)资源
 * @apiParam (output) {url} directories 该组织下所有的目录URL链接，见[Directory](#api-Directory)资源
 * @apiParam (output) {url} organizationMemberships 与该组织关联的关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组织的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData" : {}
 * }
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{},
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *   "groups"  : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/groups"
 *   },
 *   "directories" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/directories"
 *   },
 *   "organizationMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
var updateOrganizationV1=(req, res) =>{
    var info = req.body;
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.organizationUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var organizationUUID=req.params.organizationUUID;
    info.tenantUUID=tenantUUID;
    info.uuid=organizationUUID;
    var judgeResult = mainParam(info, true);
    var getExist=isExist(null, tenantUUID, organizationUUID);
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
    Promise.all([judgeResult, getExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(organizationProxy.updateOrganization(info))
        }
    }).then((result) =>{
        var bodyInfo = returnResources.generateOrganizationRetInfo(result);
        ep.emit('send_Message', bodyInfo);
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
        return;
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.updateOrganization=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        updateOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/organizations/:organizationUUID RetrieveOrganization
 * @apiName RetrieveOrganization
 * @apiVersion 0.0.1
 * @apiGroup Organization
 * @apiDescription  获取指定组织信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、groups[offset,limit]、directories[offset,limit]、organizationMemberships[offset,limit]或他们的组合，中间用','号隔开
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards 该组织下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} groups 该组织下所有的组URL链接，见[Group](#api-Group)资源
 * @apiParam (output) {url} directories 该组织下所有的目录URL链接，见[Directory](#api-Directory)资源
 * @apiParam (output) {url} organizationMemberships 与该组织关联的关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组织的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{},
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *   "groups"  : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/groups"
 *   },
 *   "directories" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/directories"
 *   },
 *   "organizationMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
function isExpandStrVail(expandStr){
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        var retExpand = common.getExpand(expandArray[i]);
        switch(retExpand[0]){
            case 'directories':case 'organizationMemberships':
            case 'groups':case 'simCards':
            break;
            default:
                return false;
        }
    }
    return true;
}
function getDirectory(tenantUUID, organizationUUID, offset, limit){
    return Promise.resolve(directoryProxy.queryDirectory(tenantUUID, {}, offset, limit, organizationUUID ))
            .then((results) =>{
                if (results.length == 0) {
                    results = new Array();
                }
                var bodyInfo = returnResources.generateListDirectoryRetInfo(tenantUUID, {}, offset, limit,  results, organizationUUID);
                return bodyInfo ;
            })
}
function getSIMCards(tenantUUID, organizationUUID, offset, limit){
    return Promise.resolve(simCardProxy.querySIMCards(null, {}, offset, limit, null, organizationUUID))
            .then((results) =>{
                if (results.length == 0) {
                    results = new Array();
                }
                var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, null, null, offset, limit, results, null, organizationUUID);
                return bodyInfo ;
            });
}
function getOrganizationMembership(tenantUUID, organizationUUID, offset, limit){
        return Promise.resolve(organizationMembershipProxy.queryOrganizationMemberships( tenantUUID, {}, offset, limit, organizationUUID))
            .then((results) =>{
                if (results.length == 0) {
                    results = new Array();
                }
                var bodyInfo = returnResources.generateListOrganizationMembershipRetInfo(tenantUUID, {}, offset, limit, results, organizationUUID);
                return bodyInfo ;
            });
}
function getGroup(tenantUUID, organizationUUID, offset, limit){
        return Promise.resolve(groupProxy.queryGroup( tenantUUID, {}, offset, limit, null, organizationUUID))
            .then((results) =>{
                if (results.length == 0) {
                    results = new Array();
                }
                var bodyInfo = returnResources.generateListGroupRetInfo(tenantUUID, {}, offset, limit, results, null, null, organizationUUID);
                return bodyInfo ;
            });
}

function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){

    return new Promise((resolve) =>{
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i){
            var retExpand = common.getExpand(expandArray[i]);
            switch(retExpand[0]){
                case 'directories':
                    getDirectory(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then( (result) =>{
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.directories = result;
                            }else{
                                retInfo.items[itemIndex].directories = result;
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
                case 'simCards':
                    getSIMCards(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then( (result) =>{
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
                case 'organizationMemberships':
                    getOrganizationMembership(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then( (result) =>{
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.organizationMemberships = result;
                            }else{
                                retInfo.items[itemIndex].organizationMemberships = result;
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
                    getGroup(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then( (result) =>{
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.groups = result;
                            }else{
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
                    break;

                default:
                    var err = new Error('the params of expand is error!');
                    err.status = 400;
                    throw err;
            }
        }
    });
}

var retrieveOrganizationV1=(req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.organizationUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var organizationUUID=req.params.organizationUUID;
    var expandStr = req.query.expand;

    var judgeParams = common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var retOrganization=Promise.resolve(organizationProxy.retrieveOrganization(tenantUUID, organizationUUID));
    Promise.all([judgeParams, retOrganization]).then(function(results){
        if(results[0].is==false){
            throw  results[0];
        }

        var judge = common.isOnly(null, results[1].length);
        if(judge.is){
            var bodyInfo = returnResources.generateOrganizationRetInfo(results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
             return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID));
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve organization.the uuid: ' + organizationUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve organization. the uuid: ' + organizationUUID;
        }
        throw judge;

    }).then(function(bodyInfo){
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
        })
        .catch((err) => {
            common.errReturnCommon(err, res);
            return;
        });

}
exports.retrieveOrganization=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {delete} /:version/tenants/:tenantUUID/organizations/:organizationUUID DeleteOrganization
 * @apiName DeleteOrganization
 * @apiVersion 1.0.0
 * @apiGroup Organization
 * @apiDescription  删除指定组织
 * @apiParamExample Example Request
 * Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */
var deleteOrganizationV1=(req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.organizationUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var organizationUUID=req.params.organizationUUID;
    var isOrganization = isExist(null, tenantUUID, organizationUUID);
    var delOrganization=Promise.resolve(organizationProxy.deleteOrganization(organizationUUID));
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
    Promise.all([isOrganization, delOrganization]).then( (result) =>{
        if(result[0].is==false){
            throw result[0];
        }
        var judge = common.isOnly(null, result[1]);
        if(judge.is){
            ep.emit('send_Message');
            res.writeHead(204, {'Content-Type': contentType});
            res.end();
            return;
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve organization.the uuid: ' + tenantUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve organization. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.deleteOrganization=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/organizations ListOrganizations
 * @apiName ListOrganizations
 * @apiVersion 1.0.0
 * @apiGroup Organization
 * @apiDescription  获取指定组织信息列表
 * @apiParam {int} [offset]　偏移量
 * @apiParam {int} [limit] 获取条数
 * @apiParam {string} [name]　组织名称,支持模糊查询，如 '*名称*'
 * @apiParam {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、groups[offset,limit]、directories[offset,limit]、organizationMemberships[offset,limit]或他们的组合，中间用','号隔开
 *
 * @apiParamExample Example Request
 * GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"127.0.0.1:3000/api/v1/organizations",
 *      "offset":"0",
 *      "limit":"25",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "组织名称",
 *          "status": "ENABLED",
 *          "description": "组织描述",
 *          ...
 *      },
 *      {
 *          "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "组织名称",
 *          "description": "组织描述",
 *          ... remaining organizations name/value pairs ...
 *      },
 *      ... remaining items of organizations ...
 *    ]
 *  }
 */
var listOrganizationsV1 = (req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) ) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var queryConditions = req.query;
    var expandStr  = req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);

    var judgeQuery=common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var isTenant = isTenantExist(tenantUUID);
    var listSuccess=Promise.resolve(organizationProxy.queryOrganizations(tenantUUID, queryConditions, offset, limit));
    var countSuccess=Promise.resolve(organizationProxy.getCount(tenantUUID, queryConditions));

    Promise.all([judgeQuery, isTenant, listSuccess, countSuccess]).then( (results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, offset, results[3], results[2]);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise(function(resolve){
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then((datas) => {
                    ++count;
                    if (count == results[2].length) {
                        resolve(datas);
                    }else{
                        return datas;
                    }
                })
            }
        }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        });
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listOrganizations=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationsV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listOrganizationsByDirectoryV1 = (req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID) ) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var directoryUUID=req.params.directoryUUID;

    var queryConditions = req.query;
    var expandStr  = req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);

    var judgeQuery=common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var isDirectory = isDirectoryExist(tenantUUID, directoryUUID);
    var listSuccess=Promise.resolve(organizationProxy.queryOrganizations(tenantUUID, queryConditions, offset, limit, directoryUUID));
    var countSuccess=Promise.resolve(organizationProxy.getCount(tenantUUID, queryConditions, directoryUUID));

    Promise.all([judgeQuery, isDirectory, listSuccess, countSuccess]).then( (results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, offset, results[3], results[2], directoryUUID);
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
                    .then((datas) => {
                        ++count;
                        if (count == results[2].length) {
                            resolve(datas);
                        }
                    })
            }
        }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        });
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listOrganizationsByDirectory=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationsByDirectoryV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listOrganizationsByGroupV1 = (req, res) =>{
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
    var listSuccess=Promise.resolve(organizationProxy.queryOrganizations(tenantUUID, queryConditions, offset, limit, null, groupUUID));
    var countSuccess=Promise.resolve(organizationProxy.getCount(tenantUUID, queryConditions, null, groupUUID));

    Promise.all([judgeQuery, isGroup, listSuccess, countSuccess]).then( (results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, offset, results[3], results[2],  null, groupUUID);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) =>{
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID)
                    .then((datas) => {
                        ++count;
                        if (count == results[2].length) {
                            resolve(datas);
                        }
                    })
            }
        }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        });
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listOrganizationsByGroup=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationsByGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listOrganizationsBySIMCardV1 = (req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID) && !utils.checkUUID(req.params.simCardUUID) ) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var directoryUUID=req.params.directoryUUID;
    var simCardUUID=req.params.simCardUUID;

    var queryConditions = req.query;
    var expandStr  = req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);

    var judgeQuery=common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var isSIMCard = isSIMCardExist(directoryUUID, simCardUUID);
    var listSuccess=Promise.resolve(organizationProxy.queryOrganizations(tenantUUID, queryConditions, offset, limit, directoryUUID, null, null));
    var countSuccess=Promise.resolve(organizationProxy.getCount(tenantUUID, queryConditions, directoryUUID, null, null));

    Promise.all([judgeQuery, isSIMCard, listSuccess, countSuccess]).then((results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, offset, results[3], results[2],  directoryUUID, null, simCardUUID);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) =>{
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID)
                    .then((datas) => {
                        ++count;
                        if (count == results[2].length) {
                            resolve(datas);
                        }
                    })
            }
        }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        });
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listOrganizationsBySIMCard=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationsBySIMCardV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var bulkCreateOrganization=function(tenantUUID,  info, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    var judgeResult = mainParam(info, true);
    var isTenant = isTenantExist(tenantUUID);
    var getExist=isExist(info.name, tenantUUID, null);
    var topic='';
    Promise.all([ judgeResult, isTenant, getExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false){
            throw result[1];
        }
        topic=result[1].topic;
        if(result[2].flag!=0){
            if(result[2].error && result[2].error.status == 404){
                return Promise.resolve(organizationProxy.createOrganization(info));

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
    }).then((result) =>{
        var bodyDataJson = returnResources.generateOrganizationRetInfo(result);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        callback(null, result);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkUpdateOrganization=function(tenantUUID, organizationUUID,  info, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(organizationUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    info.uuid=organizationUUID;
    var judgeResult = mainParam(info, true);
    var getExist=isExist(null, tenantUUID, organizationUUID);
    var ep = new eventProxy();
    ep.on('send_Message', function(bodyInfo){
        Promise.resolve(isTenantExist(tenantUUID)).then(function(result){
            if (config.is_sendMessage) {
                var message = new Message(MessageId.Update_Service_Success, bodyInfo);
                merchandiseComponentProducer.sendMessage(result.topic, message, function(error, data){
                    console.log(error);
                });
            }
        });
    });
    Promise.all([judgeResult, getExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(organizationProxy.updateOrganization(info))
        }
    }).then((result) =>{
        var bodyInfo = returnResources.generateOrganizationRetInfo(result);
        ep.emit('send_Message', bodyInfo);
        callback(null, bodyInfo);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteOrganization=function(tenantUUID, organizationUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(organizationUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback)
    }
    var isOrganization = isExist(null, tenantUUID, organizationUUID);
    var delOrganization=Promise.resolve(organizationProxy.deleteOrganization(organizationUUID));
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
    Promise.all([isOrganization, delOrganization]).then( (result) =>{
        if(result[0].is==false){
            throw result[0];
        }
        var judge = common.isOnly(null, result[1]);
        if(judge.is){
            ep.emit('send_Message');
            callback(null, 204);
            return;
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve organization.the uuid: ' + tenantUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve organization. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkRetrieveOrganization=function(tenantUUID, organizationUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(organizationUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, isValidQueryCondition, isExpandStrVail);
    var retOrganization=Promise.resolve(organizationProxy.retrieveOrganization(tenantUUID, organizationUUID));
    Promise.all([judgeParams, retOrganization]).then(function(results){
        if(results[0].is==false){
            throw  results[0];
        }

        var judge = common.isOnly(null, results[1].length);
        if(judge.is){
            var bodyInfo = returnResources.generateOrganizationRetInfo(results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID));
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve organization.the uuid: ' + organizationUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve organization. the uuid: ' + organizationUUID;
        }
        throw judge;

    }).then(function(bodyInfo){
            callback(null, bodyInfo);
            return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkListOrganization=function( tenantUUID, queryConditions, callback){
    if (!utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback);
    }
    var expandStr  = queryConditions.expand;
    var offset = common.ifNotReturnNum(Number(queryConditions.offset), 0);
    var limit = common.ifNotReturnNum(Number(queryConditions.limit), 25);

    var judgeQuery=common.isValidQueryParams2(queryConditions, isValidQueryCondition, isExpandStrVail);
    var isTenant = isTenantExist(tenantUUID);
    var listSuccess=Promise.resolve(organizationProxy.queryOrganizations(tenantUUID, queryConditions, offset, limit));
    var countSuccess=Promise.resolve(organizationProxy.getCount(tenantUUID, queryConditions));

    Promise.all([judgeQuery, isTenant, listSuccess, countSuccess]).then( (results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, offset, results[3], results[2]);
        if (!results[0].isExpand || results[2].length == 0) {
            callback(null, bodyInfo);
            return;
        }
        var count = 0;
        new Promise(function(resolve){
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then((datas) => {
                    ++count;
                    if (count == results[2].length) {
                        resolve(datas);
                    }else{
                        return datas;
                    }
                })
            }
        }).then((bodyInfo) => {
            callback(null, bodyInfo);
            return;
        });
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, organizationUUID= '', queryConditions='';
    if(utils.isOrganizationsURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/organizations');
        organizationUUID=utils.getUUIDInHref(urlPath, 'organizations/');
    }else if(utils.isOrganizationURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/organizations');
        isList=true;
    }
    if(active=='post'){
        bulkCreateOrganization(tenantUUID,  params, callback);
    }else if(active=='put'){
        bulkUpdateOrganization(tenantUUID, organizationUUID, params, callback);
    }else if(active=='delete'){
        bulkDeleteOrganization(tenantUUID, organizationUUID, callback);
    }else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListOrganization(tenantUUID, queryConditions, callback);
        }else{
            bulkRetrieveOrganization(tenantUUID, organizationUUID, queryConditions, callback);
        }
    }
}