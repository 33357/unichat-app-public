/*
 * @Description:
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 13:49:31
 * @LastEditors: 33357
 * @Reference:
 */
export const chat = {
  namespaced: true,
  state: () => ({
    /**
     * @description: 消息是否加载完
     */
    loadAll: false,
    /**
     * @description: 消息是否获取完
     */
    getAll: false,
    /**
     * @description: 消息加载数量
     */
    loadNumber: 0,
    /**
     * @description: 接收地址
     */
    acceptAddress: null,
    /**
     * @description: 获取到自己发的消息
     */
    getOwnSendChat: 0,
    /**
     * @description: 获取到别人发的消息
     */
    getOtherSendChat: 0,
    /**
     * @description: 页面消息数组
     */
    messages: [],
    /**
     * @description: 获取到消息的数量
     */
    getMessageNumber: 0,
    /**
     * @description: 收到获取的消息
     */
    getGetChat: 0,
  }),
  getters: {},
  mutations: {
    /**
     * @description: 设置state变量
     */
    setState: (state, { setJson, rootState }) => {
      rootState.appData.extend.math.setJson({
        objectJson: state,
        setJson,
        func: ({ method, key, value }) => {
          rootState.appData.extend.log.getLog({
            message: '修改home/chat数据',
            log: { method, key, value },
          });
        },
      });
    },
  },
  actions: {
    /**
     * @description: chat初始化
     */
    onload: async (
      { commit, rootGetters, rootState, state, dispatch },
      { options }
    ) => {
      if (rootState.appData.token.isStartApp) {
        if (options.acceptAddress === undefined) {
          throw {
            message: '没有传入地址',
            log: { acceptAddress: options.acceptAddress },
          };
        }
        const acceptAddress = options.acceptAddress;
        commit('setState', {
          setJson: { $set: { acceptAddress: acceptAddress } },
          rootState,
        });
        const messages = rootGetters['home/getState'].getTokenChatJsonMessages({
          acceptAddress,
        });
        const loadNumber =
          messages.length > rootState.appData.setting.chatLoadNumber
            ? rootState.appData.setting.chatLoadNumber
            : messages.length;
        commit('setState', {
          setJson: {
            $vueSet: {
              messages: messages.slice(
                messages.length - loadNumber,
                messages.length
              ),
              loadNumber: loadNumber,
              loadAll:
                loadNumber < rootState.appData.setting.chatLoadNumber
                  ? true
                  : false,
            },
          },
          rootState,
        });
        if (messages.length !== rootState.appData.setting.getChatNumber) {
          commit('setState', {
            setJson: { $set: { getAll: true } },
            rootState,
          });
        }
        if (messages.length !== 0) {
          const historyTime = messages[messages.length - 1].createDate;
          if (
            rootState.userData.cloudSetting.homeSetting.chatSetting[
              acceptAddress
            ] === undefined ||
            rootState.userData.cloudSetting.homeSetting.chatSetting[
              acceptAddress
            ].historyTime === undefined ||
            rootState.userData.cloudSetting.homeSetting.chatSetting[
              acceptAddress
            ].historyTime !== historyTime
          ) {
            commit(
              'setState',
              {
                setJson: {
                  $vueSet: JSON.parse(
                    `{\"userData.cloudSetting.homeSetting.chatSetting.${acceptAddress}.historyTime\":\"${historyTime}\"}`
                  ),
                },
              },
              { root: true }
            );
          }
        }
      }
    },
    /**
     * @description: chat页面注销
     */
    onunload: async ({ commit, rootState, state }) => {
      if (state.messages.length !== 0) {
        const historyTime =
          state.messages[state.messages.length - 1].createDate;
        if (
          rootState.userData.cloudSetting.homeSetting.chatSetting[
            state.acceptAddress
          ] === undefined ||
          rootState.userData.cloudSetting.homeSetting.chatSetting[
            state.acceptAddress
          ].historyTime === undefined ||
          rootState.userData.cloudSetting.homeSetting.chatSetting[
            state.acceptAddress
          ].historyTime !== historyTime
        ) {
          commit(
            'setState',
            {
              setJson: {
                $vueSet: JSON.parse(
                  `{\"userData.cloudSetting.homeSetting.chatSetting.${state.acceptAddress}.historyTime\":\"${historyTime}\"}`
                ),
              },
            },
            { root: true }
          );
        }
      }
      commit('setState', {
        setJson: {
          $vueSet: {
            loadAll: false,
            loadNumber: 0,
            acceptAddress: null,
            getOwnSendChat: 0,
            getOtherSendChat: 0,
            messages: [],
            getMessageNumber: 0,
            getGetChat: 0,
          },
        },
        rootState,
      });
    },
    /**
     * @description: 发送消息
     */
    sendMessage: async ({ state, rootState }, { chatContent }) => {
      rootState.appData.net.webSocket.sendChat({
        chatContent,
        acceptAddress: state.acceptAddress,
      });
    },
    /**
     * @description: 获取消息
     */
    getMessage: async ({ state, rootState, rootGetters, commit }, { wait }) => {
      const messages = rootGetters['home/getState'].getTokenChatJsonMessages({
        acceptAddress: state.acceptAddress,
      });
      if (state.loadNumber < messages.length) {
        const loadNumber =
          messages.length >
          state.loadNumber + rootState.appData.setting.chatLoadNumber
            ? state.loadNumber + rootState.appData.setting.chatLoadNumber
            : messages.length;
        setTimeout(
          () => {
            commit('setState', {
              setJson: {
                $vueSet: {
                  messages: messages.slice(
                    messages.length - loadNumber,
                    messages.length
                  ),
                  getMessageNumber: loadNumber - state.loadNumber,
                  loadNumber: loadNumber,
                  getGetChat: state.getGetChat + 1,
                },
              },
              rootState,
            });
            if (state.loadNumber >= messages.length && state.getAll === true) {
              commit('setState', {
                setJson: {
                  $vueSet: {
                    loadAll: true,
                  },
                },
                rootState,
              });
            }
          },
          wait === true ? 500 : 0
        );
      } else if (state.getAll === false) {
        rootState.appData.net.webSocket.getChat({
          acceptAddress: state.acceptAddress,
          skip: state.messages.length,
          limit: rootState.appData.setting.getChatNumber,
        });
      }
    },
    /**
     * @description: 收到连接消息的信息
     */
    getLinkChat: async (
      { commit, rootState, state },
      { acceptAddress, messages }
    ) => {},
    /**
     * @description: 收到获取消息的信息
     */
    getGetChat: async (
      { commit, state, rootState, dispatch },
      { acceptAddress, messages }
    ) => {
      if (acceptAddress === state.acceptAddress) {
        if (messages.length !== rootState.appData.setting.getChatNumber) {
          commit('setState', {
            setJson: { $set: { getAll: true } },
            rootState,
          });
        }
        await dispatch('getMessage', { wait: false });
      }
    },
    /**
     * @description: 收到发送消息的信息
     */
    getSendChat: async (
      { commit, state, rootState, rootGetters },
      { acceptAddress, messages }
    ) => {
      if (state.acceptAddress === acceptAddress) {
        const _messages = rootGetters['home/getState'].getTokenChatJsonMessages(
          {
            acceptAddress,
          }
        );
        commit('setState', {
          setJson: {
            $vueSet: {
              messages: _messages.slice(
                _messages.length - (state.loadNumber + messages.length),
                _messages.length
              ),
              loadNumber: state.loadNumber + messages.length,
            },
          },
          rootState,
        });
        if (messages[0].sendAddress === rootState.userData.userAddress) {
          commit('setState', {
            setJson: { $set: { getOwnSendChat: state.getOwnSendChat + 1 } },
            rootState,
          });
        } else {
          commit('setState', {
            setJson: { $set: { getOtherSendChat: state.getOtherSendChat + 1 } },
            rootState,
          });
        }
      }
    },
  },
};
