/**
 * Copyright(C),
 * FileName:  bashProcessing_test.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/6/12  17:20
 * Description:
 */
var http = require('./common');
var expect = require('chai').expect;
var uriReg = require('./../common/URIReg');
var options = http.options;
var clientCallback = http.clientCallback;
var moment = require('moment');


function generateGroupInfo(){
    return {
        'name' : '测试商品组123',
        'description' : '测试',
        'status' : 'ENABLED',
        'customData' : {
            'test' : 'test groups'
        }
    }
}

function generateBatchNORuleInfo(){
    return {
        'rule' : "YYYYMMWWDD000",
        'complementCode': "0",
    }
}

function generateBatchNumberInfo(){
    return {
        'batchNumber' : '05201633',
        'batchNORuleUUID': 'aaruleqrNgrzcIGYs1PfP4F',
    }
}

function generateDirectoryInfo(){
    return {
        'name' : "名称",
        'status': "ENABLED",
        'description': "描述",
        'customData':{
            'test' : 'test directories'
        }
    }
}

function generateDirectoryInfo(){
    return {
        'name' : "名称",
        'status': "ENABLED",
        'description': "描述",
        'customData':{
            'test' : 'test directories'
        }
    }
}

function generateFlowInfo(){
    return {
        'type' : 1,
        'beginTime' : '2016-06-08 15:30:20',
        'endTime' : '2016-06-08 15:30:20',
        'total' : 250,
        'customData' : {}
    }
}

function generateGroupMembershipInfo(){
    return {
        'group':{ 'href': uriReg.host +'/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil'},
        'simCard':{ 'href': uriReg.host +'/tenants/wyxZ4QJFXW4e5aePdql00w/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'},
    }
}

function generateOrganizationMembershipInfo(){
    return {
        'store':{ 'href': uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S'},
        'organization':{ 'href': uriReg.host+'/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/Nud3iezUJSfjATUndDxtPQ'},
    }
}

function generateOrganizationInfo(){
    return {
        'name' : '测试组织1',
        'description' : '测试',
        'status' : 'ENABLED',
        'customData' : {
            'test' : 'test organizations'
        }
    }
}

function generateTenantInfo(){
    return {
        'name' : '测试租赁用户s',
        'description' : '测试',
        'status' : 'ENABLED',
        'customData' : {
            'test' : 'test tenant'
        }
    }
}

function generateSIMCardInfo(){
    return {
        'ICCID' : 'W9047090024',
        'IMSI' : '18666291303',
        'phone':'18565800822',
        'openCardData':'',
        'packageType':'1',
        'batchNO' : '2015091007',
        'carrier':'/tenants/wyxZ4QJFXW4e5aePdql00w/carriers/carriYzwSRzjiIfLs1Jfo9',
        'package':'',
        'status':'enable',
        'businessStatus' : '待投产',
        'activeData' : '',
        'useData' : '',
        'sn' : 'CCCcccYYYYMMDDFFF',
        'shareFlow' : 'false',
        'testPeriodTo' : '',
        'silentPeriodTo' : '',
        'description' : 'xxxx',
        'customData' : {}
    }
}


    function generateResourceInfo() {
    return {
        items: [
            {
                action: "get",
                href: uriReg.host + "/tenants",
                body: {}
            },
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w",
            //    body: {}
            //},
            //{
            //    action: "put",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w",
            //    body: generateTenantInfo()
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants",
            //    body: generateTenantInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg",
            //    body: {}
            //},
            //{
            //    action: "put",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg",
            //    body: generateSIMCardInfo()
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards",
            //    body: generateSIMCardInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/organizations",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/22222ezUJSfjATUndDxtPQ",
            //    body: {}
            //},
            //{
            //    action: "put",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/organizations/22222ezUJSfjATUndDxtPQ",
            //    body: generateOrganizationInfo()
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/organizations",
            //    body: generateOrganizationInfo()
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/organizationMemberships",
            //    body: generateOrganizationMembershipInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groupMemberships",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groupMemberships/gyRdkaIf9KVjbsjMdpqeAQ",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groupMemberships/gyRdkaIf9KVjbsjMdpqeAQ",
            //    body: {}
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groupMemberships",
            //    body: generateGroupMembershipInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg/flows/O83lyhFW1sVO5MhwVqiLbA",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg/flows/O83lyhFW1sVO5MhwVqiLbA",
            //    body: {}
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/HSqbDJ3cdsUYpX2sss1S/simCards/SDTxlFYP9JC4Zcbat9YdVg/flows",
            //    body: generateFlowInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/0C86rtnHnm656sRKx7XRDg",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/0C86rtnHnm656sRKx7XRDg",
            //    body: {}
            //},
            //{
            //    action: "put",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories/0C86rtnHnm656sRKx7XRDg",
            //    body: generateDirectoryInfo()
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/directories",
            //    body: generateDirectoryInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F/batchNumbers",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F/batchNumbers/BatchA4RC6u55K6UbcSskg",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F/batchNumbers/BatchA4RC6u55K6UbcSskg",
            //    body: {}
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F/batchNumbers",
            //    body: generateBatchNumberInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules/aaruleqrNgrzcIGYs1PfP4F",
            //    body: {}
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/batchNORules",
            //    body: generateBatchNORuleInfo()
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups?expand=;organizations(offset:0,limit:10)",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil?expand=organizations(offset:0,limit:10)",
            //    body: {}
            //},
            //{
            //    action: "get",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil",
            //    body: {}
            //},
            //{
            //    action: "delete",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil",
            //    body: {}
            //},
            //{
            //    action: "put",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups/avc8415asfwjd100skjuil",
            //    body: generateGroupInfo()
            //},
            //{
            //    action: "post",
            //    href: uriReg.host + "/tenants/wyxZ4QJFXW4e5aePdql00w/groups",
            //    body: generateGroupInfo()
            //},
        ]
    };
}

var m_url = uriReg.host + '/resources';
describe('bash resource', function () {
    it('200 created', function (done) {
        this.timeout(0);
        var body = generateResourceInfo();
        options.method = 'POST';
        options.path = m_url;
        var req = http.request(options, function (res) {
            clientCallback('', res, done, function (resData) {
                console.log(resData);
                console.log(resData.items);
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json;charset=UTF-8');
            });
        });
        req.write(JSON.stringify(body));
        req.end();
    });
});