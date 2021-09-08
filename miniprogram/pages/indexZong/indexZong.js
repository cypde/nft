// miniprogram/pages/indexZong/indexZong.js
var util = require('../../util/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: ["../../images/nft11.jpg",
    // "../../images/nft1.jpg"
  ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = util.formatTime(new Date())
    wx.cloud.database({}).collection('zxl_pv').add({
      data: {
        date:date,
      },
    });
  },

  into: function(){
    wx.navigateTo({
      url: '/pages/index/index'
    });
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