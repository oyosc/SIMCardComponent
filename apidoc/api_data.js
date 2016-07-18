define({ "api": [
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/batchNORules",
    "title": "CreateBatchNORule",
    "name": "CreateBatchNORule",
    "version": "1.0.0",
    "group": "BatchNORule",
    "description": "<p>创建一个批次号规则（年Y、月M、周W、日D、流水号F/0）</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "rule",
            "description": "<p>如YYYYMMWWDDFFF,F表示十六进制，0表示十进制</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "complementCode",
            "description": "<p>流水号补位码</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNumbers",
            "description": "<p>该规则下所有的批次号URL链接，见<a href=\"#api-BatchNumber\">BatchNumber</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules\nContent-Type: application/json;charset=UTF-8\n{\n  \"rule\": 'YYYYMMWWDDFFF',\n  \"complementCode\": '0'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F\",\n  \"rule\": 'YYYYMMWWDDFFF',\n  \"complementCode\": '0'\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"batchNumbers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNORuleOperator.js",
    "groupTitle": "BatchNORule",
    "groupDescription": "<p>批次号规则(BatchNORule)资源是批次号生成规则； 它可以用来指导设备<a href=\"#api-SIMCard\">SIMCard</a>的批次号生成；</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID",
    "title": "DeleteBatchNORule",
    "name": "DeleteBatchNORule",
    "version": "1.0.0",
    "group": "BatchNORule",
    "description": "<p>删除指定批次号规则信息</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNORuleOperator.js",
    "groupTitle": "BatchNORule",
    "groupDescription": "<p>批次号规则(BatchNORule)资源是批次号生成规则； 它可以用来指导设备<a href=\"#api-SIMCard\">SIMCard</a>的批次号生成；</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/batchNORules",
    "title": "ListBatchNORules",
    "name": "ListBatchNORules",
    "version": "1.0.0",
    "group": "BatchNORule",
    "description": "<p>获取指定批次号规则信息列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNumbers[offset, limit]、tenant或他们的组合，中间用','号隔开</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/0000CqrNgrzcIGYs1PfP4F\",\n         \"rule\": 'YYYYMMWWDDFFF',\n         ...\n     },\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/0000CqrNgrzcIGYs1PfP4F\",\n         \"rule\": 'YYYYMMWWDDFFF',\n         ... remaining batchNORule name/value pairs ...\n     },\n     ... remaining items of batchNORule ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNORuleOperator.js",
    "groupTitle": "BatchNORule",
    "groupDescription": "<p>批次号规则(BatchNORule)资源是批次号生成规则； 它可以用来指导设备<a href=\"#api-SIMCard\">SIMCard</a>的批次号生成；</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID",
    "title": "RetrieveBatchNORule",
    "name": "RetrieveBatchNORule",
    "version": "1.0.0",
    "group": "BatchNORule",
    "description": "<p>获取指定批次号规则信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是applications[offset, limit]、tenant或他们的组合，中间用','号隔开</p>"
          }
        ],
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "rule",
            "description": "<p>如YYYYMMWWDDFFF,F表示十六进制，0表示十进制</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "complementCode",
            "description": "<p>流水号补位码</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNumbers",
            "description": "<p>该规则下所有的批次号URL链接，见<a href=\"#api-BatchNumber\">BatchNumber</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F\",\n  \"rule\": 'YYYYMMWWDDFFF',\n  \"complementCode\": '0'\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"batchNumbers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNORuleOperator.js",
    "groupTitle": "BatchNORule",
    "groupDescription": "<p>批次号规则(BatchNORule)资源是批次号生成规则； 它可以用来指导设备<a href=\"#api-SIMCard\">SIMCard</a>的批次号生成；</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers",
    "title": "CreateBatchNumber",
    "name": "CreateBatchNumber",
    "version": "1.0.0",
    "group": "BatchNumber",
    "description": "<p>创建一个批次号</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "batchNumber",
            "description": "<p>批次号</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNORule",
            "description": "<p>批次号规则URL链接，见<a href=\"#api-BatchNORule\">BatchNORule</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers\nContent-Type: application/json;charset=UTF-8\n{\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F\",\n  \"batchNumber\": \"2015091007\",\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"batchNORule\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNumbers.js",
    "groupTitle": "BatchNumber",
    "groupDescription": "<p>批次号(BatchNumber)资源是SIM卡批次号</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers/:batchNumberUUID",
    "title": "DeleteBatchNumber",
    "name": "DeleteBatchNumber",
    "version": "1.0.0",
    "group": "BatchNumber",
    "description": "<p>删除指定批次号信息</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNumbers.js",
    "groupTitle": "BatchNumber",
    "groupDescription": "<p>批次号(BatchNumber)资源是SIM卡批次号</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers",
    "title": "ListBatchNumbers",
    "name": "ListBatchNumbers",
    "version": "1.0.0",
    "group": "BatchNumber",
    "description": "<p>获取指定批次号信息列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNORule、tenant或他们的组合，中间用','号隔开</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/0000CqrNgrzcIGYs1PfP4F\",\n         \"bigClass\": 1,\n         \"subClass\": 2,\n         ...\n     },\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/0000CqrNgrzcIGYs1PfP4F\",\n         \"bigClass\": 1,\n         \"subClass\": 2,\n         ... remaining BatchNumber name/value pairs ...\n     },\n     ... remaining items of BatchNumber ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNumbers.js",
    "groupTitle": "BatchNumber",
    "groupDescription": "<p>批次号(BatchNumber)资源是SIM卡批次号</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/batchNORules/:batchNORuleUUID/batchNumbers/:batchNumberUUID",
    "title": "RetrieveBatchNumber",
    "name": "RetrieveBatchNumber",
    "version": "1.0.0",
    "group": "BatchNumber",
    "description": "<p>获取指定批次号信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是batchNORule、tenant或他们的组合，中间用','号隔开</p>"
          }
        ],
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "batchNumber",
            "description": "<p>批次号</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNORule",
            "description": "<p>批次号规则URL链接，见<a href=\"#api-BatchNORule\">BatchNORule</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F/batchNumbers/57YZCqrNgrzcIGYs1PfP4F\",\n  \"batchNumber\": \"2015091007\",\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"batchNORule\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules/57YZCqrNgrzcIGYs1PfP4F\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/batchNumbers.js",
    "groupTitle": "BatchNumber",
    "groupDescription": "<p>批次号(BatchNumber)资源是SIM卡批次号</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/carriers",
    "title": "CreateCarrier",
    "name": "CreateCarrier",
    "version": "1.0.0",
    "group": "Carrier",
    "description": "<p>创建一个运营商</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>组名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "leaderCarrier",
            "description": "<p>上级运营商名称</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>运营商描述 (0&lt;=N&lt;1000)</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>运营商名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "leaderCarrier",
            "description": "<p>上级运营商名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>运营商描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该运营商下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackages",
            "description": "<p>该运营商下所有的流量套餐URL链接，见<a href=\"#api-FlowPackage\">flowPackage</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPools",
            "description": "<p>该运营商下所有的流量池URL链接，见<a href=\"#api-FlowPool\">flowPool</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该运营商的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"运营商名称\",\n  \"leaderCarrier\" : “上级运营商名称”,\n  \"status\": \"ENABLED\",\n  \"description\": \"运营商描述\",\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\",\n  \"name\": \"组名称\",\n  \"leaderCarrier\" : “上级运营商名称”,\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{},\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"flowPackages\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages\"\n  },\n  \"flowPools\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/carriers.js",
    "groupTitle": "Carrier",
    "groupDescription": "<p>运营商(Carrier)资源是一个运营商类资源； 它可以用来对流量套餐<a href=\"#api-flowPackage\">flowPackage</a>或流量池<a href=\"#api-flowPool\">flowPool</a>进行分组；</p> <p>Carrier资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID",
    "title": "DeleteCarrier",
    "name": "DeleteCarrier",
    "version": "1.0.0",
    "group": "Carrier",
    "description": "<p>删除指定运营商</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/carriers.js",
    "groupTitle": "Carrier",
    "groupDescription": "<p>运营商(Carrier)资源是一个运营商类资源； 它可以用来对流量套餐<a href=\"#api-flowPackage\">flowPackage</a>或流量池<a href=\"#api-flowPool\">flowPool</a>进行分组；</p> <p>Carrier资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/carriers",
    "title": "ListCarriers",
    "name": "ListCarriers",
    "version": "1.0.0",
    "group": "Carrier",
    "description": "<p>获取指定运营商信息列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>运营商名称,支持模糊查询，如 '<em>名称</em>'</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、organization、groupMemberships[offset,limit]或他们的组合，</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers",
          "type": "json"
        },
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/carriers?offset=0&limit=10&name=运营商名称",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/carriers\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/0000CqrNgrzcIGYs1PfP4F\",\n         \"leaderCarrier\" : “上级运营商名称”\n         \"name\": \"运营商名称\",\n         \"status\": \"ENABLED\",\n         \"description\": \"运营商描述\",\n         \"customData\":{},\n         ...\n     },\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/0000CqrNgrzcIGYs1PfP4F\",\n         \"leaderCarrier\" : “上级运营商名称”\n         \"name\": \"运营商名称\",\n         \"status\": \"ENABLED\",\n         \"description\": \"运营商描述\",\n         \"customData\":{},\n         ... remaining carriers name/value pairs ...\n     },\n     ... remaining items of carriers ...\n   ]\n }",
          "type": "json"
        },
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/carriers?offset=0&limit=10&name=运营商名称\",\n     \"offset\":\"0\",\n     \"limit\":\"10\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"运营商名称\",\n         \"leaderCarrier\" : “上级运营商名称”\n         \"status\": \"ENABLED\",\n         \"description\": \"运营商描述\",\n         \"customData\":{},\n         ...\n     },\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"运营商名称\",\n         \"leaderCarrier\" : “上级运营商名称”\n         \"status\": \"ENABLED\",\n         \"description\": \"运营商描述\",\n         \"customData\":{},\n         ... remaining carriers name/value pairs ...\n     },\n     ... remaining items of carriers(\"name\"=\"运营商名称\") ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/carriers.js",
    "groupTitle": "Carrier",
    "groupDescription": "<p>运营商(Carrier)资源是一个运营商类资源； 它可以用来对流量套餐<a href=\"#api-flowPackage\">flowPackage</a>或流量池<a href=\"#api-flowPool\">flowPool</a>进行分组；</p> <p>Carrier资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID",
    "title": "RetrieveCarrier",
    "name": "RetrieveCarrier",
    "version": "1.0.0",
    "group": "Carrier",
    "description": "<p>获取指定运营商信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、flowPackage[offset,limit]、flowPools[offset,limit]或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>运营商名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "leaderCarrier",
            "description": "<p>上级运营商名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>运营商描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该运营商下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackages",
            "description": "<p>该运营商下所有的流量套餐URL链接，见<a href=\"#api-FlowPackage\">flowPackage</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPools",
            "description": "<p>该运营商下所有的流量池URL链接，见<a href=\"#api-FlowPool\">flowPool</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该运营商的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\",\n  \"name\": \"组名称\",\n  \"leaderCarrier\" : “上级运营商名称”,\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{},\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"flowPackages\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages\"\n  },\n  \"flowPools\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/carriers.js",
    "groupTitle": "Carrier",
    "groupDescription": "<p>运营商(Carrier)资源是一个运营商类资源； 它可以用来对流量套餐<a href=\"#api-flowPackage\">flowPackage</a>或流量池<a href=\"#api-flowPool\">flowPool</a>进行分组；</p> <p>Carrier资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID",
    "title": "UpdateCarrier",
    "name": "UpdateCarrier",
    "version": "1.0.0",
    "group": "Carrier",
    "description": "<p>更新运营商信息</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>运营商名称</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "leaderCarrier",
            "description": "<p>上级运营商名称</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>运营商描述</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>运营商名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "leaderCarrier",
            "description": "<p>上级运营商名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>运营商描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该运营商下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackages",
            "description": "<p>该运营商下所有的流量套餐URL链接，见<a href=\"#api-FlowPackage\">flowPackage</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPools",
            "description": "<p>该运营商下所有的流量池URL链接，见<a href=\"#api-FlowPool\">flowPool</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该运营商的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"运营商名称\",\n  \"leaderCarrier\" : “上级运营商名称”,\n  \"status\": \"ENABLED\",\n  \"description\": \"运营商描述\",\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\",\n  \"name\": \"组名称\",\n  \"leaderCarrier\" : “上级运营商名称”,\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{},\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"flowPackages\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages\"\n  },\n  \"flowPools\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/carriers.js",
    "groupTitle": "Carrier",
    "groupDescription": "<p>运营商(Carrier)资源是一个运营商类资源； 它可以用来对流量套餐<a href=\"#api-flowPackage\">flowPackage</a>或流量池<a href=\"#api-flowPool\">flowPool</a>进行分组；</p> <p>Carrier资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/directories",
    "title": "CreateDirectory",
    "name": "CreateDirectory",
    "version": "1.0.0",
    "group": "Directory",
    "description": "<p>创建一个目录</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述 (0&lt;=N&lt;1000)</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该组下所有的设备URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该目录所在组织列表，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>该目录所在组织关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\":{},\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n \"organizations\" : {\n    \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizations\"\n },\n \"organizationMemberships\" : {\n    \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/directories.js",
    "groupTitle": "Directory",
    "groupDescription": "<p>目录(Directory)资源是一个容器类资源； 它可以用来对设备<a href=\"#api-SIMCard\">SIMCard</a>进行存储；</p> <p>Directory资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID",
    "title": "DeleteDirectory",
    "name": "DeleteDirectory",
    "version": "1.0.0",
    "group": "Directory",
    "description": "<p>删除指定目录信息</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/directories.js",
    "groupTitle": "Directory",
    "groupDescription": "<p>目录(Directory)资源是一个容器类资源； 它可以用来对设备<a href=\"#api-SIMCard\">SIMCard</a>进行存储；</p> <p>Directory资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/directories",
    "title": "ListDirectories",
    "name": "ListDirectories",
    "version": "1.0.0",
    "group": "Directory",
    "description": "<p>获取指定目录信息列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>组名称,支持模糊查询，如 '<em>名称</em>'</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "type",
            "description": "<p>类型</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCard[offset, limit]、organizations[offset, limit]或他们的组合，中间用','号隔开</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"名称\",\n         \"status\": \"ENABLED\",\n         \"description\": \"描述\",\n         \"customData\":{},\n         ...\n     },\n     {\n         \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"名称\",\n         \"description\": \"描述\",\n         ... remaining directories name/value pairs ...\n     },\n     ... remaining items of directories ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/directories.js",
    "groupTitle": "Directory",
    "groupDescription": "<p>目录(Directory)资源是一个容器类资源； 它可以用来对设备<a href=\"#api-SIMCard\">SIMCard</a>进行存储；</p> <p>Directory资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID",
    "title": "RetrieveDirectory",
    "name": "RetrieveDirectory",
    "version": "1.0.0",
    "group": "Directory",
    "description": "<p>获取指定目录信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCard[offset, limit]、organizations[offset, limit]、tenant或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该组下所有的设备URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该目录所在组织列表，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>该目录所在组织关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\":{},\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n \"organizations\" : {\n    \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizations\"\n },\n \"organizationMemberships\" : {\n    \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/directories.js",
    "groupTitle": "Directory",
    "groupDescription": "<p>目录(Directory)资源是一个容器类资源； 它可以用来对设备<a href=\"#api-SIMCard\">SIMCard</a>进行存储；</p> <p>Directory资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID",
    "title": "UpdateDirectory",
    "name": "UpdateDirectory",
    "version": "1.0.0",
    "group": "Directory",
    "description": "<p>更新目录信息</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述 (0&lt;=N&lt;1000)</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该组下所有的设备URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该目录所在组织列表，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>该目录所在组织关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "PUT https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"组名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\":{},\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n \"organizations\" : {\n    \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizations\"\n },\n \"organizationMemberships\" : {\n    \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/directories.js",
    "groupTitle": "Directory",
    "groupDescription": "<p>目录(Directory)资源是一个容器类资源； 它可以用来对设备<a href=\"#api-SIMCard\">SIMCard</a>进行存储；</p> <p>Directory资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/groups",
    "title": "CreateGroup",
    "name": "CreateGroup",
    "version": "1.0.0",
    "group": "Group",
    "description": "<p>创建一个组</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>组名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>组描述 (0&lt;=N&lt;1000)</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>组名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>组描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCard",
            "description": "<p>该组下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groupMemberships",
            "description": "<p>与该组关联的关系列表，见<a href=\"#api-GroupMembership\">GroupMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该组所在组织列表，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>该组所在组织关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"组名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"组名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{},\n  \"groupMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/groupMemberships\"\n  },\n  \"organizations\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizations\"\n  },\n  \"organizationMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n  },\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupDB.js",
    "groupTitle": "Group",
    "groupDescription": "<p>设备组(Group)资源是一个商品容器类资源； 它可以用来对sim卡<a href=\"#api-SIMCard\">SIMCard</a>进行分组；</p> <p>Group资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/groups/:groupUUID",
    "title": "DeleteGroup",
    "name": "DeleteGroup",
    "version": "0.0.1",
    "group": "Group",
    "description": "<p>删除指定组</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupDB.js",
    "groupTitle": "Group",
    "groupDescription": "<p>设备组(Group)资源是一个商品容器类资源； 它可以用来对sim卡<a href=\"#api-SIMCard\">SIMCard</a>进行分组；</p> <p>Group资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/groups",
    "title": "ListGroups",
    "name": "ListGroups",
    "version": "0.0.1",
    "group": "Group",
    "description": "<p>获取指定组信息列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>组名称,支持模糊查询，如 '<em>名称</em>'</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、organization、groupMemberships[offset,limit]或他们的组合，</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups",
          "type": "json"
        },
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/groups?offset=0&limit=10&name=组名称",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/groups\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"组名称\",\n         \"status\": \"ENABLED\",\n         \"description\": \"组描述\",\n         \"customData\":{},\n         ...\n     },\n     {\n         \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"组名称\",\n         \"description\": \"组描述\",\n         ... remaining groups name/value pairs ...\n     },\n     ... remaining items of groups ...\n   ]\n }",
          "type": "json"
        },
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/groups?offset=0&limit=10&name=组名称\",\n     \"offset\":\"0\",\n     \"limit\":\"10\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"组名称\",\n         \"status\": \"ENABLED\",\n         \"description\": \"组描述\",\n         \"customData\":{},\n         ...\n     },\n     {\n         \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"组名称\",\n         \"description\": \"组描述\",\n         ... remaining groups name/value pairs ...\n     },\n     ... remaining items of groups(\"name\"=\"组名称\") ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupDB.js",
    "groupTitle": "Group",
    "groupDescription": "<p>设备组(Group)资源是一个商品容器类资源； 它可以用来对sim卡<a href=\"#api-SIMCard\">SIMCard</a>进行分组；</p> <p>Group资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/groupMemberships",
    "title": "CreateGroupMembership",
    "name": "CreateGroupMembership",
    "version": "1.0.0",
    "group": "GroupMembership",
    "description": "<p>创建一个sim卡与组的关系</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "url",
            "optional": false,
            "field": "sim",
            "description": "<p>卡，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "input",
            "type": "url",
            "optional": false,
            "field": "group",
            "description": "<p>组，见<a href=\"#api-Group\">Group</a>资源</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "sim",
            "description": "<p>卡，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "group",
            "description": "<p>组，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships\nContent-Type: application/json;charset=UTF-8\n{\n  'simCard' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'\n  },\n  'group':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F'\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F',\n  'simCard' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'\n  },\n  'group':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F'\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupMemberships.js",
    "groupTitle": "GroupMembership"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/groupMemberships/:groupMembershipUUID",
    "title": "DeleteGroupMembership",
    "name": "DeleteGroupMembership",
    "version": "0.0.1",
    "group": "GroupMembership",
    "description": "<p>删除指定sim卡与组的关系</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupMemberships.js",
    "groupTitle": "GroupMembership"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/groupMemberships/:groupMembershipUUID",
    "title": "RetrieveGroupMembership",
    "name": "RetrieveGroupMembership",
    "version": "1.0.0",
    "group": "GroupMembership",
    "description": "<p>获取指定sim卡与组的关系信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是group,simCard或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "sim",
            "description": "<p>卡，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "group",
            "description": "<p>组，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F',\n  'simCard' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F/simCards/g2r22qrNgrzcIGYs1Pfr4g'\n  },\n  'group':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F'\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupMemberships.js",
    "groupTitle": "GroupMembership"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/groups/:groupUUID",
    "title": "RetrieveGroup",
    "name": "RetrieveGroup",
    "version": "0.0.1",
    "group": "Group",
    "description": "<p>获取指定组信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、organization、groupMemberships[offset,limit]或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>组名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>组描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCard",
            "description": "<p>该组下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groupMemberships",
            "description": "<p>与该组关联的关系列表，见<a href=\"#api-GroupMembership\">GroupMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该组所在组织列表，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>该组所在组织关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"组名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{},\n  \"groupMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/groupMemberships\"\n  },\n  \"organizations\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizations\"\n  },\n  \"organizationMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n  },\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupDB.js",
    "groupTitle": "Group",
    "groupDescription": "<p>设备组(Group)资源是一个商品容器类资源； 它可以用来对sim卡<a href=\"#api-SIMCard\">SIMCard</a>进行分组；</p> <p>Group资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/groups/:groupUUID",
    "title": "UpdateGroup",
    "name": "UpdateGroup",
    "version": "1.0.0",
    "group": "Group",
    "description": "<p>更新组信息</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>组名称</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>组描述</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>组名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>组描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCard",
            "description": "<p>该组下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groupMemberships",
            "description": "<p>与该组关联的关系列表，见<a href=\"#api-GroupMembership\">GroupMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该组所在组织列表，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>该组所在组织关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"组名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\"\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"组名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"组描述\",\n  \"customData\":{},\n  \"groupMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/groupMemberships\"\n  },\n  \"organizations\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizations\"\n  },\n  \"organizationMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n  },\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/groupDB.js",
    "groupTitle": "Group",
    "groupDescription": "<p>设备组(Group)资源是一个商品容器类资源； 它可以用来对sim卡<a href=\"#api-SIMCard\">SIMCard</a>进行分组；</p> <p>Group资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/organizations",
    "title": "CreateOrganization",
    "name": "CreateOrganization",
    "version": "1.0.0",
    "group": "Organization",
    "description": "<p>创建一个组织</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述 (0&lt;=N&lt;1000)</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该组织下所有的SIM卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该组织下所有的组URL链接，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directories",
            "description": "<p>该组织下所有的目录URL链接，见<a href=\"#api-Directory\">Directory</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>与该组织关联的关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组织的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\":{},\n  \"simCards\"  : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"groups\"  : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/groups\"\n  },\n  \"directories\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/directories\"\n  },\n  \"organizationMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizations.js",
    "groupTitle": "Organization",
    "groupDescription": "<p>组织(Organization)资源是一个管理类资源； 它可以用来对目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>进行管理；</p> <p>Organization资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/organizations/:organizationUUID",
    "title": "DeleteOrganization",
    "name": "DeleteOrganization",
    "version": "1.0.0",
    "group": "Organization",
    "description": "<p>删除指定组织</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizations.js",
    "groupTitle": "Organization",
    "groupDescription": "<p>组织(Organization)资源是一个管理类资源； 它可以用来对目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>进行管理；</p> <p>Organization资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/organizations",
    "title": "ListOrganizations",
    "name": "ListOrganizations",
    "version": "1.0.0",
    "group": "Organization",
    "description": "<p>获取指定组织信息列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>组织名称,支持模糊查询，如 '<em>名称</em>'</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、groups[offset,limit]、directories[offset,limit]、organizationMemberships[offset,limit]或他们的组合，中间用','号隔开</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/organizations\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n         \"href\":\"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"组织名称\",\n         \"status\": \"ENABLED\",\n         \"description\": \"组织描述\",\n         ...\n     },\n     {\n         \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups/0000CqrNgrzcIGYs1PfP4F\",\n         \"name\": \"组织名称\",\n         \"description\": \"组织描述\",\n         ... remaining organizations name/value pairs ...\n     },\n     ... remaining items of organizations ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizations.js",
    "groupTitle": "Organization",
    "groupDescription": "<p>组织(Organization)资源是一个管理类资源； 它可以用来对目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>进行管理；</p> <p>Organization资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/organizationMemberships",
    "title": "CreateOrganizationMembership",
    "name": "CreateOrganizationMembership",
    "version": "1.0.0",
    "group": "OrganizationMembership",
    "description": "<p>创建一个组织关系</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "url",
            "optional": false,
            "field": "store",
            "description": "<p>目录，见<a href=\"#api-Directory\">Directory</a>资源；或组，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "input",
            "type": "url",
            "optional": false,
            "field": "organization",
            "description": "<p>组织，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "store",
            "description": "<p>目录，见<a href=\"#api-Directory\">Directory</a>资源；或组，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organization",
            "description": "<p>组织，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships\nContent-Type: application/json;charset=UTF-8\n{\n  'store' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F'\n  },\n  'organization':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F'\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F',\n  'store' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F'\n  },\n  'organization':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F'\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizationMemberships.js",
    "groupTitle": "OrganizationMembership",
    "groupDescription": "<p>组织关系(OrganizationMembership)资源是用来保存组织<a href=\"#api-Organization\">Organization</a>与目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>关系</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/organizationMemberships/:organizationMembershipUUID",
    "title": "DeleteOrganizationMembership",
    "name": "DeleteOrganizationMembership",
    "version": "1.0.0",
    "group": "OrganizationMembership",
    "description": "<p>删除指定的关系</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizationMemberships.js",
    "groupTitle": "OrganizationMembership",
    "groupDescription": "<p>组织关系(OrganizationMembership)资源是用来保存组织<a href=\"#api-Organization\">Organization</a>与目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>关系</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/organizationMemberships/:organizationMembershipUUID",
    "title": "RetrieveOrganizationMembership",
    "name": "RetrieveOrganizationMembership",
    "version": "1.0.0",
    "group": "OrganizationMembership",
    "description": "<p>获取指定组织的关系信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是directory,group,organization或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "store",
            "description": "<p>目录，见<a href=\"#api-Directory\">Directory</a>资源；或组，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organization",
            "description": "<p>组织，见<a href=\"#api-Organization\">Organization</a>资源</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groupMemberships/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizationMemberships/57YZCqrNgrzcIGYs1PfP4F',\n  'store' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/57YZCqrNgrzcIGYs1PfP4F'\n  },\n  'organization':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/0000CqrNgrzcIGYs1PfP4F'\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizationMemberships.js",
    "groupTitle": "OrganizationMembership",
    "groupDescription": "<p>组织关系(OrganizationMembership)资源是用来保存组织<a href=\"#api-Organization\">Organization</a>与目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>关系</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/organizations/:organizationUUID",
    "title": "RetrieveOrganization",
    "name": "RetrieveOrganization",
    "version": "0.0.1",
    "group": "Organization",
    "description": "<p>获取指定组织信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、groups[offset,limit]、directories[offset,limit]、organizationMemberships[offset,limit]或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该组织下所有的SIM卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该组织下所有的组URL链接，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directories",
            "description": "<p>该组织下所有的目录URL链接，见<a href=\"#api-Directory\">Directory</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>与该组织关联的关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组织的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\":{},\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"groups\"  : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/groups\"\n  },\n  \"directories\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/directories\"\n  },\n  \"organizationMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizations.js",
    "groupTitle": "Organization",
    "groupDescription": "<p>组织(Organization)资源是一个管理类资源； 它可以用来对目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>进行管理；</p> <p>Organization资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/organizations/:organizationUUID",
    "title": "UpdateOrganization",
    "name": "UpdateOrganization",
    "version": "1.0.0",
    "group": "Organization",
    "description": "<p>更新组织信息</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述 (0&lt;=N&lt;1000)</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该组织下所有的SIM卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该组织下所有的组URL链接，见<a href=\"#api-Group\">Group</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directories",
            "description": "<p>该组织下所有的目录URL链接，见<a href=\"#api-Directory\">Directory</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizationMemberships",
            "description": "<p>与该组织关联的关系列表，见<a href=\"#api-OrganizationMembership\">OrganizationMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组织的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"customData\":{},\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"groups\"  : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/groups\"\n  },\n  \"directories\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/directories\"\n  },\n  \"organizationMemberships\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations/57YZCqrNgrzcIGYs1PfP4F/organizationMemberships\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/organizations.js",
    "groupTitle": "Organization",
    "groupDescription": "<p>组织(Organization)资源是一个管理类资源； 它可以用来对目录<a href=\"#api-Directory\">Directory</a>或组<a href=\"#api-Group\">Group</a>进行管理；</p> <p>Organization资源在一个Tenant中是唯一的，包括：name字段</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/packageMemberships",
    "title": "CreatePackageMembership",
    "name": "CreatePackageMembership",
    "version": "1.0.0",
    "group": "PackageMembership",
    "description": "<p>创建一个SIM卡关系</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "url",
            "optional": false,
            "field": "flowPackage",
            "description": "<p>流量包，见<a href=\"#api-FlowPackage\">FlowPackage</a>资源；或流量池，见<a href=\"#api-FlowPool\">FlowPool</a>资源</p>"
          },
          {
            "group": "input",
            "type": "url",
            "optional": false,
            "field": "simCard",
            "description": "<p>SIM卡，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackage",
            "description": "<p>流量包，见<a href=\"#api-FlowPackage\">FlowPackage</a>资源；或流量池，见<a href=\"#api-FlowPool\">FlowPool</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCard",
            "description": "<p>SIM卡，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/packageMemberships\nContent-Type: application/json;charset=UTF-8\n{\n  'flowPackage' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPackages/57YZCqrNgrzcIGYs1PfP4F'\n  },\n  'simCard':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards/0000CqrNgrzcIGYs1PfP4F'\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/packageMemberships/57YZCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8;\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/packageMemberships/57YZCqrNgrzcIGYs1PfP4F',\n  'flowPackage' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPackages/57YZCqrNgrzcIGYs1PfP4F'\n  },\n  'SIMCard':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/SIMCards/0000CqrNgrzcIGYs1PfP4F'\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/packageMemberships.js",
    "groupTitle": "PackageMembership",
    "groupDescription": "<p>流量套餐关系(PackageMembership)资源是用来保存SIM卡<a href=\"#api-SIMCard\">SIMCard</a>与流量套餐<a href=\"#api-FlowPackage\">FlowPackage</a>或流量池<a href=\"#api-FlowPool\">FlowPool</a>关系</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/packageMemberships/:packageMembershipUUID",
    "title": "DeletePackageMembership",
    "name": "DeletePackageMembership",
    "version": "1.0.0",
    "group": "PackageMembership",
    "description": "<p>删除指定的关系</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/packageMemberships/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/packageMemberships.js",
    "groupTitle": "PackageMembership",
    "groupDescription": "<p>流量套餐关系(PackageMembership)资源是用来保存SIM卡<a href=\"#api-SIMCard\">SIMCard</a>与流量套餐<a href=\"#api-FlowPackage\">FlowPackage</a>或流量池<a href=\"#api-FlowPool\">FlowPool</a>关系</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/packageMemberships/:packageMembershipUUID",
    "title": "RetrievePackageMembership",
    "name": "RetrievePackageMembership",
    "version": "1.0.0",
    "group": "PackageMembership",
    "description": "<p>获取指定SIM卡的关系信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是flowPackage,flowPool,simCard或他们的流量池合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackage",
            "description": "<p>流量包，见<a href=\"#api-FlowPackage\">FlowPackage</a>资源；或流量池，见<a href=\"#api-FlowPool\">FlowPool</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCard",
            "description": "<p>SIM卡，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/FlowPoolMemberships/57YZCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/packageMemberships/57YZCqrNgrzcIGYs1PfP4F',\n  'flowPackage' : {\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPackages/57YZCqrNgrzcIGYs1PfP4F'\n  },\n  'simCard':{\n     'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards/0000CqrNgrzcIGYs1PfP4F'\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/packageMemberships.js",
    "groupTitle": "PackageMembership",
    "groupDescription": "<p>流量套餐关系(PackageMembership)资源是用来保存SIM卡<a href=\"#api-SIMCard\">SIMCard</a>与流量套餐<a href=\"#api-FlowPackage\">FlowPackage</a>或流量池<a href=\"#api-FlowPool\">FlowPool</a>关系</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards",
    "title": "CreateSIMCard",
    "name": "CreateSIMCard",
    "version": "1.0.0",
    "group": "SIMCard",
    "description": "<p>创建一个SIM卡</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ICCID",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "IMSI",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "openCardData",
            "description": "<p>开卡日期</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "packageType",
            "description": "<p>套餐管理方式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "batchNO",
            "description": "<p>批次号</p>"
          },
          {
            "group": "Parameter",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>运营商</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "package",
            "description": "<p>套餐/流量池名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "businessStatus",
            "description": "<p>业务状态</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "activeData",
            "description": "<p>激活时间</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "useData",
            "description": "<p>领用时间</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sn",
            "description": "<p>设备SN</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展字段</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "ICCID",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "IMSI",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "openCardData",
            "description": "<p>开卡日期</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "packageType",
            "description": "<p>套餐管理方式</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "batchNO",
            "description": "<p>批次号</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "package",
            "description": "<p>套餐/流量池名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "businessStatus",
            "description": "<p>业务状态</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "activeData",
            "description": "<p>激活时间</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "useData",
            "description": "<p>领用时间</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "sn",
            "description": "<p>设备SN</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展字段</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directory",
            "description": "<p>该SIM卡所在目录的URL链接，见资源<a href=\"#api-Directory\">Directory</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该SIM卡所在组的URL链接，见资源<a href=\"#api-Group\">Groups</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groupMemberships",
            "description": "<p>该SIM卡所在组关系的URL链接，见资源<a href=\"#api-GroupMembership\">GroupMembership</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flows",
            "description": "<p>流量URL链接，见<a href=\"#api-Flow\">Flow</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards\nContent-Type: application/json;charset=UTF-8;\n{\n  'ICCID' : 'W9047090024',\n  'IMEI' : '18666291303',\n  'batchNO' : '2015091007',\n  'status' : '销卡',\n  ...\n  'customData':{\n                 ……values……\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g\nContent-Type: application/json;charset=UTF-8;\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',\n  'ICCID' : 'W9047090024',\n  'IMEI' : '18666291303',\n  'batchNO' : '2015091007',\n  'status' : '销卡',\n  ...\n  'customData':{\n                 ……values……\n  }\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  'directory' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo\"\n  },\n  'tenant' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  'groups' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groups\"\n  },\n  'flows' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows\"\n  },\n  'groupMemberships' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groupMemberships\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/simCards.js",
    "groupTitle": "SIMCard",
    "groupDescription": "<p>SIM卡(SIMCard)资源</p>"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID",
    "title": "DeleteSIMCard",
    "name": "DeleteSIMCard",
    "group": "SIMCard",
    "description": "<p>删除指定SIM卡</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "DELETE:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 NoContent",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/simCards.js",
    "groupTitle": "SIMCard",
    "groupDescription": "<p>SIM卡(SIMCard)资源</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards",
    "title": "ListSIMCards",
    "name": "ListSIMCards",
    "group": "SIMCard",
    "description": "<p>根据特定的字段，获取一系列SIM卡详情信息。</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取记录条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ICCID",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "IMSI",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "openCardData",
            "description": "<p>开卡日期</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "packageType",
            "description": "<p>套餐管理方式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "batchNO",
            "description": "<p>批次号</p>"
          },
          {
            "group": "Parameter",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>运营商</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "package",
            "description": "<p>套餐/流量池名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "businessStatus",
            "description": "<p>业务状态</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "activeData",
            "description": "<p>激活时间</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "useData",
            "description": "<p>领用时间</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sn",
            "description": "<p>设备SN</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是directory、groups[offset,limit]、groupMemberships[offset,limit]或他们的组合，中间用','号隔开。</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  'href':'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards',\n  'offset':0,\n  'limit':25,\n  'items':[\n     {\n         'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',\n         'SN' : '123456789012345',\n         'ICCID' : 'W9047090024',\n         'IMEI' : '18666291303',\n         …… remaining key/value of simCards……\n     }，\n     …… remaining item of simCards……\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/simCards.js",
    "groupTitle": "SIMCard",
    "groupDescription": "<p>SIM卡(SIMCard)资源</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards/:simCardUUID",
    "title": "RetrieveSIMCard",
    "name": "RetrieveSIMCard",
    "version": "1.0.0",
    "group": "SIMCard",
    "description": "<p>获取指定SIM卡。</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是directory、groups[offset,limit]、groupMemberships[offset,limit]或他们的组合，中间用','号隔开。</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "ICCID",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "IMSI",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "openCardData",
            "description": "<p>开卡日期</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "packageType",
            "description": "<p>套餐管理方式</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "batchNO",
            "description": "<p>批次号</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "package",
            "description": "<p>套餐/流量池名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "businessStatus",
            "description": "<p>业务状态</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "activeData",
            "description": "<p>激活时间</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "useData",
            "description": "<p>领用时间</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "sn",
            "description": "<p>设备SN</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展字段</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directory",
            "description": "<p>该SIM卡所在目录的URL链接，见资源<a href=\"#api-Directory\">Directory</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该SIM卡所在组的URL链接，见资源<a href=\"#api-Group\">Groups</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groupMemberships",
            "description": "<p>该SIM卡所在组关系的URL链接，见资源<a href=\"#api-GroupMembership\">GroupMembership</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flows",
            "description": "<p>流量URL链接，见<a href=\"#api-Flow\">Flow</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',\n  'ICCID' : 'W9047090024',\n  'IMEI' : '18666291303',\n  'batchNO' : '2015091007',\n  'status' : '销卡',\n  ...\n  'customData':{\n                 ……values……\n  }\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  'directory' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo\"\n  },\n  'tenant' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  'groups' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groups\"\n  },\n  'flows' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows\"\n  },\n  'groupMemberships' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groupMemberships\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/simCards.js",
    "groupTitle": "SIMCard",
    "groupDescription": "<p>SIM卡(SIMCard)资源</p>"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/directories/:directoryUUID/simCards",
    "title": "UpdateSIMCard",
    "name": "UpdateSIMCard",
    "version": "1.0.0",
    "group": "SIMCard",
    "description": "<p>更新一个SIM卡</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ICCID",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "IMSI",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "openCardData",
            "description": "<p>开卡日期</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "packageType",
            "description": "<p>套餐管理方式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "batchNO",
            "description": "<p>批次号</p>"
          },
          {
            "group": "Parameter",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>运营商</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "package",
            "description": "<p>套餐/流量池名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "businessStatus",
            "description": "<p>业务状态</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "activeData",
            "description": "<p>激活时间</p>"
          },
          {
            "group": "Parameter",
            "type": "datetime",
            "optional": false,
            "field": "useData",
            "description": "<p>领用时间</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sn",
            "description": "<p>设备SN</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展字段</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "ICCID",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "IMSI",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "openCardData",
            "description": "<p>开卡日期</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "packageType",
            "description": "<p>套餐管理方式</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "batchNO",
            "description": "<p>批次号</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "package",
            "description": "<p>套餐/流量池名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "businessStatus",
            "description": "<p>业务状态</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "activeData",
            "description": "<p>激活时间</p>"
          },
          {
            "group": "output",
            "type": "datetime",
            "optional": false,
            "field": "useData",
            "description": "<p>领用时间</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "sn",
            "description": "<p>设备SN</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展字段</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directory",
            "description": "<p>该SIM卡所在目录的URL链接，见资源<a href=\"#api-Directory\">Directory</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该SIM卡所在组的URL链接，见资源<a href=\"#api-Group\">Groups</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groupMemberships",
            "description": "<p>该SIM卡所在组关系的URL链接，见资源<a href=\"#api-GroupMembership\">GroupMembership</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该组的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flows",
            "description": "<p>流量URL链接，见<a href=\"#api-Flow\">Flow</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "put:  https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards\nContent-Type: application/json;charset=UTF-8;\n{\n  'ICCID' : 'W9047090024',\n  'IMEI' : '18666291303',\n  'batchNO' : '2015091007',\n  'status' : '销卡',\n  ...\n  'customData':{\n                 ……values……\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g\nContent-Type: application/json;charset=UTF-8;\n{\n  'href' : 'https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g',\n  'ICCID' : 'W9047090024',\n  'IMEI' : '18666291303',\n  'batchNO' : '2015091007',\n  'status' : '销卡',\n  ...\n  'customData':{\n                 ……values……\n  }\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\",\n  'directory' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo\"\n  },\n  'tenant' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  'groups' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groups\"\n  },\n  'flows' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/flows\"\n  },\n  'groupMemberships' : {\n     'href' : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories/jPr4F57weZCqrDsiMYs1fo/simCards/g2r22qrNgrzcIGYs1Pfr4g/groupMemberships\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/simCards.js",
    "groupTitle": "SIMCard",
    "groupDescription": "<p>SIM卡(SIMCard)资源</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/current",
    "title": "RetrieveCurrentTenant",
    "name": "RetrieveCurrentTenant",
    "version": "1.0.0",
    "group": "Tenant",
    "description": "<p>获取指定租赁用户Tenant的信息</p>",
    "parameter": {
      "fields": {
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该Tenant下面的所有的Group集合的URL链接，见<a href=\"#api-Group\">Group</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该Tenant下面的所有的Organization集合的URL链接，见<a href=\"#api-Organization\">Organization</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该Tenant下面的所有的SIMCard集合的URL链接，见<a href=\"#api-SIMCard\">SIMCard</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directories",
            "description": "<p>该Tenant下面的所有的Directory集合的URL链接，见<a href=\"#api-Directory\">Directory</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carriers",
            "description": "<p>该Tenant下面的所有的Carrier集合的URL链接，见<a href=\"#api-Carrier\">Carrier</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNORules",
            "description": "<p>该Tenant下面的所有的BatchNORule集合的URL链接，见<a href=\"#api-BatchNORule\">BatchNORule</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackages",
            "description": "<p>该Tenant下面的所有的FlowPackage集合的URL链接，见<a href=\"#api-FlowPackage\">FlowPackage</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPools",
            "description": "<p>该Tenant下面的所有的FlowPool集合的URL链接，见<a href=\"#api-FlowPool\">FlowPool</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNumbers",
            "description": "<p>该Tenant下面的所有的BatchNumber集合的URL链接，见<a href=\"#api-BatchNumber\">BatchNumber</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://accounts.cyhl.com.cn/api/v1/tenants/current",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\": \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"createAt\": \"2016-01-18T20:46:36.061Z\",\n  \"modifiedAt\": \"2016-01-18T20:46:36.061Z\",\n  \"groups\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups\"\n  },\n  \"organizations\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations\"\n  },\n  \"simCards\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards\"\n  },\n  \"carriers\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"batchNORules\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules\"\n  },\n  \"flowPackages\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPackages\"\n  },\n  \"flowPools\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPools\"\n  },\n  \"batchNumbers\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNumbers\"\n  },\n  \"directories\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories\"\n  },\n  \"customData\":{},\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/tenants.js",
    "groupTitle": "Tenant",
    "groupDescription": "<p>当你在注册使用SIM卡管理组件(SIMCard Component)时，我们会为你创建一个私人空间。</p> <p>你可以使用SIMCard Component REST API 中的租赁用户(Tenant)资源来管理和访问你的私人空间。</p> <p>Tenant资源是你操作SIMCard组件的起始入口点，同时它将为你返回提供其它资源的URL链接(如<a href=\"#api-SIMCard\">SIMCard</a>、<a href=\"#api-Group\">Group</a>、...)。</p> <p>注册SIMCard Component Tenant用户：待定</p> <p>注册完成并通过审核过后，我们将向你发送一封带有API_Key信息的邮件，API_Key将是你访问SIMCard Component的钥匙。</p> <p>访问REST API时，请在HTTP的Header头使用API_Key:</p> <p>&quot;Authorization&quot; : &quot;$API_KEY_ID:$API_KEY_SECRET&quot;</p> <p>&quot;Content-Type”: “application/json;charset=UTF-8”</p>"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID",
    "title": "RetrieveTenant",
    "name": "RetrieveTenant",
    "version": "1.0.0",
    "group": "Tenant",
    "description": "<p>获取指定租赁用户Tenant的信息</p>",
    "parameter": {
      "fields": {
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": ""
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "groups",
            "description": "<p>该Tenant下面的所有的Group集合的URL链接，见<a href=\"#api-Group\">Group</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "organizations",
            "description": "<p>该Tenant下面的所有的Organization集合的URL链接，见<a href=\"#api-Organization\">Organization</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "simCards",
            "description": "<p>该Tenant下面的所有的SIMCard集合的URL链接，见<a href=\"#api-SIMCard\">SIMCard</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "directories",
            "description": "<p>该Tenant下面的所有的Directory集合的URL链接，见<a href=\"#api-Directory\">Directory</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carriers",
            "description": "<p>该Tenant下面的所有的Carrier集合的URL链接，见<a href=\"#api-Carrier\">Carrier</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNORules",
            "description": "<p>该Tenant下面的所有的BatchNORule集合的URL链接，见<a href=\"#api-BatchNORule\">BatchNORule</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPackages",
            "description": "<p>该Tenant下面的所有的FlowPackage集合的URL链接，见<a href=\"#api-FlowPackage\">FlowPackage</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "flowPools",
            "description": "<p>该Tenant下面的所有的FlowPool集合的URL链接，见<a href=\"#api-FlowPool\">FlowPool</a></p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "batchNumbers",
            "description": "<p>该Tenant下面的所有的BatchNumber集合的URL链接，见<a href=\"#api-BatchNumber\">BatchNumber</a></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\": \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\",\n  \"name\": \"名称\",\n  \"status\": \"ENABLED\",\n  \"description\": \"描述\",\n  \"createAt\": \"2016-01-18T20:46:36.061Z\",\n  \"modifiedAt\": \"2016-01-18T20:46:36.061Z\",\n  \"groups\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/groups\"\n  },\n  \"organizations\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/organizations\"\n  },\n  \"simCards\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/simCards\"\n  },\n  \"carriers\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"batchNORules\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNORules\"\n  },\n  \"flowPackages\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPackages\"\n  },\n  \"flowPools\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/flowPools\"\n  },\n  \"batchNumbers\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/batchNumbers\"\n  },\n  \"directories\":{\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/directories\"\n  },\n  \"customData\":{},\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/tenants.js",
    "groupTitle": "Tenant",
    "groupDescription": "<p>当你在注册使用SIM卡管理组件(SIMCard Component)时，我们会为你创建一个私人空间。</p> <p>你可以使用SIMCard Component REST API 中的租赁用户(Tenant)资源来管理和访问你的私人空间。</p> <p>Tenant资源是你操作SIMCard组件的起始入口点，同时它将为你返回提供其它资源的URL链接(如<a href=\"#api-SIMCard\">SIMCard</a>、<a href=\"#api-Group\">Group</a>、...)。</p> <p>注册SIMCard Component Tenant用户：待定</p> <p>注册完成并通过审核过后，我们将向你发送一封带有API_Key信息的邮件，API_Key将是你访问SIMCard Component的钥匙。</p> <p>访问REST API时，请在HTTP的Header头使用API_Key:</p> <p>&quot;Authorization&quot; : &quot;$API_KEY_ID:$API_KEY_SECRET&quot;</p> <p>&quot;Content-Type”: “application/json;charset=UTF-8”</p>"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackage",
    "title": "CreateFlowPackage",
    "name": "CreateFlowPackage",
    "version": "1.0.0",
    "group": "flowPackage",
    "description": "<p>创建一个流量套餐</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>套餐名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "type",
            "description": "<p>套餐类型</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "dataFlow",
            "description": "<p>数据流量</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>套餐名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该套餐下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "packageMembership",
            "description": "<p>与该套餐相关联的关系列表，见<a href=\"#api-PackageMembership\">packageMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>该流量套餐的运营商URL链接，见<a href=\"#api-Carrier\">Carrier</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该流量套餐的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"流量套餐名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  “type”: \"流量套餐类型\"，\n  “dataFlow”：“数据流量”,\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\",\n  \"name\": \"流量套餐名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  “type”: \"流量套餐类型\"，\n  “dataFlow”：“数据流量”,\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPackages.js",
    "groupTitle": "flowPackage"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPackages/:flowPackageUUID",
    "title": "DeleteFlowPackage",
    "name": "DeleteFlowPackage",
    "version": "1.0.0",
    "group": "flowPackage",
    "description": "<p>删除指定流量套餐</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackage/flowCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPackages.js",
    "groupTitle": "flowPackage"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPackages",
    "title": "ListFlowPackage",
    "name": "ListFlowPackage",
    "version": "1.0.0",
    "group": "flowPackage",
    "description": "<p>获取指定流量套餐列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>流量套餐名称,支持模糊查询，如 '<em>名称</em>'</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、carrier、packageMemberships[offset,limit]或他们的组合，</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers",
          "type": "json"
        },
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/carriers?offset=0&limit=10&name=运营商名称",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/flowPackage\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n      \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\",\n      \"name\": \"流量套餐名称\",\n      \"status\": \"ENABLED\",\n      \"firstCarrier\" : \"总运营商\"，\n      \"secondCarrier\" : \"区域运营商\",\n     “type”: \"流量套餐类型\"，\n     “dataFlow”：“数据流量”,\n      \"customData\" : {}\n      \"simCards\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n      \"carriers\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n      \"packageMembership\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n      \"tenant\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n      \"createAt\" : \"2016-01-10 12:30:00\",\n      \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ...\n     },\n     {\n      \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\",\n      \"name\": \"流量套餐名称\",\n      \"status\": \"ENABLED\",\n      \"firstCarrier\" : \"总运营商\"，\n      \"secondCarrier\" : \"区域运营商\",\n     “type”: \"流量套餐类型\"，\n     “dataFlow”：“数据流量”,\n      \"customData\" : {}\n      \"simCards\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n      \"carriers\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n      \"packageMembership\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n      \"tenant\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n      \"createAt\" : \"2016-01-10 12:30:00\",\n      \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ... remaining flowPackages name/value pairs ...\n     },\n     ... remaining items of flowPackages ...\n   ]\n }",
          "type": "json"
        },
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n     \"href\":\"127.0.0.1:3000/api/v1/flowPackage\",\n     \"offset\":\"0\",\n     \"limit\":\"25\",\n     \"size\":100,\n     \"items\":[\n     {\n      \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\",\n      \"name\": \"流量套餐名称\",\n      \"status\": \"ENABLED\",\n      \"firstCarrier\" : \"总运营商\"，\n      \"secondCarrier\" : \"区域运营商\",\n     “type”: \"流量套餐类型\"，\n     “dataFlow”：“数据流量”,\n      \"customData\" : {}\n      \"simCards\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n      \"carriers\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n      \"packageMembership\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n      \"tenant\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n      \"createAt\" : \"2016-01-10 12:30:00\",\n      \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ...\n     },\n     {\n      \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\",\n      \"name\": \"流量套餐名称\",\n      \"firstCarrier\" : \"总运营商\"，\n      \"secondCarrier\" : \"区域运营商\",\n      \"status\": \"ENABLED\",\n     “type”: \"流量套餐类型\"，\n     “dataFlow”：“数据流量”,\n      \"customData\" : {}\n      \"simCards\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n      \"carriers\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n      \"packageMembership\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n      \"tenant\" : {\n      \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n      \"createAt\" : \"2016-01-10 12:30:00\",\n      \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ... remaining flowPackages name/value pairs ...\n     },\n     ... remaining items of flowPackages ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPackages.js",
    "groupTitle": "flowPackage"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPackages/flowPackageUUID",
    "title": "RetrieveFlowPackage",
    "name": "retrieveFlowPackage",
    "version": "1.0.0",
    "group": "flowPackage",
    "description": "<p>获取指定流量套餐信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、carrier、packageMemberships[offset,limit]或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>套餐名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该套餐下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "packageMembership",
            "description": "<p>与该套餐相关联的关系列表，见<a href=\"#api-PackageMembership\">packageMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>该流量套餐的运营商URL链接，见<a href=\"#api-Carrier\">Carrier</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该流量套餐的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPackages\",\n  \"name\": \"流量套餐名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  “type”: \"流量套餐类型\"，\n  “dataFlow”：“数据流量”,\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPackages.js",
    "groupTitle": "flowPackage"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPackages/flowPackageUUID",
    "title": "UpdateFlowPackage",
    "name": "updateFlowPackage",
    "version": "1.0.0",
    "group": "flowPackage",
    "description": "<p>更新运营商信息</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>套餐名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "type",
            "description": "<p>套餐类型</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "dataFlow",
            "description": "<p>数据流量</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>套餐名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该套餐下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "packageMembership",
            "description": "<p>与该套餐相关联的关系列表，见<a href=\"#api-PackageMembership\">packageMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>该流量套餐的运营商URL链接，见<a href=\"#api-Carrier\">Carrier</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该流量套餐的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"流量套餐名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  “type”: \"流量套餐类型\"，\n  “dataFlow”：“数据流量”,\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/flowPackages/flowCqrNgrzcIGYs1PfP4F\",\n  \"name\": \"流量套餐名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  “type”: \"流量套餐类型\"，\n  “dataFlow”：“数据流量”,\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPackages/flowCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPackages.js",
    "groupTitle": "flowPackage"
  },
  {
    "type": "post",
    "url": "/:version/tenants/:tenantUUID/carriers/carrCqrNgrzcIGYs1PfP4F/flowPool",
    "title": "CreateFlowPool",
    "name": "CreateFlowPool",
    "version": "1.0.0",
    "group": "flowPool",
    "description": "<p>创建一个流量池</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>流量池名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "lExpenditure",
            "description": "<p>最低消费</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "totalFlow",
            "description": "<p>总流量</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>流量池名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该流量池下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "packageMembership",
            "description": "<p>与该流量池相关联的关系列表，见<a href=\"#api-PackageMembership\">packageMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>该流量池的运营商URL链接，见<a href=\"#api-Carrier\">Carrier</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该流量池的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "POST:  127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\"\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 201 Created\nLocation: 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPools.js",
    "groupTitle": "flowPool"
  },
  {
    "type": "delete",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPools/:flowPoolUUID",
    "title": "DeleteFlowPool",
    "name": "DeleteFlowPool",
    "version": "1.0.0",
    "group": "flowPool",
    "description": "<p>删除指定流量池</p>",
    "parameter": {
      "examples": [
        {
          "title": "Example Request",
          "content": "Delete 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPools.js",
    "groupTitle": "flowPool"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPool",
    "title": "ListFlowPool",
    "name": "ListFlowPool",
    "version": "1.0.0",
    "group": "flowPool",
    "description": "<p>获取指定流量池列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "offset",
            "description": "<p>偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "limit",
            "description": "<p>获取条数</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>流量池名称,支持模糊查询，如 '<em>名称</em>'</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "orderBy",
            "description": "<p>排序，多个排序字段用','隔开。如orderBy=createAt,modifiedAt desc；desc与前面用空格隔开，desc表示降序，asc表示升序</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、carrier、packageMemberships[offset,limit]或他们的组合，</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools",
          "type": "json"
        },
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/carriers?offset=0&limit=10&name=流量池名称",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ...\n     },\n     {\n     *   \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n    \"name\": \"流量池名称\",\n   \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\"\n   \"firstCarrier\" : \"总运营商\"，\n   \"secondCarrier\" : \"区域运营商\",\n   \"customData\" : {}\n   \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ... remaining flowPools name/value pairs ...\n     },\n     ... remaining items of flowPools ...\n   ]\n }",
          "type": "json"
        },
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\"\n  \"customData\" : {},\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ...\n     },\n     {\n     *   \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\"\n  \"customData\" : {}\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n         ... remaining flowPackages name/value pairs ...\n     },\n     ... remaining items of flowPackages ...\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPools.js",
    "groupTitle": "flowPool"
  },
  {
    "type": "get",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPool/flowPoolUUID",
    "title": "RetrieveFlowPool",
    "name": "retrieveFlowPool",
    "version": "1.0.0",
    "group": "flowPool",
    "description": "<p>获取指定流量池信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "expand",
            "description": "<p>?后面可以接查询字段expand,expand表示获取时同时返回对应资源的信息。expand的值可以是simCards[offset,limit]、carrier、packageMemberships[offset,limit]或他们的组合，中间用','号隔开</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>流量池名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该流量池下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "packageMembership",
            "description": "<p>与该流量池相关联的关系列表，见<a href=\"#api-PackageMembership\">packageMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>该流量池的运营商URL链接，见<a href=\"#api-Carrier\">Carrier</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该流量池的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "GET 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPools.js",
    "groupTitle": "flowPool"
  },
  {
    "type": "put",
    "url": "/:version/tenants/:tenantUUID/carriers/:carrierUUID/flowPools/flowPoolUUID",
    "title": "UpdateFlowPool",
    "name": "updateFlowPackage",
    "version": "1.0.0",
    "group": "flowPool",
    "description": "<p>更新流量池</p>",
    "parameter": {
      "fields": {
        "input": [
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>流量池名称 (1&lt;N&lt;=255)，唯一性</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>状态（值为ENABLED、DISABLED）,默认为ENABLED</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "lExpenditure",
            "description": "<p>最低消费</p>"
          },
          {
            "group": "input",
            "type": "string",
            "optional": true,
            "field": "totalFlow",
            "description": "<p>总流量</p>"
          },
          {
            "group": "input",
            "type": "json",
            "optional": true,
            "field": "customData",
            "description": "<p>扩展自定义数据,默认为{}</p>"
          }
        ],
        "output": [
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>流量池名称</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "firstCarrier",
            "description": "<p>总运营商</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "secondCarrier",
            "description": "<p>区域运营商</p>"
          },
          {
            "group": "output",
            "type": "json",
            "optional": false,
            "field": "customData",
            "description": "<p>扩展自定义数据</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "createAt",
            "description": "<p>创建时间，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "string",
            "optional": false,
            "field": "modifiedAt",
            "description": "<p>最后更新时间，默认下创建时间一样，时间格式为（YYYY-MM-DD hh:MM:SS）</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "SIMCards",
            "description": "<p>该流量池下所有的sim卡URL链接，见<a href=\"#api-SIMCard\">SIMCard</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "packageMembership",
            "description": "<p>与该流量池相关联的关系列表，见<a href=\"#api-PackageMembership\">packageMembership</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "carrier",
            "description": "<p>该流量池的运营商URL链接，见<a href=\"#api-Carrier\">Carrier</a>资源</p>"
          },
          {
            "group": "output",
            "type": "url",
            "optional": false,
            "field": "tenant",
            "description": "<p>该流量池的租赁用户URL链接，见<a href=\"#api-Tenant\">Tenant</a>资源</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Request",
          "content": "PUT 127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F\nContent-Type: application/json;charset=UTF-8\n{\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\"\n  \"customData\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example Response",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8;\n{\n  \"href\":\"127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/carrCqrNgrzcIGYs1PfP4F/flowPools\",\n  \"name\": \"流量池名称\",\n  \"status\": \"ENABLED\",\n  ‘lExpenditure\" : \"50\",\n   \"totalFlow\" : \"500\",\n  \"firstCarrier\" : \"总运营商\"，\n  \"secondCarrier\" : \"区域运营商\",\n  \"customData\" : {}\n  \"simCards\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/simCards\"\n  },\n  \"carriers\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers\"\n  },\n  \"packageMembership\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9/carriers/57YZCqrNgrzcIGYs1PfP4F/flowPools/poolCqrNgrzcIGYs1PfP4F/packageMembership\"\n  },\n  \"tenant\" : {\n     \"href\" : \"https://127.0.0.1:3000/api/v1/tenants/P0F5iYzwSRzjiIfLs1Jfo9\"\n  },\n  \"createAt\" : \"2016-01-10 12:30:00\",\n  \"modifiedAt\" : \"2016-01-10 12:30:00\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controllers/flowPools.js",
    "groupTitle": "flowPool"
  }
] });
