<template>
  <div class="dialogWrap" ref="repleOrder">
    <el-dialog
      title="产品选择"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div class="dialogContent">
        <!-- 标题 -->
        <div class="hr"></div>
        <div class="flexC">
          <div class="dialogTitel">
            <span>盘点仓库：</span>
            {{afferentData.wareName}}
          </div>

          <div class="dialogTitel" v-if="afferentData.sarkName">
            <span>盘点库柜：</span>
            {{afferentData.sarkName}}
          </div>
        </div>

        <DialogScreenBao
          @suitSearch="suitSearch"
          ref="dialogScreenBao"
          :showInputType="true"
          :selectTF="true"
          :orderTxtTF="false"
        >
          <div>
            <el-button
              type="primary"
              size="small"
              style="margin-right: 20px"
              plain
              :loading="loadingExcel"
              @click="exportFun"
            >导出Excel</el-button>
            <el-button type="primary" size="small" @click="selecteFun" :loading="loadingTF">确认选中</el-button>
          </div>
        </DialogScreenBao>

        <!-- 产品 -->
        <div class="proWrap">
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
                :handle="true"
                @showPic="showPic"
              ></TzAttrAddBao>
              <div style="display:flex;flex:6">
                <div class="uLThree" style="flex:10">
                  <div>
                    <span class="grayCol">库存数量：{{item.amount}}</span>
                  </div>
                  <div>
                    <span class="grayCol">库存净重：{{item.goldWeight}}g</span>
                  </div>
                  <div>&nbsp</div>
                  <!-- <div>
                    <span class="grayCol">库存毛重：{{item.weight}}g</span>
                  </div>-->
                </div>

                <div class="uLThree" style="flex:10">
                  <div>
                    <span class="grayCol">盘点数量：</span>
                    <el-input-number
                      :controls="false"
                      v-model="item.amounts"
                      :min="0"
                      placeholder="请输入数量"
                      size="mini"
                      @change="changeSkuNum"
                    ></el-input-number>
                  </div>
                  <div>
                    <span class="grayCol">盘点净重：</span>
                    <el-input-number
                      :controls="false"
                      v-model="item.inventorySuttle"
                      :min="0"
                      placeholder="请输入数量"
                      size="mini"
                      @change="changeSkuNum"
                      @focus="focusWeightFocus(item,index)"
                      @blur="focusWeightBlur(item)"
                    ></el-input-number>g
                  </div>
                  <div>
                    <div>&nbsp</div>
                    <!-- <span class="grayCol">盘点毛重：</span>
                    <el-input-number
                      v-model="item.inventoryWeight"
                      :min="0"
                      placeholder="请输入净重"
                      size="mini"
                      @change="changeSkuNum"
                    ></el-input-number>g-->
                  </div>
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
          </div>

          <infinite-loading
            @infinite="infiniteHandler"
            ref="infiniteLoading"
            :identifier="infiniteId"
            :direction="bottom"
            :distance="0"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
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
    afferentData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    confirmProdcutData: {
      type: Array,
      required: true
    },
    // STOCK_IN = 入库单据, STOCK_OUT = 出库单据 , TRANSFER = 调拨单据
    mode: {
      type: String
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      bottom: "bottom", //infinite-loading组件需要
      productData: [], //产品数据
      searchData: {}, //筛选数据
      handle: true,
      mock: "",
      loadingTF: false,
      loadingExcel: false,
      mockData: [],
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
      dialogVisible: false,
      returnData: {},
      page: 1,
      rows: 20,
      proData: {},
      params: {},
      inputIndOne: "",
      tempObj: {}
    };
  },
  created() {
    let self = this;
    document.onkeydown = e => {
      let dom = self.$refs.repleOrder;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },
  watch: {
    dialogType: function(newVal, oldVal) {
      this.dialogVisible = true;
      this.getProductData();
    }
  },
  computed: {},
  methods: {
    infiniteHandler($state) {
      if (this.productData.length >= this.proData.rowSize) {
        $state.complete();
        return false;
      }
      this.getProductData()
        .then(res => {
          this.page += 1;
          $state.loaded();
        })
        .catch(err => {
          $state.complete();
        });
      //   console.log(this.productData.length, this.proData.rowSize);
      //   if (this.productData.length >= this.proData.rowSize) {
      //     $state.complete();
      //   } else {
      //     console.log(2);
      //     this.page = this.page + 1;
      //     this.getProductData()
      //       .then(res => {
      //         $state.loaded();
      //       })
      //       .catch(err => {
      //         $state.complete();
      //       });
      //   }
    },

    //导出
    exportFun() {
      let self = this;
      const {
        page = 1,
        proName: search,
        storeId: wareId,
        sarkId,
        one,
        processCode: process,
        conditi,
        rows = 20
      } = this.params;
      let params = {
        PRS: {
          search,
          wareId,
          sarkId,
          one,
          process,
          conditi,
          page,
          rows
        }
      };
      this.loadingExcel = true;
      this.$axios
        .get(this.$portMain + "/checkStock/downProduct", params)
        .then(function(res) {
          if (res.data.code == 200) {
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "盘点." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            let xlsDownloadA = document.createElement("a");
            xlsDownloadA.download = self.fname;
            xlsDownloadA.href = URL.createObjectURL(blob);
            xlsDownloadA.click();
          } else {
            self.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loadingExcel = false;
        });
    },

    //套装详情
    suitDes(val) {
      this.returnData = val;
    },
    closeFun() {
      this.page = 1;
      this.searchData = {};
      this.$refs.dialogScreenBao.clearFun();
    },

    //筛选
    suitSearch(val) {
      // console.log("aaa:", val);
      const { search } = val;
      this.searchData = val;
      this.searchData.proName = search;
      this.page = 1;
      this.getProductData();
    },

    //获取产品数据
    getProductData() {
      const { wareId: storeId = ``, sarkId = `` } = this.afferentData;
      let params = {
        goldCode: "",
        one: "",
        processCode: "",
        proName: "",
        car: "",
        effectCode: "",
        conditi: "",
        factoryId: "",
        storeId,
        sarkId,
        page: this.page,
        rows: this.rows
      };
      if (this.page === 1 && this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      }
      Object.assign(params, this.searchData);
      this.params = params;
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
            item.inventorySuttle = 0;
            item.inventoryWeight = 0;
            item.checked = false;
          });
          this.productData =
            this.page === 1 ? listOne : this.productData.concat(listOne);
        })
        .catch(err => {
          this.$message.error(err.data.msg);
        });
    },

    //确定选中
    selecteFun() {
      let self = this;
      let checkResult,
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
          return;
        }
      });
      if (checkResult) {
        this.$message.error("请输入选中产品的数量！");
        return;
      }
      self.loadingTF = true;
      setTimeout(function() {
        self.loadingTF = false;
      }, 800);
      this.$emit("confirmProdcut", selectProduct);
      this.dialogVisible = false;
    },

    //重新渲染页面
    changeSkuNum(elem) {
      this.$forceUpdate();
    },
    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "") {
        self.$message.error("盘点净重没有被焦点选中！");
      }
      if (self.inputIndOne) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },

    //改变电子称输入框数量
    changeWeight(elem) {
      let self = this;
      self.tempObj.inventorySuttle = parseFloat(elem);
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
.dialogWrap {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;

  .flexC {
    display: flex;
    align-items: center;
  }

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
      margin-right: 200px;

      span {
        color: #8A9199;
      }
    }

    .screenWrap {
      display: flex;
      justify-content: space-between;
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
