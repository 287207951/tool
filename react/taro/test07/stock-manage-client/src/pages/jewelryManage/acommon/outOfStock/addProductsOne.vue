<template>
  <div class="dialogWrap" ref="AddProductsOne">
    <el-dialog
      title="产品选择"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      height="720px"
      @close="closeFun"
    >
      <div class="dialogContent" v-loading="loadingType">
        <div class="hr"></div>
        <!-- 标题 -->
        <div class="dialogTitel">
          <span>发起单位：</span>
          {{companyName.txt?companyName.txt:companyName.sendName}}
        </div>
        <!-- 筛选 -->
        <!-- <DialogScreen>
          <el-button type="primary" size="small">确认选中</el-button>
        </DialogScreen>-->
        <DialogScreenBao
          @suitSearch="suitSearch"
          ref="dialogScreenBao"
          :selectTF="true"
          :orderTxtTF="true"
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
                v-show="!(companyName.bizType == 'SEND_CLIENT')"
              >批量选择原因</el-button>
              <el-button type="primary" size="small" @click="selecteFun">确认选中</el-button>
            </div>

            <!-- <el-button type="primary" size="small" :loading="clickLoading" @click="selecteFun">确认选中</el-button> -->
          </div>
        </DialogScreenBao>

        <!-- 产品 -->
        <div class="proWrap">
          <div class="txtCenter txt16 txtHui" v-if="productData.length === 0">没有合适的产品，请重新选择筛选条件！</div>
          <div
            class="productUL"
            :class="item.showStatus ? 'on' : ''"
            v-for="(item,index) in productData"
            :key="index"
          >
            <!-- 单装 -->
            <div class="product">
              <TzAttrAddBao @suitDes="suitDes" :addProOBj="item" :handle="false" @showPic="showPic"></TzAttrAddBao>
              <div style="display:flex;flex:6">
                <div class="uLTwo" style="flex:8">
                  <div>
                    <span class="grayCol">剩余库存：</span>
                    <span>{{item.storeAmount != undefined?item.storeAmount:item.amount}}</span>
                  </div>
                  <div>
                    <span class="grayCol">库存净重：</span>
                    <span>{{item.goldWeight}}g</span>
                  </div>
                  <div>
                    <span class="grayCol">库存毛重：</span>
                    <span>{{item.copyGoldWeight}}g</span>
                  </div>
                </div>
                <div class="uLThree" style="flex:10">
                  <div>
                    <span class="grayCol">{{mode === 'TRANSFER'?'调拨数量：':'选择数量：'}}</span>
                    <el-input
                      v-model="item.skuNum"
                      placeholder="请输入数量"
                      size="small"
                      style="width:80px"
                      :disabled="item.amount <= 0 || item.storeAmount <= 0"
                      @input="changeSkuNum"
                      @blur="checkNumber(item,'skuNum')"
                    ></el-input>
                  </div>
                  <div v-if="companyName.type === 'FICTITIOUS'">
                    <span class="grayCol">{{mode === 'TRANSFER'?'调拨':'选择'}}净重：</span>
                    <el-input
                      v-model="item.editSuttle"
                      placeholder="请输入净重"
                      size="small"
                      style="width:80px"
                      :disabled="item.amount <= 0"
                      @input="changeSkuNum"
                      @focus="focusWeightFocus(item,index,'净重')"
                      @blur="focusWeightBlur(item,'editSuttle')"
                    ></el-input>g
                  </div>
                  <div v-if="companyName.type === 'FICTITIOUS'">
                    <span class="grayCol">{{mode === 'TRANSFER'?'调拨':'选择'}}毛重：</span>
                    <el-input
                      v-model="item.editWeight"
                      placeholder="请输入毛重"
                      size="small"
                      style="width:80px"
                      :disabled="item.amount <= 0"
                      @input="changeSkuNum"
                      @focus="focusWeightFocus(item,index,'毛重')"
                      @blur="focusWeightBlur(item,'editWeight')"
                    ></el-input>g
                  </div>
                </div>
                <div class="uLThree" v-show="!(companyName.bizType == 'SEND_CLIENT')">
                  <div style="margin-bottom: 6px;">
                    <span class="grayCol">出库备注：</span>
                    <el-input
                      v-model="item.remark"
                      placeholder="请输入备注"
                      size="small"
                      style="width:200px"
                      @input="changeSkuNum"
                      :disabled="item.amount <= 0"
                    ></el-input>
                  </div>
                  <div>
                    <span class="grayCol">出库原因：</span>
                    <el-select
                      v-model="item.remarkReason"
                      multiple
                      placeholder="请选择"
                      size="small"
                      style="width:200px"
                      :disabled="item.amount <= 0"
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
                </div>
                <div class="uLFour" style="flex:2">
                  <el-checkbox
                    v-model="item.checked"
                    style="margin-top: 38px;"
                    @change="changeFun"
                    :disabled="item.amount <= 0 || item.storeAmount <= 0"
                  ></el-checkbox>
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
                @showPic="showPic"
                :key="num"
              ></TzAttrDetails>
            </div>
          </div>
          <infinite-loading
            @infinite="infiniteHandler"
            ref="infiniteLoading"
            :identifier="infiniteId"
            :direction="bottom"
            :distance="100"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
        <BatchReason ref="batchReason" @selectResionFun="selectResionFun" :heightData="774"></BatchReason>
      </div>
      <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    </el-dialog>
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>

