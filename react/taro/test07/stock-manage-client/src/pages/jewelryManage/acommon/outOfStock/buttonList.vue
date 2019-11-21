<template>
  <div class="btnWrap">
    <div
      class="right20"
      v-for="(item, index) in bizRwStatuBtn"
      :key="index"
      @click="operationFun(item)"
    >
      <el-button type="primary" size="small" :plain="index === 0">
        {{item.label}}
        <span v-if="item.value === 'PRINT'">({{printTimes || 0}})</span>
      </el-button>
    </div>
    <div
      class="right20"
      v-for="(item, index) in buttons"
      :key="item.actionSign"
      @click="submitData(item)"
    >
      <el-button type="primary" size="small" :plain="index === 0">{{item.actionName}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bizAuxiliary: {
      //作废、驳回、通过
      type: Object,
      required: true
    },
    printTimes: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      bizRwStatuBtn: [], //WRITE("可写"),DELETE("可删"),READ("只读");
      buttons: [] //DISCARD("作废"),WAITCONFIRM("审核"),REJECT("驳回"),
    };
  },
  created() {},
  watch: {
    bizAuxiliary: function(newVal, oldVal) {
      if (newVal.bizRwStatu == undefined) {
        this.buttons = [];
        this.bizRwStatuBtn = [];
        return;
      }
      //   this.buttons = [];
      //   this.bizRwStatuBtn = [];
      newVal.bizRwStatu.forEach(item => {
        let label;
        switch (item) {
          case "WRITE":
            label = "编辑";
            break;
          case "PRINT":
            label = `打印`;
            break;
          default:
            label = "";
        }
        if (label != "") {
          this.bizRwStatuBtn.push({
            value: item,
            label
          });
        }
      });
      let res = newVal.bizRwStatu.indexOf("WRITE");
      if (res != -1) {
        newVal.buttons.forEach(item => {
          if (item.actionSign == "DISCARD") {
            this.buttons.push(item);
          }
        });
      } else {
        this.buttons = newVal.buttons;
      }
    }
  },
  methods: {
    //作废、驳回、通过事件
    submitData(e) {
      this.$emit("submitData", e);
    },

    //编辑、删除、打印事件
    operationFun(e) {
      this.$emit("operationFun", e);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.btnWrap {
  display: flex;
}
</style>
