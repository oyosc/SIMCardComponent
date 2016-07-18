/**
 * Created by Administrator on 2016/5/19.
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
var groupProxy=require('../proxy/groupOperator');
var organizationProxy=require('../proxy/organizationOperator');
var groupMembershipProxy=require('../proxy/groupMembershipOperator');
var MessageProducer = require('./messageProducerCentre').MessageProducer;
var merchandiseComponentProducer = new MessageProducer();
var Message = require('../common/message').Message;
var MessageId = require('../common/message').MessageId;
var config = require('../config/config');
var eventProxy = require('eventproxy');

/**
 * @apiDefine SIMCard SIMCard
 *
 * SIM卡(SIMCard)资源
 */

var validateParams =(info, isCreate)  => {
    var judgeResult;
    if(isCreate){
        judgeResult = common.mandatoryParams(info, [  'ICCID', 'IMSI', 'phone', 'batchNO', 'carrier', 'package', 'status', 'businessStatus',  'sn' ]);
    } else{
        judgeResult = common.mandatoryParams(info, [ 'ICCID', 'IMSI', 'phone', 'openCardData', 'packageType', 'batchNO', 'carrier', 'package', 'status', 'businessStatus', 'activeData', 'useData' , 'sn' , 'shareFlow' , 'testPeriodTo' , 'silentPeriodTo', 'description']);
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

function isExist(batchNO, directoryUUID, uuid){
    var queryStr='directoryUUID=\''+directoryUUID +'\'';
    if(batchNO){
         queryStr += ' and batchNO=\''+ batchNO + '\'';
     }else{
        queryStr += ' and uuid=\''+ uuid + '\'';
    }
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
            case 'expand':case 'offset': case 'limit':
            break;
            default:
                return false;
        }
    }
    return true;
}
/**
 * @api {post} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards CreateSIMCard
 * @apiName CreateSIMCard
 * @apiVersion 1.0.0
 * @apiGroup SIMCard
 * @apiDescription  创建一个SIM卡
 * @apiParam {string} ICCID
 * @apiParam {string} IMSI
 * @apiParam {string} phone 手机号
 * @apiParam {datetime} openCardData 开卡日期
 * @apiParam {string} packageType 套餐管理方式
 * @apiParam {string} batchNO 批次号
 * @apiParam {string} carrier 运营商
 * @apiParam {string} package 套餐/流量池名称
 * @apiParam {string} status 状态
 * @apiParam {string} businessStatus 业务状态
 * @apiParam {datetime} activeData 激活时间
 * @apiParam {datetime} useData 领用时间
 * @apiParam {string} sn 设备SN
 * @apiParam {string} shareFlow 是否流量共享
 * @apiParam {string} testPeriodTo 测试期至
 * @apiParam {string} silentPeriodTo 沉默期至
 * @apiParam {string} description 备注
 * @apiParam {json} [customData] 扩展字段
 *
 * @apiParam (output) {string} ICCID
 * @apiParam (output) {string} IMSI
 * @apiParam (output) {string} phone 手机号
 * @apiParam (output) {datetime} openCardData 开卡日期
 * @apiParam (output) {string} packageType 套餐管理方式
 * @apiParam (output) {string} batchNO 批次号
 * @apiParam (output) {string} carrier 运营商
 * @apiParam (output) {string} package 套餐/流量池名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} businessStatus 业务状态
 * @apiParam (output) {datetime} activeData 激活时间
 * @apiParam (output) {datetime} useData 领用时间
 * @apiParam (output) {string} sn 设备SN
 * @apiParam (output) {string} shareFlow 是否流量共享
 * @apiParam (output) {string} testPeriodTo 测试期至
 * @apiParam (output) {string} silentPeriodTo 沉默期至
 * @apiParam (output) {string} description 备注
 * @apiParam (output) {json} [customData] 扩展字段
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} directory 该SIM卡所在目录的URL链接，见资源[Directory](#api-Directory)
 * @apiParam (output) {url} groups 该SIM卡所在组的URL链接，见资源[Groups](#api-Group)
 * @apiParam (output) {url} groupMemberships 该SIM卡所在组关系的URL链接，见资源[GroupMembership](#api-GroupMembership)
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 * @apiParam (output) {url} flows 流量URL链接，见[Flow](#api-Flow)资源
 *
 * @apiParamExample  Example Request
 * POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards
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
 * HTTP/1.1 201 Created
 * Location: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',
 *   'ICCID' : 'W9047090024',
 *   'IMSI' : '18666291303',
 *   'batchNO' : '2015091007',
 *   'status' : '销卡',
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   'directory' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo"
 *   },
 *   'tenant' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   'groups' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groups"
 *   },
 *   'flows' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows"
 *   },
 *   'groupMemberships' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groupMemberships"
 *   }
 * }
 */
