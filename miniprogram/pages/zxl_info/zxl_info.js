// miniprogram/pages/zxl_info/zxl_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storge = wx.getStorageSync('userInfo')
    if(storge == '' || storge == undefined || storge == null){       
      console.log("2")
      wx.showToast({
        title: '请返回登录后进入！',
        icon: 'none',
        duration: 1500,
        success: function () {
     //定时器，未授权1.5秒后跳转授权页面
        setTimeout(function () {
        wx.reLaunch({
        url: '../index2/index2',
           })
         }, 1500);
        }
       }) 
    }else{
      console.log("1")
      var that = this
      const db = wx.cloud.database({});
      db.collection('zxlInfo')
        .orderBy('date','desc')
        .get()
        .then(res => {
          console.log(res.data)
          that.setData({
            list: res.data,
          })
          console.log(that.data.list)
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