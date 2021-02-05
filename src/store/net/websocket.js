/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:16:30
 * @LastEditors: 33357
 */
const io = require('weapp.socket.io');

class WebSocket {
  constructor({ url, onMessageFunction, log }) {
    this.socketUrl = url;
    this.socket = null;
    this.log = log;
    this.isConnected = false;
    this.sendDataArray = [];
    this.onMessageFunction = onMessageFunction;
  }
  //socket连接
  connect = () => {
    this.socket = io('https://' + this.socketUrl);
    this.socket.on('connect', () => {
      this.isConnected = true;
      if (this.sendDataArray.length !== 0) {
        this.sendDataArray.forEach(this.send);
      }
      this.sendDataArray = [];
      this.log.getLog({ message: 'websocket连接成功' });
    });
    // 正在连接
    this.socket.on('connecting', (d) => {
      this.log.getLog({ message: 'websocket正在连接', log: { d } });
    });
    // 连接错误
    this.socket.on('connect_error', (d) => {
      this.isConnected = false;
      this.log.getErr({ message: 'websocket连接失败', log: { d } });
    });
    // 连接超时
    this.socket.on('connect_timeout', (d) => {
      this.isConnected = false;
      this.log.getErr({ message: 'websocket连接超时', log: { d } });
    });
    // 断开连接
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.log.getErr({ message: 'websocket断开连接', log: { reason } });
    });
    // 重新连接
    this.socket.on('reconnect', (attemptNumber) => {
      this.log.getErr({ message: 'websocket成功重连', log: { attemptNumber } });
    });
    // 连接失败
    this.socket.on('reconnect_failed', () => {
      this.log.getLog({ message: 'websocket重连失败' });
      console.log('重连失败');
    });
    // 尝试重新连接
    this.socket.on('reconnect_attempt', () => {
      this.log.getErr({ message: 'websocket尝试重新重连' });
    });
    // 错误发生，并且无法被其他事件类型所处理
    this.socket.on('error', (err) => {
      this.isConnected = false;
      this.log.getErr({
        message: 'websocket错误发生，并且无法被其他事件类型所处理',
        log: { err },
      });
    });
    // 接受到新消息
    this.socket.on('res', (res) => {
      this.log.getLog({ message: 'websocket收到消息', log: { res } });
      this.onMessageFunction(res);
    });
  };
  //socket发送
  send = ({ method, data }) => {
    if (this.isConnected) {
      this.log.getLog({ message: 'websocket发送消息', log: { method, data } });
      this.socket.emit(method, data);
    } else {
      this.log.getLog({
        message: 'websocket等待发送消息',
        log: { method, data },
      });
      this.sendDataArray.push({ method, data });
    }
  };
  //连接消息
  linkChat = ({ acceptAddress, skip, limit }) => {
    this.send({
      method: 'linkChat',
      data: { acceptAddress, skip, limit },
    });
  };
  //发送消息
  sendChat = ({ chatContent, acceptAddress }) => {
    this.send({
      method: 'sendChat',
      data: { chatContent, acceptAddress },
    });
  };
  //获取消息
  getChat = ({ acceptAddress, skip, limit }) => {
    this.send({
      method: 'getChat',
      data: { acceptAddress, skip, limit },
    });
  };
  //断开消息
  unlinkChat = ({ acceptAddress }) => {
    this.send({
      method: 'unlinkChat',
      data: { acceptAddress },
    });
  };
}

module.exports = WebSocket;
