<!--
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:22:24
 * @LastEditors: 33357
-->
<script>
export default {
  //应用初始化
  onLaunch: async function () {
    this.$store.state.appData.extend.log.getLog({ message: "应用启动" });
    uni.hideTabBar();
    window.addEventListener("load", async () => {
      try {
        if (window.ethereum) {
          window.web3 = new Web3(ethereum);
          this.$store.state.appData.extend.log.getLog({
            message: "注入web3",
            log: { web3: window.web3 },
          });
        } else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
          this.$store.state.appData.extend.log.getLog({
            message: "注入web3",
            log: { web3: window.web3 },
          });
        }
      } catch (error) {
        window.web3 = undefined;
        this.$store.state.appData.extend.log.getLog({ message: "没有web3" });
      }
      this.$isResolve(await this.$store.dispatch("startApp"));
    });
  },
  onShow: function () {
    this.$store.state.appData.extend.log.getLog({ message: "应用显示" });
  },
  onHide: function () {
    this.$store.state.appData.extend.log.getLog({ message: "应用隐藏" });
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
</style>
