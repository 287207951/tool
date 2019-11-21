<template>
  <div class="conBigDiv" v-loading="loadingState" ref="repleOrder">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>出客户饰列表</el-breadcrumb-item>
      <el-breadcrumb-item>出客户饰详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">客户名称</div>
            <div class="th">区域-省份</div>
            <div class="th">原单据单号</div>
            <div class="th">下单人</div>
            <div class="th">下单日期</div>
            <div class="th">订单类型</div>
            <div class="th">字印</div>
            <div class="th">是否挂签</div>
            <div class="th">出货单号</div>
            <div class="th">毛重(g)</div>
            <div class="th">总净重(g)</div>
            <div class="th">状态</div>
            <!-- <div class="th">操作</div> -->
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{orderAllData.customerName}}</div>
            <div class="td">{{orderAllData.areaProvonce}}</div>
            <div class="td">
              <span v-if="orderAllData.orderType == '_future'">{{orderAllData.futureOrderCode}}</span>
              <span v-else>{{orderAllData.orderCode}}</span>
            </div>
            <div class="td">{{orderAllData.operateName}}</div>
            <div class="td">{{orderAllData.orderTime}}</div>
            <div class="td">
              <span v-if="orderAllData.orderType == '_spot'">现货单</span>
              <span v-if="orderAllData.orderType == '_future'">期货单</span>
            </div>
            <div class="td">{{orderAllData.marking}}</div>
            <div class="td">
              <span v-if="orderAllData.isTagout == 'N'">否</span>
              <span v-if="orderAllData.isTagout == 'Y'">是</span>
            </div>
            <div class="td">{{orderAllData.outstoreCode}}</div>
            <div class="td">{{orderAllData.weight}}</div>
            <div class="td">{{orderAllData.stockWeight}}</div>
            <div class="td">
              <span v-if="orderAllData.outstoreStatue == '_wait'" class="yellowColor">待出货</span>
              <span v-if="orderAllData.outstoreStatue == '_save'" class="yellowColor">暂存中</span>
              <span v-if="orderAllData.outstoreStatue == '_reject'" class="redColor">已驳货</span>
              <span v-if="orderAllData.outstoreStatue == '_finish'" class="blackColor">已出货</span>
              <span v-if="orderAllData.outstoreStatue == '_hc'" class="redColor">红冲</span>
            </div>
          </div>
          <div class="tr" style="border: none;margin-top:10px;">
            <el-col :span="16">
              欠款(￥)：
              <span class="redTxt">{{oweViewData.oweMoney}}</span>
              <span class="left10">欠料(g):</span>
              <span class="redTxt">{{oweViewData.oweStock}}</span>
              <el-button type="primary" size="small" @click="viewOweFun" class="left10" plain>刷新</el-button>
            </el-col>
            <el-col :span="8" style="line-height:30px;">
              <el-button
                type="primary"
                v-if="orderAllData.outstoreStatue == '_finish'"
                size="mini"
                @click="printTabOneFun"
                plain
              >打印</el-button>
              <el-button
                type="primary"
                v-if="orderAllData.outstoreStatue == '_wait'"
                size="mini"
                @click="confirmSave"
                plain
              >暂存</el-button>
              <el-button
                v-if="orderAllData.outstoreStatue == '_wait' ||orderAllData.outstoreStatue == '_save'"
                type="danger"
                el-radio-button
                @click="upAudit"
                size="mini"
                style="margin-bottom:10px"
                :loading="btnLoadingTF"
              >提交并打印</el-button>
            </el-col>
          </div>
        </div>
        <div class="tabBig">
          <el-col :span="2">
            <div class="txt14">款账明细：</div>
          </el-col>
          <el-col :span="22">
            <div class="txt14 redTxt">合计人民币(RMB)：￥{{ceditSumNum}}</div>
          </el-col>
        </div>
        <div>
          <el-table
            :data="ceditDataList"
            border
            :row-class-name="tableRowClassName"
            style="width:100%;">
            <el-table-column
              label="方式"
              align="center"
              header-align="center"
              width="160">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait'|| orderAllData.outstoreStatue == '_save'"
                  >
                    <el-select
                      v-model="scope.row.ceditWayId"
                      placeholder="请选择"
                      size="small"
                      class="inputSmallTwo"
                      :disabled="scope.row.isOldTF"
                      @change="changeWayName(scope.row)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.ceditWayId"
                        :label="item.ceditWayName"
                        :value="item.ceditWayId"
                      ></el-option>
                    </el-select>
                  </span>
                  <span v-else>{{scope.row.ceditWayName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="项目"
              align="center"
              header-align="center"
              width="160px">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
                  >
                    <span v-if="scope.row.ceditWayId == 2 || scope.row.ceditWayId == 4">
                      <el-select
                        v-model="scope.row.ceditProject"
                        placeholder="请选择"
                        size="small"
                        class="inputSmallTwo"
                        :disabled="scope.row.isOldTF"
                        @change="changeWayNameTwo(ielem)"
                      >
                        <el-option
                          v-for="item in optionsTwo"
                          :key="item.ceditWayId"
                          :label="item.ceditWayName"
                          :value="item.ceditWayId"
                        ></el-option>
                      </el-select>
                    </span>
                    <span v-else>
                      <el-select
                        v-model="scope.row.ceditProject"
                        placeholder="请选择"
                        size="small"
                        class="inputSmallTwo"
                        :disabled="scope.row.isOldTF"
                      >
                        <el-option
                          v-for="item in optionsThree"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </span>
                  </span>
                  <span v-else>{{scope.row.ceditProject}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="重量">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
                    class="leftStyle"
                  >
                    <el-input
                      v-model="scope.row.ceditWeight"
                      size="small"
                      class="inputSmall"
                      @change="changeNum(scope.row)"
                      :disabled="scope.row.billingWay != 'k'"
                    ></el-input>
                  </span>
                  <span v-else class="rightStyle">{{scope.row.ceditWeight}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="单价/克">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
                    class="leftStyle"
                  >
                    <!-- <span class="txtRed" v-if="scope.row.sellTF === false">-</span> -->
                    <el-input
                      v-model="scope.row.ceditPriceG"
                      min='0'
                      size="small"
                      class="inputSmall"
                      @change="changeNumTwo(scope.row)"
                      :disabled="scope.row.billingWay != 'k'"
                    ></el-input>
                  </span>
                  <span v-else class="rightStyle">
                    <!-- todo -->
                    {{scope.row.ceditPriceG}}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="数量">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
                    class="leftStyle"
                  >
                    <el-input
                      v-model="scope.row.ceditAmount"
                      size="small"
                      class="inputSmall"
                      @change="changeNum(scope.row)"
                      :disabled="scope.row.billingWay != 'j'"
                    ></el-input>
                  </span>
                  <span v-else class="rightStyle">{{scope.row.ceditAmount}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="单价/件">
              <template slot-scope="scope">
                <div>
                  <!-- <span class="txtRed" v-if="scope.row.sellTF === false">-</span> -->
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
                    class="leftStyle"
                  >
                    <el-input
                      v-model="scope.row.ceditPriceJ"
                      size="small"
                      min='0'
                      class="inputSmall"
                      @change="changeNumTwo(scope.row)"
                      :disabled="scope.row.billingWay != 'j'"
                    ></el-input>
                  </span>
                  <span v-else class="rightStyle">
                    {{scope.row.ceditPriceJ}}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="金额">
              <template slot-scope="scope">
                <div>
                  <span
                    :class="scope.row.sellTF === false?'txtRed':''"
                  >{{scope.row.ceditMoney?$api.returnFloat(scope.row.ceditMoney):'0.00'}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="备注">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
                  >
                    <el-input v-model="scope.row.ceditNote" size="small" class="inputSmallTwo"></el-input>
                  </span>
                  <span v-else>{{scope.row.ceditNote}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              label="操作"
              v-if="orderAllData.outstoreStatue == '_wait' || orderAllData.outstoreStatue == '_save'"
              width="190px">
              <template slot-scope="scope">
                <div>
                  <span
                    class="txtRed pointer"
                    v-if="scope.row.isNewTF" @click="addCeditFun"
                  >添加</span>
                  <span v-else>
                    <span
                      class="txtYellow left10 pointer"
                      v-if="!scope.row.isOldTF"
                      @click="delCeditFun(scope.$index)"
                    >删除</span>
                    <span
                      class="txtRed left10 pointer"
                      @click="addCeditTwoFun(scope.$index)"
                    >添加</span>
                    <span
                      class="txtRed left10 pointer"
                      v-if="scope.row.sellHighTF && scope.row.sellShowTF != false"
                      @click="addCeditThreeFun(scope.$index)"
                    >高开优惠</span>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <div>{{displayTab}}</div> -->
      <div class="info-middle" v-if="displayTab == 'baoTrue' || displayTab=='baoThree'">
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
          <span class="titOneLeft">总数量：</span>
          <span class="titOneLeft">总毛重(g)：</span>
          <!-- <span class="titOneRight">
            <el-button
              type="danger"
              size='small'
            >打印条码</el-button>
          </span>-->
        </div>
        <div class="titTwo">
          <div>
            打包信息
            <!-- {{baoFactList}} -->
            <el-row
              v-for="(ielem,indexOne) in baoFactList.JBao"
              :key="indexOne"
              class="titTwoBao"
              @click.native="viewBaoFun(ielem)"
            >
              <span class="txtRight30">包号:{{ielem.baoCode}}</span>
              <span class="txtRight30">总数量：{{ielem.baoAmount}}</span>
              <span class="txtRight30">毛重：{{ielem.baoWeight}}</span>
              <span class="txtRight30">净重：{{ielem.baoStockWeight}}</span>
              <span class="txtRight30">客户名称：{{ielem.baoCustomerName}}</span>
              <span class="txtRight30">订单编号：{{ielem.baoOrderCode}}</span>
              <span @click.stop>
                复核毛重：
                <el-input-number
                  v-model="ielem.baoOutstorePurWeight"
                  :controls="false"
                  :min="0"
                  label
                  size="small"
                  class="width70"
                  v-if="orderAllData.outstoreStatue == '_wait'|| orderAllData.outstoreStatue == '_save'"
                  @focus="focusWeightFocus(ielem,indexOne)"
                  @blur="focusWeightBlur(ielem)"
                ></el-input-number>
                <span v-else>{{ielem.baoOutstorePurWeight?ielem.baoOutstorePurWeight:'-'}}</span>
              </span>
            </el-row>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <div class="info-middle" v-if="displayTab == 'baoFalse' || displayTab == 'baoZero'">
        <div class="titTwo">
          <div>
            打包信息
            <el-row
              v-for="(ielem,indexOne) in orderAllData.jBaos"
              :key="indexOne"
              class="titTwoBao"
              @click.native="viewBaoFun(ielem)"
            >
              <span class="txtRight30">包号:{{ielem.baoCode}}</span>
              <span class="txtRight30">总数量：{{ielem.baoAmount}}</span>
              <span class="txtRight30">毛重：{{ielem.baoWeight}}</span>
              <span class="txtRight30">净重：{{ielem.baoStockWeight}}</span>
              <span class="txtRight30">客户名称：{{ielem.baoCustomerName}}</span>
              <span class="txtRight30">订单编号：{{ielem.baoOrderCode}}</span>
              <span @click.stop>
                复核毛重：
                <el-input-number
                  v-model="ielem.baoOutstorePurWeight"
                  :controls="false"
                  :min="0"
                  label
                  size="small"
                  class="width70"
                  v-if="orderAllData.outstoreStatue == '_wait'|| orderAllData.outstoreStatue == '_save'"
                  @focus="focusWeightFocus(ielem,indexOne)"
                  @blur="focusWeightBlur(ielem)"
                ></el-input-number>
                <span v-else>{{ielem.baoOutstorePurWeight?ielem.baoOutstorePurWeight:'-'}}</span>
              </span>
            </el-row>
          </div>
          <!-- </div> -->
          <div>
            <div class="infom-info" v-for="(item,ind) in orderAllData.pickSkus" :key="ind">
              <div class="infom-item">
                <div class="pro-item" style="width:100%">
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
                      <el-col :span="6" class="pro-middle">
                        编号：
                        <span class="txtBlack">{{item.skuId}}</span>
                      </el-col>
                      <el-col :span="6" class="pro-middle">
                        <span
                          v-if="!item.suitTF && item.pickSkuProp.productType !== '套装' && item.pickSkuProp.texTure"
                        >
                          材质：
                          <span class="txtBlack">{{item.pickSkuProp.texTure}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="6" class="pro-middle">
                        <span v-if="!item.suitTF && item.pickSkuProp.surfaceTechnics">
                          表面工艺：
                          <span class="txtBlack">{{item.pickSkuProp.surfaceTechnics}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="6" class="pro-middle">
                        下单数量：
                        <span class="txtBlack">{{item.skuCheckAmount}}</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">
                        <span v-if="!item.suitTF&& item.pickSkuProp.productType">
                          产品类别：
                          <span class="txtBlack">{{item.pickSkuProp.productType}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="6" class="pro-middle">
                        <span
                          v-if="!item.suitTF && item.pickSkuProp.productType !== '套装'&& item.pickSkuProp.manufacturingTechnique"
                        >
                          生产工艺：
                          <span class="txtBlack">{{item.pickSkuProp.manufacturingTechnique}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="12" class="pro-middle">
                        <span v-if="!item.suitTF && item.pickSkuProp.embroidery">
                          车花：
                          <span class="txtBlack">{{item.pickSkuProp.embroidery}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">
                        <span v-if="!item.suitTF&& item.pickSkuProp.colorFormer">
                          成色：
                          <span class="txtBlack">{{item.pickSkuProp.colorFormer | $conditiNameFilter}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="18" class="pro-middle redTxt txtRight">
                        <p v-if="item.pickSkuProp.productType == '套装'" @click="editSuit(item)">
                          套装详情
                          <i :class="item.viewSuit ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                        </p>&nbsp;
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <div v-if="item.viewSuit && item.pickSkuProp.productType == '套装'" class="divThree">
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
                      <el-row>
                        <el-col :span="8">{{ielem.proName}}</el-col>
                        <el-col :span="8" class="txtOne">
                          产品成色：
                          <span class="txtBlack">{{ielem.number  | $conditiNameFilter}}</span>
                        </el-col>
                        <el-col :span="8" class="txtOne">
                          产品类别：
                          <span class="txtBlack">{{ielem.oneName}}</span>
                        </el-col>
                        <el-col :span="8" class="txtOne">
                          编码：
                          <span class="txtBlack">{{ielem.proNum}}</span>
                        </el-col>
                        <el-col :span="16" class="txtOne">
                          产品材质：
                          <span class="txtBlack">{{ielem.goldCode}}</span>
                        </el-col>
                        <!-- <el-col :span="8" class="txtOne">下单数量：<span class="txtBlack">{{ielem.proNum}}</span></el-col> -->
                        <el-col :span="8" class="txtOne">
                          克重：
                          <span class="txtBlack">{{ielem.weight}}</span>
                        </el-col>
                        <el-col :span="8" class="txtOne">
                          生产工艺：
                          <span class="txtBlack">{{ielem.processCode}}</span>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-col :span="3">包号12:{{viewBaoHead.baoCode}}</el-col>
              <el-col :span="2">总数量：{{viewBaoHead.baoAmount}}</el-col>
              <el-col :span="2">毛重：{{viewBaoHead.baoStockWeight}}</el-col>
              <el-col :span="2">净重：{{viewBaoHead.baoStockWeight}}</el-col>
              <el-col :span="6">客户名称：{{viewBaoHead.baoCustomerName}}</el-col>
      <el-col :span="4">订单编号：{{viewBaoHead.baoOrderCode}}</el-col>-->
      <!-- 打包数据 -->
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
              <el-col :span="3">包号:{{viewBaoHead.baoCode}}</el-col>
              <el-col :span="2">总数量：{{viewBaoHead.baoAmount}}</el-col>
              <el-col :span="2">毛重：{{viewBaoHead.baoWeight}}</el-col>
              <el-col :span="2">净重：{{viewBaoHead.baoStockWeight}}</el-col>
              <el-col :span="6">客户名称：{{viewBaoHead.baoCustomerName}}</el-col>
              <el-col :span="4">订单编号：{{viewBaoHead.baoOrderCode}}</el-col>
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
                        <el-col :span="6" class="pro-middle">
                          <span v-if="item.pickSkuProp.texTure">材质：{{item.pickSkuProp.texTure}}</span>&nbsp;
                        </el-col>
                        <el-col :span="12" class="pro-middle">
                          <span
                            v-if="item.pickSkuProp.surfaceTechnics"
                          >表面工艺：{{item.pickSkuProp.surfaceTechnics}}</span>&nbsp;
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="pro-middle">
                          <span
                            v-if="item.pickSkuProp.surfaceTechnics"
                          >产品类别：{{item.pickSkuProp.productType}}</span>&nbsp;
                        </el-col>
                        <el-col :span="6" class="pro-middle">
                          <span
                            v-if="item.pickSkuProp.surfaceTechnics"
                          >生产工艺：{{item.pickSkuProp.manufacturingTechnique}}</span>&nbsp;
                        </el-col>
                        <el-col :span="12" class="pro-middle">
                          <span
                            v-if="item.pickSkuProp.embroidery"
                          >车花：{{item.pickSkuProp.embroidery}}</span>&nbsp;
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="pro-bottom">成色：{{item.pickSkuProp.colorFormer  | $conditiNameFilter}}</el-col>
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
    </div>


    <!-- 打印 -->
    <div v-show="false">
      <PrintTPOne :billData="printData" ref="myComp"></PrintTPOne>
    </div>
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    
  </div>
</template>
<script>

var Nzh = require("nzh");
export default {
  data() {
    return {
      printData: {},
      loadingState: false,
      productData: [], //产品数据
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
      optionsTwo: [
        {
          ceditWayId: "足金999",
          ceditWayName: "足金999"
        },
        {
          ceditWayId: "足金9999",
          ceditWayName: "足金9999"
        }
      ],
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
      optionsThree: [],
      goldPrice: {}, //结价常用数据
      inputIndOne: "",
      tempObj: {},
      btnLoadingTF:false,
    };
  },
  created() {
    let self = this;
    this.outstoreId = this.$route.query.outstoreId;
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
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          outstoreId: self.outstoreId
        }
      };
      this.$axios
        .get(this.$portMain + "/outstore/getSpotOutstore", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingState = false;
            self.orderAllData = res.data.data;
            self.orderAllData.outstoreCedits.forEach(ielem => {
              if (!ielem.ceditMoney) {
                ielem.ceditMoney = "0.00";
              } else {
                ielem.ceditMoney = self.$api.returnFloat(ielem.ceditMoney);
              }
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
            //
            if (!self.orderAllData.jBaos) {
              self.orderAllData.jBaos = [];
            } else {
              self.orderAllData.jBaos.forEach(ielem => {
                ielem.baoOutstorePurWeight = ielem.baoOutstorePurWeight
                  ? ielem.baoOutstorePurWeight
                  : ielem.baoStockWeight;
              });
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
            self.changeSumNum();
            // console.log(self.orderAllData)
            //查看账款明细
            self.ceditFun();
            //查看存欠信息
            self.viewOweFun();
            //查看出货明细
            self.viewSkuCeditFun();
            //查看出货明细项目列表
            self.viewCategoryList();

            // console.log(self.ceditDataList)
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
      self.viewWay();
      // //查看結价接口事件
      // self.viewPriceFun();
      self.result = self.orderAllData;
      // });
    },
    //查看結价接口事件
    viewPriceFun(elem) {
      let self = this;
      this.$axios
        .post(this.$portMain + "/outstore/getKnotPriceByWageAndGold")
        .then(function(res) {
          self.goldPrice = res.data.data;
          // console.log(self.goldPrice)
        });
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
    //高开优惠背景设置
    tableRowClassName({row, rowIndex}) {
      if (row.saleTF === true) {
        return 'warning-row';
      }
    },
    //账款明细查看事件
    ceditFun() {
      let self = this;
      let params = {
        outstoreId: self.outstoreId
      };
      // console.log(params)
      this.$api.formdataPostFun(
        self.$portMain + "/outstore/getSingeOutstoreCedit",
        params,
        res => {
          if (
            self.orderAllData.outstoreStatue == "_wait" ||
            self.orderAllData.outstoreStatue == "_save"
          ) {
            self.ceditDataList = res.data;
            // console.log(self.ceditDataList)
            self.ceditDataList.forEach(ielem => {

              if(!isNaN(ielem.ceditPriceG)){
                ielem.billingWay='k';
                ielem.oldCeditPriceG = ielem.ceditPriceG
              }
              if(!isNaN(ielem.ceditPriceJ)){
                ielem.billingWay='j';
                ielem.oldCeditPriceJ = ielem.ceditPriceJ
              }
              ielem.ceditMoney = self.$api.returnFloat(ielem.ceditMoney);
              ielem.isOldTF = true
              ielem.sellHighTF = false
              // console.log(ielem)
            });
            // console.log(self.ceditDataList)
            // self.ceditDataList.push({
            //   isNewTF: true,
            //   kindTF: true,
            //   ceditWayId: "",
            //   ceditWayName: "",
            //   ceditPriceG: 0,
            //   ceditProjectId: "",
            //   ceditProject: "",
            //   ceditWeight: "",
            //   ceditAmount: "",
            //   ceditPriceJ: "",
            //   ceditMoney: ""
            // });
            self.changeSumNum();
          }
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //暂存事件
    confirmSave() {
      let self = this;
      let params = { outstoreId: self.outstoreId };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/confirmSaveOrnament",
        params,
        res => {
          self.$message.success("此单暂存成功，正在刷新！");
          setTimeout(function() {
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //查看方式事件
    viewWay() {
      let self = this;
      let params = {
        PRS: {
          billType: "outWay"
        }
      };
      this.$axios
        .get(this.$portMain + "/discount/getALLWay", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.options = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查看出货明细项目列表
    viewCategoryList() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/product/findMarketingCategoryList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.optionsThree = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //改变项目事件todo
    changeWayName(elem) {
      let self = this;
      let params = {
        PRS: {
          customerId: this.orderAllData.customerId,
          ceditWayId: elem.ceditWayId,
          ceditWayName: elem.ceditWayName
        }
      };
      this.options.forEach(item => {
        if (elem.ceditWayId === item.ceditWayId) {
          elem.ceditWayName = item.ceditWayName;
          if (item.billingWay === "k") {
            elem.ceditPriceG = item.price ? item.price : 0;
            elem.ceditWeight = elem.ceditWeight?elem.ceditWeight:0;
            elem.ceditAmount = null;
            elem.ceditPriceJ = null;
          } else {
            elem.ceditPriceG = "";
            if (item.billingWay === "g" || item.billingWay === "j") {
              elem.ceditPriceJ = item.price ? item.price : 0;
              elem.ceditAmount = elem.ceditAmount?elem.ceditAmount:0;
              elem.ceditPriceG = null;
            }
            if (item.billingWay === "d") {
              elem.ceditPriceG = null;
              elem.ceditPriceJ = null;
              elem.ceditWeight = null;
              elem.ceditAmount = null;
              elem.ceditMoney = item.price ? item.price : 0;
            } else {
              self.changeNum(elem);
            }
          }
          elem.billingWay = item.billingWay
          // console.log(elem)
          if (elem.billingWay != "d") {
            self.changeNum(elem);
            self.changeSumNum();
          }
        }
      });
      this.goldPriceFun(elem);
      elem.kindTF = false;
    },
    //改变项目结价的下拉框
    changeWayNameTwo(elem) {

      this.goldPriceFun(elem);
    },
    //结价金额事件
    goldPriceFun(elem) {
      let self = this;
      // console.log(elem)
      if (elem.ceditWayId == 2 || elem.ceditWayId == 4) {
        let params = { ceditWayId: elem.ceditWayId };
        this.$api.formdataPostFun(
          self.$portMain + "/outstore/getKnotPriceByWageAndGold",
          params,
          res => {
            self.goldPrice = res.data;
            for (var i in self.goldPrice) {
              if (elem.ceditProject === i) {
                elem.ceditPriceG = this.goldPrice[i];
              }
            }
            self.changeNum(elem);
            self.changeSumNum();
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      }
    },
    changeNum(elem) {
      let DTF = false;
      if(elem.ceditAmount){
        elem.ceditAmount = parseInt(elem.ceditAmount)
        if(elem.ceditAmount<0){
          elem.ceditAmount = 0
        }
      }
      this.options.forEach(item => {
        if (elem.ceditWayId === item.ceditWayId) {
          if (item.billingWay === "d") {
            elem.ceditPriceJ = item.price ? item.price : 0;
            elem.ceditMoney = item.price ? item.price : 0;
            DTF = true;
          }
        }
      });
      if (!DTF) {
        elem.ceditMoney =
          (elem.ceditWeight ? parseFloat(elem.ceditWeight) : 0) *
            (elem.ceditPriceG ? parseFloat(elem.ceditPriceG) : 0) +
          (elem.ceditAmount ? parseFloat(elem.ceditAmount) : 0) *
            (elem.ceditPriceJ ? parseFloat(elem.ceditPriceJ) : 0);
      } else {
        elem.ceditPriceJ = 0;
        elem.ceditMoney = elem.ceditPriceJ;
      }
      this.changeSumNum();
    },
    changeNumTwo(elem) {
      if(elem.ceditAmount){
        elem.ceditAmount = parseInt(elem.ceditAmount)
        if(elem.ceditAmount<0){
          elem.ceditAmount = 0
        }
      }
      let DTF = false;
      this.options.forEach(item => {
        if (elem.ceditWayId === item.ceditWayId) {
          if (item.billingWay === "d") {
            DTF = true;
          }
        }
      });

      if(!isNaN(elem.oldCeditPriceG) && elem.ceditWayName === '工费加收' && elem.isOldTF){
        if(elem.ceditPriceG > elem.oldCeditPriceG){
          elem.ceditPriceGNum = elem.ceditPriceG - elem.oldCeditPriceG
          if(elem.ceditPriceG < elem.oldCeditPriceG){
            elem.sellShowTF = false
          }
          elem.sellHighTF = true;
        }else{
          this.$message.error('工费加收输入单价/克不能小于初始值！')
          elem.ceditPriceG = elem.oldCeditPriceG
          elem.ceditPriceGNum = 0
          elem.sellHighTF = false;
        }
      }
      if(!isNaN(elem.oldCeditPriceJ) && elem.ceditWayName === '工费加收' && elem.isOldTF){
        if(elem.ceditPriceJ > elem.oldCeditPriceJ){
          elem.ceditPriceJNum = elem.ceditPriceJ - elem.oldCeditPriceJ
          elem.sellHighTF = true;
        }else{
          this.$message.error('工费加收输入单价/件不能小于初始值！')
          elem.ceditPriceJ = elem.oldCeditPriceJ
          elem.ceditPriceJNum = 0
          elem.sellHighTF = false;
        }
      }
      // console.log(elem)
      if (!DTF) {
        elem.ceditMoney =
          (elem.ceditWeight ? parseFloat(elem.ceditWeight) : 0) *
            (elem.ceditPriceG ? parseFloat(elem.ceditPriceG) : 0) +
          (elem.ceditAmount ? parseFloat(elem.ceditAmount) : 0) *
            (elem.ceditPriceJ ? parseFloat(elem.ceditPriceJ) : 0);
      } else {
        elem.ceditMoney = elem.ceditPriceJ;
        this.$forceUpdate();
      }
      this.changeSumNum();
    },
    changeSumNum() {
      // console.log('changeSumNum')
      this.ceditSumNum = 0;
      this.ceditDataList.forEach(jelem => {
        // console.log(jelem)
        this.ceditSumNum += parseFloat(jelem.ceditMoney ? jelem.ceditMoney : 0);
        if(jelem.ceditWayName === '退工费'){
          jelem.ceditMoney = jelem.ceditMoney > 0?(-1*jelem.ceditMoney):jelem.ceditMoney
        }
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    //确认出货
    upAudit() {
      let self = this;
      self.btnLoadingTF = true
      let outstoreCedits = [];
      self.ceditDataList.forEach((item,indOne) => {
        if (item.ceditWayId && item.ceditWayId != "") {
          if (item.kindTF) {
            self.options.forEach(ielem => {
              if (ielem.ceditWayName === item.ceditWayName) {
                item.ceditWayId = ielem.ceditWayId;
                item.ceditWayName = ielem.ceditWayName;
              }
            });
          } else {
            self.options.forEach(ielem => {
              if (ielem.ceditWayName === item.ceditWayName) {
                // item.ceditWayId = ielem.ceditWayId;
                // item.ceditWayName = ielem.ceditWayName;
              }
            });
          }

          self.options.forEach(ielem => {
            if (item.ceditWayId == ielem.ceditWayId) {
              item.ceditWayName = ielem.ceditWayName;
            }
          });
          // console.log(item)
          // console.log(indOne)
          if(item.sellTF){
            item.returnoutstoreCedit = self.ceditDataList[indOne+1]
          }
          
          outstoreCedits.push(item);
          // outstoreCedits.push({
          //   ceditWayId: item.ceditWayId ? item.ceditWayId : "",
          //   ceditWayName: item.ceditWayName ? item.ceditWayName : "",
          //   ceditProject: item.ceditProject ? item.ceditProject : "",
          //   ceditWeight: item.ceditWeight ? item.ceditWeight : "",
          //   ceditPriceG: item.ceditPriceG ? item.ceditPriceG : "",
          //   ceditAmount: item.ceditAmount ? item.ceditAmount : "",
          //   ceditPriceJ: item.ceditPriceJ ? item.ceditPriceJ : "",
          //   ceditMoney: item.ceditMoney ? item.ceditMoney : "",
          //   ceditNote: item.ceditNote ? item.ceditNote : "",
          //   kindTF: item.kindTF
          // });
        }
      });
      // console.log(outstoreCedits)
      let params = {
        outstoreCedits: JSON.stringify(outstoreCedits),
        outstoreId: self.outstoreId
      };

      let baoOutstorePurWeightTF = false;

      // console.log(self.orderAllData.jBaos)
      if (self.orderAllData.jBaos) {
        self.orderAllData.jBaos.forEach(ielem => {
          if (!ielem.baoOutstorePurWeight || ielem.baoOutstorePurWeight <= 0) {
            baoOutstorePurWeightTF = true;
          }
        });
        if (baoOutstorePurWeightTF) {
          self.btnLoadingTF = false
          self.$message.error("复核毛重未填或格式不正确，请重新填入复核毛重！");
          return false;
        }
      }

      //
      // console.log(self.orderAllData.jBaos)
      if (self.orderAllData.jBaos) {
        let JbaosList = [];
        self.orderAllData.jBaos.forEach(jelem => {
          JbaosList.push({
            baoId: jelem.baoId,
            baoOutstorePurWeight: jelem.baoOutstorePurWeight
          });
        });
        params.jbao = JSON.stringify(JbaosList);
      }
      self.btnLoadingTF = false
      this.$api.formdataPostFun(
        self.$portMain + "/outstore/confirmOutstore",
        params,
        res => {

          self.$message.success("确认出库成功！");
          self.printTabOneFun()
          self.printData.outstoreCode = res.data.code;
          self.printData.createTime = res.data.time
          setTimeout(function() {
            self.btnLoadingTF = false
            self.$router.push("shipmentOrder");
          }, 1000);
        },
        err => {
          self.btnLoadingTF = false
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
      //
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
          self.productData = res.data;
          self.viewBaoTF = true;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //添加款账明细
    addCeditFun() {
      let self = this;
      self.ceditDataList.forEach(ielem => {
        ielem.isNewTF = false;
      });
      self.ceditDataList.push({
        isNewTF: true,
        kindTF: true,
        ceditWayId: "",
        ceditWayName: "",
        ceditProject: "",
        ceditWeight: "",
        ceditPriceG: 0,
        ceditAmount: "",
        ceditPriceJ: "",
        ceditMoney: "",
        ceditNote: ""
      });
      // console.log(self.ceditDataList)
    },
    //添加款账明细
    addCeditTwoFun(index) {
      let self = this;
      self.ceditDataList.forEach(ielem => {
        ielem.isNewTF = false;
      });

      self.ceditDataList.splice(index + 1, 0, {
        // isNewTF: true,
        // kindTF: true,
        isOldTF:false,
        ceditWayId: "",
        ceditWayName: "",
        ceditProject: "",
        ceditWeight: "",
        ceditPriceG: "",
        ceditAmount: "",
        ceditPriceJ: "",
        ceditMoney: "",
        ceditNote: ""
      });
    },
    
    //添加高开优惠
    addCeditThreeFun(index) {
      let self = this;
      // self.ceditDataList.forEach(ielem => {
      //   ielem.isNewTF = false;
      // });
      // console.log(self.ceditDataList)
      self.ceditDataList[index].sellTF = true
      self.ceditDataList[index].sellShowTF = false
      let ceditObj = JSON.parse(JSON.stringify(self.ceditDataList[index]))
      ceditObj.ceditWayName = '退工费'
      ceditObj.ceditWayId = 8
      ceditObj.sellHighTF = false
      ceditObj.sellTF = false
      //单价/件*数量
      if(ceditObj.billingWay === 'j'){
        ceditObj.ceditPriceJ = ceditObj.ceditPriceJNum
        ceditObj.oldCeditPriceJ = ceditObj.ceditPriceJ
        ceditObj.ceditMoney = ceditObj.ceditPriceJ * ceditObj.ceditAmount * -1
      }
      //单价/克*克重
      if(ceditObj.billingWay === 'k'){
        ceditObj.ceditPriceG = ceditObj.ceditPriceGNum
        ceditObj.oldCeditPriceG = ceditObj.ceditPriceG
        ceditObj.ceditMoney = ceditObj.ceditPriceG * ceditObj.ceditWeight * -1
      }
      
      if(self.ceditDataList[index + 1] && self.ceditDataList[index + 1].sellTF === false){
        self.ceditDataList[index + 1] = ceditObj
      }else{
        self.ceditDataList.splice(index+1, 0, ceditObj);
      }
      if(self.ceditDataList[index+1]){
        // console.log(self.ceditDataList[index+1])
      }
      self.ceditDataList[index].sellHighTF = false;
      self.$forceUpdate()
      // self.ceditDataList.splice(index + 1, 0, {
      //   saleTF:true,
      //   ceditWayId: "",
      //   ceditWayName: "",
      //   ceditProject: "",
      //   ceditWeight: "",
      //   ceditPriceG: 0,
      //   ceditAmount: "",
      //   ceditPriceJ: "",
      //   ceditMoney: "",
      //   ceditNote: ""
      // });
    },
    //删除款账明细
    delCeditFun(index) {
      let self = this;
      self.ceditDataList.splice(index, 1);
      // console.log(self.ceditDataList)
    },
    focusQuery(e) {
      this.ceditInd = e;
    },
    querySearch(queryString, cb) {
      let self = this;
      self.ceditDataList[self.ceditInd].propList = [];
      let params = {
        PRS: {
          paypayVal: self.ceditDataList[self.ceditInd].ceditWayName,
          search: queryString
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPropKind", params)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data)
            var restaurants = [];
            if (res.data.data) {
              restaurants = res.data.data;
              restaurants.forEach(item => {
                item.value = item.kindName;
              });
            } else {
              restaurants = [];
            }
            // var restaurants = this.restaurants;
            // console.log(restaurants)
            var results = queryString
              ? restaurants.filter(this.createFilter(queryString))
              : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          }
        });
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    printTabOneFun() {
      let self = this;
      this.printData = JSON.parse(JSON.stringify(self.orderAllData));
      this.printData.outstoreCedits = this.ceditDataList;
      this.printData.sponsorUnit = "深圳尚金缘";
      this.$refs.myComp.compPrintFun();
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "") {
        self.$message.error("复核毛重没有被焦点选中！");
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
      self.tempObj.baoOutstorePurWeight = parseFloat(elem);
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
      this.tempObj = e;
      this.inputIndOne = ind + 1;
    },

    //输入框丢去焦点
    focusWeightBlur(elem) {
      let errorStatus = false;
      const { baoOutstorePurWeight,baoWeight } = elem;
      if (baoWeight > baoOutstorePurWeight) {
        errorStatus = true;
        elem.baoOutstorePurWeight = undefined;
        setTimeout(() => this.$forceUpdate(), 100);
      }
      this.weightTF = errorStatus;
      if (errorStatus) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
      }
      this.inputIndOne = "";
    },

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
    background: #fff;
  }

  .pro-tit {
    margin: 10px 0;
    font-size: 14px;
  }

  .pro-middle {
    margin: 10px 0;
    font-size: 14px;
    color: #889199;
  }

  .txtBlack {
    color: #232426;
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

      .order-tr-two {
        flex: 1;
        box-sizing: border-box;
        padding-left: 40px;
        display: flex;
        align-items: center;
        height: 30px;
        border-bottom: 1px solid #ccc;

        .otd {
          width: 200px;
          text-align: center;
        }
      }

      .order-tr-two:nth-of-type(odd) {
        background: #ffffff;
      }

      .order-tr-two:nth-of-type(even) {
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
  .width250{
    width:250px
  }
  .left10 {
    margin-left: 10px;
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
    padding: 5px 10px;
    border: 1px solid #ccc;
    margin: 10px;
    background: #fff;
    margin-bottom: 0;
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
    padding: 5px 10px;
    border: 1px solid #ccc;
    // border-top 0
    margin: 10px;
    margin-top: 0;
    margin-bottom: 20px;
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
    margin: 0 auto;
  }

  .inputSmallTwo {
    width: 120px;
    text-align: center;
    margin: 0 auto;
  }

  .txtLeft {
    text-align: left;
  }

  .txtRight {
    text-align: right;
  }

  .width70 {
    width: 80px;
  }

  .txtRight30 {
    margin-right: 50px;
  }

  .tableWrap {
    border: 1px solid #ccc;
    min-width: 1100px;

    .borderRight {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px dashed #ccc;
      padding-right: 5px;
    }

    .leftStyle {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: flex-start;
    }

    .rightStyle {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: flex-end;
    }
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
      font-size: 14px;
      color: #889199;
    }
  }
}

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


.el-table .success-row {
  background: #f28a0f;
}
</style>
