<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰申请列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          客户类型：
          <el-select
            v-model="customerType"
            filterable
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCustomer"
          >
            <el-option
              v-for="item in customerTypeList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>

          <!-- <span class="fontStyle" v-if="customerType != ''">接收客户</span>
          <el-select v-model="customerName" filterable placeholder="接收客户" size="small"  @change="searchFun" v-if="customerType != ''">
            <el-option
              v-for="item in customerList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId">
            </el-option>
          </el-select>-->
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="orderStatusId"
            placeholder="请选择"
            size="small"
            style="width:100px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderStatusList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">下单时间</span>
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
            @change="searchFun"
          ></el-date-picker>
          <span class="fontStyle">调拨单号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            style="width:220px"
            @keyup.enter.native="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        v-loading="loadingState"
        :data="parageraphList"
        stripe
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="orderNo" label="调拨单号"></el-table-column>
        <el-table-column prop="supplierfName" label="发起部门">
          <template slot-scope="scope">
            <span v-if="scope.row.sponsor == undefined">-</span>
            <span v-if="scope.row.sponsor == 'A'">尚金缘金库</span>
            <span v-if="scope.row.sponsor == 'B'">尚金缘物流</span>
            <span v-if="scope.row.sponsor == 'C'">尚金缘展厅</span>
            <span v-if="scope.row.sponsor == 'C'">天津或者杭州工厂</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" label="接收客户">
          <template slot-scope="scope">
            <span v-if="scope.row.receiverUnit == undefined">-</span>
            <span v-if="scope.row.receiverUnit == 'A'">尚金缘金库</span>
            <span v-if="scope.row.receiverUnit == 'B'">尚金缘物流</span>
            <span v-if="scope.row.receiverUnit == 'C'">尚金缘展厅</span>
            <span v-if="scope.row.receiverUnit == 'D'">天津或者杭州工厂</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotalSum" label="数量"></el-table-column>
        <!-- <el-table-column
          prop="totailOrderWeight"
          label="毛重(g)"
        ></el-table-column>-->

        <el-table-column prop="endOrderTotalWeight" label="克重(g)"></el-table-column>
        <el-table-column prop="operateUser" label="制单人"></el-table-column>
        <el-table-column prop="orderCreateTime" label="创建时间" width="200px"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == undefined">-</span>
            <span v-if="scope.row.orderStatus == '1'" class="yellowColor">待审核</span>
            <span v-if="scope.row.orderStatus == '2'" class="blackColor">已通过</span>
            <span v-if="scope.row.orderStatus == '3'" class="redColor">已取消</span>
            <span v-if="scope.row.orderStatus == '4'" class="redColor">已驳回</span>
            <span v-if="scope.row.orderStatus == '5'" class="redColor">已退货</span>
            <span v-if="scope.row.orderStatus == '7'" class="redColor">审核中</span>
            <span v-if="scope.row.orderStatus == '10'" class="redColor">已出库</span>
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
      loadingState: false,
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      orderStatusId: "", //订单状态
      inputTF: true, //文件上传input
      orderStatusList: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待审核"
        },
        {
          code: "2",
          value: "已通过"
        },
        {
          code: "3",
          value: "已取消"
        },
        {
          code: "4",
          value: "已驳回"
        },
        {
          code: "5",
          value: "已退货"
        }
      ],
      orderTypeId: "C", //订单来源
      orderTypeList: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "B",
          value: "尚金缘物流"
        },
        {
          code: "C",
          value: "尚金缘展厅"
        }
      ],
      rankById: "1",
      rankByList: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ], // 排序
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

      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      xlsLoadTF: false, //excel上传按钮加载
      customerType: "1", //客戶类型
      customerTypeList: [
        // {companyId:'',companyName:'全部'},
        { companyId: "1", companyName: "工厂" }
        // {companyId:'2',companyName:'客户'}
      ], //客戶类型
      customerName: "", //接收客户
      customerList: [] //接收客户列表
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData(1, 12);
      // this.customerAndFactoryLoad()
      //改变客户类型
      // this.changeCustomer();
    },
    displayAllData(num, size) {
      var self = this;
      this.loadingState = true;
      let params = {
        orderNo: self.search,
        startTime: self.startTime,
        endTime: self.endTime,
        receiverUnit: self.orderTypeId,
        orderStatus: self.orderStatusId,
        // rankBy:self.rankById,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/selectOpretaFactoryOrderTrandf",
        params,
        res => {
          if (res.code == 200) {
            self.loadingState = false;
            self.pageNum = num;
            self.pageSize = size;
            // self.firstWeight = res.data.data.firstWeight;
            // self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data;
            self.priceSum = res.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        },
        err => {
          self.loadingState = false;
        }
      );
    },

    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      localStorage.sarkData = JSON.stringify(elem);
      this.$router.push({
        path: "outFactoryDecoOperaDetail",
        query: { orderNo: elem.orderNo }
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

    //搜索
    searchFun() {
      var self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, 12);
    },

    //改变客户类型
    changeCustomer() {
      let self = this;
      // if(self.customerType ===''){
      //   self.customerAndFactoryLoad();
      // }
      if (self.customerType === "1") {
        self.factoryLoad();
      }
      if (self.customerType === "2") {
        self.customerLoad();
      }
      self.customerName = "";
      self.searchFun();
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
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //客户列表搜索
    customerLoad() {
      let self = this;
      var params = { PRS: { keyWord: "" } };
      this.$axios
        .get(this.$portMain + "/client/clientListSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //客户和工厂列表搜索
    customerAndFactoryLoad() {
      let self = this;
      var params = { PRS: { keyWord: "", companyId: "91681" } };
      this.$axios
        .get(this.$portMain + "/company/queryRawClients", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
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

  .creatStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth240 {
      width: 240px;
    }

    .inputWidth160 {
      width: 160px;
    }

    .itemRight {
      text-align: right;
    }

    .marginBottom {
      margin-bottom: 32px;
    }

    .fontTStyle {
      font-size: 14px;
      color: #8A9199;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .itemBottom {
      margin-bottom: 24px;
    }

    .titleStyle {
      color: #8A9199;
      font-size: 14px;
      text-align: right;
      padding-right: 24px;
    }

    .contentStyle {
      color: #2E2F33;
      font-size: 14px;
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

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }
}
</style>
