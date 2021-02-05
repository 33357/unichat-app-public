/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:19:23
 * @LastEditors: 33357
 */
import { chat } from './chat.js';

export const home = {
  namespaced: true,
  state: () => ({
    // 用户聊天数据JSON
    tokenChatJson: {},
  }),
  getters: {
    // 获取state数据
    getState: (state) => {
      return {
        getTokenChatJsonMessages: ({ acceptAddress }) => {
          if (state.tokenChatJson[acceptAddress] === undefined) {
            return undefined;
          } else {
            return state.tokenChatJson[acceptAddress].messages;
          }
        },
      };
    },
    // 设置state数据函数
    getFunction: (state, getters, rootState) => {
      return {
        getUnreadNumber: ({ acceptAddress }) => {
          const messages = state.tokenChatJson[acceptAddress].messages;
          if (messages === undefined) {
            return 0;
          }
          if (
            rootState.userData.cloudSetting.homeSetting.chatSetting[
              acceptAddress
            ] === undefined ||
            rootState.userData.cloudSetting.homeSetting.chatSetting[
              acceptAddress
            ].historyTime === undefined
          ) {
            return messages.length > 99 ? '99+' : messages.length;
          }
          const messagesFindRes = messages.filter(
            (e) =>
              new Date(e.createDate) >
              new Date(
                rootState.userData.cloudSetting.homeSetting.chatSetting[
                  acceptAddress
                ].historyTime
              )
          );
          return messagesFindRes.length > 99 ? '99+' : messagesFindRes.length;
        },
      };
    },
  },
  mutations: {
    // 设置state变量
    setState: (state, { setJson, rootState }) => {
      rootState.appData.extend.math.setJson({
        objectJson: state,
        setJson,
        func: ({ method, key, value }) => {
          rootState.appData.extend.log.getLog({
            message: '修改home数据',
            log: { method, key, value },
          });
        },
      });
    },
  },
  actions: {
    // home初始化
    onload: async ({ rootState, dispatch }, { options }) => {
      if (rootState.appData.extend.uniapp.loading === true) {
        rootState.appData.extend.uniapp.load.show();
      }
    },
    // 发送连接消息的请求
    linkChat: async ({ rootState, state, commit }, { acceptAddress }) => {
      try {
        if (state.tokenChatJson[acceptAddress] === undefined) {
          const chatSetting = {
            show: false,
            top: false,
          };
          if (
            rootState.userData.cloudSetting.homeSetting.chatSetting[
              acceptAddress
            ] !== undefined
          ) {
            if (
              rootState.userData.cloudSetting.homeSetting.chatSetting[
                acceptAddress
              ].top !== undefined
            ) {
              chatSetting.top =
                rootState.userData.cloudSetting.homeSetting.chatSetting[
                  acceptAddress
                ].top;
            }
          }
          commit('setState', {
            setJson: {
              $vueSet: JSON.parse(
                `{\"tokenChatJson.${acceptAddress}.show\":${chatSetting.show},\"tokenChatJson.${acceptAddress}.top\":${chatSetting.top}}`
              ),
            },
            rootState,
          });
          rootState.appData.net.webSocket.linkChat({
            acceptAddress,
            skip: 0,
            limit: rootState.userData.cloudSetting.homeSetting.getChatNumber,
          });
        }
      } catch (err) {
        rootState.appData.extend.log.get({ err });
      }
    },
    // 收到连接消息的信息
    getLinkChat: async (
      { dispatch, commit, rootState },
      { acceptAddress, messages }
    ) => {
      dispatch('setMessagesAvatar', { messages }, { root: true });
      dispatch('setMessagesBalance', { messages }, { root: true });
      commit('setState', {
        setJson: {
          $set: JSON.parse(
            `{\"tokenChatJson.${acceptAddress}.messages\":${JSON.stringify(
              messages
            )}}`
          ),
        },
        rootState,
      });
      await dispatch('chat/getLinkChat', { acceptAddress, messages });
    },
    // 收到发送消息的信息
    getSendChat: async (
      { rootState, commit, state, dispatch },
      { acceptAddress, messages }
    ) => {
      dispatch('setMessagesAvatar', { messages }, { root: true });
      dispatch('setMessagesBalance', { messages }, { root: true });
      if (state.tokenChatJson[acceptAddress].delete !== true) {
        commit('setState', {
          setJson: {
            $push: JSON.parse(
              `{\"tokenChatJson.${acceptAddress}.messages\":${JSON.stringify(
                messages
              )}}`
            ),
          },
          rootState,
        });
        commit('setState', {
          setJson: {
            $vueSet: JSON.parse(
              `{\"tokenChatJson.${acceptAddress}\":${JSON.stringify(
                state.tokenChatJson[acceptAddress]
              )}}`
            ),
          },
          rootState,
        });
      }
      await dispatch('chat/getSendChat', { acceptAddress, messages });
    },
    // 收到获取消息的信息
    getGetChat: async (
      { dispatch, commit, rootState, state },
      { acceptAddress, messages }
    ) => {
      dispatch('setMessagesAvatar', { messages }, { root: true });
      dispatch('setMessagesBalance', { messages }, { root: true });
      commit('setState', {
        setJson: {
          $forwardPush: JSON.parse(
            `{\"tokenChatJson.${acceptAddress}.messages\":${JSON.stringify(
              messages
            )}}`
          ),
        },
        rootState,
      });
      await dispatch('chat/getGetChat', { acceptAddress, messages });
    },
    // 消息卡片置顶
    setTopChat: async ({ rootState, state, commit }, { acceptAddress }) => {
      if (state.tokenChatJson[acceptAddress].top === false) {
        commit('setState', {
          setJson: {
            $vueSet: JSON.parse(
              `{\"tokenChatJson.${acceptAddress}.show\":false}`
            ),
          },
          rootState,
        });
        setTimeout(function () {
          commit('setState', {
            setJson: {
              $vueSet: JSON.parse(
                `{\"tokenChatJson.${acceptAddress}.top\":true}`
              ),
            },
            rootState,
          });
        }, 1000);
        commit(
          'setState',
          {
            setJson: {
              $set: JSON.parse(
                `{\"userData.cloudSetting.homeSetting.chatSetting.${acceptAddress}.top\":true}`
              ),
            },
            rootState,
          },
          { root: true }
        );
      } else {
        commit('setState', {
          setJson: {
            $vueSet: JSON.parse(
              `{\"tokenChatJson.${acceptAddress}.show\":false}`
            ),
          },
          rootState,
        });
        setTimeout(function () {
          commit('setState', {
            setJson: {
              $vueSet: JSON.parse(
                `{\"tokenChatJson.${acceptAddress}.top\":false}`
              ),
            },
            rootState,
          });
        }, 1000);
        commit(
          'setState',
          {
            setJson: {
              $set: JSON.parse(
                `{\"userData.cloudSetting.homeSetting.chatSetting.${acceptAddress}.top\":false}`
              ),
            },
            rootState,
          },
          { root: true }
        );
      }
    },
    // 消息卡片打开
    openChat: async ({ rootState, state, commit }, { acceptAddress }) => {
      commit('setState', {
        setJson: {
          $vueSet: JSON.parse(`{\"tokenChatJson.${acceptAddress}.show\":true}`),
        },
        rootState,
      });
      for (const key in state.tokenChatJson) {
        if (state.tokenChatJson[key].show === true && key !== acceptAddress) {
          commit('setState', {
            setJson: {
              $vueSet: JSON.parse(`{\"tokenChatJson.${key}.show\":false}`),
            },
            rootState,
          });
        }
      }
    },
    // 删除消息卡片
    deleteChat: async ({ rootState, commit }, { acceptAddress }) => {
      commit('setState', {
        setJson: {
          $vueSet: JSON.parse(
            `{\"tokenChatJson.${acceptAddress}.delete\":true}`
          ),
        },
        rootState,
      });
      commit(
        'setState',
        {
          setJson: {
            $set: JSON.parse(
              `{\"userData.cloudSetting.homeSetting.chatSetting.${acceptAddress}.delete\":true}`
            ),
          },
          rootState,
        },
        { root: true }
      );
      rootState.appData.extend.uniapp.modal.short({ content: '删除成功！' });
      rootState.appData.net.webSocket.unlinkChat({ acceptAddress });
    },
    // 增加消息卡片
    addChat: async ({ rootState, dispatch, commit }, { tokenAddress }) => {
      if (
        !rootState.appData.extend.math.ethTool.isEthAddress({
          address: tokenAddress,
        })
      ) {
        throw { log: { tokenAddress }, message: '不是eth地址！' };
      }
      tokenAddress = rootState.appData.extend.math.ethTool.toEthAddress({
        address: tokenAddress,
      });
      if (
        rootState.userData.cloudSetting.homeSetting.chatSetting[
          tokenAddress
        ] !== undefined
      ) {
        if (
          rootState.userData.cloudSetting.homeSetting.chatSetting[tokenAddress]
            .delete === true
        ) {
          commit(
            'setState',
            {
              setJson: {
                $set: JSON.parse(
                  `{\"userData.cloudSetting.homeSetting.chatSetting.${tokenAddress}.delete\":false}`
                ),
              },
              rootState,
            },
            { root: true }
          );
        }
      }
      const testAndAddTokenRes = await dispatch(
        'testAndAddToken',
        {
          tokenAddress,
        },
        { root: true }
      );
      if (testAndAddTokenRes === false) {
        throw {
          log: { tokenAddress, testAndAddTokenRes },
          message: '通证余额为0，无法添加！',
        };
      } else {
        rootState.appData.extend.uniapp.modal.short({ content: '添加成功！' });
      }
    },
    // 用户注销
    userLogout: async ({ state, rootState, commit }) => {
      for (const key in state.tokenChatJson) {
        rootState.appData.net.webSocket.unlinkChat({ acceptAddress: key });
      }
      commit('setState', {
        setJson: {
          $vueSet: { tokenChatJson: {} },
        },
        rootState,
      });
    },
  },
  modules: {
    chat: chat,
  },
};
