<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>料转饰</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
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
          </el-select>-->
          <span class="fontStyle">料类型</span>
          <el-select v-model="stockTypeId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">单据状态</span>
          <el-select v-model="billsStatue" placeholder="请选择" size="small">
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
        <el-col :span="24">
          <el-button type="primary" size="small" @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="to_ornament_code" label="调拨单号"></el-table-column>
        <el-table-column prop="company_name" label="公司"></el-table-column>
        <el-table-column prop="customer_name" label="接收单位"></el-table-column>
        <el-table-column prop="stock_type" label="料类型"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="fur_weight" label="重量"></el-table-column>
        <el-table-column prop="discount_weight" label="折重"></el-table-column>
        <el-table-column prop="output_counter" label="出库柜"></el-table-column>
        <el-table-column label="出库状态">
          <template slot-scope="scope">
            <span v-if="scope.row.output_statue == 1">完成</span>
            <span v-if="scope.row.output_statue == 2">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注信息"></el-table-column>
        <el-table-column prop="update_time" label="操作时间"></el-table-column>
        <el-table-column prop="order_uid_name" label="操作人"></el-table-column>
        <el-table-column prop="print_count" label="打印"></el-table-column>
        <el-table-column label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.bills_statue == 1" class="yellowColor">待审核</span>
            <span v-if="scope.row.bills_statue == 2" class="blackColor">已审核</span>
            <span v-if="scope.row.bills_statue == 3" class="redColor">已驳回</span>
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
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      stockTypeId: "", //料类型
      billsStatue: "", //单据类型
      stockSetTypeList: [], // 料类型数据
      allData: [], //料转饰数据
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
      tableData2: [
        {
          a: "1121",
          b: "1222"
        },
        {
          a: "1121",
          b: "1222"
        }
      ], //模拟
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
      this.displayAllData(1, 15);
      this.stockSetFun();
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          stockTypeId: self.stockTypeId,
          billsStatue: self.billsStatue,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/StockToOrnamentListC", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
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
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);;
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
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "financeMaterialTransferDetail",
        query: { stockToOrnamentId: elem.id }
      });
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
    // 查询事件
    queryFun() {
      this.created_fun();
    },
    // 新建发料
    createdFun() {
      this.$router.push("creatMaterialTransfer");
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
    //重置
    resetFun() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.stockTypeId = "";
      this.billsStatue = "";
      this.selectedDay = "";
      this.created_fun();
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
