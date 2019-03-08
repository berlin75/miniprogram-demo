Page({
  onShareAppMessage() {
    return {
      title: 'image',
      path: 'page/component/pages/image/image'
    }
  },
  data: {
    picSize: { "width": 320, "height": 320},
    array: [
      { mode: 'scaleToFill', text: 'scaleToFill：不保持纵横比缩放图片,使图片完全适应' }, 
      {mode: 'aspectFit', text: 'aspectFit：保持纵横比缩放图片,使图片的长边能完全显示出来'}, 
      {mode: 'aspectFill', text: 'aspectFill：保持纵横比缩放图片,只保证图片的短边能完全显示出来'}, 
      {mode: 'top', text: 'top：不缩放图片,只显示图片的顶部区域'}, 
      {mode: 'bottom', text: 'bottom：不缩放图片,只显示图片的底部区域'}, 
      {mode: 'center', text: 'center：不缩放图片,只显示图片的中间区域'}, 
      {mode: 'left', text: 'left：不缩放图片,只显示图片的左边区域'}, 
      {mode: 'right', text: 'right：不缩放图片,只显示图片的右边边区域'}, 
      {mode: 'top left', text: 'top left：不缩放图片,只显示图片的左上边区域'}, 
      {mode: 'top right', text: 'top right：不缩放图片,只显示图片的右上边区域'}, 
      {mode: 'bottom left', text: 'bottom left：不缩放图片,只显示图片的左下边区域'}, 
      {mode: 'bottom right', text: 'bottom right：不缩放图片,只显示图片的右下边区域'}
    ],
    src: '../../resources/pic/cat.jpg'
  },
  imageError: function (e) {
    console.log('image3发生error事件,携带值为', e.detail.errMsg)
  },

  imageLoad: function (e) {
    var maxSize = 320;
    var imgWidth = e.detail.width;
    var imgHeight = e.detail.height;
    var ratio = imgWidth / imgHeight;
    var picSize;
    if (imgWidth >= imgHeight && imgWidth > maxSize) {
      // 如果是宽图并且宽度超过最大宽度,则以最大宽度作为最终宽度并按原始比例计算高度
      picSize = { "width": maxSize, "height": maxSize/ ratio };
    } else if (imgHeight > imgWidth && imgHeight > maxSize) {
      // 如果是长图并且高度超过最大高度,则以最大高度作为最终高度并按原始比例计算宽度
      picSize = { "width": maxSize* ratio, "height": maxSize};
    } else {
      // 如果宽高都在最大限度之内则最终宽高为图片的原始尺寸
      picSize = { "width": imgWidth, "height": imgHeight };
    }
    this.setData({
      picSize: picSize
    })
  }

})
