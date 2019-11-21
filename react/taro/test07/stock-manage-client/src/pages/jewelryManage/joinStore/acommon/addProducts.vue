<template>
  <div class="dialogWrap" ref="addProducts">
    <el-dialog
      title="产品选择"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div class="dialogContent" v-loading="loadingType">
        <div class="hr"></div>
        <!-- 标题 -->
        <div class="dialogTitel">
          <span>发起单位：</span>
          {{companyName}}
        </div>

        <DialogScreenBao
          @suitSearch="suitSearch"
          ref="dialogScreenBao"
          :showInputType="true"
          :selectTF="true"
          :orderTxtTF="true"
          :conditiShow="false"
        >
          <div class="flexBT">
            <SkuScreen v-if="searchData.orderTxt" @suitSearch="searchFun" :proList="productData"></SkuScreen>
            <div v-else></div>
            <div>
              <el-button
                type="primary"
                size="small"
                plain
                @click="batchFun"
                v-show="afferentData.bizType === 'RECEIVE_CLIENT'"
              >批量选择原因</el-button>
              <el-button
                type="primary"
                size="small"
                :loading="clickLoading"
                @click="selecteFun"
              >确认选中</el-button>
            </div>
          </div>
        </DialogScreenBao>

        <!-- 产品 -->
        <div class="proWrap">
          <div
            class="txtCenter txt16 txtHui top20"
            v-if="productData.length === 0"
          >没有合适的产品，请重新选择筛选条件！</div>
          <div
            class="productUL"
            :class="item.showStatus ? 'on' : ''"
            v-for="(item,index) in productData"
            :key="index"
          >
            <!-- 单装 -->
            <div class="product">
              <TzAttrAddBao
                @suitDes="suitDes"
                :isDisabled="true"
                :addProOBj="item"
                :handle="false"
                @showPic="showPic"
              ></TzAttrAddBao>
              <div style="display:flex;flex:6">
                <div
                  class="uLThree"
                  style="flex:10"
                  v-if="afferentData.bizType === 'RECEIVE_CLIENT'"
                >
                  <div>
                    <span class="grayCol">
                      工费类型：
                      <span v-show="item.feeType === 1">每克</span>
                      <span v-show="item.feeType === 2">每件</span>
                    </span>
                  </div>
                  <div>
                    <span class="grayCol">
                      基础工费：
                      <span>{{item.basePrice}}</span>
                    </span>
                  </div>
                  <div>
                    <span class="grayCol">
                      工费：
                      <span v-show="item.feeType === 1">{{item.additionPrice}}</span>
                      <span v-show="item.feeType === 2">{{item.feePrice}}</span>
                    </span>
                  </div>
                </div>

                <div class="uLThree" style="flex:10" v-else>
                  <div>
                    <span class="grayCol">
                      工费类型：
                      <span v-show="item.facFeeType === 1">每克</span>
                      <span v-show="item.facFeeType === 2">每件</span>
                    </span>
                  </div>
                  <!-- <div>
                    <span class="grayCol">
                      基础工费：
                      <span>{{item.basePrice}}</span>
                    </span>
                  </div>-->
                  <div>
                    <span class="grayCol">
                      采购工费：
                      <span v-show="item.facFeeType === 1">{{item.price}}</span>
                      <span v-show="item.facFeeType === 2">{{item.piecePrice}}</span>
                    </span>
                  </div>
                  <div></div>
                </div>

                <div
                  class="uLThree"
                  style="flex:10"
                  v-if="afferentData.bizType !== 'RECEIVE_CLIENT' &&searchData.orderTxt"
                >
                  <div>
                    <span class="grayCol">
                      下单数量：
                      <span>{{item.citationNumber?item.citationNumber:'--'}}</span>
                    </span>
                  </div>

                  <div>
                    <span class="grayCol">
                      下单重量：
                      <span>{{item.citationWeight?item.citationWeight:0}}g</span>
                    </span>
                  </div>
                  <div></div>
                </div>

                <div class="uLThree" style="flex:10">
                  <div>
                    <!-- <span class="grayCol">
                      工费：
                      <span v-if="item.proSpecData && !item.price">
                        <span
                          v-if="item.proSpecData.feeType === 1"
                        >{{item.proSpecData.additionPrice}}</span>
                        <span v-if="item.proSpecData.feeType === 2">{{item.proSpecData.price}}</span>
                      </span>
                      <span v-if="item.price">{{item.price}}</span>
                      元/g
                    </span>-->
                  </div>
                  <div>
                    <span class="grayCol">实收数量：</span>
                    <el-input-number
                      style="width: 80px"
                      :controls="false"
                      v-model="item.amounts"
                      step-strictly="1"
                      :min="0"
                      placeholder="请输入数量"
                      size="mini"
                      @blur="autoSelect(item)"
                      @change="changeSkuNum"
                    ></el-input-number>
                  </div>
                  <div>
                    <span class="grayCol">实收净重：</span>
                    <el-input-number
                      style="width: 80px"
                      :controls="false"
                      v-model="item.suttle"
                      :min="0"
                      :ref="item.skuId"
                      placeholder="请输入净重"
                      size="mini"
                      @blur="autoSelect(item)"
                      @change="changeSkuNum"
                      @focus="focusWeightFocus(item,index)"
                    ></el-input-number>g
                  </div>
                </div>

                <div class="uLThree" v-if="afferentData.bizType === 'RECEIVE_CLIENT'">
                  <div>
                    <span class="grayCol">退饰原因：</span>
                    <el-select
                      v-model="item.resion"
                      multiple
                      placeholder="请选择退饰原因"
                      size="small"
                      style="width:200px"
                      @change="changeSkuNum"
                    >
                      <el-option
                        v-for="item in resionData"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div style="margin-bottom: 6px;" v-if="afferentData.bizType === 'RECEIVE_CLIENT'">
                    <span class="grayCol">退饰备注：</span>
                    <el-input
                      v-model="item.skuRemarks"
                      placeholder="请输入退饰备注"
                      size="small"
                      style="width:200px"
                      @input="changeSkuNum"
                    ></el-input>
                  </div>
                </div>
                <div class="uLFour" style="flex:2">
                  <el-checkbox v-model="item.checked" style="margin-top: 38px;" @change="changeFun"></el-checkbox>
                </div>
              </div>
            </div>
            <!-- 套装 -->
            <div
              class="tzWtap"
              v-if="item.map != undefined"
              v-show="returnData.proNumber == item.proNumber && returnData.arrowType"
            >
              <TzAttrDetails
                :styleType="handle"
                v-for="(suitData,num) in item.map.proList"
                :suitDetailData="suitData"
                :key="num"
                @showPic="showPic"
              ></TzAttrDetails>
            </div>
            <div
              class="tzWtap"
              v-else-if="item.proSpecData && item.proSpecData.ProList.length"
              v-show="returnData.proNumber == item.proNumber && returnData.arrowType"
            >
              <TzAttrDetails
                :styleType="handle"
                v-for="(suitData,num) in item.proSpecData.ProList"
                :suitDetailData="suitData"
                :key="num"
                @showPic="showPic"
              ></TzAttrDetails>
            </div>
          </div>

          <infinite-loading
            @infinite="infiniteHandler"
            ref="infiniteLoading"
            :identifier="infiniteId"
            :direction="bottom"
            :distance="50"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
        <BatchReason ref="batchReason" @selectResionFun="selectResionFun" :heightData="594"></BatchReason>
      </div>
    </el-dialog>
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModelPic" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template> 

