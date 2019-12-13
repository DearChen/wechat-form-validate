// pages/custom/form.js
const vobj = require("../../utils/validate.js");  //引入表单校验辅助对象。
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},        //表单数据对象。必须有一个空对象占位。
    validate: {},    //表单校验结果对象。必须有一个空对象占位。
    genderlist: [{ key: 0, value: '不填' }, { key: 2, value: '男' }, { key: 1, value: '女' }]
  },

  /**
   * 一个非input类型输入的兼容处理函数。
   */
  bindGenderChange: function (e) {
    var index = e.detail.value;
    var obj = this.data.genderlist[index];
    var vobj = this.data.form;
    vobj.gender = obj.key;    //对应赋值。
    vobj.gendername = obj.value;
    this.setData({ "form": vobj });
    this.saveItem(e.currentTarget.dataset, vobj.gendername);  //触发校验。
  },

  /**
   * 年龄的自定义校验函数。(通过validate.js触发调用，传入三个参数)
   * key 当前字段键名，value当前值，data当前
   * 返回true 校验通过，返回false 校验不通过。
   */
  ageCustomFun: function (key, value, data){
    // console.log(key, value, data);
    //值为空时忽略自定义校验。设为通过。
    if (!value) {
      return true
    }
    if(Number(value) <= 100 && Number(value) >= 0){
      return true;
    }else{
      return false;
    }
  },
  
  /**
   * 通用最小值自定义控制。
   */
  minCustomFun: function (key, value, data){
    var that = this;
    //如果有多对区间判断可以考虑用当前最小值的key来生成最大值的key。增强minCustomFun的复用性。
    //多对区间判断如：max_area min_area; max_index min_index; max_length min_length;等等，两个key之间有共同点可以转换。
    //如：var maxkey = 'max_' + key.split("_")[1];  从当前最小值key生成对应的最大值key。
    // var maxkey = "max_price";
    var maxkey = 'max_' + key.split("_")[1];
    var maxval = that.data.form[maxkey] || '';
    //jump为true就不再检查关联字段，避免循环调用。
    if (!data.jump){
      that.validateFun({ key: maxkey, custom: 'maxCustomFun', jump: true });  //同步最大值校验状态。
    }
    //当最小值为空或者最大值为空的时候，置为校验通过。
    if (!value || maxval === '') {
      return true
    }
    //最小值大于最大值时校验不通过。
    if (Number(value) > Number(maxval)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 通用最大值自定义控制。
   */
  maxCustomFun: function (key, value, data) {
    var that = this;
    //如果有多对区间判断可以考虑用当前最大值的key来生成最小值的key。增强maxCustomFun的复用性。
    //多对区间判断如：max_area min_area; max_index min_index; max_length min_length;等等，两个key之间有共同点可以转换。
    //如：var minkey = 'min_' + key.split("_")[1];  从当前最大值key生成对应的最小值key。
    // var minkey = 'min_price';
    var minkey = 'min_' + key.split("_")[1];
    var minval = that.data.form[minkey] || '';
    //jump为true就不再检查关联字段，避免循环调用。
    if (!data.jump) { 
      that.validateFun({ key: minkey, custom: 'minCustomFun', jump: true }); //同步最小值校验状态。
    }
    if (!value || minval === '') {
      return true
    }
    //最小值大于最大值时校验不通过。
    if (Number(minval) > Number(value)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 表单提交处理
   */
  submitFun: function () {
    var that = this;
    that.getValidate(function (flag) {
      if (flag) {
        console.log("校验通过，可以提交");
        //通过处理。
      } else {
        console.log("校验不通过！");
        //不通过处理
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //可以在这里对表单赋初值。（表单数据回显）
    // this.setData({
    //   "form":{
    //     uname:"测试",
    //     age:24,
    //     gender:2,
    //     gendername:"男"
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
},vobj));