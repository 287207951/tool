<template>
  <div>
    <section>
      <!-- 头部 -->
      <el-table :data="headTableData" style="width: 100%">
        <el-table-column prop="bizNo" label="出库单号"></el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)"></el-table-column>
        <el-table-column prop="weight" label="毛重(g)"></el-table-column>
        <el-table-column prop="creator" label="操作人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="invoiceStatuValue" label="订单状态">
          <template slot-scope="scope">
            <span class="blackColor" v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="noteWrap">
        <span>出库备注：</span>
        {{invoiceMark}}
      </div>
      <div class="noteWrap" v-if="remarkReason">
        <span>驳回原因：</span>
        {{remarkReason}}
      </div>
      <div class="bigLine"></div>
    </section>

    <!-- 详细信息 -->
    <section class="infoWrap">
      <div style="display:flex">
        <JeweBalanceAccount :customerId="customerId"></JeweBalanceAccount>

        <div class="btn" style="flex:1">
          <ButtonList :bizAuxiliary="btnList" @operationFun="operationFun" @submitData="submitData"></ButtonList>
          <!-- <div class="btnItem" v-if="invoiceStatu == 'DRAFT'">
            <el-button size="mini" type="primary" @click="editFun">编辑</el-button>
            <el-button size="mini" type="warning" @click="toVoidFun">作废</el-button>
          </div>
          <div class="btnItem" v-if="invoiceStatu == 'WAITCONFIRM'">
            <el-button size="mini" type="primary" plain @click="toExamineFun('reject')">驳回审核</el-button>
            <el-button size="mini" type="primary" @click="toExamineFun('confirm')">审核通过</el-button>
          </div>-->
        </div>
      </div>

      <div class="flexB" v-if="invoiceStatu != 'DRAFT'">
        <div class="steps">
          <Steps :data="stepData"></Steps>
        </div>
        <div class="empty"></div>
      </div>

      <!-- 打包数据 -->
      <div class="packDataWrap" v-if="allData.bizPack != undefined && allData.bizPack.length > 0">
        <div class="packTitle">
          <div class="title">打包信息</div>
        </div>

        <!-- 包中包 -->
        <ParentPackageBar
          v-if="allData.parentPack != undefined"
          :parentPack="allData.parentPack"
          :companyName="allData.bizInvoice"
        ></ParentPackageBar>

        <!-- 单级包 -->
        <PackingBar v-else :baoData="allData.bizPack" @goPackDetail="goPackDetail"></PackingBar>

        <!-- 包详情数据 -->
        <PackProductDetails
          :dialogType="dialogType"
          :packBarData="selecPackBarData"
          :companyName="allData.bizInvoice"
        ></PackProductDetails>
      </div>

      <!-- 未打包产品（展示） -->
      <div class="productWrap" v-else>
        <!-- 产品 -->
        <ProductItemTwo
          v-for="(item,index) in allData.bizPro"
          :key="index"
          :productData="item"
          @printFun="printFun"
          :companyName="allData.bizInvoice"
        ></ProductItemTwo>
        <!--  -->
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnList: {}, //按钮列表
      invoiceStatu: "", //当前操作状态
      customerId: ``,
      rejectReson: "", //驳回原因
      invoiceMark: "", //出库备注
      remarkReason: "", //驳回原因
      dialogType: "",
      selecPackBarData: {}, //选中包数据
      bizNo: "", //出库单号
      AddProductType: "",
      allData: {
        bizPro: []
      },
      headTableData: [], //头部表格
      stepData: [], // 流程图数据

      //  按钮列表状态
      auditBtnInfo: [
        {
          txt: `审核通过`,
          func: `pass`,
          status: "WAITCONFIRM",
          theme: `primary`
        },
        {
          txt: `作废单据`,
          func: `invalidDoc`,
          status: "WAITCONFIRM",
          theme: `warning`
        },
        {
          txt: `打印`,
          func: `print`,
          status: false,
          theme: `primary`
        }
      ],

      // 入饰列表数据
      proList: [],
      tableData: []
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
    initData() {},
    displayAllData() {
      let self = this;
      let params = {
        PRS: {
          orderNo: this.bizNo
        }
      };
      this.$axios
        .get(this.$portMain + "/stockOutManager/selectOutOrderDetail", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.headTableData.push(self.allData.bizInvoice);
            self.invoiceMark = self.allData.bizInvoice.invoiceMark;
            self.remarkReason = self.allData.bizInvoice.remarkReason;
            self.headTableData.forEach(item => {
              item.createDate = self.$api.dateGetDayTime(item.createDate);
            });
            self.customerId = self.allData.bizInvoice.recipientId;
            self.invoiceStatu = self.allData.bizInvoice.invoiceStatu;
            // self.stepData = self.allData.bizInvoice.managePersons;
            self.getProcessData(
              self.allData.bizInvoice.bizNo,
              self.allData.bizInvoice.bizType
            );
            self.btnList = self.allData.bizInvoice.bizAuxiliary
              ? self.allData.bizInvoice.bizAuxiliary
              : {};
            self.assemblyPackageData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    printFun(elem) {
      this.printData = elem;
      this.$refs.printTPTwo.compPrintFun();
    },
    //获取流程数据
    getProcessData(bizNo, bizType) {
      let self = this;
      let params = {
        bizNo,
        bizType
      };
      this.$api.formdataPostFun(
        this.$portMain + "/process/selectProcessManageInfo",
        params,
        res => {
          self.stepData = res.data;
        },
        err => {
          self.$message.error(err.msg);
          self.stepData = [];
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
      //没有店铺
      bizPack.forEach(item => {
        item.packDetails = [];
        item.packSkuNumbers = [];
        bizPackDetails.forEach(it => {
          if (item.packId == it.packId) {
            item.packSkuNumbers.push(it);
          }
        });
      });

      bizPack.forEach(item => {
        item.packSkuNumbers.forEach(it => {
          bizPro.forEach(one => {
            if (it.skuNumber == one.skuId) {
              item.packDetails.push(Object.assign({}, one, it));
            }
          });
        });
      });

      //有店铺
      let parentPack = [];
      bizPack.forEach(item => {
        //   childPack = [];
        if (item.shopPack == 1) {
          //1、有店铺 2、没店铺
          item.childPack = [];
          parentPack.push(item);
        }
      });

      if (parentPack.length > 0) {
        parentPack.forEach(one => {
          bizPack.forEach(two => {
            if (one.packId == two.supPackId) {
              one.childPack.push(two);
            }
          });
        });
        this.allData.parentPack = parentPack;
      }
    },
    // 审核通过
    pass() {},

    // 作废单据
    invalidDoc() {},

    // 打印
    print() {},
    addProductFun() {
      this.AddProductType = new Date().getTime();
    },
    //查看包详情
    goPackDetail(elem) {
      this.dialogType = new Date().getTime();
      this.selecPackBarData = elem;
    },
    //操作事件
    operationFun(elem) {
      //编辑
      if (elem.value == "WRITE") {
        this.editFun();
      }
      //打印
      if (elem.value == "PRINT") {
      }
    },
    //编辑
    editFun() {
      this.$router.push({
        path: "editOutOfStock",
        query: { bizNo: this.bizNo }
      });
    },

    //作废
    toVoidFun() {
      let self = this;
      let params = {
        PRS: {
          bizNo: this.bizNo
        }
      };
      this.$axios
        .get(this.$portMain + "/stockOutManager/updateInvoiceStatue", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.$router.push("outOfStockRedoList");
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //审核通过
    toExamineFun(opreateType) {
      // if (!this.allData.bizInvoice.currentStatue.prioryInfos[0].actionOprea) {
      //   this.$message.warning("抱歉，您不在审核的流程中！");
      //   return;
      // }
      let self = this;
      if (opreateType == "REJECT") {
        this.$prompt("请输入驳回原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "textarea"
        }).then(({ value }) => {
          this.rejectReson = value;
          self.toExamineSubmitFun(opreateType);
        });
      } else {
        this.rejectReson = "";
        this.$confirm("是否确认操作！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            self.toExamineSubmitFun(opreateType);
          })
          .catch(() => {});
      }
    },

    //审核提交数据
    toExamineSubmitFun(opreateType) {
      let self = this;
      let params = {
        bizNo: this.bizNo,
        rejectReson: this.rejectReson,
        opreateType
      };
      params = this.$api.deleteEmptykey(params);
      this.$api.formdataPostFun(
        this.$portMain + "/stockOutManager/apponveInvoiceStatue",
        params,
        res => {
          self.$message.success(res.msg);
          this.$router.push("outOfStockRedoList");
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //按钮提交
    submitData(e) {
      //作废
      let self = this;
      if (e.actionSign == "DISCARD") {
        this.$confirm("你确定要将此单据作废么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            self.toVoidFun();
          })
          .catch(() => {});
        return;
      }

      if (e.actionSign == "REJECT") {
        this.toExamineFun(e.actionSign);
        return;
      }

      this.toExamineFun(e.actionSign);

      // if (e.actionSign == "CONFIRMED") {
      //   this.toExamineFun("confirm");
      // } else {
      //   this.toExamineFun(e.actionSign);
      // }
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrap {
  padding: 20px;
}

.blackColor {
  color: #2e2f33;
}

.flexB {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.steps {
  flex: 2;
}

.empty {
  flex: 1;
}

.btn {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.btnItem {
  margin-left: 24px;
}

.listTit {
  font-weight: blod;
  font-size: 16px;
  margin-top: 50px;
  margin-bottom: 16px;
}

.infoWrap {
  padding: 20px;
}

.noteWrap {
  font-size: 16px;
  font-weight: 400;
  color: #232426;
  margin: 22px 0;

  span {
    color: #8A9199;
  }
}

.refreshHead {
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;

  span {
    color: red;
  }

  .itemWrap {
    margin: 0 33px;
  }
}

.packDataWrap {
  margin-top: 29px;

  .packTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 19px;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #232426;
    }
  }
}

.productWrap {
  margin-top: 29px;
  margin-bottom: 20px;

  .skuTitel {
    font-size: 16px;
    font-weight: bold;
    color: #232426;
    margin-bottom: 16px;
  }
}
</style>
