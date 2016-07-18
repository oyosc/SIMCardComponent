/**
 * Created by Administrator on 2016/5/19.
 */
'use strict';
var common = require('./common');
var contentType = require('./common').retContentType;
var returnResources = require('./returnResources');
var utils= require('../common/utils');
var log = require("../common/log").getLogger();
var errorCodeTable = require("../common/errorCodeTable");
var tenantProxy = require('../proxy/tenantOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');

/**
 * @apiDefine Tenant Tenant
 *   当你在注册使用SIM卡管理组件(SIMCard Component)时，我们会为你创建一个私人空间。
 *   你可以使用SIMCard Component REST API 中的租赁用户(Tenant)资源来管理和访问你的私人空间。
 *   Tenant资源是你操作SIMCard组件的起始入口点，同时它将为你返回提供其它资源的URL链接(如[SIMCard](#api-SIMCard)、[Group](#api-Group)、...)。
 *   注册SIMCard Component Tenant用户：待定
 *   注册完成并通过审核过后，我们将向你发送一封带有API_Key信息的邮件，API_Key将是你访问SIMCard Component的钥匙。
 *   访问REST API时，请在HTTP的Header头使用API_Key:
 *    "Authorization" : "$API_KEY_ID:$API_KEY_SECRET"
 *    "Content-Type”: “application/json;charset=UTF-8”
 **/
var  isExpandStrVail = (expandStr) => {
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        var retExpand = common.getExpand(expandArray[i]);
        switch(retExpand[0]){

            default:
                return false;
        }
    }
    return true;
}

var validateParams = (info, isCreate) => {
    var judgeResult;
    if(isCreate){
        judgeResult = common.mandatoryParams(info, [ 'name', 'description']);
    }else {
        judgeResult = common.mandatoryParams(info, [ 'name', 'description', 'status']);
    }
    return judgeResult;
}

var isExist = (name, uuid) => {
    var queryStr ;
    if(name) {
        queryStr = 'name=\''+ name + '\'';
    } else {
        queryStr = 'uuid=\''+ uuid + '\'';
    }
    return new Promise((resolve) => {
        tenantProxy.queryBy(null, queryStr).then(function(results){
            var judge = common.isOnly( null, results.length);
            if(judge.is) {
                resolve(results[0]);
                return;
            }
            var error = judge.error;
            if(judge.flag == 1) {
                error.description = 'Could not find the resources you want to query Tenant.the query string: ' + queryStr;
            } else if(judge.flag == 2) {
                error.description = 'Find much resource when query Tenant. the query string: ' + queryStr;
            }
            resolve( judge);
        });
    })
}

var isValidQueryCondition = (queryCondition) => {
    for(var item in queryCondition) {
        switch(item) {
            case 'uuid' :case 'name' :
            case 'description':
            case 'offset': case 'limit':case 'status':
            case 'orderBy':case 'expand':
            break;
            default:
                return false;
        }
    }
    return true;
}

