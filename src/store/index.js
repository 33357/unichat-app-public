/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:22:04
 * @LastEditors: 33357
 */

import Vue from 'vue';
import Vuex from 'vuex';
import HttpAPI from './net/httpAPI';
import WebSocket from './net/websocket.js';
import * as web3Provider from './net/web3Provider.js';
import _Math from './extend/math.js';
import UniApp from './extend/uniapp.js';
import Log from './extend/log.js';
import Avatar from './extend/avatar.js';
import * as contractABI from './extend/contractABI.js';
import uView from 'uview-ui';

import { home } from './model/home/home.js';
import { login } from './model/open/login.js';
import { businessCard } from './model/open/businessCard.js';

Vue.use(Vuex);
Vue.use(uView);

const CONST_DATA = {
  //APP状态选择
  PRODUCTION: 'P',
  //正式发布使用的API接口
  P: {
    postUrl: '',
    socketUrl: '',
  },
  //测试使用的API接口
  T: {
    postUrl: '',
    socketUrl: '',
  },
};

const $u = Vue.prototype.$u;
const log = new Log({ toast: $u.toast });

//本地变量
const localData = {
  loadNum: null,
};

const store = new Vuex.Store({
  state: {
    //用户数据
    userData: {
      //钱包地址
      walletAddress: null,
      //服务器上的用户地址
      userAddress: null,
      //服务器保存的用户数据
      cloudSetting: {
        homeSetting: {
          chatSetting: {},
        },
        appSetting: {
          numDigits: 10,
          userTokenJson: {},
        },
      },
      //本地保存的用户数据
      localSetting: {
        web3Provider: null,
      },
    },
    //APP引用数据
    appData: {
      //扩展函数
      extend: {
        contractABI,
        math: new _Math({ vue: Vue }),
        uniapp: new UniApp({ $u, log }),
        avatar: new Avatar(),
        web3Provider,
        log,
      },
      //网络函数
      net: {
        httpAPI: null,
        webSocket: null,
        web3: null,
      },
      //状态Token
      token: {
        isStartApp: false,
        csrfToken: null,
      },
      //默认设置
      setting: {
        getChatNumber: 100,
        chatLoadNumber: 20,
      },
    },
    //网络加载数据
    loadingData: {
      defaultTokenArray: [],
      addressAvatarJson: {},
      addressBalanceJson: {},
      userTokenJson: {},
    },
  },
  getters: {
    // 获取state变量
    getState: (state) => {
      return {
        findFromDefaultTokenArray: ({ address }) => {
          return state.loadingData.defaultTokenArray.find(
            (obj) => obj.address === address
          );
        },
        getAddressBalance: ({ tokenAddress, walletAddress }) => {
          if (
            state.loadingData.addressBalanceJson[tokenAddress] === undefined
          ) {
            return undefined;
          } else {
            return state.loadingData.addressBalanceJson[tokenAddress][
              walletAddress
            ];
          }
        },
        getAddressAvatar: ({ address }) => {
          return state.loadingData.addressAvatarJson[address];
        },
        getUserTokenJsonAddress: () => {
          const json = {};
          for (const key in state.loadingData.userTokenJson) {
            json[key] = {};
          }
          return json;
        },
      };
    },
    // 获取state变量处理的方法
    getFunction: (state, getters) => {
      return {
        getBalanceString: ({ walletAddress, tokenAddress }) => {
          const balance = getters.getState.getAddressBalance({
            tokenAddress,
            walletAddress,
          });
          const token = state.loadingData.userTokenJson[tokenAddress];
          if (balance === undefined) {
            return '... ' + token.symbol;
          }
          let numDigits;
          if (state.userData.cloudSetting.appSetting.numDigits === undefined) {
            numDigits = 10;
          } else {
            numDigits = state.userData.cloudSetting.appSetting.numDigits;
          }
          return state.appData.extend.math.getBalanceString({
            balance,
            decimals: token.decimals,
            symbol: token.symbol,
            numDigits,
          });
        },
      };
    },
  },
  mutations: {
    // 设置state变量
    setState: (state, { setJson, save = true }) => {
      state.appData.extend.math.setJson({
        objectJson: state,
        setJson,
        func: ({ method, key, value }) => {
          state.appData.extend.log.getLog({
            message: '修改index数据',
            log: { method, key, value },
          });
        },
      });
      if (save === true) {
        for (const key in setJson) {
          for (const _key in setJson[key]) {
            const arr = _key.split('.');
            if (arr.length > 2) {
              if (arr[0] === 'userData' && arr[1] === 'localSetting') {
                state.appData.extend.uniapp.localStorage.save({
                  key: 'localSetting',
                  data: state.userData.localSetting,
                });
              }
              if (arr[0] === 'userData' && arr[1] === 'cloudSetting') {
                state.appData.net.httpAPI.updateUserSetting({
                  data: { userSetting: state.userData.cloudSetting },
                });
              }
            }
          }
        }
      }
    },
    // 减少本地变量loadNum
    cutLoadNum: (state) => {
      if (localData.loadNum !== null) {
        localData.loadNum--;
        if (localData.loadNum === 0) {
          state.appData.extend.uniapp.load.hide();
          if (JSON.stringify(state.loadingData.userTokenJson) === '{}') {
            state.appData.extend.uniapp.modal.show({
              content: '该钱包没有可读取代币，请点击右上方尝试手动导入！',
            });
          }
        }
      }
    },
  },
  actions: {
    // App初始化
    startApp: async ({ state, commit, dispatch }) => {
      try {
        state.appData.extend.uniapp.load.show();
        const noCsrfAPI = new HttpAPI({
          url: CONST_DATA[CONST_DATA['PRODUCTION']]['postUrl'],
          uniapp: state.appData.extend.uniapp,
        });
        commit('setState', {
          setJson: { $set: { 'appData.net.httpAPI': noCsrfAPI } },
        });
        const getUserRes = await state.appData.net.httpAPI.getUser();
        commit('setState', {
          setJson: {
            $set: {
              'appData.token.csrfToken': state.appData.extend.math.getCookie(
                'csrfToken'
              ),
            },
          },
        });
        const csrfAPI = new HttpAPI({
          url: CONST_DATA[CONST_DATA['PRODUCTION']]['postUrl'],
          csrfToken: state.appData.token.csrfToken,
          uniapp: state.appData.extend.uniapp,
        });
        commit('setState', {
          setJson: { $set: { 'appData.net.httpAPI': csrfAPI } },
        });
        const localSetting = await state.appData.extend.uniapp.localStorage.read(
          {
            key: 'localSetting',
          }
        );
        if (
          localSetting.web3Provider !== undefined &&
          localSetting.web3Provider !== null
        ) {
          await dispatch('setWeb3Provider', {
            web3Provider: localSetting.web3Provider,
          });
        }
        if (
          getUserRes.userAddress === null ||
          localSetting.web3Provider === undefined ||
          localSetting.web3Provider === null
        ) {
          const pages = getCurrentPages();
          const route = pages[pages.length - 1].route;
          if (route !== 'pages/open/login') {
            state.appData.extend.uniapp.go.login();
          }
          commit('setState', {
            setJson: { $set: { 'appData.token.isStartApp': false } },
          });
          state.appData.extend.uniapp.load.hide();
          return false;
        } else {
          commit('setState', {
            setJson: {
              $set: { 'userData.userAddress': getUserRes.userAddress },
            },
          });
          const getUserSettingRes = await state.appData.net.httpAPI.getUserSetting();
          commit('setState', {
            setJson: {
              $set: { 'userData.cloudSetting': getUserSettingRes.userSetting },
            },
          });
          commit('setState', {
            setJson: { $set: { 'appData.token.isStartApp': true } },
          });
          const webSocket = new WebSocket({
            url: CONST_DATA[CONST_DATA['PRODUCTION']]['socketUrl'],
            onMessageFunction: (res) => dispatch('onMessageFunction', res),
            log: state.appData.extend.log,
          });
          commit('setState', {
            setJson: { $set: { 'appData.net.webSocket': webSocket } },
          });
          state.appData.net.webSocket.connect();
          const getTokenListRes = await state.appData.net.httpAPI.getTokenList();
          for (
            let index = 0;
            index < getTokenListRes.tokenList.length;
            index++
          ) {
            const element = getTokenListRes.tokenList[index];
            element.address = state.appData.extend.math.ethTool.toEthAddress({
              address: element.address,
            });
          }
          commit('setState', {
            setJson: {
              $set: {
                'loadingData.defaultTokenArray': getTokenListRes.tokenList,
              },
            },
          });
          for (const key in state.userData.cloudSetting.appSetting
            .userTokenJson) {
            dispatch('testAndAddToken', { tokenAddress: key, isSet: true });
          }
          localData.loadNum = state.loadingData.defaultTokenArray.length;
          state.loadingData.defaultTokenArray.forEach((element) => {
            if (
              state.userData.cloudSetting.appSetting.userTokenJson[
                element.address
              ] === undefined
            ) {
              dispatch('testAndAddToken', { tokenAddress: element.address });
            } else {
              commit('cutLoadNum');
            }
          });
          return true;
        }
      } catch (err) {
        state.appData.extend.log.getErr(err);
        state.appData.extend.uniapp.load.hide();
      }
    },
    // 检查并添加Token
    testAndAddToken: async (
      { state, getters, commit, dispatch },
      { tokenAddress, isSet = false }
    ) => {
      try {
        if (
          state.userData.cloudSetting.homeSetting.chatSetting[tokenAddress] !==
          undefined
        ) {
          if (
            state.userData.cloudSetting.homeSetting.chatSetting[tokenAddress]
              .delete === true
          ) {
            if (!isSet) {
              commit('cutLoadNum');
            }
            return false;
          }
        }
        const getTokenMessageRes = await dispatch('getTokenMessage', {
          tokenAddress,
        });
        if (!isSet) {
          commit('cutLoadNum');
        }
        if (getTokenMessageRes !== null) {
          commit('setState', {
            setJson: {
              $vueSet: JSON.parse(
                `{\"loadingData.userTokenJson.${tokenAddress}\":${JSON.stringify(
                  getTokenMessageRes
                )}}`
              ),
            },
          });
          if (JSON.stringify(state['home/tokenChatJson']) !== '{}') {
            dispatch('home/linkChat', {
              acceptAddress: tokenAddress,
            });
          }
          state.appData.extend.log.getLog({
            message: '加载剩余数',
            log: { loadNum: localData.loadNum },
          });
          if (localData.loadNum === 0) {
            state.appData.extend.uniapp.load.hide();
            commit('setState', {
              setJson: {
                $set: JSON.parse(
                  `{\"userData.cloudSetting.appSetting.userTokenJson\":${JSON.stringify(
                    getters.getState.getUserTokenJsonAddress()
                  )}}`
                ),
              },
            });
          } else if (localData.loadNum < 0) {
            if (
              state.userData.cloudSetting.appSetting.userTokenJson[
                tokenAddress
              ] === undefined
            )
              commit('setState', {
                setJson: {
                  $set: JSON.parse(
                    `{\"userData.cloudSetting.appSetting.userTokenJson.${tokenAddress}\":{}}`
                  ),
                },
              });
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        if (!isSet) {
          commit('cutLoadNum');
        }
        state.appData.extend.uniapp.load.hide();
        state.appData.extend.log.getErr(err);
      }
    },
    // 获取Token信息
    getTokenMessage: async ({ state, getters, commit }, { tokenAddress }) => {
      const walletAddress = state.userData.userAddress;
      if (tokenAddress === ' ') {
        const getEthBalanceRes = await state.appData.net.web3.getEthBalance({
          walletAddress,
        });
        commit('setState', {
          setJson: {
            $vueSet: JSON.parse(
              `{\"loadingData.addressBalanceJson.${tokenAddress}.${walletAddress}\":${getEthBalanceRes.ethBalance}}`
            ),
          },
        });
        if (getEthBalanceRes.ethBalance !== 0) {
          const balance = getEthBalanceRes.ethBalance;
          const defaultTokenArrayFindRes = getters.getState.findFromDefaultTokenArray(
            { address: tokenAddress }
          );
          if (defaultTokenArrayFindRes === undefined) {
            throw {
              log: 'DefaultTokenArrayFindRes:',
              defaultTokenArrayFindRes,
            };
          }
          return {
            balance,
            decimals: defaultTokenArrayFindRes.decimals,
            logoURI: defaultTokenArrayFindRes.logoURI,
            name: defaultTokenArrayFindRes.name,
            symbol: defaultTokenArrayFindRes.symbol,
          };
        }
        return null;
      } else {
        const contractAddress = tokenAddress;
        const getErc20BalanceRes = await state.appData.net.web3.getErc20Balance(
          {
            contractAddress,
            walletAddress,
          }
        );
        commit('setState', {
          setJson: {
            $vueSet: JSON.parse(
              `{\"loadingData.addressBalanceJson.${tokenAddress}.${walletAddress}\":${getErc20BalanceRes.erc20Balance}}`
            ),
          },
        });
        if (getErc20BalanceRes.erc20Balance !== 0) {
          const balance = getErc20BalanceRes.erc20Balance;
          const defaultTokenArrayFindRes = getters.getState.findFromDefaultTokenArray(
            { address: tokenAddress }
          );
          if (defaultTokenArrayFindRes !== undefined) {
            return {
              balance,
              decimals: defaultTokenArrayFindRes.decimals,
              logoURI: defaultTokenArrayFindRes.logoURI,
              name: defaultTokenArrayFindRes.name,
              symbol: defaultTokenArrayFindRes.symbol,
            };
          } else {
            const promiseAllRes = await Promise.all([
              state.appData.net.web3.getErc20Decimals({ contractAddress }),
              state.appData.net.web3.getErc20Name({ contractAddress }),
              state.appData.net.web3.getErc20Symbol({ contractAddress }),
            ]);
            return {
              balance,
              decimals: promiseAllRes[0].erc20Decimals,
              logoURI: '/static/image/token/empty-token.png',
              name: promiseAllRes[1].erc20Name,
              symbol: promiseAllRes[2].erc20Symbol,
            };
          }
        }
        return null;
      }
    },
    // socket接收消息的回调函数
    onMessageFunction: async ({ dispatch, state }, { req, data }) => {
      try {
        if (req.method === 'linkChat') {
          await dispatch('home/getLinkChat', {
            acceptAddress: req.data.acceptAddress,
            messages: data.chats,
          });
        } else if (req.method === 'sendChat') {
          await dispatch('home/getSendChat', {
            acceptAddress: req.data.acceptAddress,
            messages: data.chats,
          });
        } else if (req.method === 'getChat') {
          await dispatch('home/getGetChat', {
            acceptAddress: req.data.acceptAddress,
            messages: data.chats,
          });
        }
      } catch (err) {
        state.appData.extend.log.getErr(err);
      }
    },
    // 用户注销
    userLogout: async ({ state, commit, dispatch }) => {
      await dispatch('home/userLogout');
      const userLogoutRes = await state.appData.net.httpAPI.userLogout();
      if (userLogoutRes.userAddress === null) {
        commit('setState', {
          setJson: {
            $set: {
              'userData.userAddress': null,
              'loadingData.userTokenJson': {},
            },
          },
        });
        localData.loadNum = null;
        state.appData.extend.uniapp.go.login();
      } else {
        throw { message: '登出失败！', log: { userLogoutRes } };
      }
    },
    // 预加载消息头像
    setMessagesAvatar: async ({ state, commit }, { messages }) => {
      try {
        for (const i in messages) {
          const e = messages[i];
          const address = e.sendAddress;
          if (state.loadingData.addressAvatarJson[address] === undefined) {
            const avatarSrc = state.appData.extend.avatar.getSrc({
              address,
            });
            commit('setState', {
              setJson: {
                $vueSet: JSON.parse(
                  `{\"loadingData.addressAvatarJson.${address}\":\"${avatarSrc}\"}`
                ),
              },
            });
          }
        }
      } catch (err) {
        state.appData.extend.log.getErr(err);
      }
    },
    // 预加载消息余额
    setMessagesBalance: async ({ state, getters, commit }, { messages }) => {
      try {
        for (const i in messages) {
          const e = messages[i];
          const tokenAddress = e.acceptAddress;
          const walletAddress = e.sendAddress;
          const getBalanceRes = getters.getState.getAddressBalance({
            tokenAddress,
            walletAddress,
          });
          if (getBalanceRes === undefined) {
            if (tokenAddress === ' ') {
              const getEthBalanceRes = await state.appData.net.web3.getEthBalance(
                {
                  walletAddress,
                }
              );
              commit('setState', {
                setJson: {
                  $vueSet: JSON.parse(
                    `{\"loadingData.addressBalanceJson.${tokenAddress}.${walletAddress}\":${getEthBalanceRes.ethBalance}}`
                  ),
                },
              });
            } else {
              const getErc20BalanceRes = await state.appData.net.web3.getErc20Balance(
                {
                  contractAddress: tokenAddress,
                  walletAddress,
                }
              );
              commit('setState', {
                setJson: {
                  $vueSet: JSON.parse(
                    `{\"loadingData.addressBalanceJson.${tokenAddress}.${walletAddress}\":${getErc20BalanceRes.erc20Balance}}`
                  ),
                },
              });
            }
          }
        }
      } catch (err) {
        state.appData.extend.log.getErr(err);
      }
    },
    // 设置web3提供商
    setWeb3Provider: async ({ state, commit }, { web3Provider }) => {
      let web3;
      if (web3Provider === 'metamask') {
        web3 = new state.appData.extend.web3Provider.MetaMask({
          ethTool: state.appData.extend.math.ethTool,
        });
      } else if (web3Provider === 'imtoken') {
        web3 = new state.appData.extend.web3Provider.IMToken({
          ethTool: state.appData.extend.math.ethTool,
          erc20ABI: state.appData.extend.contractABI.erc20ABI,
        });
      } else {
        throw { log: { web3Provider }, message: '设置Web3服务错误' };
      }
      commit('setState', {
        setJson: {
          $set: { 'userData.localSetting.web3Provider': web3Provider },
        },
      });
      commit('setState', {
        setJson: {
          $set: {
            'appData.net.web3': web3,
          },
        },
      });
    },
  },
  modules: {
    home,
    login,
    businessCard,
  },
});

export default store;
