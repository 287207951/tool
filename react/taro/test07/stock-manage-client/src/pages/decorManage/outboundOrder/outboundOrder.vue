D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰制单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入出库单号"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @blur="screenFun"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="outstoreStatue"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in outstoreStatueData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="fontStyle">制单时间</span>
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
        :data="orderData"
        stripe
        @row-dblclick="editGold"
        height="600"
        style="width: 100%;margin-top: 33px;"
      >
        <el-table-column prop="outstoreCode" label="出库单号"></el-table-column>
        <el-table-column prop="pickCode" label="拣货单号"></el-table-column>
        <el-table-column prop="customerName" label="工厂名称"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="weight" label="毛重(g）"></el-table-column>
        <el-table-column prop="stockWeight" label="净重(g)"></el-table-column>
        <el-table-column prop="totalMoney" label="金额(￥）"></el-table-column>
        <el-table-column prop="createPersonName" label="操作人"></el-table-column>
        <el-table-column prop="orderTime" label="制单时间"></el-table-column>
        <el-table-column prop label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.outstoreStatue == undefined">- -</span>
            <span v-if="scope.row.outstoreStatue == '_wait'" style="color:#F26D0F">待出货</span>
            <span v-if="scope.row.outstoreStatue == '_reject'">已驳货</span>
            <span v-if="scope.row.outstoreStatue == '_finish'">已出货</span>
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
          :total="PageCount"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>


var Nzh = require("nzh");
export default {
  data() {
    return {
      loadingState: false,
      search: "",
      startTime: "",
      endTime: "",
      outstoreStatue: "",
      orderData: [],
      outstoreStatueData: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待出货",
          value: "_wait"
        },
        {
          label: "已驳货",
          value: "_reject"
        },
        {
          label: "已出货",
          value: "_finish"
        }
      ],
      data: [
        {
          label: "12"
        }
      ],
      selectedDay: "",
      orderAllData: [],
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
    },
    displayAllData() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          outstoreStatue: this.outstoreStatue,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/outstore/getOutstoreFactorys", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingState = false;
            self.orderData = res.data.data.data;
            self.PageCount = res.data.data.rowSize;
            self.orderData.forEach(item => {
              item.orderTime = self.$api.dateGetDayTime(item.orderTime);
            });
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
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

    // 编辑单
    editGold(elem) {
      if (elem.outstoreStatue == "_wait") {
        //待审核
        this.$router.push({
          path: "outboundOrderDetailWait",
          query: { outStoreId: elem.outStoreId }
        });
      } else if (elem.outstoreStatue == "_finish") {
        //已完成
        this.$router.push({
          path: "outboundOrderDetailComplete",
          query: { outStoreId: elem.outStoreId }
        });
      }
    },
    //搜索
    screenFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    //时间搜索
    searTimechFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }

      this.screenFun();
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

  .txtRed {
    color: #F20F34;
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
