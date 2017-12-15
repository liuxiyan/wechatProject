var WxParse = require('../../../utils/wxParse/wxParse.js');
const mainHost = require('../../../config').mainHost;
let pageSize = 10;
var taskId = '';

Page({
  data: {
    detail: {},
    taskArr: [],
    current: 'current',
    noCurrent: '',
    desShow: 'block',
    ruleShow: 'none',
    moreShow: true,
    bottomShow: true,
    scrollTop: {
      scrollNum: 0,
      goTopShow: false
    }
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    taskId = options.taskId;
    that.loadDetailData(taskId);
    that.loadTaskListData(taskId,1);
  },

  onReady: function () {
    var that = this;
  },

  scrollTopFun: function (e) {
    console.log(e.detail.scrollTop);
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

  scrollToBottom: function (e) {
    var that = this;
    if (!that.data.bottomShow) return;
    if (that.data.moreShow) {
      let pageNum = Math.ceil(that.data.commentArr.length / pageSize) + 1;
      that.loadCommentList(taskId, pageNum);
    };
    that.setData({
      moreShow: false
    });
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
      url: mainHost+'/wx/goTaskDetail',
      data: {
        taskId: taskId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.taskDetail.status == 1) {
          res.data.taskDetail.statusText = '我要参与';
          res.data.taskDetail.bottomStyle = 'bottom-start';
        } else {
          res.data.taskDetail.statusText = '已结束';
          res.data.taskDetail.bottomStyle = 'bottom-end';
        }
        WxParse.wxParse('detailDesc', 'html', res.data.taskDetail.detail_desc, that);
        that.setData({
          detail: res.data.taskDetail
        })
      }
    })
  },

//获取投标列表
  loadTaskListData: function (taskId, currentPate){
    var that = this;
    wx.request({
      url: mainHost + '/wx/getDrawDetailList',
      data: {
        taskId: taskId,
        curr: currentPate,
        pageSize: pageSize
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          moreShow: true
        });
        if (res.data.status == 'error') {
          that.setData({
            bottomShow: false
          })
          return;
        };
        for (var i = 0; i < res.data.result.length; i++){
          if (res.data.result[i].orderStatus == 1){
            res.data.result[i].progress = 33.333;
            res.data.result[i].bgOne = '#63e882';
            res.data.result[i].bgTwo = '#02aafe';
          } else if (res.data.result[i].orderStatus == 2){
            res.data.result[i].progress = 66.666;
            res.data.result[i].bgOne = '#63e882';
            res.data.result[i].bgTwo = '#63e882';
            res.data.result[i].bgThree = '#02aafe';
          } else if (res.data.result[i].orderStatus == 3) {
            res.data.result[i].progress = 100;
            res.data.result[i].bgOne = '#63e882';
            res.data.result[i].bgTwo = '#63e882';
            res.data.result[i].bgThree = '#63e882';
            res.data.result[i].bgFour = '#02aafe';
          } else if (res.data.drawDetailList[i].orderStatus == 4) {
            res.data.result[i].progress = 100;
            res.data.result[i].bgOne = '#63e882';
            res.data.result[i].bgTwo = '#63e882';
            res.data.result[i].bgThree = '#63e882';
            res.data.result[i].bgFour = '#63e882';
          }
          if (res.data.result[i].target == 1){
            res.data.result[i].sign = '优秀';
            res.data.result[i].signUrl = '../../../images/zb.png';
            res.data.result[i].signShow = false;
          } else if (res.data.drawDetailList[i].target == 2) {
            res.data.result[i].sign = '中标';
            res.data.result[i].signUrl = '../../../images/yx.png';
            res.data.result[i].signShow = false;
          }else{
            res.data.result[i].signShow = true;
          }
        }
        that.setData({
          taskArr: res.data.result
        })
      }
    })
  },

  startTask: function (e) {
    var that = this;
    if (that.data.detail.status == 2) return;
    // wx.navigateTo({
    //   url: '/pages/interest-creat-data/involvement-in/involvement-in'
    // });
  }
})