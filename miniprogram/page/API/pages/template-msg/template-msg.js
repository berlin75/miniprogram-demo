Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
    formData: [
      { title: '单号', name: 'keyword1', defaultValue: '000001' },
      { title: '物品名称', name: 'keyword2', defaultValue: '苹果', placeholder: '苹果' },
      { title: '金额', name: 'keyword3', defaultValue: '100', hidden: false },
      { title: '下单时间', name: 'keyword4', defaultValue: '2019-03-01' },
    ],
    template_id: "2GqslIKYHCWqKb-9_ck4mS2CLZBRng3szhvc5Y7-Q_Y"
  },

  sendTemplateMessage(e) {
    let formData = e.detail.value;
    let form_id = e.detail.formId;
    let data = {};
    this.data.formData.forEach(({ name }) => {
        if (name) data[name] = { value: formData[name] };
    });

    /*
    data = [ 
      "keyword1"=>[
        "value"=>"value1",
        "color"=>"#4a4a4a"  // 默认黑色
      ],
      "keyword2"=>[
          "value"=>$fee,
          "color"=>"#9b9b9b"
      ],
      "keyword3"=>[
          "value"=>'value3',
          "color"=>"red"
     ])
    ]
    */

    wx.cloud.callFunction({
        name: 'requestApi',
        data: { 
          form_id, 
          data, 
          template_id: this.data.template_id, 
          page: 'page/component/index',
          keyword: "keyword1.DATA",
          action: 'sendTemplateMessage'
        },
    }).then(res => {
      console.log(res)
      if (res.result && res.result.errcode === 0) {
        wx.showToast({
          title: '成功',
        });
      }else {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    });
  },

  getTemplateLibraryList(){
    this.setData({loading: true})
    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'getTemplateLibraryList'},
    }).then(res => {
      this.setData({loading: false})
      res = JSON.parse(res.result)
      console.log(res)
      if (res && res.errcode === 0) {
        wx.showToast({
          title: '成功',
        });
      }else {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    });
  },

  getTemplateLibraryById(){
    this.setData({loading2: true})
    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'getTemplateLibraryById'},
    }).then(res => {
      this.setData({loading2: false})
      res = JSON.parse(res.result)
      console.log(res)
      if (res && res.errcode === 0) {
        wx.showToast({
          title: '成功',
        });
      }else {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    });
  },

  getTemplateList(){
    this.setData({loading1: true})
    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'getTemplateList'},
    }).then(res => {
      this.setData({loading1: false})
      res = JSON.parse(res.result)
      console.log(res.list)
      if (res && res.errcode === 0) {
        wx.showToast({
          title: '成功',
        });
      }else {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    });
  },

  addTemplate(){
    this.setData({loading3: true})
    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'addTemplate'},
    }).then(res => {
      this.setData({loading3: false})
      console.log(res)
      if (res && res.result && res.result.errcode === 0) {
        wx.showToast({
          title: '成功',
        });
      }else {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    });
  },
  deleteTemplate(){
    this.setData({loading4: true})
    wx.cloud.callFunction({
        name: 'requestApi',
        data: { action: 'deleteTemplate', tid: "eFbbWShEExrzz-nGxqaXinme7IzFYLhGHrk-1ZkMxJo"},
    }).then(res => {
      this.setData({loading4: false})
      console.log(res)
      res = JSON.parse(res.result)
      if (res && res.errcode === 0) {
        wx.showToast({
          title: '成功',
        });
      }else {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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