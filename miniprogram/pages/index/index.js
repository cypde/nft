// miniprogram/pages/index/index.js
var util = require('../../util/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:"",
    // a79e7494f5a5c7b05b51c01d1ab35216af8c208c55d1665f80ab542a0566193d
    rspData:{},
    success:false,
    fail:false,
    info:true,
    infoList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getTxList()
    // setTimeout(function () {
    //   that.getTxList()
    //   }, 10000);
    setInterval(function(){that.getTxList()},"2500");
  },
  getTxList:function(){
    var that = this
    wx.request({
      url: 'https://www.zxinchain.com/api/chain/evidence/txlist',
      method: "GET",
      header :{"content-Type":"application/json"},
      success:function(res){
       console.log(res.data.data)
       that.setData({
         infoList:res.data.data
       })
      }
    })
  },
  messageInput:function(e){
    this.setData({
      message:e.detail,
      success:false,
      fail:false,
      info:true
    })
    console.log(e.detail)
  },
  check:function(){
    var that =this
    if(that.data.message.length == 0 ){
    wx.showToast({
      icon: 'none',
      title: '不能为空!',
      })
    }else{
      wx.showLoading({
        title: '校验中',
      })
      var date = util.formatTime(new Date())
      wx.request({
        url: 'https://zxinchain.com/api/chain/evidence?hash='+this.data.message,
        method: "GET",
        header :{"content-Type":"application/json"},
        success:function(res){
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res.data.data[0])
          if(res.data.data[0] != null){
            wx.showToast({
              title: '校验成功',
            })
            that.setData({
              rspData:res.data.data[0],
              success:true,
              info:false
            }) 
            const db = wx.cloud.database();
            db.collection("zxlInfo").add({
              data: {
               info:res.data.data[0],
               date:date
              }
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '校验失败',
            })
            that.setData({
              fail:true,
              info:false
            })
          }
          console.log(that.data.rspData)
          // console.log(that.data.rspData)
        }
      })
    }
    
  }
})