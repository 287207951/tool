<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰制单列表</el-breadcrumb-item>
      <el-breadcrumb-item>出工厂饰制单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>

      <div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="outstoreCode" label="出库单号" width="180"></el-table-column>
          <!-- <el-table-column prop="customerName" label="接收客户" width="180"></el-table-column> -->
          <el-table-column prop="customerName" label="接收单位" width="180"></el-table-column>
          <el-table-column prop label="发起单位">
            <template slot-scope="scope">
              <span>尚金缘金库</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="weight" label="毛重(g）"></el-table-column>
          <el-table-column prop="stockWeight" label="净重(g)"></el-table-column>
          <el-table-column prop="createPersonName" label="操作人"></el-table-column>
          <el-table-column prop="createTime" label="制单时间"></el-table-column>
          <el-table-column prop label="订单状态" width="100">
            <template slot-scope="scope">
              <span style="color:#232426">已完成</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <!-- <el-col :span="12">
          <span class="leftTitle">调拨原因：</span>
          <span>调拨原因12</span>
        </el-col>-->
        <el-col :span="24" class="itemRight">
          <!-- <el-button type="danger" size="small" plain>红冲</el-button> -->
          <el-button type="primary" size="small" @click="printFun">打印</el-button>
        </el-col>
        <!-- <el-col :span="12" class="stepWrap">
          <el-steps :active="1" finish-status="success">
            <el-step title="客户" description></el-step>
            <el-step title="调拨出库" description></el-step>
          </el-steps>
        </el-col>
        <el-col :span="24" class="auditor">
          <span class="leftItle">审核人：</span>
          <span>赵庆红（ 2019-03-11 10:25:12）</span>
        </el-col>-->
      </el-row>

      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>出库单号：</span>
            <span>{{orderDetail.outstoreCode}}</span>
          </div>
          <div style="margin-top:14px">
            <span>订单状态：</span>
            <span>已完成</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>接收单位：</span>
            <span>{{orderDetail.customerName}}</span>
          </div>
          <div style="margin-top:14px">
            <span>发起单位：</span>
            <span>尚金缘金库</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注：</span>
            <span
              v-if="orderDetail.note != undefined && orderDetail.note != ''"
            >{{orderDetail.note}}</span>
            <span v-else>--</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div style="display:flex;border: 1px solid #e6ebf5;margin-top: 20px">
      <!-- 表格1 -->
      <div style="width:30%">
        <el-table
          id="tableOne"
          :data="orderDetail.skuCeditGroups"
          show-summary
          :summary-method="getSummaries"
          style="width:100%;"
        >
          <el-table-column label="出货明细" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="sku_product_type"
              label="种类"
            ></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="marketing_type"
              label="营销品类"
            ></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="sku_check_weight"
              label="实收重量(g)"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格2 -->
      <div style="width:70%" class="tableTwoWrap">
        <el-table
          id="tableTwo"
          :data="orderDetail.outstoreCedits"
          show-summary
          :summary-method="getSummaries"
          style="width: 100%;"
        >
          <el-table-column label="账款明细" header-align="center">
            <el-table-column header-align="center" align="center" prop label="结费方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.ceditWayId" placeholder="请选择" size="small" disabled>
                  <el-option
                    v-for="item in modeData"
                    :key="item.paypayVal"
                    :label="item.paypayTxt"
                    :value="item.paypayVal"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditProject" label="项目"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditWeight" label="重量(g)"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditPriceG" label="单价/克"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditAmount" label="数量"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditPriceJ" label="单价/件"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditMoney" label="金额(￥)"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditNote" label="备注"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <div class="tableFooter">
      <div class="itemOne">合计</div>
      <div class="itemTwo">
        <span v-for="(item, index) in tableTwoTotal" :Key="index">{{item}}</span>
      </div>
      <div class="itemThree">
        <span v-for="(item, index) in tableOneTotal" :key="index">{{item}}</span>
      </div>
    </div>-->

    <div class="ULWrap">
      <div
        class="LiWrap"
        v-for="(item,index) in orderDetail.jBaos"
        :key="index"
        @click="getProduct(item.baoId,index)"
      >
        <div>
          <span class="liLeft">包号</span>
          <span>{{item.baoCode}}</span>
        </div>

        <div>
          <span class="liLeft">总数量</span>
          <span>{{item.baoAmount}}</span>
        </div>
        <div>
          <span class="liLeft">净重</span>
          <span>{{item.baoStockWeight}}</span>
        </div>
        <div>
          <span class="liLeft">毛重</span>
          <span>{{item.baoWeight}}</span>
        </div>
        <div>
          <span class="liLeft">打包状态</span>
          <span v-if="item.baoStatue === 'Y'">已打包</span>
          <span v-else>没打包</span>
        </div>
        <div>
          <span class="liLeft">复核毛重：{{item.baoOutstorePurWeight?item.baoOutstorePurWeight:'-'}}</span>
        </div>
      </div>
    </div>

    <!-- 产品数据 -->
    <el-dialog
      title
      :visible.sync="viewBaoTF"
      width="1200px"
      class="productModel"
      :close-on-click-modal="false"
    >
      <span>
        <div>
          <el-row class="titTwoBao">
            <el-col :span="3">包号:{{orderDetail.jBaos[productIndex].baoCode}}</el-col>
            <el-col :span="2">总数量：{{orderDetail.jBaos[productIndex].baoAmount}}</el-col>
            <el-col :span="2">毛重：{{orderDetail.jBaos[productIndex].baoWeight}}</el-col>
            <el-col :span="2">净重：{{orderDetail.jBaos[productIndex].baoStockWeight}}</el-col>
            <el-col :span="6">客户名称：{{orderDetail.jBaos[productIndex].baoCustomerName}}</el-col>
            <el-col :span="4">订单编号：{{orderDetail.jBaos[productIndex].baoOrderCode}}</el-col>
            <el-col :span="5">
              <el-tooltip
                class="item"
                effect="dark"
                :content="orderDetail.jBaos[productIndex].note"
                placement="top"
                v-if="orderDetail.jBaos[productIndex].note != undefined && orderDetail.jBaos[productIndex].note != ''"
              >
                <span style="margin-left:70px">查看备注>></span>
              </el-tooltip>
              <span style="margin-left:70px" v-else>暂无备注</span>
            </el-col>
          </el-row>
        </div>
        <div>
          <div class="info-item-wrap">
            <!-- 单品start -->
            <div class="infom-info" v-for="(item,ind) in productData" :key="ind">
              <!-- 单品 -->
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="item.pickSkuProp.skuPic?$portImg + item.pickSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row>
                      <el-col :span="24" class="pro-tit">{{item.pickSkuProp.skuName}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">编号：{{item.skuId}}</el-col>
                      <el-col
                        :span="6"
                        class="pro-middle"
                        v-if="item.pickSkuProp.productType != '套装'"
                      >材质：{{item.pickSkuProp.texTure}}</el-col>
                      <el-col
                        :span="12"
                        class="pro-middle"
                        v-if="item.pickSkuProp.productType != '套装'"
                      >表面工艺：{{item.pickSkuProp.surfaceTechnics}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">产品类别：{{item.pickSkuProp.productType}}</el-col>
                      <el-col
                        :span="6"
                        class="pro-middle"
                        v-if="item.pickSkuProp.productType != '套装'"
                      >生产工艺：{{item.pickSkuProp.manufacturingTechnique}}</el-col>
                      <el-col
                        :span="12"
                        class="pro-middle"
                        v-if="item.pickSkuProp.productType != '套装'"
                      >
                        <span v-if="item.pickSkuProp.embroidery">车花：{{item.pickSkuProp.embroidery}}</span>&nbsp;
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-bottom">成色：{{item.pickSkuProp.colorFormer}}</el-col>
                    </el-row>
                  </div>
                </div>
                <div class="iitem-right">
                  <div class="order-th">
                    <div class="oth">克重(g)</div>
                    <!-- <div class="oth">重量范围(g)</div> -->
                    <div class="oth">采购数量</div>
                    <div class="oth">备注</div>
                  </div>
                  <div class="order-item">
                    <div class="order-tr">
                      <div class="otd" v-if="item.skuCheckWeight">{{item.skuCheckWeight}}</div>
                      <!-- <div class="otd">{{item.weightStart}} - {{item.weightEnd}}</div> -->
                      <div class="otd">{{item.skuCheckAmount}}</div>
                      <div class="otd">
                        &nbsp;
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="11"
                          placement="top"
                          v-if="false"
                        >
                          <span>查看备注>></span>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 套装 -->
              <div v-if="item.pickSkuProp.productType== '套装'" class="divThree">
                <el-row>
                  <el-col
                    :span="11"
                    class="divThreeSub"
                    v-for="(ielem,indOne) in item.pickSkuProp.map.proList"
                    :key="indOne"
                  >
                    <div class="pro-imgs">
                      <img
                        :src="ielem.pic?$portImg + ielem.pic:'../../../static/images/img-noimg.png'"
                        width="153"
                        height="116"
                      >
                    </div>
                    <div class="pro-right">
                      <div>{{ielem.name}}</div>
                      <div class="txtOne">编号：{{ielem.factoryNumber}}</div>
                      <div
                        class="txtOne"
                      >{{ielem.processCode}}{{ielem.effect?','+ielem.effect:''}}{{ielem.theme?','+ielem.theme:''}}</div>
                      <div class="txtOne">
                        <el-row>
                          <el-col :span="12">克重(g)：{{ielem.weight}}</el-col>
                          <el-col :span="12">
                            <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </span>
    </el-dialog>
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPOne :billData="allData" ref="myComp"></PrintTPOne>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: {}, //打印数据
      loadingState: false,
      modeData: [], //结费方式数据
      tableTwoTotal: [], //表格2合计
      tableOneTotal: [], //表格1合计
      viewBaoTF: false,
      orderTable: [], //头部表格
      outStoreId: "", //出库单的属性id
      productData: [], //产品数据
      productIndex: 0, //选中产品下标
      promptType: false,
      orderDetail: {
        jBaos: [
          {
            baoCode: "",
            baoAmount: "",
            baoWeight: "",
            baoStockWeight: "",
            baoCustomerName: "",
            baoOrderCode: ""
          }
        ]
      },
      retreatNumber: "",
      retreatNumber: "",
      mock: "",
      data: [
        {
          label: 12,
          label1: 66
        }
      ],
      totalWeight: 0,
      nowTime: "",
      priceTxt: "",
      ceditSumNum: 0
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.outStoreId = this.$route.query.outStoreId;
      this.getOrderDetail();
      this.findPropPayout();
    },

    getOrderDetail() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          outstoreId: this.outStoreId
        }
      };

      this.$axios
        .get(this.$portMain + "/outstore/getSpotOutstore", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderTable = [];
            self.orderDetail = res.data.data;
            if (self.orderDetail.createTime != undefined) {
              self.orderDetail.createTime = self.$api.dateGetDayTime(
                self.orderDetail.createTime
              );
            }
            self.orderTable.push(self.orderDetail);
            self.loadingState = false;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    //获取结费方式数据
    findPropPayout() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/findPropPayout")
        .then(function(res) {
          if (res.data.code == 200) {
            self.modeData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "实收重量(g)" || column.label === "金额(￥)") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                let res = (Number(prev) + Number(curr)).toFixed(2);
                return res;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    },
    //查询包产品数据
    getProduct(baoId, index) {
      let self = this;
      let params = {
        outstoreId: this.outStoreId,
        baoId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/selectSkuBaoByExhibit",
        params,
        res => {
          self.productData = res.data;
          self.viewBaoTF = true;
          self.productIndex = index;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //打印
    printFun() {
      this.allData = JSON.parse(JSON.stringify(this.orderDetail));
      this.allData.sponsorUnit = "尚金缘金库";
      this.$refs.myComp.compPrintFun();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.outOfStock {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .itemRight {
    text-align: right;
  }

  .itemFirst {
    margin-top: 40px;
    margin-bottom: 20px;
    line-height: 32px;
    font-size: 14px;

    span:first-child {
      color: #8A9199;
    }

    span:last-child {
      color: #222426;
    }

    .noteStyle {
      // display: flex;
      // justify-content: flex-end;
      // margin-top 10px
    }
  }

  .bigLine {
    height: 16px;
    background: #e6ebf5;
  }

  .reasonWrap {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(35, 36, 38, 1);
    padding-top: 19px;

    .leftTitle {
      color: #8A9199;
    }
  }

  .stepWrap {
    margin-top: 38px;
  }

  .container {
    padding-top: 24px;

    .productWarp {
      // width: 1px;
      height: 120px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 241, 255, 1);
      box-sizing: border-box;
      display: flex;
      padding: 16px 24px 14px 24px;
      margin-bottom: 8px;

      .productPic {
        width: 120px;
        height: 90px;
      }

      .productDes {
        // display: inline-block;
        margin-left: 16px;
        height: 76px;
        width: 100%;
        display: flex;

        .proTitel {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          margin-bottom: 11px;
        }

        .proUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          // margin-right: 224px;
          width: 24%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .SUKUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
        }

        .proLI {
          margin-bottom: 11px;

          .left {
            color: #889199;
          }

          .right {
          }
        }
      }
    }
  }

  .auditor {
    margin-top: 14px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(46, 48, 51, 1);

    .leftItle {
      color: #8A9199;
    }
  }

  .ULWrap {
    margin-top: 32px;
    margin-bottom: 8px;

    .title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(35, 36, 38, 1);
    }

    .orderNumWrap {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(35, 36, 38, 1);
      display: flex;
      margin: 19px 0 16px 0;

      .leftTitle {
        color: #8A9199;
      }
    }

    .LiWrap {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: rgba(35, 36, 38, 1);
      background: #E4EAF0;
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      margin-bottom: 4px;
      cursor: pointer;

      &>div {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .liLeft {
        color: #8A8E99;
        margin-right: 16px;
      }
    }
  }

  .tableFooter {
    display: flex;
    align-items: center;
    height: 48px;
    border-bottom: 1px solid #e6ebf5;
    border-left: 1px solid #e6ebf5;
    border-right: 1px solid #e6ebf5;
    background: #f5f7fa;
    color: rgb(135, 141, 153);
    font-size: 14px;

    .itemOne {
      flex: 0 0 50px;
      text-align: center;
    }

    .itemTwo {
      // flex: 15;
      display: flex;
      align-items: center;
      height: 100%;
      width: 27%;

      // border-right: 1px solid red;
      span {
        flex: 1;
        padding-left: 12px;
        text-align: center;
      }
    }

    .itemThree {
      display: flex;
      // flex: 16;
      width: 70%;

      span {
        flex: 1;
        // padding-left: 16px;
        text-align: center;
      }
    }
  }

  .productModel {
    .titTwoBao {
      background: #F5F5F5;
      font-size: 12px;
      color: #333;
      border: 1px solid #CCCCCC;
      margin: 10px 0;
      line-height: 47px;
      padding: 0 10px;
      min-height: 47px;
    }

    .infom-info {
      margin: 10px 0;
    }

    .infom-item {
      display: flex;
    }

    .pro-item {
      width: 60%;
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

    .pro-right {
      width: 75%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-left: 10px;
    }

    .iitem-right {
      min-width: 0%;
      flex: 1;
      min-height: 146px;
      display: flex;
      flex-direction: column;
      font-size: 12px;
    }

    .divThree {
      border: 1px solid #ccc;
      border-top: 0;

      .divThreeSub {
        margin: 10px;
        display: flex;
        border: 1px solid #f0f0f0;
        line-height: 24px;
      }

      .txtOne {
        font-size: 12px;
        color: #999;
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

        &:nth-of-type(odd) {
          background: #FAFAFA;
        }

        &:nth-of-type(even) {
          background: #ffffff;
        }

        .otd {
          width: 200px;
          text-align: center;
        }
      }
    }

    .pro-middle {
      margin: 0px 0;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>

<style>
/* .outOfStock #tableOne .el-table__footer-wrapper {
  display: none;
}

.outOfStock #tableTwo .el-table__footer-wrapper {
  display: none;
} */

.outOfStock .tableTwoWrap .el-table--border td {
  padding: 7px 0px;
}

.outOfStock .tableTwoWrap .el-table__footer-wrapper td {
  padding: 12px 0px;
}
</style>

