"use strict";

var domain = require('./domain');

var config = require('../config/config');
var host = '';
if(config.is_https){
    host = 'https://'+ domain.getDomainName() +'/api/v1.0.0';
} else{
    host = 'http://'+ domain.getDomainName() +'/api/v1.0.0';
}
//var host = 'http.*/api/v1';
//var uuidType = '[a-z0-9A-Z]{22}';

exports.host = host;

//tenant
exports.tenantURIReg =  new RegExp(host + '/tenants/.*');
exports.tenantsURIReg =  new RegExp(host + '/tenants');
exports.simCardByTenantURIReg =  new RegExp(host + '/tenants/.*/simCards');
exports.batchNumberByTenantURIReg =  new RegExp(host + '/tenants/.*/batchNumbers');
exports.batchNORuleURIReg =  new RegExp(host + '/tenants/.*/batchNORules');
exports.batchNORulesURIReg =  new RegExp(host + '/tenants/.*/batchNORules/.*');

//organization
exports.organizationURIReg = new RegExp(host + '/tenants/.*/organizations');
exports.organizationsURIReg = new RegExp(host + '/tenants/.*/organizations/.*');
exports.simCardByOrganizationURIReg= new RegExp(host + '/tenants/.*/organizations/.*/simCards');
exports.organizationMembershipByOrganizationURIReg= new RegExp(host + '/tenants/.*/organizations/.*/organizationMemberships');
exports.directoryByOrganizationURIReg= new RegExp(host + '/tenants/.*/organizations/.*/directories');
exports.groupByOrganizationURIReg= new RegExp(host + '/tenants/.*/organizations/.*/groups');

//organizationMembership
exports.organizationMembershipURIReg = new RegExp(host + '/tenants/.*/organizationMemberships');
exports.organizationMembershipsURIReg = new RegExp(host + '/tenants/.*/organizationMemberships/.*');

//directory
exports.directoryURIReg = new RegExp(host + '/tenants/.*/directories');
exports.directoriesURIReg = new RegExp(host + '/tenants/.*/directories/.*');
exports.organizationByDirectoryURIReg = new RegExp(host + '/tenants/.*/directories/.*/organizations');
exports.organizationMembershipByDirectoryURIReg = new RegExp(host + '/tenants/.*/directories/.*/organizationMemberships');
exports.simCardByDirectoryURIReg = new RegExp(host + '/tenants/.*/directories/.*/simCards');

//group
exports.organizationMembershipsByGroupURIReg =  new RegExp(host + '/tenants/.*/groups/.*/organizationMemberships');
exports.organizationsByGroupURIReg =  new RegExp(host + '/tenants/.*/groups/.*/organizations');
exports.simCardsByGroupURIReg =  new RegExp(host + '/tenants/.*/groups/.*/simCards');
exports.groupMembershipsByGroupURIReg =  new RegExp(host + '/tenants/.*/groups/.*/groupMemberships');
exports.groupURIReg=  new RegExp(host + '/tenants/.*/groups');
exports.groupsURIReg =  new RegExp(host + '/tenants/.*/groups/.*');

//groupMembership
exports.groupMembershipURIReg =  new RegExp(host + '/tenants/.*/groupMemberships');
exports.groupMembershipsURIReg =  new RegExp(host + '/tenants/.*/groupMemberships/.*');

//simCard
exports.simCardURIReg =  new RegExp(host + '/tenants/.*/directories/.*/simCards');
exports.simCardsURIReg =  new RegExp(host + '/tenants/.*/directories/.*/simCards/.*');
exports.groupBysimCardURIReg =  new RegExp(host + '/tenants/.*/directories/.*/simCards/.*/groups');
exports.groupMembershipBySimCardURIReg =  new RegExp(host + '/tenants/.*/directories/.*/simCards/.*/groupMemberships');
exports.organizationBySIMCardURI =  new RegExp(host + '/tenants/.*/directories/.*/simCards/.*/organizations');

//carrier
exports.carrierURIReg=  new RegExp(host + '/tenants/.*/carriers');
exports.simCardByCarrierURIReg = new RegExp(host + '/tenants/.*/carriers/.*/simCards');

//flow
exports.flowURIReg=  new RegExp(host + '/tenants/.*/directories/.*/simCards/.*/flows');
exports.flowsURIReg=  new RegExp(host + '/tenants/.*/directories/.*/simCards/.*/flows/.*');

//batchNumber
exports.batchNumbersURIReg =  new RegExp(host + '/tenants/.*/batchNORules/.*/batchNumbers/.*');
exports.batchNumberURIReg =  new RegExp(host + '/tenants/.*/batchNORules/.*/batchNumbers');
