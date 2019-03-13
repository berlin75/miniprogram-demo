// 特殊字体的绘制
// 目前小程序canvas无法支持设置特殊字体，而业务生成的海报，又期望以特殊字体去呈现,
// 最终取了个折中方案——保留数字部分的特殊样式。
// 实现方式为：把0-9这10个数字单独切图，用ctx.drawImage API,以图片形式去绘制。
// function drawNum(num, x, y, w, h) {
//   return new Promise(function (resolve, reject) {
//     //这里存储0-9的图片CDN链接
//     let numMap = []
//     wx.downloadFile({
//       url: numMap[num],
//       success: res => {
//         if (res.statusCode === 200) {
//           ctx.drawImage(res.tempFilePath, x * zoom, y * zoom, w * zoom, h * zoom)
//           resolve()
//         }
//       },
//       fail: () => {
//         reject()
//       }
//     })
//   })
// }

const app = getApp()

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSharePic: false,   //分享海报显示隐藏
    sharePicUrl: '',       //生成海报链接
  },

  _data:{
    poster: '../../resources/pic/poster.jpg',
    logo: '../../resources/pic/logo.jpg',
    sysinfo:{},
  },

  onLoad: function (options) {
    this._data.sysinfo = wx.getSystemInfoSync()
    console.log(this._data.sysinfo)
  },

  wxacodeStorage: function(){
    return new Promise((resolve, reject) => {
      if (app.globalData.wxacode) {
        resolve(app.globalData.wxacode)
      }else{
        wx.cloud.callFunction({
          name: 'requestApi',
          data: { action: 'getwxacode', path: 'page/component/index', width: 280, is_hyaline: true},
        }).then(res => {
          app.globalData.wxacode = res.result
          resolve(res.result)
        }).catch(error => console.log(error))
      }
    })
  },

  //显示/生成分享海报
  showPic() {
    let sharePicUrl = this.data.sharePicUrl;

    if (sharePicUrl != '') {//如果已经生成过一次直接显示
      this.setData({ showSharePic: true })
      return 
    }
    wx.showToast({
      title: '图片生成中',
      mask: true,
      icon: 'loading',
      duration: 100000
    });

    this.wxacodeStorage().then(data => {
      console.log('getwxacode data:', data)
      let fs = wx.getFileSystemManager()
      let src = `${wx.env.USER_DATA_PATH}/qrcode.jpg`
      fs.writeFile({
        filePath: src,
        data: data,
        encoding: 'binary',  // base64
        success: () => this.drawImg(this._data.poster, this._data.logo, src),
        fail: error => console.error(error)
      })
    }).catch(error => console.error(error))
  },     

  //绘图
  drawImg(poster, logo, wxacode) {
    console.log(poster, logo, wxacode)
    let zoom = this._data.sysinfo.windowWidth / 750

    let title = '全新上线通知';      //帖子标题
    let authorName = 'Berlin';      //用户昵称

    let ctx = wx.createCanvasContext('shareFrends');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 670*zoom, 744*zoom);
    if (title.length > 17) title = title.slice(0, 17) + '...';

    //绘制poster
    // ctx.drawImage('../../public/images/1.jpg', 0, 0, w/750*670*2, w/750*380*2)
    ctx.drawImage(poster, 0, 0, 670*zoom, 380*zoom, 0, 0)

    //绘制标题
    ctx.setFontSize(34*zoom)
    ctx.setFillStyle('#333333')//文字颜色
    ctx.fillText(title, 32*zoom, 430*zoom)

    //绘制头像、昵称
    ctx.save()//保存当前的绘图上下文。
    ctx.beginPath()//开始创建一个路径
    ctx.arc(52*zoom, 486*zoom, 20*zoom, 0, 2 * Math.PI, false)  //画一个圆形裁剪区域
    ctx.clip()//裁剪
    ctx.drawImage(logo, 32*zoom, 466*zoom, 40*zoom, 40*zoom)  //绘制图片
    ctx.restore()//恢复之前保存的绘图上下文

    //绘制文本
    ctx.setFontSize(24*zoom)
    ctx.setFillStyle('#333333');
    ctx.fillText(authorName, 82*zoom, 495*zoom)

    //绘制线条
    ctx.moveTo(32*zoom, 539*zoom);
    ctx.lineTo(638*zoom, 539*zoom);
    ctx.setLineWidth = 1;
    ctx.setStrokeStyle('#eeeeee')
    ctx.stroke();

    //绘制左下文案文本
    ctx.setFontSize(28*zoom)
    ctx.setFillStyle('#333333');
    ctx.fillText('官方在线解答', 32*zoom, 593*zoom)

    //绘制文本
    ctx.setFontSize(22*zoom)
    ctx.setFillStyle('#aaaaaa');
    ctx.fillText('答疑，解惑，反馈，应有尽有', 32*zoom, 638*zoom)

    //绘制文本
    ctx.setFontSize(22*zoom)
    ctx.setFillStyle('#aaaaaa');
    ctx.fillText('陪您嗨翻天！', 32*zoom, 672*zoom)

    //绘制二维码和文本
    ctx.drawImage(wxacode, 518*zoom, 564*zoom, 120*zoom, 120*zoom);
    ctx.setFontSize(20*zoom)
    ctx.setFillStyle('#aaaaaa');
    ctx.fillText('长按扫码查看', 518*zoom, 705*zoom)

