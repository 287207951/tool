<template>
  <div class="orderdetail" id="orderDetailPhone">
    <div class="fixed-tit">
      <div class="padding10 txt18 paddingLeft14">{{baoNo}}</div>
      <div class="displayFlex width100F colorTwo txt14 paddingBottom10 paddingLeft10">
        <div class="width33F padding5"><span>下单数量：</span>{{allData.bizInvoice.amount}}</div>
        <div class="width50F padding5"><span>下单重量：</span>{{allData.bizInvoice.suttle}}g</div>
      </div>
      <div class="padding10 paddingLeft14">
        <table
          class="parmlisttb"
        >
          <tr :style="{border: '1px solid #EDEDED'}">
            <td style="width: 80px" class="color999 txtRight padding5">订单编号</td>
            <td style="border-left: 1px solid #ededed;" class="color333 padding5">{{allData.bizInvoice.bizNo}}</td>
          </tr>
          <tr :style="{border: '1px solid #EDEDED',borderTop: 'none'}">
            <td style="width: 80px" class="color999 txtRight padding5">下单日期</td>
            <td style="border-left: 1px solid #ededed;" class="color333 padding5">{{$api.dateGetDayTime(allData.bizInvoice.createDate)}}</td>
          </tr>
          <!-- <tr :style="{border: '1px solid #EDEDED',borderTop: 'none'}">
            <td style="width: 80px" class="color999 txtRight padding5">字印</td>
            <td style="border-left: 1px solid #ededed;" class="color333 padding5">-</td>
          </tr>
          <tr :style="{border: '1px solid #EDEDED',borderTop: 'none'}">
            <td style="width: 80px" class="color999 txtRight padding5">是否挂标签</td>
            <td style="border-left: 1px solid #ededed;" class="color333 padding5">-</td>
          </tr> -->
        </table>
      </div>

    </div>

    <div style="height: 115px"></div>
    <div class="orderfine">
      <div class="fixed-wrap" ref="fixedWrap" v-if="allData.bizPack.length > 0">
        <div
          class="orderf-list"
          v-for="item in allData.bizPack"
          :key="item.packId"
        >
          <div v-if="item.shopPack === 2">
            <div class="padding14 item-tit" @click="viewBaoFun(item)">
              <el-row>
                <el-col :span="12" class="lingHeight24">
                  <div class="txt16">{{item.packId}}</div>
                  <div class="txt14 colorTwo"><span>数量：</span>{{item.packTotalAmount}}</div>
                </el-col>
                <el-col :span="8" class="lingHeight24">
                  <div class="txt16">&nbsp;</div>
                  <div class="txt14 colorTwo"><span>重量：</span>{{item.packTotalSuttle}}g</div>
                </el-col>
                <el-col :span="4" class="lingHeight48">
                  <div class="txtBold txtRight txt36" style="font-weight:48px"><i class="el-icon-arrow-right" style="font-weight:48px"></i></div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      pickBaoData:{},
      allData:{},
      bizNo:'',
      baoNo:'',
      timeD:'',
      H5ImgUrl:'',
    };
  },
  created() {
    this.bizNo = this.$route.query.bizId;
    this.timeD = this.$route.query.d;
    this.created_fun()
  },
  mounted() {},
  methods: {
    created_fun() {
      let self = this;
      var params = {bizNo:this.bizNo,date:this.timeD};
       this.$axiosp
        .get(self.$portMain + "/h5/order", {params})
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.assemblyPackageData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //组件包数据
    assemblyPackageData() {
      let self = this;
      const { bizPack, bizPackDetails, bizPro } = this.allData;
      if (bizPack.length == 0) {
        return;
      }
      //没有店铺
      bizPack.forEach(item => {
        item.packDetails = [];
        item.packSkuNumbers = [];
        bizPackDetails.forEach(it => {
          if (item.packId == it.packId) {
            item.packSkuNumbers.push(it);
          }
        });
      });

      bizPack.forEach(item => {
        item.packSkuNumbers.forEach(it => {
          bizPro.forEach(one => {
            if (it.skuNumber == one.skuId) {
              item.packDetails.push(Object.assign({}, one, it));
            }
          });
        });
      });

      //有店铺
      let parentPack = [];
      bizPack.forEach(item => {
        //   childPack = [];
        if (item.shopPack == 1) {
          //1、有店铺 2、没店铺
          item.childPack = [];
          parentPack.push(item);
        }
      });

      if (parentPack.length > 0) {
        parentPack.forEach(one => {
          bizPack.forEach(two => {
            if (one.packId == two.supPackId) {
              one.childPack.push(two);
            }
          });
        });
        this.allData.parentPack = parentPack;
      }
      // console.log('aaa:',this.allData)
      this.allData.bizPack.forEach(ielem=>{
      })
    },

    viewBaoFun(item){
      this.$router.push({
        path: "outCustomBaoView",
        query: { bizNo: item.bizNo,baoNo:item.packId,d:this.$moment().format("YYYY-MM-DD") }
      });
    }
  }
};
</script>

