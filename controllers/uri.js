/**
 * Copyright(C),
 * FileName:  uri.js
 * Author: yansha
 * Version: 1.0.0
 * Date: 2016/05/25 17:50
 * Description:
 */

"use strict";
var domain = require('../common/domain');
var config = require('../config/config');

var host = '';
if (config.is_https)
    host = 'https://'+ domain.getDomainName() +'/api/v1.0.0';
else
    host = 'http://'+ domain.getDomainName() +'/api/v1.0.0';

//tenant
exports.tenantURI = function(tenantUUID) {
    return host + '/tenants' + (tenantUUID ? ( '/' + tenantUUID) : '');
}
exports.simCardByTenantURI = function(tenantUUID) {
    return host + '/tenants/' + tenantUUID +'/simCards';
}
exports.batchNumberByTenantURI = function(tenantUUID) {
    return host + '/tenants/' + tenantUUID +'/batchNumbers';
}
exports.flowByTenantURI = function(tenantUUID) {
    return host + '/tenants/' + tenantUUID +'/flows';
}

//organization
exports.organizationURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/organizations'+ (uuid ? ( '/' + uuid) : '');
}
exports.simCardByOrganizationURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/organizations/' + uuid +'/simCards';
}
exports.groupByOrganizationURI = function(tenantUUID,  uuid) {
    return host + '/tenants/' + tenantUUID + '/organizations/' + uuid +'/groups';
}
exports.directoryByOrganizationURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/organizations/' + uuid +'/directories';
}
exports.organizationMembershipByOrganizationURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID +'/organizations/' + uuid +'/organizationMemberships';
}

//organizationMembership
exports.organizationMembershipURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/organizationMemberships'+ (uuid ? ( '/' + uuid) : '');
}

//directory
exports.directoryURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories'+ (uuid ? ( '/' + uuid) : '');
}
exports.organizationByDirectoryURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ uuid + '/organizations';
}
exports.organizationMembershipByDirectoryURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ uuid +'/organizationMemberships';
}
exports.simCardByDirectoryURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ uuid +'/simCards';
}

//group
exports.groupURI = function(tenantUUID, groupUUID) {
    return host + '/tenants/' + tenantUUID + '/groups' +(groupUUID ? ( '/' + groupUUID) : '');
}
exports.simCardByGroupURI = function(tenantUUID, groupUUID) {
    return host + '/tenants/' + tenantUUID + '/groups/' + groupUUID +'/simCards';
}

exports.groupMembershipsByGroupURI = function(tenantUUID, groupUUID) {
    return host + '/tenants/' + tenantUUID + '/groups/' + groupUUID +'/groupMemberships';
}

exports.organizationsByGroupURI = function(tenantUUID, groupUUID) {
    return host + '/tenants/' +  tenantUUID + '/groups/' + groupUUID + '/organizations';
}

exports.organizationMembershipsByGroupURI = function(tenantUUID, groupUUID) {
    return host + '/tenants/' +  tenantUUID + '/groups/' + groupUUID + '/organizationMemberships';
}

//groupMembership
exports.groupMembershipURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/groupMemberships' + (uuid ? ( '/' + uuid) : '');
}

//simCard
exports.simCardURI = function(tenantUUID, directoryUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ directoryUUID +'/simCards' + (uuid ? ( '/' + uuid) : '');
}
exports.groupBySIMCardURI = function(tenantUUID, directoryUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ directoryUUID +'/simCards/' + uuid +'/groups';
}
exports.groupMembershipBySIMCardURI = function(tenantUUID, directoryUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ directoryUUID +'/simCards/' + uuid +'/groupMemberships';
}
exports.organizationBySIMCardURI = function(tenantUUID, directoryUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ directoryUUID +'/simCards/' + uuid +'/organizations';
}

//carrier
exports.carrierURI = function(tenantUUID,  uuid) {
    return host + '/tenants/' + tenantUUID + '/carriers' + (uuid ? ( '/' + uuid) : '');
}

//BatchNORule
exports.batchNORuleURI = function(tenantUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/batchNORules'+ (uuid ? ( '/' + uuid) : '');
}

//BatchNumber
exports.batchNumberURI = function(tenantUUID, batchNORuleUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/batchNORules/'+ batchNORuleUUID + '/batchNumbers' + (uuid ? ( '/' + uuid) : '');
}

exports.simCardByCarrierURI = function(tenantUUID,  uuid) {
    return host + '/tenants/' + tenantUUID + '/carriers/' + uuid + '/simCards';
}

exports.flowURI= function(tenantUUID, directoryUUID, simCardUUID, uuid) {
    return host + '/tenants/' + tenantUUID + '/directories/'+ directoryUUID +'/simCards/'+ simCardUUID +'/flows'+ (uuid ? ( '/' + uuid) : '');
}

//bashProcessing
exports.bashProcessingURI = function(){
    return host + '/resources';
};