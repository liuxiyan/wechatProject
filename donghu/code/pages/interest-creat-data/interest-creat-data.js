const mainHost = require('../../config').mainHost;
let pageSize = 10;

Page({
  data: {
    questionArray: [],
    sayNewArray: [],
    numType: 1,
    current: 'current',
    noCurrent: '',
    bottomFirstShow: true,
    bottomSecondShow: true
  },

  onLoad: function () {
    var that = this;
    // that.onPullDownRefresh();
  },

  changeToQuestion: function () {
    this.setData({
      current: 'current',
      noCurrent: '',
      numType: 1
    })
  },

  changeToNew: function () {
    this.setData({
      current: '',
      noCurrent: 'current',
      numType: 2
    })
    if (!this.data.sayNewArray.length) {
      this.loadNewData();
    }
  },

  onPullDownRefresh: function () {
    var that = this
    that.loadNewData();
  },

  onReachBottom: function () {
    console.log("reachBottom");
    var that = this;
    let pageNum = (that.data.numType == 1 ? Math.ceil(that.data.questionArray.length / pageSize) : Math.ceil(that.data.sayNewArray.length / pageSize)) + 1;
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
        if (that.data.numType == 1) {
          that.setData({
            questionArray: res.data.result
          })
        } else {
          that.setData({
            sayNewArray: res.data.result
          })
        };
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
        if (that.data.numType == 1) {
          if (res.data.status == 'error') {
            that.setData({
              bottomFirstShow: false
            })
            return;
          }
          for (var i = 0; i < res.data.result.length; i++) {
            if (res.data.result[i].status == 1) {
              res.data.result[i].imageUrl = '../../images/ongoing.png';
              res.data.result[i].statusText = '进行中';
            } else {
              res.data.result[i].imageUrl = '../../images/end.png';
              res.data.result[i].statusText = '已结束';
            }
          }
          var newQuestionArray = that.data.questionArray.concat(res.data.result);
          that.setData({
            questionArray: newQuestionArray
          })
        } else {
          if (res.data.status == 'error') {
            that.setData({
              bottomSecondShow: false
            })
            return;
          }
          for (var i = 0; i < res.data.result.length; i++) {
            if (res.data.result[i].status == 1) {
              res.data.result[i].imageUrl = '../../images/ongoing.png';
              res.data.result[i].statusText = '进行中';
            } else {
              res.data.result[i].imageUrl = '../../images/end.png';
              res.data.result[i].statusText = '已结束';
            }
          }
          var newSayNewArray = that.data.sayNewArray.concat(res.data.result);
          that.setData({
            sayNewArray: newSayNewArray
          })
        }
      }
    })
  },

  handleEventTap: function (e) {
    var taskId = e.currentTarget.dataset.id;
    var navUrl = this.data.numType == 1 ? '/pages/interest-creat-data/creat-detail/creat-detail?taskId=' : '/pages/interest-creat-data/say-detail/say-detail?taskId=';
    wx.navigateTo({
      url: navUrl + taskId
    });
  }
})
