<template>
  <div>
    <packge-row
      v-for="packgeData in bizPackData"
      :packgeData="packgeData"
      :columns="columns"
      :key="packgeData[idKey]"
      @click.native="clickRow(packgeData)"
    ></packge-row>
    <el-dialog
      title="包详情"
      :close-on-click-modal="false"
      width="1300px"
      @close="closeFu"
      :visible.sync="dialogObj.display"
    >
      <packge-row :packgeData="packgeRowData" :columns="columns"></packge-row>
      <div>
        <!-- 弹框SKU筛选 -->
        <!-- <DialogScreenBao @suitSearch="suitSearch" :searchData="searchData" :selectTF="false" :orderTxtTF="false"></DialogScreenBao> -->
        <SkuScreen @suitSearch="searchFun" :proList="dialogObj.baoList" ref="skuScreen"></SkuScreen>
        <div style="height: 10px"></div>

        <!-- 弹框SKU筛选 -->
        <div :style="{'maxHeight':'500px','overflow':'auto'}">
          <div
            class="productUL"
            :class="ielem.showStatus ? 'on' : ''"
            v-for="(ielem,indOne) in dialogObj.baoList"
            :key="indOne"
          >
            <!-- 单装 -->
            <div class="product">
              <TzAttrBao @suitDes="suitDes" :baoData="ielem" @showPic="showPic"></TzAttrBao>

              <div style="display:flex;flex:6">
                <div class="uLTwo" style="width:48%">
                  <div>
                    <span class="grayCol">{{typeText}}数量：</span>
                    <span>{{ielem.amount?ielem.amount:'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">{{typeText}}净重：</span>
                    <span>{{ielem.suttle?ielem.suttle+'g':'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">{{typeText}}毛重：</span>
                    <span>{{ielem.weight?ielem.weight+'g':'-'}}</span>
                  </div>
                </div>
                <div class="uLThree">
                  <div v-if="ielem.remarkReason">
                    <span class="grayCol">{{typeText}}原因：</span>
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
                    <span class="grayCol">{{typeText}}备注：</span>
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
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>

<script>
import packgeRow from "./packge-row";
export default {
  props: {
    columns: {
      required: true,
      type: Array,
      default() {
        return [];
      }
    },
    idKey: {
      required: true,
      type: String
    },
    allData: {
      required: true,
      type: Object,
      default() {
        return {};
      }
    },
    typeText: {
      type: String,
      default: "调拨"
    }
  },
  computed: {
    bizPackData() {
      if (this.allData && this.allData.bizPack) {
        return this.allData.bizPack.filter(n => n.conditi);
      } else {
        return [];
      }
    }
  },
  components: {
    "packge-row": packgeRow
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      proList: [],
      packgeRowData: {},
      dialogObj: {
        display: false,
        proList: [],
        baoList: [],
        arrowType: false
      },
      packDetails: [],
      packSkuNumbers: []
    };
  },
  methods: {
    suitDes(val) {
      // this.dialogObj.arrowType = val.TZShow;
      this.$forceUpdate();
    },
    searchFun(elem) {
      this.$set(this.dialogObj, "baoList", elem.backProList);
      // this.$forceUpdate();
    },
    closeFu() {
      this.$refs.skuScreen.emptyInput();
    },
    getPackDetails(data) {
      this.dialogObj.baoList = [];
      if (this.allData.bizPro.length === 0) {
        this.dialogObj.baoList = this.dialogObj.proList;
      }
      const curProDetail = this.allData.bizPackDetails.filter(
        n => n.packId === data.packId
      );
      curProDetail.forEach((v, i) => {
        this.allData.bizPro.forEach((n, j) => {
          if (v.skuNumber === n.skuId) {
            this.$set(this.dialogObj.baoList, i, Object.assign(n, v));
          }
        });
      });
    },
    clickRow(data) {
      this.$set(this, "packgeRowData", data);
      this.dialogObj.proList = JSON.parse(
        JSON.stringify(this.allData.bizPackDetails)
      ).filter(n => data.packId === n.packId);
      this.allData.bizPro.forEach(jelem => {
        this.dialogObj.proList.forEach(kelem => {
          if (kelem.skuNumber === jelem.skuId) {
            Object.assign(kelem, jelem);
          }
        });
      });
      this.getPackDetails(data);

      this.dialogObj.display = true;
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
</style>
