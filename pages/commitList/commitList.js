// pages/commitList/commitList.js
var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commit: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.getCommit(id).then(data => {
      console.log(data)
      this.setData({ commit: Object.assign({}, data)})
    }).catch(err =>console.log(err))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this)
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

  getCommit: function (id) {
    return new Promise((resolve, reject) => {
      let Commit = Bmob.Object.extend('Commit')
      let query = new Bmob.Query(Commit)
      query.get(id, {
        success: result => resolve(result),
        error: err => reject(err)
      })
    })
  },

  previewImage: function(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: this.data.commit.attributes.content,
      current:url
    })
  }
})