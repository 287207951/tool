<template>
  <div class="barWrapComp">
    <div
      class="liWrap"
      v-for="(ielem,index) in bizPack"
      :key="index"
      @click="goPackageDetail($event,ielem,index)"
    >
      <div class="liItem" style="width:35%">
        <el-checkbox
          v-model="ielem.checked"
          v-show="checkboxType"
          @change="selectFun"
          :disabled="ielem.statusValue != '待出库'"
        ></el-checkbox>
        <span>{{index+1 > 9?index+1 : `0${index+1}`}}</span>
        <span class="marginR2">包号</span>
        <span class="blackColor">{{ielem.packId}}</span>
      </div>

      <div class="liItem">
        <span class="marginR2">金料成色</span>
        <span class="blackColor">{{ielem.conditi}}</span>
      </div>

      <div class="liItem">
        <span class="marginR2">类别</span>
        <span class="blackColor">{{ielem.one}}</span>
      </div>

      <div class="liItem" style="width: 16%;">
        <span class="marginR2">总数量</span>
        <span class="blackColor">{{ielem.packTotalAmount}}</span>
      </div>

      <div class="liItem">
        <span class="marginR2">净重</span>
        <span class="blackColor">{{ielem.packTotalSuttle}}g</span>
      </div>

      <div class="liItem">
        <span class="marginR2">毛重</span>
        <span class="blackColor">{{ielem.packNetTotalWeight}}g</span>
      </div>

      <div class="liItem">
        <span class="marginR2">毛重差异</span>
        <span class="blackColor">{{ielem.weightDif?ielem.weightDif:0}}g</span>
      </div>

      <div class="liItem">
        <span class="marginR2">过重备注</span>
        <span class="blackColor" v-if="ielem.weightDifRemark">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="ielem.weightDifRemark"
          >
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.weightDifRemark.length < 4 ? ielem.weightDifRemark : ielem.weightDifRemark.substr(0,4)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </div>

      <div class="liItem">
        <span class="marginR2">备注</span>
        <span class="blackColor" v-if="ielem.remark">
          <el-popover placement="top-start" width="200" trigger="hover" :content="ielem.remark">
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.remark.length < 4 ? ielem.remark : ielem.remark.substr(0,4)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </div>

      <div class="liItem" style="width:25%" v-show="statusShow">
        <span class="marginR2">状态</span>
        <!-- <span class="blackColor">{{ielem.statusValue}}</span> -->
        <span class="blackColor" v-html="orderStatus(ielem.statusValue)"></span>
        <span
          class="redColor"
          style="cursor: pointer;"
          v-if="ielem.statusValue === '已暂存'"
          @click.stop="cancelStorageFun(ielem.packId)"
        >取消暂存</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bizPack: {
      required: true
    },
    checkboxType: {
      required: false,
      type: Boolean,
      default: true
    },
    statusShow: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mock: ""
    };
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    selectFun() {
      this.$forceUpdate();
      this.$emit("selectPackageFun");
    },
    //全选事件渲染
    allSelectFun(e) {
      this.$forceUpdate();
    },
    //取消暂存
    cancelStorageFun(packId) {
      this.$emit("cancelStorageFun", packId);
    },
    //查看包详情
    goPackageDetail(e, elem, index) {
      if (
        e.target.className == "el-checkbox__inner" ||
        e.target.className == "el-checkbox__original"
      ) {
        return;
      }

      this.$emit("goPackDetail", elem, index);
    },
    orderStatus(val) {
      switch (val) {
        case "待出库":
          return `<span class="yellowColor">待出库</span>`;
        case "已暂存":
          return `<span class="redColor">已暂存</span>`;
        case "已返柜":
          return `<span class="grayColor">已返柜</span>`;
        case "已出库":
          return `<span class="blackColor">已出库</span>`;
        default:
          return "-";
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.yellowColor {
  color: #F26D0F;
}

.grayColor {
  color: #889199;
}

.redColor {
  color: red;
}

.blackColor {
  color: #232426;
}

.marginR2 {
  margin-right: 2px;
}

.barWrapComp {
  .liWrap {
    color: #8A8E99;
    font-size: 14px;
    font-weight: 400;
    background: #E4EAF0;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    margin-bottom: 4px;

    .liItem {
      width: 20%;
    }
  }
}
</style>

<style>
.barWrapComp .liItem .el-checkbox {
  margin-right: 0px;
}
</style>

