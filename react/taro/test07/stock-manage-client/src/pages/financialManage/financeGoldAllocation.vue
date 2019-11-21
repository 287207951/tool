<template>
  <div class="conBigDiv" v-loading="loading" ref="toExamine">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务审核</el-breadcrumb-item>
      <el-breadcrumb-item>料调拨</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="调拨单号/接收单位"
            v-model="search"
            @keyup.enter.native="queryFun"
            class="input-with-select searchTxt"
            size="small"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">起止时间</span>
          <el-date-picker
            v-model="selectedDay"
            @change="selectDayFun"
            type="daterange"
            align="right"
            unlink-panels
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
          ></el-date-picker>
          <!-- <span class="fontStyle">收料公司</span>
            <el-select v-model="value" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="fontStyle">客户类型</span>
            <el-select v-model="customerType" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <span class="fontStyle">料种类</span>
          <el-select v-model="stockKindId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetKindData"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">料类型</span>
          <el-select v-model="stockTypeId" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="titleFont" style="margin-left:31px">单据状态</span>
          <el-select v-model="billsStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in billsStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <!-- <el-col :span="24">
            <span class="titleFont">料类型</span>
            <el-select v-model="stockTypeId" placeholder="请选择" size="small" class="width160">
              <el-option
                v-for="item in stockSetTypeList"
                :key="item.id"
                :label="item.material_name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="titleFont" style="margin-left:31px">单据状态</span>
            <el-select v-model="billsStatue" placeholder="请选择" size="small" class="width160">
              <el-option
                v-for="item in billsStatueData"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
        </el-col>-->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" @click="passFun">通过审核</el-button>
          <el-button type="danger" size="small" plain @click="RejectFun">驳回审核</el-button>
          <el-button type="danger" size="small" plain @click="againRejectFun">再次驳回</el-button>
          <el-button type="primary" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        @cell-mouse-enter="mouseFun"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="60" :selectable="checkboxInit"></el-table-column>
        <el-table-column prop="allot_code" label="调拨单号" width="150"></el-table-column>
        <el-table-column prop="company_name" label="公司"></el-table-column>
        <el-table-column prop="customer_name" label="接收单位" width="150"></el-table-column>
        <el-table-column prop="stock_kind" label="料种类"></el-table-column>
        <el-table-column prop="stock_type" label="料类型"></el-table-column>
        <el-table-column prop="total_weight" label="重量(g)"></el-table-column>
        <el-table-column prop="total_money" label="金额(￥)"></el-table-column>
        <el-table-column prop="output_counter" label="出库柜"></el-table-column>
        <el-table-column label="出库状态">
          <template slot-scope="scope">
            <span v-if="scope.row.output_statue == 1">待签收</span>
            <span v-if="scope.row.output_statue == 2" class="redColor">已签收</span>
            <span v-if="scope.row.output_statue == 3" class="redColor">已驳回</span>
            <span v-if="scope.row.output_statue == 4" class="redColor">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注信息"></el-table-column>
        <el-table-column prop="update_time" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="order_uid_name" label="操作人"></el-table-column>
        <el-table-column prop="print_count" label="打印"></el-table-column>
        <el-table-column label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.bills_statue == 1" class="yellowColor">待审核</span>
            <span v-if="scope.row.bills_statue == 2" class="blackColor">已审核</span>
            <span v-if="scope.row.bills_statue == 3" class="redColor">已驳回</span>
            <span v-if="scope.row.bills_statue == 4" class="redColor">再次驳回</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="promptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      shortcutData: "",
      selectionData: [],
      loading: false,
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [], // 料类型数据
      allData: [], //调拨数据
      billsStatueData: [
        {
          id: "",
          label: "全部"
        },
        {
          // 单据状态
          id: 1,
          label: "待审核"
        },
        {
          id: 2,
          label: "审核通过"
        },
        {
          id: 3,
          label: "审核驳回"
        }
      ],
      promptType: false, //提示状态
      value: "", //模拟
      options: [], //模拟
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
    this.shortcutKey();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
      this.findStockSetKind();
      this.stockSetFun();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          stockKindId: self.stockKindId,
          stockTypeId: self.stockTypeId,
          billsStatue: self.billsStatue,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/allotOrderListC", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach(item => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(val) {
      this.selectionData = val;
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
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "financeGoldAllocationDetail",
        query: { allotOrderId: elem.id }
      });
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    // 新建发料
    createdFun() {
      this.$router.push("creatGoldAllocation");
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },
    // 查询金料种类
    findStockSetKind() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
            self.stockSetKindData.unshift({
              id: "",
              material_name: "全部"
            });
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
            self.stockSetTypeList.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 查询事件
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    //重置
    resetFun() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.stockKindId = "";
      this.stockTypeId = "";
      this.billsStatue = "";
      this.selectedDay = "";
      this.queryFun();
    },
    //禁用checkbox
    checkboxInit(row, index) {
      let showHC = row.allot_code.slice(0, 2);
      if (
        (row.bills_statue === 1 || row.bills_statue === 2) &&
        showHC != "HC"
      ) {
        return true; //可勾选
      } else {
        return false; //不可勾选
      }
    },
    //审核通过
    passFun() {
      let self = this,
        result = false;
      let adjustIds = [];
      if (this.selectionData.length == 0) {
        self.$message.error("请选择调拨单！");
        return;
      }

      result = this.selectionData.some(item => {
        return item.bills_statue != 1;
      });

      if (result) {
        self.$message.error("抱歉，只有待审核的单据才能进行审核，请重新选择！");
        return;
      }

      this.selectionData.forEach(item => {
        adjustIds.push(item.id);
      });

      let params = {
        allotOrderIds: JSON.stringify(adjustIds)
      };

      this.$api.formdataPostFun(
        self.$portMain + "/stock/passAllotOrderC",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //驳回
    RejectFun() {
      let self = this,
        result = false;
      let adjustIds = [];
      if (this.selectionData.length == 0) {
        self.$message.error("请选择调拨单！");
        return;
      }

      result = this.selectionData.some(item => {
        return item.bills_statue != 1;
      });

      if (result) {
        self.$message.error("抱歉，只有待审核的单据才能进行驳回，请重新选择！");
        return;
      }

      this.selectionData.forEach(item => {
        adjustIds.push(item.id);
      });

      let params = {
        allotOrderIds: JSON.stringify(adjustIds)
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/rejectAllotOrderC",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //再次驳回
    againRejectFun() {
      let self = this,
        result = false;
      let adjustIds = [];
      if (this.selectionData.length == 0) {
        self.$message.error("请选择调拨单！");
        return;
      }

      result = this.selectionData.some(item => {
        return item.bills_statue != 2;
      });

      if (result) {
        self.$message.error("抱歉，只有已审核的单据才能再次驳回，请重新选择！");
        return;
      }

      this.selectionData.forEach(item => {
        adjustIds.push(item.id);
      });

      let params = {
        allotOrderIds: JSON.stringify(adjustIds),
        statue: true
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/rejectAllotOrderC",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //快速选中ALT+F1
    mouseFun(row) {
      let showHC = row.allot_code.slice(0, 2);
      if (
        (row.bills_statue === 1 || row.bills_statue === 2) &&
        showHC != "HC"
      ) {
        this.shortcutData = row; //可勾选
      } else {
        this.shortcutData = ""; //不可勾选
      }
    },
    //快捷键
    shortcutKey() {
      let self = this;
      document.onkeydown = e => {
        //组合键
        let altKey = e.altKey || e.metaKey;
        let keyCode = e.keyCode || e.which || e.charCode;
        let dom = this.$refs.toExamine;
        if (
          dom != undefined &&
          altKey &&
          keyCode === 112 &&
          self.shortcutData != ""
        ) {
          self.$refs.multipleTable.toggleRowSelection(self.shortcutData);
        }
      };
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .yellowColor {
    color: #F26D0F;
  }

  .redColor {
    color: #F20F34;
  }

  .blackColor {
    color: #2E2F33;
  }

  .grayColor {
    color: #8a9199;
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

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .width160 {
    width: 160px;
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
