<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>料试算平衡表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <div>
            <span class="gray_font">查询日期</span>
            <el-date-picker v-model="endTime" type="date" placeholder="选择日期" size="small"></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="12">
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="primary" size="small" @click="exportFun">导出EXcel</el-button>
        </el-col>
        <el-col :span="12" class="totalDes"></el-col>
      </el-row>
      <div style="display:flex">
        <el-table
          :data="orderList.mapInventory"
          height="640"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column label="库存" align="center">
            <el-table-column prop="typeName" label="部门" header-align="center" align="center"></el-table-column>
            <el-table-column prop="netWeight" label="净重(g)" header-align="center" align="center"></el-table-column>
            <el-table-column prop="amount" label="数量(件)" header-align="center" align="center"></el-table-column>
          </el-table-column>
        </el-table>
        <el-table
          :data="orderList.stock"
          height="640"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column label="购料" align="center">
            <el-table-column prop="typeName" label="性质" header-align="center" align="center"></el-table-column>
            <el-table-column prop="netWeight" label="克重(g)" header-align="center" align="center"></el-table-column>
          </el-table-column>
        </el-table>
        <el-table
          :data="orderList.coustomerType"
          height="640"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column label="存欠" align="center">
            <el-table-column prop="typeName" label="客户类型" header-align="center" align="center"></el-table-column>
            <el-table-column prop="netWeight" label="克重(g)" header-align="center" align="center"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      orderList: {
        mapInventory: [],
        stock: [],
        coustomerType: []
      },
      endTime: "" //日期选择属性
    };
  },
  created() {
    this.displayAllData();
  },
  methods: {
    displayAllData() {
      let self = this;
      let params = {
        PRS: {
          endTime: this.endTime == null ? "" : this.endTime
        }
      };
      this.loading = true;
      this.$axios
        .get(this.$portMain + "/stock/currentAccountCollect", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //查询
    queryFun() {
      this.displayAllData();
    },

    //导出self.selectedDay != "" ? self.$api.dateGetDay(self.selectedDay) : ""
    exportFun() {
      let self = this;
      let params = {
        PRS: {
          endTime: this.endTime == null ? "" : this.endTime
        }
      };
      this.$axios
        .get(
          this.$portMain + "/templateExcelstock/currentNetWeightExcelByTrial",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "料试算平衡表." +
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
          sums[index] = "";
          return;
        }
        if (
          column.label === "克重(g)" ||
          column.label === "净重(g)" ||
          column.label === "数量(件)" ||
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
