//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '进入我的云',
    userInfo: {},
    buttonSize: "default",
    loading: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  enterCloud: () => {
    wx.switchTab({
      url: '../home/home'
    })
  },
  
  onLoad: function () {
    var that = this
    app.getUserInfo((data) => {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })
  }
})
