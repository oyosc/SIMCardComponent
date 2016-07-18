/**
 * Copyright(C),
 * FileName:  organizationMemberships_test.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/3/29  13:53
 * Description:
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
    'store':{ 'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S'},
    'organization':{ 'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ'},
};
var mBaseURI=host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/organizationMemberships';

describe('Create a organizationMembership', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                expect(uriReg.organizationMembershipURIReg.test(res.headers['location'])).to.be.true;
                expect(uriReg.organizationMembershipURIReg.test(resData.href)).to.be.true;
                //expect(uriReg.directoryURIReg.test(resData.directory.href)).to.be.true;
                expect(uriReg.organizationURIReg.test(resData.organization.href)).to.be.true;

                mUUID = utils.getUUIDInHref(resData.href, 'organizationMemberships/');
            });
        });
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
    it('400 created a organizationMembership 9998', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(400);
                expect(resData.code).to.equal(9998);
            });
        });
        req.write(JSON.stringify({
            'organization':{ 'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ'}
        }));
        req.end();
    });
    it('409 created a organizationMembership ', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                //console.log(resData);
                expect(res.statusCode).to.equal(409);
            });
        });
        req.write(JSON.stringify({
            'store':{ 'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S'},
            'organization':{ 'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ'},
        }));
        req.end();
    });
});

describe('get organizationMembership', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI + '/' + mUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                expect(res.statusCode).to.equal(200);
                expect(uriReg.organizationMembershipURIReg.test(resData.href)).to.be.true;
                expect(uriReg.organizationURIReg.test(resData.organization.href)).to.be.true;
                expect(uriReg.tenantURIReg.test(resData.tenant.href)).to.be.true;

            });
        });
        req.end();
    });
    it('200 get 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI;
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
        options.path = mBaseURI+'?expand=organization;directory';//;group
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });

    it('200 get by organization', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path =host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ/organizationMemberships';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
    it('200 get by group', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path =host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil/organizationMemberships';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
    it('200 get by directory', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path =host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/directories/0C86rtnHnm656sRKx7XRDg/organizationMemberships';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
            });
        });
        req.end();
    });
});

describe('delete organizationMembership', function () {
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
