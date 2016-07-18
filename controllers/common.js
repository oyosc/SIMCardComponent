/**
 * Copyright(C),
 * FileName:  common.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/25  15:09
 * Description:
 */

"use strict";
//var fs = require('fs');
var logger = require('../common/log').getLogger();
var errorCodeTable = require('../common/errorCodeTable');
var _=require('lodash');

exports.retContentType = "application/json;charset=UTF-8";
exports.HAuthHost = '54.223.223.166';
exports.HAuthHostPort = '3001';
exports.HauthBasePath = '/api/v1/tenants';
exports.MSDURI = '/api/v1/tenants/tkatxG9Zx8rbRuAg8FzBPg';
exports.OldSystemPath = '/mms/api/merchantManager_registerMerchantList.action';
var config = require('./../config/config');
var querystring = require('querystring');
exports.m_logicDeleteFlag=1;
exports.VERSION100 = 'v1.0.0';

exports.options = {
    host: config.server_domain,
    port: config.server_port,
    path: '/'+this.VERSION100+'/',
    method: 'POST',
    auth: 'L6NmVBbt7lIB2xYixh/HRA:JRe9exTImB9XegXUyRfEqQ',
    //key: fs.readFileSync(__dirname+'/clientSSLkey/client-key.pem'),
    //cert: fs.readFileSync(__dirname+'/clientSSLkey/client-cert.pem'),
    rejectUnauthorized: false,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
};

exports.hauthOptions = {
    host: this.HAuthHost,
    port: this.HAuthHostPort,
    path: '/'+this.VERSION100+'/',
    method: 'POST',
    auth: 'FxZjR6yQKdoaSrMRlP3G6w:4URBmyhOEnjWZkpNoAj5Zg',
    //key: fs.readFileSync(__dirname+'/clientSSLkey/client-key.pem'),
    //cert: fs.readFileSync(__dirname+'/clientSSLkey/client-cert.pem'),
    rejectUnauthorized: false,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
};

exports.isUrlHasExpand = function(req) {
    if(!req.query){
        return false;
    }
    for(var item in req.query){
        if(item ==  'expand') {
            return true;
        }
    }
    return false;
};

exports.ifNotReturnNum = function (value, num) {
    return value ? value : (num ? num : 0);
};

exports.serverResponse = function (res, callback) {
    res.setEncoding('utf8');
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
        var dataInfo = {};
        if (data != '') {
            dataInfo = JSON.parse(data);
        }
        callback(dataInfo);
    })
};

exports.simpleReturn = function (res, status, body) {
    res.writeHead(status, {'Content-Type': this.retContentType});
    body ? res.end(JSON.stringify(body)) : res.end();
};
exports.errorReturn = function(res, status, error){
    res.writeHead(status, {'Content-Type': this.retContentType});
    var body = {
        'name' : ((error && error.name) ? error.name:'Error'),
        'code' : ((error && error.code) ? error.code:9999),
        'message' : ((error &&error.message) ? error.message : 'Unknown Error'),
        'description' : ((error &&error.description) ? error.description : ''),
        'stack' : ((error&&error.stack) ? error.stack : 'no stack')
    };
    res.write(JSON.stringify(body));
    res.end();
    var logString = 'status: '+ status +' name: '+body.name+' code: '
        +body.code+' message: '+body.message+' description: '+body.description;
    console.log(logString);
    logger.error(error?error:body);
}

exports.simpleRetOldSys = function (res, status, body) {
    res.writeHead(status, {'Content-Type': this.retContentType});
    res.write(JSON.stringify(body));
    res.end();
};

exports.convert2ReturnData = function (retDataInfo, dataInfo, excludeAttribute) {
    for (var item in dataInfo) {
        var isContinue = false;
        for (var i = 0; i < excludeAttribute.length; ++i) {
            if (item == excludeAttribute[i]) {
                isContinue = true;
                break;
            }
        }
        if (isContinue){
            continue;
        }

        retDataInfo[item] = dataInfo[item];
    }
};

