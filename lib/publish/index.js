"use strict";

var fs = require("fs");
var path = require("path");
var readline = require("readline");

var config = require("../core/config");
var configName = "publish.json";

var publisher = module.exports = {};

config.create(configName);

publisher.init = function() {
  var conf = config.read(configName);
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
        conf.config = line.trim();
        rl.close();
      })
      .on("close", function() {
        if ( conf.config && fs.existsSync(path.join(process.cwd(), conf.config, "fis-conf.js")) ) {
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
