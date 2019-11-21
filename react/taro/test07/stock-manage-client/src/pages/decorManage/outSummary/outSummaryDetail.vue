<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>出饰单列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{BillTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>

      <div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="outstoreCode" label="出库单号" width="180"></el-table-column>
          <el-table-column label="接收单位" prop="customerName"></el-table-column>
          <el-table-column label="发起单位">
            <template slot-scope="scope">
              <span>尚金缘金库</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="receCode" label="调拨单号"></el-table-column> -->
          <!-- <el-table-column prop="orderCode" label="工单号"></el-table-column> -->
          <!-- <el-table-column prop="factoryName" label="工厂名称"></el-table-column> -->
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="weight" label="毛重(g)"></el-table-column>
          <el-table-column prop="stockWeight" label="净重(g)"></el-table-column>
          <el-table-column prop="createPersonName" label="操作人"></el-table-column>
          <el-table-column prop="createTime" label="制单日期"></el-table-column>
          <el-table-column prop label="订单状态" width="100">
            <template slot-scope="scope">
              <span>已完成</span>
              <!-- <span v-if="scope.row.billStatue == 'Y' || scope.row.billStatue == 'D'">已完成</span> -->
              <!-- <span v-else-if="scope.row.billStatue == 'N'">待确认</span>
              <span v-else-if="scope.row.billStatue == 'T'">已驳回</span>-->
              <!-- <span v-else-if="scope.row.billStatue == 'D'">待复检</span> -->
              <!-- <span v-else>--</span> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bigLine"></div>
    </div>

    <div style="text-align:right;margin-top:18px;">
      <!-- <el-button plain type="primary" size="small">红冲</el-button> -->
      <el-button
        size="small"
        type="primary"
        v-show="BillState == 'allocation'"
        @click="allocationPrint"
      >打印</el-button>
      <el-button
        size="small"
        type="primary"
        v-show="BillState == 'customer' || BillState == 'factory'"
        @click="decorationPrint"
      >打印</el-button>
    </div>

    <!-- 调拨 -->
    <div class="tableDetailWrapOne" v-show="BillState == 'allocation'">
      <div class="billWrap">
        <el-row>
          <el-col :span="8" class="billItem">
            <div>
              出库单号：
              <span>{{orderAllData.outstoreCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              接收单位：
              <span>{{orderAllData.customerName}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              备注：
              <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              发起单位：
              <span>尚金缘金库</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              制单人：
              <span>{{orderAllData.createPersonName}}</span>
            </div>
          </el-col>

          <!-- <el-col :span="8" class="billItem">
            <div>
              调拨原因：
              <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
            </div>
          </el-col>-->
        </el-row>
      </div>
      <el-table
        :data="tableDetail"
        border
        show-summary
        :summary-method="getSummariesOne"
        :header-cell-style="{background:'#f5f7fa'}"
        style="width: 100%;"
      >
        <el-table-column header-align="center" align="center" prop="species" label="种类"></el-table-column>
        <el-table-column header-align="center" align="center" prop="category" label="营销品类"></el-table-column>
        <el-table-column header-align="center" align="center" prop="purWeight" label="毛重(g)"></el-table-column>
        <el-table-column header-align="center" align="center" prop="weight" label="净重(g)"></el-table-column>
        <el-table-column header-align="center" align="center" prop="purity" label="成色"></el-table-column>
        <el-table-column header-align="center" align="center" prop="suttleWeight" label="折重(g)"></el-table-column>
        <el-table-column header-align="center" align="center" prop="priceG" label="单价/克"></el-table-column>
        <el-table-column header-align="center" align="center" prop="sum" label="数量"></el-table-column>
        <el-table-column header-align="center" align="center" prop="priceJ" label="单价/件"></el-table-column>
        <el-table-column header-align="center" align="center" prop="money" label="金额(￥)"></el-table-column>
        <el-table-column header-align="center" align="center" prop="remark" label="备注"></el-table-column>
      </el-table>
    </div>

    <!--出饰 -->
    <div class="tableDetailWrapTwo" v-show="BillState == 'customer' || BillState == 'factory'">
      <div class="billDetail">
        <!-- 出工厂饰 -->
        <el-row v-show="BillState == 'factory'">
          <el-col :span="8" class="billItem">
            <div>
              出库单号：
              <span>{{orderAllData.outstoreCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              制单人：
              <span>{{orderAllData.createPersonName}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              备注：
              <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              接收单位：
              <span>{{orderAllData.customerName}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              发起单位：
              <span>尚金缘金库</span>
            </div>
          </el-col>

          <!-- <el-col :span="8" class="billItem">
            <div>
              调拨原因：
              <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
            </div>
          </el-col>-->
        </el-row>
        <!-- 出客户饰 -->
        <el-row v-show="BillState == 'customer'">
          <el-col :span="8" class="billItem">
            <div>
              出库单号：
              <span>{{orderAllData.outstoreCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              制单人：
              <span>{{orderAllData.createPersonName}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              备注：
              <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              接收单位：
              <span>{{orderAllData.customerName}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              发起单位：
              <span>尚金缘金库</span>
            </div>
          </el-col>

          <!-- <el-col :span="8" class="billItem">
            <div>
              调拨原因：
              <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
            </div>
          </el-col>-->
        </el-row>
      </div>
      <div class="tableWrap">
        <div class="leftWrap">
          <div class="tableTitle">出货明细</div>
          <el-table
            :data="tableDetailOne"
            show-summary
            :summary-method="getSummaries"
            border
            :header-cell-style="{background:'#f5f7fa'}"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              header-align="center"
              align="center"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="sku_product_type"
              label="种类"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="marketing_type"
              label="营销品类"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="sku_check_weight"
              label="重量(g)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table>
        </div>

        <div class="rightWrap">
          <div class="tableTitle">账款明细</div>
          <el-table
            :data="tableDetailTwo"
            show-summary
            :summary-method="getSummariesThree"
            border
            :header-cell-style="{background:'#f5f7fa'}"
            style="width: 100%"
          >
            <el-table-column prop="ceditWayName" align="center" label="结费方式" width="100"></el-table-column>
            <el-table-column prop="ceditProject" align="center" label="项目" width="110"></el-table-column>
            <el-table-column prop="ceditWeight" align="center" label="重量(g)"></el-table-column>
            <el-table-column prop="ceditPriceG" align="center" label="单价/克"></el-table-column>
            <el-table-column prop="ceditAmount" align="center" label="数量"></el-table-column>
            <el-table-column prop="ceditPriceJ" align="center" label="单价/件"></el-table-column>
            <el-table-column prop="ceditMoney" align="center" label="金额(￥)"></el-table-column>
            <el-table-column prop="ceditNote" align="center" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 打包信息 -->
    <div
      class="ULWrap"
      v-if="orderAllData.jBaos.length != 0 && orderAllData.jBaos[0].baoCode != ''"
    >
      <div class="titleWrap">
        <div class="title">打包信息</div>
        <div class="shopSelect" v-if="pickShops.length > 0">
          <span>店铺：</span>
          <el-select
            v-model="shopId"
            placeholder="请选择"
            size="small"
            @change="selectShop"
            style="width: 240px;"
          >
            <el-option
              v-for="item in pickShops"
              :key="item.shopId"
              :label="item.shopName"
              :value="item.shopId"
            ></el-option>
          </el-select>
        </div>
      </div>

      <!-- 无店铺 -->
      <div
        class="LiWrap"
        v-for="(item,index) in orderAllData.jBaos"
        :key="index"
        @click="getProduct(item.baoId,index)"
        v-show="pickShops.length == 0"
      >
        <div style="flex:2">
          <span class="liLeft">包号</span>
          <span>{{item.baoCode}}</span>
        </div>

        <div style="flex:3">
          <span class="liLeft">客户名称</span>
          <span>{{orderAllData.customerName?orderAllData.customerName:'--'}}</span>
        </div>
        <div style="flex:2">
          <span class="liLeft">订单编号</span>
          <span>{{orderAllData.orderCode?orderAllData.orderCode:'--'}}</span>
        </div>
        <div>
          <span class="liLeft">数量</span>
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
          <span class="liLeft">复核毛重</span>
          <span>{{item.baoOutstorePurWeight?item.baoOutstorePurWeight:'-'}}</span>
        </div>
        <!-- <div @click.stop="stopInput" v-if="orderAllData.billStatue == 'N'" style="flex:3">
          <span class="liLeft">入库毛重</span>

          <el-input-number
            v-model="item.enterWeight"
            placeholder="请输入"
            size="small"
            style="width:80px;"
            :controls="false"
            :min="0"
          ></el-input-number>
        </div>-->
      </div>

      <!-- 有店铺 -->
      <div
        class="LiWrap"
        v-for="(item,index) in shopJBos"
        :key="item.baoId"
        @click="getProduct(item.baoId,index)"
        v-show="pickShops.length !== 0"
      >
        <div style="flex:2">
          <span class="liLeft">包号</span>
          <span>{{item.baoCode}}</span>
        </div>

        <div style="flex:3">
          <span class="liLeft">客户名称</span>
          <span>{{orderAllData.customerName?orderAllData.customerName:'--'}}</span>
        </div>
        <div style="flex:2">
          <span class="liLeft">订单编号</span>
          <span>{{orderAllData.orderCode?orderAllData.orderCode:'--'}}</span>
        </div>
        <div>
          <span class="liLeft">数量</span>
          <span>{{item.baoAmount}}</span>
        </div>
        <div>
          <span class="liLeft">净重</span>
          <span>{{item.baoStockWeight}}</span>
        </div>
        <div>
          <span class="liLeft">毛重</span>
          <span>{{item.comfirmPurWeight}}</span>
        </div>
        <div>
          <span class="liLeft">复核毛重</span>
          <span>{{item.baoOutstorePurWeight?item.baoOutstorePurWeight:'-'}}</span>
        </div>
        <!-- <div @click.stop="stopInput" v-if="orderAllData.billStatue == 'N'" style="flex:3">
          <span class="liLeft">入库毛重</span>

          <el-input-number
            v-model="item.enterWeight"
            placeholder="请输入"
            size="small"
            style="width:80px;"
            :controls="false"
            :min="0"
          ></el-input-number>
        </div>-->
      </div>
    </div>

    <div class="container">
      <div v-for="(itemOne,indexOne) in modifyData" :key="indexOne">
        <div class="titel">产品类别：{{itemOne.label}}</div>
        <div v-for="(item,index) in itemOne.value" :key="index">
          <!-- <div class="itemTitle">SKU明细</div> -->
          <!-- <div class="titel">产品类别：吊坠</div> -->
          <div class="wrap">
            <div class="productWarp">
              <img
                v-if="item.pickSkuProp.skuPic"
                :src="$portImg+item.pickSkuProp.skuPic"
                class="productPic"
              >
              <img v-else src="../../../../static/images/img-noimg.png" class="productPic">
              <div class="productDes">
                <div class="proUL">
                  <div class="proTitel">{{item.pickSkuProp.skuName}}</div>
                  <div class="proLI">
                    <span class="left">编号：</span>
                    <span class="right">{{item.skuId}}</span>
                  </div>

                  <div class="proLI" v-if="item.pickSkuProp.Weight">
                    <span class="left">克重：</span>
                    <span class="right">{{item.pickSkuProp.Weight}}g</span>
                  </div>
                </div>

                <!-- 完成 -->
                <div class="proUL">
                  <div class="proLI" v-if="item.pickSkuProp.colorFormer">
                    <span class="left">产品成色：</span>
                    <span class="right">{{item.pickSkuProp.colorFormer}}</span>
                  </div>

                  <div
                    class="proLI"
                    v-if="item.pickSkuProp.texTure && (item.pickSkuProp.productType != '套装')"
                  >
                    <span class="left">产品材质：</span>
                    <span class="right">{{item.pickSkuProp.texTure}}</span>
                  </div>

                  <div
                    class="proLI"
                    v-if="item.pickSkuProp.manufacturingTechnique && (item.pickSkuProp.productType != '套装')"
                  >
                    <span class="left">生产工艺：</span>
                    <span class="right">{{item.pickSkuProp.manufacturingTechnique}}</span>
                  </div>
                </div>

                <div class="proUL">
                  <div class="proLI" v-if="item.skuCheckAmount">
                    <span class="left">调拨数量：</span>
                    <span class="right">{{item.skuCheckAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.skuCheckWeight">
                    <span class="left">调拨重量（g）：</span>
                    <span class="right">{{item.skuCheckWeight}}</span>
                  </div>
                </div>

                <!-- <div class="proUL">
                  <div class="proLI">
                    <span class="left">拣货数量：</span>
                    <span class="right">{{orderAllData.realAmount?orderAllData.realAmount:0}}</span>
                  </div>

                  <div class="proLI">
                    <span class="left">毛重（g）：</span>
                    <span class="right">{{orderAllData.realWeight?orderAllData.realWeight:0}}g</span>
                  </div>
                  <div class="proLI">
                    <span class="left">净重（g）：</span>
                    <span class="right">{{item.firstConfirmWeight?item.firstConfirmWeight:0}}g</span>
                  </div>
                </div>-->

                <div
                  class="suitType"
                  v-if="item.pickSkuProp.productType == '套装'"
                  @click="suitClick(item,index)"
                >
                  套装详情
                  <i class="el-icon-arrow-down" v-if="!item.suitStatu"></i>
                  <i class="el-icon-arrow-up" v-if="item.suitStatu"></i>
                </div>
              </div>
            </div>

            <!-- 套装数据 -->
            <div class="suitwrrap" v-if="item.pickSkuProp.productType == '套装' && item.suitStatu">
              <div
                class="itemWrap"
                v-for="(project, num) in item.pickSkuProp.map.proList"
                :key="num"
              >
                <img v-if="project.pic" :src="$portImg+project.pic" class="productPic">
                <img v-else src="../../../../static/images/img-noimg.png" class="productPic">
                <div class="proUL">
                  <div class="proTitel">{{project.name}}</div>
                  <div class="proLI">
                    <span class="left">编号：</span>
                    <span class="right" style="color:#889199">{{project.factoryNumber}}</span>
                  </div>

                  <div class="proLI">
                    <span
                      class="right"
                      style="color:#889199"
                    >{{project.processCode}}{{project.effect?'，'+project.effect:''}}{{project.theme?'，'+project.theme:''}}</span>
                  </div>

                  <div class="proLI" v-if="project.weight">
                    <span class="left">克重：</span>
                    <span class="right" style="color:#889199">{{project.weight}}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <el-row class="titTwoBao" v-if="pickShops.length == 0">
            <el-col :span="3">包号:{{orderAllData.jBaos[productIndex].baoCode}}</el-col>
            <el-col :span="2">总数量：{{orderAllData.jBaos[productIndex].baoAmount}}</el-col>
            <el-col :span="2">毛重：{{orderAllData.jBaos[productIndex].baoWeight}}</el-col>
            <el-col :span="2">净重：{{orderAllData.jBaos[productIndex].baoStockWeight}}</el-col>
            <el-col :span="6">客户名称：{{orderAllData.jBaos[productIndex].baoCustomerName}}</el-col>
            <el-col :span="4">订单编号：{{orderAllData.jBaos[productIndex].baoOrderCode}}</el-col>
          </el-row>

          <el-row class="titTwoBao" v-else-if="pickShops.length !== 0">
            <el-col :span="3">包号:{{shopJBos[productIndex].baoCode}}</el-col>
            <el-col :span="2">总数量：{{shopJBos[productIndex].baoAmount}}</el-col>
            <el-col :span="2">毛重：{{shopJBos[productIndex].baoWeight}}</el-col>
            <el-col :span="2">净重：{{shopJBos[productIndex].baoStockWeight}}</el-col>
            <el-col :span="6">客户名称：{{shopJBos[productIndex].baoCustomerName}}</el-col>
            <el-col :span="4">订单编号：{{shopJBos[productIndex].baoOrderCode}}</el-col>
          </el-row>
        </div>
        <div>
          <div class="info-item-wrap">
            <!-- 单品start -->
            <div class="infom-info" v-for="(item,ind) in packageData" :key="ind">
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
                        v-if="item.pickSkuProp.productType != '套装'"
                        :span="12"
                        class="pro-middle"
                      >表面工艺：{{item.pickSkuProp.surfaceTechnics}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" class="pro-middle">产品类别：{{item.pickSkuProp.productType}}</el-col>
                      <el-col
                        v-if="item.pickSkuProp.productType != '套装'"
                        :span="6"
                        class="pro-middle"
                      >生产工艺：{{item.pickSkuProp.manufacturingTechnique}}</el-col>
                      <el-col
                        v-if="item.pickSkuProp.productType != '套装'"
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
                            <b
                              v-if="ielem.extendAttr && ielem.one"
                              v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"
                            ></b>&nbsp;
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
    <!-- 打印调拨单 -->
    <div v-show="false">
      <PrintTPFour :billData="allocationAllData" ref="myCompAllocation"></PrintTPFour>
    </div>
    <!-- 打印出饰单 -->
    <div v-show="false">
      <PrintTPOne :billData="decorationAllData" ref="myCompDecoration"></PrintTPOne>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allocationAllData: {}, //调拨单打印
      decorationAllData: {}, //出饰单打印
      shopId: "", //店铺id
      productIndex: 0, //选中产品下标(没店铺)
      loadingState: false,
      tableDetail: [], //调拨表格明细
      tableDetailOne: [], //出货明细
      tableDetailTwo: [], //账款明细
      noPackageData: [], //没打包数据
      modifyData: [], //组装的数据
      packageData: [], //包弹框数据
      viewBaoTF: false, //点击包弹框
      BillState: "", //单据状态
      BillTitle: "", //单据标题
      pickShops: [], //店铺数据
      shopJBos: [
        //店铺包的数据
        {
          baoCode: "",
          baoAmount: "",
          baoWeight: "",
          baoStockWeight: "",
          baoCustomerName: "",
          baoOrderCode: ""
        }
      ],
      orderAllData: {
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
      orderTable: [],
      receivId: "",
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
      // let self = this;
      this.receivId = this.$route.query.receivId;
      this.BillState = this.$route.query.BillState;
      this.dillTitleFun();
      this.getOrderDetail();
    },

    dillTitleFun() {
      if (this.BillState == "allocation") {
        this.BillTitle = "调拨出库单详情";
      } else if (this.BillState == "customer") {
        this.BillTitle = "出客户饰单详情";
      } else if (this.BillState == "factory") {
        this.BillTitle = "出工厂饰单详情";
      }
    },
    //订单详情
    getOrderDetail() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          outstoreId: this.receivId
        }
      };
      this.$axios
        .get(this.$portMain + "/outstore/getSpotOutstore", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderAllData = res.data.data;
            if (self.orderAllData.jBaos == undefined) {
              self.orderAllData.jBaos = [
                {
                  baoCode: "",
                  baoAmount: "",
                  baoWeight: "",
                  baoStockWeight: "",
                  baoCustomerName: "",
                  baoOrderCode: ""
                }
              ];
            }
            self.orderTable.push(self.orderAllData);
            self.orderTable.forEach(item => {
              item.createTime = self.$api.dateGetDayTime(item.createTime);
            });

            if (self.orderAllData.pickSkus != undefined) {
              self.noPackageData = self.orderAllData.pickSkus;
              self.modifierData(self.noPackageData);
            }

            if (res.data.data.transferSlips != undefined) {
              self.tableDetail = res.data.data.transferSlips;
            } else if (
              res.data.data.skuCeditGroups != undefined ||
              res.data.data.outstoreCedits != undefined
            ) {
              self.tableDetailOne = res.data.data.skuCeditGroups;
              self.tableDetailTwo = res.data.data.outstoreCedits;

              // if (
              //   res.data.data.skuCeditGroups.length >
              //   res.data.data.outstoreCedits.length
              // ) {
              //   res.data.data.skuCeditGroups.forEach((item, index) => {
              //     let obj = Object.assign(
              //       item,
              //       res.data.data.outstoreCedits[index]
              //     );
              //     self.tableDetail.push(obj);
              //   });
              // }
            } else {
              self.tableDetail = [];
              self.tableDetailOne = [];
              self.tableDetailTwo = [];
            }
            //组装店铺数据pickShops
            if (
              self.orderAllData.orderType == "_spot" &&
              self.orderAllData.pickShops != undefined
            ) {
              self.pickShops = self.orderAllData.pickShops;
              if (self.orderAllData.jBaos != undefined) {
                self.orderAllData.jBaos.forEach(item => {
                  let JBao = [item];
                  let shop = {
                    shopId: item.baoCode,
                    shopName: item.baoCustomerName,
                    JBao
                  };
                  self.pickShops.unshift(shop);
                });
              }

              self.shopId = self.pickShops[0].shopId;
              self.shopJBos = self.pickShops[0].JBao;
            }

            self.loadingState = false;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    //选择店铺
    selectShop(shopId) {
      let self = this;
      self.shopJBos = [];
      this.pickShops.forEach(item => {
        if (item.shopId == shopId) {
          self.shopJBos = item.JBao;
        }
      });
    },

    //按照产品类别分类
    modifierData(elem) {
      let labelData = [];
      let packetData = [];
      elem.forEach(item => {
        let res = labelData.includes(item.pickSkuProp.productType);
        if (!res) {
          labelData.push(item.pickSkuProp.productType);
        }
      });

      labelData.forEach(item => {
        packetData.push({
          label: item,
          value: []
        });
      });

      elem.forEach(item => {
        packetData.forEach(one => {
          if (item.pickSkuProp.productType == one.label) {
            one.value.push(item);
          }
        });
      });

      this.modifyData = packetData;
    },

    //查询包产品数据
    // getProduct(elem) {
    //   this.packageData = elem;
    //   this.viewBaoTF = true;
    // },

    //查询包产品数据
    getProduct(baoId, index) {
      let self = this;
      let params = {
        outstoreId: this.receivId,
        baoId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/selectSkuBaoByExhibit",
        params,
        res => {
          self.packageData = res.data;
          self.viewBaoTF = true;
          self.productIndex = index;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //展开包详情
    suitClick(elem, index) {
      elem.suitStatu = !elem.suitStatu;
      this.$forceUpdate();
    },

    //打包毛重事件
    stopInput() {
      //
    },

    //表格1底部数据统计
    getSummariesOne(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "毛重(g)" ||
          column.label === "净重(g)" ||
          column.label === "折重(g)" ||
          column.label === "金额(￥)"
        ) {
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

    //表格2底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "重量(g)") {
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
    //表格3底部数据统计
    getSummariesThree(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "金额(￥)") {
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
    //打印调拨
    allocationPrint() {
      let self = this;
      let orderAllData = JSON.parse(JSON.stringify(self.orderAllData));
      this.allocationAllData = orderAllData;
      this.allocationAllData.sponsorUnit = "尚金缘金库";
      this.$refs.myCompAllocation.compPrintFun();
    },
    //打印出饰
    decorationPrint() {
      let self = this;
      let orderAllData = JSON.parse(JSON.stringify(self.orderAllData));
      this.decorationAllData = orderAllData;
      this.decorationAllData.sponsorUnit = "尚金缘金库";
      this.$refs.myCompDecoration.compPrintFun();
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

  .bigLine {
    height: 16px;
    background: #e6ebf5;
  }

  .stepWrap {
    margin-top: 38px;
  }

  .container {
    padding-top: 24px;

    .titel {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(35, 36, 38, 1);
      margin-bottom: 8px;
    }

    .itemTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(46, 47, 51, 1);
      margin-bottom: 8px;
    }

    .wrap {
      border: 1px solid rgba(229, 241, 255, 1);
      padding: 16px 24px 14px 24px;
      background: rgba(255, 255, 255, 1);
      margin-bottom: 20px;
    }

    .productWarp {
      // width: 1px;
      height: 120px;
      background: rgba(255, 255, 255, 1);
      // border: 1px solid rgba(229, 241, 255, 1);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;

      .suitType {
        position: absolute;
        bottom: 25px;
        right: 0;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(242, 15, 52, 1);
        cursor: pointer;
      }

      // padding: 16px 24px 14px 24px;

      // margin-bottom: 8px;
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
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .proUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          // margin-right: 224px;
          width: 18%;
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

          .setLeft {
            display: inline-block;
            width: 110px;
            text-align: right;
          }

          .left {
            color: #889199;
          }

          .right {
          }
        }
      }
    }

    .suitwrrap {
      background: rgba(255, 255, 255, 1);
      border-top: 1px dashed rgba(229, 241, 255, 1);
      box-sizing: border-box;
      // padding: 16px 24px 14px 24px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 16px;

      .itemWrap {
        width: 50%;
        display: flex;
        margin-bottom: 16px;

        .productPic {
          width: 120px;
          height: 90px;
        }

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
          margin-left: 16px;
          width: 28%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .proLI {
          margin-bottom: 11px;

          .setLeft {
            display: inline-block;
            width: 110px;
            text-align: right;
          }

          .left {
            color: #889199;
          }

          .right {
          }
        }
      }
    }
  }

  .ULWrap {
    margin-top: 32px;
    margin-bottom: 50px;

    .titleWrap {
      margin-bottom: 8px;
      display: flex;
      align-items: center;

      .title {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(35, 36, 38, 1);
      }

      .shopSelect {
        margin-left: 19%;
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

  .tableDetailWrapOne {
    padding-top: 20px;

    .billWrap {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8A8E99;
      margin-bottom: 16px;

      .billItem {
        margin-bottom: 19px;
      }

      div {
        flex: 1;

        span {
          color: #222426;
        }
      }
    }
  }

  .tableDetailWrapTwo {
    .billDetail {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8A8E99;
      margin-bottom: 16px;

      .billItem {
        margin-bottom: 19px;
      }

      div {
        flex: 1;

        span {
          color: #222426;
        }
      }
    }

    .tableWrap {
      display: flex;

      .tableTitle {
        text-align: center;
        height: 48px;
        line-height: 48px;
        background: #f5f7fa;
        border: 1px solid #e6ebf5;
        border-bottom: 0px;
      }

      .leftWrap {
        width: 30%;
      }

      .rightWrap {
        width: 70%;
      }
    }
  }
}
</style>

<style>
.outOfStock .tableDetailWrapTwo .el-table__empty-block {
  min-height: 49px;
}
</style>



