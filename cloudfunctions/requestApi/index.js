// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.TCB_ENV })
const config = require('config.js')
const {appid, secret} = config

function requestpromise(option){
	return new Promise((resolve, reject) => {
		request(option, (error, response, body) => {
			!error && response.statusCode == 200 ? resolve(body) : reject(error)
		})
	})
}

async function getToken(){
	let tokenurl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
	let body = await requestpromise(tokenurl);
	return JSON.parse(body).access_token;
}

// 云函数入口函数
exports.main = async (event, context) => { 
	try {
		let url, form, token, method = "POST";
		if(event.action == 'env'){
			return {event, context, process: Object.keys(process), processenv: process.env, processconfig: process.config}
		}else if(event.action == 'getTemplateLibraryList'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/wxopen/template/library/list?access_token=${token}`;
			form = JSON.stringify({ "offset": 0, "count": 20 })
			return await requestpromise({url, method, form})
		}else if(event.action == 'getTemplateList'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/wxopen/template/list?access_token=${token}`;
			form = JSON.stringify({ "offset": 0, "count": 20 })
			return await requestpromise({url, method, form})
		}else if(event.action == 'getTemplateLibraryById'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/wxopen/template/library/get?access_token=${token}`;
			form = JSON.stringify({ "id": event.id })
			return await requestpromise({url, method, form})
		}else if(event.action == 'addTemplate'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/wxopen/template/add?access_token=${token}`;
			form = JSON.stringify({ "id": event.id, "keyword_id_list": evnet.keyword_id_list })
			return await requestpromise({url, method, form})
		}else if(event.action == 'deleteTemplate'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/wxopen/template/del?access_token=${token}`;
			form = JSON.stringify({ "template_id": event.tid })
			return await requestpromise({url, method, form})

		}else if(event.action == 'sendTemplateMessage'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`;
			return await requestpromise({
	          	method: "POST",
	          	url,
	          	headers: {"content-type": "application/json"},
	          	json: true,      //这个针对body是不是支持json
	          	body: {
		            "touser": event.userInfo.openId,
		            "template_id": event.template_id,
		            "page": event.page,
		            "form_id": event.form_id,
		            "emphasis_keyword": event.keyword,
		            "data": event.data,
		            /*{
		              "keyword1": { "value": "339208499" },
		              "keyword2": { "value": "2015年01月05日 12:30" },
		              "keyword3": { "value": "腾讯微信总部" },
		              "keyword4": { "value": "广州市海珠区新港中路397号" }
		            },*/
	          	}
	        })

		}else if(event.action == "sendTemplateMessage1"){  
		    // 云调用失败？？？？501001,因为开发者工具 >= 1.02.1903251
			try {
			    return await cloud.openapi.templateMessage.send({
			      	touser: event.userInfo.openId,
			      	page: event.page,
			      	data: event.data,
			      	templateId: event.template_id,
			      	formId: event.form_id,
			      	emphasisKeyword: event.keyword
			    })
			} catch (err) {
			    return err
			}

		}else if(event.action == 'getwxacode'){
			token = await getToken()
			url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${token}`;
			form = JSON.stringify({ "path":event.path, "width":event.width })
			return await requestpromise({url, method, form, encoding: null})
		}else if(event.action == 'getwxacode2'){
			token = await getToken()
			url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${token}`;
			form = JSON.stringify({ "path":event.path, "width":event.width })
			body = await requestpromise({url, method, form, encoding: null})
			return await cloud.uploadFile({
		       	cloudPath: 'wxacode.png',
		       	fileContent: body,
		    })
		}else if(event.action == 'createWXAQRCode'){
			token = await getToken()
			url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${token}`;
			form = JSON.stringify({ "path":event.path, "width":event.width })
			body = await requestpromise({url, method, form, encoding: null})
			return await cloud.uploadFile({
		       	cloudPath: 'wxaqrcode.png',
		       	fileContent: body,
		    })

		}else if(event.action == 'code2Session'){
			const {code, userinfo} = event;
			url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
			body = await requestpromise({url})
			const {session_key,openid} = JSON.parse(body)
			const WXBizDataCrypt = require('./WXBizDataCrypt')
			const pc = new WXBizDataCrypt(appid, session_key)
			return pc.decryptData(userinfo.encryptedData, userinfo.iv)
		}
	}catch(err){
	    return err;
	}
}
