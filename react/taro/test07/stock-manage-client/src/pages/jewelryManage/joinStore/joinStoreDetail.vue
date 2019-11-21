<template>
  <div>
    <section>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
        <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
        <el-breadcrumb-item>入库-入库详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="hr" />
      <!-- 头部 -->
      <el-table :data="headTableData" style="width: 100%">
        <el-table-column prop="bizNo" label="入库单号"></el-table-column>
        <el-table-column prop="bizTypeName" label="入库类型"></el-table-column>
        <el-table-column prop="sourceInvoiceNo" label="原单号"></el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)"></el-table-column>
        <!-- <el-table-column prop="weight" label="毛重(g)"></el-table-column> -->
        <!-- <el-table-column prop label="工费(￥)">
          <template slot-scope="scope">
            <span>--</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="creator" label="操作人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="invoiceStatuValue" label="订单状态">
          <template slot-scope="scope">
            <span v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
            <!-- <span style="color:#F26D0F">{{scope.row.invoiceStatuValue}}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="noteWrap" v-if="allData.bizInvoice.invoiceMark">
        <span>入库原因：</span>
        {{allData.bizInvoice.invoiceMark}}
      </div>
      <div class="noteWrap" v-if="allData.bizInvoice.invoiceEcho">
        <span>驳回原因：</span>
        {{allData.bizInvoice.invoiceEcho}}
      </div>
      <div class="bigLine"></div>
    </section>

    <!-- 详细信息 -->
    <section class="infoWrap">
      <div style="display:flex">
        <JeweBalanceAccount :customerId="allData.bizInvoice.initiatorId"></JeweBalanceAccount>
        <div class="btn" style="flex:1">
          <ButtonList
            :bizAuxiliary="allData.bizAuxiliary"
            @operationFun="operationFun"
            @submitData="submitData"
            :printTimes="printData.print"
          ></ButtonList>
        </div>
      </div>

      <div class="flexB" v-if="allData.bizInvoice.invoiceStatu != 'DRAFT'">
        <!-- 流程图 -->
        <div class="steps">
          <Steps :data="stepData"></Steps>
        </div>
        <div class="empty"></div>
      </div>

      <!-- 出库详情弹框 -->
      <CreatedJoinStoreDetail
        :dialogType="dialogType"
        :basic="allData"
        @submitPrintFun="submitPrintFun"
      ></CreatedJoinStoreDetail>

      <JoinStoreDetailModal
        :dialogType="dialogTypeRead"
        :basic="printData"
        @submitPrintFun="printFun"
      ></JoinStoreDetailModal>

      <div class="productWrap" v-if="proShow">
        <!-- 产品 -->
        <JoinProductItemTwo
          v-for="(item,index) in proList"
          :key="index"
          :orderDetail="allData.bizInvoice"
          @printFun="printFunTwo"
          :productData="item"
        ></JoinProductItemTwo>
      </div>
    </section>
    <!-- 确认出库打印 -->
    <div v-show="false">
      <printTPJoinStore :billData="printData" ref="myComp"></printTPJoinStore>
    </div>
    <!-- 确认出库打印 -->
    <!-- 打印sku开始 -->
    <div v-show="false">
      <printTPSkuFive :billData="printDataTwo" ref="myCompTwo"></printTPSkuFive>
    </div>
    <!-- 打印sku结束 -->
  </div>
</template>

<script>
import {
  ProductItem,
  JoinProductItemTwo,
  CreatedJoinStoreDetail,
  JoinStoreDetailModal
} from "../joinStore/acommon/index";

