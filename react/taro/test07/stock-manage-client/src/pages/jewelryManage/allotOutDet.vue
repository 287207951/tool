<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库详情</el-breadcrumb-item>
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
              <span v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
              <!-- <span class="txtOrange"
                    v-if="scope.row.invoiceStatuValue === '制单'||scope.row.invoiceStatuValue === '待审核'">{{scope.row.invoiceStatuValue}}</span>
              <span class="txtYellow"
                    v-else-if="scope.row.invoiceStatuValue === '已作废'">{{scope.row.invoiceStatuValue}}</span>
              <span class="txtHui"
                    v-else-if="scope.row.invoiceStatuValue === '已出库'">{{scope.row.invoiceStatuValue}}</span>
              <span class="txtRed"
                    v-else-if="scope.row.invoiceStatuValue === '已驳回'">{{scope.row.invoiceStatuValue}}</span>
              <span class="txtBlack"
              v-else>{{scope.row.invoiceStatuValue}}</span>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="txt14 txtHui lineHeight34 top10">
          <div>
            出库备注：
            <span class="txtBlack">{{orderDetail.invoiceMark?orderDetail.invoiceMark:'-'}}</span>
          </div>
          <div v-if="orderDetail.remarkReason">
            原因：
            <span class="txtRed">{{orderDetail.remarkReason?orderDetail.remarkReason:'-'}}</span>
          </div>
        </div>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="18" class="txt16 txtBold">调拨出库详情</el-col>
        <el-col :span="6" class="itemRight displayFlex txtRight">
          <div
            v-for="(item, index) in buttonObj.buttons"
            :key="item.val"
            @click="submitData(item.actionSign,item.actionName)"
            class="right20 floatRight"
            v-if="!editTF || (item.actionName != '保存' && item.actionName != '提交')"
          >
            <el-button type="primary" size="small" :plain="index === 0">{{item.actionName}}</el-button>
          </div>
          <el-button type="primary" size="small" @click="editFun" v-if="editTF" plain class="right20">编辑</el-button>
        </el-col>
        <el-col :span="16" v-if="stepData.length > 0">
          <Steps :data="stepData"></Steps>
        </el-col>
      </el-row>
    </div>

    <baoDisplay :baoData="baoData" :proAllData="proAllData"></baoDisplay>
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPFour :billData="allData" ref="myComp"></PrintTPFour>
    </div>
    <!-- 出库表单弹框 -->
    <el-dialog title="调拨出库表单" :visible.sync="findTableTF" width="1266px">
      <el-row class="txtHui">
        <el-col :span="8" class="top10">
          发起单位：
          <span class="txtBlack">{{orderDetail.initiator}}</span>
        </el-col>
        <el-col :span="8" class="top10">
          调拨单号：
          <span class="txtBlack">{{orderDetail.bizNo}}</span>
        </el-col>
        <el-col :span="8" class="top10">
          日期：
          <span class="txtBlack">{{$moment().format("YYYY年MM月DD日 HH:mm:ss") }}</span>
        </el-col>
        <el-col :span="16" class="top10">
          接收单位：
          <span class="txtBlack">{{orderDetail.recipient}}</span>
        </el-col>
        <el-col :span="8" class="top10">
          备注：
          <span class="txtBlack">{{orderDetail.invoiceMark}}</span>
        </el-col>
      </el-row>
      <el-table :data="findTableData" show-summary :summary-method="getSummariesTwo" border>
        <el-table-column prop="species" align="center" label="种类" width="100"></el-table-column>
        <el-table-column prop="category" align="center" label="营销品类" width="110"></el-table-column>
        <el-table-column prop="purWeight" align="center" label="毛重"></el-table-column>
        <el-table-column prop="weight" align="center" label="净重"></el-table-column>
        <el-table-column prop align="center" label="成色">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.purity"
              @change="changeNum(scope.row)"
              :min="0"
              :max="1"
              placeholder
              size="small"
              class="width90"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="suttleWeight" align="center" label="折重">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.suttleWeight"
              placeholder
              size="small"
              class="width70"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="priceG" align="center" label="单价/克">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.priceG"
              placeholder
              size="small"
              class="width70"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="sum" align="center" label="数量">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.sum"
              placeholder
              size="small"
              class="width70"
              disabled
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="priceJ" align="center" label="单价/件">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.priceJ"
              placeholder
              size="small"
              class="width70"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="money" align="center" label="金额">
          <template slot-scope="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.money"
              placeholder
              size="small"
              class="width90"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="remark" align="center" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="findTableTF = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitFindTabFun">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      proAllData: {},
      buttonObj: {}, //按钮对象按钮
      editTF: false, //编辑按钮行
      allData: {}, //打印数据
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
      stepData: [],
      baoData: [], //包数据
      findTableTF: false, //出库表单弹窗
      findTableData: [] //出库表单数据
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.bizNo = this.$route.query.bizNo;
      //获取单号详情
      this.getOrderDetail();
    },
    //获取单号详情
    getOrderDetail() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          bizNo: this.bizNo
        }
      };
      this.$axios
        .get(this.$portMain + "/transferController/findAllotData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data.bizInvoice)
            self.orderTable = [res.data.data.bizInvoice];
            self.orderTableTwo = res.data.data.TransferSlip;
            self.orderDetail = res.data.data.bizInvoice;
            self.baoData = res.data.data.bizPack;
            self.proAllData = res.data.data;
            self.buttonObj = res.data.data.bizAuxiliary
              ? res.data.data.bizAuxiliary
              : {};
            self.getProcessData(
              self.proAllData.bizInvoice.bizNo,
              self.proAllData.bizInvoice.bizType
            );
            // self.stepData = self.orderDetail.managePersons?self.orderDetail.managePersons:[];
            if (self.buttonObj.bizRwStatu) {
              self.buttonObj.bizRwStatu.forEach(ielem => {
                if (ielem === "WRITE") {
                  //可编辑按钮
                  self.editTF = true;
                }
              });
            }
            self.assemblyPackageData();
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

    //组件包数据
    assemblyPackageData() {
      let self = this;
      const { bizPack, bizPackDetails, bizPro } = this.proAllData;
      if (bizPack.length == 0) {
        return;
      }
      //没有店铺
      bizPack.forEach(item => {
        item.packDetails = [];
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
              item.packDetails.push(Object.assign({}, one, it));
            }
          });
        });
      });

      //有店铺
      let parentPack = [];
      bizPack.forEach(item => {
        //   childPack = [];
        if (item.shopName != undefined && item.shopName != "") {
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
      // console.log('proAllData:',this.proAllData)
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
    //编辑
    editFun() {
      this.$router.push({
        path: "allotOutEdit",
        query: { bizNo: this.bizNo }
      });
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
    },

    //作废
    cancelFun() {
      let self = this;
      this.$confirm("此操作将作废此单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          bizNo: this.bizNo,
          statu: "DISCARD",
          statuValue: "已作废"
        };
        this.$api.formdataPostFun(
          this.$portMain + "/transferController/vorifyTransfer",
          params,
          res => {
            this.$message.success(`此单作废成功，正在返回调拨出库列表页！`);
            setTimeout(function() {
              self.$router.push("allotOutList");
            }, 1000);
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      });
    },
    //驳回
    rejectFun() {
      let self = this;
      this.$prompt("请输入驳回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea"
      }).then(({ value }) => {
        let params = {
          bizNo: this.bizNo,
          statu: "REJECT",
          statuValue: "已驳回",
          invoiceEcho: !value ? "" : value
        };
        this.$api.formdataPostFun(
          this.$portMain + "/transferController/vorifyTransfer",
          params,
          res => {
            this.$message.success(`此单驳回成功，正在返回调拨出库列表页！`);
            setTimeout(function() {
              self.$router.push("allotOutList");
            }, 1000);
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      });
    },
    //审核通过
    confirmedFun() {
      let self = this;
      this.$confirm("此操作将审核通过此单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          bizNo: this.bizNo,
          statu: "CONFIRMED",
          statuValue: "已审核"
        };
        this.$api.formdataPostFun(
          this.$portMain + "/transferController/vorifyTransfer",
          params,
          res => {
            this.$message.success(`此单审核通过成功，正在返回调拨出库列表页！`);
            setTimeout(function() {
              self.$router.push("allotOutList");
            }, 1000);
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      });
    },

    //调拨合计
    getSummariesTwo(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        // console.log(column)
        if (
          column.label === "毛重" ||
          column.label === "净重" ||
          column.label === "折重" ||
          column.label === "数量" ||
          column.label === "金额"
        ) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              // console.log(values)
              const value = Number(curr);
              if (!isNaN(value)) {
                return (Number(prev) + Number(curr)).toFixed(2);
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
    //确认出库弹框
    confirmOutAllot() {
      let self = this;
      var params = { PRS: { bizNo: this.bizNo } };
      this.$axios
        .get(self.$portMain + "/transferController/findTransferData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findTableData = res.data.data;
            self.findTableData.forEach(ielem => {
              // console.log(ielem)
              ielem.purity = 1;

              self.changeNum(ielem);
              ielem.money = ielem.money ? ielem.money : null;
              ielem.priceG = ielem.priceG ? ielem.priceG : null;
              ielem.priceJ = ielem.priceJ ? ielem.priceJ : null;
              ielem.remark = ielem.remark ? ielem.remark : null;
            });
            // console.log(self.findTableData)
            self.findTableTF = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //自动算折重数量
    changeNum(elem) {
      let self = this;
      //校验数量不能为负数和小数
      if (elem.editNum) {
        elem.editNum = parseInt(elem.editNum);
        if (elem.editNum < 0) {
          elem.editNum = 0;
        }
      }
      setTimeout(() => {
        elem.suttleWeight = self.$api.returnFloatNum(elem.purity * elem.weight);
      }, 500);
      this.$forceUpdate();
    },
    //状态变更
    submitData(elem, name) {
      let self = this;
      // console.log(name === '驳回')
      if (name != "驳回") {
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
            this.$portMain + "/transferController/vorifyTransfer",
            params,
            res => {
              this.$message.success(
                `此单${name}成功，正在返回调拨出库列表页！`
              );
              setTimeout(function() {
                self.$router.push("allotOutList");
              }, 1000);
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        });
      } else {
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
              this.$portMain + "/transferController/vorifyTransfer",
              params,
              res => {
                this.$message.success(
                  `此单${name}成功，正在返回调拨出库列表页！`
                );
                setTimeout(function() {
                  self.$router.push("allotOutList");
                }, 1000);
              },
              err => {
                self.$message.error(err.msg);
              }
            );
          })
          .catch(() => {});
      }
    },
    //出库提交按钮
    submitFindTabFun() {
      let self = this;
      let params = {
        bizNo: this.bizNo,
        transferSlipList: this.findTableData,
        statu: "STOCKUP",
        statuValue: "待出库",
        fromDiv: JSON.stringify({
          name: "调拨出库",
          // value: "物流",
          tabRight: this.findTableData,
          orderRemarks: this.orderDetail.invoiceMark
        })
      };
      this.$axios
        .post(self.$portMain + "/transferController/addOutWare", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findTableTF = false;
            self.$message.success("调拨出库成功！");
            setTimeout(function() {
              self.created_fun();
            }, 1000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
      // console.log(params)
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
.right20{
  margin-right:20px;
}
</style>
