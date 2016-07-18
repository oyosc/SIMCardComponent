/**
 * Created by Administrator on 2016/4/22.
 */

"use strict";
var ranaly = require('node_ranaly');
var redis = require('./redis');
//var client = ranaly.createClient(redis, 'Ranaly:');
var client = ranaly.createClient(6379, '127.0.0.1', 'Ranaly:');

//次数统计
class AmountStatistics {
    constructor(name) {
        this.amount = new client.Amount(name);
    }

    //参数increment指增加的数量，默认为1。when指增长发生的时间，Date类型，默认为new Date()，即当前时间。callback的第二个参数返回增长后的总数
    incr(increment, when, callback) {
        this.amount.incr(increment, when, callback);
    }

    //第一个参数是时间的数组，时间的表示方法为YYYYMMDD或YYYYMMDDHH。callback的第二个参数返回对应的数量
    get(timeList, callback) {
        this.amount.get(timeList, callback);
    }

    //用来获取实例在若干个时间内总共的数量，使用方法和get一样。特例是当第一个参数为空时，sum会返回该Amount实例的总数。
    sum(timeList, callback) {
        this.amount.sum(timeList, callback);
    }
}

exports.AmountStatistics = AmountStatistics;

//数据记录
class DataListRecord {
    constructor(name) {
        this.dataList = new client.DataList(name);
    }

    //用来向实例加入一个元素，data可以是字符串、数组、数组或对象类型。trim表示保留的记录数量，默认为100
    push(data, trim, callback) {
        this.dataList.push(data, trim, callback);
    }

    //用来获得队列中的某个片段，第一个参数表示起始元素索引，第二个元素表示末尾元素索引。索引从0开始，支持负索引，即-1表示队列中最后一个元素。
    range(start, stop, callback) {
        this.dataList.range(start, stop, callback);
    }

    //用来获得实例的大小
    len(callback) {
        this.dataList.len(callback);
    }
}

exports.DataListRecord = DataListRecord;

//var vs = new AmountStatistics('InterfaceCall');
//vs.incr(function(err, total) {
//    console.log(total);
//
//    vs.get(['2016042210','2016042211','2016042216'], function(err, result) {
//        if (err) {
//            console.log(err);
//            return;
//        }
//
//        console.log(result);
//    });
//});

//var ds = new DataListRecord('DataStat');
//ds.push({
//    url : '/test',
//    userID : 30
//}, 20, function(err, length) {
//    console.log(length);
//
//    ds.range(0, -1, function(err, result) {
//        result.forEach(function (result) {
//            console.log(result.url);
//            console.log(result.userID);
//        });
//    });
//});

//var vs2 = new AmountStatistics('InterfaceCall');
//vs2.get(['2016042210','2016042211','2016042216'], function(err, result) {
//    if (err) {
//        console.log(err);
//        return;
//    }
//
//    console.log(result);
//});