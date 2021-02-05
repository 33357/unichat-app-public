/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:21:50
 * @LastEditors: 33357
 */
class _Web3 {
  constructor({ web3, erc20ABI }) {
    this.web3 = web3;
    this.erc20ABI = erc20ABI;
  }
  //获取Eth余额
  getEthBalance = ({ walletAddress }) => {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(walletAddress, function (err, res) {
        if (!err) {
          resolve({
            ethBalance: res.toNumber(),
          });
        } else {
          reject({
            log: { err, web3, erc20ABI },
            message: '获取ETH余额失败！',
          });
        }
      });
    });
  };
  //获取Erc20余额
  getErc20Balance = ({ contractAddress, walletAddress }) => {
    return new Promise((resolve, reject) => {
      try {
        const MyContract = this.web3.eth.contract(this.erc20ABI);
        const myContractInstance = MyContract.at(contractAddress);
        myContractInstance.balanceOf(walletAddress, function (err, res) {
          if (!err) {
            resolve({
              erc20Balance: res.toNumber(),
            });
          } else {
            reject({
              log: { err, contractAddress, walletAddress },
              message: '获取Erc20余额失败！',
            });
          }
        });
      } catch (err) {
        reject({
          log: { err, contractAddress, walletAddress },
          message: '获取Erc20余额失败！',
        });
      }
    });
  };
  //获取Erc20名称
  getErc20Name = ({ contractAddress }) => {
    return new Promise((resolve, reject) => {
      try {
        const MyContract = this.web3.eth.contract(this.erc20ABI);
        const myContractInstance = MyContract.at(contractAddress);
        myContractInstance.name(function (err, res) {
          if (!err) {
            resolve({ erc20Name: res });
          } else {
            reject({
              log: { err, contractAddress },
              message: '获取Erc20名称失败！',
            });
          }
        });
      } catch (err) {
        reject({
          log: { err, contractAddress, walletAddress },
          message: '获取Erc20名称失败！',
        });
      }
    });
  };
  //获取Erc20标识
  getErc20Symbol = ({ contractAddress }) => {
    return new Promise((resolve, reject) => {
      try {
        const MyContract = this.web3.eth.contract(this.erc20ABI);
        const myContractInstance = MyContract.at(contractAddress);
        myContractInstance.symbol(function (err, res) {
          if (!err) {
            resolve({ erc20Symbol: res });
          } else {
            reject({
              log: { err, contractAddress },
              message: '获取Erc20标识失败！',
            });
          }
        });
      } catch (err) {
        reject({
          log: { err, contractAddress, walletAddress },
          message: '获取Erc20标识失败！',
        });
      }
    });
  };
  //获取Erc20小数位数
  getErc20Decimals = ({ contractAddress }) => {
    return new Promise((resolve, reject) => {
      try {
        const MyContract = this.web3.eth.contract(this.erc20ABI);
        const myContractInstance = MyContract.at(contractAddress);
        myContractInstance.decimals(function (err, res) {
          if (!err) {
            resolve({ erc20Decimals: res.toNumber() });
          } else {
            reject({
              log: { err, contractAddress },
              message: '获取Erc20小数位数失败！',
            });
          }
        });
      } catch (err) {
        reject({
          log: { err, contractAddress, walletAddress },
          message: '获取Erc20小数位数失败！',
        });
      }
    });
  };
  //获取Erc20总量
  getErc20TotalSupply = ({ contractAddress }) => {
    return new Promise((resolve, reject) => {
      try {
        const MyContract = this.web3.eth.contract(this.erc20ABI);
        const myContractInstance = MyContract.at(contractAddress);
        myContractInstance.totalSupply(function (err, res) {
          if (!err) {
            resolve({ erc20TotalSupply: res.toNumber() });
          } else {
            reject({
              log: { err, contractAddress },
              message: '获取Erc20总量失败！',
            });
          }
        });
      } catch (err) {
        reject({
          log: { err, contractAddress, walletAddress },
          message: '获取Erc20总量失败！',
        });
      }
    });
  };
  //是否是合约
  isContract = ({ address }) => {
    const code = this.web3.eth.getCode(address);
    if (code == '0x') {
      resolve({ isContract: false });
    } else {
      resolve({ isContract: true });
    }
  };
}

