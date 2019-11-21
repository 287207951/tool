<template>
  <div class="top20" ref="productItemFour">
    <el-checkbox v-model="checked" v-show="false"></el-checkbox>
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
      <el-col :span="2">
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
        <span class="txtBlack">{{ielem.weightDif?ielem.weightDif:'0'}}</span>
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
            >{{ielem.weightDifRemark.length < 10 ? ielem.weightDifRemark : ielem.weightDifRemark.substr(0,10)+'...'}}</span>
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
            >{{ielem.remark.length < 10 ? ielem.remark : ielem.remark.substr(0,10)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="2" class="txtRed txtRight">查看详情</el-col>
    </el-row>
    <!-- 查看包详情 -->
    <el-dialog title="包详情" :visible.sync="baoViewTF" :close-on-click-modal="false" width="1280px">
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
          <span class="txtBlack right30">{{baoObj.weightDif?baoObj.weightDif:'0'}}</span>
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
        <DialogScreenBao
          @suitSearch="suitSearch"
          :searchData="searchData"
          :orderTF="false"
          :orderTxtTF="false"
        >
          <slot>
            <el-button type="primary" size="small" @click="confirmFun">确定</el-button>
          </slot>
        </DialogScreenBao>
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
              <TzAttrBao @suitDes="suitDes" :baoData="ielem"></TzAttrBao>
              <div style="display:flex;flex:6;line-height:34px">
                <div class="uLTwo" style="width:33%">
                  <div>
                    <span class="grayCol">{{typeTxt}}数量：</span>
                    <span>{{ielem.amount?ielem.amount:'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">{{typeTxt}}净重：</span>
                    <span>{{ielem.suttle?ielem.suttle+'g':'-'}}</span>
                  </div>
                  <div>
                    <span class="grayCol">{{typeTxt}}毛重：</span>
                    <span>{{ielem.weight?ielem.weight+'g':'-'}}</span>
                  </div>
                </div>
                <div class="uLTwo" style="width:33%">
                  <div>
                    <span class="grayCol">复称数量：</span>
                    <span>
                      <!-- {{ielem}} -->
                      <el-input-number
                        v-model="ielem.newAmount"
                        :max="ielem.amount"
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
                    <span class="grayCol">复称净重：</span>
                    <span>
                      <el-input-number
                        v-model="ielem.newSuttle"
                        :controls="false"
                        size="small"
                        class="width70"
                        v-if="editTF"
                        @focus="focusWeightFocus(ielem,indOne,'复称净重')"
                        @blur="focusWeightBlur(ielem,'newSuttle')"
                      ></el-input-number>
                      <span v-else>{{ielem.newSuttle}}</span>g
                    </span>
                  </div>
                  <div>
                    <span class="grayCol">复称毛重：</span>
                    <span>
                      <el-input-number
                        v-model="ielem.newWeight"
                        :controls="false"
                        size="small"
                        class="width70"
                        v-if="editTF"
                        @focus="focusWeightFocus(ielem,indOne,'复称毛重')"
                        @blur="focusWeightBlur(ielem,'newWeight')"
                      ></el-input-number>
                      <span v-else>{{ielem.newWeight}}</span>g
                    </span>
                  </div>
                </div>
                <!-- <div class="uLThree">
                  <div v-if="ielem.remarkReason">
                    <span class="grayCol">入库原因：</span>
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
                        >{{ielem.remarkReason.length < 10?ielem.remarkReason:ielem.remarkReason.substr(0, 10)+'...'}}</span>
                      </el-popover>
                    </span>
                  </div>
                  <div v-if="ielem.remark">
                    <span class="grayCol">入库备注：</span>
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
                </div>-->
              </div>
            </div>
            <!-- 套装 -->
            <div class="tzWtap" v-show="ielem.TZShow">
              <TzAttrDetailsBao :auitData="ielem"></TzAttrDetailsBao>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div>
      <div class="productWrap" v-if="baoData.length === 0">
        <productItemThree
          v-for="(item,index) in proList"
          :key="index"
          :indOne="index"
          :proList="proList"
          :productData="item"
          :editTF="editTF"
          :invoiceType="invoiceType"
        ></productItemThree>
      </div>
      <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    baoData: {
      required: true
    },
    editTF: {
      editTF: Boolean,
      required: false
    },
    proAllData: {
      required: true
    }
  },
  data() {
    return {
      checked: false,
      invoiceType: "", //STOCK_IN入库、TRANSFER调拨
      arrowType: false,
      baoViewTF: false, //查看包详情
      baoData: {}, //包的详情数据
      proAllData: {}, //复称单数据
      baoObj: [], //选择包的详情数据
      proList: [], //单里的产品详情数据
      searchData: {}, //搜索条件
      typeTxt: "复称", //入库或调拨显示
      enterStatus: ""
    };
  },
  created() {
    let self = this;
    document.onkeydown = e => {
      let dom = self.$refs.productItemFour;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },
  mounted() {},
  watch: {
    baoData: function(newVal, oldVal) {
      this.baoData = newVal;
    },
    proAllData: function(newVal, oldVal) {
      this.proAllData = newVal;
      let tempList = this.proAllData.bizPro.slice();
      this.invoiceType = newVal.bizInvoice.invoiceType;
      switch (newVal.bizInvoice.invoiceType) {
        case "TRANSFER":
          this.typeTxt = "调拨";
          break;
        case "STOCK_IN":
          this.typeTxt = "入库";
          break;
        case "STOCK_OUT":
          this.typeTxt = "出库";
          break;
      }

      // tempList.forEach(ielem => {
      //   ielem.newAmount = ielem.newAmount != 0 ? ielem.newAmount : ielem.amount;
      //   ielem.newWeight = ielem.newWeight != 0 ? ielem.newWeight : ielem.weight;
      //   ielem.newSuttle = ielem.newSuttle != 0 ? ielem.newSuttle : ielem.suttle;
      // });

      tempList.forEach(ielem => {
        ielem.newAmount = 0;
        ielem.newWeight = 0;
        ielem.newSuttle = 0;
      });
      this.proList = tempList;
    }
  },
  computed: {},
  methods: {
    //打开包查看包详情
    baoViewFun(elem) {
      this.baoObj = elem;
      // console.log(elem,elem.packSkuNumbers)
      elem.proList = [];
      this.proAllData.bizPackDetails.forEach(ielem => {
        if (ielem.packId === elem.packId && ielem.proBasics) {
          elem.proList.push(ielem);
        }
      });
      // console.log(this.proAllData.bizPackDetails,elem.proList)
      this.proAllData.bizPro.forEach(jelem => {
        elem.proList.forEach(kelem => {
          if (kelem.skuNumber === jelem.skuId) {
            Object.assign(kelem, jelem);
          }
        });
      });
      if (elem.packDetail) {
        elem.packDetail.forEach(ielem => {
          // ielem.newAmount = ielem.newAmount ? ielem.newAmount : ielem.amount;
          // ielem.newWeight = ielem.newWeight ? ielem.newWeight : ielem.weight;
          // ielem.newSuttle = ielem.newSuttle ? ielem.newSuttle : ielem.suttle;
        });
      }
      if (elem.packDetails) {
        elem.packDetails.forEach(ielem => {
          // ielem.newAmount = ielem.newAmount ? ielem.newAmount : ielem.amount;
          // ielem.newWeight = ielem.newWeight ? ielem.newWeight : ielem.weight;
          // ielem.newSuttle = ielem.newSuttle ? ielem.newSuttle : ielem.suttle;
        });
      }
      this.baoList = elem.packDetail ? elem.packDetail : elem.packDetails;
      // console.log('baoList:',this.baoList)
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
      elem.editAmount = parseInt(elem.editAmount);
      this.$forceUpdate();
    },
    //确定按钮
    confirmFun() {
      // console.log(this.baoList, this.searchData);
      this.baoViewTF = false;
    },

    //输入框获得焦点
    focusWeightFocus(e, ind, elem) {
      this.tempObj = e;
      this.enterStatus = elem;
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlur(item, name) {
      this.inputIndOne = "";
      let self = this;
      if (name == "newSuttle") {
        if (item.newSuttle > item.newWeight && item.newWeight > 0) {
          this.$message.error("抱歉，净重不能大于毛重！");
          this.$nextTick(() => {
            item.newSuttle = 0;
          });
        }
      } else if (name == "newWeight") {
        if (item.newSuttle > item.newWeight) {
          this.$message.error("抱歉，净重不能大于毛重！");
          this.$nextTick(() => {
            item.newWeight = 0;
          });
        }
      }

      setTimeout(function() {
        self.checked = !self.checked;
      }, 0);
      this.$forceUpdate();
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (!self.tempObj) {
        self.$message.error("实收净重或实收毛重没有被焦点选中！");
      }
      if (self.tempObj) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },

    //改变电子称输入框数量
    changeWeight(elem) {
      let self = this;
      let indOne = self.inputIndOne - 1;
      if (self.enterStatus === "复称净重") {
        self.baoList[indOne].newSuttle = parseFloat(elem);
      }
      if (self.enterStatus === "复称毛重") {
        self.baoList[indOne].newWeight = parseFloat(elem);
      }
      self.$forceUpdate();
    },
    //循环读取电子称输入框数量
    loop() {
      let oldVal = "";
      let self = this;
      let count = 0;
      return () => {
        if (count >= 20) {
          count = 0;
          this.$message.info(`重量没有改变，请检查是否读称成功！`);
          return;
        }

        setTimeout(() => {
          this.$$.ajax({
            type: "get",
            async: false,
            url:
              "http://localhost:5000/BalanceResult/result.js?t=" +
              new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              // console.log("bbb:",json,json.weight);
              count++;
              var weightNum = json.weight ? json.weight : null;
              if (!oldVal) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
              if (oldVal && oldVal === weightNum) {
                self.changeWeight(weightNum);
                self.loopInit();
                return;
              }
              if (oldVal && oldVal !== weightNum) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
            },
            error: function() {
              // alert("fail");
            }
          });
        }, 150);
      };
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
