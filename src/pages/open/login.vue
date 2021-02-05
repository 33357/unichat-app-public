<!--
 * @Description: 
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 14:19:39
 * @LastEditors: 33357
 * @Reference: 
-->
<template>
  <view class="content">
    <view class="status_bar"></view>
    <view class="content_body">
      <u-avatar
        src="/static/image/wallet/metamask.png"
        mode="square"
        size="large"
      ></u-avatar>
      <view class="content_body_btn">
        <u-button
          :ripple="true"
          type="success"
          @click="clickMetaMask()"
          size="medium"
          >METAMASK登录</u-button
        >
      </view>
    </view>
    <view class="content_body">
      <u-avatar
        src="/static/image/wallet/imtoken.jpg"
        mode="square"
        size="large"
      ></u-avatar>
      <view class="content_body_btn">
        <u-button
          :ripple="true"
          type="success"
          @click="clickIMToken()"
          size="medium"
          >IMTOKEN登录</u-button
        >
      </view>
    </view>
    <view class="u-flex u-row-around safe-area-inset-bottom content_footer">
      <u-link href="https://www.unichat.top" :under-line="true"
        >关于UniChat</u-link
      >
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("login/", []),
  },
  /**
   * @description:页面加载
   */
  async onLoad(options) {
    try {
      const launchedRes = await this.$onLaunched;
      this.$store.state.appData.extend.log.getLog({
        message: "界面加载",
        log: { launchedRes, options },
      });
      this.onload({ options });
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },
  methods: {
    ...mapActions("login/", ["userLogin", "onload"]),
    /**
     * @description:点击MetaMask
     */
    async clickMetaMask() {
      try {
        await this.userLogin({ web3Provider: "metamask" });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    /**
     * @description:点击IMToken
     */
    async clickIMToken() {
      try {
        await this.userLogin({ web3Provider: "imtoken" });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  &_body {
    margin-top: 170rpx;
    text-align: center;

    &_tel {
      margin-top: 10rpx;
    }

    &_pswd {
      margin-top: 40rpx;
    }

    &_btn {
      margin-top: 120rpx;
      padding: 0 20rpx;
    }
  }

  &_footer {
    position: absolute;
    bottom: 50rpx;
    width: 100%;
    padding: 0 30rpx;

    text {
      color: #2979ff;
    }
  }
}
</style>
<style scoped>
.u-border-top:after {
  border-top-width: 0px;
}
</style>
