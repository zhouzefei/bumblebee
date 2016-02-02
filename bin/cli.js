#!/usr/bin/env node

"use strict";

var _ = require("lodash");
var meow = require("meow");

var cmd = require("../lib/command");

var cli = meow({
    // help: false,
    pkg: require("../package.json")
  }, {
    alias: {
      h: "help",
      v: "version"
    }
  });

var args = cli.input;

/**
 * Initialization
 *
 * 1. Configure B3 itself;
 * 2. Scaffold project with Yeoman generators
 *
 * Usage:
 *    b3 init [generator-name]
 */
cmd.register("init", function( args, opts ) {
  var env;

  // Scaffold with Yeoman generators
  if ( args.length ) {
    env = require("yeoman-environment").createEnv();

    env.on("error", function( err ) {
      console.error("Error", process.argv.slice(2).join(" "), "\n");
      console.error(opts.debug ? err.stack : err.message);
      process.exit(err.code || 1);
    });

    env.lookup(function() {
      env.run(args, opts);
    });
  }
  // Initialize B3 itself
  else {
    console.log("Nothing to config now!");
  }
});

/**
 * Uploading local assets to cloud (CDN)
 *
 * Usage:
 *    b3 upload [--flags]
 *
 * Flags:
 *    - config        Configure cloud's info ('qiniu' & 'wantu' are available)
 *    - assets        Local assets placed in (default is '.')
 *    - remote        Target directory uploaded to (default is '.')
 *    - files         Specify files' name to be uploaded (default is all)
 *    - exts          Specify exts to be uploaded (default is all static assets)
 *    - deep          Whether find files deeply (default is true)
 *    - interactive   Whether interact with CLI (default is true)
 */
cmd.register("upload", function( args, opts ) {
  var rocketz, conf;

  if ( opts.config ) {
    require("rocketz/lib/config").setConfig(opts.config);
  }
  else {
    rocketz = require("rocketz");
    conf = _.assign({
        assets: ".",
        remote: ".",
        files: "",
        exts: "",
        deep: true,
        interactive: true
      }, opts);

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
  }
});

cmd.run(args[0], args.slice(1), cli.flags);
