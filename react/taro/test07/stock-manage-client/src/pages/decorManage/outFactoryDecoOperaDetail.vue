<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰申请列表</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰申请详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info" v-loading="webLoadingTF">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">调拨单号</div>
            <div class="th">发起部门</div>
            <div class="th">接收客户</div>
            <div class="th">数量</div>
            <!-- <div class="th">毛重(g)</div> -->
            <div class="th">克重(g)</div>
            <div class="th">操作人</div>
            <div class="th">操作日期</div>
            <div class="th">订单状态</div>
            <div class="th" v-if="false"></div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{sarkData.orderNo}}</div>
            <div class="td">
              <span v-if="sarkData.sponsor == undefined">-</span>
              <span v-if="sarkData.sponsor == 'A'">尚金缘金库</span>
              <span v-if="sarkData.sponsor == 'B'">尚金缘物流</span>
              <span v-if="sarkData.sponsor == 'C'">尚金缘展厅</span>
              <span v-if="sarkData.sponsor == 'D'">天津或者杭州工厂</span>
            </div>
            <div class="td">
              <span v-if="sarkData.receiverUnit == undefined">-</span>
              <span v-if="sarkData.receiverUnit == 'A'">尚金缘金库</span>
              <span v-if="sarkData.receiverUnit == 'B'">尚金缘物流</span>
              <span v-if="sarkData.receiverUnit == 'C'">尚金缘展厅</span>
              <span v-if="sarkData.receiverUnit == 'D'">天津或者杭州工厂</span>
            </div>
            <div class="td">{{sarkData.orderTotalSum}}</div>
            <!-- <div class="td">{{sarkData.totailOrderWeight}}</div> -->
            <div class="td">{{sarkData.endOrderTotalWeight}}</div>
            <div class="td">{{sarkData.operateUser}}</div>
            <div class="td">{{sarkData.orderCreateTime}}</div>

            <div class="td">
              <span v-if="sarkData.orderStatus == undefined">-</span>
              <span v-if="sarkData.orderStatus == '1'" class="yellowColor">待审核</span>
              <span v-if="sarkData.orderStatus == '2'" class="blackColor">已通过</span>
              <span v-if="sarkData.orderStatus == '3'" class="redColor">已取消</span>
              <span v-if="sarkData.orderStatus == '4'" class="redColor">已驳回</span>
              <span v-if="sarkData.orderStatus == '5'" class="redColor">已退货</span>
              <span v-if="sarkData.orderStatus == '10'" class="redColor">已出库</span>
            </div>

            <div class="td handle" v-if="false">
              <el-button
                type="primary"
                size="mini"
                @click="upAudit"
                :loading="loadingTF"
                v-if="sarkData.orderStatus == '1'"
              >提交审批</el-button>
              <el-button
                type="warning"
                style="margin-top: 10px"
                size="mini"
                @click="backOrder"
                :loading="loadingTF"
                v-if="sarkData.orderStatus == '1'"
              >退回</el-button>
            </div>
          </div>
          <div class="tr tabTwo" v-if="orderData.orderRemarks || orderData.backRemarks">
            <div
              class="td tabTwoS"
              style="height:30px; padding:10px;padding-left:20px;width:100%;justify-content:left"
              v-if="orderData.orderRemarks"
            >调拨原因：{{orderData.orderRemarks}}</div>
            <div
              class="td tabTwoS"
              style="height:30px; padding:10px;padding-left:20px;width:100%;justify-content:left"
              v-if="orderData.backRemarks"
            >
              驳回原因：
              <span class="red_font">{{orderData.backRemarks}}</span>
            </div>
          </div>
          <div class="tr" style="border: none">
            <el-col :span="16">
              <Steps :data="orderData.perFroms" v-if="orderData.perFroms" style="padding: 15px 0"></Steps>
            </el-col>
          </div>
        </div>
      </div>
      <div class="info-middle">
        <div class="infom-info" v-for="(item,ind) in orderData.transfOrderProducts" :key="ind">
          <div class="infom-item">
            <div class="pro-item">
              <div class="pro-imgs">
                <img
                  :src="item.productImg?$portImg+item.productImg:'../../../../static/images/img-noimg.png'"
                  width="153"
                  height="116"
                >
              </div>
              <div class="pro-right">
                <el-row>
                  <el-col :span="18" class="pro-tit">{{item.productName}}</el-col>
                  <!-- <el-col
                    :span="10"
                    class="pro-middle redTxt"
                  >库位：{{item.location}}</el-col>-->
                  <el-col :span="6" class="pro-middle redTxt txtRight">
                    <el-tooltip
                      :content="item.productRemarks"
                      placement="top"
                      effect="light"
                      v-if="item.productRemarks"
                    >
                      <el-button size="small">已备注</el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="pro-middle">编号：{{item.skuNum}}</el-col>
                  <el-col :span="4" class="pro-middle">材质：{{item.goldCode}}</el-col>
                  <!-- <el-col
                    :span="16"
                    class="pro-middle"
                  >表面工艺：{{item.pait}}</el-col>-->
                  <el-col :span="16" class="pro-middle"></el-col>
                  <!-- <el-col
                    :span="4"
                    class="txtFive"
                  >毛重(g)：{{item.totailOrderWeight}}</el-col>-->
                </el-row>
                <el-row>
                  <el-col :span="4" class="pro-middle">产品类别：{{item.productTypeName}}</el-col>
                  <el-col :span="4" class="pro-middle">生产工艺：{{item.craft}}</el-col>
                  <el-col
                    :span="10"
                    class="pro-middle"
                  ><span v-if="item.carFlower">车花：{{item.carFlower}}</span> &nbsp;</el-col>
                  <!-- <el-col :span="10" class="pro-middle"></el-col> -->
                  <el-col
                    :span="4"
                    class="txtFive"
                  >出库克重(g)：{{$api.returnFloatNum(item.standardGold*item.orderSum)}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="pro-bottom">成色：{{item.productCs}}</el-col>
                  <el-col :span="4" class="pro-bottom">克重(g): {{item.standardGold}}</el-col>
                  <el-col :span="10" class="pro-bottom">
                    <b v-if="item.extendAttr && item.one" v-html="$api.getAttachProperty(item.one,item.extendAttr)"></b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtFive">出库数量：{{item.orderSum}}</el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
        <!-- 单品end -->
        <!-- 套装start -->
        <div class="infom-info" v-for="(item,ind) in orderData.transfSuitProductFroms" :key="ind">
          <div class="infom-item">
            <div class="pro-item">
              <div class="pro-imgs">
                <img
                  :src="item.productImg?$portImg+item.productImg:'../../../../static/images/img-noimg.png'"
                  width="153"
                  height="116"
                >
              </div>
              <div class="pro-right">
                <el-row>
                  <el-col :span="18" class="pro-tit">{{item.productName}}</el-col>
                  <!-- <el-col
                    :span="10"
                    class="pro-middle redTxt"
                  >库位：{{item.location}}</el-col>-->
                  <el-col :span="6" class="pro-middle redTxt txtRight">
                    <el-tooltip
                      :content="item.productRemarks"
                      placement="top"
                      effect="light"
                      v-if="item.productRemarks"
                    >
                      <el-button size="small">已备注</el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="pro-middle">编号：{{item.productSkuNum}}</el-col>
                  <!-- <el-col
                    :span="4"
                    class="txtFive"
                  >毛重(g)：{{item.totailOrderWeight}}</el-col>-->
                </el-row>
                <el-row>
                  <el-col :span="18" class="pro-middle">&nbsp;</el-col>
                  <el-col :span="4" class="txtFive">
                    <span>出库克重(g)：{{$api.returnFloatNum(item.totailWeight*item.orderSum)}}</span>&nbsp;
                  </el-col>
                  <el-col :span="2" class="redTxt">
                    <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">
                      详情
                      <i class="el-icon-arrow-up"></i>
                    </span>
                    <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">
                      详情
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" class="pro-middle">&nbsp;</el-col>
                  <el-col :span="6" class="txtFive">出库数量：{{item.orderSum}}</el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="suitDiv" v-if="item.viewSuit">
            <el-row>
              <el-col
                :span="11"
                class="suitSubDiv"
                v-for="(ielem,indTwo) in item.transfOrderProducts"
                :key="indTwo+''"
              >
                <div class="pro-item">
                  <div class="pro-imgs">
                    <img
                      :src="ielem.productImg?$portImg+ielem.productImg:'../../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row>
                      <el-col :span="11" class="pro-tit">{{ielem.productName}}</el-col>
                      <el-col :span="13" class="pro-middle redTxt txtRight">
                        <el-tooltip
                          :content="ielem.productRemarks"
                          placement="top"
                          effect="light"
                          v-if="ielem.productRemarks"
                        >
                          <el-button size="small">已备注</el-button>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8" class="pro-middle">编号：{{ielem.skuNum}}</el-col>
                      <el-col :span="5" class="pro-middle">材质：{{ielem.goldCode}}</el-col>
                      <el-col :span="7" class="pro-middle">表面工艺：{{ielem.pait}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">产品类别：{{ielem.productTypeName}}</el-col>
                      <el-col :span="5" class="pro-middle">生产工艺：{{ielem.craft}}</el-col>
                      <el-col
                        :span="7"
                        class="pro-middle"
                      ><span v-if="ielem.carFlower">车花：{{ielem.carFlower}}</span> &nbsp;</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-bottom">成色：{{ielem.productCs}}</el-col>
                      <el-col :span="5" class="pro-bottom">克重(g): {{ielem.standardGold}}</el-col>
                      <el-col
                        :span="5"
                        class="pro-bottom"
                      >
                        <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 套装end -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      stepsActive: 1,
      orderList: [],
      result: {},
      orderNo: "",
      orderData: {}, //订单详情
      loadingTF: false,
      webLoadingTF: false
    };
  },

  created() {
    this.sarkData = JSON.parse(localStorage.sarkData);
    this.orderNo = this.sarkData.orderNo;
    this.created_fun();
  },

  methods: {
    created_fun() {
      let self = this;
      self.webLoadingTF = true;
      let params = {
        orderNo: self.orderNo
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/selectOpretaOrderTrandfByOrderNo",
        params,
        res => {
          if (res.code == 200) {
            self.webLoadingTF = false;
            self.orderData = res.data;
            if (self.orderData.transfOrderProducts) {
              self.orderData.transfOrderProducts.forEach(ielem => {
                // console.log(ielem.extendAttr)
                ielem.sizeData = JSON.parse(ielem.extendAttr);
                ielem.viewSuit = false;
              });
            }
            if (self.orderData.transfSuitProductFroms) {
              self.orderData.transfSuitProductFroms.forEach(ielem => {
                // console.log(ielem.transfOrderProducts)
                ielem.transfOrderProducts.forEach(jelem => {
                  jelem.sizeData = JSON.parse(jelem.extendAttr);
                  jelem.viewSuit = false;
                });
                // ielem.sizeData = JSON.parse(ielem.extendAttr)
                // ielem.viewSuit = false
              });
            }

            let stepAc = "";
            if (!self.orderData.perFroms) {
              self.orderData.perFroms = [];
            }
            for (var i = 0; i < self.orderData.perFroms.length; i++) {
              if (self.orderData.perFroms[i].orderStatus === 1) {
                stepAc = i + 1;
                break;
              }
            }
            if (stepAc) {
              this.stepsActive = stepAc;
            } else {
              this.stepsActive = self.orderData.perFroms.length + 1;
            }
            self.orderData.perFroms.unshift({
              prcessName: "发起人",
              step: 1,
              orderStatus: 2,
              processTypeFroms: [
                {
                  operateName: self.sarkData.operateUser
                }
              ]
            });
            // console.log(self.sarkData.operateUser)
            //
          }
        },
        err => {
          self.webLoadingTF = false;
        }
      );
    },
    //提交审核
    upAudit() {
      var self = this;
      self.loadingTF = true;
      let params = {
        orderNo: this.orderNo
      };
      this.$api.formdataPostFun(
        self.$portMain + "/order/updataTrandfOrdersByOrderNo",
        params,
        res => {
          if (res.code === 200) {
            self.loadingTF = false;
            self.$message.success("提交审批成功！");
            setTimeout(function() {
              // self.created_fun();
              self.$router.push("outFactoryDecoOpera");
            }, 1000);
          }
        },
        err => {
          self.loadingTF = false;
        }
      );
    },

    backOrder() {
      var self = this;
      self.loadingTF = true;
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        if (value) {
          self.orderNo = JSON.parse(localStorage.sarkData).orderNo;
          let params = { orderNo: self.orderNo, backRemarks: value };
          this.$api.formdataPostFun(
            self.$portMain + "/order/backTrandfOrdersRemarks",
            params,
            res => {
              self.loadingTF = false;
              self.$message.success("退回调拨单成功，正在刷新！");
              setTimeout(function() {
                // self.created_fun();
                self.$router.push("outFactoryDecoOpera");
              }, 1000);
            },
            err => {
              self.loadingTF = false;
            }
          );
        } else {
          self.loadingTF = false;
          self.$message.error("驳回原因不能为空！");
        }
      });
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    addImg() {}
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.yellowColor {
  color: #F26D0F;
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

      .infom-tit {
        padding: 0 20px;
        line-height: 40px;
        background: #fff;
      }

      .infom-info {
        margin: 20px 0 0 0;

        .infom-item {
          display: flex;
        }
      }
    }
  }

  .pro-item {
    width: 98%;
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
    width: calc(100% - 170px);
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

  .tabTwo {
    margin-top: 20px;
    height: 60px;

    .tabTwoS {
      align-items: start;
    }
  }

  .txtRight {
    text-align: right;
  }

  .suitDiv {
    border: 1px solid #E9ECF5;
    border-top: 0;
    background: #FAFAFA;
    padding: 10px;

    .suitSubDiv {
      padding: 10px;
      margin: 0px 10px;
    }
  }

  .txtFive {
    font-weight: bold;
    font-size: 14px;
  }

  .redTxtOne {
    color: #F20F34;
    font-weight: bold;
  }
}
</style>
