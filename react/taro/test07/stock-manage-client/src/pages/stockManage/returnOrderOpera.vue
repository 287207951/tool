<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>收客户饰</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="orderStatus"
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
            @change="selectDayFun"
          ></el-date-picker>
          <span class="fontStyle">订单编号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="orderNo"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @keyup.enter.native="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="float:right">
            <el-button type="primary" @click="addProFun" size="small">添加退货产品</el-button>
            <span class="fontStyle">排序</span>
            <el-select
              v-model="rankBy"
              placeholder="请选择"
              size="small"
              style="width:90px"
              @change="searchFun"
            >
              <el-option
                v-for="item in stockSetTypeList"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </span>
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
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="orderTotalSum" label="总数量"></el-table-column>
        <el-table-column prop="endOrderTotalMoney" label="总工费(¥)">
          <template slot-scope="scope">
            <span>{{scope.row.endOrderTotalMoney?scope.row.endOrderTotalMoney:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operateUser" label="操作人"></el-table-column>
        <el-table-column prop="orderCreateTime" label="操作日期"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.insertStatus === 2" class="grayColor">已入库</span>
            <span v-else>
              <span v-if="scope.row.orderStatus == undefined">-</span>
              <span v-if="scope.row.orderStatus == 1" class="yellowColor">待审核</span>
              <span v-if="scope.row.orderStatus == 7" class="yellowColor">审核中</span>
              <span v-if="scope.row.orderStatus == 2" class="heiColor">已通过</span>
              <span v-if="scope.row.orderStatus == 4" class="redColor">被驳回</span>
              <!-- <span
                v-if="scope.row.orderStatus == 2"
                class="redColor"
                @click="inStockFun(scope.row)"
              >入库</span>-->
            </span>
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
      loadingState: true,
      // viewWayData: [], //方式数据
      dialogType: false,
      orderStatus: "", //订单状态
      orderNo: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      rankBy: "", //料类型
      addProTF: false, //添加退货单弹框
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待审核"
        },
        {
          code: "7",
          value: "审核中"
        },
        {
          code: "2",
          value: "已通过"
        },
        {
          code: "4",
          value: "未通过"
        }
      ],
      orderSourceSear: [
        {
          code: "1",
          value: "网络单"
        },
        {
          code: "2",
          value: "展厅单"
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
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
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
      this.displayAllData(1, 12);
      // this.viewWay();
    },

    displayAllData(num, size) {
      var self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          orderNo: self.orderNo,
          orderStatus: self.orderStatus,
          startTime: self.startTime,
          endTime: self.endTime,
          rankBy: self.rankBy,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/order/selectBackOrderList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.loadingState = false;
            if (self.parageraphList) {
              self.parageraphList.forEach((item, index) => {
                item.update_time = self.$api.dateGetDayTime(item.update_time);
              });
            } else {
              self.parageraphList = [];
            }
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "returnOrderOperaDetail",
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
      this.searchFun();
    },
    //查询
    searchFun() {
      this.pageSize = 12;
      this.pageNum = 1;
      this.displayAllData(1, 12);
    },
    addProFun() {
      this.$router.push({ path: "returnOrderAddProOne" });
    },
    //入库操作
    inStockFun(ielem) {
      var self = this;
      this.dialogType = true;
      // let params = {
      //   skuNo: ielem.orderNo,
      //   nowSkuSum: ielem.orderTotalSum,
      //   nowSkuGoldWeight: ielem.totailGoldWeight
      // };
      //
      //
      // this.$axios
      //   .post(this.$portMain + "/order/selectProductMarkmerty", params)
      //   .then(function(res) {
      //     if (res.data.code == 200) {
      //
      //
      //
      //       self.dialogType = false;
      //       self.$message.success(res.msg);
      //       setTimeout(function() {
      //         self.created_fun();
      //       }, 1000);
      //     } else {
      //       self.$message.error(res.data.msg);
      //     }
      //   });
      return;
      let params = {
        PRS: {
          orderNo: ielem.orderNo
        }
      };
      this.$axios
        .get(this.$portMain + "/order/addInspectionOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("退货入库成功！");
            setTimeout(function() {
              self.created_fun();
            }, 1000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // //查看方式事件
    // viewWay() {
    //   let self = this;
    //   let params = {
    //     PRS: {
    //       billType: "intWay"
    //     }
    //   };
    //   this.$axios
    //     .get(this.$portMain + "/discount/getALLWay", params)
    //     .then(function(res) {
    //       if (res.data.code == 200) {
    //         self.viewWayData = res.data.data;
    //       } else {
    //         self.$message.error(res.data.msg);
    //       }
    //     });
    // },
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = (Number(prev) + Number(curr)).toFixed(2);
              return res;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
        // if (index === 5 || index === 3) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return "";
        //     }
        //   }, 0);
        //   //sums[index] += "";
        // }
      });
      return sums;
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

  .heiColor {
    color: #a6a7a9;
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

  .tabOne {
    display: flex;
    border: 1px solid #f0f0f0;
    padding: 15px 15px 10px 15px;
  }

  .tabOneLeft {
    width: 174px;
  }

  .tabOneRight {
    width: calc(100% - 174px);
  }

  .orderBigDiv {
    padding-bottom: 20px;
    min-height: 126px;

    .orderBigDivOne {
      color: #333;
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

  .modelWrap {
    .tableWrap {
      .orderTitle {
        display: flex;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 25px;
        color: #8A8E99;
        margin-bottom: 16px;

        div {
          margin-right: 200px;
        }

        span {
          color: #222426;
        }
      }
    }

    .top24 {
      margin-top: 24px;
    }
  }
}
</style>
