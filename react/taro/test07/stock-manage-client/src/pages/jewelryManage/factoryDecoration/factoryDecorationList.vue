D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="condition.bizNo"
            class="input-with-select searchTxt"
            size="small"
            @blur="screenFun"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">接收单位</span>
          <el-select
            v-model="condition.recipientId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入"
            :remote-method="remoteMethod"
            @change="changCustomer"
            :loading="searchloading"
            size="small"
            class="width240"
          >
            <el-option
              v-for="item in customerData"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="condition.invoiceStatu"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in orderStatusData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>

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
            :picker-options="$publicData.pickerOptions3"
            style="width:300px"
            @change="searTimechFun"
          ></el-date-picker>
        </el-col>
      </el-row>

      <el-table
        :data="orderData"
        stripe
        @row-dblclick="showDetailFun"
        height="650"
        style="width: 100%;margin-top:25px;"
      >
        <el-table-column prop="bizNo" label="出库单号"></el-table-column>
        <!-- <el-table-column prop="invoiceType" label="订单类型">
          <template slot-scope="scope">{{scope.row.invoiceType | invoiceTypeFun}}</template>
        </el-table-column>
        <el-table-column prop="lineId" label="源单号"></el-table-column>-->
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g）"></el-table-column>
        <el-table-column prop="weight" label="毛重(g)"></el-table-column>
        <el-table-column prop="createDate" label="制单时间"></el-table-column>
        <el-table-column prop="creator" label="制单人"></el-table-column>
        <el-table-column prop label="单据状态">
          <template slot-scope="scope">
            <span class="blackColor" v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
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
// var Nzh = require("nzh");
export default {
  data() {
    return {
      receivingUnit: [], //接收单位数据
      loadingState: false,
      customerData: [],
      condition: {
        bizNo: "",
        recipientId: "",
        invoiceStatu: "",
        dateStart: "",
        dateEnd: ""
      },
      outstoreStatue: "",
      orderType: "",
      orderData: [],
      orderStatusData: [], //订单状态
      selectedDay: "",
      orderAllData: [],
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0, //总条目数
      customerList: [] //工厂列表
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.getOtherUnit();
      this.getorderStatusData();
      this.displayAllData();
      this.factoryLoad(); //工厂列表搜索
    },
    displayAllData() {
      let self = this;

      let params = {
        page: this.pageNum,
        rows: this.pageSize
      };
      Object.assign(params, this.condition);
      params = this.$api.deleteEmptykey(params);
      this.loadingState = true;
      this.$api.formdataPostFun(
        this.$portMain + "/outStockBills/list",
        params,
        res => {
          self.loadingState = false;
          self.PageCount = res.data.rowSize;
          self.orderData = res.data.data;
          self.orderData.forEach(item => {
            item.createDate = self.$api.dateGetDayTime(item.createDate);
          });
        },
        err => {
          self.$message.error(err.msg);
          self.loadingState = false;
        }
      );
    },
    //获取订单状态数据
    getorderStatusData() {
      let params = {
        type: "STOCK_OUT_FACTORY"
      };
      this.$api.formdataPostFun(
        this.$portMain + "/biz/conf/getBizStatu",
        params,
        res => {
          this.orderStatusData = res.data;
          if (this.orderStatusData.length > 0) {
            this.orderStatusData.unshift({
              code: "",
              name: "全部"
            });
          }
        },
        err => {
          this.orderStatusData = [];
        }
      );
    },
    //工厂列表搜索
    factoryLoad() {
      let self = this;
      var params = { PRS: { keyWord: "" } };
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
            self.customerList.unshift({ companyId: "", companyName: "全部" });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 获取发起单位
    getOtherUnit() {
      return this.$axios
        .get(`${this.$portMain}/client/clientListSimple`)
        .then(res => {
          this.receivingUnit = res.data.data;
          if (this.receivingUnit.length > 0) {
            this.receivingUnit.unshift({
              companyId: "",
              companyName: "全部"
            });
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

    //查看详情
    showDetailFun(elem) {
      // this.$router.push("allocationVaultAuditing");
      // this.$router.push("allocationVaultComplete");
      this.$router.push({
        path: "factoryDecorationDetail",
        query: { bizNo: elem.bizNo }
      });
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
        this.condition.dateStart = this.$api.dateGetDayTime(
          this.selectedDay[0]
        );
        this.condition.dateEnd = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.condition.dateStart = "";
        this.condition.dateEnd = "";
      }
      this.screenFun();
    },
    resetAllData() {
      this.condition = {};
      this.screenFun();
    },
    // 选择客户
    changCustomer(val) {
      this.screenFun();
    },
    remoteMethod(query) {
      if (!query) {
        this.customerData = [];
        return;
      }
      this.searchloading = true;
      let params = {
        PRS: {
          clientScope: "_FACTORY",
          keyWord: query
        }
      };
      this.$axios
        .get(this.$portMain + "/client/rawClientSimple", params)
        .then(res => {
          if (res.data.code == 200) {
            this.customerData = res.data.data;
            this.searchloading = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  },
  filters: {
    invoiceTypeFun(val) {
      switch (val) {
        case "STOCK_OUT":
          return `出库单`;
        case "STOCK_IN":
          return `入库单`;
        case "TRANSFER_IN":
          return `调拨入库`;
        case "TRANSFER_OUT":
          return `调拨出库`;
        default:
          return "-";
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
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


<style>
.yellowColor {
  color: #f26d0f;
}

.lightYellowColor {
  color: #f2930f;
}

.redColor {
  color: #f20f34;
}

.blackColor {
  color: #2e2f33;
}

.grayColor {
  color: #8a9199;
}
</style>

