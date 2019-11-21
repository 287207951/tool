<template>
  <div class="conBigDiv orderlist">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>标准单</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row class="ordert-tit">
        <el-col :span="24">
          <el-col :span="4">
            <div class="top-select">
              <span>订单状态</span>
              <el-select v-model="allParams.orderStatus" size="small" placeholder="请选择">
                <el-option
                  v-for="item in orderStatusSear"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </el-select>
            </div>
          </el-col>
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
                v-model="chooseCompany"
                size="small"
                placeholder="请选择"
                @click.native="chooseAddrClick"
                disabled
              ></el-select>
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
            ></el-input>
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
        <el-col :span="16" :offset="1">
          <el-button type="primary" size="small" @click="sureSear">确定查询</el-button>
          <el-button type="primary" plain size="small" @click="resetSear">重置条件</el-button>
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

        <el-table-column
          prop="orderTotalWeight"
          label="总重量(g)"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == '1'" style="color: #F20F34">待审核</span>
            <span v-if="scope.row.orderStatus == '2'" style="color: #199C3C">已通过</span>
            <span v-if="scope.row.orderStatus == '3'" style="color: #E8B409">已取消</span>
            <span v-if="scope.row.orderStatus == '4'" style="color: #E8B409">未通过</span>
            <span v-if="scope.row.orderStatus == '5'" style="color: #E8B409">已退货</span>
            <span v-if="scope.row.orderStatus == '7'" style="color: #E8B409">已退货</span>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        @result="getAllDate"
        ref="child"
        :toParams="allParams"
        :pageSizes="[10, 20, 50, 100]"
        :url="this.$portMain + '/orderManage/selectOrderManageDetail'"
      ></Pagination>

      <el-dialog title="选择下单公司" width="80%" custom-class="diaaddrlist" :visible.sync="chooseAddr" :close-on-click-modal="false">
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
              <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
              <div v-for="item in addrList.data" @click="chooseAddrId(item)">{{item.companyName}}</div>
              <!--</div>-->
            </div>
            <div v-else class="noaddr">暂无公司列表</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
      chooseCompany: ""
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    getAllDate(e) {
      this.orderList = e.data.data;
      this.orderList.forEach(item => {
        if (Number(item.startOrderTotailWeight)) {
          item.orderTotalWeight = `${item.startOrderTotailWeight}-${
            item.orderTotalWeight
          }`;
        }
        item.orderTotalMoney = item.orderTotalMoney.toFixed(2);
        if (Number(item.startOrderTotalMoney)) {
          item.orderTotalMoney = `${item.startOrderTotalMoney}-${
            item.orderTotalMoney
          }`;
        }
      });
    },

    created_fun() {
      this.$axios.get(this.$portMain + "/client/clientListSimple").then(res => {
        this.companySear = res.data.data;
      });
    },

    loadMore() {},

    // 搜索订单
    sureSear() {
      this.$refs.child.search();
    },

    resetSear() {
      this.allParams = {};
      this.searchTime = "";
      this.chooseCompany = "";
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

    formatDate(row, column) {
      return this.$api.dateGetDay(row.update_time);
    },

    // 订单详情
    orderDetail(e) {
      this.$router.push({
        path: "orderDefDetail",
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
      if (this.provinceVal === "------- 省 --------") {
        this.provinceVal = "";
      }
    },

    cityed(data) {
      this.cityVal = data.value;
      if (this.cityVal === "--- 市 ---") {
        this.cityVal = "";
      }
    },

    chooseAddrId(item) {
      this.chooseCompany = item.companyName;
      this.allParams.companyId = item.companyId;
      this.chooseAddr = false;
    },

    searAddr() {
      let data = this.provinceInfo;
      let params = {
        province: this.provinceVal,
        city: this.cityVal,
        keyWord: this.searchInfo,
        page: 1,
        rows: 3000
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
  padding: 0;
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
      cursor: pointer;
      color: red;
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