<style>

#orderDetailPhone .el-step__title {
  font-size: 12px;
}

#orderDetailPhone .is-success {
  /* color: #F20F34;
    border-color: #F20F34  */
}

#orderDetailPhone .el-step__icon.is-text {
  width: 18px;
  height: 18px;
  border: 1px solid;
}

#orderDetailPhone .el-step__icon-inner {
  font-size: 12px;
}

#orderDetailPhone .el-step.is-horizontal .el-step__line {
  height: 0px;
  top: 8px;
  left: 0;
  right: 0;
  border-bottom: 1px dashed #b4bccc;
  background-color: inherit;
}

#orderDetailPhone .el-step__description {
  color: #333;
  font-size: 12px;
}

.el-message-box {
  width: 90%;
}

#orderDetailPhone .el-message {
  display: none;
}
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
.orderdetail {
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma, Simsun, sans-serif;

  .fixed-tit {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 2;
    background: #fff;
    box-shadow: 0px 1.5px 2px 0px rgba(204, 204, 204, 0.5);
  }
  .width33{
    width:33%;
  }

  .tit {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 46px;
    padding: 0 20px;
    font-size: 14px;
    background: #fff;

    & > p:nth-of-type(1) {
      margin-right: 40px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }

    & > div:nth-of-type(2) {
      display: flex;
    }
  }

  .ordernum {
    box-sizing: border-box;
    padding: 10px;
    background: #fff;

    .weight {
      box-sizing: border-box;
      padding-top: 6px;
      height: 50px;
      line-height: 16px;

      p:nth-of-type(2) {
        margin-top: 6px;
      }
    }

    .deposit {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 16px;

      .dep-left {
        margin-top: 6px;

        p {
          span:nth-of-type(2) {
            color: #F20F34;
          }
        }

        p:nth-of-type(2) {
          margin-top: 6px;
        }
      }

      .tag-box {
        margin-right: 30px;
        margin-top: 14px;
        width: 35px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 2px;
        color: #F20F34;
        border: 1px solid #F20F34;

        &:active {
          opacity: 0.6;
        }
      }
    }
  }

  .orderfine {
    min-height: 600px;
    margin-top: 22px;

    .tit {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }

    .item-tit {
      position: relative;
      align-items: center;
      justify-content: space-between;
      min-height: 38px;
      background: #fff;

      & .iit-category {
        font-weight: bold;
        display: flex;
        align-items: center;
        margin-left: 16px;

        & > img {
          margin-left: 6px;
          width: 10px;
        }
      }

      & > div {

        & > span {
          margin-left: 16px;
          font-weight: bold;
        }
      }

      & > div:nth-of-type(2) {
        margin-right: 6px;
      }

    }

    .orderf-item {
      .ofitem-top {
        box-sizing: border-box;
        display: flex;
        padding: 15px 10px;
        border-top: 1px solid #f5f5f5;
        background: #fff;

        .ofp-left {
          flex: 1;
          display: flex;

          img {
            margin-right: 10px;
            width: 80px;
            height: 60px;
          }

          .ofpl-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .ofpli-tit {
            }

            .ofpli-info {
              color: #999;
            }

            .ofpli-bottom {
              color: #999;
            }
          }
        }

        .ofp-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 55px;
          margin-right: 10px;
          font-size: 12px;
          color: #F20F34;

          img {
            width: 10px;
            height: 6px;
            margin-left: 6px;
          }
        }
      }

      .ofitem-bottom {
        background: #fafafa;

        .ofib-tit {
          padding: 15px 20px;
        }

        .ofitem-top {
          background: #fafafa;
        }

        .ofib-info {
          width: 350px;
          margin: 0 auto;
          padding: 0 12px 22px;
        }
      }
    }
  }

  .bottom {
    box-sizing: border-box;
    padding: 0 30px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    background: #F20F34;

    .bt-item {
      > div:nth-of-type(1) {
        font-weight: bold;
        margin-top: 8px;
        font-size: 18px;
        color: #fff;
      }

      > div:nth-of-type(2) {
        opacity: 0.7;
        margin-top: 2px;
        font-size: 10px;
        color: #fff;
      }
    }
  }
  .txt20{
    font-size:20px;
  }
  .txt20{
    font-size:20px;
  }
  .txt18{
    font-size:18px;
  }
  .txt16{
    font-size:16px;
  }
  .txt14{
    font-size:14px;
  }
  .txt12{
    font-size:12px;
  }
  .displayFlex{
    display:flex
  }
  .width33F{
    width:33%;
  }
  .width20F{
    width:20%
  }
  .width40F{
    width:40%
  }
  .width50F{
    width:50%
  }
  .width60F{
    width:60%
  }
  .width80F{
    width:80%
  }
  .width100F{
    width:100%
  }
  .paddingLeft5{
    padding-left:5px
  }
  .padding5{
    padding:5px
  }
  .padding10{
    padding:10px
  }
  .padding14{
    padding:14px
  }
  
  .padding20{
    padding:20px
  }
  .paddingLeft10{
    padding-left:10px;
  }
  .paddingLeft14{
    padding-left:14px;
  }
  .paddingBottom10{
    padding-bottom:10px;
  }
  .lingHeight16{
    line-height:16px;
  }
  .lingHeight24{
    line-height:24px;
  }
  .lingHeight48{
    line-height:48px;
  }
  .color999{
    color:#999
  }
  .color333{
    color:#333
  }
  .colorTwo{
    color:#333
  }
  .colorTwo span{
    color:#999
  }
  .top5{
    margin-top:5px
  }
  .top10{
    margin-top:10px
  }
  .txtBold{
    font-weight:bold
  }

}

