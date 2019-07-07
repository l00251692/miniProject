var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({
  data: {
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    hasLogin: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    //获取用户的登录信息
    if (wx.getStorageSync('hasLogin')) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });

      app.globalData.hasLogin = true;

      let that = this;
      //util.request(api.UserIndex).then(function (res) {
      //  if (res.errno === 0) {
      //    that.setData({
      //      order: res.data.order
      //    });
      //  }
      //});
    }
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  onLogin(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      if (wx.getStorageSync('hasLogin'))
      {
        return
      }

      var that = this
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

                  that.setData({
                    userInfo: res.data.userInfo,
                    hasLogin: true
                  });

                }
                else{
                  console.log(res.message)
                }
              });

            },
            fail: {}
          })
        },
        error(res) {
          alert(res['errMsg'])
        }

      })

      setTimeout(() => {
        wx.showModal({
          title: '提示',
          content: '登录超时，请稍候再试',
        })
      }, 1000);
    }
  },

  goOrder() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请登录后再查看',
      })
    }
  },
  goOrderIndex(e) {
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {

      }
      wx.navigateTo({
        url: route,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },

  bindPhoneNumber: function(e) {
    console.log("bind phone" + e.detail.errMsg )
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }

    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    util.request(api.AuthBindPhone, {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '绑定手机号码成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }

        util.request(api.AuthLogout, {}, 'POST');
        app.globalData.hasLogin = false;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    })

  }
})