//snRule规则合法判断
var charReg = (string, char) => {
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

exports.validRule = (info)=> {
    var message={
        flag: '1',
        err: ''
    };
    var arr = ['C','W','c','Y','P','M','D','V'];
    if(info.indexOf('0')>0&&info.indexOf('F')>0){
        message.err = '同时存在F跟0';
        message.flag = '0';
        return message;
    }else if(info.indexOf('0')>0){
        arr.push('0');
    }else if(info.indexOf('F')>0){
        arr.push('F');
    }
    for(let i = 0;i<info.length;i++){
        if(info[i] == 'C'||info[i] == 'W' ||info[i] == 'c'||info[i] == 'Y'||info[i] == 'P'||info[i] == 'M'||info[i] == 'D'||info[i] == 'V'||info[i] == 'F'||info[i] == '0'){
            continue;
        }else{
            message.err = '存在不合法的字符';
            message.flag = '0';
            return message;
        }
    }
    var charLength = new Array;
    for(var x in arr){
        charLength.push(charReg(info, arr[x]));
    }
    for(var length in charLength){
        if(!charLength[length]){
            message.err = '输入的字符不符合规则';
            message.flag = '0';
            return message;
        }
    }
    return message;
}


/**
 *  检查必选参数
 * @param verificationInfo [JSON] 参数集
 * @param mandParams [Array] 必选参数
 * @returns error Error错误对象
 */
exports.mandatoryParams = function( verificationInfo, mandParams ){
    var retData = {'is': true, 'error': '', 'flag':0};
    var error = null;
    mandParams.some( function(item){
        if( ! verificationInfo.hasOwnProperty(item)){
            error = new Error();
            error.name = 'Error';
            error.status = 400;
            error.code = errorCodeTable.missingParam2Code( item );
            error.message = errorCodeTable.errorCode2Text( error.code );
            error.description = '';

            retData.error = error;
            retData.is = false;
            retData.flag = 4;
            return retData;
            //return true;
        }
    });
    return retData;
};

/**
 *  参数有效性判断
 * @param verificationInfo [JSON] 参数集
 * @param valParamsJudgeFunction [JSON] 参数有效性判断函数集，JOSN的key值对应verificationInfo里面的key值，value值为有效性判断函数
 * @returns error Error错误对象
 */
exports.validateParams = function( verificationCodesInfo, valParamsJudgeFunction ) {
    var retData = {'is': true, 'error': '', 'flag':0};
    var error = null;
    for(var item in valParamsJudgeFunction){
        if( verificationCodesInfo.hasOwnProperty(item)){
            if( ! valParamsJudgeFunction[item](verificationCodesInfo[item])){
                error = new Error();
                error.name = 'SyntaxError';
                error.status = 400;
                error.code = errorCodeTable.formatParam2Code( item );
                error.message = errorCodeTable.errorCode2Text( error.code );
                error.description = 'Request '+ item +' field.';

                retData.error = error;
                retData.is = false;
                retData.flag = 5;
                return retData;
                //return error;
            }
        }
    }
    return retData;
};

exports.isDBError = function(error) {
    var retData = {'is': true, 'error': '', 'flag':0};
    if(error.code && error.errno){
        var err = new Error();
        err.name = 'DBError';
        err.status = 500;
        err.code = 5100;
        err.message = errorCodeTable.errorCode2Text( err.code);
        err.description = error.code + '( ' + error.errno + ' ): ' + error.message;
        retData.error = err;
        retData.is = false;
        retData.flag = 3;
    }else{
        error.name = 'DBError';
        error.description = '';
        error.status = 500;
        error.code = 5100;
        error.message = errorCodeTable.errorCode2Text(error.code);
        retData.error = error;
        retData.is = false;
        retData.flag = 3;
    }
    return retData;

}

exports.isOnly = function (err, count){
    var error = new Error();
    var retData = {'is': true, 'error': '', 'flag':0};
    if(err){
        retData.error = err;
        retData.is = false;
        retData.flag = 3;
        return retData;
    }
    if(count == 0){
        error.name = 'SyntaxError';
        error.status = 404;
        error.code = 7038;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Could not find the resource.';
        retData.error = error;
        retData.is = false;
        retData.flag = 1;
        return retData;
    }else if(count > 1){
        error.name = 'InternalError';
        error.status = 409;
        error.code = 7037;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Find much resource.';

        retData.error = error;
        retData.is = false;
        retData.flag = 2;
        return retData;
    }
    return retData;
};

exports.isValidQueryParams = function(req, isValidQueryCondition, isExpandStrValid){
    var retData = {'is': true, 'error': '', 'flag':0, 'isExpand': false};

    var error = new Error();
    error.name = 'SyntaxError';
    error.status = 400;
    error.code = 3999;
    error.message = errorCodeTable.errorCode2Text( error.code );
    if(isValidQueryCondition && !isValidQueryCondition(req.query)){
        error.description = 'query params error! the query string is : ' + querystring.stringify(req.query);
        retData.is = false;
        retData.error = error;
        retData.flag = 6;
        return retData;
    }

    if(!isExpandStrValid){
        return retData;
    }

    var isExpand = this.isUrlHasExpand(req);
    retData.isExpand = isExpand;
    if( isExpand && isExpandStrValid(req.query.expand) == false){
        error.description = 'query params of expand is error! expand string is: ' + req.query.expand;
        retData.is = false;
        retData.error = error;
        retData.flag = 7;
        return retData;
    }
    return retData;
};

exports.getExpand=function(expandStr){
    var reg = /[(:,)]/;
    var strArray = expandStr.split(reg);
    var offset, limit, key;
    key=strArray[0];
    if (strArray.length > 5 && strArray[1] === 'offset' && strArray[3] === 'limit') {
        offset = Number(strArray[2]);
        limit = Number(strArray[4]);
    }else if(strArray.length > 5 && strArray[3] === 'offset' && strArray[1] === 'limit') {
        offset = Number(strArray[4]);
        limit = Number(strArray[2]);

    }else {
        key= expandStr;
    }
    return [key, offset, limit];
}

exports.isUrlHasExpand2 = function(queryConditions) {
    if(!queryConditions)
        return false;
    for(var item in queryConditions)
    {
        if(item ==  'expand')
            return true;
    }
    return false;
};

exports.isValidQueryParams2 = function(queryConditions, isValidQueryCondition, isExpandStrValid)
{
    var retData = {'is': true, 'error': '', 'flag':0, 'isExpand': false};

    var error = new Error();
    error.name = 'SyntaxError';
    error.status = 400;
    error.code = 3999;
    error.message = errorCodeTable.errorCode2Text( error.code );
    if(isValidQueryCondition && !isValidQueryCondition(queryConditions))
    {
        error.description = 'query params error! the query string is : ' + querystring.stringify(queryConditions);
        retData.is = false;
        retData.error = error;
        return retData;
    }

    if(!isExpandStrValid)
        return retData;

    var isExpand = this.isUrlHasExpand2(queryConditions);
    retData.isExpand = isExpand;
    if( isExpand && isExpandStrValid(queryConditions.expand) == false)
    {
        error.description = 'query params of expand is error! expand string is: ' + queryConditions.expand;
        retData.is = false;
        retData.error = error;
        return retData;
    }
    return retData;
};

exports.errReturnCommon=function(err ,res){
    if(!err.flag){
        logger.error(err);
        err = this.isDBError(err);
    }
    this.errorReturn(res, err.error.status, err.error);
}

exports.errReturnCallback=function(err, callback){
    if(!err.flag){
        logger.error(err);
        err = this.isDBError(err);
    }
    callback(err.error);
}

exports.saveCustomData = ( info, mandParams ) =>{
    if(info.customData){
        return info;
    }
    let customData = {};
    for(let key in info){
        if( _.findIndex(mandParams, function(o){ return o == key;}) == -1){
            customData[key] = info[key];
            delete info[key];
        }
    };
    info.customData = customData;
    return info;
};
exports.getCustomData = (info)=>{
    //列表
    if(info.items){
        let items = info.items;
        for(let i=0; i<items.length; i++){
            let customData = items[i].customData;
            for(let key in customData){
                items[i][key] = customData[key];
            }
            delete  items[i].customData;
        }
        return info;
    }
    //单条数据
    if(info.customData){
        let customData = info.customData;
        for(let key in customData){
            info[key] = customData[key];
        }
        delete info.customData;
        return info;
    }
    return info;
}