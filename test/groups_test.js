/**
 * Created by Administrator on 2016/5/31.
 */
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var utils = require('../common/utils');
var config = require('../config/config');
var host = 'http://' + config.server_domain+':' +config.server_port;

var tenantUUID = 'wyxZ4QJFXW4e5aePdql00w';
var groupUUID = '';
var groupInfo = {
    'name' : '测试商品组123',
    'description' : '测试',
    'status' : 'ENABLED',
        'test' : 'test groups'
};
var m_baseURI= host+'/api/v1.0.0/tenants/' + tenantUUID + '/groups/';

var judgeResult = function() {
     this.judge = true;
     this.message = [];
}

describe('Create a groups', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = m_baseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                    console.log(resData);
            });
        });
        req.write(JSON.stringify(groupInfo));
        req.end();
    });
});

describe('Update a group',function(){
    it('200 update', function(done){
        this.timeout(0);
        options.method = 'PUT';
        options.path = m_baseURI  + 'avc8415asfwjd100skjuil';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                    console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });

        groupInfo.name = "测试group";
        req.write(JSON.stringify(groupInfo));
        req.end();
    });
});

describe('get group', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + 'avc8415asfwjd100skjuil';
        var headers = {'Content-Type': 'application/json;charset=UTF-8'};
        options.headers = headers;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                    console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.groupURIReg.test(resData.href)).to.be.true;
            });
        });
        req.end();
    });
    it('200 get 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + 'avc8415asfwjd100skjuil?expand=organizations(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
            });
        });
        req.end();
    });
    it('200 get 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + 'avc8415asfwjd100skjuil?expand=simCards(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
            });
        });
        req.end();
    });
    it('200 get 004', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + 'avc8415asfwjd100skjuil?expand=groupMemberships(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
            });
        });
        req.end();
    });
})

describe('list group', function () {
    it('200 list 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
    it('200 list 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + '?expand=organizations(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                if (resData.items.length > 0) {
                    for (var i = 0; i < resData.items.length; i++) {
                        expect(uriReg.groupURIReg.test(resData.items[i].href)).to.be.true;
                    }
                }

            });
        });
        req.end();
    });
    it('200 list 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + '?expand=simCards(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                if (resData.items.length > 0) {
                    for (var i = 0; i < resData.items.length; i++) {
                        expect(uriReg.groupURIReg.test(resData.items[i].href)).to.be.true;
                    }
                }

            });
        });
        req.end();
    });
    it('200 list 004', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI + '?expand=groupMemberships(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                if (resData.items.length > 0) {
                    for (var i = 0; i < resData.items.length; i++) {
                        expect(uriReg.groupURIReg.test(resData.items[i].href)).to.be.true;
                    }
                }

            });
        });
        req.end();
    });
});

describe('delete groups', function () {
    it('204 delete', function (done) {
        this.timeout(0);
        options.method = 'DELETE';
        options.path = m_baseURI + 'avc8415asfwjd100skjuil';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(204);
            });
        });
        req.end();
    });
});