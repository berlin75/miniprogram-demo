Page({
  data: {
    shareData: {
      title: '自定义转发标题',
      desc: '自定义转发描述',
      path: '/page/API/pages/share/share'
    }
  },

  onShareAppMessage(res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return this.data.shareData
  }
})
