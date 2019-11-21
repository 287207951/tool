<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />

      <div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="bizNo" label="调拨单号"></el-table-column>
          <el-table-column prop="initiator" label="发起单位"></el-table-column>
          <el-table-column prop="recipient" label="接收单位"></el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="suttle" label="净重(g)"></el-table-column>
          <el-table-column prop="weight" label="毛重(g)"></el-table-column>
          <el-table-column prop="creator" label="操作人"></el-table-column>
          <el-table-column prop label="制单时间">
            <template slot-scope="scope">
              <span>{{$api.dateGetDayTime(scope.row.createDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="订单状态">
            <template slot-scope="scope">
              <span v-html="$api.orderStatus(scope.row.invoiceStatu)" />
            </template>
          </el-table-column>
        </el-table>
        <div class="txt14 txtHui lineHeight34 top10">
          <div>
            出库备注：
            <span class="txtBlack">{{orderDetail.invoiceMark?orderDetail.invoiceMark:'-'}}</span>
          </div>
          <div v-if="orderDetail.invoiceStatuValue === '已拒签'">
            驳回原因：
            <span class="txtRed">{{orderDetail.remarkReason?orderDetail.remarkReason:'-'}}</span>
          </div>
        </div>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="18" class="txt16 txtBold">调拨入库详情</el-col>
        <el-col :span="6" class="itemRight displayFlex">
          <!-- <el-button type="primary" size="small" plain @click="cancelSignIn">拒绝签收</el-button>
          <el-button type="primary" size="small" @click="confirmSignIn">确认签收</el-button>-->
          <span
            v-for="(item, index) in buttonsArr"
            :key="item.val"
            @click="submitData(item.actionSign,item.actionName)"
            class="right20"
            v-if="!editTF || (item.actionName != '保存' && item.actionName != '提交')"
          >
            <el-button type="primary" size="small" :plain="index === 0">{{item.actionName}}</el-button>
          </span>
          <!-- <div
            v-for="(item, index) in buttonsArr"
            :key="item.val"
            @click="submitData(item.actionSign,item.actionName)"
            class="right20"
            v-if="!editTF || (item.actionName != '保存' && item.actionName != '提交')"
          >
            <el-button type="primary" size="small" :plain="index === 0">{{item.actionName}}</el-button>
          </div>-->
          <!-- <el-button type="primary" size="small" @click="printFun">打印({{orderDetail.print?orderDetail.print:0}})</el-button> -->
        </el-col>
        <el-col :span="16" v-if="stepData.length > 0">
          <!-- <Steps :data="stepData"></Steps> -->
        </el-col>
      </el-row>
    </div>

    <baoDisplay :baoData="baoData" :proAllData="proAllData"></baoDisplay>

    <!-- 打印 -->
    <div v-show="false">
      <PrintTPFour :billData="allData" ref="myComp"></PrintTPFour>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    buttonsArr() {
      if (this.buttonObj.buttons && this.buttonObj.buttons.length) {
        return this.buttonObj.buttons.reverse();
      } else {
        return [];
      }
    }
  },
  data() {
    return {
      allData: {}, //打印数据
      buttonObj: {}, //按钮对象按钮
      loadingState: false,
      viewBaoTF: false,
      orderTable: [], //头部表格
      orderTableTwo: [], //调拨表格
      bizNo: "", //出库单的属性id
      productData: [], //产品数据
      productIndex: 0, //选中产品下标
      orderDetail: {
        jBaos: [
          {
            baoCode: "",
            baoAmount: "",
            baoWeight: "",
            baoStockWeight: "",
            baoCustomerName: "",
            baoOrderCode: ""
          }
        ]
      },
      mock: "",
      data: [
        {
          label: 12,
          label1: 66
        }
      ],
      totalWeight: 0,
      nowTime: "",
      priceTxt: "",
      ceditSumNum: 0,
      baoData: [], //包数据
      stepData: [],
      customerData: []
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.bizNo = this.$route.query.bizNo;
      this.getOrderDetail();
    },

    getOrderDetail() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          bizNo: this.bizNo
        }
      };

      this.$axios
        .get(this.$portMain + "/transferController/findAllotDataIn", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data)
            self.orderTable = [res.data.data.bizInvoice];
            self.orderTableTwo = res.data.data.TransferSlip;
            self.orderDetail = res.data.data.bizInvoice;
            self.baoData = res.data.data.bizPack;
            self.proAllData = res.data.data;
            // self.stepData = self.orderDetail.managePersons?self.orderDetail.managePersons:[];
            // self.getProcessData(
            //   self.proAllData.bizInvoice.bizNo,
            //   self.proAllData.bizInvoice.bizType
            // );
            self.buttonObj = res.data.data.bizAuxiliary
              ? res.data.data.bizAuxiliary
              : {};
            self.loadingState = false;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    //获取流程数据
    getProcessData(bizNo, bizType) {
      let self = this;
      let params = {
        bizNo,
        bizType
      };
      this.$api.formdataPostFun(
        this.$portMain + "/process/selectProcessManageInfo",
        params,
        res => {
          self.stepData = res.data ? res.data : [];
        },
        err => {
          self.$message.error(err.msg);
          self.stepData = [];
        }
      );
    },
    //查询包产品数据
    getProduct(baoId, index) {
      let self = this;
      let params = {
        outstoreId: this.outStoreId,
        baoId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/selectSkuBaoByExhibit",
        params,
        res => {
          self.productData = res.data;
          self.viewBaoTF = true;
          self.productIndex = index;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //状态变更
    submitData(elem, name) {
      let self = this;
      switch (name) {
        case "拒签":
          this.$prompt("请输入驳回原因", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputType: "textarea"
          })
            .then(({ value }) => {
              let params = {
                bizNo: this.bizNo,
                statu: elem,
                statuValue: name,
                invoiceEcho: !value ? "" : value
              };
              this.$api.formdataPostFun(
                this.$portMain + "/transferController/vorifyTransferIn",
                params,
                res => {
                  this.$message.success(
                    `此单${name}成功，正在返回调拨入库列表页！`
                  );
                  setTimeout(function() {
                    self.$router.push("allotInList");
                  }, 1000);
                },
                err => {
                  self.$message.error(err.msg);
                }
              );
            })
            .catch(() => {});
          break;
        default:
          this.$confirm(`此操作将${name}此单, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",

            type: "warning"
          }).then(() => {
            let params = {
              bizNo: this.bizNo,
              statu: elem,
              statuValue: name
            };
            this.$api.formdataPostFun(
              this.$portMain + "/transferController/vorifyTransferIn",
              params,
              res => {
                this.$message.success(
                  `此单${name}成功，正在返回调拨入库列表页！`
                );
                setTimeout(function() {
                  self.$router.push("allotInList");
                }, 1000);
              },
              err => {
                self.$message.error(err.msg);
              }
            );
          });
          break;
      }
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
        if (
          column.label === "毛重(g)" ||
          column.label === "净重(g)" ||
          column.label === "折重(g)" ||
          column.label === "金额(￥)"
        ) {
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
    //打印
    printFun() {
      let self = this;
      this.allData.sponsorUnit = this.orderDetail.initiator; //发送单位
      this.allData.customerName = this.orderDetail.recipient; //接收单位
      this.allData.orderCode = this.orderDetail.bizNo; //单号
      this.allData.note = this.orderDetail.invoiceMark; //备注
      this.allData.transferSlips = this.orderTableTwo;
      var params = { PRS: { bizNo: this.bizNo } };
      self.$refs.myComp.compPrintFun();
      if (!self.$refs.myComp.LODOP) {
        return;
      }
      this.$axios
        .get(self.$portMain + "/transferController/addPrint", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("正在打印！");
            setTimeout(function() {
              //   self.$refs.myComp.compPrintFun();
              self.created_fun();
            }, 1000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    }
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
    padding-top: 19px;

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
</style>
