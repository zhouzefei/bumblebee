"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");

var config = require("../core/config");
var configName = "publish.json";

var publisher = module.exports = {};
var cwd = process.cwd();

config.create(configName);

publisher.init = function() {
  var conf = config.read(configName);
  var inquirer = require("inquirer");
  var prompts = [
      {
        name: "config",
        message: "FIS3 配置文件所在目录（相对路径）：",
        default: ".",
        type: "input",
        validate: function( ipt ) {
          return fs.existsSync(path.join(cwd, ipt, "fis-conf.js")) || "该目录中不存在 fis-conf.js 文件";
        }
      },
      {
        name: "prebuild",
        message: "预构建脚本（用逗号分隔）：",
        default: "",
        type: "input"
      },
      {
        name: "build",
        message: "构建脚本（用逗号分隔）：",
        default: "",
        type: "input"
      },
      {
        name: "postbuild",
        message: "后构建脚本（用逗号分隔）：",
        default: "",
        type: "input"
      }
    ];

  console.log("\n请按顺序输入发布文件的相关信息！");

  inquirer.prompt(prompts, function( answers ) {
    conf.cwd = cwd;
    conf.config = answers.config;
    conf.scripts = {};

    ["prebuild", "build", "postbuild"].forEach(function( k ) {
      conf.scripts[k] = answers[k].trim() === "" ? [] : answers[k].split(",");
    });

    config.write(configName, conf);
  });
};

publisher.exec = function() {
  var conf = config.read(configName);

  if ( !config.isEmpty(conf) ) {
    require("child_process")
      .exec(
        [].concat(
            conf.scripts.prebuild,
            "cd " + conf.config,
            conf.scripts.build,
            "cd " + conf.cwd,
            conf.scripts.postbuild)
          .join(" && "),
        function( err, stdout, stderr ) {
          if ( stdout ) {
            console.log("stdout: " + stdout);
          }

          if ( stderr ) {
            console.log("stderr: " + stderr);
          }

          if (err !== null) {
            console.log("exec error: " + err);
          }
        });
  }
};
