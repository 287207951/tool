<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库-新增入库</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div>
      <OrnamentBizType
        title="入库"
        mode="STOCK_IN"
        :proList="confirmProdcutData"
        selectClick="1"
        :orderDetail="searchData"
        :bizTypeBack="bizTypeBack"
        :loadingTF="loadingBtn"
        @change="emitData"
        @submitData="submitData"
        @cancelData="cancelData"
        @launchChange="clearProData"
      ></OrnamentBizType>
      <div class="bigLine"></div>
    </div>

    <div class="productWrap">
      <div class="skuTitel">已选SKU</div>
      <SkuScreen @suitSearch="searchFun" :proList="confirmProdcutData">
        <el-button type="primary" size="small" plain @click="addProductDialog">添加产品</el-button>
      </SkuScreen>

      <div style="height: 10px"></div>

      <!-- 产品 -->
      <div v-if="productItemOneType">
        <ProductItem
          v-for="(item,index) in confirmProdcutData"
          :key="index"
          :productData="item"
          :afferentData="searchData"
          @printFun="printFun"
          @deleteProduct="deleteProduct"
          @addPackFun="addPackFun"
        ></ProductItem>
      </div>

      <!-- 添加产品 -->
      <div v-if="dialogType">
        <AddProducts
          :dialogType="true"
          :companyName="searchData.sendItem.txt"
          :afferentData="showModalData"
          :searchDataOld="searchData"
          :inStock="true"
          :goldPricePropsList="goldPricePropsList"
          :confirmProdcutData="backUpConfirmProdcutData"
          :loadingTF="loadingTF"
          @confirmProdcut="confirmProdcut"
          @close="closeFun"
        ></AddProducts>
      </div>
    </div>
    <!-- 打印sku开始 -->
    <div v-show="false">
      <printTPSkuFive :billData="printData" ref="printTPTwo"></printTPSkuFive>
    </div>
    <!-- 打印sku结束 -->
  </div>
</template>
<script>
import { AddProducts, ProductItem } from "./acommon/index";

