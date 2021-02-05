/*
 * @Description:
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 14:06:39
 * @LastEditors: 33357
 * @Reference:
 */
class Log {
  constructor({ toast }) {
    this.toast = toast;
  }
  /**
   * @description: 处理错误
   */
  getErr = (err) => {
    if (err.log !== undefined) {
      console.log(err.message, err.log);
    } else {
      console.log(err.message, err);
    }
    this.toast(err.message);
  };
  /**
   * @description: 处理日志
   */
  getLog = (log) => {
    if (log.log === undefined) {
      console.log(log.message);
    } else {
      console.log(log.message, log.log);
    }
  };
}

module.exports = Log;
