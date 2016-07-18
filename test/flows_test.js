/**
 * Created by yansha on 2016/5/30.
 */
"use strict";
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var utils = require('../common/utils');
var mainUUID = '';
var dataInfo = {
    'type' : 1,
    'beginTime' : '2016-06-08 15:30:20',
    'endTime' : '2016-06-08 15:30:20',
    'total' : 250,
    'ddd':'ssss'
};
var mainBaseURI=uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg/flows';

describe('Create a flow', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                expect(uriReg.flowURIReg.test(res.headers['location'])).to.be.true;
                expect(uriReg.flowURIReg.test(resData.href)).to.be.true;
                expect(uriReg.simCardURIReg.test(resData.simCard.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.directory.href)).to.be.true;
                expect(uriReg.tenantURIReg.test(resData.tenant.href)).to.be.true;

                mainUUID = utils.getUUIDInHref(resData.href, 'flows/');
            });
        });
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
    it('400 created a simCard 9998', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(400);
                expect(resData.code).to.equal(9998);
            });
        });
        req.write(JSON.stringify({
            'type' : 1
        }));
        req.end();
    });
});

describe('Update a flow', function(){
    it('200 update', function(done){
        this.timeout(0);
        options.method = 'PUT';
        options.path = mainBaseURI  +'/'+ mainUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.flowURIReg.test(resData.href)).to.be.true;
                expect(uriReg.simCardURIReg.test(resData.simCard.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.directory.href)).to.be.true;
                expect(uriReg.tenantURIReg.test(resData.tenant.href)).to.be.true;

            });
        });
        dataInfo.ICCID = "qqq9047090024";
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
});

describe('get flow', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI +'/'+  mainUUID + '?expand=simCard';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                expect(res.statusCode).to.equal(200);
                console.log(resData);
                expect(uriReg.flowURIReg.test(resData.href)).to.be.true;
                expect(uriReg.simCardURIReg.test(resData.simCard.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.directory.href)).to.be.true;
                expect(uriReg.tenantURIReg.test(resData.tenant.href)).to.be.true;

            });
        });
        req.end();
    });

});

describe('list flow', function () {
    it('200 list 001 ', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);

                        expect(uriReg.flowURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardURIReg.test(resData.items[i].simCard.href)).to.be.true;
                        expect(uriReg.directoryURIReg.test(resData.items[i].directory.href)).to.be.true;
                        expect(uriReg.tenantURIReg.test(resData.items[i].tenant.href)).to.be.true;
                    }
                }

            });
        });
        req.end();
    });
    it('200 list 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + '?expand=simCard';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);
                        expect(uriReg.flowURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardURIReg.test(resData.items[i].simCard.href)).to.be.true;
                        expect(uriReg.directoryURIReg.test(resData.items[i].directory.href)).to.be.true;
                        expect(uriReg.tenantURIReg.test(resData.items[i].tenant.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
    it('200 list 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + '?count=month';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.flowURIReg.test(resData.href)).to.be.true;
            });
        });
        req.end();
    });
    /* it('200 list by organization', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ/simCards';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);
                        expect(uriReg.flowURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardURIReg.test(resData.items[i].simCard.href)).to.be.true;
                        expect(uriReg.directoryURIReg.test(resData.items[i].directory.href)).to.be.true;
                        expect(uriReg.tenantURIReg.test(resData.items[i].tenant.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
    it('200 list by group', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil/simCards';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);
                        expect(uriReg.flowURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardURIReg.test(resData.items[i].simCard.href)).to.be.true;
                        expect(uriReg.directoryURIReg.test(resData.items[i].directory.href)).to.be.true;
                        expect(uriReg.tenantURIReg.test(resData.items[i].tenant.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });*/
   /* it('200 list all flow', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/flows';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);
                        expect(uriReg.flowURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.simCardURIReg.test(resData.items[i].simCard.href)).to.be.true;
                        expect(uriReg.directoryURIReg.test(resData.items[i].directory.href)).to.be.true;
                        expect(uriReg.tenantURIReg.test(resData.items[i].tenant.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });*/
});

describe('delete flow', function () {
    it('204 delete', function (done) {
        this.timeout(0);
        options.method = 'DELETE';
        options.path = mainBaseURI +'/'+  mainUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(204);
            });
        });
        req.end();
    });
});

