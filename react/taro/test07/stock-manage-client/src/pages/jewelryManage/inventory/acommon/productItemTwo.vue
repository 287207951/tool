<template>
  <!-- 新增库 -->
  <div class="productUL" :class="productData.showStatus ? 'on' : ''">
    <!-- 单装 -->
    <div class="product">
      <!-- <i class="el-icon-close closePic" @click="deleteFun" v-show="componentBtnSet"></i> -->
      <TzAttrAddBao @suitDes="suitDes" :addProOBj="productData" @showPic="showPic"></TzAttrAddBao>

      <div style="display:flex;flex:6">
        <div class="uLTwo" style="flex:8">
          <div>
            <span class="grayCol">数量差异：{{productData.amount}}</span>
          </div>
          <div>
            <span class="grayCol">净重差异：{{productData.suttle.toFixed(2)}}g</span>
          </div>
          <div>
            <span class="grayCol">&nbsp</span>
          </div>
        </div>

        <div class="uLThree" style="flex:10">
          <div>
            <span class="grayCol">调差数量：{{productData.calcAmount}}</span>
          </div>
          <div>
            <span class="grayCol">调差净重：{{productData.calcSuttle.toFixed(2)}}g</span>
          </div>
          <div>
            <span class="grayCol">&nbsp</span>
          </div>
        </div>
      </div>
      <div
        class="addPack"
        @click="removeProductsFun(productData.proNumber)"
        v-show="!componentBtnSet"
      >移除</div>
    </div>

    <!-- 套装 -->
    <div class="tzWtap" v-if="productData.oneItemsCode == 'TZ'" v-show="arrowType">
      <TzAttrDetails
        v-for="(suitData,num) in productData.map.proList"
        :suitDetailData="suitData"
        :key="num"
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
    componentBtnSet: {
      type: Boolean,
      default: true,
      required: false
    },
    afferentData: {
      type: Object,
      required: true
    },
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
  filters: {
    getPart(options) {
      return options.slice(0, 3).join();
    }
  },
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    },
    //套装详情
    suitDes(val) {
      this.arrowType = val.arrowType;
    },
    //关闭
    deleteFun() {
      console.log("删除", this.productData.proNumber);
      this.$confirm("你确定该产品么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("deleteProduct", this.productData.proNumber);
        })
        .catch(() => {});
    },
    //添加到包
    addPackFun() {
      console.log("添加到包");
      this.$emit("addPackFun", this.productData);
    },
    //移除产品
    removeProductsFun(val) {
      this.$emit("removeProductsFun", val);
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

    .closePic {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
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

  .addPack {
    position: absolute;
    right: 24px;
    top: 51px;
    cursor: pointer;
    color: red;
  }

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

  .flexCenter {
    display: flex;
  }
}
</style>
