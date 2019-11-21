<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>委托加工汇总</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
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
              :picker-options="pickerOptions2"
              style="width: 250px;"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="12">
          <el-button type="danger" size="small" plain @click="searchFun">查询</el-button>
          <el-button type="danger" size="small" @click="resetFun">重置</el-button>
          <el-button type="primary" size="small" @click="exportFun">导出EXcel</el-button>
        </el-col>
        <el-col :span="12" class="totalDes">
          <!-- <span>总计：来款总金额￥36598544.36</span> -->
        </el-col>
      </el-row>
      <el-table
        :data="listData"
        height="640"
        style="width: 100%; margin-top: 20px"
        :cell-style="{'vertical-align':'top'}"
      >
        <el-table-column prop="area" label="区域"></el-table-column>
        <el-table-column prop="province" label="省份"></el-table-column>
        <el-table-column prop="financeCode" label="财务编码"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column label="摘要">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.invoiceTypeDates"
              :key="index"
            >{{item.invoiceType}}</div>
          </template>
        </el-table-column>
        <el-table-column label="重量(g)">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.invoiceTypeDates"
              :key="index"
            >{{item.invoiceTypeWeight}}</div>
          </template>
        </el-table-column>
        <el-table-column label="借方金额(￥)">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.invoiceTypeDates"
              :key="index"
            >{{item.invoiceTypeMoney}}</div>
          </template>
        </el-table-column>
      </el-table>
      <a ref="xlsDownloadA"></a>
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
      listData: [],
      loading: false,
      searchloading: false,
      companyName: "", //客户名称
      customerData: [], //客户名称数据
      search: "",
      startTime: "",
      endTime: "",
      area: "全部",
      province: "",
      provinceData: [], //省份数据
      areaData: [], //所属区域数据
      pickerOptions2: {
        //日期选择期关键字
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
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
    this.displayAllData();
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
          page: self.pageNum,
          rows: self.pageSize
        }
      };

      this.$axios
        .get(this.$portMain + "/stock/saveOweFactoryList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.listData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
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
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchloading = true;
        let params = {
          PRS: {
            clientScope: "_FACTORY",
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
          search: this.companyName,
          startTime: this.startTime,
          endTime: this.endTime,
          area: this.area == "全部" ? "" : this.area,
          province: this.province,
          excelTypeName: "factorySaveOwe"
        }
      };
      this.$axios
        .get(
          this.$portMain + "/templateExcelstock/saveOweFactoryListExcel",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "委托加工汇总表." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.msg);
          }
        });
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
      this.province = "";
      this.area = "全部";
      this.selectedDay = "";
      this.companyName = "";
      this.customerData = [];
      this.searchFun();
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
