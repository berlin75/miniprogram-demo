/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

// const host = '14592619.qcloud.la'
const host = 'erpq3w4p.qcloud.la'

const config = {

  // 下面的地址配合云端 Server 工作
  host,

  // 登录地址，用于建立会话
  loginUrl: `https://${host}/login`,

  // 测试的请求地址，用于测试会话
  requestUrl: `https://${host}/testRequest`,

  // 用code换取openId
  openIdUrl: `https://${host}/openid`,

  // 测试的信道服务接口
  tunnelUrl: `https://${host}/tunnel`,

  // 生成支付订单的接口
  paymentUrl: `https://${host}/payment`,

  // 发送模板消息接口
  templateMessageUrl: `https://${host}/templateMessage`,

  // 发送订阅消息接口
  subscribeMessageUrl: `https://${host}/subscribeMessage`,

  // 上传文件接口
  uploadFileUrl: `https://${host}/upload`,

  // 下载示例图片接口
  downloadExampleUrl: `https://${host}/static/weapp.jpg`,

  // 云开发环境 ID
  envId: 'cloud-2f439a',

  // 云开发-存储 示例文件的文件 ID
  demoImageFileId: 'cloud://cloud-2f439a.636c-cloud-2f439a/1551016798270-4550643.png',
  demoVideoFileId: 'cloud://cloud-2f439a.636c-cloud-2f439a/暴风截图20181021881939765.jpg',
}

module.exports = config
