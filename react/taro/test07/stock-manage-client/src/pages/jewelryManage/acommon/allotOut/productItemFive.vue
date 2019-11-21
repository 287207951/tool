<template>
  <div class="productUL" :class="productData.showStatus ? 'on' : ''" ref="productItemThree">
    <!-- 单装 -->
    <div class="product">
      <TzAttrBao :baoData="productData" @suitDes="suitDes" @showPic="showPic"></TzAttrBao>
      <!-- <TzAttr @suitDes="suitDes"></TzAttr> -->

      <div style="display:flex;flex:6">
        <div class="uLTwo" style="flex:6">
          <div>
            <span class="grayCol">{{typeTxt}}数量：</span>
            <span>{{productData.amount}}</span>
          </div>
          <div>
            <span class="grayCol">{{typeTxt}}净重：</span>
            <span>{{productData.suttle}}g</span>
          </div>
          <div>
            <span class="grayCol">{{typeTxt}}毛重：</span>
            <span>{{productData.weight}}g</span>
          </div>
        </div>
        <div class="uLTwo" style="flex:6">
          <div>
            <span class="grayCol">复称数量：</span>
            <span>
              <span v-if="editTF === false">{{productData.newAmount}}</span>
              <el-input-number
                v-model="productData.newAmount"
                :max="productData.amount"
                :controls="false"
                size="small"
                class="width70"
                @change="changeNum(productData)"
                v-else
              ></el-input-number>
            </span>
          </div>
          <div>
            <span class="grayCol">复称净重：</span>
            <span>
              <span v-if="editTF === false">{{productData.newSuttle}}</span>
              <el-input-number
                v-model="productData.newSuttle"
                :controls="false"
                size="small"
                class="width70"
                v-else
                @focus="focusWeightFocus(productData,'复称净重')"
                @blur="focusWeightBlur(productData,'newSuttle')"
              ></el-input-number>g
            </span>
          </div>
          <div>
            <span class="grayCol">复称毛重：</span>
            <span>
              <span v-if="editTF === false">{{productData.newWeight}}</span>
              <el-input-number
                v-model="productData.newWeight"
                :controls="false"
                size="small"
                class="width70"
                v-else
                @focus="focusWeightFocus(productData,'复称毛重')"
                @blur="focusWeightBlur(productData,'newWeight')"
              ></el-input-number>g
            </span>
          </div>
        </div>
        <div class="uLThree" style="flex:6">
          <div v-if="productData.remarkReason">
            <span class="grayCol">{{typeTxt}}原因：</span>
            <span>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="productData.remarkReason"
              >
                <span
                  class="txtBlack overflowHidden"
                  slot="reference"
                >{{productData.remarkReason.length < 10?productData.remarkReason:productData.remarkReason.substr(0, 10)+'...'}}</span>
              </el-popover>
            </span>
          </div>
          <div v-if="productData.remark">
            <span class="grayCol">{{typeTxt}}备注：</span>
            <span>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="productData.remark"
              >
                <span
                  class="txtBlack overflowHidden"
                  slot="reference"
                >{{productData.remark.length < 10?productData.remark:productData.remark.substr(0, 10)+'...'}}</span>
              </el-popover>
            </span>
          </div>
          <div>&nbsp;</div>
        </div>
      </div>
    </div>
    <!-- 套装 -->
    <div class="tzWtap" v-if="productData.proBasics.oneItemsCode == 'TZ'" v-show="arrowType">
      <TzAttrDetails
        v-for="(item,index) in productData.proSpecData.ProList"
        :key="index"
        :suitDetailData="item"
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
    editTF: {
      type: Boolean,
      required: false
    },
    typeTxt: {
      type: Text,
      required: false
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      arrowType: false,
      editTF: true,
      enterStatus: "",
      tempObj: {},
      weightA: "",
      typeTxt: ""
    };
  },
  created() {
    let self = this;
    document.onkeydown = e => {
      let dom = self.$refs.productItemThree;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },

  watch: {
    productData: function(newVal, oldVal) {
      newVal.newAmount = null;
      newVal.newAmount = null;
      newVal.newAmount = null;
      this.productData = newVal;
    },
    editTF: function(newVal, oldVal) {
      this.editTF = newVal;
    },
    typeTxt: function(newVal, oldVal) {
      this.typeTxt = newVal;
    }
  },
  computed: {},
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    },
    //套装详情
    suitDes(val) {
      this.arrowType = val.TZShow;
    },
    //数量检验只能输入整数
    changeNum(elem) {
      // console.log(elem.editAmount)
      elem.newAmount = parseInt(elem.newAmount);
      this.$forceUpdate();
    },
    //输入框获得焦点
    focusWeightFocus(e, elem) {
      this.enterStatus = elem;
      this.tempObj = e;
    },
    //输入框丢去焦点
    focusWeightBlur(item, name) {
      let self = this;
      this.tempObj = null;
      this.enterStatus = "";
      if (name == "newSuttle") {
        if (item.newSuttle > item.newWeight) {
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
      var self = this;
      if (!self.tempObj) {
        self.$message.error("实收净重或实收毛重没有被焦点选中！");
      }
      if (self.tempObj) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },
    
    //改变电子称输入框数量
    changeWeight(elem){
      let self = this;
      if (self.enterStatus === "复称净重") {
        self.productData.newSuttle = parseFloat(elem);
      }
      if (self.enterStatus === "复称毛重") {
        self.productData.newWeight = parseFloat(elem);
      }
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
            url:"http://localhost:5000/BalanceResult/result.js?t=" + new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              // console.log(json,json.weight);
              count++;
              var weightNum = json.weight?json.weight:null
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
