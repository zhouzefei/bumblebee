# Bumblebee

[![NPM version][npm-ver]][npm-url]
[![NPM download][npm-dm]][npm-url]

[npm-ver]: https://img.shields.io/npm/v/b3.svg?style=flat-square
[npm-dm]: https://img.shields.io/npm/dm/b3.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/b3

Bumblebee，简称「b3」，就是那个大家都很熟悉的《变形金刚》里的卖萌好手！

本工具会为前端工程提供极大方便！

## 目录

* [用法](#用法)
  * [init 命令](#init-命令)
  * [upload 命令](#upload-命令)
  * [publish 命令](#publish-命令)
* [脚手架](#脚手架)
  * [活动页面](#活动页面)

## 用法

在进行一切操作之前，请先安装。

```sh
npm install -g b3
```

### init 命令

不传参数时是进行本工具的配置；传参时功能与 [Yeoman](http://yeoman.io) 一样。

```sh
# 对 b3 进行配置（暂不支持）
b3 init
# 调用活动页面脚手架
b3 init mhc-activity
```

### upload 命令

将静态资源从「地面」（本地）发射到「云端」（CDN）。

```sh
b3 upload [subcommand][ --flags]
```

其中 `subcommand` 的值可以是：

* `init` - 初始化基本配置
* `init [CDN]` - 初始化 CDN 配置（可用值为 `qiniu` 和 `wantu`）

其中 `flags` 的值可以是：

* `assets` - 要上传的本地资源目录（**执行命令时所在目录的相对路径**，默认为执行命令时所在目录）
* `remote` - 上传到 CDN 的目录（**CDN 根目录的相对路径**，默认为根目录）
* `files` - 指定要上传的文件（没有文件扩展名，**若有多个值要用英文逗号分隔**，默认为全部）
* `exts` - 指定要上传的文件类型（**若有多个值要用英文逗号分隔**，默认为全部）
* `deep` - 是否进行深度查找（默认为 `true`）
* `interactive` - 是否进行命令行交互（默认为 `true`）
* `fragment` - 将文件分批上传时每批文件个数（值是非数字或不大于 1 时则不分批上传）
* `retry` - 有文件上传失败后的重试上传次数

**需要注意以下几点：**

1. 在有了 CDN 配置之后才能够上传文件，所以至少执行一次 `b3 upload init [CDN]`；
2. 有多个 CDN 配置时会将文件上传到各个 CDN；
3. 若指定某个 CDN 的值为 `false` 则不上传文件到其空间。

```sh
# 配置上传的基本信息
b3 upload init
# 配置上传到七牛空间所需要的验证信息
b3 upload init qiniu
# 使用默认配置上传文件
b3 upload
# 使用指定配置上传文件
b3 upload --assets=dist --remote=assets/dist --files=main.min --exts=js,css --interactive=false
# 即使设置了七牛的配置也不上传文件
b3 upload --qiniu=false
```

### publish 命令

将前端文件进行发布。

```sh
b3 publish [subcommand][ --flags]
```

其中 `subcommand` 的值可以是：

* `init` - 初始化基本配置

其中 `flags` 的值可以是：

* `media` - 指定要发布的环境所对应的配置

在执行 `b3 publish init` 或 `b3 publish` 指定一个不存在的环境时会提示输入围绕着 FIS3 构建的配置信息：

1. 配置文件 `fis-conf.js` 所在目录；
2. 构建前所要执行的 shell 脚本，在 `b3` 命令执行的目录；
3. 构建时所要执行的 shell 脚本，在 `fis-conf.js` 所在目录；
4. 构建后索要执行的 shell 脚本，在 `b3` 命令执行的目录。

如果指定环境的配置信息中的某项没设置，则采用基本配置。

```sh
# 配置通用环境
b3 publish init
# 配置线上环境
b3 publish init --media=online
# 用基本配置发布
b3 publish
# 用线上环境配置发布
b3 publish --media=online
```

## 脚手架

### 活动页面

在活动页面目录中执行以下命令，就可以生成页面啦！

```sh
# PC 端页面
b3 init mhc-activity
# 移动端页面
b3 init mhc-activity --mobile=true
```

页面目录生成之后，在 `index.html` 中特定的注释之间写入自己的代码。

```html
<!-- 活动页面代码 begin -->
<div>你自己的代码</div>
<!-- 活动页面代码 end -->
```
