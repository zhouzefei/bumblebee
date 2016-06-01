#!/usr/bin/env node

"use strict";

const meow = require("meow");

const cmd = require("../lib/core/command");
const config = require("../lib/core/config");

const cli = meow({
    // help: false,
    pkg: require("../package.json")
  }, {
    alias: {
      h: "help",
      v: "version"
    }
  });

const args = cli.input;

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
  let env;

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
 *    b3 upload [subcommand][ --flags]
 *
 * Sub-commands:
 *    - init          Configure RocketZ's info
 *    - init [CDN]    Configure cloud's info ('qiniu' & 'wantu' are available)
 *
 * Flags:
 *    - assets        Local assets placed in (default is '.')
 *    - remote        Target directory uploaded to (default is '.')
 *    - files         Specify files' name to be uploaded (default is all)
 *    - exts          Specify exts to be uploaded (default is all static assets)
 *    - deep          Whether find files deeply (default is true)
 *    - interactive   Whether interact with CLI (default is true)
 */
cmd.register("upload", function( args, opts ) {
  let uploader = require("../lib/commands/upload");

  if ( args.length === 0 ) {
    uploader.exec(opts);
  }
  else if ( args[0] === "init" ) {
    uploader.init(args[1]);
  }
  else {
    console.log("无法识别你的指令 ˊ_>ˋ");
  }
});

/**
 * Publish front-end stuff
 *
 * Usage:
 *    b3 publish [subcommand]
 *
 * Sub-commands:
 *    - init          Configure front-end stuff's info
 */
cmd.register("publish", function( args, opts ) {
  let publisher = require("../lib/commands/publish");
  let handler;

  if ( args[0] ) {
    handler = publisher[args[0]];
  }
  else {
    handler = publisher.exec;
  }

  if ( handler ) {
    handler(args, opts);
  }
});

cmd.run(args[0], args.slice(1), cli.flags);
