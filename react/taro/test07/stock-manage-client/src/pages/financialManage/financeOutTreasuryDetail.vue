<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务审核</el-breadcrumb-item>
      <el-breadcrumb-item>料出库</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24" class="itemRight" v-show="allData.bills_statue == 1 && HCType != 'HC'">
          <el-button type="danger" size="small" plain @click="rejectFun">审核驳回</el-button>
          <el-button type="primary" size="small" @click="passFun" :loading="btnLoadingPass">审核通过</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>出库单号：</span>
            <span>{{allData.output_code}}</span>
          </div>
          <div style="margin-top:12px">
            <span>发料公司：</span>
            <span>{{allData.company_name}}</span>
          </div>
          <div style="margin-top:12px">
            <span>收料种类：</span>
            <span>{{allData.stock_kind}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>出料柜：</span>
            <span>{{allData.output_counter}}</span>
          </div>
          <div style="margin-top:12px">
            <span>收料客户：</span>
            <span>{{allData.customer_name}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>日期：</span>
            <span>{{this.$api.dateGetDayTime(allData.update_time)}}</span>
          </div>
          <div style="margin-top:12px">
            <span>备注：</span>
            <span>{{allData.note?allData.note:'--'}}</span>
          </div>
        </el-col>
      </el-row>
      <div style="display: flex;">
        <el-table
          :data="allData.outputStockOrderLines"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="出货明细" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="stock_type" label="料类型"></el-table-column>
            <el-table-column prop="output_fur_weight" label="出库毛重(g)"></el-table-column>
            <el-table-column prop="output_quality" label="出库成色"></el-table-column>
            <el-table-column prop="discount_weight" label="出库折重(g)"></el-table-column>
            <el-table-column prop="o_note" label="备注"></el-table-column>
          </el-table-column>
        </el-table>
        <el-table
          :data="allData.creditLines"
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
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入驳回的原因" v-model="reason"></textarea>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveFun" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnLoadingPass: false,
      reason: "", //驳回原因
      HCType: "", // 红冲状态
      allData: {}, //详细数据
      outputStockId: "", //发料Id
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.outputStockId = this.$route.query.outputStockId;
      this.displayAllData(1, 15);
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          outputStockId: self.outputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NoutputStockFromC", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.HCType = self.allData.output_code.substr(0, 2);
            self.allData.outputStockOrderLines.forEach(item => {
              item.stock_type = self.allData.stock_type;
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "出库毛重(g)" ||
          column.label === "出库折重(g)" ||
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
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },
    //审核通过
    passFun() {
      let self = this;
      let params = {
        outputStockIds: `[${this.outputStockId}]`
      };
      this.btnLoadingPass = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/NpassOutputStockC",
        params,
        res => {
          self.$message.success(res.msg);
          self.btnLoadingPass = false;
          self.$router.push("financeOutTreasury");
        },
        err => {
          self.$message.error(err.msg);
          self.btnLoadingPass = false;
        }
      );
    },
    // passFun() {
    //   let self = this;
    //   let params = {
    //     PRS: {
    //       outputStockId: this.outputStockId
    //     }
    //   };
    //   this.btnLoadingPass = true;
    //   this.$axios
    //     .get(this.$portMain + "/stock/NpassOutputStockC", params)
    //     .then(function(res) {
    //       if (res.data.code == 200) {
    //         self.$message.success(res.data.msg);
    //         self.btnLoadingPass = false;
    //         self.$router.push("financeOutTreasury");
    //       } else {
    //         self.$message.error(res.data.msg);
    //         self.btnLoadingPass = false;
    //       }
    //     });
    // },
    // 驳回
    rejectFun() {
      this.promptType = true;
      this.reason = "";
    },
    // 驳回
    saveFun() {
      let self = this;
      let params = {
        outputStockIds: `[${this.outputStockId}]`,
        reason: this.reason
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/NrejectOutputStockC",
        params,
        res => {
          self.$message.success(res.msg);
          self.$router.push("financeOutTreasury");
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    }
    // saveFun() {
    //   let self = this;
    //   let params = {
    //     PRS: {
    //       outputStockId: this.outputStockId,
    //       reason: this.reason
    //     }
    //   };
    //   this.$axios
    //     .get(this.$portMain + "/stock/NrejectOutputStockC", params)
    //     .then(function(res) {
    //       if (res.data.code == 200) {
    //         self.$message.success(res.data.msg);
    //         self.$router.push("financeOutTreasury");
    //       } else {
    //         self.$message.error(res.data.msg);
    //       }
    //     });
    // }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
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
      width: 86%;
      height: 76px;
      border-radius: 4px;
      border: 1px solid #CFD4E6;
      resize: none;
    }

    .completeDes {
      width: 82.5%;
      display: inline-block;
      text-align: left;
    }
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
}
</style>
