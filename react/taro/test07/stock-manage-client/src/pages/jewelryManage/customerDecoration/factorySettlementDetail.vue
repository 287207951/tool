<template>
  <div class="outOfStock" style="padding-bottom: 100px" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰(结算)详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="bizNo" label="结算单号"></el-table-column>
          <el-table-column prop="recipient" label="接收单位"></el-table-column>
          <!-- <el-table-column prop="invoiceEcho"
          label="金料成色"></el-table-column>-->

          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="weight" label="毛重(g)"></el-table-column>
          <el-table-column prop="suttle" label="净重(g)"></el-table-column>
          <el-table-column prop label="出货时间">
            <template slot-scope="scope">
              <span>{{scope.row && scope.row.createDate?$api.dateGetDayTime(scope.row.createDate) : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" align="center" label="出货人"></el-table-column>
          <el-table-column prop label="单据状态">
            <template slot-scope="scope">
              <span
                v-html="scope.row && scope.row.invoiceStatu ? $api.orderStatus(scope.row.invoiceStatu) : ''"
              ></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="txt14 txtHui lineHeight34 top10">
          <div>
            单据备注：
            <span class="txtBlack">{{orderDetail.invoiceMark?orderDetail.invoiceMark:'-'}}</span>
          </div>
        </div>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="18" class="txt16 txtBold">结算单详情</el-col>
        <el-col :span="6" class="itemRight displayFlex txtRight">
          <ButtonList
            :bizAuxiliary="btnList"
            :printTimes="orderDetail.print"
            @operationFun="operationFun"
            @submitData="submitData"
          ></ButtonList>
          <!-- <span style="margin-right:10px">
            <el-button type="primary"
                       v-if="orderDetail.invoiceStatu === 'EXREPO' && hasAuth"
                       plain
                       size="small"
                       @click="redRushClick">红冲</el-button>
          </span>
          <span>
            <el-button type="primary"
                       size="small"
                       @click="printFun">打印({{orderDetail.print || 0}})</el-button>
          </span>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="shipmentDetailList"
            style="margin-top:10px;margin-bottom:10px;"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="出货明细" header-align="center">
              <el-table-column prop="packId" header-align="center" align="center" label="包号"></el-table-column>
              <el-table-column prop="conditi" header-align="center" align="center" label="种类"></el-table-column>
              <el-table-column prop="one" header-align="center" align="center" label="类别"></el-table-column>
              <el-table-column
                prop="packTotalSuttle"
                header-align="center"
                align="center"
                label="重量(g)"
              ></el-table-column>
              <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
            </el-table-column>
            <el-table-column label="账款明细" header-align="center">
              <el-table-column
                prop="ceditWayName"
                header-align="center"
                align="center"
                label="结费方式"
              ></el-table-column>
              <el-table-column prop="ceditProject" header-align="center" align="center" label="项目"></el-table-column>
              <el-table-column prop="ceditWeight" header-align="center" align="center" label="重量"></el-table-column>
              <el-table-column prop="ceditPriceG" header-align="center" align="center" label="单价/克"></el-table-column>
              <el-table-column prop="ceditAmount" header-align="center" align="center" label="数量"></el-table-column>
              <el-table-column prop="ceditPriceJ" header-align="center" align="center" label="单价/件"></el-table-column>
              <el-table-column prop="ceditMoney" header-align="center" align="center" label="金额"></el-table-column>
              <el-table-column prop="ceditNote" header-align="center" align="center" label="备注"></el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="24" class="txt16 txtBold">包详情</el-col>
      <el-col :span="24">
        <packge-list :columns="packgeColumns" typeText="出库" idKey="packId" :allData="allData"></packge-list>
      </el-col>
    </el-row>

    <div v-show="false">
      <printTPEleven :billData="printData" ref="myComp"></printTPEleven>
    </div>
  </div>
</template>

<script>
import packgeList from "@/components/packge-list";
export default {
  computed: {
    hasAuth() {
      return eval(
        this.$api.setPowerSpot(this.$store.state.queryVerify, "stock-out-rcw")
      );
    }
  },
  data() {
    return {
      btnList: [],
      loadingState: false,
      printData: {},
      bizNo: "",
      orderTable: [],
      orderDetail: {},
      allData: {},
      productListData: [],
      packgeColumns: [
        {
          labelKey: "包号",
          valueKey: "packId",
          span: 4
        },
        {
          labelKey: "金料成色",
          valueKey: "conditi",
          span: 3
        },
        {
          labelKey: "类别",
          valueKey: "one",
          span: 3
        },
        {
          labelKey: "总数量",
          valueKey: "packTotalAmount",
          span: 2
        },
        {
          labelKey: "净重(g)",
          valueKey: "packTotalSuttle",
          span: 2
        },
        {
          labelKey: "毛重(g)",
          valueKey: "packNetTotalWeight",
          span: 2
        },
        {
          labelKey: "毛重差异(g)",
          valueKey: "weightDif",
          span: 3
        },
        {
          labelKey: "过重备注",
          valueKey: "weightDifRemark",
          tooltip: true,
          span: 3
        },
        {
          labelKey: "备注",
          valueKey: "remark",
          tooltip: true,
          span: 2
        }
      ],
      shipmentDetailList: [],
      sumCloums: ["packTotalSuttle", "money"]
    };
  },
  methods: {
    operationFun(data) {
      if (data.value === "PRINT") {
        this.printFun();
      }
    },
    submitData(data) {
      if (data.actionSign === "RCW") {
        this.redRushClick();
      }
    },
    printFun() {
      let self = this;
      console.log(self.$refs.myComp.LODOP);
      self.$refs.myComp.compPrintFun();
      if (!self.$refs.myComp.LODOP) {
        return;
      }
      var params = { bizNo: this.bizNo };
      this.$axios({
        method: "post",
        url: self.$portMain + "/outStockBills/addFactoryPrint",
        params: params,
        data: null,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function(res) {
        if (res.data.code == 200) {
          self.$message.success("正在打印！");
          self.orderDetail.print++;
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    redRushClick() {
      this.$confirm("此操作将红冲, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          url: this.$portMain + "/outStockBills/updateDataFactory",
          method: "post",
          params: { bizNo: this.bizNo },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          if (res.data.code == 200) {
            // this.orderDetail.invoiceStatu = "RCW";
            this.$message.success("已红冲!");
            this.$router.push("factorySettlementList");
            // this.orderDetail.invoiceStatuValue = "已红冲";
            this.getData();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    add() {
      var args = arguments,
        lens = args.length,
        d = 0,
        sum = 0;
      for (var key in args) {
        var str = "" + args[key];
        if (str.indexOf(".") != -1) {
          var temp = str.split(".")[1].length;
          d = d < temp ? temp : d;
        }
      }
      var m = Math.pow(10, d);
      for (var key in args) {
        sum += args[key] * m;
      }
      return sum / m;
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "重量(g)" || column.label === "金额") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                let res = (Number(prev) + Number(curr)).toFixed(2);
                return res;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    },
    getData() {
      this.loadingState = true;
      this.$axios({
        url: this.$portMain + "/outStockBills/findDataFactory",
        method: "post",
        params: { bizNo: this.bizNo },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.allData = res.data.data;
          this.orderTable = [res.data.data.bizInvoice];
          this.orderDetail = res.data.data.bizInvoice;
          this.productListData = res.data.data.bizPro;
          this.shipmentDetailList = res.data.data.listPack;
          for (let i = 0; i < res.data.data.proStockDetail.length; i++) {
            if (this.shipmentDetailList[i]) {
              this.$set(
                this.shipmentDetailList,
                i,
                Object.assign(
                  {},
                  this.shipmentDetailList[i],
                  res.data.data.proStockDetail[i]
                )
              );
            } else {
              this.shipmentDetailList.push(res.data.data.proStockDetail[i]);
            }
          }
          // this.shipmentDetailList = res.data.data.proStockDetail;
          this.shipmentDetailList.forEach(item => {
            item.ceditMoney = Math.round(item.ceditMoney).toFixed(2);
          });
          this.printData = JSON.parse(JSON.stringify(res.data.data.bizInvoice));
          this.printData.shipmentList = res.data.data.listPack;
          this.printData.accountList = res.data.data.proStockDetail;
          this.printData.financialCode = res.data.data.financialCode;
          this.printData.area = res.data.data.area;
          this.btnList = res.data.data.bizAuxiliary;
          this.loadingState = false;
        } else {
          this.loadingState = false;
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  components: {
    "packge-list": packgeList
  },
  created() {
    this.bizNo = this.$route.query.id;
    this.getData();
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.outOfStock {
  .itemRight {
    text-align: right;
  }

  .itemFirst {
    margin-top: 40px;
    margin-bottom: 20px;
    line-height: 32px;
    font-size: 14px;

    span:first-child {
      color: #8A9199;
    }

    span:last-child {
      color: #222426;
    }

    .noteStyle {
      // display: flex;
      // justify-content: flex-end;
      // margin-top 10px
    }
  }

  .reasonWrap {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(35, 36, 38, 1);
    padding-top: 15px;
    margin-bottom: 15px;

    .leftTitle {
      color: #8A9199;
    }
  }

  .stepWrap {
    margin-top: 38px;
  }

  .container {
    padding-top: 24px;

    .productWarp {
      // width: 1px;
      height: 120px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 241, 255, 1);
      box-sizing: border-box;
      display: flex;
      padding: 16px 24px 14px 24px;
      margin-bottom: 8px;

      .productPic {
        width: 120px;
        height: 90px;
      }

      .productDes {
        // display: inline-block;
        margin-left: 16px;
        height: 76px;
        width: 100%;
        display: flex;

        .proTitel {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          margin-bottom: 11px;
        }

        .proUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          // margin-right: 224px;
          width: 24%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .SUKUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
        }

        .proLI {
          margin-bottom: 11px;

          .left {
            color: #889199;
          }

          .right {
          }
        }
      }
    }
  }

  .auditor {
    margin-top: 14px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(46, 48, 51, 1);

    .leftItle {
      color: #8A9199;
    }
  }

  .ULWrap {
    margin-top: 32px;
    margin-bottom: 8px;

    .title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(35, 36, 38, 1);
    }

    .orderNumWrap {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(35, 36, 38, 1);
      display: flex;
      margin: 19px 0 16px 0;

      .leftTitle {
        color: #8A9199;
      }
    }

    .LiWrap {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: rgba(35, 36, 38, 1);
      background: #E4EAF0;
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      margin-bottom: 4px;
      cursor: pointer;

      &>div {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .liLeft {
        color: #8A8E99;
        margin-right: 16px;
      }
    }
  }

  .productModel {
    .titTwoBao {
      background: #F5F5F5;
      font-size: 12px;
      color: #333;
      border: 1px solid #CCCCCC;
      margin: 10px 0;
      line-height: 47px;
      padding: 0 10px;
      min-height: 47px;
    }

    .infom-info {
      margin: 10px 0;
    }

    .infom-item {
      display: flex;
    }

    .pro-item {
      width: 60%;
      display: flex;
      align-items: center;
      padding: 15px 20px;
      background: #fff;
      border: 1px solid #E9ECF5;
    }

    .pro-imgs {
      position: relative;
      width: 153px;
      height: 116px;
    }

    .pro-right {
      width: 75%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-left: 10px;
    }

    .iitem-right {
      min-width: 0%;
      flex: 1;
      min-height: 146px;
      display: flex;
      flex-direction: column;
      font-size: 12px;
    }

    .divThree {
      border: 1px solid #ccc;
      border-top: 0;

      .divThreeSub {
        margin: 10px;
        display: flex;
        border: 1px solid #f0f0f0;
        line-height: 24px;
      }

      .txtOne {
        font-size: 12px;
        color: #999;
      }
    }

    .order-th {
      box-sizing: border-box;
      padding-left: 40px;
      display: flex;
      align-items: center;
      height: 30px;
      background: #E9ECF5;
      color: #666;

      .oth {
        width: 200px;
        text-align: center;
      }
    }

    .order-item {
      flex: 1;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .order-tr {
        flex: 1;
        box-sizing: border-box;
        padding-left: 40px;
        display: flex;
        align-items: center;
        height: 30px;
        border-bottom: 1px solid #E9ECF5;

        &:nth-of-type(odd) {
          background: #FAFAFA;
        }

        &:nth-of-type(even) {
          background: #ffffff;
        }

        .otd {
          width: 200px;
          text-align: center;
        }
      }
    }

    .pro-middle {
      margin: 0px 0;
      font-size: 12px;
      color: #999;
    }
  }

  .ellipsisWrap {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
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
