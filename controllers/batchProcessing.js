/**
 * Copyright(C),
 * FileName:  batchProcessing.js
 * Author: Zz
 * Version: 1.0.0
 * Date: 2016/5/4  9:51
 * Description:
 */
var common = require('./common');
var contentType = require('./common').retContentType;
//var utils = require('./../common/utils');
//var errorCodeTable = require('../common/errorCodeTable');
var retResources = require('./returnResources');
var batchProcessing = require('./../proxy/batchProcessingOperator');

function isValidQueryCondition(queryCondition) {
    for(var item in queryCondition) {
        switch(item) {
            case 'items' :
            default:
                return false;
        }
    }
    return true;
}

/**
 * @api {post} /:version/resources BatchResources
 * @apiName BatchResources
 * @apiGroup BatchProcessing
 *
 * @apiDescription  批量处理资源
 *
 * @apiParam (input) {Array} items 标识着所要创建批量资源操作的所有单元，每个单元至少包含href,action,body属性。
 *
 * @apiParam (output) {Array} items 标识着所要创建批量资源操作的所有单元，每个单元至少包含href,action,body属性，如果单元创建失败，error标识着错误的信息。
 *
 * @apiParamExample  Example Request
 * POST:  https://webChatShop-stage.cyhl.com.cn:3000/api/v1/resources
 * {
 *   "items" : [
 *      {
 *          "action": "post",
 *          "href": "https://webChatShop-stage.cyhl.com.cn:3000/api/v1/accounts",
 *          "body": {
 *              "account" : "125634xxx",
 *              "mobile": "13760475521",
 *              "password": "0123256244536"(密码是加过密的密文)
 *              "department": {'href': 'https://webchatshop-stage.cyhl.com.cn:3000/api/v1/merchants/3232CqrNgrzcIGYs1PfP4F/departments/1212CqrNgrzcIGYs1PfP4F'},
 *              "role": {'href': 'https://webchatshop-stage.cyhl.com.cn:3000/api/v1/merchants/3232CqrNgrzcIGYs1PfP4F/roles/1212CqrNgrzcIGYs1PfP4F'},
 *              "merchant" : {'href' : 'https://webchatshop-stage.cyhl.com.cn:3000/api/v1/merchants/3232CqrNgrzcIGYs1PfP4F'},
 *              "status": 1,
 *              "activate": 1,
 *              "flag":0
 *          }
 *      },
 *     {
 *          "action": "get",
 *          "href": "https://webChatShop-stage.cyhl.com.cn:3000/api/v1/brands/asdfasdfafdadfa"
 *
 *     }
 *     ........
 *     ........
 *     ........
 *     ........
 *   ]
 * }
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200
 * Location: https://webChatShop-stage.cyhl.com.cn:3000/api/v1/resources/
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   "href":"https://webChatShop-stage.cyhl.com.cn:3000/api/v1/resources",
 *   "items" : [
 *      {
 *          "action": "post",
 *          "href": "https://webChatShop-stage.cyhl.com.cn:3000/api/v1/accounts",
 *          "body": {
 *              "account" : "125634xxx",
 *              "mobile": "13760475521",
 *              "password": "0123256244536"(密码是加过密的密文)
 *              "department": {'href': 'https://webchatshop-stage.cyhl.com.cn:3000/api/v1/merchants/3232CqrNgrzcIGYs1PfP4F/departments/1212CqrNgrzcIGYs1PfP4F'},
 *              "role": {'href': 'https://webchatshop-stage.cyhl.com.cn:3000/api/v1/merchants/3232CqrNgrzcIGYs1PfP4F/roles/1212CqrNgrzcIGYs1PfP4F'},
 *              "merchant" : {'href' : 'https://webchatshop-stage.cyhl.com.cn:3000/api/v1/merchants/3232CqrNgrzcIGYs1PfP4F'},
 *              "status": 1,
 *              "activate": 1,
 *              "flag":0
 *          },
 *          "error":{
 *              "name": "Error",
 *              "code": 1002,
 *              "message": "Missing name",
 *              "description": "the attribute of name is required to access the resource.",
 *              "stack": ""
 *          }
 *      },
 *     {
 *          "action": "get",
 *          "href": "https://webChatShop-stage.cyhl.com.cn:3000/api/v1/brands/asdfasdfafdadfa",
 *          "body":{
 *              'id' : '0213',
 *              'name' : '大众',
 *              'pinYin' : 'DaZhong',
 *              'manufacturer' : '上海大众汽车有限公司',
 *              'logo': '000.jpg'
 *          },
 *     }
 *     ........
 *     ........
 *     ........
 *     ........
 *   ]
 * }
 */
exports.batchProcessing = function(req, res){
    var judge = common.isValidQueryParams(req, isValidQueryCondition);
    if(!judge.is){
        common.errorReturn(res, judge.error.status, judge.error);
        return;
    }
    console.log(req.body);
    batchProcessing.bash(req.body.items, function(error, items){
        if(error){
            common.errorReturn(res, error.status, error)
            return;
        }
        var retInfo = retResources.retBashProcessingInfo(items);
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(retInfo));
        res.end();
    });
   /* batchProcessing.bash1(req.body.items, function(error, items){
        if(error)
        {
            common.errorReturn(res, error.status, error)
            return;
        }
        var retInfo = retResources.retBashProcessingInfo(items);
        res.writeHead(200, {'Content-Type': contentType});
        res.write(JSON.stringify(retInfo));
        res.end();
    });*/
};