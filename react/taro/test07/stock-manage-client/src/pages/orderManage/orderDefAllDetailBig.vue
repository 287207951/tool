<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>客单管理</el-breadcrumb-item>
      <el-breadcrumb-item>客单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">订单编号</div>
            <div class="th">订单来源</div>
            <div class="th">下单公司</div>
            <div class="th">下单日期</div>
            <div class="th">预计来款日期</div>
            <!-- <div class="th">预计交货日期</div> -->
            <div class="th">关联业务员</div>
            <div class="th">总重量(g)</div>
            <div class="th">总工费(￥)</div>
            <div class="th">字印</div>
            <div class="th">挂签</div>
            <div class="th">订单状态</div>
            <!-- <div class="th"></div> -->
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{result.orderNo}}</div>
            <div class="td" v-if="result.orderSource == 1">网络下单</div>
            <div class="td" v-if="result.orderSource == 2">展厅下单</div>
            <div class="td">{{result.customerName}}</div>
            <div class="td">{{result.orderCreateTime}}</div>
            <div class="td">{{result.orderComeTime}}</div>
            <!-- <div class="td">{{result.deliveryTime}}</div> -->
            <div class="td">{{result.saleName}}</div>
            <div
              class="td"
              v-if="Number(result.startOrderTotailWeight)"
            >{{result.startOrderTotailWeight}}-{{result.orderTotalWeight}}</div>
            <div class="td" v-else>{{result.orderTotalWeight}}</div>
            <div class="td">{{result.endOrderTotalMoney}}</div>
            <div class="td">{{result.marking}}</div>
            <div class="td">{{result.lableName == 1?'否':''}}{{result.lableName == 2?'是':''}}</div>
            <div class="td" style="color: #F20F34" v-if="result.orderStatus == 1">待审核</div>
            <div class="td" style="color: #199C3C" v-if="result.orderStatus == 2">已通过</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 3">已取消</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 4">未通过</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 5">已退货</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 7">审核中</div>
          </div>
        </div>
      </div>
      <div
        style="border: 1px solid #eee; padding: 15px; margin: 0 20px 20px 20px;"
        v-if="result.orderRemarks"
      >
        <span>备注：</span>
        <b>{{ result.orderRemarks }}</b>
      </div>
      <orderTableList :order="order" v-for="(order, i) in table" :key="i">
        <header @dblclick="changeShow(order)">
          <ul>
            <li>
              <span>生产工厂：</span>
              <b>{{ order.factoryName }}</b>
            </li>
            <li>
              <span>总数量：</span>
              <b>{{ order.totailSum }}</b>
            </li>
            <li v-if="order.factoryWeight">
              <span>总重量：</span>
              <b>约{{ order.factoryWeight.toFixed(2) }}g</b>
            </li>
            <li v-if="order.productCs">
              <span>成色：</span>
              <b>{{ order.productCs }}</b>
            </li>
            <li>
              <div v-if="order.factoryDeliveryTime">
                <span>工厂交货日期：</span>
                <b>{{ order.factoryDeliveryTime || '-' }}</b>
              </div>
              <div class="gray" v-if="order.deliveryTime">
                <span>期望交货日期：</span>
                <b>{{ order.deliveryTime }}</b>
              </div>
            </li>
          </ul>
          <div v-if="order.factoryOrderNo" class="facNo">
            <span>工单号：</span>
            <b>{{order.factoryOrderNo}}</b>
          </div>
          <div class="option">
            <!-- <p @click.stop="excelOutFun(order)">导出Excel</p> -->
            <p @click.stop="changeShow(order)">
              详情
              <i :class="order.toggleInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </p>
          </div>
        </header>
      </orderTableList>
    </div>
  </div>
</template>
<script>
import $orderCount from "./acommon/orderCount.js";

