"use strict";

var fs = require("fs");
var path = require("path");
var readline = require("readline");

var config = require("../core/config");
var configName = "publish.json";

var publisher = module.exports = {};
var cwd = process.cwd();

config.create(configName);

publisher.init = function() {
  var conf = config.read(configName);
  var count = 0;
  var rl;

  if ( config.isEmpty(conf) ) {
    console.log("\nPlease input setting for publishing:");

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

    rl.setPrompt("Relative path of FIS3's config file:");
    rl.prompt();

    rl
      .on("line", function( line ) {
        var text = line.trim();

        count++;

        switch(count) {
          case 1:
            conf.config = text;
            rl.setPrompt("Scripts to execute (separated by comma):");
            break;
          case 2:
            conf.scripts = text.split(",");
            rl.close();
            break;
        }

        if ( count !== 2 ) {
          rl.prompt();
        }
      })
      .on("close", function() {
        if ( conf.config && fs.existsSync(path.join(cwd, conf.config, "fis-conf.js")) && conf.scripts.length > 0 ) {
          conf.cwd = cwd;

          config.write(configName, conf);

          console.log("\nSuccess!");
        }
        else {
          console.log("\nFailed!");
        }

        process.exit(0);
      });
  }
};

publisher.exec = function() {
  var conf = config.read(configName);
  var scripts;
  var proc;

  if ( !config.isEmpty(conf) ) {
    proc = require("child_process");
    scripts = [].concat("cd " + conf.config, conf.scripts, "cd " + conf.cwd);

    proc.exec(scripts.join(" && "), function( err, stdout, stderr ) {
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
