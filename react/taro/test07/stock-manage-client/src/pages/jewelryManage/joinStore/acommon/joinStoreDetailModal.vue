<template>
  <div class="dialogWrapComp">
    <el-dialog
      title="入库单详情"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div>
        <div class="dialogContent">
          <div class="hr"></div>
          <el-row>
            <el-col :span="8">
              <div>
                <span class="grayColor">发起单位：</span>
                <span>{{basicData.initiator}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <span class="grayColor">接收单位：</span>
                <span>{{basicData.recipient}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="remarkWrap">
                <span class="grayColor" style="width: 100px">备注：</span>
                <span>{{basicData.invoiceMark}}</span>
              </div>
            </el-col>
          </el-row>
          <div style="height: 20px"></div>
          <div class="tableWrap">
            <!-- 表格1 -->
            <div style="width:33%" class="tableOneWrap">
              <el-table
                :data="proList"
                show-summary
                :summary-method="getSummaries"
                style="width:100%"
              >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column label="入货明细" header-align="center">
                  <el-table-column
                    prop="marketingCategoryName"
                    label="营销品类"
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column prop="conditi" label="种类" header-align="center" align="center"></el-table-column>
                  <el-table-column prop="weight" label="重量(g)" align="center"></el-table-column>
                </el-table-column>
              </el-table>
            </div>

            <!-- 表格2 -->
            <div style="width:67%" class="tableTwoWrap">
              <el-table
                :data="proStockDetail"
                show-summary
                :summary-method="getSummariesTwo"
                style="width: 100%"
              >
                <el-table-column label="账款明细" header-align="center">
                  <el-table-column prop="ceditWayName" label="结费方式"></el-table-column>
                  <el-table-column prop="ceditProject" label="项目"></el-table-column>
                  <el-table-column prop="ceditWeight" label="重量 "></el-table-column>
                  <el-table-column prop="ceditPriceG" label="单价/克"></el-table-column>
                  <el-table-column prop="ceditAmount" label="数量"></el-table-column>
                  <el-table-column prop="ceditPriceJ" label="单价/件"></el-table-column>
                  <el-table-column
                    prop="ceditMoney"
                    label="金额"
                    header-align="center"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div>{{scope.row.ceditMoney}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditNote" label="备注"></el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            :loading="printLoading"
            @click="submitFun"
          >打印({{basicData.print || 0}})</el-button>
        </span>
      </div>

      <div></div>
    </el-dialog>
  </div>
</template>

<script>
import st from "./stockDetail";

export default {
  props: {
    dialogType: {
      required: true
    },
    basic: {
      type: Object,
      required: false,
      default: function() {
        return {
          recipient: "",
          initiator: ""
        };
      }
    }
  },
  data() {
    return {
      proStockDetail: [], //账款明细数据
      dialogVisible: false,
      printLoading: false,
      basicData: {},
      proList: []
    };
  },
  created() {
    this.st = new st();
  },
  mounted() {},
  watch: {
    dialogType(newVal, oldVal) {
      if (!newVal) {
        this.dialogVisible = false;
        return;
      }
      this.dialogVisible = true;
      //   this.getAccountsReceivable();
    },
    basic(newVal) {
      this.basicData = newVal;
      this.proList = newVal.tableLeft;
      this.proStockDetail = newVal.tableRight;
    }
  },

  methods: {
    closeFun() {},

    //提交打印
    submitFun() {
      this.printLoading = true;
      setTimeout(() => {
        this.printLoading = false;
      }, 2000);
      this.$emit("submitPrintFun", this.proStockDetail);
    },

    // 获取账款明细数据
    getAccountsReceivable() {
      let self = this;
      let params = {
        BizNo: this.basicData.bizNo
      };
      this.$api.formdataPostFun(
        this.$portMain + "/biz/intoutBill/getDefaultBill",
        params,
        res => {
          self.proStockDetail = res.data;
          self.st.initList(res.data);
          self.st.priceAddDiscount();
          self.st.countAll();
          self.proStockDetail = self.st.getList();
          this.dialogVisible = true;
        },
        err => {
          this.dialogVisible = false;
          this.$message.error("未获取到账款明细");
        }
      );
    },

    //表格1底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "重量(g)") {
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

    getSummariesTwo(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "金额") {
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
.grayColor {
  color: #8A8E99;
}

.redColor {
  color: red;
}

.yellowColor {
  color: #F2930F;
}

.cursorShow {
  cursor: pointer;
}

.marginT20 {
  margin-top: 20px;
}

.handle {
  font-size: 12px;
  line-height: 14px;
}

.dialogWrapComp {
  font-size: 14px;
  font-weight: 400;
  color: #222426;

  .textAreaStlye {
    width: 86%;
    height: 62px;
    border-radius: 4px;
    border: 1px solid #CFD4E6;
    resize: none;
    padding: 7px;
  }

  .dialogContent {
    position: relative;

    .hr {
      border-top: 1px solid #d9d9d9;
      position: absolute;
      left: 0px;
      top: -34px;
      width: 100%;
    }

    .remarkWrap {
      display: flex;

      &>span {
        // white-space: nowrap;
      }
    }

    .tableWrap {
      display: flex;
      margin-top: 7px;
    }
  }

  .dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style>
.dialogWrapComp .tableOneWrap .el-table--border td {
  padding-top: 9px;
  padding-bottom: 10px;
}

.dialogWrapComp .tableOneWrap .el-table__footer-wrapper td {
  padding: 12px 0px;
}
.dialogWrapComp .tableTwoWrap .el-table--border td {
  padding: 7px 0px;
}

.dialogWrapComp .tableTwoWrap .el-table__footer-wrapper td {
  padding: 12px 0px;
}
</style>

