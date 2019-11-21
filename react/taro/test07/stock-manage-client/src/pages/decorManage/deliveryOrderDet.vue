<template>
  <div class="conBigDiv" ref="repleOrder">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>收货单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info" v-loading="webLoadingTF">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div
              class="th"
              v-for="(item,indOne) in tableMenuData.menuList"
              :key="indOne"
            >{{item.menuName}}</div>
            <div class="th" v-show="editTF"></div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td" v-for="(item,indOne) in tableMenuData.menuList" :key="indOne">
              <span v-if="item.key =='billStatue'">
                <span v-if="orderList[item.key] === 'Y'" class="txtBlack">已收货</span>
                <span v-if="orderList[item.key] === 'N'" class="txtRed">未收货</span>
                <span v-if="orderList[item.key] === 'X'" class="txtRed">退回</span>
              </span>
              <span v-if="item.key === 'orderStatus'">
                <span v-if="orderList[item.key] === 1" class="txtRed">未收货</span>
                <span v-if="orderList[item.key] === 2" class="txtBlack">已收货</span>
              </span>
              <span v-else>{{orderList[item.key]}}</span>
            </div>
            <div class="td handle" v-show="editTF">
              <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
              <el-button
                v-if="orderList.orderStatus === 1"
                type="primary"
                size="mini"
                @click="upAudit"
                :loading="btnLoadingTF"
              >确认收货</el-button>
              <el-button
                v-if="orderList.orderStatus === 1"
                type="warning"
                style="margin-top: 10px"
                size="mini"
                @click="backOrder"
              >取消</el-button>
            </div>
          </div>
          <div class="titTwo">
            <div>
              打包信息
              <el-row
                v-for="(ielem,indexOne) in orderList.receiptPacks"
                :key="indexOne"
                class="titTwoBao"
              >
                <el-col :span="18" @click.native="viewBaoFun(ielem)">
                  <span class="txtRight30">包号:{{ielem.packNo}}</span>
                  <span class="txtRight30">客户名称：{{ielem.customerName}}</span>
                  <span class="txtRight30">订单编号：{{ielem.orderNo}}</span>
                  <span class="txtRight30">总数量：{{ielem.orderSum}}</span>
                  <span class="txtRight30">净重：{{ielem.totailGoldWeight}}</span>
                  <span @click.stop>
                    毛重：
                    <el-input
                      v-model="ielem.totailOrderWeight"
                      class="width70"
                      size="small"
                      v-if="ielem.newTF"
                    ></el-input>
                    <span v-else>{{ielem.totailOrderWeight}}</span>
                  </span>
                </el-col>
                <el-col :span="6">
                  <el-col :span="8" class="txtCenter">
                    <!-- <span v-if="!ielem.newTF && ielem.backup"> -->
                    <el-button size="small" v-if="!ielem.backup" @click="addBackup(ielem)">添加备注</el-button>
                    <el-tooltip :content="ielem.backup" placement="top" v-else>
                      <span class="txtThree">已备注</span>
                    </el-tooltip>
                    <!-- </span> -->
                    &nbsp;
                  </el-col>
                  <el-col :span="8" class="txtCenter">
                    <el-button size="small" v-if="!ielem.newTF" @click="printTabOneFun(ielem)">打印包条码</el-button>&nbsp;
                  </el-col>
                  <el-col :span="8" class="txtCenter">
                    <el-button size="small" @click="confirmBaoFun(ielem)" v-if="ielem.newTF">确认打包</el-button>
                    <span class="txtTwo" v-else>已打包</span>
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
                <span class="txtRight30">包号:{{viewBaoHead.packNo}}</span>
                <span class="txtRight30">客户名称：{{viewBaoHead.customerName}}</span>
                <span class="txtRight30">订单编号：{{viewBaoHead.orderNo}}</span>
                <span class="txtRight30">总数量：{{viewBaoHead.orderSum}}</span>
                <span class="txtRight30">毛重：{{viewBaoHead.totailOrderWeight}}</span>
                <span>净重：{{viewBaoHead.totailGoldWeight}}</span>
              </el-row>
            </div>
            <div>
              <div class="info-item-wrap">
                <!-- 单品start -->
                <div
                  class="infom-info"
                  v-for="(item,ind) in viewBaoHead.receiptOrderProducts"
                  :key="ind"
                >
                  <div class="infom-item">
                    <div class="pro-item iitem-left">
                      <div class="pro-imgs">
                        <img
                          :src="item.productImg?$portImg + item.productImg:'../../../static/images/img-noimg.png'"
                          width="153"
                          height="116"
                        >
                      </div>
                      <div class="pro-right">
                        <el-row>
                          <el-col :span="18" class="pro-tit">{{item.productName}}</el-col>
                          <el-col :span="6" v-if="viewBaoHead.reStatus != 2">
                            <el-button
                              size="small"
                              @click="editSkuFun(item)"
                              v-if="!item.editSku"
                            >编辑</el-button>
                            <el-button size="small" @click="saveSkuFun(item)" v-else>保存</el-button>
                            <el-button size="small" @click="delSkuFun(item,ind)">移出</el-button>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="5" class="pro-middle">编号：{{item.productNo}}</el-col>
                          <el-col :span="5" class="pro-middle">
                            <span v-if="!item.suitTF">材质：{{item.goldCode}}</span>&nbsp;
                          </el-col>
                          <el-col :span="5" class="pro-middle">
                            <span v-if="!item.suitTF">表面工艺：{{item.pait}}</span>&nbsp;
                          </el-col>
                          <el-col :span="5" class="pro-middle txtFour">下单数量：{{item.oriSkuSum}}</el-col>
                          <el-col :span="4" class="pro-middle txtFour">应收数量：{{item.skuSum}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="5" class="pro-middle">
                            <span v-if="!item.suitTF">产品类别：{{item.productTypeName}}</span>&nbsp;
                          </el-col>
                          <el-col :span="5" class="pro-middle">
                            <span v-if="!item.suitTF">生产工艺：{{item.craft}}</span>&nbsp;
                          </el-col>
                          <el-col :span="10" class="pro-middle">
                            <span v-if="!item.suitTF" v-show="item.carFlower">车花：{{item.carFlower}}</span>&nbsp;
                          </el-col>
                          <el-col :span="4" class="pro-middle txtFour txtRed">
                            实收数量：
                            <el-input-number
                              :controls="false"
                              v-model="item.editSkuSum"
                              v-if="item.editSku"
                              size="small"
                              class="width70"
                            ></el-input-number>
                            <span v-else>{{item.editSkuSum?item.editSkuSum:item.oriSkuSum}}</span>
                            <span v-if="item.suitTF" style="float:right">
                              <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">
                                详情
                                <i class="el-icon-arrow-up"></i>
                              </span>
                              <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">
                                详情
                                <i class="el-icon-arrow-down"></i>
                              </span>
                            </span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="5" class="pro-bottom">
                            <span v-if="!item.suitTF">成色：{{item.productCs}}</span>&nbsp;
                          </el-col>
                          <el-col :span="10" class="pro-middle txtFour">
                            <span
                              v-if="!item.suitTF"
                            >克重(g)：{{item.standardGold?item.standardGold:item.totailGoldWeight}}</span>&nbsp;
                          </el-col>
                          <el-col
                            :span="5"
                            class="pro-middle txtFour"
                          >金重(g)：{{item.skuWeight?item.skuWeight:(item.standardGold*item.oriSkuSum)}}</el-col>
                          <el-col :span="4" class="pro-middle txtFour txtRed">
                            实收重量：
                            <el-input-number
                              :controls="false"
                              v-model="item.editSkuWeight"
                              v-if="item.editSku"
                              size="small"
                              class="width70"
                            ></el-input-number>
                            <span
                              v-else
                            >{{item.editSkuWeight?item.editSkuWeight:(item.standardGold*item.oriSkuSum)}}</span>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                  <el-row v-if="item.viewSuit">
                    <el-col :span="24">
                      <el-row class="tabThree">
                        <el-col
                          :span="12"
                          class="tabThreeSubDiv"
                          v-for="(jelem,indOne) in item.transfOrderProducts"
                          :key="indOne"
                        >
                          <div class="tabThreeLeft">
                            <img
                              :src="jelem.productImg?$portImg+jelem.productImg:'../../../static/images/img-noimg.png'"
                              style="height:116px; width:153px;"
                              @click.stop="showPic(jelem.productImg?$portImg+jelem.productImg:'../../../static/images/img-noimg.png')"
                            >
                          </div>
                          <div class="tabThreeRight">
                            <el-row>
                              <el-col :span="24">{{jelem.productName}}</el-col>
                              <el-col :span="24" class="pro-middle-Two">编号：{{jelem.productNo}}</el-col>
                              <el-col
                                :span="24"
                                class="pro-middle-Two"
                              >{{jelem.pait}} {{jelem.craft?','+jelem.craft:''}}</el-col>
                              <el-col :span="10" class="pro-middle-Two">克重(g)：{{jelem.standardGold}}</el-col>
                              <el-col :span="14" class="pro-middle txtTwo"> 
                                <b v-if="jelem.extendAttr && jelem.one" v-html="$api.getAttachProperty(jelem.one,jelem.extendAttr)"></b>&nbsp;
                              </el-col>
                              
                            </el-row>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
                <!-- 单品end -->
              </div>
            </div>
          </span>
        </el-dialog>
      </div>
      <div class="oneClass" v-if="orderList.receiptOrderProducts.length > 0">
        <el-checkbox v-model="allSelect" @change="allSelectFun">全选</el-checkbox>
        <el-button type="primary" size="small" @click="oneKeyAdd" :loading="btnLoadingTF">一键添加到包</el-button>
      </div>
      <div class="info-middle">
        <div
          class="info-item-wrap"
          v-for="(iitem,index) in orderList.receiptOrderProducts"
          :key="index"
        >
          <!-- 单品start -->
          <el-row>
            <el-col :span="2" class="selectDiv">
              <span>
                <el-checkbox v-model="iitem.selectTF"></el-checkbox>
              </span>
            </el-col>
            <el-col :span="22">
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="iitem.productImg?$portImg + iitem.productImg:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row style="height: 32px;">
                      <el-col :span="24" class="pro-tit">{{iitem.productName}}</el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="4" class="pro-middle">编号：{{iitem.skuNum}}</el-col>
                      <el-col :span="4" class="pro-middle">
                        <span v-if="!iitem.suitTF">材质：{{iitem.goldCode}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="pro-middle">
                        <span v-if="!iitem.suitTF">表面工艺：{{iitem.pait}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="pro-middle txtFour">下单数量：{{iitem.oriSkuSum}}</el-col>
                      <el-col :span="6" class="pro-middle txtFour">应收数量：{{iitem.skuSum}}</el-col>
                      <el-col :span="2" class="pro-middle" v-show="editTF">
                        <el-button size="small" class="confirmBtn" @click="skuPrintFun(iitem)">打印条码</el-button>
                      </el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="4" class="pro-middle">
                        <span v-if="!iitem.suitTF">产品类别：{{iitem.productTypeName}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="pro-middle">
                        <span v-if="!iitem.suitTF">生产工艺：{{iitem.craft}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="pro-middle">
                        <span v-if="!iitem.suitTF">车花：{{iitem.carFlower}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="pro-middle txtFour">金重(g)：{{iitem.skuWeight}}</el-col>
                      <el-col :span="6" class="pro-middle redTxtOne">
                        实收数量：
                        <span v-if="iitem.skuEditTF || !editTF">{{iitem.editSkuSum}}</span>
                        <el-input-number
                          v-else
                          v-model="iitem.editSkuSum"
                          class="width70"
                          :controls="false"
                          @change="handleChange"
                          :min="0"
                          :max="iitem.skuSum"
                          size="small"
                        ></el-input-number>
                        <span v-if="iitem.suitTF" style="margin-left:20px">
                          <span class="redTxtOne" v-if="iitem.viewSuit" @click="editSuit(iitem)">
                            详情
                            <i class="el-icon-arrow-up"></i>
                          </span>
                          <span class="redTxtOne" v-if="!iitem.viewSuit" @click="editSuit(iitem)">
                            详情
                            <i class="el-icon-arrow-down"></i>
                          </span>
                        </span>
                      </el-col>
                      <el-col :span="2" class="pro-middle" v-show="editTF">
                        <el-button
                          size="small"
                          class="confirmBtn"
                          @click="addBaoFun(iitem,index)"
                          :disabled="btnLoadingTF"
                        >添加到包</el-button>
                      </el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="4" class="pro-bottom">
                        <span v-if="!iitem.suitTF">成色：{{iitem.productCs}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="pro-bottom">克重(g): {{iitem.standardGold}}</el-col>
                      <el-col :span="8" class="pro-bottom">
                        <span v-if="!iitem.suitTF">
                          <span
                            v-if="iitem.productTypeName != '套装'"
                          >
                            <b v-if="iitem.extendAttr && iitem.one" v-html="$api.getAttachProperty(iitem.one,iitem.extendAttr)"></b>&nbsp;
                          </span>
                        </span>&nbsp;
                      </el-col>
                      <el-col :span="6" class="pro-middle redTxtOne">
                        实收金重(g)：
                        <span v-if="iitem.skuEditTF || !editTF">{{iitem.editSkuWeight}}</span>
                        <el-input-number
                          v-else
                          v-model="iitem.editSkuWeight"
                          class="width70"
                          :controls="false"
                          @focus="focusWeightFocus(iitem,index)"
                          @blur="focusWeightBlur()"
                          @change="handleChange"
                          :min="0"
                          size="small"
                        ></el-input-number>
                      </el-col>
                      <!-- <el-col
                        :span="2"
                        class="pro-middle"
                        v-show="iitem.suitTF"
                      >
                        <span class="redTxtOne" v-if="iitem.viewSuit" @click="editSuit(iitem)">详情<i class="el-icon-arrow-up"></i></span>
                        <span class="redTxtOne" v-if="!iitem.viewSuit" @click="editSuit(iitem)">详情<i class="el-icon-arrow-down"></i></span>
                      </el-col>-->
                    </el-row>
                  </div>
                </div>
              </div>
              <el-row v-if="iitem.viewSuit">
                <el-col :span="24">
                  <el-row class="tabThree">
                    <el-col
                      :span="12"
                      class="tabThreeSubDiv"
                      v-for="(ielem,indOne) in iitem.transfOrderProducts"
                      :key="indOne"
                    >
                      <div class="tabThreeLeft">
                        <img
                          :src="ielem.productImg?$portImg+ielem.productImg:'../../../static/images/img-noimg.png'"
                          style="height:116px; width:153px;"
                          @click.stop="showPic(ielem.productImg?$portImg+ielem.productImg:'../../../static/images/img-noimg.png')"
                        >
                      </div>
                      <div class="tabThreeRight">
                        <el-row>
                          <el-col :span="24" class="txtFour">{{ielem.productName}}</el-col>
                          <el-col :span="24" class="pro-middle-Two">编号：{{ielem.productNo}}</el-col>
                          <el-col
                            :span="24"
                            class="pro-middle-Two"
                          >{{ielem.pait}} {{ielem.carFlower}} {{ielem.craft}}</el-col>
                          <el-col :span="10" class="pro-middle-Two">克重(g)：{{ielem.standardGold}}</el-col>
                          <el-col
                            :span="14"
                            class="pro-middle-Two"
                          >
                            <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!-- 单品end -->
      </div>

      
    </div>
    <div ref="printTabOne" v-show="false" style="width:150px">
      <div
        style="line-height:20px;font-size:10px;padding-left:5px;font-weight:bold;font-family:'SimHei'"
      >
        <div style="padding-left:26px">
          <img ref="imgcode" id="imgcode">
          <div style="margin-top:-5px;font-size:14px;">{{viewBaoHead.packNo}}</div>
        </div>

        <div>客户：{{viewBaoHead.customerName}}</div>
        <div>订单编号：{{viewBaoHead.orderNo}}</div>
        <div style="display:flex">
          <span>净重：{{viewBaoHead.totailGoldWeight}}</span>
          <span style="margin-left:15px">毛重：{{viewBaoHead.totailOrderWeight}}</span>
          <span style="margin-left:15px">件数：{{viewBaoHead.orderSum}}</span>
        </div>
        <div>说明：</div>
      </div>
    </div>
    <div ref="printTabTwo" v-show="false" style="width:200px">
      <div
        style="line-height:20px;font-size:10px;padding-left:5px;font-weight:bold;font-family:'SimHei'"
      >
        <div style="padding-left:5px">
          <img ref="imgcodeTwo" id="imgcodeTwo">
          <div style="margin-top:-5px;font-size:14px;">{{viewBaoHead.skuNum}}</div>
        </div>

        <div>订单号：{{viewBaoHead.customerName}}</div>
        <!-- <div>包号：{{viewBaoHead}}</div> -->
        <div>名称：{{viewBaoHead.productName}}</div>
        <div>sku号：{{viewBaoHead.skuNum}}</div>
        <div>克重：{{viewBaoHead.standardGold}}</div>
        <div>件数：{{viewBaoHead.editSkuSum}}</div>
        <div>毛重：{{viewBaoHead.skuWeight}}</div>
        <div>净重：{{viewBaoHead.editSkuWeight}}</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      stepsActive: 1,
      orderList: { receivSkus: [] },
      result: {},
      allSelect: false, //全选
      orderNo: "",
      editTF: true, //可编辑
      tableMenuData: {}, //菜单显示
      inputIndOne: "", //实收毛重输入框index
      inputIndTwo: "", //实收净重输入框index
      btnLoadingTF: false, //按钮加载
      webLoadingTF: false, //页面加载
      viewBaoHead: {}, //点击后包号
      viewBaoTF: false, //点击包弹框
      surePack: 1, //1 未确认收货 2已确认收货
      btnLoad: false, //添加到包加载
      tableDisData: [
        {
          id: 2,
          code: "2",
          value: "工厂来货-客单",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "oriOrderNo",
              menuName: "单据号"
            },
            {
              key: "customerName",
              menuName: "客户名称"
            },
            {
              key: "orderNo",
              menuName: "收货单号"
            },
            {
              key: "factoryName",
              menuName: "工厂名称"
            },
            {
              key: "orderSum",
              menuName: "订单数量"
            },
            {
              key: "totailOrderWeight",
              menuName: "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName: "净重(g)"
            },
            {
              key: "creatorName",
              menuName: "制单人"
            },
            {
              key: "orderCreateTime",
              menuName: "制单日期"
            },
            {
              key: "orderStatus",
              menuName: "订单状态"
            }
          ]
        },
        {
          id: 1,
          code: "1",
          value: "工厂来货-补货",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "oriOrderNo",
              menuName: "单据号"
            },

            {
              key: "orderNo",
              menuName: "收货单号"
            },
            {
              key: "factoryName",
              menuName: "工厂名称"
            },
            {
              key: "nonono",
              menuName: "质检人"
            },
            {
              key: "orderSum",
              menuName: "订单数量"
            },
            {
              key: "totailOrderWeight",
              menuName: "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName: "净重(g)"
            },
            {
              key: "creatorName",
              menuName: "制单人"
            },
            {
              key: "orderCreateTime",
              menuName: "制单日期"
            },
            {
              key: "orderStatus",
              menuName: "订单状态"
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
              key: "oriOrderNo",
              menuName: "单据号"
            },
            {
              key: "orderNo",
              menuName: "收货单号"
            },
            {
              key: "stockType",
              menuName: "金料"
            },

            {
              key: "totailOrderWeight",
              menuName: "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName: "净重(g)"
            },
            {
              key: "creatorName",
              menuName: "制单人"
            },
            {
              key: "orderCreateTime",
              menuName: "制单日期"
            },
            {
              key: "orderStatus",
              menuName: "订单状态"
            }
          ]
        },
        {
          id: 4,
          code: "3",
          value: "调拨入库",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "oriOrderNo",
              menuName: "单据号"
            },
            {
              key: "orderNo",
              menuName: "收货单号"
            },
            {
              key: "orderSum",
              menuName: "订单数量"
            },
            {
              key: "totailOrderWeight",
              menuName: "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName: "净重(g)"
            },
            {
              key: "creatorName",
              menuName: "制单人"
            },
            {
              key: "orderCreateTime",
              menuName: "制单日期"
            },
            {
              key: "orderStatus",
              menuName: "订单状态"
            }
          ]
        }
      ]
    };
  },
  created() {
    var self = this;
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
    document.onkeydown = e => {
      let dom = self.$refs.repleOrder;
      if (dom && e.code == "F9") {
        self.comFun();
      }
    };
    this.loopInit = this.loop();
  },

  methods: {
    created_fun() {
      var self = this;
      self.webLoadingTF = true;
      let params = {
        orderNo: self.orderNo
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/selectReceiptOrderByOrderNo",
        params,
        res => {
          self.webLoadingTF = false;
          self.orderList = res.data;
          self.orderList.index = 1;
          if (
            !self.orderList.receiptPacks ||
            self.orderList.receiptPacks.length === 0
          ) {
            self.orderList.receiptPacks = [
              {
                packNo: "",
                customerName: self.orderList.customerName,
                orderNo: self.orderList.orderNo,
                orderSum: 0,
                totailGoldWeight: 0,
                totailOrderWeight: 0,
                newTF: true
              }
            ];
          } else if (self.orderList.receiptOrderProducts.length != 0) {
            self.orderList.receiptPacks.push({
              packNo: "",
              customerName: self.orderList.customerName,
              orderNo: self.orderList.orderNo,
              orderSum: 0,
              totailGoldWeight: 0,
              totailOrderWeight: 0,
              newTF: true
            });
          }
          // 单品

          //套装
          self.menuData();
        },
        err => {
          self.webLoadingTF = false;
          self.$message.error(err.msg);
        }
      );
    },
    //菜单读取事件
    menuData() {
      var self = this;
      self.tableDisData.forEach(item => {
        if (self.orderList.orderType == item.code) {
          self.tableMenuData = item;
        }
      });
    },
    //确认收货
    upAudit() {
      var self = this;
      // console.log(self.orderList)
      self.btnLoadingTF = true;
      var upAuditTF = true;
      if (self.orderList.receiptOrderProducts.length != 0) {
        upAuditTF = false;
      }
      self.orderList.receiptPacks.forEach(ielem => {
        if (ielem.reStatus != 2) {
          upAuditTF = false;
        }
      });
      if (!upAuditTF) {
        self.btnLoadingTF = false;
        self.$message.error("还有包未提交，不能确认收货！");
        return false;
      }
      var params = {
        orderId: self.orderList.id,
        surePack: 2
      };
      this.$axios
        .post(self.$portMain + "/order/addReceiptPackInfo", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("确认收货成功，正在刷新！");
            self.btnLoadingTF = false;
            setTimeout(function() {
              self.created_fun();
            }, 1000);
          } else {
            self.btnLoadingTF = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    handleChange() {
      this.$forceUpdate();
    },
    backOrder() {
      let self = this;
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

    printTabOneFun(elem) {
      let self = this;
      let dom = document.querySelector("#imgcode");
      self.viewBaoHead = elem;
      JsBarcode(dom, elem.packNo, {
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

    //sku编辑
    editSkuFun(ielem) {
      ielem.editSku = true;
      this.$forceUpdate();
    },
    //sku保存
    saveSkuFun(ielem) {
      ielem.editSku = false;
      this.baoNumTwoFun();
      this.$forceUpdate();
      // this.created_fun()
    },
    //sku移出
    delSkuFun(elem, index) {
      let self = this;
      let newTF = true;
      let tempObj = {};
      self.orderList.receiptOrderProducts.forEach(ielem => {
        if (
          ielem.skuNum === self.viewBaoHead.receiptOrderProducts[index].skuNum
        ) {
          // console.log(ielem)
          newTF = false;
          tempObj = ielem;
        }
      });

      if (!newTF) {
        tempObj.oriSkuSumOne +=
          self.viewBaoHead.receiptOrderProducts[index].editOriSkuSum;
        tempObj.editOriSkuSum +=
          self.viewBaoHead.receiptOrderProducts[index].editOriSkuSum;
        tempObj.editSkuWeight +=
          self.viewBaoHead.receiptOrderProducts[index].editSkuWeight;
        self.viewBaoHead.receiptOrderProducts.splice(index, 1);
      } else {
        self.orderList.receiptOrderProducts.push(
          self.viewBaoHead.receiptOrderProducts[index]
        );
        self.viewBaoHead.receiptOrderProducts.splice(index, 1);
      }
      self.baoNumTwoFun();
      self.$forceUpdate();
    },

    //查看包号
    viewBaoFun(elem) {
      //
      let self = this;
      self.viewBaoHead = elem;
      // let params = {
      //   PRS: {
      //     outstoreId: self.outstoreId,
      //     baoId: elem.baoId
      //   }
      // };
      // this.$axios
      //   .get(this.$portMain + "/outstore/getOutstoreBaoSku", params)
      //   .then(res => {
      //     if (res.data.code === 200) {
      //       // console.log(res.data.data)
      //       if (res.data.data.orderProperties) {
      //         self.baoViewProListOne = res.data.data.orderProperties;
      //       }
      //       if (res.data.data.suitProductFroms) {
      //         self.baoViewProListTwo = res.data.data.suitProductFroms;
      //       }
      //       //
      //       //
      //       //
      //       //
      //     }
      //   });
      this.viewBaoTF = true;
    },
    //有分包添加到包
    addBaoFun(elem, index) {
      this.btnLoadingTF = true;
      let self = this;
      // console.log('elem:')
      // // console.log(self.orderList.receiptPacks)
      let len = self.orderList.receiptPacks.length - 1;
      if (self.orderList.receiptPacks[len].receiptOrderProducts) {
        self.orderList.receiptPacks[len].receiptOrderProducts.push(
          JSON.parse(JSON.stringify(elem))
        );
      } else {
        self.orderList.receiptPacks[len].receiptOrderProducts = [];
        self.orderList.receiptPacks[len].receiptOrderProducts.push(
          JSON.parse(JSON.stringify(elem))
        );
      }
      // console.log(self.baoDisList[len].receiptOrderProducts)
      if (self.baoNumFun(self.orderList.receiptPacks[len])) {
        self.$message.success("产品添加到包成功！");
        if (
          self.orderList.receiptOrderProducts[index].skuSum -
            self.orderList.receiptOrderProducts[index].editSkuSum >
          0
        ) {
          self.orderList.receiptOrderProducts[index].skuSum =
            self.orderList.receiptOrderProducts[index].skuSum -
            self.orderList.receiptOrderProducts[index].editSkuSum;
          self.orderList.receiptOrderProducts[index].editSkuSum =
            self.orderList.receiptOrderProducts[index].skuSum;
          self.orderList.receiptOrderProducts[index].editOriSkuSum =
            self.orderList.receiptOrderProducts[index].skuSum;
        } else {
          self.orderList.receiptOrderProducts.splice(index, 1);
        }
        self.btnLoadingTF = false;
        // self.$forceUpdate();
      }
    },

    //包号数量改变
    baoNumFun(ielem) {
      let self = this;
      // this.$message.success(ielem)
      var returnTxt = false;
      let baoAmountNum = 0;
      let skuWeightNum = 0;
      let pickWeightNum = 0;
      // self.orderList.receiptPacks.forEach(ielem => {
      if (ielem.receiptOrderProducts) {
        ielem.receiptOrderProducts.forEach(jelem => {
          // console.log(jelem)
          if (jelem.editSkuSum) {
            baoAmountNum += parseInt(jelem.editSkuSum);
          } else {
            baoAmountNum += parseInt(jelem.skuSum);
          }
          if (jelem.skuWeight) {
            skuWeightNum += parseFloat(jelem.skuWeight);
          } else {
            skuWeightNum += parseFloat(jelem.standardGold * jelem.oriSkuSum);
          }
          if (jelem.editSkuWeight) {
            pickWeightNum += parseFloat(jelem.editSkuWeight);
          } else {
            pickWeightNum += parseFloat(jelem.standardGold * jelem.oriSkuSum);
          }
        });
        ielem.orderSum = baoAmountNum;
        ielem.totailGoldWeight = self.$api.returnFloat(skuWeightNum);
        ielem.totailOrderWeight = self.$api.returnFloat(pickWeightNum);
        returnTxt = true;
      }
      // });
      return returnTxt;
    },

    //包号数量改变
    baoNumTwoFun() {
      let self = this;
      let baoAmountNum = 0;
      let skuWeightNum = 0;
      let pickWeightNum = 0;
      self.orderList.receiptPacks.forEach(ielem => {
        if (ielem.receiptOrderProducts) {
          ielem.receiptOrderProducts.forEach(jelem => {
            if (jelem.editSkuSum) {
              baoAmountNum += parseInt(jelem.editSkuSum);
            } else {
              baoAmountNum += parseInt(jelem.skuSum);
            }
            if (jelem.skuWeight) {
              skuWeightNum += parseFloat(jelem.skuWeight);
            } else {
              skuWeightNum += parseFloat(jelem.standardGold * jelem.oriSkuSum);
            }
            if (jelem.editSkuWeight) {
              pickWeightNum += parseFloat(jelem.editSkuWeight);
            } else {
              pickWeightNum += parseFloat(jelem.standardGold * jelem.oriSkuSum);
            }
          });
          ielem.orderSum = baoAmountNum;
          ielem.totailGoldWeight = self.$api.returnFloat(skuWeightNum);
          ielem.totailOrderWeight = self.$api.returnFloat(pickWeightNum);
        }
      });
    },
    addBackup(elem) {
      let self = this;
      this.$prompt("请输入备注：", "备 注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          elem.backup = value;
          self.$forceUpdate();
        })
        .catch(() => {});
    },
    //确认打包事件
    confirmBaoFun(elem) {
      let self = this;
      // console.log(elem)
      if (
        !elem.receiptOrderProducts ||
        elem.receiptOrderProducts.length === 0
      ) {
        self.$message.error("包里没有产品，不能打包,请添加产品!");
        return false;
      }
      let receiptPackInfos = [];
      elem.receiptOrderProducts.forEach(jelem => {
        receiptPackInfos.push({
          skuNo: jelem.skuNum,
          nowSkuSum: jelem.editSkuSum,
          nowSkuWeight: jelem.editSkuWeight
        });
      });

      let params = {
        orderId: self.orderList.id,
        totailOrderWeight: parseFloat(elem.totailOrderWeight),
        receiptPackInfos: receiptPackInfos
      };

      this.$axios
        .post(self.$portMain + "/order/addReceiptPackSingleInfo", params)
        .then(function(res) {
          if (res.data.code == 200) {
            elem.newTF = false;
            elem.reStatus = 2;
            elem.packNo = res.data.data;
            if (self.orderList.receiptOrderProducts.length != 0) {
              self.orderList.receiptPacks.push({
                packNo: "",
                customerName: self.orderList.customerName,
                orderNo: self.orderList.orderNo,
                orderSum: 0,
                totailGoldWeight: 0,
                totailOrderWeight: 0,
                newTF: true
              });
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "" && self.inputIndTwo == "") {
        self.$message.error("实收毛重或实收净重没有被焦点选中！");
      }
      // console.log(self.inputIndOne,self.inputIndTwo)
      if (self.inputIndOne) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },
    
    //改变电子称输入框数量
    changeWeight(elem){
      let self = this;
      var indexOne = self.inputIndOne - 1;
      self.orderList.receiptOrderProducts[
        indexOne
      ].editSkuWeight = parseFloat(elem);
      self.$forceUpdate();
    },
    //循环读取电子称输入框数量
    loop() {
      let oldVal = "";
      let self = this;
      let count = 0;
      return () => {
        if (count >= 20) {
          count = 0;
          this.$message.info(`重量没有改变，请检查是否读称成功！`);
          return;
        }
        setTimeout(() => {
          this.$$.ajax({
            type: "get",
            async: false,
            url:"http://localhost:5000/BalanceResult/result.js?t=" + new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              // console.log(json,json.weight);
              count++;
              var weightNum = json.weight?json.weight:null
              if (!oldVal) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
              if (oldVal && oldVal === weightNum) {
                self.changeWeight(weightNum);
                self.loopInit();
                return;
              }
              if (oldVal && oldVal !== weightNum) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
            },
            error: function() {
              // alert("fail");
            }
          });

        }, 150);
      };
    },
    //输入框获得焦点
    focusWeightFocus(e, ind) {
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlur() {
      this.inputIndOne = "";
    },
    //打印sku

    skuPrintFun(elem) {
      let self = this;
      let dom = document.querySelector("#imgcodeTwo");
      self.viewBaoHead = elem;
      JsBarcode(dom, elem.skuNum, {
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
        self.CreateOneFormPageTwo();
        self.LODOP.PREVIEW();
      }, 500);
    },
    CreateOneFormPageTwo() {
      this.LODOP = this.$getLodop();
      this.LODOP.PRINT_INIT("");
      this.LODOP.SET_PRINT_STYLE("FontSize", 10);
      this.LODOP.SET_PRINT_STYLE("Bold", 1);
      this.LODOP.SET_PRINT_PAGESIZE(1, "90mm", "70mm", "");
      this.LODOP.ADD_PRINT_HTM(
        10,
        0,
        760,
        600,
        this.$refs.printTabTwo.innerHTML
      );
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    //一键添加到包
    oneKeyAdd() {
      let self = this;
      this.btnLoadingTF = true;
      // console.log(self.orderList.receiptOrderProducts)
      let selectAddData = [];
      let newSkuList = [];

      self.orderList.receiptOrderProducts.forEach((ielem, indOne) => {
        if (ielem.selectTF) {
          selectAddData.push(ielem);
          let len = self.orderList.receiptPacks.length - 1;
          if (self.orderList.receiptPacks[len].receiptOrderProducts) {
            self.orderList.receiptPacks[len].receiptOrderProducts.push(
              JSON.parse(JSON.stringify(ielem))
            );
          } else {
            self.orderList.receiptPacks[len].receiptOrderProducts = [];
            self.orderList.receiptPacks[len].receiptOrderProducts.push(
              JSON.parse(JSON.stringify(ielem))
            );
          }
        } else {
          ielem.selectTF = false;
          newSkuList.push(JSON.parse(JSON.stringify(ielem)));
        }
      });
      if (selectAddData.length === 0) {
        self.$message.error("还没有选择产品！");
        self.btnLoadingTF = false;
        return false;
      }
      let len = self.orderList.receiptPacks.length - 1;
      if (self.baoNumFun(self.orderList.receiptPacks[len])) {
        self.orderList.receiptOrderProducts = newSkuList;
        self.$message.success("产品添加到包成功！");
        self.btnLoadingTF = false;
      }
    },
    //全选、反选
    allSelectFun(e) {
      // console.log(e)
      let self = this;
      self.orderList.receiptOrderProducts.forEach(ielem => {
        ielem.selectTF = e;
      });
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
    background: #f5f5f5;

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
    margin-top: 20px;
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
    line-height: 13px;
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

  .pro-middle-Two {
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
    width: 80px;
    height: 15px;
    margin-top: -13px;
  }

  .confirmBtn {
    margin-top: -13px;
  }

  .titTwo {
    margin-top: 10px;
    margin-bottom: 20px;
    background: #FAFAFA;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    min-width: 1000px;
    font-weight: bold;
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

  .txtTwo {
    color: #1FC45B;
  }

  .txtThree {
    color: #F20F34;
  }

  .txtFour {
    color: #333333;
    font-size: 12px;
    font-weight: bold;
  }

  .txtRed {
    color: #F20F34;
  }

  .txtCenter {
    text-align: center;
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

  .txtLeft {
    text-align: left;
  }

  .txtRight {
    text-align: right;
  }

  .txtRight30 {
    margin-right: 30px;
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

  .oneClass {
    padding: 20px;
    padding-bottom: 0;
    text-align: right;
  }

  .selectDiv {
    line-height: 200px;
    text-align: center;
  }
}
</style>
