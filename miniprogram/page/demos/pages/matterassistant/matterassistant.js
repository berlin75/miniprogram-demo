import DataService from  'utils/DataService';
import {promiseHandle, formatNumber, getDateStr} from 'utils/util';

Page({
  data: {
    showMonth: {},
    data: {showMonth:''},
    selectDateText: '',
    pickerDateValue: '',

    //事项等级数据
    levelSelectedValue: 1,
    levelSelectData: [
      {idx:1, name: "normal", color: "#008000", selected: "checked"}, 
      {idx:2, name: "warning", color: "#FFD700", selected: ""}, 
      {idx:3, name: "danger", color: "#8B0000", selected: ""}
    ],

    // updatePanel 数据
    windowHeight: 10000,
    updatePanelAnimationData: false,
    detailPanelAnimationData: false,

    // 事项列表
    itemList: [],
    editItemList: [], //编辑勾选中的事项id

    // 事项的详情
    itemdetail: false
  },

  onLoad() {
    let _this = this;
    
    promiseHandle(wx.getSystemInfo).then((data) => {
      _this.setData({
        windowHeight: data.windowHeight
      });
    });

    changeDate.call(this);
  },

  onReady() {
    loadItemListData.call(this);
  },

  datePickerChangeEvent(e) {
    const date = new Date(Date.parse(e.detail.value));
    changeDate.call(this, new Date(date.getFullYear(), date.getMonth(), 1));
  },

  changeDateEvent(e) {
    const {year, month} = e.currentTarget.dataset;
    changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
  },

  dateClickEvent(e) {
    const {year, month, date} = e.currentTarget.dataset;
    const {data} = this.data;
    let selectDateText = '';

    data['selected']['year'] = year;
    data['selected']['month'] = month;
    data['selected']['date'] = date;
    
    this.setData({ data: data });

    changeDate.call(this, new Date(year, parseInt(month) - 1, date));
  },

  showUpdatePanelEvent() {
    showUpdatePanel.call(this);
  },

  closeUpdatePanelEvent() {
    closeUpdatePanel.call(this);
  },

  showDetailPanelEvent() {
    showDetailPanel.call(this);
  },

  closeDetailPanelEvent() {
    closeDetailPanel.call(this);
  },

  radiochange(e){
    this.setData({levelSelectedValue: e.detail.value})
  },

  // 点击保存后saveDataEvent比todoTextAreaChangeEvent先执行导致todoTextAreaValue为空
  // 保存事项数据
  saveDataEvent(e) {
    const {title, content, level} = e.detail.value;
    const {year, month, date} = this.data.data.selected; 
    if (title) { 
      let promise = new DataService({
        title,
        content,
        level,
        year: year,
        month: parseInt(month) - 1,
        date: date
      }).save();
      promise && promise.then(() => {
        loadItemListData.call(this);
      })
      
      closeUpdatePanel.call(this);
    } else {
      // showModal.call(this, '请填写事项内容');
      wx.showModal({
        title: '提示',
        content: '请填写事项内容',
        showCancel: false
      })
    }
  },

  checkboxChange(e){
    console.log(e.detail.value)
    this.setData({editItemList: e.detail.value})
  },

  //批量删除事件
  removeRangeTapEvent(e) {
    let {itemList} = this.data;
    if (!itemList) return;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除选定的事项？',
      success: (res) => {
        if (res.confirm) {
          DataService.deleteRange(_this.data.editItemList).then(() => {
            loadItemListData.call(_this);
          });
          _this.setData({ editItemList: [] });
        }
      }
    });
  },

  listItemClickEvent(e) { 
    DataService.findById(e.currentTarget.dataset.id).then(item => {
      item['addDate'] = getDateStr(new Date(item['addDate']));
      this.setData({ itemdetail: item });
      this.showDetailPanelEvent();
    })
  },
});

// 显示事项数据添加更新面板
function showUpdatePanel() {
  let animation = wx.createAnimation({
    duration: 600
  });
  animation.translateY('-100%').step();
  this.setData({
    updatePanelAnimationData: animation.export()
  });
}

// 显示事项数据添加更新面板
function showDetailPanel() {
  let animation = wx.createAnimation({
    duration: 600
  });
  animation.translateY('-100%').step();
  this.setData({
    detailPanelAnimationData: animation.export()
  });
}

// 关闭事项数据添加更新面板
function closeUpdatePanel() {
  let animation = wx.createAnimation({
    duration: 600
  });
  animation.translateY('100%').step();
  this.setData({
    updatePanelAnimationData: animation.export()
  });
}

