var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "POST") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'appId' : api.AppId,
      },
      success: function(res) {
        console.log("request return success:" +JSON.stringify(res))
        if (res.statusCode == 200) {
          resolve(res.data.result);
        } else {
          console.log("request error:" + res.statusCode)
          reject(res.statusCode);
        }

      },
      fail: function(err) {
        console.log("request return fail:" + JSON.stringify(err))
        alert(err)
        reject(err)
      }
    })
  });
}

// 提示框
export function alert(content, callback) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    success: callback
  })
}
// 确认框
export function confirm(options) {
  var {
    content, confirmText, cancelText,
    ok,
  } = options
  confirmText = confirmText || '确定'
  cancelText = cancelText || '关闭'
  wx.showModal({
    content,
    confirmText,
    cancelText,
    success(res) {
      if (res.confirm) {
        ok && ok()
      }
    }
  })
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast
}