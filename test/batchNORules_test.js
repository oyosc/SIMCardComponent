/**
 * Created by Administrator on 2016/6/1.
 */
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var utils = require('../common/utils');
var config = require('../config/config');
var host = 'http://' + config.server_domain+':' +config.server_port;

var batchNORuleUUID = '';
var dataInfo = {
    'rule' : "YYYYMMWWDD000",
    'complementCode': "0",
};
var mainBaseURI= host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/';
describe('Create a batchNORules', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                // tenantInfo.key=resData.key;
                batchNORuleUUID = utils.getUUIDInHref(resData.href, 'batchNORules/');
            });
        });
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
})

describe('get batchNORule', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + batchNORuleUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
            });
        });
            req.end();
        });
    it('200 get 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI +  'aaruleqrNgrzcIGYs1PfP4F?expand=batchNumbers(offset:0,limit:10)';
        var headers = {'Content-Type': 'application/json;charset=UTF-8'};
        options.headers = headers;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
    it('200 get 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI +  'aaruleqrNgrzcIGYs1PfP4F?expand=tenant';
        var headers = {'Content-Type': 'application/json;charset=UTF-8'};
        options.headers = headers;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
})

describe('delete batchNORule', function () {
        it('204 delete', function (done) {
            this.timeout(0);
            options.method = 'DELETE';
            options.path = mainBaseURI + batchNORuleUUID;
            var req = http.request(options, function (res) {
                clientCallback('', res, done, function (resData) {
                    console.log(resData);
                    expect(res.statusCode).to.equal(204);
                });
            });
            req.end();
        });
    })

describe('list batchNORules', function () {
    it('200 list 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
    it('200 list 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI  +  '?expand=tenant';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
    it('200 list 004', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI  +  '?expand=batchNumbers(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
})