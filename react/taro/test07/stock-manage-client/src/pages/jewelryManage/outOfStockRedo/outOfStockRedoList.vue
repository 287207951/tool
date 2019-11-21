D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>出库列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="condition.search"
            class="input-with-select searchTxt"
            size="small"
            @blur="screenFun"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">出库类型</span>
          <el-select
            v-model="condition.bizType"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="selectTypeFun"
          >
            <el-option
              v-for="item in bizTypeListData"
              :key="item.bizType"
              :label="item.bizName"
              :value="item.bizType"
            ></el-option>
          </el-select>
          <span class="fontStyle">接收单位</span>
          <el-select
            v-model="condition.recipientId"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in companyData"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="condition.statue"
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

      <div style="margin-top:16px;">
        <el-button type="primary" size="small" @click="createdFun" v-if="addAllotTF">新增出库</el-button>
      </div>

      <el-table
        :data="orderData"
        stripe
        @row-dblclick="editGold"
        height="600"
        style="width: 100%;margin-top:25px;"
        v-loading="loadingTF"
      >
        <el-table-column prop="bizNo" label="出库单号"></el-table-column>
        <el-table-column prop="bizType" label="单据类型">
          <template slot-scope="scope">
            <span v-if="scope.row.bizType == 'SEND_CLIENT'">出客户饰</span>
            <span v-else-if="scope.row.bizType == 'SEND_FACTORY'">出工厂饰</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g）"></el-table-column>
        <el-table-column prop="weight" label="毛重(g)"></el-table-column>
        <el-table-column prop="creator" label="操作人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop label="订单状态">
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
var Nzh = require("nzh");
export default {
  data() {
    return {
      addAllotTF: false, //新增按钮显示权限
      factoryData: [], //出工厂接收单位
      customerData: [], //出客户接收单位
      companyData: [], //接收单位数据
      bizTypeListData: [], //出库类型数据
      loadingState: false,
      condition: {
        search: "",
        bizType: "",
        recipientId: "",
        statue: "",
        startTime: "",
        endTime: ""
      },
      outstoreStatue: "",
      orderType: "",
      orderData: [],
      orderStatusData: [
        { code: "CONFIRMED", name: "已审核" },
        { code: "DRAFT", name: "制单" },
        { code: "EXREPO", name: "已出库" },
        { code: "REJECT", name: "已驳回" },
        { code: "WAITCONFIRM", name: "待审核" },
        { code: "STOCKUP", name: "待出库" },
        { code: "DISCARD", name: "已作废" },
        { code: "COUNTER", name: "已返柜" }
      ],
      selectedDay: "",
      orderAllData: [],
      loadingTF: false, //加载状态
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
      this.handleData();
      this.getorderStatusData();
      this.getBizTypeList();
      // this.displayAllData();
      this.addAllotTF = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "stock-out-create"
      );
    },
    //处理单位数据
    handleData() {
      this.getOtherUnit();
      this.getOtherUnitFac();
      this.selectTypeFun();
    },
    displayAllData() {
      let self = this;
      self.loadingTF = true;
      let params = {
        page: this.pageNum,
        rows: this.pageSize
      };
      Object.assign(params, this.condition);
      params = this.$api.deleteEmptykey(params);
      this.loadingState = true;
      this.$api.formdataPostFun(
        this.$portMain + "/stockOutManager/selectStackOutOrderList",
        params,
        res => {
          self.loadingTF = false;
          self.loadingState = false;
          self.PageCount = res.data.rowSize;
          self.orderData = res.data.data;
          self.orderData.forEach(item => {
            item.createDate = self.$api.dateGetDayTime(item.createDate);
          });
        },
        err => {
          self.loadingTF = false;
          self.$message.error(err.msg);
          self.loadingState = false;
        }
      );
    },
    //获取订单状态数据
    getorderStatusData() {
      let params = {
        type: "STOCK_OUT"
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
    //出客户饰接收单位
    getOtherUnit() {
      return this.$axios
        .get(`${this.$portMain}/client/clientListSimple`)
        .then(res => {
          this.customerData = res.data.data;
        });
    },

    //出工厂饰接收单位
    getOtherUnitFac() {
      return this.$axios
        .get(`${this.$portMain}/supplier/supplierListSimple`)
        .then(res => {
          this.factoryData = res.data.data;
        });
    },
    //获取出库类型数据
    getBizTypeList() {
      const params = {
        PRS: {
          invoiceType: "STOCK_OUT"
        }
      };
      this.$axios
        .get(`${this.$portMain}/biz/conf/bizFormConf`, params)
        .then(res => {
          this.bizTypeListData = res.data.data.bizTypeList;
          if (this.bizTypeListData.length > 0) {
            this.bizTypeListData.unshift({
              bizType: "",
              bizName: "全部"
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

    // 编辑单
    editGold(elem) {
      // this.$router.push("allocationVaultAuditing");
      // this.$router.push("allocationVaultComplete");
      this.$router.push({
        path: "outOfStockRedoDetail",
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
        this.condition.startTime = this.$api.dateGetDayTime(
          this.selectedDay[0]
        );
        this.condition.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.condition.startTime = "";
        this.condition.endTime = "";
      }
      this.screenFun();
    },
    //新增出库
    createdFun() {
      this.$router.push("creatOutOfStock");
    },
    //出库类型数据
    selectTypeFun() {
      this.companyData = [];
      this.condition.recipientId = "";
      if (this.condition.bizType == "SEND_CLIENT") {
        //出客户饰
        this.companyData = [
          {
            companyId: "",
            companyName: "全部"
          },
          ...this.customerData
        ];
      } else if (this.condition.bizType == "SEND_FACTORY") {
        //出工厂饰
        this.companyData = [
          {
            companyId: "",
            companyName: "全部"
          },
          ...this.factoryData
        ];
      } else {
        //全部
        this.companyData = [
          {
            companyId: "",
            companyName: "全部"
          },
          ...this.customerData,
          ...this.factoryData
        ];
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

