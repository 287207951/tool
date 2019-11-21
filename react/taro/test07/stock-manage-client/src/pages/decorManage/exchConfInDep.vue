D<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库确认入库</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="mock"
            class="input-with-select searchTxt"
            size="small"
            @blur="displayAllData"
            @keydown.enter.native="displayAllData"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">调拨状态</span>
          <el-select
            v-model="mock"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="searchFun"
          ></el-select>
          <span class="fontStyle">操作人</span>
          <el-select
            v-model="mock"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="searchFun"
          ></el-select>
          <span class="fontStyle">品目</span>
          <el-select
            v-model="mock"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="searchFun"
          ></el-select>
          <span class="fontStyle">时间选择</span>
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
            style="width:300px"
            @change="searTimechFun"
          ></el-date-picker>
        </el-col>
      </el-row>

      <el-table
        :data="data"
        stripe
        @selection-change="handleSelectionChange"
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top:75px;"
      >
        <el-table-column prop="label" label="调拨单号"></el-table-column>
        <el-table-column prop label="接收单位"></el-table-column>
        <el-table-column prop label="调拨部门"></el-table-column>
        <el-table-column prop label="总毛重"></el-table-column>
        <el-table-column prop label="总净重"></el-table-column>
        <el-table-column prop label="总数量"></el-table-column>
        <el-table-column prop label="总金额"></el-table-column>
        <el-table-column prop label="备注信息"></el-table-column>
        <el-table-column prop label="调拨状态"></el-table-column>
        <el-table-column prop label="操作时间"></el-table-column>
        <el-table-column prop label="操作人"></el-table-column>
        <el-table-column prop label="打印"></el-table-column>
        <el-table-column prop label="红冲"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.bills_statue == undefined">- -</span>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      mock: "",
      data: [
        {
          label: "12"
        }
      ],
      selectedDay: "",
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {},
  methods: {
    displayAllData() {},

    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push("exchConfInDepDet");
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

    //搜索
    searchFun() {},
    //时间搜索
    searTimechFun() {
      // if (this.selectedDay != null) {
      //   this.startTime = this.$api.dateGetDayTime(this.selectedDay[0]);
      //   this.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      // } else {
      //   this.startTime = "";
      //   this.endTime = "";
      // }
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
    width: 256px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 24px;
  }
}
</style>
