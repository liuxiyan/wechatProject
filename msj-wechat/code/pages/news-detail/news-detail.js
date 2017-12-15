var WxParse = require('../../utils/wxParse/wxParse.js');
var util = require('../../utils/util.js');//引入工具类
const mainHost = require('../../config').mainHost;
let app = getApp();

Page({
  data: {
    cid: '', /* 领域id */
    id: '', /* 文章id */
    pageIndex: '1', /* 评论的页数 */ 
    singleImg: [], /* 数组类型，保存单图数据 */
    commentData: [], /* 数组类型，保存评论内容数据 */
    contentData: {},  /* 对象类型，保存单图的内容数据 */
    bottomHidden: true,
    title:'',
    typeid:'', /* 单图：1；  多图：3  对应原来ct_type */
    imgsData:'' /* 保存多图的内容数据 */
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      typeid: options.typeid
    });
    that.onPullDownRefresh();
  },

  onPullDownRefresh: function () {
    var that = this;
    that.loadMainData(that.data.id);
  },


  handleEventTap: function (e) { /* 跳转到详情页 */
    var that = this;
    var taskId = e.currentTarget.dataset.id;
    var navUrl = "/pages/news-detail/news-detail?id=";
    wx.navigateTo({
      url: navUrl + taskId
    });
  },
 
  loadMainData: function(id){ /* 加载主体内容 */
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: mainHost + '/MpApi/getContentDetail',
      data: {
        id: id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var contentData = res.data;
        var imgsData;
        // 处理主体内容数据
        if (contentData.error == "0") {
          var ctData = contentData.data[0]; 

          wx.setNavigationBarTitle({ title: ctData.title });
         
          if (that.data.typeid == '3'){ /* 如果是多图，调用另外一个接口，返回图片和图片说明，充当文章内容 */
            wx.request({
              url: mainHost + '/MpApi/getPicsListById',
              data: {
                id: id
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function(result){  
                if(result.data.error == '0'){
                  imgsData = result.data.data;
                  that.setData({
                    imgsData: imgsData
                  })
                }
              }

            })
          }

          that.setData({
            cid: ctData.cid,
            contentData: contentData,
          })
          WxParse.wxParse('detailDesc', 'html', ctData.content, that);
        } 

       
        that.loadCommentData(id,'1'); /* 加载评论内容 */
        that.loadSingleImgData(id, that.data.cid); /* 加载推荐图文内容 */

        wx.stopPullDownRefresh();
        wx.hideLoading();
      
      }
    })
  },

  loadCommentData: function(id,pageIndex){ /* 加载评论内容 */
    var that = this;
    wx.request({
      url: mainHost + '/MpApi/getCommentList',
      data: {
        id: id,
        pageIndex: pageIndex
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var commentData = res.data;
        // 处理评论数据
        if (commentData.error == "0") {
          pageIndex++;
          that.setData({
            commentData: commentData.data,
            pageIndex: pageIndex
          })
        }
      }
    })
  },

  loadMoreCommentData: function (id, pageIndex) { /* 加载更多评论内容 */
    var that = this;
    wx.request({
      url: mainHost + '/MpApi/getCommentList',
      data: {
        id: id,
        pageIndex: pageIndex
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        
        var commentData = res.data;
        // 处理评论数据
        if (commentData.error == "0" && commentData.data != undefined) {

          if (commentData.data.length == 0){
            that.setData({
              bottomHidden: false
            })
            return false 
          }
        
         else{ /* 如果返回数据非空 */
            commentData.data = that.data.commentData.concat(commentData.data);
            pageIndex++;
            that.setData({
              commentData: commentData.data,
              pageIndex: pageIndex
            })
          }      
        }
      }
    })
  },

  loadSingleImgData: function (id,cid) { /* 加载推荐图文内容 */
    var that = this;
    wx.request({
      url: mainHost + '/MpApi/getFiveInSameCategory',
      data: {
        id: id,
        cid: cid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
      //  console.log(res.data);
        var singleImgData = res.data;
        // 处理推荐数据
        if (singleImgData.error == "0") {
          for (var i = 0; i < singleImgData.data.length; i++) {
            if (singleImgData.data[i].ct_type == "3") {
              var imgsData = singleImgData.data[i].pics_orgin;
              imgsData = imgsData.split("|", 4).splice(1, 4);
              singleImgData.data[i].pics_orgin = imgsData;
            }
          }
          that.setData({
            singleImg: singleImgData.data
          })
        }
      }
    })
  },

  onReachBottom: function () { /* 上拉加载更多评论内容 */
    var that = this;
    var id = that.data.id;
    var pageIndex = that.data.pageIndex;
    that.loadMoreCommentData(id,pageIndex);
  },

})
