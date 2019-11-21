<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>展销统计表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <div>
            <span class="gray_font">客户名称</span>
            <el-select
              v-model="companyName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户"
              :remote-method="remoteMethod"
              @keydown.native="customeSelect($event)"
              @change="changCustomer"
              :loading="searchloading"
              size="small"
              class="width240"
            >
              <el-option
                v-for="item in customerData"
                :key="item.companyName"
                :label="item.companyName"
                :value="item.companyName"
              ></el-option>
            </el-select>

            <span class="gray_font marignLeft8">起止时间</span>
            <el-date-picker
              v-model="selectedDay"
              @change="selectDayFun"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
              style="width: 250px;"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="12">
          <el-button type="danger" size="small" plain @click="searchFun">查询</el-button>
          <el-button type="danger" size="small" @click="resetFun">重置</el-button>
          <el-button type="primary" size="small" @click="exportFun" :loading="exportLoading">导出EXcel</el-button>
        </el-col>
        <el-col :span="12" class="totalDes">
          <!-- <span>总计：来款总金额￥36598544.36</span> -->
        </el-col>
      </el-row>
      <el-table
        :data="listData"
        height="640"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
        :cell-style="{'vertical-align':'top'}"
      >
        <el-table-column prop="exhibitName" label="展销活动名称"></el-table-column>
        <el-table-column prop label="展销类型"></el-table-column>
        <el-table-column prop label="活动方"></el-table-column>
        <el-table-column prop="exhibitNo" label="展销单号"></el-table-column>
        <el-table-column prop="exportWeight" label="出货重量(g)"></el-table-column>
        <el-table-column prop="exportSum" label="出货数量"></el-table-column>
        <el-table-column prop="remainWeigt" label="退回重量(g)"></el-table-column>
        <el-table-column prop="remainSum" label="退回数量"></el-table-column>
        <el-table-column prop="stockWegiht" label="实出重量(g）"></el-table-column>
        <el-table-column prop="stockSum" label="实出数量"></el-table-column>
        <el-table-column prop="stockPrice" label="实出金额(￥)"></el-table-column>
        <el-table-column prop="opreateName" label="活动申请人"></el-table-column>
      </el-table>
      <!-- <a ref="xlsDownloadA"></a> -->
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
      exportLoading: false, //导出状态
      listData: [],
      loading: false,
      searchloading: false,
      companyName: "", //客户名称
      customerData: [], //客户名称数据
      search: "",
      startTime: "",
      endTime: "",
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData();
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        search: self.companyName,
        startTime: self.startTime,
        endTime: self.endTime,
        page: self.pageNum,
        rows: self.pageSize
      };

      this.$api.formdataPostFun(
        this.$portMain + "/stockOutManager/exportExhibitOrderInfo",
        params,
        res => {
          self.listData = res.data.data;
          self.priceSum = res.data.rowSize;
          self.loading = false;
        },
        err => {
          self.listData = [];
          self.priceSum = 0;
          self.loading = false;
          self.$message.error(err.msg);
        }
      );
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val; //默认第一页
      this.displayAllData();
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
        this.displayAllData();
      }
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchloading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        self.$axios
          .get(self.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.searchloading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },
    //客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.companyName = "";
        this.customerData = [];
      }
    },
    //选择客户
    changCustomer(val) {
      // this.search = val;
    },
    //导出
    exportFun() {
      let self = this;
      let params = {
        search: this.companyName,
        startTime: this.startTime,
        endTime: this.endTime,
        page: self.pageNum,
        rows: self.pageSize
      };
      this.exportLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/stockOutManager/exportDownOrderInfo",
        params,
        res => {
          let baseFile = res.data;
          self.fname =
            "展销统计表." +
            self.$publicData.base61File[self.$api.getContentType(baseFile)];
          let blob = self.$api.getBlob(baseFile);
          let xlsDownloadA = document.createElement("a");
          xlsDownloadA.download = self.fname;
          xlsDownloadA.href = URL.createObjectURL(blob);
          xlsDownloadA.click();
          self.exportLoading = false;
        },
        err => {
          self.$message.error(err.msg);
          self.exportLoading = false;
        }
      );
    },
    searchFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    resetFun() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.selectedDay = "";
      this.companyName = "";
      this.customerData = [];
      this.searchFun();
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "";
          return;
        }
        if (
          column.label === "下单重量(g)" ||
          column.label === "下单数量" ||
          column.label === "退回重量(g)" ||
          column.label === "退回数量" ||
          column.label === "实出重量(g)" ||
          column.label === "实出数量" ||
          column.label === "实出金额(￥)"
        ) {
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
        }
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
  .rgb196 {
    background: red;
  }

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

  .searchTxt {
    width: 320px;
  }

  .gray_font {
    color: $font-color;
    font-size: 12px;
  }

  .marignLeft8 {
    margin-left: 24px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .returnColor {
    color: #F20F34;
  }

  .passColor {
    color: #222426;
  }

  .awaitColor {
    color: #F26D0F;
  }

  .draftColor {
    color: #F2B90F;
  }

  .cancelColor {
    color: #8A9199;
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
