<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>展销单</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <div>
            <span class="fontSize">订单状态</span>
            <el-select v-model="orderStatus" placeholder="请选择" size="small">
              <el-option
                v-for="item in orderStatusData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="fontSizeMargin">订单来源</span>
            <el-select v-model="orderSource" placeholder="请选择" size="small" @change="sourceFun">
              <el-option
                v-for="item in orderSourceData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="fontSizeMargin" v-if="orderSource == 2">下单公司</span>
            <el-select v-model="companyId" placeholder="请选择" size="small" v-if="orderSource == 2">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="fontSizeMargin">下单时间</span>
            <el-date-picker
              @change="selectedDayFun"
              v-model="selectedDay"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
            ></el-date-picker>
            <span class="fontSizeMargin">订单编号</span>
            <el-input placeholder="请输入订单编号搜索" v-model="orderNo" class="inputWidth160" size="small"></el-input>
            <el-select v-model="value" placeholder="排序" size="small" class="selectWidth60">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="exhibitorderList"
        stripe
        height="700"
        @row-dblclick="orderDetails"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="exhibitOrderCode" label="订单编号" header-align="center" align="center"></el-table-column>
        <el-table-column label="订单来源" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type =='1'">期货单（网络)</span>
            <span v-else-if="scope.row.type =='2'">现货单（展厅）</span>
          </template>
        </el-table-column>
        <el-table-column prop="exhibitName" label="展销活动" header-align="center" align="center"></el-table-column>
        <el-table-column
          v-if="orderSource == 2"
          prop="customercompanyname"
          label="下单公司"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="createTime" label="下单日期" header-align="center" align="center"></el-table-column>
        <el-table-column
          prop="ordertotalweight"
          label="总重量(g)"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column label="订单状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.statue =='1'" class="orange_font">待审核</span>
            <span v-else-if="scope.row.statue =='2'" class="black_font">已通过</span>
            <span v-else-if="scope.row.statue =='3'" class="hui_font">已驳回</span>
            <span v-else-if="scope.row.statue =='4'" class="red_font">已取消</span>
            <span v-else-if="scope.row.statue =='5'" class="hui_font">已通过</span>
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
          :total="dataSize"
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
      companyId: "", // 公司id
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      orderNo: "", //展销单编号
      orderSource: "", // 订单来源
      orderStatus: "", // 展销状态
      orderSourceData: [
        {
          // 展销类型
          value: 1,
          label: "是自营展销单"
        },
        {
          value: 2,
          label: "是客户展销单"
        }
      ],
      orderStatusData: [
        {
          // 展销单状态数据
          value: 1,
          label: "待审核"
        },
        {
          value: 2,
          label: "已通过"
        },
        {
          value: 3,
          label: "被退回"
        },
        {
          value: 4,
          label: "已取消"
        }
      ],
      options: [], // 模拟
      value: "", // 模拟
      exhibitorderList: [], // 列表数据
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示多少条记录，默认12条
      dataSize: 0 //金料单总数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.dataDispFun(1, this.pageSize);
    },
    dataDispFun(num, size) {
      var self = this;
      let params = {
        orderNo: self.orderNo,
        startTime: self.startTime,
        endTime: self.endTime,
        orderSource: self.orderSource,
        orderStatus: self.orderStatus,
        companyId: self.companyId
      };
      this.$axios
        .post(this.$portMain + "/exhibitorderManage/findExhibitorders", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.exhibitorderList = res.data.data;
            self.exhibitorderList.forEach(item => {
              item.createTime = self.$api.dateGetDayTime(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //订单管理详情
    orderDetails(elem) {
      var self = this;
      if (elem.servicestates == 1) {
        this.$router.push({
          path: "orderCreatSale",
          query: { editId: elem.id }
        });
      } else {
        this.$router.push({
          path: "orderSaleDetails",
          query: { exhibitorderId: elem.id }
        });
      }
    },
    //分页事件开始
    handleSizeChange(val) {
      var self = this;
      self.pageNum = 1; //默认第一页
      self.pageSize = val; //改变每页显示多少条记录
      self.dataDispFun(1, self.pageSize);
    },
    handleCurrentChange(val) {
      var self = this;
      self.dataDispFun(val, self.pageSize);
    },
    // 选择日期
    selectedDayFun() {
      //
    },
    // 订单来源函数
    sourceFun() {
      //
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .orange_font {
    color: #F2930F;
  }

  .black_font {
    color: #2E3033;
  }

  .hui_font {
    color: #8A9199;
  }

  .inputWidth160 {
    width: 160px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .selectWidth60 {
    width: 80px;
    margin-left: 10px;
  }

  .fontSize {
    font-size: 14px;
    color: #8A9199;
  }

  .fontSizeMargin {
    font-size: 14px;
    color: #8A9199;
    margin-left: 10px;
  }
}
</style>