"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");

var config = require("../core/config");
var configName = "upload.json";

var DEFAULT_CONF = {
    assets: ".",
    remote: ".",
    files: "",
    exts: "",
    deep: true,
    interactive: true
  };
var uploader = module.exports = {};


config.create(configName);

uploader.init = function( cdn ) {
  var conf = config.read(configName);
  var inquirer = require("inquirer");
  var prompts;

  // 配置基本信息
  if ( cdn === undefined ) {
    prompts = [
        {
          name: "assets",
          message: "本地资源文件目录（相对路径）：",
          default: ".",
          type: "input"
        },
        {
          name: "remote",
          message: "CDN 目标目录（相对路径）：",
          default: ".",
          type: "input"
        },
        {
          name: "files",
          message: "需要上传的文件名（默认为全部）：",
          default: "",
          type: "input"
        },
        {
          name: "exts",
          message: "需要上传的扩展名（默认为全部）：",
          default: "",
          type: "input"
        },
        {
          name: "deep",
          message: "是否深度遍历文件夹：",
          default: "true",
          type: "input"
        },
        {
          name: "interactive",
          message: "上传文件时是否进行交互：",
          default: "true",
          type: "input"
        }
      ];

    console.log("\n请按顺序输入上传文件的相关信息！");

    inquirer.prompt(prompts, function( answers ) {
      ["deep", "interactive"].forEach(function( k ) {
        answers[k] = answers[k] !== "false";
      });

      config.write(configName, _.assign(conf, answers));
    });
  }
  // 配置 CDN
  else if ( ["qiniu", "wantu"].indexOf(cdn) > -1 ) {
    if ( conf[cdn] === undefined ) {
      conf[cdn] = {};
    }

    prompts = [
        {
          name: "ak",
          message: "Access Key：",
          default: "",
          type: "input",
          validate: function( ipt ) {
            return ipt.trim() === "" ? "Access Key 不能为空！" : true;
          }
        },
        {
          name: "sk",
          message: "Secret Key：",
          default: "",
          type: "input",
          validate: function( ipt ) {
            return ipt.trim() === "" ? "Secret Key 不能为空！" : true;
          }
        },
        {
          name: "space",
          message: "空间名称：",
          default: "",
          type: "input",
          validate: function( ipt ) {
            return ipt.trim() === "" ? "空间名称不能为空！" : true;
          }
        }
      ];

    console.log("\n请按顺序输入" + (cdn === "qiniu" ? "七牛" : "顽兔") + "的相关信息！");

    inquirer.prompt(prompts, function( answers ) {
      conf[cdn].access_key = answers.ak;
      conf[cdn].secret_key = answers.sk;
      conf[cdn][cdn === "qiniu" ? "bucket" : "namespace"] = answers.space;

      config.write(configName, conf);
    });
  }
};

uploader.exec = function( opts ) {
  var rocketz = require("rocketz");
  var conf = _.assign(config.read(configName), opts);

  ["files", "exts"].forEach(function( k ) {
    var v = conf[k];

    if ( v !== "" ) {
      conf[k] = v.split(",");
    }
  });

  ["deep", "interactive", "qiniu", "wantu"].forEach(function( c ) {
    if ( opts[c] === "false" ) {
      conf[c] = false;
    }
  });

  rocketz.init(conf);

  if ( rocketz.preview() ) {
    rocketz.run();
  }
};
