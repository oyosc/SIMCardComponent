"use strict";
var config = require("../config/config");
var knex = require('../models/knex').knex;
var chai = require('chai');
var expect = chai.expect;
var moment = require('moment');

var initialMysqlTestData = function(callback) {
    //console.log("initialSqlite3TestData");
    knex.transaction(function(trx) {
        //console.log('database initial begin.');
        knex('GroupMembership').delete().transacting(trx)
            .then(function(){
                return knex('SerialNumber').delete().transacting(trx)
            })
            .then(function(){
                return knex('BatchNumber').delete().transacting(trx)
            })
            .then(function(){
                return knex('BatchNORule').delete().transacting(trx)
            })
            .then(function(){
                return knex('Flow').delete().transacting(trx)
            })
            .then(function(){
                return knex('SIMCard').delete().transacting(trx);
            })
            .then(function(){
                return knex('OrganizationMembership').delete().transacting(trx);
            })
            .then(function(){
                return knex('Group').delete().transacting(trx);
            })
            .then(function(){
                return knex('Directory').delete().transacting(trx);
            })
            .then(function(){
                return knex('Organization').delete().transacting(trx);
            })
            .then(function(){
                return knex('Tenant').delete().transacting(trx);
            })
            .then(function(){
                return knex('Tenant').insert({
                    'uuid': 'wyxZ4QJFXW4e5aePdql00w',
                    'name' : '测试Tenant',
                    'description': 'my name is tenant',
                    'apikey_id': 'mGldhwkSw8MtDFLhbk1i4Q',
                    'apikey_secret': 'mGldhwkSw8MtDFLhbk1i4Q',
                    'status': 'enable',
                    'createAt': '2016-04-19 10:00:00',
                    'modifiedAt': '2015-04-19 10:00:00',
                    'topic':'MerchandiseComponent'
                }).transacting(trx);
            })
            .then(function(){
                return knex('Group').insert({
                    'uuid': 'avc8415asfwjd100skjuil',
                    'name' : '测试组1',
                    'description': '测试',
                    'status': 'ENABLED',
                    'createAt': '2016-04-18 14:00:00',
                    'modifiedAt': '2015-04-18 14:00:00',
                    'tenantUUID': 'wyxZ4QJFXW4e5aePdql00w',
                    'deleteFlag': '0',
                    'customData' :JSON.stringify({'test' : 'test groups'})
                }).transacting(trx);
            })
            .then(function(){
                return knex('BatchNORule').insert({
                    'uuid': 'aaruleqrNgrzcIGYs1PfP4F',
                    'rule' : 'YYYYMMWWDDFFF',
                    complementCode : '0',
                    'tenantUUID': 'wyxZ4QJFXW4e5aePdql00w',
                    'createAt': '2016-05-17 10:00:00',
                    'modifiedAt': '2015-05-17 10:00:00'
                }).transacting(trx);
            })
            .then(function(){
                return knex('BatchNumber').insert({
                    'uuid': 'BatchA4RC6u55K6UbcSskg',
                    'batchNumber' : '05201633',
                    'batchNORuleUUID': 'aaruleqrNgrzcIGYs1PfP4F',
                    'createAt': '2016-05-17 10:00:00',
                    'modifiedAt': '2015-05-17 10:00:00'
                }).transacting(trx);
            })
            .then(function(){
                return knex('SerialNumber').insert({
                    'batchNumber' : '1',
                    'createAt': '2016-07-14'
                }).transacting(trx);
            })
            .then(function(){
                return knex('Organization').insert({
                    'uuid': 'Nud3iezUJSfjATUndDxtPQ',
                    'name' : '测试Organization22',
                    'description': 'my name is Organization',
                    'status': 'enable',
                    'createAt': '2016-03-29 14:00:00',
                    'modifiedAt': '2015-03-29 14:00:00',
                    'tenantUUID': 'wyxZ4QJFXW4e5aePdql00w',
                    'deleteFlag': '0',
                    'customData' :JSON.stringify({'test' : 'test Organization22'})
                }).transacting(trx);
            })
            .then(function(){
                return knex('Organization').insert({
                    'uuid': '22222ezUJSfjATUndDxtPQ',
                    'name' : '测试Organization22',
                    'description': 'my name is Organization',
                    'status': 'enable',
                    'createAt': '2016-03-29 14:00:00',
                    'modifiedAt': '2015-03-29 14:00:00',
                    'tenantUUID': 'wyxZ4QJFXW4e5aePdql00w',
                    'deleteFlag': '0',
                    'customData' :JSON.stringify({'test' : 'test Organization22'})
                }).transacting(trx);
            })
            .then(function(){
                return knex('Directory').insert({
                    'uuid': 'HSqbDJ3cdsUYpX2sss1S',
                    'name' : '红色',
                    'status':'ENABLED',
                    'description':'测试Directory',
                    'tenantUUID':'wyxZ4QJFXW4e5aePdql00w',
                    'createAt': '2016-03-29 14:00:00',
                    'modifiedAt': '2015-03-29 14:00:00'
                }).transacting(trx);
            })
            .then(function(){
                return knex('Directory').insert({
                    'uuid': '0C86rtnHnm656sRKx7XRDg',
                    'name' : '目录1111',
                    'status':'ENABLED',
                    'description':'测试Directory',
                    'tenantUUID':'wyxZ4QJFXW4e5aePdql00w',
                    'createAt': '2016-03-29 14:00:00',
                    'modifiedAt': '2015-03-29 14:00:00'
                }).transacting(trx);
            })
            .then(function(){
                return knex('SIMCard').insert({
                    'uuid': 'SDTxlFYP9JC4Zcbat9YdVg',
                    'ICCID' : 'W9047090021',
                    'IMSI' : '18666291301',
                    'phone':'18565800821',
                    'openCardData':'2016-03-29 14:00:00',
                    'package':'',
                    'status':'enable',
                    'businessStatus' : '待投产',
                    'activeData' : '2016-03-29 14:00:00',
                    'useData' : '2016-03-29 14:00:00',
                    'sn' : 'CCCcccYYYYMMDDFFF',
                    'shareFlow' : 'false',
                    'testPeriodTo' : '2017-03-29 14:00:00',
                    'silentPeriodTo' : '2017-03-29 14:00:00',
                    'description' : 'xxxx',
                    'directoryUUID': 'HSqbDJ3cdsUYpX2sss1S',
                    'carrier': 'carriYzwSRzjiIfLs1Jfo9',
                    'createAt': '2016-03-29 14:00:00',
                    'modifiedAt': '2015-03-29 14:00:00'
                }).transacting(trx);
            })
            .then(function(){
                return knex('GroupMembership').insert({
                    'uuid': 'gyRdkaIf9KVjbsjMdpqeAQ',
                    'simCardUUID' : 'SDTxlFYP9JC4Zcbat9YdVg',
                    'groupUUID' : 'avc8415asfwjd100skjuil',
                    'tenantUUID':'wyxZ4QJFXW4e5aePdql00w',
                    'createAt': '2016-03-29 14:00:00' ,//创建时间
                    'modifiedAt': '2015-03-29 14:00:00',
                }).transacting(trx);
            })
            .then(function () {
                console.log('database initial finish.');
                trx.commit();
                callback(true);
            })
            .catch(function (error) {
                console.log(error);
                trx.rollback();
                throw new Error("The DBForTestCases initial failed.");
            });
    });
}

//var initial = function(callback) {
//    if (config.ConfigForKnex.client==='mysql') {
//        initialSqlite3TestData(callback);
//    } else if (config.ConfigForKnex.client==='sqlite3') {
//        initialSqlite3TestData(callback);
//    } else {
//        throw new Error("unknown database.");
//    }
//}

var m_dbForTest = '123456';

describe('initialTestCases', function () {
    it('it should initial success', function (done) {
        if(!config.knex_client || !config.knex_connection || !config.knex_connection.database) {
            console.log('database config is error.' );
            done();
            return;
        }
        if(config.debug && config.knex_connection.password != m_dbForTest) {
            console.log('can\'t initial database. the dataBase is not for test.' );
            done();
            return;
        }
        this.timeout(0);
        initialMysqlTestData(function(success) {
            if (success) {
                console.log("initial database success.");
            }
            done();
        })
    });
});