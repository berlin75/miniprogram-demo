var Lock = require('./lib/lock.js');
var app = getApp();

// miniprogram/page/component/pages/demos/wx-gesture-lock-master.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '绘制解锁图案',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.lock = new Lock(this);
  },
  resetPwd: function() {
    this.lock.updatePassword();
  },
  
  onTitleChanged: function(newTitle) { // 文字变化的事件，自定义
    this.setData({
      title: newTitle
    });
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
})