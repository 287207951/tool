<template>
  <div class="conBigDiv">
    <el-row>
      <el-col :span="12">
        <span class="menuTitle">开票详情</span>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="danger" size="small" plain @click="printFun">打印</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top:10px">
      <el-col :span="8">
        <span class="leftTitle">开票客户：</span>
        <span class="rightTitle">{{detailsData.customerName}}</span>
      </el-col>
      <el-col :span="8">
        <span class="leftTitle">发票号：</span>
        <span class="rightTitle">{{detailsData.invoiceCode}}</span>
      </el-col>
      <el-col :span="8">
        <span class="leftTitle">备注：</span>
        <span class="rightTitle">{{detailsData.invoiceNote}}</span>
      </el-col>
    </el-row>

    <el-row style="margin-top:10px">
      <el-col :span="8">
        <span class="leftTitle">开票类型：</span>
        <span class="rightTitle">{{detailsData.invoiceName}}</span>
      </el-col>
    </el-row>

    <div style="margin-top:16px;" class="createInvoice">
      <el-table
        :data="summaryData"
        style="width: 100%"
        border
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="明细" header-align="center">
          <el-table-column
            prop="categoryName"
            label="明细"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="detailWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="detailMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="转欠" header-align="center">
          <el-table-column
            prop="oramqWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="oramqMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="oramqPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="结价" header-align="center">
          <el-table-column
            prop="knotWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="knotMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="knotPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="结价单" header-align="center">
          <el-table-column
            prop="kontorderWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="kontorderMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="kontorderPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="批发" header-align="center">
          <el-table-column
            prop="wholesaleWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="wholesaleAmount"
            label="件数"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="wholesaleMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="wholesalePrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="加工" header-align="center">
          <el-table-column
            prop="processWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="processMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="processPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="开票总计" header-align="center">
          <el-table-column
            prop="invoiceCollectWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="invoiceCollectMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="invoiceCollectPrice"
            label="单价"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <div class="hr"/>

    <div class="createInvoice">
      <el-row style="padding-bottom: 10px;">
        <el-col :span="12">
          <span class="jewelryListTitle">饰品单</span>
        </el-col>
        <el-col :span="12" style="text-align: right;"></el-col>
      </el-row>
      <el-table
        :data="tableDataOrnament"
        style="width: 100%"
        height="242"
        border
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="明细" header-align="center">
          <el-table-column prop="orderCode" label="出库单号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="明细" header-align="center" align="center"></el-table-column>
        </el-table-column>

        <el-table-column label="结价" header-align="center">
          <el-table-column
            prop="j_invoiceNoWeight"
            label="未开票克重(g)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="j_invoiceNoMoney"
            label="未开票金额(￥)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="j_invoicePassWeight"
            label="开票克重(g)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="j_invoicePassMoney"
            label="开票金额(￥)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="j_adjustMoneyLine"
            label="调整金额(￥)"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="转欠" header-align="center">
          <el-table-column
            prop="q_invoiceNoWeight"
            label="未开票克重(g)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="q_invoiceNoMoney"
            label="未开票金额(￥)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="q_invoicePassWeight"
            label="开票克重(g)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="q_invoicePassMoney"
            label="开票金额(￥)"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="q_adjustMoneyLine"
            label="调整金额(￥)"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <div class="hr"/>
    <!-- 结价单 -->
    <div style="display:flex" class="createInvoice">
      <div style="flex:1">
        <el-row style="padding-bottom: 10px;">
          <el-col :span="12">
            <span class="jewelryListTitle">结价单</span>
          </el-col>
          <el-col :span="12" style="text-align: right;"></el-col>
        </el-row>
        <el-table
          :data="tableJunctionPrice"
          style="width: 100%"
          height="242"
          border
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column label="明细" header-align="center">
            <el-table-column prop="orderCode" label="结价单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="j_invoiceToalWeight"
              label="结价克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceToalMoney"
              label="结价金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="未开票" header-align="center">
            <el-table-column
              prop="j_invoiceNoWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceNoMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="开票" header-align="center">
            <el-table-column
              prop="j_invoicePassWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoicePassMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>

      <div class="vline"></div>
      <!-- 来料单 -->
      <div style="flex:1" class="createInvoice">
        <el-row style="padding-bottom: 10px;">
          <el-col :span="12">
            <span class="jewelryListTitle">来料单</span>
          </el-col>
          <el-col :span="12" style="text-align: right;"></el-col>
        </el-row>
        <el-table
          :data="tableIncoming"
          style="width: 100%"
          height="242"
          border
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column label="明细" header-align="center">
            <el-table-column prop="orderCode" label="结价单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="j_invoiceToalWeight"
              label="结价克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceToalMoney"
              label="结价金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="未开票" header-align="center">
            <el-table-column
              prop="j_invoiceNoWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceNoMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="开票" header-align="center">
            <el-table-column
              prop="j_invoicePassWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoicePassMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 打印 -->
    <div v-show="false">
      <InvoicePrint :billData="printData" ref="myComp"></InvoicePrint>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      printData: {},
      invoiceId: "", //开票单id

      customerList: [], //客户数据
      invoiceType: "", //查询_order 订单 _comestock 来料,_knotprice 结价

      detailsData: {}, //详情数据
      tableDataOrnament: [], //饰品单表格数据
      tableJunctionPrice: [], //结价单表格数据
      tableIncoming: [], //来料单表格数据
      summaryData: [], //生成汇总数据

      invoiceData: [
        {
          //开票类型数据
          value: "_major",
          label: "专票"
        },
        {
          value: "general ",
          label: "普票"
        }
      ],

      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.invoiceId = this.$route.query.invoiceI;
    this.getOderDetail();
  },
  methods: {
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = (Number(prev) + Number(curr)).toFixed(2);
              return res;
            } else {
              return prev.toFixed(2);
            }
          }, 0);
          sums[index] += " ";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },

    // 修改table header的背景色
    tableHeaderColor() {
      return "background-color: #EBF1F7;";
    },

    //调整款查询客户
    customerListFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/saveOweCustomerList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //查看详情开票详情
    getOderDetail() {
      var self = this;
      let params = {
        PRS: {
          invoiceId: self.invoiceId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/invoice/invoiceFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.detailsData = res.data.data;
            if (self.detailsData.invoiceType == "_general") {
              self.detailsData.invoiceName = "普票";
            } else if (self.detailsData.invoiceType == "_major") {
              self.detailsData.invoiceName = "专票";
            } else {
              self.detailsData.invoiceName = "";
            }
            // self.summaryData = res.data.data.invoiceCollects;
            self.arrangeSummaryData(res.data.data.invoiceCollects);
            self.arrangeOrnaments(res.data.data.invoicePorps);
            self.assemblejunctionPrice(res.data.data.invoicePorps);
            self.assembleIncoming(res.data.data.invoicePorps);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //处理开票汇总数据
    arrangeSummaryData(val) {
      let summaryData = [];
      val.forEach(item => {
        let startData = {
          categoryName: 0,
          detailWeight: 0,
          detailMoney: 0,
          oramqWeight: 0,
          oramqMoney: 0,
          oramqPrice: 0,
          knotWeight: 0,
          knotMoney: 0,
          knotPrice: 0,
          kontorderWeight: 0,
          kontorderMoney: 0,
          kontorderPrice: 0,
          wholesaleWeight: 0,
          wholesaleMoney: 0,
          wholesalePrice: 0,
          processWeight: 0,
          processMoney: 0,
          invoiceCollectWeight: 0,
          invoiceCollectMoney: 0,
          invoiceCollectPrice: 0,
          processPrice: 0,
          wholesaleAmount: 0
        };
        let newObj = Object.assign(startData, item);
        summaryData.push(newObj);
      });

      this.summaryData = summaryData;
    },
    //组装饰品表格数据
    arrangeOrnaments(val) {
      let ornamentsArr = [];
      val.forEach(item => {
        if (
          item.accountInvoicePages[0].invoiceType == "_oramj" ||
          item.accountInvoicePages[0].invoiceType == "_oramq"
        ) {
          ornamentsArr.push(item);
        }
      });

      ornamentsArr.forEach(item => {
        //结价
        item.j_invoiceToalWeight = 0;
        item.j_invoiceToalMoney = 0;
        item.j_invoiceNoWeight = 0;
        item.j_invoiceNoMoney = 0;
        item.j_invoicePassWeight = 0;
        item.j_invoicePassMoney = 45850;
        item.j_invoiceType = 0;
        item.j_adjustMoneyLine = 0;
        //转欠
        item.q_invoiceToalWeight = 0;
        item.q_invoiceToalMoney = 0;
        item.q_invoiceNoWeight = 0;
        item.q_invoiceNoMoney = 0;
        item.q_invoicePassWeight = 0;
        item.q_invoicePassMoney = 0;
        item.q_invoiceType = 0;
        item.q_adjustMoneyLine = 0;

        item.accountInvoicePages.forEach(one => {
          if (one.invoiceType == "_oramj") {
            item.j_invoiceToalWeight = one.invoiceToalWeight;
            item.j_invoiceToalMoney = one.invoiceToalMoney;
            item.j_invoiceNoWeight = one.invoiceNoWeight;
            item.j_invoiceNoMoney = one.invoiceNoMoney;
            item.j_invoicePassWeight = one.invoicePassWeight;
            item.j_invoicePassMoney = one.invoicePassMoney;
            item.j_invoiceType = one.invoiceType;
            item.j_adjustMoneyLine = one.adjustMoneyLine
              ? one.adjustMoneyLine
              : 0;
          } else if (one.invoiceType == "_oramq") {
            item.q_invoiceToalWeight = one.invoiceToalWeight;
            item.q_invoiceToalMoney = one.invoiceToalMoney;
            item.q_invoiceNoWeight = one.invoiceNoWeight;
            item.q_invoiceNoMoney = one.invoiceNoMoney;
            item.q_invoicePassWeight = one.invoicePassWeight;
            item.q_invoicePassMoney = one.invoicePassMoney;
            item.q_invoiceType = one.invoiceType;
            item.q_adjustMoneyLine = one.adjustMoneyLine
              ? one.adjustMoneyLine
              : 0;
          }
        });
      });

      this.tableDataOrnament = ornamentsArr;
    },
    //组装结价表格数据
    assemblejunctionPrice(val) {
      let junctionPrice = [];
      val.forEach(item => {
        if (item.accountInvoicePages[0].invoiceType == "_knotprice") {
          junctionPrice.push(item);
        }
      });

      junctionPrice.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoicePassWeight;
          item.j_invoicePassMoney = one.invoicePassMoney;
          item.j_invoiceType = "_knotprice";
        });
      });

      this.tableJunctionPrice = junctionPrice;
    },
    //组装来料表格数据
    assembleIncoming(val) {
      let Incoming = [];
      val.forEach(item => {
        if (item.accountInvoicePages[0].invoiceType == "_comestock") {
          Incoming.push(item);
        }
      });
      Incoming.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoicePassWeight;
          item.j_invoicePassMoney = one.invoicePassMoney;
          item.j_invoiceType = "_comestock";
        });
      });

      this.tableIncoming = Incoming;
    },
    printFun() {
      this.$refs.myComp.compPrintFun();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .menuTitle {
    font-size: 16px;
    color: #2E2F33;
    font-weight: bold;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 20px 0;
  }

  .inputStyle {
    width: 100%;
    height: 18px;
    // padding: 0 15px;
    text-align: center;
  }

  .leftTitle {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8A9199;
  }

  .rightTitle {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 25px;
    color: rgba(34, 36, 38, 1);
  }

  .jewelryListTitle {
    font-size: 16px;
    color: #2E2F33;
    font-weight: bold;
  }

  .vline {
    width: 3px;
    border-left: 1px solid #d9d9d9;
    margin: 0 15px;
  }

  .inputStyle::-webkit-input-placeholder {
    color: #aab2bd;
    font-size: 14px;
  }
}
</style>

<style>
.createInvoice .el-table .cell,
.createInvoice .el-table th div,
.createInvoice .el-table--border td:first-child .cell,
.createInvoice.el-table--border th:first-child .cell {
  padding-left: 0px;
}

.createInvoice .el-table .cell {
  padding: 0px;
}

.createInvoice .el-table th,
.createInvoice .el-table td {
  padding: 8px 0px;
}
</style>

