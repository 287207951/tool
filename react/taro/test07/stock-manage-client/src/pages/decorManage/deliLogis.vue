<template>
  <div class="conBigDiv" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>收工厂饰列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">单据状态</span>
          <el-select
            v-model="orderStatusCode"
            placeholder="请选择"
            size="small"
            style="width:100px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderStatusSear"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">收货来源</span>
          <el-select
            v-model="orderSourceCode"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderSourceSear"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-input
            placeholder="请输入单号搜索"
            v-model="oriOrderNoTxt"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>工厂名称：
          <el-input
            placeholder="请输入工厂名称"
            v-model="factoryName"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
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
            @change="searchFun"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-table :data="orderAllData" @row-dblclick="editGold" style="width: 100%">
        <el-table-column prop="orderType" label="订单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == undefined">-</span>
            <span v-if="scope.row.orderType == 'A'">客单</span>
            <span v-if="scope.row.orderType == 'B'">补货</span>
          </template>
        </el-table-column>
        <el-table-column prop="oriOrderNo" label="原单据号"></el-table-column>
        <el-table-column prop="clientName" label="客户名称"></el-table-column>
        <el-table-column prop="factoryOrderNo" label="工单号"></el-table-column>
        <el-table-column prop="factoryName" label="工厂名称"></el-table-column>
        <el-table-column prop="orderSum" label="订单数量"></el-table-column>
        <!-- <el-table-column prop="orderWeight" label="毛重(g)"></el-table-column> -->
        <el-table-column prop="orderGoldWeight" label="净重(g)"></el-table-column>
        <!-- <el-table-column prop="creatorName" label="收货人"></el-table-column> -->
        <el-table-column prop="createTime" label="制单时间"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.ownOrderStatus == undefined">-</span>
            <span v-if="scope.row.ownOrderStatus == 1" class="yellowColor">待收货</span>
            <span v-if="scope.row.ownOrderStatus == 2" class="blackColor">已收完</span>
            <span v-if="scope.row.ownOrderStatus == 3" class="redColor">未收完</span>
            <span v-if="scope.row.ownOrderStatus == 4" class="heiColor">终止收货</span>
            <span v-if="scope.row.ownOrderStatus == 15" class="redColor">拒收</span>
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
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      oriOrderNoTxt: "", //原单号搜索
      orderNoTxt: "", //收货单号搜索
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      orderStatusCode: "",
      selectedDay: "",
      startTime: "", //开始时间
      endTime: "", //结束时间
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待收货"
        },
        {
          code: "2",
          value: "已收完"
        },
        {
          code: "3",
          value: "未收完"
        }
      ],
      orderSourceCode: "",
      orderSourceSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "B",
          value: "补货单"
        },
        {
          code: "A",
          value: "客单"
        }
      ],
      stockSetTypeList: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ], // 排序
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      orderAllData: [], //列表
      dialogTableVisible: false, //金料单弹出框
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      webLoadingTF: false,
      factoryName: "" //工厂名称
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData(1, 12);
      this.menuData();
    },
    displayAllData(num, size) {
      var self = this;
      self.webLoadingTF = true;
      let orderStatusTxt = "";
      if (self.orderStatusCode === "N") {
        orderStatusTxt = 1;
      }
      if (self.orderStatusCode === "Y") {
        orderStatusTxt = 2;
      }
      let params = {
        orderNo: self.oriOrderNoTxt,
        orderType: self.orderSourceCode,
        startTime: self.startTime,
        endTime: self.endTime,
        orderStatus: self.orderStatusCode,
        factoryName: self.factoryName,
        // oriOrderNo:self.oriOrderNoTxt,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/selectFactroryInfo",
        params,
        res => {
          self.webLoadingTF = false;
          self.pageNum = num;
          self.pageSize = size;
          self.priceSum = res.data.rowSize;
          self.orderAllData = res.data.data;
          self.orderAllData.forEach((item, index) => {
            item.index = index + 1;
          });
        },
        err => {
          self.webLoadingTF = false;
          self.$message.error(err.msg);
        }
      );
    },
    //菜单读取事件
    menuData() {
      var self = this;
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      if (elem.opreateType == "B") {
        this.$message.warning("抱歉，该单已被金库签收！");
        return;
      }
      if (elem.factoryOrderNo) {
        this.$router.push({
          path: "deliLogisDet",
          query: { orderNo: elem.factoryOrderNo }
        });
      } else {
        this.$message.error("此单没有工单号！");
      }
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
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDay(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, this.pageSize);
      this.menuData();
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

  .txtRed {
    color: #F20F34;
  }

  .txtBlack {
    color: #333;
  }

  .heiColor {
    color: #a6a7a9;
  }
}
</style>
