<!--
 * @Author: 33357
 * @Date: 2021-02-05 13:15:36
 * @LastEditTime: 2021-02-05 16:23:27
 * @LastEditors: 33357
-->
<template>
  <view class="content">
    <selectInput
      :list="selectList"
      :list-key="'name'"
      :show.sync="selectShow"
      @on-select="checkSelect"
    />
    <u-modal
      v-model="modalShow"
      :show-title="modalTitleShow"
      :title="modalTitle"
      :content="modalContent"
      @confirm="confirmModal"
      :show-cancel-button="true"
    >
      <view class="slot-content" v-if="modelInputShow">
        <u-input v-model="modalInput" type="text" :clearable="false" focus />
      </view>
    </u-modal>
    <!-- 置顶消息卡片 -->
    <u-swipe-action
      :show="value === null ? false : value.show"
      v-for="(value, key) in tokenChatJson"
      btn-width="200"
      :index="key"
      :key="key"
      @click="clickSwipeAction"
      @open="openSwipeAction"
      :options="swipeActionOptions1"
    >
      <block v-if="value.delete !== true && value.top === true">
        <view
          class="item bg_view"
          hover-class="message-hover-class"
          @tap="goToChat({ acceptAddress: key })"
        >
          <view class="u-badge-wrap">
            <image mode="aspectFill" :src="userTokenJson[key].logoURI" />
            <u-badge
              type="error"
              :count="getHomeFunction.getUnreadNumber({ acceptAddress: key })"
              :offset="[15, 15]"
            ></u-badge>
          </view>
          <view class="right u-border-bottom title-wrap">
            <view class="right_top">
              <view class="right_top_name u-line-1"
                >{{ userTokenJson[key].symbol }}({{
                  userTokenJson[key].name
                }})</view
              >
              <view class="right_top_time">{{
                value.messages === undefined || value.messages.length === 0
                  ? "无消息时间"
                  : value.messages[
                      value.messages.length - 1
                    ].createDate.substring(0, 10)
              }}</view>
            </view>
            <view class="right_btm">
              <view class="u-line-1">{{
                value.messages === undefined || value.messages.length === 0
                  ? "无消息"
                  : getFunction.getBalanceString({
                      walletAddress:
                        value.messages[value.messages.length - 1].sendAddress,
                      tokenAddress: key,
                    }) +
                    "：" +
                    value.messages[
                      value.messages.length - 1
                    ].chatContent.text.substring(0, 15)
              }}</view>
              <view>{{
                getFunction.getBalanceString({
                  walletAddress: userAddress,
                  tokenAddress: key,
                })
              }}</view>
            </view>
          </view>
        </view>
      </block>
    </u-swipe-action>
    <view>
      <!-- 非置顶消息卡片 -->
      <u-swipe-action
        :show="value === null ? false : value.show"
        v-for="(value, key) in tokenChatJson"
        btn-width="200"
        :index="key"
        :key="key"
        @click="clickSwipeAction"
        @open="openSwipeAction"
        :options="swipeActionOptions2"
      >
        <block v-if="value.delete !== true && value.top !== true">
          <view
            class="item"
            hover-class="message-hover-class"
            @tap="goToChat({ acceptAddress: key })"
          >
            <view class="u-badge-wrap">
              <image mode="aspectFill" :src="userTokenJson[key].logoURI" />
              <u-badge
                type="error"
                :count="getHomeFunction.getUnreadNumber({ acceptAddress: key })"
                :offset="[15, 15]"
              ></u-badge>
            </view>
            <view class="right u-border-bottom title-wrap">
              <view class="right_top">
                <view class="right_top_name u-line-1"
                  >{{ userTokenJson[key].symbol }}({{
                    userTokenJson[key].name
                  }})</view
                >
                <view class="right_top_time">{{
                  value.messages === undefined || value.messages.length === 0
                    ? "无消息时间"
                    : value.messages[
                        value.messages.length - 1
                      ].createDate.substring(0, 10)
                }}</view>
              </view>
              <view class="right_btm">
                <view class="u-line-1">{{
                  value.messages === undefined || value.messages.length === 0
                    ? "无消息"
                    : value.messages[value.messages.length - 1].sendAddress ===
                      userAddress
                    ? value.messages[
                        value.messages.length - 1
                      ].chatContent.text.substring(0, 15)
                    : getFunction.getBalanceString({
                        walletAddress:
                          value.messages[value.messages.length - 1].sendAddress,
                        tokenAddress: key,
                      }) +
                      "：" +
                      value.messages[
                        value.messages.length - 1
                      ].chatContent.text.substring(0, 15)
                }}</view>
                <view>{{
                  getFunction.getBalanceString({
                    walletAddress: userAddress,
                    tokenAddress: key,
                  })
                }}</view>
              </view>
            </view>
          </view>
        </block>
      </u-swipe-action>
    </view>
  </view>
</template>