/**
 * @api {post} /:version/tenants CreateTenant
 * @apiIgnore Nonsupport
 * @apiName CreateTenant
 * @apiVersion 1.0.0
 * @apiGroup Tenant
 * @apiDescription  创建一个Tenant
 * @apiParam (input) {string} name 名称 (1<N<=255)，唯一性
 * @apiParam (input) {string} [status] 状态（值为ENABLED、DISABLED）,默认为ENABLED
 * @apiParam (input) {string} description　描述 (0<=N<1000)
 * @apiParam (input) {json} [customData] 扩展自定义数据,默认为{}
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} groups 该Tenant下面的所有的Group集合的URL链接，见[Group](#api-Group)
 * @apiParam (output) {url} organizations 该Tenant下面的所有的Organization集合的URL链接，见[Organization](#api-Organization)
 * @apiParam (output) {url} simCards 该Tenant下面的所有的SIMCard集合的URL链接，见[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} directories 该Tenant下面的所有的Directory集合的URL链接，见[Directory](#api-Directory)
 * @apiParam (output) {url} batchNORules 该Tenant下面的所有的BatchNORule集合的URL链接，见[BatchNORule](#api-BatchNORule)
 * @apiParam (output) {url} flows 该Tenant下面的所有的Flow集合的URL链接，见[Flow](#api-Flow)
 * @apiParam (output) {url} batchNumbers 该Tenant下面的所有的BatchNumber集合的URL链接，见[BatchNumber](#api-BatchNumber)
 *
 * @apiParamExample  Example Request
 * POST:  https://127.0.0.1:3000/api/v1/tenants
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{}
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href": "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "createAt": "2016-01-18T20:46:36.061Z",
 *   "modifiedAt": "2016-01-18T20:46:36.061Z",
 *   "groups":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups"
 *   },
 *   "organizations":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations"
 *   },
 *   "simCards":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards"
 *   },
 *   "batchNORules":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules"
 *   },
 *   "batchNumbers":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNumbers"
 *   },
 *   "directories":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories"
 *   },
 *   "flows":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flows"
 *   },
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
var createTenantV1 = (req, res) => {
    var info = req.body;
    var judgeResult = validateParams(info, true);
    var getExist = isExist(info.name, null);
    Promise.all([judgeResult, getExist]).then((result)=>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag!=0){
            if(result[1].error && result[1].error.status == 404) {
                return Promise.resolve(tenantProxy.createTenant(info));
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
        var bodyDataJson = returnResources.generateTenantRetInfo(result[0]);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(result[0].topic, message, function(error, data){
                console.log(error);
            });
        }
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
    }).catch(function(err){
       common.errReturnCommon(err, res);
        return;
    });
}

exports.createTenant = (req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        createTenantV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {put} /:version/tenants/:tenantUUID UpdateTenant
 * @apiIgnore Nonsupport
 * @apiName UpdateTenant
 * @apiVersion 1.0.0
 * @apiGroup Tenant
 * @apiDescription  更新Tenant信息
 * @apiParam (input) {string} name 名称 (1<N<=255)，唯一性
 * @apiParam (input) {string} status 状态（值为ENABLED、DISABLED）
 * @apiParam (input) {string} description　描述 (0<=N<1000)
 * @apiParam (input) {json} customData 扩展自定义数据
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} groups 该Tenant下面的所有的Group集合的URL链接，见[Group](#api-Group)
 * @apiParam (output) {url} organizations 该Tenant下面的所有的Organization集合的URL链接，见[Organization](#api-Organization)
 * @apiParam (output) {url} simCards 该Tenant下面的所有的SIMCard集合的URL链接，见[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} directories 该Tenant下面的所有的Directory集合的URL链接，见[Directory](#api-Directory)
 * @apiParam (output) {url} batchNORules 该Tenant下面的所有的BatchNORule集合的URL链接，见[BatchNORule](#api-BatchNORule)
 * @apiParam (output) {url} flows 该Tenant下面的所有的Flow集合的URL链接，见[Flow](#api-Flow)
 * @apiParam (output) {url} batchNumbers 该Tenant下面的所有的BatchNumber集合的URL链接，见[BatchNumber](#api-BatchNumber)
 *
 * @apiParamExample Example Request
 * PUT https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9
 * Content-Type: application/json;charset=UTF-8
 * {
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "customData":{}
 * }
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href": "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "createAt": "2016-01-18T20:46:36.061Z",
 *   "modifiedAt": "2016-01-18T20:46:36.061Z",
 *   "groups":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups"
 *   },
 *   "organizations":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations"
 *   },
 *   "simCards":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards"
 *   },
 *   "batchNORules":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules"
 *   },
 *   "batchNumbers":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNumbers"
 *   },
 *   "directories":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories"
 *   },
 *   "flows":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flows"
 *   },
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */

var updateTenantV1= (req, res) => {
    var info = req.body;
    var judgeResult = validateParams(info);
    if ( !utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var getExist = isExist(info.name, null);
    var tenantUUID = req.params.tenantUUID;
    info.uuid=tenantUUID;
    Promise.all([judgeResult, getExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(tenantProxy.updateTenant(info));
        }
    }).then((result) => {
        let bodyDataJson = returnResources.generateTenantRetInfo(result[0]);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Update_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(result[0].topic, message, function(error, data){
                console.log(error);
            });
        }
        res.writeHead(200, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
        res.write(JSON.stringify(bodyDataJson));
        res.end();
    }).catch((err) => {
       common.errReturnCommon(err, res);
        return;
    });
}

