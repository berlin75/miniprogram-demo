let fs = wx.getFileSystemManager()
let basepath = `${wx.env.USER_DATA_PATH}/`

// miniprogram/page/API/pages/filesys/filesys.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  chooseImage: function(){
    wx.chooseImage({
      success(res) {
        console.log('wx.chooseImage:', res)
        const tempFilePaths = res.tempFilePaths
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success(res) {
            console.log('wx.saveFile保存文件到本地,会把临时文件移动,因此调用成功后传入的tempFilePath将不可用:', res)
            wx.getSavedFileInfo({
              filePath: res.savedFilePath,
              success: res => console.log('wx.getSavedFileInfo获取已保存到本地的文件信息:', res),
              fail: error => console.error(error)
            })
          }
        })
      }
    })
  },

  fs: function(){
    fs.readdir({
      dirPath: basepath,
      success: res => {
        console.log('fs.readdir读取目录内文件列表:', res)
        if(res.files){
          let targetFile = basepath + res.files[1]
          console.log('fs.readFile', targetFile)
          fs.stat({
            path: targetFile, 
            success: res => {
              console.log('isFile: ', res.stats.isFile())
              if(res.stats.isFile()){
                fs.readFile({
                  filePath: targetFile,
                  success: res => {
                    console.log('fs.readFile读取本地文件内容:', res, typeof res.data)
                  },
                  fail: error => console.error(error)
                })
              }
            },
            fail: err => console.log(err)
          })
          
        }
      },
      fail: error => console.error(error)
    })
  },

  writefile: function(event){
    console.log(event, event.currentTarget.dataset.imgtype)
    wx.showLoading({title: '加载中'})
    let src = `${wx.env.USER_DATA_PATH}/` + 'qrcode.jpg'
    fs.access({
      path: src,
      success: res => console.log(res, res.errMsg == "access:ok" ? "yes" : "no"),
      fail: err => console.error(err)
    })
    wx.cloud.callFunction({
      name: 'requestApi',
      data: { action: 'getwxacode', path: 'page/component/index', width: 280, is_hyaline: true},
    }).then(res => {
      console.log('getwxacode res:', res)
      // this.setData({src: "data:image/png;base64," + wx.arrayBufferToBase64(res.result)})
      // 先获得一个文件实例
      
      // 把图片base64格式转存到本地
      fs.writeFile({
        filePath: src,
        data: res.result,
        encoding: event.currentTarget.dataset.imgtype,
        success: () => {
          wx.hideLoading()
          this.setData({src})
          wx.getImageInfo({
            src,
            success: res => console.log('wx.getImageInfo:', res),
            fail: error => console.error(error)
          })
          wx.getFileInfo({
            filePath: src,
            success: res => console.log('wx.getFileInfo获取临时文件信息', res),
            fail: error => console.error(error)
          }) 
        },
        fail: error => console.error(error)
      })
    }).catch(error => console.error(error))
  },

  savedfile: function(){
    let that = this
    wx.getSavedFileList({
      success(res) {
        console.log('wx.getSavedFileList获取该小程序下已保存的本地缓存文件列表: ', res)
        that.setData({src: res.fileList[0].filePath})
      },
      fail(error) {
        console.error(error)
      }
    })
  },

  getImageInfo: function(event){
    if(event.currentTarget.dataset.imgtype == 'temp'){
      wx.chooseImage({
        success(res) {
          console.log('wx.chooseImage:', res)
          wx.getImageInfo({
            src: event.currentTarget.dataset.imgurl,
            success: res => console.log(res),
            fail: err => console.error(err)
          })
        }
      })
    }else{
      wx.getImageInfo({
        src: event.currentTarget.dataset.imgurl,
        success: res => console.log(res),
        fail: err => console.error(err)
      })
    }
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