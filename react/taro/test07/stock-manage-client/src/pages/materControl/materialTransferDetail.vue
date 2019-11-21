<template>
  <div class="conBigDiv" ref="materialTransferDetail">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>转饰详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24" class="itemRight" v-if="allData.HC != 1 && HCType != 'HC'">
          <el-button type="danger" size="small" plain @click="redflushFun">红冲</el-button>
          <el-button
            type="primary"
            size="small"
            @click="printFun"
            v-if="allData.print_count == 0 || allData.print_count == '' || allData.print_count == undefined"
          >打印</el-button>
          <el-button
            type="primary"
            size="small"
            @click="printFun"
            v-else
          >打印({{allData.print_count}})</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>调拨单号：</span>
            <span>{{allData.to_ornament_code}}</span>
          </div>
          <div style="margin-top:12px">
            <span>转饰公司：</span>
            <span>{{allData.company_name}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>出料柜：</span>
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
            <span>{{allData.note}}</span>
          </div>
        </el-col>
      </el-row>
      <div style="display:flex">
        <!-- 表格1 -->
        <el-table
          :data="allData.stockToOrnamentLines"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="料明细" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="stock_type" label="类型"></el-table-column>
            <el-table-column prop="fur_weight" label="毛重"></el-table-column>
            <el-table-column prop="quality" label="成色"></el-table-column>
            <el-table-column prop="discount_weight" label="折千足重"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
          </el-table-column>
        </el-table>
        <!-- 表格2 -->
        <el-table
          :data="allData.stockTooramentOrnalines"
          show-summary
          :summary-method="getTwoSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="饰明细" header-align="center">
            <el-table-column prop label="产品大类">
              <template slot-scope="scope">
                <span if="scope.row.to_ornament_project">金条</span>
              </template>
            </el-table-column>
            <el-table-column prop="ornament_name" label="产品名称"></el-table-column>
            <el-table-column prop="product_code" label="产品编号"></el-table-column>
            <el-table-column prop="product_amount" label="数量"></el-table-column>
            <el-table-column prop="product_weight" label="重量"></el-table-column>
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
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因" v-model="reason"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="ConfirmRedflush" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      reason: "", //红冲原因
      HCType: "", // 红冲状态
      allData: {}, //料转饰详细数据
      stockToOrnamentId: "", //料转饰id
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
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.materialTransferDetail;
      if (dom != undefined && altKey && keyCode === 80) {
        self.printFun();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.stockToOrnamentId = this.$route.query.stockToOrnamentId;
      this.displayAllData(1, 15);
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          stockToOrnamentId: self.stockToOrnamentId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/StockToOrnamentFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.allData.update_time = self.$api.dateGetDayTime(
              self.allData.update_time
            );
            self.HCType = self.allData.to_ornament_code.substr(0, 2);
            self.allData.stockToOrnamentLines.forEach(item => {
              item.stock_type = self.allData.stock_type;
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //表格一底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
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
        if (index === 5) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return "";
            }
          }, 0);
          //sums[index] += "";
        }
      });
      return sums;
    },
    //表格二底部数据统计
    getTwoSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = (Number(prev) + Number(curr)).toFixed(4);
              return res;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
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
          stockToOrnamentId: this.stockToOrnamentId,
          reason: self.reason
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/HCStockToOrnamen", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.promptType = false;
              self.$router.push("materialTransfer");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //打印
    printFun() {
      let self = this;
      let params = {
        PRS: {
          stockToOrnamentId: this.stockToOrnamentId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/printStockToOrnamen", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
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
