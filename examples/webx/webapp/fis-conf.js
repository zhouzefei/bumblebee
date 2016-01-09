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

// 部署到七牛
fis
  .media("qiniu")
  .match("*.scss", {
    release: false
  }, true)
  .match("*.{css,js,jpg,png,gif}", {
    useHash: true
  })
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
    domain: "//img.maihaoche.com/"
  })
  .match("${components}/(**/*.{css,js})", {
    release: "${qn_root}/components/$1",
    url: "components/$1"
  })
  .match("${components}/(**/*.{jpg,png,gif})", {
    release: "${qn_root}/components/$1",
    url: "components/$1"
  });
