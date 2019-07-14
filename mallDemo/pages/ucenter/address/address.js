var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
    hasLogin: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (wx.getStorageSync('hasLogin')) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });
    }
    this.getAddressList();
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    
  },

  getAddressList() {
    let that = this;
    if (this.data.hasLogin) {
      util.request(api.AddressList, {
        userId: that.data.userInfo.userId
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          that.setData({
            addressList: res.data
          });
        }
      });
    } 
  },

  addressAddOrUpdate(event) {
    console.log(event)
    if (this.data.hasLogin == false)
    {
      wx.showModal({
        title: '提示',
        content: '请登录后再查看',
      })
      return
    }

    //返回之前，先取出上一页对象，并设置addressId
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    if (prevPage.route == "pages/checkout/checkout") {
      try {
        wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
      } catch (e) {

      }

      let addressId = event.currentTarget.dataset.addressId;
      if (addressId && addressId != 0) {
        wx.navigateBack();
      } else {
        wx.navigateTo({
          url: '/pages/ucenter/addressAdd/addressAdd?id=' + addressId
        })
      }

    } else {
      wx.navigateTo({
        url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
      })
    }
  },

  deleteAddress(event) {
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function(res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.AddressDelete, {
            id: addressId,
            userId: that.data.userInfo.userId
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              that.getAddressList();
              wx.removeStorage({
                key: 'addressId',
                success: function(res) {},
              })
            }
          });
          console.log('用户点击确定')
        }
      }
    })
    return false;

  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})