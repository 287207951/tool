<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>展厅</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库列表</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info" v-loading="webLoadingTF">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">调拨单号</div>
            <div class="th">发起单位</div>
            <div class="th">接收客户</div>
            <div class="th">调拨数量</div>
            <!-- <div class="th">毛重(g)</div> -->
            <div class="th">净重(g)</div>
            <div class="th">操作人</div>
            <div class="th">操作日期</div>
            <div class="th">订单状态</div>
            <div class="th" v-if="false"></div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{sarkData.orderNo}}</div>
            <div class="td">
              <span v-if="sarkData.sponsor == undefined">-</span>
              <span v-if="sarkData.sponsor == 'A'">尚金缘金库</span>
              <span v-if="sarkData.sponsor == 'B'">尚金缘物流</span>
              <span v-if="sarkData.sponsor == 'C'">尚金缘展厅</span>
              <span v-if="sarkData.sponsor == 'D'">天津或者杭州工厂</span>
            </div>
            <div class="td">
              <span v-if="sarkData.putType == undefined">-</span>
              <span v-if="sarkData.putType == '1'">尚金缘展厅</span>
              <span v-if="sarkData.putType == '2'">尚金缘金库</span>
            </div>
            <div class="td">{{sarkData.orderTotalSum}}</div>
            <!-- <div class="td">{{sarkData.totailOrderWeight}}</div> -->
            <div class="td">{{sarkData.totailGoldWeight}}</div>
            <div class="td">{{sarkData.operateUser}}</div>
            <div class="td">{{sarkData.orderCreateTime}}</div>

            <div class="td">
              <span v-if="sarkData.orderStatus == undefined">-</span>
              <span v-if="sarkData.orderStatus == '1'" class="yellowColor">待签收</span>
              <span v-if="sarkData.orderStatus == '2'" class="blackColor">已通过</span>
              <span v-if="sarkData.orderStatus == '4'" class="redColor">已驳回</span>
              <span v-if="sarkData.orderStatus == '6'" class="blackColor">已签收</span>
              <span v-if="sarkData.orderStatus == '11'" class="redColor">已作废</span>
            </div>

            <div class="td handle" v-if="false">
              <el-button
                type="primary"
                size="mini"
                @click="upAudit"
                :loading="loadingTF"
                v-if="sarkData.orderStatus == '1'"
              >提交审批</el-button>
              <el-button
                type="warning"
                style="margin-top: 10px"
                size="mini"
                @click="backOrder"
                :loading="loadingTF"
                v-if="sarkData.orderStatus == '1'"
              >退回</el-button>
            </div>
          </div>
          <!-- <div class="tr tabTwo">
            <div
              class="td tabTwoS"
              style="height:30px; padding:10px;padding-left:20px;width:100%;justify-content:left"
            >
              备注：
            </div>
          </div>-->
          <!-- <div
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
                  v-for="(item,index) in orderData.perFroms"
                  :key="index+''"
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
          </div>-->
        </div>
      </div>
      <div class="info-middle divOne">
        单据详情
        <span class="floatRight" v-if="true">
          <el-button
            type="warning"
            size="small"
            @click="cancelOrder"
            v-if="sarkData.orderStatus == '1'"
          >作废</el-button>
          <el-button type="danger" size="small" @click="printFun" v-if="proMarkData.length != 0">打印</el-button>
        </span>
      </div>
      <div class="info-middle">
        <el-row class="divTwo">
          <el-col :span="6">
            调拨单号：
            <span>{{sarkData.orderNo}}</span>
          </el-col>
          <el-col :span="6">
            接收单位：
            <span v-if="sarkData.putType == undefined">-</span>
            <span v-if="sarkData.putType == '1'">尚金缘展厅</span>
            <span v-if="sarkData.putType == '2'">尚金缘金库</span>
          </el-col>
          <el-col :span="6">
            发起单位：
            <span v-if="sarkData.sponsor == undefined">-</span>
            <span v-if="sarkData.sponsor == 'A'">尚金缘金库</span>
            <span v-if="sarkData.sponsor == 'B'">尚金缘物流</span>
            <span v-if="sarkData.sponsor == 'C'">尚金缘展厅</span>
            <span v-if="sarkData.sponsor == 'D'">尚金缘展厅</span>
          </el-col>
          <el-col :span="6">
            备注：
            <span>{{sarkData.orderRemarks?sarkData.orderRemarks:'-'}}</span>
          </el-col>
        </el-row>
        <el-table
          v-if="proMarkData.length != 0"
          :data="proMarkData"
          border
          show-summary
          :header-cell-style="{
                'background-color': '#EBF1F7',
                'color': '#8A8E99',
            }"
          :summary-method="getSummaries"
          style="width: 100%"
        >
          <el-table-column prop="species" align="center" label="种类"></el-table-column>
          <el-table-column prop="category" align="center" label="营销品类"></el-table-column>
          <!-- <el-table-column prop="weight" align="center" label="毛重"></el-table-column> -->
          <el-table-column prop="purWeight" align="center" label="净重"></el-table-column>
          <el-table-column prop="purity" align="center" label="成色"></el-table-column>
          <el-table-column prop="suttleWeight" align="center" label="折重"></el-table-column>
          <el-table-column prop="priceG" align="center" label="单价/克"></el-table-column>
          <el-table-column prop="sum" align="center" label="数量"></el-table-column>
          <el-table-column prop="priceJ" align="center" label="单价/件"></el-table-column>
          <el-table-column prop="money" align="center" label="金额"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" width="200px"></el-table-column>
        </el-table>
      </div>
      <div v-if="orderData.receiptPacks && orderData.receiptPacks.length > 0">
        <div class="baoTabOne" v-for="(ielem,indOne) in orderData.receiptPacks" :key="indOne">
          <el-row>
            <el-col :span="4" class="divOne">
              包号：
              <span class="blackColor">{{ielem.packNo}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              备注：
              <span class="blackColor">{{ielem.packRemarks}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              总数量：
              <span class="blackColor">{{ielem.orderSum}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              净重：
              <span class="blackColor">{{ielem.totailGoldWeight}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              打包毛重：
              <span class="blackColor">{{ielem.totailOrderWeight}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              打包状态：
              <span class="blackColor">已打包</span>
            </el-col>
            <el-col :span="5" class="divOne">
              <span
                v-if="ielem.receiptOrderProducts.length > 0 || ielem.receiptSuitOrderFroms.length > 0"
                class="divTwo"
              >
                <i class="el-icon-arrow-up" v-if="ielem.viewSuit" @click="editSuit(ielem)"></i>
                <i class="el-icon-arrow-down" v-if="!ielem.viewSuit" @click="editSuit(ielem)"></i>
              </span>
            </el-col>

            <el-col
              :span="24"
              v-if="ielem.viewSuit && ielem.receiptOrderProducts.length > 0"
              class="baoTabTwo"
            >
              <el-row
                :class="indOne==0?'baoProTwo':'baoProThree'"
                v-for="(jelem,indOne) in ielem.receiptOrderProducts"
                :key="indOne"
              >
                <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
                <el-col :span="3">
                  <img
                    :src="jelem.productImg?$portImg+jelem.productImg:'../../../static/images/img-noimg.png'"
                    style="height:90px; width:120px;margin-top:10px"
                    @click.stop="showPic(jelem.productImg?$portImg+jelem.productImg:'../../../static/images/img-noimg.png')"
                  >
                </el-col>
                <el-col :span="20" style="line-height:36px;">
                  <el-row>
                    <el-col :span="4">
                      <span class="blackColor">{{jelem.productName}}</span>
                    </el-col>
                    <el-col :span="4">
                      产品成色：
                      <span class="blackColor">{{jelem.productCs}}</span>
                    </el-col>
                    <el-col :span="8">
                      产品类别：
                      <span class="blackColor">{{jelem.productTypeName}}</span>
                    </el-col>
                    <el-col :span="8">
                      选择数量：
                      <span class="blackColor">
                        <span>{{jelem.skuSum}}</span>
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      编号：
                      <span class="blackColor">{{jelem.skuNum}}</span>
                    </el-col>
                    <el-col :span="12">
                      产品材质：
                      <span class="blackColor">{{jelem.goldCode}}</span>
                    </el-col>
                    <el-col :span="5">
                      复核毛重：
                      <span class="blackColor">
                        <span>{{jelem.totailWeight}}g</span>
                      </span>
                    </el-col>
                    <el-col :span="3">
                      <span
                        class="redColor"
                        v-if="!jelem.editTF"
                        @click="editJelem(jelem,ielem)"
                        v-show="ielem.newTF"
                      >编辑</span>
                      <span
                        class="redColor"
                        v-if="jelem.editTF"
                        @click="editJelem(jelem,ielem)"
                        v-show="ielem.newTF"
                      >保存</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      克重：
                      <span class="blackColor">{{jelem.standardGold}}g</span>
                    </el-col>
                    <el-col :span="12">
                      生产工艺：
                      <span class="blackColor">{{jelem.craft}}</span>
                    </el-col>
                    <el-col :span="5">
                      复核净重：
                      <span class="blackColor">
                        <span>{{jelem.goldWeight}}</span>g
                      </span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :span="24"
              v-if="ielem.viewSuit && ielem.receiptSuitOrderFroms.length > 0"
              class="baoTabTwo"
            >
              <el-row
                :class="indOne==0?'baoProTwo':'baoProThree'"
                v-for="(jelem,indOne) in ielem.receiptSuitOrderFroms"
                :key="indOne"
              >
                <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
                <el-col :span="3">
                  <img
                    :src="jelem.productImg?$portImg+jelem.productImg:'../../../static/images/img-noimg.png'"
                    style="height:90px; width:120px;margin-top:10px"
                    @click.stop="showPic(jelem.productImg?$portImg+jelem.productImg:'../../../static/images/img-noimg.png')"
                  >
                </el-col>
                <el-col :span="20" style="line-height:36px;">
                  <el-row>
                    <el-col :span="8">
                      <span class="blackColor">{{jelem.productName}}</span>
                    </el-col>
                    <el-col :span="8">
                      产品类别：
                      <span class="blackColor">套装</span>
                    </el-col>
                    <el-col :span="7">
                      选择数量：
                      <span class="blackColor">
                        <span>{{jelem.skuSum}}</span>
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16">
                      编号：
                      <span class="blackColor">{{jelem.skuNum}}</span>
                    </el-col>
                    <el-col :span="4">
                      库存毛重：
                      <span class="blackColor">
                        <span>{{jelem.skuWeight}}g</span>
                      </span>
                    </el-col>
                    <el-col :span="3">
                      <span
                        class="redColor"
                        v-if="!jelem.editTF"
                        @click="editJelem(jelem,ielem)"
                        v-show="ielem.newTF"
                      >编辑</span>
                      <span
                        class="redColor"
                        v-if="jelem.editTF"
                        @click="editJelem(jelem,ielem)"
                        v-show="ielem.newTF"
                      >保存</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16">&nbsp;</el-col>
                    <el-col :span="5">
                      库存净重：
                      <span class="blackColor">
                        <span>{{jelem.goldWeight}}</span>g
                      </span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="info-middle">
        <div class="infom-info" v-for="(item,ind) in orderData.transfOrderProducts" :key="ind">
          <div class="infom-item">
            <div class="pro-item">
              <div class="pro-imgs">
                <img
                  :src="item.productImg?$portImg+item.productImg:'../../../../static/images/img-noimg.png'"
                  width="153"
                  height="116"
                >
              </div>
              <div class="pro-right">
                <el-row>
                  <el-col :span="6" class="pro-tit">{{item.productName}}</el-col>
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.productCs">
                      产品成色：
                      <span class="blackColor">{{item.productCs}}</span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.productTypeName">
                      产品类别：
                      <span class="blackColor">{{item.productTypeName}}</span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.orderSum">
                      选择数量：
                      <span class="blackColor">{{item.orderSum}}</span>
                    </span>&nbsp;
                    <el-tooltip
                      :content="item.productRemarks"
                      placement="top"
                      effect="light"
                      v-if="item.productRemarks"
                    >
                      <el-button size="small">已备注</el-button>
                    </el-tooltip>
                  </el-col>
                </el-row> 
                <el-row>
                  <el-col :span="6" class="pro-middle">
                    编号：
                    <span class="blackColor">{{item.skuNum}}</span>
                  </el-col>
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.goldCode">
                      产品材质：
                      <span class="blackColor">{{item.goldCode}}</span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.carFlower">
                      车花：
                      <span class="blackColor">{{item.carFlower}}</span>
                    </span>&nbsp;
                  </el-col>

                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.totailWeight">
                      毛重(g)：
                      <span class="blackColor">{{item.totailWeight}}</span>
                    </span>&nbsp;
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.standardGold">
                      克重(g):
                      <span class="blackColor">{{item.standardGold}}</span>
                    </span>&nbsp;
                  </el-col>
                  <!-- <el-col :span="6" class="pro-middle">
                    <span v-if="item.pait">表面工艺：<span class="blackColor">{{item.pait}}</span></span>&nbsp;
                  </el-col>-->
                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.craft">
                      生产工艺：
                      <span class="blackColor">{{item.craft}}</span>
                    </span>&nbsp;
                  </el-col>

                  <el-col :span="6" class="pro-middle">
                    <b
                      v-if="item.extendAttr && item.one"
                      v-html="$api.getAttachProperty(item.one,item.extendAttr)"
                    ></b>&nbsp;
                  </el-col>

                  <el-col :span="6" class="pro-middle">
                    <span v-if="item.goldWeight">
                      净重(g)：
                      <span class="blackColor">{{item.goldWeight}}</span>
                    </span>&nbsp;
                  </el-col>
                </el-row>
                <el-row></el-row>
              </div>
            </div>
          </div>
        </div>
        <!-- 单品end -->
        <!-- 套装start -->
        <div class="infom-info" v-for="(item,ind) in orderData.transfSuitProductFroms" :key="ind">
          <div class="infom-item">
            <div class="pro-item">
              <div class="pro-imgs">
                <img
                  :src="item.productImg?$portImg+item.productImg:'../../../../static/images/img-noimg.png'"
                  width="153"
                  height="116"
                >
              </div>
              <div class="pro-right">
                <el-row>
                  <el-col :span="18" class="pro-tit">{{item.productName}}</el-col>
                  <!-- <el-col
                    :span="10"
                    class="pro-middle redTxt"
                  >库位：{{item.location}}</el-col>-->
                  <el-col :span="6" class="pro-middle redTxt txtRight">
                    <el-tooltip
                      :content="item.productRemarks"
                      placement="top"
                      effect="light"
                      v-if="item.productRemarks"
                    >
                      <el-button size="small">已备注</el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="18" class="pro-middle">
                    编号：
                    <span class="blackColor">{{item.productSkuNum}}</span>
                  </el-col>
                  <el-col :span="4" class="pro-middle">
                    毛重(g)：
                    <span class="blackColor">{{item.totailOrderWeight}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" class="pro-middle">
                    产品类别：
                    <span class="blackColor">套装</span>
                  </el-col>
                  <el-col :span="4" class="txtFive">
                    <span v-if="item.goldWeight" class="pro-middle">
                      净重(g)：
                      <span class="blackColor">{{item.goldWeight}}</span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="2" class="redTxt">
                    <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">
                      详情
                      <i class="el-icon-arrow-up"></i>
                    </span>
                    <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">
                      详情
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" class="pro-middle"></el-col>
                  <el-col :span="6" class="txtFive">
                    数量：
                    <span class="blackColor">{{item.orderSum}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="suitDiv" v-if="item.viewSuit">
            <el-row>
              <el-col
                :span="11"
                class="suitSubDiv"
                v-for="(ielem,indTwo) in item.transfOrderProducts"
                :key="indTwo+''"
              >
                <div class="pro-item">
                  <div class="pro-imgs">
                    <img
                      :src="ielem.productImg?$portImg+ielem.productImg:'../../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row>
                      <el-col :span="11" class="pro-tit">{{ielem.productName}}</el-col>
                      <el-col :span="13" class="pro-middle redTxt txtRight">
                        <el-tooltip
                          :content="ielem.productRemarks"
                          placement="top"
                          effect="light"
                          v-if="ielem.productRemarks"
                        >
                          <el-button size="small">已备注</el-button>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8" class="pro-middle">
                        编号：
                        <span class="blackColor">{{ielem.skuNum}}</span>
                      </el-col>
                      <el-col :span="5" class="pro-middle">
                        材质：
                        <span class="blackColor">{{ielem.goldCode}}</span>
                      </el-col>
                      <el-col :span="7" class="pro-middle">
                        表面工艺：
                        <span class="blackColor">{{ielem.pait}}</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8" class="pro-middle">
                        产品类别：
                        <span class="blackColor">{{ielem.productType}}</span>
                      </el-col>
                      <el-col :span="5" class="pro-middle">
                        生产工艺：
                        <span class="blackColor">{{ielem.craft}}</span>
                      </el-col>
                      <el-col :span="7" class="pro-middle">
                        <b v-if="ielem.carFlower">
                          车花：
                          <span class="blackColor">{{ielem.carFlower?ielem.carFlower:'-'}}</span>
                        </b>&nbsp;
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8" class="pro-middle">
                        成色：
                        <span class="blackColor">{{ielem.productCs}}</span>
                      </el-col>
                      <el-col :span="5" class="pro-middle">
                        克重(g):
                        <span class="blackColor">{{ielem.standardGold}}</span>
                      </el-col>
                      <el-col :span="7" class="pro-bottom">
                        <b
                          v-if="ielem.extendAttr && ielem.productType"
                          v-html="$api.getAttachProperty(ielem.productType,ielem.extendAttr)"
                        ></b>&nbsp;
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 套装end -->
      </div>
    </div>
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPFour :billData="allData" ref="myComp"></PrintTPFour>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: {
        customerName: "",
        newTitme: new Date().getTime()
      },
      stepsActive: 1,
      orderList: [],
      result: {},
      orderNo: "",
      orderData: {}, //订单详情
      loadingTF: false,
      webLoadingTF: false,
      proMarkData: []
    };
  },

  created() {
    this.sarkData = JSON.parse(localStorage.sarkData);
    this.orderNo = this.sarkData.orderNo;
    this.created_fun();
  },

  methods: {
    created_fun() {
      let self = this;
      self.webLoadingTF = true;
      let params = {
        orderNo: self.orderNo
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/selectGoldOrderTrandfByOrderNo",
        params,
        res => {
          if (res.code == 200) {
            self.webLoadingTF = false;
            self.orderData = res.data;
            // console.log(JSON.parse(self.orderData.martExter).tabRight)
            if (self.orderData.martExter) {
              self.proMarkData = JSON.parse(self.orderData.martExter).tabRight
                ? JSON.parse(self.orderData.martExter).tabRight
                : [];
            } else {
              self.proMarkData = [];
            }

            // console.log(self.proMarkData)
            if (self.orderData.transfOrderProducts) {
              self.orderData.transfOrderProducts.forEach(ielem => {
                // console.log(ielem.extendAttr)
                ielem.sizeData = JSON.parse(ielem.extendAttr);
                ielem.viewSuit = false;
              });
            } else {
              self.orderData.transfOrderProducts = [];
            }
            if (self.orderData.transfSuitProductFroms) {
              self.orderData.transfSuitProductFroms.forEach(ielem => {
                // console.log(ielem.transfOrderProducts)
                ielem.transfOrderProducts.forEach(jelem => {
                  jelem.sizeData = JSON.parse(jelem.extendAttr);
                  jelem.viewSuit = false;
                });
                // ielem.sizeData = JSON.parse(ielem.extendAttr)
                // ielem.viewSuit = false
              });
            } else {
              self.orderData.transfSuitProductFroms = [];
            }
            let stepAc = "";
            if (!self.orderData.perFroms) {
              self.orderData.perFroms = [];
            } else {
              for (var i = 0; i < self.orderData.perFroms.length; i++) {
                if (self.orderData.perFroms[i].orderStatus === 1) {
                  stepAc = i + 1;
                  break;
                }
              }
            }

            if (stepAc) {
              this.stepsActive = stepAc;
            } else {
              this.stepsActive = self.orderData.perFroms.length + 1;
            }
            self.orderData.perFroms.unshift({
              prcessName: "客户",
              step: 1,
              orderStatus: 1,
              processTypeFroms: [
                {
                  operateName: self.sarkData.operateUser
                }
              ]
            });
            // console.log(self.sarkData.operateUser)
            //
          } else {
            self.$message.error(res.msg);
            //
          }
        },
        err => {
          self.webLoadingTF = false;
        }
      );
    },
    //提交审核
    upAudit() {
      var self = this;
      self.loadingTF = true;
      let params = {
        orderNo: this.orderNo
      };
      this.$api.formdataPostFun(
        self.$portMain + "/order/updataTrandfOrdersByOrderNo",
        params,
        res => {
          if (res.code === 200) {
            self.loadingTF = false;
            self.$message.success("提交审批成功！");
            setTimeout(function() {
              // self.created_fun();
              self.$router.push("allotOrderOpera");
            }, 1000);
          }
        },
        err => {
          self.loadingTF = false;
        }
      );
    },

    backOrder() {
      var self = this;
      self.loadingTF = true;
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        if (value) {
          self.orderNo = JSON.parse(localStorage.sarkData).orderNo;
          let params = { orderNo: self.orderNo, backRemarks: value };
          this.$api.formdataPostFun(
            self.$portMain + "/order/backTrandfOrdersRemarks",
            params,
            res => {
              self.loadingTF = true;
              self.$message.success("退回调拨单成功，正在刷新！");
              setTimeout(function() {
                // self.created_fun();
                self.$router.push("allotOrderOpera");
              }, 1000);
            }
          );
        } else {
          self.loadingTF = false;
          self.$message.error("驳回原因不能为空！");
        }
      });
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    addImg() {},
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          column.label === "数值 1" ||
          column.label === "净重" ||
          column.label === "折重" ||
          column.label === "数量" ||
          column.label === "金额"
        ) {
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
    //作废
    cancelOrder() {
      let self = this;
      var params = { PRS: { orderNo: self.orderNo } };
      this.$axios
        .get(self.$portMain + "/order/updateHollOrderStatus", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("此单作废成功，正在刷新页面！");
            setTimeout(function() {
              self.sarkData.orderStatus = "11";
              self.created_fun();
            }, 1000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //打印
    printFun() {
      let self = this;
      let orderData = JSON.parse(JSON.stringify(self.orderData));
      let sponsorUnit;
      if (this.sarkData.sponsor == "A") {
        sponsorUnit = "尚金缘金";
      } else if (this.sarkData.sponsor == "B") {
        sponsorUnit = "尚金缘物流";
      } else if (this.sarkData.sponsor == "C") {
        sponsorUnit = "尚金缘展厅";
      } else if (this.sarkData.sponsor == "D") {
        sponsorUnit = "天津或者杭州工厂";
      } else {
        sponsorUnit = "";
      }
      this.allData.transferSlips = JSON.parse(orderData.martExter).tabRight;
      this.allData.customerName = "尚金缘金库";
      this.allData.sponsorUnit = sponsorUnit;
      this.allData.note = this.sarkData.orderRemarks;
      this.allData.createTime = this.sarkData.orderCreateTime;
      this.allData.orderCode = this.sarkData.orderNo;
      self.$refs.myComp.compPrintFun();
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
        margin: 20px 0 0 0;

        .infom-item {
          display: flex;
        }
      }
    }
  }

  .pro-item {
    width: 98%;
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
    width: calc(100% - 170px);
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
    font-size: 14px;
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

  .tabTwo {
    margin-top: 20px;
    height: 60px;

    .tabTwoS {
      align-items: start;
    }
  }

  .txtRight {
    text-align: right;
  }

  .suitDiv {
    border: 1px solid #E9ECF5;
    border-top: 0;
    background: #FAFAFA;
    padding: 10px;

    .suitSubDiv {
      padding: 10px;
      margin: 0px 10px;
    }
  }

  .txtFive {
    font-weight: bold;
    font-size: 14px;
  }

  .redTxtOne {
    color: #F20F34;
    font-weight: bold;
  }

  .floatRight {
    float: right;
  }

  .divOne {
    font-size: 14px;
    font-weight: bold;
    padding: 10px 0;
  }

  .divTwo {
    margin-bottom: 20px;
    color: #8A8E99;

    span {
      color: #232426;
    }
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

  .baoTabTwo {
    background: #fff;
    border: 1px solid #E4EAF0;
    padding: 10px;
  }
}
</style>
