<template>
  <div class="conBigDiv orderlist" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>客单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row class="ordert-tit">
        <el-col :span="24">
          <el-col :span="4">
            <div class="top-select">
              <span>订单来源</span>
              <el-select v-model="allParams.orderSource" size="small" placeholder="请选择">
                <el-option
                  v-for="item in orderSourceSear"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="top-select">
              <span>下单公司</span>
              <el-select
                v-model="allParams.companyId"
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
            </div>
          </el-col>
          <el-col :span="7">
            <span style="color: #888; margin-right: 10px; ">下单时间</span>
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期 "
              @change="timeChange"
              :picker-options="$publicData.pickerOptions2"
            ></el-date-picker>
          </el-col>
          <el-col :span="4" style="display: flex; align-items: center; color: #888;">
            <span style="margin-right: 10px; margin-left: 16px">订单编号</span>
            <el-input
              placeholder="请输入内容"
              v-model="allParams.orderNo"
              class="searchTxt"
              size="small"
              @keyup.enter.native="sureSear"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px;">
        <el-col :span="4">
          <div style="margin-left: 40px;  color: #888">
            <span style="margin-right: 30px">排序</span>
            <el-select
              v-model="allParams.rankBy"
              style="width: 90px"
              size="small"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sortSear"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button type="primary" size="small" @click="sureSear">确定查询</el-button>
          <el-button type="primary" plain size="small" @click="resetSear">重置条件</el-button>
        </el-col>
        <el-col :span="2" :offset="8">
          <el-button type="primary" size="small" @click="syncClick">同步订单数据</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="orderList"
        stripe
        :summary-method="getSummaries"
        @row-dblclick="orderDetail"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="orderNo"
          label="订单编号"
          width="180"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="orderSource"
          label="订单来源"
          header-align="center"
          align="center"
          :formatter="formatDate"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orderSource == '1'">网络订单</span>
            <span v-if="scope.row.orderSource == '2'">展厅订单</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="下单公司" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderCreateTime" label="下单日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderComeTime" label="预计来款日期" header-align="center" align="center"></el-table-column>
        <!-- <el-table-column prop="deliveryTime" label="预计交货日期" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="saleName" label="关联业务员" header-align="center" align="center"></el-table-column>
        <el-table-column
          prop="orderTotalWeight"
          label="总重量(g)"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="orderTotalMoney" label="总工费(￥)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="marking" label="字印" header-align="center" align="center"></el-table-column>
        <el-table-column prop="lableName" label="挂签" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.lableName == 1">否</span>
            <span v-if="scope.row.lableName == 2">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == '1'" style="color: #F20F34">待审核</span>
            <span v-if="scope.row.orderStatus == '2'" style="color: #199C3C">已通过</span>
            <span v-if="scope.row.orderStatus == '3'" style="color: #E8B409">已取消</span>
            <span v-if="scope.row.orderStatus == '4'" style="color: #E8B409">未通过</span>
            <span v-if="scope.row.orderStatus == '5'" style="color: #E8B409">已退货</span>
            <span v-if="scope.row.orderStatus == '7'" style="color: #E8B409">审核中</span>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        @result="getAllDate"
        ref="child"
        :toParams="allParams"
        :pageSizes="[10, 20, 50, 100]"
        :url="this.$portMain + '/order/selectLearBigOrderManageApprove'"
      ></Pagination>

      <el-dialog
        title="选择下单公司"
        width="80%"
        custom-class="diaaddrlist"
        :visible.sync="chooseAddr"
        :close-on-click-modal="false"
      >
        <div class="series-con">
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-input placeholder="请输入内容" v-model="searchInfo" class="input-with-select">
                <v-distpicker
                  slot="prepend"
                  hide-area
                  :placeholders="placeholders"
                  @province="provinceed"
                  @city="cityed"
                  @selected="onSelected"
                ></v-distpicker>
                <el-button slot="append" icon="el-icon-search" @click="searAddr"></el-button>
              </el-input>
            </el-col>
          </el-row>

          <div class="addrlistflex">
            <div class="list-item" v-if="addrList.data.length !== 0">
              <div v-for="item in addrList.data" @click="chooseAddrId(item)">{{item.companyName}}</div>
            </div>
            <div v-else class="noaddr">暂无公司列表</div>
          </div>
        </div>
      </el-dialog>-->
    </div>
  </div>
</template>
<script>
import $orderCount from "./acommon/orderCount.js";

