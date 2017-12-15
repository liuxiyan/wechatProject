let pageSize = 10;
const mainHost = require('../../config').mainHost;

Page({
  data: {
    dotNumArray: [],
    bottomShow: true
  },

  onLoad: function () {
    var that = this;
    that.onPullDownRefresh();
  },

  onPullDownRefresh: function () {
    var that = this
    that.loadNewData();
  },

  onReachBottom: function () {
    var that = this;
    let pageNum = Math.ceil(that.data.dotNumArray.length / pageSize);
    that.loadMoreData(pageNum);
  },

  loadNewData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: mainHost+'/wx/findDataTaskList',
      data: {
        curr: 1,
        pageSize: pageSize,
        type: 3,
        status: 0
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].status == 1) {
            res.data.result[i].imageUrl = '../../images/ongoing.png';
            res.data.result[i].statusText = '进行中';
          } else {
            res.data.result[i].imageUrl = '../../images/end.png';
            res.data.result[i].statusText = '已结束';
          }
        }
        that.setData({
          dotNumArray: res.data.result
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    })
  },

  loadMoreData: function (pageNum) {
    var that = this;
    wx.request({
      url: mainHost+'/wx/findDataTaskList',
      data: {
        curr: pageNum,
        pageSize: pageSize,
        type: that.data.numType,
        status: 0
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.result.length; i++) {
          if (res.data.result[i].status == 1) {
            res.data.result[i].imageUrl = '../../images/ongoing.png';
            res.data.result[i].statusText = '进行中';
          } else {
            res.data.result[i].imageUrl = '../../images/end.png';
            res.data.result[i].statusText = '已结束';
          }
        }
        if (res.data.result.length == 0) {
          that.setData({
            bottomShow: false
          })
          return;
        }
        var newdotNumArray = that.data.dotNumArray.concat(res.data.result);
        that.setData({
          dotNumArray: newdotNumArray
        })
      }
    })
  },

  handleEventTap: function (e) {
    var taskId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/dot-number/dot-detail/dot-detail?taskId=' + taskId
    });
  }
})