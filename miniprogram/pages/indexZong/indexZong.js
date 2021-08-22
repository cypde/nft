// miniprogram/pages/indexZong/indexZong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: ["../../images/nft11.jpg","../../images/nft1.jpg"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  into: function(){
    wx.navigateTo({
      url: '/pages/index/index'
    });
  }
})