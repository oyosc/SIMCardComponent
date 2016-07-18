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
var mainBaseURI= host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F/batchNumbers';
var batchNumberUUID = '';
describe('Create a batchNumber', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                // tenantInfo.key=resData.key;
                batchNumberUUID = utils.getUUIDInHref(resData.href, 'batchNumbers/');
            });
        });
        req.end();
    });
})

describe('get batchNumber', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + '/' + batchNumberUUID;
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
    it('200 get 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + '/BatchA4RC6u55K6UbcSskg?expand=batchNORule';
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
        options.path = mainBaseURI + '/BatchA4RC6u55K6UbcSskg?expand=tenant';
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

//describe('delete batchNumber', function () {
//    it('204 delete', function (done) {
//        options.method = 'DELETE';
//        options.path =mainBaseURI + '/' + batchNumberUUID;
//        var req = http.request(options, function (res) {
//            clientCallback('', res, done, function (resData) {
//                expect(res.statusCode).to.equal(204);
//            });
//        });
//        req.end();
//    });
//});


describe('list batchNumber', function () {
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
        options.path = mainBaseURI+'?expand=tenant';
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
        options.path = mainBaseURI+'?expand=batchNORule';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
});