export default {
  components: {
    AddProducts,
    ProductItem
  },

  // 单据状态 DRAFT("制单")
  // DISCARD("已作废")
  // WAITCONFIRM("待审核")
  // CONFIRMED("已审核")
  // STOCKUP("已备货")
  // REJECT("已驳回")
  // EXREPO("已出库")
  // SIGNIN("已签收")
  // REFUSAL("已拒签")
  // WEIGHING("已复称")
  // COUNTER("已上柜")
  // PICKING("已拣货")
  // RECEIVED("已入库")
  // RCW("已红冲")

  data() {
    return {
      loadingBtn: false,
      searchData: {
        sendItem: {
          txt: "1"
        }
      },
      bizTypeBack: ``,
      showModalData: {}, // 弹窗数据
      // 头部筛选数据
      productItemOneType: false,
      title: "入库",
      productData: [], //产品数据
      dialogType: "", //添加产品状态
      mock: "",
      mockData: [],
      loadingState: false,
      currentRow: null, //选中的包
      basicData: [], //基础数据
      confirmProdcutData: [], //确认的产品
      backUpConfirmProdcutData: [], //确认的产品
      orderInfo: {
        orderNo: ``,
        orderType: ``,
        oriOrderNo: ``
      },
      loadingTF: false,

      // 回填数据
      backData: {
        bizNo: "",
        editData: {}
      },

      // edit create
      pageStatus: `create`,

      // 页面状态对应的按钮操作
      btnObj: {
        pageBtnStatus: `save`,
        btnHanld: {
          save: `sendApiSave`,
          saveEdit: `sendApiUpdate`,
          create: `sendApiNew`
        }
      },

      goldPricePropsList: [],
      printData: {}
    };
  },

  created() {
    const { bizNo } = this.$route.query;
    if (bizNo) {
      this.backData.bizNo = bizNo;
      this.pageStatus = `edit`;
      this.getBasePrice().then(res => {
        this.getBackData();
      });
    } else {
      this.created_fun();
    }
  },

  methods: {
    created_fun() {
      this.getBasePrice().then(res => {
        this.getBasicData();
      });
    },

    getBackData() {
      const { bizNo } = this.backData;
      let params = {
        PRS: {
          bizNo
        }
      };
      this.$axios.get(this.$portMain + "/putStock/get", params).then(res => {
        if (res.data.code == 200) {
          this.backData.editData = res.data.data;
          this.bizTypeBack = this.backData.editData.bizInvoice.bizType;
          this.backfillHeadFun();
          this.assemblePackData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 头部数据回填
    backfillHeadFun() {
      const {
        editData: {
          bizInvoice: {
            bizType,
            initiator,
            initiatorId,
            recipientRepoId,
            recipientId,
            recipient: receiveName,
            invoiceMark: remark
          }
        }
      } = this.backData;
      this.searchData = {
        bizType,
        send: Number(initiatorId),
        receive: Number(recipientRepoId),
        sendItem: {
          txt: initiator,
          val: Number(initiatorId)
        },
        receiveItem: {
          id: Number(recipientRepoId),
          name: receiveName,
          txt: receiveName,
          val: Number(recipientRepoId),
          secId: recipientId
        },
        remark
      };
    },

    //数据组装
    assemblePackData() {
      this.confirmProdcutData = [];
      const {
        editData: { bizPro }
      } = this.backData;
      bizPro.forEach(item => {
        this.confirmProdcutData.push({
          amounts: item.amount,
          suttle: item.suttle,
          proName: item.proName,
          proNumber: item.skuId,
          one: item.proBasics.one,
          oneItemsCode: item.proBasics.oneItemsCode,
          conditi: item.proSpecData.conditi,
          weight: item.proSpecData.weight,
          price: item.proSpecData.price,
          extendAttr: item.proSpecData.extendAttr,
          url: item.proBasics.pic,
          id: item.proBasics.id,
          facFeeType: item.proSpecData.factFeeType,
          piecePrice: item.proSpecData.piecePrice,
          price: item.proSpecData.price,
          feeType: item.proSpecData.feeType,
          feePrice: item.proSpecData.feePrice,
          additionPrice: item.proSpecData.additionPrice,
          basePrice: this.setBasePrice(item.proSpecData.conditi),
          factoryName: "",
          factoryId: "",
          goldCode: item.proBasics.goldCode,
          skuNum: item.amount,
          goldWeight: item.suttle,
          resion: item.remark.split(","),
          skuRemarks: item.remarkReason,
          map: {
            proList: item.proSpecData.ProList
          }
        });
      });
      this.backUpConfirmProdcutData = [...this.confirmProdcutData];
      this.editProductData = [...this.confirmProdcutData];
      this.productItemOneType = true;
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
      // console.log(basePrice, conditi);
      return basePrice;
    },

    //获取基础数据
    getBasicData() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/proCommonController/code")
        .then(function(res) {
          if (res.data.code == 200) {
            self.basicData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    // 添加产品(弹框)
    addProductDialog() {
      if (this.searchData.send == "" || !this.searchData.send) {
        this.$message.error("请选择发起单位！");
        return true;
      }
      if (this.searchData.receive == "" || !this.searchData.receive) {
        this.$message.error("请选择接收单位！");
        return true;
      }
      this.showModalData = JSON.parse(JSON.stringify(this.searchData));
      if (this.searchData.bizType !== `RECEIVE_FACTORY`) {
        delete this.showModalData.sendItem.val;
      }
      this.dialogType = new Date().getTime();
    },

    // 数据修改时传值
    emitData(options) {
      // console.log(options);
      this.searchData = options;
    },
    // 当有数据时加上确定操作

    clearProData() {
      this.confirmProdcutData = [];
    },
    // 点击“提交”传值
    printFun(elem) {
      this.printData = elem;
      // console.log(elem)
      this.$refs.printTPTwo.compPrintFun();
    },
    //点击“提交”传值
    submitData(options) {
      const { pageStatus } = this;
      const { btnStatus } = options;
      if (this.checkSubmitData(options)) {
        return;
      }
      if (pageStatus === `create`) {
        this.btnObj.pageBtnStatus = `save`;
      }
      if (pageStatus === `edit`) {
        this.btnObj.pageBtnStatus = `saveEdit`;
      }
      this.submitFun(options);
    },

    //校验提交
    checkSubmitData(options) {
      let contentResult = false;
      if (options.bizType == "") {
        this.$message.error("请选择入库类型！");
        return true;
      }

      if (options.send == "") {
        this.$message.error("请选择发起单位！");
        return true;
      }

      if (options.receive == "") {
        this.$message.error("请选择接收单位！");
        return true;
      }

      if (this.confirmProdcutData.length === 0) {
        this.$message.error("请选择入库的产品！");
        return true;
      }
    },

    submitFun(options) {
      const {
        pageStatus,
        backData: { bizNo },
        btnObj: { btnHanld, pageBtnStatus }
      } = this;

      const {
        receiveItem: {
          id: recipientRepoId,
          name: recipient,
          secId: recipientId
        },
        sendItem: { val: initiatorId, txt: initiator },
        bizType,
        remark: invoiceMark,
        btnStatus: invoiceStatu
      } = options;

      //未打包
      let pros = [];
      this.backUpConfirmProdcutData.forEach(item => {
        pros.push({
          conditi: item.conditi,
          proId: item.id,
          proName: item.proName,
          weight: item.weight,
          skuId: item.proNumber ? item.proNumber : item.skuId,
          amount: item.amounts,
          suttle: item.suttle,
          remark: item.resion ? item.resion.join() : "",
          remarkReason: item.skuRemarks
        });
      });

      let params = {
        biz: {
          bizType,
          initiatorId,
          initiator,
          recipientId,
          recipient,
          invoiceMark,
          recipientRepoId,
          pros,
          invoiceStatu
        }
      };

      //产品添加引用单据号
      if (this.orderInfo.orderNo) {
        params.biz.lineId = this.orderInfo.oriOrderNo;
        params.biz.sourceInvoiceType = this.orderInfo.orderType;
        params.biz.sourceInvoiceNo = this.orderInfo.orderNo;
      }
      //产品删除引用单据号
      if (this.backUpConfirmProdcutData.length == 0) {
        this.orderInfo = {};
        delete params.biz.lineId;
        delete params.biz.sourceInvoiceType;
        delete params.biz.sourceInvoiceNo;
      }

      this[btnHanld[pageBtnStatus]](params);
    },

    valiData(options) {
      const {
        biz: { pros = [] }
      } = options;
      //   console.log(pros, pros.every(item => item.conditi === pros[0].conditi));
      if (!pros.every(item => item.conditi === pros[0].conditi)) {
        this.$message.error(`抱歉，入库单只能同时入库同金料成色的产品！`);
        return false;
      }
      return true;
    },

    // 点击保存 新建
    sendApiSave(params) {
      let self = this;
      if (!this.valiData(params)) {
        return;
      }
      self.loadingBtn = true;
      this.$axios
        .post(this.$portMain + "/putStock/create", params)
        .then(res => {
          if (res.data.code === 200) {
            self.$router.go(-1);
            self.$message.success(res.data.msg);
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          self.$message.error(err.data.msg);
        })
        .finally(res => {
          self.loadingBtn = false;
        });
    },

    // 点击提交  新建
    sendApiNew(params) {
      let self = this;
      if (!this.valiData(params)) {
        return;
      }
      self.loadingBtn = true;
      this.$axios
        .post(this.$portMain + "/putStock/create", params)
        .then(res => {
          if (res.data.code === 200) {
            self.$router.go(-1);
            self.$message.success(res.data.msg);
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          self.$message.error(err.data.msg);
        })
        .finally(res => {
          self.loadingBtn = false;
        });
    },

    // 点击保存/点击提交  修改
    sendApiUpdate(params) {
      let self = this;
      const { bizNo } = this.backData;
      //   params.biz.invoiceStatu = `DRAFT`;
      params.biz.bizNo = bizNo;
      if (!this.valiData(params)) {
        return;
      }
      self.loadingBtn = true;
      this.$axios
        .post(this.$portMain + "/putStock/update", params)
        .then(res => {
          if (res.data.code === 200) {
            self.$message.success(res.data.msg);
            self.$router.go(-1);
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          self.$message.error(err.data.msg);
        })
        .finally(res => {
          self.loadingBtn = false;
        });
    },

    closeFun() {
      this.dialogType = false;
    },

    //取消返回入库列表页
    cancelData(options) {
      if (this.confirmProdcutData.length !== 0) {
        this.$api.refClick(this).then(res => {
          this.$router.go(-1);
        });
      } else {
        this.$router.go(-1);
      }
    },

    //sku筛选 todo
    searchFun(elem) {
      // console.log(elem);
      const { backProList } = elem;
      this.confirmProdcutData = backProList;
    },

    // 合并产品列表
    mergeArr(arr1, arr2) {
      let arr = [];
      for (let item of arr1) {
        item.suttle = Number(item.suttle);
        for (let it of arr2) {
          if (item.proNumber === it.proNumber) {
            item.amounts += it.amounts;
            item.suttle += Number(it.suttle);
            item.skuRemarks = `${item.skuRemarks ? `${item.skuRemarks};` : ``}${
              it.skuRemarks
            }`;
            item.resion = [...new Set(item.resion.concat(it.resion))];
          }
        }
      }
      arr = arr1.concat(arr2);
      arr.forEach(item => {
        item.suttle = parseFloat(item.suttle.toFixed(2));
      });
      return this.$api.removeRepeat(arr, `proNumber`);
    },

    //确认选中
    confirmProdcut(elem, orderInfo) {
      let popList = JSON.parse(JSON.stringify(elem));
      popList.forEach(item => {
        item.showStatus = false;
      });
      this.loadingTF = true;
      this.orderInfo = orderInfo ? orderInfo : {};
      if (this.confirmProdcutData.length == 0) {
        this.confirmProdcutData = popList;
      } else {
        let arr = this.mergeArr(this.confirmProdcutData, popList);
        this.confirmProdcutData = arr;
      }
      this.backUpConfirmProdcutData = [...this.confirmProdcutData];
      // console.log(this.backUpConfirmProdcutData);
      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
        this.loadingTF = false;
      });
    },

    //删除产品
    deleteProduct(val) {
      let deleteIndex;
      this.confirmProdcutData.forEach((item, index) => {
        if (item.proNumber == val) {
          deleteIndex = index;
        }
      });
      this.confirmProdcutData.splice(deleteIndex, 1);
      this.backUpConfirmProdcutData = [...this.confirmProdcutData];
    },

    //表格选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },

    // 基础工费
    getBasePrice() {
      return this.$axios
        .get(this.$portMain + "/stock/goldprice/order/wageprice")
        .then(res => {
          const { goldPriceProps } = res.data.data;
          this.goldPricePropsList = goldPriceProps;
        });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.outOfStock {
  .smallTitle {
    font-size: 12px;
    font-weight: 400;
    color: #8A8E99;
  }

  .width240 {
    width: 240px;
  }

  .width100 {
    width: 100px;
  }

  .productWrap {
    margin-top: 29px;
    margin-bottom: 20px;

    .skuTitel {
      font-size: 16px;
      font-weight: bold;
      color: #232426;
      margin-bottom: 16px;
    }
  }

  .packDataWrap {
    margin-top: 29px;

    .packTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 19px;

      .title {
        font-size: 16px;
        font-weight: bold;
        color: #232426;
      }
    }
  }
}
</style>
