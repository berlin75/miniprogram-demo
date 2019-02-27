const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '用户鉴权',
      path: 'page/cloud/pages/user-authentication/user-authentication'
    }
  },

  data: {
    openid: '',
    appid: '',
    loading: false
  },

  onGetOpenid() {
    this.setData({
      loading: true
    })
    app.getUserOpenIdViaCloud()
      .then(res => {
        this.setData({
          openid:res.openid,
          appid:res.appid,
          loading: false
        })
        return res.openid
      })
      .catch(err => {
        console.error(err)
      })
  },

  clear() {
    this.setData({
      openid: '',
    })
  }
})
