/**
 * Copyright(C),
 * FileName:  flowOfCMCC.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/7/12  14:06
 * Description:对接移动的API接口
 */
"use strict"
const request = require("request");
const common = require('./common');
/**
 * @api {get} /:version/tenants/:tenantUUID/flows ListFlow
 * @apiName ListFlow
 * @apiVersion 1.0.0
 * @apiGroup FlowOfCMCC
 * @apiDescription  获取流量信息
 * @apiParam (input) {array} phones 手机号码
 * @apiParam (input) {datetime} timeRange 时间区间，时间格式：yyyy-MM-dd hh24:mm:ss　如[2016-07-10 10:00:00, 2016-07-12 10:00:00]
 *
 * @apiParam (output) {array} phone 手机号码
 * @apiParam (output) {int} flowSum 总流量（单位M）
 * @apiParam (output) {int} ddFlowNum2G3G 2G/3G日已使用流量（单位KB）
 * @apiParam (output) {int} ddFlowNum4G 4G日已使用流量（单位KB）
 *
 * @apiParamExample  Example Request
 * get:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flows?phones=[13401011010,13502014567]&datetime=[2016-07-10 10:00:00, 2016-07-12 10:00:00]
 * Content-Type: application/json;charset=UTF-8;
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flows?phones=[13401011010,13502014567]&datetime=[2016-07-10 10:00:00, 2016-07-12 10:00:00]',
 *   'items' : [
 *      {
 *          'phone' : 13401011010,
 *          'flowSum' : 200,
 *          'ddFlowNum2G3G' : 50,
 *          'ddFlowNum4G' : 20
 *      },
 *      {
 *          ...
 *      },
 *      ...
 *   ]
 * }
 */
exports.flows = (req, res, next) => {
    let msisdn = req.query.phone;
    let datetime = req.query.datetime;
    let [startDateStr, endDateStr] = datetime;

    let flowUrl = `http://IP:端口/openapi/router?appKey=u4xqdmasy8&format=json&v=2.0&method=iot.member.monthlydatausage.query&msisdn=${msisdn}&sign=1c68a1f499ddf6cec24e2e1e5736b9ce&startDateStr=${startDateStr}&endDateStr=${endDateStr}`;
    request.get(flowUrl, function (error, response, body) {
        if(error){

        }
        console.log(body);
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': body.href});
        res.write(JSON.stringify(body));
        res.end();
        return;
    });
}

/**
 * @api {get} /:version/tenants/:tenantUUID/alarms ListAlarm
 * @apiName ListAlarm
 * @apiVersion 1.0.0
 * @apiGroup FlowOfCMCC
 * @apiDescription  获取告警信息
 * @apiParam (input) {string} flowAlmType告警类型（停机告警，流量告警）
 * @apiParam (input) {datetime} timeRange 时间区间，时间格式：yyyy-MM-dd hh24:mm:ss　如[2016-07-10 10:00:00, 2016-07-12 10:00:00]
 *
 * @apiParam (output) {string} mberCode 成员号码
 * @apiParam (output) {string} flowAlmType 告警类型
 * @apiParam (output) {string} flowAlmTime 告警时间
 * @apiParam (output) {string} flowAlmdec 告警描述
 *
 * @apiParamExample  Example Request
 * get:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/alarms?flowAlmType=停机告警&datetime=[2016-07-10 10:00:00, 2016-07-12 10:00:00]
 * Content-Type: application/json;charset=UTF-8;
 *
 * @apiSuccessExample Example Response
 * HTTP/1.1 200
 * Content-Type: application/json;charset=UTF-8;
 * {
 *   'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/alarms?flowAlmType=停机告警&datetime=[2016-07-10 10:00:00, 2016-07-12 10:00:00]',
 *   'items' : [
 *      {
 *          'mberCode' : '',
 *          'flowAlmType' : '',
 *          'flowAlmTime' : '',
 *          'flowAlmdec' : ''
 *      },
 *      {
 *          ...
 *      },
 *      ...
 * }
 */
exports.alarms = (req, res, next) => {
    let msisdn = req.query.phone;
    let dateStr = req.query.datetime;

    let url = `http://IP:端口/openapi/router?
    appKey=u4xqdmasy8&
    format=json&
    v=2.0&
    method=iot.member.alarm.query&
    msisdn=${msisdn}&
    sign=1c68a1f499ddf6cec24e2e1e5736b9ce&
    dateStr=${dateStr}`;
    request.get(url, function (error, response, body) {
        if(error){

        }
        console.log(body);
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': body.href});
        res.write(JSON.stringify(body));
        res.end();
        return;
    });
}

//手机开停  ncode 11 停 、12 开
exports.sim = (req, res, next) => {
    let msisdn = req.query.phone;
    let optType = req.query.optType;

    let url = `http://120.197.89.173:8081/openapi/router?
    appKey=u4xqdmasy8&
    format=json&
    v=2.0&
    method=iot.member.simstate.change&
    msisdn=${msisdn}&
    sign=1c68a1f499ddf6cec24e2e1e5736b9ce&
    optType=${optType}`;
    request.get(url, function (error, response, body) {
        if(error){

        }
        console.log(body);
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': body.href});
        res.write(JSON.stringify(body));
        res.end();
        return;
    });
}

//GPRS开停  opttype 5 停 、6 开
exports.dataservice = (req, res, next) => {
    let msisdn = req.query.phone;
    let optType = req.query.optType;

    let url = `http://120.197.89.173:8081/openapi/router?
    appKey=u4xqdmasy8&
    format=json&
    v=2.0&
    method=iot.member.dataservicestate.change&
    msisdn=${msisdn}&
    sign=1c68a1f499ddf6cec24e2e1e5736b9ce&
    optType=${optType}`;

    request.get(url, function (error, response, body) {
        if(error){

        }
        console.log(body);
        res.writeHead(201, {'Content-Type': common.retContentType, 'Location': body.href});
        res.write(JSON.stringify(body));
        res.end();
        return;
    });
}