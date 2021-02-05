/*
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:18:58
 * @LastEditors: 33357
 */
export const businessCard = {
  namespaced: true,
  state: () => ({
    // 名片的地址
    address: null,
  }),
  getters: {},
  mutations: {
    // 设置名片地址
    setBusinessAddress: (state, { address }) => {
      state.address = address;
      console.log('setBusinessAddress', state.address);
    },
  },
  actions: {
    // businessCard初始化
    onload: async ({ commit }, { options }) => {
      if (options.address !== undefined) {
        commit('setBusinessAddress', options);
      } else {
      }
    },
  },
};
