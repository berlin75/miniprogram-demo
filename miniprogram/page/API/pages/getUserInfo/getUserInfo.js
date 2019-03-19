// miniprogram/page/API/pages/getUserInfo/getUserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.checkSession({
      success(res) {
        // session_key 未过期，并且在本生命周期一直有效
        console.log(res)
      },
      fail(err) {
        // session_key 已经失效，需要重新执行登录流程
        console.log(err)
        return
        wx.login() // 重新登录
      }
    })

    wx.login({
      success(res) {
        if (res.code) {
          const code = res.code;
          const app = getApp();
          app.getAuth(() => {
            wx.getUserInfo({
              success: function (res) {
                console.log(res)
                wx.cloud.callFunction({
                  name: 'requestApi',
                  data: {code: code, userinfo:res, action: 'code2Session'}
                }).then(res => {
                  console.log('wx.cloud.callFunction res', res)
                }).catch(error => console.log(error))
              }
            })
          })

          
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
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