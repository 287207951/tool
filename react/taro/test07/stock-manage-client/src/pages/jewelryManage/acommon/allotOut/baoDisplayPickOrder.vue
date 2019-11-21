<template>
  <div class="top20">
    <el-row
      class="tabOne"
      v-for="(ielem,indOne) in baoData"
      :key="indOne"
      @click.native="baoViewFun(ielem)"
      v-if="!proAllData.parentPack"
    >
      <el-col :span="3">
        包号
        <span class="txtBlack">{{ielem.packId}}</span>
      </el-col>
      <el-col :span="2">
        金料成色
        <span class="txtBlack">{{ielem.conditi}}</span>
      </el-col>
      <el-col :span="2">
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
      <el-col :span="3">
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
            >{{ielem.weightDifRemark.length < 7 ? ielem.weightDifRemark : ielem.weightDifRemark.substr(0,7)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="3">
        备注
        <span v-if="ielem.remark">
          <el-popover placement="top-start" width="200" trigger="hover" :content="ielem.remark">
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.remark.length < 7 ? ielem.remark : ielem.remark.substr(0,7)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="2" class="txtRed txtRight" v-if="ielem.packId != ''">
        <span class="txtBlack">操作:</span>
        <span @click.stop="printTabOneFun(ielem)">打印二维码</span>
      </el-col>
    </el-row>
    <!-- 查看包详情 -->
    <el-dialog title="包详情1" :visible.sync="baoViewTF" :close-on-click-modal="false" width="1280px">
      <el-row class="tabOne">
        <el-col :span="24">
          包号
          <span class="txtBlack right20">{{baoObj.packId}}</span>
          金料成色
          <span class="txtBlack right20">{{baoObj.conditi}}</span>
          类别
          <span class="txtBlack right20">{{baoObj.one}}</span>
          总数量
          <span class="txtBlack right20">{{baoObj.packTotalAmount}}</span>
          净重(g)
          <span class="txtBlack right20">{{baoObj.packTotalSuttle}}</span>
          毛重(g)
          <span class="txtBlack right20">{{baoObj.packNetTotalWeight}}</span>
          毛重差异(g)
          <span
            class="txtBlack right20"
          >{{baoObj.weightDif?baoObj.weightDif:'0.00'}}</span>
          过重备注
          <span v-if="baoObj.weightDifRemark" class="right20">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="baoObj.weightDifRemark"
            >
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{baoObj.weightDifRemark.length < 7 ? baoObj.weightDifRemark : baoObj.weightDifRemark.substr(0,7)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else class="right20">-</span>
          备注
          <span v-if="baoObj.remark" class="right20">
            <el-popover placement="top-start" width="200" trigger="hover" :content="baoObj.remark">
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{baoObj.remark.length < 7?baoObj.remark:baoObj.remark.substr(0, 7)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else class="right20">-</span>
        </el-col>
      </el-row>
      <div>
        <!-- 弹框SKU筛选 -->
        <DialogScreenBao
          @suitSearch="suitSearch"
          :searchData="searchData"
          :selectTF="false"
          :orderTxtTF="false"
          :orderTF="false"
        ></DialogScreenBao>
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
              <div style="display:flex;flex:6;line-height:34px">
                <div class="uLTwo" style="width:33%">
                  <div>
                    <span class="grayCol">拣货数量：</span>
                    <span>{{ielem.amount?ielem.amount:'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">拣货净重：</span>
                    <span>{{ielem.suttle?ielem.suttle+'g':'-'}}</span>
                  </div>
                  <div v-if="proAllData.bizInvoice.bizType == 'SEND_CLIENT'">
                    <span class="grayCol">{{ielem.proSpecData.feeType == '1'?'附加工费':'件工费'}}：</span>
                    <span>￥{{ielem.proSpecData.feeType == '1'?ielem.proSpecData.additionPrice:ielem.proSpecData.feePrice}}</span>
                  </div>

                  <div v-if="proAllData.bizInvoice.bizType == 'RECEIVE_FACTORY'">
                    <span class="grayCol">{{ielem.proSpecData.factFeeType == '1'?'附加工费':'件工费'}}：</span>
                    <span>￥{{ielem.proSpecData.feeType == '1'?ielem.proSpecData.price:ielem.proSpecData.piecePrice}}</span>
                  </div>
                </div>
                <div class="uLTwo" style="width:33%">
                  <div>
                    <span class="grayCol">复核数量：</span>
                    <span>
                      <el-input-number
                        v-model="ielem.newAmount"
                        :controls="false"
                        size="small"
                        class="width70"
                        @change="changeNum(ielem)"
                        v-if="editTF"
                      ></el-input-number>
                      <span v-else>{{ielem.newAmount}}</span>
                    </span>
                  </div>
                  <div>
                    <span class="grayCol">复核净重：</span>
                    <span>
                      <el-input-number
                        v-model="ielem.newSuttle"
                        :controls="false"
                        size="small"
                        class="width70"
                        v-if="editTF"
                      ></el-input-number>
                      <span v-else>{{ielem.newSuttle}}</span>g
                    </span>
                  </div>
                  <div>
                    <span class="grayCol">复核毛重：</span>
                    <span>
                      <el-input-number
                        v-model="ielem.newWeight"
                        :controls="false"
                        size="small"
                        class="width70"
                        v-if="editTF"
                      ></el-input-number>
                      <span v-else>{{ielem.newWeight}}</span>g
                    </span>
                  </div>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="baoViewTF = false" size="small">取 消</el-button>
        <!-- <el-button type="primary" @click="confirmFun" size="small">确 定</el-button> -->
      </span>
    </el-dialog>
    <div>
      <div class="productWrap" v-if="baoData.length === 0 ">
        <productItemPickTwo
          v-for="(item,index) in proList"
          :key="index"
          :productData="item"
          :editTF="editTF"
          @addPackFun="addPackFun"
          :bizInvoice="bizInvoice"
        ></productItemPickTwo>
      </div>
      <div class="productWrap" v-if="proAllData.parentPack">
        <productItemPickTwo
          v-for="(item,index) in proList"
          :key="index"
          :productData="item"
          :editTF="editTF"
          @addPackFun="addPackFun"
          :bizInvoice="bizInvoice"
        ></productItemPickTwo>
      </div>
    </div>
    <!-- 打印二维码 -->
    <div v-show="false">
      <!-- <printTPPick :billData="printData" ref="printTPPick"></printTPPick> -->
      <printTPPickTwo :billData="printData" ref="printTPPick"></printTPPickTwo>
    </div>

    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModelPic" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>

<script>
export default {
  props: {
    baoData: {
      required: true
    },
    proAllData: {
      required: true
    },
    editTF: {
      type: Boolean,
      required: false
    },
    bizInvoice: {
      required: false
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      arrowType: false,
      baoViewTF: false, //查看包详情
      baoData: {}, //包的详情数据
      proAllData: {}, //拣货单数据
      baoObj: [], //选择包的详情数据
      proList: [], //单里的产品详情数据
      searchData: {}, //搜索条件
      editTF: true, //复称毛重、数量、净重可编辑状态
      printData: {}
    };
  },
  created() {},
  mounted() {},
  watch: {
    baoData: function(newVal, oldVal) {
      this.baoData = newVal;
      // console.log('baoData',newVal)
    },
    proAllData: function(newVal, oldVal) {
      this.proAllData = newVal;
      let tempList = this.proAllData.bizPro.slice();
      tempList.forEach(ielem => {
        // ielem.newAmount = null
        // ielem.newWeight = null
        // ielem.newSuttle = null
      });
      this.proList = tempList;
    },
    editTF: function(newVal, oldVal) {
      this.editTF = newVal;
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
      this.baoList = elem.proList;
      console.log(elem);
      console.log("小包数据", this.baoList);
      this.baoViewTF = true;
    },

    printTabOneFun(elem) {
      let self = this;
      // console.log('aaa:',elem)
      this.printData = {
        bizId: this.proAllData.bizInvoice.bizNo,
        baoNo: elem.packId,
        customerName: elem.one,
        nowSkuWeight: elem.packNetTotalWeight,
        nowSkuGoldWeight: elem.packTotalSuttle,
        sum: elem.packTotalAmount,
        conditi:elem.conditi,
        recipient: this.proAllData.bizInvoice.recipient,
        remark: elem.remark
      };

      this.$refs.printTPPick.compPrintFun();
    },
    cancelModel() {
      this.$emit("callback", false);
    },
    //套装详情
    suitDes(val) {
      // this.arrowType = val;
      this.baoList.forEach(ielem => {
        if (ielem.proId === val.proId) {
          ielem = val;
          this.$forceUpdate();
        }
      });
    },
    addPackFun(val) {
      this.$emit("addPackFun", val);
    },
    //包详情搜索
    suitSearch(val) {
      this.searchData = val;
      // console.log(val)
      this.baoList.forEach((ielem, indOne) => {
        // console.log(ielem)
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
    clickFun() {},
    getStepPeople(list, b) {
      let result = [],
        arr = [];
      b === "all" ? (arr = list) : (arr = list.filter((v, i) => i < 2));
      arr.map(v => result.push(v.operateName));
      return result.join("、");
    },
    //数量检验只能输入整数
    changeNum(elem) {
      // console.log(elem.editAmount)
      elem.editAmount = parseInt(elem.editAmount);
      this.$forceUpdate();
    },
    //确定按钮
    confirmFun() {
      // console.log(this.baoList)
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModelPic(e) {
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
