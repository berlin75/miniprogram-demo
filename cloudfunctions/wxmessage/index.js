const { WXMINIUser, WXMINIMessage, } = require('wx-js-utils');
const cloud = require('wx-server-sdk')
cloud.init()

// 配置选项
const secret = '9f754de901a14ec0e95949b324b6a54b'; // 小程序 secret id
const tid = '2GqslIKYHCWqKb-9_ck4mS2CLZBRng3szhvc5Y7-Q_Y'; // 模板 id，非必填，也可以从小程序端上传

// 统一回参
function renderReturn(callback, code = 0, data = {}) {
  callback(null, { code, data });
}

/**
 * 云函数主入口
 * @param {Object} event 请求参数
 * @param {String} event.formId 表单提交中携带的 from_id
 * @param {String} event.prepayId 支付场景中的 prepayId
 * @param {Object} event.data 模板内容
 * @param {string} event.page 点击模板卡片后的跳转页
 * @param {string} event.userInfo 用户的 openId，和小程序的 appId
 * @param {string} event.templateId 模板 id
 * @param {Function} callback 云函数回调
 */
exports.main = async (event, context, callback) => {
  const { code, formId, data, page, prepayId, templateId, userInfo } = event;
  const { appId, openId } = userInfo;
  const wxMiniUser = new WXMINIUser({ appId, secret });
  const access_token = await wxMiniUser.getCacheAccessToken()
  const wxMiniMessage = new WXMINIMessage()
  return wxMiniMessage.sendMessage({
    touser: openId,
    form_id: formId || prepayId,
    template_id: templateId || tid,
    access_token,
    data,
    page
  }).then(msg => renderReturn(callback, 0, msg))
    .catch(err => renderReturn(callback, 1, err));

};