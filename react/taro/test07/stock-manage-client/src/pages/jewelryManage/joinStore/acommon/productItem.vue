<template>
  <!-- 新增库 -->
  <div class="productUL" :class="productData.showStatus ? 'on' : ''">
    <!-- 单装 -->
    <div class="product">
      <i class="el-icon-close closePic" @click="deleteFun" v-show="componentBtnSet"></i>
      <TzAttrAddBao @suitDes="suitDes" :addProOBj="productData" @showPic="showPic"></TzAttrAddBao>
      <!-- <TzAttrBao :baoData="productData" @suitDes="suitDes"></TzAttrBao> -->

      <div style="display:flex;flex:6">
        <div class="uLThree" style="flex:10" v-if="afferentData.bizType === 'RECEIVE_CLIENT'">
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
        <div class="uLThree" style="flex:10" v-if="afferentData.bizType === 'RECEIVE_FACTORY'">
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
            <span>{{productData.amounts}}</span>
          </div>
          <div>
            <span class="grayCol">实收净重：</span>
            <span>{{productData.suttle}}g</span>
          </div>
          <div>&nbsp</div>
        </div>

        <div class="uLThree" style="flex:10" v-if="afferentData.bizType === 'RECEIVE_CLIENT'">
          <div class="flexCenter">
            <div class="grayCol">退饰原因：</div>
            <div class="more" v-if="productData.resion && productData.resion.join().length > 10">
              <span>{{productData.resion | getPart }}</span>
              ...
              <strong>更多</strong>
              <div class="dialog">
                <p>{{ productData.resion.join()}}</p>
              </div>
            </div>
            <div v-else>
              <span>{{ productData.resion && productData.resion.join()}}</span>
            </div>
          </div>

          <div class="flexRemark">
            <span class="grayCol">退饰备注：</span>
            <div class="more" v-if="productData.skuRemarks.length > 13">
              <span>{{productData.skuRemarks | getPartRemark }}</span>
              ...
              <strong>更多</strong>
              <div class="dialog">
                <p>{{ productData.skuRemarks}}</p>
              </div>
            </div>
            <div v-else>
              <span>{{ productData.skuRemarks }}</span>
            </div>
          </div>
          <div>&nbsp</div>
        </div>

        <el-row align="middle">
          <el-col :span="1" style="margin-right: 70px" class="txtRed">
            <el-button size="small" @click="downLoadFun(productData)" type="text">下载一维码</el-button>
          </el-col>
        </el-row>
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
    componentBtnSet: {
      type: Boolean,
      default: true,
      required: false
    },
    printTF: {
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
    //套装详情
    suitDes(val) {
      this.arrowType = val.arrowType;
    },
    //关闭
    deleteFun() {
      this.$confirm("你确定删除该产品么?", "提示", {
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
      // console.log("添加到包");
      this.$emit("addPackFun", this.productData);
    },
    //移除产品
    removeProductsFun(val) {
      this.$emit("removeProductsFun", val);
    },
    //下载一维码
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
      //         //canvs图片生成开始
      //         var blob = self.$api.getBlob(res.data.data);
      //         //一维码base64付到img里
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
      //         ctx.fillText(elem.proNumber, 120, 80);
      //         setTimeout(() => {
      //           ctx.drawImage(imgDiv, 40, 110); //一维码传入画布
      //           ctx.font = "bold 14px 微软雅黑";
      //           ctx.fillText(elem.proNumber, 90, 173);
      //           var myImage = c.toDataURL("image/png");
      //           var blob = self.$api.getBlob(myImage);
      //           self.$refs.xlsDownloadA.download = elem.proNumber;
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
    }
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

    .closePic {
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 2;
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
