Component({
  properties: {
    news: { 
      type: Array,
      value: [
        {id: 0, title: "第一条信息的标题0", content: "第一条信息内容0,第一条信息内容0,第一条信息内容0,第一条信息内容0"},
        {id: 1, title: "第二条信息的标题1", content: "第二条信息内容1,第二条信息内容1,第二条信息内容1,第二条信息内容1"},
        {id: 2, title: "第三条信息的标题2", content: "第三条信息内容2,第三条信息内容2,第三条信息内容2,第三条信息内容2"},
      ]
    },
    newid: Number
  },

  methods: {
    bindchange(e) {
      this.setData({newid: this.data.news[e.detail.current].id})
    },
    showdetail(e) {
      var id = e.currentTarget.dataset.newid;
      wx.showModal({
        title: this.properties.news[id].title,
        content: this.properties.news[id].content,
        showCancel: false
      })
    }
  },
});