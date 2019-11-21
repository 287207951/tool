<template>
  <div class="conBigDiv" v-loading="loading" ref="toExamine">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务审核</el-breadcrumb-item>
      <el-breadcrumb-item>饰出库</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号"
            v-model="searParams.search"
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
          <span class="titleFont" style="margin-left:31px">发起单位</span>
          <el-select
            v-model="searParams.initiatorId"
            placeholder="请选择"
            size="small"
            class="width160"
            filterable
            remote
            reserve-keyword
            :remote-method="getClients"
          >
            <el-option
              v-for="item in sendClientList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <span class="titleFont" style="margin-left:31px">订单状态</span>
          <el-select
            v-model="searParams.orderStatu"
            placeholder="请选择"
            size="small"
            class="width160"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in orderStatusList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div style="height: 20px"></div>
      <el-row>
        <el-col :span="24">
          <span class="titleFont" style="margin-left:31px">单据类型</span>
          <el-select v-model="searParams.bizType" placeholder="请选择" size="small" class="width160">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in financialTypeList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>
          <span class="titleFont" style="margin-left:31px">单据状态</span>
          <el-select
            v-model="searParams.invoiceStatu"
            placeholder="请选择"
            size="small"
            class="width160"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in financialList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div style="height: 20px"></div>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" @click="passFun">通过审核</el-button>
          <el-button type="danger" size="small" plain @click="RejectFun">驳回审核</el-button>
          <el-button type="primary" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        @cell-mouse-enter="mouseFun"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="60" :selectable="checkboxInit"></el-table-column>
        <!-- <el-table-column type="selection" width="60"></el-table-column> -->
        <el-table-column prop="bizNo" label="出库单号" width="150"></el-table-column>
        <el-table-column prop="bizTypeName" label="单据类型"></el-table-column>
        <!-- <el-table-column prop="sourceInvoiceNo" label="源单号" width="150"></el-table-column> -->
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)" width="110"></el-table-column>
        <el-table-column prop="weight" label="毛重(g)" width="110"></el-table-column>
        <el-table-column prop="price" label="工费" width="110"></el-table-column>
        <el-table-column prop="creator" label="操作人" width="110"></el-table-column>
        <el-table-column prop="createDate" label="操作时间" width="90"></el-table-column>
        <el-table-column prop="invoiceStatuValue" label="订单状态" width="90"></el-table-column>
        <!-- <el-table-column label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceStatuValue == 1" class="yellowColor">待审核</span>
            <span v-if="scope.row.invoiceStatuValue == 2" class="blackColor">已审核</span>
            <span v-if="scope.row.invoiceStatuValue == 3" class="redColor">已驳回</span>
          </template>
        </el-table-column>-->
        <el-table-column label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.financialAudit === 0" class="yellowColor">待审核</span>
            <span v-if="scope.row.financialAudit === 1" class="blackColor">已审核</span>
            <span v-if="scope.row.financialAudit === 2" class="redColor">已驳回</span>
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
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      shortcutData: "",
      selectionData: [],
      loading: false,
      allData: [], //饰出库数据
      stockSetKindData: [], //饰种类下拉数据
      stockSetTypeList: [], // 饰类型数据
      billsStatueData: [
        {
          id: "",
          label: "全部"
        },
        {
          // 单据状态
          id: 1,
          label: "待审核"
        },
        {
          id: 2,
          label: "审核通过"
        },
        {
          id: 3,
          label: "审核驳回"
        }
      ],
      financialList: [
        {
          val: `EXREPO`,
          txt: "已出库"
        },
        {
          val: `RCW`,
          txt: "已红冲"
        }
      ],
      financialTypeList: [
        {
          val: `RECEIVE_FACTORY`,
          txt: "收工厂饰"
        },
        {
          val: `RECEIVE_CLIENT`,
          txt: "收客户饰"
        }
      ],
      orderStatusList: [
        {
          val: 0,
          txt: "未审核"
        },
        {
          val: 1,
          txt: "已审核"
        },
        {
          val: 2,
          txt: "已驳回"
        }
      ],
      sendClientList: [],
      customerTypeData: [],
      searParams: {},
      dialogTableVisible: false, //金饰单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
    this.shortcutKey();
  },
  methods: {
    created_fun() {
      this.displayAllData();
    },
    displayAllData() {
      this.loading = true;
      let self = this;
      let params = {
        ...this.searParams,
        ...{ page: self.pageNum, rows: self.pageSize }
      };
      this.$api
        .urlPost(this.$portMain + "/financialAudit/listOut", params)
        .then(function(res) {
          if (res.data.code === 200) {
            self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach(item => {
              item.createDate = self.$api.dateGetDayTime(item.createDate);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },

    // 发起单位列表
    getClients(e) {
      // /company/queryRawClients
      let params = {
        PRS: {
          keyWord: e
        }
      };
      this.$axios
        .get(this.$portMain + "/company/queryRawClients", params)
        .then(res => {
          if (res.data.code === 200) {
            this.sendClientList = res.data.data;
          }
        });
    },

    // 选中值
    handleSelectionChange(val) {
      this.selectionData = val;
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
          //   column.label === "熔前毛重(g)" ||
          //   column.label === "熔后毛重(g)" ||
          //   column.label === "出库折重(g)" ||
          column.label === "金额(￥)"
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
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "jewelryOutStoreDetail",
        query: { bizNo: elem.bizNo }
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
      this.displayAllData();
    },
    //重置
    resetFun() {
      this.searParams = {};
      this.selectedDay = "";
      this.queryFun();
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.searParams.dateStart = this.$api.dateGetDayTime(
          self.selectedDay[0]
        );
        this.searParams.dateEnd = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.searParams.dateStart = ``;
        this.searParams.dateEnd = ``;
      }
    },
    //禁用checkbox
    checkboxInit(row, index) {
      if (row.financialAudit === 0) {
        return true; // 可勾选
      } else {
        return false; //不可勾选
      }
    },

    //审核通过
    passFun() {
      let self = this;
      let adjustIds = [];
      if (this.selectionData.length != 0) {
        this.selectionData.forEach(item => {
          adjustIds.push(item.bizNo);
        });
      }
      if (adjustIds.length == 0) {
        self.$message.error("请选择！");
        return;
      }
      let params = {
        bizNo: adjustIds.join(",")
      };
      this.$api.formdataPostFun(
        self.$portMain + "/financialAudit/approveOutData",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //驳回
    RejectFun() {
      let self = this;
      let adjustIds = [];
      if (this.selectionData.length != 0) {
        this.selectionData.forEach(item => {
          adjustIds.push(item.bizNo);
        });
      }
      if (adjustIds.length == 0) {
        self.$message.error("请选择！");
        return;
      }
      let params = {
        bizNo: adjustIds.join(",")
      };
      this.$api.formdataPostFun(
        self.$portMain + "/financialAudit/rejectInData",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //快速选中ALT+F1
    mouseFun(row) {
      if (row.financialAudit === 0) {
        this.shortcutData = row; //可勾选
      } else {
        this.shortcutData = ""; //不可勾选
      }
    },
    //快捷键
    shortcutKey() {
      let self = this;
      document.onkeydown = e => {
        //组合键
        let altKey = e.altKey || e.metaKey;
        let keyCode = e.keyCode || e.which || e.charCode;
        let dom = this.$refs.toExamine;
        if (
          dom != undefined &&
          altKey &&
          keyCode === 112 &&
          self.shortcutData != ""
        ) {
          self.$refs.multipleTable.toggleRowSelection(self.shortcutData);
        }
      };
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
}
</style>
