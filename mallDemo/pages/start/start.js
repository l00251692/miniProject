var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var hasLogin = wx.getStorageSync("hasLogin")
    if (hasLogin == true) {
      wx.switchTab({
        url: '/pages/ucenter/index/index',
      })
    }
    else {
      console.log("用户第一次使用")
    }
  },

  onLogin(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      
      wx.login({
        success(res) {
          wx.getUserInfo({
            success: function (userRes) {
              util.request(api.AuthLoginByWeixin, {
                wx_code: res.code,
                encryptedData: userRes.encryptedData,
                iv: userRes.iv
              }, 'POST').then(function (res) {
                console.log("AuthLoginByWeixin:" + JSON.stringify(res))
                if (res.status === 0) {
                  wx.setStorageSync('hasLogin', true)
                  wx.setStorageSync('userInfo', res.data.userInfo)

                  wx.switchTab({
                    url: '/pages/ucenter/index/index',
                  })
                }
                else //status == -1
                {
                  console.log(res.message)
                }
              }, function(res){
                console.log("与服务器连接失败")
                wx.switchTab({
                  url: '/pages/ucenter/index/index',
                })
              });

            },
            fail: function (res){
              wx.switchTab({
                url: '/pages/ucenter/index/index',
              })
            }
          })
        },
        error(res) {
          alert(res['errMsg'])
        }

      })
    }
  }
})