<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>退货单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">订单编号</div>
            <div class="th">客户名称</div>
            <div class="th">总数量</div>
            <div class="th">总重量(g)</div>
            <div class="th">操作人</div>
            <div class="th">操作日期(g)</div>
            <div class="th">订单状态</div>
            <div class="th"></div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{orderAllData.orderNo}}</div>
            <div class="td">{{orderAllData.supplierfName}}</div>
            <div class="td">{{orderAllData.orderTotalSum}}</div>
            <div class="td">{{orderAllData.endOrderTotalWeight}}</div>
            <div class="td">{{orderAllData.operateUser}}</div>
            <div class="td">{{orderAllData.orderCreateTime}}</div>
            <div
              class="td"
              style="color: #F20F34"
              v-if="orderAllData.orderStatus == 1"
            >待审核</div>
            <div
              class="td"
              style="color: #F20F34"
              v-if="orderAllData.orderStatus == 7"
            >审核中</div>
            <div
              class="td"
              style="color: #199C3C"
              v-if="orderAllData.orderStatus == 2"
            >已通过</div>
            <div
              class="td"
              style="color: #E8B409"
              v-if="orderAllData.orderStatus == 4"
            >被驳回</div>

            <div class="td handle">
              <el-button
                type="primary"
                size="mini"
                v-if="orderAllData.orderStatus == 1"
                @click="upAudit"
              >提交审批</el-button>
              <el-button
                type="warning"
                style="margin-top: 10px"
                size="mini"
                v-if="orderAllData.orderStatus == 1"
                @click="backOrder"
              >退回
              </el-button>
            </div>
          </div>
          <div
            class="tr "
            style="border: none"
          >
            <el-col :span="16">
              <el-steps
                :active="stepsActive"
                finish-status="success"
                class="steps-list"
              >
                <el-step
                  title="步骤 1"
                  size="mini"
                  v-for="(item,index) in orderAllData.perFroms"
                  :key="index"
                >
                  <div slot="title">{{item.prcessName}}</div>
                  <div slot="description">
                    <p
                      v-for="(it,ind) in item.processTypeFroms"
                      :key="ind"
                    >
                      {{it.operateName}}
                    </p>
                  </div>
                </el-step>
              </el-steps>
            </el-col>
          </div>
        </div>
      </div>
      <div class="info-middle">
        <div v-for="(iitem,indOne) in orderAllData.factoryProductFroms" :key="indOne" class="tabOne">
          <div class="factoryTopDiv" >
              <span>{{iitem.factoryName}}</span>
              <span style="margin-left: 100px">总重量(g): {{iitem.sumWeight}}</span>
              <span style="float:right;">
                <span style="width:200px;" v-if="iitem.viewTF" @click="changeView(iitem)"><i class="el-icon-arrow-down"></i></span>
                <span style="width:200px;" v-if="!iitem.viewTF" @click="changeView(iitem)"><i class="el-icon-arrow-up"></i></span>
              </span>
          </div>
          <div v-show="iitem.viewTF">
            <!-- 单品start -->
            <div
              class="infom-info"
              v-for="(item,ind) in iitem.orderProperties"
              :key="ind"
            >
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="$portImg + item.productImg"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row>
                      <el-col :span="24" class="pro-tit">{{item.productName}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="pro-middle">编号：{{item.productNo}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="pro-bottom">成色：{{item.orderPeoductPerties?item.orderPeoductPerties[0].productCs:item.goldCode}}</el-col>
                    </el-row>
                  </div>
                </div>
                <div class="iitem-right">
                  <div class="order-th">
                    <div class="oth">克重(g)</div>
                    <div class="oth">重量范围(g)</div>
                    <div class="oth">退货数量</div>
                    <div class="oth">备注</div>
                  </div>
                  <div class="order-item">
                    <div
                      class="order-tr"
                      v-for="(it,index) in item.orderPeoductPerties"
                      :key="index"
                    >
                      <div
                        class="otd"
                        v-if="it.standardGold"
                      >{{it.standardGold}}</div>
                      <div class="otd">{{it.weightStart}} - {{it.weightEnd}}</div>
                      <div class="otd">{{it.orderSum}}</div>
                      <div class="otd">
                        <!-- <el-tooltip class="item" effect="dark" :content="it.productRemarks" placement="top">
                          <span v-if="it.productRemarks">查看备注>></span>
                        </el-tooltip> -->
                        {{it.productRemarks?it.productRemarks:'-'}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单品end -->

            <!-- 套装start -->
            <div
              class="suit"
              v-for="(item,ind) in iitem.suitProductFroms"
              :key="ind"
            >
              <div class="infom-info ">
                <div class="infom-item">
                  <div class="pro-item iitem-left">
                    <div class="pro-imgs">
                      <img
                        :src="$portImg + item.productImg"
                        width="153"
                        height="116"
                      >
                    </div>
                    <div class="pro-right">
                      <p class="pro-tit">{{item.productName}}</p>
                      <p class="pro-middle">编号：{{item.productNo}}</p>
                      <p class="pro-bottom">{{item.productPey}}</p>
                    </div>
                  </div>
                  <div class="iitem-right">
                    <div class="order-th">
                      <div class="oth">退货数量</div>
                      <div class="oth">金重(g)</div>
                      <div class="oth">备注</div>
                    </div>
                    <div class="order-item">
                      <div class="order-tr">
                        <div class="otd">{{item.suitSum}}</div>
                        <div class="otd">{{item.suitWeight}}</div>
                        <div class="otd">{{item.productRemarks?item.productRemarks:'-'}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="suit-info">
                <div
                  class="infom-info suiti-item"
                  v-for="(it, ix) in item.suitProdctPeyFroms"
                  :key="ix"
                >
                  <div class="infom-item">
                    <div class="pro-item iitem-left">
                      <div class="pro-imgs">
                        <img
                          :src="$portImg + it.productImg"
                          width="153"
                          height="116"
                        >
                      </div>
                      <div class="pro-right">
                        <p class="pro-tit">{{it.productName}}</p>
                        <p class="pro-feetype">编号：{{it.skuNum}}</p>
                        <p class="pro-feetype">{{it.craft}}{{it.pait?','+it.pait:''}}</p>
                        <p class="pro-feetype">
                          克重：{{it.standardGold}}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!-- 套装end -->
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
      stepsActive: 1,
      orderList: [],
      orderNo: "",
      orderAllData: {}
    };
  },

  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
  },

  methods: {
    created_fun() {
      let self = this;
      let params = {
        PRS:{
          orderNo:this.orderNo
        }
      }
      this.$axios
        .get(this.$portMain +"/order/selectBackOrderByOrderNo",params)
        .then(res => {
          self.orderAllData = res.data.data
          let stepAc = "";
          if (!self.orderAllData.perFroms) {
            self.orderAllData.perFroms = [];
          }
          for (var i = 0; i < self.orderAllData.perFroms.length; i++) {
            if (self.orderAllData.perFroms[i].orderStatus === 1) {
              stepAc = i + 1;
              break;
            }
          }
          if (stepAc) {
            this.stepsActive = stepAc;
          } else {
            this.stepsActive = self.orderAllData.perFroms.length + 1;
          }

          self.orderAllData.perFroms.unshift({
              prcessName: "客户",
              step: 1,
              orderStatus: 1,
              processTypeFroms: [
                {
                  operateName: self.orderAllData.operateUser
                }
              ]
            });
            if(self.orderAllData.factoryProductFroms){
              self.orderAllData.factoryProductFroms.forEach((iitem,indOne) => {
                if(indOne == 0){
                  iitem.viewTF = true;
                }else{
                  iitem.viewTF = false;
                }
                iitem.sumWeight = 0
                //单品统计金重
                if(iitem.orderProperties && iitem.orderProperties.length > 0){
                  iitem.orderProperties.forEach(ielem=>{
                    if(ielem.orderPeoductPerties &&ielem.orderPeoductPerties.length > 0){
                      ielem.orderPeoductPerties.forEach(jelem=>{
                        iitem.sumWeight += jelem.orderSum * jelem.standardGold
                      })
                    }
                  })
                }
                //套装统计金重
                if(iitem.suitProductFroms && iitem.suitProductFroms.length > 0){
                  iitem.suitProductFroms.forEach(ielem=>{
                    iitem.sumWeight += ielem.suitWeight
                  })
                }
              });
            }
      // let stepAc = "";
      // if (!self.orderAllData.perFroms) {
      //   self.orderAllData.perFroms = [];
      // }
      // for (var i = 0; i < self.orderAllData.perFroms.length; i++) {
      //   if (self.orderAllData.perFroms[i].orderStatus === 1) {
      //     stepAc = i + 1;
      //     break;
      //   }
      // }
      // if (stepAc) {
      //   this.stepsActive = stepAc;
      // } else {
      //   this.stepsActive = self.orderAllData.perFroms.length + 1;
      // }
      // self.orderAllData.perFroms.unshift({
      //   prcessName: "客户",
      //   step: 1,
      //   orderStatus: 1,
      //   processTypeFroms: [
      //     {
      //       operateName: self.orderAllData.userName
      //     }
      //   ]
      // });
      // console.log(self.orderAllData)
      // if(self.orderAllData.factoryProductFroms){
      //   self.orderAllData.factoryProductFroms.forEach((iitem,indOne) => {
      //     console.log(indOne)
      //     if(indOne == 0){
      //       iitem.viewTF = true;
      //     }else{
      //       iitem.viewTF = false;
      //     }
      //     let oneStart = 0;
      //     let  oneEnd = 0;
      //     iitem.allWeight = 0;
      //     iitem.allTotalWeight = 0;
      //     if(iitem.orderProperties){
      //       iitem.orderProperties.forEach(item => {
      //         item.weightShow = true;
      //         item.allWeight = 0;
      //         item.productImg = item.productImg.split(",");
      //         item.productPey = item.productPey.split("_").join("、");
      //         item.checked = false;
      //         item.styleKey = {};
      //         item.orderPeoductPerties.forEach(it => {
      //           //  尚臻品下 计算单个产品重量
      //           if (item.suit) {
      //             it.standardGold = it.suitStandardGold
      //               ? it.suitStandardGold.toString()
      //               : it.standardGold.toString();
      //             if (!it.standardGold.split("-")[1]) {
      //               it.standardGold = `${Number(it.standardGold)}-${Number(
      //                 it.standardGold
      //               )}`;
      //             }
      //             if (it.standardGold.split("-")[1]) {
      //               oneStart +=
      //                 Number(it.standardGold.split("-")[0]) * Number(it.orderSum);
      //               oneEnd +=
      //                 Number(it.standardGold.split("-")[1]) * Number(it.orderSum);
      //               item.weightShow = false;
      //             } else {
      //               it.allWeight = Number(it.standardGold) * Number(it.orderSum);
      //               item.allWeight += it.allWeight;
      //             }
      //           } else {
      //             it.allWeight = Number(it.standardGold) * Number(it.orderSum);
      //             item.allWeight += it.allWeight;
      //           }

      //           // 尚臻品 计算单个产品附加属性
      //           it.appearance = JSON.parse(it.appearance);
      //           it.styleItem = { name: "", value: "" };
      //           if (item.suit) {
      //             if (this.$u.isProClass(it.appearance) === "项链") {
      //               let lengthStart, lengthEnd;
      //               item.styleKey = {
      //                 name: "长度"
      //               };
      //               it.appearance.forEach(iit => {
      //                 if (iit.name === "lengthStart") {
      //                   if (iit.value) {
      //                     lengthStart = iit.value;
      //                   }
      //                 }
      //                 if (iit.name === "lengthEnd") {
      //                   if (iit.value) {
      //                     lengthEnd = iit.value;
      //                   }
      //                 }
      //               });
      //               it.styleItem = {
      //                 name: "长度",
      //                 value: `${lengthStart}-${lengthEnd}`
      //               };
      //             }
      //             if (this.$u.isProClass(it.appearance) === "手镯") {
      //               item.styleKey = {
      //                 name: "圈口"
      //               };
      //               it.styleItem = { name: "圈口", value: it.diameterLength };
      //             }
      //           } else {
      //             if (this.$u.isProClass(it.appearance) === "项链") {
      //               let lengthStart, lengthEnd;
      //               item.styleKey = {
      //                 name: "长度"
      //               };
      //               it.appearance.forEach(iit => {
      //                 if (iit.name === "lengthStart") {
      //                   if (iit.value) {
      //                     lengthStart = iit.value;
      //                   }
      //                 }
      //                 if (iit.name === "lengthEnd") {
      //                   if (iit.value) {
      //                     lengthEnd = iit.value;
      //                   }
      //                 }
      //               });
      //               it.styleItem = {
      //                 name: "长度",
      //                 value: `${lengthStart}-${lengthEnd}`
      //               };
      //             }
      //             if (this.$u.isProClass(it.appearance) === "手镯") {
      //             }
      //           }

      //           it.checked = false;
      //           //  当产品克重类型
      //           switch (it.feeType) {
      //             case 1:
      //               it.fee = "每克";
      //               break;
      //             case 2:
      //               it.fee = "每件";
      //               break;
      //             case 3:
      //               it.fee = "一口价";
      //               break;
      //           }
      //         });

      //         // 计算单个工厂总毛重
      //         if (item.suit) {
      //           if (!item.weightShow) {
      //             iitem.allWeight = `${oneStart}-${oneEnd}`;
      //             iitem.allTotalWeight = `${oneStart.toFixed(2)}-${oneEnd.toFixed(
      //               2
      //             )}`;
      //           } else {
      //             // console.log(item.allWeight)
      //             iitem.allWeight += item.allWeight;
      //             iitem.allTotalWeight = iitem.allWeight.toFixed(2);
      //           }
      //         } else {
      //           iitem.allWeight += item.allWeight;
      //           iitem.allTotalWeight = iitem.allWeight.toFixed(2);
      //         }
      //       });
      //     }


      //     //  套装里面的产品
      //     if (iitem.suitProductFroms) {
      //       iitem.suitProductFroms.forEach(it => {
      //         (it.standardGold = 0),
      //           (it.innerWeightStart = 0),
      //           (it.innerWeightEnd = 0),
      //           (it.orderSum = 0),
      //           (it.allWeight = 0);

      //         //  套装参数
      //         it.suitProdctPeyFroms.forEach(iit => {
      //           switch (iit.feeType) {
      //             case 1:
      //               iit.fee = "每克";
      //               break;
      //             case 2:
      //               iit.fee = "每件";
      //               break;
      //             case 3:
      //               iit.fee = "一口价";
      //               break;
      //           }

      //           // 套装附加属性
      //           iit.styleKey = {};
      //           iit.appearance = JSON.parse(iit.appearance);
      //           iit.appearance.forEach(iiit => {
      //             if (iiit.name === `diameterLengthStart` && iiit.value) {
      //               iit.styleKey.name = `圈口`;
      //               iiit.styleItem = {
      //                 name: `圈口`,
      //                 value: iit.diameterLength
      //               };
      //             }
      //             if (iiit.name === `lengthStart` && iiit.value) {
      //               iit.styleKey.name = `长度`;
      //               iit.lengthStart = iiit.value;
      //               iiit.styleItem = { name: `长度`, value: iiit.value };
      //             }
      //             if (iiit.name === `lengthEnd` && iiit.value) {
      //               iit.styleKey.name = `长度`;
      //               iit.lengthEnd = iiit.value;
      //               iiit.styleItem = { name: `长度`, value: iiit.value };
      //             }
      //           });

      //           it.standardGold += Number(iit.suitStandardGold);
      //           it.allWeight +=
      //             Number(iit.suitStandardGold) * Number(iit.orderSum);
      //           it.orderSum += Number(iit.orderSum);
      //           if (iit.innerWeight) {
      //             it.innerWeightStart += Number(iit.innerWeight.split("-")[0]);
      //             it.innerWeightEnd += Number(iit.innerWeight.split("-")[1]);
      //           }
      //         });
      //         it.innerWeight = `${it.innerWeightStart}-${it.innerWeightEnd}`;
      //         it.productRemarks = it.suitProdctPeyFroms[0].productRemarks;
      //         // iitem.allTotalWeight += it.allWeight
      //       });
      //     }
      //   });

      //   self.orderAllData.factoryProductFroms.forEach(item => {
      //     (item.allTotalStart = 0), (item.allTotalEnd = 0), (item.allTotal = 0);
      //     if (item.suitProductFroms) {
      //       item.suitProductFroms.forEach(it => {
      //         if (item.allTotalWeight.toString().split("-")[1]) {
      //           item.allTotalStart +=
      //             Number(item.allTotalWeight.toString().split("-")[0]) +
      //             Number(it.allWeight);
      //           item.allTotalEnd +=
      //             Number(item.allTotalWeight.toString().split("-")[1]) +
      //             Number(it.allWeight);
      //         } else {
      //           item.allTotalWeight += Number(it.allWeight);
      //         }
      //       });
      //     } else {
      //       item.allTotalWeight = item.allTotalWeight;
      //     }
      //     if (
      //       item.suitProductFroms &&
      //       item.allTotalWeight.toString().split("-")[1]
      //     ) {
      //       item.allTotalWeight = `${item.allTotalStart}-${item.allTotalEnd}`;
      //     }
      //     if (!item.allTotalWeight.toString().split("-")[1]) {
      //       item.allTotalWeight += Number(item.allTotalWeight).toFixed(2);
      //     }
      //   });
      // }

      });
    },

    upAudit() {
      let self = this
      this.$axios
        .post(
          this.$portMain +
            "/order/updataBackOrdersByOrderNo?orderNo=" +
            this.orderNo
        )
        .then(res => {
          if (res.data.code === 200) {
            self.$message.success('审批退货单成功，正在刷新！')
            setTimeout(function(){
              self.orderAllData.orderStatus = 2;
              self.stepsActive = this.stepsActive + 1;
              self.$forceUpdate()
            },1000)

          }else{
            self.$message.error(res.data.msg)
          }
        });
    },

    backOrder() {
      let self = this
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let params = {
          PRS: {
            backRemarks: value,
            orderNo: this.orderNo
          }
        };
        this.$axios
          .get(this.$portMain + "/order/backBackOrdersRemarks", params)
          .then(res => {
            if (res.data.code === 200) {
              self.$message.success('审批退货单成功，正在刷新！')
              setTimeout(function(){
                this.orderAllData.orderStatus = 4;
              },1000)
            }else{
              this.$message.error(res.data.msg)
            }
          });
      });
    },
    //添加退货单
    addProFun() {
      var self = this;
      self.addProTF = true;
      self.displayAddProData(1,12)
    },
    displayAddProData(num, size) {
      var self = this;
      let params = {
        PRS: {
          proName: self.search,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/product/proList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //改变查看当差
    changeView(elem){
      elem.viewTF = !elem.viewTF
      this.$forceUpdate();
    },
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  color #333
  padding-bottom 200px
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
  .topMenuRight
    text-align right
  .searchTxt
    flex 1
    width 100%
  .top-select
    display flex
    justify-content center
    align-items center
  .info
    min-height 500px
    background #f5f5f5
    .info-top
      width 100%
      padding 10px 20px
      background #fff
      box-sizing border-box
      .infot-table
        .tr
          display flex
          width 100%
          border 1px solid #E9ECF5
          .th
            display flex
            align-items center
            justify-content center
            height 30px
            width 16%
            text-align center
            background #999999
            color #fff
          .td
            display flex
            justify-content center
            align-items center
            height 80px
            width 16%
            text-align center
          .handle
            display flex
            flex-direction column
            .el-button
              min-width 80px
              margin-left 0
    .info-middle
      margin 20px
      .infom-tit
        padding 0 20px
        line-height 40px
        background #fff
      .infom-info
        margin 10px
        .infom-item
          display flex
  .pro-item
    width 60%
    display flex
    align-items center
    padding 15px 20px
    background #fff
    border 1px solid #E9ECF5
  .pro-imgs
    position relative
    width 153px
    height 116px
  .proimgs-add
    position absolute
    display flex
    top -10px
    left -10px
    padding 10px
    background rgba(0, 0, 0, 0.4)
  .proimgs-add > div > img
    padding-left 10px
  .proimgs-add > div > img:nth-of-type(1)
    padding-left 0
  .pro-item > img
    width 153px
    height 116px
  .pro-right
    width 75%
    display flex
    flex-flow column
    justify-content center
    margin-left 10px
  .pro-tit
    margin 10px 0
    font-size 14px
  .pro-middle
    margin 10px 0
    font-size 12px
    color #999
  .pro-bottom
    margin 10px 0
    font-size 12px
    line-height 14px
    color #333
    
  .iitem-right
    min-width 0%
    flex 1
    min-height 146px
    display flex
    flex-direction column
    font-size 12px
  .order-item
    flex 1
    display flex
    justify-content space-between
    flex-direction column
    .order-tr
      flex 1
      box-sizing border-box
      padding-left 40px
      display flex
      align-items center
      height 30px
      border-bottom 1px solid #E9ECF5
      .otd
        width 200px
        text-align center
    .order-tr:nth-of-type(odd)
      background #FAFAFA
    .order-tr:nth-of-type(even)
      background #ffffff
  .order-th
    box-sizing border-box
    padding-left 40px
    display flex
    align-items center
    height 30px
    background #E9ECF5
    color #666
    .oth
      width 200px
      text-align center
  .redTxt
    color #F20F34
  .steps-list
    margin 20px
  .suit-info
    display flex
    flex-wrap wrap
    padding 20px 50px
    .suiti-item
      width 48%
      .pro-item
        width 100%
        .pro-right
          &> p
            margin-bottom 8px
        .pro-feetype
          font-size 12px
          line-height 14px
          color #999
          span
            margin-right 20px
        .pro-weight
          font-size 12px
          line-height 14px
          color #999
          span
            margin-right 20px
  .tabOne
    border 1px solid #CCCCCC
    background #FAFAFA 100%
    margin-bottom 10px
    .factoryTopDiv
      background #fff
      border-bottom 1px solid #ccc
      padding 10px
      padding-left 20px
      color #333333
      font-size 16px
</style>
