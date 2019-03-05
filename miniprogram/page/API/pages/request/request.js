const requestUrl = require('../../../../config').requestUrl

const duration = 2000

Page({
  onShareAppMessage() {
    return {
      title: '网络请求',
      path: 'page/API/pages/request/request'
    }
  },

  makeRequest() {
    const self = this

    self.setData({
      loading: true
    })

    wx.request({
      url: requestUrl,
      data: {
        noncestr: Date.now()
      },
      success(result) {
        wx.showToast({
          title: '请求成功',
          icon: 'success',
          mask: true,
          duration,
        })
        self.setData({
          loading: false
        })
        console.log('request success', result)
      },

      fail({errMsg}) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
  }
})

/*
get请求
get的方法声明method可以不写，request请求方式默认为get
wx.request({
      url: app.globalData.pubSiteUrl + 'user-information/get-information', //url
      method: 'GET', //请求方式
      header: {
        'Content-Type': 'application/json',
      },
       data: {
        activityId: options.id,  //参数
      },
      success: function(res) {
        if (res.data.code == 1) {
          _this.setData({
            phone: res.data.user.phone,
            password: res.data.user.password
          })
        }
      },
      fail: function() {
        app.consoleLog("请求数据失败");
      },
      complete: function() {
        // complete
      }
    })

post请求
POST请求的Content-Type必须设置为：application/x-www-form-urlencoded

var _this = this;
wx.request({
  url: app.globalData.pubSiteUrl + 'statistics/detail-activity',
  method: 'POST',
  header: {
    'Content-Type': "application/x-www-form-urlencoded",
    'Cookie': 'SESSION=' + wx.getStorageSync("sessionId")
  }, 
  data: {
    activityId: options.id,
  },
  success: function(res) {
    app.consoleLog("请求数据成功");
    _this.setData({ // 设置页面列表的内容
      activityDetail: res.data.activity
    });
    _this.getActivityDetials();
  },
  fail: function() {
    app.consoleLog("请求数据失败");
  },
  complete: function() {
    // complete
  }
})

//封装网络请求
const ajax = (ajaxData, method) => {
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    console.log('use ajax', ajaxData.url)
    return new Promise((resolve, reject) => wx.request({
        url: ajaxData.url,
        method: method || 'GET',
        data: ajaxData.data,
        success(e) {
            // console.log('ajax',e);
            if(e.data.retcode == 0) {
                resolve(e)
                wx.hideLoading();
            } else {
                wx.showToast({
                    title: e.data.message,
                    icon: 'none'
                })
                reject(e)
            }
        },
        fail(e) {
            wx.showLoading({
                title: '网络错误'
            })
        }
    }))
}

调用方法
let util = require('../../utils/util')
var url = "https://api.map.baidu.com/geocoder/v2/";
var params = {
  ak: "btdLALhz2PRv8iqW6oT95l6p", //免费去百度地图上申请一个
  output: "json",
  location: latitude + "," + longitude
}

util.ajax({
  url,
  data: params
}).then(res => {
  console.log(res);
})


//判断是否登录
const checkLogin = () => {
    return new Promise((resolve, reject) => {
        let token = wx.getStorageSync('token');
        let userId = wx.getStorageSync('userId');
        //验证token是否存在
        if(token && userId) {
            //验证token是否过期
            ajax({
                url: API + 'account/checktoken',
                data: { userId, token }
            }).then(e => {  
                resolve();   // 未过期 开始执行业务逻辑
            }).catch(e => {  // 过期 清空本地所有存储 返回到登录页面
                if(e.data.retcode == 99) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userId');
                    wx.reLaunch({ url: '../login/login' })
                }
            })
        } else {
            // token 不存在 未登录过 返回到登录页面
            // 执行清空 保证正确
            wx.reLaunch({ url: '../login/login' })
        }
    });
}

*/