export default {
  data() {
    return {
      stepsActive: 1,
      orderList: [],
      allParams: {},
      result: {},
      orderNo: "",
      balance_material: 0,
      balance_account: 0,
      powerControl: false,
      MIME: {
        "application/x-zip-compressed": "zip",
        "application/javascript": "js",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "xlsx",
        "text/css": "css",
        "text/plain": "txt",
        "text/html": "html",
        "text/xml": "xml",
        "image/jpeg": "jpeg",
        "image/png": "png",
        "image/gif": "gif",
        "image/svg+xml": "svg"
      },
      fname: "", //文件名
      excelTF: false,
      excelVisTF: false,
      elemObj: {},
      productCs: "",
      table: []
    };
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
    // this.refWeightNum()
    this.powerFun();
    // 获取是excel导出权限
    this.$publicData.verifyFun("order-approve-execl").then(b => {
      this.excelTF = b;
    });
  },
  methods: {
    changeShow(order) {
      order.toggleInfo = !order.toggleInfo;
      this.$forceUpdate();
    },
    created_fun() {
      let self = this;
      let params = {
        PRS: {
          orderNo: this.orderNo
        }
      };
      this.$axios
        .get(this.$portMain + "/order/selectLearApproveBigOrderDetail", params)
        .then(res => {
          $orderCount.setList(res.data.data);
          $orderCount.hanldStep();
          $orderCount.changeFormat();
          $orderCount.countAll();
          self.result = $orderCount.getlist();

          let table = res.data.data.factoryProductFroms;
          table.map(v => {
            v.toggleInfo = true;
            v.totailSum = 0; // 计算工厂补货总数
            // 套装
            v.suitProductFroms &&
              v.suitProductFroms.map(suit => {
                v.totailSum += suit.suitSum;
                suit.suit = 2;
                suit.showList = true;
              });
            // 单品
            v.orderProperties.map(prop => {
              prop.orderPeoductPerties.map(
                perties => (v.totailSum += perties.orderSum)
              );
            });
            // 合并数据
            if (v.suitProductFroms && v.orderProperties) {
              v.orderStandFroms = [...v.orderProperties, ...v.suitProductFroms];
            } else if (v.suitProductFroms) {
              v.orderStandFroms = [...v.suitProductFroms];
            } else if (v.orderProperties) {
              v.orderStandFroms = [...v.orderProperties];
            }
          });
          self.table = table;
        });
    },

    //权限判断
    powerFun() {
      let self = this;
      this.powerControl = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "quick-approve"
      );
    },

    // refWeightNum() {
    //   this.$axios.get(this.$portMain + '/stock/account/order/currentaccount').then(res => {
    //     this.balance_material = res.data.data.balance_material
    //     this.balance_account = res.data.data.balance_account
    //   })
    // },

    upAudit() {
      let params = {
        PRS: {
          orderNo: this.orderNo
        }
      };
      this.$axios
        .get(this.$portMain + "/orderManage/approveOrdersByOrderNo", params)
        .then(res => {
          if (res.data.code === 200) {
            this.created_fun();
            // this.result.orderStatus = 2
            // this.stepsActive = this.stepsActive + 1
          }
        });
    },

    backOrder() {
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let params = {
          PRS: {
            backRemarks: value,
            orderNo: this.orderNo
          }
        };
        this.$axios
          .get(this.$portMain + "/orderManage/backOrdersRemarks", params)
          .then(res => {
            if (res.data.code === 200) {
              this.result.orderStatus = 4;
            }
          });
      });
    },
    //excel导出弹框
    excelOutFunOne(elem) {
      this.productCs = "";
      this.elemObj = elem;
      this.excelVisTF = true;
    },

    //excel导出
    excelOutFun() {
      let self = this;
      let elem = self.elemObj;
      self.btnLoadingTF = true;
      var params = {
        // PRS: {
        orderNo: self.orderNo,
        factoryNo: elem.factoryNo,
        productCs: self.productCs
        // }
      };

      this.$api.formdataPostFun(
        this.$portMain + "/exportOrder/export",
        params,
        res => {
          self.btnLoadingTF = false;
          if (res.data) {
            self.fname =
              elem.factoryName +
              "-" +
              self.orderNo +
              "." +
              self.MIME[self.$api.getContentType(res.data)];
            var blob = self.$api.getBlob(res.data);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error("此订单查无‘" + self.productCs + "’的产品!");
          }
          self.excelVisTF = false;
        },
        err => {
          self.excelVisTF = false;
          self.$message.error(err.msg);
          self.btnLoadingTF = false;
        }
      );
    },
    addImg() {}
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.facNo {
  margin-left: 20px;
  display: flex;
  width: 249px;
  font-size: 14px;
}

