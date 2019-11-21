<template>
  <div>
    <section>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
        <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
        <el-breadcrumb-item>出工厂饰详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="hr" />
      <!-- 头部 -->
      <el-table :data="headTableData" style="width: 100%">
        <el-table-column prop="bizNo" label="出库单号"></el-table-column>
        <!-- <el-table-column prop="invoiceType" label="订单类型">
          <template slot-scope="scope">{{scope.row.invoiceType | invoiceTypeFun}}</template>
        </el-table-column>
        <el-table-column prop="lineId" label="源单号"></el-table-column>-->
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)"></el-table-column>
        <el-table-column prop="weight" label="毛重(g)"></el-table-column>
        <el-table-column prop label="制单时间">
          <template slot-scope="scope">{{$api.dateGetDayTime(scope.row.createDate)}}</template>
        </el-table-column>
        <el-table-column prop="creator" label="制单人"></el-table-column>
        <el-table-column prop label="单据状态">
          <template slot-scope="scope">
            <span class="blackColor" v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="bigLine"></div>
    </section>

    <!-- 详细信息 -->
    <section class="infoWrap">
      <div style="display:flex;margin-bottom: 36px;">
        <JeweBalanceAccount :customerId="customerId"></JeweBalanceAccount>

        <div class="btn" style="flex:1">
          <div class="btnItem" v-if="allData.bizInvoice.invoiceStatu != 'EXREPO'">
            <el-button size="mini" type="primary" plain @click="returnCabinetFun">返柜</el-button>
            <el-button size="mini" type="primary" plain @click="temporaryFun">暂存</el-button>
            <el-button size="mini" type="primary" @click="confirmFun">确认出库</el-button>
          </div>
        </div>
      </div>

      <!-- 单选组件 -->
      <RadioComponents
        :shopData="shopData"
        :conditionData="conditionData"
        :shopShow="shopShow"
        @wayFun="wayFun"
        @shopFun="shopFun"
        @conditionFun="conditionFun"
      ></RadioComponents>

      <!-- 打包详情 -->
      <div class="packageWrap">
        <div style="margin-bottom: 7px;">
          <span class="detailName">打包详情</span>
          <el-checkbox
            v-if="allData.bizInvoice.invoiceStatu != 'EXREPO'"
            v-model="allchecked"
            :disabled="conditionChildPacksData.length == 0"
            @change="allSelectFun"
          >全选</el-checkbox>
        </div>
        <PackageBars
          v-if="allData.bizInvoice.invoiceStatu != 'EXREPO'"
          ref="packageBars"
          :bizPack="conditionChildPacksData"
          @selectPackageFun="selectPackageFun"
          @cancelStorageFun="cancelStorageFun"
          @goPackDetail="goPackDetail"
        ></PackageBars>
        <PackageBars
          v-if="allData.bizInvoice.invoiceStatu == 'EXREPO'"
          :checkboxType="false"
          :bizPack="conditionChildPacksData"
          @goPackDetail="goPackDetail"
        ></PackageBars>
      </div>

      <!-- 出库详情弹框 -->
      <CreatedOutOfStockDetail
        :dialogType="dialogType"
        :basicData="allData.bizInvoice"
        :shopName="shopName"
        :selectPackageData="selectPackageData"
        @printFun="printFun"
      ></CreatedOutOfStockDetail>

      <!-- 组合打单设置 -->
      <BillingSetting
        :dialogType="billDialogType"
        :shopData="originalShopData"
        @confirmCombinationFun="confirmCombinationFun"
      ></BillingSetting>

      <!-- 包详情 -->
      <PackageDetail
        :dialogType="packageDetailType"
        :packageDetailsData="packageDetailsData"
        :packageIndex="packageDetailsIndex"
      ></PackageDetail>

      <!-- 出客户饰详情打印 -->
      <div v-show="false">
        <PrintTPOutCustomer :billData="printData" ref="myComp"></PrintTPOutCustomer>
      </div>
    </section>
  </div>
</template>

<script>
import {
  RadioComponents,
  PackageBars,
  CreatedOutOfStockDetail,
  BillingSetting,
  PackageDetail
} from "./acommon/index";

