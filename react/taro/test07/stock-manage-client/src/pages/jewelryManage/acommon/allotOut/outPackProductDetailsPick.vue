<template>
  <div class="top20">
    <!-- 查看包详情 -->
    <el-dialog title="包详情" :visible.sync="baoViewTF" :close-on-click-modal="false" width="1280px">
      <el-row class="tabOne">
        <el-col :span="3">
          包号
          <span class="txtBlack">{{packBarData.bizNo}}</span>
        </el-col>
        <el-col :span="3">
          金料成色
          <span class="txtBlack">{{packBarData.conditi}}</span>
        </el-col>
        <el-col :span="3">
          类别
          <span class="txtBlack">{{packBarData.one}}</span>
        </el-col>
        <el-col :span="2">
          总数量
          <span class="txtBlack">{{packBarData.packTotalAmount}}</span>
        </el-col>
        <el-col :span="2">
          净重
          <span class="txtBlack">{{packBarData.packTotalSuttle}}</span>
        </el-col>
        <el-col :span="2">
          毛重
          <span class="txtBlack">{{packBarData.packNetTotalWeight}}</span>
        </el-col>
        <el-col :span="3">
          毛重差异
          <span class="txtBlack">{{packBarData.weightDif}}</span>
        </el-col>
        <el-col :span="3">
          过重备注
          <span v-if="packBarData.weightDifRemark">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="packBarData.weightDifRemark"
            >
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{packBarData.weightDifRemark.length < 8 ? packBarData.weightDifRemark : packBarData.weightDifRemark.substr(0,8)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else>-</span>
        </el-col>
        <el-col :span="3">
          备注
          <span v-if="packBarData.remark">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="packBarData.remark"
            >
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{packBarData.remark.length < 10?packBarData.remark:packBarData.remark.substr(0, 10)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else>-</span>
        </el-col>
      </el-row>
      <div>
        <!-- 弹框SKU筛选 -->
        <!-- <DialogScreenBao @suitSearch="suitSearch" :orderTxtTF="false" :orderTF="false"></DialogScreenBao> -->
        <SkuScreen @suitSearch="searchFun" :proList="packBarData.packDetails"></SkuScreen>
        <div style="height: 10px"></div>
        <!-- 弹框SKU筛选 -->
        <div style="maxHeight: 500px; overflow: auto" v-if="proShow">
          <ProductItemPick
            v-for="(item,index) in packBarData.packDetails"
            :key="index"
            :productData="item"
            :componentBtnSet="false"
            @removeProductsFun="removeProductsFun"
          ></ProductItemPick>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baoViewTF = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogType: {
      required: true
    },
    packBarData: {
      required: true
    }
  },
  data() {
    return {
      arrowType: false,
      baoViewTF: false, //查看包详情
      baoList: [], //包详情数据
      searchData: {}, //搜索条件
      // proList: [],
      proShow: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    dialogType: function(newVal, oldVal) {
      this.baoViewTF = true;
      // this.proList = [...this.packBarData.packDetails];
      this.proShow = true;
      // this.baoViewFun();
    }
  },
  computed: {},
  methods: {
    //打开包查看包详情
    baoViewFun() {
      let searchData = this.searchData;
      let params = {
        bizNo: this.packBarData.bizNo,
        pack: this.packBarData.packId,
        search: searchData.search ? searchData.search : "",
        one: searchData.one ? searchData.one : "",
        goldCode: searchData.goldCode ? searchData.goldCode : "",
        conditi: searchData.conditi ? searchData.conditi : "",
        processCode:
          searchData.processCode && searchData.processCode != "全部"
            ? searchData.processCode
            : ""
      };
      this.$api.formdataPostFun(
        this.$portMain + "/proCommonController/findPackData",
        params,
        res => {
          this.baoList = res.data ? res.data : [];
          this.baoViewTF = true;
          this.$forceUpdate();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //套装详情
    suitDes(val) {
      this.arrowType = val;
    },
    //套装详情
    suitDes(val) {
      this.arrowType = val;
    },
    //筛选
    searchFun(elem) {
      this.proShow = false;
      this.$nextTick(() => {
        this.packBarData.packDetails = [...elem.backProList];
        this.proShow = true;
      });
    },
    //包详情
    suitSearch(val) {
      this.searchData = val;
      this.baoViewTF = true;
      // this.baoViewFun();
    },
    //关闭
    clickFun() {
      this.baoViewTF = false;
    },
    //移除产品
    removeProductsFun(val) {
      this.$emit("removeProductsFun", {
        packId: this.packBarData.packId,
        proNumber: val
      });
    }
  },
  filters: {
    getType(val) {
      switch (val) {
        case 1:
          return "专用发票";
        case 2:
          return "普通发票";
        default:
          return val || "-";
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tabOne {
  background: #e4eaf0;
  padding: 10px 15px;
  color: #969aa5;
  font-size: 14px;
  margin: 10px 0;
}

.productUL {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;
  border: 1px solid #E5F1FF;
  padding: 14px 24px;
  margin-bottom: 8px;

  &.on {
    border: 1px solid #8A9199;
  }

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  .product {
    display: flex;
    position: relative;

    .closePic {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }

    .uLOne {
      display: flex;

      img {
        width: 120px;
        height: 90px;
      }

      .liDes {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .uLTwo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .uLThree {
      width: 260px;
      display: flex;
      line-height: 36px;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }

  .tzWtap {
    border-top: 1px solid #E5F1FF;
    margin-top: 13px;
    padding: 14px 0;

    .itemWrap {
      width: 49%;
      display: inline-flex;
      margin-bottom: 20px;
    }

    .uLOne {
      display: flex;

      img {
        width: 120px;
        height: 90px;
      }

      .liDes {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .uLTwo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;

    strong {
      color: #df343d;
      font-weight: bold;
    }

    .dialog {
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 100%;
      width: 250px;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;

      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #37393b;
      }

      p {
        padding-top: 10px;
        line-height: 1.4;
        font-size: 12px;
        color: #3c3c3c;
      }
    }

    &:hover .dialog {
      visibility: visible;
    }
  }

  .addPack {
    position: absolute;
    right: 24px;
    top: 51px;
    cursor: pointer;
    color: red;
  }
}
</style>
