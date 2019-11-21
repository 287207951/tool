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
            <!-- 客户打单 -->
            <div
              style="width:67%"
              class="tableTwoWrap"
              v-if="basicData.bizType === `RECEIVE_CLIENT`"
            >
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
                        v-if="scope.row.ceditWayId === 2 || scope.row.ceditWayId === 22"
                        :disabled="scope.row.usDisabled"
                        @change="selectWayFun(scope.row, scope.$index )"
                      >
                        <el-option
                          v-for="item in simpleWayData"
                          :key="item.ceditWayId"
                          :label="item.ceditWayName"
                          :value="item.ceditWayId"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-else-if="scope.row.ceditWayId !== 1"
                        v-model="scope.row.ceditWayId"
                        placeholder="请选择"
                        size="mini"
                        @change="selectWayFunDef(scope.row, scope.$index)"
                        :disabled="scope.row.outIntCode != undefined || scope.row.allDisabled"
                      >
                        <el-option
                          v-for="item in wayData"
                          :key="item.ceditWayId"
                          :label="item.ceditWayName"
                          :value="item.ceditWayId"
                        ></el-option>
                      </el-select>
                      <div v-else>工费加收</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ceditProject"
                    label="项目"
                    header-align="center"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div
                        v-if="scope.row.ceditWayId === 2 || scope.row.ceditWayId === 22"
                      >{{scope.row.ceditProject}}</div>
                      <div v-else-if="scope.row.feedType === 3">{{scope.row.ceditProject}}</div>
                      <div v-else-if="scope.row.ceditProjectId === 0">{{scope.row.ceditProject}}</div>
                      <el-select
                        v-else
                        :disabled="scope.row.allDisabled"
                        v-model="scope.row.ceditProjectId"
                        placeholder="请选择"
                        size="mini"
                        @change="changeCate(scope)"
                      >
                        <el-option
                          v-for="item in categoryList"
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
                        :disabled="(scope.row.disabled && (scope.row.ceditWayId !== 2 && scope.row.ceditWayId !== 22)) || scope.row.feedType === 3 || scope.row.allDisabled"
                        placeholder="请输入"
                        size="mini"
                        @input="changeWeight(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="单价/克" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditPriceG"
                        :disabled="scope.row.feedType === 2 || scope.row.feedType === 3 || scope.row.allDisabled"
                        placeholder="请输入"
                        size="mini"
                        @input="changePriceK(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="数量" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditAmount"
                        :disabled="(scope.row.disabled && (scope.row.ceditWayId !== 2 && scope.row.ceditWayId !== 22)) || scope.row.feedType === 3 || scope.row.allDisabled"
                        placeholder="请输入"
                        size="mini"
                        @input="changeCount(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="单价/件" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditPriceJ"
                        :disabled="scope.row.feedType === 1 || scope.row.allDisabled"
                        placeholder="请输入"
                        size="mini"
                        @input="changePriceJ(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
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
                  <el-table-column prop label="备注" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditNote"
                        :disabled="scope.row.allDisabled"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                      <div class="handle">
                        <span
                          class="redColor cursorShow"
                          @click="addFun(scope.row, scope.$index)"
                          v-show="addShowTypeFun(scope.row, scope.$index)"
                        >添加</span>
                        <span
                          class="yellowColor cursorShow"
                          @click="deleteFun(scope.row, scope.$index)"
                          v-show="deleteShowTypeFun(scope.row)"
                        >删除</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>

            <!-- 工厂打单 -->
            <div
              style="width:67%"
              class="tableTwoWrap"
              v-if=" basicData.bizType === `RECEIVE_FACTORY`"
            >
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
                        @change="selectWayFunFac(scope.row, scope.$index)"
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
                      <div v-if="scope.row.feedType === 3">{{scope.row.ceditProject}}</div>
                      <el-select
                        v-else
                        v-model="scope.row.ceditProjectId"
                        placeholder="请选择"
                        size="mini"
                        @change="changeCate(scope)"
                      >
                        <el-option
                          v-for="item in categoryList"
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
                        @input="changeWeight(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="单价/克" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditPriceG"
                        placeholder="请输入"
                        size="mini"
                        @input="changePriceK(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="数量" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditAmount"
                        placeholder="请输入"
                        size="mini"
                        @input="changeCount(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="单价/件" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ceditPriceJ"
                        placeholder="请输入"
                        size="mini"
                        @input="changePriceJ(scope)"
                      ></el-input>
                    </template>
                  </el-table-column>
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
                  <el-table-column prop label="备注" header-align="center" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.ceditNote" placeholder="请输入" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                      <div class="handle">
                        <span
                          class="redColor cursorShow"
                          @click="addFun(scope.row, scope.$index)"
                        >添加</span>
                        <span
                          class="yellowColor cursorShow"
                          @click="deleteFun(scope.row, scope.$index)"
                          v-show="deleteShowFac"
                        >删除</span>
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
          <el-button type="primary" size="small" @click="submitFun">提交并打印</el-button>
        </span>
      </div>

      <div></div>
    </el-dialog>
  </div>
