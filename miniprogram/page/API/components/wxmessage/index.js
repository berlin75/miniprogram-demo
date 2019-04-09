const app = getApp();

Component({
  properties: {
    formData: Array,
    templateId: String
  },
  
  methods: {
    wxMessage(e) {
      let formData = e.detail.value;
      let formId = e.detail.formId;
      console.log(formId)

      let data = {};

      this.properties.formData.forEach(({ name }) => {
        if (name) {
          data[name] = {
            value: formData[name]
          };
        }
      });

      wx.cloud.callFunction({
        name: 'wxmessage',
        data: {
          templateId: this.properties.templateId,
          formId,
          data
        },
      }).then((res) => {
        console.log(res);
        if (res.result && res.result.data && res.result.data.errcode === 0) {
          wx.showToast({ title: '报名成功' });
        } else {
          wx.showToast({ title: '报名失败', icon: 'none' })
        }
      });
    },
  },
});