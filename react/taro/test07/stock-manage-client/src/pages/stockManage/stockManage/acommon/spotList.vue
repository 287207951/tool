<template>
  <div>
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
    <el-row v-for="(item,ind) in stockPro" :key="ind" class="orderBigDiv">
      <el-col :span="23" class="tabOne">
        <div class="tabOneLeft">
          <img
            :src="item.url?$portImg+item.url:'/static/images/img-noimg.png'"
            style="height:90px; width:120px;"
            @click.stop="showPic(item.url?$portImg+item.url:'/static/images/img-noimg.png')"
          />
        </div>
        <el-row style="line-height:30px;" class="tabOneRight">
          <el-col :span="5">{{item.proName}}</el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.suit != 2">
              产品材质：
              <span class="txtTwo">{{item.goldCode}}</span>
            </b>&nbsp;
          </el-col>

          <el-col :span="5" v-if="item.storePos" class="txtOne">
            库位：
            <span class="txtTwoBold">{{item.storePos != undefined?item.storePos:'暂无'}}</span>
          </el-col>
          <el-col :span="5" class="txtOne" v-else>
            <span class="txtTwo">&nbsp</span>
          </el-col>
          <el-col :span="5" class="txtOne">
            成色：
            <span class="txtTwoBold">{{item.conditi}}</span>&nbsp;
          </el-col>
          <el-col :span="4" class="txtOne" v-if="item.amount">
            可用库存：
            <b :class="item.amount>0?'txtTwoBold':'txtFive'">{{item.amount}}</b>
          </el-col>
          <el-col :span="4" class="txtOne" v-else>
            <span class="txtTwo">&nbsp</span>
          </el-col>
          <el-col :span="5" class="txtOne">
            编号：
            <span class="txtTwo">{{item.proNumber}}</span>
          </el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.suit != 2">
              生产工艺：
              <span class="txtTwo">{{item.processCode}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="5" class="txtOne">
            工厂：
            <span class="txtTwo">{{item.factoryName}}</span>
          </el-col>
          <el-col :span="5" class="txtOne">
            克重(g)：
            <span class="txtTwoBold">{{item.weight}}</span>&nbsp;
          </el-col>
          <el-col :span="4" class="txtOne" v-if="item.lockAmount">
            已锁库存：
            <b :class="item.lockAmount > 0?'txtThreeRed':'txtFive'">{{item.lockAmount || 0}}</b>
          </el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.suit != 2">
              类别：
              <span class="txtTwo">{{item.one}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.suit != 2">
              表面工艺：
              <span class="txtTwo">{{item.effectCode}}</span>
            </b>&nbsp;
          </el-col>

          <el-col :span="5" class="txtOne">
            <b v-if="item.feeType === 1">
              附加工费：
              <span class="txtTwo">￥{{item.additionPrice.toFixed(2)}}</span>
            </b>
            <b v-if="item.feeType === 2">
              件工费：
              <span class="txtTwo">￥{{item.feePrice.toFixed(2)}}</span>
            </b>
          </el-col>

          <!-- <el-col :span="5" class="txtOne">
            <b v-if="item.suit != 2 && item.carCode!=''">
              车花：
              <span class="txtTwo">{{item.carCode}}</span>
            </b>&nbsp;
          </el-col>-->
          <el-col :span="5" class="txtOne">
            <b
              v-if="item.extendAttr && item.one"
              v-html="$api.getAttachProperty(item.one,item.extendAttr)"
            ></b>
            <!-- 套装详情 -->
            <b v-if="item.suit == 2">
              <b class="redTxtOne" @click="editSuit(item)">
                套装详情
                <i :class="item.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
              </b>
            </b>

            <!-- 附加属性 -->
            <span v-if="item.sizeList">
              <!-- 戒指 -->
              <span v-if="item.sizeList.ringHand">手寸(#): {{item.sizeList.ringHand}}</span>
              <span v-if="item.sizeList.openType">开口类型: {{item.sizeList.openType}}</span>

              <!-- 手镯 -->
              <span v-if="item.sizeList.diameterLength">圈口(cm): {{item.sizeList.diameterLength}}</span>
              <span
                v-if="item.sizeList.diameterLengthStart"
              >圈口起(cm):: {{item.sizeList.diameterLengthStart}}</span>
              <span
                v-if="item.sizeList.diameterLengthEnd"
              >圈口止(cm):: {{item.sizeList.diameterLengthEnd}}</span>
              <span v-if="item.sizeList.diameterWidth">内径宽(cm):: {{item.sizeList.diameterWidth}}</span>
              <span
                v-if="item.sizeList.diameterWidthStart"
              >内径宽起(cm):: {{item.sizeList.diameterWidthStart}}</span>
              <span
                v-if="item.sizeList.diameterWidthEnd"
              >内径宽止(cm):: {{item.sizeList.diameterWidthEnd}}</span>
              <span v-if="item.sizeList.faceWidth">面宽(cm):: {{item.sizeList.faceWidth}}</span>
              <span v-if="item.sizeList.faceWidthStart">面宽起(cm):: {{item.sizeList.faceWidthStart}}</span>
              <span v-if="item.sizeList.faceWidthEnd">面宽止(cm):: {{item.sizeList.faceWidthEnd}}</span>
              <span v-if="item.sizeList.openType">开口类型: {{item.sizeList.openType}}</span>

              <!-- 吊坠 -->
              <span v-if="item.sizeList.height">高: {{item.sizeList.height}}</span>
              <span v-if="item.sizeList.heightStart">高起: {{item.sizeList.heightStart}}</span>
              <span v-if="item.sizeList.heightEnd">高止: {{item.sizeList.heightEnd}}</span>
              <!-- 金条 -->
              <span v-if="item.sizeList.m1">长: {{item.sizeList.m1}}</span>
              <span v-if="item.sizeList.m2">宽: {{item.sizeList.m2}}</span>
              <span v-if="item.sizeList.m3">高: {{item.sizeList.m3}}</span>
            </span>
            &nbsp;
          </el-col>

          <el-col :span="4" class="txtOne" v-if="item.goldWeight">
            净重(g)：
            <b>{{item.goldWeight}}</b>
            <!-- <b
              v-if="item.amount != 0 || item.lockAmount != 0"
              :class="item.goldWeight > 0?'txtThree':'txtThreeRed'"
            >{{item.goldWeight}}g</b>-->
            <!-- <b v-else class="txtFive">
              0g
              <b v-if="item.goldWeight != 0" class="txt12px">
                （克重差异：
                <b class="txtThreeRed txt12px">{{item.goldWeight}}g</b>)
              </b>
            </b>-->
          </el-col>
        </el-row>
        <el-row align="middle">
          <el-col :span="2" class="txtRed">
            <b>
              <el-button size="small" @click="downLoadFunTwo(item)" type="text">打印一维码</el-button>
            </b>
            <b>
              <el-button size="small" @click="downLoadFun(item)" type="text">打印挂标</el-button>
            </b>
            <!-- <b>
              <el-button size="small" @click="printSkuFun(item)" type="text">下载标签</el-button>
            </b>-->
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
        <div class="suitDiv" v-if="item.viewSuit">
          <!-- {{item.map.proList}} -->
          <el-row>
            <el-col
              :span="12"
              class="suitSubDiv"
              v-for="(ielem,indTwo) in item.map.proList"
              :key="indTwo+''"
            >
              <div class="pro-item">
                <div class="pro-imgs">
                  <img
                    :src="ielem.pic?$portImg+ielem.pic:'/static/images/img-noimg.png'"
                    width="120"
                    height="90"
                  />
                </div>
                <div class="pro-right">
                  <el-row>
                    <el-col :span="14" class="pro-tit">{{ielem.name}}</el-col>
                    <el-col :span="10" class="txtOne">
                      克重：
                      <span class="txtTwo">{{ielem.weight}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="14" class="txtOne">
                      编号：
                      <span class="txtTwo">{{ielem.factoryNumber}}</span>
                    </el-col>
                    <el-col :span="10" class="txtOne">
                      成色：
                      <span class="txtTwo">{{ielem.condit}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="14" class="txtOne">
                      属性：
                      <span
                        class="txtTwo"
                      >{{ielem.goldCode}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.effect?','+ielem.effect:''}}</span>
                    </el-col>
                    <el-col :span="10" class="txtOne">
                      <span
                        v-if="ielem.oneName && ielem.extend"
                        v-html="$api.getAttachProperty(ielem.oneName,ielem.extend)"
                      ></span>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 打印挂标开始 -->
    <div v-show="false">
      <printTPSkuFour :billData="printData" ref="printTPTwo"></printTPSkuFour>
    </div>
    <!-- 打印挂标结束 -->
    <!-- 打印一维码开始 -->
    <div v-show="false">
      <printTPSkuOne :billData="printData" ref="printTPThree"></printTPSkuOne>
    </div>
    <!-- 打印一维码结束 -->
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>
<script>
export default {
  props: [`stockPro`],
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      printData: {}
    };
  },
  methods: {
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    },

    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },

    //打印挂标
    downLoadFun(elem) {
      let self = this;
      // console.log(elem,elem.proNumber)
      this.printData = elem;
      this.$refs.printTPTwo.compPrintFun();
    },
    //打印一维码
    downLoadFunTwo(elem) {
      let self = this;
      // console.log(elem,elem.proNumber)
      this.printData = elem;
      this.$refs.printTPThree.compPrintFun();
    },
    //下载一维码
    printSkuFun(elem) {
      let self = this;
      var params = {
        PRS: {
          sku: elem.proNumber
          // sku: 'GSKSZ0106150-001'
        }
      };
      this.$axios
        .get(self.$portMain + "/bizPlate/getCode", params)
        .then(function(res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              //canvs图片生成开始
              var blob = self.$api.getBlob(res.data.data);
              //一维码base64付到img里
              var imgDiv = self.$refs.myImg;
              imgDiv.src = res.data.data;

              var c = self.$refs.myCanvas;
              var ctx = c.getContext("2d");
              ctx.clearRect(0, 0, c.width, c.height); //清空画布，防止重叠内容
              ctx.fillStyle = "#FFffff";
              ctx.fillRect(0, 0, 340, 300);
              ctx.fillStyle = "#919599";
              ctx.font = "bold 16px 微软雅黑";
              ctx.fillText("款式名称:", 40, 50);
              ctx.fillText("SKU编号:", 40, 80);
              ctx.fillStyle = "#242526";
              ctx.font = "bold 16px 微软雅黑";
              ctx.fillText(elem.proName, 120, 50);
              ctx.fillText(elem.proNumber, 120, 80);
              setTimeout(() => {
                ctx.drawImage(imgDiv, 40, 110); //一维码传入画布
                ctx.font = "bold 14px 微软雅黑";
                ctx.fillText(elem.proNumber, 90, 173);
                var myImage = c.toDataURL("image/png");
                var blob = self.$api.getBlob(myImage);
                self.$refs.xlsDownloadA.download = elem.proNumber;
                self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
                self.$refs.xlsDownloadA.click();
              }, 200);
            } else {
              self.$message.error(res.data.msg);
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
$base-color = rgb(230, 14, 50);
$font-color = #999;

.yellowColor {
  color: #F26D0F;
}

.redColor {
  color: #F20F34;
}

.blackColor {
  color: #2E2F33;
}

.grayColor {
  color: #8a9199;
}

.searchTxt {
  width: 320px;
}

.pageD {
  margin-top: 20px;
  text-align: center;
}

.fontStyle {
  color: #8A8E99;
  font-size: 14px;
  margin-left: 20px;
}

.titleFont {
  color: #8A8E99;
  font-size: 14px;
}

.width160 {
  width: 160px;
}

.creatStyle {
  position: relative;

  .line {
    width: 640px;
    height: 1px;
    background-color: #E6E6E6;
    position: absolute;
    top: -33px;
    left: -20px;
  }

  .inputWidth240 {
    width: 240px;
  }

  .inputWidth160 {
    width: 160px;
  }

  .itemRight {
    text-align: right;
  }

  .marginBottom {
    margin-bottom: 32px;
  }

  .fontTStyle {
    font-size: 14px;
    color: #8A9199;
  }
}

.detailStyle {
  position: relative;

  .line {
    width: 640px;
    height: 1px;
    background-color: #E6E6E6;
    position: absolute;
    top: -33px;
    left: -20px;
  }

  .itemBottom {
    margin-bottom: 24px;
  }

  .titleStyle {
    color: #8A9199;
    font-size: 14px;
    text-align: right;
    padding-right: 24px;
  }

  .contentStyle {
    color: #2E2F33;
    font-size: 14px;
  }
}

.promptStyle {
  position: relative;

  .line {
    width: 480px;
    height: 1px;
    background-color: #E6E6E6;
    position: absolute;
    top: -33px;
    left: -20px;
  }

  .textAreaStyle {
    width: 433px;
    height: 120px;
    resize: none;
    background: rgba(240, 247, 255, 1);
  }
}

.totalDes {
  color: #F20F34;
  font-size: 14px;
  text-align: right;

  span {
    display: inline-block;
    margin-right: 24px;
  }
}

.orderBigDiv {
  padding: 13px;
  min-height: 80px;
  border: #E5F1FF 1px solid;
  margin: 20px 8px;
  color: #222426;
  font-size: 14px;

  .orderBigDivOne {
    color: #333;
  }
}

.txtOne {
  font-size: 14px;
  color: #889199;

  span {
    color: #222426;
  }
}

.txtTwo {
  font-size: 14px;
  color: #222426;
}

.txtTwoBold {
  font-size: 14px;
  color: #222426;
  font-weight: bold;
}

.txtThree {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.txtThreeRed {
  font-size: 14px;
  color: $base-color;
  font-weight: bold;
}

.txtFour {
  font-size: 14px;
  color: #F20F34;
  font-weight: bold;
}

.txtFive {
  font-size: 14px;
  color: #919599;
  font-weight: bold;
}

.txtRed {
  color: #F20F34;
}

.tabOne {
  display: flex;
}

.tabOneLeft {
  width: 140px;
}

.tabOneRight {
  width: calc(100% - 140px);
}

.paddingRight30 {
  padding-right: 30px;
  margin-top: 10px;
}

.marginTop10 {
  margin-top: 10px;
  padding-left: 20px;
}

.suitDiv {
  padding-bottom: 10px;
  border-top: 1px solid #DADFE6;
  margin-top: 10px;

  .suitSubDiv {
    margin: 10px 0px;
  }
}

.pro-item {
  display: flex;
  align-items: center;
  background: #fff;
  line-height: 30px;

  .pro-right {
    width: 75%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin-left: 10px;
  }
}

.redTxtOne {
  color: #F20F34;
  font-weight: bold;
}

.width240 {
  width: 240px;
}

.floatRight {
  float: right;
}

.left20 {
  margin-left: 20px;
}

.tabTwo {
  display: flex;
}

.tabTwoLeft {
  width: 174px;
}

.tabTwoRight {
  width: calc(100% - 174px);
  margin-left: 20px;
}

.txtAlginRight {
  text-algin: right;
}

.txt12px {
  font-size: 12px;
}
</style>