</template>

<script>
import stockDetail from "./stockDetail";
import stockDetailFac from "./stockDetailFac";

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
      categoryList: [], // 营销品类
      currentGoldPrice: [], // 当前金价
      basicCostData: {}, // 基础工费
      simpleWayData: [], // 只有结价、转欠方式
      wayData: [], // 结算方式数据(全部)
      proStockDetail: [], // 账款明细数据
      proStockDetailParams: [],
      dialogVisible: false,
      basicData: {},
      proList: [],
      conditi: ``
    };
  },
  created() {
    // this.st = new stockDetail();
    // this.dialogVisible = true;
    // Promise.all([
    //   this.getWay(),
    //   this.getBasicCost(),
    //   this.getCurrentGoldPrice(),
    //   this.getCategoryList(),
    //   this.getCustomer()
    // ]);
    // setTimeout(() => {
    //   this.getAccountsReceivable();
    // }, 1000);
  },
  mounted() {},
  watch: {
    dialogType(newVal, oldVal) {
      if (!newVal) {
        this.dialogVisible = false;
        return;
      }
      this.dialogVisible = true;
      Promise.all([
        this.getWay(),
        this.getBasicCost(),
        this.getCustomer(),
        this.getCurrentGoldPrice(),
        this.getCategoryList()
      ]).then(res => {
        this.getAccountsReceivable();
      });
    },
    basic(newVal) {
      newVal = { ...newVal };
      this.basicData = newVal.bizInvoice;
      this.proList = this.mergePro(newVal.bizPro, `marketingCategoryName`);
      this.proList.forEach(item => {
        item.weight = parseFloat(item.weight.toFixed(2));
      });
      this.conditi = this.proList[0].conditi;
      if (this.basicData.bizType === `RECEIVE_CLIENT`) {
        this.st = new stockDetail();
      } else {
        this.st = new stockDetailFac();
      }
      this.st.initBaseData(this.basicData, this.proList);
    }
  },

  computed: {
    // 添加按钮显示状态
    addShowTypeFun() {
      return (elem, index) => {
        // 不是转欠结价 显示增加
        if (elem.ceditWayId !== 2 && elem.ceditWayId !== 22) {
          return true;
        }
        // 结价转欠只能有一个
        let addArr = this.proStockDetail.filter(item => {
          return item.ceditWayId == 2 || item.ceditWayId == 22;
        });
        if (addArr.length === 2 && index === 0) {
          return false;
        } else {
          return true;
        }
      };
    },

    // 删除按钮显示状态
    deleteShowTypeFun() {
      return elem => {
        // 判断是否是自动生成的退工费
        const isBackPrice = elem.outIntCode && elem.ceditWayId === 8;
        if (elem.outIntCode && !isBackPrice) {
          return false;
        } else {
          return true;
        }
      };
    },

    // 入工厂删除按钮
    deleteShowFac() {
      let flag = false;
      // console.log(this.proStockDetail, this.proStockDetail.length);
      if (this.proStockDetail.length > 1) {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    }
  },

  methods: {
    closeFun() {},

    // 合并产品
    mergePro(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i][key] === arr[j][key]) {
            arr[i].weight += arr[j].weight;
            arr.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return arr;
    },

    // 获取传递给后端的参数
    getProStockDetailParams() {
      this.proStockDetailParams = this.st.getProStockDetailParams();
    },

    submitData() {
      this.$emit("submitPrintFun", {
        val: this.proStockDetail,
        params: this.proStockDetailParams
      });
    },

    // 入库单字段校验
    valiData() {
      const { weight, bizType } = this.basicData;
      const arr = [...this.st.getList()];
      if (arr.findIndex(item => item.ceditWeight > weight) !== -1) {
        this.$message.error(`账款明细中任何一条条目重量都不能大于明细的总重量`);
        return false;
      }
      let allNum = 0;
      arr.forEach(item => {
        if (item.ceditWayId === 2) {
          allNum += parseFloat(item.ceditWeight);
        }
        if (item.ceditWayId === 22) {
          allNum += parseFloat(item.ceditWeight);
        }
      });
      if (allNum !== weight) {
        this.$message.error(`转存,结价结费方式合计重量要和明细的总重量一样`);
        return false;
      }

      if (bizType === `RECEIVE_CLIENT` && !this.valiCli()) {
        return false;
      }
      if (bizType === `RECEIVE_FACTORY` && !this.valiFac()) {
        return false;
      }

      return true;
    },

    valiFac() {
      return true;
    },

    valiCli() {
      return true;
    },

    // 提交打印
    submitFun() {
      this.getProStockDetailParams();

      // 校验数据
      if (!this.valiData()) {
        return;
      }
      this.$api.refClick(this).then(res => {
        this.submitData();
      });
    },

    getCustomer() {
      let params = {
        PRS: {
          customerId: this.basicData.initiatorId
        }
      };
      return this.$axios
        .get(this.$portMain + "/discount/getCustomer", params)
        .then(res => {
          const {
            data = {
              customerDiscountPlats: [],
              discountProp: []
            }
          } = res.data;
          this.st.initCusTome(data);
        });
    },

    //获取账款明细数据
    getAccountsReceivable() {
      let self = this;
      let params = {
        BizNo: this.basicData.bizNo
      };
      this.$api.formdataPostFun(
        this.$portMain + "/biz/intoutBill/getDefaultBill",
        params,
        res => {
          //   self.proStockDetail = res.data;
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

    // 获取营销品类
    getCategoryList() {
      let self = this;
      return this.$axios
        .get(this.$portMain + "/product/findMarketingCategoryList")
        .then(function(res) {
          if (res.data.code == 200) {
            const { data } = res.data;
            self.categoryList = self.st.initCategoryList(data);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //查询结算方式
    getWay() {
      let self = this;
      let params = {
        PRS: {
          billType: "intWay"
        }
      };
      return this.$axios
        .get(this.$portMain + "/discount/getALLWay", params)
        .then(res => {
          if (res.data.code == 200) {
            const { data } = res.data;
            self.wayData = self.st.initWayData(data);
            self.simpleWayData = self.st.initSimpleWayData(data);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //查询基础工费
    getBasicCost() {
      let self = this;
      let params = { ceditWayId: 4 };
      return this.$api.formdataPostFun(
        self.$portMain + "/outstore/getKnotPriceByWageAndGold",
        params,
        res => {
          self.st.initBaseWay(res.data);
          self.basicCostData = res.data;
        },
        err => {
          self.basicCostData = [];
        }
      );
    },

    //获取当前金价
    getCurrentGoldPrice() {
      let self = this;
      return this.$axios
        .get(this.$portMain + "/stock/goldprice/order/goldprice")
        .then(function(res) {
          if (res.data.code == 200) {
            const { goldPriceProps = [] } = res.data.data;
            self.st.initGoldPrice(goldPriceProps);
            self.currentGoldPrice = res.data.data.goldPriceProps;
          } else {
            self.currentGoldPrice = [];
          }
        });
    },

    changeCate(options) {
      this.st.changeCate(options);
      this.proStockDetail = this.st.getList();
    },

    // 改变重量
    changeWeight(options) {
      this.st.changeWeight(options);
      this.proStockDetail = this.st.getList();
    },

    // 改变克单价
    changePriceK(options) {
      this.st.changePriceK(options);
      this.proStockDetail = this.st.getList();
    },

    // 改变件单价
    changePriceJ(options) {
      this.st.changePriceJ(options);
      this.proStockDetail = this.st.getList();
    },

    // 改变数量
    changeCount(options) {
      this.st.changeCount(options);
      this.proStockDetail = this.st.getList();
    },

    // 选择方式
    selectWayFun(elem) {
      elem = this.st.selectWayFun(elem);
    },

    // 选择其他费用
    selectWayFunDef(elem, index) {
      this.st.selectWayFunDef(elem, index);
      this.proStockDetail = this.st.getList();
    },

    // 工厂选择
    selectWayFunFac(elem, index) {},

    //添加
    addFun(elem, index) {
      this.st.addFun(elem, index);
      this.proStockDetail = this.st.getList();
    },

    //删除
    deleteFun(elem, index) {
      this.st.deleteFun(elem, index);
      this.proStockDetail = this.st.getList();
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
        if (
          //   column.label === "显示重量(g)" ||
          //   column.label === "入货折重(g)" ||
          column.label === "金额"
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

