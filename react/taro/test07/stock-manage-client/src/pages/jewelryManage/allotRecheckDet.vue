<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>复称详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />

      <div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="bizNo" label="复称单号"></el-table-column>
          <el-table-column prop="initiator" label="发起单位"></el-table-column>
          <el-table-column prop="recipient" label="接收单位"></el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="suttle" label="净重(g)"></el-table-column>
          <el-table-column prop="weight" label="毛重(g)"></el-table-column>
          <el-table-column prop="pcCreateName" label="操作人"></el-table-column>
          <el-table-column prop label="制单时间">
            <template slot-scope="scope">
              <span>{{$api.dateGetDayTime(scope.row.createDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="订单状态">
            <template slot-scope="scope">
              <span v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="txt14 txtHui lineHeight34 top10">
          <div>
            出库备注：
            <span class="txtBlack">{{orderDetail.invoiceMark?orderDetail.invoiceMark:'-'}}</span>
          </div>
        </div>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="12" class="txt16 txtBold">复称详情</el-col>
        <el-col :span="12" class="itemRight">
          <!-- <el-button type="danger" size="small" plain>红冲</el-button> -->
          <el-button type="primary" size="small" @click="confirmFun">确认复称</el-button>
        </el-col>
        <!-- <el-col :span="16" class="top10">
          <Steps :data="stepData" v-if="stepData"></Steps>
        </el-col>-->
      </el-row>
    </div>
    <baoDisplayReCheck :baoData="baoData" :proAllData="proAllData" :editTF="true"></baoDisplayReCheck>
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPFour :billData="allData" ref="myComp"></PrintTPFour>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: {}, //打印数据
      loadingState: false,
      viewBaoTF: false,
      orderTable: [], //头部表格
      orderTableTwo: [], //复称表格
      id: "", //出库单的属性id
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
      baoData: [] //包数据
    };
  },
  created() {
    let self = this;
    this.created_fun();
    document.onkeydown = e => {
      let dom = self.$refs.creatSendMaterial;
      if (dom && e.code == "F9") {
        // self.comFun();
      }
    };
    this.loopInit = this.loop();
  },
  methods: {
    created_fun() {
      this.id = this.$route.query.id;
      this.getOrderDetail();
    },

    getOrderDetail() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          id: this.id
        }
      };

      this.$axios
        .get(this.$portMain + "/biz/replypick/getReplyDeails", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data)
            self.orderTable = [res.data.data.bizInvoice];
            self.orderTableTwo = res.data.data.TransferSlip;
            self.orderDetail = res.data.data.bizInvoice;
            self.baoData = res.data.data.bizPack;
            self.proAllData = res.data.data;
            self.loadingState = false;
            self.assemblyPackageData();
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    //组件包数据
    assemblyPackageData() {
      let self = this;
      const { bizPack, bizPackDetails, bizPro } = this.proAllData;
      if (bizPack.length == 0) {
        return;
      }
      //没有店铺
      bizPack.forEach(item => {
        item.packDetail = [];
        item.packSkuNumbers = [];
        bizPackDetails.forEach(it => {
          if (item.packId == it.packId) {
            item.packSkuNumbers.push(it);
          }
        });
      });

      bizPack.forEach(item => {
        item.packSkuNumbers.forEach(it => {
          bizPro.forEach(one => {
            if (it.skuNumber == one.skuId) {
              one.proId = one.id;
              item.packDetail.push(Object.assign({}, one, it));
            }
          });
        });
      });

      //有店铺
      let parentPack = [];
      bizPack.forEach(item => {
        //   childPack = [];
        if (item.supPackId == undefined) {
          item.childPack = [];
          parentPack.push(item);
        }
      });

      if (parentPack.length > 0) {
        parentPack.forEach(one => {
          bizPack.forEach(two => {
            if (one.packId == two.supPackId) {
              one.childPack.push(two);
            }
          });
        });
        this.proAllData.parentPack = parentPack;
      }
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
    //电子秤读数事件
    comFun() {
      var self = this;
      if (!self.tempObj) {
        self.$message.error("实收净重或实收毛重没有被焦点选中！");
      }
      if (self.tempObj) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (!self.tempObj) {
        self.$message.error("实收净重或实收毛重没有被焦点选中！");
      }
      if (self.tempObj) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },

    //改变电子称输入框数量
    changeWeight(elem) {
      let self = this;
      let indOne = self.inputIndOne - 1;
      if (self.enterStatus === "复称净重") {
        self.baoList[indOne].newSuttle = parseFloat(elem);
      }
      if (self.enterStatus === "复称毛重") {
        self.baoList[indOne].newWeight = parseFloat(elem);
      }
      self.$forceUpdate();
    },
    //循环读取电子称输入框数量
    loop() {
      let oldVal = "";
      let self = this;
      let count = 0;
      return () => {
        if (count >= 20) {
          count = 0;
          this.$message.info(`重量没有改变，请检查是否读称成功！`);
          return;
        }

        setTimeout(() => {
          this.$$.ajax({
            type: "get",
            async: false,
            url:
              "http://localhost:5000/BalanceResult/result.js?t=" +
              new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              console.log("bbb:", json, json.weight);
              count++;
              var weightNum = json.weight ? json.weight : null;
              if (!oldVal) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
              if (oldVal && oldVal === weightNum) {
                self.changeWeight(weightNum);
                self.loopInit();
                return;
              }
              if (oldVal && oldVal !== weightNum) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
            },
            error: function() {
              // alert("fail");
            }
          });
        }, 150);
      };
    },
    //打印
    confirmFun() {
      let self = this;
      let confirmTF = false; //没有填入毛重、净重、数量的校验false为已填、true为数量未填
      let params = {
        id: this.id
      };
      // 复称打包情况
      if (this.proAllData.bizPack.length > 0) {
        let replyPackList = [];
        this.proAllData.bizPack.forEach(ielem => {
          let ielemData = {
            id: ielem.id,
            packId: ielem.packId,
            shopPack: ielem.shopPack,
            conditi: ielem.conditi,
            one: ielem.one,
            bizNo: ielem.bizNo,
            packTotalAmount: ielem.packTotalAmount,
            packTotalSuttle: ielem.packTotalSuttle,
            packNetTotalWeight: ielem.packNetTotalWeight,
            remark: ielem.remark,
            weightDif: ielem.weightDif,
            weightDifRemark: ielem.weightDifRemark
          };
          if (!ielem.packDetail || ielem.packDetail.length === 0) {
            confirmTF = true;
          } else {
            let replyPickProList = [];
            ielem.packDetail.forEach(jelem => {
              // console.log('aaa:',ielem)
              if (
                jelem.newAmount === 0 ||
                jelem.newAmount === null ||
                jelem.newSuttle === 0 ||
                jelem.newSuttle === null ||
                jelem.newWeight === 0 ||
                jelem.newWeight === null
              ) {
                confirmTF = true;
                return;
              }
              replyPickProList.push({
                id: jelem.proId ? jelem.proId : jelem.id,
                skuId: jelem.skuId,
                newAmount: jelem.newAmount,
                newSuttle: jelem.newSuttle,
                newWeight: jelem.newWeight,
                amount: jelem.amount,
                suttle: jelem.suttle,
                weight: jelem.weight
              });
            });
            ielemData.replyPickPros = replyPickProList;
          }
          replyPackList.push(ielemData);
        });
        params.replyPack = JSON.stringify(replyPackList);
      } else {
        let replyProList = [];
        this.proAllData.bizPro.forEach(ielem => {
          if (
            ielem.newAmount === 0 ||
            !ielem.newAmount ||
            !ielem.newSuttle ||
            ielem.newSuttle === 0 ||
            !ielem.newWeight ||
            ielem.newWeight === 0
          ) {
            confirmTF = true;
            return;
          }
          replyProList.push({
            id: ielem.id,
            skuId: ielem.skuId,
            newAmount: ielem.newAmount,
            newSuttle: ielem.newSuttle,
            newWeight: ielem.newWeight,
            amount: ielem.amount,
            suttle: ielem.suttle,
            weight: ielem.weight
          });
        });
        params.replyPro = JSON.stringify(replyProList);
        // console.log('bbb:',replyProList)
      }
      //没有填入毛重、净重、数量的校验false为已填、true为数量未填
      if (confirmTF) {
        this.$message.error(
          "毛重、净重、数量还有未填值或数量不能为0，请填写完善重新提交！"
        );
        return;
      } else {
        this.$api.formdataPostFun(
          this.$portMain + "/biz/replypick/confirmReply",
          params,
          res => {
            self.$message.success("复称成功，正在返回复称列表页！");
            setTimeout(function() {
              self.$router.push("allotRecheckList");
            }, 1000);
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      }
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
