module.exports = {
  //入口函数。接受用输入的值。
  save: function (e) {
    var that = this;
    var target = e.currentTarget;
    var obj = that.data.form;
    obj[target.dataset.key] = e.detail.value || "";
    that.setData({ form: obj });
    that.validateFun(target.dataset);  //进行验证逻辑。
  },
  saveItem:function(data,value,flag){
    var that = this;
    var obj = that.data.form;
    obj[data.key] = value || "";
    that.setData({ form: obj });
    that.validateFun(data, flag);  //进行验证逻辑。
  },
  //校验判断的主体函数 flag是否跳过异步校验，避免点击提交的时候一直处于异步中状态。
  validateFun: function (data, flag) {
    var that = this;
    //先进行必填校验
    if (typeof data.required !== "undefined") {
      if (that._required(data)) return false;
    }
    //进行正则校验
    if (typeof data.pattern !== "undefined") {
      if (that._pattern(data)) return false;
    }
    //进行自定义校验
    if (typeof data.custom !== "undefined") {
      if (that._custom(data)) return false;
    }
    //进行异步校验
    if (typeof data.async !== "undefined" && !flag) {
      if (that._async(data)) return false;
    }
    //所有校验都通过，更新validate状态。
    that.setData({ validate: that.data.validate });
  },

  //必填校验。
  _required: function (data) {
    var that = this;
    var key = data.key;
    var value = that.data.form[key];   //e.detail.value
    if (typeof value === "number") {
      value = value + "";
    }
    if (!value) {
      that._clearItem(key, false);
      that.data.validate[key + "_required"] = true;
      that.setData({ validate: that.data.validate });
    } else {
      that.data.validate[key + "_required"] = false;
    }
    return !value;
  },
  _pattern: function (data) {
    var that = this;
    var key = data.key;
    var regx = data.pattern;
    var value = that.data.form[key];   //e.detail.value
    if (typeof value === "number") {
      value = value + "";
    }
    if (value === "") { //空值的时候重置为通过状态。
      that.data.validate[key + "_pattern"] = false;
      return false;
    }
    // console.log(regx);
    regx = new RegExp(regx); //字符串转正则对象。
    var res = regx.test(value);
    if (!res){
      that._clearItem(key, false);
      that.data.validate[key + "_pattern"] = true;
      that.setData({ validate: that.data.validate });
    }else{
      that.data.validate[key + "_pattern"] = false;
    }
    return !res;
  },
  _async: function (data) {
    var that = this;
    var key = data.key;
    var fun = data.async;
    var value = that.data.form[key];   //e.detail.value
    if (typeof value === "number") {
      value = value + "";
    }
    //自定义校验。
    that._clearItem(key, false);
    that.data.validate[key + "_asyncing"] = true;
    // that.setData({ validate: that.data.validate });
    that[fun](key, value).then(function(){
      that.data.validate[key + "_asyncing"] = false;
      that.data.validate[key + "_async"] = false;
      that.setData({ validate: that.data.validate });
    },function(){
      that._clearItem(key, false);
      that.data.validate[key + "_asyncing"] = false;
      that.data.validate[key + "_async"] = true;
      that.setData({ validate: that.data.validate });
    });
    return false;   //异步校验无法做到与其他校验互斥，所以应放到最后。
  },
  _custom: function (data) {
    var that = this;
    var key = data.key;
    var fun = data.custom;
    var value = that.data.form[key];   //e.detail.value
    if (typeof value === "number") {
      value = value + "";
    }
    //自定义校验。
    var res = that[fun](key,value,data);   //返回true为校验通过，返回false为校验不通过。
    if (!res) {
      that._clearItem(key, false);
      that.data.validate[key + "_custom"] = true;
      that.setData({ validate: that.data.validate });
    } else {
      that.data.validate[key + "_custom"] = false;
    }
    return !res;
  },
  //删除单个校验项。key项目的名称、flag是否触发setData;
  _deleteItem: function (key) {
    var that = this;
    var fobj = that.data.form;
    var vobj = that.data.validate;
    var list = Object.keys(that.data.validate);
    if (key && key.length) {
      list = list.filter(function (a, b) {
        return a.indexOf(key + "_") === 0;
      });
    }
    for (var i = 0; i < list.length; i++) {
      delete vobj[list[i]];
    }
    delete fobj[key];
    if (flag) {
      that.setData({ validate: vobj });
      that.setData({ form: fobj});
    }
  },
  //清除单个校验项的结果。key项目的名称、flag是否触发setData;
  _clearItem: function (key, flag) {
    var that = this;
    var vobj = that.data.validate;
    var list = Object.keys(that.data.validate);
    if (key && key.length) {
      list = list.filter(function (a, b) {
        return a.indexOf(key + "_") === 0
      });
    }
    for (var i = 0; i < list.length; i++) {
      vobj[list[i]] = false;
    }
    if (flag) {
      that.setData({ validate: vobj });
    }
  },
  //清空校验结果集。没有key的情况下清除所有键的状态。
  _clearOther: function (key) {
    var that = this;
    var vobj = that.data.validate;
    var list = Object.keys(that.data.validate);
    if (key && key.length) {
      list = list.filter(function (a, b) {
        return a.indexOf(key + "_") === -1
      });
    }
    for (var i = 0; i < list.length; i++) {
      vobj[list[i]] = false;
    }
    that.setData({ validate: vobj });
  },
  /**
   * 更新页面所有v-model项校验状态。异步方法。
   * keystr指定单独更新某一项的校验状态，不指定则更新全部
   */
  _update:function(keystr){
    var that = this;
    return new Promise(function (resolve, reject) {
      const query = wx.createSelectorQuery().in(that);
      query.selectAll('.v-model').fields({
        dataset: true
      }, function (res) { //console.log(res)
        var flag = keystr && keystr.length;
        for (var i = 0; i < res.length; i++) {
          var data = res[i].dataset;
          var value = that.data.form[data.key] || "";
          if (flag){  //在指定了keystr之后，只判断等于keystr的项。
            keystr === data.key && that.saveItem(data, value, true);
          }else{
            that.saveItem(data, value, true);
          }
        }
        resolve("done");
      }).exec();
    });
  },
  /**
   * 异步获取表单校验状态，会重新校验所有项目。
   * 如果有一项不通过则为false。异步实现方法：回调函数异步。
   */
  getValidate: function (callback) {
    var that = this;
    that._update().then(function(){
      var flag = true;
      Object.keys(that.data.validate).forEach(function (key) {
        if (that.data.validate[key]) {
          flag = false;
        }
      });
      callback(flag);
    });
  },
  /**
   * 注意这个方法需要确认用户已触发save后才能调用。否则校验项均为空。
   * 同步获取表单校验状态，不会重新对所有值进行校验。
   * keystr: 非必填，指定一个key来获取单项的校验状态。不指定默认遍历所有项。
   */
  getValidateSync:function(keystr){
    var that = this;
    var flag = true;
    var rlag = keystr && keystr.length;
    Object.keys(that.data.validate).forEach(function (key) {
      if(rlag){
        if (that.data.validate[key] && key.indexOf(keystr+"_") === 0){
          flag = false;
        }
      }else{
        if (that.data.validate[key]) {
          flag = false;
        }
      }
    });
    return flag;
  }
}
