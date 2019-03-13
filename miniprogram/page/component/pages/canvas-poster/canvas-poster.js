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
    wxacode: 'cloud://cloud-2f439a.636c-cloud-2f439a/wxacode.png'
  },

  //显示/生成分享海报
  showPic() {
    let sharePicUrl = this.data.sharePicUrl;

    if (sharePicUrl != '') {//如果已经生成过一次直接显示
      this.setData({ showSharePic: true })
    } else {
      wx.showToast({
        title: '图片生成中',
        mask: true,
        icon: 'loading',
        duration: 100000
      });

      wx.cloud.downloadFile({
        fileID: this._data.wxacode
      }).then(res => {
        this.drawImg(this._data.poster, this._data.logo, res.tempFilePath)
      }).catch(error => {
        console.log(error)
      })
    }
  },     

  //绘图
  drawImg(poster, logo, wxacode) {
    console.log(poster, logo, wxacode)

    let title = '全新上线通知';      //帖子标题
    let authorName = 'Berlin';      //用户昵称

    const res = wx.getSystemInfoSync()
    const w = res.screenWidth;
    const zoom = res.windowWidth / 750 * 2

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
    ctx.fillText('性感官方，在线解答', 32*zoom, 593*zoom)

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

    ctx.draw(false, () => {
      wx.canvasToTempFilePath({  //调用接口将画布转换为图片
        x: 0,
        y: 0,
        fileType: 'jpg',
        quality: 1,
        width: 670*zoom,
        height: 744*zoom,
        destWidth: 670*zoom,
        destHeight: 744*zoom,
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
    });
  },

  //保存图片
  savePic() {
    let sharePicUrl = this.data.sharePicUrl;
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '提示',
            content: '是否授权将相册保存到相册？',
            confirmColor: '#2ca2ed',
            success: res => {
              //点击确定打开授权设置
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    // setTimeout(() => {
                      if (res.authSetting['scope.writePhotosAlbum']) {
                        wx.saveImageToPhotosAlbum({
                          filePath: sharePicUrl,
                          success: res => {
                            this.closeShare();
                            wx.showToast({ title: '保存成功！', icon: 'success', mask: true })
                          }, 
                          fail: err => {
                            wx.showToast({ title: '保存失败！', icon: 'none', mask: true })
                          }
                        })
                      } else {
                        wx.showToast({ title: '保存失败！', icon: 'none', mask: true })
                      }
                    // }, 500)
                  }
                })
              }
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: sharePicUrl,
            success: res => {
              this.closeShare();
              wx.showToast({ title: '保存成功！', icon: 'success', mask: true })
            },
            fail: err => {
              wx.showToast({ title: '保存失败！', icon: 'none', mask: true })
            }
          })
        }
      }
    })
  },

    //关闭分享海报
  closeShare() {
    this.setData({ showSharePic: false })
  },

})