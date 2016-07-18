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
var tenantProxy=require('../proxy/tenantOperator');
var organizationMembershipProxy=require('../proxy/organizationMembershipOperator');
var organizationProxy=require('../proxy/organizationOperator');
var groupProxy=require('../proxy/groupOperator');
var directoryProxy=require('../proxy/directoryOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');

/**
 * @apiDefine OrganizationMembership OrganizationMembership
 *
 * 组织关系(OrganizationMembership)资源是用来保存组织[Organization](#api-Organization)与目录[Directory](#api-Directory)或组[Group](#api-Group)关系
 *
 */

var mainParam = (info) =>{
    var judgeResult;
    judgeResult = common.mandatoryParams(info, ['store', 'organization']);
    return judgeResult;
}

var validateParams = ( verificationCodesInfo )=> {
    var valParams = {
        'uuid' : common.checkUUID,
        'store':function(store){
         return utils.isStoreURL(store.href)
         },
        'organization':function(organization){
            return utils.isOrganizationURL(organization.href)
        }
    }
    var judgeResult;
    judgeResult = common.validateParams(verificationCodesInfo, valParams);
    return judgeResult;
};

function isTenantExist(tenantUUID){
    var queryStr = 'uuid=\'' + tenantUUID + '\'';
        return Promise.resolve(tenantProxy.queryBy(null, queryStr))
            .then((results) =>{
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    return results[0];
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query tenant.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query tenant. the query string: ' + queryStr;
                }
                return judge;
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
function isOrganizationExist(tenantUUID, organizationUUID){
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\' and uuid=\'' + organizationUUID + '\'';
        return Promise.resolve(organizationProxy.queryBy(null, queryStr))
            .then((results) =>{
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
function isExist(store, organization, tenantUUID, uuid) {
    var queryStr = 'tenantUUID=\'' + tenantUUID + '\'';

    if(store && organization){
        var storeUUID, organizationUUID;
        if(store && store.href){
            if(store.href.indexOf('directories/')>-1){
                storeUUID=utils.getUUIDInHref(store.href, 'directories/');
            }
        }
        if(organization && organization.href){
            if(organization.href.indexOf('organizations/')>-1){
                organizationUUID=utils.getUUIDInHref(organization.href, 'organizations/');
            }
        }
        queryStr += ' and storeUUID=\''+ storeUUID + '\' and organizationUUID=\''+ organizationUUID + '\'';
    }else{
        queryStr += ' and uuid=\''+ uuid + '\'';
    }

        return Promise.resolve(organizationMembershipProxy.queryBy(null, queryStr))
            .then((results) =>{
                var judge = common.isOnly(null, results.length);
                if(judge.is){
                    return results[0];
                }
                if(judge.flag == 1){
                    judge.error.description = 'Could not find the resources you want to query organizationMembership.the query string: ' + queryStr;
                }else if(judge.flag == 2){
                    judge.error.description = 'Find much resource when query organizationMembership. the query string: ' + queryStr;
                }
                return judge;
            });
}
function isValidQueryCondition(queryCondition) {
    for(var item in queryCondition){
        switch(item) {
            case 'uuid' : case 'storeURL' :case 'organizationURL':
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
 * @api {post} /:version/tenants/:tenantUUID/organizationMemberships CreateOrganizationMembership
 * @apiName CreateOrganizationMembership
 * @apiVersion 1.0.0
 * @apiGroup OrganizationMembership
 * @apiDescription  创建一个组织关系
 * @apiParam (input) {url} store 目录，见[Directory](#api-Directory)资源；或组，见[Group](#api-Group)资源
 * @apiParam (input) {url} organization 组织，见[Organization](#api-Organization)资源
 *
 * @apiParam (output) {url} store 目录，见[Directory](#api-Directory)资源；或组，见[Group](#api-Group)资源
 * @apiParam (output) {url} organization 组织，见[Organization](#api-Organization)资源
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParamExample  Example Request
 * POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships
 * Content-Type: application/json;charset=UTF-8
 * {
 *   'store' : {
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F'
 *   },
 *   'organization':{
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F'
 *   }
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F',
 *   'store' : {
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F'
 *   },
 *   'organization':{
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F'
 *   },
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
var createOrganizationMembershipV1 = (req, res) => {
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

    var judgeResult = mainParam(info);
    var isTenant = isTenantExist(tenantUUID);
    var valParams= validateParams(info, true);
    var getExist=isExist(info.store, info.organization, tenantUUID, null);
    var topic='';
    Promise.all([ judgeResult, isTenant, valParams, getExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false){
            throw result[1];
        }
        topic=result[1].topic;
        if(result[2].flag==5){
            throw result[1];
        }
        if(result[3].flag!=0){
            if(result[3].error && result[3].error.status == 404){
                return Promise.resolve(organizationMembershipProxy.createOrganizationMembership(info));
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
        var bodyDataJson = returnResources.generateOrganizationMembershipRetInfo(result);
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
exports.createOrganizationMembership=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        createOrganizationMembershipV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/organizationMemberships/:organizationMembershipUUID RetrieveOrganizationMembership
 * @apiName RetrieveOrganizationMembership
 * @apiVersion 1.0.0
 * @apiGroup OrganizationMembership
 * @apiDescription  获取指定组织的关系信息
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是directory\group,organization或他们的组合，中间用','号隔开
 *
 * @apiParam (output) {url} store 目录，见[Directory](#api-Directory)资源；或组，见[Group](#api-Group)资源
 * @apiParam (output) {url} organization 组织，见[Organization](#api-Organization)资源
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
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F',
 *   'store' : {
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F'
 *   },
 *   'organization':{
 *      'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F'
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
            case 'directory':
            case 'organization':
                break;
            default:
                return false;
        }
    }
    return true;
}
function getStore(tenantUUID, storeUUID, type){
    if(storeUUID){
        if( type == 'directory'){
            return Promise.resolve(directoryProxy.retrieveDirectory(tenantUUID, storeUUID))
                .then((results) =>{
                    if (results.length == 0) {
                        results = new Array();
                    }
                    var bodyInfo = returnResources.generateDirectoryRetInfo(results);
                    return bodyInfo;
                })
        }else if( type == 'group' ){
            return Promise.resolve(groupProxy.retrieveGroup(storeUUID))
                .then((results) =>{
                    if (results.length == 0) {
                        results = new Array();
                    }
                    var bodyInfo = returnResources.generateGroupRetInfo( results);
                    return bodyInfo;
            })
        }else{
            return({'href':''});
        }
    }else{
        return({'href':''});
    }
}
function getOrganization(tenantUUID, organizationUUID ){
        return Promise.resolve(organizationProxy.retrieveOrganization(tenantUUID, organizationUUID))
            .then((results) =>{
                var judge = common.isOnly(null, results);
                if(judge.is == false){
                    throw (judge);
                }
                var bodyInfo = returnResources.generateOrganizationRetInfo(results[0]);
                return bodyInfo;
            });
}

function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){

    return new Promise((resolve) =>{
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i){
            var retExpand = common.getExpand(expandArray[i]);
            switch(retExpand[0]){
                case 'group':
                    getStore(tenantUUID, data.storeUUID, 'group').then((result) =>{
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.store = result;
                            }else{
                                retInfo.items[itemIndex].store = result;
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
                case 'directory':
                    getStore(tenantUUID, data.storeUUID, 'directory').then((result) =>{
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.store = result;
                            }else{
                                retInfo.items[itemIndex].store = result;
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
                case 'organization':
                    getOrganization(tenantUUID, data.organizationUUID).then((result) =>{
                        if(result.is == false){
                            throw result;
                        }else{
                            if(!isList){
                                retInfo.organization = result;
                            }else{
                                retInfo.items[itemIndex].organization = result;
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
var retrieveOrganizationMembershipV1=(req, res) =>{
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.organizationMembershipUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    var organizationMembershipUUID=req.params.organizationMembershipUUID;
    var expandStr = req.query.expand;

    var judgeParams = common.isValidQueryParams(req, null, isExpandStrVail);
    var retOrganization=Promise.resolve(organizationMembershipProxy.retrieveOrganizationMembership(tenantUUID, organizationMembershipUUID));
    Promise.all([judgeParams, retOrganization]).then((results) =>{
        if(results[0].is==false){
            throw  results[0];
        }

        var judge = common.isOnly(null, results[1].length);
        if(judge.is){
            var bodyInfo = returnResources.generateOrganizationMembershipRetInfo(results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID));
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve organizationMembership.the uuid: ' + organizationMembershipUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve organizationMembership. the uuid: ' + organizationMembershipUUID;
        }
        throw judge;

    }).then((bodyInfo) =>{
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
    }).catch((err) => {

        common.errReturnCommon(err, res);
        return;
    });

}
exports.retrieveOrganizationMembership=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveOrganizationMembershipV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {delete} /:version/tenants/:tenantUUID/organizationMemberships/:organizationMembershipUUID DeleteOrganizationMembership
 * @apiName DeleteOrganizationMembership
 * @apiVersion 1.0.0
 * @apiGroup OrganizationMembership
 * @apiDescription  删除指定的关系
 * @apiParamExample Example Request
 * Delete https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */
var deleteOrganizationMembershipV1=(req, res) => {
    if (!utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.organizationMembershipUUID)) {
        var error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var organizationMembershipUUID = req.params.organizationMembershipUUID;
    var isMembership =  isExist(null, null, tenantUUID, organizationMembershipUUID);
    var delOrganizationMembership = Promise.resolve(organizationMembershipProxy.deleteOrganizationMembership(organizationMembershipUUID));
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
    Promise.all([isMembership, delOrganizationMembership]).then((result) => {
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
            error.description = 'Could not find the resources you want to retrieve organization.the uuid: ' + tenantUUID;
        }else if (judge.flag == 2) {
            error.description = 'Find much resource when retrieve organization. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch( (err) => {

        common.errReturnCommon(err, res);
        return;
    });
}
exports.deleteOrganizationMembership=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteOrganizationMembershipV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


var  listOrganizationMembershipsV1 = (req, res) => {
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
    var listSuccess = Promise.resolve(organizationMembershipProxy.queryOrganizationMemberships(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(organizationMembershipProxy.getCount(tenantUUID, queryConditions));

    Promise.all([judgeQuery, isTenant, listSuccess, countSuccess]).then((results) => {
        if (results[0].is == false) {
            throw results[0];
        }
        if (results[1].is == false) {
            throw results[1];
        }
        if (results[2].length == 0) {
            results[2] = new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], results[2]);
        if (!results[0].isExpand  || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) =>{
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then((datas) => {
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

    }).catch( (err) => {

        common.errReturnCommon(err, res);
        return;
    });
}
exports.listOrganizationMemberships=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationMembershipsV1(req, res);
        if(config.record == true){
            next();
        }
    }
}
var listOrganizationMembershipsByOrganizationV1 = (req, res) =>{
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
    var listSuccess=Promise.resolve(organizationMembershipProxy.queryOrganizationMemberships(tenantUUID, queryConditions, offset, limit, organizationUUID));
    var countSuccess=Promise.resolve(organizationMembershipProxy.getCount(tenantUUID, queryConditions, organizationUUID));

    Promise.all([judgeQuery, isOrganization, listSuccess, countSuccess]).then((results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], results[2], organizationUUID);
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
exports.listOrganizationMembershipsByOrganization=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationMembershipsByOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}
var listOrganizationMembershipsByGroupV1 = (req, res) =>{
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
    var listSuccess=Promise.resolve(organizationMembershipProxy.queryOrganizationMemberships(tenantUUID, queryConditions, offset, limit, null, groupUUID));
    var countSuccess=Promise.resolve(organizationMembershipProxy.getCount(tenantUUID, queryConditions, null, groupUUID));

    Promise.all([judgeQuery, isGroup, listSuccess, countSuccess]).then((results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], results[2]);
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
exports.listOrganizationMembershipsByGroup=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationMembershipsByGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listOrganizationMembershipsByDirectoryV1 = (req, res) =>{
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
    var listSuccess=Promise.resolve(organizationMembershipProxy.queryOrganizationMemberships(tenantUUID, queryConditions, offset, limit, null, directoryUUID));
    var countSuccess=Promise.resolve(organizationMembershipProxy.getCount(tenantUUID, queryConditions, null, directoryUUID));

    Promise.all([judgeQuery, isDirectory, listSuccess, countSuccess]).then((results) =>{
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListOrganizationMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], results[2]);
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
exports.listOrganizationMembershipsByDirectory=(req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        listOrganizationMembershipsByDirectoryV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var bulkCreateOrganizationMembership =function(tenantUUID,  info, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    var judgeResult = mainParam(info);
    var isTenant = isTenantExist(tenantUUID);
    var valParams= validateParams(info, true);
    var getExist=isExist(info.store, info.organization, tenantUUID, null);
    var topic='';
    Promise.all([ judgeResult, isTenant, valParams, getExist]).then((result) =>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].is==false){
            throw result[1];
        }
        topic=result[1].topic;
        if(result[2].flag==5){
            throw result[1];
        }
        if(result[3].flag!=0){
            if(result[3].error && result[3].error.status == 404){
                return Promise.resolve(organizationMembershipProxy.createOrganizationMembership(info));
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
        var bodyDataJson = returnResources.generateOrganizationMembershipRetInfo(result);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        callback(null, bodyDataJson);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteOrganizationMembership=function(tenantUUID, organizationMembershipUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(organizationMembershipUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var isMembership =  isExist(null, null, tenantUUID, organizationMembershipUUID);
    var delOrganizationMembership = Promise.resolve(organizationMembershipProxy.deleteOrganizationMembership(organizationMembershipUUID));
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
    Promise.all([isMembership, delOrganizationMembership]).then((result) => {
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
            error.description = 'Could not find the resources you want to retrieve organization.the uuid: ' + tenantUUID;
        }else if (judge.flag == 2) {
            error.description = 'Find much resource when retrieve organization. the uuid: ' + tenantUUID;
        }
        throw judge;

    }).catch( (err) => {
       common.errReturnCallback(err, callback);
    });
};

var bulkRetrieveGroupMembership =function(tenantUUID, organizationMembershipUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(organizationMembershipUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, null, isExpandStrVail);
    var retOrganization=Promise.resolve(organizationMembershipProxy.retrieveOrganizationMembership(tenantUUID, organizationMembershipUUID));
    Promise.all([judgeParams, retOrganization]).then((results) =>{
        if(results[0].is==false){
            throw  results[0];
        }

        var judge = common.isOnly(null, results[1].length);
        if(judge.is){
            var bodyInfo = returnResources.generateOrganizationMembershipRetInfo(results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID));
        }
        var error = judge.error;
        if(judge.flag == 1){
            error.description = 'Could not find the resources you want to retrieve organizationMembership.the uuid: ' + organizationMembershipUUID;
        }else if(judge.flag == 2){
            error.description = 'Find much resource when retrieve organizationMembership. the uuid: ' + organizationMembershipUUID;
        }
        throw judge;

    }).then((bodyInfo) =>{
        callback(null, bodyInfo);
        return;
    }).catch((err) => {
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
    var listSuccess = Promise.resolve(organizationMembershipProxy.queryOrganizationMemberships(tenantUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(organizationMembershipProxy.getCount(tenantUUID, queryConditions));

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
        var bodyInfo = returnResources.generateListOrganizationMembershipRetInfo(tenantUUID, queryConditions, offset, results[3], results[2]);
        if (!results[0].isExpand  || results[2].length == 0) {
            callback(null, bodyInfo);
            return;
        }
        var count = 0;
        new Promise(function(resolve){
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID).then(function (datas) {
                    ++count;
                    if (count == results[2].length) {
                        resolve(datas);
                    }
                })
            }
        }).then(function (bodyInfo) {
            callback(null, bodyInfo);
            return;
        });

    }).catch(function (err) {
        if (!err.flag) {
            common.errReturnCallback(err, callback);
        }
        return;
    });
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, organizationMembershipUUID= '', queryConditions='';
    if(utils.isOrganizationMembershipsURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/organizationMemberships');
        organizationMembershipUUID=utils.getUUIDInHref(urlPath, 'organizationMemberships/');
    }else if(utils.isOrganizationMembershipURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/organizationMemberships');
        isList=true;
    }
    if(active=='post'){
        bulkCreateOrganizationMembership(tenantUUID,  params, callback);
    }else if(active=='delete'){
        bulkDeleteOrganizationMembership(tenantUUID, organizationMembershipUUID, callback);
    } else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListGroupMembership(tenantUUID, queryConditions, callback);
        }else{
            bulkRetrieveGroupMembership(tenantUUID, organizationMembershipUUID, queryConditions, callback);
        }
    }
}