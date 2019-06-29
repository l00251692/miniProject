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
      wx.setStorageSync('hasLogin', true)
      wx.setStorageSync('userInfo', e.detail.userInfo)
      
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
                if (res.errno === 0) {
                  that.setData({
                    order: res.data.order
                  });
                }
              });

            },
            fail:{}
          })
        },
        error(res) {
          alert(res['errMsg'])
        }

      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/ucenter/index/index',
        })
      }, 1000);
    }
  }
})