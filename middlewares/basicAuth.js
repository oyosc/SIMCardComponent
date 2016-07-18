/**
 * Created by Administrator on 15-4-22.
 */
//var basicAuth = require('basic-auth-connect');
var tenants = require('../proxy/tenants');
var http = require('http');
var common = require('../controllers/common');
var errorCodeTable = require('../common/errorCodeTable');
/*
 function authApikey(apikey_id, apikey_secret, callback) {
 //console.log('apikey_id: ' + apikey_id + '  apikey_secret: ' + apikey_secret);
 tenants.authenticateTenantApiKey(apikey_id, apikey_secret, function (err, tenant) {
 if (err) {
 callback(err);
 return;
 }

 callback(null, tenant);
 });
 }*/

function parseKey(req){
    var ret = {'apikeyID': '', 'apikeySecret': '', 'error':null, 'flag': 9};
    var authorization = req.headers.authorization;
    var error = new Error();
    if(!authorization){
        error.name = 'Error';
        error.status = 400;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Authentication credentials are required to access the resource.';
        ret.error = error;
        return ret;
    }

    var parts = authorization.split(' ');
    if (parts.length !== 2){
        error.name = 'Error';
        error.status = 400;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Authentication credentials are required to access the resource.';
        ret.error = error;
        return ret;
    }

    var scheme = parts[0];
    var key=new Buffer(parts[1], 'base64').toString().split(':');
    var keyID = key[0];
    var keySecret = key[1];
    if (!keyID || !keySecret || 'Basic' != scheme){
        error.name = 'Error';
        error.status = 400;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Authentication credentials are required to access the resource.';
        ret.error = error;
        return ret;
    }
    ret.apikeyID = keyID;
    ret.apikeySecret = keySecret;
    return ret;
}

exports.basicAuth = function(req, res, next) {
    var keyInfo = parseKey(req);
    if(keyInfo.error) {
        common.errorReturn(res, keyInfo.error.status, keyInfo.error);
        return;
    }
    new Promise(function(){
        tenants.authenticateTenantApiKey(keyInfo.apikeyID, keyInfo.apikeySecret).then(function(tenant){
            req.tenant = tenant;
            req.user = tenant.uuid;
            next();
        }).catch(function(err){
            if(!err.flag){
                err = common.DBError(err);
            }
            common.errorReturn(res, err.status, err);
            return;
        });
    })
    /*authApikey(keyInfo.apikeyID, keyInfo.apikey_secret, function (err, tenant) {
     if (err || !tenant){
     common.errorReturn(res, err.status, err);
     return;
     }

     req.tenant = tenant;
     req.user = tenant.uuid;
     next();
     });*/
};

exports.authTenant = function(req, res, next) {
    var keyInfo = parseKey(req);
    if(keyInfo.error){
        common.errorReturn(res, keyInfo.error.status, keyInfo.error);
        return;
    }
    if(keyInfo.apikeyID == 'mGldhwkSw8MtDFLhbk1i4Q' && keyInfo.apikeySecret == 'mGldhwkSw8MtDFLhbk1i4Q'){ //超级管理员

        next();
        return;
    }

    var tenantUUID = req.params.tenantUUID;
    if(tenantUUID == 'current'){
        next();
        return;
    }

    var error = new Error();
    if(!tenantUUID){
        error.name = 'Error';
        error.status = 400;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Failed to auth tenant!';
        common.errorReturn(res, 400, error);
        return;
    }

    //Tenant 检查访问权限
    if(tenantUUID != req.tenant.uuid ) {
        error.name = 'Error';
        error.status = 403;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'The supplied authentication credentials are not sufficient to access the resource.';
        common.errorReturn(res, error.status, error);
    }else{
        next();
    }
};

exports.authSuperMan = function(req, res, next){
    var keyInfo = parseKey(req);
    if(keyInfo.error){
        common.errorReturn(res, keyInfo.error.status, keyInfo.error);
        return;
    }
    if(keyInfo.apikeyID != 'mGldhwkSw8MtDFLhbk1i4Q' || keyInfo.apikeySecret != 'mGldhwkSw8MtDFLhbk1i4Q'){
        var error = new Error();
        error.name = 'Error';
        error.status = 401;
        error.code = 1053;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'Authentication credentials are required to access the resource.';
        common.errorReturn(res, error.status, error);
        return;
    }
    next();
};

function unauthorized(res) {
    var error = {
        'status': 400,
        'message': 'Authentication credentials are required to access the resource.'
    };
    res.statusCode = error.status;
    res.writeHead(error.status, {'Content-Type': 'application/json;charset=utf-8'});
    //res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
    res.write(JSON.stringify(error));
    res.end();
}

function error(code, msg) {
    var err = new Error(msg || http.STATUS_CODES[code]);
    err.status = code;
    return err;
}

