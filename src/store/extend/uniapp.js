/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:21:17
 * @LastEditors: 33357
 */
class UniApp {
  constructor({ $u, log }) {
    this.$u = $u;
    this.log = log;
    this.loading = false;
  }
  //request请求
  request = ({ url, action, method, data = null }) => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: url + action,
        data: data,
        method: method,
        withCredentials: true,
        success: (res) => {
          if (res.data.code === 200) {
            this.log.getLog({
              message: 'http请求成功!',
              log: { data: res.data },
            });
            resolve(res.data.data);
          } else {
            reject({
              message: res.data.message,
              log: { res: res.data, url, action, method, data },
            });
          }
        },
        fail: (res) => {
          reject({
            message: 'http请求失败!',
            log: { res, url, action, method, data },
          });
        },
      });
    });
  };
  //显示modal
  modal = {
    short: ({ content }) => {
      this.$u.toast(content, 1500);
    },
    choose: ({ content }) => {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '提示',
          content: content,
          success: (res) => {
            this.log.getLog({ message: '窗口显示成功！' });
            if (res.confirm) {
              resolve(true);
            } else if (res.cancel) {
              resolve(false);
            }
          },
          fail: (err) => {
            reject({
              message: '窗口显示失败！',
              log: { err },
            });
          },
        });
      });
    },
    show: ({ content }) => {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '提示',
          content: content,
          showCancel: false,
          success: (res) => {
            this.log.getLog({ message: '窗口显示成功！' });
            if (res.confirm) {
              resolve(true);
            } else if (res.cancel) {
              resolve(false);
            }
          },
          fail: (err) => {
            reject({
              message: '窗口显示失败！',
              log: { err },
            });
          },
        });
      });
    },
  };
  //跳转
  go = {
    home: () => {
      return new Promise((resolve, reject) => {
        uni.reLaunch({
          url: '/pages/home/home',
          success: () => {
            this.log.getLog({ message: '跳转首页成功！' });
            resolve();
          },
          fail: (err) => {
            reject({
              message: '跳转首页失败！',
              log: { err },
            });
          },
        });
      });
    },
    login: () => {
      return new Promise((resolve, reject) => {
        uni.reLaunch({
          url: '/pages/open/login',
          success: () => {
            this.log.getLog({ message: '跳转登录页面成功！' });
            resolve();
          },
          fail: (err) => {
            reject({
              message: '跳转登录页面失败！',
              log: { err },
            });
          },
        });
      });
    },
    to: ({ url, params }) => {
      return new Promise((resolve, reject) => {
        let data = '';
        if (params != null) {
          data += '?';
          for (const key in params) {
            data += key + '=';
            data += encodeURI(params[key]) + '&';
          }
          data = data.substring(0, data.length - 1);
        }
        uni.navigateTo({
          url: url + data,
          success: () => {
            this.log.getLog({ message: '跳转成功！' });
            resolve();
          },
          fail: (err) => {
            reject({
              message: '跳转失败！',
              log: { err },
            });
          },
        });
      });
    },
    back: () => {
      return new Promise((resolve, reject) => {
        uni.navigateBack({
          success: () => {
            this.log.getLog({ message: '返回成功！' });
            resolve();
          },
          fail: (err) => {
            reject({
              message: '返回失败！',
              log: { err },
            });
          },
        });
      });
    },
  };
  //页面滑动
  pageScrollTo = ({ scrollTop, duration }) => {
    return new Promise((resolve, reject) => {
      uni.pageScrollTo({
        scrollTop,
        duration,
        success: () => {
          this.log.getLog({ message: '滑动成功！' });
          resolve();
        },
        fail: (err) => {
          reject({
            message: '滑动失败！',
            log: { err },
          });
        },
      });
    });
  };
  //停止下拉
  stopPullDownRefresh = () => {
    return new Promise((resolve, reject) => {
      uni.stopPullDownRefresh({
        success: () => {
          this.log.getLog({ message: '停止下拉成功！' });
          resolve();
        },
        fail: (err) => {
          reject({
            message: '停止下拉失败！',
            log: { err },
          });
        },
      });
    });
  };
  //本地存储
  localStorage = {
    save: ({ key, data }) => {
      return new Promise((resolve, reject) => {
        uni.setStorage({
          key,
          data,
          success: () => {
            this.log.getLog({
              message: '保存本地数据成功！',
              log: { key, data },
            });
            resolve();
          },
          fail: (err) => {
            reject({
              message: '保存本地数据失败！',
              log: { err },
            });
          },
        });
      });
    },
    read: ({ key }) => {
      return new Promise((resolve, reject) => {
        uni.getStorage({
          key: key,
          success: (res) => {
            this.log.getLog({
              message: '读取本地数据成功！',
              log: { key, value: res.data },
            });
            if (res.data) {
              resolve(res.data);
            } else {
              resolve({});
            }
          },
          fail: (err) => {
            this.log.getLog({
              message: '读取本地数据失败！',
              log: { err },
            });
            resolve({});
          },
        });
      });
    },
  };
  //加载显示
  load = {
    show: () => {
      this.loading = true;
      uni.showLoading({
        title: '加载中',
        success: () => {
          this.log.getLog({
            message: '加载显示成功！',
          });
        },
        fail: (err) => {
          this.log.getLog({
            message: '加载显示失败！',
            log: { err },
          });
        },
      });
    },
    hide: () => {
      this.loading = false;
      uni.hideLoading({
        success: () => {
          this.log.getLog({
            message: '加载隐藏成功！',
          });
        },
        fail: (err) => {
          this.log.getLog({
            message: '加载隐藏失败！',
            log: { err },
          });
        },
      });
    },
  };
}

module.exports = UniApp;
