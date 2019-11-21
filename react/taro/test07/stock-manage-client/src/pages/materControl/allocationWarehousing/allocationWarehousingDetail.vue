<template>
  <div class="conBigDiv customTable">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <!--   v-if="allData.HC != 1 && HCType != 'HC' && allData.bills_statue != 2" -->
      <el-row>
        <el-col :span="24" class="itemRight">
          <!-- <el-button type="danger" size="small" plain @click="redflushFun">红冲</el-button> -->
          <span v-if="allData.output_statue == 1">
            <el-button type="danger" size="small" plain @click="rejectFun">驳回</el-button>
            <el-button type="primary" size="small" @click="passFun" :loading="btnSaveLoading">审核通过</el-button>
          </span>
          <span v-if="allData.output_statue == 2">
            <el-button
              type="primary"
              size="small"
              @click="printFun"
              v-if="allData.input_print_count == 0 || allData.input_print_count == '' || allData.input_print_count == undefined"
            >打印</el-button>
            <el-button
              type="primary"
              size="small"
              @click="printFun"
              v-else
            >打印({{allData.input_print_count}})</el-button>
          </span>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>调拨单号：</span>
            <span>{{allData.allot_code}}</span>
          </div>
          <div style="margin-top:12px">
            <span>调拨单位：</span>
            <span>{{allData.recestock_depart_name}}</span>
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
          <div style="margin-top:12px">
            <span v-if="!(allData.output_statue != 1 && allData.position_name == undefined)">入库柜：</span>
            <span
              v-if="allData.output_statue != 1 && allData.position_name != undefined"
            >{{allData.position_name?allData.position_name:'--'}}</span>
            <el-select
              v-model="positionId"
              placeholder="请选择库柜"
              size="small"
              style="width: 200px;"
              v-if="allData.output_statue == 1"
            >
              <el-option
                v-for="item in findPositionData"
                :key="item.id"
                :label="item.enter_counter"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="margin-bottom:12px" v-if="allData.output_statue != 1">
            <span>日期：</span>
            <span>{{allData.update_time}}</span>
          </div>
          <div v-if="allData.note != undefined && allData.note != ''">
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
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPEight :billData="allData" ref="myComp"></PrintTPEight>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnSaveLoading: false,
      findPositionData: [], //入库柜数据
      positionId: "", //入库柜id
      reason: "", //红冲原因
      HCType: "", // 红冲状态
      allData: {}, //调拨详细数据
      allotOrderId: "", //调拨id
      promptType: false, //提示状态
      value: "", //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "" //日期选择属性
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.allotOrderId = this.$route.query.allotOrderId;
      this.displayAllData();
      this.findPosition();
    },
    displayAllData() {
      var self = this;
      let params = {
        PRS: {
          allotOrderId: self.allotOrderId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/allotInputFrom", params)
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
    //查询入柜信息
    findPosition() {
      let self = this;
      let params = {
        PRS: {
          departId: 20
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
          allotOrderId: this.allotOrderId,
          reason: self.reason
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/HCAllotOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.promptType = true;
              self.$router.push("allocationWarehousing");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //打印
    printFun() {
      let self = this;
      self.$refs.myComp.compPrintFun();
      if (!self.$refs.myComp.LODOP) {
        return;
      }
      let params = {
        PRS: {
          allotOrderId: this.allotOrderId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/printAllotInput", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            // self.$refs.myComp.compPrintFun();
            self.created_fun();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //驳回
    rejectFun() {
      let self = this;
      let params = {
        PRS: {
          allotOrderId: self.allotOrderId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/rejectAllotInput", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.$router.push("allocationWarehousing");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //审核通过
    passFun() {
      let self = this;
      if (this.positionId == "") {
        self.$message.warning("请选择入库柜！");
        return;
      }
      let params = {
        PRS: {
          allotOrderId: self.allotOrderId,
          positionId: self.positionId
        }
      };
      this.btnSaveLoading = true;
      this.$axios
        .get(this.$portMain + "/stock/passAllotInput", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.btnSaveLoading = false;
            setTimeout(function() {
              self.$router.push("allocationWarehousing");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnSaveLoading = false;
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

<style>
.customTable .el-table__header th {
  background-color: #f5f7fa;
}
</style>
