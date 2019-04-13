Page({
  data: {
    rollnews: [
      {id: 0, title: "index第一条信息的标题0", content: "第一条信息内容0,第一条信息内容0,第一条信息内容0,第一条信息内容0"},
      {id: 1, title: "index第二条信息的标题1", content: "第二条信息内容1,第二条信息内容1,第二条信息内容1,第二条信息内容1"},
      {id: 2, title: "index第三条信息的标题2", content: "第三条信息内容2,第三条信息内容2,第三条信息内容2,第三条信息内容2"},
    ],

    // 跑马灯 start
    demotext: 'demo2 跑马灯效果,test,test,test,test,test,test,test,结束',
    marqueePace: 1,//滚动速度
    orientation: 'left',//滚动方向
    marqueeDistance: 0,//初始滚动距离
    fontsize: 14,
    interval: 20, // 时间间隔
    // 跑马灯 end

    text: 'demo3 跑马灯效果,test,test,test,test,test,test,test,结束',
    pace: 1.2, //滚动速度
    size: 24, //字体大小in px
    length: 0, //字体宽度
    offsetLeft: 0, //
    windowWidth: 0,
  },

  onShow() {
    // demo3
    this.startMarquee();
  },

  onHide(){
    clearInterval(this.timer)
  },

  /*demo3 start*/
  //创建节点选择器,查询view的宽度
  queryViewWidth(element) {
    return new Promise(resolve => {
      wx.createSelectorQuery().select(element).boundingClientRect(rect => resolve(rect.width)).exec();
    });
  },
  startMarquee: function() {
    var that = this;
    clearInterval(this.timer)
    let boxWidth = wx.getSystemInfoSync().windowWidth;
    that.queryViewWidth('.text').then(textwidth => {
      console.log(textwidth + "/" + boxWidth);
      if (textwidth > boxWidth) { 
        this.timer = setInterval(function() {
          // if (that.data.offsetLeft <= 0) {
          //   if (that.data.offsetLeft >= -textwidth) {
          //     that.setData({ offsetLeft: that.data.offsetLeft - that.data.pace })
          //   } else {
          //     that.setData({ offsetLeft: windowWidth })
          //   }
          // } else {
          //   that.setData({ offsetLeft: that.data.offsetLeft - that.data.pace })
          // }
          if (that.data.offsetLeft < -textwidth) {
            that.setData({ offsetLeft: boxWidth })
          }else{
            that.setData({ offsetLeft: that.data.offsetLeft - that.data.pace })
          }
        }, 20);
      }
    });
  },
  /*demo3 end*/

})
