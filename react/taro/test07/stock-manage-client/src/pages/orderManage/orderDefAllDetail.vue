<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>标准单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">订单编号</div>
            <div class="th">订单来源</div>
            <div class="th">下单公司</div>
            <div class="th">下单日期</div>
            <div class="th">预计来款日期</div>
            <div class="th">预计交货日期</div>
            <div class="th">关联业务员</div>
            <div class="th">总重量(g)</div>
            <div class="th">总工费(￥)</div>
            <div class="th">订单状态</div>
            <div class="th"></div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{result.orderNo}}</div>
            <div class="td" v-if="result.orderSource == 1">网络下单</div>
            <div class="td" v-if="result.orderSource == 2">展厅下单</div>
            <div class="td">{{result.customerName}}</div>
            <div class="td">{{result.orderCreateTime}}</div>
            <div class="td">{{result.orderComeTime}}</div>
            <div class="td">{{result.deliveryTime}}</div>
            <div class="td">{{result.saleName}}</div>
            <div
              class="td"
              v-if="Number(result.startOrderTotailWeight)"
            >{{result.startOrderTotailWeight}}-{{result.orderTotalWeight}}</div>
            <div class="td" v-else>{{result.orderTotalWeight}}</div>
            <div class="td">{{result.orderTotalMoney}}</div>
            <div class="td" style="color: #F20F34" v-if="result.orderStatus == 1">待审核</div>
            <div class="td" style="color: #199C3C" v-if="result.orderStatus == 2">已通过</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 3">已取消</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 4">未通过</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 5">已退货</div>
            <div class="td" style="color: #E8B409" v-if="result.orderStatus == 7">审核中</div>

            <div class="td handle">
              <el-button
                type="primary"
                size="mini"
                v-if="result.orderStatus == 1"
                v-show="powerControl == 'true'"
                @click="upAudit"
              >一键审核</el-button>
              <el-button
                type="warning"
                style="margin-top: 10px"
                size="mini"
                v-if="result.orderStatus == 1"
                v-show="powerControl == 'true'"
                @click="backOrder"
              >驳回</el-button>
            </div>
          </div>

          <OrderRemark :result="result.orderRemarks"></OrderRemark>

          <div class="tr" style="border: none">
            <el-col :span="8">
              <el-steps :active="stepsActive" finish-status="success" class="steps-list">
                <el-step title="步骤 1" size="mini" v-for="(item,ind) in result.perFroms" :key="ind">
                  <div slot="title">{{item.prcessName}}</div>
                  <div slot="description">
                    <p v-for="(it,index) in item.processTypeFroms" :key="index">{{it.operateName}}</p>
                  </div>
                </el-step>
              </el-steps>
            </el-col>
            <!-- <el-col :span="13" :offset="2">
            <div class="weight-num">-->
            <!--<div>未结算总重量(g)：<span>2000</span> </div>-->
            <!--<div>未结算总工费(￥)：<span>19000.88</span></div>-->
            <!-- <div>欠款(￥)：<span>{{balance_account}}</span></div>
                <div>欠料(g)：<span>{{balance_material}}</span></div>
                <el-button type="primary" plain size="mini" @click="refWeightNum">刷新</el-button>
              </div>
            </el-col>-->
          </div>
        </div>
      </div>
      <div class="info-middle">
        <div class="info-item-wrap" v-for="(iitem,ind) in result.factoryProductFroms" :key="ind">
          <p class="infom-tit">
            <span>{{iitem.factoryName}}</span>
            <span style="margin-left: 100px">总重量(g): {{iitem.allTotalWeight}}</span>
          </p>

          <!-- 单品start -->
          <div class="infom-info" v-for="(item,ind) in iitem.orderProperties" :key="ind">
            <div class="infom-item">
              <div class="pro-item iitem-left">
                <div class="pro-imgs">
                  <img :src="$portImg + item.productImg[0]" width="153" height="116">
                </div>
                <div class="pro-right">
                  <p class="pro-tit">{{item.productName}}</p>
                  <p class="pro-middle">编号：{{item.productNo}}</p>
                  <p class="pro-bottom">{{item.productPey}}</p>
                </div>
              </div>
              <div class="iitem-right">
                <div class="order-th">
                  <div class="oth">克重(g)</div>
                  <div class="oth" v-if="item.styleKey.name == '圈号'">圈号(#)</div>
                  <div class="oth" v-if="item.styleKey.name == '长度'">链长(cm)</div>
                  <div class="oth" v-if="item.styleKey.name == '内径长'">内径长(cm)</div>
                  <div class="oth" v-if="item.styleKey.name == '圈口'">圈口(cm)</div>
                  <div class="oth">重量范围(g)</div>
                  <div class="oth">采购数量</div>
                  <div class="oth">备注</div>
                </div>
                <div class="order-item">
                  <div class="order-tr" v-for="(it,index) in item.orderPeoductPerties" :key="index">
                    <div class="otd" v-if="it.standardGold">{{it.standardGold}}</div>
                    <div class="otd" v-if="it.styleItem.name">{{it.styleItem.value}}</div>
                    <div class="otd">{{it.innerWeight}}</div>
                    <div class="otd">{{it.orderSum}}</div>
                    <div class="otd">{{it.productRemarks}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 单品end -->
          <!-- 套装start -->
          <div class="suit" v-for="(item,ind) in iitem.suitProductFroms" :key="ind">
            <div class="infom-info">
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img :src="$portImg + item.productImg" width="153" height="116">
                  </div>
                  <div class="pro-right">
                    <p class="pro-tit">{{item.productName}}</p>
                    <p class="pro-middle">编号：{{item.productNo}}</p>
                    <p class="pro-bottom">{{item.productPey}}</p>
                  </div>
                </div>
                <div class="iitem-right">
                  <div class="order-th">
                    <div class="oth">克重(g)</div>
                    <div class="oth">重量范围(g)</div>
                    <div class="oth">采购数量</div>
                    <div class="oth">备注</div>
                  </div>
                  <div class="order-item">
                    <div class="order-tr">
                      <div class="otd" v-if="item.standardGold">{{item.standardGold.toFixed(2)}}</div>
                      <div class="otd">{{item.innerWeight}}</div>
                      <div class="otd">{{item.orderSum}}</div>
                      <div class="otd">{{item.productRemarks}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="suit-info">
              <div
                class="infom-info suiti-item"
                v-for="(it, ix) in item.suitProdctPeyFroms"
                :key="ix"
              >
                <div class="infom-item">
                  <div class="pro-item iitem-left">
                    <div class="pro-imgs">
                      <img :src="$portImg + it.productImg" width="153" height="116">
                    </div>
                    <div class="pro-right">
                      <p class="pro-tit">{{it.productName}}</p>
                      <p class="pro-bottom">{{it.productPey}}</p>
                      <p class="pro-feetype">
                        <span>工费类型: {{it.fee}}</span>
                        <span>基本工费: {{it.basicFee}}</span>
                        <span v-if="it.additionFee">附加工费: {{it.additionFee}}</span>
                      </p>
                      <p class="pro-weight">
                        <span v-if="Number(it.suitStandardGold)">克重(g): {{it.suitStandardGold}}</span>
                        <span v-if="it.innerWeight">误差范围(g): {{it.innerWeight}}</span>
                        <span
                          v-if="it.styleKey.name === '长度'"
                        >链长(cm): {{it.lengthStart}}-{{it.lengthEnd}}</span>
                        <span v-if="it.diameterLength">圈口(cm): {{it.diameterLength}}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 套装end -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerControl: 'false', //权限显示控制
      stepsActive: 1,
      orderList: [],
      allParams: {},
      result: {},
      orderNo: "",
      balance_material: 0,
      balance_account: 0
    };
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
    this.refWeightNum();
    this.powerFun();
  },
  methods: {
    created_fun() {
      let self = this;
      this.$axios
        .post(
          this.$portMain +
            "/orderManage/selectLearApproveOrderDetailByOrderNo?orderNo=" +
            this.orderNo
        )
        .then(res => {
          let stepAc = "";
          if (!res.data.data.perFroms) {
            res.data.data.perFroms = [];
          }
          for (var i = 0; i < res.data.data.perFroms.length; i++) {
            if (res.data.data.perFroms[i].orderStatus === 1) {
              stepAc = i + 1;
              break;
            }
          }
          if (stepAc) {
            this.stepsActive = stepAc;
          } else {
            this.stepsActive = res.data.data.perFroms.length + 1;
          }
          res.data.data.perFroms.unshift({
            prcessName: "客户",
            step: 1,
            orderStatus: 1,
            processTypeFroms: [
              {
                operateName: res.data.data.userName
              }
            ]
          });
          res.data.data.factoryProductFroms.forEach(iitem => {
            let oneStart = 0,
              oneEnd = 0;
            iitem.allWeight = 0;
            iitem.allTotalWeight = 0;
            iitem.orderProperties.forEach(item => {
              item.weightShow = true;
              item.allWeight = 0;
              item.productImg = item.productImg.split(",");
              item.productPey = item.productPey.split("_").join("、");
              item.checked = false;
              item.styleKey = {};
              item.orderPeoductPerties.forEach(it => {
                //  尚臻品下单
                if (item.suit) {
                  it.standardGold = it.suitStandardGold
                    ? it.suitStandardGold.toString()
                    : it.standardGold.toString();
                  if (!it.standardGold.split("-")[1]) {
                    it.standardGold = `${Number(it.standardGold)}-${Number(
                      it.standardGold
                    )}`;
                  }
                  if (it.standardGold.split("-")[1]) {
                    oneStart +=
                      Number(it.standardGold.split("-")[0]) *
                      Number(it.orderSum);
                    oneEnd +=
                      Number(it.standardGold.split("-")[1]) *
                      Number(it.orderSum);
                    item.weightShow = false;
                  } else {
                    it.allWeight =
                      Number(it.standardGold) * Number(it.orderSum);
                    item.allWeight += it.allWeight;
                  }
                } else {
                  it.allWeight = Number(it.standardGold) * Number(it.orderSum);
                  item.allWeight += it.allWeight;
                }

                // 尚臻品
                it.appearance = JSON.parse(it.appearance);
                it.styleItem = { name: "", value: "" };
                if (item.suit) {
                  if (this.$u.isProClass(it.appearance) === "项链") {
                    let lengthStart, lengthEnd;
                    item.styleKey = {
                      name: "长度"
                    };
                    it.appearance.forEach(iit => {
                      if (iit.name === "lengthStart") {
                        if (iit.value) {
                          lengthStart = iit.value;
                          // it.styleItem = {name: '长度', value: iit.value}
                        }
                      }
                      if (iit.name === "lengthEnd") {
                        if (iit.value) {
                          lengthEnd = iit.value;
                        }
                      }
                    });
                    it.styleItem = {
                      name: "长度",
                      value: `${lengthStart}-${lengthEnd}`
                    };
                  }
                  if (this.$u.isProClass(it.appearance) === "手镯") {
                    item.styleKey = {
                      name: "圈口"
                    };
                    it.styleItem = { name: "圈口", value: it.diameterLength };
                  }
                } else {
                  if (this.$u.isProClass(it.appearance) === "项链") {
                    let lengthStart, lengthEnd;
                    item.styleKey = {
                      name: "长度"
                    };
                    it.appearance.forEach(iit => {
                      if (iit.name === "lengthStart") {
                        if (iit.value) {
                          lengthStart = iit.value;
                          // it.styleItem = {name: '长度', value: iit.value}
                        }
                      }
                      if (iit.name === "lengthEnd") {
                        if (iit.value) {
                          lengthEnd = iit.value;
                        }
                      }
                    });
                    it.styleItem = {
                      name: "长度",
                      value: `${lengthStart}-${lengthEnd}`
                    };
                  }
                  if (this.$u.isProClass(it.appearance) === "手镯") {
                  }
                }
                it.checked = false;
                switch (it.feeType) {
                  case 1:
                    it.fee = "每克";
                    break;
                  case 2:
                    it.fee = "每件";
                    break;
                  case 3:
                    it.fee = "一口价";
                    break;
                }
              });
              if (item.suit) {
                if (!item.weightShow) {
                  iitem.allWeight = `${oneStart}-${oneEnd}`;
                  iitem.allTotalWeight = `${oneStart.toFixed(
                    2
                  )}-${oneEnd.toFixed(2)}`;
                } else {
                  iitem.allWeight += item.allWeight;
                  iitem.allTotalWeight = iitem.allWeight.toFixed(2);
                }
              } else {
                iitem.allWeight += item.allWeight;
                iitem.allTotalWeight = iitem.allWeight.toFixed(2);
              }
            });

            //  套装里面的产品
            if (iitem.suitProductFroms) {
              iitem.suitProductFroms.forEach(it => {
                (it.standardGold = 0),
                  (it.innerWeightStart = 0),
                  (it.innerWeightEnd = 0),
                  (it.orderSum = 0),
                  (it.allWeight = 0);
                it.suitProdctPeyFroms.forEach(iit => {
                  switch (iit.feeType) {
                    case 1:
                      iit.fee = "每克";
                      break;
                    case 2:
                      iit.fee = "每件";
                      break;
                    case 3:
                      iit.fee = "一口价";
                      break;
                  }
                  iit.styleKey = {};
                  iit.appearance = JSON.parse(iit.appearance);
                  iit.appearance.forEach(iiit => {
                    if (iiit.name === `diameterLengthStart` && iiit.value) {
                      iit.styleKey.name = `圈口`;
                      iiit.styleItem = {
                        name: `圈口`,
                        value: iit.diameterLength
                      };
                    }
                    if (iiit.name === `lengthStart` && iiit.value) {
                      iit.styleKey.name = `长度`;
                      iit.lengthStart = iiit.value;
                      iiit.styleItem = { name: `长度`, value: iiit.value };
                    }
                    if (iiit.name === `lengthEnd` && iiit.value) {
                      iit.styleKey.name = `长度`;
                      iit.lengthEnd = iiit.value;
                      iiit.styleItem = { name: `长度`, value: iiit.value };
                    }
                  });
                  it.standardGold += Number(iit.suitStandardGold);
                  it.allWeight +=
                    Number(iit.suitStandardGold) * Number(iit.orderSum);
                  it.orderSum += Number(iit.orderSum);
                  if (iit.innerWeight) {
                    it.innerWeightStart += Number(
                      iit.innerWeight.split("-")[0]
                    );
                    it.innerWeightEnd += Number(iit.innerWeight.split("-")[1]);
                  }
                });
                it.innerWeight = `${it.innerWeightStart}-${it.innerWeightEnd}`;
                it.productRemarks = it.suitProdctPeyFroms[0].productRemarks;
                it.allWeight = Number(it.standardGold) * Number(it.orderSum);
              });
            }
          });
          res.data.data.factoryProductFroms.forEach(item => {
            (item.allTotalStart = 0),
              (item.allTotalEnd = 0),
              (item.allTotal = 0),
              (item.faWeight = 0);
            if (item.suitProductFroms) {
              item.suitProductFroms.forEach(it => {
                if (item.allTotalWeight.toString().split("-")[1]) {
                  item.faWeight += Number(it.allWeight);
                } else {
                  item.allTotalWeight += Number(it.allWeight);
                }
              });
              if (item.allTotalWeight.toString().split("-")[1]) {
                item.allTotalStart =
                  Number(item.allTotalWeight.toString().split("-")[0]) +
                  Number(item.faWeight);
                item.allTotalEnd =
                  Number(item.allTotalWeight.toString().split("-")[1]) +
                  Number(item.faWeight);
              }
            } else {
              item.allTotalWeight = item.allTotalWeight;
            }
            if (
              item.suitProductFroms &&
              item.allTotalWeight.toString().split("-")[1]
            ) {
              item.allTotalWeight = `${item.allTotalStart.toFixed(
                2
              )}-${item.allTotalEnd.toFixed(2)}`;
              if (item.allTotalStart === item.allTotalEnd) {
                item.allTotalWeight = item.allTotalStart.toFixed(2);
              }
            }
            if (!item.allTotalWeight.toString().split("-")[1]) {
              item.allTotalWeight = Number(item.allTotalWeight).toFixed(2);
            }
          });
          res.data.data.startOrderTotailWeight = Number(
            res.data.data.startOrderTotailWeight
          ).toFixed(2);
          res.data.data.orderTotalWeight = Number(
            res.data.data.orderTotalWeight
          ).toFixed(2);
          if (
            Number(res.data.data.startOrderTotailWeight) ===
            Number(res.data.data.orderTotalWeight)
          ) {
            res.data.data.startOrderTotailWeight = 0;
            res.data.data.orderTotalWeight = Number(
              res.data.data.orderTotalWeight
            ).toFixed(2);
          }
          self.result = res.data.data;
        });
    },

    refWeightNum() {
      this.$axios
        .get(this.$portMain + "/stock/account/order/currentaccount")
        .then(res => {
          this.balance_material = res.data.data.balance_material;
          this.balance_account = res.data.data.balance_account;
        });
    },

    upAudit() {
      this.$axios
        .post(
          this.$portMain +
            "/orderManage/approveOrdersByOrderNo?orderNo=" +
            this.orderNo
        )
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
    //权限判断
    powerFun() {
      let self = this;
      this.powerControl = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "quick-approve"
      );
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

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
    background: #f5f5f5;

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
