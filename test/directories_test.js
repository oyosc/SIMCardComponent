/**
 * Created by ljw on 2016/4/18.
 */
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var utils = require('../common/utils');
var config = require('../config/config');
var host = 'http://' + config.server_domain+':' +config.server_port;

var directoryUUID = '';
var dataInfo = {
    'name' : "名称",
    'status': "ENABLED",
    'description': "描述",
    //'snRule': {
    //    'href': host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/snRules/57YZCqrNgrzcIGYs1PfP4F'
    //},
        'custest' : 'test directories'
};
var mainBaseURI= host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/directories/';
describe('Create a directories', function () {
    it('201 created', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mainBaseURI;
        var req = http.request(options,  function(res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(201);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
                expect(uriReg.directoryURIReg.test(res.headers['location'])).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.href)).to.be.true;
                expect(uriReg.organizationByDirectoryURIReg.test(resData.organizations.href)).to.be.true;
                expect(uriReg.simCardByDirectoryURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.organizationMembershipByDirectoryURIReg.test(resData.organizationMemberships.href)).to.be.true;
                for(var key in dataInfo) {

                    expect(dataInfo[key]).to.equal(resData[key]);
                }
                directoryUUID = utils.getUUIDInHref(resData.href, 'directories/');
            });
        });
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
    it('400 created a directories 1032', function (done) {
        this.timeout(0);
        options.method = 'POST';
        options.path = mainBaseURI;
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
        options.path = mainBaseURI;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(409);
            });
        });
        req.write(JSON.stringify({
            'name' : '名称',
            'description' : '名称chongfgu',
            'status' : 'ENABLED',

                'test' : 'test directoriess'
        }));
        req.end();
    });
});


describe('Update a directory',function(){
    it('200 update', function(done){
        this.timeout(0);
        options.method = 'PUT';
        options.path = mainBaseURI  + directoryUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.directoryURIReg.test(resData.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.href)).to.be.true;
                expect(uriReg.organizationByDirectoryURIReg.test(resData.organizations.href)).to.be.true;
                expect(uriReg.simCardByDirectoryURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.organizationMembershipByDirectoryURIReg.test(resData.organizationMemberships.href)).to.be.true;

                for(var key in dataInfo) {
                    if ( key=='snRule') {
                        continue;
                    }
                    expect(dataInfo[key]).to.equal(resData[key]);
                }
            });
        });

        dataInfo.name = "测试directory";
        req.write(JSON.stringify(dataInfo));
        req.end();
    });
});
describe('get directory', function () {
    it('200 get 001', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + directoryUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(200);
                expect(uriReg.directoryURIReg.test(resData.href)).to.be.true;
                expect(uriReg.directoryURIReg.test(resData.href)).to.be.true;
                expect(uriReg.organizationByDirectoryURIReg.test(resData.organizations.href)).to.be.true;
                expect(uriReg.simCardByDirectoryURIReg.test(resData.simCards.href)).to.be.true;
                expect(uriReg.organizationMembershipByDirectoryURIReg.test(resData.organizationMemberships.href)).to.be.true;
                for(var key in dataInfo) {
                    if (key=='snRule') {
                        continue;
                    }

                        expect(dataInfo[key]).to.equal(resData[key]);
                }
            });
        });
        req.end();
    });
    it('200 get 002', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI; //encodeURI(mainBaseURI + '?dictionary='+host+'/api/v1/tenants/wyxZ4QJFXW4e5aePdql00w/dictdirectory/JusDfJ36DlRktrSFpsiuNA/dictionaries/HSqbDJ3cOlsdktrUYpX2s1S&name=新奥德赛*');
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);
                        expect(uriReg.directoryURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.organizationByDirectoryURIReg.test(resData.items[i].organizations.href)).to.be.true;
                        expect(uriReg.simCardByDirectoryURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByDirectoryURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                    }
                }

            });
        });
        req.end();
    });

    it('200 get 003', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = mainBaseURI + '?expand=simCards(offset:0,limit:10);organizations(offset:0,limit:10)';
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                // console.log(resData);
                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for(var i=0;i<resData.items.length;i++){
                        console.log(resData);
                        expect(uriReg.directoryURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.organizationByDirectoryURIReg.test(resData.items[i].organizations.href)).to.be.true;
                        expect(uriReg.simCardByDirectoryURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByDirectoryURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                    }
                }

            });
        });
        req.end();
    });
    it('200 list directories by organization', function (done) {
        this.timeout(0);
        options.method = 'GET';
        options.path = host+'/api/v1.0.0/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ/directories' ;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {

                expect(res.statusCode).to.equal(200);
                if(resData.items.length>0){
                    for (var i=0; i<resData.items.length; ++i) {
                        console.log(resData);
                        expect(uriReg.directoryURIReg.test(resData.items[i].href)).to.be.true;
                        expect(uriReg.organizationByDirectoryURIReg.test(resData.items[i].organizations.href)).to.be.true;
                        expect(uriReg.simCardByDirectoryURIReg.test(resData.items[i].simCards.href)).to.be.true;
                        expect(uriReg.organizationMembershipByDirectoryURIReg.test(resData.items[i].organizationMemberships.href)).to.be.true;
                    }
                }
            });
        });
        req.end();
    });
});
describe('delete directory', function () {
    it('204 delete', function (done) {
        this.timeout(0);
        options.method = 'DELETE';
        options.path = mainBaseURI + directoryUUID;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                expect(res.statusCode).to.equal(204);
            });
        });
        req.end();
    });
});
