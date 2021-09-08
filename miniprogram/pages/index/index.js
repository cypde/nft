// miniprogram/pages/index/index.js
var util = require('../../util/util');
// 在页面中定义激励视频广告
let videoAd = null
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

    // setInterval(function(){wx.removeStorage({
    //   key: 'adCount',
    // })},"3600000");14400000

    console.log("时间戳1："+ wx.getStorageSync('timestamp') )
    console.log("时间戳2："+ Date.parse(new Date())/1000 )
    var a = Date.parse(new Date())/1000-wx.getStorageSync('timestamp')
    console.log("时间戳差值："+   a )
    if( a > 14400){
      wx.removeStorage({
          key: 'adCount',
        })
    }
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-83b905177a396f83'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {})
    }
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
  modalcnt:function(e){
    wx.showModal({
        title: '提示',
        content: '四小时之内只需观看一次广告',
        success: function(res) {
      
        }
    })
  },
  check:function(){
    var that =this
    // 用户触发广告后，显示激励视频广告
    if(wx.getStorageSync("adCount") == 1 ){

      //获取当前时间戳  
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      wx.setStorage({key: 'timestamp',data: timestamp })

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
            }
          })
        }
    }else{
      this.adLoad();
    }
  },
  adLoad:function(){
    this.modalcnt()
    var that =this
    // 用户触发广告后，显示激励视频广告
  if (videoAd) {
    videoAd.show().catch(() => {
      // 失败重试
      videoAd.load()
        .then(() => videoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
        })
    })
  }
    // 监听关闭
    videoAd.onClose((status) => {
      var that = this;
      if (status && status.isEnded || status === undefined) {
        //1表示已经观看
        wx.setStorage({      
          key: 'adCount',      
          data: '1'    
        })  
        // wx.setStorageSync('adCount', "1")
      } else{
        //2表示没有观看
        wx.setStorageSync('adCount', "2")
        wx.showToast({
          image: '../../images/cuo.png',
          title: '请观看广告',
          })
      }
     })
  },
   onShareAppMessage: function (res) {
    return {
      title: '幻核NFT,至信链数据存证校验',
      path: '/pages/indexZong/indexZong',
    }
  },
  onShareTimeline(res){
    console.log(res)
    return {
      title: '幻核NFT,至信链数据存证校验',
      path: '/pages/indexZong/indexZong',
      imageUrl:'../../images/nft11.jpg'
    }
  }
})