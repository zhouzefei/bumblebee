"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");

var config = require("../core/config");
var configName = "publish.json";

var publisher = module.exports = {};
var cwd = process.cwd();

function getScripts( answers ) {
  var scripts = {};

  ["prebuild", "build", "postbuild"].forEach(function( k ) {
    scripts[k] = answers[k].trim() === "" ? [] : answers[k].split(",");
  });

  return scripts;
}

function isMediaValid( media ) {
  return _.isString(media) && _.indexOf(["true", "false"], media) === -1;
}

function resolveValue( target, source ) {
  Object
    .keys(target)
    .forEach(function( v ) {
      if ( target[v].length === 0 ) {
        target[v] = source[v];
      }
    });

  return target;
}

/**
 * 获取某个 media 最终的配置
 *
 * @param media
 * @param conf
 */
function resolveConfig( media, conf ) {
  var mediaConf = conf.media[media];

  resolveValue(mediaConf, conf);
  resolveValue(mediaConf.scripts, conf.scripts);

  return mediaConf;
}

config.create(configName);

publisher.init = function( args, opts ) {
  var conf = config.read(configName);
  var media = opts["media"];
  var prompts = [
      {
        name: "config",
        message: "FIS3 配置文件所在目录（相对路径）：",
        default: "",
        type: "input"
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
  var host;

  if ( isMediaValid(media) ) {
    if ( !_.hasIn(conf, "media") ) {
      conf.media = {};
    }

    if ( !_.hasIn(conf.media, media) ) {
      conf.media[media] = {};
    }

    host = conf.media[media];
  }
  else {
    host = conf;
  }

  console.log("\n请按顺序输入发布文件的相关信息！");

  require("inquirer")
    .prompt(prompts, function( answers ) {
      _.assign(host, {
        cwd: cwd,
        config: answers.config,
        scripts: getScripts(answers)
      });
      config.write(configName, conf);
    });
};

publisher.exec = function( args, opts ) {
  var conf = config.read(configName);

  var media = opts["media"];

  if ( isMediaValid(media) ) {
    if ( !(_.hasIn(conf, "media") && _.hasIn(conf.media, media)) ) {
      console.log("\n配置中不存在 `" + media + "` 相关信息，请按顺序输入：");
      publisher.init(args, opts);

      return false;
    }
    else {
      conf = resolveConfig(media, conf);
    }
  }
  else if ( config.isEmpty(conf) ) {
    return false;
  }

  require("child_process")
    .exec(
      [].concat(
        conf.scripts.prebuild,
        "cd " + conf.config,
        conf.scripts.build,
        "cd " + conf.cwd,
        conf.scripts.postbuild
      )
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
};
