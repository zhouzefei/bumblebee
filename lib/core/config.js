"use strict";

const fs = require("fs");
const path = require("path");

const dirName = path.join(process.env.HOME, ".b3");
var config = module.exports = {};

function isDir( configName ) {
  return configName === undefined;
}

function getConfigPath( configName ) {
  return path.join(dirName, isDir(configName) ? "" : configName);
}

function isJsonFile( configName ) {
  return configName.indexOf(".json") > -1;
}

/**
 * 检查配置是否存在
 */
config.exists = function( configName ) {
  return fs.existsSync(getConfigPath(configName));
};

/**
 * 创建配置
 */
config.create = function( configName ) {
  let isConfigDir = isDir(configName);

  if ( this.exists(configName) ) {
    return false;
  }

  if ( isConfigDir || !this.exists() ) {
    fs.mkdirSync(dirName);
  }

  if ( !isConfigDir ) {
    this.write(configName, isJsonFile(configName) ? {} : "");
  }

  return getConfigPath(configName);
};

/**
 * 读取配置
 */
config.read = function( configName ) {
  let fileContent = fs.readFileSync(getConfigPath(configName), "utf-8");

  return isJsonFile(configName) ? JSON.parse(fileContent) : fileContent;
};

/**
 * 写入配置
 */
config.write = function( configName, fileContent ) {
  return fs.writeFileSync(getConfigPath(configName), typeof fileContent === "string" ? fileContent : JSON.stringify(fileContent, null, 2));
};

config.isEmpty = function( fileContent ) {
  if ( typeof fileContent === "string" ) {
    return fileContent.trim() === "";
  }
  else {
    return Object.keys(fileContent).length === 0;
  }
};