export default {
  data() {
    return {
      loading: false,
      orderList: [],
      allParams: {},
      orderStatusSear: [
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
          value: "未通过"
        },
        {
          code: "5",
          value: "已退货"
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
      companySear: [],
      searchTime: "",
      sortSear: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ],
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      chooseAddr: false,
      placeholders: {
        province: "------- 省 --------",
        city: "--- 市 ---"
      },
      searchInfo: "",
      provinceVal: "",
      cityVal: "",
      addrList: {
        data: []
      },
      chooseCompany: "",
      customerData: []
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    getAllDate(e) {
      this.orderList = e.data.data ? e.data.data : [];
      if (this.orderList.length > 0) {
        this.orderList.forEach(item => {
          item.orderTotalWeight = item.endOrderTotalWeight;
          item.orderTotalMoney = item.endOrderTotalMoney;

          // if(Number(item.startOrderTotailWeight)) {
          //   item.orderTotalWeight = `${item.startOrderTotailWeight}-${item.orderTotalWeight}`
          // }
          // item.orderTotalMoney = item.orderTotalMoney.toFixed(2)
          // if(Number(item.startOrderTotalMoney)) {
          //   item.orderTotalMoney = `${item.startOrderTotalMoney}-${item.orderTotalMoney}`
          // }
        });
      }
    },

    created_fun() {
      this.loading = true;
      this.$axios.get(this.$portMain + "/client/clientListSimple").then(res => {
        this.companySear = res.data.data;
        this.loading = false;
      });
    },

    // 搜索订单
    sureSear() {
      this.$refs.child.search();
    },

    resetSear() {
      this.allParams = {};
      this.searchTime = "";
      this.chooseCompany = "";
      this.$nextTick(() => {
        this.$refs.child.search();
      });
    },

    // 时间改变
    timeChange(e) {
      this.allParams.startTime = this.$api.dateGetDay(this.searchTime[0]);
      this.allParams.endTime = this.$api.dateGetDay(this.searchTime[1]);
    },

    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 2 || index === 4 || index === 8) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },

    syncClick() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/orderTime/getXianShangBigOrder")
        .then(res => {
          this.$message.success("同步成功");
          this.$refs.child.getData(1);
          setTimeout(() => {
            self.$refs.child.getData(1);
          }, 5000);
        });
    },

    formatDate(row, column) {
      return this.$api.dateGetDay(row.update_time);
    },

    // 订单详情
    orderDetail(e) {
      this.$router.push({
        path: "orderDefAllDetailBig",
        query: { orderNo: e.orderNo }
      });
    },

    chooseAddrClick(e) {
      this.chooseAddr = true;
    },

    onSelected(data) {
      this.provinceInfo = data;
    },

    provinceed(data) {
      this.provinceVal = data.value;
    },

    cityed(data) {
      this.cityVal = data.value;
    },

    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchLoading = true;
        let params = {
          PRS: {
            companyId: 91681,
            keyWord: query
          }
        };
        self.$axios
          .get(self.$portMain + "/company/queryRawClients", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.searchLoading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },

    // 选择客户
    changCustomer(val) {},

    remoteMethod(query) {
      if (!query) {
        this.customerData = [];
        return;
      }
      this.searchloading = true;
      let params = {
        PRS: {
          clientScope: "_SHOP,_VOL",
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
    },

    searAddr() {
      let data = this.provinceInfo;
      let params = {
        province: this.provinceVal,
        city: this.cityVal,
        keyWord: this.searchInfo,
        page: 1,
        rows: 1000
      };
      this.$axios
        .post(this.$portMain + "/client/queryCheckPassSimple", params)
        .then(res => {
          this.addrList = res.data.data;
        });
    }
  }
};
</script>

<style>
.orderlist .ordert-tit .el-select--small .el-input__inner {
  width: 140px;
  margin-left: 10px;
}

.orderlist .distpicker-address-wrapper select {
  height: 30px;
  background: #f5f7fa;
  border: none;
}

.diaaddrlist {
  min-height: 740px !important;
  overflow-y: auto;
}
</style>


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

  .topMenuRight {
    text-align: right;
  }

  .searchTxt {
    flex: 1;
    width: 100%;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .top-select {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
  }

  .addrlistflex .list-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 40px;
    text-align: center;
  }

  .addrlistflex .list-item > div {
    flex: 25%;
    line-height: 4;

    &:hover {
      color: rgb(242, 15, 52);
    }
  }

  .noaddr {
    margin-top: 200px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
</style>
