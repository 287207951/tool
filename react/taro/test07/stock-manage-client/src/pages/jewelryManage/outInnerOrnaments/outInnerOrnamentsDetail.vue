<template>
  <div class="outOfStock" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>出内部饰详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="bizNo" label="出库单号"></el-table-column>
          <el-table-column prop="invoiceEcho" label="拣货单号"></el-table-column>
          <el-table-column prop="initiator" label="发起单位"></el-table-column>
          <el-table-column prop="recipient" label="接收单位"></el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="suttle" label="净重(g)"></el-table-column>
          <el-table-column prop="weight" label="毛重(g)"></el-table-column>
          <el-table-column prop label="制单时间">
            <template slot-scope="scope">
              <span>{{scope.row && scope.row.createDate?$api.dateGetDayTime(scope.row.createDate) : ''}}</span>
            </template>
          </el-table-column>
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
            出库备注：
            <span class="txtBlack">{{orderDetail.invoiceMark?orderDetail.invoiceMark:'-'}}</span>
          </div>
          <div v-if="orderDetail.invoiceStatuValue === '已驳回'">
            驳回原因：
            <span class="txtRed">{{orderDetail.invoiceEcho?orderDetail.invoiceEcho:'-'}}</span>
          </div>
        </div>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="18" class="txt16 txtBold">出饰单详情</el-col>
        <el-col :span="6" class="itemRight displayFlex txtRight">
          <span>
            <el-button
              type="primary"
              v-if="orderDetail.invoiceStatuValue !== '已入库' && orderDetail.invoiceStatuValue !== '已出库' && orderDetail.invoiceStatuValue !== '已拒签' && orderDetail.invoiceStatuValue !== '已签收'"
              size="small"
              @click="confirmOutAllot"
            >确认出库</el-button>
          </span>
          <span
            v-if="orderDetail.invoiceStatuValue === '已出库' || orderDetail.invoiceStatuValue === '已入库'"
          >
            <el-button type="primary" size="small" @click="printFun">打印({{orderDetail.print || 0}})</el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <packge-list v-if="baoData.length" :columns="packgeColumns" idKey="packId" :allData="allData"></packge-list>
    <product-list
      v-if="!baoData.length"
      idKey="proId"
      :imgBaseUrl="$portImg"
      titleKey="proName"
      imgUrlKey="proBasics.pic"
      :layoutSetting="layoutSetting"
      :listData="productListData"
    ></product-list>

    <div v-show="false">
      <PrintTPNine :billData="printData" ref="myComp"></PrintTPNine>
    </div>
    <!-- 出库单详情弹框 -->
    <el-dialog title="出库单详情" :visible.sync="findTableTF" width="1266px">
      <el-row class="txtHui">
        <el-col :span="8" class="top10">
          发起单位：
          <span class="txtBlack">{{findTableData.initiator}}</span>
        </el-col>
        <el-col :span="8" class="top10">
          出库单号：
          <span class="txtBlack">{{findTableData.bizNo}}</span>
        </el-col>
        <el-col :span="8" class="top10">
          日期：
          <span class="txtBlack">{{findTableData.createDate}}</span>
        </el-col>
        <el-col :span="16" class="top10">
          接收单位：
          <span class="txtBlack">{{findTableData.recipient}}</span>
        </el-col>
        <el-col :span="8" class="top10">
          备注：
          <span class="txtBlack">{{findTableData.invoiceMark}}</span>
        </el-col>
      </el-row>
      <el-table :data="findTableData.list" show-summary :summary-method="getSummaries" border>
        <el-table-column prop="packages" align="center" label="包号" width="100"></el-table-column>
        <el-table-column prop="species" align="center" label="种类" width="100"></el-table-column>
        <el-table-column prop="category" align="center" label="营销品类" width="110"></el-table-column>
        <el-table-column prop="weight" width="90" align="center" label="毛重"></el-table-column>
        <el-table-column prop="suttleWeight" width="90" align="center" label="净重"></el-table-column>
        <el-table-column prop="purity" align="center" width="90" label="成色">
          <!-- <template slot-scope="scope">
            <el-input-number :controls="false"
                             @blur="changeNum"
                             :min="0"
                             :max="1"
                             placeholder
                             size="small"
                             class="width90"></el-input-number>
          </template>-->
        </el-table-column>
        <el-table-column prop="purWeight" align="center" width="90" label="折重">
          <!-- <template slot-scope="scope">
            <el-input-number :controls="false"
                             v-model="scope.row.suttleWeight"
                             placeholder
                             size="small"
                             class="width70"></el-input-number>
          </template>-->
        </el-table-column>
        <el-table-column prop="priceG" align="center" width="90" label="单价/克">
          <template slot-scope="scope">
            <!-- <el-input-number :controls="false"
                             v-model="scope.row.priceG"
                             @blur="gramInputBlur"
                             size="small"
            class="width70"></el-input-number>-->
            --
          </template>
        </el-table-column>
        <el-table-column prop="sum" width="90" align="center" label="数量">
          <!-- <template slot-scope="scope">
            <el-input-number :controls="false"
                             v-model="scope.row.sum"
                             placeholder
                             size="small"
                             class="width70"
                             disabled></el-input-number>
          </template>-->
        </el-table-column>
        <el-table-column prop="priceJ" width="90" align="center" label="单价/件">
          <template slot-scope="scope">
            <!-- <el-input-number :controls="false"
            @blur="pieceInputBlur"
                             placeholder
                             v-model="scope.row.priceJ"
                             size="small"
            class="width70"></el-input-number>-->
            --
          </template>
        </el-table-column>
        <el-table-column prop="money" width="90" align="center" label="金额">
          <!-- <template slot-scope="scope">
            <el-input-number :controls="false"
                             v-model="scope.row.money"
                             placeholder
                             size="small"
                             class="width90"></el-input-number>
          </template>-->
        </el-table-column>
        <el-table-column prop="remark" align="center" label="备注">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.remark"
                      placeholder
                      size="small"></el-input>
          </template>-->
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="findTableTF = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitFindTabFun">提交并打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import packgeList from "@/components/packge-list";
import productList from "@/components/product-list.vue";
export default {
  data() {
    return {
      allData: {},
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
          span: 2,
          tooltip: true
        },
        {
          labelKey: "毛重(g)",
          valueKey: "packNetTotalWeight",
          span: 2,
          tooltip: true
        },
        {
          labelKey: "毛重差异(g)",
          valueKey: "weightDif",
          span: 3,
          tooltip: true
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
      layoutSetting: [
        [
          {
            label: "编号",
            valueKey: "skuId"
          },
          {
            label: "属性",
            valueKey: "proBasics.goldCode",
            custom: function(data) {
              if (data.proBasics.oneItemsCode === "TZ") {
                return "套装详情";
              }
            }
          }
        ],
        [
          {
            label: "成色",
            valueKey: "proSpecData.conditi"
          },
          {
            label: "克重",
            valueKey: "proSpecData.weight"
          },
          {
            specialFn: data => {
              const obj = JSON.parse(data.proSpecData.extendAttr);
              if (!this.$api.isEmptyJson(obj) && data.proBasics.one) {
                return this.$api.getExtendAttr(data.proBasics.one, obj);
              } else {
                return {};
              }
            }
          }
        ],
        [
          {
            label: "调拨数量",
            valueKey: "amount"
          },
          {
            label: "调拨毛重",
            valueKey: "weight"
          },
          {
            label: "调拨净重",
            valueKey: "suttle"
          }
        ],
        [
          {
            label: "调拨原因",
            valueKey: "remarkReason"
          },
          {
            label: "调拨备注",
            valueKey: "remark"
          }
        ]
      ],
      printData: {}, //打印数据
      loadingState: false,
      bizNo: "", //出库单的属性id
      orderDetail: {},
      findTableTF: false, //出库表单弹窗
      findTableData: [] //出库表单数据
    };
  },
  computed: {
    orderTable() {
      return [this.allData.bizInvoice] || [];
    },
    baoData() {
      return this.allData.bizPack || [];
    },
    productListData() {
      return this.allData.bizPro || [];
    }
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      const self = this;
      this.bizNo = this.$route.query.bizNo;
      //获取单号详情
      this.getOrderDetail();
      const params = { PRS: { bizNo: self.bizNo } };
      self.$axios
        .get(self.$portMain + "/outInteriorController/findDataform", params)
        .then(function(resp) {
          if (resp.data.code == 200) {
            self.printData = resp.data.data;
          } else {
            self.$message.error(resp.data.msg);
          }
        });
    },
    // 克/单价 input失去焦点事件回调
    gramInputBlur(e) {
      const target = this.$$(e.target);
      const value = target.val();
      const $index = target.closest("tr").index();
      const purWeight = this.findTableData.list[$index].purWeight;
      this.$set(this.findTableData.list[$index], "priceG", value);
      this.$set(this.findTableData.list[$index], "priceJ", "");

      this.$set(this.findTableData.list[$index], "money", value * purWeight);
    },
    // 件/单价 input失去焦点事件回调
    pieceInputBlur(e) {
      const target = this.$$(e.target);
      const value = target.val();
      const $index = target.closest("tr").index();
      const purWeight = this.findTableData.list[$index].purWeight;
      this.$set(this.findTableData.list[$index], "priceJ", value);
      this.$set(this.findTableData.list[$index], "priceG", "");
      this.$set(this.findTableData.list[$index], "money", value * purWeight);
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
        .get(this.$portMain + "/outInteriorController/findData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.orderDetail = res.data.data.bizInvoice;
            self.loadingState = false;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },
    //打印
    printFun(suc) {
      let self = this;
      self.$refs.myComp.compPrintFun();
      if (!self.$refs.myComp.LODOP) {
        return;
      }
      var params = { bizNo: this.bizNo };
      this.$axios({
        method: "post",
        url: self.$portMain + "/outInteriorController/addPrint",
        params: params,
        data: null,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function(res) {
        if (res.data.code == 200) {
          self.$message.success("正在打印！");
          //   self.$refs.myComp.compPrintFun();
          if (self.orderDetail.print) {
            self.orderDetail.print++;
          } else {
            self.$set(self.orderDetail, "print", 1);
          }
          if (typeof suc === "function") {
            suc();
          }
          self.created_fun();
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },

    //出库合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
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
              const value = Number(curr);
              if (!isNaN(value)) {
                if (column.label === "数量") {
                  return Number(prev) + Number(curr);
                }
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
      const params = { PRS: { bizNo: this.bizNo } };
      this.$axios
        .get(self.$portMain + "/outInteriorController/findDataform", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findTableData = res.data.data;
            self.findTableData.createDate = self.$api.dateGetDayTime(
              self.findTableData.createDate
            );
            self.findTableData.list = self.findTableData.list.map(n => {
              n.priceG = "";
              n.priceJ = "";
              return n;
            });
            self.$nextTick(() => {
              self.findTableTF = true;
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //自动算折重数量
    changeNum(e) {
      const target = this.$$(e.target);
      const value = target.val();
      const $index = target.closest("tr").index();
      const suttleWeight = this.findTableData.list[$index].suttleWeight;
      this.$set(this.findTableData.list[$index], "purity", value);
      this.$set(
        this.findTableData.list[$index],
        "purWeight",
        value * suttleWeight
      );
    },

    submitFindTabData() {
      let self = this;
      let params = {
        bizNo: this.bizNo
      };
      this.$axios({
        method: "post",
        url: self.$portMain + "/outInteriorController/updata",
        params: params,
        data: null,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function(res) {
        if (res.data.code == 200) {
          self.findTableTF = false;
          self.created_fun();
          self.printFun(() => {
            self.$set(self.orderDetail, "invoiceStatuValue", "已出库");
            self.$set(self.orderDetail, "invoiceStatu", "EXREPO");
            self.$set(self.orderDetail, "print", 1);
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },

    //出库提交按钮
    submitFindTabFun() {
      this.$api.refClick(this).then(res => {
        this.submitFindTabData();
      });
    }
  },
  components: {
    "packge-list": packgeList,
    "product-list": productList
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
</style>
