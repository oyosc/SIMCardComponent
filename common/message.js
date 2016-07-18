/**
 * Copyright(C),
 * FileName:  message.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/6/14  10:30
 * Description:
 */

'use strict';

var CM_MERCHANDISE = 100;

var MessageId = {
    // Service(服务)消息
    Create_Service_Success : CM_MERCHANDISE,
    Update_Service_Success : CM_MERCHANDISE + 1,
    Delete_Service_Success : CM_MERCHANDISE + 2
};
exports.MessageId = MessageId;

class Message {
    constructor(id, data) {
        this.msg = {id: id, data: data};
    };

    toString(){
        return JSON.stringify(this.msg);
    }
};
exports.Message = Message;