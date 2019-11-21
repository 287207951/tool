<template>
  <div class="productUL" :class="productData.showStatus ? 'on' : ''">
    <!-- 单装 -->
    <div class="product">
      <TzAttrBao :baoData="productData" @suitDes="suitDes" @showPic="showPic"></TzAttrBao>
      <!-- <TzAttr @suitDes="suitDes"></TzAttr> -->

      <div style="display:flex;flex:6">
        <div class="uLThree" style="flex:10" v-if="orderDetail.bizType === 'RECEIVE_CLIENT'">
          <div>
            <span class="grayCol">
              工费类型：
              <span v-show="productData.feeType === 1">每克</span>
              <span v-show="productData.feeType === 2">每件</span>
            </span>
          </div>
          <div>
            <span class="grayCol">
              基础工费：
              <span>{{productData.basePrice}}</span>
            </span>
          </div>
          <div>
            <span class="grayCol">
              工费：
              <span v-show="productData.feeType === 1">{{productData.additionPrice}}</span>
              <span v-show="productData.feeType === 2">{{productData.feePrice}}</span>
            </span>
          </div>
        </div>
        <div class="uLThree" style="flex:10" v-else>
          <div>
            <span class="grayCol">
              工费类型：
              <span v-show="productData.facFeeType === 1">每克</span>
              <span v-show="productData.facFeeType === 2">每件</span>
            </span>
          </div>
          <!-- <div>
            <span class="grayCol">
              基础工费：
              <span>{{productData.basePrice}}</span>
            </span>
          </div>-->
          <div>
            <span class="grayCol">
              采购工费：
              <span v-show="productData.facFeeType === 1">{{productData.price}}</span>
              <span v-show="productData.facFeeType === 2">{{productData.piecePrice}}</span>
            </span>
          </div>
          <div>&nbsp</div>
        </div>

        <div class="uLTwo" style="flex:8">
          <div>
            <span class="grayCol">实收数量：</span>
            <span>{{productData.amount}}</span>
          </div>
          <div>
            <span class="grayCol">实收净重：</span>
            <span>{{productData.suttle}}g</span>
          </div>
          <div>&nbsp</div>
        </div>

        <div class="uLThree" style="flex:10" v-if="orderDetail.bizType === 'RECEIVE_CLIENT'">
          <div class="flexCenter">
            <span class="grayCol">退饰原因：</span>
            <div class="more" v-if="productData.remark && productData.remark.join().length > 10">
              <span>{{productData.remark | getPart }}</span>
              ...
              <strong>更多</strong>
              <div class="dialog">
                <p>{{ productData.remark.join()}}</p>
              </div>
            </div>
            <div v-else>
              <span>{{ productData.remark && productData.remark.join()}}</span>
            </div>
          </div>
          <div class="flexRemark">
            <span class="grayCol">退饰备注：</span>
            <!-- <span>{{productData.remarkReason ? productData.remarkReason : '--'}}</span> -->
            <div class="more" v-if="productData.remarkReason.length > 13">
              <span>{{productData.remarkReason | getPartRemark }}</span>
              ...
              <strong>更多</strong>
              <div class="dialog">
                <p>{{ productData.remarkReason}}</p>
              </div>
            </div>
            <div v-else>
              <span>{{ productData.remarkReason }}</span>
            </div>
          </div>
          <div>&nbsp</div>
        </div>
        <el-row align="middle">
          <el-col :span="2" class="txtRed">
            <el-button size="small" @click="downLoadFun(productData)" type="text">下载一维码</el-button>
          </el-col>
        </el-row>
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
    <a ref="xlsDownloadA"></a>
    <div>
      <canvas
        ref="myCanvas"
        width="340"
        height="200"
        style="border:1px solid #d3d3d3;"
        v-show="false"
      ></canvas>
      <img ref="myImg" width="500" height="150" v-show="false" />
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
    },
    orderDetail: {
      type: Object
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
      console.log("1产品", newVal);
    }
  },
  computed: {},
  filters: {
    getPart(options) {
      return options.join().slice(0, 10);
    },
    getPartRemark(options) {
      return options.slice(0, 13);
    }
  },
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    },
    // 套装详情
    suitDes(val) {
      // console.log(val);
      this.arrowType = val.TZShow;
    },
    // 下载一维码
    downLoadFun(elem) {
      let self = this;
      this.$emit("printFun", elem);
      // var params = {
      //   PRS: {
      //     sku: elem.skuId
      //   }
      // };
      // this.$axios
      //   .get(self.$portMain + "/bizPlate/getCode", params)
      //   .then(function(res) {
      //     if (res.data.code == 200) {
      //       if (res.data.data) {
      //         // canvs图片生成开始
      //         var blob = self.$api.getBlob(res.data.data);
      //         // 一维码base64付到img里
      //         var imgDiv = self.$refs.myImg;
      //         imgDiv.src = res.data.data;

      //         var c = self.$refs.myCanvas;
      //         var ctx = c.getContext("2d");
      //         ctx.clearRect(0, 0, c.width, c.height); //清空画布，防止重叠内容
      //         ctx.fillStyle = "#FFffff";
      //         ctx.fillRect(0, 0, 340, 300);
      //         ctx.fillStyle = "#919599";
      //         ctx.font = "bold 16px 微软雅黑";
      //         ctx.fillText("款式名称:", 40, 50);
      //         ctx.fillText("SKU编号:", 40, 80);
      //         ctx.fillStyle = "#242526";
      //         ctx.font = "bold 16px 微软雅黑";
      //         ctx.fillText(elem.proName, 120, 50);
      //         ctx.fillText(elem.skuId, 120, 80);
      //         setTimeout(() => {
      //           ctx.drawImage(imgDiv, 40, 110); //一维码传入画布
      //           ctx.font = "bold 14px 微软雅黑";
      //           ctx.fillText(elem.skuId, 90, 173);
      //           var myImage = c.toDataURL("image/png");
      //           var blob = self.$api.getBlob(myImage);
      //           self.$refs.xlsDownloadA.download = elem.skuId;
      //           self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
      //           self.$refs.xlsDownloadA.click();
      //         }, 200);
      //       } else {
      //         self.$message.error(res.data.msg);
      //       }
      //     } else {
      //       self.$message.error(res.data.msg);
      //     }
      //   });
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
    clickFun() {}
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.flexRemark {
  display: flex;
}

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

.flexCenter {
  display: flex;
}
</style>
