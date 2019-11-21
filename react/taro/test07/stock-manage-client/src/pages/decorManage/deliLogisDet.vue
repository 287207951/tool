<template>
  <div class="conBigDiv" ref="repleOrder">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>收工厂饰列表</el-breadcrumb-item>
      <el-breadcrumb-item>收工厂饰详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info" v-loading="webLoadingTF">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">原单据号</div>
            <div class="th">客户名称</div>
            <div class="th">工单号</div>
            <div class="th">工厂名称</div>
            <div class="th">订单数量</div>
            <!-- <div class="th">毛重(g)</div> -->
            <div class="th">净重(g)</div>
            <!-- <div class="th">操作人</div> -->
            <div class="th">制单时间</div>
            <div class="th">订单状态</div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{orderHeader.oriOrderNo}}</div>
            <div class="td">{{orderHeader.clientName}}</div>
            <div class="td">{{orderHeader.factoryOrderNo}}</div>
            <div class="td">{{orderHeader.factoryName}}</div>
            <div class="td">{{orderHeader.orderSum}}</div>
            <!-- <div class="td">{{orderHeader.orderWeight}}</div> -->
            <div class="td">{{orderHeader.orderGoldWeight}}</div>
            <!-- <div class="td">-</div> -->
            <div class="td">{{orderHeader.createTime}}</div>
            <div class="td">
              <span v-if="orderHeader.ownOrderStatus == undefined">-</span>
              <span v-if="orderHeader.ownOrderStatus == 1" class="yellowColor">待收货</span>
              <span v-if="orderHeader.ownOrderStatus == 2" class="blackColor">已收完</span>
              <span v-if="orderHeader.ownOrderStatus == 3" class="redColor">未收完</span>
              <span v-if="orderHeader.ownOrderStatus == 4" class="heiColor">终止收货</span>
              <span v-if="orderHeader.ownOrderStatus == 15" class="redColor">拒收</span>
            </div>
          </div>
          <div class="titTwo">
            <div>
              <span class="titTwoTxt">已入饰记录</span>
              <el-table :data="orderList.list" style="width: 100%">
                <el-table-column prop="createTime" label="入饰时间" width="180">
                  <template slot-scope="scope">
                    <span>{{$api.dateGetDayTime(scope.row.createTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="stockNumber" label="入饰单号" width="180"></el-table-column>
                <el-table-column prop="factoryName" label="工厂名称"></el-table-column>
                <el-table-column prop="number" label="数量"></el-table-column>
                <el-table-column prop="weight" label="重量(g)">
                  <template slot-scope="scope">
                    <span>{{$api.returnFloatNum(scope.row.weight)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="money" label="金额(￥)"></el-table-column>
                <el-table-column prop="statu" label="单据状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.statu === 1">已完成</span>
                    <span class="txtRed" v-if="scope.row.statu === 2">红冲</span>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                  <template slot-scope="scope">
                    <span class="txtRed" @click="viewFun(scope.row)">查看详情</span>
                    <!-- <span
                      class="txtRed"
                      @click="hcFun(scope.row)"
                      v-if="scope.row.statu === 1"
                      :loading="btnLoadingTF"
                    >红冲</span>-->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-show="false">
          <div style="display:flex" ref="printTabOne">
            <div style="width:32%">
              <div class="tableTop">入库明细</div>
              <el-table
                :data="tableLeftData"
                show-summary
                :summary-method="getSummaries"
                border
                style="width: 100%;"
              >
                <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
                <el-table-column
                  align="center"
                  prop="marketingCategoryName"
                  label="营销品类"
                  width="150"
                ></el-table-column>
                <el-table-column align="center" prop="conditi" label="种类"></el-table-column>
                <el-table-column prop="weight" align="center" label="实收重量"></el-table-column>
              </el-table>
            </div>
            <div style="width:68%">
              <div class="tableTop">账款明细</div>
              <el-table
                :data="tableRightData"
                show-summary
                :summary-method="getSummaries"
                border
                style="width: 100%"
              >
                <el-table-column prop="ceditWayName" align="center" label="结费方式" width="100"></el-table-column>
                <el-table-column prop="ceditProject" align="center" label="项目" width="110"></el-table-column>
                <el-table-column prop="ceditWeight" align="center" label="重量"></el-table-column>
                <el-table-column prop="ceditPriceG" align="center" label="单价/克"></el-table-column>
                <el-table-column prop="ceditAmount" align="center" label="数量"></el-table-column>
                <el-table-column prop="ceditPriceJ" align="center" label="单价/件"></el-table-column>
                <el-table-column prop="ceditMoney" align="center" label="金额"></el-table-column>
                <el-table-column prop="ceditNote" align="center" label="备注"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <el-dialog
          title="入饰单详情"
          :visible.sync="viewBaoTFOne"
          width="1200px"
          :close-on-click-modal="false"
        >
          <span>
            <div style="display:flex" ref="printTabThree">
              <div style="width:32%">
                <div class="tableTop">入库明细</div>
                <el-table
                  :data="tableLeftData"
                  show-summary
                  :summary-method="getSummaries"
                  border
                  style="width: 100%;"
                >
                  <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
                  <el-table-column
                    prop="marketingCategoryName"
                    align="center"
                    label="营销品类"
                    width="150"
                  ></el-table-column>
                  <el-table-column align="center" prop="conditi" label="种类"></el-table-column>
                  <el-table-column prop="weight" align="center" label="实收重量"></el-table-column>
                </el-table>
              </div>
              <div style="width:68%">
                <div class="tableTop">账款明细</div>
                <el-table
                  :data="tableRightData"
                  show-summary
                  :summary-method="getSummaries"
                  border
                  style="width: 100%"
                >
                  <el-table-column prop="ceditWayName" align="center" label="结费方式" width="100"></el-table-column>
                  <el-table-column prop="ceditProject" align="center" label="项目" width="110"></el-table-column>
                  <el-table-column prop="ceditWeight" align="center" label="重量"></el-table-column>
                  <el-table-column prop="ceditPriceG" align="center" label="单价/克"></el-table-column>
                  <el-table-column prop="ceditAmount" align="center" label="数量"></el-table-column>
                  <el-table-column prop="ceditPriceJ" align="center" label="单价/件"></el-table-column>
                  <el-table-column prop="ceditMoney" align="center" label="金额"></el-table-column>
                  <el-table-column prop="ceditNote" align="center" label="备注"></el-table-column>
                </el-table>
              </div>
            </div>
          </span>
        </el-dialog>
        <el-dialog
          title="入库单详情"
          :visible.sync="viewBaoTFTwo"
          width="1400px"
          :close-on-click-modal="false"
        >
          <span>
            <div style="display:flex">
              <div style="width:25%">入饰单号：{{findAllData.number}}</div>
              <div style="width:25%">接收单位：{{findAllData.reapUnit}}</div>
              <div style="width:25%">客户名称：{{findAllData.clientName}}</div>
              <div style="width:25%" class="txtRight">工厂名称：{{findAllData.factoryName}}</div>
            </div>
            <div style="display:flex">
              <div style="width:350px">
                <div class="tableTop">入库明细</div>
                <el-table
                  :data="tableLeftData"
                  show-summary
                  :summary-method="getSummaries"
                  border
                  style="width: 100%;"
                >
                  <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
                  <el-table-column align="center" prop="conditi" label="种类"></el-table-column>
                  <el-table-column prop="marketingCategoryName" align="center" label="营销品类">
                    <template slot-scope="scope">
                      <p
                        style="height: 32px; line-height: 30px; white-space: nowrap;"
                      >{{ scope.row.marketingCategoryName }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" align="center" label="实收重量"></el-table-column>
                </el-table>
              </div>
              <div style="width: calc( 100% - 350px )" class="secodTableWrap">
                <div class="tableTop">账款明细</div>
                <el-table
                  :data="tableRightData"
                  show-summary
                  :summary-method="getSummaries"
                  border
                  style="width: 100%"
                >
                  <el-table-column prop="ceditWayName" align="center" label="结费方式" width="100">
                    <template slot-scope="scope">
                      <div :title="scope.row.ceditWayName">
                        <el-select
                          v-model="scope.row.ceditWayName"
                          placeholder="请选择"
                          size="small"
                          class="inputSmallTwo"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.ceditWayId"
                            :label="item.ceditWayName"
                            :value="item.ceditWayName"
                          ></el-option>
                        </el-select>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditProject" align="center" label="项目" width="110">
                    <template slot-scope="scope">
                      <div :title="scope.row.ceditProject">
                        <el-input v-model="scope.row.ceditProject" placeholder size="small"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditWeight" align="center" label="重量">
                    <template slot-scope="scope">
                      <el-input-number
                        class="width62"
                        :controls="false"
                        v-model="scope.row.ceditWeight"
                        @blur="comptMoney(scope.row)"
                        placeholder
                        size="small"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditPriceG" align="center" label="单价/克">
                    <template slot-scope="scope">
                      <el-input-number
                        class="width62"
                        :controls="false"
                        v-model="scope.row.ceditPriceG"
                        :disabled="scope.row.ceditPriceJ != undefined"
                        @blur="comptMoney(scope.row)"
                        placeholder
                        size="small"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditAmount" align="center" label="数量">
                    <template slot-scope="scope">
                      <el-input-number
                        class="width62"
                        :controls="false"
                        v-model="scope.row.ceditAmount"
                        @blur="comptMoney(scope.row)"
                        placeholder
                        size="small"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditPriceJ" align="center" label="单价/件">
                    <template slot-scope="scope">
                      <el-input-number
                        class="width62"
                        :controls="false"
                        v-model="scope.row.ceditPriceJ"
                        :disabled="scope.row.ceditPriceG != undefined"
                        @blur="comptMoney(scope.row)"
                        placeholder
                        size="small"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ceditMoney" align="center" label="金额" width="110">
                    <!-- <template slot-scope="scope">
                      <el-input-number
                        class="width62"
                        :controls="false"
                        v-model="scope.row.ceditMoney"
                        @blur="checkNumber(scope.row)"
                        placeholder
                        size="small"
                      ></el-input-number>
                    </template>-->
                  </el-table-column>
                  <el-table-column prop="ceditNote" align="center" label="备注" width="130">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.ceditNote" placeholder size="small"></el-input>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="address" align="center" label="操作" width="95">
                    <template slot-scope="scope">
                      <span class="redColor" @click="addDataOne(scope.$index, tableRightData)">添加</span>
                      <span
                        class="redColor"
                        @click="delDataOne(scope.$index, tableRightData)"
                        v-if="scope.$index != 0"
                      >删除</span>
                    </template>
                  </el-table-column> -->
                </el-table>
              </div>
            </div>
            <div>
              SKU明细
              <div>
                <!-- 单品start -->
                <div v-if="findAllData.proList">
                  <div
                    class="info-item-wrap"
                    v-for="(iitem,index) in findAllData.proList"
                    :key="index"
                  >
                    <!-- {{iitem}} -->
                    <el-row>
                      <el-col :span="24">
                        <div class="infom-item">
                          <div class="pro-item iitem-left">
                            <!-- <span><el-checkbox v-model="iitem.selectTF" @change="changeFun(iitem.selectTF)"></el-checkbox></span> -->
                            <div class="pro-imgs">
                              <img
                                :src="iitem.url?$portImg + iitem.url:'../../../static/images/img-noimg.png'"
                                width="153"
                                height="116"
                              >
                            </div>
                            <div class="pro-right">
                              <el-row style="height: 32px;">
                                <el-col :span="8" class="pro-tit">{{iitem.proName}}</el-col>
                                <el-col :span="8" class="pro-middle">
                                  下单数量：
                                  <span class="blackColor">{{iitem.pieceNum}}</span>
                                </el-col>
                                <el-col :span="8" class="pro-middle">
                                  应收数量：
                                  <span class="blackColor">{{iitem.receiableNum}}</span>
                                </el-col>
                              </el-row>
                              <el-row style="height: 35px;">
                                <el-col :span="8" class="pro-middle">
                                  编号：
                                  <span class="blackColor">{{iitem.proNumber}}</span>
                                </el-col>
                                <el-col :span="8" class="pro-middle">
                                  金重：
                                  <span
                                    class="blackColor"
                                  >{{$api.returnFloatNum(iitem.realityNumber*iitem.weight)}}</span>
                                </el-col>
                                <el-col :span="8" class="pro-middle">
                                  实收数量：
                                  <span class="blackColor">{{iitem.realityNumber}}</span>
                                </el-col>
                              </el-row>
                              <el-row style="height: 35px;">
                                <el-col :span="8" class="pro-middle">
                                  克重(g):
                                  <span class="blackColor">{{iitem.weight}}</span>
                                </el-col>
                                <el-col :span="8" class="pro-middle">
                                  工费：
                                  <span
                                    class="blackColor"
                                    v-if="iitem.feeType === 1"
                                  >{{iitem.additionPrice+'元/克'}}</span>
                                  <span
                                    class="blackColor"
                                    v-if="iitem.feeType === 2"
                                  >{{iitem.feePrice+'元/件'}}</span>
                                </el-col>
                                <el-col :span="8" class="pro-middle">
                                  实收重量(g)：
                                  <span class="blackColor">{{iitem.realityWeight}}</span>
                                </el-col>
                              </el-row>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>

                <!-- 单品end -->
              </div>
            </div>
            <div class="txtRight top10">
              <el-button size="small" @click="cancelFunOne()">取消</el-button>
              <el-button
                size="small"
                type="primary"
                @click="submitFunOne()"
                :loading="btnLoadingTF"
              >提交并打印</el-button>
            </div>
          </span>
        </el-dialog>
        <div class="hrOne"></div>
      </div>
      <div v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3">
        <div class="oneClass">
          <span class="titTwoTxt">未入饰列表</span>
          <span>
            <el-input
              v-model="orderIdNum"
              placeholder="请输入编号搜索"
              ref="orderIdNum"
              class="width250"
              size="small"
              suffix-icon="el-icon-search"
              @change="orderIdNumFun"
            ></el-input>
          </span>
          <!-- <el-checkbox v-model="allSelect" @change="allSelectFun">全选</el-checkbox> -->
          <span
            class="txtTwo"
            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
          >
            <el-button
              size="small"
              @click="oneKeyAddOne"
              :loading="btnLoadingTF"
              v-if="orderList.status === 1"
            >终止收货</el-button>
            <el-button
              type="primary"
              size="small"
              @click="oneKeyAddTwo"
              :loading="btnLoadingTF"
            >确认收货</el-button>
          </span>
        </div>
        <div class="info-middle">
          <!-- 单品start -->
          <div v-if="orderList.orderInfoFrom.singleProduct" v-show="!searchTF">
            <div
              class="info-item-wrap"
              v-for="(iitem,index) in orderList.orderInfoFrom.singleProduct"
              :key="index"
            >
              <el-row>
                <el-col :span="24">
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
                          <el-col :span="6" class="pro-middle">
                            编号：
                            <span class="blackColor">{{iitem.clientSkuNo}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">
                            下单数量：
                            <span class="blackColor">{{iitem.pieceNum}}</span>
                          </el-col>
                          <el-col :span="8" class="pro-middle">
                            应收数量：
                            <span class="blackColor">{{iitem.receiableNum}}</span>
                          </el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-middle">
                            克重(g):
                            <span class="blackColor">{{iitem.standardGold}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">
                            工费(￥)：
                            <span
                              class="blackColor"
                              v-if="iitem.facFeeType === '1'"
                            >{{iitem.facPrice}}</span>
                            <span
                              class="blackColor"
                              v-if="iitem.facFeeType === '2'"
                            >{{iitem.facPiecePrice}}</span>
                          </el-col>
                          <el-col
                            :span="10"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收数量：&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input-number
                              v-model="iitem.number"
                              :disabled="iitem.receiableNum <= 0"
                              class="width70"
                              :controls="false"
                              :min="1"
                              :max="iitem.receiableNum"
                              size="small"
                              @change="checkInputNumber(orderList.orderInfoFrom.singleProduct, index)"
                            ></el-input-number>
                          </el-col>
                          <el-col :span="2" class="pro-middle" v-show="editTF"></el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-bottom">&nbsp;</el-col>
                          <el-col :span="6" class="pro-bottom">
                            <b v-if="iitem.extendAttr && iitem.one" v-html="$api.getAttachProperty(iitem.one,iitem.extendAttr)"></b>&nbsp;
                          </el-col>
                          <el-col
                            :span="6"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收金重(g)：
                            <el-input-number
                              v-model="iitem.weight"
                              class="width70"
                              :controls="false"
                              :min="0"
                              size="small"
                              :disabled="iitem.receiableNum <= 0"
                              @focus="focusWeightFocus(iitem,index,'单品')"
                              @blur="focusWeightBlur()"
                            ></el-input-number>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 单品end -->
          <!-- 套装start -->
          <div v-if="orderList.orderInfoFrom.suitProductInfoFroms" v-show="!searchTF">
            <div
              class="info-item-wrap"
              v-for="(iitem,index) in orderList.orderInfoFrom.suitProductInfoFroms"
              :key="index"
            >
              <el-row>
                <el-col :span="24">
                  <div class="infom-item">
                    <div class="pro-item iitem-left">
                      <div class="pro-imgs">
                        <img
                          :src="iitem.suitProductImg?$portImg + iitem.suitProductImg:'../../../static/images/img-noimg.png'"
                          width="153"
                          height="116"
                        >
                      </div>
                      <div class="pro-right">
                        <el-row style="height: 32px;">
                          <el-col :span="24" class="pro-tit">{{iitem.suitProductName}}</el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-middle">
                            编号：
                            <span class="blackColor">{{iitem.suitSkuNum}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">
                            下单数量：
                            <span class="blackColor">{{iitem.suitSum}}</span>
                          </el-col>
                          <el-col :span="8" class="pro-middle">
                            应收数量：
                            <span class="blackColor">{{iitem.receiableNum}}</span>
                          </el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-middle">
                            克重(g):
                            <span class="blackColor">{{iitem.suitWeight}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">
                            工费(￥)：
                            <span
                              class="blackColor"
                            >{{iitem.facSuitPrice}}</span>
                          </el-col>
                          <el-col
                            :span="10"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收数量：&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input-number
                              v-model="iitem.number"
                              :disabled="iitem.receiableNum <= 0"
                              class="width70"
                              :controls="false"
                              :min="1"
                              :max="iitem.receiableNum"
                              size="small"
                              :step="1"
                              step-strictly
                              @change="checkInputNumber(orderList.orderInfoFrom.suitProductInfoFroms, index)"
                            ></el-input-number>
                          </el-col>
                          <el-col :span="2" class="pro-middle" v-show="editTF"></el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-bottom">&nbsp;</el-col>
                          <el-col :span="6" class="pro-bottom">
                            <b v-if="iitem.extendAttr && iitem.one" v-html="$api.getAttachProperty(iitem.one,iitem.extendAttr)"></b>&nbsp;
                          </el-col>
                          <el-col
                            :span="10"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收金重(g)：
                            <el-input-number
                              v-model="iitem.weight"
                              class="width70"
                              :controls="false"
                              :min="0"
                              size="small"
                              :disabled="iitem.receiableNum <= 0"
                              @focus="focusWeightFocus(iitem,index,'套装')"
                              @blur="focusWeightBlur()"
                            ></el-input-number>
                          </el-col>
                          <el-col :span="2" class="pro-middle">
                            <span class="redTxt" v-if="iitem.viewSuit" @click="editSuit(iitem)">
                              套装详情
                              <i class="el-icon-arrow-up"></i>
                            </span>
                            <span class="redTxt" v-if="!iitem.viewSuit" @click="editSuit(iitem)">
                              套装详情
                              <i class="el-icon-arrow-down"></i>
                            </span>
                          </el-col>
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
                          v-for="(ielem,indOne) in iitem.factorySkus"
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
                              <el-col :span="24" class="pro-middle-Two">
                                编号：
                                <span class="blackColor">{{ielem.productNo}}</span>
                              </el-col>
                              <el-col
                                :span="24"
                                class="pro-middle-Two"
                              >{{ielem.pait}} {{ielem.carFlower}} {{ielem.craft || '&nbsp;'}}</el-col>
                              <el-col :span="6" class="pro-middle-Two">
                                克重(g)：
                                <span class="blackColor">{{ielem.standardGold}}</span>
                              </el-col>
                              <el-col :span="7" class="pro-middle-Two">&nbsp;</el-col>
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
          </div>
          <!-- 套装end -->
          <!--搜索结果start-->
          <div
            v-if="proAllData.singleProduct && proAllData.suitProductInfoFroms && proAllData.singleProduct.length === 0 & proAllData.suitProductInfoFroms.length ===0 && searchTF"
            class="infom-item pro-item"
          >查无产品，请清空搜索框再输入编号！</div>
          <!-- 搜索单品start -->
          <div
            v-if="proAllData.singleProduct && proAllData.singleProduct.length > 0"
            v-show="searchTF"
          >
            <div
              class="info-item-wrap"
              v-for="(iitem,index) in proAllData.singleProduct"
              :key="index"
            >
              <el-row>
                <el-col :span="24">
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
                          <el-col :span="6" class="pro-middle">
                            编号：
                            <span class="blackColor">{{iitem.clientSkuNo}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">
                            下单数量：
                            <span class="blackColor">{{iitem.pieceNum}}</span>
                          </el-col>
                          <el-col :span="8" class="pro-middle">
                            应收数量：
                            <span class="blackColor">{{iitem.receiableNum}}</span>
                          </el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-middle">
                            克重(g):
                            <span class="blackColor">{{iitem.standardGold}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">&nbsp;</el-col>
                          <el-col
                            :span="10"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收数量：&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input-number
                              v-model="iitem.number"
                              :disabled="iitem.receiableNum <= 0"
                              class="width70"
                              :controls="false"
                              :min="1"
                              :max="iitem.receiableNum"
                              size="small"
                              :step="1"
                              step-strictly
                              @change="checkInputNumber(proAllData.singleProduct, index)"
                            ></el-input-number>
                          </el-col>
                          <el-col :span="2" class="pro-middle" v-show="editTF"></el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-bottom">&nbsp;</el-col>
                          <el-col :span="6" class="pro-bottom">
                            <b v-if="iitem.extendAttr && iitem.one" v-html="$api.getAttachProperty(iitem.one,iitem.extendAttr)"></b>&nbsp;
                          </el-col>
                          <el-col
                            :span="6"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收金重(g)：
                            <el-input-number
                              v-model="iitem.weight"
                              class="width70"
                              :controls="false"
                              :min="0"
                              size="small"
                              :disabled="iitem.receiableNum <= 0"
                              @change="changeNum(iitem,index,'搜索单品')"
                              @focus="focusWeightFocus(iitem,index,'搜索单品')"
                              @blur="focusWeightBlur()"
                            ></el-input-number>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 搜索单品end -->
          <!-- 搜索套装start -->
          <div
            v-if="proAllData.suitProductInfoFroms && proAllData.suitProductInfoFroms.length > 0"
            v-show="searchTF"
          >
            <div
              class="info-item-wrap"
              v-for="(iitem,index) in proAllData.suitProductInfoFroms"
              :key="index"
            >
              <el-row>
                <el-col :span="24">
                  <div class="infom-item">
                    <div class="pro-item iitem-left">
                      <div class="pro-imgs">
                        <img
                          :src="iitem.suitProductImg?$portImg + iitem.suitProductImg:'../../../static/images/img-noimg.png'"
                          width="153"
                          height="116"
                        >
                      </div>
                      <div class="pro-right">
                        <el-row style="height: 32px;">
                          <el-col :span="24" class="pro-tit">{{iitem.suitProductName}}</el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-middle">
                            编号：
                            <span class="blackColor">{{iitem.suitSkuNum}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">
                            下单数量：
                            <span class="blackColor">{{iitem.suitSum}}</span>
                          </el-col>
                          <el-col :span="8" class="pro-middle">
                            应收数量：
                            <span class="blackColor">{{iitem.receiableNum}}</span>
                          </el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-middle">
                            克重(g):
                            <span class="blackColor">{{iitem.suitWeight}}</span>
                          </el-col>
                          <el-col :span="6" class="pro-middle">&nbsp;</el-col>
                          <el-col
                            :span="10"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收数量：&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input-number
                              v-model="iitem.number"
                              :disabled="iitem.receiableNum <= 0"
                              class="width70"
                              :controls="false"
                              :min="1"
                              :max="iitem.receiableNum"
                              size="small"
                              :step="1"
                              step-strictly
                              @change="checkInputNumber(proAllData.suitProductInfoFroms, index)"
                            ></el-input-number>
                          </el-col>
                          <el-col :span="2" class="pro-middle" v-show="editTF"></el-col>
                        </el-row>
                        <el-row style="height: 35px;">
                          <el-col :span="6" class="pro-bottom">&nbsp;</el-col>
                          <el-col :span="6" class="pro-bottom">
                            <b v-if="iitem.extendAttr && iitem.one" v-html="$api.getAttachProperty(iitem.one,iitem.extendAttr)"></b>&nbsp;
                          </el-col>
                          <el-col
                            :span="10"
                            class="pro-middle"
                            v-if="orderHeader.ownOrderStatus == 1 || orderHeader.ownOrderStatus == 3"
                          >
                            实收金重(g)：
                            <el-input-number
                              v-model="iitem.weight"
                              class="width70"
                              :controls="false"
                              :min="0"
                              size="small"
                              :disabled="iitem.receiableNum <= 0"
                              @change="changeNum(iitem,index,'搜索套装')"
                              @focus="focusWeightFocus(iitem,index,'搜索套装')"
                              @blur="focusWeightBlur()"
                            ></el-input-number>
                          </el-col>
                          <el-col :span="2" class="pro-middle">
                            <span class="redTxt" v-if="iitem.viewSuit" @click="editSuit(iitem)">
                              套装详情
                              <i class="el-icon-arrow-up"></i>
                            </span>
                            <span class="redTxt" v-if="!iitem.viewSuit" @click="editSuit(iitem)">
                              套装详情
                              <i class="el-icon-arrow-down"></i>
                            </span>
                          </el-col>
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
                          v-for="(ielem,indOne) in iitem.factorySkus"
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
                              <el-col :span="24" class="pro-middle-Two">
                                编号：
                                <span class="blackColor">{{ielem.productNo}}</span>
                              </el-col>
                              <el-col
                                :span="24"
                                class="pro-middle-Two"
                              >{{ielem.pait}} {{ielem.carFlower}} {{ielem.craft}}</el-col>
                              <el-col :span="6" class="pro-middle-Two">
                                克重(g)：
                                <span class="blackColor">{{ielem.standardGold}}</span>
                              </el-col>
                              <el-col :span="7" class="pro-middle-Two">&nbsp;</el-col>
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
          </div>
          <!-- 搜索套装end -->
          <!--搜索结果end-->
        </div>
      </div>
      <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
      
    </div>
    <div ref="printTabTwo" v-show="false" style="width:200px">
      <div
        style="line-height:20px;font-size:10px;padding-left:5px;font-weight:bold;font-family:'SimHei'"
      >
        <div style="padding-left:5px">
          <img ref="imgcodeTwo" id="imgcodeTwo">
          <div style="margin-top:-5px;font-size:14px;">{{viewBaoHead.clientSkuNo}}</div>
        </div>
        <div>订单号：{{orderHeader.factoryOrderNo}}</div>
        <div>客户名：{{orderHeader.clientName}}</div>
        <div>名称：{{viewBaoHead.productName}}</div>
        <div style="display:flex">
          <div style="width:100px">件数：{{viewBaoHead.editSkuSum}}</div>
          <div style="width:100px">毛重：{{viewBaoHead.skuWeight}}</div>
          <div style="width:100px">净重：{{viewBaoHead.editSkuWeight}}</div>
        </div>
      </div>
    </div>
    <el-dialog title="退饰出库单详情" :visible.sync="viewBaoTFFive" width="1200px">
      <span>
        <!-- <el-row>
            <el-col :span="6">
              退饰单号：1111111
            </el-col>
            <el-col :span="6">
              退饰单位：1111111
            </el-col>
            <el-col :span="6">
              接收单位：1111
            </el-col>
            <el-col :span="6">
              备注：1111
            </el-col>
        </el-row>-->
        <div style="display:flex;margin-top:20px">
          <div style="width:32%">
            <div class="tableTop">入库明细</div>
            <el-table
              :data="tableLeftData"
              show-summary
              :summary-method="getSummaries"
              border
              style="width: 100%;"
            >
              <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="marketingCategoryName" align="center" label="营销品类"></el-table-column>
              <el-table-column align="center" prop="conditi" label="种类"></el-table-column>

              <el-table-column prop="weight" align="center" label="实收重量"></el-table-column>
            </el-table>
          </div>
          <div style="width:68%">
            <div class="tableTop">账款明细</div>
            <el-table
              :data="tableRightData"
              show-summary
              :summary-method="getSummaries"
              border
              style="width: 100%"
            >
              <el-table-column prop="ceditWayName" align="center" label="结费方式" width="100">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.ceditWayName"
                    placeholder="请选择"
                    size="small"
                    class="inputSmallTwo"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.ceditWayId"
                      :label="item.ceditWayName"
                      :value="item.ceditWayName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="ceditProject" align="center" label="项目" width="110">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ceditProject" placeholder size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ceditWeight" align="center" label="重量">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    class="width62"
                    v-model="scope.row.ceditWeight"
                    placeholder
                    size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="ceditPriceG" align="center" label="单价/克">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    class="width62"
                    v-model="scope.row.ceditPriceG"
                    placeholder
                    size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="ceditAmount" align="center" label="数量">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    class="width62"
                    v-model="scope.row.ceditAmount"
                    placeholder
                    size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="ceditPriceJ" align="center" label="单价/件">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    class="width62"
                    v-model="scope.row.ceditPriceJ"
                    placeholder
                    size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="ceditMoney" align="center" label="金额">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    class="width62"
                    v-model="scope.row.ceditMoney"
                    placeholder
                    size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="ceditNote" align="center" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ceditNote" placeholder size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="address" align="center" label="操作" width="100">
                <template slot-scope="scope">
                  <span class="redColor" @click="addDataOne(scope.$index, tableRightData)">添加</span>
                  <span
                    class="yellowColor"
                    @click="delDataOne(scope.$index, tableRightData)"
                    v-if="scope.$index != 0"
                  >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="txtRight top10">
          <el-button size="small" @click="cancelFunOne">取消</el-button>
          <el-button size="small" type="primary" @click="hcFunTwo()" :loading="btnLoadingTF">提交并打印</el-button>
        </div>
      </span>
    </el-dialog>

    <!-- 打印入饰单 -->
    <div v-show="false">
      <PrintTPFive :billData="decorationAllData" ref="myCompDecoration"></PrintTPFive>
    </div>
  </div>
</template>
<script>

var Nzh = require("nzh");
export default {
  data() {
    return {
      stepsActive: 1,
      orderList: { receivSkus: [], list: [] },
      result: {},
      orderHeader: {}, //单头
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
      viewBaoTFOne: false, //
      viewBaoTFTwo: false, //
      tableLeftData: [{}], //入货明细表格属性
      tableRightData: [{}], //账款明细表格属性
      options: [], //结费方式
      subProData: [], //产品提交数据
      findAllData: {}, //生成数据
      orderIdNum: "", //订单搜索
      enterStatus: "", //点击类型
      proAllData: [], //产品所有数据
      searchTF: false, //搜索状态，默认为false
      viewBaoTFFive: false,
      stockNumber: "", //退饰单号
      ceditSumNum: 0,
      priceTxt: "",
      nowTime: "",
      skuCeditSum: 0,
      decorationAllData: {}
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
    checkInputNumber(list, index) {
      let _list = [...list];
      let _item = _list[index];
      _item.number = ~~_item.number;
      list.splice(index, 1, _item);
    },
    created_fun() {
      var self = this;
      self.webLoadingTF = true;
      let params = {
        orderNo: self.orderNo
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/selectProductPer",
        params,
        res => {
          self.webLoadingTF = false;
          self.orderList = res.data;
          self.orderHeader = res.data.orderInfoFrom;
          if (
            self.orderList.orderInfoFrom.singleProduct &&
            self.orderList.orderInfoFrom.singleProduct.length > 0
          ) {
            self.orderList.orderInfoFrom.singleProduct.forEach(ielem => {
              ielem.selectTF = false;
              ielem.number = ielem.receiableNum;
              // console.log(ielem)
            });
          }
          if (
            self.orderList.orderInfoFrom.suitProductInfoFroms &&
            self.orderList.orderInfoFrom.suitProductInfoFroms.length > 0
          ) {
            self.orderList.orderInfoFrom.suitProductInfoFroms.forEach(ielem => {
              ielem.selectTF = false;
              ielem.number = ielem.receiableNum;
              // console.log(ielem)
            });
          }
          // 单品

          //套装
          // console.log(self.orderList)
          // self.menuData();
          //查看出货明细项目列表
          self.viewWay();
        },
        err => {
          self.webLoadingTF = false;
          self.$message.error(err.msg);
        }
      );
    },
    
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      if (data.length === 0) {
        return;
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        // console.log(column)
        if (column.label === "实收重量" || column.label === "金额") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              // console.log(values)
              // const value = Number(curr);
              const value = this.$api.returnFloatNum(curr);
              if (!isNaN(value)) {
                return (Number(prev) + Number(curr)).toFixed(2);
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
    //菜单读取事件
    menuData() {
      var self = this;
      self.tableDisData.forEach(item => {
        if (self.orderList.orderType == item.code) {
          self.tableMenuData = item;
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
      if (self.inputIndOne == "") {
        self.$message.error("实收金重没有被焦点选中！");
      }
      if (self.inputIndOne) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },
    
    //改变电子称输入框数量
    changeWeight(elem){
      let self = this;
      var indexOne = self.inputIndOne - 1;
      if (self.enterStatus === "套装") {
        self.orderList.orderInfoFrom.suitProductInfoFroms[
          indexOne
        ].weight = parseFloat(elem);
      }
      if (self.enterStatus === "单品") {
        self.orderList.orderInfoFrom.singleProduct[
          indexOne
        ].weight = parseFloat(elem);
      }
      if (self.enterStatus === "搜索单品") {
        // console.log(self.proAllData.singleProduct[indexOne].clientSkuNo)
        self.orderList.orderInfoFrom.singleProduct.forEach(ielem => {
          if (
            ielem.clientSkuNo ===
            self.proAllData.singleProduct[indexOne].clientSkuNo
          ) {
            ielem.weight = parseFloat(elem);
          }
        });
        self.proAllData.singleProduct[indexOne].weight = parseFloat(
          elem
        );
      }
      if (self.enterStatus === "搜索套装") {
        self.orderList.orderInfoFrom.suitProductInfoFroms.forEach(
          ielem => {
            if (
              ielem.clientSkuNo ===
              self.proAllData.suitProductInfoFroms[indexOne].clientSkuNo
            ) {
              ielem.weight = parseFloat(elem);
            }
          }
        );
        self.proAllData.suitProductInfoFroms[
          indexOne
        ].weight = parseFloat(elem);
      }
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
    focusWeightFocus(e, ind, elem) {
      this.enterStatus = elem;
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
      JsBarcode(dom, elem.clientSkuNo, {
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
      this.LODOP.SET_PRINT_PAGESIZE(1, "90mm", "50mm", "");
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
    //确认收货
    oneKeyAddTwo() {
      var self = this;
      // console.log(self.orderList.orderInfoFrom)
      // this.viewBaoTFTwo = true
      self.btnLoadingTF = true;
      let subData = [];
      if (self.orderList.orderInfoFrom.singleProduct) {
        self.orderList.orderInfoFrom.singleProduct.forEach(ielem => {
          if (
            ielem.weight &&
            ielem.weight > 0 &&
            ielem.number &&
            ielem.number > 0
          ) {
            subData.push(ielem);
          }
        });
      }
      if (self.orderList.orderInfoFrom.suitProductInfoFroms) {
        self.orderList.orderInfoFrom.suitProductInfoFroms.forEach(ielem => {
          if (
            ielem.weight &&
            ielem.weight > 0 &&
            ielem.number &&
            ielem.number > 0
          ) {
            subData.push(ielem);
          }
        });
      }
      // console.log(subData)
      if (subData.length === 0) {
        self.btnLoadingTF = false;
        self.$message.error("还有实收数量和实收金重未填，不能确认收货！");
        return false;
      } else {
        // console.log(self.orderHeader)

        let data = [];
        subData.forEach(jelem => {
          // console.log(jelem)
          if (jelem.factorySkus) {
            //套装
            data.push({
              skuNumber: jelem.suitSkuNum,
              productCs: jelem.productCs,
              marketName: jelem.marketName,
              number: jelem.number,
              weight: jelem.weight,
              type: 2,
              invoicesNumber: self.orderHeader.oriOrderNo,
              factoryName: self.orderHeader.factoryName,
              factoryNumber: self.orderHeader.factoryOrderNo
            });
          } else {
            //单品
            data.push({
              skuNumber: jelem.clientSkuNo,
              productCs: jelem.productCs,
              marketName: jelem.marketName,
              number: jelem.number,
              weight: jelem.weight,
              type: 1,
              invoicesNumber: self.orderHeader.oriOrderNo,
              factoryName: self.orderHeader.factoryName,
              factoryNumber: self.orderHeader.factoryOrderNo
            });
          }
        });
        self.subProData = data;
        let params = {
          orderNo: self.orderHeader.factoryOrderNo,
          initialNumber: self.orderHeader.oriOrderNo,
          factoryName: self.orderHeader.factoryName,
          saleNumber: "",
          data
        };
        // console.log(params)
        this.$axios
          .post(self.$portMain + "/stockManagement/find", params)
          .then(function(res) {
            self.btnLoadingTF = false;
            if (!res) {
              self.$message.error(
                "提交数据有误或数量只能为整数，请修改后再重新提交！"
              );
            }
            if (res.data.code == 200) {
              self.tableLeftData = res.data.data.ProStockDetail;
              self.tableRightData = res.data.data.OutstoreCedit;
              // console.log(self.tableLeftData)
              // console.log(self.tableRightData)
              self.findAllData = res.data.data;
              // console.log(self.findAllData)
              self.viewBaoTFTwo = true;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    },
    //改变选择框
    changeFun(ielem) {
      this.$forceUpdate();
    },
    //终止收货
    oneKeyAddOne() {
      let self = this;
      this.btnLoadingTF = true;
      // this.btnLoadingTF = false;
      this.$confirm("此操作将终止收货, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            PRS: {
              orderNo: self.orderNo,
              type: 4
            }
          };
          this.$axios
            .get(this.$portMain + "/stockManagement/updateStockType", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success("终止收货成功！");
                setTimeout(function() {
                  self.btnLoadingTF = false;
                  self.created_fun();
                }, 1000);
              } else {
                self.btnLoadingTF = false;
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          self.btnLoadingTF = false;
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //全选、反选
    allSelectFun(e) {
      let self = this;
      if (self.orderList.orderInfoFrom.singleProduct) {
        self.orderList.orderInfoFrom.singleProduct.forEach(ielem => {
          ielem.selectTF = e;
        });
      }
      if (self.orderList.orderInfoFrom.suitProductInfoFroms) {
        self.orderList.orderInfoFrom.suitProductInfoFroms.forEach(ielem => {
          ielem.selectTF = e;
        });
      }
      self.$forceUpdate();
    },
    //查看详情
    viewFun(elem) {
      let self = this;
      let params = {
        PRS: {
          findRS: elem.stockNumber
        }
      };

      this.$axios
        .get(this.$portMain + "/stockManagement/findRS", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tableLeftData = res.data.data.ProStockDetail;
            self.tableRightData = res.data.data.OutstoreCedit;
            self.viewBaoTFOne = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查看方式事件
    viewWay() {
      let self = this;
      let params = {
        PRS: {
          billType: "intWay"
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
    //取消
    cancelFunOne() {
      this.viewBaoTFTwo = false;
      this.viewBaoTFFive = false;
    },
    //提交并打印
    submitFunOne() {
      let self = this;
      self.nowTime = self.$moment().format("YYYY年MM月DD日 HH:mm:ss");
      self.btnLoadingTF = true;
      let nullTF = false;
      self.tableRightData.forEach(ielem => {
        if (
          !ielem.ceditProject ||
          ielem.ceditProject === "" 
          // ||!ielem.ceditWeight ||
          // ielem.ceditWeight === null ||
          // !ielem.ceditAmount ||
          // ielem.ceditAmount === null
        ) {
          nullTF = true;
        }
        ielem.ceditAmount =
          ielem.ceditAmount && ielem.ceditAmount != ""
            ? self.$api.returnFloatNum(ielem.ceditAmount)
            : null;
        ielem.ceditId = null;
        ielem.ceditMoney =
          ielem.ceditMoney && ielem.ceditMoney != ""
            ? self.$api.returnFloatNum(ielem.ceditMoney)
            : 0;
        ielem.ceditPriceG =
          ielem.ceditPriceG && ielem.ceditPriceG != ""
            ? self.$api.returnFloatNum(ielem.ceditPriceG)
            : null;
        ielem.ceditPriceJ =
          ielem.ceditPriceJ && ielem.ceditPriceJ != ""
            ? self.$api.returnFloatNum(ielem.ceditPriceJ)
            : null;
        ielem.ceditWeight =
          ielem.ceditWeight && ielem.ceditWeight != ""
            ? self.$api.returnFloatNum(ielem.ceditWeight)
            : null;
        self.options.forEach(jelem => {
          if (ielem.ceditWayName === jelem.ceditWayName) {
            ielem.ceditWayId = self.$api.returnFloatNum(jelem.ceditWayId);
          }
        });
        // console.log(ielem)
      });
      if (nullTF) {
        self.btnLoadingTF = false;
        self.$message.error(
          "账款明细中新增项目、重量、数据不能为空，请重新输入或删除后提交！"
        );
        return false;
      } else {
        this.viewBaoTFTwo = false;
        this.viewBaoTFOne = true;
        setTimeout(function() {
          let params = {
            orderNo: self.orderHeader.factoryOrderNo,
            stockNumber: self.findAllData.number,
            initialNumber: self.orderHeader.oriOrderNo,
            factoryName: self.orderHeader.factoryName,
            saleNumber: "",
            fromDiv: JSON.stringify({
              name: "入货明细",
              value: "物流",
              tabLeft: self.tableLeftData,
              tabRight: self.tableRightData,
              orderRemarks: null
            }),
            // fromDiv: self.$refs.printTabThree.innerHTML,
            data: self.subProData,
            proStockDetail: self.tableRightData
          };
          // console.log(self.findAllData)
          // console.log(params)
          self.$axios
            .post(self.$portMain + "/stockManagement/addStock", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.btnLoadingTF = false;
                self.viewBaoTFTwo = false;
                // this.viewBaoTFOne = true
                self.$message.success("提交成功！");
                self.changeSumNum();
                setTimeout(function() {
                  self.btnLoadingTF = false;
                  self.viewBaoTFOne = false;
                  self.decorationPrint();
                  // self.CreateOneFormPageOne();
                  // self.LODOP.PREVIEW();
                  self.created_fun();
                }, 1000);
                setTimeout(function() {
                  self.viewBaoTFOne = false;
                }, 4000);
              } else {
                self.btnLoadingTF = false;
                self.$message.error(res.data.msg);
              }
            });
        }, 200);
      }
    },
    // CreateOneFormPageOne() {
    //   this.LODOP = this.$getLodop();
    //   this.LODOP.PRINT_INIT("");
    //   this.LODOP.SET_PRINT_STYLE("FontSize", 10);
    //   this.LODOP.SET_PRINT_STYLE("Bold", 1);
    //   this.LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
    //  this.LODOP.SET_PRINT_PAGESIZE(1, "0", "136mm", "Env12");
    //   this.LODOP.ADD_PRINT_HTM(
    //     10,
    //     0,
    //     760,
    //     600,
    //     this.$refs.printTabFour.innerHTML
    //   );
    // },
    //添加款账明细
    addDataOne(index, tabData) {
      tabData.splice(index + 1, 0, {
        ceditAmount: null,
        ceditId: "",
        ceditMoney: null,
        ceditNote: "",
        ceditPriceG: null,
        ceditProject: "",
        ceditWayId: 22,
        ceditWayName: "转存",
        ceditWeight: null
      });
    },
    //删除款账明细
    delDataOne(index, tabData) {
      if (tabData.length > 1) {
        tabData.splice(index, 1);
      } else {
        this.$message.error("款账明细不能全删！");
      }
    },

    //红冲
    hcFun(elem) {
      let self = this;
      // console.log(elem)
      self.btnLoadingTF = true;
      this.$confirm("此操作将红冲, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            PRS: {
              stockNumber: elem.stockNumber
            }
          };
          self.stockNumber = elem.stockNumber;
          this.$axios
            .get(self.$portMain + "/stockManagement/findOffsets", params)
            .then(function(res) {
              if (res.data.code == 200) {
                // console.log(res.data.data)
                self.tableLeftData = res.data.data.list;
                self.tableRightData = res.data.data.listCredit;
                self.viewBaoTFFive = true;
              } else {
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
    },
    //红冲
    hcFunTwo() {
      let self = this;
      self.btnLoadingTF = true;
      let params = {
        stockNumber: self.stockNumber,
        fromDiv: JSON.stringify({
          name: "入货明细",
          value: "物流",
          tabLeft: self.tableLeftData,
          tabRight: self.tableRightData,
          orderRemarks: null
        })
        // fromDiv: self.$refs.printTabOne.innerHTML
      };

      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/offsets",
        params,
        res => {
          self.$message.success("红冲此单成功，正在刷新！");
          self.viewBaoTFFive = false;
          setTimeout(function() {
            self.btnLoadingTF = false;
            self.created_fun();
          }, 1000);
        },
        err => {
          self.btnLoadingTF = false;
          self.$message.error(err.msg);
        }
      );
    },
    //sku搜索事件
    orderIdNumFun() {
      let self = this;
      if (self.orderIdNum != "") {
        self.searchTF = true;
        var params = {
          PRS: {
            orderNo: self.orderHeader.factoryOrderNo,
            skuNum: self.orderIdNum
          }
        };
        this.$axios
          .get(self.$portMain + "/order/selectBigOrderInfo", params)
          .then(function(res) {
            if (res.data.code == 200) {
              if (res.data.data) {
                self.orderIdNum = "";
                self.proAllData = res.data.data;
                if (self.proAllData.suitProductInfoFroms) {
                  self.proAllData.suitProductInfoFroms.forEach(ielem => {
                    ielem.number = ielem.receiableNum;
                    self.orderList.orderInfoFrom.suitProductInfoFroms.forEach(
                      jelem => {
                        if (ielem.suitSkuNum === jelem.suitSkuNum) {
                          ielem.weight = jelem.weight;
                        }
                      }
                    );
                  });
                } else {
                  self.proAllData.suitProductInfoFroms = [];
                }
                if (self.proAllData.singleProduct) {
                  self.proAllData.singleProduct.forEach(ielem => {
                    ielem.number = ielem.receiableNum;
                    self.orderList.orderInfoFrom.singleProduct.forEach(
                      jelem => {
                        if (ielem.clientSkuNo === jelem.clientSkuNo) {
                          ielem.weight = jelem.weight;
                        }
                      }
                    );
                  });
                } else {
                  self.proAllData.singleProduct = [];
                }
              } else {
                self.proAllData = {
                  suitProductInfoFroms: [],
                  singleProduct: []
                };
                setTimeout(function() {
                  self.orderIdNum = "";
                  self.searchTF = false;
                }, 3500);
              }
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.searchTF = false;
      }

      // console.log(self.orderIdNum)
    },
    changeNum(jelem, indexOne, elem) {
      let self = this;
      if (elem === "搜索单品") {
        // console.log(self.proAllData.singleProduct[indexOne].clientSkuNo)
        self.orderList.orderInfoFrom.singleProduct.forEach(ielem => {
          if (
            ielem.clientSkuNo ===
            self.proAllData.singleProduct[indexOne].clientSkuNo
          ) {
            ielem.weight = parseFloat(jelem.weight);
          }
        });
        self.proAllData.singleProduct[indexOne].weight = parseFloat(
          jelem.standWeight
        );
      }
      if (elem === "搜索套装") {
        self.orderList.orderInfoFrom.suitProductInfoFroms.forEach(ielem => {
          if (
            ielem.clientSkuNo ===
            self.proAllData.suitProductInfoFroms[indexOne].clientSkuNo
          ) {
            ielem.weight = parseFloat(jelem.weight);
          }
        });
        self.proAllData.suitProductInfoFroms[indexOne].weight = parseFloat(
          jelem.weight
        );
      }
      self.$forceUpdate();
    },
    checkNumber(item) {
      let { ceditMoney } = item;
      if (isNaN(ceditMoney)) {
        // this.$message.error("金额格式有误！");
        item.ceditMoney = "";
        return;
      }
      item.ceditMoney = Number(ceditMoney);
    },
    changeSumNum() {
      this.ceditSumNum = 0;
      // console.log(this.tableRightData)
      this.tableRightData.forEach(jelem => {
        // console.log(jelem)
        if (jelem.ceditMoney) {
          this.ceditSumNum += parseFloat(
            jelem.ceditMoney ? jelem.ceditMoney : 0
          );
        }
        if (jelem.money) {
          this.ceditSumNum += parseFloat(jelem.money ? jelem.money : 0);
        }
      });
      this.skuCeditSum = 0;
      this.tableLeftData.forEach(jelem => {
        this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    //打印入饰
    decorationPrint() {
      let self = this;
      let tableLeftData = [];
      if (self.tableLeftData.length > 0) {
          tableLeftData = JSON.parse(JSON.stringify(self.tableLeftData));
          tableLeftData.forEach(item => {
            item.productCs = item.conditi;
            item.marketName = item.marketingCategoryName
          })
      }
      this.decorationAllData = {
        receCode:self.orderHeader.factoryOrderNo,
        receiver:self.findAllData.reapUnit,
        rCode:self.findAllData.number,
        customerName:self.findAllData.factoryName,
        checkTime:self.orderHeader.createTime,
        skuCeditGroups:tableLeftData,
        outstoreCedits:self.tableRightData
      };
      this.$refs.myCompDecoration.compPrintFun();
    },
    comptMoney(item) {
      if(item.ceditAmount){
        item.ceditAmount = parseInt(item.ceditAmount)
        if(item.ceditAmount<0){
          item.ceditAmount = 0
        }
      }
      if (item.ceditWeight != undefined && item.ceditPriceG != undefined) {
        item.ceditMoney = (
          Number(item.ceditWeight) * Number(item.ceditPriceG)
        ).toFixed(2);
      } else if (
        item.ceditAmount != undefined &&
        item.ceditPriceJ != undefined
      ) {
        
        item.ceditMoney = (
          Number(item.ceditAmount) * Number(item.ceditPriceJ)
        ).toFixed(2);
      } else {
        item.ceditMoney = '';
      }

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
    margin-left: 10px;
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
    font-size: 14px;
    color: #889199;

    .txtBlack {
      color: #222426;
    }
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

  .width62 {
    width: 94px;
  }

  .confirmBtn {
    margin-top: -13px;
  }

  .titTwo {
    margin-top: 10px;
    margin-bottom: 20px;
    min-width: 1000px;
    padding: 20px 0;
    border-top: 1px solid #ccc;
  }

  .titTwoTxt {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .titTwoBao {
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

  .hrOne {
    margin-bottom: 16px;
    border-top: 1px solid #ccc;
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

    .txtTwo {
      float: right;
    }
  }

  .selectDiv {
    line-height: 200px;
    text-align: center;
  }

  .heiColor {
    color: #a6a7a9;
  }

  .top10 {
    margin-top: 10px;
  }

  .width250 {
    width: 250px;
  }

  .tableTop {
    background: #EBF1F7;
    border: #CFD9E5 1px solid;
    border-bottom: 0;
    font-weight: bold;
    padding: 10px;
    color: #8A8E99;
    text-align: center;
  }
}
</style>
