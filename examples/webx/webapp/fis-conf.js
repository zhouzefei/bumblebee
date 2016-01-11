"use strict";

var rocketz = require("rocketz");
var qiniuConf = rocketz.getCloud("qiniu");
var wantuConf = rocketz.getCloud("wantu");

// FIS 全局属性
fis.set("project.md5Connector", "-");
fis.set("project.ignore", [
  "bower_components/**",
  "node_modules/**",
  "*-INF/**",
  "fis-conf.js",
  "package.json",
  ".*"
]);

// 项目变量
fis.set("components", "/home/templates/control/components");
fis.set("qn_root", "/webapp_qiniu");
fis.set("wt_root", "/webapp_wantu");

// 开发调试
fis
  .media("dev")
  .match("*.scss", {
    rExt: ".css",
    parser: fis.plugin("node-sass")
  })
  .match("*.vm", {
    release: false
  });

// 部署到测试环境
// fis.media("qa");

// 部署到七牛
fis
  .media("prod_qiniu")
  .match("*.scss", {
    release: false
  }, true)
  .match("*.{css,js,jpg,png,gif}", {
    useHash: true,
    deploy: fis.plugin("qiniu", {
      accessKey: qiniuConf.access_key,
      secretKey: qiniuConf.secret_key,
      bucket: qiniuConf.bucket
    })
  }, true)
  .match("*.css", {
    optimizer: fis.plugin("clean-css")
  })
  .match("*.js", {
    optimizer: fis.plugin("uglify-js")
  })
  .match("*.png", {
    optimizer: fis.plugin("png-compressor")
  })
  .match("**", {
    release: "${qn_root}/$0",
    domain: "//img.maihaoche.com/",
    deploy: fis.plugin("local-deliver")
  })
  .match("${components}/(**/*.{css,js})", {
    release: "/components/$1",
    url: "components/$1"
  })
  .match("${components}/(**/*.{jpg,png,gif})", {
    release: "/components/$1",
    url: "components/$1"
  });

// 部署到顽兔
fis
  .media("prod_wantu")
  .match("*.scss", {
    release: false
  }, true)
  .match("*.{css,js,jpg,png,gif}", {
    useHash: true,
    deploy: fis.plugin("wantu", {
      accessKey: wantuConf.access_key,
      secretKey: wantuConf.secret_key,
      namespace: wantuConf.namespace
    })
  }, true)
  .match("*.css", {
    optimizer: fis.plugin("clean-css")
  })
  .match("*.js", {
    optimizer: fis.plugin("uglify-js")
  })
  .match("*.png", {
    optimizer: fis.plugin("png-compressor")
  })
  .match("**", {
    release: "${wt_root}/$0",
    domain: "//img1.maihaoche.com/",
    deploy: fis.plugin("local-deliver")
  })
  .match("${components}/(**/*.{css,js})", {
    release: "/components/$1",
    url: "components/$1"
  })
  .match("${components}/(**/*.{jpg,png,gif})", {
    release: "/components/$1",
    url: "components/$1"
  });
