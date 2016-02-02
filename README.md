# Bumblebee

Bumblebee，简称「b3」，就是那个大家都很熟悉的《变形金刚》里的卖萌好手！

本工具会为前端工程提供极大方便！

## 目录

* [用法](#用法)
  * [init 命令](#init 命令)
  * [upload 命令](#upload 命令)
* [脚手架](#脚手架)
  * [活动页面](#活动页面)

## 用法

在进行一切操作之前，请先安装。

```bash
npm install -g b3
```

### init 命令

不传参数时是进行本工具的配置；传参时功能与 [Yeoman](http://yeoman.io) 一样。

```bash
# 对 b3 进行配置（暂不支持）
b3 init
# 调用活动页面脚手架
b3 init mhc-activity
```

### upload 命令

将静态资源从「地面」（本地）发射到「云端」（CDN）。

```bash
b3 upload [flags]
```

其中 `flags` 的值可以是：

*  `assets` - 要上传的本地资源目录（**执行命令时所在目录的相对路径**）
*  `remote` - 上传到 CDN 的目录（**CDN 根目录的相对路径**，默认为根目录）
*  `files` - 指定要上传的文件（没有文件扩展名，**若有多个值要用英文逗号分隔**，默认为全部）
*  `exts` - 指定要上传的文件类型（**若有多个值要用英文逗号分隔**，默认为全部）
*  `deep` - 是否进行深度遍历（默认为 `true`）
*  `interactive` - 是否进行为交互式（默认为 `true`）
*  `config` - 填写 CDN 配置信息（可用值为 `qiniu` 和 `wantu`）


**需要注意以下几点：**

1. 除了 `config` 之外都可以组合使用，`config` 只能单独使用；
2. 在有了 CDN 配置之后才能够上传文件，所以至少执行一次 `config`；
3. 若指定某个 CDN 的值为 `false` 则不上传文件到其空间。


```bash
# 配置上传到七牛空间所需要的验证信息
b3 upload --config=qiniu
# 使用默认配置上传文件
b3 upload
# 使用指定配置上传文件
b3 upload --assets=dist --remote=assets/dist --files=main.min --exts=js,css --interactive=false
# 即使设置了七牛的配置也不上传文件
b3 upload --qiniu=false
```

## 脚手架

### 活动页面

在活动页面目录中执行以下命令，就可以生成页面啦！

```bash
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
