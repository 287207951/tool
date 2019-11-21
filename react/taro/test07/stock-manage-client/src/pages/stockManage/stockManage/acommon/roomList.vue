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
      <img ref="myImg" width="500" height="150" v-show="false">
    </div>
    <el-row v-for="(item, ind) in stockPro" :key="ind" class="orderBigDiv">
      <el-col :span="23" class="tabOne">
        <div class="tabOneLeft">
          <img
            v-if="item.url"
            :src="$portImg + item.url"
            style="height:90px; width:120px;"
            @click.stop="showPic($portImg + item.url)"
          >
          <img
            v-else
            src="/static/images/img-noimg.png"
            style="height:90px; width:120px;"
            @click.stop="showPic(`/static/images/img-noimg.png`)"
          >
        </div>

        <el-row style="line-height:31px;" class="tabOneRight">
          <el-col :span="5">{{ item.proName }}</el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.effectCode">
              表面工艺：
              <span class="txtTwo">{{item.effectCode}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="4" class="txtOne">
            <b v-if="item.carCode">
              车花：
              <span class="txtTwo">{{item.carCode}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="4" class="txtOne">
            <b v-if="item.conditi">
              成色：
              <span class="txtTwoBold">{{ item.conditi | $conditiNameFilter}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="6" class="txtOne">
            数量：
            <span :class="item.amount>0?'txtTwoBold':'txtRedBold'">{{ item.amount }}</span>
          </el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.proNumber">
              编号：
              <span class="txtTwo">{{item.proNumber}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="9" class="txtOne">
            <b v-if="item.goldCode">
              产品材质：
              <span class="txtTwo">{{item.goldCode}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="4" class="txtOne">
            克重(g)：
            <span class="txtTwoBold">{{ item.weight }}</span>
          </el-col>
          <el-col :span="4" class="txtOne">
            净重(g)：
            <span class="txtTwoBold">{{ item.goldWeight }}</span>
          </el-col>
          <el-col :span="2" class="txtRed">
            <el-button size="small" @click="downLoadFun(item)" type="text">下载一维码</el-button>
          </el-col>
          <el-col :span="5" class="txtOne">
            <b v-if="item.one">
              类别：
              <span class="txtTwo">{{item.one}}</span>
            </b>&nbsp;
          </el-col>
          <el-col :span="4" class="txtOne">
            <b v-if="item.processCode">
              生产工艺：
              <span class="txtTwo">{{item.processCode}}</span>
            </b>&nbsp;
          </el-col>

          <el-col :span="8" class="txtFour">
            <span v-if="item.oneItemsCode == 'TZ'">
              <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">
                详情
                <i class="el-icon-arrow-up"></i>
              </span>
              <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">
                详情
                <i class="el-icon-arrow-down"></i>
              </span>
            </span>&nbsp;
          </el-col>

          <el-col :span="8" class="txtOne" v-if="item.sizeTF">
            <b
              v-if="item.extendAttr && item.one"
              v-html="$api.getAttachProperty(item.one,item.extendAttr)"
            ></b>&nbsp;
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
        <div class="suitDiv" v-if="item.viewSuit">
          <el-row>
            <el-col
              :span="11"
              class="suitSubDiv"
              v-for="(ielem, indTwo) in item.map.proList"
              :key="indTwo + ''"
            >
              <div class="pro-item">
                <div class="pro-imgs">
                  <img
                    :src="ielem.pic? $portImg + ielem.pic: '/static/images/img-noimg.png'"
                    width="120"
                    height="90"
                  >
                </div>
                <div class="pro-right">
                  <el-row>
                    <el-col :span="24" class="pro-tit">{{ielem.name}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col
                      :span="24"
                      class="txtTwo"
                    >{{ ielem.goldCode}}{{ ielem.processCode ? "," + ielem.processCode : ""}}{{ ielem.effect ? "," + ielem.effect : "" }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" class="txtOne">
                      克重：
                      <span class="txtTwo">{{ ielem.weight }}</span>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: [`stockPro`],
  data() {
    return {};
  },
  methods: {
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },

    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },

    //下载一维码
    downLoadFun(elem) {
      let self = this;
      var params = {
        PRS: {
          sku: elem.proNumber
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
  margin-left: 31px;
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
  padding: 16px 20px;
  min-height: 110px;
  border: #E5F1FF 1px solid;
  margin-top: 10px;
  color: #222426;
  font-size: 14px;

  .orderBigDivOne {
    color: #333;
  }
}

.width200 {
  width: 200px;
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

.txtRed {
  font-size: 14px;
  color: #F20F34;
}

.txtRedBold {
  font-size: 14px;
  color: #F20F34;
  font-weight: bold;
}

.tabOne {
  display: flex;
}

.tabOneLeft {
  width: 174px;
}

.tabOneRight {
  width: calc(100% - 174px);
}

.suitDiv {
  padding: 10px;
  border-top: 1px solid #E9ECF5;

  .suitSubDiv {
    padding: 10px;
    margin: 0px 10px;
  }
}

.pro-item {
  width: 98%;
  display: flex;
  align-items: center;
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
  font-size: 14px;
  font-weight: bold;
}

.baoTabOne {
  background: #E4EAF0;
  margin: 5px 0;
  color: #8A8E99;

  .divOne {
    padding: 7px;
  }

  .divTwo {
    text-align: right;
    padding-right: 10px;
    padding-top: 7px;
  }
}

.width70 {
  width: 80px;
}

.baoTabTwo {
  background: #fff;
  border: 1px solid #E4EAF0;
  padding: 10px;
}

.baoProOne {
  border: 1px solid #E5F1FF;
  padding: 5px;
  margin-top: 10px;
  color: #8A8E99;
}

.baoProTwo {
  margin-top: 10px;
  color: #8A8E99;
}

.baoProThree {
  border-top: 1px solid #E5F1FF;
  margin-top: 10px;
  color: #8A8E99;
}

.baoProFour {
  padding: 10px;
  color: #8A8E99;
}
</style>