export default {
  components: {
    RadioComponents,
    PackageBars,
    CreatedOutOfStockDetail,
    BillingSetting,
    PackageDetail
  },
  data() {
    return {
      printData: {}, //打印数据
      shopName: "", //选择的店名(合并打单为所有门店)
      conditionChildPacksData: [], //根据成色筛选的子包
      shopChildPacksData: [], //根据店铺筛选的子包
      shopShow: false, //门店显示状态
      conditionData: [], //成色数据
      shopData: [], //门店数据（组件展示）
      originalShopData: [], //原始的店铺数据(组合打包里面的门店)
      packageDetailsIndex: "", //包下标
      packageDetailsData: {}, //包详情数据
      selectPackageData: [], //选中的包数据
      allchecked: false, //包全选
      headTableData: [], //头部表格数据
      allData: {
        //订单详情数据
        bizPack: [],
        bizInvoice: {
          invoiceStatu: ""
        }
      },
      packageDetailType: "", //包详情弹框状态
      billDialogType: "", //组合打单弹框显示状态
      dialogType: "", //出库详情弹框显示状态
      mock: "",
      mockdata: [{ a: 1 }],
      //
      invoiceStatu: "", //当前操作状态
      customerId: ``,
      bizNo: "" //出库单号
    };
  },
  created() {
    // 获取页面数据
    this.bizNo = this.$route.query.bizNo;
    this.displayAllData();
  },

  mounted() {},
  methods: {
    //  初始化数据
    displayAllData() {
      let self = this;
      this.allchecked = false;
      let params = {
        bizNo: this.bizNo
      };
      self.headTableData = [];
      self.selectPackageData = [];
      self.allchecked = false;
      this.$api.formdataPostFun(
        this.$portMain + "/outStockBills/findData",
        params,
        res => {
          self.allData = res.data;
          self.headTableData.push(self.allData.bizInvoice);
          self.customerId = self.allData.bizInvoice.recipientId;
          self.allData.bizPack.forEach(item => {
            item.checked = false;
          });
          self.assemblyPackageData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //组件包数据
    assemblyPackageData() {
      let self = this;
      const { bizPack, bizPackDetails, bizPro } = this.allData;
      if (bizPack.length == 0) {
        return;
      }
      //将产品放到子包
      bizPack.forEach(item => {
        if (item.shopPack == 2) {
          item.packDetails = [];
          item.packSkuNumbers = [];
        }
        bizPackDetails.forEach(it => {
          if (item.shopPack == 2 && item.packId == it.packId) {
            item.packSkuNumbers.push(it);
          }
        });
      });

      bizPack.forEach(item => {
        if (item.packSkuNumbers != undefined) {
          item.packSkuNumbers.forEach(it => {
            bizPro.forEach(one => {
              if (it.skuNumber == one.skuId) {
                item.packDetails.push(Object.assign({}, one, it));
              }
            });
          });
        }
      });

      this.assembleConditionData(this.allData.bizPack);
    },
    //组装门店数据
    assembleShopData() {
      if (
        this.allData.parentPack == undefined ||
        this.allData.parentPack.length == 0
      ) {
        return;
      }
      let shopData = [];
      this.allData.parentPack.forEach(item => {
        let status = false;
        item.childPack.forEach(it => {
          if (it.status == "STOCKUP") {
            status = true;
          }
        });

        shopData.push({
          shopName: item.shopName,
          packId: item.packId,
          disabled: false,
          status
        });
      });
      this.shopData = shopData;
      this.originalShopData = JSON.parse(JSON.stringify(shopData));
      // console.log("门店数据", this.shopData);
    },
    //组装成色数据
    assembleConditionData(childPack) {
      let conditionData = [];
      childPack.forEach(item => {
        let status = false;
        conditionData.push({
          conditi: item.conditi,
          status: item.status == "STOCKUP" ? true : false
        });
      });

      //去重
      let obj = {};
      conditionData = conditionData.reduce(function(item, next) {
        obj[next.conditi] ? "" : (obj[next.conditi] = true && item.push(next));
        return item;
      }, []);
      this.conditionData = conditionData;
      //默认筛选第一个成色
      this.conditionFun(conditionData[0].conditi);
    },

    //方式
    wayFun(val) {
      // console.log("方式", val);
      this.shopData = JSON.parse(JSON.stringify(this.originalShopData));
      if (val == 1) {
        this.shopShow = true;
        this.shopFun(this.shopData[0].packId);
      } else if (val == 2) {
        this.shopShow = false;
        this.shopName = "所有门店";
        this.assembleMergeFun();
      } else if (val == 3) {
        this.billDialogType = new Date().getTime();
        this.shopShow = true;
        this.shopFun(this.shopData[0].packId);
      }

      // this.shopFun(this.shopData[0].packId);
    },
    //组装合并打包数据(不需要店铺)
    assembleMergeFun() {
      // conditionChildPacksData: [], //根据成色筛选的子包
      // shopChildPacksData: [], //根据店铺筛选的子包
      // conditionData: [], //成色数据
      //assembleConditionData
      // this.shopChildPacksData = this.allData.parentPack;
      let arr = [];
      this.allData.parentPack.forEach(item => {
        arr = [...arr, ...item.childPack];
      });
      this.shopChildPacksData = arr;
      this.assembleConditionData(this.shopChildPacksData);
    },
    //选择门店
    shopFun(val) {
      // console.log("数据", this.allData.parentPack);shopName
      let childPack = [];
      val.split(",").forEach(item => {
        this.allData.parentPack.forEach(it => {
          if (item == it.packId) {
            childPack = [...childPack, ...it.childPack];
          }
        });
      });
      this.shopData.forEach(item => {
        if (item.packId == val) {
          this.shopName = item.shopName;
        }
      });
      this.shopChildPacksData = childPack;
      // console.log("店铺选择子包", childPack);
      this.assembleConditionData(childPack);
    },
    //选择成色
    conditionFun(val) {
      // console.log("成色", val);
      // console.log("子包", this.shopChildPacksData);
      let childPacksData = [];
      this.allData.bizPack.forEach(item => {
        item.checked = false;
        if (item.conditi == val) {
          childPacksData.push(item);
        }
      });
      this.conditionChildPacksData = childPacksData;
      this.allchecked = false;
      this.selectPackageData = [];
    },
    //暂存
    temporaryFun() {
      let self = this;
      if (this.selectPackageData.length == 0) {
        this.$message.error("请选择需要暂存的包！");
        return;
      }
      this.$confirm("确定是要将这些包暂存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let packList = [];
          this.selectPackageData.forEach(item => {
            packList.push(item.packId);
          });

          let params = {
            bizNo: this.bizNo,
            packList: packList.join()
          };

          this.$api.formdataPostFun(
            this.$portMain + "/outStockBills/updateTS",
            params,
            res => {
              self.$message.success(res.msg);
              self.displayAllData();
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        })
        .catch(() => {});
    },
    //取消暂存
    cancelStorageFun(val) {
      let self = this;
      this.$confirm("确定是要将此包取消暂存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            bizNo: this.bizNo,
            packList: val
          };
          this.$api.formdataPostFun(
            this.$portMain + "/outStockBills/cancelTS",
            params,
            res => {
              self.$message.success(res.msg);
              self.displayAllData();
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        })
        .catch(() => {});
    },
    //确认出库
    confirmFun() {
      if (this.selectPackageData.length == 0) {
        this.$message.error("请选择需要出库的包！");
        return;
      }
      this.$confirm("确定是要将此单确认出库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogType = new Date().getTime();
        })
        .catch(() => {});
    },
    //返柜
    returnCabinetFun() {
      let self = this;
      // this.packageDetailType = new Date().getTime();
      if (this.selectPackageData.length == 0) {
        this.$message.error("请选择需要返柜的包！");
        return;
      }
      this.$confirm("确定是要将这些包返柜, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let packList = [];
          this.selectPackageData.forEach(item => {
            packList.push(item.packId);
          });

          let params = {
            bizNo: this.bizNo,
            packList: packList.join()
          };

          this.$api.formdataPostFun(
            this.$portMain + "/outStockBills/returnCabinet",
            params,
            res => {
              self.$message.success(res.msg);
              self.displayAllData();
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        })
        .catch(() => {});
    },
    //勾选包
    selectPackageFun() {
      this.selectPackageData = []; //conditionChildPacksData
      let contrastData = [];
      this.conditionChildPacksData.forEach(item => {
        if (item.statusValue == "待出库" && item.checked) {
          this.selectPackageData.push(item);
        }
        if (item.statusValue == "待出库") {
          contrastData.push(item);
        }
      });
      if (this.selectPackageData.length == contrastData.length) {
        this.allchecked = true;
      } else {
        this.allchecked = false;
      }
    },
    //全选事件
    allSelectFun() {
      this.selectPackageData = [];
      if (this.allchecked) {
        this.conditionChildPacksData.forEach(item => {
          if (item.statusValue == "待出库") {
            item.checked = true;
            this.selectPackageData.push(item);
          }
        });
      } else {
        this.conditionChildPacksData.forEach(item => {
          if (item.statusValue == "待出库") {
            item.checked = false;
          }
        });
      }
      this.$refs.packageBars.allSelectFun();
    },
    //查看包详情
    goPackDetail(elem, index) {
      this.packageDetailType = new Date().getTime();
      this.packageDetailsData = elem;
      this.packageDetailsIndex = index;
    },
    //确认提交组合
    confirmCombinationFun(arr) {
      this.shopData = arr;
      this.shopFun(this.shopData[0].packId);
    },
    printFun(printData) {
      this.printData = printData;
      this.printData.financialCode = this.allData.financialCode;
      this.printData.area = this.allData.area;
      this.printData.creator = this.allData.bizInvoice.creator;
      this.$refs.myComp.compPrintFun();
    }
  },
  filters: {
    invoiceTypeFun(val) {
      switch (val) {
        case "STOCK_OUT":
          return `出库单`;
        case "STOCK_IN":
          return `入库单`;
        case "TRANSFER_IN":
          return `调拨入库`;
        case "TRANSFER_OUT":
          return `调拨出库`;
        default:
          return "-";
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.btn {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.btnItem {
  margin-left: 24px;
}

.infoWrap {
  padding: 20px;
}

.packageWrap {
  margin-top: 36px;

  .detailName {
    font-size: 16px;
    font-weight: bold;
    color: #232426;
    margin-right: 25px;
  }
}
</style>
