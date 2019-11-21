<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>转料-新增转料</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div>
      <OrnamentBizType
        title="转料"
        mode="TRANSFER"
        :orderDetail="searchData"
        :bizTypeBack="bizTypeBack"
        :loadingTF="loadingBtn"
        :disabled="pageStatus === 'edit'"
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
        <O2mProductItemOne
          v-for="(item,index) in confirmProdcutData"
          :key="index"
          :productData="item"
          :afferentData="searchData"
          @deleteProduct="deleteProduct"
          @addPackFun="addPackFun"
        ></O2mProductItemOne>
      </div>

      <!-- 添加产品 -->
      <div v-if="dialogType">
        <O2mAddProductsOne
          :dialogType="dialogType"
          :companyName="searchData.sendItem"
          :afferentData="showModalData"
          :searchDataOld="searchData"
          :confirmProdcutData="backUpConfirmProdcutData"
          :loadingTF="loadingTF"
          @confirmProdcut="confirmProdcutFun"
          @close="closeFun"
        ></O2mAddProductsOne>
      </div>
    </div>
  </div>
</template>
<script>
import { O2mProductItemOne, O2mAddProductsOne } from "./acommon/index";

export default {
  components: {
    O2mProductItemOne,
    O2mAddProductsOne
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
  // RECEIVED("已转料")
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
      title: "转料",
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
      }
    };
  },

  created() {
    const { bizNo } = this.$route.query;
    if (bizNo) {
      this.backData.bizNo = bizNo;
      this.pageStatus = `edit`;
      //   this.getBackData();
    }
    this.created_fun();
  },

  methods: {
    created_fun() {
      this.getBasicData();
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
          feeType: item.proSpecData.feeType,
          additionPrice: item.proSpecData.additionPrice,
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

    //添加产品(弹框)
    addProductDialog() {
      if (this.searchData.send == "" || !this.searchData.send) {
        this.$message.error("请选择发起单位！");
        return true;
      }
      if (this.searchData.receive == "" || !this.searchData.receive) {
        this.$message.error("请选择接收单位！");
        return true;
      }
      this.dialogType = new Date().getTime();
    },

    //数据修改时传值
    emitData(options) {
      console.log(options);
      this.searchData = options;
    },

    clearProData() {
      this.confirmProdcutData = [];
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

      if (options.send == "") {
        this.$message.error("请选择发起单位！");
        return true;
      }

      if (options.receive == "") {
        this.$message.error("请选择接收单位！");
        return true;
      }

      if (this.confirmProdcutData.length === 0) {
        this.$message.error("请选择转料的产品！");
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
      if (!pros.every(item => item.conditi === pros[0].conditi)) {
        this.$message.error(`抱歉，转料单只能同时转料同金料成色的产品！`);
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

    //取消返回转料列表页
    cancelData(options) {
      this.$router.go(-1);
    },

    //sku筛选 todo
    searchFun(elem) {
      const { backProList } = elem;
      this.confirmProdcutData = backProList;
    },

    // 合并产品列表
    mergeArr(arr1, arr2) {
      let arr = [];
      for (let item of arr1) {
        for (let it of arr2) {
          if (item.proNumber === it.proNumber) {
            item.amounts += it.amounts;
            item.suttle += it.suttle;
            item.skuRemarks = `${item.skuRemarks ? `${item.skuRemarks};` : ``}${
              it.skuRemarks
            }`;
            item.resion = [...new Set(item.resion.concat(it.resion))];
          }
        }
      }
      arr = arr1.concat(arr2);
      return this.$api.removeRepeat(arr, `proNumber`);
    },

    // 合并产品列表
    filterArr(elem) {
      let arr = [...elem];
      var ret = [];
      for (var i = 0; i <= arr.length - 1; i++) {
        var textTF = true;
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].proNumber == arr[j].proNumber) {
            arr[j].skuNum = Number(arr[i].skuNum) + Number(arr[j].skuNum);
            arr[j].editSuttle = (
              Number(arr[i].editSuttle) + Number(arr[j].editSuttle)
            ).toFixed(2);
            arr[j].editWeight = (
              Number(arr[i].editWeight) + Number(arr[j].editWeight)
            ).toFixed(2);
            arr[j].remark = `${arr[i].remark ? `${arr[i].remark};` : ``}${
              arr[j].remark
            }`;
            arr[j].resion = [...new Set(arr[i].resion.concat(arr[j].resion))];
            textTF = false;
            break;
          }
        }
        if (textTF) {
          ret.push(arr[i]);
        }
      }
      return ret;
    },

    //确认选中
    confirmProdcutFun(elem, orderInfo) {
      this.loadingTF = true;
      if (this.confirmProdcutData.length == 0) {
        this.confirmProdcutData = elem;
      } else {
        let newArr = [
          ...JSON.parse(JSON.stringify(this.confirmProdcutData)),
          ...JSON.parse(JSON.stringify(elem))
        ];
        this.confirmProdcutData = this.filterArr(newArr);
      }

      this.confirmProdcutData.forEach(item => {
        item.editSuttle = Number(item.editSuttle).toFixed(2);
        item.editWeight = Number(item.editWeight).toFixed(2);
      });

      let backArr = [
        ...JSON.parse(JSON.stringify(this.backUpConfirmProdcutData)),
        ...JSON.parse(JSON.stringify(elem))
      ];
      this.backUpConfirmProdcutData = this.filterArr(backArr);

      //引入单据号
      if (orderInfo.orderNo) {
        this.orderInfoData = orderInfo;
      }

      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
        this.loadingTF = false;
      });

      //   this.orderInfo = orderInfo ? orderInfo : {};
      //   if (this.confirmProdcutData.length == 0) {
      //     this.confirmProdcutData = elem;
      //   } else {
      //     let arr = this.mergeArr(this.confirmProdcutData, elem);
      //     this.confirmProdcutData = arr;
      //   }
      //   this.backUpConfirmProdcutData = [...this.confirmProdcutData];
      //   this.productItemOneType = false;
      //   this.$nextTick(() => {
      //     this.productItemOneType = true;
      //   });
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