<script>
import { assemblyProductsData } from "../../acommon/publicMethod";
export default {
  props: {
    dialogType: {
      required: true
    },
    companyName: {
      type: Object,
      required: false
    },
    afferentData: {
      type: Object,
      required: true
    },
    confirmProdcutData: {
      type: Array,
      required: true
    },
    // STOCK_IN = 入库单据, STOCK_OUT = 出库单据 , TRANSFER = 调拨单据
    editProductData: {
      //编辑数据回填的需要加库存
      type: Array,
      required: false
    },
    searchDataOld: {
      //编辑数据回填的需要加库存
      type: Object,
      required: false
    },
    mode: {
      type: String
    },
    loadingTF: {
      //按钮加载
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      orderInfo: "", //引用单据号需要返回数据
      bottom: "bottom", //infinite-loading组件需要
      loadingType: false,
      productData: [], //产品数据
      searchData: {}, //筛选数据
      // searchDataOld: {}, //搜索数据
      handle: true,
      mock: "",
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
      dialogVisible: true,
      returnData: {},
      page: 1,
      rows: 10,
      infiniteId: +new Date(),
      proData: {},
      inputIndOne: "",
      enterStatus: {},
      tempObj: {},
      weightA: ""
    };
  },
  created() {
    let self = this;
    if (this.companyName.sendItem) {
      this.companyName.type = this.companyName.sendItem.type;
    }
    document.onkeydown = e => {
      let dom = self.$refs.AddProductsOne;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },
  watch: {
    dialogType(newVal, oldVal) {
      this.dialogVisible = true;

      this.productData = [];
    },
    searchDataOld(newVal, oldVal) {}
  },
  computed: {},
  methods: {
    //sku筛选 todo
    searchFun(elem) {
      const { backProList } = elem;
      this.productData = backProList;
    },

    //套装详情
    suitDes(val) {
      this.returnData = val;
    },
    closeFun() {
      this.page = 1;
      this.searchData = {};
      this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      this.$refs.dialogScreenBao.clearFun();
      this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
      // this.proData.rowSize = 0
      this.$emit("close", {});
    },

    //筛选引入单据号
    suitSearch(val) {
      this.infiniteId += 1;
      this.searchData = val;
      this.page = 1;
      if (!this.searchData.orderTxt) {
        this.productData = [];
        this.getProductData();
      } else {
        this.getFindBizNoProList();
      }
    },

    // 引入单据产品数据
    getFindBizNoProList() {
      let self = this;
      // console.log(this.searchDataOld,this.companyName.)
      let params = {
        bizNo: this.searchData.orderTxt,
        storeId: this.searchDataOld
          ? this.searchDataOld.send
          : this.companyName.send
      };
      this.loadingType = true;
      this.$api
        .urlPost(
          this.$portMain + "/transferController/findBizNoProList",
          params
        )
        .then(res => {
          const { data } = res.data;
          self.loadingType = false;
          self.assembleData(data.proList);
          self.orderInfo = data.orderInfo;
        })
        .catch(err => {
          self.productData = [];
          self.$message.error(err.data);
          self.loadingType = false;
        });
    },

    //组装数据
    assembleData(data) {
      let self = this;
      let assembleData = assemblyProductsData(data);
      if (assembleData.length > 0) {
        assembleData.forEach(item => {
          item.remarkReason = [];
          item.remark = "";
          // item.skuNum = item.amount;
          // item.checked =
          //   item.amount <= 0 || item.storeAmount <= 0 ? false : true; //引用单据默认选中
          item.copyGoldWeight = item.goldWeight;
          // item.editSuttle = (item.amount * item.weight).toFixed(2);
          // item.editWeight = (item.amount * item.weight).toFixed(2);
        });

        //引用单据减库存
        if (this.confirmProdcutData.length > 0) {
          this.confirmProdcutData.forEach(item => {
            assembleData.forEach(it => {
              if (item.proNumber == it.proNumber) {
                it.storeAmount = Number(it.storeAmount) - Number(item.skuNum);
                it.goldWeight = self.$api.returnFloatNum(
                  Number(it.goldWeight) - Number(item.editSuttle)
                );
                it.copyGoldWeight = self.$api.returnFloatNum(
                  Number(it.copyGoldWeight) - Number(item.editWeight)
                );
              }
            });
          });
        }
      }
      this.productData = assembleData;
      this.assemblyAttr(this.productData);
      console.log("改造后的数据", this.productData);
    },

    //输入框获得焦点
    focusWeightFocus(e, ind, elem) {
      this.enterStatus = elem;
      this.tempObj = e;
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlur(item, name) {
      let self = this;
      this.inputIndOne = "";

      if (name == "editSuttle") {
        if (item.editSuttle == undefined) {
          return;
        }
        item.editSuttle = String(item.editSuttle).trim();
        if (isNaN(item.editSuttle)) {
          this.$message.error("请输入正确的数字！");
          item.editSuttle = "";
          this.$forceUpdate();
          return;
        }

        if (item.editSuttle < 0) {
          this.$message.error("请输入正确的数字！");
          item.editSuttle = "";
          this.$forceUpdate();
          return;
        }

        if (
          item.editSuttle != "" &&
          item.editWeight != "" &&
          Number(item.editSuttle) > Number(item.editWeight)
        ) {
          this.$message.error("抱歉，输入的净重不能大于毛重！");
          // item.editSuttle = "";
          item.editWeight = "";
        }
        // if (
        //   item.editSuttle > item.goldWeight &&
        //   item.editSuttle != "" &&
        //   item.goldWeight != ""
        // ) {
        //   this.$message.error("输入的净重不能大于库存净重！");
        //   item.editSuttle = "";
        // }
        this.autoSelect(item, name);
      }

      if (name == "editWeight") {
        if (item.editWeight == undefined) {
          return;
        }
        item.editWeight = String(item.editWeight).trim();
        if (isNaN(item.editWeight)) {
          this.$message.error("请输入正确的数字！");
          item.editWeight = "";
          this.$forceUpdate();
          return;
        }

        if (item.editWeight < 0) {
          this.$message.error("请输入正确的数字！");
          item.editWeight = "";
          this.$forceUpdate();
          return;
        }

        if (
          item.editSuttle != "" &&
          item.editWeight != "" &&
          Number(item.editSuttle) > Number(item.editWeight)
        ) {
          this.$message.error("抱歉，输入的净重不能大于毛重！");
          // item.editSuttle = "";
          item.editWeight = "";
        }

        // if (
        //   item.editWeight > item.copyGoldWeight &&
        //   item.editWeight != "" &&
        //   item.copyGoldWeight != ""
        // ) {
        //   this.$message.error("输入的毛重不能大于库存毛重！");
        //   item.editWeight = "";
        // }
      }
      this.$forceUpdate();
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "") {
        self.$message.error("调拨净重或调拨毛重没有被焦点选中！");
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
      if (self.enterStatus === "净重") {
        self.productData.forEach(ielem => {
          if (ielem.proNumber === self.tempObj.proNumber) {
            ielem.editSuttle = parseFloat(elem);
          }
        });
      }
      if (self.enterStatus === "毛重") {
        self.productData.forEach(ielem => {
          if (ielem.proNumber === self.tempObj.proNumber) {
            ielem.editWeight = parseFloat(elem);
          }
        });
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
    //获取产品数据
    getProductData() {
      let self = this;
      let params = {
        goldCode: "",
        one: "",
        processCode: "",
        proName: "",
        car: "",
        effectCode: "",
        conditi: "",
        storeId: "",
        factoryId: "",
        page: this.page,
        rows: this.rows
      };
      self.loadingType = true;
      if (this.page === 1 && this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      }
      Object.assign(params, this.afferentData, this.searchData);
      params.proName = params.search;
      params.storeId = this.searchDataOld
        ? this.searchDataOld.send
        : params.storeId;
      return new Promise((resolve, reject) => {
        this.$api
          .urlPost(
            this.$portMain + "/proCommonController/repertoryShowList",
            params
          )
          .then(res => {
            this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
            const {
              data,
              data: { data: list }
            } = res.data;
            let listOne = list ? list : [];
            listOne.forEach(item => {
              item.checked = false;
              item.remarkReason = [];
              item.remark = "";
              item.skuNum = "";
              item.copyGoldWeight = item.goldWeight;
            });
            if (self.confirmProdcutData.length > 0) {
              self.confirmProdcutData.forEach(item => {
                listOne.forEach(it => {
                  if (item.proNumber == it.proNumber) {
                    it.amount = Number(it.amount) - Number(item.skuNum);
                    it.goldWeight = self.$api.returnFloatNum(
                      Number(it.goldWeight) - Number(item.editSuttle)
                    );
                    it.copyGoldWeight = self.$api.returnFloatNum(
                      Number(it.copyGoldWeight) - Number(item.editWeight)
                    );
                  }
                });
              });
            }
            if (listOne && listOne.length > 0) {
              // console.log("aaa:",listOne,self.page)
              self.productData =
                self.page === 1 ? listOne : self.productData.concat(listOne);
              self.assemblyAttr(self.productData);
              resolve();
            } else {
              reject();
            }

            this.$forceUpdate();
            self.loadingType = false;
            self.proData.rowSize = res.data.data.rowSize;
            // self.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          })
          .catch(err => {
            reject();
            self.$message.error(err.data.msg);
            self.loadingType = false;
          });
      });
    },
    //组装套装属性
    assemblyAttr(elem) {
      elem.forEach(outItem => {
        if (outItem.oneItemsCode == "TZ") {
          outItem.map.proList.forEach(item => {
            item.codeList = [];
            if (item.goldCode) {
              //材质
              item.codeList.push(item.goldCode);
            }
            if (item.condit) {
              //成色
              item.codeList.push(item.condit);
            }
            if (item.oneName) {
              //类别
              item.codeList.push(item.oneName);
            }
            if (item.effect) {
              //工艺
              item.codeList.push(item.effect);
            }
            if (item.processCode) {
              //生产工艺
              item.codeList.push(item.processCode);
            }
            item.codeTxt = item.codeList.join(",");
          });
        }
      });
    },
    //数量校验
    checkNumber(item, name) {
      if (name == "skuNum" && item.skuNum !== undefined) {
        item.skuNum = String(item.skuNum).trim();
        if (isNaN(item.skuNum)) {
          this.$message.error("请输入正确的数字！");
          item.skuNum = "";
          this.$forceUpdate();
          return;
        }

        if (item.storeAmount == undefined && item.skuNum > item.amount) {
          this.$message.error("抱歉剩余库存不够，请重新输入数量！");
          item.skuNum = "";
          this.$forceUpdate();
          return;
        } else if (
          item.storeAmount != undefined &&
          item.skuNum > item.storeAmount
        ) {
          this.$message.error("抱歉剩余库存不够，请重新输入数量！");
          item.skuNum = "";
          this.$forceUpdate();
          return;
        }

        if (item.skuNum < 0) {
          this.$message.error("请输入正确的数字！");
          item.skuNum = "";
          this.$forceUpdate();
          return;
        }
        item.skuNum = ~~item.skuNum;

        // item.skuWeight = Number(item.weight) * Number(item.skuNum);
        // item.skuNoteWeight = Number(item.weight) * Number(item.skuNum);
        this.autoSelect(item, name);
      }

      if (name == "allocation") {
        item[name] = item[name].trim();
        if (isNaN(item[name])) {
          this.$message.error("请输入正确的数字！");
          item[name] = "";
          this.$forceUpdate();
          return;
        }
      }
    },
    //确定选中
    selecteFun() {
      let self = this;
      let checkResult,
        selectProduct = [],
        numTF = true,
        resultOne = false;
      this.productData.forEach(item => {
        if (item.checked) {
          if (
            (item.skuNum <= 0 ||
              item.editSuttle <= 0 ||
              // item.editWeight <= 0 ||
              !item.skuNum ||
              item.skuNum === null ||
              !item.editSuttle ||
              item.editSuttle === null) &&
            //   || !item.editWeight || item.editWeight === null
            this.companyName.type === "FICTITIOUS"
          ) {
            numTF = false;
          }
          if (!item.editWeight) {
            item.editWeight = item.editSuttle;
          }
          if (
            (item.skuNum <= 0 || !item.skuNum || item.skuNum === null) &&
            this.companyName.type === "NORMAL"
          ) {
            numTF = false;
          }
          if (this.companyName.type === "NORMAL") {
            item.editSuttle = Number(item.weight) * Number(item.skuNum);
            item.editWeight = item.editSuttle;
          }
          selectProduct.push(item);
        }
      });

      if (selectProduct.length == 0) {
        this.$message.error("请选择产品！");
        return;
      }

      selectProduct.forEach(item => {
        if (!item.skuNum) {
          checkResult = true;
        }
        if (item.storeAmount != undefined && item.skuNum > item.storeAmount) {
          resultOne = true;
        }
      });

      if (checkResult) {
        this.$message.error("请输入选中产品的数量！");
        return;
      }

      if (resultOne) {
        this.$message.error("抱歉，剩余库存数量不够，请重新选择数量！");
        return;
      }

      if (!numTF) {
        this.$message.error(
          "输入数量、净重、毛重不能为负数或未填，请重新输入提交！"
        );

        return false;
      }
      //用于校验一包里面只能有同一个成色
      selectProduct.forEach(item => {
        if (item.conditi == "997") {
          item.conditiName = "足金";
        } else {
          item.conditiName = `足金${item.conditi}`;
        }
      });

      if (this.dialogVisible) {
        this.$emit("confirmProdcut", selectProduct, this.orderInfo);
      }

      this.dialogVisible = false;
    },
    //重新渲染页面
    changeSkuNum(elem) {
      this.$forceUpdate();
    },
    //下拉滚动
    infiniteHandler($state) {
      if (this.searchData.orderTxt) {
        $state.complete();
        return;
      }
      if (this.productData.length >= this.proData.rowSize) {
        $state.complete();
      } else {
        this.getProductData()
          .then(res => {
            if (this.productData.length < this.proData.rowSize) {
              this.page = this.page + 1;
            }

            $state.loaded();
          })
          .catch(err => {
            $state.complete();
          });
      }
    },
    //选择
    changeFun(val) {
      this.$forceUpdate();
    },
    // 自动选中
    autoSelect(item, name) {
      if (this.companyName.type === "FICTITIOUS") {
        //虚拟仓
        if (
          item.skuNum != undefined &&
          item.skuNum != "" &&
          item.skuNum != 0 &&
          item.editSuttle != undefined &&
          item.editSuttle != "" &&
          item.editSuttle != 0
        ) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      }
      if (this.companyName.type === "NORMAL") {
        //库位仓
        if (item.skuNum != undefined && item.skuNum != "" && item.skuNum != 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      }
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
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
          item.remarkReason = data;
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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

  .width160 {
    width: 160px;
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
    height: 580px;
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
