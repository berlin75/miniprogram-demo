// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async () => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }

  /*
  // 这里获取到的openId、appId 和unionId是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
  const {OPENID, APPID, UNIONID} = cloud.getWXContext()

  return {
    OPENID,
    APPID,
    UNIONID,
  }
  */
}
