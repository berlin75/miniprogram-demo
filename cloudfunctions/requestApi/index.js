// 云函数入口文件
const request = require('request');
const cloud = require('wx-server-sdk');
cloud.init({ env: process.env.TCB_ENV });

function requestpromise(option){
	return new Promise((resolve, reject) => {
		request(option, (error, response, body) => {
			!error && response.statusCode == 200 ? resolve(body) : reject(error)
		});
	})
}

// 云函数入口函数
exports.main = async (event, context) => { 
	try {
	    let tokenurl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx512662bc0d57c6af&secret=9f754de901a14ec0e95949b324b6a54b';
		let body = await requestpromise(tokenurl);
		const token = JSON.parse(body).access_token;
		let url, form, method = "POST";
		if(event.action == 'getTemplateLibraryList'){
			url = 'https://api.weixin.qq.com/cgi-bin/wxopen/template/library/list?access_token=' + token;
			form = JSON.stringify({ "offset": 0, "count": 20 })
			return await requestpromise({url, method, form})
		}else if(event.action == 'getTemplateList'){
			url = 'https://api.weixin.qq.com/cgi-bin/wxopen/template/list?access_token=' + token;
			form = JSON.stringify({ "offset": 0, "count": 20 })
			return await requestpromise({url, method, form})
		}else if(event.action == 'getTemplateLibraryById'){
			url = 'https://api.weixin.qq.com/cgi-bin/wxopen/template/library/get?access_token=' + token;
			form = JSON.stringify({ "id": 'AT0005' })
			return await requestpromise({url, method, form})
		}else if(event.action == 'addTemplate'){
			url = 'https://api.weixin.qq.com/cgi-bin/wxopen/template/add?access_token=' + token;
			form = JSON.stringify({ "id": 'AT0005', "keyword_id_list": [1, 2, 3, 10, 22] })
			return await requestpromise({url, method, form})
		}else if(event.action == 'deleteTemplate'){
			url = 'https://api.weixin.qq.com/cgi-bin/wxopen/template/del?access_token=' + token;
			form = JSON.stringify({ "template_id": event.tid })
			return await requestpromise({url, method, form})
		}else if(event.action == 'sendTemplateMessage'){
			url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token="+token;
			return await requestpromise({
	          	method: "POST",
	          	url,
	          	headers: {"content-type": "application/json"},
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
	          	},
	          	json: true      //这个针对body是不是支持json
	        })
		}else if(event.action == 'getwxacode'){
			url = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + token;
			form = JSON.stringify({ "path":event.path, "width":event.width })
			return await requestpromise({url, method, form, encoding: null})
		}else if(event.action == 'getwxacode2'){
			url = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + token;
			form = JSON.stringify({ "path":event.path, "width":event.width })
			body = await requestpromise({url, method, form, encoding: null})
			return await cloud.uploadFile({
		       	cloudPath: 'wxacode.png',
		       	fileContent: body,
		    })
		}else if(event.action == 'createWXAQRCode'){
			url = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + token;
			form = JSON.stringify({ "path":event.path, "width":event.width })
			body = await requestpromise({url, method, form, encoding: null})
			return await cloud.uploadFile({
		       	cloudPath: 'wxaqrcode.png',
		       	fileContent: body,
		    })
		}
	}catch(err){
	    return err;
	}
}
