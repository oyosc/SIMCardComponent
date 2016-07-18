"use strict";
var express = require('express');
var router = express.Router();
var config = require("../config/config.js");
var groups = require("../controllers/groups");
var tenants = require("../controllers/tenants");
var groupMemberships = require("../controllers/groupMemberships");
var directory = require("../controllers/directories");
var organizations= require("../controllers/organizations");
var organizationMemberships= require("../controllers/organizationMemberships");
var simCards = require("../controllers/simCards");
var batchNORules = require("../controllers/batchNORules");
var batchNumbers = require("../controllers/batchNumbers");
var flows= require("../controllers/flows");
var bashProcessing = require('../controllers/batchProcessing');
var batch = require('../proxy/batchProcessingOperator');

//tenant
var tenantBaseURI = '/api/:version/tenants';
router.post('/api/:version/tenants', tenants.createTenant);
router.put('/api/:version/tenants/:tenantUUID', tenants.updateTenant);
router.get('/api/:version/tenants/:tenantUUID', tenants.retrieveTenant);
router.get('/api/:version/tenants/current', tenants.retrieveCurrentTenant);
router.get('/api/:version/tenants', tenants.listTenants);
router.delete('/api/:version/tenants/:tenantUUID', tenants.deleteTenant);
batch.addOperator("post", tenantBaseURI, tenants.bulkOperator);
batch.addOperator("put", tenantBaseURI+'/:tenantUUID', tenants.bulkOperator);
batch.addOperator("get", tenantBaseURI+'/:tenantUUID', tenants.bulkOperator);
batch.addOperator("get", tenantBaseURI, tenants.bulkOperator);
batch.addOperator("delete", tenantBaseURI+'/:tenantUUID', tenants.bulkOperator);

//organization
var organizationBaseURI = '/api/:version/tenants/:tenantUUID/organizations';
router.post(organizationBaseURI, organizations.createOrganization);
router.put(organizationBaseURI +'/:organizationUUID', organizations.updateOrganization);
router.get(organizationBaseURI +'/:organizationUUID', organizations.retrieveOrganization);
router.delete(organizationBaseURI +'/:organizationUUID', organizations.deleteOrganization);
router.get(organizationBaseURI, organizations.listOrganizations);
router.get('/api/:version/tenants/:tenantUUID/directories/:directoryUUID/organizations', organizations.listOrganizationsByDirectory);
router.get('/api/:version/tenants/:tenantUUID/groups/:groupUUID/organizations', organizations.listOrganizationsByGroup);
router.get('/api/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/organizations', organizations.listOrganizationsBySIMCard);
batch.addOperator("post", organizationBaseURI, organizations.bulkOperator);
batch.addOperator("put", organizationBaseURI+'/:organizationUUID', organizations.bulkOperator);
batch.addOperator("get", organizationBaseURI+'/:organizationUUID', organizations.bulkOperator);
batch.addOperator("get", organizationBaseURI, organizations.bulkOperator);
batch.addOperator("delete", organizationBaseURI+'/:organizationUUID', organizations.bulkOperator);


//organizationMembership
var organizationMembershipBaseURI = '/api/:version/tenants/:tenantUUID/organizationMemberships';
router.post(organizationMembershipBaseURI, organizationMemberships.createOrganizationMembership);
router.get(organizationMembershipBaseURI +'/:organizationMembershipUUID', organizationMemberships.retrieveOrganizationMembership);
router.delete(organizationMembershipBaseURI +'/:organizationMembershipUUID', organizationMemberships.deleteOrganizationMembership);
router.get(organizationMembershipBaseURI, organizationMemberships.listOrganizationMemberships);
router.get('/api/:version/tenants/:tenantUUID/organizations/:organizationUUID/organizationMemberships', organizationMemberships.listOrganizationMembershipsByOrganization);
router.get('/api/:version/tenants/:tenantUUID/directories/:directoryUUID/organizationMemberships', organizationMemberships.listOrganizationMembershipsByDirectory);
router.get('/api/:version/tenants/:tenantUUID/groups/:groupUUID/organizationMemberships', organizationMemberships.listOrganizationMembershipsByGroup);
batch.addOperator("post", organizationMembershipBaseURI, organizationMemberships.bulkOperator);
batch.addOperator("put", organizationMembershipBaseURI+'/:organizationMembershipUUID', organizationMemberships.bulkOperator);
batch.addOperator("get", organizationMembershipBaseURI+'/:organizationMembershipUUID', organizationMemberships.bulkOperator);
batch.addOperator("get", organizationMembershipBaseURI, organizationMemberships.bulkOperator);
batch.addOperator("delete", organizationMembershipBaseURI+'/:organizationMembershipUUID', organizationMemberships.bulkOperator);