.goods {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 57px;

    ul {
      display: flex;
      width: 85%;

      li {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        width: 20%;
        font-size: 16px;
        font-weight: bold;

        span {
          color: #8A9199;
          white-space: nowrap;
        }

        b {
          color: #232426;
          font-weight: bloder;
        }

        div {
          display: inline-flex;
          width: 100%;
          line-height: 1.4;

          span, b {
            color: #232426;
          }

          &.gray {
            span, b {
              color: #8A9199;
            }
          }

          &:first-of-type b {
            color: #232426;
          }
        }
      }
    }

    .option {
      display: inline-flex;
      justify-content: flex-end;
      width: 15%;

      p {
        font-size: 16px;
        font-weight: bold;
        color: #F20F34;
        cursor: pointer;
        margin-left: 16px;
      }

      .warn {
        color: #EA9D26;
      }
    }
  }
}

.conBigDiv {
  color: #333;
  padding-bottom: 200px;

  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .topMenuRight {
    text-align: right;
  }

  .searchTxt {
    flex: 1;
    width: 100%;
  }

  .top-select {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info {
    min-height: 500px;

    .info-top {
      width: 100%;
      padding: 10px 20px;
      background: #fff;
      box-sizing: border-box;

      .infot-table {
        .tr {
          display: flex;
          width: 100%;
          border: 1px solid #E9ECF5;

          .th {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            width: 16%;
            text-align: center;
            background: #999999;
            color: #fff;
          }

          .td {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80px;
            width: 16%;
            text-align: center;
          }

          .handle {
            display: flex;
            flex-direction: column;

            .el-button {
              min-width: 80px;
              margin-left: 0;
            }
          }
        }
      }
    }

    .info-middle {
      margin: 20px;
      border: 1px solid #ccc;

      .infom-tit {
        padding: 0 20px;
        line-height: 40px;
        background: #fff;
      }

      .infom-info {
        margin: 10px;

        .infom-item {
          display: flex;
        }
      }
    }
  }

  .pro-item {
    min-width: 350px;
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

  .proimgs-add {
    position: absolute;
    display: flex;
    top: -10px;
    left: -10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.4);
  }

  .proimgs-add > div > img {
    padding-left: 10px;
  }

  .proimgs-add > div > img:nth-of-type(1) {
    padding-left: 0;
  }

  .pro-item > img {
    width: 153px;
    height: 116px;
  }

  .pro-right {
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin-left: 10px;
  }

  .pro-tit {
    font-size: 14px;
  }

  .pro-middle {
    margin: 10px 0;
    font-size: 12px;
    color: #999;
  }

  .pro-bottom {
    font-size: 12px;
    line-height: 14px;
    color: #999;
  }

  .iitem-right {
    min-width: 0%;
    flex: 1;
    min-height: 146px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
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

      .otd {
        width: 200px;
        text-align: center;
      }
    }

    .order-tr:nth-of-type(odd) {
      background: #FAFAFA;
    }

    .order-tr:nth-of-type(even) {
      background: #ffffff;
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

  .steps-list {
    margin: 20px;
  }

  .weight-num {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;

    div {
      margin-right: 40px;
    }

    span {
      color: red;
    }
  }

  .suit-info {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 50px;

    .suiti-item {
      width: 48%;

      .pro-item {
        width: 100%;

        .pro-right {
          &> p {
            margin-bottom: 8px;
          }
        }

        .pro-feetype {
          font-size: 12px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }

        .pro-weight {
          font-size: 12px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
