<template>
  <div class="conBigDiv logview" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item >系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>日志查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="12">
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            unlink-panels
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectDayFun"
            :picker-options="$publicData.pickerOptions2"
          ></el-date-picker>
        </el-col>
        <el-col :span="12">
          <div class="topMenuRight">
            <el-input
              placeholder="请输入内容"
              v-model="searchTxt"
              class="input-with-select searchTxt"
              size="small"
              @blur="searchFun"
              @keydown.enter.native="searchFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-table :data="logData" stripe height="700" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" header-align="center" align="center" width="50" label="序"></el-table-column>
        <el-table-column
          prop="operationRecognitionCode"
          label="编码"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="operationName" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="operationModule" label="模块" header-align="center" align="center"></el-table-column>
        <el-table-column prop="timeData" label="时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="operationMovement" label="动作" header-align="center" align="center"></el-table-column>
        <el-table-column
          prop="operationExplain"
          label="内容"
          width="450"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="/^DR.*/.test(scope.row.operationRecognitionCode) && scope.row.opTrue">
              <div v-html="scope.row.opTit"></div>
              <el-button type="primary" size="small" @click="viewErrDetail(scope.row)">详情</el-button>
            </div>
            <div v-else v-html="scope.row.operationExplain"></div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataSize"
          background
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="详情" :visible.sync="modalDetail" width="70%" :close-on-click-modal="false">
      <div class="modal-detail" v-html="errorDetail"></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      logData: [], //日志数据
      selectedDay: "", //日期选择属性
      startTime: "",
      endTime: "",
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示多少条记录，默认12条
      dataSize: 0, //金料单总数

      // 查看详情
      modalDetail: false,
      errorDetail: ""
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.dataDispFun();
    },
    dataDispFun() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          startTime: self.startTime,
          endTime: self.endTime,
          search: self.searchTxt,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/log/find/logAll", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.logData = res.data.data.data;
            self.logData.forEach(item => {
              item.timeData = self.$api.dateGetDayTime(item.operationTime);
              if (/^DR.*/i.test(item.operationRecognitionCode)) {
                item.opTit = self.regOp(item.operationExplain);
                item.opTrue = true;
                if (/数据出错!$/.test(item.opTit)) {
                  item.opTrue = false;
                }
              }
            });
            self.dataSize = res.data.data.pageSize;
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        }).catch(() => self.loading = false);
    },

    viewErrDetail(item) {
      this.modalDetail = true;
      this.errorDetail = item.operationExplain;
    },

    // 正则匹配标题
    regOp(options) {
      let reg = /有效行数有.*;$/;
      if (reg.exec(options)) {
        return reg.exec(options)[0];
      } else {
        return options;
      }
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageNum = 1; //默认第一页
      this.pageSize = val; //改变每页显示多少条记录
      this.dataDispFun();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.dataDispFun();
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
    //搜索
    searchFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //改变每页显示多少条记录
      this.dataDispFun();
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

  .topMenuRight {
    text-align: right;
  }

  .searchTxt {
    width: 200px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .modal-detail {
    height: 500px;
    overflow-x: auto;
  }
}
</style>

<style>
.logview .el-table__header th {
  background-color: #dae5f2;
}
</style>