//directory
var directoryBaseURI = '/api/:version/tenants/:tenantUUID/directories';
router.post(directoryBaseURI, directory.createDirectory);
router.put(directoryBaseURI +'/:directoryUUID', directory.updateDirectory);
router.get(directoryBaseURI +'/:directoryUUID', directory.retrieveDirectory);
router.delete(directoryBaseURI +'/:directoryUUID', directory.deleteDirectory);
router.get(directoryBaseURI, directory.listDirectories);
router.get('/api/:version/tenants/:tenantUUID/organizations/:organizationUUID/directories', directory.listDirectoriesByOrganization);
batch.addOperator("post", directoryBaseURI, directory.bulkOperator);
batch.addOperator("put", directoryBaseURI+'/:directoryUUID', directory.bulkOperator);
batch.addOperator("get", directoryBaseURI+'/:directoryUUID', directory.bulkOperator);
batch.addOperator("get", directoryBaseURI, directory.bulkOperator);
batch.addOperator("delete", directoryBaseURI+'/:directoryUUID', directory.bulkOperator);


//group
var groupBaseURI='/api/:version/tenants/:tenantUUID/groups';
router.post(groupBaseURI, groups.createGroup);
router.put(groupBaseURI+'/:groupUUID', groups.updateGroup);
router.get(groupBaseURI+'/:groupUUID', groups.retrieveGroup);
router.delete(groupBaseURI+'/:groupUUID', groups.deleteGroup);
router.get(groupBaseURI, groups.listGroups);
router.get('/api/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/groups', groups.listGroupsBySimCard);
router.get('/api/:version/tenants/:tenantUUID/organizations/:organizationUUID/groups', groups.listGroupsByOrganizations);
batch.addOperator("post", groupBaseURI, groups.bulkOperator);
batch.addOperator("put", groupBaseURI+'/:groupUUID', groups.bulkOperator);
batch.addOperator("get", groupBaseURI+'/:groupUUID', groups.bulkOperator);
batch.addOperator("get", groupBaseURI, groups.bulkOperator);
batch.addOperator("delete", groupBaseURI+'/:groupUUID', groups.bulkOperator);

//groupMembership
var groupMembershipBaseURI='/api/:version/tenants/:tenantUUID/groupMemberships';
router.post(groupMembershipBaseURI, groupMemberships.createGroupMembership);
router.get(groupMembershipBaseURI + '/:groupMembershipUUID', groupMemberships.retrieveGroupMembership);
router.delete(groupMembershipBaseURI + '/:groupMembershipUUID', groupMemberships.deleteGroupMembership);
router.get(groupMembershipBaseURI, groupMemberships.listGroupMemberships);
router.get('/api/:version/tenants/:tenantUUID/groups/:groupUUID/groupMemberships', groupMemberships.listGroupMembershipsByGroup);
router.get('/api/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/groupMemberships', groupMemberships.listGroupMembershipsBysimCard);
batch.addOperator("post", groupMembershipBaseURI, groupMemberships.bulkOperator);
batch.addOperator("get", groupMembershipBaseURI+'/:groupMembershipUUID', groupMemberships.bulkOperator);
batch.addOperator("get", groupMembershipBaseURI, groupMemberships.bulkOperator);
batch.addOperator("delete", groupMembershipBaseURI+'/:groupMembershipUUID', groupMemberships.bulkOperator);


