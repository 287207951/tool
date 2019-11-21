<template>
  <div class="top20">
    <el-row
      class="tabOne"
      v-for="(ielem,indOne) in baoData"
      :key="indOne"
      @click.native="baoViewFun(ielem)"
    >
      <el-col :span="3">
        包号
        <span class="txtBlack">{{ielem.packId}}</span>
      </el-col>
      <el-col :span="3">
        金料成色
        <span class="txtBlack">{{ielem.conditi}}</span>
      </el-col>
      <el-col :span="3">
        类别
        <span class="txtBlack">{{ielem.one}}</span>
      </el-col>
      <el-col :span="2">
        总数量
        <span class="txtBlack">{{ielem.packTotalAmount}}</span>
      </el-col>
      <el-col :span="2">
        净重(g)
        <span class="txtBlack">{{ielem.packTotalSuttle}}</span>
      </el-col>
      <el-col :span="2">
        毛重(g)
        <span class="txtBlack">{{ielem.packNetTotalWeight}}</span>
      </el-col>
      <el-col :span="2">
        毛重差异(g)
        <span class="txtBlack">{{ielem.weightDif?ielem.weightDif:'0.00'}}</span>
      </el-col>
      <el-col :span="2" class="text-truncation">
        过重备注
        <!-- <span class="txtBlack">{{ielem.weightDifRemark}}</span> -->
        <span v-if="ielem.weightDifRemark">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="ielem.weightDifRemark"
          >
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.weightDifRemark.length < 10 ? ielem.weightDifRemark : ielem.weightDifRemark.substr(0,10)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="3" class="text-truncation">
        备注
        <span v-if="ielem.remark">
          <el-popover placement="top-start" width="200" trigger="hover" :content="ielem.remark">
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.remark.length < 10 ? ielem.remark : ielem.remark.substr(0,10)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="2" class="txtRed txtRight">查看详情</el-col>
    </el-row>
    <!-- 查看包详情 -->
    <el-dialog
      title="包详情"
      :visible.sync="baoViewTF"
      :close-on-click-modal="false"
      width="1280px"
      @close="clickFun"
    >
      <el-row class="tabOne">
        <el-col :span="24">
          包号
          <span class="txtBlack right30">{{baoObj.packId}}</span>
          金料成色
          <span class="txtBlack right30">{{baoObj.conditi}}</span>
          类别
          <span class="txtBlack right30">{{baoObj.one}}</span>
          总数量
          <span class="txtBlack right30">{{baoObj.packTotalAmount}}</span>
          净重(g)
          <span class="txtBlack right30">{{baoObj.packTotalSuttle}}</span>
          毛重(g)
          <span class="txtBlack right30">{{baoObj.packNetTotalWeight}}</span>
          毛重差异(g)
          <span
            class="txtBlack right30"
          >{{baoObj.weightDif?baoObj.weightDif:'0.00'}}</span>
          过重备注
          <span v-if="baoObj.weightDifRemark" class="right30">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="baoObj.weightDifRemark"
            >
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{baoObj.weightDifRemark.length < 8 ? baoObj.weightDifRemark : baoObj.weightDifRemark.substr(0,8)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else class="right30">-</span>
          备注
          <span v-if="baoObj.remark" class="right30">
            <el-popover placement="top-start" width="200" trigger="hover" :content="baoObj.remark">
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{baoObj.remark.length < 10?baoObj.remark:baoObj.remark.substr(0, 10)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else class="right30">-</span>
        </el-col>
      </el-row>
      <div>
        <!-- 弹框SKU筛选 -->
        <!-- <DialogScreenBao @suitSearch="suitSearch" :searchData="searchData" :selectTF="false" :orderTxtTF="false"></DialogScreenBao> -->
        <SkuScreen @suitSearch="searchFun" :proList="baoList" ref="skuScreen"></SkuScreen>
        <div style="height: 10px"></div>
        <!-- 弹框SKU筛选 -->
        <div :style="{'maxHeight':'500px','overflow':'auto'}">
          <div
            class="productUL"
            :class="ielem.showStatus ? 'on' : ''"
            v-for="(ielem,indOne) in baoList"
            :key="indOne"
          >
            <!-- 单装 -->
            <div class="product">
              <TzAttrBao @suitDes="suitDes" :baoData="ielem" @showPic="showPic"></TzAttrBao>

              <div style="display:flex;flex:6">
                <div class="uLTwo" style="width:48%">
                  <div>
                    <span class="grayCol">调拨数量：</span>
                    <span>{{ielem.amount?ielem.amount:'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">调拨净重：</span>
                    <span>{{ielem.suttle?ielem.suttle+'g':'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">调拨毛重：</span>
                    <span>{{ielem.weight?ielem.weight+'g':'-'}}</span>
                  </div>
                </div>
                <div class="uLThree">
                  <div v-if="ielem.remarkReason">
                    <span class="grayCol">调拨原因：</span>
                    <span>
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        :content="ielem.remarkReason"
                      >
                        <span
                          class="txtBlack overflowHidden"
                          slot="reference"
                        >{{ielem.remarkReason.length < 8?ielem.remarkReason:ielem.remarkReason.substr(0, 8)+'...'}}</span>
                      </el-popover>
                    </span>
                  </div>
                  <div v-if="ielem.remark">
                    <span class="grayCol">调拨备注：</span>
                    <span>
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        :content="ielem.remark"
                      >
                        <span
                          class="txtBlack overflowHidden"
                          slot="reference"
                        >{{ielem.remark.length < 10?ielem.remark:ielem.remark.substr(0, 10)+'...'}}</span>
                      </el-popover>
                    </span>
                  </div>
                  <div>&nbsp;</div>
                </div>
              </div>
            </div>
            <!-- 套装 -->
            <div class="tzWtap" v-show="ielem.TZShow">
              <TzAttrDetailsBao :auitData="ielem" @showPic="showPic"></TzAttrDetailsBao>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div>
      <div class="productWrap" v-if="baoData.length === 0">
        <productItemFour
          v-for="(item,index) in proList"
          :key="index"
          :productData="item"
          @showPic="showPic"
        ></productItemFour>
      </div>
    </div>

    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>

<script>
export default {
  props: {
    baoData: {
      required: true
    },
    proAllData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      baoList: [],
      arrowType: false,
      baoViewTF: false, //查看包详情
      // baoData: {}, //包的详情数据
      // proAllData: {}, //调拨单数据
      baoObj: [], //选择包的详情数据
      proList: [], //单里的产品详情数据
      searchData: {} //搜索条件
    };
  },
  created() {},
  mounted() {},
  watch: {
    baoData: function(newVal, oldVal) {
      this.baoData = newVal;
    },
    proAllData: function(newVal, oldVal) {
      this.proAllData = newVal;
      // console.log('newVal111:',newVal)
      this.proList = this.proAllData.bizPro;
    }
  },
  computed: {},
  methods: {
    //打开包查看包详情
    baoViewFun(elem) {
      this.baoObj = elem;
      elem.proList = [];
      this.proAllData.bizPackDetails.forEach(ielem => {
        if (ielem.packId === elem.packId) {
          elem.proList.push(ielem);
        }
      });
      this.proAllData.bizPro.forEach(jelem => {
        elem.proList.forEach(kelem => {
          if (kelem.skuNumber === jelem.skuId) {
            Object.assign(kelem, jelem);
          }
        });
      });
      this.baoList = elem.packDetails ? elem.packDetails : elem.proList;
      // console.log(this.searchData.search)
      // console.log(this.baoList)
      this.baoViewTF = true;
    },
    cancelModel() {
      this.$emit("callback", false);
    },
    //套装详情
    suitDes(val) {
      this.baoList.forEach(ielem => {
        if (ielem.proId === val.proId) {
          ielem = val;
          this.$forceUpdate();
        }
      });
    },
    //包详情搜索
    suitSearch(val) {
      this.searchData = val;

      this.baoList.forEach((ielem, indOne) => {
        // console.log(ielem.proSpecData)
        let modifTF = false;
        //单品或套装第一层搜索
        if (
          ielem.proName.indexOf(val.search) != -1 ||
          ielem.proSpecData.conditi.indexOf(val.search) != -1 ||
          ielem.skuNumber.indexOf(val.search) != -1 ||
          JSON.stringify(ielem.weight).indexOf(val.search) != -1 ||
          jelem.weight.indexOf(val.search) != -1
        ) {
          modifTF = true;
        }
        //套装里搜索
        if (ielem.proSpecData.ProList && ielem.proSpecData.ProList.length > 0) {
          ielem.proSpecData.ProList.forEach(jelem => {
            if (
              jelem.name.indexOf(val.search) != -1 ||
              jelem.condit.indexOf(val.search) != -1 ||
              jelem.factoryNumber.indexOf(val.search) != -1 ||
              (JSON.stringify(jelem.weight).indexOf(val.search) != -1) |
                (jelem.oneName.indexOf(val.search) != -1)
            ) {
              modifTF = true;
            }
          });
        }
        if (modifTF) {
          let tempObj = ielem;
          this.baoList.splice(indOne, 1);
          this.baoList.unshift(tempObj);
        }
      });
      this.$forceUpdate();

      // this.baoViewFun(this.baoObj)
    },
    //关闭
    clickFun() {
      this.$refs.skuScreen.emptyInput();
    },
    //筛选
    searchFun(elem) {
      this.baoList = elem.backProList;
      this.$forceUpdate();
    },
    getStepPeople(list, b) {
      let result = [],
        arr = [];
      b === "all" ? (arr = list) : (arr = list.filter((v, i) => i < 2));
      arr.map(v => result.push(v.operateName));
      return result.join("、");
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
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

.text-truncation {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
