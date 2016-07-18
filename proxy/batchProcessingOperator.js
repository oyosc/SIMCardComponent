/**
 * Copyright(C),
 * FileName:  batchProcessings.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/27  10:52
 * Description:
 */
var url = require('url');
var eventProxy = require('eventproxy');
var errorCodeTable = require('../common/errorCodeTable');

var http = require('http');
var config = require('../config/config');
//var querystring = require('querystring');

function batchProcessingOperator(){
    this.m_operatorMap = {}
}

batchProcessingOperator.prototype.addOperator = function(active, url, operator){
    var reg = /\//;
    var strArray = url.split(reg);
    var tmpUrl = '';
    strArray.forEach(function(element){
        if(!element){
        }else if(element.indexOf(':') == -1){
            tmpUrl += '/' +element;
        }else {
            tmpUrl += '/.[^/]*';
        }
    });

    var reg = new RegExp(tmpUrl + '$');
    var tmpJson = {
        reg: reg,
        operator: operator
    };
    if(!this.m_operatorMap.hasOwnProperty(active)){
        this.m_operatorMap[active] = new Array();
    }

    this.m_operatorMap[active].push(tmpJson);
};

batchProcessingOperator.prototype.callOperator = function(active, href, params, callback){
    if(!this.m_operatorMap.hasOwnProperty(active)){
        var error = new Error();
        error.name = 'InternalError';
        error.status = 403;
        error.code = 1054;
        error.message = errorCodeTable.errorCode2Text( error.code );
        error.description = 'the batch processing could\'t find the active(' + active +　')to bash resources.';
        callback(error);
        return;
    }

    var obj = url.parse(href);
    var operatorArray = this.m_operatorMap[active];
    //operatorArray.forEach(function(element){
    //    if(element.reg.test(obj.path))
    //    {
    //        //console.log("匹配成功");
    //        element.operator(active, href, params, callback);
    //    }
    //});

    for(var i = 0 ; i < operatorArray.length; ++i){
        var element = operatorArray[i];
        if(element.reg.test(obj.pathname)) {
            //console.log("匹配成功");uuid?ss=ss
            element.operator(active, href, obj.pathname, params, callback);
            break;
        }
    }
};

//var test = new batchProcessingOperator();
//test.addOperator("post", "/api/:version/directories", function(){console.log("a");});
//test.addOperator("post", "/api/:version/directories/:directoryUUID/accounts", function(){console.log("bbbb");});
//test.addOperator("post", "/api/:version/directories/:directoryUUID/accounts/:accountUUID", function(){console.log("cccc11");});
//test.addOperator("post", "/api/:id/tenants/:id/warehouse/:id/merchandises", function(){console.log("1");});
//test.addOperator("get", "/api/:id/tenants/:id/warehouse/:id/merchandises", function(){console.log("2");});
//test.addOperator("get", "/api/:id/tenants/:id/warehouse/:id/merchandises/:id", function(){console.log("3");});
//test.addOperator("put", "/api/:id/tenants/:id/warehouse/:id/merchandises/:id", function(){console.log("4");});
//test.addOperator("post", "/api/:id/tenants/:id/warehouse/:id/serviceBundles", function(){console.log("5");});
//
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/warehouse/8sqbDJ3i3lRktrEYpXXUNA/merchandises", {}, function(){console.log("aaaa");});
//test.callOperator("put", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/warehouse/8sqbDJ3i3lRktrEYpXXUNA/merchandises/SDTxlFYP9JC4Zcbat9YdVg", {}, function(){console.log("aaaa");});
//test.callOperator("get", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/warehouse/8sqbDJ3i3lRktrEYpXXUNA/merchandises/SDTxlFYP9JC4Zcbat9YdVg", {}, function(){console.log("aaaa");});
//test.callOperator("get", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/warehouse/8sqbDJ3i3lRktrEYpXXUNA/merchandises",
//    {}, function(){console.log("aaaa");});
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/warehouse/8sqbDJ3i3lRktrEYpXXUNA/serviceBundles",
//    {}, function(){console.log("aaaa");});

