var WxParse = require('../../../utils/wxParse/wxParse.js');
const mainHost = require('../../../config').mainHost;
let pageSize = 10;
var taskId = '';

Page({
  data: {
    detail: {},
    commentArr: [],
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
    that.loadCommentList(taskId, 1);
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

  scrollToBottom: function (e) {
    // console.log('---------');
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
      url: mainHost+'/wx/say',
      data: {
        taskId: taskId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.task.status == 1) {
          res.data.task.statusText = '我要参与';
          res.data.task.bottomStyle = 'bottom-start';
        } else {
          res.data.task.statusText = '已结束';
          res.data.task.bottomStyle = 'bottom-end';
        }
        WxParse.wxParse('detailDesc', 'html', res.data.task.detail_desc, that);
        that.setData({
          detail: res.data.task
        })
      }
    })
  },

  loadCommentList: function (taskId, currentPate) {
    var that = this;
    wx.request({
      url: mainHost + '/wx/commentsList',
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
        that.setData({
          commentArr: res.data.result
        })
      }
    })
  },

  startTask: function (e) {
    var that = this;
    if (that.data.detail.status == 2) return;
    wx.navigateTo({
      url: '/pages/interest-creat-data/involvement-in/involvement-in'
    });
  },

  support: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: mainHost+'/wx/updateDz',
      data: {
        commentId: id,
        userId:''//todo
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 'success') {
          that.data.commentArr[index].praise_count = that.data.commentArr[index].praise_count + 1;
          var supportComment = that.data.commentArr;
          that.setData({
            commentArr: supportComment
          })
        }
      }
    })
  }
})