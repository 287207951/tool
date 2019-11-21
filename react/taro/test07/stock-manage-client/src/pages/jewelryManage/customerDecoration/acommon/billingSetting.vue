<template>
  <div class="dialogComp" ref="AddProductsOne">
    <el-dialog
      title="组合打单设置"
      :visible.sync="dialogVisible"
      width="840px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div class="dialogContent">
        <div class="hr"></div>
        <div class="shopWrap">
          <div class="fontBold">门店列表</div>
          <el-checkbox-group v-model="selectShopData" @change="shopFun">
            <el-checkbox
              v-for="item in shopData"
              :label="item.packId"
              :key="item.packId"
              :disabled="!(item.status) || item.disabled"
            >{{item.shopName}}</el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="composeWrap">
          <div class="fontBold">门店组合列表</div>
          <div class="compose">
            <div class="itemWrap" v-for="(item,index) in combinationShopData" :key="index">
              <span>{{item.shopName}}</span>
              <i class="el-icon-circle-close" @click="deleteFun(index)"></i>
            </div>

            <!-- <div class="itemWrap">
              <span>B门店+C门店+D门店</span>
              <i class="el-icon-circle-close"></i>
            </div>-->
            <div class="redColor" @click="addCombinationShop">添加门店组合</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="submitFun">确定提交</el-button>
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
    shopData: {
      //门店数据
      type: Array,
      required: true
    }
  },
  data() {
    return {
      combinationShopData: [], //组合门店数据
      selectShopData: [], //选中的店铺
      dialogVisible: false
    };
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {
    dialogType: function(newVal, oldVal) {
      this.dialogVisible = true;
    }
  },
  methods: {
    closeFun() {
      this.selectShopData = [];
      this.combinationShopData = [];
      this.shopData.forEach(item => {
        item.disabled = false;
      });
    },
    //选择门店
    shopFun() {
      console.log("选择店铺", this.selectShopData);
    },
    //添加组合门店
    addCombinationShop() {
      if (this.selectShopData.length == 0) {
        this.$message.error("请选择门店！");
        return;
      }
      let arrData = [];
      this.selectShopData.forEach(item => {
        this.shopData.forEach(it => {
          if (item == it.packId) {
            it.disabled = true;
            arrData.push(it);
          }
        });
      });

      let status = false,
        shopName = [],
        packId = [];

      arrData.forEach(item => {
        shopName.push(item.shopName);
        packId.push(item.packId);
        if (item.status) {
          status = true;
        }
      });

      this.combinationShopData.push({
        shopName: shopName.join("+"),
        packId: packId.join(),
        status
      });

      this.selectShopData = [];
    },
    //删除组合
    deleteFun(index) {
      this.shopData.forEach(they => {
        they.disabled = false;
      });
      this.combinationShopData.splice(index, 1);
      //设置已选中店铺为禁用状态
      this.combinationShopData.forEach(item => {
        item.packId.split(",").forEach(it => {
          this.shopData.forEach(they => {
            if (it == they.packId) {
              they.disabled = true;
            }
          });
        });
      });
    },
    //确定提交
    submitFun() {
      if (this.combinationShopData.length == 0) {
        this.$message.error("请选择需要组合的门店！");
        return;
      }
      let newArr = [...this.combinationShopData];
      this.shopData.forEach(item => {
        if (!item.disabled) {
          newArr.push(item);
        }
      });
      this.$emit("confirmCombinationFun", newArr);
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.grayColor {
  color: #8A8E99;
}

.fontBold {
  font-weight: bold;
}

.redColor {
  color: red;
  cursor: pointer;
}

.dialogComp {
  font-size: 14px;
  font-weight: 400;
  color: #222426;

  .dialogContent {
    position: relative;

    .hr {
      border-top: 1px solid #d9d9d9;
      position: absolute;
      left: 0px;
      top: -34px;
      width: 100%;
    }

    .shopWrap {
      margin-bottom: 30px;
    }

    .composeWrap {
      .compose {
        display: flex;

        i {
          color: red;
          cursor: pointer;
        }

        .itemWrap {
          margin-right: 36px;
        }
      }
    }
  }
}
</style>

<style>
.dialogComp .dialogContent .el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
</style>



