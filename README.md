wechat-form-validate
======================

240行的微信小程序表单验证工具，可以快速实现必填校验、正则校验、自定义校验和异步校验。

<h2 align = "center" style="">体验Demo</h2>
<div align=center ><img width="200" height="200" src="https://wx4.sinaimg.cn/mw690/bcef58c1ly1ggbb42hd6pj20760760u3.jpg"/></div>

简介
--------

一个用于微信小程序的表单验证工具，用于快速表单校验，特点在于通过统一的form对象实现表单值规范管理，便于后期字段扩展，变量名维护。

引入方式
--------

```javascript
// pages/common/form.js

const vobj = require("../../utils/validate.js");  //引入表单校验辅助对象。

Page(Object.assign({

	//......小程序页面对象

},vobj));	//通过对象属性拷贝，继承到当前小程序页面对象中。

```
将validate.js的方法拷贝到当前页面中，直接使用。大家可以通过this可以直接访问校验方法，使用灵活、便于验证操作。

使用说明
--------

```html
<view class="form-box">
    <input type="text" class="v-model" data-key="phone" 
        data-required data-pattern="^(1[3-9])\\d{9}$" data-async="asyncPhoneCheckFun" 
        bindinput="save" placeholder='手机号（必填）' value="{{form.phone}}"/>
    <view class="error-msg" wx:if="{{validate.phone_required}}">请输入手机号</view>
    <view class="error-msg" wx:if="{{validate.phone_pattern}}">请输入正确的手机号</view>
    <view class="error-msg" wx:if="{{validate.phone_async}}">手机号已存在不可重复使用</view>
</view>
```

* class="v-model"作为表单校验遍历入口标识。所有带这个class的元素都会被执行validateFun函数，所以请保证data-key data-required等data-*属性，跟class="v-model"在同一个标签上。
* data-key 用于指定当前项的键名。
* data-required 用于标明当前字段需要进行必填校验。
* data-pattern="正则表达式" 用于标明当前字段需要进行正则校验。正则表达式使用时需注意所有的斜杠\ 需要替换成双斜杠\\ 进行转义。如 ^(1[3-9])\d{9}$ 应写为 ^(1[3-9])\\d{9}$ 才能正常执行。
* bindinput 触发值填写，自动将输入的值通过校验工具的save写入到form对象通过data-key指定的键里。这里推荐统一使用校验工具导入的save方法。（如果有特殊输入处理可以自定义其它方法，最后通过this.save(e)或者this.saveItem(data,value)在你的方法里触发该项的校验。）
* value 属性用于值回填，回显表单初值。


项目参考
--------

实现思路参考：[vue-form](https://github.com/fergaldoyle/vue-form) 最早追溯到angular1.x

最后
--------
使用时如果遇到问题欢迎到issues中提问，该项目对你有用的话请给个Star哦。Thanks

Author
------

DearChen (ck_email@163.com)
