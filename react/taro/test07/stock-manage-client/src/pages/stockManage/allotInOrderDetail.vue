<template>
  <div class="conBigDiv" ref="repleOrder">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库列表</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info" v-loading="webLoadingTF">
      <div class="info-top">
        <!-- {{orderData}} -->
        <div class="infot-table">
          <div class="tr">
            <div class="th">调拨单号</div>
            <div class="th">出库单号</div>
            <div class="th">接收单位</div>
            <div class="th">发起单位</div>
            <div class="th">数量</div>
            <!-- <div class="th">毛重(g)</div> -->
            <div class="th">净重(g)</div>
            <div class="th">操作人</div>
            <div class="th">制单时间</div>
            <div class="th">订单状态</div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{orderData.allotLogisticsNumber}}</div>
            <div class="td">{{orderData.logisticsStockNumber}}</div>
            <div class="td">{{orderData.receiverName}}</div>
            <div class="td">{{orderData.allotName}}</div>
            <div class="td">{{orderData.allotTotalSum}}</div>
            <!-- <div class="td">{{orderData.allotTotalWeight}}</div> -->
            <div class="td">{{orderData.allotTotalSuttle}}</div>
            <div class="td">{{orderData.userName}}</div>
            <div class="td">{{orderData.updateTime}}</div>

            <div class="td">
              <span v-if="orderData.status == undefined">-</span>
              <span v-if="orderData.status == '1'" class="yellowColor">待出库</span>
              <span v-if="orderData.status == '2'" class="blackColor">已出库</span>
            </div>
          </div>
        </div>
      </div>
      <div class="info-middle divOne grayColor">
        调拨原因：
        <span class="blackColor">{{orderData.remark}}</span>
        <span class="floatRight" v-if="true">
          <el-button
            type="warning"
            size="small"
            @click="stockOutFun()"
            v-if="orderData.status == '1'"
          >出库</el-button>
        </span>
      </div>
      <div class="info-middle">
        <el-row class="divTwo">
          <!-- <el-col :span="6">调拨单号：<span>{{orderData.allotLogisticsNumber}}</span></el-col>
          <el-col :span="6">接收单位：{{orderData.receiverName}} </el-col>
          <el-col :span="6">发起单位：{{orderData.allotName}}</el-col>
          <el-col :span="6">备注：<span>{{orderData.remark}}</span></el-col>-->
          <el-col
            :span="24"
            v-if="!proMarkData.proList || proMarkData.proList.length === 0"
            class="baoProFour"
          >
            <span>此单无产品！</span>
          </el-col>
          <el-col
            :span="24"
            v-if="proMarkData.proList && proMarkData.proList.length > 0"
            class="baoTabTwo"
          >
            <el-row
              :class="indOne==0?'baoProTwo':'baoProThree'"
              v-for="(jelem,indOne) in proMarkData.proList"
              :key="indOne"
            >
              <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
              <el-col :span="3">
                <img
                  :src="jelem.url?$portImg+jelem.url:'../../../static/images/img-noimg.png'"
                  style="height:90px; width:120px;margin-top:10px"
                  @click.stop="showPic(jelem.url?$portImg+jelem.url:'../../../static/images/img-noimg.png')"
                >
              </el-col>
              <el-col :span="20" style="line-height:36px;">
                <el-row>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.proName">{{jelem.proName}}</span>&nbsp;
                  </el-col>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.conditi">产品成色：{{jelem.conditi}}</span>&nbsp;
                  </el-col>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.one">产品类别：{{jelem.one}}</span>&nbsp;
                  </el-col>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.num">退饰数量：{{jelem.num}}</span>&nbsp;
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.proNumber">编号：{{jelem.proNumber}}</span>&nbsp;
                  </el-col>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.goldCode">产品材质：{{jelem.goldCode}}</span>&nbsp;
                  </el-col>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.feeType">
                      工费：
                      <span v-if="jelem.feeType == '1'">{{jelem.additionPrice}}</span>
                      <span v-if="jelem.feeType == '2'">{{jelem.feePrice}}</span>
                    </span>
                    &nbsp;
                  </el-col>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.totalWeight">退饰重量：{{jelem.totalWeight}}g</span>&nbsp;
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <span class="blackColor" v-if="jelem.weight">克重：{{jelem.weight}}g</span>&nbsp;
                  </el-col>
                  <el-col :span="18">
                    <span class="blackColor" v-if="jelem.processCode">生产工艺：{{jelem.processCode}}</span>&nbsp;
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- <el-table
          v-if="true"
          :data="proMarkData"
          border
          show-summary
          :header-cell-style="{
                'background-color': '#EBF1F7',
                'color': '#8A8E99',
            }"
          :summary-method="getSummaries"
          style="width: 100%">
          <el-table-column
            prop="id"
            align="center"
            label="种类">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="营销品类">
          </el-table-column>
          <el-table-column
            prop="amount1"
            align="center"
            label="毛重">
          </el-table-column>
          <el-table-column
            prop="amount1"
            align="center"
            label="净重">
          </el-table-column>
          <el-table-column
            prop="amount2"
            align="center"
            label="成色">
          </el-table-column>
          <el-table-column
            prop="amount3"
            align="center"
            label="折重">
          </el-table-column>
          <el-table-column
            prop="amount3"
            align="center"
            label="单价/克">
          </el-table-column>
          <el-table-column
            prop="amount3"
            align="center"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="amount3"
            align="center"
            label="单价/件">
          </el-table-column>
          <el-table-column
            prop="amount3"
            align="center"
            label="金额">
          </el-table-column>
        </el-table>-->
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
                  <el-col :span="4" class="pro-middle" v-if="item.skuNum">编号：{{item.skuNum}}</el-col>
                  <el-col :span="4" class="pro-middle" v-if="item.goldCode">材质：{{item.goldCode}}</el-col>
                  <el-col :span="10" class="pro-middle" v-if="item.pait">表面工艺：{{item.pait}}</el-col>
                  <el-col
                    :span="4"
                    class="txtFive"
                    v-if="item.totailWeight"
                  >毛重(g)：{{item.totailWeight}}</el-col>
                </el-row>
                <el-row>
                  <el-col
                    :span="4"
                    class="pro-middle"
                    v-if="item.productType"
                  >产品类别：{{item.productType}}</el-col>
                  <el-col :span="4" class="pro-middle" v-if="item.craft">生产工艺：{{item.craft}}</el-col>
                  <el-col
                    :span="10"
                    class="pro-middle"
                    v-if="item.carFlower"
                  ><span v-if="item.carFlower">车花：{{item.carFlower}}</span> &nbsp;</el-col>
                  <el-col :span="4" class="txtFive" v-if="item.goldWeight">净重(g)：{{item.goldWeight}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" class="pro-bottom" v-if="item.productCs">成色：{{item.productCs}}</el-col>
                  <el-col
                    :span="4"
                    class="pro-bottom"
                    v-if="item.standardGold"
                  >克重(g): {{item.standardGold}}</el-col>
                  <el-col :span="10" class="pro-bottom">
                    <b v-if="item.extendAttr && item.one" v-html="$api.getAttachProperty(item.one,item.extendAttr)"></b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtFive">数量：{{item.orderSum}}</el-col>
                </el-row>
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
                  <el-col :span="18" class="pro-middle">编号：{{item.productSkuNum}}</el-col>
                  <el-col :span="4" class="txtFive">毛重(g)：{{item.totailOrderWeight}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" class="pro-middle">&nbsp;</el-col>
                  <el-col :span="4" class="txtFive">
                    <span v-if="item.goldWeight">净重(g)：{{item.goldWeight}}</span>&nbsp;
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
                  <el-col :span="18" class="pro-middle">&nbsp;</el-col>
                  <el-col :span="6" class="txtFive">数量：{{item.orderSum}}</el-col>
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
                      <el-col :span="8" class="pro-middle">编号：{{ielem.skuNum}}</el-col>
                      <el-col :span="5" class="pro-middle">材质：{{ielem.goldCode}}</el-col>
                      <el-col :span="7" class="pro-middle">表面工艺：{{ielem.pait}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">产品类别：{{ielem.productType}}</el-col>
                      <el-col :span="5" class="pro-middle">生产工艺：{{ielem.craft}}</el-col>
                      <el-col
                        :span="7"
                        class="pro-middle"
                      ><span v-if="ielem.carFlower">车花：{{ielem.carFlower}}</span> &nbsp;</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-bottom">成色：{{ielem.productCs}}</el-col>
                      <el-col :span="5" class="pro-bottom">克重(g): {{ielem.standardGold}}</el-col>
                      <el-col
                        :span="5"
                        class="pro-bottom"
                      >
                        <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
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
      <el-dialog title="出库清单" :visible.sync="winOneTF" :close-on-click-modal="false" width="1500px">
        <span>
          <div>打包信息</div>
          <div class="baoTabOne" v-for="(ielem,indOne) in baoList" :key="indOne">
            <el-row>
              <el-col :span="4" class="divOne">
                包号：
                <span class="yellowColor" v-if="ielem.newTF">新包</span>
                <span v-else class="blackColor">{{ielem.baoNo}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                总数量：
                <span class="blackColor">{{ielem.sum}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                净重：
                <span v-if="ielem.newTF">
                  <el-input
                    v-model="ielem.suttle"
                    placeholder
                    size="small"
                    class="width70"
                    @focus="focusWeightFocusTwo(ielem,indOne,'净重')"
                    @blur="focusWeightBlurTwo(ielem)"
                  ></el-input>
                </span>
                <span v-else class="blackColor">{{ielem.suttle}}</span>
              </el-col>
              <el-col :span="4" class="divOne">
                毛重：
                <span v-if="ielem.newTF">
                  <el-input
                    v-model="ielem.roughWeight"
                    placeholder
                    size="small"
                    class="width70"
                    @focus="focusWeightFocusTwo(ielem,indOne,'毛重')"
                    @blur="focusWeightBlurTwo(ielem)"
                  ></el-input>
                </span>
                <span v-else class="blackColor">{{ielem.roughWeight}}</span>
              </el-col>
              <el-col :span="4" class="divOne">
                打包状态：
                <span class="yellowColor" v-if="ielem.newTF">待打包</span>
                <span v-else class="blackColor">已打包</span>
              </el-col>
              <el-col :span="6" class="divOne">
                操作：
                <!-- <span class="yellowColor" @click="cancelBao(ielem)">取消打包</span> -->
                <span class="redColor" v-if="ielem.newTF" @click="confirmBao(ielem)">确认打包</span>
                <span class="redColor" v-if="!ielem.newTF" @click="printBao(ielem)">打印包条码</span>
                <span v-if="ielem.skuList.length > 0" class="divTwo">
                  <i :class="ielem.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'" @click="editSuit(ielem)"></i>
                  <!-- <i class="el-icon-arrow-down" v-if="!ielem.viewSuit" @click="editSuit(ielem)"></i> -->
                </span>
              </el-col>
            </el-row>

            <el-row :style="{background:'#fff',border:'1px solid #E5F1FF'}">
              <el-col :span="24" v-if="ielem.viewSuit && ielem.skuList.length > 0">
                <el-row
                  :class="indOne==0?'baoProSix':'baoProThree'"
                  v-for="(jelem,indOne) in ielem.skuList"
                  :key="indOne"
                >
                  <el-col :span="1">&nbsp;</el-col>
                  <el-col :span="3">
                    <img
                      :src="jelem.url?$portImg+jelem.url:'../../../static/images/img-noimg.png'"
                      style="height:90px; width:120px;margin-top:10px"
                      @click.stop="showPic(jelem.url?$portImg+jelem.url:'../../../static/images/img-noimg.png')"
                    >
                  </el-col>
                  <el-col :span="20" style="line-height:36px;">
                    <el-row>
                      <el-col :span="4">
                        <span class="blackColor">{{jelem.proName}}</span>
                      </el-col>
                      <el-col :span="5">
                        <span
                          class="blackColor"
                          v-if="jelem.allotLogisticsNumber"
                        >调拨单号：{{jelem.allotLogisticsNumber}}</span>&nbsp;
                      </el-col>
                      <el-col :span="3">
                        <span class="blackColor" v-if="jelem.conditi">产品成色：{{jelem.conditi}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.num">入饰数量：{{jelem.num}}</span>&nbsp;
                      </el-col>
                      <el-col :span="8">
                        选择数量： 
                        {{jelem.editNum}}
                        <!-- <span class="blackColor">
                        <span v-if="!jelem.editTF">{{jelem.editNum}}</span>
                        <el-input-number v-if="jelem.editTF" :disabled="jelem.num <= 0" :controls="false" v-model="jelem.editNum" placeholder="" size="small" class="width70":min="1"></el-input-number>
                        </span>-->
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.proNumber">编号：{{jelem.proNumber}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.one">产品类别：{{jelem.oneName}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.processCode">生产工艺：{{jelem.processCode}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.totalSuttle">库存净重：{{jelem.totalSuttle}}g</span>&nbsp;

                      </el-col>
                      <el-col :span="4">
                        复核净重：
                        <span class="blackColor">
                          <span v-if="!jelem.editTF">{{jelem.editSuttle}}</span>
                          <el-input-number
                            v-if="jelem.editTF"
                            :disabled="jelem.num <= 0"
                            :controls="false"
                            v-model="jelem.editSuttle"
                            placeholder
                            size="small"
                            class="width70"
                            :min="1"
                            @change="checkInputWeight(jelem)"
                          ></el-input-number>g
                        </span>
                      </el-col>
                      <el-col :span="4">
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
                        <span class="blackColor" v-if="jelem.weight">克重：{{jelem.weight}}g</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.goldCode">产品材质：{{jelem.goldCode}}</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span class="blackColor" v-if="jelem.feeType">
                          工费：
                          <span v-if="jelem.feeType == '1'">{{jelem.additionPrice}}</span>
                          <span v-if="jelem.feeType == '2'">{{jelem.feePrice}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="4">
                        <span
                          class="blackColor"
                          v-if="jelem.totalWeight"
                        >库存毛重：{{jelem.totalWeight}}g</span>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        复核毛重：
                        <span class="blackColor">
                          <span v-if="!jelem.editTF">{{jelem.editRoughWeight}}</span>
                          <el-input-number
                            v-if="jelem.editTF"
                            :disabled="jelem.num <= 0"
                            :controls="false"
                            v-model="jelem.editRoughWeight"
                            placeholder
                            size="small"
                            class="width70"
                            :min="1"
                            @change="checkInputWeight(jelem)"
                          ></el-input-number>g
                        </span>
                      </el-col>
                      <el-col :span="4">
                        <span
                          class="redColor"
                          @click="delJelem(indOne,ielem.skuList,ielem)"
                          v-if="ielem.newTF"
                        >移出</span>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <el-row class="baoProFive">
            <el-col :span="4">接收单位：{{proAllData.factoryName}}</el-col>
            <el-col :span="8">退饰单位：{{proAllData.initiator}}</el-col>
            <el-col :span="12" style="text-align:right">
              <el-button type="primary" size="small" @click="stockOutFunTwo">确认退饰</el-button>
            </el-col>
          </el-row>
          <div>
            <el-row class="baoProOne" v-for="(ielem,indOne) in proListOne" :key="indOne">
              <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
              <el-col :span="3">
                <img
                  :src="ielem.url?$portImg+ielem.url:'../../../static/images/img-noimg.png'"
                  style="height:90px; width:120px;margin-top:10px"
                  @click.stop="showPic(ielem.url?$portImg+ielem.url:'../../../static/images/img-noimg.png')"
                >
              </el-col>
              <el-col :span="20" style="line-height:36px;">
                <el-row>
                  <el-col :span="4">
                    <span class="blackColor">{{ielem.proName}}</span>
                  </el-col>
                  <el-col :span="5">
                    调拨单号：
                    <span class="blackColor">{{ielem.allotLogisticsNumber}}</span>
                  </el-col>
                  <el-col :span="3">
                    产品成色：
                    <span class="blackColor">{{ielem.conditi}}</span>
                  </el-col>
                  <el-col :span="4">
                    入饰数量：
                    <span class="blackColor">{{ielem.num}}</span>
                  </el-col>
                  <el-col :span="8">
                    选择数量：
                    <span class="blackColor">
                      {{ielem.editNum}}
                      <!-- <el-input-number :disabled="ielem.num <= 0" :controls="false" v-model="ielem.editNum" placeholder="" size="small" class="width70" :min="1" :max="ielem.num"></el-input-number> -->
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    编号：
                    <span class="blackColor">{{ielem.proNumber}}</span>
                  </el-col>
                  <el-col :span="4">
                    产品类别：
                    <span class="blackColor">{{ielem.oneName}}</span>
                  </el-col>
                  <el-col :span="4">
                    <span v-if="ielem.oneName != '套装'">
                      生产工艺：
                      <span class="blackColor">{{ielem.processCode}}</span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="4">
                    <span v-if="ielem.totalSuttle">
                      库存净重：
                      <span class="blackColor">{{ielem.totalSuttle}}g</span>
                    </span>

                  </el-col>
                  <el-col :span="4">
                     复核净重：
                    <span class="blackColor">
                      <el-input-number
                        :disabled="ielem.num <= 0"
                        :controls="false"
                        v-model="ielem.editSuttle"
                        placeholder
                        size="small"
                        class="width70"
                        @focus="focusWeightFocus(ielem,indOne,'复核净重')"
                        @blur="focusWeightBlur()"
                        @change="checkInputWeight(ielem)"
                      ></el-input-number>g
                    </span>

                  </el-col>
                  <el-col :span="4">
                    <span class="redColor" v-if="ielem.num > 0" @click="printPro(ielem)">打印条码</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    克重：
                    <span class="blackColor">{{ielem.weight}}g</span>
                  </el-col>
                  <el-col :span="4">
                    <span v-if="ielem.oneName != '套装'">
                      产品材质：
                      <span class="blackColor">{{ielem.goldCode}}</span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="4">
                    工费：
                    <span class="blackColor">
                      <span v-if="ielem.feeType == '1'">{{ielem.additionPrice}}</span>
                      <span v-if="ielem.feeType == '2'">{{ielem.feePrice}}</span>
                    </span>
                  </el-col>
                  <el-col :span="4">
                    库存毛重：
                    <span class="blackColor">{{ielem.totalWeight}}g</span>
                  </el-col>
                  <el-col :span="4">
                    复核毛重：
                    <span class="blackColor">
                      <el-input-number
                        :disabled="ielem.num <= 0"
                        :controls="false"
                        v-model="ielem.editRoughWeight"
                        placeholder
                        size="small"
                        class="width70"
                        @focus="focusWeightFocus(ielem,indOne,'复核毛重')"
                        @blur="focusWeightBlur()"
                        @change="checkInputWeight(ielem)"
                      ></el-input-number>g
                    </span>
                  </el-col>
                  <el-col :span="4">
                    <span class="redColor" @click="addToBaoFun(ielem)" v-if="ielem.num > 0">添加到包</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </span>
      </el-dialog>
      <el-dialog
        title="退饰出库单详情"
        :visible.sync="viewBaoTFFive"
        :close-on-click-modal="false"
        width="1400px"
      >
        <span>
          <el-row>
            <el-col :span="6">退饰单号：{{tableProData.retreatNumber}}</el-col>
            <el-col :span="6">退饰单位：{{tableProData.sponsorDepartment}}</el-col>
            <el-col :span="6">接收单位：{{tableProData.reapUnit}}</el-col>
            <el-col :span="6">
              备注：
              <el-input v-model="mock" placeholder size="small" class="width240"></el-input>
            </el-col>
          </el-row>
          <div style="display:flex;margin-top:20px">
            <div style="width:32%">
              <div class="tableTop">出货明细</div>
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
                      class="width70"
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
                      class="width70"
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
                      class="width70"
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
                      class="width70"
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
                      class="width70"
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
            <el-button size="small" type="primary" @click="submitFunOne()" :loading="btnLoadingTF">提交并打印</el-button>
          </div>
        </span>
      </el-dialog>
      <!-- 打印包二维码开始 -->
      <div v-show="false">
        <printTPThree :billData="printBaoData" ref="printTPThree"></printTPThree>
      </div>
      <!-- 打印包二维码结束 -->

    </div>
    <!-- 打印出饰单开始 -->
    <div v-show="false">
      <PrintTPOne :billData="newTableData" ref="myComp"></PrintTPOne>
    </div>
    <!-- 打印出饰单结束 -->
    <!-- 打印sku开始 -->
    <div v-show="false">
      <printTPSkuOne :billData="printData" ref="printTPTwo"></printTPSkuOne>
    </div>
    <!-- 打印sku结束 -->
    <!-- 打印包号 -->
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    
  </div>
</template>
<script>

var Nzh = require("nzh");
export default {
  data() {
    return {
      stepsActive: 1,
      orderList: [],
      result: {},
      number: "",
      orderData: {}, //订单详情
      loadingTF: false,
      webLoadingTF: false,
      proMarkData: [],
      winOneTF: false,
      proAllData: {},
      viewBaoTFFive: false,
      tableLeftData: [],
      tableRightData: [],
      tableProData: {},
      mock: "", //备注
      options: [],
      nowTime: "",
      ceditSumNum: 0,
      priceTxt: "",
      skuCeditSum: 0,
      proListOne: [],
      inputIndOne: "",
      enterStatus: {},
      baoList: [],
      btnLoadingTF:false,
      printBaoData:{},
      printData:{},
      newTableData:{},
    };
  },
  created() {
    let self = this;
    this.number = this.$route.query.number;
    // this.sarkData = JSON.parse(localStorage.sarkData);
    // this.number = this.sarkData.logisticsStockNumber;
    this.created_fun();
    this.viewWay();
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
      self.webLoadingTF = true;
      let params = {
        number: self.number
      };
      this.$api.formdataPostFun(
        this.$portMain + "/coffersAllotLogistics/findNumber",
        params,
        res => {
          if (res.code == 200) {
            self.webLoadingTF = false;
            self.proMarkData = res.data;
            self.orderData = res.data.coffersAllotLogistics;
            self.orderData.updateTime = self.$api.dateGetDayTime(
              self.orderData.updateTime
            );
            // console.log(self.sarkData.operateUser)
            //
          }
        },
        err => {
          self.webLoadingTF = false;
        }
      );
    },
    checkInputWeight(elem) {
      let errorStatus = false;
      const { editRoughWeight, editSuttle } = elem;
      if (editSuttle > editRoughWeight) {
        errorStatus = true;
        elem.editRoughWeight = undefined;
        setTimeout(() => this.$forceUpdate(), 100);
      }
      this.weightTF = errorStatus;
      if (errorStatus) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
      }
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
              self.$router.push("allotInOrder");
            }, 1000);
          }
        },
        err => {
           self.loadingTF = false;
        }
      );
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
          column.label === "净重" ||
          column.label === "折重" ||
          column.label === "实收重量" ||
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

    //调拨出库
    stockOutFun() {
      let self = this;
      var params = {
        PRS: {
          number: self.proMarkData.coffersAllotLogistics.logisticsStockNumber
        }
      };
      this.$axios
        .get(self.$portMain + "/coffersAllotLogistics/number", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.baoList = [
              {
                newTF: true,
                sum: 0,
                roughWeight: 0,
                suttle: 0,
                baoNo: "",
                viewSuit: false,
                skuList: []
              }
            ];
            // self.DepartList = res.data.data;
            self.proListOne = res.data.data.proList;
            self.proAllData = res.data.data;
            let disabledTF = true;
            self.proListOne.forEach(ielem => {
              ielem.editNum = ielem.num;
              // ielem.editRoughWeight = ielem.totalWeight
              // ielem.editSuttle = ielem.totalSuttle
              if (ielem.num > 0) {
                disabledTF = false;
              }
            });
            self.disabledTF = disabledTF;
            self.winOneTF = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //调拨出库按钮
    stockOutFunTwo() {
      let self = this;
      // console.log(self.inCompanyId,self.inCompanyName)
      // console.log('包的数据：')
      // console.log(self.baoList)
      // console.log('未打包产品数据:')
      // console.log(self.proListOne)
      let baoList = [];
      let errorTF = false;
      self.baoList.forEach(ielem => {
        // console.log(ielem)
        if (ielem.newTF && ielem.skuList.length > 0) {
          errorTF = true;
          return false;
        }
        if (ielem.skuList.length > 0) {
          let skuList = [];
          ielem.skuList.forEach(jelem => {
            // console.log(jelem)
            //包里的产品列表
            skuList.push({
              proName: jelem.proName,
              proSkuNmber: jelem.proNumber,
              one: jelem.one,
              oneCode: jelem.oneName,
              conditi: jelem.conditi,
              goldCode: jelem.goldCode,
              processCode: jelem.processCode,
              weight: jelem.weight,
              num: jelem.editNum,
              sum: jelem.editNum,
              roughWeight: jelem.editRoughWeight,
              suttle: jelem.editSuttle,
              img: jelem.url,
              stockNumber: jelem.logisticsStockNumber
            });
          });
          baoList.push({
            packageNumber: ielem.baoNo,
            suttle: ielem.suttle,
            roughWeight: ielem.roughWeight,
            weight: ielem.suttle,
            sum: ielem.sum,
            list: skuList
          });
        }
      });
      if (errorTF) {
        self.$message.error(
          "未确认打包里边还有产品，不能进行确认退饰操作！"
        );
        return false;
      }
      if (self.proListOne.length > 0) {
        let noBaoList = [];
        let noBaoSuttle = 0;
        let noBaoRoughWeight = 0;
        let noBaoSum = 0;
        self.proListOne.forEach(jelem => {
          if (
            !jelem.editNum ||
            jelem.editNum === 0 ||
            !jelem.editRoughWeight ||
            jelem.editRoughWeight === 0 ||
            !jelem.editSuttle ||
            jelem.editSuttle === 0
          ) {
          } else {
            noBaoSuttle += jelem.editSuttle;
            noBaoRoughWeight += jelem.editRoughWeight;
            noBaoSum += jelem.editNum;
            // console.log(jelem)
            noBaoList.push({
              proName: jelem.proName,
              proSkuNmber: jelem.proNumber,
              one: jelem.one,
              oneCode: jelem.oneName,
              conditi: jelem.conditi,
              goldCode: jelem.goldCode,
              processCode: jelem.processCode,
              weight: jelem.weight,
              num: jelem.editNum,
              sum: jelem.num,
              roughWeight: jelem.editRoughWeight,
              suttle: jelem.editSuttle,
              img: jelem.url,
              stockNumber: jelem.logisticsStockNumber
            });
          }
        });
        // console.log(noBaoList)
        baoList.push({
          packageNumber: "",
          suttle: noBaoSuttle,
          roughWeight: noBaoRoughWeight,
          sum: noBaoSum,
          list: noBaoList
        });
        // console.log(self.proListOne)
      }
      if (baoList[0].list.length === 0) {
        self.$message.error(
          "未选择退饰产品，没填入复核毛重或复核净重，不能进行退饰操作！"
        );
        return false;
      }
      let params = {
        sponsorDepartment: "物流中心",
        reapUnit: self.proAllData.factoryName,
        customerId: self.proAllData.factoryId,
        list: baoList
      };
      this.$axios
        .post(
          self.$portMain + "/coffersAllotLogistics/findRetreatPackage",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data)
            self.tableLeftData = res.data.data.data.dataList;
            self.tableRightData = res.data.data.data.billingDetails;
            self.tableProData = res.data.data;
            self.changeSumNum();
            self.winOneTF = false;
            self.viewBaoTFFive = true;

            self.nowTime = self.$moment().format("YYYY年MM月DD日 HH:mm:ss");
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //添加到包事件
    addToBaoFun(elem) {
      let self = this;
      if (
        !elem.editNum ||
        elem.editNum === 0 ||
        !elem.editRoughWeight ||
        elem.editRoughWeight === 0 ||
        !elem.editSuttle ||
        elem.editSuttle === 0
      ) {
        this.$message.error("还有未填字段，不能进行添加到包操作");
        return false;
      }
      // console.log(self.baoList)
      self.baoList.forEach(ielem => {
        if (ielem.newTF === true) {
          self.baoListNew = ielem;
          elem.editTF = false;
          if (ielem.skuList) {
            ielem.skuList.push(elem);
          } else {
            ielem.skuList = [];
            ielem.skuList.push(elem);
          }
        }
        // console.log(ielem)
      });
      self.proListOne.forEach((jelem, indOne) => {
        if (jelem.proNumber === elem.proNumber) {
          self.proListOne.splice(indOne, 1);
          return;
        }
      });
      self.skuListNum(self.baoListNew);
    },
    //空闲包计算
    skuListNum(elem) {
      elem.sum = 0;
      elem.roughWeight = 0;
      elem.suttle = 0;
      elem.skuList.forEach(ielem => {
        elem.sum += ielem.editNum;
        elem.roughWeight += ielem.editRoughWeight;
        elem.suttle += ielem.editSuttle;
      });
      this.$forceUpdate();
      // console.log(elem.skuList)
    },
    //确认打包
    confirmBao(elem) {
      // console.log(elem)
      let self = this;
      if (!elem.skuList || elem.skuList.length === 0) {
        self.$message.error("此包未添加产品，请添加产品再进行确认操作！");
        return;
      }
      // console.log(elem.skuList)
      var params = { stockNumber: elem.skuList[0].proNumber, type: "1" };
      this.$api.formdataPostFun(
        this.$portMain + "/coffersAllotLogistics/findPackage",
        params,
        res => {
          elem.newTF = false;
          elem.baoNo = res.data;
          if (self.proListOne.length > 0) {
            self.baoList.push({
              newTF: true,
              sum: 0,
              roughWeight: 0,
              suttle: 0,
              baoNo: "",
              viewSuit: false,
              skuList: []
            });
          }
          // self.viewBaoTFFour = ture;
          self.$forceUpdate();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //提交并打印按钮
    submitFunOne() {
      let self = this;
      self.btnLoadingTF = true;
      // console.log(self.tableLeftData)
      // console.log(self.tableRightData)
      let baoList = [];
      self.baoList.forEach(ielem => {
        let skuList = [];
        // console.log(ielem)
        ielem.skuList.forEach(jelem => {
          //包里的产品列表
          // console.log(jelem)
          skuList.push({
            proName: jelem.proName,
            proSkuNmber: jelem.proNumber,
            one: jelem.one,
            oneCode: jelem.oneCode,
            conditi: jelem.conditi,
            goldCode: jelem.goldCode,
            processCode: jelem.processCode,
            weight: jelem.weight,
            num: jelem.editNum,
            sum: jelem.sum,
            roughWeight: jelem.editRoughWeight,
            suttle: jelem.editSuttle,
            img: jelem.img,
            stockNumber: jelem.stockNumber
          });
        });
        baoList.push({
          packageNumber: ielem.baoNo,
          suttle: ielem.suttle,
          roughWeight: ielem.roughWeight,
          weight: ielem.weight,
          sum: ielem.sum,
          list: skuList
        });
      });
      self.changeSumNum();
      //  console.log(self.tableProData)
      let params = {
        sponsorDepartment: self.tableProData.sponsorDepartment,
        reapUnit: self.tableProData.reapUnit,
        factoryId: self.tableProData.customerId,
        list: self.tableProData.data.list,
        retreatNumber: self.tableProData.retreatNumber,
        billingDetails: self.tableRightData,
        fromDiv: JSON.stringify({
          name: "入货明细",
          value: "物流",
          tabLeft: self.tableLeftData,
          tabRight: self.tableRightData,
          orderRemarks: self.mock
        }),
        remark: self.mock
      };
      // self.skuPrintFun();
      this.$axios
        .post(
          self.$portMain + "/coffersAllotLogistics/addRetreatPackage",
          params
        )
        .then(function(res) {
          
          if (res.data.code == 200) {
            self.$message.success("退饰成功，正在预览打印！");
            setTimeout(function() {
              self.mock = "";
              self.btnLoadingTF = false;
              self.viewBaoTFFive = false;
              self.skuPrintFun();
            }, 1000);
          } else {
            self.btnLoadingTF = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    //打印sku
    skuPrintFun() {
      let self = this;
      self.tableLeftData.forEach(ielem=>{
        ielem.sku_product_type = ielem.conditi//种类
        ielem.marketing_type = ielem.marketingCategoryName//营销品类
        ielem.sku_check_weight = ielem.weight//重量
      })
      self.newTableData ={
        sponsorUnit:self.tableProData.reapUnit,//发起单位
        factoryNumber:self.tableProData.factoryNumber,//工单号
        outstoreCode:self.tableProData.retreatNumber,//出饰单号
        customerName:self.tableProData.sponsorDepartment,//接收单位
        createTime:self.orderData.updateTime,//日 期
        skuCeditGroups:self.tableLeftData,//出货明细
        outstoreCedits:self.tableRightData,//账款明细
      }  
      self.$refs.myComp.compPrintFun();
      setTimeout(function() {
        self.$router.push("retuInDep");
      }, 1000);
    },

    //取消
    cancelFunOne() {
      this.viewBaoTFFive = false;
    },

    //取消打包
    cancelBao(elem) {
      let self = this;
      if (elem.newTF === true) {
        self.proListOne = self.proListOne.concat(elem.skuList);
        elem.skuList = [];
        self.skuListNum(elem);
      } else {
        self.proListOne = self.proListOne.concat(elem.skuList);
        self.baoList.forEach((ielem, indOne) => {
          if (ielem.baoNo == elem.baoNo) {
            self.baoList[indOne] = {
              newTF: true,
              sum: 0,
              roughWeight: 0,
              suttle: 0,
              baoNo: "",
              viewSuit: false,
              skuList: []
            };
          }
        });
        self.$forceUpdate();
      }
    },
    
    //打印包号
    printBao(elem) {
      // console.log(elem)
      elem.nowSkuWeight = elem.roughWeight
      elem.nowSkuGoldWeight = elem.suttle
      elem.customerName = this.proAllData.factoryName
      elem.customerTxt = '接收单位'
      this.printBaoData = elem
      this.$refs.printTPThree.compPrintFun();
    },
    //编辑和保存
    editJelem(elem, baoElem) {
      elem.editTF = !elem.editTF;
      // console.log(baoElem)
      // console.log(elem)
      this.skuListNum(baoElem);
      this.$forceUpdate();
    },
    //移出
    delJelem(index, elem, baoElem) {
      this.proListOne.push(elem[index]);
      elem.splice(index, 1);
      this.skuListNum(baoElem);
    },
    changeSumNum() {
      this.ceditSumNum = 0;
      this.tableRightData.forEach(jelem => {
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
        this.skuCeditSum += jelem.weight;
      });
      this.skuCeditSum = this.$api.returnFloatNum(this.skuCeditSum);
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    //添加款账明细
    addDataOne(index, tabData) {
      tabData.splice(index + 1, 0, {
        ceditAmount: null,
        ceditId: null,
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

    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "") {
        self.$message.error("复核毛重或复核净重没有被焦点选中！");
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
      if (self.enterStatus === "复核毛重") {
        self.proListOne[indexOne].editRoughWeight = parseFloat(elem);
      }
      if (self.enterStatus === "复核净重") {
        self.proListOne[indexOne].editSuttle = parseFloat(elem);
      }
      if (self.enterStatus === "毛重") {
        self.baoList[indexOne].roughWeight = parseFloat(elem);
      }
      if (self.enterStatus === "净重") {
        self.baoList[indexOne].suttle = parseFloat(elem);
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
    //输入框获得焦点
    focusWeightFocusTwo(e, ind, elem) {
      this.enterStatus = elem;
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlurTwo(elem) {
      let errorStatus = false;
      const { roughWeight,suttle } = elem;
      if (suttle > roughWeight) {
        errorStatus = true;
        elem.roughWeight = undefined;
        setTimeout(() => this.$forceUpdate(), 100);
      }
      this.weightTF = errorStatus;
      if (errorStatus) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
      }
      this.inputIndOne = "";
    },
    //打印产品
    printPro(elem) {
      this.printData = elem;
      this.$refs.printTPTwo.compPrintFun();
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

  .baoProTwo {
    margin-top: 30px;
    color: #8A8E99;
  }

  .baoProSix {
    margin: 5px 0;
    color: #8A8E99;
  }

  .baoProThree {
    border-top: 1px solid #E5F1FF;
    margin-top: 10px;
    color: #8A8E99;
  }

  .baoProFour {
    border-top: 1px solid #E5F1FF;
    margin-top: 10px;
    padding: 20px;
    color: #8A8E99;
  }

  .baoTabTwo {
    background: #fff;
    margin-top: 20px;
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
    border-top: 1px solid #E5F1FF;
    border-bottom: 1px solid #E5F1FF;
    margin-top: 10px;
    text-align: center;
    padding: 20px;
    color: #8A8E99;
  }

  .baoProFive {
    border-top: 1px solid #E5F1FF;
    padding-top: 20px;
    color: #8A8E99;
    background: #fff;
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

  .divOne {
    font-size: 16px;
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

  .tableTop {
    background: #EBF1F7;
    border: #CFD9E5 1px solid;
    border-bottom: 0;
    font-weight: bold;
    padding: 10px;
    color: #8A8E99;
    text-align: center;
  }

  .width240 {
    width: 240px;
  }

  .top10 {
    margin-top: 10px;
  }
}
</style>
