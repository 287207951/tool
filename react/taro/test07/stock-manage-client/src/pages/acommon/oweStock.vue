<template>
  <el-row>
    <el-col>
      欠款(￥)：
      <span class="redTxt">{{oweViewData.oweMoney}}</span>
      <span class="left10">欠料(g):</span>
      <span class="redTxt">{{oweViewData.oweStock}}</span>
      <el-button type="primary" size="small" @click="viewOweFun" class="left10" plain>刷新</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: [`customerId`],
  data() {
    return {
      oweViewData: {
        oweStock: 0,
        oweMoney: 0
      }
    };
  },
  watch: {
    customerId(val) {
      this.customerId = val;
      this.viewOweFun();
    }
  },
  methods: {
    //查看存欠信息
    viewOweFun() {
      let params = {
        PRS: {
          customerId: this.customerId
        }
      };
      this.$axios
        .get(this.$portMain + "/outstore/getSaveOweMsg", params)
        .then(res => {
          if (res.data.code == 200) {
            if (res.data.data) {
              this.oweViewData = res.data.data;
            } else {
              this.oweViewData = { oweStock: 0, oweMoney: 0 };
            }
          } else {
            this.oweViewData = { oweStock: 0, oweMoney: 0 };
            this.$message.error(res.data.msg);
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.redTxt {
  color: #F20F34;
}

.left10 {
  margin-left: 10px;
}
</style>


