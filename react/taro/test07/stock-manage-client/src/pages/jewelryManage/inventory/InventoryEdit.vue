<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>盘点-新增盘点</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />

    <div class="titleWrap">
      <div class="title">新建盘点</div>
      <div class="btnTop">
        <el-button type="primary" plain size="small" @click="cancelFun" class="right20">取消</el-button>
        <el-button type="primary" @click="saveData" :loading="loadingSave" size="small">提交</el-button>
      </div>
    </div>

    <!-- 盘点头部 -->
    <el-row style="margin-top: 46px;">
      <el-col :span="8">
        <span class="smallTitle">盘点仓库</span>
        <el-select
          v-model="params.wareId"
          placeholder="请选择"
          size="small"
          class="width240"
          @change="getWare"
        >
          <el-option
            v-for="item in repoListList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="txtRed left10 txt16">*</span>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">盘点库柜</span>
        <el-select
          v-model="params.sarkId"
          @change="getSark"
          placeholder="请选择"
          size="small"
          class="width240"
        >
          <el-option
            v-for="item in sarkList"
            :key="item.id"
            :label="item.sarkName"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="txtRed left10 txt16">*</span>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">备注</span>
        <el-input
          v-model="params.remark"
          @input="emitData"
          placeholder="请输入备注"
          size="small"
          class="width240"
        ></el-input>
      </el-col>
    </el-row>

    <div class="productWrap">
      <div class="skuTitel">差异列表</div>
      <div class="flexB">
        <div></div>
        <div>
          <el-button type="primary" size="small" :loading="loadingAdj" @click="adjustment">调差</el-button>
          <el-button type="primary" size="small" plain @click="addProductDialog">开始盘点</el-button>
        </div>
      </div>

      <div style="height: 20px"></div>
      <!-- 添加产品 -->
      <AddProduct :dialogType="dialogType" :afferentData="params" @confirmProdcut="confirmProdcut"></AddProduct>

      <!-- 未调差 -->
      <div v-if="productItemOneType">
        <ProductItem v-for="(item, index) in confirmProdcutData" :key="index" :productData="item"></ProductItem>
      </div>

      <!-- 盈亏 -->
      <!-- <div v-if="adjType">
        <ProfitLoss></ProfitLoss>
      </div>-->
      <!-- 盈亏 -->
    </div>
  </div>
</template>
<script>
import { AddProducts, ProductItem, ProfitLoss } from "./acommon/index";

