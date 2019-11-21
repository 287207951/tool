<template>
  <div class="refreshHead" style="flex:1">
    <div>
      欠款(￥)：
      <span>{{oweMoney}}</span>
    </div>
    <div class="itemWrap">
      欠料(g)：
      <span>{{oweStock}}</span>
    </div>
    <el-button type="primary" size="small" :loading="loadingStatus" plain @click="refWeightNum">刷新</el-button>
  </div>
</template>

<script>
export default {
  props: [`customerId`],
  data() {
    return {
      oweMoney: 0,
      oweStock: 0,
      loadingStatus: false
    };
  },
  watch: {
    customerId(val) {
      this.customerId = val;
      this.getWeightNum();
    }
  },
  methods: {
    getWeightNum() {
      this.getData(false);
    },

    getData(ref) {
      const { customerId } = this;
      let params = {
        PRS: {
          customerId
        }
      };
      this.loadingStatus = true;
      this.$axios
        .get(this.$portMain + "/outstore/getSaveOweMsg", params)
        .then(res => {
          if (!res.data.data) {
            return;
          }
          const { oweMoney, oweStock } = res.data.data;
          this.oweMoney = oweMoney;
          this.oweStock = oweStock;
        })
        .finally(() => {
          if (!ref) {
            this.loadingStatus = false;
            return;
          }
          setTimeout(() => {
            this.loadingStatus = false;
          }, 1000);
        });
    },

    refWeightNum() {
      this.getData(true);
    }
  }
};
</script>

<style lang="stylus" scoped>
.refreshHead {
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;

  span {
    color: red;
  }

  .itemWrap {
    margin: 0 33px;
  }
}
</style>