<script>
export default {
  props: {
    dialogType: {
      required: true
    },
    goldPricePropsList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    companyName: {
      type: String,
      required: false
    },
    afferentData: {
      type: Object,
      required: true
    },
    searchDataOld: {
      //编辑数据回填的需要加库存
      type: Object,
      required: false
    },
    confirmProdcutData: {
      type: Array,
      required: true
    },

    // STOCK_IN = 入库单据, STOCK_OUT = 出库单据 , TRANSFER = 调拨单据
    mode: {
      type: String
    },
    inStock: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      bottom: "bottom", //infinite-loading组件需要
      productData: [], //产品数据
      searchData: {}, //筛选数据
      clickLoading: false,
      loadingType: false,
      handle: true,
      mock: "",
      mockData: [],
      factoryId: ``,
      resionData: [
        {
          value: "质量问题"
        },
        {
          value: "上柜"
        },
        {
          value: "返修"
        },
        {
          value: "清洗整形"
        },
        {
          value: "加字印"
        },
        {
          value: "改字印"
        },
        {
          value: "当料退"
        },
        {
          value: "当样品"
        }
      ],
      infiniteId: +new Date(),
      //   dialogVisible: false,
      dialogVisible: true,
      returnData: {},
      _loadedFirst: false,
      page: 1,
      rows: 20,
      proData: {},
      inputIndOne: "",
      tempObj: {}
    };
  },
  created() {
    let self = this;
    document.onkeydown = e => {
      let dom = self.$refs.addProducts;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },
  watch: {
    dialogType(newVal, oldVal) {
      this.dialogVisible = true;
    }
  },
  computed: {},
  methods: {
    infiniteHandler($state) {
      //   console.log(
      //     this.searchData.orderTxt,
      //     Boolean(this.searchData.orderTxt),
      //     this.productData.length,
      //     this.proData.rowSize
      //   );
      if (!this._loadedFirst) {
        $state.complete();
        return;
      }
      if (this.searchData.orderTxt) {
        $state.complete();
        return;
      }
      if (this.productData.length >= this.proData.rowSize) {
        $state.complete();
      } else {
        this.getProductData()
          .then(res => {
            // console.log(this.page);
            this.page = this.page + 1;
            $state.loaded();
          })
          .catch(err => {
            $state.complete();
          });
      }
    },

    // 套装详情
    suitDes(val) {
      this.returnData = val;
    },
    closeFun() {
      this.$emit("close", {});
      //   this.page = 1;
      //   this.searchData = {};
      //   this.$refs.dialogScreenBao.clearFun();
    },

    // 筛选
    suitSearch(val) {
      this._loadedFirst = true;
      this.infiniteId += 1;
      this.searchData = val;
      this.page = 1;
      if (!this.searchData.orderTxt) {
        this.getProductData();
      } else {
        this.getFindBizNoProList();
      }
    },

    //sku筛选 todo
    searchFun(elem) {
      let self = this;
      const { backProList } = elem;

      this.productData = backProList;
      if (backProList.length > 0) {
        setTimeout(() => {
          let skuId = backProList[0].skuId + "";
          self.$refs[skuId][0].focus();
        }, 1000);
      }
    },

    // 引入单据产品数据
    getFindBizNoProList() {
      console.log("用伊欧尼噶的那句还", this.searchData.orderTxt);
      let params = {
        bizNo: this.searchData.orderTxt,
        storeId: this.inStock
          ? this.searchDataOld.receive
          : this.searchDataOld.send
      };
      this.loadingType = true;
      this.$api
        .urlPost(
          this.$portMain + "/transferController/findBizNoProList",
          params
        )
        .then(res => {
          const { data, code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          }
          this.productData = data.proList ? data.proList : [];
          this.productData.forEach(ielem => {
            // ielem.checked = true; //引用单据产品默认选中
            // ielem.amounts = ielem.amount;
            ielem.resion = [];
            ielem.skuRemarks = ``;
            ielem.id = ielem.skuId;
            ielem.oneItemsCode = ielem.proBasics.oneItemsCode;
            ielem.conditi = ielem.proSpecData.conditi;
            ielem.facFeeType = ielem.proSpecData.factFeeType;
            ielem.piecePrice = ielem.proSpecData.piecePrice;
            ielem.price = ielem.proSpecData.price;
            ielem.feeType = ielem.proSpecData.feeType;
            ielem.additionPrice = ielem.proSpecData.additionPrice;
            ielem.feePrice = ielem.proSpecData.feePrice;
            ielem.map = ielem.proSpecData;
            ielem.map.proList = ielem.map.ProList;
            ielem.proNumber = ielem.skuId;
            ielem.basePrice = this.setBasePrice(ielem.proSpecData.conditi);
            ielem.citationNumber = ielem.amount;
            ielem.citationWeight = (
              ielem.amount * ielem.proSpecData.weight
            ).toFixed(2);
            // ielem.suttle = (ielem.amount * ielem.proSpecData.weight).toFixed(2);
          });
          // console.log("改造后的数据", this.productData);
          this.orderInfo = data.orderInfo;
        })
        .finally(() => {
          this.loadingType = false;
        });
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "") {
        self.$message.error("复核毛重没有被焦点选中！");
      }
      if (self.inputIndOne) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },

    //改变电子称输入框数量
    changeWeight(elem) {
      let self = this;
      var indexOne = self.inputIndOne - 1;
      self.tempObj.suttle = parseFloat(elem);
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
              // console.log(json,json.weight);
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
    },
    //输入框获得焦点
    focusWeightFocus(e, ind) {
      this.tempObj = e;
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlur(item) {
      this.inputIndOne = "";
      this.tempObj = item;
      this.$forceUpdate();
    },
    //获取产品数据
    getProductData() {
      const {
        afferentData = {},
        afferentData: {
          sendItem: { val }
        }
      } = this;
      let params = {
        goldCode: "",
        one: "",
        processCode: "",
        proName: "",
        car: "",
        effectCode: "",
        conditi: "",
        storeId: "",
        factoryId: val,
        page: this.page,
        rows: this.rows
      };

      if (this.page === 1 && this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      }
      Object.assign(params, this.searchData);
      params.proName = params.search;
      return this.$api
        .urlPost(
          this.$portMain + "/proCommonController/repertoryShowList",
          params
        )
        .then(res => {
          const {
            data,
            data: { data: list }
          } = res.data;
          let listOne = list ? list : [];
          this.proData = data;
          listOne.forEach(item => {
            // item.amount = 100;
            item.amounts = 0;
            item.suttle = 0;
            item.checked = false;
            item.resion = [];
            item.skuRemarks = "";
            item.basePrice = this.setBasePrice(item.conditi);
          });

          this.productData =
            this.page === 1 ? listOne : this.productData.concat(listOne);
          //   console.log(this.productData, listOne, this.page);
        })
        .catch(err => {
          this.$message.error(err.data.msg);
        });
    },

    //确定选中
    selecteFun() {
      let checkResult,
        checkSuttle,
        selectProduct = [];
      this.productData.forEach(item => {
        if (item.checked) {
          selectProduct.push(item);
        }
      });
      if (selectProduct.length == 0) {
        this.$message.error("请选择产品！");
        return;
      }
      selectProduct.forEach(item => {
        if (!item.amounts) {
          checkResult = true;
        }
        if (!item.suttle) {
          checkSuttle = true;
        }
      });

      if (checkResult) {
        this.$message.error("请输入选中产品的数量！");
        return;
      }

      if (checkSuttle) {
        this.$message.error("请输入选中产品的净重！");
        return;
      }

      this.$emit("confirmProdcut", selectProduct, this.orderInfo);
      this.dialogVisible = false;
    },

    // 设置基础工费
    setBasePrice(conditi) {
      let basePrice = 0;
      if (conditi === `999`) {
        basePrice = this.goldPricePropsList.filter(
          item => item.propType === `足金999`
        )[0].propValue;
      }
      if (conditi === `9999`) {
        basePrice = this.goldPricePropsList.filter(
          item => item.propType === `足金9999`
        )[0].propValue;
      }
      if (conditi === `997`) {
        basePrice = this.goldPricePropsList.filter(
          item => item.propType === `足金`
        )[0].propValue;
      }
      return basePrice;
    },

    //重新渲染页面
    changeSkuNum(elem) {
      this.$forceUpdate();
    },
    //选择
    changeFun(val) {
      this.$forceUpdate();
    },
    // 自动选中
    autoSelect(item) {
      this.focusWeightBlur(item);
      if (item.amounts != 0 && item.suttle != 0) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    },
    //批量选择原因
    batchFun() {
      let result = false;
      result = this.productData.some(item => {
        return item.checked == true;
      });
      if (result) {
        this.$refs.batchReason.showFun();
      } else {
        this.$message.warning("请先勾选产品后再批量选择原因!");
      }
    },
    //确定批量选择原因
    selectResionFun(data) {
      this.productData.forEach(item => {
        if (item.checked) {
          item.resion = data;
        }
      });
      this.$forceUpdate();
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

<style>
.el-input-number {
  padding: 0;
}
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
.flexRemark {
  display: flex;
  justify-content: space-between;
}

.flexBT {
  display: flex;
  justify-content: space-between;
  flex: auto;
}

.dialogWrap {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  .mL24 {
    margin-left: 24px;
  }

  .smallTitle {
    color: #8A8E99;
  }

  .dialogContent {
    position: relative;

    .dialogTitel {
      font-size: 16px;
      font-weight: bold;

      span {
        color: #8A9199;
      }
    }

    .screenWrap {
      display: flex;
      margin: 14px 0 16px 0;
    }

    .hr {
      border-top: 1px solid #d9d9d9;
      position: absolute;
      left: 0px;
      top: -34px;
      width: 100%;
    }
  }

  // 产品
  .proWrap {
    height: 400px;
    overflow-y: auto;
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

    // 单品
    .product {
      display: flex;

      .uLOne {
        display: flex;

        img {
          width: 120px;
          height: 90px;
          margin-left: 15px;
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
        display: flex;
        line-height: 36px;
        flex-direction: column;
        // justify-content: space-evenly;
      }

      .uLFour {
        display: flex;
        justify-content: flex-end;
      }
    }

    // 套装
    .tzWtap {
      border-top: 1px solid #E5F1FF;
      margin-top: 13px;
      padding: 14px 0;

      .itemWrap {
        width: 49%;
        display: inline-flex;
        margin-bottom: 20px;
        padding-left: 29px;
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

    // 更多
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
  }
}
</style>
