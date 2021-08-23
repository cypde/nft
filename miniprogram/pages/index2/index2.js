// mine.js
const App = getApp()
var util = require('../../util/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    hasUserInfo: false,
    logoutflag: false,
    items: [
      {
        icon: '../../images/mine/Fingerprint.png',
        text: '已校验过的NFT',
        path: '/pages/zxl_info/zxl_info',
      },
    ],
    // settings: [
    //   {
    //     icon: '../../images/mine/About-Us.png',
    //     text: '关于我们',
    //     path: '/pages/about/about'
    //   },
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storge1 = wx.getStorageSync('userInfo')
    if ( storge1 == undefined || storge1 == '' ) {
      this.setData({
        hasUserInfo: true
      });
    }else{
      this.setData({
        userinfo: storge1,
        hasUserInfo: true
      });
    }
  },
  onShow:function(){
    let storge1 = wx.getStorageSync('userInfo')
    if ( storge1) {
      this.setData({
        hasUserInfo: false,
        userinfo: storge1
      });
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res) 
        // wx.setStorage('userInfo', res.userInfo)
        wx.setStorage({
          data:  res.userInfo,
          key: 'userInfo',
        })
        this.setData({
          userinfo:res.userInfo,
           hasUserInfo: false,
        })
        var date = util.formatTime(new Date())
        wx.cloud.database({}).collection('zxl_userInfo').add({
          data: {
            date:date,
            userInfo:res.userInfo
          },
        });
      }
    })
  },
  navigateTo:function(e) {
    const index = e.currentTarget.dataset.index;
    const path = e.currentTarget.dataset.path;
    switch (index) {
      default:
        console.log(path);
        // console.log(typeof path);
        wx.navigateTo({
          url: path
        });
    };
  },
  logout:function(){
    var that = this
   wx.showModal({
     title: '提示',
     content: '您确定要退出登录吗?',
     success: function(res) {
         if (res.confirm) {
           that.setData({
             logoutflag:true
           })
           that.logout2()
         } else if (res.cancel) {
         console.log('用户点击取消')
         wx.switchTab({
           url: '/pages/user/user',
          }) 
      }
     }
 })
  },
  logout2:function(){
    if(this.data.logoutflag == true){
      wx.clearStorage({
        success: (res) => {
         wx.showToast({
         title: '退出成功',
         })
         this.setData({
           hasUserInfo: true
         });
       },
      }) 
    }
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