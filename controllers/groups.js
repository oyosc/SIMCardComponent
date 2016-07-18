/**
 * Created by Administrator on 2016/5/26.
 */
/**
 * @apiDefine Group Group
 *
 * 设备组(Group)资源是一个商品容器类资源；
 * 它可以用来对SIM卡[SIMCard](#api-SIMCard)进行分组；
 *
 * Group资源在一个Tenant中是唯一的，包括：name字段
 */
var common = require('./common');
var contentType = require('./common').retContentType;
var returnResources = require('./returnResources');
var utils= require('../common/utils');
var tenantProxy=require('../proxy/tenantOperator');
var groupsProxy = require('../proxy/groupOperator');
var simCardsProxy = require('../proxy/simCardOperator');
var organizationsProxy =  require('../proxy/organizationOperator');
var groupMembershipsProxy =  require('../proxy/groupMembershipOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');

var validateParams =(info, isCreate) => {
    var judgeResult;
    if(isCreate){
        judgeResult = common.mandatoryParams(info, [ 'name', 'description']);
    }else {
        judgeResult = common.mandatoryParams(info, ['name', 'description', 'status']);
    }
    return judgeResult;
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

var isExist = (name, uuid) => {
    var queryStr ;
    if(name) {
        queryStr = 'name=\''+ name + '\'';
    } else{
        queryStr = 'uuid=\''+ uuid + '\'';
    }
    return new Promise((resolve) => {
        groupsProxy.queryBy(null, queryStr).then((results) => {
            var judge = common.isOnly(null, results.length);
            if(judge.is) {
                resolve(results[0]);
            }
            var error = judge.error;
            if(judge.flag == 1) {
                error.flag = 1;
                error.description = 'Could not find the resources you want to query Organization.the query string: ' + queryStr;
            } else if(judge.flag == 2) {
                error.flag = 2;
                error.description = 'Find much resource when query Organization. the query string: ' + queryStr;
            }
            resolve( error);
        });
    })
}

function isTenantExist(tenantUUID){
    var queryStr = 'uuid=\'' + tenantUUID + '\'';
    return Promise.resolve(tenantProxy.queryBy(null, queryStr))
        .then((results)=> {
            var judge = common.isOnly(null, results.length);
            if(judge.is){
                return results[0];
            }
            if(judge.flag == 1){
                judge.error.description = 'Could not find the resources you want to query tenant.the query string: ' + queryStr;
            }else if(judge.flag == 2){
                judge.error.description = 'Find much resource when query tenant. the query string: ' + queryStr;
            }
            return judge ;
        });
}

/**
 * @api {post} /:version/tenants/:tenantUUID/groups CreateGroup
 * @apiName CreateGroup
 * @apiVersion 1.0.0
 * @apiGroup Group
 * @apiDescription  创建一个组
 * @apiParam (input) {string} name　组名称 (1<N<=255)，唯一性
 * @apiParam (input) {string} [status] 状态（值为ENABLED、DISABLED）,默认为ENABLED
 * @apiParam (input) {string} description　组描述 (0<=N<1000)
 * @apiParam (input) {json} [customData] 扩展自定义数据,默认为{}
 *
 * @apiParam (output) {string} name　组名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　组描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards 该组下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} groupMemberships 与该组关联的关系列表，见[GroupMembership](#api-GroupMembership)资源
 * @apiParam (output) {url} organizations 该组所在组织列表，见[Organization](#api-Organization)资源
 * @apiParam (output) {url} organizationMemberships 该组所在组织关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample  Example Request
 * POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "组名称",
 *   "status": "ENABLED",
 *   "description": "组描述",
 *   "customData" : {}
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "组名称",
 *   "status": "ENABLED",
 *   "description": "组描述",
 *   "customData":{},
 *   "groupMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/groupMemberships"
 *   },
 *   "organizations" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizations"
 *   },
 *   "organizationMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *   },
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */

var createGroupV1 = (req, res) => {
    var info = req.body;
    if (!utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error.status = 400;
        error.description = '输入参数有误';
        return common.errorReturn(res, error.status, error);
    }
    info.tenantUUID = req.params.tenantUUID;
    var judgeResult = validateParams(info, true);
    var getExist = isExist(info.name, null);
    var tenantExist = isTenantExist(info.tenantUUID);

    var topic='';
    Promise.all([judgeResult, getExist, tenantExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }if(result[2].flag){
            throw result[2];
        } else{
            topic= result[2].topic;
            return Promise.resolve(groupsProxy.createGroup(info))
        }
    }).then((result) => {
        var bodyDataJson = returnResources.generateGroupRetInfo(info.tenantUUID, result[0]);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.createGroup = function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        createGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}



/**
 * @api {put} /:version/tenants/:tenantUUID/groups/:groupUUID UpdateGroup
 * @apiName UpdateGroup
 * @apiVersion 1.0.0
 * @apiGroup Group
 * @apiDescription  更新组信息
 * @apiParam (input) {string} name　组名称
 * @apiParam (input) {string} status 状态（值为ENABLED、DISABLED）
 * @apiParam (input) {string} description　组描述
 * @apiParam (input) {json} [customData] 扩展自定义数据,默认为{}
 *
 * @apiParam (output) {string} name　组名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　组描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards 该组下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} groupMemberships 与该组关联的关系列表，见[GroupMembership](#api-GroupMembership)资源
 * @apiParam (output) {url} organizations 该组所在组织列表，见[Organization](#api-Organization)资源
 * @apiParam (output) {url} organizationMemberships 该组所在组织关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "组名称",
 *   "status": "ENABLED",
 *   "description": "组描述"
 *   "customData" : {}
 * }
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "组名称",
 *   "status": "ENABLED",
 *   "description": "组描述",
 *   "customData":{},
 *   "groupMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/groupMemberships"
 *   },
 *   "organizations" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizations"
 *   },
 *   "organizationMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *   },
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
var updateGroupV1 = (req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        return common.errorReturn(res, error.status, error);
    }

    var info = req.body;
    info.uuid = req.params.groupUUID;
    info.tenantUUID = req.params.tenantUUID;
    var judgeResult = validateParams(info);
    var getExist = isExist(null, info.uuid);
    var tenantExist = isTenantExist(info.tenantUUID);
    var topic='';
    Promise.all([judgeResult, getExist, tenantExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }
        if(result[2].flag){
            throw result[2]
        } else{
            topic= result[2].topic;
            return Promise.resolve(groupsProxy.updateGroup(info));
        }
    }).then((result) =>{
        var bodyDataJson = returnResources.generateGroupRetInfo(info.tenantUUID, result[0]);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Update_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        res.writeHead(200, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
    }).catch((err) =>{
        common.errReturnCommon(err, res);
        return;
    });
}

exports.updateGroup = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        updateGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


/**
 * @api {get} /:version/tenants/:tenantUUID/groups/:groupUUID RetrieveGroup
 * @apiName RetrieveGroup
 * @apiVersion 0.0.1
 * @apiGroup Group
 * @apiDescription  获取指定组信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、organization、groupMemberships[offset,limit]或他们的组合，中间用','号隔开
 *
 * @apiParam (output) {string} name　组名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　组描述
 * @apiParam (output) {json} customData 扩展自定义数据
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} simCards 该组下所有的SIM卡URL链接，见[SIMCard](#api-SIMCard)资源
 * @apiParam (output) {url} groupMemberships 与该组关联的关系列表，见[GroupMembership](#api-GroupMembership)资源
 * @apiParam (output) {url} organizations 该组所在组织列表，见[Organization](#api-Organization)资源
 * @apiParam (output) {url} organizationMemberships 该组所在组织关系列表，见[OrganizationMembership](#api-OrganizationMembership)资源
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 *
 * @apiParamExample Example Request
 * GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *   "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F",
 *   "name": "组名称",
 *   "status": "ENABLED",
 *   "description": "组描述",
 *   "customData":{},
 *   "groupMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/groupMemberships"
 *   },
 *   "organizations" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizations"
 *   },
 *   "organizationMemberships" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships"
 *   },
 *   "simCards" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/simCards"
 *   },
 *   "tenant" : {
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
function getOrganizations(tenantUUID, offset, limit){
    return Promise.resolve(organizationsProxy.queryOrganizations(null, {'tenantUUID':tenantUUID},offset, limit));
}

var  getGroupMemberships = (tenantUUID, groupUUID, offset, limit) => {
    return Promise.resolve(groupMembershipsProxy.queryGroupMemberships(tenantUUID, {'groupUUID':groupUUID}, offset, limit));
}

var  getSimCards = (result, offset, limit) => {
    var simCardsArray = {
        'simCardUUIDArray' : new Array
    };
    for(var x in result){
        simCardsArray.simCardUUIDArray.push( result[x].simCardUUID);
    }

    return Promise.resolve(simCardsProxy.querySIMCards(null, simCardsArray, offset, limit ));
}

function getExpandStr(expandStr, data,  tenantUUID){
    var result = new Array;
    var i = 0;
    var expandArray = expandStr.split(';');
    for(var x in expandArray){
        var retExpand = common.getExpand(expandArray[x]);
        if(retExpand[0] == 'organizations'){
            result[i] = getOrganizations(tenantUUID , retExpand[1], retExpand[2]).then(function(result){
                if(result.length == 0){
                    return result;
                }
                result.tag = 'organization';
                result.offset = retExpand[1];
                result.limit = retExpand[2];
                return result;
            });
            i++;
        }
        if(retExpand[0] == 'groupMemberships'){
            result[i] = getGroupMemberships(tenantUUID, data.uuid, retExpand[1], retExpand[2]).then(function(result) {
                if (result.length == 0) {
                    return result;
                }
               return  getSimCards(result).then(function(data){
                   if(data.length == 0){
                       return data;
                   }
                        for(var i =0;i<result.length;i++){
                            for(var x= 0;x<data.length;x++){
                                if(result[i].simCardUUID = data[x].uuid){
                                   result[i].directoryUUID = data[x].directoryUUID;
                                }
                            }
                        }
                   result.tag = 'groupMembership';
                   result.offset = retExpand[1];
                   result.limit = retExpand[2];
                   return result;
                });
            });
            i++;
        }
        if(retExpand[0] == 'simCards'){
            result[i] = getGroupMemberships(tenantUUID, data.uuid).then(function(result) {
                if (result.length == 0) {
                    return result;
                }
                return getSimCards(result, retExpand[1], retExpand[2]);
            }).then(function(simCardsResult){
                if(simCardsResult.length == 0){
                    return simCardsResult;
                }
                result.tag = 'simCard';
                result.offset = retExpand[1];
                result.limit = retExpand[2];
                return result;
            });
            i++;
        }
    }
    return Promise.all(result);
}

var retrieveGroupV1= (req, res) => {
    var info = req.body;
    info.uuid = req.params.groupUUID;
    var getExist = isExist(null, info.uuid);
    var expandStr = req.query.expand;
    if (!utils.checkUUID(req.params.groupUUID)) {
        var error;
        error.status = 400;
        error.description = '输入参数有误';
        return common.errorReturn(res, error.status, error);
    }
    info.tenantUUID = req.params.tenantUUID;
    var tenantUUID = info.tenantUUID;
    var groupUUID = req.params.groupUUID;
    var tenantExist = isTenantExist(info.tenantUUID);
    const retrieveGroup = (groupUUID) => {
        return Promise.resolve(groupsProxy.retrieveGroup(groupUUID));
    }
    tenantExist.then(function(result){
        if(result.flag){
            throw result;
        }
        return retrieveGroup(groupUUID);
    }).then((results) => {
        var judge = common.isOnly(null, results.length);
        if (judge.is) {
            var bodyDataJson = returnResources.generateGroupRetInfo(tenantUUID, results[0]);
            if (!expandStr) {
                return returnResources.generateGroupRetInfo(tenantUUID, results[0]);
            }else{
                        return getExpandStr(expandStr, results[0], tenantUUID).then(function(result){
                            if(!result[0]){
                                return bodyDataJson;
                            }
                            for(var x in result){
                                if(result[x].tag=='simCard'){
                                    bodyDataJson.simCards = new Array;
                                    var resultSimCard = returnResources.generateListSIMCardRetInfo(tenantUUID, null,  req.query, result[x].offset, result[x].limit, result[x], groupUUID);
                                    bodyDataJson.simCards.push(resultSimCard);
                                }
                                if(result[x].tag =='groupMembership'){
                                    bodyDataJson.groupMemberships = new Array;
                                    var resultGroupMembership = returnResources.generateListGroupMembershipRetInfo(tenantUUID, req.query, result[x].offset, result[x].limit, result[x], null, null, groupUUID);
                                    bodyDataJson.groupMemberships.push(resultGroupMembership);
                                }
                                if(result[x].tag=='organization'){
                                    bodyDataJson.organizations = new Array;
                                    var resultOrganization = returnResources.generateListOrganizationRetInfo(tenantUUID, req.query, result[x].offset, result[x].limit, result[x], null,  groupUUID)
                                    bodyDataJson.organizations.push(resultOrganization);
                                }
                            }
                            return bodyDataJson;
                        });
                    }
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve group.the uuid: ' + groupUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve group. the uuid: ' + groupUUID;
        }
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

exports.retrieveGroup = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


/**
 * @api {delete} /:version/tenants/:tenantUUID/groups/:groupUUID DeleteGroup
 * @apiName DeleteGroup
 * @apiVersion 0.0.1
 * @apiGroup Group
 * @apiDescription  删除指定组
 * @apiParamExample Example Request
 * Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */

var deleteGroupV1=(req, res) => {
    if ( !utils.checkUUID(req.params.groupUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        return common.errorReturn(res, error.status, error);
    }
    var groupUUID= req.params.groupUUID;
    var getExist = isExist(null, groupUUID);
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
    getExist.then((results) => {
        if(results.flag==4){
            throw results;
        } else{
            return Promise.resolve(groupsProxy.deleteGroup(groupUUID));
        }
    }).then(() => {
        ep.emit('send_Message');
        res.writeHead(204, {'Content-Type' : contentType});
        res.end();
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    })
}

exports.deleteGroup = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


/**
 * @api {get} /:version/tenants/:tenantUUID/groups ListGroups
 * @apiName ListGroups
 * @apiVersion 0.0.1
 * @apiGroup Group
 * @apiDescription  获取指定组信息列表
 * @apiParam {int} [offset]　偏移量
 * @apiParam {int} [limit] 获取条数
 * @apiParam {string} [name]　组名称,支持模糊查询，如 '*名称*'
 * @apiParam {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 * @apiParam {string}[expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、organization、groupMemberships[offset,limit]或他们的组合，
 *
 * @apiParamExample Example Request
 * GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"127.0.0.1:3000/api/v1/groups",
 *      "offset":"0",
 *      "limit":"25",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "组名称",
 *          "status": "ENABLED",
 *          "description": "组描述",
 *          "customData":{},
 *          ...
 *      },
 *      {
 *          "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "组名称",
 *          "description": "组描述",
 *          ... remaining groups name/value pairs ...
 *      },
 *      ... remaining items of groups ...
 *    ]
 *  }
 *
 *
 *
 * @apiParamExample Example Request
 * GET 127.0.0.1:3000/api/v1/groups?offset=0&limit=10&name=组名称
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"127.0.0.1:3000/api/v1/groups?offset=0&limit=10&name=组名称",
 *      "offset":"0",
 *      "limit":"10",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "组名称",
 *          "status": "ENABLED",
 *          "description": "组描述",
 *          "customData":{},
 *          ...
 *      },
 *      {
 *          "href":"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "组名称",
 *          "description": "组描述",
 *          ... remaining groups name/value pairs ...
 *      },
 *      ... remaining items of groups("name"="组名称") ...
 *    ]
 *  }
 */

var listGroupsV1 = (req, res) => {
    var queryConditions = req.query;
    var tenantUUID = req.params.tenantUUID;
    var expandStr=req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, null);
    var listSuccess = Promise.resolve(groupsProxy.queryGroup(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(groupsProxy.getCount(tenantUUID, queryConditions));
    var tenantExist = isTenantExist(tenantUUID);
    Promise.all([judgeQuery, listSuccess, countSuccess, tenantExist]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        if(result[3].flag){
            throw result[3];
        }
        if (!expandStr) {
            return returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
        }else{
            var listResult = new Array;
            var item;
            for ( item in result[1]) {
                (function(item){
                    listResult[item] = getExpandStr(expandStr, result[1][item], tenantUUID).then(function (resultExpand) {
                        for(var x in resultExpand){
                            if(resultExpand[x].tag=='simCard'){
                                result[1][item].simCards = new Array;
                                var resultSimCard = returnResources.generateListSIMCardRetInfo(tenantUUID, null,  req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], result[1][item].uuid);
                                result[1][item].simCards.push(resultSimCard);
                            }
                            if(resultExpand[x].tag =='groupMembership'){
                                result[1][item].groupMemberships = new Array;
                                var resultGroupMembership = returnResources.generateListGroupMembershipRetInfo(tenantUUID, req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null, null, result[1][item].uuid);
                                result[1][item].groupMemberships.push(resultGroupMembership);
                            }
                            if(resultExpand[x].tag == 'organization'){
                                result[1][item].organizations = new Array;
                                var resultOrganization = returnResources.generateListOrganizationRetInfo(tenantUUID, req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null,  result[1][item].uuid)
                                result[1][item].organizations.push(resultOrganization);
                            }
                        }
                        return result[1][item];
                    });
                }(item));
            }
            return Promise.all(listResult).then(function(bodyResult){
                return  returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], bodyResult);
            });
        }
    }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
    ).catch( (err) => {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.listGroups = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listGroupsV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listGroupsBySimCardV1 = (req, res) => {
    var queryConditions = req.query;
    var tenantUUID = req.params.tenantUUID;
    var expandStr=req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, null);
    var simCardUUID = req.params.simCardUUID;
    var listSuccess = Promise.resolve(groupsProxy.queryGroup(tenantUUID, queryConditions, offset, limit, simCardUUID));
    var countSuccess = Promise.resolve(groupsProxy.getCount(tenantUUID, queryConditions));
    var tenantExist = isTenantExist(info.tenantUUID);
    Promise.all([judgeQuery, listSuccess, countSuccess, tenantExist]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        if(result[3].flag){
            throw result[3];
        }
        if (!expandStr) {
            return returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
        }else{
            var listResult = new Array;
            var item;
            for ( item in result[1]) {
                (function(item){
                    listResult[item] = getExpandStr(expandStr, result[1][item], tenantUUID).then(function (resultExpand) {
                        for(var x in resultExpand){
                            if(resultExpand[x].tag=='simCard'){
                                result[1][item].simCards = new Array;
                                var resultSimCard = returnResources.generateListSIMCardRetInfo(tenantUUID, null,  req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], result[1][item].uuid);
                                result[1][item].simCards.push(resultSimCard);
                            }
                            if(resultExpand[x].tag =='groupMembership'){
                                result[1][item].groupMemberships = new Array;
                                var resultGroupMembership = returnResources.generateListGroupMembershipRetInfo(tenantUUID, req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null, null, result[1][item].uuid);
                                result[1][item].groupMemberships.push(resultGroupMembership);
                            }
                            if(resultExpand[x].tag == 'organization'){
                                result[1][item].organizations = new Array;
                                var resultOrganization = returnResources.generateListOrganizationRetInfo(tenantUUID, req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null,  result[1][item].uuid)
                                result[1][item].organizations.push(resultOrganization);
                            }
                        }
                        return result[1][item];
                    });
                }(item));
            }
            return Promise.all(listResult).then(function(bodyResult){
                return  returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], bodyResult);
            });
        }
    }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
    ).catch( (err) => {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.listGroupsBySimCard = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listGroupsBySimCardV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listGroupsByOrganizationsV1 = (req, res) => {
    var queryConditions = req.query;
    var tenantUUID = req.params.tenantUUID;
    var expandStr=req.query.expand;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, null);
    var simCardUUID = req.params.simCardUUID;
    var organizationUUID = req.params.organizationUUID;
    var listSuccess = Promise.resolve(groupsProxy.queryGroup(tenantUUID, queryConditions, offset, limit, null, organizationUUID));
    var countSuccess = Promise.resolve(groupsProxy.getCount(tenantUUID, queryConditions));
    var tenantExist = isTenantExist(info.tenantUUID);
    Promise.all([judgeQuery, listSuccess, countSuccess, tenantExist]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        if(result[3].flag){
            throw result[3];
        }
        if (!expandStr) {
            return returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
        }else{
            var listResult = new Array;
            var item;
            for ( item in result[1]) {
                (function(item){
                    listResult[item] = getExpandStr(expandStr, result[1][item], tenantUUID).then(function (resultExpand) {
                        for(var x in resultExpand){
                            if(resultExpand[x].tag=='simCard'){
                                result[1][item].simCards = new Array;
                                var resultSimCard = returnResources.generateListSIMCardRetInfo(tenantUUID, null,  req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], result[1][item].uuid);
                                result[1][item].simCards.push(resultSimCard);
                            }
                            if(resultExpand[x].tag =='groupMembership'){
                                result[1][item].groupMemberships = new Array;
                                var resultGroupMembership = returnResources.generateListGroupMembershipRetInfo(tenantUUID, req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null, null, result[1][item].uuid);
                                result[1][item].groupMemberships.push(resultGroupMembership);
                            }
                            if(resultExpand[x].tag == 'organization'){
                                result[1][item].organizations = new Array;
                                var resultOrganization = returnResources.generateListOrganizationRetInfo(tenantUUID, req.query, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null,  result[1][item].uuid)
                                result[1][item].organizations.push(resultOrganization);
                            }
                        }
                        return result[1][item];
                    });
                }(item));
            }
            return Promise.all(listResult).then(function(bodyResult){
                return  returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], bodyResult);
            });
        }
    }).then((bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
    ).catch( (err) => {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.listGroupsByOrganizations = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listGroupsByOrganizationsV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var bulkCreateGroup=function(tenantUUID,  params, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    params.tenantUUID = tenantUUID;
    var judgeResult = validateParams(params, true);
    var getExist = isExist(params.name, null);
    var tenantExist = isTenantExist(params.tenantUUID);
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
    Promise.all([judgeResult, getExist, tenantExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }if(result[2].flag){
            throw result[2];
        } else{
            return Promise.resolve(groupsProxy.createGroup(params))
        }
    }).then((result) => {
        var bodyDataJson = returnResources.generateGroupRetInfo(params.tenantUUID, result[0]);
        ep.emit('send_Message', bodyDataJson);
        callback(null, bodyDataJson);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkUpdateGroup=function(tenantUUID, groupUUID,  info, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(groupUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.uuid = groupUUID;
    info.tenantUUID = tenantUUID;
    var judgeResult = validateParams(info);
    var getExist = isExist(null, info.uuid);
    var tenantExist = isTenantExist(info.tenantUUID);
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
    Promise.all([judgeResult, getExist, tenantExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }
        if(result[2].flag){
            throw result[2]
        } else{
            return Promise.resolve(groupsProxy.updateGroup(info));
        }
    }).then((result) =>{
        var bodyDataJson = returnResources.generateGroupRetInfo(info.tenantUUID, result[0]);
        ep.emit('send_Message', bodyDataJson);
        callback(null, bodyDataJson);
        return;
    }).catch((err) =>{
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteGroup=function(tenantUUID, groupUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(groupUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback)
    }
    var groupUUID= groupUUID;
    var getExist = isExist(null, groupUUID);
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
            return Promise.resolve(groupsProxy.deleteGroup(groupUUID));
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

var bulkRetrieveGroup=function(tenantUUID, groupUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(groupUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var getExist = isExist(null, groupUUID);
    var expandStr = queryConditions.expand;
    var tenantExist = isTenantExist(tenantUUID);
    const retrieveGroup = (groupUUID) => {
        return Promise.resolve(groupsProxy.retrieveGroup(groupUUID));
    }
    tenantExist.then(function(result){
        if(result.flag){
            throw result;
        }
        return retrieveGroup(groupUUID);
    }).then((results) => {
        var judge = common.isOnly(null, results.length);
        if (judge.is) {
            var bodyDataJson = returnResources.generateGroupRetInfo(tenantUUID, results[0]);
            if (!expandStr) {
                return returnResources.generateGroupRetInfo(tenantUUID, results[0]);
            }else{
                return getExpandStr(expandStr, results[0], tenantUUID).then(function(result){
                    if(!result[0]){
                        return bodyDataJson;
                    }
                    for(var x in result){
                        if(result[x].tag=='simCard'){
                            bodyDataJson.simCards = new Array;
                            var resultSimCard = returnResources.generateListSIMCardRetInfo(tenantUUID, null,  queryConditions, result[x].offset, result[x].limit, result[x], groupUUID);
                            bodyDataJson.simCards.push(resultSimCard);
                        }
                        if(result[x].tag =='groupMembership'){
                            bodyDataJson.groupMemberships = new Array;
                            var resultGroupMembership = returnResources.generateListGroupMembershipRetInfo(tenantUUID, queryConditions, result[x].offset, result[x].limit, result[x], null, null, groupUUID);
                            bodyDataJson.groupMemberships.push(resultGroupMembership);
                        }
                        if(result[x].tag=='organization'){
                            bodyDataJson.organizations = new Array;
                            var resultOrganization = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, result[x].offset, result[x].limit, result[x], null,  groupUUID)
                            bodyDataJson.organizations.push(resultOrganization);
                        }
                    }
                    return bodyDataJson;
                });
            }
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve group.the uuid: ' + groupUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve group. the uuid: ' + groupUUID;
        }
    }).then((bodyInfo) => {
        callback(null, bodyInfo);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkListGroup=function( tenantUUID, queryConditions, callback){
    if (!utils.checkUUID(tenantUUID)) {
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
    var listSuccess = Promise.resolve(groupsProxy.queryGroup(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(groupsProxy.getCount(tenantUUID, queryConditions));
    var tenantExist = isTenantExist(tenantUUID);
    Promise.all([judgeQuery, listSuccess, countSuccess, tenantExist]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        if(result[3].flag){
            throw result[3];
        }
        if (!expandStr) {
            return returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], result[1]);
        }else{
            var listResult = new Array;
            var item;
            for ( item in result[1]) {
                (function(item){
                    listResult[item] = getExpandStr(expandStr, result[1][item], tenantUUID).then(function (resultExpand) {
                        for(var x in resultExpand){
                            if(resultExpand[x].tag=='simCard'){
                                result[1][item].simCards = new Array;
                                var resultSimCard = returnResources.generateListSIMCardRetInfo(tenantUUID, null,  queryConditions, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], result[1][item].uuid);
                                result[1][item].simCards.push(resultSimCard);
                            }
                            if(resultExpand[x].tag =='groupMembership'){
                                result[1][item].groupMemberships = new Array;
                                var resultGroupMembership = returnResources.generateListGroupMembershipRetInfo(tenantUUID, queryConditions, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null, null, result[1][item].uuid);
                                result[1][item].groupMemberships.push(resultGroupMembership);
                            }
                            if(resultExpand[x].tag == 'organization'){
                                result[1][item].organizations = new Array;
                                var resultOrganization = returnResources.generateListOrganizationRetInfo(tenantUUID, queryConditions, resultExpand[x].offset, resultExpand[x].limit, resultExpand[x], null,  result[1][item].uuid)
                                result[1][item].organizations.push(resultOrganization);
                            }
                        }
                        return result[1][item];
                    });
                }(item));
            }
            return Promise.all(listResult).then(function(bodyResult){
                return  returnResources.generateListGroupRetInfo(tenantUUID, queryConditions, offset, result[2], bodyResult);
            });
        }
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
    var tenantUUID ='', isList=false, groupUUID= '', queryConditions='';
    if(utils.isGroupsURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/groups');
        groupUUID=utils.getUUIDInHref(urlPath, 'groups/');
    }else if(utils.isGroupURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/groups');
        isList=true;
    }
    if(active=='post'){
        bulkCreateGroup(tenantUUID,  params, callback);
    }else if(active=='put'){
        bulkUpdateGroup(tenantUUID, groupUUID, params, callback);
    }else if(active=='delete'){
        bulkDeleteGroup(tenantUUID, groupUUID, callback);
    }else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListGroup(tenantUUID, queryConditions, callback);
        }else{
            bulkRetrieveGroup(tenantUUID, groupUUID, queryConditions, callback);
        }
    }
}