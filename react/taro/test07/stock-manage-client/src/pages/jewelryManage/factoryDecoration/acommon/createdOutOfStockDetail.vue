<template>
  <div class="dialogWrapComp" ref="AddProductsOne">
    <el-dialog
      title="出库单详情"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div class="dialogContent">
        <div class="hr"></div>
        <el-row>
          <el-col :span="8">
            <div>
              <span class="grayColor">接收单位：</span>
              <span>{{basicData.recipient}}</span>
            </div>
            <div class="marginT20">
              <span class="grayColor">发起单位：</span>
              <span>{{basicData.initiator}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span class="grayColor">打单门店：</span>
              <span>{{shopName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="remarkWrap">
              <span class="grayColor">备注：</span>
              <textarea class="textAreaStlye" placeholder="请输入备注信息" v-model="invoiceMark"></textarea>
            </div>
          </el-col>
        </el-row>

        <div class="tableWrap">
          <!-- 表格1 -->
          <div style="width:33%" class="tableOneWrap">
            <el-table
              :data="selectPackageData"
              show-summary
              :summary-method="getSummaries"
              style="width:100%"
            >
              <el-table-column label="出货明细" header-align="center">
                <el-table-column prop="packId" label="包号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="conditi" label="种类" header-align="center" align="center"></el-table-column>
                <el-table-column prop="one" label="类别" header-align="center" align="center"></el-table-column>
                <el-table-column
                  prop="packTotalSuttle"
                  label="重量(g)"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
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
                <el-table-column prop="name" label="结费方式" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.ceditWayId"
                      placeholder="请选择"
                      size="mini"
                      @change="selectWayFun(scope.row)"
                    >
                      <el-option
                        v-for="item in wayData"
                        :key="item.ceditWayId"
                        :label="item.ceditWayName"
                        :value="item.ceditWayId"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ceditProject"
                  label="项目"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.ceditWayId == 2 || scope.row.ceditWayId == 3 || scope.row.ceditWayId == 4"
                    >{{selectPackageData[0].conditi}}</span>
                    <el-select
                      v-model="scope.row.ceditProjectId"
                      placeholder="请选择"
                      size="mini"
                      @change="selectProject(scope.row)"
                      filterable
                      v-else
                    >
                      <el-option
                        v-for="item in projectData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="重量" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.ceditWeight"
                      placeholder="请输入"
                      size="mini"
                      @blur="weigthFun(scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="单价/克" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.ceditPriceG"
                      placeholder="请输入"
                      size="mini"
                      @blur="JGFun(scope.row,'ceditPriceG',scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="数量" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.ceditAmount"
                      placeholder="请输入"
                      size="mini"
                      @blur="numberFun(scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="单价/件" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.ceditPriceJ"
                      placeholder="请输入"
                      size="mini"
                      @blur="JGFun(scope.row,'ceditPriceJ',scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditMoney" label="金额" header-align="center" align="center"></el-table-column>
                <el-table-column prop="name" label="备注" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.ceditNote" placeholder="请输入" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <div class="handle">
                      <span class="redColor cursorShow" @click="addFun(scope.row,scope.$index)">添加</span>
                      <span
                        class="yellowColor cursorShow"
                        @click="deleteFun(scope.row,scope.$index)"
                        v-show="deleteShowTypeFun(scope.row)"
                      >删除</span>
                    </div>
                    <div class="handle">
                      <!-- <span class="redColor cursorShow">高开优惠</span> -->
                    </div>
                  </template>
                </el-table-column>
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
          :loading="btnLoading"
          @click="submitFun"
          v-show="proStockDetail.length > 0"
        >提交并打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogType: {
      required: true
    },
    basicData: {
      //单位数据
      // type: Object,
      required: false,
      default: function() {
        return {
          recipient: "",
          initiator: ""
        };
      }
    },
    shopName: {
      //店铺名
      required: false
    },
    selectPackageData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pakageTotalWeigth: 0, //包总重量
      btnLoading: false,
      printData: {}, //打印数据
      fromDiv: "",
      projectData: [], //项目数据
      wayData: [], //结算方式数据(全部)
      proStockDetail: [], //账款明细数据
      invoiceMark: "", //备注
      mock: "",
      mockData: [{ name: 1 }, { name: 1 }, { name: 1 }],
      dialogVisible: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    dialogType: function(newVal, oldVal) {
      this.dialogVisible = true;
      Promise.all([this.getWay(), this.getAccountsReceivable()]);
      this.getProjectData();
      // this.getCurrentGoldPrice();
      this.computePackageWN();
    }
  },
  computed: {
    //删除按钮显示状态
    deleteShowTypeFun() {
      return elem => {
        if (elem.temporaryCode != undefined) {
          return false;
        } else {
          return true;
        }
      };
    }
  },
  methods: {
    closeFun() {},
    //计算总包总重量数量
    computePackageWN() {
      this.pakageTotalWeigth = 0;
      this.selectPackageData.forEach(item => {
        this.pakageTotalWeigth += item.packTotalSuttle;
      });
    },
    //重量不能大于包总重量
    weightHandle() {
      let result = false,
        describe = new Set();
      let handleArr = this.proStockDetail.filter(item => {
        return (
          item.ceditWayId == 2 || item.ceditWayId == 3 || item.ceditWayId == 4
        );
      });
      let totalWeight = 0;
      if (handleArr.length == 0) {
        return;
      }
      handleArr.forEach(item => {
        totalWeight += item.ceditWeight;

        if (item.ceditWayId == 2) {
          describe.add("结价");
        } else if (item.ceditWayId == 3) {
          describe.add("定价");
        } else if (item.ceditWayId == 4) {
          describe.add("转欠");
        }
      });
      if (totalWeight > this.pakageTotalWeigth) {
        this.$message.error(
          `抱歉，所有的${[...describe].join()}的重量之和不能大于包的总重量`
        );
        result = true;
      }

      return result;
    },
    //提交打印
    submitFun() {
      let result = this.weightHandle();
      if (result) {
        return;
      }

      let self = this,
        checkRes = false;
      let packList = [];

      //检验方式项目不能为空
      checkRes = self.proStockDetail.some(item => {
        return item.ceditWayId == "" || item.ceditProject == "";
      });
      if (checkRes) {
        self.$message.error("抱歉，结费方式和项目不能为空！");
        return;
      }

      this.assembleFromDiv();
      this.assemblePrintData();
      this.selectPackageData.forEach(item => {
        packList.push(item.packId);
      });
      this.proStockDetail.forEach(item => {
        item.ceditMoney = Number(item.ceditMoney);
        if (item.feedType == "" || item.feedType == null) {
          delete item.feedType;
        }
      });
      let params = {
        bizNo: this.basicData.bizNo,
        packList: packList.join(),
        invoiceMark: this.invoiceMark,
        fromDiv: this.fromDiv,
        proStockDetail: this.proStockDetail
      };

      self.btnLoading = true;
      this.$axios
        .post(this.$portMain + "/outStockBills/addOutStockBills", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("确认出库成功！");
            self.printData.settleCode = res.data.msg;
            self.$emit("printFun", self.printData);
            setTimeout(function() {
              self.btnLoading = false;
              self.$router.go(-1);
            }, 200);
          } else {
            self.$message.error(res.data.msg);
            self.btnLoading = false;
          }
        });
    },
    //组装打印数据
    assemblePrintData() {
      let skuCeditGroups = [];
      this.selectPackageData.forEach(item => {
        skuCeditGroups.push({
          bizNo: item.packId,
          conditi: item.conditi,
          one: item.one,
          packTotalSuttle: item.packTotalSuttle,
          remarks: item.remark ? item.remark : item.shopNameRemarks
        });
      });
      let printData = {
        receCode: "",
        receiver: this.basicData.recipient,
        rCode: this.basicData.bizNo,
        customerName: this.basicData.initiator,
        checkTime: this.basicData.createDate,
        note: this.invoiceMark,
        skuCeditGroups,
        outstoreCedits: this.proStockDetail
      };
      this.printData = printData;
    },
    //组装fromDiv的数据
    assembleFromDiv() {
      let skuCeditGroups = [];
      this.selectPackageData.forEach(item => {
        skuCeditGroups.push({
          bizNo: item.bizNo,
          conditi: item.conditi,
          one: item.one,
          packTotalSuttle: item.packTotalSuttle,
          remarks: item.remark ? item.remark : item.shopNameRemarks
        });
      });
      let fromDiv = {
        name: "出饰单",
        tabLeft: skuCeditGroups,
        tabRight: this.proStockDetail,
        orderRemarks: this.invoiceMark
      };
      this.fromDiv = JSON.stringify(fromDiv);
    },
    //获取账款明细数据
    getAccountsReceivable() {
      let self = this;
      let pacIdList = [];
      this.selectPackageData.forEach(item => {
        pacIdList.push(item.packId);
      });
      let params = {
        BizNo: this.basicData.bizNo,
        pacIdList: JSON.stringify(pacIdList)
      };
      this.$api.formdataPostFun(
        this.$portMain + "/biz/intoutBill/getDefaultBill",
        params,
        res => {
          self.proStockDetail = res.data;
          self.proStockDetail.forEach((item, index) => {
            item.temporaryCode = `T${index}`;
          });
          self.countAll();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //查询结算方式
    getWay() {
      let self = this;
      self.wayData = [];
      let params = {
        PRS: {
          billType: "outWay"
        }
      };
      this.$axios
        .get(this.$portMain + "/discount/getALLWay", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.wayData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //账款明细项目
    getProjectData() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/product/findMarketingCategoryList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.projectData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //添加
    addFun(elem, index) {
      let rowData = {
        ceditWayId: "",
        ceditWayName: "",
        ceditProjectId: "",
        ceditProject: "",
        ceditWeight: 0,
        ceditPriceG: 0,
        ceditAmount: 0,
        ceditPriceJ: 0,
        ceditMoney: 0,
        ceditNote: "",
        feedType: ""
      };
      this.proStockDetail.splice(index + 1, 0, rowData);
    },
    //删除
    deleteFun(elem, index) {
      this.proStockDetail.splice(index, 1);
    },
    //选择项目事件
    selectProject(elem) {
      this.projectData.forEach(item => {
        if (elem.ceditProjectId == item.id) {
          elem.ceditProject = item.name;
        }
      });
    },
    //数字校验去空，返回Number型
    checkNum(item, name) {
      if (item[name] != undefined) {
        item[name] = String(item[name]).trim();
      } else {
        return true;
      }
      let result = isNaN(item[name]);
      let result2 = Number(item[name]) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数量！");
        item[name] = 0;
        this.computeMoeny(item);
        return true;
      } else {
        item[name] = Number(item[name]);
        return false;
      }
    },
    //计算金额(正常)
    computeMoeny(elem) {
      if (elem.ceditWeight != 0 && elem.ceditPriceG != 0) {
        elem.ceditMoney = Math.round(
          elem.ceditWeight * elem.ceditPriceG
        ).toFixed(2);
      } else if (elem.ceditAmount != 0 && elem.ceditPriceJ != 0) {
        elem.ceditMoney = Math.round(
          elem.ceditAmount * elem.ceditPriceJ
        ).toFixed(2);
      } else {
        elem.ceditMoney = 0;
      }

      if (elem.ceditWayId == 8 && elem.ceditMoney != 0) {
        elem.ceditMoney = `-${elem.ceditMoney}`;
      }
    },
    //单价件、克校验
    JGFun(elem, name, index) {
      let result = this.checkNum(elem, name);
      if (result) {
        return;
      }
      if (name == "ceditPriceG") {
        elem.ceditPriceJ = 0;
      } else if (name == "ceditPriceJ") {
        elem.ceditPriceG = 0;
      } else {
        elem.ceditPriceJ = 0;
        elem.ceditPriceG = 0;
      }
      this.computeMoeny(elem);
    },
    //重量校验
    weigthFun(elem) {
      let result = this.checkNum(elem, "ceditWeight");
      if (result) {
        return true;
      }
      if (elem.ceditWeight > this.pakageTotalWeigth) {
        this.$message.error("抱歉，您输入的重量不能大于包的总重量！");
        elem.ceditWeight = 0;
        return;
      }
      this.computeMoeny(elem);
    },
    //数量校验
    numberFun(elem) {
      elem.ceditAmount = ~~elem.ceditAmount;
      let result = this.checkNum(elem, "ceditAmount");
      if (result) {
        return true;
      }
      this.computeMoeny(elem);
    },
    //选择方式
    selectWayFun(elem) {
      this.wayData.forEach(item => {
        if (item.ceditWayId == elem.ceditWayId) {
          elem.ceditWayName = item.ceditWayName;
        }
      });

      //2、3、4项目固定是足金
      if (
        elem.ceditWayId == 2 ||
        elem.ceditWayId == 3 ||
        elem.ceditWayId == 4
      ) {
        elem.ceditProjectId = 0;
        elem.ceditProject = "足金";
      } else {
        elem.ceditProjectId = "";
        elem.ceditProject = "";
      }
    },

    // 计算总金额
    countPriceSingle(options) {
      let { ceditPriceG, ceditPriceJ, ceditAmount, ceditWeight } = options;
      if (Number(ceditPriceG)) {
        options.ceditMoney = Math.round(ceditPriceG * ceditWeight).toFixed(2);
      }
      if (Number(ceditPriceJ)) {
        options.ceditMoney = Math.round(ceditPriceJ * ceditAmount).toFixed(2);
      }
      if (!Number(ceditPriceG) && !Number(ceditPriceJ)) {
        options.ceditMoney = 0;
      }
      return options;
    },

    // 计算退工费
    countPriceBackSingle(options) {
      let obj = this.countPriceSingle(options);
      obj.ceditMoney = Math.round(0 - obj.ceditMoney).toFixed(2);
      return obj;
    },

    // 计算每一行的金额
    countAll() {
      for (let key in this.proStockDetail) {
        if (this.proStockDetail[key].ceditWayId === 8) {
          this.proStockDetail[key] = this.countPriceBackSingle(
            this.proStockDetail[key]
          );
        }
        if (this.proStockDetail[key].ceditWayId !== 8) {
          this.proStockDetail[key] = this.countPriceSingle(
            this.proStockDetail[key]
          );
        }
      }
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
                let res = Math.round(Number(prev) + Number(curr)).toFixed(2);
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
        white-space: nowrap;
      }
    }

    .tableWrap {
      display: flex;
      margin-top: 7px;
    }
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

