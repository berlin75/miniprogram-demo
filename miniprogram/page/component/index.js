Page({
  onShareAppMessage() {
    return {
      title: '小程序官方组件展示',
      path: 'page/component/index'
    }
  },

  data: {
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['view', 'scroll-view', 'swiper', 'swiper-tab', 'movable-view', 'cover-view']
      }, {
        id: 'content',
        name: '基础内容',
        open: false,
        pages: ['wxfor', 'text', 'icon', 'icon2', 'progress', 'rich-text']
      }, {
        id: 'form',
        name: '表单组件',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker2', 'picker-view', 'radio', 'radio2', 'slider', 'switch', 'textarea', 'modal']
      }, {
        id: 'nav',
        name: '导航',
        open: false,
        pages: ['navigator']
      }, {
        id: 'media',
        name: '媒体组件',
        open: false,
        pages: ['image', 'audio', 'video', 'camera']
      }, {
        id: 'map',
        name: '地图',
        open: false,
        pages: ['map']
      }, {
        id: 'canvas',
        name: '画布',
        open: false,
        pages: ['canvas', 'canvas-api', 'canvas-poster', 'canvas-poster2' ]
      }, {
        id: 'open',
        name: '开放能力',
        open: false,
        pages: ['ad', 'open-data', 'web-view']
      }
    ],

    news: [
      {id: 0, title: "index第一条信息的标题0", content: "第一条信息内容0,第一条信息内容0,第一条信息内容0,第一条信息内容0"},
      {id: 1, title: "index第二条信息的标题1", content: "第二条信息内容1,第二条信息内容1,第二条信息内容1,第二条信息内容1"},
      {id: 2, title: "index第三条信息的标题2", content: "第三条信息内容2,第三条信息内容2,第三条信息内容2,第三条信息内容2"},
    ],

    // 跑马灯 start
    text: '跑马灯效果,test,test,test,test,test,test,test,结束',
    marqueePace: 1,//滚动速度
    orientation: 'left',//滚动方向
    marqueeDistance: 0,//初始滚动距离
    size: 14,
    interval: 20, // 时间间隔
    // 跑马灯 end
  },

  onShow() {
    wx.reportAnalytics('enter_home_programmatically', {})

    // 跑马灯 start
    // 跑马灯实现原理
    // 第一步：计算跑马灯文字长度
    // 第二步：每隔一段时间，移动一点距离，产生移动
    // 第三步：当移出屏幕，重置跑马灯的距离为屏幕宽度，然后就可以继续循环第一步操作了
    var length = this.data.text.length * this.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    this.setData({ length, windowWidth });
    this.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动
    // 跑马灯 end
  },

  // 跑马灯
  runMarquee() {
    var that = this;
    var interval = setInterval(function () {
      //文字一直移动到末端
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.runMarquee();
      }
    }, that.data.interval);
  },

  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    wx.reportAnalytics('click_view_programmatically', {})
  },

  formSubmit: function (e) { 
    var url = '../index/index'
    var key = e.currentTarget.id =="search-input" ? e.detail.value : e.detail.value.input;
    if (key != '') {
      url = url + '?search=' +key;
      wx.navigateTo({ url })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false,
      });
    }
  },
})
