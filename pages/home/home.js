// home.js
var util = require('../../utils/util.js')
var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createGroup: false,
    groupName: '',
    groupList: []
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
    wx.setNavigationBarTitle({
      title: '私有群',
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.onCompassChange(function(res){
    //   console.log(res)
    // })

    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('open',res)
      }
    })

    wx.startBluetoothDevicesDiscovery({
      success: function(res) {console.log('aaa',res)},
    })

    wx.getBluetoothAdapterState({
      success: function(res) {console.log('...',res)},
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
    this.init()
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

  //打开创建群对话窗
  openCreateGroup: function() {
    this.setData({
      createGroup: true
    })
  },

  //关闭创建群对话
  touchDialog:function(e) {
    if(e.target.id == 'frame' && e.currentTarget.id == 'frame') {
      this.setData({
        createGroup:false,
        groupName: ''
      })
    }
  },

  //输入群名称
  inputGroupName: function(e) {
    this.setData({groupName:e.detail.value})
  },

  //创建群
  createGroup: function() {
    let name = this.data.groupName
    let Group = Bmob.Object.extend("Group")
    let myGroup = new Group()
    myGroup.set('name', name)
    myGroup.set('user', user)
    myGroup.set('privileged', app.globalData.userInfo.id)
    myGroup.set('member', [app.globalData.userInfo.id])
    myGroup.set('content', [])
    myGroup.set('pin', [])
    myGroup.save(null, {
      success: result => {
        console.log(result)
        this.setData({
          createGroup: false,
          groupName: ''
        })
      },
      error: (result,error) => console.log('创建群失败',result,error)
      
    })
  },

  //进入群
  openGroup: function (e) {
    app.globalData.currentGroup = e.currentTarget.dataset.group
    wx.navigateTo({
      url: '../group/group',
    })
  },

  //初始化
  init() {
    this.getGroupList().then(data => {
      let count = data.length
      let index = 0

      let call = (err, infor) => {
        if (err) return console.log(err)
        console.log('群 ' + data[index].attributes.name + ' 信息获取成功')
        console.log(' ')
        index++
        if (index == count) {
          console.log('所有群信息获取完成', data)
          this.setData({ groupList: data})
          wx.stopPullDownRefresh()
        }
        else this.getGroupInfor(data[index],call)
      }

      this.getGroupInfor(data[index], call)
    }).catch(err => console.log(err))
  },

  //获取群列表
  getGroupList: function () {
    return new Promise((resolve,reject) => {
      Bmob.Cloud.run('getGroupsWithUserid', { userid: user.id }, {
        success: function(result) {
          console.log(JSON.parse(result).results)
          resolve(JSON.parse(result).results.map(item => Object.assign({}, item)))
        },
        error: function(error) {
          console.log('error')
          reject(error)
        }
      })
    })
    // return
    // let Group = Bmob.Object.extend('Group')
    // let query = new Bmob.Query(Group)
    // query.containedIn('member', [user.id])
    // return new Promise((resolve, reject) => {
    //   query.find({
    //     success: result => resolve(result.map(item => Object.assign({}, item))),
    //     error: error => reject(error)
    //   })
    // })
  },

  //获取单个群信息
  getGroupInfor(group,callback) {
    this.getUserList(group.attributes.member).then(users => {
      group.users = users
      return this.getLastCommit(group.id)
    }).then(commit => {
      group.commits = commit
      callback(null)
    }).catch(err => reject(err))
  },
  
  //获取群的用户列表
  getUserList: function (member) {
    return new Promise((resolve,reject) => {
      let arr = []
      let users = member
      let count = 0
      let User = Bmob.Object.extend('_User')
      let query = new Bmob.Query(User)

      users.forEach(item => {
        util.findWithId('_User', item).then(data => {
          arr.push(data)
          count++
          if (count == users.length) {
            console.log('用户列表为', arr)
            resolve(arr)
          }
        }).catch(err => console.log(err))
      })
    })
  },

  //获取群的最新一条信息
  getLastCommit: function(id) {
    return new Promise((resolve,reject)=> {
      let Group = Bmob.Object.extend('Group')
      let group = new Group()
      group.id = id
      let Commit = Bmob.Object.extend('Commit')
      let query = new Bmob.Query('Commit')
      query.equalTo('parent', group)
      query.include("user")
      query.limit(1)
      query.find({
        success: results => {
          results.forEach(item => item.name = item.attributes.user.attributes.username)
          results = results.map(item => {
            item.name = item.attributes.user.attributes.username
            return Object.assign({},item)
          })
          console.log('commit列表为：', results)
          resolve(results)
        },
        error: err => reject(err)
      })
    })
    
  }
})

