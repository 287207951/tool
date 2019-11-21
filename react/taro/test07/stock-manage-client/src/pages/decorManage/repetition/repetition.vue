D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库复称</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="入库单据号/工单号/调拨单号"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">发起单位</span>
          <el-select
            v-model="workSatue"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in workSatueData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="billStatue"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in billStatueData"
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
        <el-table-column prop="rCode" label="入库单据号" width="180"></el-table-column>
        <el-table-column prop label="发起单位">
          <template slot-scope="scope">
            <span v-if="scope.row.workSatue == '_cus' || scope.row.workSatue == '_reple'">尚金缘物流</span>
            <span v-else-if="scope.row.workSatue == '_allotputExhibi'">尚金缘展厅</span>
            <span v-else-if="scope.row.workSatue == '_stock'">尚金缘金库收料部</span>
            <span v-else-if="scope.row.workSatue == '_allotput'">--</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="orderCode" label="工单号" width="180"></el-table-column>
        <el-table-column prop="receCode" label="调拨单号" width="180"></el-table-column>
        <el-table-column prop="realAmount" label="数量"></el-table-column>
        <el-table-column prop="realWeight" label="毛重(g）"></el-table-column>
        <el-table-column prop="realGoldWeight" label="净重(g)"></el-table-column>
        <el-table-column prop="creatorName" label="操作人"></el-table-column>
        <el-table-column prop="crearorTime" label="验收时间" width="180"></el-table-column>
        <el-table-column prop="crearorTime" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.billStatue == 'Y'">已完成</span>
            <!-- <span v-else-if="scope.row.billStatue == 'N'">待确认</span>
            <span v-else-if="scope.row.billStatue == 'T'">已驳回</span>-->
            <span v-else-if="scope.row.billStatue == 'D'" style="color:#F26D0F">待复检</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.status == undefined">- -</span>
            <span v-if="scope.row.status == 1">已完成</span>
            <span class="redColor" v-if="scope.row.status == 2">红冲</span>
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


var Nzh = require("nzh");
export default {
  data() {
    return {
      loadingState: true,
      search: "",
      startTime: "",
      endTime: "",
      billStatue: "",
      workSatue: "",
      workSatueData: [
        {
          //部门数据
          label: "全部",
          value: ""
        },
        {
          label: "尚金缘物流(物流客单)",
          value: "_cus"
        },
        {
          label: "尚金缘物流(物流补货单)",
          value: "_reple"
        },
        {
          label: "尚金缘展厅",
          value: "_allotputExhibi"
        },
        {
          label: "尚金缘金库收料部",
          value: "_stock"
        }
      ],
      billStatueData: [
        {
          //单据状态
          label: "全部",
          value: ""
        },
        {
          label: "已完成",
          value: "Y"
        },
        {
          label: "待复检",
          value: "D"
        }
      ],
      orderData: [],
      mock: "",
      data: [
        {
          label: "12"
        }
      ],
      selectedDay: "",
      orderAllData: [],
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
          workSatue: this.workSatue,
          billStatue: this.billStatue,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/receiv/order/getReceivReviewList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingState = false;
            self.orderData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.orderData.forEach(item => {
              item.crearorTime = self.$api.dateGetDayTime(item.crearorTime);
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
      this.$router.push({
        path: "repetitionDetail",
        query: { receivId: elem.receId }
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
