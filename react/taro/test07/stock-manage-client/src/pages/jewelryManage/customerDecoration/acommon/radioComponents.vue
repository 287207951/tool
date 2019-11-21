<template>
  <div class="radioWrap">
    <div class="liWrap" v-show="wayShow">
      <span class="radioName">打单方式</span>
      <el-radio-group v-model="selectWay" @change="wayFun">
        <el-radio :label="1">分门店打单</el-radio>
        <el-radio :label="2">合并打单</el-radio>
        <el-radio :label="3">组合打单</el-radio>
      </el-radio-group>
    </div>
    <div class="liWrap" v-show="shopShow">
      <span class="radioName">{{selectWay == 1?'门店选择':'打单组合'}}</span>
      <el-radio-group v-model="selectShop" @change="shopFun">
        <el-radio
          v-for="item in shopData"
          :label="item.packId"
          :key="item.packId"
          :class="item.status?'dot':''"
        >{{item.shopName}}</el-radio>
      </el-radio-group>
    </div>
    <div class="liWrap">
      <span class="radioName">金料成色</span>
      <el-radio-group v-model="selectCondition" @change="conditionFun">
        <el-radio
          v-for="(item,index) in conditionData"
          :label="item.conditi"
          :key="index"
          :class="item.status?'dot':''"
        >{{item.conditi}}</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shopData: {
      //门店数据
      type: Array,
      required: false
    },
    conditionData: {
      //成色数据
      type: Array,
      required: false
    },
    shopShow: {
      //门店显示状态
      type: Boolean,
      required: false,
      default: true
    },
    wayShow: {
      //方式状态
      type: Boolean,
      required: false,
      default: true
    },
    timeStamp: {
      //外部控制打单方式
      required: false
    }
  },
  data() {
    return {
      selectWay: 1, //打单方式
      selectShop: "", //门店选择
      selectCondition: "" //金料成色
    };
  },
  created() {},
  mounted() {},
  watch: {
    shopData(newVal, oldVal) {
      this.selectShop = newVal[0].packId;
    },
    conditionData(newVal, oldVal) {
      this.selectCondition = newVal[0].conditi;
    },
    timeStamp(newVal, oldVal) {
      this.selectWay = 1;
      this.wayFun();
    }
  },
  computed: {},
  methods: {
    //方式
    wayFun() {
      this.$emit("wayFun", this.selectWay);
      // this.selectShop = this.shopData[0].packId;
    },
    //店铺
    shopFun() {
      this.$emit("shopFun", this.selectShop);
    },
    //成色
    conditionFun() {
      this.$emit("conditionFun", this.selectCondition);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.radioWrap {
  .radioName {
    font-size: 14px;
    color: #8A9199;
    margin-right: 40px;
    font-weight: bold;
  }

  .liWrap {
    margin-bottom: 29px;

    .dot {
      position: relative;

      &:after {
        content: '';
        width: 6px;
        height: 6px;
        background: red;
        border-radius: 50%;
        position: absolute;
        top: -7px;
        right: -6px;
      }
    }
  }
}
</style>