// 导出清晰图片
// wx.canvasToTempFilePath有destWidth和destHeight属性(输出的图片的宽度高度)
// 若此处以canvas的宽高去填写的话在高像素手机下导出的图片会模糊。
// destWidth和destHeight单位是物理像素(pixel),canvas绘制的时候用的是逻辑像素(物理像素=逻辑像素 * density),
// 所以这里如果只是使用canvas中的width和height(逻辑像素)作为输出图片的长宽的话,生成的图片width和height实际上是缩放了到canvas的1/ density大小了,所以就显得比较模糊了。这里应该乘以设备像素比

    ctx.draw(false, () => {
      wx.canvasToTempFilePath({  //调用接口将画布转换为图片
        x: 0,
        y: 0,
        fileType: 'jpg',
        quality: 1,
        width: 670*zoom,
        height: 744*zoom,
        destWidth: 670*zoom*this._data.sysinfo.pixelRatio,
        destHeight: 744*zoom*this._data.sysinfo.pixelRatio,
        canvasId: 'shareFrends',
        success: res => {
          wx.hideToast();
          this.setData({
            sharePicUrl: res.tempFilePath   //生成的图片路径
          }, () => {                        //渲染完后再显示分享海报
            this.setData({ showSharePic: true })
          })
        },
        fail(err) {
          wx.showToast({ title: '图片生成失败，请稍候再试！', icon: 'none', mask: true })
        }
      })
    })
  },

  // wx.saveImageToPhotosAlbum这个API需用户授权,故开发者需做好拒绝授权的兼容。此处实现对拒绝授权的场景进行引导
  getAuth(callback) {
    wx.getSetting({
      success(res) {
        console.log(res, res.authSetting['scope.writePhotosAlbum'])
        if(res.authSetting['scope.writePhotosAlbum'] === true){
          callback()
        }else if (res.authSetting['scope.writePhotosAlbum'] === undefined) { //呼起授权界面
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => callback(),
            fail: err => console.log('authorize', err)
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] === false) { //引导拒绝过授权的用户授权
          wx.showModal({
            title: '温馨提示',
            content: '需要您授权保存到相册的权限',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    if (res.authSetting['scope.writePhotosAlbum']) callback()
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

  //保存图片
  savePic() {
    this.getAuth(() => {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.sharePicUrl,
        success: res => {
          this.closeShare();
          wx.showToast({ title: '保存成功！', icon: 'success', mask: true })
        }, 
        fail: err => {
          if (err.errMsg !== 'saveImageToPhotosAlbum:fail cancel')
          wx.showToast({ title: '保存失败！', icon: 'none', mask: true })
        }
      })
    })
  },

    //关闭分享海报
  closeShare() {
    this.setData({ showSharePic: false })
  },

})