exports.updateTenant = (req, res, next) =>{
    var version = req.params.version;
    if(version == common.VERSION100){
        updateTenantV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID RetrieveTenant
 * @apiName RetrieveTenant
 * @apiVersion 1.0.0
 * @apiGroup Tenant
 * @apiDescription  获取指定租赁用户Tenant的信息
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} groups 该Tenant下面的所有的Group集合的URL链接，见[Group](#api-Group)
 * @apiParam (output) {url} organizations 该Tenant下面的所有的Organization集合的URL链接，见[Organization](#api-Organization)
 * @apiParam (output) {url} simCards 该Tenant下面的所有的SIMCard集合的URL链接，见[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} directories 该Tenant下面的所有的Directory集合的URL链接，见[Directory](#api-Directory)
 * @apiParam (output) {url} batchNORules 该Tenant下面的所有的BatchNORule集合的URL链接，见[BatchNORule](#api-BatchNORule)
 * @apiParam (output) {url} flows 该Tenant下面的所有的Flow集合的URL链接，见[Flow](#api-Flow)
 * @apiParam (output) {url} batchNumbers 该Tenant下面的所有的BatchNumber集合的URL链接，见[BatchNumber](#api-BatchNumber)
 *
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *   "href": "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "createAt": "2016-01-18T20:46:36.061Z",
 *   "modifiedAt": "2016-01-18T20:46:36.061Z",
 *   "groups":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups"
 *   },
 *   "organizations":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations"
 *   },
 *   "simCards":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards"
 *   },
 *   "batchNORules":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules"
 *   },
 *   "batchNumbers":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNumbers"
 *   },
 *   "directories":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories"
 *   },
 *   "flows":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flows"
 *   },
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */

var retrieveTenantV1=(req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var retrieveTenant = (tenantUUID) => {
        return Promise.resolve(tenantProxy.retrieveTenant(tenantUUID));
    }
    retrieveTenant(tenantUUID).then((results) => {
        var judge = common.isOnly(null, results.length);
        if(judge.is) {
            var bodyDataJson = returnResources.generateTenantRetInfo(results[0]);
            res.writeHead(200, {'Content-Type': common.retContentType, 'Location': bodyDataJson.href});
            res.write(JSON.stringify(bodyDataJson));
            res.end();
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve tenant.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve tenant. the uuid: ' + tenantUUID;
        }
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    });
}

exports.retrieveTenant= function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveTenantV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/current RetrieveCurrentTenant
 * @apiName RetrieveCurrentTenant
 * @apiVersion 1.0.0
 * @apiGroup Tenant
 * @apiDescription  获取指定租赁用户Tenant的信息
 *
 * @apiParam (output) {string} name　名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} description　描述
 * @apiParam (output) {json} customData
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} groups 该Tenant下面的所有的Group集合的URL链接，见[Group](#api-Group)
 * @apiParam (output) {url} organizations 该Tenant下面的所有的Organization集合的URL链接，见[Organization](#api-Organization)
 * @apiParam (output) {url} simCards 该Tenant下面的所有的SIMCard集合的URL链接，见[SIMCard](#api-SIMCard)
 * @apiParam (output) {url} directories 该Tenant下面的所有的Directory集合的URL链接，见[Directory](#api-Directory)
 * @apiParam (output) {url} batchNORules 该Tenant下面的所有的BatchNORule集合的URL链接，见[BatchNORule](#api-BatchNORule)
 * @apiParam (output) {url} flows 该Tenant下面的所有的Flow集合的URL链接，见[Flow](#api-Flow)
 * @apiParam (output) {url} batchNumbers 该Tenant下面的所有的BatchNumber集合的URL链接，见[BatchNumber](#api-BatchNumber)
 *
 * @apiParamExample Example Request
 * GET https://accounts.cyhl.com.cn/api/v1/tenants/current
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *   "href": "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9",
 *   "name": "名称",
 *   "status": "ENABLED",
 *   "description": "描述",
 *   "createAt": "2016-01-18T20:46:36.061Z",
 *   "modifiedAt": "2016-01-18T20:46:36.061Z",
 *   "groups":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups"
 *   },
 *   "organizations":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations"
 *   },
 *   "simCards":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards"
 *   },
 *   "batchNORules":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules"
 *   },
 *   "batchNumbers":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNumbers"
 *   },
 *   "directories":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories"
 *   },
 *   "flows":{
 *      "href" : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flows"
 *   },
 *   "customData":{},
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00"
 * }
 */
