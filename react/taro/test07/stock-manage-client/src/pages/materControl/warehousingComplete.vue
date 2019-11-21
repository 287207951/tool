<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>收料</el-breadcrumb-item>
      <el-breadcrumb-item>入库完成</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col
          :span="24"
          class="itemRight"
          v-show="parageraphList.HC != 1 && parageraphList.enter_statue != 5"
        >
          <el-button
            type="danger"
            size="small"
            plain
            @click="redflushFun"
            v-if="parageraphList.bills_statue != 2"
          >红冲</el-button>
          <el-button
            type="primary"
            size="small"
            @click="printFun"
            v-if="parageraphList.print_count == ''"
          >打印</el-button>
          <el-button
            type="primary"
            size="small"
            @click="printFun"
            v-else
          >打印({{ parageraphList.print_count }})</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>入库单号:</span>
            <span>{{ parageraphList.enter_code }}</span>
          </div>
          <div>
            <span>收料单位:</span>
            <span>{{ parageraphList.company_name }}</span>
          </div>
          <div>
            <span>收料种类:</span>
            <span>{{ parageraphList.stock_kind }}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>来料单位：</span>
            <span>{{ parageraphList.customer_name }}</span>
          </div>
          <div>
            <span>所属区域：</span>
            <span
              v-if="parageraphList.area || parageraphList.province || parageraphList.finance_code"
            >
              {{parageraphList.area}}
              <span v-if="parageraphList.area">-</span>
              {{parageraphList.province}}({{parageraphList.finance_code}})
            </span>
            <span v-else>--</span>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div>
            <span>日期</span>
            <span class="completeDes">
              {{
              this.$api.dateGetDayTime(parageraphList.create_time)
              }}
            </span>
          </div>
          <div class="noteStyle" v-if="parageraphList.note">
            <span style="padding-right: 8px;">备注</span>
            <span class="completeDes">{{ parageraphList.note }}</span>
          </div>
        </el-col>
      </el-row>
      <div style="display: flex;">
        <!-- 表格一 -->
        <el-table
          :data="inputStockOrderLines"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="入货明细" header-align="center">
            <el-table-column prop="sequence" label="盘号"></el-table-column>
            <el-table-column width="130px" prop="stock_type" label="料类型"></el-table-column>
            <el-table-column prop="before_weight" label="熔前毛重(g)"></el-table-column>
            <el-table-column prop="after_weight" label="熔后毛重(g)"></el-table-column>
            <el-table-column prop="check_quality" label="检验成色"></el-table-column>
            <el-table-column prop="reality_quality" label="实际成色"></el-table-column>
            <el-table-column prop="discount_weight" label="折千足重(g)"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
          </el-table-column>
        </el-table>
        <!-- 表格二 -->
        <el-table
          :data="creditLines"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="账款明细" header-align="center">
            <el-table-column prop="expense_way" label="结费方式"></el-table-column>
            <el-table-column prop="project" label="项目"></el-table-column>
            <el-table-column prop="k_weight" label="重量(g)"></el-table-column>
            <el-table-column prop="k_price" label="单价"></el-table-column>
            <el-table-column prop="k_money" label="金额(￥)"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <el-row class="footInfo">
        <el-col
          :span="24"
          style="margin-bottom:20px"
          v-for="(item, index) in parageraphList.inputStockProcesss"
          :key="index"
        >
          <span style="color:#8A9199">{{ item.create_time }}</span>
          <span style="color:#222426">{{ item.order_uid_name }}</span>
          <span style="color:#8A9199">对{{ item.result1 }}{{ item.result2 }}操作</span>
        </el-col>
      </el-row>
    </div>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因" v-model="reason"></textarea>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="ConfirmRedflush" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPSix :billData="parageraphList" ref="myComp"></PrintTPSix>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reason: "", //红冲原因
      stock_type_id: "", //金料类型id
      stock_type: "", //金料类型
      note: "", //备注
      counter_id: "", // 库位id
      enter_counter: "", //库位名称
      findPositionData: [], //库柜数据
      inputStockId: "", //订单id
      promptType: false, //提示状态
      value: "", //模拟
      LODOP: {},
      skuCeditSum: 0, //出货明细总计
      nowTime: "", //打印时间
      ceditSumNum: 0,
      priceTxt: "", //金额总计大写
      parageraphList: {}, //详情数据
      inputStockOrderLines: [], //入库明细
      stockSetTypeList: [], // 料类型数据
      creditLines: [], //账款明细
      expenseWayData: [
        {
          //结费方式
          id: 1,
          name: "全部转存"
        }
      ]
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      let index = window.location.hash.indexOf("?") + 1;
      let key = window.location.hash.substr(index).split("=")[0];
      if (key == "toVoidId") {
        this.inputStockId = this.$route.query.toVoidId;
        this.toVoidIdData();
      } else {
        this.inputStockId = this.$route.query.inputStockId;
        this.displayAllData();
      }
    },
    // 红冲
    displayAllData() {
      var self = this;
      let params = {
        PRS: {
          inputStockId: this.inputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NinputStockFromcrediti", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data;
            // 入库明细
            self.inputStockOrderLines = res.data.data.inputStockOrderLines;
            // self.inputStockOrderLines.forEach(item => {
            //   item.stock_type = res.data.data.stock_type;
            // });
            // 账款明细
            self.creditLines = res.data.data.creditLines;
            self.parageraphList.inputStockProcesss.forEach(item => {
              item.create_time = self.$api.dateGetDayTime(item.create_time);
              if (item.enter_statue == 1) {
                item.result1 = "新建";
              } else if (item.enter_statue == 2) {
                item.result1 = "测金";
              } else if (item.enter_statue == 3) {
                item.result1 = "入库";
              } else if (item.enter_statue == 4) {
                item.result1 = "红冲";
              }

              if (item.bills_statue == 1) {
                item.result2 = "保存 ";
              } else if (item.bills_statue == 2) {
                item.result2 = "提交 ";
              } else if (item.bills_statue == 3) {
                item.result2 = "作废 ";
              }
            });

            //self.stockSetFun();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 作废
    toVoidIdData() {
      var self = this;
      let params = {
        PRS: {
          inputStockId: this.inputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NinputStockFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data;
            // 入库明细
            self.inputStockOrderLines = res.data.data.inputStockOrderLines;
            // self.inputStockOrderLines.forEach(item => {
            //   item.stock_type = res.data.data.stock_type;
            // });
            // 账款明细
            self.creditLines = res.data.data.creditLines;
            self.parageraphList.inputStockProcesss.forEach(item => {
              item.create_time = self.$api.dateGetDayTime(item.create_time);
              if (item.bills_statue == 1) {
                item.result1 = "新建";
              } else if (item.bills_statue == 2) {
                item.result1 = "测金";
              } else if (item.bills_statue == 3) {
                item.result1 = "入库";
              } else if (item.bills_statue == 4) {
                item.result1 = "红冲";
              }

              if (item.bills_statue == 1) {
                item.result2 = "保存 ";
              } else if (item.bills_statue == 2) {
                item.result2 = "提交 ";
              } else if (item.bills_statue == 3) {
                item.result2 = "作废 ";
              }
            });

            //self.stockSetFun();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询金料类型
    stockSetFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询柜信息
    findPosition() {
      //findPositionData
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/findPosition")
        .then(function(res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
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
          column.label === "熔前毛重(g)" ||
          column.label === "熔后毛重(g)" ||
          column.label === "折足千重(g)" ||
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
    //红冲
    redflushFun() {
      this.promptType = true;
      this.reason = "";
    },
    //确定红冲
    ConfirmRedflush() {
      let self = this;
      let params = {
        PRS: {
          inputStockId: this.inputStockId,
          reason: self.reason
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/HCInputStock", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.promptType = true;
              self.$router.push("recharge");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 打印
    printFun() {
      let self = this;
      this.nowTime = this.$moment().format("YYYY年MM月DD日 HH:mm:ss");
      self.$refs.myComp.compPrintFun();
      if (!self.$refs.myComp.LODOP) {
        return;
      }
      let params = {
        PRS: {
          inputStockId: this.inputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NprintInputStock", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            // self.$refs.myComp.compPrintFun();
            self.created_fun();
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

.conBigDiv {
  .colorYeLLow {
    color: #F2930F;
  }

  .colorRed {
    color: #F20F34;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .itemRight {
    text-align: right;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .promptStyle {
    position: relative;

    .line {
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textAreaStyle {
      width: 433px;
      height: 120px;
      resize: none;
      background: rgba(240, 247, 255, 1);
    }
  }

  .itemFirst {
    margin-top: 22px;
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
      display: flex;
      justify-content: flex-end;
      // margin-top 10px
    }

    .textAreaStlye {
      width: 81.5%;
      height: 60px;
      border-radius: 4px;
      border: 1px solid #CFD4E6;
      resize: none;
      margin-top: 10px;
    }

    .completeDes {
      width: 82.5%;
      display: inline-block;
      text-align: left;
    }
  }

  .footInfo {
    margin-top: 36px;
    font-size: 14px;
  }
}
</style>
