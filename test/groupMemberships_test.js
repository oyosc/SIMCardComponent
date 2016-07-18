/**
 * Created by Administrator on 2016/5/31.
 */
"use strict";
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var utils = require('../common/utils');
var config = require('../config/config');
var host = 'http://' + config.server_domain+':' +config.server_port;
var mUUID = '';
var dataInfo = {
    'group':{ 'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil'},
    'simCard':{ 'href': host+'/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'},
};
var mBaseURI=host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/groupMemberships';

describe('Create a groupMembership', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                mUUID = utils.getUUIDInHref(resData.href, 'groupMemberships/');
            });
        });
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
})

describe('get groupMembership', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI + '/' + mUUID;
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
        options.path = mBaseURI + '/gyRdkaIf9KVjbsjMdpqeAQ?expand=group';
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
        options.path = mBaseURI + '/gyRdkaIf9KVjbsjMdpqeAQ?expand=simCard';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
});

describe('delete groupMembership', function () {
    it('204 delete', function (done) {
        this.timeout(0);
        options.method = 'DELETE';
        options.path = mBaseURI + '/' + mUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(204);
            });
        });
        req.end();
    });
});

describe('list groupMembership', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.length>0){
                    for(var i; i<resData.length; i++){
                        console.log(resData);
                    }
                }
            });
        });
        req.end();
    });
    it('200 get 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI +'?expand=simCard;group';//
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for (var i=0; i<resData.items.length; ++i) {
                        console.log(resData.items);
                    }
                }
            });
        });
        req.end();
    });
});