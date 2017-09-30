// pages/commit/commit.js
var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    commitContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log()
    this.setData({
      tempFilePaths: app.globalData.tempFilePaths
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(user)
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
    app.tempFilePaths = []
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

  //输入描述
  inputCommit: function (e) {
    this.setData({ commitContent: e.detail.value })
  },
  //预览照片
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.image,
      urls: this.data.tempFilePaths,
    })
  },
  //继续添加照片
  addPhoto:function() {
    let that = this
    wx.chooseImage({
      success: function(res) {
        console.log(res.tempFilePaths)
        let temp = [...res.tempFilePaths, ...that.data.tempFilePaths]
        console.log(temp)
        that.setData({
          tempFilePaths:temp
        })
      },
    })
  },

  commit: function() {
    if (!this.data.tempFilePaths.length) return
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '上传中',
    })

    this.uploadFiles(this.data.tempFilePaths).then(urls => {
      console.log(urls)
      return this.createCommit(this.data.commitContent, urls)
    }).then(commitResult => {
        console.log(commitResult)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }).catch(e => {console.log(e)})
  },

  createBox: function (name, description) {
    return new Promise((resolve,reject) => {
      // group obj
      let Group = Bmob.Object.extend('Group')
      let group = new Group()
      group.id = app.globalData.currentGroup.id
      //box
      let Box = Bmob.Object.extend('Box')
      let box = new Box()
      box.set('name', name)
      box.set('parent', group)
      box.set('description', description)
      box.save({
        success: result => resolve(result),
        error: (result,err) => reject(err)
      })
    })
  },

  uploadFiles: function(fileList) {
    return new Promise((resolve,reject) =>{
      let newDate = (new Date()).toLocaleDateString()
      let count = fileList.length
      let index = 0
      let urls = []
      let upload = url => {
        console.log(url)
        let extension = /\.([^.]*)$/.exec(url)
        if (extension) extension = extension[1].toLowerCase()
        let name = newDate + "." + extension
        let file = new Bmob.File(name, [url])
        file.save().then(res => {
          console.log("第 " + index + " 张Url : " + res.url())
          urls.push(res.url())
          if (++index == count) resolve(urls)
          else upload(fileList[index])
        })
      }
      upload(fileList[index])
    })
  },

  createCommit: function (description, urls) {return new Promise((resolve,reject) => {
      let userid = user.id
      let groupid = app.globalData.currentGroup.objectId
      let type = 'photo'
      Bmob.Cloud.run('createCommit', { userid, groupid, urls, description, type}, {
        success: result => resolve(result),
        error: err => reject(err)
      })
    })
  }
})