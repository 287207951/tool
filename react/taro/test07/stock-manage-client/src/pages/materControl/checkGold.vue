<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>测金</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="流水号/入库单/操作人员"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">时间筛选</span>
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
          ></el-date-picker>
          <!-- <span class="fontStyle">操作人</span>
            <el-select v-model="value" placeholder="请选择" size="small" style="width:160px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <span class="fontStyle">状态</span>
          <el-select v-model="check_statue" placeholder="请选择" size="small" style="width:160px">
            <el-option
              v-for="item in checkStatueData"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="margin-top:20px">
        <el-col :span="24">
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="cehckGoldList"
        stripe
        @row-dblclick="editGold"
        @selection-change="handleSelectionChange"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="serial_number" label="流水号"></el-table-column>
        <el-table-column prop="enter_code" label="入库单号"></el-table-column>
        <el-table-column prop="check_name" label="操作人员"></el-table-column>
        <el-table-column prop="check_time" label="操作时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.check_statue == 0" class="blackColor">作废</span>
            <span v-if="scope.row.check_statue == 1" class="yellowColor">待检测</span>
            <span v-if="scope.row.check_statue == 2" class="redColor">被驳回</span>
            <span v-if="scope.row.check_statue == 3" class="blackColor">已完成</span>
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
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 来料检测 -->
    <el-dialog
      title="来料检测"
      :visible.sync="createdPlanType"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24" class="fontTStyle">
            <div class="marginBottom">
              <span>流水号：</span>
              <span style="color:#000000">{{allData.serial_number}}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table ref="singleTable" :data="allData.inputStockOrderLines" style="width: 100%">
        <el-table-column prop="sequence" label="盘号"></el-table-column>
        <el-table-column label="成色">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.check_qualitys"
              placeholder="输入成色多个请以“,”隔开"
              size="small"
              :disabled="allData.check_statue == 3"
              @blur="goEmpty(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="createdPlanType = false"
          size="small"
          v-if="allData.check_statue != 3"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="saveFun"
          size="small"
          v-if="allData.check_statue != 3"
          :loading="btnSaveLoading"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      btnSaveLoading: false,
      allData: {}, //测金详情数据
      search: "", //搜索
      startTime: "", //开始时间
      endTime: "", //结束时间
      check_statue: "", //操作状态
      focusType: false,
      confirmType: false, // 确认显示状态
      inputType: false, //
      checkStatueData: [
        {
          id: "",
          value: "全部"
        },
        // {
        //   id: 0,
        //   value: "无操作"
        // },
        {
          id: 1,
          value: "待检测"
        },
        {
          id: 2,
          value: "被驳回"
        },
        {
          id: 3,
          value: "已完成"
        }
      ],
      createdPlanType: false, // 来料检测状态
      cehckGoldList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
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
      // this.$api.dateGetDay()
      this.displayAllData();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: this.search, //搜索
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          check_statue: this.check_statue, //操作状态
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/CheckStock/NcheckStockLists", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.cehckGoldList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.cehckGoldList.forEach(item => {
              item.check_time = self.$api.dateGetDayTime(item.check_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单条数据
    editGold(elem) {
      let self = this;
      this.createdPlanType = true;
      let params = {
        PRS: {
          inputStockId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/CheckStock/NcheckStockFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
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
    // 查询事件
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.check_statue = this.selectedDay =
        "";
      this.queryFun();
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      //self.$api.dateGetDayTime(item.update_time)
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
        this.queryFun();
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },
    // 保存
    saveFun() {
      let self = this;
      let res = false;
      self.allData.inputStockOrderLines.forEach(item => {
        if (item.check_qualitys == undefined || item.check_qualitys == "") {
          res = true;
        }
      });
      if (res) {
        self.$message.error("请输入成色");
        return;
      }

      let res2 = false;

      self.allData.inputStockOrderLines.forEach(item => {
        item.check_qualitys.split(",").forEach(ielem => {
          if (parseFloat(ielem) > 1) {
            res2 = true;
          }
        });
      });
      if (res2) {
        self.$message.error("成色不能大于1！");
        return;
      }

      let parems = JSON.parse(JSON.stringify(self.allData));
      parems.inputStockOrderLines.forEach(item => {
        // item.check_qualitys = String(item.check_qualitys).split(",");
        item.check_qualitys = item.check_qualitys + "";
        item.check_qualitys = item.check_qualitys
          .replace(/，/gi, ",")
          .replace(/\s*/g, "")
          .replace(/,$/gi, "");
      });

      let noNumber = "";
      parems.inputStockOrderLines.forEach(item => {
        item.check_qualitys = String(item.check_qualitys).split(",");
      });
      parems.inputStockOrderLines.forEach(item => {
        item.check_qualitys.forEach((once, index) => {
          if (isNaN(once)) {
            noNumber = "1";
          }
        });
      });
      if (noNumber) {
        self.$message.error("抱歉，只能输入数字！");
        return;
      }

      parems.inputStockOrderLines.forEach(item => {
        item.check_qualitys = item.check_qualitys.join();
      });

      // parems.inputStockOrderLines.forEach(item => {
      //   delete item.check_quality;
      // });
      this.btnSaveLoading = true;
      this.$axios
        .post(this.$portMain + "/CheckStock/NaddcheckStock", parems)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.btnSaveLoading = false;
              self.createdPlanType = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnSaveLoading = false;
          }
        });
    },
    //去空格
    goEmpty(item) {
      if (item.check_qualitys != undefined) {
        item.check_qualitys = item.check_qualitys.trim();
      }
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

  .fontSize12 {
    font-size: 12px;
    color: #F20F34;
  }
}
</style>
