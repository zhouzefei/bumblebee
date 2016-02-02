"use strict";

var cmd = module.exports = {};

cmd.__commands = {};

cmd.exists = function( cmd ) {
  return this.__commands.hasOwnProperty(cmd);
};

cmd.register = function( cmd, handler ) {
  if ( this.exists(cmd) || typeof handler !== "function" ) {
    return false;
  }

  this.__commands[cmd] = handler;

  return true;
};

cmd.run = function( cmd, args, opts ) {
  if ( this.exists(cmd) ) {
    this.__commands[cmd].apply(this, [].slice.call(arguments, 1));
  }
};
