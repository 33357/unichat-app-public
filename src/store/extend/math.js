/*
 * @Description:
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 13:54:56
 * @LastEditors: 33357
 * @Reference:
 */
const moment = require('moment');
const ethUtil = require('ethereumjs-util');
const ethjsUtil = require('ethjs-util');

class _Math {
  constructor({ vue }) {
    this.vue = vue;
  }
  /**
   * @description: 获取有效位数字
   */
  getEffectiveNumber = ({ number, effNum }) => {
    if (number > Math.pow(10, effNum)) {
      return Math.floor(number);
    } else {
      if (number.toString().length > effNum) {
        return number.toFixed(effNum - parseInt(number).toString().length);
      } else {
        return number;
      }
    }
  };
  /**
   * @description: 处理JSON
   */
  setJson = ({ objectJson, setJson, func }) => {
    if (setJson.$set !== undefined) {
      for (let _key in setJson.$set) {
        const { json, key } = this.getJsonKeyByJsonStr({
          json: objectJson,
          str: _key,
        });
        json[key] = setJson.$set[_key];
        func({ method: '$set', key: _key, value: setJson.$set[_key] });
      }
    }
    if (setJson.$vueSet !== undefined) {
      for (const _key in setJson.$vueSet) {
        const { json, key } = this.getJsonKeyByJsonStr({
          json: objectJson,
          str: _key,
          vue: true,
        });
        this.vue.set(json, key, setJson.$vueSet[_key]);
        func({ method: '$vueSet', key: _key, value: setJson.$vueSet[_key] });
      }
    }
    if (setJson.$push !== undefined) {
      for (const _key in setJson.$push) {
        const { json, key } = this.getJsonKeyByJsonStr({
          json: objectJson,
          str: _key,
        });
        json[key].push(...setJson.$push[_key]);
        func({ method: '$push', key: _key, value: json[key] });
      }
    }
    if (setJson.$forwardPush !== undefined) {
      for (const _key in setJson.$forwardPush) {
        const { json, key } = this.getJsonKeyByJsonStr({
          json: objectJson,
          str: _key,
        });
        json[key].splice(0, 0, ...setJson.$forwardPush[_key]);
        func({ method: '$forwardPush', key: _key, value: json[key] });
      }
    }
  };
  /**
   * @description: 获取JSON到
   */
  getJsonKeyByJsonStr = ({ json, str, vue = false }) => {
    const arr = str.split('.');
    for (let i = 0; i < arr.length - 1; i++) {
      if (!this.isJson(json[arr[i]])) {
        if (vue === true) {
          this.vue.set(json, arr[i], {});
        } else {
          json[arr[i]] = {};
        }
      }
      json = json[arr[i]];
    }
    return { json, key: arr[arr.length - 1] };
  };
  /**
   * @description:是否是JSON
   */

  isJson = (obj) => {
    let _isjson =
      typeof obj == 'object' &&
      Object.prototype.toString.call(obj).toLowerCase() == '[object object]' &&
      !obj.length;
    return _isjson;
  };
  /**
   * @description: 是否是Array
   */
  isArray = (obj) => {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };
  /**
   * @description: 处理时间格式
   */
  getTime = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  };
  /**
   * @description:获取cookie
   */
  getCookie = (name) => {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  };
  /**
   * @description:余额格式处理
   */
  getBalanceString = ({ balance, decimals, symbol, numDigits }) => {
    const res =
      this.getEffectiveNumber({
        number: balance / Math.pow(10, decimals),
        effNum: numDigits,
      }) +
      ' ' +
      symbol;
    return res;
  };
  /**
   * @description:eth工具
   */
  ethTool = {
    intToHex: ({ int }) => {
      return ethjsUtil.intToHex(int);
    },
    asciiToHex: ({ ascii }) => {
      return ethjsUtil.fromAscii(ascii);
    },
    stringDelete0x: ({ string }) => {
      return ethjsUtil.stripHexPrefix(string);
    },
    stringAdd0x: ({ string }) => {
      return ethjsUtil.addHexPrefix(string);
    },
    hexToBN: ({ hex }) => {
      return ethUtil.fromSigned(ethUtil.toBuffer(hex));
    },
    hexToInt: ({ hex }) => {
      return parseInt(ethUtil.fromSigned(ethUtil.toBuffer(hex)).toString());
    },
    hexToUtf8: ({ hex }) => {
      return ethjsUtil.toUtf8(hex.substring(2 + 32 * 4));
    },
    hexToAscii: ({ hex }) => {
      const hexStr = hex.substring(2);
      const str = ethjsUtil.toAscii(hexStr.substring(32 * 4));
      const strLength = parseInt(
        ethUtil
          .fromSigned(ethUtil.toBuffer('0x' + hexStr.substring(32 * 2, 32 * 4)))
          .toString()
      );
      return str.substring(0, strLength);
    },
    toEthAddress: ({ address }) => {
      if (address === ' ') {
        return ' ';
      }
      return ethUtil.toChecksumAddress(address);
    },
    isEthAddress: ({ address }) => {
      try {
        if (address === ' ') {
          return true;
        }
        return ethUtil.isValidAddress(address);
      } catch (err) {
        return false;
      }
    },
  };
}

module.exports = _Math;