export default {
  components: {
    ProductItem,
    JoinProductItemTwo,
    CreatedJoinStoreDetail,
    JoinStoreDetailModal
  },
  data() {
    return {
      dialogType: false,
      dialogTypeRead: false,
      proStockDetail: ``,
      proStockDetailParams: {},
      bizNo: ``, //入库单号
      allData: {
        bizPro: [],
        bizInvoice: {},
        bizAuxiliary: {}
      },
      proList: [],
      headTableData: [], //头部表格
      stepData: [], // 流程图数据
      printData: {
        print: ``
      }, // 打印数据
      printDataBack: {}, // 打印数据回填
      putStockVorifyParams: {}, // 推进流程的参数
      isCRW: false,

      goldPricePropsList: [],
      printDataTwo: {}, //打印一维码数据

      proShow: false
    };
  },

  created() {
    this.bizNo = this.$route.query.bizNo; // 获取页面数据
    this.getBasePrice().then(res => {
      this.getData();
    });
  },

  mounted() {},
  methods: {
    async getData() {
      await this.displayAllData();
      await this.getPrintDetail();
    },

    displayAllData() {
      let params = {
        PRS: {
          bizNo: this.bizNo
        }
      };
      return this.$axios
        .get(this.$portMain + "/putStock/get", params)
        .then(res => {
          if (res.data.code == 200) {
            this.allData = res.data.data;
            this.hanldHeader(); // 处理头部信息
            this.hanldTableLeft(); // 处理弹窗营销品类 备注
            this.hanldProList(); // 处理产品属性
            this.hanldPrintInvoice(); // 处理bizInvoice打印信息
            this.getProcessData(); // 处理流程
            this.isCRWFun(); // 判断是否是红冲单
            this.proList = [...this.allData.bizPro];
            this.proShow = false;
            this.$nextTick(() => {
              this.proShow = new Date();
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    // 处理bizInvoice打印信息
    hanldPrintInvoice() {
      const { area = "", financialCode = "" } = this.allData;
      let obj = {
        area,
        financialCode
      };
      this.allData.bizInvoice = { ...this.allData.bizInvoice, ...obj };
    },

    // 处理产品属性
    hanldProList() {
      this.allData.bizPro.forEach(ielem => {
        ielem.facFeeType = ielem.proSpecData.factFeeType;
        ielem.piecePrice = ielem.proSpecData.piecePrice;
        ielem.price = ielem.proSpecData.price;
        ielem.feeType = ielem.proSpecData.feeType;
        ielem.additionPrice = ielem.proSpecData.additionPrice;
        ielem.feePrice = ielem.proSpecData.feePrice;
        ielem.basePrice = this.setBasePrice(ielem.proSpecData.conditi);
      });
    },

    // 处理头部信息
    hanldHeader() {
      this.headTableData = [this.allData.bizInvoice];
      this.headTableData.forEach(item => {
        let date = new Date(item.createDate);
        if (date) {
          item.createDate = this.$api.dateGetDayTime(date);
        } else {
          item.createDate = this.$api.dateGetDayTime(item.createDate);
        }
      });
    },

    // 处理弹窗营销品类 备注
    hanldTableLeft() {
      this.allData.bizPro.forEach(item => {
        item.remark = item.remark ? item.remark.split(",") : "";
        item.marketingCategoryName = item.proBasics.marketingCategoryName;
        item.conditi = item.proSpecData.conditi;
      });
    },

    // 判断是否是红冲单
    isCRWFun() {
      const {
        allData: {
          bizInvoice: { bizType, lineId }
        }
      } = this;
      let obj = {
        RECEIVE_FACTORY: false,
        RECEIVE_FACTORY_HC: true,
        RECEIVE_CLIENT: false,
        RECEIVE_CLIENT_HC: true
      };
      this.isCRW = obj[bizType];
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
    printFunTwo(elem) {
      this.printDataTwo = elem;
      this.$refs.myCompTwo.compPrintFun();
    },

    // 红冲单将打印数据格式
    CRWPrintData() {
      if (this.isCRW) {
        this.printData.tableLeft.forEach(item => {
          item.weight = 0 - item.weight;
        });
        this.printData.tableRight.forEach(item => {
          item.ceditWeight = 0 - item.ceditWeight;
          item.ceditMoney = 0 - item.ceditMoney;
        });
      }
    },

    // 基础工费
    getBasePrice() {
      return this.$axios
        .get(this.$portMain + "/stock/goldprice/order/wageprice")
        .then(res => {
          const {
            data: { goldPriceProps }
          } = res.data;
          if (goldPriceProps) {
            this.goldPricePropsList = goldPriceProps;
          } else {
            this.$message.error(`基础工费不能为空`);
          }
        });
    },

    // 获取打印明细 数据回填
    getPrintDetail() {
      const {
        allData: {
          bizInvoice: { bizType, sourceInvoiceNo }
        }
      } = this;
      let params = {
        BizNo: this.isCRW ? sourceInvoiceNo : this.bizNo
      };
      return this.$api
        .urlPost(this.$portMain + "/biz/intoutBill/getDefaultBillDate", params)
        .then(res => {
          if (res.data.data) {
            const { data } = res.data;
            const {
              bizInvoice: { print }
            } = this.allData;
            this.printData = JSON.parse(data);
            this.printData.print = print ? print : 0;
            this.CRWPrintData();
          }
        });
    },

    //操作事件
    operationFun(elem) {
      const { value } = elem;
      if (value === "WRITE") {
        this.editFun();
      }
      if (value === "PRINT") {
        this.dialogTypeRead = new Date().getTime();
      }
    },

    //编辑
    editFun() {
      this.$router.push({
        path: "joinStoreEdit",
        query: { bizNo: this.bizNo }
      });
    },

    //获取流程数据
    getProcessData() {
      const {
        bizInvoice: { bizType }
      } = this.allData;
      let params = {
        bizNo: this.bizNo,
        bizType
      };
      this.$api.formdataPostFun(
        this.$portMain + "/process/selectProcessManageInfo",
        params,
        res => {
          this.stepData = res.data;
        },
        err => {
          this.$message.error(err.msg);
          this.stepData = [];
        }
      );
    },

    //按钮提交
    submitData(e) {
      if (e.actionSign === "REJECT") {
        this.toExamineFun(e.actionSign);
        return;
      }
      if (e.actionSign === `STOCKIN`) {
        this.toShowPrint(e.actionSign);
        return;
      }
      if (e.actionSign !== `REJECT`) {
        this.toRCW(e.actionSign);
        return;
      }
    },

    //  打印弹窗
    toShowPrint() {
      this.dialogType = new Date().getTime();
    },

    // 获取打印数据
    getPrintData(e) {
      let tableLeft = [],
        tableRight = [];
      tableLeft = JSON.parse(JSON.stringify(this.allData.bizPro));
      tableRight = e || [];
      this.printData = {
        ...this.allData.bizInvoice,
        tableLeft,
        tableRight
      };
    },

    // 页面提交打印 回填打印
    printFun() {
      this.addPrint();
      this.$refs.myComp.compPrintFun();
      this.printData.print++;
    },

    // 弹窗提交打印
    submitPrintFun(e) {
      const { val, params } = e;
      this.proStockDetail = val;
      this.proStockDetailParams = params;
      this.getPrintData(val);
      this.getPrintParams();
      this.putStockVorify(`STOCKIN`, `print`).then((res, hanld) => {
        this.dialogType = false;
        this.addPrint().then(res => {
          this.getData();
        });
        this.$refs.myComp.compPrintFun();
      });
    },

    // 操作提示
    toRCW(opreateType) {
      this.$confirm("是否确认操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.getDefParams();
        this.putStockVorify(opreateType);
      });
    },

    // 获取打印参数
    getPrintParams() {
      this.getDefParams();
      let obj = {
        fromDiv: JSON.stringify({
          ...{ name: "入库明细", value: "入库" },
          ...this.printData
        }),
        proStockDetail: JSON.stringify(this.proStockDetailParams)
      };
      //   console.log(obj, this.printData);
      this.putStockVorifyParams = { ...this.putStockVorifyParams, ...obj };
    },

    // 获取其他推进流程参数
    getDefParams() {
      this.putStockVorifyParams = {
        bizNo: this.bizNo,
        invoiceEcho: this.rejectReson || ``
      };
    },

    // 增加单据打印次数
    addPrint() {
      let params = {
        PRS: {
          bizNo: this.bizNo
        }
      };
      return this.$axios.get(
        this.$portMain + "/transferController/addPrint",
        params
      );
    },

    // 修改单据状态
    putStockVorify(statu, hanld) {
      let obj = {
        statu
      };
      let params = { ...this.putStockVorifyParams, ...obj };
      console.log(params, params.proStockDetail);
      //   return Promise.resolve();
      return new Promise((resolve, reject) => {
        this.$api
          .urlPost(this.$portMain + "/putStock/vorify", params)
          .then(res => {
            if (res.data.code === 200) {
              resolve(res, hanld);
              this.$message.success(res.data.msg);
              if (hanld === "print") {
                return;
              }
              this.$router.go(-1);
            } else {
              reject(res);
              this.$message.error(res.data.msg);
            }
          });
      });
    },

    //审核驳回
    toExamineFun(opreateType) {
      this.$prompt("请输入驳回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea"
      }).then(({ value }) => {
        if (!this.$v.valiEmpty(value)) {
          this.$message.error(`输入不能为空`);
          return;
        }
        this.rejectReson = value;
        this.getDefParams();
        this.putStockVorify(opreateType);
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrap {
  padding: 20px;
}

.flexB {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.steps {
  flex: 1;
}

.empty {
  flex: 1;
}

.btn {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.btnItem {
  margin-left: 24px;
}

.listTit {
  font-weight: blod;
  font-size: 16px;
  margin-top: 50px;
  margin-bottom: 16px;
}

.infoWrap {
  padding: 20px;
}

.noteWrap {
  font-size: 16px;
  font-weight: 400;
  color: #232426;
  margin: 22px 0;

  span {
    color: #8A9199;
  }
}

.refreshHead {
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;

  span {
    color: red;
  }

  .itemWrap {
    margin: 0 33px;
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
</style>