//simCard
var simCardBaseURI='/api/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards';
router.post(simCardBaseURI, simCards.createSIMCards);
router.put(simCardBaseURI + '/:simCardUUID', simCards.updateSIMCard);
router.delete(simCardBaseURI + '/:simCardUUID', simCards.deleteSIMCard);
router.get(simCardBaseURI + '/:simCardUUID', simCards.retrieveSIMCard);
router.get(simCardBaseURI, simCards.listSIMCards);
router.get('/api/:version/tenants/:tenantUUID/groups/:groupUUID/simCards', simCards.listSIMCardsByGroup);
router.get('/api/:version/tenants/:tenantUUID/organizations/:organizationUUID/simCards', simCards.listSIMCardsByOrganization);
router.get('/api/:version/tenants/:tenantUUID/simCards', simCards.allSIMCards);
batch.addOperator("post", simCardBaseURI, simCards.bulkOperator);
batch.addOperator("put", simCardBaseURI+'/:simCardUUID', simCards.bulkOperator);
batch.addOperator("get", simCardBaseURI+'/:simCardUUID', simCards.bulkOperator);
batch.addOperator("get", simCardBaseURI, simCards.bulkOperator);
batch.addOperator("delete", simCardBaseURI+'/:simCardUUID', simCards.bulkOperator);

//flow
var flowBaseURI='/api/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID/flows';
router.post(flowBaseURI, flows.createFlows);
router.put(flowBaseURI + '/:flowUUID', flows.updateFlow);
router.delete(flowBaseURI + '/:flowUUID', flows.deleteFlow);
router.get(flowBaseURI + '/:flowUUID', flows.retrieveFlow);
router.get(flowBaseURI, flows.listFlows);
batch.addOperator("post", flowBaseURI, flows.bulkOperator);
batch.addOperator("put", flowBaseURI+'/:flowUUID', flows.bulkOperator);
batch.addOperator("get", flowBaseURI+'/:flowUUID', flows.bulkOperator);
batch.addOperator("get", flowBaseURI, flows.bulkOperator);
batch.addOperator("delete", flowBaseURI+'/:flowUUID', flows.bulkOperator);

//BatchNORule
var batchNORuleBaseURI='/api/:version/tenants/:tenantUUID/batchNORules';
router.post(batchNORuleBaseURI, batchNORules.createBatchNORule);
router.delete(batchNORuleBaseURI +'/:batchNORuleUUID', batchNORules.deleteBatchNORule);
router.get(batchNORuleBaseURI +'/:batchNORuleUUID', batchNORules.retrieveBatchNORule);
router.get(batchNORuleBaseURI, batchNORules.listBatchNORules);
batch.addOperator("post", batchNORuleBaseURI, batchNORules.bulkOperator);
batch.addOperator("get", batchNORuleBaseURI+'/:batchNORuleUUID', batchNORules.bulkOperator);
batch.addOperator("get", batchNORuleBaseURI, batchNORules.bulkOperator);
batch.addOperator("delete", batchNORuleBaseURI+'/:batchNORuleUUID', batchNORules.bulkOperator);


/*batchNumber */
var batchNumberBaseURI='/api/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers';
router.post(batchNumberBaseURI, batchNumbers.createBatchNumber );
router.get(batchNumberBaseURI +'/:batchNumberUUID', batchNumbers.retrieveBatchNumber);
router.delete(batchNumberBaseURI  +'/:batchNumberUUID', batchNumbers.deleteBatchNumber);
router.get(batchNumberBaseURI, batchNumbers.listBatchNumbers);
batch.addOperator("post", batchNumberBaseURI, batchNumbers.bulkOperator);
batch.addOperator("get", batchNumberBaseURI+'/:batchNumberUUID', batchNumbers.bulkOperator);
batch.addOperator("get", batchNumberBaseURI, batchNumbers.bulkOperator);
batch.addOperator("delete", batchNumberBaseURI+'/:batchNumberUUID', batchNumbers.bulkOperator);

/* bashProcessing (批处理)*/
var bashBaseURI = '/api/:version/resources';
router.post(bashBaseURI, bashProcessing.batchProcessing);

module.exports = router;