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
    console.log(user)
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

  init: function() {
    Bmob.Cloud.run('getGroupsWithUserid', { userid: user.id }, {
      success: result => {
        try {
          console.log('success', result)
          // console.log(result,JSON.parse(result))
          this.setData({ groupList: JSON.parse(result) })
        } catch (e) {
          console.log(e)
          wx.showModal({
            title: '获取服务器数据错误',
            content: '请重试',
            confirmText: '重试',
            success: () => {
              this.init()
            }
          })
        }
      },
      error: function (err) {
        console.log('error', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  openCreateGroup: function () {
    this.setData({
      createGroup: true
    })
  },

  //关闭创建群对话
  touchDialog: function (e) {
    if (e.target.id == 'frame' && e.currentTarget.id == 'frame') {
      this.setData({
        createGroup: false,
        groupName: ''
      })
    }
  },

  //输入群名称
  inputGroupName: function (e) {
    this.setData({ groupName: e.detail.value })
  },

  //创建群
  createGroup: function () {
    let name = this.data.groupName
    let Group = Bmob.Object.extend("Group")
    let myGroup = new Group()
    myGroup.set('name', name)
    myGroup.set('user', user)
    myGroup.set('privileged', user.id)
    myGroup.set('member', [user.id])
    myGroup.set('content', [])
    myGroup.set('pin', [])
    myGroup.save(null, {
      success: result => {
        console.log(result)
        this.setData({
          createGroup: false,
          groupName: ''
        })
        this.init()
      },
      error: (result, error) => console.log('创建群失败', result, error)

    })
  },

  //进入群
  openGroup: function (e) {
    app.globalData.currentGroup = e.currentTarget.dataset.group
    wx.navigateTo({
      url: '../group/group',
    })
  }
})

