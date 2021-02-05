<template>
  <view>
    <view class="userinfo" v-if="address!==null">
      <image :src="getState.getAddressAvatar({ address })" class="img"></image>
      <view class="userinfo-desc">
        <view class="userinfo-desc-name">{{ address.substring(0,5)+'...'+address.substring(37) }}</view>
        <view class="userinfo-desc-gray"
          ><view>ETH地址：{{ address.substring(0,25) }}</view>
          <view>{{ address.substring(25) }}</view>
          </view
        >
      </view>
    </view>
    <view class="perch"></view>
    <u-cell-group>
      <!-- <u-cell-item title="朋友圈" label="模拟数据暂不支持查看好友朋友圈" hover-class="none" :title-style="{ marginLeft: '10rpx' }"></u-cell-item> -->
      <u-link :href="'https://cn.etherscan.com/address/' + address">
        
        <u-cell-item title="在ETHERSCAN上查看" :title-style="{ marginLeft: '20rpx' }">
          <u-icon slot="icon" name="zhuanfa" color="#36648B" size="32"></u-icon>
        </u-cell-item>
      </u-link>
    </u-cell-group>
    <!-- <view class="" v-if="userAddress !== address">
      <view class="perch"></view>
      <u-cell-group>
        <u-cell-item
          title="发消息"
          :arrow="false"
          :center="true"
          :title-style="{ marginLeft: '10rpx' }"
          @click="goToChat()"
        >
          <u-icon slot="icon" name="chat" color="#36648B" size="32"></u-icon>
        </u-cell-item>
      </u-cell-group>
    </view> -->
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      address: (state) => state.businessCard.address,
      userAddress: (state) => state.userData.userAddress,
    }),
    ...mapGetters({
      getState: "getState",
    }),
  },

  async onLoad(options) {
    try {
      const launchedRes = await this.$onLaunched;
      this.$store.state.appData.extend.log.getLog({
        message: "界面加载",
        log: { launchedRes, options },
      });
      await this.onload({ options });
    } catch (err) {
      this.$store.state.appData.extend.log.getErr(err);
    }
  },

  methods: {
    ...mapActions("businessCard", ["onload"]),

    goToChat() {},
  },
};
</script>

<style scoped lang="scss">
.perch {
  height: 10rpx;
}
.userinfo {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20rpx 30rpx 40rpx 40rpx;
  background-color: #ffffff;
  .img {
    display: block;
    width: 110rpx;
    height: 110rpx;
    border-radius: 10rpx;
  }
  &-desc {
    padding-left: 30rpx;
    &-name {
      font-weight: bold;
      font-size: 36rpx;
      transform: translateY(-10rpx);
    }
    &-gray {
      color: $u-tips-color;
      font-size: 15rpx;
    }
  }
}
</style>
