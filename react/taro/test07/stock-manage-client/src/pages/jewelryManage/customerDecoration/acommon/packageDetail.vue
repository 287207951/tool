<template>
  <div class="packgeWrapComp" ref="packgeWrapComp">
    <el-dialog
      title="包详情"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div class="dialogContent">
        <div class="packageBarWrap">
          <div class="barWrap">
            <div class="liWrap">
              <div class="liItem" style="width:32%">
                <span
                  style="margin: 0 8px;"
                >{{packageIndex+1 > 9?packageIndex+1 : `0${packageIndex+1}`}}</span>
                <span class="marginR2">包号</span>
                <span class="blackColor">{{packageDetailsData.packId}}</span>
              </div>

              <div class="liItem">
                <span class="marginR2">金料成色</span>
                <span class="blackColor">{{packageDetailsData.conditi}}</span>
              </div>

              <div class="liItem">
                <span class="marginR2">类别</span>
                <span class="blackColor">{{packageDetailsData.one}}</span>
              </div>

              <div class="liItem" style="width: 16%;">
                <span class="marginR2">总数量</span>
                <span class="blackColor">{{packageDetailsData.packTotalAmount}}</span>
              </div>

              <div class="liItem">
                <span class="marginR2">净重</span>
                <span class="blackColor">{{packageDetailsData.packTotalSuttle}}g</span>
              </div>

              <div class="liItem">
                <span class="marginR2">毛重</span>
                <span class="blackColor">{{packageDetailsData.packNetTotalWeight}}g</span>
              </div>

              <div class="liItem">
                <span class="marginR2">毛重差异</span>
                <span class="blackColor">{{packageDetailsData.weightDif}}g</span>
              </div>

              <div class="liItem">
                <span class="marginR2">过重备注</span>
                <span class="blackColor" v-if="packageDetailsData.weightDifRemark">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="packageDetailsData.weightDifRemark"
                  >
                    <span
                      class="txtBlack overflowHidden"
                      slot="reference"
                    >{{packageDetailsData.weightDifRemark.length < 4 ? packageDetailsData.weightDifRemark : packageDetailsData.weightDifRemark.substr(0,4)+'...'}}</span>
                  </el-popover>
                </span>
                <span v-else>-</span>
              </div>

              <div class="liItem">
                <span class="marginR2">备注</span>
                <span class="blackColor" v-if="packageDetailsData.remark">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="packageDetailsData.remark"
                  >
                    <span
                      class="txtBlack overflowHidden"
                      slot="reference"
                    >{{packageDetailsData.remark.length < 4 ? packageDetailsData.remark : packageDetailsData.remark.substr(0,4)+'...'}}</span>
                  </el-popover>
                </span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>

        <div class="screenWrap">
          <SkuScreen :proList="packageDetailsData.packDetails" @suitSearch="searchFun"></SkuScreen>
        </div>

        <div style="height: 10px"></div>

        <div class="productItemWrap" :style="{'maxHeight':'500px','overflow':'auto'}">
          <ProductItem
            v-for="(item,index) in packageDetailsData.packDetails"
            :key="index"
            :productData="item"
          ></ProductItem>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <!-- <el-button type="primary" size="small" @click="dialogVisible = false">提交并打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { ProductItem } from "./index";

import ProductItem from "./productItem";
export default {
  components: {
    ProductItem
  },
  props: {
    packageDetailsData: {
      type: Object,
      required: true
    },
    packageIndex: {
      required: true
    },
    dialogType: {
      required: true
    }
  },
  data() {
    return {
      mockJson: {},
      mock: "",
      mockData: [{ name: 1 }, { name: 1 }, { name: 1 }],
      dialogVisible: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    dialogType: function(newVal, oldVal) {
      this.dialogVisible = true;
      this.packageDetailsData.packDetails.forEach(item => {
        if (item.proSpecData.ProList.length > 0) {
          item.proSpecData.ProList.forEach(item => {
            this.$api.reformSuitAtt(item);
          });
        }
      });
    }
  },
  computed: {},
  methods: {
    closeFun() {},
    searchFun(elem) {
      this.packageDetailsData.packDetails = elem.backProList;
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.grayColor {
  color: #8A8E99;
}

.redColor {
  color: red;
}

.yellowColor {
  color: #F2930F;
}

.packgeWrapComp {
  font-size: 14px;
  font-weight: 400;
  color: #222426;

  .dialogContent {
    position: relative;

    .packageBarWrap {
      margin-top: -16px;

      .barWrap {
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
    }

    .screenWrap {
      margin-top: 16px;
    }
  }
}
</style>


