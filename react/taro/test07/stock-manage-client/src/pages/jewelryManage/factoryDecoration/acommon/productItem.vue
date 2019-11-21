<template>
  <div class="productUL" :class="productData.showStatus ? 'on' : ''">
    <!-- 单装 -->
    <div class="product">
      <div class="uLOne" style="flex:11">
        <img
          :src="productData.proBasics.pic?$portImg+productData.proBasics.pic:'../../../../../static/images/img-noimg.png'"
          @click="showPic(productData.proBasics.pic?$portImg+productData.proBasics.pic:'../../../../../static/images/img-noimg.png')"
          alt
        />
        <div class="liDes">
          <div>{{productData.proName}}</div>
          <div>
            <span class="grayCol">编号：</span>
            <span>{{productData.skuId}}</span>
          </div>
          <div v-if="productData.proBasics.oneItemsCode != 'TZ'">
            <span class="grayCol">属性：</span>
            <span v-if="productData.proBasics.goldCode">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="getAttributes(productData.proBasics)"
              >
                <span
                  class="txtBlack overflowHidden"
                  slot="reference"
                >{{getAttributes(productData.proBasics).length < 8?getAttributes(productData.proBasics):getAttributes(productData.proBasics).substr(0, 8)+'...'}}</span>
              </el-popover>
            </span>
            <span v-else>-</span>
          </div>
          <div
            v-if="productData.proBasics.oneItemsCode === 'TZ'"
            class="redCol"
            style="cursor: pointer;"
            @click="TZShow"
          >
            套装详情
            <i class="el-icon-arrow-up" v-show="productData.TZShow"></i>
            <i class="el-icon-arrow-down" v-show="!productData.TZShow"></i>
          </div>
        </div>
      </div>

      <div class="uLTwo" style="flex:7">
        <div>
          <span class="grayCol">成色：</span>
          <span>{{productData.proSpecData.conditi}}</span>
        </div>
        <div>
          <span class="grayCol">克重：</span>
          <span>{{productData.proSpecData.weight}}g</span>
        </div>
        <div>
          <!-- 扩展属性（手寸，链长） -->
          <b
            v-if="productData.proBasics.one && productData.proSpecData.extendAttr"
            v-html="$api.getAttachProperty(productData.proBasics.one,productData.proSpecData.extendAttr)"
          ></b>&nbsp;
        </div>
      </div>

      <div class="uLTwo" style="flex:7">
        <div>
          <span class="grayCol">出库数量：</span>
          <span>{{productData.amount}}</span>
        </div>
        <div>
          <span class="grayCol">出库净重：</span>
          <span>{{productData.suttle}}g</span>
        </div>
        <div>
          <span class="grayCol">出库毛重：</span>
          <span>{{productData.weight}}g</span>
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

    <!-- 套装 -->
    <div class="tzWtap" v-if="productData.proBasics.oneItemsCode == 'TZ'" v-show="arrowType">
      <TzAttrDetails
        v-for="(item,index) in productData.proSpecData.ProList"
        :key="index"
        :suitDetailData="item"
        @showPic="showPic"
      ></TzAttrDetails>
    </div>

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
    }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      arrowType: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    productData: function(newVal, oldVal) {
      // console.log("1产品", newVal);
    }
  },
  computed: {},
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    },
    //套装详情
    TZShow() {
      this.arrowType = !this.arrowType;
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModelPic(e) {
      this.modelType = e;
    },
    //关闭
    clickFun() {},
    // 获取产品属性
    getAttributes(data) {
      let arr = [];
      return [
        data.goldCode,
        data.condit,
        data.oneName,
        data.effect,
        data.processCode,
        data.craft,
        data.pait
      ]
        .filter(n => n)
        .join(",");
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
