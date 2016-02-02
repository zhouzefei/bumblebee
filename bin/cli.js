#!/usr/bin/env node

"use strict";

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
var opts = cli.flags;

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
      // console.log(env.getGeneratorsMeta());
      env.run(args, opts);
    });
  }
  // Initialize B3 itself
  else {
    console.log("Nothing to config now!");
  }
});

cmd.run(args[0], args.slice(1), opts);
