/**
 * Copyright(C),
 * FileName:  common.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/25  14:17
 * Description:
 */
"use strict";
var config = require("../config/config");

exports.knex = require('knex')({client : config.knex_client, connection : config.knex_connection, pool : config.knex_pool});