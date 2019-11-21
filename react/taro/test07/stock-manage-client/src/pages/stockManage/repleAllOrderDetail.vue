<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货管理</el-breadcrumb-item>
      <el-breadcrumb-item>一键补货审批列表</el-breadcrumb-item>
      <el-breadcrumb-item>一键补货审批详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr borderBt">
            <div class="th">订单编号</div>
            <div class="th">总数量</div>
            <div class="th">总重量(g)</div>
            <div class="th">操作人</div>
            <div class="th">下单日期</div>
            <div class="th">订单状态</div>
            <!-- <div class="th"></div> -->
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{result.orderNo}}</div>
            <div class="td">{{result.orderTotalSum}}</div>
            <div class="td">约{{result.endOrderTotalWeight}}g</div>
            <div class="td">{{result.operateUser}}</div>
            <div class="td">{{result.orderCreateTime}}</div>
            <div class="td" style="color: #F20F34" v-if="result.orderStatus == 1">待审核</div>
            <div class="td" style="color: #199C3C" v-if="result.orderStatus == 2">已通过</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 3">已取消</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 4">未通过</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 5">已退货</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 7">审核中</div>

            <!-- <div class="td handle">
              <el-button
                type="primary"
                size="mini"
                v-if="(result.orderStatus == 1 || result.orderStatus == 7) && hasVerify"
                @click="upAudit"
                :loading="loadingTF"
              >一键审批</el-button>
              <el-button
                type="warning"
                style="margin-top: 10px"
                size="mini"
                v-if="(result.orderStatus == 1 || result.orderStatus == 7) && hasVerify"
                @click="backOrder"
                :loading="loadingTF"
              >驳回</el-button>
            </div>-->
          </div>
          <!-- <div class="tr tabTwo">
            <div
              class="td tabTwoS"
              style="height:30px; padding:10px;padding-left:0px;width:100%;justify-content:left"
            >备注：{{ result.orderRemarks }}</div>
          </div>-->
          <ul class="tr hint" v-if="result.orderRemarks">
            <li>
              <b>订单备注：</b>
              <span>{{ result.orderRemarks }}</span>
            </li>
          </ul>

          <div class="spaceStyle"></div>
          <ul class="tr hint" style="padding-bottom: 0px;" v-if="result.backRemarks">
            <li>
              <b>驳回原因：</b>
              <span style="color:red">{{ result.backRemarks }}</span>
            </li>
          </ul>
          <div class="tr paddingTop22" style="border: none">
            <el-col :span="16">
              <Steps :data="result.perFroms" v-if="result.perFroms"></Steps>
            </el-col>

            <el-col :span="8" class="handle">
              <el-button
                type="primary"
                size="mini"
                v-if="(result.orderStatus == 1 || result.orderStatus == 7) && hasVerify"
                @click="upAudit"
                :loading="loadingTF"
              >一键审批</el-button>
              <el-button
                type="warning"
                style="margin-left: 10px"
                size="mini"
                v-if="(result.orderStatus == 1 || result.orderStatus == 7) && hasVerify"
                @click="backOrder"
                :loading="loadingTF"
              >驳回</el-button>
            </el-col>
          </div>
        </div>
      </div>

      <div class="tableHead">
        <ul class="tableUL">
          <li>工厂名称</li>
          <li v-if="result.orderStatus == 2">工单号</li>
          <li>金料成色</li>
          <li>总数量</li>
          <li>总重量(g)</li>
          <li>期望交货日期</li>
          <li>工厂交货日期</li>
          <li>字印</li>
          <li>操作</li>
        </ul>
      </div>
      <orderTableList :order="order" v-for="(order, index) in table" :key="index">
        <header @dblclick="changeShow(order)">
          <ul style="width: 92%;">
            <li>
              <!-- <span>生产工厂：</span> -->
              <b>{{ order.factoryName }}</b>
            </li>
            <li v-if="result.orderStatus == 2">
              <!-- <span v-if="order.factoryOrderNo">工单号：</span> -->
              <b>{{ order.factoryOrderNo?order.factoryOrderNo:'--' }}</b>
            </li>
            <li>
              <!-- <span>成色：</span> -->
              <b>{{ order.productCs }}</b>
            </li>
            <li>
              <!-- <span>总数量：</span> -->
              <b>{{ order.totailSum }}</b>
            </li>
            <li>
              <!-- <span>总重量：</span> -->
              <b>约{{ order.factoryWeight.toFixed(2) }}g</b>
            </li>
            <li>
              <div class="gray">
                <!-- <span>期望交货日期：</span> -->
                <b>{{ order.deliveryTime || '--' }}</b>
              </div>
            </li>
            <li>
              <div>
                <!-- <span>工厂交货日期：</span> -->
                <b>{{ order.factoryDeliveryTime || '--' }}</b>
              </div>
            </li>
            <li>
              <!-- <span>字印：</span> -->
              <b>{{order.marking?order.marking:'--'}}</b>
            </li>
            <li class="operation">
              <p
                class="warn"
                @click="rejectBtn(order)"
                style="margin-left: 16px;"
                v-if="order.facDep && order.factoryStatus !== 15"
              >拒收</p>
              <p
                class="warn"
                @click="showBackRemarksResutFun(order)"
                v-if="order.factoryStatus === 15"
              >拒收原因</p>
              <p @click.stop="excelOutFun(order)">导出Excel</p>
            </li>
          </ul>
          <div class="option" style="width: 5%;">
            <!-- <p
              class="warn"
              @click="rejectBtn(order)"
              v-if="order.facDep && order.factoryStatus !== 15"
            >拒收</p>
            <p
              class="warn"
              @click="showBackRemarksResutFun(order)"
              v-if="order.factoryStatus === 15"
            >拒收原因</p>
            <p @click.stop="excelOutFun(order)">导出</p>-->
            <p @click.stop="changeShow(order)">
              <!-- 详情 -->
              <i :class="order.toggleInfo ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
            </p>
          </div>
        </header>
      </orderTableList>
      <el-dialog title="选择材质" :visible.sync="excelVisTF" :close-on-click-modal="false" width="30%">
        <span>
          <el-radio v-model="productCs" label="999">足金999</el-radio>
          <el-radio v-model="productCs" label="9999">足金9999</el-radio>
          <el-radio v-model="productCs" label="硬金">硬金</el-radio>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="excelVisTF = false" size="small">取 消</el-button>
          <el-button type="primary" @click="excelOutFun" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <a ref="xlsDownloadA"></a>
      <el-dialog
        title="拒收原因"
        :visible.sync="showBackRemarks"
        width="560px"
        :close-on-click-modal="false"
      >
        <el-input
          size="small"
          v-model="backRemarks"
          type="textarea"
          :rows="4"
          placeholder="请输入拒收原因"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showBackRemarks = false" size="small">取 消</el-button>
          <el-button type="primary" @click="backReject" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="拒收原因"
        :visible.sync="showBackRemarksResut"
        width="560px"
        :close-on-click-modal="false"
      >
        <p>{{ BackRemarksResut }}</p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showBackRemarksResut: false,
      BackRemarksResut: "",
      orderList: [],
      result: {},
      orderNo: "",
      loadingTF: false,
      excelVisTF: false,
      productCs: "",
      elemObj: {},
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
      orderReplenishExeclTF: false,
      hasVerify: false,
      table: [],
      showBackRemarks: false,
      backRemarks: "", // 拒收备注
      factoryOrderNo: "" // 拒收工厂工单号
    };
  },

  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
    this.powerFun();

    // 获取是否有一键审批权限
    this.$publicData.verifyFun("approve-opreate").then(b => {
      this.hasVerify = b;
    });
  },

  methods: {
    showBackRemarksResutFun(order) {
      this.BackRemarksResut = order.jectionRemarks;
      this.showBackRemarksResut = true;
    },
    rejectBtn(order) {
      const { factoryOrderNo } = order;
      this.factoryOrderNo = factoryOrderNo;
      this.showBackRemarks = true;
    },
    // 拒收
    backReject() {
      const { factoryOrderNo, backRemarks, orderNo } = this;
      if (backRemarks.length === 0) {
        this.$message.warning("请输入拒收原因。");
        return;
      }
      this.$axios
        .get(this.$portMain + "/order/reJectionReplenishOrders", {
          PRS: { orderNo, backRemarks, factoryOrderNo }
        })
        .then(res => {
          if (res.data.code === 200) {
            // 成功
            this.$message.success("拒收成功");
            this.showBackRemarks = false;
            this.created_fun();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    changeShow(order) {
      order.toggleInfo = !order.toggleInfo;
      this.$forceUpdate();
    },
    created_fun() {
      let self = this;
      let params = { orderNo: self.orderNo };
      this.$api.formdataPostFun(
        self.$portMain + "/order/approveReplenishOrderByOrderNo",
        params,
        res => {
          let table = res.data.factoryProductFroms;
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
          // 进度条调整
          res.data.perFroms.unshift({
            orderStatus: 2,
            prcessName: "制单人员",
            processTypeFroms: [{ operateName: res.data.operateUser }]
          });
          res.data.perFroms.forEach((v, i) => {
            switch (v.orderStatus) {
              case 1:
                v.status = "process";
                break;
              case 2:
                v.status = "success";
                break;
              case 4:
                v.status = "error";
                break;
              default:
                v.status = "wait";
            }
          });
          self.result = res.data;

          self.result.factoryProductFroms.forEach(ielem => {
            ielem.orderProperties.forEach(jelem => {
              jelem.orderPeoductPerties.forEach(kelem => {
                kelem.sizeData = JSON.parse(kelem.extendAttr);
              });
            });
          });
        }
      );
    },
    //提交审核
    upAudit() {
      let self = this;
      self.loadingTF = true;
      let params = { orderNo: self.orderNo };
      this.$api.formdataPostFun(
        self.$portMain + "/order/approveReplenishOrders",
        params,
        ({ code, msg }) => {
          if (code === 200) {
            self.loadingTF = false;
            self.$message.success("审核成功～");
            this.created_fun();
          } else {
            self.$message.error(msg);
          }
        },
        err => {
          self.loadingTF = false;
          self.$message.error(
            err.msg || "请求错误：/order/approveReplenishOrders"
          );
        }
      );
    },
    //补货单驳回
    backOrder() {
      var self = this;
      self.loadingTF = true;
      this.$prompt("确认驳回此补货单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value) {
            let params = {
              orderNo: self.orderNo,
              backRemarks: value,
              opreaType: 2
            };
            this.$api.formdataPostFun(
              self.$portMain + "/order/backReplenishOrdersRemarks",
              params,
              res => {
                self.$message.success("已驳回此补货单。");
                self.created_fun();
              },
              err => {
                self.$message.error(err.msg);
              }
            );
          } else {
            self.$message.error("驳回原因不能为空！");
          }
          self.loadingTF = false;
        })
        .catch(err => {
          self.loadingTF = false;
        });
    },

    //excel导出弹框
    excelOutFunOne(elem) {
      this.productCs = "";
      this.elemObj = elem;
      this.excelVisTF = true;
    },

    //excel导出
    excelOutFun(elem) {
      let self = this;
      var params = {
        // PRS: {
        orderNo: self.orderNo,
        factoryNo: elem.factoryNo,
        productCs: elem.productCs
        // }
      };

      this.$api.formdataPostFun(
        this.$portMain + "/order/selectReplenishDown",
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
          self.$message.error(err.msg);
          self.btnLoadingTF = false;
        }
      );
    },
    //权限判断
    powerFun() {
      var self = this;
      self.orderReplenishExeclTF = false;
      this.$publicData
        .verifyFun("order-replenish-execl")
        .then(function(res) {
          self.orderReplenishExeclTF = res;
        })
        .catch(function(err) {
          self.$message.error(err);
        });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.goods {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 57px;

    ul {
      display: flex;
      width: 92%;

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
      width: 8%;

      p {
        font-size: 14px;
        font-weight: bold;
        color: #F20F34;
        cursor: pointer;
        margin-left: 16px;
      }

      .warn {
        color: #EA9D26;
      }
    }

    .operation {
      p {
        font-size: 14px;
        font-weight: bold;
        color: #F20F34;
        cursor: pointer;
        margin-right: 16px;
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

    // background #f5f5f5
    .info-top {
      width: 100%;
      // padding: 10px 20px;
      background: #fff;
      box-sizing: border-box;
      position: relative;

      .infot-table {
        &:after {
          content: '';
          position: absolute;
          left: -15px;
          width: calc(100% + 30px);
          height: 10px;
          background: #f4f4f4;
        }

        .tr {
          display: flex;
          width: 100%;

          // border: 1px solid #E9ECF5;
          .th {
            display: flex;
            align-items: center;
            // justify-content: center;
            height: 65px;
            width: 16%;
            text-align: center;
            color: rgba(138, 142, 153, 1);
            font-weight: bold;
            font-size: 14px;
          }

          .td {
            display: flex;
            // justify-content: center;
            align-items: center;
            height: 50px;
            width: 16%;
            text-align: center;
          }

          .handle {
            // display: flex;
            // padding-left: 110px;
            text-align: right;
          }
        }

        .borderBt {
          border-bottom: 1px solid #d9d9d9;
        }

        .spaceStyle {
          padding-top: 2px;
          position: relative;

          &:before {
            content: '';
            position: absolute;
            left: -15px;
            width: calc(100% + 30px);
            height: 10px;
            background: #f4f4f4;
          }
        }

        .paddingTop22 {
          padding-top: 22px;
        }
      }
    }

    .info-middle {
      margin: 20px;

      .infom-tit {
        padding: 0 20px;
        line-height: 40px;
        background: #fff;
      }
    }
  }

  .infom-info {
    margin: 10px;

    .infom-item {
      display: flex;
    }
  }

  .floatRight {
    float: right;
  }

  .marginTop10 {
    margin-top: -9px;
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
    width: 70%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin-left: 10px;
  }

  .pro-tit {
    margin: 10px 0;
    font-size: 14px;
  }

  .pro-middle {
    margin: 10px 0;
    font-size: 12px;
    color: #999;
  }

  .pro-bottom {
    margin: 10px 0;
    font-size: 12px;
    line-height: 14px;
    color: #333;
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

  .redTxt {
    color: #F20F34;
  }

  .steps-list {
    margin: 20px;
  }

  .suit-info {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 50px;

    .suiti-item {
      width: 48%;

      .pro-item {
        width: 100%;
        display: flex;

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

  .factoryFrom {
    margin-top: 20px;
    background: #fff;
    border: 1px solid #eee;

    .factoryFromOne {
      padding: 20px;
      font-size: 16px;
      border-bottom: 1px solid #eee;

      span {
        margin-left: 30px;
      }
    }
  }

  .tabThree {
    background: #fafafa;
    border: 1px solid #eee;
    border-top: 0;

    .tabThreeSub {
      background-color: #fff;
      border: 1px solid #eee;
      margin: 10px;
      padding: 10px;
    }
  }
}

.hint {
  box-sizing: border-box;
  padding: 20px 0 10px 0px;
  border: none !important;
  line-height: 1.5;
  font-size: 14px;
  color: #232426;
  flex-wrap: wrap;

  li {
    width: 100%;

    b {
      color: #8A9199;
    }
  }
}

.tableHead {
  .tableUL {
    // margin-top: 27px;
    height: 57px;
    display: flex;
    width: 92%;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(138, 142, 153, 1);

    li {
      display: inline-flex;
      align-items: center;
      width: 25%;
      font-size: 14px;
      font-weight: bold;

      span {
        color: #8A9199;
        white-space: nowrap;
      }

      b {
        color: #232426;
        font-weight: bloder;
      }
    }
  }

  &:after {
    content: '';
    display: block;
    margin-left: -20px;
    width: calc(100% + 40px);
    height: 1px;
    border-bottom: 1px solid rgba(228, 231, 240, 1);
    // background: #f4f4f4;
    // box-shadow: -1px 0 0 #ebebeb;
  }
}
</style>
