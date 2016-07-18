/**
 * Copyright(C),
 * FileName:  retrunResources.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/5/25  17:53
 * Description:
 */

"use strict";
var URIParser = require('./uri');
var common = require('./common');
var querystring = require('querystring');

//tenant
exports.generateTenantRetInfo = function(info) {
    var exclude = new Array();
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href=URIParser.tenantURI(info.uuid);
    retInfo.groups={ 'href': URIParser.groupURI(info.uuid)};
    retInfo.organizations={ 'href': URIParser.organizationURI(info.uuid)};
    retInfo.simCards={ 'href': URIParser.simCardByTenantURI(info.uuid)};
    retInfo.batchNORules={ 'href': URIParser.batchNORuleURI(info.uuid)};
    retInfo.batchNumbers={ 'href': URIParser.batchNumberByTenantURI(info.uuid)};
    retInfo.directories={ 'href': URIParser.directoryURI(info.uuid)};
    retInfo.flows={ 'href': URIParser.flowByTenantURI(info.uuid)};
    return retInfo;
}
exports.generateListTenantRetInfo = function(queryConditions, offset, total, info) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }

    var retInfo = {
        'href': URIParser.tenantURI() + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateTenantRetInfo(element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}

//organization
exports.generateOrganizationRetInfo = function(info) {
    var exclude = new Array();
    exclude.push('tenantUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.organizationURI(info.tenantUUID, info.uuid);
    retInfo.simCards= { 'href': URIParser.simCardByOrganizationURI(info.tenantUUID, info.uuid) };
    retInfo.groups= { 'href': URIParser.groupByOrganizationURI(info.tenantUUID, info.uuid) };
    retInfo.directories= { 'href': URIParser.directoryByOrganizationURI(info.tenantUUID, info.uuid) };
    retInfo.organizationMemberships= { 'href': URIParser.organizationMembershipByOrganizationURI(info.tenantUUID, info.uuid) };
    retInfo.tenant={ 'href': URIParser.tenantURI(info.tenantUUID)};
    return retInfo;
}

exports.generateListOrganizationRetInfo = function(tenantUUID, queryConditions, offset, total, info, directoryUUID, groupUUID, simCardUUID) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }

    var retInfo = {
        'href': simCardUUID?  URIParser.organizationBySIMCardURI(tenantUUID, directoryUUID, simCardUUID) + expandStr : groupUUID?  URIParser.organizationsByGroupURI(tenantUUID, groupUUID) + expandStr : directoryUUID? URIParser.organizationByDirectoryURI(tenantUUID, directoryUUID) + expandStr: URIParser.organizationURI(tenantUUID) + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateOrganizationRetInfo(element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}


//organizationMembership
exports.generateOrganizationMembershipRetInfo = function(info) {
    var exclude = new Array( 'tenantUUID', 'directoryUUID', 'organizationUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.organizationMembershipURI(info.tenantUUID, info.uuid);
    if(info.type == 'directory'){
        retInfo.deviceStoreMapping ={ 'href': URIParser.directoryURI(info.tenantUUID, info.deviceStoreMappingUUID)};
    }else{
        retInfo.deviceStoreMapping ={ 'href': URIParser.groupURI(info.tenantUUID, info.deviceStoreMappingUUID)};
    }

    retInfo.organization ={'href': URIParser.organizationURI(info.tenantUUID, info.organizationUUID)};
    retInfo.tenant={ 'href': URIParser.tenantURI(info.tenantUUID)};
    return retInfo;
}

exports.generateListOrganizationMembershipRetInfo = function(tenantUUID, queryConditions, offset, total, info, organizationUUID) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }

    var retInfo = {
        'href': organizationUUID ? URIParser.organizationMembershipByOrganizationURI(tenantUUID, organizationUUID) + expandStr : URIParser.organizationMembershipURI(tenantUUID) + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateOrganizationMembershipRetInfo(element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}

//directory
exports.generateDirectoryRetInfo = function(info) {
    var exclude = new Array( 'tenantUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.directoryURI(info.tenantUUID, info.uuid);
    retInfo.organizations={'href': URIParser.organizationByDirectoryURI(info.tenantUUID, info.uuid)};
    retInfo.organizationMemberships={'href': URIParser.organizationMembershipByDirectoryURI(info.tenantUUID, info.uuid)};
    retInfo.simCards={'href': URIParser.simCardByDirectoryURI(info.tenantUUID, info.uuid)};
    retInfo.tenant={ 'href': URIParser.tenantURI(info.tenantUUID)};
    return retInfo;
}
exports.generateListDirectoryRetInfo = function(tenantUUID, queryConditions, offset, total, info, organizationUUID) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }
    var retInfo = {
        'href': organizationUUID ?  URIParser.directoryByOrganizationURI(tenantUUID, organizationUUID) + expandStr : URIParser.directoryURI(tenantUUID) + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateDirectoryRetInfo(element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}

//group
exports.generateGroupRetInfo = function(tenantUUID, info) {
    var exclude = new Array();
    exclude.push('tenantUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    if(info.organizations && info.organizations.length >=1){
        retInfo.organizations = info.organizations;
    }else{
        retInfo.organizations={ 'href': URIParser.organizationsByGroupURI(tenantUUID, info.uuid)};
    }
    if(info.groupMemberships && info.groupMemberships.length >=1){
        retInfo.groupMemberships = info.groupMemberships;
    }else{
        retInfo.groupMemberships={ 'href': URIParser.groupMembershipsByGroupURI(tenantUUID, info.uuid)};
    }
    retInfo.href = URIParser.groupURI(tenantUUID, info.uuid);
    retInfo.tenants = {'href': URIParser.tenantURI(tenantUUID)};
    retInfo.organizationMemberships = {'href': URIParser.organizationMembershipsByGroupURI(tenantUUID, info.uuid)};
    return retInfo;
}

exports.generateListGroupRetInfo = function(tenantUUID, queryConditions, offset, total, info, directoryUUID, simCardUUID, organizationUUID){
    var expandStr = querystring.stringify(queryConditions);
    if(expandStr != ''){
        expandStr += '?';
    }
    var retInfo = {
        'href': organizationUUID? URIParser.groupByOrganizationURI(tenantUUID, organizationUUID) : simCardUUID? URIParser.groupBySIMCardURI(tenantUUID, directoryUUID, simCardUUID)  : URIParser.groupURI(tenantUUID),
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateGroupRetInfo(tenantUUID, element);
        retInfo.items.push(oneItem);
    });

    return retInfo;

}
//groupMembership
exports.generateGroupMembershipRetInfo = function(tenantUUID, info) {
    var exclude = new Array( 'tenantUUID', 'groupUUID', 'directoryUUID', 'simCardUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.groupMembershipURI(tenantUUID, info.uuid);
    retInfo.simCard ={'href': URIParser.simCardURI(tenantUUID, info.directoryUUID, info.simCardUUID)} ;
    retInfo.group ={'href': URIParser.groupURI(tenantUUID, info.groupUUID)} ;
    retInfo.tenant={ 'href': URIParser.tenantURI(tenantUUID)};
    return retInfo;
}

exports.generateListGroupMembershipRetInfo = function(tenantUUID, queryConditions, offset, total, info, directoryUUID, simCardUUID, groupUUID ) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }

    var retInfo = {
        'href': simCardUUID? URIParser.groupMembershipBySIMCardURI(tenantUUID, directoryUUID, simCardUUID ): groupUUID ? URIParser.groupMembershipsByGroupURI(tenantUUID, groupUUID) : URIParser.groupMembershipURI(tenantUUID),
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateGroupMembershipRetInfo(tenantUUID, element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}

//simCard
exports.generateSIMCardRetInfo = function(tenantUUID, info) {
    var exclude = new Array( 'tenantUUID', 'directoryUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.simCardURI(tenantUUID, info.directoryUUID, info.uuid);
    retInfo.directory ={ 'href':  URIParser.directoryURI(tenantUUID, info.directoryUUID)};
    retInfo.groups ={ 'href':  URIParser.groupBySIMCardURI(tenantUUID, info.directoryUUID, info.uuid)};
    retInfo.groupMemberships ={ 'href':  URIParser.groupMembershipBySIMCardURI(tenantUUID, info.directoryUUID, info.uuid)};
    retInfo.tenant={ 'href': URIParser.tenantURI(tenantUUID)};
    retInfo.flows={ 'href': URIParser.flowURI(tenantUUID, info.directoryUUID, info.uuid)};
    return retInfo;
}
exports.generateListSIMCardRetInfo = function(tenantUUID, directoryUUID, queryConditions, offset, total, info, groupUUID, organizationUUID) {
    var expandStr = querystring.stringify(queryConditions);
    var b = encodeURIComponent(expandStr);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }
    var retInfo = {
        'href':  organizationUUID? URIParser.simCardByOrganizationURI(tenantUUID, organizationUUID) + expandStr : groupUUID? URIParser.simCardByGroupURI(tenantUUID, groupUUID) + expandStr : directoryUUID? URIParser.simCardURI(tenantUUID, directoryUUID) + expandStr : URIParser.simCardByTenantURI(tenantUUID) + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateSIMCardRetInfo(tenantUUID, element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}

//flow
exports.generateFlowRetInfo = function(tenantUUID, directoryUUID, info) {
    var exclude = new Array( 'tenantUUID', 'directoryUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.flowURI(tenantUUID, directoryUUID, info.simCardUUID, info.uuid);
    retInfo.simCard ={ 'href':  URIParser.simCardURI(tenantUUID, directoryUUID, info.simCardUUID)};
    retInfo.directory ={ 'href':  URIParser.directoryURI(tenantUUID, directoryUUID)};
    retInfo.tenant={ 'href': URIParser.tenantURI(tenantUUID)};
    return retInfo;
}
exports.generateListFlowRetInfo = function(tenantUUID, directoryUUID, simcardUUID, queryConditions, offset, total, info) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }
    var retInfo = {
        'href':  simcardUUID? URIParser.flowURI(tenantUUID, directoryUUID, simcardUUID) + expandStr : URIParser.flowByTenantURI(tenantUUID) + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateFlowRetInfo(tenantUUID, directoryUUID, element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}
exports.generateMonthFlowRetInfo = function(tenantUUID, directoryUUID, simcardUUID, queryConditions, info) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }
    var retInfo = {
        'href':   URIParser.flowURI(tenantUUID, directoryUUID, simcardUUID) + expandStr ,
        'count': info
    };
    return retInfo;
}
//BatchNORule
exports.generateBatchNORuleRetInfo = function(info) {
    var exclude = new Array('tenantUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    retInfo.href = URIParser.batchNORuleURI(info.tenantUUID, info.uuid);
    retInfo.batchNumbers ={ 'href':  URIParser.batchNumberURI(info.tenantUUID, info.uuid)};
    retInfo.tenant={ 'href': URIParser.tenantURI(info.tenantUUID)};
    return retInfo;
}
exports.generateListBatchNORuleRetInfo = function(tenantUUID, queryConditions, offset, total, info) {
    var expandStr = querystring.stringify(queryConditions);
    if (expandStr!='') {
        expandStr = '?' + expandStr;
    }
    var retInfo = {
        'href': URIParser.batchNORuleURI(tenantUUID) + expandStr,
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateBatchNORuleRetInfo(element);
        retInfo.items.push(oneItem);
    });
    return retInfo;
}

//BatchNumber
exports.generateBatchNumbersRetInfo = function(tenantUUID, info) {
    var exclude = new Array();
    exclude.push('tenantUUID');
    exclude.push('batchNORuleUUID');
    var retInfo = {};
    common.convert2ReturnData(retInfo, info, exclude);
    if(info.tenants && info.tenants.tag == 'tenant'){
        retInfo.tenants = info.tenants;
    }else{
        retInfo.tenants={ 'href': URIParser.tenantURI(tenantUUID)};
    }
    if(info.batchNORules && info.batchNORules.tag == 'batchNORule'){
        retInfo.batchNORules = info.batchNORules;
    }else{
        retInfo.batchNORules = {'href': URIParser.batchNORuleURI(tenantUUID, info.batchNORuleUUID)};
    }
    retInfo.href=URIParser.batchNumberURI(tenantUUID, info.batchNORuleUUID, info.uuid);
    return retInfo;
}

exports.generateListBatchNumbersRetInfo = function(tenantUUID, batchNORuleUUID, queryConditions, offset, total, info){
    var expandStr = querystring.stringify(queryConditions);
    if(expandStr != ''){
        expandStr += '?';
    }
    var retInfo = {
        'href': URIParser.batchNumberURI(tenantUUID, batchNORuleUUID),
        'offset': offset,
        'limit': info.length,
        'size' : total,
        'items': new Array()
    };

    var tmp = this;
    info.forEach(function(element){
        var oneItem = tmp.generateBatchNumbersRetInfo(tenantUUID, element);
        retInfo.items.push(oneItem);
    });

    return retInfo;

}

exports.retBashProcessingInfo = function(items){
    var retInfo = {
        'href':  URIParser.bashProcessingURI(),
        'items': items
    };
    return retInfo;
};