var createSIMCardsV1 = (req, res) =>{
    var info = req.body;
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var tenantUUID=req.params.tenantUUID;
    info.tenantUUID=tenantUUID;
    var directoryUUID=req.params.directoryUUID;
    info.directoryUUID=directoryUUID;

    var judgeResult = validateParams(info, true);
    var getExist=isExist(info.batchNO, directoryUUID, null);
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
                return Promise.resolve(simCardProxy.createSIMCard(info));
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
        var bodyDataJson = returnResources.generateSIMCardRetInfo(tenantUUID, result);
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
exports.createSIMCards = (req, res, next)  => {
    var version = req.params.version;
    if(version == common.VERSION100){
        createSIMCardsV1(req, res);
        if(config.record == true){
            next();
        }
    }
};
/**
 * @api {put} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID UpdateSIMCard
 * @apiName UpdateSIMCard
 * @apiVersion 1.0.0
 * @apiGroup SIMCard
 * @apiDescription  更新一个SIM卡
 * @apiParam {string} ICCID
 * @apiParam {string} IMSI
 * @apiParam {string} phone 手机号
 * @apiParam {datetime} openCardData 开卡日期
 * @apiParam {string} packageType 套餐管理方式
 * @apiParam {string} batchNO 批次号
 * @apiParam {string} carrier 运营商
 * @apiParam {string} package 套餐/流量池名称
 * @apiParam {string} status 状态
 * @apiParam {string} businessStatus 业务状态
 * @apiParam {datetime} activeData 激活时间
 * @apiParam {datetime} useData 领用时间
 * @apiParam {string} sn 设备SN
 * @apiParam {string} shareFlow 是否流量共享
 * @apiParam {string} testPeriodTo 测试期至
 * @apiParam {string} silentPeriodTo 沉默期至
 * @apiParam {string} description 备注
 * @apiParam {json} [customData] 扩展字段
 *
 * @apiParam (output) {string} ICCID
 * @apiParam (output) {string} IMSI
 * @apiParam (output) {string} phone 手机号
 * @apiParam (output) {datetime} openCardData 开卡日期
 * @apiParam (output) {string} packageType 套餐管理方式
 * @apiParam (output) {string} batchNO 批次号
 * @apiParam (output) {string} carrier 运营商
 * @apiParam (output) {string} package 套餐/流量池名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} businessStatus 业务状态
 * @apiParam (output) {datetime} activeData 激活时间
 * @apiParam (output) {datetime} useData 领用时间
 * @apiParam (output) {string} sn 设备SN
 * @apiParam (output) {string} shareFlow 是否流量共享
 * @apiParam (output) {string} testPeriodTo 测试期至
 * @apiParam (output) {string} silentPeriodTo 沉默期至
 * @apiParam (output) {string} description 备注
 * @apiParam (output) {json} [customData] 扩展字段
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} directory 该SIM卡所在目录的URL链接，见资源[Directory](#api-Directory)
 * @apiParam (output) {url} groups 该SIM卡所在组的URL链接，见资源[Groups](#api-Group)
 * @apiParam (output) {url} groupMemberships 该SIM卡所在组关系的URL链接，见资源[GroupMembership](#api-GroupMembership)
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 * @apiParam (output) {url} flows 流量URL链接，见[Flow](#api-Flow)资源
 *
 * @apiParamExample  Example Request
 * put:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards
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
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',
 *   'ICCID' : 'W9047090024',
 *   'IMSI' : '18666291303',
 *   'batchNO' : '2015091007',
 *   'status' : '销卡',
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   'directory' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo"
 *   },
 *   'tenant' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   'groups' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groups"
 *   },
 *   'flows' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows"
 *   },
 *   'groupMemberships' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groupMemberships"
 *   }
 * }
 */

var updateSIMCard = (req, res) => {
    var info = req.body;
    var tenantUUID=req.params.tenantUUID;
    info.tenantUUID=tenantUUID;
    var directoryUUID=req.params.directoryUUID;
    info.directoryUUID=directoryUUID;

    if ( !utils.checkUUID(req.params.tenantUUID) &&  !utils.checkUUID(req.params.directoryUUID) &&  !utils.checkUUID(req.params.simCardUUID) ) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var simCardUUID = req.params.simCardUUID;
    info.uuid = simCardUUID;

    var judgeResult = validateParams(info, true);
    var getExist=isExist(null, directoryUUID, info.uuid);

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
            return Promise.resolve(simCardProxy.updateSIMCard(info));
        }
    }).then((result) => {
            var bodyDataJson = returnResources.generateSIMCardRetInfo(tenantUUID, result);
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
exports.updateSIMCard  = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        updateSIMCard(req , res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID RetrieveSIMCard
 * @apiName RetrieveSIMCard
 * @apiVersion 1.0.0
 * @apiGroup SIMCard
 * @apiDescription  获取指定SIM卡。
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是directory、groups[offset,limit]、groupMemberships[offset,limit]或他们的组合，中间用','号隔开。
 *
 * @apiParam (output) {string} ICCID
 * @apiParam (output) {string} IMSI
 * @apiParam (output) {string} phone 手机号
 * @apiParam (output) {datetime} openCardData 开卡日期
 * @apiParam (output) {string} packageType 套餐管理方式
 * @apiParam (output) {string} batchNO 批次号
 * @apiParam (output) {string} carrier 运营商
 * @apiParam (output) {string} package 套餐/流量池名称
 * @apiParam (output) {string} status 状态
 * @apiParam (output) {string} businessStatus 业务状态
 * @apiParam (output) {datetime} activeData 激活时间
 * @apiParam (output) {datetime} useData 领用时间
 * @apiParam (output) {string} sn 设备SN
 * @apiParam (output) {string} shareFlow 是否流量共享
 * @apiParam (output) {string} testPeriodTo 测试期至
 * @apiParam (output) {string} silentPeriodTo 沉默期至
 * @apiParam (output) {string} description 备注
 * @apiParam (output) {json} [customData] 扩展字段
 * @apiParam (output) {string} createAt 创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {string} modifiedAt 最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）
 * @apiParam (output) {url} directory 该SIM卡所在目录的URL链接，见资源[Directory](#api-Directory)
 * @apiParam (output) {url} groups 该SIM卡所在组的URL链接，见资源[Groups](#api-Group)
 * @apiParam (output) {url} groupMemberships 该SIM卡所在组关系的URL链接，见资源[GroupMembership](#api-GroupMembership)
 * @apiParam (output) {url} tenant 该组的租赁用户URL链接，见[Tenant](#api-Tenant)资源
 * @apiParam (output) {url} flows 流量URL链接，见[Flow](#api-Flow)资源
 *
 * @apiParamExample  Example Request
 * GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g

 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',
 *   'ICCID' : 'W9047090024',
 *   'IMSI' : '18666291303',
 *   'batchNO' : '2015091007',
 *   'status' : '销卡',
 *   ...
 *   'customData':{
 *                  ……values……
 *   }
 *   "createAt" : "2016-01-10 12:30:00",
 *   "modifiedAt" : "2016-01-10 12:30:00",
 *   'directory' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo"
 *   },
 *   'tenant' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9"
 *   },
 *   'groups' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groups"
 *   },
 *   'flows' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows"
 *   },
 *   'groupMemberships' : {
 *      'href' : "https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groupMemberships"
 *   }
 * }
 */
function isExpandStrVail(expandStr) {
    var expandArray = expandStr.split(';');
    for(var i = 0; i < expandArray.length; ++i) {
        var retExpand = common.getExpand(expandArray[i]);
        switch (retExpand[0]) {
            case 'directory':
            case 'groups':
            case 'groupMemberships':
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
        var bodyInfo = returnResources.generateDirectoryRetInfo(results);
        return bodyInfo;
    })
}
function getGroups(tenantUUID, directoryUUID, simCardUUID, offset, limit){
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
}

function getExpandInfo(expandStr, data, retInfo, isList, itemIndex, tenantUUID){

    return new Promise((resolve) => {
        var expandArray = expandStr.split(';');
        var index = 0;

        for(var i = 0; i < expandArray.length; ++i){
            var retExpand = common.getExpand(expandArray[i]);
            switch(retExpand[0]){
                case 'directory':
                    getDirectory(tenantUUID, data.directoryUUID).then((result) => {
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
                    break;
                default:
                    var err = new Error('the params of expand is error!'+retExpand[0]);
                    err.status = 400;
                    throw err;
            }
        }
    });
}

var retrieveSIMCardV1 = (req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.simCardUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var simCardUUID = req.params.simCardUUID;
    var directoryUUID = req.params.directoryUUID;
    var tenantUUID = req.params.tenantUUID;
    var expandStr = req.query.expand;

    var judgeParams = common.isValidQueryParams(req, null, isExpandStrVail);
    var retSIMCard = Promise.resolve(simCardProxy.retrieveSIMCard(directoryUUID, simCardUUID));
    Promise.all([judgeParams, retSIMCard]).then((results) => {
        if(results[0].is==false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateSIMCardRetInfo(tenantUUID, results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID));
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve SIMCard.the uuid: ' + simCardUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve SIMCard. the uuid: ' + simCardUUID;
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
exports.retrieveSIMCard = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        retrieveSIMCardV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {delete} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID DeleteSIMCard
 * @apiName DeleteSIMCard
 * @apiGroup SIMCard
 * @apiDescription  删除指定SIM卡
 * @apiParamExample  Example Request
 * DELETE:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g

 * @apiSuccessExample Example Response
 * HTTP/1.1 204 NoContent
 */

var deleteSIMCardV1 = (req, res) => {
    if ( !utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID) && !utils.checkUUID(req.params.simCardUUID)) {
        var error;
        error={
            status:400,
            description:'输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var simCardUUID = req.params.simCardUUID;
    var tenantUUID = req.params.tenantUUID;

    var delSIMCard = Promise.resolve(simCardProxy.deleteSIMCard(simCardUUID));
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
    delSIMCard.then((result) => {
        var judge = common.isOnly(null, result);
        if(judge.is) {
            ep.emit('send_Message');
            res.writeHead(204, {'Content-Type': contentType});
            res.end();
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve SIMCard.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve SIMCard. the uuid: ' + tenantUUID;
        }
        throw judge;
    }).catch((err) =>  {
        common.errReturnCommon(err, res);
        return;
    });
}
exports.deleteSIMCard=(req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        deleteSIMCardV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

/**
 * @api {get} /:version/tenants/:tenantUUID/directories/:directoryUUID/simCards ListSIMCards
 * @apiName ListSIMCards
 * @apiGroup SIMCard
 * @apiDescription  根据特定的字段，获取一系列SIM卡详情信息。
 * @apiParam {int} [offset] 偏移量
 * @apiParam {int} [limit] 获取记录条数
 * @apiParam {string} ICCID
 * @apiParam {string} IMSI
 * @apiParam {string} phone 手机号
 * @apiParam {datetime} openCardData 开卡日期
 * @apiParam {string} packageType 套餐管理方式
 * @apiParam {string} batchNO 批次号
 * @apiParam {string} carrier 运营商
 * @apiParam {string} package 套餐/流量池名称
 * @apiParam {string} status 状态
 * @apiParam {string} businessStatus 业务状态
 * @apiParam {datetime} activeData 激活时间
 * @apiParam {datetime} useData 领用时间
 * @apiParam {string} sn 设备SN
 * @apiParam {string} [expand] ?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是directory、groups[offset,limit]、groupMemberships[offset,limit]或他们的组合，中间用','号隔开。
 * @apiParam {string} [orderBy] 排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序
 *
 * @apiParamExample  Example Request
 * GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200 OK
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards',
 *   'offset':0,
 *   'limit':25,
 *   'items':[
 *      {
 *          'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',
  *          'SN' : '123456789012345',
  *          'ICCID' : 'W9047090024',
  *          'IMSI' : '18666291303',
 *          …… remaining key/value of simCards……
 *      }，
 *      …… remaining item of simCards……
 *    ]
 * }
 */

var listSIMCardsV1 = (req, res) => {
    if (!utils.checkUUID(req.params.tenantUUID) && !utils.checkUUID(req.params.directoryUUID)) {
        var error;
        error = {
            status: 400,
            description: '输入参数有误'
        }
        return common.errorReturn(res, error.status, error);
    }
    var directoryUUID = req.params.directoryUUID;
    var tenantUUID = req.params.tenantUUID;
    var queryConditions = req.query;
    var offset = common.ifNotReturnNum(Number(req.query.offset), 0);
    var limit = common.ifNotReturnNum(Number(req.query.limit), 25);
    var expandStr = req.query.expand;

    var judgeQuery = common.isValidQueryParams(req, isValidQueryCondition, isExpandStrVail);
    var listSuccess = Promise.resolve(simCardProxy.querySIMCards(directoryUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(simCardProxy.getCount(directoryUUID, queryConditions));

    Promise.all([judgeQuery, listSuccess, countSuccess]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, directoryUUID, queryConditions, offset, result[2], result[1]);
        if (!result[0].isExpand) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) => {
            for (var i = 0; i < result[1].length; ++i) {
                getExpandInfo(expandStr, result[1][i], bodyInfo, true, i, tenantUUID).then((datas) => {
                    ++count;
                    if (count == result[1].length) {
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
exports.listSIMCards = (req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listSIMCardsV1(req, res);
        if(config.record == true){
            next();
        }
    }
};
var listSIMCardsByOrganizationV1 = (req, res) => {
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
    var listSuccess=Promise.resolve(simCardProxy.querySIMCards(null, queryConditions, offset, limit, null, organizationUUID, null));
    var countSuccess=Promise.resolve(simCardProxy.getCount(null, queryConditions, null, organizationUUID));

    Promise.all([judgeQuery, isOrganization, listSuccess, countSuccess]).then((results) => {
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, null, queryConditions, offset, results[3], results[2], null, organizationUUID);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) => {
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID)
                    .then( (datas) =>  {
                        ++count;
                        if (count == results[2].length) {
                            resolve(datas);
                        }
                    })
            }
        }).then( (bodyInfo) =>  {
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
exports.listSIMCardsByOrganization=(req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listSIMCardsByOrganizationV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var listSIMCardsByGroupV1 = (req, res) => {
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
    var listSuccess=Promise.resolve(simCardProxy.querySIMCards(null, queryConditions, offset, limit, groupUUID));
    var countSuccess=Promise.resolve(simCardProxy.getCount(null, queryConditions, groupUUID));

    Promise.all([judgeQuery, isGroup, listSuccess, countSuccess]).then((results) => {
        if(results[0].is ==  false){
            throw results[0];
        }
        if(results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, null, queryConditions, offset, results[3], results[2], groupUUID);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) => {
            for (var i = 0; i < results[2].length; ++i) {
                getExpandInfo(expandStr, results[2][i], bodyInfo, true, i, tenantUUID)
                    .then( (datas) =>  {
                        ++count;
                        if (count == results[2].length) {
                            resolve(datas);
                        }
                    })
            }
        }).then( (bodyInfo) => {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        });
    }).catch( (err) =>  {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.listSIMCardsByGroup=(req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        listSIMCardsByGroupV1(req, res);
        if(config.record == true){
            next();
        }
    }
}

var allSIMCardsV1 = (req, res) => {
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
    var listSuccess=Promise.resolve(simCardProxy.querySIMCards(null, queryConditions, offset, limit, null, null, null, tenantUUID));
    var countSuccess=Promise.resolve(simCardProxy.getCount(null, queryConditions, null, null, null, tenantUUID));

    Promise.all([judgeQuery, isTenant, listSuccess, countSuccess]).then((results) => {
        if(results[0].is ==  false){
            throw results[0];
        }
        if( results[1].is ==  false){
            throw results[1];
        }
        if(results[2].length==0){
            results[2]=new Array();
        }
        var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, null, queryConditions, offset, results[3], results[2]);
        if (!results[0].isExpand || results[2].length == 0) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(JSON.stringify(bodyInfo));
            res.end();
            return;
        }
        var count = 0;
        new Promise((resolve) => {
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
    }).catch( (err) =>  {
        common.errReturnCommon(err, res);
        return;
    });
};
exports.allSIMCards=(req, res, next) => {
    var version = req.params.version;
    if(version == common.VERSION100){
        allSIMCardsV1(req, res);
        if(config.record == true){
            next();
        }
    }
}


var bulkCreateSIMCard=function(tenantUUID, directoryUUID, info, callback){
    if ( !utils.checkUUID(tenantUUID) && !utils.checkUUID(directoryUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    info.directoryUUID=directoryUUID;
    var judgeResult = validateParams(info, true);
    var getExist=isExist(info.batchNO, directoryUUID, null);
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
                return Promise.resolve(simCardProxy.createSIMCard(info));
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
        var bodyDataJson = returnResources.generateSIMCardRetInfo(tenantUUID, result);
        ep.emit('send_Message', bodyDataJson);
        callback(null, result);
        return;
    }).catch((err) => {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkDeleteSIMCard=function(tenantUUID, directoryUUID, simCardUUID,  callback){
    if ( !utils.checkUUID(tenantUUID)&& !utils.checkUUID(directoryUUID)&& !utils.checkUUID(simCardUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
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
    var delSIMCard = Promise.resolve(simCardProxy.deleteSIMCard(simCardUUID));
    delSIMCard.then((result) => {
        var judge = common.isOnly(null, result);
        if(judge.is) {
            ep.emit('send_Message');
            callback(null, 204);
            return;
        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve SIMCard.the uuid: ' + tenantUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve SIMCard. the uuid: ' + tenantUUID;
        }
        throw judge;
    }).catch((err) =>  {
        common.errReturnCallback(err, callback);
        return;
    });
};

var bulkUpdateSIMCard=function(tenantUUID, directoryUUID, simCardUUID,  info, callback){
    if (  !utils.checkUUID(tenantUUID)&& !utils.checkUUID(directoryUUID)&& !utils.checkUUID(simCardUUID)) {
        var error = {
            status: 400,
            description: '输入参数有误'
        }
        common.errReturnCallback(error, callback)
    }
    info.tenantUUID=tenantUUID;
    info.directoryUUID=directoryUUID;
    info.uuid = simCardUUID;
    var judgeResult = validateParams(info, true);
    var getExist=isExist(null, directoryUUID, info.uuid);
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
            return Promise.resolve(simCardProxy.updateSIMCard(info));
        }
    }).then((result) => {
            var bodyDataJson = returnResources.generateSIMCardRetInfo(tenantUUID, result);
            ep.emit('send_Message', bodyDataJson);
            callback(null, bodyDataJson);
            return;
        })
        .catch((err) => {
            common.errReturnCallback(err, callback);
            return;
        });
};

var bulkRetrieveSIMCard=function(tenantUUID, directoryUUID, simCardUUID,  queryConditions, callback){
    if ( !utils.checkUUID(tenantUUID)&&!utils.checkUUID(directoryUUID)&&!utils.checkUUID(simCardUUID)) {
        var error;
        error.status=400;
        error.description='输入参数有误';
        common.errReturnCallback(error, callback);
    }
    var expandStr = queryConditions.expand;
    var judgeParams = common.isValidQueryParams2(queryConditions, null, isExpandStrVail);
    var retSIMCard = Promise.resolve(simCardProxy.retrieveSIMCard(directoryUUID, simCardUUID));
    Promise.all([judgeParams, retSIMCard]).then((results) => {
        if(results[0].is==false){
            throw  results[0];
        }
        var judge = common.isOnly(null, results[1].length);
        if(judge.is) {
            var bodyInfo = returnResources.generateSIMCardRetInfo(tenantUUID, results[1][0]);
            if(!results[0].isExpand){
                return bodyInfo;
            }
            return Promise.resolve(getExpandInfo(expandStr, results[1][0], bodyInfo, false, 0, tenantUUID));

        }
        var error = judge.error;
        if(judge.flag == 1) {
            error.description = 'Could not find the resources you want to retrieve SIMCard.the uuid: ' + simCardUUID;
        } else if(judge.flag == 2) {
            error.description = 'Find much resource when retrieve SIMCard. the uuid: ' + simCardUUID;
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

var bulkListSIMCard=function( tenantUUID, directoryUUID,  queryConditions, callback){
    if (!utils.checkUUID(tenantUUID)&&!utils.checkUUID(directoryUUID) ) {
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
    var listSuccess = Promise.resolve(simCardProxy.querySIMCards(directoryUUID, queryConditions, offset, limit));
    var countSuccess = Promise.resolve(simCardProxy.getCount(directoryUUID, queryConditions));

    Promise.all([judgeQuery, listSuccess, countSuccess]).then((result) => {
        if (result[0].is == false) {
            throw result[0];
        }
        if (result[1].length == 0) {
            result[1] = new Array();
        }
        var bodyInfo = returnResources.generateListSIMCardRetInfo(tenantUUID, directoryUUID, queryConditions, offset, result[2], result[1]);
        if (!result[0].isExpand) {
            callback(null, bodyInfo);
            return;
        }
        var count = 0;
        new Promise((resolve) => {
            for (var i = 0; i < result[1].length; ++i) {
                getExpandInfo(expandStr, result[1][i], bodyInfo, true, i, tenantUUID).then((datas) => {
                    ++count;
                    if (count == result[1].length) {
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
};

exports.bulkOperator = function(active, url, urlPath,  params, callback) {
    var tenantUUID ='', isList=false, directoryUUID= '', simCardUUID= '',  queryConditions='';
    if(utils.isSIMCardsURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/directories');
        directoryUUID =utils.getUUIDInHref(urlPath, 'directories/', '/simCards');
        simCardUUID=utils.getUUIDInHref(urlPath, 'simCards/');
    }else if(utils.isSIMCardURL(url)){
        tenantUUID =utils.getUUIDInHref(urlPath, 'tenants/', '/directories');
        directoryUUID =utils.getUUIDInHref(urlPath, 'directories/', '/simCards');
        isList=true;
    }
    if(active=='post'){
        bulkCreateSIMCard(tenantUUID, directoryUUID,  params, callback);
    }else if(active=='delete'){
        bulkDeleteSIMCard(tenantUUID, directoryUUID, simCardUUID,  callback);
    }else if(active=='put'){
        bulkUpdateSIMCard(tenantUUID, directoryUUID, simCardUUID, params, callback);
    } else if(active=='get'){
        queryConditions=utils.parseUrlParam(url);
        if(isList){
            bulkListSIMCard(tenantUUID, directoryUUID, queryConditions, callback);
        }else{
            bulkRetrieveSIMCard(tenantUUID, directoryUUID, simCardUUID, queryConditions, callback);
        }
    }
}