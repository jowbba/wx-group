var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 'login-first',
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: '进行分享',
      desc: 'what is it?',
      success: (r) => {
        console.log(r)
      }
    }
  },

  inputUsername: function (e) {
    this.setData({ username: e.detail.value })
  },

  inputPassword: function (e) {
    this.setData({ password: e.detail.value })
  },

  wxLogin: function () {
    app.getUserInfo((data) => {
      console.log(data)
      wx.navigateTo({
        url: '../index/index'
      })
    })
    
  }
})



