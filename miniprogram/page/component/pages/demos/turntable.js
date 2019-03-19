var runDegs = 0;
var config = {
  chance: true,
  awards:[
    {'index': 0, 'name': '1元红包'},
    {'index': 1, 'name': '5元话费'},
    {'index': 2, 'name': '6元红包'},
    {'index': 3, 'name': '8元红包'},
    {'index': 4, 'name': '10元话费'},
    {'index': 5, 'name': '10元红包'}
  ]
};

Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: ''
  },
  gotoList: function() {
    console.log('wx.redirectTo')
  },
  onReady: function (e) {
    // 绘制转盘
    var awardsConfig = config.awards,
        len = awardsConfig.length,
        rotateDeg = 360 / len / 2 + 90,
        html = [],
        turnNum = 1 / len  // 文字旋转turn值
    this.setData({ btnDisabled: config.chance ? '' : 'disabled' })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI/180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0,  2 * Math.PI / len, false);

      // 颜色间隔
      i % 2 == 0 ? ctx.setFillStyle('rgba(255,184,32,.1)') : ctx.setFillStyle('rgba(255,203,63,.1)');

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name});    
    }
    this.setData({ awardsList: html });
  },
  getLottery: function () {
    var that = this
    var awardIndex = Math.random() * 6 >>> 0;

    // 获取奖品配置
    var runNum = 8
    if (awardIndex < 2) config.chance = false
    console.log(awardIndex)

    // 旋转抽奖
    runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / 6))
    console.log('deg', runDegs)

    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease'
    })
    animationRun.rotate(runDegs).step()
    that.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    })

    // 中奖提示
    setTimeout(function() {
      wx.showModal({
        title: '恭喜',
        content: '获得' + (config.awards[awardIndex].name),
        showCancel: false
      })
      if (config.chance) {
        that.setData({ btnDisabled: '' })  
      }
    }, 4000);
  },
})