var retrieveCurrentTenantV1 = function(req, res){
    var authorization =req.header.authorization.split(' ');
    var error = new Error();
    if (authorization.length !== 2){
        error.name = 'Error';
        error.status = 400;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Authentication credentials are required to access the resource.';
        common.errorReturn(res, error.status, error);
        return;
    }
    var apiKey = new Buffer(authorization[1], 'base64').toString().split(':');
    var keyID= apiKey[0];
    var keySecret= apiKey[1];
    if (!keyID || !keySecret || 'Basic' != authorization[0]) {
        error.name = 'Error';
        error.status = 400;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Authentication credentials are required to access the resource.';
        common.errorReturn(res, error.status, error);
        return;
    }
    var authenticateTenantApiKey = function(keyID, keySecret){
        return Promise.resolve(tenantProxy.authenticateTenantApiKey(keyID, keySecret));
    }
    authenticateTenantApiKey(keyID, keySecret).then(function(dataInfo){
        var bodyInfo = returnResources.generateTenantRetInfo(dataInfo);
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(bodyInfo));
        res.end();
    }).catch(function(err){
        if(!err.flag){
            err = common.isDBError(err);
        }
        common.errorReturn(res, err.status, err);
        return;
    });
}

exports.retrieveCurrentTenant= function(req, res, next){
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveCurrentTenantV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


/**
 * @api {delete} /:version/tenants/:tenantUUID DeleteTenant
 * @apiIgnore Nonsupport
 * @apiName DeleteTenant
 * @apiVersion 1.0.0
 * @apiGroup Tenant
 * @apiDescription  删除指定tenant
 * @apiParamExample Example Request
 * Delete https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 204 No Content
 */
var deleteTenantV1=(req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID = req.params.tenantUUID;
    var getExist = isExist(null, tenantUUID);
    var topic='';
    getExist.then((results) => {
        if(results.flag==4){
            throw results;
        } else{
            topic=results.topic;
            return Promise.resolve(tenantProxy.deleteTenant(tenantUUID));
        }
    }).then(() => {
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Delete_Service_Success, 204);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        res.writeHead(204, {'Content-Type' : contentType});
        res.end();
    }).catch((err) => {
        common.errReturnCommon(err, res);
        return;
    })
}

exports.deleteTenant= (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteTenantV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants ListTenants
 * @apiIgnore Nonsupport
 * @apiName ListTenants
 * @apiVersion 1.0.0
 * @apiGroup Tenant
 * @apiDescription  获取指定tenant列表
 * @apiParam {int} [offset]　偏移量
 * @apiParam {int} [limit] 获取条数
 * @apiParam {string} [name]　名称,支持模糊查询，如 '*名称*'
 * @apiParam {string} [description]　描述
 * @apiParam {string} [status] 状态
 * @apiParam {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"https://127.0.0.1:3000/api/v1/tenants",
 *      "offset":"0",
 *      "limit":"25",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "名称",
 *          "status": "ENABLED",
 *          "description": "描述",
 *          "createAt" : "2016-01-10 12:30:00",
 *          "modifiedAt": "2016-01-10 12:30:00",
 *          "customData":{},
 *           ...
 *      },
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "名称",
 *          "description": "描述",
 *          ... remaining Tenants name/value pairs ...
 *      },
 *      ... remaining items of Tenants ...
 *    ]
 *  }
 *
 * @apiParamExample Example Request
 * GET https://127.0.0.1:3000/api/v1/tenants?offset=0&limit=10&name=名称
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 *
 * {
 *      "href":"https://127.0.0.1:3000/api/v1/tenants?offset=0&limit=10&name=名称",
 *      "offset":"0",
 *      "limit":"10",
 *      "size":100,
 *      "items":[
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "名称",
 *          "status": "ENABLED",
 *          "description": "描述",
 *          "createAt": "2016-01-10 12:30:00",
 *          "modifiedAt": "2016-01-10 12:30:00",
 *          "customData":{},
 *           ...
 *      },
 *      {
 *          "href":"https://127.0.0.1:3000/api/v1/tenants/0000CqrNgrzcIGYs1PfP4F",
 *          "name": "名称",
 *          ... remaining Tenants name/value pairs ...
 *      },
 *      ... remaining items of Tenants("name"="名称") ...
 *    ]
 *  }
 */