// 关闭事项数据添加更新面板
function closeDetailPanel() {
  let animation = wx.createAnimation({
    duration: 600
  });
  animation.translateY('100%').step();
  this.setData({
    detailPanelAnimationData: animation.export()
  });
}

// 加载事项列表数据
function loadItemListData() {
  const {year, month, date} = this.data.data.selected;
  let _this = this;
  DataService.findByDate(new Date(Date.parse([year, month, date].join('-')))).then(data => {
    _this.setData({ itemList: data||[] });
  });

}


/**
 * 变更日期数据
 * @param {Date} targetDate 当前日期对象
 */
function changeDate(targetDate) {
  let date = targetDate || new Date();

  let data = [];
 
  let showDate = date.getDate();        //当前显示第几天
  let showMonth = date.getMonth() + 1;  //当天显示月份
  let showYear = date.getFullYear();    //当前显示年份
  let showDay = date.getDay();          //当前显示星期
  let showMonthDateCount = new Date(showYear, showMonth, 0).getDate(); //当前月份的总天数
  date.setDate(1);                       //设置Date对象中月的某一天 (1 ~ 31)
  let showMonthFirstDateDay = date.getDay(); //当前显示月份第一天的星期
  date.setDate(showMonthDateCount);
  let showMonthLastDateDay = date.getDay(); //当前显示月份最后一天的星期  

  let beforeMonthDayCount = 0; //上页月份总天数
  let beforMonth = showMonth === 1 ? 12 : showMonth - 1;      //上一个月月份
  let beforeYear = showMonth === 1 ? showYear - 1 : showYear; //上一个月年份
  let afterMonth = showMonth === 12 ? 1 : showMonth + 1;      //下个月月份
  let afterYear = showMonth === 12 ? showYear + 1 : showYear; //下个月年份
  let beforeDayCount = showMonthFirstDateDay != 0 ? showMonthFirstDateDay - 1 : 6; //获取上一页的显示天数
  let afterDayCount = showMonthLastDateDay != 0 ? 7 - showMonthLastDateDay : 0; //获取下页的显示天数

  //如果天数不够6行，则补充完整
  let tDay = showMonthDateCount + beforeDayCount + afterDayCount;
  if (tDay <= 35) afterDayCount += (6*7 - tDay);

  let selected = this.data.data['selected'] || { year: showYear, month: showMonth, date: showDate };
  let selectDateText = selected.year + '年' + formatNumber(selected.month) + '月' + formatNumber(selected.date) + '日';

  let currentDateObj = new Date();

  data = {
    currentDate: currentDateObj.getDate(), //当天日期第几天
    currentYear: currentDateObj.getFullYear(), //当天年份
    currentDay: currentDateObj.getDay(), //当天星期
    currentMonth: currentDateObj.getMonth() + 1, //当天月份
    showMonth: showMonth, //当前显示月份
    showDate: showDate, //当前显示月份的第几天 
    showYear: showYear, //当前显示月份的年份
    beforeYear: beforeYear, //当前页上一页的年份
    beforMonth: beforMonth, //当前页上一页的月份
    afterYear: afterYear, //当前页下一页的年份
    afterMonth: afterMonth, //当前页下一页的月份
    selected: selected,
    selectDateText: selectDateText
  };

  let dates = [];
  let _id = 0; //为wx:key指定

  if (beforeDayCount > 0) {
    beforeMonthDayCount = new Date(beforeYear, beforMonth, 0).getDate();
    for (let fIdx = 0; fIdx < beforeDayCount; fIdx++) {
      dates.unshift({
        _id: _id,
        year: beforeYear,
        month: beforMonth,
        date: beforeMonthDayCount - fIdx
      });
      _id++;
    }
  }

  for (let cIdx = 1; cIdx <= showMonthDateCount; cIdx++) {
    dates.push({
      _id: _id,
      active: (selected['year'] == showYear && selected['month'] == showMonth && selected['date'] == cIdx), //选中状态判断
      year: showYear,
      month: showMonth,
      date: cIdx
    });
    _id++;
  }

  if (afterDayCount > 0) {
    for (let lIdx = 1; lIdx <= afterDayCount; lIdx++) {
      dates.push({
        _id: _id,
        year: afterYear,
        month: afterMonth,
        date: lIdx
      });
      _id++;
    }
  }

  data.dates = dates;

  this.setData({ 
    data: data, 
    pickerDateValue: showYear + '-' + showMonth 
  });

  loadItemListData.call(this);
}
