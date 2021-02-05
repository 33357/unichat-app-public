<template>
  <view>
    <u-navbar back-text="返回" title="剑未配妥，出门已是江湖"></u-navbar>
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
    <view class="content">
      <!-- 正文内容 -->
    </view>
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
</style>