<script>
import selectInput from "@/components/selectInput/selectInput.vue";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  components: {
    selectInput,
  },
  data() {
    return {
      selectShow: false,
      modalTitleShow: false,
      modelMethod: null,
      modelData: null,
      modalShow: false,
      modalContent: null,
      modalTitle: null,
      modelInputShow: true,
      modalInput: "",
      swipeActionOptions1: [
        {
          text: "取消置顶",
          style: {
            backgroundColor: "#3399ff",
            fontSize: "26rpx",
          },
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
            fontSize: "26rpx",
          },
        },
      ],
      swipeActionOptions2: [
        {
          text: "置顶",
          style: {
            backgroundColor: "#3399ff",
            fontSize: "26rpx",
          },
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
            fontSize: "26rpx",
          },
        },
      ],
      selectList: [
        {
          name: "添加代币",
          icon: "man-add-fill",
        },
        {
          name: "登出",
          icon: "zhuanfa",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      userTokenJson: (state) => state.loadingData.userTokenJson,
      tokenChatJson: (state) => state.home.tokenChatJson,
      userAddress: (state) => state.userData.userAddress,
    }),
    ...mapGetters({
      getState: "getState",
      getFunction: "getFunction",
      getHomeFunction: "home/getFunction",
    }),
  },
  //页面加载
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
    ...mapActions({
      onload: "home/onload",
      addChat: "home/addChat",
      setTopChat: "home/setTopChat",
      deleteChat: "home/deleteChat",
      openChat: "home/openChat",
      userLogout: "userLogout",
    }),
    //确认modal
    async confirmModal() {
      try {
        if (this.modelMethod === "deleteChat") {
          await this.deleteChat(this.modelData);
        } else if (this.modelMethod === "addChat") {
          if (this.modalInput !== "") {
            await this.addChat({ tokenAddress: this.modalInput });
            this.modalInput = "";
          } else {
            this.$store.state.appData.extend.uniapp.modal.short({
              content: "输入不能为空",
            });
          }
        }
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    //点击消息卡片
    async clickSwipeAction(index, index1) {
      try {
        this.$store.state.appData.extend.log.getLog({
          message: "点击滑动块",
          log: { index, index1 },
        });
        if (index1 == 0) {
          await this.setTopChat({ acceptAddress: index });
        } else if (index1 == 1) {
          this.setModal({
            method: "deleteChat",
            data: { acceptAddress: index },
          });
          this.modalShow = true;
        }
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    //打开消息卡片
    async openSwipeAction(index) {
      try {
        this.$store.state.appData.extend.log.getLog({
          message: "打开滑动块",
          log: { index },
        });
        await this.openChat({ acceptAddress: index });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    //点击导航栏按钮
    async onNavigationBarButtonTap({ index }) {
      try {
        this.$store.state.appData.extend.log.getLog({
          message: "点击导航栏自定义按钮",
          log: { index },
        });
        if (index == 0) {
          this.selectShow = !this.selectShow;
        }
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    //跳转chat
    async goToChat({ acceptAddress }) {
      try {
        await this.$store.state.appData.extend.uniapp.go.to({
          url: "/pages/home/chat",
          params: {
            acceptAddress,
          },
        });
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    //点击弹窗
    async checkSelect(index) {
      try {
        this.$store.state.appData.extend.log.getLog({
          message: "点击弹窗",
          log: { index },
        });
        if (index == 0) {
          this.setModal({ method: "addChat" });
          this.modalShow = true;
        } else if (index == 1) {
          await this.userLogout();
        }
      } catch (err) {
        this.$store.state.appData.extend.log.getErr(err);
      }
    },
    //设置modal
    setModal({ method, data = null }) {
      if (method === "deleteChat") {
        this.modelMethod = "deleteChat";
        this.modalContent = "删除后需手动添加，是否确认删除？";
        this.modalTitleShow = false;
        this.modelInputShow = false;
        this.modelData = data;
      } else if (method === "addChat") {
        this.modelMethod = "addChat";
        this.modalTitleShow = true;
        this.modalTitle = "请输入通证地址";
        this.modelInputShow = true;
        this.modelData = data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .item {
    width: 750rpx;
    display: flex;
    align-items: center;

    // padding: 20rpx;
    image {
      width: 76rpx;
      height: 76rpx;
      margin: 20rpx;
      border-radius: 12rpx;
      flex: 0 0 76rpx;
    }

    .right {
      overflow: hidden;
      flex: 1 0;
      padding: 20rpx 20rpx 20rpx 0;

      &_top {
        display: flex;
        justify-content: space-between;

        &_name {
          font-size: 28rpx;
          color: $u-main-color;
          flex: 0 0 450rpx;
          overflow: hidden;
        }

        &_time {
          font-size: 22rpx;
          color: $u-light-color;
        }
      }

      &_btm {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 22rpx;
        color: $u-tips-color;
        padding-top: 10rpx;
      }
    }
  }

  .bg_view {
    background-color: #fafafa;
  }

  .slot-wrap {
    display: flex;
    align-items: center;
    padding: 0 30rpx;
  }
}
.u-badge-wrap {
  // width: 76rpx;
  // height: 76rpx;
  // margin: 20rpx;
  width: 120rpx;
  height: 120rpx;
  position: relative;
  margin: auto;
}
</style>

<style lang="scss">
.slot-content {
  font-size: 28rpx;
  color: $u-content-color;
  padding-left: 30rpx;
}
</style>
