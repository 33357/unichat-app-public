/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:21:37
 * @LastEditors: 33357
 */
export const login = {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {
    onload: async ({}, { options }) => {},
    // 用户登录
    userLogin: async ({ commit, rootState, dispatch }, { web3Provider }) => {
      await dispatch('setWeb3Provider', { web3Provider }, { root: true });
      const getWalletAddressRes = await rootState.appData.net.web3.getWalletAddress();
      commit(
        'setState',
        {
          setJson: {
            $set: {
              'userData.walletAddress': getWalletAddressRes.walletAddress,
            },
          },
        },
        { root: true }
      );
      const getNewUserRes = await rootState.appData.net.httpAPI.getNewUser();
      let signData = getNewUserRes.signData;
      signData.message.loginWallet = getWalletAddressRes.walletAddress;
      signData.message.loginDate = rootState.appData.extend.math.getTime();
      const signLoginRes = await rootState.appData.net.web3.signLogin({
        walletAddress: getWalletAddressRes.walletAddress,
        signData,
      });
      await rootState.appData.net.httpAPI.userLogin({
        data: {
          signMessage: signData.message,
          signData: signLoginRes.sig,
        },
      });
      const startAppRes = await dispatch('startApp', null, {
        root: true,
      });
      if (startAppRes) {
        rootState.appData.extend.uniapp.go.home();
      }
    },
  },
};
