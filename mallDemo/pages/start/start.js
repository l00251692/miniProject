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
      var tmp = JSON.stringify(e.detail.userInfo.nickName)
      console.log("wx login username =" + tmp)
      util.request(api.AuthLoginByWeixin, {
        username: e.detail.userInfo.nickName
      }, 'POST').then(function (res) {
        console.log("AuthLoginByWeixin:" + JSON.stringify(res))
        if (res.errno === 0) {
          that.setData({
            order: res.data.order
          });
        }
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/ucenter/index/index',
        })
      }, 1000);
    }
  }
})