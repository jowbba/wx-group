// pages/box/box.js
var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:0,
    box: {},
    select:[],
    setting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userid = user.id
    let boxid = options.id
    Bmob.Cloud.run('getBoxWithId', { userid, boxid }, {
      success: result => {
        let box = JSON.parse(result)
        this.box = box
        this.setData({ box })
      },
      error: err => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.stamp = 0
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
  onShareAppMessage: function () {
  
  },

  previewImage:function(e) {
    let url = e.currentTarget.dataset.url
    let urls = []
    this.data.box.commits.forEach(item => urls.push(item.url))
    if (url) wx.previewImage({
      current: url,
      urls
    })
  },

  openSetting:function() {
    wx.navigateTo({
      url: '../boxSettingList/boxSettingList?boxid=' + this.data.box.objectId,
    })
  }, 

  cancelSelect: function() {
    this.box.commits.forEach(item => {
      if(item.check) item.check = false
    })
    this.setData({
      setting:false,
      box:this.box,
      count:0
    })
  },

  longtap: function(e) {
    console.log('long tap',e)
    if (this.data.setting) return
    let index = e.currentTarget.dataset.index
    this.box.commits[index].check = true
    this.setData({setting: true, box: this.box, count:1})
  },

  touchStart: function(e) {
    console.log('touch start', e)
    this.stamp = e.timeStamp
  },

  touchEnd: function(e) {
    console.log('touch end', e)
    let time = e.timeStamp - this.stamp
    console.log(time)
    if (time < 350 && !this.data.setting ) this.previewImage(e)
    else if (time < 350 && this.data.setting) {
      let index = e.currentTarget.dataset.index
      let count = this.data.count
      if (this.box.commits[index].check) count--
      else count++ 
      this.box.commits[index].check = !this.box.commits[index].check
      this.setData({ box: this.box , count})
    }
  }
  
})