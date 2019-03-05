// miniprogram/page/API/pages/getwxacode/getwxacode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    cloudimg: '',
    qrcode: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'getwxacode', path: 'page/component/index', width: 280, is_hyaline: true},
    }).then(res => {
      console.log('res', res)
      this.setData({src: "data:image/png;base64," + wx.arrayBufferToBase64(res.result)})
    }).catch(error => console.log(error))

    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'getwxacode2', path: 'page/component/index', width: 280},
    }).then(res => {
      console.log('res2', res)
      this.setData({cloudimg: res.result.fileID})
    }).catch(error => console.log(error))

    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'createWXAQRCode', path: 'page/component/index', width: 280},
    }).then(res => {
      console.log('res3', res)
      this.setData({qrcode: res.result.fileID})
    }).catch(error => console.log(error))
  },

  previewImage(e){
    const current = e.target.dataset.cloudimg || e.target.dataset.qrcode;
    wx.previewImage({
      current,
      urls: [this.data.cloudimg, this.data.qrcode]
    })
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