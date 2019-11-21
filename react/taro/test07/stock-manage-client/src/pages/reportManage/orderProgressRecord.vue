<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单进度跟踪</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="orderNumber"
            class="input-with-select searchTxt"
            size="small"
            style="width:256px"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" size="small" plain class="marignLeft26" @click="queryFun">查询</el-button>
          <el-button type="primary" size="small">导出Excel</el-button>
        </el-col>
      </el-row>

      <div class="title">订单汇总</div>
      <el-table
        :data="orderSummaryData"
        style="width: 100%; margin-top: 12px"
        :header-cell-style="{background: '#f5f7fa'}"
        border
      >
        <el-table-column prop="bizNo" label="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="num" label="下单数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="weight" label="下单重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="outAmount" label="已出数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="outWeight" label="已出重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="incomeAmount" label="存饰数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="incomeWeight" label="存饰重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="rAmount" label="返柜数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="rWeight" label="返柜重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="residueAmount" label="剩余数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="residueWeight" label="剩余重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="salableAmount" label="可出数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="salableWeight" label="可出重量(g)" header-align="center" align="center"></el-table-column>
      </el-table>

      <div class="title">收工厂</div>
      <el-table
        :data="factoryData"
        style="width: 100%; margin-top: 12px"
        :header-cell-style="{background: '#f5f7fa'}"
        border
        :span-method="objectSpanMethodOne"
      >
        <el-table-column prop="businessName" label="业务" header-align="center" align="center"></el-table-column>
        <el-table-column prop="facName" label="工厂名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalNum" label="下单数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalWeight" label="下单重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="intNum" label="已收工厂数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="intWeight" label="已收工厂重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="OutNum" label="已退数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="OutWeight" label="已退重量(g)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="residuumNumber" label="剩余待收数量" header-align="center" align="center"></el-table-column>
        <el-table-column
          prop="residuumWeight"
          label="剩余待收重量(g)"
          header-align="center"
          align="center"
        ></el-table-column>
      </el-table>

      <div class="title">所在部门</div>
      <el-table
        :data="departmentData"
        style="width: 100%; margin-top: 12px"
        :header-cell-style="{background: '#f5f7fa'}"
        border
        :span-method="objectSpanMethodTwo"
      >
        <el-table-column label align="center">
          <el-table-column prop="bizNo" label="订单号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="departmentName" label="部门" header-align="center" align="center"></el-table-column>
        </el-table-column>

        <el-table-column label="已收工厂" align="center">
          <el-table-column prop="intFacNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="intFacWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="已退工厂" align="center">
          <el-table-column prop="outFacNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="outFacWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="调出" align="center">
          <el-table-column prop="allotNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="allotWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="内部接收" align="center">
          <el-table-column prop="allotIntNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="allotIntWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="已出客户" align="center">
          <el-table-column prop="outClienNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="outClienWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="存饰" align="center">
          <el-table-column prop="returnedClienNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="returnedClienWeight"
            label="重量(g)"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="返柜" align="center">
          <el-table-column prop="TSClienNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="TSClienWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="可出" align="center">
          <el-table-column prop="residueNum" label="数量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="residueWeight" label="重量(g)" header-align="center" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderSummaryData: [], //订单汇总数据
      factoryData: [], //收工厂数据
      departmentData: [], //所在部门数据
      orderNumber: "", //单号
      mockData: [{ area: 1 }],
      orderList: []
    };
  },
  created() {
    // this.getOrderSummary();
    // this.getFactoryData();
    // this.getDepartmentData();
  },
  methods: {
    //订单汇总
    queryFun() {
      if (/^[A-Za-z0-9\-]+$/g.test(this.orderNumber)) {
        this.getOrderSummary();
        this.getFactoryData();
        this.getDepartmentData();
      } else {
        this.$message.error("请输入正确的单据号");
        this.orderSummaryData = []; //订单汇总数据
        this.factoryData = []; //收工厂数据
        this.departmentData = []; //所在部门数据
      }
    },
    getOrderSummary() {
      let self = this;
      let params = {
        PRS: {
          bizNo: this.orderNumber
        }
      };

      this.$axios
        .get(this.$portMain + "/orderTracking/find", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderSummaryData = [res.data.data];
          } else {
            self.$message.error(res.data.msg);
            self.orderSummaryData = [];
          }
        })
        .catch();
    },
    //收工厂
    getFactoryData() {
      let self = this;
      let params = {
        PRS: {
          bizNo: this.orderNumber
        }
      };

      this.$axios
        .get(this.$portMain + "/orderTracking/findList", params)
        .then(function(res) {
          self.factoryData = [];
          if (res.data.code == 200) {
            let allData = res.data.data;
            for (let key in allData) {
              allData[key][0].businessName = `${key}收工厂`;
              allData[key][0].rowspan = allData[key].length;
              self.factoryData.push(...allData[key]);
            }
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch();
    },
    //所在部门
    getDepartmentData() {
      let self = this;
      let params = {
        PRS: {
          bizNo: this.orderNumber
        }
      };

      this.$axios
        .get(this.$portMain + "/orderTracking/findListOrder", params)
        .then(function(res) {
          self.departmentData = [];
          if (res.data.code == 200) {
            let allData = res.data.data;
            for (let key in allData) {
              if (key != "bizNo") {
                allData[key].bizNo = allData.bizNo;
                allData[key].departmentName = key;
                self.departmentData.push(allData[key]);
              }
            }
            self.departmentData[0].rowspan = self.departmentData.length;
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch();
    },
    //收工厂合并行
    objectSpanMethodOne({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.rowspan) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //所在部门合并行
    objectSpanMethodTwo({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.rowspan) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //导出
    exportFun() {
      let self = this;
      let params = {
        PRS: {
          search: self.companyName
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/noInvoiceListExcel", params)
        .then(function(res) {
          if (res.data.code == 200) {
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "未开票汇总." +
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
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .searchTxt {
    width: 320px;
  }

  .marignLeft26 {
    margin-left: 26px;
  }

  .title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 25px;
    color: rgba(46, 47, 51, 1);
    opacity: 1;
    margin-top: 29px;
  }
}
</style>