.paramsList {
  tr {
    height: 30px;

    th {
      color: #333;
      background: #EDEDED;
      text-align: center;
      vertical-align: middle;
    }

    td {
      background: #FAFAFA;
      text-align: center;
      vertical-align: middle;
      // width: 350px;
    }
  }
}

.paramsListInfo {
  font-size: 12px;
  width: 100%;

  tr {
    td {
      box-sizing: border-box;
      border: 1px solid #ededed;
      background: #F5F5F5;
      height: 29px;
      vertical-align: middle;
    }

    td:nth-of-type(1) {
      width: 50%;
      color: #666;
      padding-right: 10px;
    }

    td:nth-of-type(2) {
      width: 50%;
      color: #333;
      background: #fff;
      padding-left: 10px;

      &.remark {
        box-sizing: border-box;
        padding-top: 8px;
        padding-left: 12px;
        height: 80px;
        text-align: left;
        vertical-align: top;
      }
    }
  }
}

.table {
  font-size: 12px;
  width: 100%;

  tr {
    td {
      box-sizing: border-box;
      border: 1px solid #ededed;
      height: 29px;
      vertical-align: middle;
    }

    td:nth-of-type(1) {
      width: 90px;
      color: #999;
      text-align: right;
      padding-right: 10px;
    }

    td:nth-of-type(2) {
      color: #333;
      text-align: left;
      padding-left: 10px;
    }
  }
}

.nosomething {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 234px;
  color: #333;
  font-size: 12px;

  img {
    width: 100px;
    height: 100px;
    opacity: 0.3;
    margin-bottom: 10px;
  }
}

.step {
  padding: 16px 14px;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
}

.msgtit {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 17px;
  font-size: 14px;
  color: #666;
}

.msgcontent {
  margin: 0 auto;
  width: 90%;
  height: 70px;
  background: #f5f5f5;

  textarea {
    box-sizing: border-box;
    border: none;
    outline: none;
    resize: none;
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #f5f5f5;
  }
}

.cancal-content {
  margin-top: 30px;
  font-size: 14px;
  text-align: center;
}

.btn {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #fff;
  background: #666;
}

.btn-defalut {
  background: #666;
}

.btn-warning {
  background: #E8B409;
}

.btn-error {
  background: #F20F34;
}

.btn:active {
  opacity: 0.8;
}

// 套装
.suiti-fee, .suiti-gold {
  display: flex;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.tz-remarkword {
  display: flex;
  align-items: center;
  color: #f20f34;

  span:nth-of-type(2) {
    margin-left: 20px;
    margin-right: 0px;
  }
}

.parmlisttb {
  width: 350px;
  border-top: 1px solid #fff;
}

.ofpr-right {
  font-size: 12px;
}

.orderf-list {
  margin-top: 5px;
}

.tab-item-wrap {
  height: 38px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #ededed;

  .btn-class2 {
    width: 60px;
    height: 24px;
  }
}

.tebiw-right {
  display: flex;
  align-items: center;

  span {
    font-size: 12px;
    margin-left: 20px;
    color: #F20F34;
  }
}

// 按钮
.btn-class1 {
  width: 70px;
  text-align: center;
  line-height: 25px;
  color: #fff;
  font-size: 12px;
  background: #F20F34;
  border-radius: 15px;
}

.btn-class2 {
  width: 50px;
  line-height: 25px;
  text-align: center;
  color: #F20F34;
  font-size: 12px;
  border: 1px solid #F20F34;
  border-radius: 15px;
}

.fixed-tab {
}

// 滑动到某个位置之后固定
.fixed-fixation {
  position: fixed;
  top: 46px;
  bottom: 0;
  width: 100%;
  overflow-y: auto;
}

</style>
