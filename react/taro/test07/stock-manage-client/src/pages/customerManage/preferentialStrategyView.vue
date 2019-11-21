<template>
  <div class="conBigDiv" ref="basicLaborCost">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增优惠策略列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />

      <!-- 优惠详情设置 -->
      <div class="detailWrap">
        <div class="titleWrap">
          <div class="title">优惠详情设置</div>
          <div>
            <el-button size="small" @click="cancelFun">取消</el-button>
            <el-button type="primary" size="small" @click="subFun">确认提交</el-button>
          </div>
        </div>

        <div class="contain">
          <div>
            <span
              class="leftTitle"
              style="width:108px;display: inline-block;text-align: right;"
            >客户名称</span>
            <!-- <el-input v-model="mock" placeholder="请输入内容" size="small" class="width240"></el-input> -->
            <el-select
              v-model="creatData.customerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户"
              @focus="remoteMethod('')"
              :remote-method="remoteMethod"
              @keydown.native="customeSelect($event)"
              @change="changCustomer"
              :loading="loading"
              size="small"
              class="width240"
            >
              <el-option
                v-for="item in customerData"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
            <span class="colorRed">*</span>
          </div>

          <div class="inputWrap">
            <div class="itemWrap">
              <span class="leftTitle">千足金基础工费优惠</span>
              <el-input
                v-model="creatData.gold999"
                placeholder="请设置基础工费优惠"
                size="small"
                class="width240"
                @blur="checkgold999"
              >
                <div slot="suffix" style="margin-top: 7px;">
                  <img
                    src="../../../static/images/g@2x.png"
                    alt
                    class="headImage"
                    width="14"
                    height="16"
                  />
                </div>
              </el-input>
            </div>
            <div class="itemWrap">
              <span class="leftTitle">万足金基础工费优惠</span>
              <el-input
                v-model="creatData.gold9999"
                placeholder="请设置万足金基础工费优惠"
                size="small"
                class="width240"
                @blur="checkgold9999"
              >
                <div slot="suffix" style="margin-top: 7px;">
                  <img
                    src="../../../static/images/g@2x.png"
                    alt
                    class="headImage"
                    width="14"
                    height="16"
                  />
                </div>
              </el-input>
            </div>
            <div>
              <span class="leftTitle">摆件优惠</span>
              <el-input
                v-model="creatData.placejDiscount"
                placeholder="请设置摆件优惠"
                size="small"
                class="width240"
                @blur="checkplacejDiscount"
              >
                <div slot="suffix" style="margin-top: 7px;">
                  <img
                    src="../../../static/images/g@2x.png"
                    alt
                    class="headImage"
                    width="14"
                    height="16"
                  />
                </div>
              </el-input>
            </div>
          </div>
        </div>
      </div>

      <!-- 附加工费优惠 -->
      <div class="addWrap">
        <div>
          <div class="title">附加工费优惠</div>
          <div class="hr" />
        </div>

        <div class="addUL">
          <div class="addTitle">
            <div class="font14">工费区间</div>
            <div class="font14">优惠金额(g)</div>
          </div>

          <div class="addLI" v-for="(item,index) in creatData.discountProp" :key="index">
            <span>
              <el-input
                v-model="item.minPrice"
                placeholder="克重起"
                size="small"
                class="width160"
                @blur="checkminPrice(index)"
              ></el-input>
            </span>

            <span>
              <el-input
                v-model="item.maxPrice"
                placeholder="克重止"
                size="small"
                class="width160"
                @blur="checkmaxPrice(index)"
              ></el-input>
            </span>

            <span>
              <el-input
                v-model="item.discountPrice"
                placeholder="设置优惠金额"
                size="small"
                class="width160"
                @blur="checkdiscountPrice(index)"
              ></el-input>
            </span>

            <span style="margin-left: -4px;cursor: pointer" @click="delcost(index)">
              <i class="el-icon-close"></i>
            </span>
          </div>

          <el-button size="small" class="width160 colorRed" @click="addcost">新增优惠 +</el-button>
        </div>
      </div>

      <!-- 其他优惠 -->

      <div class="otherWrap">
        <div>
          <div class="title">其他优惠</div>
          <div class="hr" />
        </div>

        <div class="otherUL">
          <div class="otherTitle">
            <span class="font14">名称</span>
            <span class="font14">计费方式</span>
            <span class="font14">是否免费</span>
            <span class="font14">优惠金额</span>
          </div>

          <div class="otherLI" v-for="(item,index) in creatData.customerDiscountPlats" :key="index">
            <span>
              <el-select
                v-model="item.paypayVal"
                placeholder="请选择名称"
                size="small"
                class="width160"
                @change="changName(index)"
              >
                <el-option
                  v-for="item in costData"
                  :key="item.paypayVal"
                  :label="item.paypayTxt"
                  :value="item.paypayVal"
                ></el-option>
              </el-select>
            </span>

            <span>
              <el-select
                v-model="item.billingWay"
                placeholder="请选择计费方式"
                size="small"
                class="width160"
                disabled
              >
                <el-option
                  v-for="item in billingWayData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>

            <span>
              <el-select
                v-model="item.discountSatue"
                placeholder="请选择状态"
                size="small"
                class="width160"
              >
                <el-option
                  v-for="item in discountSatueData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>

            <span>
              <el-input
                v-model="item.discountPrice"
                v-bind:disabled="item.discountSatue == 'Y'"
                placeholder="设置特价优惠金额"
                size="small"
                class="width160"
                @blur="checkPrice(index)"
              ></el-input>
            </span>

            <span
              class="leftTitle"
              style="margin-left: -32px;margin-right: 10px"
              v-show="item.price != ''"
            >原件：{{item.price}}元/g</span>
            <span style="cursor: pointer" @click="delDiscount(index)">
              <i class="el-icon-close"></i>
            </span>
          </div>

          <el-button size="small" class="width160 colorRed" @click="addDiscount">新增优惠 +</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      creatData: {
        gold999: "",
        gold9999: "",
        customerId: "",
        customerName: "",
        placejDiscount: "",
        goldPrice: {},
        discountProp: [
          {
            minPrice: "",
            maxPrice: "",
            discountPrice: ""
          }
        ],
        customerDiscountPlats: [
          {
            paypayVal: "",
            paypayTxt: "",
            price: "",
            discountSatue: "",
            billingWay: "",
            discountPrice: ""
          }
        ]
      },
      billingWayData: [
        {
          //计费方式数据
          name: "按件收",
          value: "j"
        },
        {
          name: "按克收",
          value: "k"
        },
        {
          name: "按单收",
          value: "d"
        }
      ],
      discountSatueData: [
        {
          name: "是",
          value: "Y"
        },
        {
          name: "否",
          value: "N"
        }
      ],
      costData: [], //平台价格数据
      mock: "",
      customerData: [], //客户数据
      loading: false
    };
  },
  created() {
    this.created_fun();
    this.getCarepriceList();
    this.goldPriceFun(); //基础工费查询
  },
  methods: {
    created_fun() {
      this.displayAllData();
    },
    displayAllData() {},
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      self.loading = true;
      let params = {
        PRS: {
          clientScope: "",
          keyWord: query
        }
      };
      //client/clientListSimple
      self.$axios
        .get(self.$portMain + "/client/rawClientSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerData = res.data.data;
            self.loading = false;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 来料客户删除(编辑)
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.creatData.customerId = "";
        this.customerData = [];
      }
    },
    //选择客户
    changCustomer(val) {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == val) {
          self.creatData.customerName = item.companyName;
        }
      });
    },
    //基础工费查询
    goldPriceFun() {
      let self = this;
      let params = { ceditWayId: 4 };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/getKnotPriceByWageAndGold",
        params,
        res => {
          self.goldPrice = res.data;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //数字校验
    checkgold999(e) {
      if (isNaN(e.target.value)) {
        this.creatData.gold999 = "";
        this.$message.warning("请输入数字");
      }
    },

    checkgold9999(e) {
      if (isNaN(e.target.value)) {
        this.creatData.gold9999 = "";
        this.$message.warning("请输入数字");
      }
    },

    checkplacejDiscount(e) {
      if (isNaN(e.target.value)) {
        this.creatData.placejDiscount = "";
        this.$message.warning("请输入数字");
      }
    },
    //添加工费
    addcost() {
      this.creatData.discountProp.push({
        minPrice: "",
        maxPrice: "",
        discountPrice: ""
      });
    },
    //删除工费
    delcost(index) {
      if (this.creatData.discountProp.length == 1) {
        this.$message.warning("请保留一条数据");
      } else {
        this.creatData.discountProp.splice(index, 1);
      }
    },

    //工费数字校验
    checkminPrice(index) {
      let numMin = this.creatData.discountProp[index].minPrice;
      let numMax = this.creatData.discountProp[index].maxPrice;
      if (isNaN(numMin)) {
        this.creatData.discountProp[index].minPrice = "";
        this.$message.warning("请输入数字");
      }
      if (numMin != "" && numMax != "") {
        if (Number(numMin) >= Number(numMax)) {
          this.$message.warning("抱歉，克重起不能大于克重止！");
          this.creatData.discountProp[index].minPrice = "";
        }
      }

      if (index > 0) {
        let previousMax = this.creatData.discountProp[index - 1].maxPrice;
        if (Number(numMin) < Number(previousMax)) {
          this.$message.warning("抱歉，您输入正确的区间值！");
          this.creatData.discountProp[index].minPrice = "";
        }
      }

      let nextNUm = this.creatData.discountProp[index + 1];
      if (nextNUm != undefined) {
        this.creatData.discountProp.splice(index + 1, 1);
      }
    },

    checkmaxPrice(index) {
      let numMin = this.creatData.discountProp[index].minPrice;
      let numMax = this.creatData.discountProp[index].maxPrice;
      if (isNaN(numMax)) {
        this.creatData.discountProp[index].maxPrice = "";
        this.$message.warning("请输入数字");
      }

      if (numMin != "" && numMax != "") {
        if (Number(numMin) >= Number(numMax)) {
          this.$message.warning("抱歉，克重止不能小于克重起！");
          this.creatData.discountProp[index].maxPrice = "";
        }
      }

      let nextNUm = this.creatData.discountProp[index + 1];
      if (nextNUm != undefined) {
        this.creatData.discountProp.splice(index + 1, 1);
      }
    },

    checkdiscountPrice(index) {
      let num = this.creatData.discountProp[index].discountPrice;
      if (isNaN(num)) {
        this.creatData.discountProp[index].discountPrice = "";
        this.$message.warning("请输入数字");
      }
    },

    //查询平台价格维护
    getCarepriceList() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/discount/getCarepriceList")
        .then(function(res) {
          if (res.data.code == 200) {
            let arr = [];
            res.data.data.forEach(item => {
              if (item.statue == "Y") {
                arr.push(item);
              }
            });
            self.costData = arr;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //新增优惠
    addDiscount() {
      this.creatData.customerDiscountPlats.push({
        paypayVal: "",
        paypayTxt: "",
        price: "",
        discountSatue: "",
        billingWay: "",
        discountPrice: ""
      });
    },
    //删除优惠
    delDiscount(index) {
      if (this.creatData.customerDiscountPlats.length == 1) {
        this.$message.warning("请保留一条数据");
      } else {
        this.creatData.customerDiscountPlats.splice(index, 1);
      }
    },
    //选择名称
    changName(index) {
      let num = this.creatData.customerDiscountPlats[index].paypayVal;
      let self = this;
      this.costData.forEach(item => {
        if (item.paypayVal == num) {
          self.creatData.customerDiscountPlats[index].paypayTxt =
            item.paypayTxt;
          self.creatData.customerDiscountPlats[index].billingWay =
            item.billingWay;
          self.creatData.customerDiscountPlats[index].price = item.price;
        }
      });
    },
    //校验优惠价格
    checkPrice(index) {
      let num = this.creatData.customerDiscountPlats[index].discountPrice;
      if (isNaN(num)) {
        this.creatData.customerDiscountPlats[index].discountPrice = "";
        this.$message.warning("请输入数字");
      }
    },
    //提交
    subFun() {
      let self = this;
      if (this.creatData.customerId == "") {
        this.$message.warning("请选择客户名称！");
        return;
      }

      let data = JSON.parse(JSON.stringify(self.creatData));

      let customerDiscountPlats = [];
      this.creatData.customerDiscountPlats.forEach(item => {
        // if (item.paypayVal == '' || item.billingWay == '' || item.discountPrice == '' || item.price == '') {
        //   fruit = true;
        // }
        if (
          item.paypayVal != "" &&
          item.discountSatue != "" &&
          item.discountSatue != ""
        ) {
          if (item.discountSatue == "Y") {
            customerDiscountPlats.push(item);
          } else if (item.discountSatue == "N" && item.discountPrice != "") {
            customerDiscountPlats.push(item);
          }
        }
      });

      let discountProp = [];
      this.creatData.discountProp.forEach(item => {
        if (
          item.minPrice != "" &&
          item.maxPrice != "" &&
          item.discountPrice != ""
        ) {
          discountProp.push(item);
        }
      });

      data.customerDiscountPlats = customerDiscountPlats;
      data.discountProp = discountProp;

      let params = {
        customerDiscounts: JSON.stringify(data)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/discount/updateCustomerDiscount",
        params,
        res => {
          self.$message.success(res.msg);
          self.$router.push("preferentialStrategyDisp");
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //取消
    cancelFun() {
      this.$router.push("preferentialStrategyDisp");
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

  .colorRed {
    color: red;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #2E2F33;
  }

  .font14 {
    font-size: 14px;
    font-weight: bold;
    color: #8A9199;
  }

  .width240 {
    width: 240px;
  }

  .width160 {
    width: 160px;
  }

  .leftTitle {
    font-size: 12px;
    font-weight: 400;
    color: rgba(138, 142, 153, 1);
  }

  .detailWrap {
    .titleWrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .contain {
    padding: 40px 0 0 48px;

    .inputWrap {
      display: flex;
      margin-top: 32px;
      margin-bottom: 48px;

      .itemWrap {
        margin-right: 200px;
      }
    }
  }

  .addWrap {
    margin-bottom: 40px;

    .addUL {
      padding-left: 48px;

      .addTitle {
        display: flex;
        margin-bottom: 14px;
        width: 500px;
        justify-content: space-between;
      }

      .addLI {
        margin-bottom: 24px;

        span {
          display: inline-block;
          margin-right: 44px;
        }
      }
    }
  }

  .otherWrap {
    .otherUL {
      padding-left: 48px;
    }

    .otherTitle {
      margin-bottom: 14px;
      display: flex;
      width: 848px;

      span {
        flex: 1;
      }
    }

    .otherLI {
      margin-bottom: 24px;

      span {
        margin-right: 44px;
      }
    }
  }
}
</style>

<style>
/* .itemTwoWrap .checkWrap .el-checkbox {
  margin-left: 0px;
  width: 230px;
} */
</style>