//test.addOperator("post", "/api/:id/tenants/:id/dictDirectories/:id", function(){console.log("11");});
//test.addOperator("post", "/api/:id/tenants/:id/dictDirectories/:id/dictionaries", function(){console.log("22");});
//test.addOperator("post", "/api/:id/tenants/:id/dictDirectories/:id/dictionaries/:id", function(){console.log("33");});
//test.addOperator("post", "/api/:id/tenants/:id/warehouse/:id/merchandises/:id", function(){console.log("44");});
//test.addOperator("post", "/api/:id/tenants/:id/warehouse/:id/serviceBundles", function(){console.log("55");});
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/dictDirectories/JusDfJ36DlRktrSFpsiuNA",
//    {}, function(){console.log("aaaa");});
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/dictDirectories/JusDfJ36DlRktrSFpsiuNA/dictionaries",
//    {}, function(){console.log("aaaa");});
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/dictDirectories/JusDfJ36DlRktrSFpsiuNA/dictionaries/HSqbDJ3cOlsdktrUYpX2s1S",
//    {}, function(){console.log("aaaa");});
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/warehouse/57YZCqrNgrzcIGYs1PfP4F/purchasingMethods",
//    {}, function(){console.log("aaaa");});
//test.callOperator("post", "http://localhost:3012/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/groupMemberships",
//    {}, function(){console.log("aaaa");});
//test.addOperator("get", "/api/:version/directories/:directoryUUID/accounts/:accountUUID", function(){console.log("b");});
//test.callOperator("post", "http://192.168.6.16:3002/api/v1/accounts", {
//    'account' : '100256',
//    'mobile' : '13760471842',
//    'name' : 'XT',
//    'password' : 'uGhd%a8Kl!',
//    'role':{'href':  'http://192.168.6.16:3002/api/v1/merchants/b8ppf60ZrKkskj3DX2PpZw/roles/2211f60ZrKkskj3DX2PpZw'},
//    'department' :{'href' :  'http://192.168.6.16:3002/api/v1/merchants/b8ppf60ZrKkskj3DX2PpZw/departments/0011f60ZrKkskj3DX2PpZw'},
//    'flag':0,
//    'merchant': {'href' : 'http://192.168.6.16:3002/api/v1/merchants/b8ppf60ZrKkskj3DX2PpZw'},
//    'operator': '小白',
//    'crateAt': "2016-5-5 13:56",
//    'activate' : 0
//}, function(err, result){
//});

batchProcessingOperator.prototype.bash = function(items, callback){
    var tmpThis = this;
    var ep = new eventProxy();
    ep.on('ret_data', function(){
        callback(null, items);
    });
    var count = 0;
    for (var i = 0; i < items.length; ++i) {
        (function(i) {
            tmpThis.callOperator(items[i].action, items[i].href, items[i].body, function(err, retInfo){
                if(err) {
                    items[i].error = err;
                }else{
                    items[i].body = retInfo;
                }
                if (++count == items.length){
                    ep.emit('ret_data');
                }

            }, i);
        }(i));
    }
};

function generateOption(){
    return {
        host: config.server_domain,
        port: config.server_port,
        path: '/v1/',
        method: 'POST',
        auth : 'mGldhwkSw8MtDFLhbk1i4Q',
        rejectUnauthorized : false,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }
}

//使用http实现
batchProcessingOperator.prototype.callOperator1 = function(active, href, body, callback){
    var ep = new eventProxy();
    ep.on('return', function(data){
        ep.removeAllListeners('return');
        callback(null, data);
    });

    ep.on('error', function(error){
        ep.removeAllListeners('error');
        callback(error);
    });

    var obj = url.parse(href);
    var option = generateOption();
    option.path = obj.path;
    option.method = active;

    var req = http.request(option, function(res) {
        //res.setEncoding('binary');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk.toString('utf8')
        });
        res.on('end', function(){
            var resJson = {};
            try{
                resJson = JSON.parse(data);
                if(res.statusCode != 201 && res.statusCode != 200 && res.statusCode != 204){
                    ep.emit('error', resJson);
                }else{
                    ep.emit('return', resJson);
                }
            }catch (err){
                console.log(err);
                ep.emit('error', err);
            }
        });
    });
    if(body){
        req.write(JSON.stringify(body));
        req.end();
    }

    req.setTimeout(1 * 60 * 1000, function(){
        var message = 'request timeout.';
        console.log(message);
        var error = new Error(message);
        ep.emit('error', error);
    });
    req.on('error', function(e) {
        console.log('request error.');
        console.log(e);
        ep.emit('error', e);
    });
};

batchProcessingOperator.prototype.bash1 = function(items, callback){
    var tmpThis = this;
    var ep = new eventProxy();
    ep.on('ret_data', function(){
        callback(null, items);
    });

    var count = 0;
    for (var i = 0; i < items.length; ++i) {
        (function(i) {
            tmpThis.callOperator1(items[i].action, items[i].href, items[i].body, function(err, retInfo){
                if(err) {
                    items[i].error = err;
                }else{
                    items[i].body = retInfo;
                }
                if (++count == items.length){
                    ep.emit('ret_data');
                }
            }, i);
        }(i));
    }
};

var batch = new batchProcessingOperator();

module.exports = batch;