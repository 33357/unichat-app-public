/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:14:36
 * @LastEditors: 33357
 */
'use strict';

class HttpAPI {
  constructor({ url, csrfToken, uniapp }) {
    this.request_url = 'https://' + url;
    this.csrfToken = csrfToken;
    this.uniapp = uniapp;
  }
  //获取用户信息
  getUser = async () => {
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/user',
      method: 'GET',
    });
  };
  //获取新用户签名信息
  getNewUser = async () => {
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/user/new',
      method: 'GET',
    });
  };
  //用户登录
  userLogin = async ({ data }) => {
    data._csrf = this.csrfToken;
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/user',
      method: 'POST',
      data,
    });
  };
  //用户注销
  userLogout = async () => {
    const data = {};
    data._csrf = this.csrfToken;
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/user',
      method: 'DELETE',
      data,
    });
  };
  //获取用户设置
  getUserSetting = async () => {
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/user_setting',
      method: 'GET',
    });
  };
  //更新用户设置
  updateUserSetting = async ({ data }) => {
    data._csrf = this.csrfToken;
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/user_setting',
      method: 'PUT',
      data,
    });
  };
  //获取token列表
  getTokenList = async () => {
    return await this.uniapp.request({
      url: this.request_url,
      action: '/api/v1/data?data=tokenList',
      method: 'GET',
    });
  };
}

module.exports = HttpAPI;
