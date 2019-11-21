<template>
  <div class="productUL" :class="productData.showStatus ? 'on' : ''" ref="productItemPickTwo">
    <!-- 单装 -->
    <div class="product">
      <TzAttrBaoPick :baoData="productData" @suitDes="suitDes" @showPic="showPic"></TzAttrBaoPick>
      <!-- <TzAttr @suitDes="suitDes"></TzAttr> -->
      <div style="display:flex;flex:6">
        <div class="uLTwo" style="flex:6">
          <div>
            <span class="grayCol">拣货数量：</span>
            <span>{{productData.newAmountOne?productData.newAmountOne:(productData.ipadAmount?productData.ipadAmount:productData.amount)}}</span>
          </div>
          <div>
            <span class="grayCol">拣货净重：</span>
            <span>{{productData.newSuttleOne?productData.newSuttleOne:(productData.skuSuttle?productData.skuSuttle:productData.suttle)}}g</span>
          </div>

          <div v-if="bizInvoice.bizType == 'SEND_CLIENT'">
            <span class="grayCol">{{productData.proSpecData.feeType == '1'?'附加工费':'件工费'}}：</span>
            <span>￥{{productData.proSpecData.feeType == '1'?productData.proSpecData.additionPrice:productData.proSpecData.feePrice}}</span>
          </div>
          <div v-else-if="bizInvoice.bizType == 'RECEIVE_FACTORY'">
            <span class="grayCol">{{productData.proSpecData.factFeeType == '1'?'附加工费':'件工费'}}：</span>
            <span>￥{{productData.proSpecData.feeType == '1'?productData.proSpecData.price:productData.proSpecData.piecePrice}}</span>
          </div>
          <div v-else></div>
        </div>
        <div class="uLTwo" style="flex:6">
          <div>
            <span class="grayCol">验收数量：</span>
            <span>
              <el-input-number
                v-model="productData.newAmount"
                :controls="false"
                size="small"
                class="width70"
                @change="changeNum(productData)"
                v-if="editTF"
              ></el-input-number>
              <span v-else>{{productData.newAmount?productData.newAmount:productData.amount}}</span>
            </span>
          </div>
          <div>
            <span class="grayCol">验收净重：</span>
            <span>
              <el-input-number
                v-model="productData.newSuttle"
                :controls="false"
                size="small"
                class="width70"
                @change="changeNum(productData)"
                v-if="editTF"
                @focus="focusWeightFocus(productData,'newSuttle',indOne)"
                @blur="focusWeightBlur(productData,'newSuttle')"
              ></el-input-number>
              <span
                v-else
              >{{productData.newSuttle?$api.returnFloatNum(productData.newSuttle):$api.returnFloatNum(productData.suttle)}}</span>g
            </span>
          </div>
          <div>
            <span class="grayCol">验收毛重：</span>
            <span>
              <el-input-number
                v-model="productData.newWeight"
                :controls="false"
                size="small"
                class="width70"
                @change="changeNum(productData)"
                v-if="editTF"
                @focus="focusWeightFocus(productData,'newWeight',indOne)"
                @blur="focusWeightBlur(productData,'newWeight')"
              ></el-input-number>
              <span v-else>{{productData.newWeight?productData.newWeight:productData.weight}}</span>g
            </span>
          </div>
        </div>
        <div class="uLThree" style="flex:6" v-if="editTF">
          <div class="txtRed txtRight right20" @click="addPackFun(productData)" v-if="!baoTF">添加到包</div>
          <div class="txtRed txtRight right20" @click="addPackFun(productData)" v-if="baoTF">移除</div>
        </div>
      </div>
    </div>
    <!-- 套装 -->
    <div class="tzWtap" v-if="productData.proBasics.one == '套装'" v-show="arrowType">
      <TzAttrDetails
        v-for="(item,index) in productData.proSpecData.ProList"
        :key="index"
        :suitDetailData="item"
        @showPic="showPic"
      ></TzAttrDetails>
    </div>
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>

    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModelPic" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>

