<!--
 * @Description: 
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 14:12:34
 * @LastEditors: 33357
 * @Reference: 
-->
<template>
  <view class="content">
    <!-- 消息框 -->
    <view class="content-box" @touchstart="viewTouchstart" id="content-box">
      <block v-if="messages !== undefined">
        <u-loadmore
          :status="loadAll===true?'nomore':loadMoreState"
          :icon-type="loadMoreIconType"
          :load-text="loadMoreText"
        />
        <view
          class="message"
          :id="'message-index-' + index"
          v-for="(item, index) in messages"
          :key="index"
        >
          <view v-if="item.sendAddress !== userAddress" style="font-size: 10px">{{
            getFunction.getBalanceString({
              tokenAddress: acceptAddress,
              walletAddress: item.sendAddress,
            })
          }}</view>
          <view
            class="message-item"
            :class="item.sendAddress === userAddress ? 'right' : 'left'"
          >
            <image
              class="img"
              :src="getState.getAddressAvatar({ address: item.sendAddress })"
              @tap="goToBusinessCard({ address: item.sendAddress })"
            />
            <view class="content">{{ item.chatContent.text }}</view>
          </view>
        </view>
      </block>
    </view>
<!-- 输入框 -->
    <view class="input-box" id="input-box">
      <view class="input-box-flex">
        <view class="input-box-flex-grow">
          <u-input
            :disabled="inputDisable"
            class="content"
            v-model="inputValue"
            placeholder-style="发送"
            placeholder=""
            :clearable="false"
            @confirm="sendMsg"
          />
        </view>
        <u-button
          type="success"
          @click="sendMsg"
          class="btn"
          :loading="buttonLoading"
          >发送</u-button
        >
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      buttonLoading: false,
      inputDisable: false,
      inputValue: "",
      down: false,
      top: false,
      windowHeight: 0,
      loadMoreState: "loadmore",
      loadMoreIconType: "flower",
      loadMoreText: {
        loadmore: "轻轻上拉",
        loading: "努力加载中",
        nomore: "实在没有了",
      },
    };
  },
  computed: {
    ...mapState({
      userTokenJson: (state) => state.loadingData.userTokenJson,
      acceptAddress: (state) => state.home.chat.acceptAddress,
      getOwnSendChat: (state) => state.home.chat.getOwnSendChat,
      getOtherSendChat: (state) => state.home.chat.getOtherSendChat,
      userAddress: (state) => state.userData.userAddress,
      messages: (state) => state.home.chat.messages,
      getMessageNumber: (state) => state.home.chat.getMessageNumber,
      getGetChat: (state) => state.home.chat.getGetChat,
      loadAll:(state) => state.home.chat.loadAll,
    }),
    ...mapGetters({
      getFunction: "getFunction",
      getState: "getState",
    }),
  },
  watch: {
    /**
     * @description:监视收到自己发送的消息
     */
    getOwnSendChat() {
      try {
        this.buttonLoading = false;
        this.inputDisable = false;
        this.inputValue = "";
        this.$nextTick(() => {
          this.$store.state.appData.extend.uniapp.pageScrollTo({
            scrollTop: 9999,
            duration: 100,
          });
        });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    /**
     * @description:监视收到别人发送的消息
     */
    getOtherSendChat() {
      try {
        if (this.down) {
          this.$nextTick(() => {
            this.$store.state.appData.extend.uniapp.pageScrollTo({
              scrollTop: 9999,
              duration: 100,
            });
          });
        }
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    /**
     * @description:监视收到获取消息的信息
     */
    getGetChat() {
      try {
        if (this.loadMoreState === "loading") {
          this.loadMoreState = "loadmore";
        }
        this.$nextTick(() => {
          let top = 0;
          for (let i = 0; i < this.getMessageNumber; i++) {
            top += document.getElementById("message-index-" + i).clientHeight;
          }
          this.$store.state.appData.extend.uniapp.pageScrollTo({
            scrollTop: top,
            duration: 0,
          });
        });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    /**
     * @description:监视页面下拉
     */
    async top(newValue, oldValue) {
      try {
        if (oldValue === false && newValue === true) {
          if (this.loadMoreState === "loadmore"&&this.loadAll===false) {
            this.loadMoreState = "loading";
            this.$store.state.appData.extend.log.getLog({
              message: "页面下拉",
            });
            await this.getMessage({wait:true});
          }
        }
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
  },
  /**
     * @description:页面加载
     */
  async onLoad(options) {
    try {
      const launchedRes = await this.$onLaunched;
      this.$store.state.appData.extend.log.getLog({
        message: "页面加载",
        log: { launchedRes, options },
      });
      await this.onload({ options });
      const token = this.userTokenJson[this.acceptAddress];
      uni.setNavigationBarTitle({
        title: token.symbol,
      });
      this.$nextTick(() => {
        this.$store.state.appData.extend.uniapp.pageScrollTo({
          scrollTop: 9999,
          duration: 0,
        });
      });
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },
  /**
     * @description:页面准备
     */
  async onReady() {
    try {
      this.$store.state.appData.extend.log.getLog({ message: "页面准备" });
      const res = uni.getSystemInfoSync();
      this.windowHeight = res.windowHeight;
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },
  /**
     * @description:页面下划
     */
  async onPageScroll(e) {
    try {
      const clientHeight = document.getElementById("content-box").clientHeight;
      if (clientHeight - this.windowHeight - e.scrollTop <= 30) {
        this.down = true;
      } else {
        this.down = false;
      }
      if (e.scrollTop < 30) {
        this.top = true;
      } else {
        this.top = false;
      }
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },
  /**
     * @description:点击导航栏按钮
     */
  async onNavigationBarButtonTap({ index }) {
    try {
      this.$store.state.appData.extend.log.getLog({
        message: "点击标题按钮",
        log: { index },
      });
      if (index === 0) {
        await this.$store.state.appData.extend.uniapp.go.back();
      }
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },
  /**
     * @description:页面注销
     */
  async onUnload() {
    try {
      this.$store.state.appData.extend.log.getLog({ message: "页面注销" });
      await this.onunload();
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },
  methods: {
    ...mapActions("home/chat/", [
      "onload",
      "sendMessage",
      "getMessage",
      "onunload",
    ]),
/**
     * @description:发送消息
     */
    async sendMsg() {
      try {
        if (!this.$u.trim(this.inputValue)) {
          return;
        }
        this.buttonLoading = true;
        this.inputDisable = true;
        await this.sendMessage({ chatContent: { text: this.inputValue } });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    /**
     * @description:用户触摸屏幕的时候隐藏键盘
     */
    async viewTouchstart() {
      try {
        uni.hideKeyboard();
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    /**
     * @description:跳转BusinessCard
     */
    async goToBusinessCard({ address }) {
      try {
        await this.$store.state.appData.extend.uniapp.go.to({
          url: "/pages/open/businessCard",
          params: {
            address,
          },
        });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/chat.scss";
</style>
