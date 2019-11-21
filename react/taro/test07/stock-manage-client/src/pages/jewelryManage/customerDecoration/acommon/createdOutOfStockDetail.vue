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
                <el-table-column
                  prop="shopNameRemarks"
                  label="备注"
                  header-align="center"
                  align="center"
                ></el-table-column>
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
                      v-if="scope.row.ceditWayId == 2 || scope.row.ceditWayId == 4"
                      :disabled="paymentOfArrears(scope.row)"
                      @change="selectWayFun(scope.row)"
                    >
                      <el-option
                        v-for="item in simpleWayData"
                        :key="item.ceditWayId"
                        :label="item.ceditWayName"
                        :value="item.ceditWayId"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="scope.row.ceditWayId"
                      placeholder="请选择"
                      size="mini"
                      v-else
                      :disabled="paymentOfArrearsTwo(scope.row)"
                      @change="selectWayTwoFun(scope.row,scope.$index)"
                    >
                      <el-option
                        v-for="item in wayData"
                        :key="item.ceditWayId"
                        :label="item.ceditWayName"
                        :value="item.ceditWayId"
                        :disabled="item.ceditWayId == 2 || item.ceditWayId == 4 || item.ceditWayId == 1"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop label="项目" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span v-if="projectStatus(scope.row)">{{scope.row.ceditProject}}</span>
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
                      :disabled="ceditWeightDisabledFun(scope.row)"
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
                      :disabled="ceditPriceGDisabledFun(scope.row)"
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
                      :disabled="ceditAmountDisabledFun(scope.row)"
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
                      :disabled="ceditPriceJDisabledFun(scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditMoney" label="金额" header-align="center" align="center"></el-table-column>
                <el-table-column prop label="备注" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.ceditNote"
                      placeholder="请输入"
                      size="mini"
                      @blur="noteFun(scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <div class="handle">
                      <span
                        class="redColor cursorShow"
                        @click="addFun(scope.row,scope.$index)"
                        v-show="addShowTypeFun(scope.row)"
                      >添加</span>
                      <span
                        class="yellowColor cursorShow"
                        @click="deleteFun(scope.row,scope.$index)"
                        v-show="deleteShowTypeFun(scope.row)"
                      >删除</span>
                    </div>
                    <div class="handle">
                      <span
                        class="redColor cursorShow"
                        @click="highOpenFun(scope.row,scope.$index)"
                        v-show="scope.row.highOpenBtn"
                      >高开优惠</span>
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
    },
    SelectedShopPackId: {
      required: false
    }
  },
  data() {
    return {
      btnLoading: false,
      printData: {}, //打印数据
      fromDiv: "",
      customerDiscount: {}, //客户优惠数据
      projectData: [], //项目数据
      pakageTotalAmount: 0, //包总数量
      pakageTotalWeigth: 0, //包总重量
      currentGoldPrice: [], //当前金价
      basicCostData: {}, //基础工费
      simpleWayData: [], //只有结价、转欠方式
      wayData: [], //结算方式数据(全部)
      proStockDetail: [], //账款明细数据
      invoiceMark: "", //备注
      dialogVisible: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    dialogType: function(newVal, oldVal) {
      this.dialogVisible = true;
      this.handcreated();
      this.getCurrentGoldPrice();
      this.computePackageWN();
      this.getProjectData();
    }
  },
  computed: {
    //输入框禁用状态(重量)
    ceditWeightDisabledFun() {
      return elem => {
        if (elem.ceditWayId == 1) {
          return true;
        } else if (elem.ceditWayId == 8 && elem.temporaryIndex != undefined) {
          return true;
        } else if (elem.ceditWayId == 8 && elem.outIntCode != undefined) {
          return true;
        }
      };
    },
    //输入框禁用状态(数量)
    ceditAmountDisabledFun() {
      return elem => {
        if (elem.ceditWayId == 1) {
          return true;
        } else if (elem.ceditWayId == 8 && elem.temporaryIndex != undefined) {
          return true;
        } else if (elem.ceditWayId == 8 && elem.outIntCode != undefined) {
          return true;
        } else if (elem.feedType == "" && elem.billingWay == "d") {
          //杂费按单算数量禁用
          return true;
        }
      };
    },

    //输入框禁用状态(单价/克)
    ceditPriceGDisabledFun() {
      return elem => {
        if (
          (elem.ceditWayId == 2 || elem.ceditWayId == 4) &&
          elem.feedType == 1
        ) {
          return false;
        } else if (elem.ceditWayId == 1 && elem.feedType == 1) {
          return false;
        } else if (elem.ceditWayId == 8 && elem.feedType == 1) {
          return false;
        } else if (elem.feedType == "" && elem.billingWay == "k") {
          //杂费按克算
          return false;
        } else {
          return true;
        }
      };
    },
    //输入框禁用状态(单价/件)
    ceditPriceJDisabledFun() {
      return elem => {
        if (
          (elem.ceditWayId == 2 || elem.ceditWayId == 4) &&
          elem.feedType == 2
        ) {
          return false;
        } else if (elem.ceditWayId == 1 && elem.feedType == 2) {
          return false;
        } else if (elem.ceditWayId == 8 && elem.feedType == 2) {
          return false;
        } else if (elem.feedType == "" && elem.billingWay == "j") {
          //杂费按件算
          return false;
        } else if (elem.feedType == "" && elem.billingWay == "d") {
          //杂费按单算
          return false;
        } else {
          return true;
        }
      };
    },
    //添加按钮显示状态
    addShowTypeFun() {
      return elem => {
        if (elem.ceditWayId == 2 || elem.ceditWayId == 4) {
          //结价转欠只能有一个
          let addArr = [];
          addArr = this.proStockDetail.filter(item => {
            return item.ceditWayId == 2 || item.ceditWayId == 4;
          });
          if (addArr.length == 2) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      };
    },
    //删除按钮显示状态
    deleteShowTypeFun() {
      return elem => {
        if (elem.outIntCode != undefined && elem.ceditWayId != 8) {
          return false;
        } else {
          return true;
        }
      };
    },
    //方式禁用(结价、转欠同事存在禁用)
    paymentOfArrears() {
      return elem => {
        if (elem.ceditWayId == 2 || elem.ceditWayId == 4) {
          //结价转欠只能有一个
          let addArr = [];
          addArr = this.proStockDetail.filter(item => {
            return item.ceditWayId == 2 || item.ceditWayId == 4;
          });
          if (elem.outIntCode == undefined || addArr.length == 2) {
            return true;
          }
        }
      };
    },
    //方式禁用(排除结价、转欠)
    paymentOfArrearsTwo() {
      return elem => {
        if (elem.outIntCode != undefined) {
          return true;
        }
        if (elem.temporaryIndex != undefined) {
          return true;
        }
        if (elem.subFeeId != undefined) {
          return true;
        }
      };
    },
    //项目选择框显示状态
    projectStatus() {
      return elem => {
        if (
          elem.outIntCode != undefined ||
          elem.temporaryIndex != undefined ||
          elem.ceditWayId == 2 ||
          elem.ceditWayId == 4 ||
          elem.subFeeId != undefined
        ) {
          return true;
        } else {
          return false;
        }
      };
    }
  },
  filters: {},
  methods: {
    async handcreated() {
      await this.getWay(),
        await this.getBasicCost(),
        await this.getCustomerPreferences(),
        await this.getAccountsReceivable();
    },
    closeFun() {},

    submitData() {
      let self = this,
        checkRes = false;
      //检验方式项目不能为空
      checkRes = self.proStockDetail.some(item => {
        return item.ceditWayId == "" || item.ceditProject == "";
      });
      if (checkRes) {
        self.$message.error("抱歉，结费方式和项目不能为空！");
        return;
      }
      let newProStockDetail = JSON.parse(JSON.stringify(self.proStockDetail));
      let backupProStockDetail = JSON.parse(
        JSON.stringify(self.proStockDetail)
      );
      newProStockDetail.forEach(item => {
        item.ceditMoney = Number(item.ceditMoney);
        item.ceditPriceJ = Number(item.ceditPriceJ);
        item.ceditPriceG = Number(item.ceditPriceG);
        item.oldCeditpriceJ
          ? (item.oldCeditpriceJ = Number(item.oldCeditpriceJ))
          : "";
        item.oldCeditpriceG
          ? (item.oldCeditpriceG = Number(item.oldCeditpriceG))
          : "";

        if (item.feedType == "" || item.feedType == null) {
          delete item.feedType;
        }
      });
      backupProStockDetail.forEach(item => {
        item.ceditMoney = Number(item.ceditMoney);
        item.ceditPriceJ = Number(item.ceditPriceJ);
        item.ceditPriceG = Number(item.ceditPriceG);
        item.oldCeditpriceJ
          ? (item.oldCeditpriceJ = Number(item.oldCeditpriceJ))
          : "";
        item.oldCeditpriceG
          ? (item.oldCeditpriceG = Number(item.oldCeditpriceG))
          : "";
        if (item.feedType == "" || item.feedType == null) {
          delete item.feedType;
        }
      });
      newProStockDetail.forEach(item => {
        if (item.ceditWayId == 1) {
          item.returnoutstoreCeditList = [];

          backupProStockDetail.forEach(it => {
            if (
              item.temporaryIndex == it.temporaryIndex &&
              it.ceditWayId == 8
            ) {
              //工费加收高开产生退工费1.表示高开产生的优惠，2表示其他产生的退工费
              let newItem = Object.assign(it, { statue: 1 });
              item.returnoutstoreCeditList.push(newItem);
            }
            if (item.parentFeeId == it.subFeeId && it.ceditWayId == 8) {
              //工费加收优惠产生退工费
              let newItem = Object.assign(it, { statue: 2 });
              item.returnoutstoreCeditList.push(newItem);
            }
          });
        }
      });

      this.assembleFromDiv();
      this.assemblePrintData();

      let packList = [];
      this.selectPackageData.forEach(item => {
        packList.push(item.packId);
      });

      let params = {
        bizNo: this.basicData.bizNo,
        packList: packList.join(),
        invoiceMark: this.invoiceMark,
        supPackId: this.SelectedShopPackId,
        fromDiv: this.fromDiv,
        proStockDetail: newProStockDetail
      };
      this.btnLoading = true;
      this.$axios
        .post(this.$portMain + "/outStockBills/addOutStockClientBills", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("确认出库成功！");
            self.printData.newOrderNum = res.data.msg;
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

    //重量不能大于包总重量
    weightHandle() {
      let result = false,
        describe = new Set();
      let handleArr = this.proStockDetail.filter(item => {
        return item.ceditWayId == 2 || item.ceditWayId == 4;
      });
      let totalWeight = 0;
      if (handleArr.length == 0) {
        return;
      }
      handleArr.forEach(item => {
        totalWeight += item.ceditWeight;

        if (item.ceditWayId == 2) {
          describe.add("结价");
        } else if (item.ceditWayId == 4) {
          describe.add("转欠");
        }
      });
      if (totalWeight == 0) {
        this.$message.error(`请输入${[...describe].join()}的重量`);
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

      this.$api.refClick(this).then(res => {
        this.submitData();
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
          remarks: item.shopNameRemarks
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
          remarks: item.shopNameRemarks
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
      return this.$api.formdataPostFun(
        this.$portMain + "/biz/intoutBill/getDefaultBill",
        params,
        res => {
          self.proStockDetail = res.data;
          self.proStockDetail.forEach((item, index) => {
            if (item.ceditWayId == 1) {
              item.highOpenBtn = false; //控制高开按钮
              item.temporaryIndex = `T${index}`; //工费加收临时id，用于关联生成的退工费（高开优惠）
              item.parentFeeId = `T${index}`; //工费加收用于关联生成的退工费（客户优惠）
            }
          });

          //工费加收产生退工费（ceditWayId：1且 feedType：1）
          self.proStockDetail.forEach((item, index) => {
            if (item.ceditWayId == 1 && item.feedType == 1) {
              self.LaborCostContrastDiscount(item);
            }
          });

          //防止工费加收少产生的退工费
          // setTimeout(function() {
          //   self.proStockDetail.forEach((item, index) => {
          //     if (item.ceditWayId == 1 && item.feedType == 1) {
          //       self.LaborCostContrastDiscount(item);
          //     }
          //   });
          //    console.log("账款数据2", self.proStockDetail);
          // }, 500);

          // console.log("账款数据1", self.proStockDetail);
        },
        err => {
          self.$message.error(err.msg);
          self.proStockDetail = [];
        }
      );
    },
    //查询结算方式
    getWay() {
      let self = this;
      self.wayData = [];
      self.simpleWayData = [];
      let params = {
        PRS: {
          billType: "outWay"
        }
      };
      return this.$axios
        .get(this.$portMain + "/discount/getALLWay", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.wayData = res.data.data;
            self.simpleWayData = self.wayData.filter(item => {
              return item.ceditWayId == 2 || item.ceditWayId == 4;
            });
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
      this.$axios
        .get(this.$portMain + "/stock/goldprice/order/goldprice")
        .then(function(res) {
          if (res.data.code == 200) {
            self.currentGoldPrice = res.data.data.goldPriceProps;
          } else {
            self.currentGoldPrice = [];
          }
        });
    },
    //根据项目获取当前的金价
    getProjectGoldPrice(elem) {
      let goldPrice = "";
      if (elem.ceditWayId == 2 || elem.ceditWayId == 4) {
        this.currentGoldPrice.forEach(item => {
          goldPrice = item.propValue;
        });
      }
      return goldPrice;
    },
    //选择方式(结价、转欠)
    selectWayFun(elem) {
      if (this.basicCostData.length == 0 && this.currentGoldPrice.length == 0) {
        return;
      }

      let goldPrice = this.getProjectGoldPrice(elem);
      if (elem.ceditWayId == 2) {
        elem.ceditPriceG = this.basicCostData[elem.ceditProject] + goldPrice;
        elem.ceditMoney = (elem.ceditWeight * elem.ceditPriceG).toFixed(2);
        elem.ceditWayName = "结价";
        console.log(
          "结价",
          elem,
          this.basicCostData[elem.ceditProject],
          goldPrice
        );
      } else if (elem.ceditWayId == 4) {
        elem.ceditPriceG = this.basicCostData[elem.ceditProject];
        elem.ceditMoney = (elem.ceditWeight * elem.ceditPriceG).toFixed(2);
        elem.ceditWayName = "转欠";
        console.log("转欠", elem, this.basicCostData[elem.ceditProject]);
      }
      this.$forceUpdate();
      // console.log(elem);
    },
    //选择方式（杂费）
    selectWayTwoFun(elem, index) {
      this.wayData.forEach(item => {
        if (elem.ceditWayId == item.ceditWayId) {
          elem.ceditWayName = item.ceditWayName;
          elem.billingWay = item.billingWay;
          //根据方式规定的确定是按克、件、单算，然后将price回填到对应的位置
          if (item.billingWay == "k" && item.price != undefined) {
            elem.ceditPriceG = item.price;
          } else if (item.billingWay == "j" && item.price != undefined) {
            elem.ceditPriceJ = item.price;
          } else if (item.billingWay == "d" && item.price != undefined) {
            //按单算数量默认是1.而且不能修改
            elem.ceditPriceJ = item.price;
            elem.ceditAmount = 1;
          } else {
            elem.ceditPriceJ = 0;
            elem.ceditAmount = 0;
            elem.ceditPriceG = 0;
          }
          this.computeMoeny(elem);
        }
      });

      //选择杂费，删除之前生成的退工费
      let subscript = "";
      this.proStockDetail.forEach((item, num) => {
        if (elem.parentFeeId == item.subFeeId) {
          subscript = num;
        }
      });
      if (subscript != "") {
        this.proStockDetail.splice(subscript, 1);
      }

      //自动生成退工费
      this.contrastCustomerDiscount(elem, index);
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
        feedType: "",
        parentFeeId: `T${index + 1}`,
        statue: 4 //3、表示工费区间的的优惠和高开，4、表示杂费的退工费
      };
      let goldPrice = this.getProjectGoldPrice(elem);
      if (elem.ceditWayId == 2) {
        rowData.ceditWayId = 4;
        rowData.ceditWayName = "转欠";
        rowData.ceditProjectId = elem.ceditProjectId;
        rowData.ceditProject = elem.ceditProject;
        rowData.feedType = elem.feedType;
        rowData.ceditPriceG = this.basicCostData[elem.ceditProject];
        rowData.ceditMoney = 0;
        delete rowData.statue;
      }
      if (elem.ceditWayId == 4) {
        rowData.ceditWayId = 2;
        rowData.ceditWayName = "结价";
        rowData.ceditProjectId = elem.ceditProjectId;
        rowData.ceditProject = elem.ceditProject;
        rowData.feedType = elem.feedType;
        rowData.ceditPriceG = this.basicCostData[elem.ceditProject] + goldPrice;
        rowData.ceditMoney = 0;
        delete rowData.statue;
      }
      this.proStockDetail.splice(index + 1, 0, rowData);
    },
    //删除
    deleteFun(elem, index) {
      this.proStockDetail.splice(index, 1);
      if (elem.ceditWayId == 8 && elem.temporaryIndex != undefined) {
        this.proStockDetail.forEach(item => {
          if (item.temporaryIndex == elem.temporaryIndex) {
            item.highOpenBtn = true;
          }
        });
      }

      if (elem.parentFeeId != undefined) {
        let subscript = "";
        this.proStockDetail.forEach((item, num) => {
          if (item.ceditWayId == 8 && elem.parentFeeId == item.subFeeId) {
            subscript = num;
          }
        });
        if (subscript != "") {
          this.proStockDetail.splice(subscript, 1);
        }
      }
    },
    //重量校验
    weigthFun(elem) {
      // console.log("总数量", this.pakageTotalWeigth);
      let result = this.checkNum(elem, "ceditWeight");
      if (result) {
        return true;
      }

      //拿到结价、转欠的重量、下标
      let closingPrice, closingPriceIndex, turnOver, turnOverindex;
      this.proStockDetail.forEach((item, index) => {
        if (item.ceditWayId == 2) {
          closingPrice = item.ceditWeight;
          closingPriceIndex = index;
        } else if (item.ceditWayId == 4) {
          turnOver = item.ceditWeight;
          turnOverindex = index;
        }
      });

      elem.ceditWeight = Number(elem.ceditWeight).toFixed(2);

      if (elem.ceditWayId == 2) {
        //输入结价重量校验
        if (closingPrice != undefined && turnOver != undefined) {
          //输入结价重量不能大于包总重量
          if (elem.ceditWeight > this.pakageTotalWeigth) {
            this.$message.error("抱歉，您输入的重量不能大于包的总重量！");
            elem.ceditWeight = this.pakageTotalWeigth;
            this.proStockDetail[turnOverindex].ceditWeight = 0;
            return;
          }
          this.proStockDetail[turnOverindex].ceditWeight = (
            this.pakageTotalWeigth - elem.ceditWeight
          ).toFixed(2);
        } else if (turnOver == undefined) {
          if (elem.ceditWeight != this.pakageTotalWeigth) {
            this.$message.error("抱歉，您输入的重量跟包的总重量不符合！");
            elem.ceditWeight = this.pakageTotalWeigth;
            return;
          }
        }
      } else if (elem.ceditWayId == 4) {
        //输入转欠重量校验
        if (closingPrice != undefined && turnOver != undefined) {
          //输入结价重量不能大于包总重量
          if (elem.ceditWeight > this.pakageTotalWeigth) {
            this.$message.error("抱歉，您输入的重量不能大于包的总重量！");
            elem.ceditWeight = this.pakageTotalWeigth;
            this.proStockDetail[closingPriceIndex].ceditWeight = 0;
            return;
          }
          this.proStockDetail[closingPriceIndex].ceditWeight = (
            this.pakageTotalWeigth - elem.ceditWeight
          ).toFixed(2);
        } else if (closingPrice == undefined) {
          if (elem.ceditWeight != this.pakageTotalWeigth) {
            this.$message.error("抱歉，您输入的重量跟包的总重量不符合！");
            elem.ceditWeight = this.pakageTotalWeigth;
            return;
          }
        }
      }

      if (elem.ceditWeight > this.pakageTotalWeigth) {
        elem.ceditWeight = 0;
        this.$message.error("抱歉，您输入的重量跟不能大于包的总重量！");
      }

      this.computeMoeny(elem);
      if (elem.ceditWayId == 2) {
        this.indirectComputeMoeny(4);
      } else if (elem.ceditWayId == 4) {
        this.indirectComputeMoeny(2);
      }
    },
    //数量校验
    numberFun(elem) {
      elem.ceditAmount = ~~elem.ceditAmount;
      let result = this.checkNum(elem, "ceditAmount");
      if (result) {
        return true;
      }

      //拿到结价、转欠的数量、下标
      let closingNum, closingPriceIndex, turnOverNum, turnOverindex;
      this.proStockDetail.forEach((item, index) => {
        if (item.ceditWayId == 2) {
          closingNum = item.ceditAmount;
          closingPriceIndex = index;
        } else if (item.ceditWayId == 4) {
          turnOverNum = item.ceditAmount;
          turnOverindex = index;
        }
      });

      if (elem.ceditWayId == 2) {
        //输入结价数量校验
        if (closingNum != undefined && turnOverNum != undefined) {
          //输入结价数量不能大于包总数量
          if (elem.ceditAmount > this.pakageTotalAmount) {
            this.$message.error("抱歉，您输入的数量不能大于包的总数量！");
            elem.ceditAmount = this.pakageTotalAmount;
            this.proStockDetail[turnOverindex].ceditAmount = 0;
            return;
          }
          this.proStockDetail[turnOverindex].ceditAmount =
            this.pakageTotalAmount - elem.ceditAmount;
        } else if (turnOverNum == undefined) {
          if (elem.ceditAmount > this.pakageTotalAmount) {
            this.$message.error("抱歉，您输入的数量不能大于包的总数量！");
            elem.ceditAmount = this.pakageTotalAmount;
            return;
          }
        }
      } else if (elem.ceditWayId == 4) {
        //输入转欠重量校验
        if (closingNum != undefined && turnOverNum != undefined) {
          //输入结价重量不能大于包总重量
          if (elem.ceditAmount > this.pakageTotalAmount) {
            this.$message.error("抱歉，您输入的数量不能大于包的总数量！");
            elem.ceditAmount = this.pakageTotalAmount;
            this.proStockDetail[closingPriceIndex].ceditAmount = 0;
            return;
          }
          this.proStockDetail[closingPriceIndex].ceditAmount =
            this.pakageTotalAmount - elem.ceditAmount;
        } else if (closingNum == undefined) {
          if (elem.ceditAmount > this.pakageTotalAmount) {
            this.$message.error("抱歉，您输入的数量不能大于包的总数量！");
            elem.ceditAmount = this.pakageTotalAmount;
            return;
          }
        }
      }

      this.computeMoeny(elem);
      if (elem.ceditWayId == 2) {
        this.indirectComputeMoeny(4);
      } else if (elem.ceditWayId == 4) {
        this.indirectComputeMoeny(2);
      }
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
        if (
          //结价重量+转欠重量 = 总重量
          name == "ceditWeight" &&
          (item.ceditWayId == 2 || item.ceditWayId == 4)
        ) {
          this.weigthFun(item);
        }
        this.computeMoeny(item);
        return true;
      } else {
        item[name] = Number(item[name]);
        return false;
      }
    },
    //单价件、克校验
    JGFun(elem, name, index) {
      // console.log("行数据", elem);
      let result = this.checkNum(elem, name);
      if (result) {
        if (elem.ceditWayId == 1) {
          name == "ceditPriceJ"
            ? (elem.ceditPriceJ = elem.oldCeditpriceJ)
            : name == "ceditPriceG"
            ? this.LaborCostContrastDiscount(elem)
            : "";
        }
        return;
      }
      if (name == "ceditPriceG") {
        elem.ceditPriceJ = 0;
        this.computeMoeny(elem);
      } else if (name == "ceditPriceJ") {
        elem.ceditPriceG = 0;
        this.computeMoeny(elem);
      }
      if (elem.ceditWayId == 1) {
        //高开优惠按钮判断
        this.highOpenBtnFun(elem, name);
      } else if (elem.ceditWayId == 8 && elem.temporaryIndex != undefined) {
        this.highOpenRetreatFeeGJ(elem, name);
      }

      //添加一条工费使用单价克、件和客户优惠(customerDiscountPlats)比较在这个范围内自动生成一条退工费
      //工费加收只能使用单价克和客户优惠(discountProp)进行比较
      this.contrastCustomerDiscount(elem, index);

      if (name == "ceditPriceG") {
        this.LaborCostContrastDiscount(elem);
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
    //计算金额(间接)
    indirectComputeMoeny(wayId) {
      this.proStockDetail.forEach(item => {
        if (item.ceditWayId == wayId) {
          this.computeMoeny(item);
        }
      });
    },
    //工费加收高开优惠关联退工费（工费加收单价克、件改变相关的退工费单价克、件也要改变）
    //当工费加收没有高开优惠时关联的退工费就要删除
    laborCostRelationSituation(elem, name) {
      let selectIndex = "";
      this.proStockDetail.forEach((item, index) => {
        if (
          elem.temporaryIndex == item.temporaryIndex &&
          item.ceditWayId == 8
        ) {
          selectIndex = index;
        }
      });

      if (selectIndex == "") {
        return;
      }

      if (name == "ceditPriceG") {
        if (elem.oldCeditpriceG == elem.ceditPriceG) {
          this.proStockDetail.splice(selectIndex, 1);
        } else {
          this.proStockDetail[selectIndex].ceditPriceG = (
            Number(elem.ceditPriceG) - Number(elem.oldCeditpriceG)
          ).toFixed(2);
          this.proStockDetail[selectIndex].oldCeditpriceG = (
            Number(elem.ceditPriceG) - Number(elem.oldCeditpriceG)
          ).toFixed(2);
        }
      }

      if (name == "ceditPriceJ") {
        if (elem.oldCeditpriceJ == elem.ceditPriceJ) {
          this.proStockDetail.splice(selectIndex, 1);
        } else {
          this.proStockDetail[selectIndex].ceditPriceJ = (
            Number(elem.ceditPriceJ) - Number(elem.oldCeditpriceJ)
          ).toFixed(2);
          this.proStockDetail[selectIndex].oldCeditpriceJ = (
            Number(elem.ceditPriceJ) - Number(elem.oldCeditpriceJ)
          ).toFixed(2);
        }
      }
    },
    //工费加收高开优惠按钮(不能小于旧的值)
    highOpenBtnFun(elem, name) {
      if (name == "ceditPriceG") {
        if (elem.ceditPriceG > elem.oldCeditpriceG) {
          elem.highOpenBtn = true;
        } else if (elem.ceditPriceG < elem.oldCeditpriceG) {
          elem.highOpenBtn = false;
          // this.$message.error(`你输的值只能大于或等于${elem.oldCeditpriceG}！`);
          // elem.ceditPriceG = elem.oldCeditpriceG;
          this.computeMoeny(elem);
        } else {
          elem.highOpenBtn = false;
        }
      } else if (name == "ceditPriceJ") {
        if (elem.ceditPriceJ > elem.oldCeditpriceJ) {
          elem.highOpenBtn = true;
        } else if (elem.ceditPriceJ < elem.oldCeditpriceJ) {
          elem.highOpenBtn = false;
          this.$message.error(`你输的值只能大于或等于${elem.oldCeditpriceJ}！`);
          elem.ceditPriceJ = elem.oldCeditpriceJ;
          this.computeMoeny(elem);
        } else {
          elem.highOpenBtn = false;
        }
      }

      this.proStockDetail.forEach(item => {
        if (
          elem.temporaryIndex == item.temporaryIndex &&
          item.ceditWayId == 8
        ) {
          elem.highOpenBtn = false;
        }
      });
      this.laborCostRelationSituation(elem, name);
    },
    //高开优惠产生的退工费单价克、件校验（只能在0~oldCeditpriceG、oldCeditpriceJ之间）
    highOpenRetreatFeeGJ(elem, name) {
      if (name == "ceditPriceG") {
        if (elem.ceditPriceG > elem.oldCeditpriceG || elem.ceditPriceG < 0) {
          this.$message.error(`你输的值只能在0~${elem.oldCeditpriceG}!`);
          elem.ceditPriceG = elem.oldCeditpriceG;
          this.computeMoeny(elem);
        } else {
          this.computeMoeny(elem);
        }
      } else if (name == "ceditPriceJ") {
        if (elem.ceditPriceJ > elem.oldCeditpriceJ || elem.ceditPriceJ < 0) {
          this.$message.error(`你输的值只能在0~${elem.oldCeditpriceJ}!`);
          elem.ceditPriceJ = elem.oldCeditpriceJ;
          this.computeMoeny(elem);
        } else {
          this.computeMoeny(elem);
        }
      }
    },
    //计算总包总重量数量
    computePackageWN() {
      this.pakageTotalWeigth = 0;
      this.pakageTotalAmount = 0;
      this.selectPackageData.forEach(item => {
        this.pakageTotalWeigth += item.packTotalSuttle;
        this.pakageTotalAmount += item.packTotalAmount;
      });
    },
    //高开优惠事件
    highOpenFun(elem, index) {
      elem.highOpenBtn = false;
      let rowData = {
        ceditWayId: 8,
        ceditWayName: "退工费",
        ceditProjectId: elem.ceditProjectId,
        ceditProject: elem.ceditProject,
        ceditWeight: elem.ceditWeight,
        ceditAmount: elem.ceditAmount,
        ceditMoney: 0,
        ceditNote: "",
        feedType: elem.feedType,
        statue: 3,
        temporaryIndex: elem.temporaryIndex, //用于工费加收关联退工费
        ceditPriceJ: (
          Number(elem.ceditPriceJ) - Number(elem.oldCeditpriceJ)
        ).toFixed(2),
        oldCeditpriceJ: (
          Number(elem.ceditPriceJ) - Number(elem.oldCeditpriceJ)
        ).toFixed(2),
        ceditPriceG: (
          Number(elem.ceditPriceG) - Number(elem.oldCeditpriceG)
        ).toFixed(2),
        oldCeditpriceG: (
          Number(elem.ceditPriceG) - Number(elem.oldCeditpriceG)
        ).toFixed(2)
        // outIntCode: elem.outIntCode
      };
      this.computeMoeny(rowData);
      this.proStockDetail.splice(index + 1, 0, rowData);
    },
    //查询某个客户的优惠
    getCustomerPreferences() {
      let self = this;
      let params = {
        PRS: {
          customerId: self.basicData.recipientId
        }
      };
      return self.$axios
        .get(self.$portMain + "/discount/getCustomer", params)
        .then(res => {
          // self.editData = res.data.data;
          if (res.data.data != undefined) {
            self.customerDiscount = res.data.data;
          } else {
            self.customerDiscount = {};
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
    //选择项目事件
    selectProject(elem) {
      this.projectData.forEach(item => {
        if (elem.ceditProjectId == item.id) {
          elem.ceditProject = item.name;
        }
      });

      //proStockDetail
      if (elem.parentFeeId != undefined) {
        this.proStockDetail.forEach(item => {
          if (item.subFeeId == elem.parentFeeId) {
            item.ceditProject = elem.ceditProject;
            item.ceditProjectId = elem.ceditProjectId;
          }
        });
      }
    },
    //比对客户优惠判断是否产生退工费
    contrastCustomerDiscount(elem, index) {
      if (
        this.customerDiscount.customerDiscountPlats != undefined &&
        this.customerDiscount.customerDiscountPlats.length > 0
      ) {
        this.customerDiscount.customerDiscountPlats.forEach(item => {
          if (elem.ceditWayId == item.paypayVal && item.discountSatue == "Y") {
            if (item.billingWay == "j") {
              // elem.ceditPriceJ = item.discountPrice;
              this.bringOutRetirementFee(elem, item.discountPrice, 0, index);
            } else if (item.billingWay == "k") {
              this.bringOutRetirementFee(elem, 0, item.discountPrice, index);
            } else if (item.billingWay == "d") {
              this.bringOutRetirementFee(elem, item.discountPrice, 0, index);
            }
          }
        });
      }
    },
    //工费加收对比客户优惠判断是否产生退工费
    LaborCostContrastDiscount(elem) {
      // console.log("工费加收", elem);
      // console.log("工费加收111", this.customerDiscount);
      if (elem.ceditWayId != 1) {
        return;
      }
      let discountPropIndex = "";
      if (
        this.customerDiscount.discountProp != undefined &&
        this.customerDiscount.discountProp.length > 0
      ) {
        discountPropIndex = this.customerDiscount.discountProp.findIndex(
          item => {
            return (
              item.minPrice < elem.ceditPriceG &&
              elem.ceditPriceG <= item.maxPrice
            );
          }
        );
      }
      // console.log("复核要求", discountPropIndex);//discountPropIndex !== -1
      let parame = "";
      // console.log("优惠范围值key", discountPropIndex);
      if (discountPropIndex !== "" && discountPropIndex !== -1) {
        let preferences = this.customerDiscount.discountProp[discountPropIndex];
        if (preferences != undefined) {
          parame = preferences.discountPrice;
        }
        // console.log("优惠范围", parame);
        // return
        this.LaborCostProduceRetirementFee(elem, 0, parame);
      } else {
        let deletIndex = "";
        this.proStockDetail.forEach((item, index) => {
          if (
            elem.parentFeeId != undefined &&
            elem.parentFeeId == item.subFeeId
          ) {
            deletIndex = index;
          }
        });

        if (deletIndex !== "") {
          this.proStockDetail.splice(deletIndex, 1);
        }
      }
    },
    //工费加收对比客户优惠产生退工费
    LaborCostProduceRetirementFee(elem, ceditPriceJ, ceditPriceG) {
      let restult = false,
        costIndex = "";

      this.proStockDetail.forEach((item, pIndex) => {
        if (
          elem.parentFeeId != undefined &&
          elem.parentFeeId == item.subFeeId
        ) {
          item.ceditPriceG = ceditPriceG;
          restult = true;
        }

        if (item.parentFeeId == elem.parentFeeId) {
          costIndex = pIndex;
        }
      });

      if (restult) {
        return;
      }
      let rowData = {
        ceditWayId: 8,
        ceditWayName: "退工费",
        ceditProjectId: elem.ceditProjectId,
        ceditProject: elem.ceditProject,
        ceditWeight: elem.ceditWeight,
        ceditPriceG,
        ceditAmount: elem.ceditAmount,
        ceditPriceJ,
        ceditMoney: 0,
        ceditNote: "",
        statue: 3,
        feedType: elem.feedType,
        subFeeId: elem.parentFeeId //用于杂费关联自动生成的退工费
      };
      this.computeMoeny(rowData);
      // return
      this.proStockDetail.splice(costIndex + 1, 0, rowData);
      this.proStockDetail.forEach((item, index) => {
        if (item.ceditWayId == 1 && item.feedType == 1) {
          this.LaborCostContrastDiscount(item);
        }
      });
    },
    //杂费比对客户优惠判断产生退工费
    bringOutRetirementFee(elem, ceditPriceJ, ceditPriceG, index) {
      let restult = false;
      this.proStockDetail.forEach(item => {
        if (
          elem.parentFeeId != undefined &&
          elem.parentFeeId == item.subFeeId
        ) {
          restult = true;
        }
      });

      if (restult) {
        return;
      }

      let rowData = {
        ceditWayId: 8,
        ceditWayName: "退工费",
        ceditProjectId: "",
        ceditProject: "",
        ceditWeight: 0,
        ceditPriceG,
        ceditAmount: 0,
        ceditPriceJ,
        ceditMoney: 0,
        ceditNote: "",
        feedType: "",
        statue: 4,
        billingWay: elem.billingWay,
        subFeeId: elem.parentFeeId //用于杂费关联自动生成的退工费
      };
      this.computeMoeny(rowData);
      this.proStockDetail.splice(index + 1, 0, rowData);
    },
    //备注事件
    noteFun(elem) {
      console.log(elem);
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

