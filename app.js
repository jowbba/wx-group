//app.js
App({
  onLaunch: function (options) {
    console.log(options)
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: () => {
  },
  onHide: () => {
  },
  getUserInfo: function (cb) {
    var that = this
    //调用登录接口
    wx.showNavigationBarLoading()
    wx.login({
      success: function (res) {
        console.log('微信登录的code是 ' + res.code)
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {//获取userData(根据个人的需要，如果需要获取userData的需要在应用密钥中配置你的微信小程序AppId和AppSecret，且在你的项目中要填写你的appId)
            success: function (userData) {
              console.log(userData)
              console.log('服务器返回的openid是:  ' + userData.openid + ' session_key是: ' + userData.session_key)
              Object.assign(that.globalData.userInfo, userData)
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo
                  Object.assign(that.globalData.userInfo, userInfo)
                  var currentUser = Bmob.User.current()
                  //判断是否已经登录
                  if (currentUser) {
                    console.log('当前用户存在')
                    return cb()
                  }else console.log('当前用户不存在')
                  

                  var nickName = userInfo.nickName
                  var user = new Bmob.User();//开始注册用户
                  user.set("username", nickName);
                  user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
                  user.set("userData", userData);
                  user.set("userInfo", userInfo)
                  user.signUp(null, {
                    success: function (res) {
                      console.log("注册成功!", res)
                      wx.hideNavigationBarLoading()
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    },
                    error: function (userData, error) {
                      console.log('注册用户失败 err code 是: ' + error.code)
                      Bmob.User.logIn(userData.attributes.username, userData.attributes.password, {
                        success: function(user) {
                          console.log(user)
                        },
                        error: function(user,error) {
                          console.log(user,error)
                        }
                      })
                      wx.hideNavigationBarLoading()
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  });
                }
              })
            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });
        }
      }
    })

  },
  globalData: {
    userInfo: {},
    Bmob: null,
    currentGroup: {},
    tempFilePaths:[]
  }
})

var Bmob = require('./libs/bmob.js');
Bmob.initialize("1e2ae9be0dbe0a29494ad035136e370f", "dbbfeb337ffc4befe2d9e42859aa027a");
var app = getApp();
app.Bmob = Bmob;