function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){
    return new Promise(function(resolve) {
        var expandArray = expandStr.split(';');
        var index = 0;

        for (var i = 0; i < expandArray.length; ++i) {
            var retExpand = common.getExpand(expandArray[i]);
            switch (retExpand[0]) {
                //
                default:
                    var err = new Error('the params of expand is error!');
                    err.status = 400;
                    throw err;
            }
        }
    });
}
var listTenantsV1 = (req, res) => {
    var queryConditions = req.query;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var expandStr = req.query.expand;

    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var listSuccess = Promise.resolve(tenantProxy.queryTenants(queryConditions, offset, limit));
    var countSuccess = Promise.resolve(tenantProxy.getCount(queryConditions));

    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function (result) {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListTenantRetInfo(queryConditions, offset, result[2], result[1]);
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
    }).catch(function (err) {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.listTenants = function(req, res, next) {
    var version = req.params.version;
    if(version == common.VERSION100){
        listTenantsV1(req, res);
        if(config.record == true){
            next();
        }
    }
};


var bulkCreateTenant=function(info, callback){
    var judgeResult = validateParams(info, true);
    var getExist = isExist(info.name, null);
    Promise.all([judgeResult, getExist]).then((result)=>{
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag!=0){
            if(result[1].error && result[1].error.status == 404) {
                return Promise.resolve(tenantProxy.createTenant(info));
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
        var bodyDataJson = returnResources.generateTenantRetInfo(result[0]);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Create_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(result[0].topic, message, function(error, data){
                console.log(error);
            });
        }
        callback(null, result);
        return;
    }).catch(function(err){
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkUpdateTenant=function(tenantUUID,  info, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    var judgeResult = validateParams(info);
    var getExist = isExist(info.name, null);
    info.uuid=tenantUUID;
    Promise.all([judgeResult, getExist]).then((result) => {
        if(result[0].flag==4){
            throw result[0];
        }
        if(result[1].flag && result[1].flag!=1){
            throw result[1];
        }else{
            return Promise.resolve(tenantProxy.updateTenant(info));
        }
    }).then((result) => {
        let bodyDataJson = returnResources.generateTenantRetInfo(result[0]);
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Update_Service_Success, bodyDataJson);
            merchandiseComponentProducer.sendMessage(result[0].topic, message, function(error, data){
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

var bulkDeleteTenant=function(tenantUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(err, callback)
    }
    var getExist = isExist(null, tenantUUID);
    var topic='';
    getExist.then((results) => {
        if(results.flag==4){
            throw results;
        } else{
            topic=results.topic;
            return Promise.resolve(tenantProxy.deleteTenant(tenantUUID));
        }
    }).then(() => {
        if (config.is_sendMessage) {
            var message = new Message(MessageId.Delete_Service_Success, 204);
            merchandiseComponentProducer.sendMessage(topic, message, function(error, data){
                console.log(error);
            });
        }
        callback(null, 204);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    })
};

var bulkRetrieveTenant=function(tenantUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(err, callback);
    }
    var retrieveTenant = (tenantUUID) => {
        return Promise.resolve(tenantProxy.retrieveTenant(tenantUUID));
    }
    retrieveTenant(tenantUUID).then((results) => {
        var judge = common.isOnly(null, results.length);
        if(judge.is) {
            var bodyDataJson = returnResources.generateTenantRetInfo(results[0]);
            callback(null, bodyDataJson);
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve tenant.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve tenant. the uuid: ' + tenantUUID;
        }
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkListTenant=function(queryConditions, callback){
    var offset = common.ifNotReturnNum(Number(queryConditions.offset), 0);
    var limit = common.ifNotReturnNum(Number(queryConditions.limit), 25);
    var expandStr = queryConditions.expand;

    var judgeQuery = common.isValidQueryParams2(queryConditions, isValidQueryCondition, isExpandStrVail);
    var listSuccess = Promise.resolve(tenantProxy.queryTenants(queryConditions, offset, limit));
    var countSuccess = Promise.resolve(tenantProxy.getCount(queryConditions));

    Promise.all([judgeQuery, listSuccess, countSuccess]).then(function (result) {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListTenantRetInfo(queryConditions, offset, result[2], result[1]);
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
    }).catch(function (err) {
        common.errReturnCallback(err, callback);
        return;
    });
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, queryConditions='';
    if(utils.isTenantsURL(url)){
        tenantUUID=utils.getUUIDInHref(urlPath, 'tenants/');
    }else if(utils.isTenantURL(url)){
        isList=true;
    }
    if(active=='post'){
        bulkCreateTenant(params, callback);
    }else if(active=='put'){
        bulkUpdateTenant(tenantUUID, params, callback);
    }else if(active=='delete'){
        bulkDeleteTenant(tenantUUID,  callback);
    }else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListTenant(queryConditions, callback);
        }else{
            bulkRetrieveTenant(tenantUUID, queryConditions, callback);
        }
    }
}