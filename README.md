# Bumblebee

Bumblebee，简称「b3」，就是那个大家都很熟悉的《变形金刚》里的卖萌好手！

本工具会为前端工程提供极大方便！

## 目录

* [用法](#用法)
  * [init](#init)
* [脚手架](#脚手架)
  * [活动页面](#活动页面)

## 用法

在进行一切操作之前，请先安装。

```bash
npm install -g b3
```

### init

不传参数时是进行本工具的配置；传参时功能与 [Yeoman](http://yeoman.io) 一样。

```bash
# 对 b3 进行配置（暂不支持）
b3 init
# 调用活动页面脚手架
b3 init mhc-activity
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
