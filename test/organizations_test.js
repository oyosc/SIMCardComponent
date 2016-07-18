/**
 * Copyright(C),
 * FileName:  organizations_test.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/31  17:28
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
var mUUID = '';
var dataInfo = {
    'name' : '测试组织1',
    'description' : '测试',
    'status' : 'ENABLED',
        'test' : 'test organizations'
};
var mBaseURI=uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/organizations';

describe('Create a organization', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                expect(uriReg.organizationURIReg.test(res.headers['location'])).to.be.true;
                expect(uriReg.organizationURIReg.test(resData.href)).to.be.true;
                expect(uriReg.simCardByOrganizationURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.groupByOrganizationURIReg.test(resData.groups.href)).to.be.true;
                expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.organizationMemberships.href)).to.be.true;
                expect(uriReg.directoryByOrganizationURIReg.test(resData.directories.href)).to.be.true;
                mUUID = utils.getUUIDInHref(resData.href, 'organizations/');
            });
        });
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
    it('400 created a organization 1032', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                expect(res.statusCode).to.equal(400);
                expect(resData.code).to.equal(1032);
            });
        });
        req.write(JSON.stringify({
            "name": "测试组织BB"
        }));
        req.end();
    });
    it('409 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(409);
            });
        });
        req.write(JSON.stringify({
            'name' : '测试组织1',
            'description' : '测试',
            'status' : 'ENABLED',
                'test' : 'test organizations'
        }));
        req.end();
    });
})

describe('Update a organization',function(){
    it('200 update', function(done){
        this.timeout(0);
        options.method = 'PUT';
        options.path = mBaseURI + '/' + mUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                //console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.organizationURIReg.test(resData.href)).to.be.true;
                expect(uriReg.simCardByOrganizationURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.organizationMemberships.href)).to.be.true;
                expect(uriReg.directoryByOrganizationURIReg.test(resData.directories.href)).to.be.true;
                for(var key in dataInfo) {

                    expect(dataInfo[key]).to.equal(resData[key]);
                }
            });
        });
        dataInfo.name = "test organizations";
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
});

describe('get organization', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI + '/' + mUUID ;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                expect(res.statusCode).to.equal(200);
                expect(uriReg.organizationURIReg.test(resData.href)).to.be.true;
                expect(uriReg.simCardByOrganizationURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.organizationMemberships.href)).to.be.true;
                expect(uriReg.directoryByOrganizationURIReg.test(resData.directories.href)).to.be.true;
                for(var key in dataInfo) {

                        expect(dataInfo[key]).to.equal(resData[key]);
                }
            });
        });
        req.end();
    });
    it('200 get 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI ;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for (var i=0; i<resData.items.length; ++i) {
                        console.log(resData);
                        expect(uriReg.organizationURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardByOrganizationURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                        expect(uriReg.directoryByOrganizationURIReg.test(resData.items[i].directories.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
    it('200 get 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mBaseURI + '?expand=directories(offset:0,limit:10);groups(offset:0,limit:10);organizationMemberships(offset:0,limit:10);simCards(offset:0,limit:10)';//
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                //console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0; i<resData.items.length; i++){
                        console.log(resData.items[i]);
                        expect(uriReg.organizationURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardByOrganizationURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                        expect(uriReg.directoryByOrganizationURIReg.test(resData.items[i].directories.href)).to.be.true;
                        expect(uriReg.groupByOrganizationURIReg.test(resData.items[i].groups.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
    it('200 list organizations by directory', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/directories/0C86rtnHnm656sRKx7XRDg/organizations' ;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for (var i=0; i<resData.items.length; ++i) {
                        console.log(resData);
                        expect(uriReg.organizationURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardByOrganizationURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                        expect(uriReg.directoryByOrganizationURIReg.test(resData.items[i].directories.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
    it('200 list organizations by group', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = uriReg.host +'/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil/organizations' ;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for (var i=0; i<resData.items.length; ++i) {
                        console.log(resData);
                        expect(uriReg.organizationURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardByOrganizationURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                        expect(uriReg.directoryByOrganizationURIReg.test(resData.items[i].directories.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
    it('200 list organizations by simCard', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = uriReg.host +'/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg/organizations' ;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for (var i=0; i<resData.items.length; ++i) {
                        console.log(resData);
                        expect(uriReg.organizationURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardByOrganizationURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByOrganizationURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                        expect(uriReg.directoryByOrganizationURIReg.test(resData.items[i].directories.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
});

describe('delete organization', function () {
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

