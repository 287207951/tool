<template>
  <div>
    <div class="packageWrap" v-for="(item,index) in parentPack" :key="index">
      <!-- 大包 -->
      <div class="packageTitle">
        <div>
          <span class="greyColor">店铺名称：</span>
          <span class="blackColor">{{item.shopName}}</span>
        </div>
        <div>
          <span class="greyColor">总数量：</span>
          <span class="blackColor">{{item.packTotalAmount}}</span>
        </div>
        <div>
          <span class="greyColor">总净重：</span>
          <span class="blackColor">{{item.packTotalSuttle}}g</span>
        </div>
        <div>
          <span class="greyColor">总毛重：</span>
          <span class="blackColor">{{item.packNetTotalWeight}}g</span>
        </div>
        <div>
          <span class="redColor" @click="showDetail(item)">
            展开详情
            <i :class="item.openTF?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </span>
        </div>
      </div>

      <!-- 小包 -->
      <div class="smallPackage" v-show="item.openTF">
        <PackingBar
          v-if="item.childPack.length > 0"
          :baoData="item.childPack"
          @goPackDetail="goPackDetail"
        ></PackingBar>
        <ProductItemTwo
          v-else
          v-for="(it,itNum) in item.packDetails"
          :key="itNum"
          :productData="it"
          :companyName="companyName"
        ></ProductItemTwo>
      </div>
    </div>
    <!-- 包详情数据 -->
    <PackProductDetails
      :dialogType="dialogType"
      :packBarData="selecPackBarData"
      :companyName="companyName"
    ></PackProductDetails>
  </div>
</template>

<script>
export default {
  props: {
    parentPack: {
      type: Array,
      required: true
    },
    companyName: {
      type: Object,
      required: false,
      default: () => {
        return {
          bizType: ""
        };
      }
    }
  },
  data() {
    return {
      detailsType: false, //详情状态
      selecPackBarData: {}, //选中包数据
      dialogType: ""
    };
  },
  created() {},
  mounted() {},
  watch: {
    parentPack: function(newVal, oldVal) {
      // console.log("监听包中包", newVal);
    }
  },
  computed: {},
  methods: {
    //查看详情
    showDetail(ielem) {
      ielem.openTF = ielem.openTF ? !ielem.openTF : true;
      this.$forceUpdate();
    },
    //查看包详情
    goPackDetail(elem) {
      this.dialogType = new Date().getTime();
      this.selecPackBarData = elem;
      // console.log("详情", elem);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.packageWrap {
  border-top: 1px solid #E4E7F0;
  border-bottom: 1px solid #E4E7F0;

  .greyColor {
    color: #8A9199;
    font-weight: bold;
  }

  .blackColor {
    color: #232426;
    font-weight: bold;
  }

  .redColor {
    color: #F20F34;
    font-weight: bold;
    cursor: pointer;
  }

  // 大包
  .packageTitle {
    height: 50px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // 小包
  .smallPackage {
    padding: 14px 0;
  }
}
</style>
