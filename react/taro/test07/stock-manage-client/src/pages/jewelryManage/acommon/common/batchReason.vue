<template>
  <div class="batchWrap" :style="{'height':`${heightData}px`}" v-show="showState">
    <div class="title">批量选择原因</div>
    <div class="resionWrap">
      <el-checkbox-group v-model="selectResionData">
        <el-checkbox v-for="(item,index) in resionData" :key="index" :label="item.value"></el-checkbox>
        <!-- <el-checkbox label="复选框 B"></el-checkbox> -->
      </el-checkbox-group>
    </div>

    <div class="btnWrap">
      <el-button type="primary" size="small" plain class="cancelStyle" @click="cancelFun">取消</el-button>
      <el-button type="primary" size="small" @click="confirmFun">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    heightData: {
      type: Number,
      required: false,
      default: 774
    }
  },
  data() {
    return {
      showState: false,
      selectResionData: [],
      resionData: [
        {
          value: "质量问题"
        },
        {
          value: "上柜"
        },
        {
          value: "返修"
        },
        {
          value: "清洗整形"
        },
        {
          value: "加字印"
        },
        {
          value: "改字印"
        },
        {
          value: "当料退"
        },
        {
          value: "当样品"
        }
      ]
    };
  },
  computed: {},
  filters: {},
  methods: {
    showFun() {
      this.showState = true;
      this.selectResionData = [];
    },
    cancelFun() {
      this.showState = false;
    },
    confirmFun() {
      if (this.selectResionData.length == 0) {
        this.$message.error("请选择批量原因");
        return;
      }
      this.$emit("selectResionFun", this.selectResionData);
      this.showState = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.batchWrap {
  position: absolute;
  top: -79px;
  right: -20px;
  width: 250px;
  // height: 774px/594px;
  background: rgba(255, 255, 255, 1);
  box-shadow: -4px 0px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  z-index: 10;

  // background: red;
  .title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 22px;
    color: rgba(34, 36, 38, 1);
    opacity: 1;
    height: 57px;
    // background: red;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    padding-left: 18px;
  }

  .resionWrap {
    padding: 30px 10px 30px 18px;
  }

  .btnWrap {
    display: flex;
    justify-content: center;

    .cancelStyle {
      margin-right: 30px;
    }
  }
}
</style>

<style>
.batchWrap .resionWrap .el-checkbox {
  margin-left: 0px;
  margin-right: 20px;
}

.batchWrap .resionWrap .el-checkbox .el-checkbox__label {
  width: 66px;
  /* background: red; */
}
</style>

