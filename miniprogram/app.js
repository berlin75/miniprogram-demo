const config = require('./config')
const event = require('./page/component/pages/demos/lib/event.js');

App({
  onLaunch(opts) {
    console.log('App Launch', opts)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })
    }

    // "page/component/pages/demos/wx-gesture-lock-master"
    event(this);
  },
  onShow(opts) {
    console.log('App Show', opts)
    console.log('app.js wx: ', wx)
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null,
    userInfo:null
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success(res) {
              if (!res.data.openid){
                console.log('拉取用户openid失败，将无法正常使用开放接口等服务')
                callback(res)
                return
              }
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      console.log(res)
      this.globalData.openid = res.result.openid
      return {
        openid: res.result.openid, appid: res.result.appid}
    })
  },
  getAuth(callback) {
    wx.getSetting({
      success(res) {
        console.log(res, res.authSetting['scope.userInfo'])
        if(res.authSetting['scope.userInfo'] === true){
          callback()
        }else if (res.authSetting['scope.userInfo'] === undefined) { //呼起授权界面
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => callback(),
            fail: err => console.log('authorize', err)
          })
        } else if (res.authSetting['scope.userInfo'] === false) { //引导拒绝过授权的用户授权
          wx.showModal({
            title: '温馨提示',
            content: '需要您授权获取用户信息的权限',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']) callback()
                  },
                  fail: err => console.log('openSetting', err)
                })
              }
            }
          })
        }
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      this.getAuth(() => {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      })
    }
  },
})
