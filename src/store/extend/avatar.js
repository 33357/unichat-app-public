/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:19:36
 * @LastEditors: 33357
 * @Reference:
 */
import Identicon from 'identicon.js';

class Avatar {
  // 获取图片数据
  getSrc = ({ address }) => {
    return 'data:image/png;base64,' + new Identicon(address, 420).toString();
  };
}

module.exports = Avatar;
