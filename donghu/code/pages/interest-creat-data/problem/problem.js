
Page({
  data: {
    problemArr: [],
    currentIndex: 0
  },

  onLoad: function (options) {
    var that = this;
  },

  // 获取问题列表
  loadProblemListData: function(){
    var that = this;
    wx.request({
      url: mainHost + '/wx/querySubjecty',
      data: {
        taskId: taskId,
        flag: 0
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

      }
    })
  }
})