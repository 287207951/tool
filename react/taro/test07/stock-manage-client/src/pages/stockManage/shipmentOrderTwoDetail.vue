<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>出货单(展厅)查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">调拨地点</div>
            <div class="th">调拨出库单号</div>
            <div class="th">下单人</div>
            <div class="th">下单日期</div>
            <div class="th">总数量</div>
            <div class="th">总毛重(g)</div>
            <div class="th">总金量(g)</div>
            <div class="th">状态</div>
            <div class="th" v-if="orderAllData.outstoreStatue == '_wait'">操作</div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">尚金缘展厅</div>
            <div class="td">{{orderAllData.orderCode}}</div>
            <div class="td">{{orderAllData.customerName}}</div>
            <div class="td">{{orderAllData.orderTime}}</div>
            <div class="td">{{orderAllData.amount}}</div>
            <div class="td">{{orderAllData.stockWeight}}</div>
            <div class="td">{{orderAllData.weight}}</div>
            <div class="td">
              <span v-if="orderAllData.outstoreStatue == '_wait'">待出货</span>
              <span v-if="orderAllData.outstoreStatue == '_reject'">已驳货</span>
              <span v-if="orderAllData.outstoreStatue == '_finish'">已出货</span>
            </div>
            <div class="td handle" v-if="orderAllData.outstoreStatue == '_wait'">
              <el-button type="primary" size="mini" @click="upAudit" style="margin-bottom:10px">审批通过</el-button>
              <!-- <el-button
                type="warning"
                size="mini"
                @click="printTabOneFun"
              >退回</el-button>-->
            </div>
          </div>
          <!-- <div
            class="tr "
            style="border: none"
            v-if="false"
          >
            <el-col :span="16">
              <el-steps
                :active="stepsActive"
                finish-status="success"
                class="steps-list"
                v-if="orderAllData.orderType == '_future'"
              >
                <el-step
                  title="步骤 1"
                  size="mini"
                  v-for="(item,index) in result.perFroms"
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
              &nbsp;
            </el-col>
            <el-col :span="2">
              &nbsp;
            </el-col>
            <el-col
              :span="3"
              style="line-height:30px;padding-top:20px;"
            >
              欠款(￥)：<span class="redTxt">{{oweViewData.oweMoney}}</span><br />
              欠料(g):<span class="redTxt">{{oweViewData.oweStock}}</span>
            </el-col>
            <el-col
              :span="3"
              style="line-height:90px;"
            >
              <el-button
                size="small"
                @click="viewOweFun"
              >刷新</el-button>
            </el-col>
          </div>-->
        </div>
        <!-- <div class="tabBig" v-if="false">
          <el-col :span="2">
            <div class="txt14">款账明细：</div>
          </el-col>
          <el-col :span="20">
            <div class="txt14 redTxt">合计人民币(RMB)：￥{{ceditSumNum}}</div>

            <div>
              <div class="iitem-right">
                <div class="order-th">
                  <div class="oth">方式</div>
                  <div class="oth">项目</div>
                  <div class="oth">重量</div>
                  <div class="oth">单价/克</div>
                  <div class="oth">数量</div>
                  <div class="oth">单价/件</div>
                  <div class="oth">金额</div>
                  <div class="oth">备注</div>
                  <div
                    class="oth"
                    v-if="orderAllData.outstoreStatue == '_wait'"
                  >操作</div>
                </div>
                <div class="order-item">
                  <div
                    class="order-tr"
                    v-for="(ielem,indexOne) in ceditDataList"
                    :key="indexOne"
                  >
                    <div class="otd">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-select
                          v-model="ielem.ceditWayName"
                          placeholder="请选择"
                          size="small"
                          class="inputSmallTwo"
                          @change="changeWayName(ielem)"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.paypayVal"
                            :label="item.paypayTxt"
                            :value="item.paypayVal"
                          >
                          </el-option>
                        </el-select>
                      </span>
                      <span v-else>
                        {{ielem.ceditWayName}}
                      </span>
                    </div>
                    <div class="otd">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-autocomplete
                          :disabled="ielem.kindTF"
                          size="small"
                          class="inline-input"
                          v-model="ielem.ceditProject"
                          @focus="focusQuery(indexOne)"
                          :fetch-suggestions="querySearch"
                          :trigger-on-focus="false"
                        ></el-autocomplete>
                      </span>
                      <span v-else>
                        {{ielem.ceditProject}}
                      </span>
                    </div>
                    <div class="otd" style="text-align:right">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-input
                          v-model="ielem.ceditWeight"
                          size="small"
                          class="inputSmall"
                          @change="changeNum(ielem)"
                        ></el-input>
                      </span>
                      <span v-else>
                        {{ielem.ceditWeight}}
                      </span>
                    </div>
                    <div class="otd" style="text-align:right">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-input
                          v-model="ielem.ceditPriceG"
                          size="small"
                          class="inputSmall"
                          @change="changeNum(ielem)"
                        ></el-input>
                      </span>
                      <span v-else>
                        {{ielem.ceditPriceG}}
                      </span>
                    </div>
                    <div class="otd" style="text-align:right">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-input
                          v-model="ielem.ceditAmount"
                          size="small"
                          class="inputSmall"
                          @change="changeNum(ielem)"
                        ></el-input>
                      </span>
                      <span v-else>
                        {{ielem.ceditAmount}}
                      </span>
                    </div>
                    <div class="otd" style="text-align:right">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-input
                          v-model="ielem.ceditPriceJ"
                          size="small"
                          class="inputSmall"
                          @change="changeNum(ielem)"
                        ></el-input>
                      </span>
                      <span v-else>
                        {{ielem.ceditPriceJ}}
                      </span>
                    </div>
                    <div class="otd" style="text-align:right">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-input
                          v-model="ielem.ceditMoney"
                          size="small"
                          class="inputSmallTwo txtRight"
                          @change="changeSumNum"
                        ></el-input>
                      </span>
                      <span v-else>
                        {{ielem.ceditMoney}}
                      </span>
                    </div>
                    <div class="otd">
                      <span v-if="orderAllData.outstoreStatue == '_wait'">
                        <el-input
                          v-model="ielem.ceditNote"
                          size="small"
                          class="inputSmallTwo"
                        ></el-input>
                      </span>
                      <span v-else>
                        {{ielem.ceditNote}}
                      </span>
                    </div>
                    <div
                      class="otd"
                      v-if="orderAllData.outstoreStatue == '_wait'"
                    >
                      <el-button
                        v-if="ielem.isNewTF"
                        type="danger"
                        icon="el-icon-plus"
                        circle
                        size="small"
                        @click="addCeditFun"
                      ></el-button>
                      <el-button
                        v-else
                        icon="el-icon-delete"
                        circle
                        size="small"
                        @click="delCeditFun(indexOne)"
                      ></el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </div>-->
      </div>
      <!-- <div>{{displayTab}}</div> -->
      <!-- <div
        class="info-middle"
        v-if="displayTab == 'baoTrue' || displayTab=='baoThree'"
      >
        <div class="titOne">
          店铺：
          <el-select
            v-model="baoFactInd"
            placeholder="请选择"
            size="small"
            style="width:100px"
            @change="changeFactFun"
          >
            <el-option
              v-for="item in baoViewFenBaoList"
              :key="item.shopId"
              :label="item.shopName"
              :value="item.shopId"
            ></el-option>
          </el-select>
          <span class="titOneLeft">
            总数量：
          </span>
          <span class="titOneLeft">
            总毛重(g)：
          </span>
          <span class="titOneRight">
            <el-button
              type="danger"
              size='small'
            >打印条码</el-button>
          </span>
        </div>
        <div class="titTwo">

          <div>
            打包信息
            <el-row
              v-for="(ielem,indexOne) in baoFactList.JBao"
              :key="indexOne"
              class="titTwoBao"
              @click.native="viewBaoFun(ielem)"
            >
              <span class="txtRight30">包号:{{ielem.baoCode}}</span>
              <span class="txtRight30">总数量：{{ielem.baoAmount}}</span>
              <span class="txtRight30">毛重：{{ielem.baoStockWeight}}</span>
              <span class="txtRight30">净重：{{ielem.baoWeight}}</span>
              <span class="txtRight30">客户名称：{{ielem.baoCustomerName}}</span>
              <span>订单编号：{{ielem.baoOrderCode}}</span>

            </el-row>
          </div>
        </div>

      </div>-->
      <div class="info-middle" v-if="displayTab == 'baoFalse' || displayTab == 'baoZero'">
        <div class="titTwo">
          <div>
            打包信息
            <el-row
              v-for="(ielem,indexOne) in orderAllData.jBaos"
              :key="indexOne+''"
              class="titTwoBao"
            >
              <el-col :span="20">
                <span class="txtRight30" @click="viewBaoFun(ielem)">包号:{{ielem.baoCode}}</span>
                <span class="txtRight30" @click="viewBaoFun(ielem)">总数量：{{ielem.baoAmount}}</span>
                <span class="txtRight30" @click="viewBaoFun(ielem)">毛重：{{ielem.baoStockWeight}}</span>
                <span class="txtRight30" @click="viewBaoFun(ielem)">净重：{{ielem.baoWeight}}</span>
                <span class="txtRight30" @click="viewBaoFun(ielem)">客户名称：{{ielem.baoCustomerName}}</span>
                <span @click="viewBaoFun(ielem)">订单编号：{{ielem.baoOrderCode}}</span>
              </el-col>
              <el-col :span="4">
                <!-- <el-col :span="12">
                  已备注
                </el-col>-->
                <el-col :span="24" class="txtRight">
                  <el-button size="small" @click="printTabOneFun(ielem)">打印</el-button>
                </el-col>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <el-dialog title :visible.sync="viewBaoTF" :close-on-click-modal="false" width="1200px">
        <span>
          <div>
            <el-row class="titTwoBao">
              <el-col :span="3">包号:{{viewBaoHead.baoCode}}</el-col>
              <el-col :span="2">总数量：{{viewBaoHead.baoAmount}}</el-col>
              <el-col :span="2">毛重：{{viewBaoHead.baoStockWeight}}</el-col>
              <el-col :span="2">净重：{{viewBaoHead.baoStockWeight}}</el-col>
              <el-col :span="6">客户名称：{{viewBaoHead.baoCustomerName}}</el-col>
              <el-col :span="4">订单编号：{{viewBaoHead.baoOrderCode}}</el-col>
            </el-row>
          </div>
          <div>
            <div class="info-item-wrap">
              <!-- 单品start -->
              <div class="infom-info" v-for="(item,ind) in baoViewProListOne" :key="ind">
                <!-- {{item}} -->
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
                        <el-col :span="6" class="pro-middle">材质：{{item.pickSkuProp.texTure}}</el-col>
                        <el-col
                          :span="12"
                          class="pro-middle"
                        >表面工艺：{{item.pickSkuProp.surfaceTechnics}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="pro-middle">产品类别：{{item.pickSkuProp.productType}}</el-col>
                        <el-col
                          :span="6"
                          class="pro-middle"
                        >生产工艺：{{item.pickSkuProp.manufacturingTechnique}}</el-col>
                        <el-col
                          :span="12"
                          class="pro-middle"
                        >车花：{{item.pickSkuProp.embroidery?item.pickSkuProp.embroidery:'-'}}</el-col>
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
                        <div class="txtOne">编号：{{ielem.proId}}</div>
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
              <!-- 单品end -->
            </div>
            <div class="pageD">
              <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[12, 30, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="priceSum"
                background
              ></el-pagination>-->
            </div>
          </div>
        </span>
      </el-dialog>
    </div>
    <div ref="printTabOne" v-show="false" style="width:150px">
      <div
        style="line-height:20px;font-size:10px;padding-left:5px;font-weight:bold;font-family:'SimHei'"
      >
        <div style="padding-left:26px">
          <img ref="imgcode" id="imgcode">
          <div style="margin-top:-5px;font-size:14px;">{{baoDisTwoObj.baoCode}}</div>
        </div>
        <div>客户：{{baoDisTwoObj.baoCustomerName}}</div>
        <div>订单编号：{{baoDisTwoObj.baoOrderCode}}</div>
        <div style="display:flex">
          <span>净重：{{baoDisTwoObj.baoWeight}}</span>
          <span style="margin-left:15px">毛重：{{baoDisTwoObj.baoStockWeight}}</span>
          <span style="margin-left:15px">件数：{{baoDisTwoObj.baoAmount}}</span>
        </div>
        <div>说明：</div>
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
      result: {},
      orderNo: "",
      sizeDataList: [{}, {}, {}], //费用规格列表
      baoDataList: [{}, {}, {}], //包规格列表
      viewBaoTF: false, //查看包号弹框
      viewBaoHead: {},
      restaurants: [],
      state1: "",
      state2: "",
      fengBao: false, //是否属分包
      baoFactInd: "",
      baoFactList: {}, //查看工厂分包信息
      baoViewProListOne: [], //查看包产品单品列表
      baoViewProListTwo: [], //查看包产品套装列表
      ceditSumNum: 0,
      ceditDataList: [],
      oweViewData: {}, //查看存欠信息
      baoViewFenBaoList: [], //分包产品列表
      options: [],
      value: "",
      options5: [],
      value10: [],
      ceditInd: 0,
      orderAllData: {},
      LODOP: {},
      skuCeditSum: 0, //出货明细总计
      nowTime: "", //打印时间
      priceTxt: "", //金额总计大写
      displayTab: "", //无分包baoFalse,有分包baoTrue,既有分包又有无分包baoThree
      baoDisTwoObj: {}
    };
  },

  created() {
    this.outstoreId = this.$route.query.outstoreId;
    this.created_fun();
  },

  methods: {
    created_fun() {
      let self = this;
      let params = {
        PRS: {
          outstoreId: self.outstoreId
        }
      };
      this.$axios
        .get(this.$portMain + "/outstore/getSpotOutstore", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderAllData = res.data.data;
            self.orderAllData.outstoreCedits.forEach(ielem => {
              ielem.ceditMoney = self.$api.returnFloat(ielem.ceditMoney);
            });
            self.orderAllData.orderTime = self.$api.dateGetDayTime(
              self.orderAllData.orderTime
            );
            if (!self.orderAllData.pickSkuList) {
              self.orderAllData.pickSkuList = [];
            }
            if (!self.orderAllData.pickShops) {
              self.orderAllData.pickShops = [];
            }
            if (
              self.orderAllData.jBaos.length > 0 &&
              self.orderAllData.pickShops.length === 0
            ) {
              self.displayTab = "baoFalse";
            }
            if (
              self.orderAllData.jBaos.length === 0 &&
              self.orderAllData.pickShops.length > 0
            ) {
              self.displayTab = "baoTrue";
            }
            if (
              self.orderAllData.jBaos.length > 0 &&
              self.orderAllData.pickShops.length > 0
            ) {
              self.displayTab = "baoThree";
            }
            if (
              self.orderAllData.jBaos.length === 0 &&
              self.orderAllData.pickShops.length === 0
            ) {
              self.displayTab = "baoZero";
            }
            // console.log(self.displayTab)
            if (self.displayTab === "baoTrue") {
              self.baoViewFenBaoList = self.orderAllData.pickShops;
              self.baoFactInd = self.baoViewFenBaoList[0].shopName;
              self.baoFactList = self.baoViewFenBaoList[0];
            }
            if (
              self.displayTab === "baoZero" ||
              self.displayTab === "baoFalse"
            ) {
              self.baoFactInd = "";
              self.baoFactList = {};
              self.baoViewFenBaoList = [];
            }
            if (self.displayTab === "baoThree") {
              // let newObj = self.orderAllData.pickSkuList

              self.baoViewFenBaoList = self.orderAllData.pickShops;
              self.baoViewFenBaoList.unshift({
                shopName: self.orderAllData.customerName,
                JBao: self.orderAllData.jBaos,
                pickSkus: []
              });
              self.baoFactInd = self.baoViewFenBaoList[0].shopName;
              self.baoFactList = self.baoViewFenBaoList[0];
            }
            self.ceditDataList = self.orderAllData.outstoreCedits;
            if (self.orderAllData.outstoreStatue == "_wait") {
              self.ceditDataList.push({ isNewTF: true, kindTF: true });
            }

            self.ceditDataList.forEach(ielem => {
              ielem.kindTF = true;
            });
            // self.changeSumNum();
            // console.log(self.orderAllData)
            //查看账款明细
            // self.viewOweFun();
            //查看出货明细
            // self.viewSkuCeditFun();
            // console.log(self.ceditDataList)
          } else {
            self.$message.error(res.data.msg);
          }
        });
      self.viewWay();
      self.result = self.orderAllData;
      // });
    },
    //查看存欠信息
    viewOweFun() {
      let self = this;
      let params = {
        PRS: {
          customerId: self.orderAllData.customerId
        }
      };
      this.$axios
        .get(this.$portMain + "/outstore/getSaveOweMsg", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data)
            if (res.data.data) {
              self.oweViewData = res.data.data;
            } else {
              self.oweViewData = { oweStock: 0, oweMoney: 0 };
            }
          } else {
            self.oweViewData = { oweStock: 0, oweMoney: 0 };
            self.$message.error(res.data.msg);
          }
        });
    },
    //查看出货明细
    viewSkuCeditFun() {
      this.skuCeditSum = 0;
      this.orderAllData.skuCeditGroups.forEach(ielem => {
        this.skuCeditSum += ielem.sku_check_weight;
      });
      this.skuCeditSum = this.$api.returnFloatNum(this.skuCeditSum);
    },
    //查看方式事件
    viewWay() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/findPropPayout")
        .then(function(res) {
          if (res.data.code == 200) {
            self.options = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // //改变项目事件
    // changeWayName(elem) {
    //   elem.kindTF = false;
    //   // console.log(elem)
    // },

    changeNum(elem) {
      // elem.ceditMoney = (elem.ceditWeight * elem.ceditPriceG) +(elem.ceditAmount *elem.ceditPriceJ)
      // this.changeSumNum()
    },
    changeSumNum() {
      this.ceditSumNum = 0;
      this.ceditDataList.forEach(jelem => {
        this.ceditSumNum += parseFloat(jelem.ceditMoney ? jelem.ceditMoney : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    printTabOneFun(elem) {
      let self = this;
      let dom = document.querySelector("#imgcode");
      self.baoDisTwoObj = elem;
      JsBarcode(dom, elem.baoCode, {
        format: "CODE128", //选择要使用的条形码类型
        width: 1, //设置条之间的宽度
        height: 35, //高度
        displayValue: false, //是否在条形码下方显示文字
        font: "fantasy", //设置文本的字体
        textAlign: "center", //设置文本的水平对齐方式
        textPosition: "bottom", //设置文本的垂直位置
        textMargin: 0, //设置条形码和文本之间的间距
        fontSize: 15, //设置文本的大小
        background: "#fff", //设置条形码的背景
        lineColor: "#000", //设置条和文本的颜色。
        margin: 3 //设置条形码周围的空白边距
      });
      setTimeout(function() {
        self.CreateOneFormPage();
        self.LODOP.PREVIEW();
      }, 500);
    },
    CreateOneFormPage() {
      this.LODOP = this.$getLodop();
      this.LODOP.PRINT_INIT("");
      this.LODOP.SET_PRINT_STYLE("FontSize", 10);
      this.LODOP.SET_PRINT_STYLE("Bold", 1);
      this.LODOP.SET_PRINT_PAGESIZE(1, "60mm", "40mm", "");
      this.LODOP.ADD_PRINT_HTM(
        10,
        0,
        760,
        600,
        this.$refs.printTabOne.innerHTML
      );
    },
    upAudit() {
      let self = this;
      // console.log(self.ceditDataList)
      let outstoreCedits = [];
      self.ceditDataList.forEach(item => {
        if (item.ceditWayName && item.ceditWayName != "") {
          if (item.kindTF) {
            self.options.forEach(ielem => {
              if (ielem.paypayTxt === item.ceditWayName) {
                item.ceditWayId = ielem.paypayVal;
                item.ceditWayName = ielem.paypayTxt;
              }
            });
          } else {
            self.options.forEach(ielem => {
              if (ielem.paypayVal === item.ceditWayName) {
                item.ceditWayId = ielem.paypayVal;
                item.ceditWayName = ielem.paypayTxt;
              }
            });
          }
          outstoreCedits.push({
            ceditWayId: item.ceditWayId ? item.ceditWayId : "",
            ceditWayName: item.ceditWayName ? item.ceditWayName : "",
            ceditProject: item.ceditProject ? item.ceditProject : "",
            ceditWeight: item.ceditWeight ? item.ceditWeight : "",
            ceditPriceG: item.ceditPriceG ? item.ceditPriceG : "",
            ceditAmount: item.ceditAmount ? item.ceditAmount : "",
            ceditPriceJ: item.ceditPriceJ ? item.ceditPriceJ : "",
            ceditMoney: item.ceditMoney ? item.ceditMoney : "",
            ceditNote: item.ceditNote ? item.ceditNote : "",
            kindTF: item.kindTF
          });
        }
      });
      let params = {
        outstoreCedits: JSON.stringify(outstoreCedits),
        outstoreId: self.outstoreId
      };
      this.$api.formdataPostFun(
        self.$portMain + "/outstore/confirmOutstoreByExhibit",
        params,
        res => {
          self.$message.success("确认出库成功！");
          setTimeout(function() {
            self.$router.push("shipmentOrder");
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    backOrder() {
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
          .get(this.$portMain + "/orderManage/backOrdersRemarks", params)
          .then(res => {
            if (res.data.code === 200) {
              this.result.orderStatus = 4;
            }
          });
      });
    },
    //切换店铺
    changeFactFun() {
      this.baoViewFenBaoList.forEach(item => {
        if (this.baoFactInd == item.shopId) {
          this.baoFactList = item;
        }
      });
    },
    //查看包号
    viewBaoFun(elem) {
      let self = this;
      self.viewBaoHead = elem;
      let params = {
        outstoreId: self.outstoreId,
        baoId: elem.baoId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/selectSkuBaoByExhibit",
        params,
        res => {
          self.baoViewProListOne = res.data;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
      this.viewBaoTF = true;
    }

    // //添加款账明细
    // addCeditFun() {
    //   let self = this;
    //   self.ceditDataList.forEach(ielem => {
    //     ielem.isNewTF = false;
    //   });
    //   self.ceditDataList.push({ isNewTF: true, kindTF: true });
    //   // console.log(self.ceditDataList)
    // },
    // //删除款账明细
    // delCeditFun(index) {
    //   let self = this;
    //   self.ceditDataList.splice(index, 1);
    //   // console.log(self.ceditDataList)
    // },

    // focusQuery(e) {
    //   this.ceditInd = e;
    // },
    // querySearch(queryString, cb) {
    //   let self = this;
    //   self.ceditDataList[self.ceditInd].propList = [];
    //   let params = {
    //     PRS: {
    //       paypayVal: self.ceditDataList[self.ceditInd].ceditWayName,
    //       search: queryString
    //     }
    //   };
    //   this.$axios
    //     .get(this.$portMain + "/stock/findPropKind", params)
    //     .then(res => {
    //       if (res.data.code === 200) {
    //         // console.log(res.data.data)
    //         var restaurants = [];
    //         if (res.data.data) {
    //           restaurants = res.data.data;
    //           restaurants.forEach(item => {
    //             item.value = item.kindName;
    //           });
    //         } else {
    //           restaurants = [];
    //         }
    //         // var restaurants = this.restaurants;
    //         // console.log(restaurants)
    //         var results = queryString
    //           ? restaurants.filter(this.createFilter(queryString))
    //           : restaurants;
    //         // 调用 callback 返回建议列表的数据
    //         cb(results);
    //       }
    //     });
    // },
    // createFilter(queryString) {
    //   return restaurant => {
    //     return (
    //       restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
    //       0
    //     );
    //   };
    // },

    // handleSelect(item) {
    //
    // }
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

        .infom-item {
          display: flex;
        }
      }
    }
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
    width: 75%;
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

  .txt14 {
    font-size: 14px;
    line-height: 40px;
  }

  .tabBig {
    display: flex;

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
        height: 60px;
        border-bottom: 1px solid #ccc;

        .otd {
          width: 200px;
          text-align: center;
        }
      }

      .order-tr:nth-of-type(odd) {
        background: #ffffff;
      }

      .order-tr:nth-of-type(even) {
        background: #ffffff;
      }
    }
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

  .steps-list {
    margin: 20px;
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

  .infom-info {
    margin: 10px 0;
  }

  .infom-item {
    display: flex;
  }

  .titOne {
    margin: 10px 0;
    background: #fff;
    min-width: 1000px;

    .titOneLeft {
      margin-left: 80px;
    }

    .titOneRight {
      float: right;
      margin-right: 50px;
    }
  }

  .titTwo {
    // border-top 0
    margin: 10 0;
    background: #FAFAFA;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    min-width: 1000px;
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
  }

  .suitDiv {
    width: 100%;
    background: #f0f0f0;
    border: 1px #E9ECF5 100% solid;

    .suitSubDiv {
      padding: 10px;
      margin: 10px 20px;
      background: #fff;

      .pro-middle {
        margin: 0px 0;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .inputSmall {
    width: 80px;
    text-align: center;
  }

  .inputSmallTwo {
    width: 120px;
    text-align: center;
  }

  .txtLeft {
    text-align: left;
  }

  .txtRight {
    text-align: right;
  }

  .txtRight30 {
    margin-right: 50px;
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
}
</style>