class MetaMask {
  constructor({ ethTool, isMetaMask = true }) {
    this.ethTool = ethTool;
    if (typeof window.ethereum === 'undefined') {
      throw {
        log: { ethereum: window.ethereum },
        message: '请在支持web3的浏览器内打开网页！',
      };
    }
    if (ethereum.isMetaMask !== true && isMetaMask) {
      throw {
        log: { isMetaMask: ethereum.isMetaMask },
        message: '不是MetaMask！',
      };
    }
    this.chainId = ethereum.chainId;
    if (ethereum.chainId != 0x1 && ethereum.networkVersion != '1') {
      throw {
        log: { chainId: ethereum.chainId },
        message: '不是ETH主网！',
      };
    }
  }
  //ethRequest
  ethRequest = ({ method, params }) => {
    return new Promise((resolve, reject) => {
      if (this.chainId == 0x1) {
        ethereum
          .request({
            method,
            params,
          })
          .then((result) => {
            resolve({ ethRequestData: result });
          })
          .catch((error) => {
            reject({
              log: error,
              message: 'metamask RPC 请求错误！',
            });
          });
      } else {
        reject({
          log: { chainId: this.chainId },
          message: '不是ETH主网！',
        });
      }
    });
  };
  //contractCall
  contractCall = async ({ methodStr, contractAddress, addData = '' }) => {
    let res = await this.ethRequest({
      method: 'web3_sha3',
      params: [this.ethTool.asciiToHex({ ascii: methodStr })],
    });
    res = await this.ethRequest({
      method: 'eth_call',
      params: [
        {
          to: contractAddress,
          data: res['ethRequestData'].substring(0, 10) + addData,
        },
      ],
    });
    return { contractCallData: res['ethRequestData'] };
  };
  //获取链ID
  getChainId = async () => {
    const res = await this.ethRequest({
      method: 'eth_chainId',
      params: [],
    });
    return { chainId: res['ethRequestData'] };
  };
  //获取钱包地址
  getWalletAddress = async () => {
    const res = await this.ethRequest({ method: 'eth_requestAccounts' });
    return {
      walletAddress: this.ethTool.toEthAddress({
        address: res['ethRequestData'][0],
      }),
    };
  };
  //登录签名
  signLogin = async ({ walletAddress, signData }) => {
    const msgParams = JSON.stringify(signData);
    let params = [walletAddress, msgParams];
    let res = await this.ethRequest({
      method: 'eth_signTypedData_v4',
      params,
    });
    return {
      signData,
      sig: res['ethRequestData'],
      walletAddress,
    };
  };
  //获取Eth余额
  getEthBalance = async function ({ walletAddress }) {
    const res = await this.ethRequest({
      method: 'eth_getBalance',
      params: [walletAddress],
    });
    return {
      ethBalance: this.ethTool.hexToInt({ hex: res['ethRequestData'] }),
    };
  };
  //获取Erc20余额
  getErc20Balance = async function ({ contractAddress, walletAddress }) {
    const res = await this.contractCall({
      methodStr: 'balanceOf(address)',
      contractAddress,
      addData: this.addZero({
        str: this.ethTool.stringDelete0x({ string: walletAddress }),
        num: 24,
      }),
    });
    return {
      erc20Balance: this.ethTool.hexToInt({ hex: res['contractCallData'] }),
    };
  };
  //获取Erc20总量
  getErc20TotalSupply = async function ({ contractAddress }) {
    const res = await this.contractCall({
      methodStr: 'totalSupply()',
      contractAddress,
    });
    return {
      erc20TotalSupply: this.ethTool.hexToInt({ hex: res['contractCallData'] }),
    };
  };
  //获取Erc20小数位数
  getErc20Decimals = async function ({ contractAddress }) {
    const res = await this.contractCall({
      methodStr: 'decimals()',
      contractAddress,
    });
    return {
      erc20Decimals: this.ethTool.hexToInt({ hex: res['contractCallData'] }),
    };
  };
  //获取Erc20名称
  getErc20Name = async function ({ contractAddress }) {
    const res = await this.contractCall({
      methodStr: 'name()',
      contractAddress,
    });
    return {
      erc20Name: this.ethTool.hexToAscii({ hex: res['contractCallData'] }),
    };
  };
  //获取Erc20标识
  getErc20Symbol = async function ({ contractAddress }) {
    const res = await this.contractCall({
      methodStr: 'symbol()',
      contractAddress,
    });
    return {
      erc20Symbol: this.ethTool.hexToAscii({ hex: res['contractCallData'] }),
    };
  };
  //是否是合约
  isContract = async function ({ address }) {
    const res = await this.ethRequest({
      method: 'eth_getCode',
      params: [address],
    });
    if (res['ethRequestData'] == '0x') {
      return { isContract: false };
    } else {
      return { isContract: true };
    }
  };
  //添加0
  addZero({ str, num }) {
    let _str = '';
    for (let i = 0; i < num; i++) {
      _str += '0';
    }
    return _str + str;
  }
}

class IMToken {
  constructor({ ethTool, erc20ABI }) {
    this.metamask = new MetaMask({ ethTool, isMetaMask: false });
    if (window.web3 !== undefined) {
      this.web3 = new _Web3({ web3: window.web3, erc20ABI });
    } else {
      throw { log: { web3: window.web3 }, message: '无法使用web3！' };
    }
    if (ethereum.chainId != 0x1 && ethereum.networkVersion != '1') {
      reject({
        log: { chainId: ethereum.chainId },
        message: '不是ETH主网！',
      });
    }
    //方法引用
    this.getWalletAddress = this.metamask.getWalletAddress;
    this.signLogin = this.metamask.signLogin;
    this.getEthBalance = this.web3.getEthBalance;
    this.getErc20Balance = this.web3.getErc20Balance;
    this.getErc20TotalSupply = this.web3.getErc20TotalSupply;
    this.getErc20Decimals = this.web3.getErc20Decimals;
    this.getErc20Name = this.web3.getErc20Name;
    this.getErc20Symbol = this.web3.getErc20Symbol;
    this.isContract = this.web3.isContract;
  }
}

module.exports = {
  IMToken,
  MetaMask,
};
