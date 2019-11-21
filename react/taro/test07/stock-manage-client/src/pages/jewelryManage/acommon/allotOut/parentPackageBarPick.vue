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
          <!-- <span class="redColor" @click.stop="printTabOneFun(item)">打印二维码</span> -->
          <span class="redColor" @click="showDetail(item)">
            展开详情
            <i :class="item.openTF?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </span>
        </div>
      </div>

      <!-- 小包 -->
      <div class="smallPackage" v-show="item.openTF">
        <PackingBarPick
          :baoData="item.childPack"
          @goPackDetail="goPackDetail"
          v-if="item.childPack.length>0"
          :bizInvoice="bizInvoice"
        ></PackingBarPick>
        <span v-if="item.childPack.length===0">
          <ProductItemPickTwo
            v-for="(ielem,indOne) in item.packDetails"
            :productData="ielem"
            :key="indOne"
            :bizInvoice="bizInvoice"
          ></ProductItemPickTwo>
        </span>
      </div>
    </div>
    <!-- 打印二维码 -->
    <div v-show="false">
      <!-- <printTPPick :billData="printData" ref="printTPPick"></printTPPick> -->
      <printTPPickTwo :billData="printData" ref="printTPPick"></printTPPickTwo>
    </div>
    <!-- 包详情数据 -->
    <PackProductDetailsPick
      :dialogType="dialogType"
      :packBarData="selecPackBarData"
      :bizInvoice="bizInvoice"
    ></PackProductDetailsPick>
  </div>
</template>

<script>
export default {
  props: {
    parentPack: {
      type: Array,
      required: true
    },
    bizInvoice: {
      required: false
    }
  },
  data() {
    return {
      detailsType: false, //详情状态
      selecPackBarData: {}, //选中包数据
      dialogType: "",
      printData: {}
    };
  },
  created() {},
  mounted() {},
  watch: {
    parentPack: function(newVal, oldVal) {
      // console.log('aaa')
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
      // console.log("包数据", elem);
      // console.log("包数据111", this.bizInvoice);
    },
    printTabOneFun(elem) {
      let self = this;
      this.printData = {
        bizId: elem.bizNo,
        baoNo: elem.packId,
        customerName: elem.childPack.length > 0 ? elem.childPack[0].one : "",
        nowSkuWeight: elem.packNetTotalWeight,
        nowSkuGoldWeight: elem.packTotalSuttle,
        sum: elem.packTotalAmount,
        recipient: this.bizInvoice.recipient,
        remark: ""
      };
      this.$refs.printTPPick.compPrintFun();
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
