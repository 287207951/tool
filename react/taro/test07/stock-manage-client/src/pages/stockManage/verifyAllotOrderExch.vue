<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库管理列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="19">
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
          <span class="fontStyle">接收单位</span>
          <el-select
            v-model="orderTypeId"
            placeholder="请选择"
            size="small"
            style="width:110px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderTypeList"
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
          <span class="fontStyle">订单编号</span>
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
          <el-button size="small" type="danger" @click="resetData">重置</el-button>
        </el-col>

        <el-col :span="5">
          <el-button
            type="primary"
            size="small"
            @click="excelInputFun"
            :loading="xlsLoadTF"
            v-if="false"
          >导入EXCEL</el-button>
          <input
            type="file"
            ref="excelInput"
            accept=".xls, .xlsx"
            @change="excelFun"
            v-show="false"
            v-if="inputTF"
          >
          <span class="fontStyle">排序</span>
          <el-select
            v-model="rankById"
            placeholder="请选择"
            size="small"
            style="width:90px"
            @change="searchFun"
          >
            <el-option
              v-for="item in rankByList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
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
        <el-table-column prop="supplierfName" label="发起单位">
          <template slot-scope="scope">
            <span v-if="scope.row.sponsor == undefined">-</span>
            <span v-if="scope.row.sponsor == 'A'">尚金缘金库</span>
            <span v-if="scope.row.sponsor == 'B'">尚金缘物流</span>
            <span v-if="scope.row.sponsor == 'C'">尚金缘展厅</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" label="接收客户">
          <template slot-scope="scope">
            <span v-if="scope.row.receiverUnit == undefined">-</span>
            <span v-if="scope.row.receiverUnit == 'A'">尚金缘金库</span>
            <span v-if="scope.row.receiverUnit == 'B'">尚金缘物流</span>
            <span v-if="scope.row.receiverUnit == 'C'">尚金缘展厅</span>
            <span v-if="scope.row.receiverUnit == 'D'">金库出给工厂</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotalSum" label="数量"></el-table-column>
        <!-- <el-table-column
          prop="totailOrderWeight"
          label="毛重(g)"
        ></el-table-column>-->
        <el-table-column prop="endOrderTotalWeight" label="克重(g)"></el-table-column>
        <el-table-column prop="operateUser" label="操作人"></el-table-column>
        <el-table-column prop="orderCreateTime" label="操作日期"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == undefined">-</span>
            <span v-if="scope.row.orderStatus == '1'" class="yellowColor">待审核</span>
            <span v-if="scope.row.orderStatus == '2'" class="blackColor">已通过</span>
            <span v-if="scope.row.orderStatus == '4'" class="redColor">驳回</span>
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
          code: "4",
          value: "驳回"
        },
        {
          code: "7",
          value: "审核中"
        },
        {
          code: "10",
          value: "已出库"
        }
      ],
      orderTypeId: "", //订单来源
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
        // {
        //   code: "D",
        //   value: "金库出给工厂"
        // }
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
      xlsLoadTF: false //excel上传按钮加载
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData(1, 12);
    },
    // 重置搜索
    resetData() {
      this.search = this.startTime = this.endTime = this.selectedDay = this.orderTypeId = this.orderStatusId = this.rankById =
        "";
      this.displayAllData(1, this.pageSize);
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
        rankBy: self.rankById,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/selectApproveOpretaOrderTrandf",
        params,
        res => {
          if (res.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            // self.firstWeight = res.data.data.firstWeight;
            // self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data?res.data.data:[];
            self.loadingState = false;
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
        path: "verifyAllotOrderExchDetail"
        // query: { orderNo: elem.orderNo }
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
    //excel上传按钮
    excelInputFun() {
      var self = this;
      //
      self.$refs.excelInput.click();
    },
    //excel上传
    excelFun(e) {
      var self = this;
      self.xlsLoadTF = true;
      let params = {
        files: e.target.files[0]
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/updataExeclToOrder",
        params,
        res => {
          self.inputTF = false;
          self.$message.success(res.msg);
          setTimeout(function() {
            self.inputTF = true;
            self.xlsLoadTF = false;
            self.created_fun();
          }, 1000);
        },
        err => {
          self.inputTF = false;
          self.xlsLoadTF = false;
          setTimeout(function() {
            self.inputTF = true;
          }, 1000);
          self.$message.error(err.msg);
        }
      );
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
