// pages/common/form.js
const vobj = require("../../utils/validate.js");  //引入表单校验辅助对象。
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    form:{},        //表单数据对象。必须有一个空对象占位。
    validate: {},   //表单校验结果对象。必须有一个空对象占位。
    genderlist: [{ key: 0, value: '不填' }, { key: 2, value: '男' }, { key: 1, value: '女' }]
  },
  bindGenderChange: function (e) {  //一个非input类型输入的兼容处理函数。
    var index = e.detail.value;
    var obj = this.data.genderlist[index];
    var vobj = this.data.form;
    vobj.gender = obj.key;    //对应赋值。
    vobj.gendername = obj.value;
    this.setData({ "form": vobj });
    this.saveItem(e.currentTarget.dataset, vobj.gendername);  //触发校验。
  },
  submitFun: function () {
    var that = this;
    that.getValidate(function (flag) {
      if (flag) {
        console.log("校验通过，可以提交");
        //通过处理。
      }else{
        console.log("校验不通过！");
        //不通过处理
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
},vobj));  //表单校验对象继承到page方法中。