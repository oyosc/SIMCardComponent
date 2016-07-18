/**
 * Copyright(C),
 * FileName:  utils.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2015/10/22  16:26
 * Description:
 */
"use strict";
var crypto = require('crypto');
var uuid = require('node-uuid');
//var chai = require('chai');
//var expect = chai.expect;
var uriReg = require('./URIReg');

exports.getUUIDInHref = function(href, reg, lastReg) {
    var serviceReg = new RegExp(reg);
    var serviceResult = serviceReg.exec(href);
    var subStr = href.substr(serviceResult['index'] + serviceResult[0].length);
    if(!lastReg){
        return subStr;
    }
    serviceReg = new RegExp(lastReg);
    serviceResult = serviceReg.exec(subStr);
    return subStr.substr(0, serviceResult['index']);
};

exports.createUUID = function(){
    var p;
    do{
        var md5 = crypto.createHash('md5');
        p = md5.update(uuid.v1()).digest('base64');
    }while( p.indexOf('/') != -1 || p.indexOf('+') != -1);
    return p.substr(0, p.length-2);
};

var UUIDReg = new RegExp('[a-z0-9A-Z]{22}');
exports.checkUUID = function(UUID){
    if(UUIDReg.test(UUID)){
        return true;
    }
    return false;
};

exports.isOrganizationMembershipURL = function(url){
    return uriReg.organizationMembershipURIReg.test(url);
};

exports.isOrganizationMembershipsURL = function(url){
    return uriReg.organizationMembershipsURIReg.test(url);
};

exports.isGroupMembershipURL = function(url){
    return uriReg.groupMembershipURIReg.test(url);
};

exports.isGroupMembershipsURL = function(url){
    return uriReg.groupMembershipsURIReg.test(url);
};

exports.ifReturnTrue = function (value) {
    return value ? true : false;
};

exports.ifReturnStr = function (value, str) {
    return value ? value : (str ? str : '');
};

exports.ifReturnNum = function (value, num) {
    return value ? value : (num ? num : 0);
};
exports.ifReturnJson = function(value, json) {
    return value ? JSON.stringify(value) : (json ? json : "{}");
}

exports.isOrganizationURL = function(url){
    return uriReg.organizationURIReg.test(url);
};

exports.isOrganizationsURL = function(url){
    return uriReg.organizationsURIReg.test(url);
};

exports.isStoreURL = function(url){
    if(uriReg.directoryURIReg.test(url) || uriReg.groupURIReg.test(url)){
        return true;
    }else{
        return false;
    }
};

exports.isGroupURL = function(url){
    return uriReg.groupURIReg.test(url);
};

exports.isGroupsURL = function(url){
    return uriReg.groupsURIReg.test(url);
};

exports.isDirectoryURL = function(url){
    return uriReg.directoryURIReg.test(url);
};

exports.isDirectoriesURL = function(url){
    return uriReg.directoriesURIReg.test(url);
};

exports.isFlowURL = function(url){
    return uriReg.flowURIReg.test(url);
};

exports.isFlowsURL = function(url){
    return uriReg.flowsURIReg.test(url);
};
exports.isSIMCardURL = function(url){
    return uriReg.simCardURIReg.test(url);
};

exports.isSIMCardsURL = function(url){
    return uriReg.simCardsURIReg.test(url);
};

exports.isSIMCardsURL = function(url){
    return uriReg.simCardsURIReg.test(url);
};

exports.isTenantsURL = function(url){
    return uriReg.tenantURIReg.test(url);
};

exports.isTenantURL = function(url){
    return uriReg.tenantsURIReg.test(url);
};

exports.isBatchNORuleURL = function(url){
    return uriReg.batchNORuleURIReg.test(url);
};

exports.isBatchNORulesURL = function(url){
    return uriReg.batchNORulesURIReg.test(url);
};

exports.isBatchNumberURL = function(url){
    return uriReg.batchNumberURIReg.test(url);
};

exports.isBatchNumbersURL = function(url){
    return uriReg.batchNumbersURIReg.test(url);
};

exports.parseUrlParam=function(href){
    var query, data = {};
    href=href.split('?');
    if(href.length>1){
        query=href[1];
        if (!query) {return false;}
        query = query.split('&');
        query.forEach(function (ele) {
            var tmp = ele.split('=');
            data[ decodeURIComponent( tmp[0] ) ] = decodeURIComponent( tmp[1] === undefined ? '' : tmp[1] );
        });
    }
    return data;
};
