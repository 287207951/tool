<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库验收单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div
              class="th"
              v-for="(item,indOne) in tableMenuData.menuList"
              :key="indOne"
            >{{item.menuName}}</div>
            <div class="th" v-if="orderAllData.billStatue == 'N'">操作</div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div
              class="td"
              v-for="(item,indOne) in tableMenuData.menuList"
              :key="indOne"
            >{{orderList[item.key]}}</div>
            <div class="td" v-if="orderAllData.billStatue == 'N'">
              <el-button type="primary" size="small" @click="addOrder" :loading="btnLoading">提交入库</el-button>
              <el-button
                type="warning"
                size="small"
                @click="cancelOrder"
                style="margin-left:10px"
              >取消</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="info-middle">
        <div>打包信息：</div>
        <div
          v-for="(ielem,indOne) in orderAllData.receivBaos"
          :key="indOne"
          @click="viewBaoTwoFun(ielem)"
        >
          <el-row class="titTwoBao">
            <el-col :span="3">包号:{{ielem.baoCode}}</el-col>
            <el-col :span="5">操作人：{{orderList.creatorName}}</el-col>
            <el-col :span="4">订单编号：{{orderList.orderCode}}</el-col>
            <el-col :span="2">总数量：{{ielem.baoAmount}}</el-col>
            <el-col :span="2">净重：{{ielem.baoStockWeight}}</el-col>
            <el-col :span="3">毛重：{{ielem.baoWeight}}</el-col>
            <el-col :span="5" style="text-align:right"></el-col>
          </el-row>
        </div>
        <el-dialog title :visible.sync="viewBaoTwoTF" :close-on-click-modal="false" width="1290px">
          <el-row class="titTwoBao">
            <el-col :span="2" style="font-weight:bold">打包信息：</el-col>
            <el-col :span="3">包号:{{baoDisTwoObj.baoCode}}</el-col>
            <el-col :span="3">总数量：{{baoDisTwoObj.baoAmount}}</el-col>
            <el-col :span="3">毛重：{{baoDisTwoObj.baoWeight}}</el-col>
            <el-col :span="3">净重：{{baoDisTwoObj.baoStockWeight}}</el-col>
            <el-col :span="6">客户名称：{{orderList.creatorName}}</el-col>
            <el-col :span="4">订单编号：{{orderList.orderCode}}</el-col>
          </el-row>
          <!-- <div
              style="text-align:center"
              v-if="!baoDisTwoObj.receivSkus.length"
            >
              此包暂无产品
          </div>-->
          <div class="info-item-wrap" v-for="(ielem,index) in baoDisTwoObj.receivSkus" :key="index">
            <div class="infom-item">
              <div class="pro-item iitem-left">
                <div class="pro-imgs">
                  <img
                    :src="ielem.receSkuProp.skuPic?$portImg+ielem.receSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                    width="153"
                    height="116"
                  >
                </div>
                <div class="pro-right">
                  <el-row style="height: 32px;">
                    <el-col :span="24" class="pro-tit">{{ielem.receSkuProp.skuName}}</el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col :span="4" class="pro-middle">编号：{{ielem.skuId}}</el-col>
                    <el-col :span="4" class="pro-middle">
                      <span v-if="!ielem.suitTF">材质：{{ielem.receSkuProp.texTure}}</span>&nbsp;
                    </el-col>
                    <el-col :span="4" class="pro-middle">
                      <span v-if="!ielem.suitTF">表面工艺：{{ielem.receSkuProp.surfaceTechnics}}</span>&nbsp;
                    </el-col>
                    <el-col :span="5" class="pro-middle txtTwo">数量：{{ielem.skuAmount}}</el-col>
                    <el-col :span="5" class="pro-middle redTxtOne">实收数量：{{ielem.skuRealAmount}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" class="pro-middle">
                      <span v-if="!ielem.suitTF">产品类别：{{ielem.receSkuProp.productType}}</span>&nbsp;
                    </el-col>
                    <el-col :span="4" class="pro-middle">
                      <span v-if="!ielem.suitTF">生产工艺：{{ielem.receSkuProp.manufacturingTechnique}}</span>&nbsp;
                    </el-col>
                    <el-col :span="4" class="pro-middle">
                      <span
                        v-if="!ielem.suitTF"
                      >车花：{{ielem.receSkuProp.carFlower?ielem.receSkuProp.carFlower:'-'}}</span>&nbsp;
                    </el-col>
                    <el-col :span="5" class="pro-middle txtTwo">净重(g)：{{ielem.skuRealGoldWeight}}</el-col>
                    <el-col :span="5" class="pro-middle redTxtOne">
                      实收净重(g)：{{ielem.skuRealGoldWeight}}
                      <span
                        v-if="ielem.suitTF"
                        style="float:right"
                      >
                        <span class="redTxtOne" v-if="ielem.viewSuit" @click="editSuit(ielem)">
                          详情
                          <i class="el-icon-arrow-up"></i>
                        </span>
                        <span class="redTxtOne" v-if="!ielem.viewSuit" @click="editSuit(ielem)">
                          详情
                          <i class="el-icon-arrow-down"></i>
                        </span>
                      </span>
                    </el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col :span="4" class="pro-bottom">成色：{{ielem.receSkuProp.colorFormer}}</el-col>
                    <el-col :span="4" class="pro-bottom">克重(g): {{ielem.receSkuProp.Weight}}</el-col>
                    <el-col :span="4" class="pro-bottom">
                      <!-- 圈号(#): - -->
                      &nbsp;
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <el-row v-if="ielem.viewSuit">
              <el-col :span="24">
                <el-row class="tabThree">
                  <el-col
                    :span="12"
                    class="tabThreeSubDiv"
                    v-for="(jelem,indOne) in ielem.receSkuProp.map.proList"
                    :key="indOne"
                  >
                    <div class="tabThreeLeft">
                      <!-- {{jelem}} -->
                      <img
                        :src="jelem.pic?$portImg+jelem.pic:'../../../static/images/img-noimg.png'"
                        style="height:116px; width:153px;"
                        @click.stop="showPic(jelem.pic?$portImg+jelem.pic:'../../../static/images/img-noimg.png')"
                      >
                    </div>
                    <div class="tabThreeRight">
                      <el-row>
                        <el-col :span="24">{{jelem.proName}}</el-col>
                        <el-col :span="24" class="pro-middle txtTwo">编号：{{jelem.proNum}}</el-col>
                        <el-col
                          :span="24"
                          class="pro-middle txtTwo"
                        >{{jelem.pait}} {{jelem.carFlower}} {{ielem.craft}}</el-col>
                        <el-col :span="10" class="pro-middle txtTwo">克重(g)：{{jelem.weight}}</el-col>
                        <el-col
                          :span="14"
                          class="pro-middle txtTwo"
                        >
                          <b v-if="jelem.extendAttr && jelem.one" v-html="$api.getAttachProperty(jelem.one,jelem.extendAttr)"></b>&nbsp;
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
        <!-- <div
          class="info-item-wrap"
          v-for="(iitem,index) in orderList.receivSkus"
          :key="index"
        >
            <div class="infom-item">
              <div class="pro-item iitem-left">
                <div class="pro-imgs">
                  <img
                    :src="iitem.receSkuProp.skuPic?$portImg+iitem.receSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                    width="153"
                    height="116"
                  />
                </div>
                <div class="pro-right">
                  <el-row style="height: 32px;">
                    <el-col
                      :span="6"
                      class="pro-tit"
                    >{{iitem.receSkuProp.skuName}}</el-col>
                    <el-col
                      :span="18"
                      class="pro-middle redTxt"
                    >库位：{{iitem.storageNumber}}</el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col
                      :span="4"
                      class="pro-middle"
                    >编号：{{iitem.receSkuProp.skuCode}}</el-col>
                    <el-col
                      :span="4"
                      class="pro-middle"
                    >材质：{{iitem.receSkuProp.texTure}}</el-col>
                    <el-col
                      :span="6"
                      class="pro-middle"
                    >表面工艺：{{iitem.receSkuProp.surfaceTechnics}}</el-col>
                    <el-col
                      :span="5"
                      class="pro-middle redTxtOne"
                    >实收数量：{{iitem.skuRealAmount}}</el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col
                      :span="4"
                      class="pro-middle"
                    >产品类别：{{iitem.receSkuProp.productType}}</el-col>
                    <el-col
                      :span="4"
                      class="pro-middle"
                    >生产工艺：{{iitem.receSkuProp.manufacturingTechnique}}</el-col>
                    <el-col
                      :span="6"
                      class="pro-middle"
                    >车花：{{iitem.receSkuProp.embroidery}}</el-col>
                    <el-col
                      :span="5"
                      class="pro-middle redTxtOne"
                    >实收毛重(g)：{{iitem.skuRealWeight}}</el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col
                      :span="4"
                      class="pro-bottom"
                    >成色：{{iitem.receSkuProp.colorFormer}}</el-col>
                    <el-col
                      :span="10"
                      class="pro-bottom"
                    >克重(g): {{iitem.receSkuProp.Weight}}</el-col>
                    <el-col
                      :span="5"
                      class="pro-middle redTxtOne"
                    >实收净重(g)：{{iitem.skuRealGoldWeight}}</el-col>
                  </el-row>
                </div>
              </div>

            </div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      stepsActive: 1,
      orderList: {},
      result: {},
      orderNo: "",
      editTF: true, //可编辑
      tableMenuData: {}, //菜单显示
      viewBaoTwoTF: false,
      receId: "", //入库单号
      baoDisTwoObj: {}, //点击包展开数据
      orderAllData: [],
      tableDisData: [
        {
          id: 1,
          code: "_cus",
          value: "工厂来货-客单",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "customerName",
              menuName: "客户名称"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "factoryName",
              menuName: "工厂名称"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "制单日期"
            }
          ]
        },
        {
          id: 2,
          code: "_reple",
          value: "工厂来货-补货",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "factoryName",
              menuName: "工厂名称"
            },
            {
              key: "checkName",
              menuName: "质检人"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "制单日期"
            }
          ]
        },
        {
          id: 3,
          code: "_stock",
          value: "料转饰",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "stockType",
              menuName: "金料"
            },

            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "制单日期"
            }
          ]
        },
        {
          id: 4,
          code: "_allotput",
          value: "调拨入库",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "制单日期"
            }
          ]
        },
        {
          id: 5,
          code: "_allotputExhibi",
          value: "展厅入库单",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间"
            }
          ]
        }
      ],
      btnLoading: false
    };
  },

  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
  },

  methods: {
    created_fun() {
      var self = this;
      this.receId = this.$route.query.receId;
      var sarkData = JSON.parse(localStorage.sarkData);
      let params = {
        PRS: {
          receivId: sarkData.receId
        }
      };
      this.$axios
        .get(this.$portMain + "/receiv/order/getReceivFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = JSON.parse(localStorage.sarkData);
            self.orderAllData = res.data.data;
            self.orderList.index = 1;
            self.orderList.checkTime = self.$api.dateGetDayTime(
              self.orderList.checkTime
            );
            // console.log(billStatue)
            switch (self.orderList.billStatue) {
              case "Y":
                self.orderList.billStatueTxt = "已收货";
                break;
              case "N":
                self.orderList.billStatueTxt = "未收货";
                break;
              case "X":
                self.orderList.billStatueTxt = "退回";
                break;
              default:
                self.orderList.billStatueTxt = "";
                break;
            }
            self.orderAllData.receivBaos.forEach((item, ind) => {
              // console.log(item)
              item.receivSkus.forEach(ielem => {
                if (ielem.receSkuProp.map) {
                  ielem.suitTF = true;
                  // console.log(ielem.receSkuProp.map.proList)
                } else {
                  ielem.suitTF = false;
                }
                ielem.viewSuit = false;
              });
              // item.editSkuWeight = item.skuWeight
              // item.editSkuGoldWeight = item.skuGoldWeight
              // item.editSkuAmount = item.skuAmount
              // item.skuEditTF = false;
            });
            // console.log(self.orderAllData.receivBaos)
            self.menuData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //菜单读取事件
    menuData() {
      var self = this;
      self.tableDisData.forEach(item => {
        if (self.orderList.workSatue == item.code) {
          self.tableMenuData = item;
        }
      });
    },
    //查看分包里产品
    viewBaoTwoFun(elem) {
      let self = this;
      self.baoDisTwoObj = elem;
      //
      // if (elem.pickSkuList) {
      //   self.baoDisListThree = elem.pickSkuList;
      // } else {
      //   self.baoDisListThree = [];
      // }
      self.viewBaoTwoTF = true;
    },

    // upAudit() {
    //   var self = this;
    //   let submitTF = false;
    //   let submitList = [];
    //   self.orderList.receivSkus.forEach(item => {
    //     if (!item.skuEditTF) {
    //       submitTF = true;
    //     }
    //     submitList.push({
    //       receSkuId: item.receSkuId,
    //       skuRealAmount: item.editSkuAmount,
    //       skuRealWeight: item.editSkuWeight,
    //       skuRealGoldWeight: item.editSkuGoldWeight,
    //       skuReceStatue: item.skuEditTF ? "Y" : "N"
    //     });
    //   });
    //   if (submitTF) {
    //     self.$message.error("还有未确认的产品，请确认完所有产品再点提交入货");
    //   } else {
    //     let params = {
    //       receivSkus: JSON.stringify(submitList),
    //       receivId: this.orderNo
    //     };
    //     this.$api.formdataPostFun(
    //       self.$portMain + "/receiv/order/confirmReceiv",
    //       params,
    //       res => {
    //         self.$message.success("提交入库成功，正在跳转到入库验收单！");
    //         setTimeout(function() {
    //           self.$router.push("putInOrder");
    //         }, 1000);
    //       },
    //       err => {
    //         self.$message.error(res.msg);
    //       }
    //     );
    //   }
    // },
    handleChange() {
      this.$forceUpdate();
    },
    backOrder() {
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        // let params = {
        //   PRS: {
        //     backRemarks: value,
        //     orderNo: this.orderNo
        //   }
        // };
        // this.$axios
        //   .get(this.$portMain + "/orderManage/backOrdersRemarks", params)
        //   .then(res => {
        //     if (res.data.code === 200) {
        //       this.result.orderStatus = 4;
        //     }
        //   });
      });
    },
    //提交入库
    addOrder() {
      var self = this;
      self.btnLoading = true;
      var params = { receivId: this.receId };
      this.$api.formdataPostFun(
        this.$portMain + "/receiv/order/confirmReceiv",
        params,
        res => {
          self.$message.success("提交入库成功，正在跳转到入库验收单！");
          setTimeout(function() {
            self.btnLoading = false;
            self.$router.push("putInOrder");
          }, 1000);
        },
        err => {
          self.btnLoading = false;
          self.$message.error(err.msg);
        }
      );
    },
    //取消
    cancelOrder() {
      // console.log(this.receId)
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    //确认单个sku
    skuConfirmFun(elem) {
      let self = this;
      elem.skuEditTF = true;
      self.$forceUpdate();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  color: #333;
  padding-bottom: 200px;

  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .topMenuRight {
    text-align: right;
  }

  .searchTxt {
    flex: 1;
    width: 100%;
  }

  .top-select {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info {
    min-height: 500px;

    .info-top {
      width: 100%;
      padding: 10px 20px;
      background: #fff;
      box-sizing: border-box;

      .infot-table {
        .tr {
          display: flex;
          width: 100%;
          border: 1px solid #E9ECF5;

          .th {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            width: 16%;
            text-align: center;
            background: #999999;
            color: #fff;
          }

          .td {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80px;
            width: 16%;
            text-align: center;
          }

          .handle {
            display: flex;
            flex-direction: column;

            .el-button {
              min-width: 80px;
              margin-left: 0;
            }
          }
        }
      }
    }

    .info-middle {
      margin: 20px;

      .infom-tit {
        padding: 0 20px;
        line-height: 40px;
        background: #fff;
      }

      .infom-info {
        margin: 10px;
      }
    }
  }

  .infom-item {
    display: flex;
  }

  .pro-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background: #fff;
    border: 1px solid #E9ECF5;
  }

  .pro-imgs {
    position: relative;
    width: 153px;
    height: 116px;
  }

  .proimgs-add {
    position: absolute;
    display: flex;
    top: -10px;
    left: -10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.4);
  }

  .proimgs-add > div > img {
    padding-left: 10px;
  }

  .proimgs-add > div > img:nth-of-type(1) {
    padding-left: 0;
  }

  .pro-item > img {
    width: 153px;
    height: 116px;
  }

  .pro-right {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin-left: 10px;
  }

  .pro-tit {
    margin: 10px 0;
    font-size: 14px;
  }

  .pro-middle {
    margin: 10px 0;
    font-size: 12px;
    color: #999;
  }

  .pro-bottom {
    margin: 10px 0;
    font-size: 12px;
    line-height: 14px;
    color: #333;
  }

  .iitem-right {
    min-width: 0%;
    flex: 1;
    min-height: 146px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }

  .order-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .order-tr {
      flex: 1;
      box-sizing: border-box;
      padding-left: 40px;
      display: flex;
      align-items: center;
      height: 30px;
      border-bottom: 1px solid #E9ECF5;

      .otd {
        width: 200px;
        text-align: center;
      }
    }

    .order-tr:nth-of-type(odd) {
      background: #FAFAFA;
    }

    .order-tr:nth-of-type(even) {
      background: #ffffff;
    }
  }

  .order-th {
    box-sizing: border-box;
    padding-left: 40px;
    display: flex;
    align-items: center;
    height: 30px;
    background: #E9ECF5;
    color: #666;

    .oth {
      width: 200px;
      text-align: center;
    }
  }

  .redTxt {
    color: #F20F34;
  }

  .redTxtOne {
    color: #F20F34;
    font-weight: bold;
  }

  .steps-list {
    margin: 20px;
  }

  .width70 {
    width: 50px;
    height: 15px;
    margin-top: -13px;
  }

  .confirmBtn {
    margin-top: -13px;
  }

  .suit-info {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 50px;

    .suiti-item {
      width: 48%;

      .pro-item {
        width: 100%;

        .pro-right {
          &> p {
            margin-bottom: 8px;
          }
        }

        .pro-feetype {
          font-size: 12px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }

        .pro-weight {
          font-size: 12px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }
      }
    }
  }

  .titTwoBao {
    background: #F5F5F5;
    font-size: 12px;
    color: #333;
    border: 1px solid #CCCCCC;
    margin: 10px 0;
    line-height: 47px;
    padding: 0 10px;
    min-height: 47px;
    min-width: 990px;
  }

  .tabThree {
    padding: 10px 10px;
    background: rgba(250, 250, 250, 1);
    border: 1px solid #eee;
    border-top: 0;

    .tabThreeSubDiv {
      margin: 10px;
      width: calc(50% - 20px);
      padding: 10px 5px;
      background: #fff;
      display: flex;
      border: 1px solid #f0f0f0;

      .tabThreeLeft {
        width: 170px;
        text-align: center;
      }

      .tabThreeRight {
        width: calc(100% - 170px);
        line-height: 30px;
      }
    }
  }

  .info-item-wrap {
    margin-bottom: 20px;
  }
}
</style>
