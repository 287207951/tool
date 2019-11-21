<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>存欠列表</el-breadcrumb-item>
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

            <span class="gray_font marignLeft8">所属区域</span>
            <el-select v-model="area" placeholder="请选择" size="small">
              <el-option v-for="item in areaData" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span class="gray_font marignLeft8">所属省份</span>
            <el-select v-model="province" placeholder="请选择" size="small">
              <el-option
                v-for="item in provinceData"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
            <span class="gray_font marignLeft8">客户类型</span>
            <el-select v-model="customerType" placeholder="请选择" size="small">
              <el-option
                v-for="item in customerTypeData"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
            <span class="gray_font marignLeft8">时间筛选</span>
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
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" @click="resetFun">重置</el-button>
          <el-button type="primary" size="small" @click="exportFun">导出EXcel</el-button>
        </el-col>
        <el-col :span="12" class="totalDes">
          <!-- <span>总计：来款总金额￥36598544.36</span> -->
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        :cell-style="rowClass"
        height="640"
        @row-dblclick="editGold"
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="area" label="区域" width="140"></el-table-column>
        <el-table-column prop="province" label="省份" width="80"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200"></el-table-column>
        <el-table-column prop="customerType" label="客户类型">
          <template slot-scope="scope">{{analysisCustomerType(scope.row.customerType)}}</template>
        </el-table-column>
        <el-table-column prop="finance_code" label="财务编码"></el-table-column>
        <el-table-column prop="expectearlySaveoweStock" label="期初存欠料"></el-table-column>
        <el-table-column prop="expectearlySaveoweMoney" label="期初存欠款"></el-table-column>

        <el-table-column prop="currentAccountStock" label="往来料"></el-table-column>
        <el-table-column prop="currentAccountMoney" label="往来款"></el-table-column>

        <el-table-column prop="expectendSaveoweStock" label="期末存欠料"></el-table-column>
        <el-table-column prop="expectendSaveoweMoney" label="期末存欠款"></el-table-column>

        <el-table-column prop="saveOrnament" label="存饰"></el-table-column>
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
      loading: false,
      searchloading: false,
      companyName: "", //客户名称
      customerData: [], //客户名称数据
      search: "",
      startTime: "",
      endTime: "",
      area: "全部",
      province: "",
      customerType: "全部",
      orderList: [],
      provinceData: [], //省份数据
      areaData: [], //所属区域数据
      customerTypeData: [], //客户类型数据
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      documentState: "", //单据状态
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.provinceData = this.$publicData.provinceData;
    this.getAreaData();
    Promise.all([this.getCustomerType(), this.displayAllData()]);
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.companyName,
          startTime: self.startTime,
          endTime: self.endTime,
          area: self.area == "全部" ? "" : self.area,
          province: self.province,
          customerType: self.customerType == "全部" ? "" : self.customerType,
          page: self.pageNum,
          rows: self.pageSize
        }
      };

      this.$axios
        .get(this.$portMain + "/stock/saveOweList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.orderList.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(select) {},
    // 编辑提纯单
    editGold(elem) {
      this.$router.push({
        path: "depositOweListetails",
        query: { customerName: elem.customerId }
      });
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
    //查询
    queryFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    //重置
    resetFun() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.area = "全部";
      this.province = "";
      this.customerType = "";
      this.selectedDay = "";
      this.companyName = "";
      this.customerData = [];
      this.queryFun();
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
    },
    //获取区域数据
    getAreaData() {
      //areaData
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientArea", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.areaData = res.data.data;
            self.areaData.unshift("全部");
          } else {
            // self.$message.error(res.data.msg);
          }
        });
    },
    //获取客户类型数据
    getCustomerType() {
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientTypeListRefined", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerTypeData = res.data.data;
            self.customerTypeData.unshift({
              value: "全部",
              key: ""
            });
          } else {
            // self.$message.error(res.data.msg);
          }
        });
    },
    analysisCustomerType(row) {
      let name = "";
      this.customerTypeData.forEach(item => {
        if (item.key == row) {
          name = item.value;
        }
      });
      if (name == "") {
        name = row;
      }
      return name;
    },
    rowClass({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex == 5 ||
        columnIndex == 6 ||
        columnIndex == 9 ||
        columnIndex == 10
      ) {
        return "background-color: #F5F7FA;";
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
        PRS: {
          startTime: this.startTime,
          endTime: this.endTime
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/saveOweListExcel", params)
        .then(function(res) {
          if (res.data.code == 200) {
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "存欠列表." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            let xlsDownloadA = document.createElement("a");
            xlsDownloadA.download = self.fname;
            xlsDownloadA.href = URL.createObjectURL(blob);
            xlsDownloadA.click();
          } else {
            self.$message.error(res.msg);
          }
        });
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "期初存欠料" ||
          column.label === "期初存欠款" ||
          column.label === "往来料" ||
          column.label === "往来款" ||
          column.label === "期末存欠料" ||
          column.label === "期末存欠款" ||
          column.label === "存饰"
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