export default {
  components: {
    AddProduct: AddProducts,
    ProductItem,
    ProfitLoss
  },
  data() {
    return {
      dialogType: false, // 弹窗
      productItemOneType: false,
      adjType: false,
      confirmProdcutData: [],
      repoListList: [], // 仓库列表
      sarkList: [], // 货柜列表
      loadingSave: false,
      loadingAdj: false,
      params: {
        wareId: ``, // 盘点仓库id
        sarkId: ``, // 盘点货柜id
        remark: ``,
        inventoryResult: ``, // 1无差异2有差异：有差异情况下proList必传
        adjustmentStatus: ``, // 1已调差：已情况下proList必传，2未调差
        proList: [
          {
            skuId: ``, // sku编号
            amount: ``, // 盘点数量
            suttle: ``, // 盘点净重
            weight: `` // 盘点毛重
          }
        ]
      },
      isCheckStatus: false
    };
  },

  created() {
    this.created_fun();
  },

  methods: {
    created_fun() {
      this.confRepoList();
      this.sarkLoad();
      //   this.getBasicData();
    },

    valiData(options) {
      const { proList } = options;
      const { isCheckStatus } = this;
      //   if (proList.length === 0) {
      //     this.$message.error("请选择产品");
      //     return false;
      //   }
      if (!isCheckStatus) {
        this.$message.error("盘点之后才能保存");
        return false;
      }
      return true;
    },

    // 调差
    adjustment() {
      let params = this.getParamsData();
      params.status = 1;
      if (!this.valiData(params)) {
        return;
      }
      this.loadingAdj = true;
      this.$axios
        .post(this.$portMain + "/checkStock/add", params)
        .then(res => {
          if (res.data.code == 200) {
            this.$router.push({
              path: "/index/inventoryDetail",
              query: {
                id: res.data.data
              }
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(res => {
          this.loadingAdj = false;
        });
    },

    // 执行保存
    sendSava() {
      let params = this.getParamsData();
      params.status = 3;
      if (!this.valiData(params)) {
        return;
      }
      this.loadingSave = true;
      this.$axios
        .post(this.$portMain + "/checkStock/add", params)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success("操作成功");
            this.$router.go(-1);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(res => {
          this.loadingSave = false;
        });
    },

    // 保存
    saveData() {
      this.$api.refClick(this).then(res => {
        this.sendSava();
      });
    },

    valiAddPro() {
      const { wareId, sarkId } = this.params;
      if (!wareId) {
        this.$message.error("请选择盘点仓库");
        return false;
      }
      if (!sarkId) {
        this.$message.error("请选择盘点货柜");
        return false;
      }
      return true;
    },

    //添加产品(弹框)
    addProductDialog() {
      if (!this.valiAddPro()) {
        return;
      }
      this.dialogType = new Date().getTime();
    },

    //删除产品
    deleteProduct(val) {
      let deleteIndex;
      this.confirmProdcutData.forEach((item, index) => {
        if (item.proNumber == val) {
          deleteIndex = index;
        }
      });
      this.confirmProdcutData.splice(deleteIndex, 1);
      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
      });
    },

    // 查看当前用户部门的仓库
    confRepoList() {
      const self = this;
      let params = {
        PRS: {
          type: `NORMAL`
        }
      };
      this.$axios
        .get(this.$portMain + "/bizWare/select", params)
        .then(function(res) {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              item.name = item.wareName;
            });
            self.repoListList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 确认盘点
    calcCheckStock() {
      const { wareId } = this.params;
      let { confirmProdcutData } = this;
      let proList = [];
      proList = confirmProdcutData.map(item => {
        return {
          skuId: item.proNumber,
          amount: item.amounts,
          suttle: item.inventorySuttle,
          weight: item.inventoryWeight
        };
      });
      let params = {
        wareId,
        proList
      };
      this.$axios
        .post(this.$portMain + "/checkStock/calc", params)
        .then(res => {
          const { code, data } = res.data;
          if (code == 200) {
            confirmProdcutData.forEach(item => {
              data.forEach(it => {
                if (item.proNumber === it.skuId) {
                  item.cksAmount = item.amounts;
                  item.cksSuttle = item.inventorySuttle;
                  item.amount = it.amount;
                  item.suttle = it.suttle;
                }
              });
            });
            confirmProdcutData = confirmProdcutData.filter(
              item => item.cksSuttle
            );
            if (data.length === 0) {
              confirmProdcutData = [];
            }
            this.confirmProdcutData = confirmProdcutData;
            this.productItemOneType = false;
            this.$nextTick(() => {
              this.productItemOneType = true;
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(res => {
          this.isCheckStatus = true;
        });
    },

    getWare(e) {
      this.params.wareName = this.getWareName(e);
      this.params.sarkId = ``;
      this.sarkLoad();
      //   this.changeCode();
    },

    getSark(e) {
      this.params.sarkName = this.getSarkName(e);
    },

    getWareName(e) {
      let name = ``;
      this.repoListList.forEach(item => {
        if (item.id === e) {
          name = item.name;
        }
      });
      return name;
    },

    getSarkName(e) {
      let name = ``;
      this.sarkList.forEach(item => {
        if (item.id === e) {
          name = item.sarkName;
        }
      });
      return name;
    },

    //货柜列表搜索
    sarkLoad() {
      const { wareId } = this.params;
      let params = {
        wareId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/bizSark/select",
        params,
        res => {
          this.sarkList = res.data;
        }
      );
    },

    //取消按据
    cancelFun() {
      if (this.confirmProdcutData.length !== 0) {
        this.$api.refClick(this).then(res => {
          this.$router.go(-1);
        });
      } else {
        this.$router.go(-1);
      }
    },

    // 获取数据todo
    getParamsData() {
      const {
        wareId,
        wareName,
        sarkId = ``,
        sarkName = ``,
        remark
      } = this.params;
      let { confirmProdcutData } = this;
      let proList = [];
      proList = confirmProdcutData.map(item => {
        return {
          skuId: item.proNumber,
          amount: item.amount,
          suttle: item.suttle,
          weight: item.suttle,
          cksAmount: item.amounts,
          cksSuttle: item.inventorySuttle
        };
      });
      let params = {
        wareId,
        wareName,
        sarkId,
        sarkName,
        proList,
        status: ``,
        remark
      };
      return params;
    },

    //确认选中
    confirmProdcut(elem) {
      this.confirmProdcutData = elem;
      this.calcCheckStock();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.outOfStock {
  .flexB {
    display: flex;
    justify-content: space-between;
  }

  .smallTitle {
    font-size: 12px;
    font-weight: 400;
    color: #8A8E99;
  }

  .title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #232426;
  }

  .width240 {
    width: 240px;
  }

  .width100 {
    width: 100px;
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

  .packDataWrap {
    margin-top: 29px;

    .packTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 19px;
    }
  }
}

.titleWrap {
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #232426;
  }

  .btnTop {
    display: flex;

    > div {
      margin-right: 10px;
    }
  }
}
</style>
