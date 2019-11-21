<template>
  <div class="conBigDiv customTable">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务审核</el-breadcrumb-item>
      <el-breadcrumb-item>料调拨</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24" class="itemRight" v-show="allData.bills_statue == 1 && HCType != 'HC'">
          <el-button type="danger" size="small" plain @click="rejectFun">审核驳回</el-button>
          <el-button type="primary" size="small" @click="passFun" :loading="btnLoadingPass">审核通过</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>调拨单号：</span>
            <span>{{allData.allot_code}}</span>
          </div>
          <div style="margin-top:12px">
            <span>调拨公司：</span>
            <span>{{allData.company_name}}</span>
          </div>
          <div style="margin-top:12px">
            <span>调拨种类：</span>
            <span>{{allData.stock_kind}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>调拨柜：</span>
            <span>{{allData.output_counter}}</span>
          </div>
          <div style="margin-top:12px">
            <span>接收单位：</span>
            <span>{{allData.customer_name}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>日期：</span>
            <span>{{allData.update_time}}</span>
          </div>
          <div style="margin-top:12px">
            <span>备注：</span>
            <span>{{allData.note?allData.note:'--'}}</span>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="allData.allotOrderLines"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column header-align="center" align="center" width="50px" type="index" label="序号"></el-table-column>
        <el-table-column header-align="center" align="center" prop="stock_type" label="类型"></el-table-column>
        <el-table-column header-align="center" align="center" prop="k_weight" label="重量(g)"></el-table-column>
        <el-table-column header-align="center" align="center" prop="k_wage" label="克工费"></el-table-column>
        <el-table-column header-align="center" align="center" prop="p_standard" label="规格"></el-table-column>
        <el-table-column header-align="center" align="center" prop="p_amount" label="件数"></el-table-column>
        <el-table-column header-align="center" align="center" prop="p_wage" label="件工费"></el-table-column>
        <el-table-column header-align="center" align="center" prop="money" label="金额(￥)"></el-table-column>
        <el-table-column header-align="center" align="center" prop="note" label="备注"></el-table-column>
      </el-table>

      <!-- <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background>
        </el-pagination>
      </div>-->
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
      <!-- <div class="layer"></div> -->
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
      allData: {}, //调拨详细数据
      allotOrderId: "", //调拨id
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
      this.allotOrderId = this.$route.query.allotOrderId;
      this.displayAllData(1, 15);
    },
    displayAllData() {
      var self = this;
      let params = {
        PRS: {
          allotOrderId: self.allotOrderId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/allotOrderFromC", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.HCType = self.allData.allot_code.substr(0, 2);
            self.allData.update_time = self.$api.dateGetDayTime(
              self.allData.update_time
            );
            self.allData.allotOrderLines.forEach(item => {
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
        if (column.label === "重量(g)" || column.label === "金额(￥)") {
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
        allotOrderIds: `[${this.allotOrderId}]`
      };
      this.btnLoadingPass = true;

      this.$api.formdataPostFun(
        self.$portMain + "/stock/passAllotOrderC",
        params,
        res => {
          self.$message.success(res.msg);
          self.btnLoadingPass = false;
          self.$router.push("financeGoldAllocation");
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
    //       allotOrderId: this.allotOrderId
    //     }
    //   };
    //   this.btnLoadingPass = true;
    //   this.$axios
    //     .get(this.$portMain + "/stock/passAllotOrderC", params)
    //     .then(function(res) {
    //       if (res.data.code == 200) {
    //         self.$message.success(res.data.msg);
    //         self.btnLoadingPass = false;
    //         self.$router.push("financeGoldAllocation");
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
    // 确定驳回
    saveFun() {
      let self = this;
      let params = {
        allotOrderIds: `[${this.allotOrderId}]`,
        reason: self.reason
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/rejectAllotOrderC",
        params,
        res => {
          self.$message.success(res.msg);
          self.$router.push("financeGoldAllocation");
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
    //       allotOrderId: this.allotOrderId,
    //       reason: self.reason
    //     }
    //   };
    //   this.$axios
    //     .get(this.$portMain + "/stock/rejectAllotOrderC", params)
    //     .then(function(res) {
    //       if (res.data.code == 200) {
    //         self.$message.success(res.data.msg);
    //         self.$router.push("financeGoldAllocation");
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

<style>
.customTable .el-table__header th {
  background-color: #f5f7fa;
}
</style>