<script>
export default {
  props: {
    productData: {
      type: Object,
      required: true
    },
    sumData: {
      type: Array,
      required: false
    },
    editTF: {
      type: Boolean,
      required: false,
      default: true
    },
    baoTF: {
      type: Boolean,
      required: false,
      default: true
    },
    indOne: {
      type: Number,
      required: false
    },
    bizInvoice: {
      required: false
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      arrowType: false,
      // editTF: true,
      enterStatus: "",
      tempObj: {},
      weightA: "",
      indTwo: null
    };
  },
  created() {
    let self = this;
    // self.productData.newWeight = self.$api.returnFloatNum(
    //   this.productData.newWeight
    // );
    // self.productData.newSuttle = self.$api.returnFloatNum(
    //   this.productData.newSuttle
    // );
    // self.productData.skuSuttle = self.$api.returnFloatNum(
    //   this.productData.skuSuttle
    // );
    // self.productData.newWeights = this.productData.newWeight;
    // self.productData.newSuttles = self.productData.newSuttle;

    // self.productData.newSuttleOne = self.productData.newSuttle
    //   ? self.productData.newSuttle
    //   : self.productData.suttle;
    // self.productData.newAmountOne = self.productData.newAmount;
    // this.computeData();
    document.onkeydown = e => {
      let dom = self.$refs.productItemPickTwo;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },
  mounted() {},
  watch: {
    productData: function(newVal, oldVal) {
      // this.computeData();
      console.log("pppp", newVal);
    },
    editTF: function(newVal, oldVal) {
      this.editTF = newVal;
    },
    baoTF: function(newVal, oldVal) {
      this.baoTF = newVal;
    }
  },
  computed: {},
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    },
    //计算数据
    computeData() {
      let self = this;
      self.productData.newWeight = self.$api.returnFloatNum(
        this.productData.newWeight
      );
      self.productData.newSuttle = self.$api.returnFloatNum(
        this.productData.newSuttle
      );
      self.productData.skuSuttle = self.$api.returnFloatNum(
        this.productData.skuSuttle
      );
      self.productData.newWeights = this.productData.newWeight;
      self.productData.newSuttles = self.productData.newSuttle;

      self.productData.newSuttleOne = self.productData.newSuttle
        ? self.productData.newSuttle
        : self.productData.suttle;
      self.productData.newAmountOne = self.productData.newAmount;
    },
    //套装详情
    suitDes(val) {
      this.arrowType = val;
    },
    //数量检验只能输入整数
    changeNum(elem) {
      // console.log(elem.editAmount)
      elem.newAmount = parseInt(elem.newAmount);
      elem.newSuttle = parseFloat(elem.newSuttle);
      elem.newWeight = parseFloat(elem.newWeight);
      this.$forceUpdate();
    },
    //添加到包
    addPackFun(elem) {
      this.$emit("addPackFun", this.productData);
    },

    //输入框获得焦点
    focusWeightFocus(e, elem, indOne) {
      this.enterStatus = elem;
      localStorage.enterStatus = elem;
      localStorage.indOne = indOne;
      this.tempObj = e;
    },
    //输入框丢去焦点
    focusWeightBlur(item, name) {
      let self = this;
      this.tempObj = null;
      if (name == "newSuttle") {
        if (item.newSuttle > item.newWeight && item.newWeight > 0) {
          this.$message.error("亲，输入的毛重不能小于净重，请注意哦！");
        }
      } else if (name == "newWeight") {
        if (item.newWeight < 0) {
          item.newSuttle = item.newWeight;
        } else if (item.newSuttle > item.newWeight) {
          this.$message.error("亲，输入的净重不能大于毛重，请注意哦！");
        }
      }
      this.$forceUpdate();
    },

    //电子秤读数事件
    comFun() {
      let self = this;
      if (!self.tempObj) {
        self.$message.error("实收净重或实收毛重没有被焦点选中！");
      }
      if (self.tempObj) {
        self.$refs.comA.click();
        this.loopInit();
      }
    },

    //改变电子称输入框数量
    changeWeight(elem) {
      let self = this;
      let Index = localStorage.indOne;
      if (localStorage.enterStatus == "newSuttle") {
        self.sumData[Index].newSuttle = parseFloat(elem);
      }
      if (localStorage.enterStatus == "newWeight") {
        self.sumData[Index].newWeight = parseFloat(elem);
      }
      // console.timeEnd();
      self.$forceUpdate();
    },
    //循环读取电子称输入框数量
    loop() {
      let oldVal = "";
      let self = this;
      let count = 0;
      return () => {
        if (count >= 20) {
          count = 0;
          this.$message.info(`重量没有改变，请检查是否读称成功！`);
          return;
        }
        setTimeout(() => {
          this.$$.ajax({
            type: "get",
            async: false,
            url:
              "http://localhost:5000/BalanceResult/result.js?t=" +
              new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              // console.log(json,json.weight);
              count++;
              var weightNum = json.weight ? json.weight : null;
              if (!oldVal) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
              if (oldVal && oldVal === weightNum) {
                self.changeWeight(weightNum);
                self.loopInit();
                return;
              }
              if (oldVal && oldVal !== weightNum) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
            },
            error: function() {
              // alert("fail");
            }
          });
        }, 150);
      };
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModelPic(e) {
      this.modelType = e;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.productUL {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;
  border: 1px solid #E5F1FF;
  padding: 14px 24px;
  margin-bottom: 8px;

  &.on {
    border: 1px solid #8A9199;
  }

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  // 单品
  .product {
    display: flex;
    position: relative;
    line-height: 34px;

    .uLOne {
      display: flex;

      img {
        width: 120px;
        height: 90px;
      }

      .liDes {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .uLTwo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .uLThree {
      width: 260px;
      display: flex;
      line-height: 36px;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }

  // 套装
  .tzWtap {
    border-top: 1px solid #E5F1FF;
    margin-top: 13px;
    padding: 14px 0;

    .itemWrap {
      width: 49%;
      display: inline-flex;
      margin-bottom: 20px;
    }

    .uLOne {
      display: flex;

      img {
        width: 120px;
        height: 90px;
      }

      .liDes {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .uLTwo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  // 更多
  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;

    strong {
      color: #df343d;
      font-weight: bold;
    }

    .dialog {
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 100%;
      width: 250px;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;

      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #37393b;
      }

      p {
        padding-top: 10px;
        line-height: 1.4;
        font-size: 12px;
        color: #3c3c3c;
      }
    }

    &:hover .dialog {
      visibility: visible;
    }
  }
}
</style>
