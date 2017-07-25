// pages/group/group.js
var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group:{},
    users: [],
    commits: [],
    inputValue:'',
    currentUserID:'',
    toView:'',
    settingPin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ group: app.globalData.currentGroup})
    console.log(this.data.group.attributes.pin)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({title: this.data.group.attributes.name})
    this.getUserList()
    this.setData({ currentUserID: user.id})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCommitList().then(results => {
      this.setData({ commits: results })
      let commits = this.data.commits
      if (!commits.length) return
      let lastID = commits[commits.length - 1].id
      this.setData({ toView: lastID })
    })
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

  // 用户输入
  input:function(e) {
    this.setData({ inputValue: e.detail.value})
  },
  // 提交
  commitText: function() {
    let Group = Bmob.Object.extend('Group')
    let group = new Group()
    group.id = app.globalData.currentGroup.id
    let Commit = Bmob.Object.extend("Commit")
    let commit = new Commit()
    commit.set('user', user)
    commit.set('parent', group)
    commit.set('description', this.data.inputValue)
    commit.set('type', 'text')
    commit.save({
      success: result => {
        console.log(result)
        this.setData({ inputValue:''})
      }
    })
  },

  // 开始录音
  startRecord(e) {
    wx.startRecord({
      success:function(res){
        wx.showNavigationBarLoading()
        wx.showLoading({
          title: '上传中',
        })
        let tempFilePath = [res.tempFilePath]
        let file = new Bmob.File('record.silk', tempFilePath)
        file.save().then(function(res) {
          console.log(res)
          let url = res.url()
          let Group = Bmob.Object.extend('Group')
          let group = new Group()
          group.id = app.globalData.currentGroup.id
          let Commit = Bmob.Object.extend("Commit")
          let commit = new Commit()
          commit.set('user', user)
          commit.set('parent', group)
          commit.set('content', [url])
          commit.set('type', 'record')
          commit.save({
            success: () => {
              wx.hideNavigationBarLoading()
              wx.hideLoading()
              wx.showToast({
                title: '提交成功',
              })
            }
          })
        },function() {
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          wx.showToast({
            title: '提交失败',
          })
        })
      },
      fail:function(res) {
        console.log('fail',res)
      },
      complete:function(res) {
        console.log('complete')
      }
    })
  },

  //停止录音
  stopRecord(e) {
    console.log('stro',e)
    wx.stopRecord()
  },

  //打开相册
  openCamera: function () {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        app.globalData.tempFilePaths = tempFilePaths
        wx.navigateTo({
          url: '../commit/commit',
        })
      }
    })
  },

  //查看照片
  previewImage:function(e) {
    let dataset = e.currentTarget.dataset
    let url = dataset.url
    let id = dataset.id
    let commit = this.data.commits.find(item => item.id === id)
    let urls = commit.attributes.content
    wx.previewImage({
      urls:urls,
      current:url
    })
  },

  //播放/暂停 音频
  controlVoice: function(e) {
    let dataset = e.currentTarget.dataset
    let url = dataset.url
    let id = dataset.id
    let commit = this.data.commits.find(item => item.id === id)
    if (commit.attributes.play) {
      // stop
      wx.stopVoice()
      commit.attributes.play = false
      this.setData({ commits: this.data.commits })
    }else {
      //play
      
      //download vioce before play...
      
      
      wx.playVoice({
        filePath: url,
        complete: () => {
          console.log('complete')
          commit = this.data.commits.find(item => item.id === id)
          commit.attributes.play = false
          this.setData({ commits: this.data.commits })
        },
        success: () => {
          console.log('success')
        },
        fail: (e) => {
          console.log('fail',e)
        }})
      commit.attributes.play = true
      this.setData({ commits: this.data.commits })
    }
    
  },

  //打开相册
  openBox: function(e) {
    let id = e.currentTarget.dataset.id
    let commit = this.data.commits.find(item => item.id == id)
    let boxid = commit.attributes.box.id
    wx.navigateTo({
      url: '../box/box?id=' + boxid,
    })
  },

  //打开单次用户提交
  openCommit: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../commitList/commitList?id=' + e.currentTarget.dataset.id,
    })
  },

  //跳转至群设置
  navToSetting: function(e) {
    wx.navigateTo({
      url: '../groupSetting/groupSetting?id=' + this.data.group.id,
    })
  },

  //获取提交列表
  getCommitList: function () {
    return new Promise((resolve, reject) => {
      let Group = Bmob.Object.extend('Group')
      let group = new Group()
      group.id = this.data.group.id
      let Commit = Bmob.Object.extend('Commit')
      let query = new Bmob.Query('Commit')
      query.equalTo('parent', group)
      query.include("user")
      query.include("box")
      query.find({
        success: results => {
          let today = new Date()
          let month = (today.getMonth() + 1).toString()
          let day = (today.getDate()).toString()
          if (month.length == 1) month = '0' + month
          if (day.length == 1) day = '0' + day
          let todayString = today.getFullYear() + '-' + month + '-' + day

          results = results.map(item => {
            if (item.attributes.type === 'record') item.attributes.play = false
            let arr = item.updatedAt.split(' ')
            let index = item.updatedAt.indexOf(todayString)
            if (index == -1) item.updateTime = arr[0]
            else item.updateTime = arr[1]

            return Object.assign({}, item)
          })
          console.log('commit列表为：', results)
          resolve(results)
        },
        error: err => reject(err)
      })
    })
  },

  //获取用户列表
  getUserList: function () {
    let arr = []
    let users = this.data.group.attributes.member
    let count = 0
    let User = Bmob.Object.extend('_User')
    let query = new Bmob.Query(User)

    var find = id => new Promise((resolve, reject) => {
      query.get(id, {
        success: result => {
          arr.push(result)
          resolve(result)
        },
        error: (object, error) => reject(error)
      })
    })

    users.forEach(item => {
      find(item).then(data => {
        count++
        if (count == users.length) {
          this.setData({ users: arr })
          console.log('用户列表为', this.data.users)
        }
      })
    })
  },

  openSettingPin: function() {
    this.setData({
      settingPin: true
    })
  },

  touchDialog: function(e) {
    console.log(e)
    if (e.target.id == 'create-pin-container' && e.currentTarget.id == 'create-pin-container') {
      this.setData({settingPin: false})
    }
  },

  createBox: function() {
    
  }
})