/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      //登录远程服务器
      
      util.request(api.AuthLoginByWeixin, {
        Authorization: 'Bearer cGFhc2Nsb3VkLWNsaWVudC11YWM6cGFhc2Nsb3VkQ2xpZW50U2VjcmV0',
        username: 'admin'
      }, 'POST').then(res => {
        console.log("weixin has login" + JSON.stringify(res))
        if (res.errno == 0) {
          console.log("weixin login ok" )
          //存储用户信息
          wx.setStorageSync('userInfo', res.userInfo);
          wx.setStorageSync('token', res.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
};