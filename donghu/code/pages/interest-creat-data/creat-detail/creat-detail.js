var WxParse = require('../../../utils/wxParse/wxParse.js');
const mainHost = require('../../../config').mainHost;

Page({
  data: {
    detail: {},
    current: 'current',
    noCurrent: '',
    desShow: 'block',
    ruleShow: 'none',
    scrollTop: {
      scrollNum: 0,
      goTopShow: false
    }
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var taskId = options.taskId;
    that.loadDetailData(taskId);
  },

  onReady: function () {
    var that = this;
  },

  scrollTopFun: function (e) {
    var that = this
    if (e.detail.scrollTop > 100) {
      that.setData({
        'scrollTop.goTopShow': true
      });
    } else {
      that.setData({
        'scrollTop.goTopShow': false
      });
    }
  },

  toTop: function () {
    this.setData({
      'scrollTop.scrollNum': 0
    })
  },

  changeToDes: function (e) {
    this.setData({
      current: 'current',
      noCurrent: '',
      desShow: 'block',
      ruleShow: 'none'
    })
  },

  changeToRule: function (e) {
    this.setData({
      current: '',
      noCurrent: 'current',
      ruleShow: 'block',
      desShow: 'none'
    })
  },

  loadDetailData: function (taskId) {
    var that = this;
    wx.request({
      url: mainHost+'/wx/toTextForTask',
      data: {
        taskId: taskId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.text.status == 1) {
          res.data.text.statusText = '开始任务';
          res.data.text.bottomStyle = 'bottom-start';
        } else {
          res.data.text.statusText = '已结束';
          res.data.text.bottomStyle = 'bottom-end';
        }
        WxParse.wxParse('detailDesc', 'html', res.data.text.detail_desc, that);
        that.setData({
          detail: res.data.text
        })
      }
    })
  },

  startTask: function (e) {
    var that = this;
    if (that.data.detail.status == 2) return;
    wx.navigateTo({
      url: '/pages/interest-creat-data/problem/problem'
    });
  }
})
