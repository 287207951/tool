<template>
  <div class="conBigDiv" ref="pickOrder" v-loading="loadingState" v-clock>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>拣货验收列表</el-breadcrumb-item>
      <el-breadcrumb-item>拣货验收详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
  <div class="info" style="min-width:900px" v-if="tableMenuData.menuList && tableMenuData.menuList.length > 0">
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
              <span v-if="orderList.pickSatatue == 2">
                <span v-if="item.key == 'baoNumber'">-</span>
                <span v-else-if="item.key == 'checkName'">-</span>
                <span v-else-if="item.key == 'checkTime'">-</span>
                <span v-else>{{orderList[item.key]}}</span>
              </span>
              <span v-if="orderList.pickSatatue == 4">
                <!-- 包号 -->
                <span v-if="item.key == 'pickAmount'">{{orderList['checkAmount']}}</span>
                <!-- 验收时间 -->
                <span v-else-if="item.key == 'pickWeight'">{{orderList['pickWeight']}}</span>
                <span v-else-if="item.key == 'totalWeight'">{{orderList['checkWeight']}}</span>
                <span v-else>{{orderList[item.key]}}</span>
              </span>
            </div>
            <div class="td handle" v-show="editTF">
              <el-button
                type="primary"
                size="mini"
                v-if="true"
                @click="upAudit"
                :loading="btnLoadingTF"
              >打包出库</el-button>
              <el-button
                type="warning"
                style="margin-top: 10px"
                size="mini"
                v-if="true"
                @click="backOrder"
                :loading="btnLoadingTF"
              >返回</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="info-middle" v-if="displayTab == 'baoFalse' || displayTab == 'baoZero'">
        <div class="titTwo">
          <div>
            打包信息
            <el-row
              v-for="(ielem,indOne) in baoDisList"
              :key="indOne"
              class="titTwoBao"
              @click.native="viewBaoFun(ielem)"
            >
              <el-col :span="3">
                包号
                <span class="blackTxt">{{ielem.baoCode}}</span>
              </el-col>
              <!-- <el-col :span="5">客户名称：{{ielem.baoCustomerName}}</el-col>
              <el-col :span="4">订单编号：{{ielem.baoOrderCode}}</el-col>-->
              <el-col :span="2">
                总数量
                <span class="blackTxt">{{ielem.baoAmount}}</span>
              </el-col>
              <el-col :span="2">
                净重
                <span class="blackTxt">{{ielem.baoStockWeight}}g</span>
              </el-col>
              <el-col :span="3">
                毛重
                <span v-if="ielem.baoStatue =='Y'" class="blackTxt">{{ielem.baoWeight}}g</span>
                <span v-if="ielem.baoStatue =='N'" @click.stop>
                  <el-input-number
                    v-model="ielem.baoWeight"
                    size="small"
                    style="width:100px"
                    :controls="false"
                    @focus="totalWeightFocus(indOne)"
                    @blur="totalWeightBlur(ielem)"
                  ></el-input-number>
                </span>
              </el-col>
              <el-col :span="3">
                毛重差异
                <span
                  v-if="ielem.baoStatue =='Y'"
                  class="blackTxt"
                >{{ielem.baoDifferenceWeight?ielem.baoDifferenceWeight:0}}g</span>
                <span v-if="ielem.baoStatue =='N'" @click.stop>
                  <el-input-number
                    v-model="ielem.baoDifferenceWeight"
                    size="small"
                    style="width:100px"
                    :controls="false"
                    @focus="totalWeightFocus(indOne)"
                    @blur="totalWeightBlur(ielem)"
                    :disabled="true"
                  ></el-input-number>
                </span>
              </el-col>
              <el-col :span="3">
                打包状态
                <span class="yellowTxt" v-if="ielem.baoStatue == 'N'">待打包</span>
                <span class="blackTxt" v-if="ielem.baoStatue == 'Y'">已打包</span>
              </el-col>
              <el-col :span="3" @click.native.stop>
                <span v-if="ielem.baoStatue == 'N'">
                  <span class="yellowTxt" v-if="!ielem.note" @click="addNote(ielem)">添加备注</span>
                  <span class="blackTxt" v-else @click="addNote(ielem)">查看备注</span>
                </span>
                <span v-if="ielem.baoStatue == 'Y'">
                  <!-- {{ielem}} -->
                  <span class="yellowTxt" v-if="!ielem.note">无备注</span>
                  <span class="blackTxt" v-else @click="viewNote(ielem)">查看备注</span>
                </span>
                &nbsp;
              </el-col>
              <el-col :span="5" style="padding-left:10px;" @click.native.stop>
                操作
                <el-button
                  type="text"
                  @click="printTabOneFun(ielem)"
                  v-if="ielem.baoStatue == 'Y'"
                >打印二维码</el-button>
                <el-button
                  size="small"
                  :loading="btnLoadingTF"
                  v-if="ielem.baoStatue == 'N'"
                  @click="confirmBaoOne(ielem)"
                >确认打包</el-button>
              </el-col>
            </el-row>
            <div class="info-item-wrap" v-for="(iitem,index) in baoDisListTwo" :key="index">
              <!-- 单品start -->
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="iitem.pickSkuProp.skuPic?$portImg+iitem.pickSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row style="height: 32px;">
                      <el-col :span="24" class="pro-tit">{{iitem.pickSkuProp.skuName}}</el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="7" class="pro-middle">编号：{{iitem.skuId}}</el-col>
                      <el-col
                        :span="5"
                        class="pro-middle txtTwo"
                      >数量：{{orderList.pickSatatue == 2?iitem.skuPickRealamount:iitem.skuCheckAmount}}</el-col>
                      <el-col
                        :span="5"
                        class="pro-middle txtTwo"
                      >剩余数量：{{iitem.overAmount}}</el-col>
                      <el-col :span="5" class="pro-middle redTxtOne">
                        实收数量：&nbsp;&nbsp;&nbsp;&nbsp;
                        <span
                          v-if="(iitem.skuEditTF || !editTF) && iitem.skuPickStatue == 'N'"
                        >{{iitem.editSkuCheckAmount}}</span>
                        <el-input-number
                          v-else
                          v-model="iitem.editSkuCheckAmount"
                          class="width70"
                          :controls="false"
                          @change="handleChangeTwo(iitem)"
                          :min="0"
                          size="small"
                          @blur="focusWeightBlur()"
                        ></el-input-number>
                      </el-col>
                      <el-col :span="2" class="pro-middle" v-show="editTF">
                        <el-button
                          size="small"
                          class="confirmBtn"
                          v-if="iitem.skuEditTF == false"
                          @click="addBaoOneFun(iitem,index)"
                        >添加到包</el-button>
                        <el-button size="small" class="confirmBtn" v-else disabled>已确认</el-button>
                      </el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="4" class="pro-bottom">成色：{{iitem.pickSkuProp.colorFormer}}</el-col>
                      <el-col
                        :span="4"
                        class="pro-bottom"
                      >克重(g): {{iitem.pickSkuProp.Weight?iitem.pickSkuProp.Weight:iitem.skuWeight}}</el-col>
                      <el-col :span="4" class="pro-bottom">
                        <!-- 圈号(#): 0000 -->
                        &nbsp;
                      </el-col>
                      <el-col :span="5" class="pro-middle txtTwo">金重(g)：{{iitem.skuPickWeight}}</el-col>
                      <el-col :span="5" class="pro-middle redTxtOne">
                        实收金重(g)：
                        <!-- 实收净重(g)111： -->
                        <!-- {{iitem.editSkuPickWeight}} -->
                        <el-input-number
                          v-model="iitem.editSkuPickWeight"
                          class="width70"
                          :controls="false"
                          @change="handleChange"
                          :min="0"
                          size="small"
                          @focus="focusWeightFocus(iitem,index)"
                          @blur="focusWeightBlur()"
                        ></el-input-number>
                      </el-col>
                      <el-col :span="2" class="pro-middle" v-show="iitem.suitTF">
                        <span class="redTxtOne" v-if="iitem.viewSuit" @click="editSuit(iitem)">
                          详情
                          <i class="el-icon-arrow-up"></i>
                        </span>
                        <span class="redTxtOne" v-if="!iitem.viewSuit" @click="editSuit(iitem)">
                          详情
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
                      v-for="(ielem,indOne) in iitem.pickSkuProp.map.proList"
                      :key="indOne"
                    >
                      <div class="tabThreeLeft">
                        <img
                          :src="ielem.pic?$portImg+ielem.pic:'../../../static/images/img-noimg.png'"
                          style="height:116px; width:153px;"
                          @click.stop="showPic(ielem.pic?$portImg+ielem.pic:'../../../static/images/img-noimg.png')"
                        >
                      </div>
                      <div class="tabThreeRight">
                        <el-row>
                          <el-col :span="24">{{ielem.proName}}</el-col>
                          <el-col :span="24" class="txtFive">编号：{{ielem.skuNum}}</el-col>
                          <el-col
                            :span="24"
                            class="txtFive"
                          >{{ielem.goldCode}} {{ielem.processCode}}</el-col>
                          <el-col :span="10" class="txtFive">克重(g)：{{ielem.weight}}</el-col>
                          <el-col
                            :span="14"
                            class="txtFive"
                          >
                            <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 没分包包查看包 -->
          <el-dialog title :visible.sync="viewBaoTF" width="1290px" :close-on-click-modal="false">
            <el-row class="titTwoBao">
              <el-col :span="2" style="font-weight:bold">打包信息：</el-col>
              <el-col :span="3">
                包号
                <span class="blackTxt">{{baoDisTwoObj.baoCode}}</span>
              </el-col>
              <el-col :span="3">
                总数量
                <span class="blackTxt">{{baoDisTwoObj.baoAmount}}</span>
              </el-col>
              <el-col :span="3">
                净重
                <span class="blackTxt">{{baoDisTwoObj.baoStockWeight}}g</span>
              </el-col>
              <el-col :span="3">
                毛重
                <span class="blackTxt">{{baoDisTwoObj.baoWeight}}g</span>
              </el-col>
              <el-col :span="6">
                毛重差异
                <span class="blackTxt">{{baoDisTwoObj.baoDifferenceWeight?baoDisTwoObj.baoDifferenceWeight:0}}g</span>
              </el-col>
              <el-col :span="4">
                <span class="yellowTxt" v-if="!baoDisTwoObj.note">无备注</span>
                <span class="blackTxt" v-else @click="viewNote(baoDisTwoObj)">查看备注</span>
              </el-col>

              <!-- <el-col :span="6">客户名称：{{baoDisTwoObj.baoCustomerName}}</el-col>
              <el-col :span="4">订单编号：{{baoDisTwoObj.baoOrderCode}}</el-col>-->
            </el-row>

            <div v-if="viewBaoListOne.length === 0 " style="text-align:center">此包暂无产品</div>
            <div
              v-if="viewBaoListOne.length > 0"
              class="info-item-wrap"
              v-for="(iitem,index) in viewBaoListOne"
              :key="index"
            >
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="iitem.pickSkuProp.skuPic?$portImg+iitem.pickSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row style="height: 32px;">
                      <el-col :span="18" class="pro-tit">{{iitem.pickSkuProp.skuName}}</el-col>
                      <el-col :span="6" v-if="baoDisTwoObj.baoStatue === 'N'">
                        <el-button size="small" @click="editSkuFun(iitem)" v-if="!iitem.editSku">编辑</el-button>
                        <el-button size="small" @click="saveSkuFun(iitem)" v-if="iitem.editSku">保存</el-button>
                        <el-button size="small" @click="delSkuFun(iitem,index)">移出</el-button>
                      </el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="12" class="pro-middle">编号：{{iitem.skuId}}</el-col>
                      <el-col
                        :span="5"
                        class="pro-middle txtTwo"
                      >数量：{{iitem.editSkuCheckAmount?iitem.editSkuCheckAmount:iitem.skuCheckAmount}}</el-col>
                      <el-col :span="5" class="pro-middle redTxtOne">
                        实收数量：&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-input-number
                          v-if="iitem.editSku"
                          v-model="iitem.editSkuCheckAmount"
                          class="width70"
                          :controls="false"
                          @change="handleChangeTwo(iitem)"
                          :min="0"                          
                          size="small"
                          @blur="focusWeightBlur()"
                        ></el-input-number>
                        <span v-else class="pro-middle redTxtOne">{{iitem.editSkuCheckAmount?iitem.editSkuCheckAmount:iitem.skuCheckAmount}}</span>
                      </el-col>
                      <el-col :span="2" class="pro-middle" v-show="editTF">&nbsp;</el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="4" class="pro-bottom">成色：{{iitem.pickSkuProp.colorFormer}}</el-col>
                      <el-col
                        :span="4"
                        class="pro-bottom"
                      >克重(g): {{iitem.pickSkuProp.Weight?iitem.pickSkuProp.Weight:iitem.skuWeight}}</el-col>
                      <el-col :span="4" class="pro-bottom">
                        <!-- 圈号(#): - -->
                        &nbsp;
                      </el-col>
                      <el-col :span="5" class="pro-middle txtTwo">金重(g)：{{iitem.pickSkuProp.Weight?iitem.pickSkuProp.Weight*(iitem.editSkuCheckAmount?iitem.editSkuCheckAmount:iitem.skuCheckAmount):iitem.skuWeight*(iitem.editSkuCheckAmount?iitem.editSkuCheckAmount:iitem.skuCheckAmount)}}</el-col>
                      <el-col :span="5" class="pro-middle redTxtOne">
                        实收金重(g)：
                        <el-input-number
                          v-if="iitem.editSku"
                          v-model="iitem.editSkuPickWeight"
                          class="width70"
                          :controls="false"
                          @change="handleChange"
                          :min="0"
                          size="small"
                          @blur="focusWeightBlur()"
                        ></el-input-number>
                        <span v-else class="pro-middle redTxtOne">{{iitem.editSkuPickWeight}}</span>
                      </el-col>
                      <el-col :span="2" class="pro-middle" v-if="iitem.suitTF">
                        <span class="redTxtOne" v-if="iitem.viewSuit" @click="editSuit(iitem)">
                          详情
                          <i class="el-icon-arrow-up"></i>
                        </span>
                        <span class="redTxtOne" v-if="!iitem.viewSuit" @click="editSuit(iitem)">
                          详情
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
                      v-for="(ielem,indOne) in iitem.pickSkuProp.map.proList"
                      :key="indOne"
                    >
                      <div class="tabThreeLeft">
                        <img
                          :src="ielem.pic?$portImg+ielem.pic:'../../../static/images/img-noimg.png'"
                          style="height:116px; width:153px;"
                          @click.stop="showPic(ielem.pic?$portImg+ielem.pic:'../../../static/images/img-noimg.png')"
                        >
                      </div>
                      <div class="tabThreeRight">
                        <el-row>
                          <el-col :span="24">{{ielem.proName}}</el-col>
                          <el-col :span="24" class="txtFive">编号：{{ielem.skuNum}}</el-col>
                          <el-col
                            :span="24"
                            class="txtFive"
                          >{{ielem.goldCode}} {{ielem.processCode}} {{ielem.carFlower}}</el-col>
                          <el-col :span="10" class="txtFive">克重(g)：{{ielem.weight}}</el-col>
                          <el-col
                            :span="14"
                            class="txtFive"
                          >
                            <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-dialog>
        </div>

        <!-- 单品end -->
      </div>
      <div v-if="displayTab == 'baoTrue' || displayTab=='baoThree'">
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
              v-for="item in baoFactList"
              :key="item.index"
              :label="item.shopName"
              :value="item.index"
            ></el-option>
          </el-select>
          <span class="titOneLeft">总数量：{{baoFactData.realShopAmount}}</span>
          <span class="titOneLeft">总毛重(g)：{{baoFactData.shopPickWeight}}</span>
          <!-- <span class="titOneRight">
            <el-button type="danger" size="small" @click="printTabTwoFun(baoFactData)">打印条码</el-button>
          </span>-->
        </div>
        <div class="titTwo">
          <div>
            打包信息
            <div v-for="(ielem,indOne) in baoDisList" :key="indOne" @click="viewBaoTwoFun(ielem)">
              <el-row class="titTwoBao">
                <el-col :span="3">
                  包号
                  <span class="blackTxt">{{ielem.baoCode}}</span>
                </el-col>
                <!-- <el-col :span="5">客户名称：{{ielem.baoCustomerName}}</el-col>
                <el-col :span="4">订单编号：{{ielem.baoOrderCode}}</el-col>-->
                <el-col :span="2">
                  总数量
                  <span class="blackTxt">{{ielem.baoAmount}}</span>
                </el-col>
                <el-col :span="2">
                  金重
                  <span class="blackTxt">{{ielem.baoStockWeight}}g</span>
                </el-col>
                <el-col :span="3">
                  毛重
                  <span v-if="ielem.baoStatue =='Y'" class="blackTxt">{{ielem.baoWeight}}g</span>
                  <span v-if="ielem.baoStatue =='N'" @click.stop>
                    <el-input-number
                      v-model="ielem.baoWeight"
                      size="small"
                      style="width:100px"
                      :controls="false"
                      @focus="totalWeightFocus(indOne)"
                      @blur="totalWeightBlur(ielem)"
                    ></el-input-number>
                  </span>
                </el-col>
                <el-col :span="3">
                  毛重差异
                  <span
                    v-if="ielem.baoStatue =='Y'"
                    class="blackTxt"
                  >{{ielem.baoDifferenceWeight?ielem.baoDifferenceWeight:0}}g</span>
                  <span v-if="ielem.baoStatue =='N'" @click.stop>
                    <el-input-number
                      v-model="ielem.baoDifferenceWeight"
                      size="small"
                      style="width:100px"
                      :controls="false"
                      @focus="totalWeightFocus(indOne)"
                      @blur="totalWeightBlur(ielem)"
                      :disabled="true"
                    ></el-input-number>
                  </span>
                </el-col>
                <el-col :span="3">
                  打包状态
                  <span class="yellowTxt" v-if="ielem.baoStatue == 'N'">待打包</span>
                  <span class="blackTxt" v-if="ielem.baoStatue == 'Y'">已打包</span>
                </el-col>
                <el-col :span="3" @click.native.stop>
                  <span v-if="ielem.baoStatue == 'N'">
                    <span class="yellowTxt" v-if="!ielem.note" @click="addNote(ielem)">添加备注</span>
                    <span class="blackTxt" v-else @click="addNote(ielem)">查看备注</span>
                  </span>
                  <span v-if="ielem.baoStatue == 'Y'">
                    <span class="yellowTxt" v-if="!ielem.note">无备注</span>
                    <span class="blackTxt" v-else @click="viewNote(ielem)">查看备注</span>
                  </span>
                  &nbsp;
                </el-col>
                <el-col :span="5" style="padding-left:10px;" @click.native.stop>
                  操作
                  <el-button
                    type="text"
                    @click="printTabOneFun(ielem)"
                    v-if="ielem.baoStatue == 'Y'"
                  >打印二维码</el-button>
                  <el-button
                    size="small"
                    :loading="btnLoadingTF"
                    v-if="ielem.baoStatue == 'N'"
                    @click="confirmBaoOne(ielem)"
                  >确认打包</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="info-item-wrap" v-for="(iitem,index) in baoFactData.pickSkus" :key="index">
            <div class="infom-item">
              <div class="pro-item iitem-left">
                <div class="pro-imgs">
                  <img
                    :src="iitem.pickSkuProp.skuPic?$portImg+iitem.pickSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                    width="153"
                    height="116"
                  >
                </div>
                <div class="pro-right">
                  <el-row style="height: 32px;">
                    <el-col :span="24" class="pro-tit">{{iitem.storageNumber}}</el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col :span="7" class="pro-middle">编号：{{iitem.skuId}}</el-col>
                    <el-col
                      :span="5"
                      class="pro-middle txtTwo"
                    >数量：{{orderList.pickSatatue == 2?iitem.skuPickRealamount:iitem.skuPickRealamount}}</el-col>
                    <el-col
                      :span="5"
                      class="pro-middle txtTwo"
                    >剩余数量：{{iitem.overAmount}}</el-col>
                    <el-col :span="5" class="pro-middle redTxtOne">
                      实收数量：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span
                        v-if="(iitem.skuEditTF || !editTF) && iitem.skuPickStatue == 'N'"
                      >{{iitem.editSkuCheckAmount}}</span>
                      <el-input-number
                        v-else
                        v-model="iitem.editSkuCheckAmount"
                        class="width70"
                        :controls="false"
                        @change="handleChangeTwo(iitem)"
                        :min="0"
                        :max="iitem.overAmount"
                        size="small"
                        @blur="focusWeightBlur()"
                      ></el-input-number>
                    </el-col>
                    <el-col :span="2" class="pro-middle" v-show="editTF">
                      <!-- <el-button
                        size="small"
                        class="confirmBtn"
                      >打印条码</el-button>-->
                    </el-col>
                  </el-row>
                  <el-row style="height: 35px;">
                    <el-col :span="4" class="pro-bottom">成色：{{iitem.pickSkuProp.colorFormer}}</el-col>
                    <el-col
                      :span="4"
                      class="pro-bottom"
                    >克重(g): {{iitem.pickSkuProp.Weight?iitem.pickSkuProp.Weight:iitem.skuWeight}}</el-col>
                    <el-col :span="4" class="pro-bottom">
                      <!-- 圈号(#): - -->
                      &nbsp;
                    </el-col>
                    <el-col :span="5" class="pro-middle txtTwo">金重(g)：{{iitem.skuPickWeight}}</el-col>
                    <el-col :span="5" class="pro-middle redTxtOne">
                      实收金重(g)：
                      <el-input-number
                        v-model="iitem.editSkuPickWeight"
                        class="width70"
                        :controls="false"
                        @change="handleChange"
                        :min="0"
                        @focus="focusWeightFocus(iitem,index)"
                        @blur="focusWeightBlur()"
                        size="small"
                      ></el-input-number>
                    </el-col>
                    <el-col :span="2" class="pro-middle" v-show="editTF">
                      <el-button
                        size="small"
                        class="confirmBtn"
                        @click="addBaoFun(iitem,index,baoFactData.pickSkus)"
                      >添加到包</el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
          <!-- 有分包包查看包 -->
          <el-dialog
            title
            :visible.sync="viewBaoTwoTF"
            width="1290px"
            :close-on-click-modal="false"
          >
            <el-row class="titTwoBao">
              <el-col :span="2" style="font-weight:bold">打包信息：</el-col>
              <el-col :span="3">
                包号
                <span class="blackTxt">{{baoDisTwoObj.baoCode}}</span>
              </el-col>
              <el-col :span="3">
                总数量
                <span class="blackTxt">{{baoDisTwoObj.baoAmount}}</span>
              </el-col>
              <el-col :span="3">
                净重
                <span class="blackTxt">{{baoDisTwoObj.baoWeight}}g</span>
              </el-col>
              <el-col :span="3">
                毛重
                <span class="blackTxt">{{baoDisTwoObj.baoStockWeight}}g</span>
              </el-col>
              <!-- <el-col :span="6">客户名称：{{baoDisTwoObj.baoCustomerName}}</el-col>
              <el-col :span="4">订单编号：{{baoDisTwoObj.baoOrderCode}}</el-col>-->
              <el-col :span="6">
                毛重差异
                <span class="blackTxt">{{baoDisTwoObj.baoDifferenceWeight?baoDisTwoObj.baoDifferenceWeight:0}}g</span>
              </el-col>
              <el-col :span="4">
                <!-- {{baoDisTwoObj.note}} -->
                <span class="yellowTxt" v-if="!baoDisTwoObj.note">无备注</span>
                <span class="blackTxt" v-else @click="viewNote(baoDisTwoObj)">查看备注</span>
              </el-col>
            </el-row>
            <div v-if="baoDisListThree.length == 0 " style="text-align:center">此包暂无产品</div>
            <div
              v-else
              class="info-item-wrap"
              v-for="(iitem,index) in baoDisListThree"
              :key="index"
            >
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="iitem.pickSkuProp.skuPic?$portImg+iitem.pickSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <el-row style="height: 32px;">
                      <el-col :span="24" class="pro-tit">{{iitem.storageNumber}}</el-col>
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="12" class="pro-middle">编号：{{iitem.skuId}}</el-col>
                      <el-col
                        :span="5"
                        class="pro-middle txtTwo"
                      >数量：{{iitem.editSkuCheckAmount?iitem.editSkuCheckAmount:iitem.skuCheckAmount}}</el-col>
                      <el-col :span="7" class="pro-middle redTxtOne">
                        实收数量：
                        <span v-if="!iitem.editSkuCheckAmount">{{iitem.skuCheckAmount}}</span>
                        <span v-else>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <el-input-number
                            v-if="(iitem.skuEditTF || !editTF)"
                            v-model="iitem.editSkuCheckAmount"
                            class="width70"
                            :controls="false"
                            @change="handleChangeTwo(iitem)"
                            :min="0"
                            size="small"
                            @blur="focusWeightBlur()"
                          ></el-input-number>
                          <span v-else>{{iitem.editSkuCheckAmount}}</span>
                        </span>
                      </el-col>
                      <!-- 
                      <el-col
                        :span="2"
                        class="pro-middle"
                        v-if="!iitem.skuCheckAmount"
                        v-show="editTF"
                      >
                        <el-button
                          size="small"
                          class="confirmBtn"
                          @click="skuConfirmFun(iitem)"
                          v-if="!iitem.skuEditTF"
                        >编辑</el-button>
                        <el-button
                          size="small"
                          class="confirmBtn"
                          @click="skuSaveFun(iitem)"
                          v-else
                        >保存</el-button>
                        &nbsp;
                      </el-col>-->
                    </el-row>
                    <el-row style="height: 35px;">
                      <el-col :span="4" class="pro-bottom">成色：{{iitem.pickSkuProp.colorFormer}}</el-col>
                      <el-col
                        :span="4"
                        class="pro-bottom"
                      >克重(g): {{iitem.pickSkuProp.Weight?iitem.pickSkuProp.Weight:iitem.skuWeight}}</el-col>
                      <el-col :span="4" class="pro-bottom">
                        <!-- 圈号(#): - -->
                        &nbsp;
                      </el-col>
                      <el-col :span="5" class="pro-middle txtTwo">金重(g)：{{iitem.pickSkuProp.Weight?iitem.pickSkuProp.Weight*(iitem.editSkuCheckAmount?iitem.editSkuCheckAmount:iitem.skuCheckWeight):iitem.skuWeight*iitem.editSkuCheckAmount}}</el-col>
                      <el-col :span="5" class="pro-middle redTxtOne">
                        实收金重(g)：
                        <span v-if="!iitem.editSkuPickWeight">{{iitem.skuCheckWeight}}</span>
                        <span v-else>
                          <el-input-number
                            v-if="iitem.skuEditTF || !editTF"
                            v-model="iitem.editSkuPickWeight"
                            class="width70"
                            :controls="false"
                            @change="handleChange"
                            :min="0"
                            size="small"
                            @blur="focusWeightBlur()"
                          ></el-input-number>
                          <span v-else>{{iitem.editSkuPickWeight}}</span>
                        </span>
                      </el-col>
                      <el-col :span="2" class="pro-middle" v-show="editTF"></el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <el-dialog title="备注" :visible.sync="addNoteTF" width="560px">
      <span>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="noteTxt"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNoteTF = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editNote" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看备注" :visible.sync="viewNoteTF" width="560px" :close-on-click-modal="false">
      <span>{{noteTxt}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewNoteTF = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <div ref="printTabOne" v-show="false" style="width:150px">
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
    </div>-->
    <!-- <div ref="printTabTwo" v-show="false" style="width:150px">
      <div
        style="line-height:20px;font-size:10px;padding-left:5px;font-weight:bold;font-family:'SimHei'"
      >
        <div>客户：{{baoDisTwoObj.shopName}}</div>
        <div>品类：{{oneList}}</div>
        <div>净重：{{baoDisTwoObj.shopCheckWeight}}</div>
        <div>毛重：{{baoDisTwoObj.shopTotalWeight}}</div>
        <div>件数：{{baoDisTwoObj.shopCheckAmount}}</div>
        <div>说明：</div>
      </div>
    </div>-->
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    
    <!-- 打印二维码 --> 
    <div v-show="false">
      <printTPThree :billData="printData" ref="printTPThree"></printTPThree>
    </div>
  </div>
  <!-- </div> -->
</template>
<script>
export default {
  data() {
    return {
      printData: {},
      loadingState: false,
      stepsActive: 1,
      orderList: {},
      result: {},
      pickId: "",
      editTF: true, //可编辑
      tableMenuData: {}, //菜单显示
      oneList: "", //打印品类
      tableDisData: [
        {
          id: 1,
          code: "_cus",
          value: "工厂来货-客单",
          menuList: [
            {
              key: "pickCode",
              menuName: "拣货单号"
            },
            {
              key: "pickPersonName",
              menuName: "拣货人"
            },
            {
              key: "pickTime",
              menuName: "拣货时间",
              width: "170px"
            },
            {
              key: "orderCode",
              menuName: "订单编号",
              width: "170px"
            },
            {
              key: "customerName",
              menuName: "客户名称"
            },
            {
              key: "pickAmount",
              menuName: "数量"
            },
            {
              key: "totalWeight",
              menuName: "毛重(g)"
            },
            {
              key: "pickWeight",
              menuName: "净重(g)"
            },
            {
              key: "baoNumber",
              menuName: "原单号"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间",
              width: "170px"
            }
          ]
        }
      ],
      baoAlldata: [], //分包数据显示
      baoFactList: [], //分包下拉选择数组
      baoFactInd: 0, //分包选择
      baoFactData: {}, //分包选择数据
      viewBaoTF: false, //查看包里产品
      viewBaoTwoTF: false, //分包查看包里产品
      inputIndOne: -1, //实收毛重输入框index
      inputIndTotal: -1, //实收净重输入框index
      baoDisList: [], //包的数据
      baoDisTwoObj: {}, //查看包的数据
      baoDisListTwo: {}, //查看包的数据
      baoDisListThree: [], //有查看包的数据
      pickSkuDisList: [], //查看产品数据
      viewBaoListOne: [], //无分包包号弹框产品数据
      viewBaoListTwo: [], //有分包包号弹框产品数据
      displayTab: "", //无分包baoFalse,有分包baoTrue,既有分包又有无分包baoThree
      btnLoadingTF: false,
      LODOP: {},
      addNoteTF: false, //添加、编辑备注弹窗
      noteTxt: "", //添加、编辑备注
      noteItem: {},
      viewNoteTF: false //查看备注弹窗
    };
  },

  created() {
    let self = this;
    this.pickId = this.$route.query.pickId;
    this.created_fun();
  },


  methods: {
    created_fun() {
      var self = this;
      this.loadingState = true;
      document.onkeydown = e => {
        let dom = self.$refs.pickOrder;
        if (dom && e.code == "F9") {
          self.comFun();
        }
      };
      this.loopInit = this.loop();
      let params = {
        PRS: {
          pickId: this.pickId
        }
      };
      this.$axios
        .get(this.$portMain + "/pick/order/getToCheckPickFrom", params)
        .then(res => {
          if (res.data.code === 200) {
            self.loadingState = false;
            self.orderList = res.data.data;
            self.orderList.index = 1;
            self.orderList.crearorTime = self.$api.dateGetDayTime(
              self.orderList.crearorTime
            );
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

            if (!self.orderList.pickSkuList) {
              self.orderList.pickSkuList = [];
            }
            if (!self.orderList.pickShops) {
              self.orderList.pickShops = [];
            }
            if (
              self.orderList.pickSkuList.length > 0 &&
              self.orderList.pickShops.length === 0
            ) {
              self.displayTab = "baoFalse";
            }
            if (
              self.orderList.pickSkuList.length === 0 &&
              self.orderList.pickShops.length > 0
            ) {
              self.displayTab = "baoTrue";
            }
            if (
              self.orderList.pickSkuList.length > 0 &&
              self.orderList.pickShops.length > 0
            ) {
              self.displayTab = "baoThree";
            }
            if (
              self.orderList.pickSkuList.length === 0 &&
              self.orderList.pickShops.length === 0
            ) {
              self.displayTab = "baoZero";
            }
            // console.log(self.displayTab)
            //
            if (self.displayTab === "baoFalse") {
              self.baoDisList = self.orderList.JBao;
              self.orderList.pickSkuList.forEach((item, ind) => {
                if (self.orderList.pickSatatue == 2) {
                  item.editSkuCheckAmount = item.skuPickRealamount;
                  item.overAmount = item.editSkuCheckAmount
                }
                if (self.orderList.pickSatatue == 4) {
                  item.editSkuCheckAmount = item.skuCheckAmount;
                  item.overAmount = item.editSkuCheckAmount
                }
                item.editSkuPickWeight = item.skuPickWeight;
                item.skuEditTF = false;
              });

              self.baoDisListTwo = self.orderList.pickSkuList;
              self.baoDisListTwo.forEach(ielem => {
                if (ielem.pickSkuProp.map) {
                  ielem.suitTF = true;
                } else {
                  ielem.suitTF = false;
                }
              });
              self.baoDisList.forEach((ielem, ind) => {
                if (ielem.pickSkuList) {
                  ielem.pickSkuList.forEach(jelem => {
                    if (jelem.skuPickWeight) {
                      jelem.editSkuPickWeight = jelem.skuPickWeight;
                    } else {
                      jelem.editSkuPickWeight = jelem.skuPickWeight;
                    }
                  });
                }
              });
            }

            if (self.displayTab === "baoTrue") {
              self.baoAlldata = self.orderList.pickShops;
              self.baoFactList = [];
              self.baoAlldata.forEach((item, ind) => {
                item.editShopPickWeight = item.shopPickWeight;
                item.realShopAmount;
                item.pickSkus.forEach((jelem, indTwo) => {
                  jelem.editSkuCheckAmount = jelem.skuPickRealamount;
                  jelem.editSkuPickWeight = jelem.skuPickWeight;
                  jelem.overAmount = jelem.editSkuCheckAmount;
                });
                self.baoFactList.push({
                  shopName: item.shopName,
                  index: ind,
                  JBao: item.JBao,
                  pickSkus: item.pickSkus
                });
              });
              if (self.orderList.JBao) {
                self.baoFactList.unshift({
                  index: 100,
                  shopName: self.orderList.customerName,
                  JBao: self.orderList.JBao,
                  pickSkus: []
                });
              }

              self.searchFun();
            }
            if (self.displayTab === "baoThree") {
              self.baoDisList = self.orderList.JBao;
              self.baoDisList.forEach((ielem, ind) => {
              });
              self.baoAlldata = self.orderList.pickShops;
              let newObj = self.orderList.pickSkuList;
              self.baoAlldata.unshift({
                shopName: self.orderList.customerName,
                JBao: self.orderList.JBao,
                pickSkus: newObj
              });
              self.baoFactList = [];
              self.baoAlldata.forEach((item, ind) => {
                item.editShopPickWeight = item.shopPickWeight;
                item.realShopAmount;
                item.pickSkus.forEach((jelem, indTwo) => {
                  jelem.editSkuCheckAmount = jelem.skuPickRealamount;
                  jelem.overAmount = jelem.editSkuCheckAmount
                  if (jelem.skuPickWeight) {
                    jelem.editSkuPickWeight = jelem.skuPickWeight;
                  } else {
                    jelem.skuPickWeight = jelem.pickSkuProp.Weight;
                    jelem.editSkuPickWeight = jelem.skuPickWeight;
                  }
                });
                self.baoFactList.push({
                  shopName: item.shopName,
                  index: ind,
                  pickSkus:item.pickSkus,
                  JBao:item.JBao,
                });
                this.changeNum(item);
              });

              self.searchFun();
            }
            if (self.displayTab === "baoZero") {
              self.baoDisList = self.orderList.JBao;
              self.orderList.pickSkuList.forEach((item, ind) => {
                if (self.orderList.pickSatatue == 2) {
                  item.editSkuCheckAmount = item.skuPickRealamount;
                }
                if (self.orderList.pickSatatue == 4) {
                  item.editSkuCheckAmount = item.skuCheckAmount;
                }
                item.overAmount = item.editSkuCheckAmount
                item.editSkuPickWeight = item.skuPickWeight;
                item.skuEditTF = false;
              });

              self.baoDisListTwo = self.orderList.pickSkuList;
              self.baoDisListTwo.forEach(ielem => {
                if (ielem.pickSkuProp.map) {
                  ielem.suitTF = true;
                } else {
                  ielem.suitTF = false;
                }
              });
              self.baoDisList.forEach((ielem, ind) => {
                if (ielem.pickSkuList) {
                  ielem.pickSkuList.forEach(jelem => {
                    jelem.editSkuPickWeight = jelem.skuPickWeight;
                  });
                }
              });
            }
            self.orderList.pickTime = self.$api.dateGetDayTime(
              self.orderList.pickTime
            );
            self.orderList.checkTime = self.$api.dateGetDayTime(
              self.orderList.checkTime
            );
            if (self.orderList.pickSatatue == 4) {
              self.editTF = false;
            } else {
              self.editTF = true;
            }
            self.menuData();
          }
        });
    },
    //菜单读取事件
    menuData() {
      var self = this;
      self.tableMenuData = self.tableDisData[0];
    },

    //sku编辑
    editSkuFun(ielem) {
      ielem.editSku = true;
      this.$forceUpdate();
    },
    //sku保存
    saveSkuFun(ielem) {
      ielem.editSku = false;
      this.baoNumOneFun();
      this.$forceUpdate();
    },
    //sku移出
    delSkuFun(elem, index) {
      let self = this;
      let newTF = true;
      let tempObj = {};
      self.orderList.pickSkuList.forEach(ielem => {
        if (ielem.skuId === self.baoDisTwoObj.pickSkus[index].skuId) {
          newTF = false;
          tempObj = JSON.parse(JSON.stringify(ielem));
        }
      });

      if (!newTF) {
        tempObj.oriSkuSumOne += self.baoDisTwoObj.pickSkus[index].editOriSkuSum;
        tempObj.editOriSkuSum +=
          self.baoDisTwoObj.pickSkus[index].editOriSkuSum;
        tempObj.editSkuWeight +=
          self.baoDisTwoObj.pickSkus[index].editSkuWeight;
        let skuTF = false
        self.orderList.pickSkuList.forEach(ielem=>{
          if(ielem.skuId === elem.skuId){
            ielem.editSkuCheckAmount += elem.editSkuCheckAmount
            ielem.editSkuPickWeight += elem.editSkuPickWeight
          }
        })
        self.baoDisTwoObj.pickSkus.splice(index, 1);
      } else {
        self.orderList.pickSkuList.push(self.baoDisTwoObj.pickSkus[index]);
        self.baoDisTwoObj.pickSkus.splice(index, 1);
      }
      self.baoNumOneFun();
      self.$forceUpdate();
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      self.$refs.comA.click();
      self.loopInit();
    },
    
    //改变电子称输入框数量
    changeWeight(elem){
      let self = this;
      if (self.inputIndOne === -1 && self.inputIndTotal === -1) {
        self.$message.error("实收净重没有被焦点选中！");
      }
      if (self.inputIndOne != -1) {
        var indexOne;
        if (
          self.displayTab === "baoThree" ||
          self.displayTab === "baoTrue"
        ) {
          indexOne = parseInt(self.inputIndOne);
          self.baoFactData.pickSkus[
            indexOne
          ].editSkuPickWeight = parseFloat(elem);
        }
        if (
          self.displayTab === "baoZero" ||
          self.displayTab === "baoFalse"
        ) {
          indexOne = parseInt(self.inputIndOne);
          self.baoDisListTwo[indexOne].editSkuPickWeight = parseFloat(elem);
        }

        self.$forceUpdate();
      }
      //毛重称重
      if (self.inputIndTotal != -1) {
        indexOne = self.inputIndTotal;
        self.baoDisList[indexOne].baoWeight = parseFloat(elem);
        self.$forceUpdate();
      }
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
    upAudit() {
      var self = this;
      self.btnLoadingTF = true;
      let submitTF = false;
      let submitList = [];
      // console.log(self.baoDisList)
      self.baoDisList.forEach(item => {
        // console.log(item)
        if (item.baoStatue == "N") {
          submitTF = true;
        }
        submitList.push({
          pickSkuId: item.pickSkuId,
          skuCheckAmount: item.editSkuCheckAmount,
          skuCheckWeight: item.editSkuPickWeight
        });
      });
      // console.log(submitList)
      if (submitTF) {
        self.$message.error("还有未确认的包号，请确认完所有产品再点打包出库！");
        self.btnLoadingTF = false;
      } else {
        let params = {
          // pickSkus: JSON.stringify(submitList),
          pickId: this.pickId
        };
        // console.log(submitList)
        this.$api.formdataPostFun(
          self.$portMain + "/pick/order/ConfirmCheckPick",
          params,
          res => {
            self.btnLoadingTF = false;
            self.$message.success("打包出库成功，正在跳转到入库验收单！");
            setTimeout(function() {
              self.$router.push("pickOrder");
            }, 1000);
          },
          err => {
            self.btnLoadingTF = false;
            self.$message.error(err.msg);
          }
        );
      }
    },
    handleChange() {
      this.$forceUpdate();
    },
    handleChangeTwo(elem) {
      elem.editSkuCheckAmount = parseInt(elem.editSkuCheckAmount)
      this.$forceUpdate();
    },
    backOrder() {
      this.$router.push("pickOrder");
    },
    //确认单个sku
    skuConfirmFun(elem) {
      let self = this;
      elem.skuEditTF = true;
      self.$forceUpdate();
    },
    //确认单个sku
    skuSaveFun(elem) {
      let self = this;
      elem.skuEditTF = false;
      self.$forceUpdate();
    },

    //没分包查看分包里产品
    viewBaoFun(elem) {
      let self = this;
      if (elem.pickSkus) {
        // self.viewBaoListOne = elem.pickSkuList;
        self.viewBaoListOne = elem.pickSkus;
      } else if (elem.pickSkuList) {
        self.viewBaoListOne = elem.pickSkuList;
      } else {
        self.viewBaoListOne = [];
      }
      //
      // if (elem.baoStatue == "Y") {
      //   self.viewBaoListOne = elem.pickSkus;
      // }

      // console.log(elem)
      // console.log(self.viewBaoListOne)
      self.viewBaoListOne.forEach(ielem => {
        // console.log(ielem)
        ielem.editSku = false;
      });
      self.baoDisTwoObj = elem;
      self.viewBaoTF = true;
    },
    //查看分包里产品
    viewBaoTwoFun(elem) {
      let self = this;

      self.baoDisTwoObj = elem;
      if (elem.pickSkus) {
        // console.log(elem)
        self.baoDisListThree = elem.pickSkus;
      } else if (elem.pickSkuList) {
        self.baoDisListThree = elem.pickSkuList;
      } else {
        self.baoDisListThree = [];
      }

      self.viewBaoTwoTF = true;
    },
    //输入框获得焦点
    focusWeightFocus(e, ind) {
      this.inputIndOne = parseInt(ind);
    },
    //输入框丢去焦点
    focusWeightBlur() {
      this.inputIndOne = -1;
      if (this.baoFactData) {
        this.changeNum(this.baoFactData);
      }
    },
    //毛重输入框获得焦点
    totalWeightFocus(index) {
      this.inputIndTotal = parseInt(index);
      //
      //
    },
    //毛重输入框丢去焦点
    totalWeightBlur(item) {
      this.inputIndTotal = -1;
      if (!isNaN(item.baoWeight)) {
        item.baoDifferenceWeight = this.$api.returnFloatNum(
          Number(item.baoWeight) - Number(item.baoStockWeight)
        );
      } else {
        item.baoDifferenceWeight = 0;
      }
      item.baoWeight = this.$api.returnFloatNum(item.baoWeight);
      this.changeNum(this.baoFactData);
      // this.inputIndOne = "";
      this.$forceUpdate();
    },
    //修改数量和金重
    changeNum(elem) {
      let editShopPickWeight = 0;
      // console.log(elem)
      let realShopAmount = 0;
      elem.JBao.forEach(ielem => {
        realShopAmount += ielem.baoAmount?ielem.baoAmount:0;
        editShopPickWeight += ielem.baoWeight?ielem.baoWeight:0;
      });
      elem.pickSkus.forEach(jelem => {
        realShopAmount += jelem.editSkuCheckAmount?jelem.editSkuCheckAmount:0;
        editShopPickWeight += jelem.editSkuPickWeight?jelem.editSkuPickWeight:0;
      });
      elem.realShopAmount = realShopAmount;
      elem.shopPickWeight = editShopPickWeight;
      this.$forceUpdate();
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    // //输入框获得焦点
    // focusTotalWeightFocus(e, ind) {
    //   this.inputIndTotal = ind + 1;
    // },
    // //输入框丢去焦点
    // focusTotalWeightBlur() {
    //   this.inputIndTotal = "";
    // },
    //选择分包事件
    searchFun() {
      let self = this;

      self.baoFactData = self.baoAlldata[self.baoFactInd];
      self.baoAlldata = self.baoAlldata.concat(self.baoFactData.JBao);
      // console.log(self.baoAlldata)
      // console.log(self.baoFactData)
      self.baoDisList = self.baoFactData.JBao;
      self.baoDisListTwo = self.baoFactData.pickSkus;
      self.baoDisListTwo.forEach(ielem => {
        if (ielem.pickSkuProp.map) {
          ielem.suitTF = true;
        } else {
          ielem.suitTF = false;
        }
      });
      self.viewBaoListTwo = [];
    },
    //无分包添加到包
    addBaoOneFun(elem, index) {
      let self = this;
      let len = self.baoDisList.length - 1;
      let tempObj = JSON.parse(JSON.stringify(elem))
      if (self.baoDisList[len].pickSkus) {
        self.baoDisList[len].pickSkus.push(tempObj);
      } else {
        self.baoDisList[len].pickSkus = [];
        self.baoDisList[len].pickSkus.push(tempObj);
      }
      if (self.baoNumOneFun()) {
          if(elem.overAmount === elem.editSkuCheckAmount){
            self.baoDisListTwo.splice(index, 1);
          }else{
            elem.overAmount -= elem.editSkuCheckAmount
            elem.editSkuCheckAmount = elem.overAmount
            elem.editSkuPickWeight = elem.overAmount * elem.pickSkuProp.Weight
          }
      }
    },
    //包号数量改变
    baoNumOneFun() {
      let self = this;
      var returnTxt = false;
      let baoAmountNum = 0;
      let skuWeightNum = 0;
      let pickWeightNum = 0;
      // console.log(self.baoDisList)
      self.baoDisList.forEach(ielem => {
        if (ielem.baoStatue == "N" && ielem.pickSkus) {
          ielem.pickSkus.forEach(jelem => {
            baoAmountNum += jelem.editSkuCheckAmount;
            skuWeightNum += jelem.skuPickWeight;
            pickWeightNum += jelem.editSkuPickWeight;
          });
          // console.log(pickWeightNum)
          ielem.baoAmount = baoAmountNum;
          ielem.baoWeight = pickWeightNum;
          ielem.baoStockWeight = pickWeightNum;
          ielem.baoDifferenceWeight = self.$api.returnFloatNum(
            Number(ielem.baoWeight) - Number(ielem.baoStockWeight)
          );
          returnTxt = true;
        }
      });
      return returnTxt;
    },
    //有分包添加到包
    addBaoFun(elem, index, baoFactData) {
      let self = this;
      let len = self.baoDisList.length - 1;
      let tempObj = JSON.parse(JSON.stringify(elem))
      if (self.baoDisList[len].pickSkus) {
        self.baoDisList[len].pickSkus.push(tempObj);
      } else {
        self.baoDisList[len].pickSkus = [];
        self.baoDisList[len].pickSkus.push(tempObj);
      }
      if (self.baoNumFun()) {
        baoFactData.forEach((ielem, indOne) => {
          if (ielem.skuId === elem.skuId) {
            if(ielem.overAmount === ielem.editSkuCheckAmount){
              baoFactData.splice(indOne, 1);
            }else{
              ielem.overAmount -= ielem.editSkuCheckAmount
              ielem.editSkuCheckAmount = ielem.overAmount
              ielem.editSkuPickWeight = ielem.overAmount * ielem.skuWeight
            }
            return false;
          }
        });
      }

      self.totalWeightBlur(self.baoDisList[len]);
    },
    //包号数量改变
    baoNumFun() {
      let self = this;
      var returnTxt = false;
      let baoAmountNum = 0;
      let skuWeightNum = 0;
      let pickWeightNum = 0;
      self.baoDisList.forEach(ielem => {
        if (ielem.baoStatue == "N") {
          if (ielem.pickSkus) {
            ielem.pickSkus.forEach(jelem => {
              baoAmountNum += parseFloat(jelem.editSkuCheckAmount);
              skuWeightNum += parseFloat(jelem.skuWeight);
              pickWeightNum += parseFloat(jelem.editSkuPickWeight);
            });
          }

          ielem.baoAmount = baoAmountNum;
          ielem.baoWeight = skuWeightNum;
          ielem.baoStockWeight = pickWeightNum;
          ielem.baoWeight = pickWeightNum;
          returnTxt = true;
        }
      });
      return returnTxt;
    },
    //无分包确认打包
    confirmBaoOne(elem) {
      let self = this;
      self.btnLoadingTF = true;
      if (elem.baoAmount == 0) {
        self.btnLoadingTF = false;
        self.$message.error("此包暂无产品，不能确认打包操作！");
        return false;
      }
      let pickSkusList = [];
      elem.pickSkus.forEach((ielem, indOne) => {
        pickSkusList.push({
          pickSkuId: ielem.pickSkuId,
          skuCheckWeight: ielem.editSkuPickWeight,
          skuCheckAmount: ielem.editSkuCheckAmount
        });
      });
      let endBaoTxt = self.baoDisListTwo.length == 0 ? "Y" : "N"
      if(self.displayTab === 'baoThree'){
        endBaoTxt = this.baoFactData.pickSkus.length == 0 ? "Y" : "N"
      }

      // self.btnLoadingTF = false;

      // console.log(self.baoAlldata[self.baoFactInd],self.baoAlldata)
      let params = {
        pickId: this.pickId,
        totalWeight: elem.baoWeight,
        baoId: elem.baoId,
        endBao: endBaoTxt,
        shopId: self.baoAlldata[self.baoFactInd].shopId?self.baoAlldata[self.baoFactInd].shopId:"",
        pickSkus: JSON.stringify(pickSkusList),
        baoDifferenceWeight: elem.baoDifferenceWeight
          ? elem.baoDifferenceWeight
          : "",
        note: elem.note ? elem.note : ""
      };
      
      this.$api.formdataPostFun(
        self.$portMain + "/pick/order/ConfirmCheckPickBao",
        params,
        res => {
          self.$message.success("确认打包成功，正在刷新！");
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

    printTabOneFun(elem) {
      let self = this;
      this.printData = {
        baoNo: elem.baoCode,
        customerName: elem.baoCustomerName,
        nowSkuWeight: elem.baoWeight,
        nowSkuGoldWeight: elem.baoStockWeight,
        sum: elem.baoAmount
      };
      this.$refs.printTPThree.compPrintFun();

    },

    //无分包确认打包
    confirmBaoTwo(elem) {
      let self = this;
      if (elem.baoAmount == 0) {
        self.$message.error("此包暂无产品，不能确认打包操作！");
        self.btnLoadingTF = false;
        return false;
      }
      let pickSkusList = [];
      elem.pickSkus.forEach((ielem, indOne) => {
        pickSkusList.push({
          pickSkuId: ielem.pickSkuId,
          skuCheckWeight: ielem.editSkuPickWeight,
          skuCheckAmount: ielem.editSkuCheckAmount
        });
      });
      let params = {
        pickId: this.pickId,
        totalWeight: elem.baoStockWeight,
        baoId: elem.baoId,
        endBao: self.baoDisListTwo.length == 0 ? "Y" : "N",
        shopId: self.baoAlldata[self.baoFactInd].shopId
          ? self.baoAlldata[self.baoFactInd].shopId
          : "",
        pickSkus: JSON.stringify(pickSkusList),
        baoDifferenceWeight: elem.baoDifferenceWeight
          ? elem.baoDifferenceWeight
          : "",
        note: elem.note ? elem.note : ""
      };
      this.$api.formdataPostFun(
        self.$portMain + "/pick/order/ConfirmCheckPickBao",
        params,
        res => {
          self.$message.success("确认打包成功，正在刷新！");
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
    //切换店铺
    changeFactFun() {
      this.baoFactList.forEach(item => {
        if (this.baoFactInd == item.index) {
          if (item.JBao) {
            this.baoDisList = item.JBao?item.JBao:[];
            this.baoFactData = item;
            let realShopAmount = 0;
            let shopPickWeight = 0;
            item.JBao.forEach(ielem => {
              realShopAmount += ielem.baoAmount;
              shopPickWeight += ielem.baoStockWeight;
            });
            item.pickSkus.forEach(jelem => {
              realShopAmount += jelem.editSkuCheckAmount;
              shopPickWeight += jelem.editSkuPickWeight;
            });
            this.baoFactData.realShopAmount = realShopAmount;
            this.baoFactData.shopPickWeight = shopPickWeight;
          } else {
            this.baoDisList = [];
          }

          // this.baoFactList = item;
        }
      });
    },
    //添加和查询备注
    addNote(elem) {
      this.noteTxt = "";
      this.noteItem = elem;
      this.noteTxt = elem.note ? elem.note : "";
      this.addNoteTF = true;
    },
    //保存备注事件
    editNote(elem) {
      this.noteItem.note = this.noteTxt;
      this.addNoteTF = false;
      this.$forceUpdate();
    },
    viewNote(elem) {
      this.noteTxt = "";
      this.noteItem = elem;
      this.noteTxt = elem.note ? elem.note : "";
      this.viewNoteTF = true;
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
    margin: 14px 0 14px 0;
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
    font-size: 14px;
    color: #999;
  }

  .pro-bottom {
    margin: 10px 0;
    font-size: 14px;
    line-height: 14px;
    color: #333;
  }

  .iitem-right {
    min-width: 0%;
    flex: 1;
    min-height: 146px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
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

  .txtTwo {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .greenTxt {
    margin-left: 20px;
    color: #1FC45B;
  }

  .yellowTxt {
    color: #F26D0F;
  }

  .blackTxt {
    color: #232426;
  }

  .blackTxtBold {
    color: #232426;
    font-weight: bold;
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
    width: 90px;
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
          font-size: 14px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }

        .pro-weight {
          font-size: 14px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }
      }
    }
  }

  .titOne {
    padding: 5px 10px;
    border: 1px solid #ccc;
    margin: 10px;
    background: #fff;
    margin-bottom: 0;
    font-size: 16px;

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
    background: #FAFAFA;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    min-width: 990px;

    .titTwoBao {
      background: #F5F5F5;
      font-size: 14px;
      color: #8A8E99;
      border: 1px solid #CCCCCC;
      margin: 10px 0;
      line-height: 47px;
      padding: 0 10px;
      min-height: 47px;
      min-width: 990px;
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

  .info-item-wrap {
    margin-bottom: 20px;
  }

  .txtFive {
    font-size: 14px;
    color: #999;
  }
}
</style>
