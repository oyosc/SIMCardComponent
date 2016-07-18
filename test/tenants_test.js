/**
 * Created by ljw on 2016/5/31.
 */
'use strict';
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var utils = require('../common/utils');
var config = require('../config/config');
var host = 'http://' + config.server_domain+':' +config.server_port;
var tenantInfo = {
    'name' : '测试租赁用户s',
    'description' : '测试',
    'status' : 'ENABLED',
        'test' : 'test tenant'
};
var m_baseURI= host+'/api/v1.0.0/tenants';
let tenantUUID = '';

describe('Create a tenant',  function (){
    it('201 created', function (done){
        this.timeout(0);
        options.method = 'POST';
        options.path = m_baseURI;
        var req = http.request(options, (res) => {
            clientCallback('', res, done, (resData) => {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                expect(uriReg.tenantURIReg.test(res.headers['location'])).to.be.true;
                expect(uriReg.tenantURIReg.test(resData.href)).to.be.true;
                expect(uriReg.groupURIReg.test(resData.groups.href)).to.be.true;
                expect(uriReg.organizationURIReg.test(resData.organizations.href)).to.be.true;
                expect(uriReg.simCardByTenantURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.batchNORuleURIReg.test(resData.batchNORules.href)).to.be.true;
                expect(uriReg.batchNumberByTenantURIReg.test(resData.batchNumbers.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.directories.href)).to.be.true;
                for(var key in tenantInfo) {

                    expect(tenantInfo[key]).to.equal(resData[key]);
                }
                tenantUUID = utils.getUUIDInHref(resData.href, 'tenants/');
                // tenantInfo.key=resData.key;
            });
        });
        req.write(JSON.stringify(tenantInfo));
        req.end();
    });
});

describe('Update a tenant',function (){
    it('200 update', function(done){
        this.timeout(0);
        options.method = 'PUT';
        options.path = m_baseURI +'/'+ tenantUUID;
        var req = http.request(options,  (res) => {
            clientCallback('', res, done, (resData) => {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                expect(uriReg.tenantURIReg.test(resData.href)).to.be.true;
                expect(uriReg.groupURIReg.test(resData.groups.href)).to.be.true;
                expect(uriReg.organizationURIReg.test(resData.organizations.href)).to.be.true;
                expect(uriReg.simCardByTenantURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.batchNORuleURIReg.test(resData.batchNORules.href)).to.be.true;
                expect(uriReg.batchNumberByTenantURIReg.test(resData.batchNumbers.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.directories.href)).to.be.true;
                for(var key in tenantInfo) {

                    expect(tenantInfo[key]).to.equal(resData[key]);
                }
            });
        });

        tenantInfo.name = "testssssss";
        req.write(JSON.stringify(tenantInfo));
        req.end();
    });
});

describe('get tenant', function(){
    it('200 get 001', function(done){
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI+'/' + tenantUUID;
        var req = http.request(options, (res) => {
            clientCallback('', res, done, (resData) => {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.tenantURIReg.test(resData.href)).to.be.true;
                expect(uriReg.groupURIReg.test(resData.groups.href)).to.be.true;
                expect(uriReg.organizationURIReg.test(resData.organizations.href)).to.be.true;
                expect(uriReg.simCardByTenantURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.batchNORuleURIReg.test(resData.batchNORules.href)).to.be.true;
                expect(uriReg.batchNumberByTenantURIReg.test(resData.batchNumbers.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.directories.href)).to.be.true;
                for(var key in tenantInfo) {
                        expect(tenantInfo[key]).to.equal(resData[key]);
                }
            });
        });
        req.end();
    });
});

describe('list tenant', function () {
    it('200 list 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = m_baseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
            });
        });
        req.end();
    });
})

describe('delete tenants', function () {
    it('204 delete', function (done) {
        options.method = 'DELETE';
        options.path = m_baseURI + '/' + tenantUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                expect(res.statusCode).to.equal(204);
            });
        });
        req.end();
    });
});
