/**
 * Copyright(C),
 * FileName:  messageProducerCentre.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/6/14  10:20
 * Description:
 */

'use strict';
var log = require("../common/log").getLogger();
var kafkaNode = require('kafka-node');
var config = require('../config/config');
class MessageProducer{
    constructor(clientName) {
        if (config.is_sendMessage) {
            //this.client = new kafkaNode.Client(config.kafkaConfig.host + ':' + config.kafkaConfig.port, clientName ? clientName : toString(Date.now()));
            this.client = new kafkaNode.Client(config.kafkaConfig.host + ':' + config.kafkaConfig.port, clientName ? clientName : 'MerchandiseComponent');
            this.producer = new kafkaNode.HighLevelProducer(this.client);
        }
    };

    // @ param : message is obj of message;
    sendMessage(topic, message, callback){
        if (config.is_sendMessage) {
            var payloads = [
                { topic: topic , messages: message.toString()}
            ];
            this.producer.send(payloads, function(error, data){
                if(error){
                    log.error(error);
                }
                callback(error, data);
            });
        } else {
            callback(null, true);
        }
    };

    createTopics(topicName, callback){
        if (config.is_sendMessage) {
            var tmpThis = this;
            this.client.topicExists([topicName], function (err) {
                if (err && err.topics && err.topics[0] == topicName) {
                    tmpThis.producer.createTopics([topicName], false, function (err, data) {
                        callback(err, data);
                    });
                }else{
                    callback(null, true);
                }
            });
        } else {
            callback(null, true);
        }
    }
    removeTopics(topicName, callback){
        this.client = new kafkaNode.Client(config.kafkaConfig.host + ':' + config.kafkaConfig.port,  'MerchandiseComponent');
        this.consumer= new kafkaNode.HighLevelConsumer(this.client, [{topic:topicName}]);
        this.consumer.removeTopics([topicName], function (err, removed) {
            if(removed>0){
                callback(err, true);
            }else{
                callback(err);
            }
        });

        //this.consumer.commit(function(err, data) {

        //});
    }
};
exports.MessageProducer = MessageProducer;