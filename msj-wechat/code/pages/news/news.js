//index.js
//获取应用实例
const mainHost = require('../../config').mainHost;
let pageSize = 1;

Page({
  data: {
    userInfo: {},
    currTabId: "", /* 当前显示的栏目ID，默认显示第一栏 */
    numType: "1", /* 保存当前高亮的tab栏，并控制主体内容块的显示和隐藏 */
    tabStatusArr: ["tab-opt tab-active", "tab-opt", "tab-opt", "tab-opt", "tab-opt"], /* 默认tab栏子元素的样式 */
    navBar: [],
    singleImg1: [],
    singleImg2: [],
    singleImg3: [],
    singleImg4: [],
    singleImg5: [],
    pageIndex1: 1,
    pageIndex2: 1,
    pageIndex3: 1,
    pageIndex4: 1,
    pageIndex5: 1,
    bottomHidden: true /* 底部无数据提示 */
  },

  onLoad: function () {
    var that = this;
    that.loadTabData();
  },

  onPullDownRefresh: function () { /* 下拉刷新 */
    var that = this; 
    that.loadNewData();
  },

  setTabCondition: function (e) { /* tab栏切换 */
    var that = this;
    if (e.target.dataset.index == '1') {
      that.setData({
        numType: 1,
        currTabId: e.target.dataset.id,
        tabStatusArr: ["tab-opt tab-active", "tab-opt", "tab-opt", "tab-opt", "tab-opt"],
      })
    }

    if (e.target.dataset.index == '2') {
      that.setData({
        numType: 2,
        currTabId: e.target.dataset.id,
        tabStatusArr: ["tab-opt", "tab-opt tab-active", "tab-opt", "tab-opt", "tab-opt"],
      });
      if (that.data.singleImg2 == ''){
        that.loadNewData();
     }


    }
    
    if (e.target.dataset.index == '3') {
      that.setData({
        numType: 3,
        currTabId: e.target.dataset.id,
        tabStatusArr: ["tab-opt", "tab-opt", "tab-opt tab-active", "tab-opt", "tab-opt"],
      })
      if (that.data.singleImg3 == '') {
        that.loadNewData()
      }
    }

    if (e.target.dataset.index == '4') {
      that.setData({
        numType: 4,
        currTabId: e.target.dataset.id,
        tabStatusArr: ["tab-opt", "tab-opt", "tab-opt", "tab-opt tab-active", "tab-opt"],
      })
      if (that.data.singleImg4 == '') {
        that.loadNewData()
      }
    }

    if (e.target.dataset.index == '5') {
      that.setData({
        numType: 5,
        currTabId: e.target.dataset.id,
        tabStatusArr: ["tab-opt", "tab-opt", "tab-opt", "tab-opt", "tab-opt tab-active"],
      })
      if (that.data.singleImg5 == '') {
        that.loadNewData()
      }
    }

   
  },

  handleEventTap: function (e) { /* 跳转到详情页 */
    var that = this;
    var taskId = e.currentTarget.dataset.id;
    var typeid = e.currentTarget.dataset.typeid;
    var navUrl = "/pages/news-detail/news-detail?id=";
    wx.navigateTo({
      url: navUrl + taskId + "&typeid=" + typeid
    });
  },

  loadTabData:function(){ /* 加载tab栏数据，五个 */
    var that = this;
    wx.request({
      url: mainHost + '/MpApi/getDefaultDomainList',
      header:{
        "Content-Type":"application/json"
      },
      success:function(res){
        var data = res.data;
        if(data.error === '0'){
          that.setData({
            navBar: data.data,
            currTabId: data.data[0].id,
            numType: '1',
          })
        }
        that.loadNewData();
      }

    })
  },

  loadNewData: function () { /*加载数据*/
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: mainHost + '/MpApi/getContentListByCid',
      data:{
        cid: that.data.currTabId,
        pageIndex: '1'
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var data = res.data;
        if (data.error == "0" && data.data != undefined) {       
          for (var i = 0; i < data.data.length; i++) {
            if (data.data[i].ct_type == "3") {
              var imgsData = data.data[i].pics_orgin;
              imgsData = imgsData.split("|", 4).splice(1, 4);
              data.data[i].pics_orgin = imgsData;
            }
          }

          if (that.data.numType == '1'){           
            that.setData({
              singleImg1: data.data,
              pageIndex1: 2
            })
          } else if (that.data.numType == '2'){
            that.setData({
              singleImg2: data.data,
              pageIndex2: 2
            })
          } else if (that.data.numType == '3') {
            that.setData({
              singleImg3: data.data,
              pageIndex3: 2
            })
          } else if (that.data.numType == '4') {
            that.setData({
              singleImg4: data.data,
              pageIndex4: 2
            })
          } else if (that.data.numType == '5') {
            that.setData({
              singleImg5: data.data,
              pageIndex5: 2
            })
          }else{
            return false;
          }
          
        }

        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    });

  },

  loadMoreData: function(){ /* 加载更多数据 */
    var that = this;
    var pageIndexNum;
    var singleData;
 
     if (that.data.numType == '1'){
       pageIndexNum = that.data.pageIndex1;
       singleData = that.data.singleImg1;
     }
     if (that.data.numType == '2') {
       pageIndexNum = that.data.pageIndex2; 
       singleData = that.data.singleImg2;
     }
     if (that.data.numType == '3') {
       pageIndexNum = that.data.pageIndex3;
       singleData = that.data.singleImg3;
     }
     if (that.data.numType == '4') {
       pageIndexNum = that.data.pageIndex4;
       singleData = that.data.singleImg4;
     }
     if (that.data.numType == '5') {
       pageIndexNum = that.data.pageIndex5;
       singleData = that.data.singleImg5;
     }



    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: mainHost + '/MpApi/getContentListByCid',
      data: {
        cid: that.data.currTabId,
        pageIndex: pageIndexNum
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var data = res.data;
        pageIndexNum++;
        if (data.error == "0" && data.data != undefined) {
          if(data.data.length == 0){
            that.setData({
              bottomHidden: false,     
            })
            wx.stopPullDownRefresh();
            wx.hideLoading();
            return false;
          }

          for (var i = 0; i < data.data.length; i++) {
            if (data.data[i].ct_type == "3") {
              var imgsData = data.data[i].pics_orgin;
              imgsData = imgsData.split("|", 4).splice(1, 4);
              data.data[i].pics_orgin = imgsData;
            }
          }
          singleData = singleData.concat(data.data)
          

          if (that.data.numType == '1') {
              that.setData({
              singleImg1: singleData,
              pageIndex1: pageIndexNum
           })
          }
          if (that.data.numType == '2') {
            that.setData({
              singleImg2: singleData,
              pageIndex2: pageIndexNum
            })
          }
          if (that.data.numType == '3') {
            that.setData({
              singleImg3: singleData,
              pageIndex3: pageIndexNum
            })
          }
          if (that.data.numType == '4') {
            that.setData({
              singleImg4: singleData,
              pageIndex4: pageIndexNum
            })
          }
          if (that.data.numType == '5') {
            that.setData({
              singleImg5: singleData,
              pageIndex5: pageIndexNum
            })
          }
        }

        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    });
  },

  onReachBottom: function () { /* 上拉加载更多 */
    var that = this;
    that.loadMoreData();
  },


})
