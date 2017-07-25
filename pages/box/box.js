// pages/box/box.js
var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    box: {},
    commits: [],
    setting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let boxid = options.id
    this.getBoxInfor(boxid).then(boxInfor => {
      console.log(boxInfor)
      this.setData({box:boxInfor}) 
      return this.getBoxCommits(boxid)
    }).then(commits => {
      let result = commits.map(item => Object.assign({},item,{check:false}))
      console.log(result)
      this.setData({ commits: result})
      console.log(this)
    }).catch(err => {
        console.log(err)
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

  getBoxCommits:function(id) {
    return new Promise((resolve,reject) => {
      let Box = Bmob.Object.extend('Box')
      let box = new Box()
      box.id = id
      let Commit = Bmob.Object.extend('Commit')
      let query = new Bmob.Query('Commit')
      query.equalTo('box', box)
      query.include("user")
      query.find({
        success: result => resolve(result),
        error: err => reject(err)
        
      })
    })
  },

  getBoxInfor:function(id) {
    return new Promise((resolve, reject) => {
      let Box = Bmob.Object.extend('Box')
      let query = new Bmob.Query(Box)
      query.get(id, {
        success: result => resolve(result),
        error: err => reject(err)
      })
    })
  },

  previewImage:function(e) {
    let commitID = e.currentTarget.dataset.id
    let url = e.currentTarget.dataset.url
    let commit = this.data.commits.find(item => item.id == commitID)
    let urls = commit.attributes.content
    console.log()
    if (urls) wx.previewImage({
      urls: urls,
      current:url
    })
  },

  longtap: function(e) {
    console.log('long tap',e)
    this.setData({setting: true})
  },

  touchStart: function(e) {
    console.log('touch start', e)
    this.stamp = e.timeStamp
  },

  touchEnd: function(e) {
    console.log('touch end', e)
    let time = e.timeStamp - this.stamp
    console.log(time)
    if (time < 350 ) this.previewImage(e)
    
  }
})