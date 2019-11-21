<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>展厅</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库列表</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>

      <div>
        <div style="text-align: right;margin-bottom: 20px;" v-if="orderAllData.billStatue == 'D'">
          <el-button size="small" type="primary" @click="confirmFun">提交上柜</el-button>
        </div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop label="发起单位" width="180">
            <template slot-scope="scope">
              <span>尚金缘金库</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderCode" label="调拨单号"></el-table-column>
          <el-table-column prop label="接收单位">
            <template slot-scope="scope">
              <span>尚金缘展厅</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="weight" label="毛重(g)"></el-table-column>
          <el-table-column prop="stockWeight" label="净重(g)"></el-table-column>
          <el-table-column prop="createPersonName" label="操作人"></el-table-column>
          <el-table-column prop="orderTime" label="制单时间"></el-table-column>
          <el-table-column prop label="红冲" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.billStatue == 'Y'">红冲</span>
              <!-- <span v-else-if="scope.row.billStatue == 'N'">待确认</span>
              <span v-else-if="scope.row.billStatue == 'T'">已驳回</span>-->
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="24" class="itemRight">
          <!-- <el-button type="danger" size="small" plain>红冲</el-button> -->
          <el-button type="primary" size="small" @click="allocationPrint">打印</el-button>
        </el-col>
      </el-row>

      <el-row class="itemFirst">
        <el-col :span="5">
          <div>
            <span>调拨单号：</span>
            <span>{{orderAllData.orderCode}}</span>
          </div>
        </el-col>

        <el-col :span="5">
          <div>
            <span>接收单位：</span>
            <span>尚金缘展厅</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div>
            <span>发起单位：</span>
            <span>尚金缘金库</span>
          </div>
        </el-col>
        <!-- <el-col :span="5">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注：</span>
            <span>--</span>
          </div>
        </el-col>-->
      </el-row>
      <el-row class="itemFirst" style="margin-top:0px" v-if="orderAllData.note">
        <el-col :span="24">
          <div>
            <span>调拨原因：</span>
            <span>{{orderAllData.note?orderAllData.note:'--'}}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="orderAllData.transferSlips"
      border
      show-summary
      :summary-method="getSummaries"
      :header-cell-style="{background:'#f5f7fa'}"
      style="width: 100%;margin-bottom:'50px'"
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
      <el-table-column header-align="center" align="center" prop label="备注" width="400"></el-table-column>
    </el-table>

    <div class="ULWrap" v-if="orderAllData.jBaos.length != 0">
      <div class="title">打包信息</div>
      <div
        class="LiWrap"
        v-for="(item,index) in orderAllData.jBaos"
        :key="index"
        @click="getProduct(item)"
      >
        <div style="flex:2">
          <span class="liLeft">包号</span>
          <span>{{item.baoCode}}</span>
        </div>

        <!-- <div style="flex:2">
          <span class="liLeft">客户名称</span>
          <span>{{orderAllData.customerName}}</span>
        </div>-->
        <div style="flex:2">
          <span class="liLeft">调拨单号</span>
          <span>{{ item.baoOrderCode }}</span>
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
                <div class="proUL" v-if="orderAllData.billStatue == 'Y'">
                  <div class="proLI" v-if="item.pickSkuProp.colorFormer">
                    <span class="left">产品成色：</span>
                    <span class="right">{{item.pickSkuProp.colorFormer}}</span>
                  </div>

                  <div class="proLI" v-if="item.pickSkuProp.texTure">
                    <span class="left">产品材质：</span>
                    <span class="right">{{item.pickSkuProp.texTure}}</span>
                  </div>

                  <div class="proLI" v-if="item.pickSkuProp.manufacturingTechnique">
                    <span class="left">生产工艺：</span>
                    <span class="right">{{item.pickSkuProp.manufacturingTechnique}}</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'Y'">
                  <div class="proLI" v-if="item.pickSkuProp.productType">
                    <span class="left">产品类别：</span>
                    <span class="right">{{item.pickSkuProp.productType}}</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'Y'">
                  <div class="proLI" v-if="item.skuRealAmount">
                    <span class="left">实收数量-物流：</span>
                    <span class="right">{{item.skuRealAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.skuRealWeight">
                    <span class="left">实收毛重-物流：</span>
                    <span class="right">{{item.skuRealWeight}}g</span>
                  </div>
                  <div class="proLI" v-if="item.skuRealGoldWeight">
                    <span class="left">实收净重-物流：</span>
                    <span class="right">{{item.skuRealGoldWeight}}g</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'Y'">
                  <div class="proLI" v-if="item.secondConfirmAmount">
                    <span class="left">实收数量-金库：</span>
                    <span class="right">{{item.secondConfirmAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.secondConfirmWeight">
                    <span class="left">实收毛重-金库：</span>
                    <span class="right">{{item.secondConfirmWeight}}g</span>
                  </div>
                  <div class="proLI" v-if="item.secondConfirmGoldWeight">
                    <span class="left">实收净重-金库：</span>
                    <span class="right">{{item.secondConfirmGoldWeight}}g</span>
                  </div>
                </div>

                <!-- 待审核 -->
                <div class="proUL" v-if="orderAllData.billStatue == 'D'">
                  <div class="proLI" v-if="item.pickSkuProp.colorFormer">
                    <span class="left">产品成色：</span>
                    <span class="right">{{item.pickSkuProp.colorFormer}}</span>
                  </div>

                  <div class="proLI" v-if="item.pickSkuProp.texTure">
                    <span class="left">产品材质：</span>
                    <span class="right">{{item.pickSkuProp.texTure}}</span>
                  </div>

                  <div class="proLI" v-if="item.pickSkuProp.manufacturingTechnique">
                    <span class="left">生产工艺：</span>
                    <span class="right">{{item.pickSkuProp.manufacturingTechnique}}</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'D'">
                  <div class="proLI" v-if="item.pickSkuProp.productType">
                    <span class="left">产品类别：</span>
                    <span class="right">{{item.pickSkuProp.productType}}</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'D'">
                  <div class="proLI" v-if="item.skuRealAmount">
                    <span class="left">实收数量-物流：</span>
                    <span class="right">{{item.skuRealAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.skuRealWeight">
                    <span class="left">实收毛重-物流：</span>
                    <span class="right">{{item.skuRealWeight}}g</span>
                  </div>

                  <div class="proLI" v-if="item.skuRealGoldWeight">
                    <span class="left">实收净重-物流：</span>
                    <span class="right">{{item.skuRealGoldWeight}}g</span>
                  </div>
                </div>

                <div class="SUKUL" v-if="orderAllData.billStatue == 'D'">
                  <div class="proLI" style="margin-bottom: 5px;">
                    <span class="left setLeft">实收数量-金库：</span>
                    <el-input-number
                      v-model="item.netAmount"
                      placeholder="请输入"
                      size="mini"
                      style="width:80px;"
                      :controls="false"
                    ></el-input-number>
                  </div>

                  <div class="proLI" style="margin-bottom: 5px;">
                    <span class="left setLeft">实收毛重-金库：</span>
                    <el-input-number
                      v-model="item.hairWeight"
                      placeholder="请输入"
                      size="mini"
                      style="width:80px;"
                      :controls="false"
                    ></el-input-number>
                  </div>
                  <div class="proLI" style="margin-bottom: 5px;">
                    <span class="left setLeft">实收净重-金库：</span>
                    <el-input-number
                      v-model="item.goldWeight"
                      placeholder="请输入"
                      size="mini"
                      style="width:80px;"
                      :controls="false"
                    ></el-input-number>
                  </div>
                </div>

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

    <!-- 产品数据-->
    <el-dialog
      title
      :visible.sync="viewBaoTF"
      width="1200px"
      class="productModel"
      :close-on-click-modal="false"
    >
      <span>
        <div class="dialogTitle">打包详情</div>
        <div>
          <div class="info-item-wrap">
            <!-- 单品start -->
            <div class="infom-info" v-for="(item,ind) in packageData" :key="ind">
              <div>
                <div class="pro-item">
                  <div class="pro-imgs">
                    <img
                      :src="item.pickSkuProp.skuPic?$portImg + item.pickSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">饰品名称:</span>
                        <span class="right">{{item.pickSkuProp.skuName}}</span>
                      </div>

                      <div class="proLI" v-if="item.skuId">
                        <span class="left">编号:</span>
                        <span class="right">{{item.skuId}}</span>
                      </div>

                      <div class="proLI" v-if="item.pickSkuProp.Weight">
                        <span class="left">克重(g):</span>
                        <span class="right">{{item.pickSkuProp.Weight}}</span>
                      </div>
                    </div>

                    <div class="proUL">
                      <!-- <div class="proLI">
                        <span class="left">工单号:</span>
                        <span class="right">--</span>
                      </div>-->

                      <div class="proLI" v-if="item.pickSkuProp.texTure">
                        <span class="left">材质：</span>
                        <span class="right">{{item.pickSkuProp.texTure}}</span>
                      </div>

                      <div class="proLI" v-if="item.pickSkuProp.manufacturingTechnique">
                        <span class="left">生产工艺:</span>
                        <span class="right">{{item.pickSkuProp.manufacturingTechnique}}</span>
                      </div>

                      <div class="proLI" v-if="item.pickSkuProp.colorFormer">
                        <span class="left">成色:</span>
                        <span class="right">{{item.pickSkuProp.colorFormer}}</span>
                      </div>

                      <div class="proLI" v-if="item.pickSkuProp.productType">
                        <span class="left">产品类别:</span>
                        <span class="right">{{item.pickSkuProp.productType}}</span>
                      </div>
                    </div>

                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">选择数量:</span>
                        <span class="right">{{item.skuCheckAmount}}</span>
                      </div>

                      <!-- <div class="proLI">
                        <span class="left">毛重(g):</span>
                        <span class="right">{{item.skuRealWeight}}</span>
                      </div>-->

                      <div class="proLI">
                        <span class="left">净重(g):</span>
                        <span class="right">{{item.skuCheckWeight}}</span>
                      </div>
                    </div>

                    <div class="SUKUL" v-if="orderAllData.billStatue == 'D'" style="width: 30%;">
                      <div class="proLI" style="margin-bottom: 5px;">
                        <span class="left setLeft">实收数量-金库：</span>
                        <el-input-number
                          v-model="item.netAmount"
                          placeholder="请输入"
                          size="mini"
                          style="width:80px;"
                          :controls="false"
                        ></el-input-number>
                      </div>

                      <div class="proLI" style="margin-bottom: 5px;">
                        <span class="left setLeft">实收毛重-金库：</span>
                        <el-input-number
                          v-model="item.hairWeight"
                          placeholder="请输入"
                          size="mini"
                          style="width:80px;"
                          :controls="false"
                        ></el-input-number>
                      </div>
                      <div class="proLI" style="margin-bottom: 5px;">
                        <span class="left setLeft">实收净重-金库：</span>
                        <el-input-number
                          v-model="item.goldWeight"
                          placeholder="请输入"
                          size="mini"
                          style="width:80px;"
                          :controls="false"
                        ></el-input-number>
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
                    <div class="packageWrap">
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
    <!-- 打印调拨单 -->
    <div v-show="false">
      <PrintTPFour :billData="allocationAllData" ref="myCompAllocation"></PrintTPFour>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allocationAllData: {},
      noPackageData: [], //没打包数据
      modifyData: [], //组装的数据
      packageData: [], //包弹框数据
      viewBaoTF: false, //点击包弹框
      orderAllData: {
        transferSlips: [],
        jBaos: [],
        pickSkus: []
      },
      orderTable: [],
      outstoreId: "",
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
      ceditSumNum: 0,
      webLoadingTF: false
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.outstoreId = this.$route.query.outstoreId;
      this.getOrderDetail();
    },
    //订单详情
    getOrderDetail() {
      let self = this;
      self.webLoadingTF = true;
      let params = {
        PRS: {
          outstoreId: this.outstoreId
        }
      };
      this.$axios
        .get(this.$portMain + "/exhibit/getSpotOutstore", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.webLoadingTF = false;
            //
            //
            self.orderAllData = res.data.data;
            self.orderTable.push(self.orderAllData);
            self.orderTable.forEach(item => {
              item.orderTime = self.$api.dateGetDayTime(item.orderTime);
            });

            if (self.orderAllData.transferSlips == undefined) {
              self.orderAllData.transferSlips = [];
            }

            if (self.orderAllData.jBaos == undefined) {
              self.orderAllData.jBaos = [];
            }

            if (self.orderAllData.pickSkus == undefined) {
              self.orderAllData.pickSkus = [];
            }

            self.noPackageData = self.orderAllData.pickSkus;
            // self.noPackageData.forEach(item => {
            //   item.suitStatu = false;
            //   item.goldWeight = undefined;
            //   item.netAmount = undefined;
            //   item.hairWeight = undefined;
            // });
            // if (self.orderAllData.receivBaos.length != 0) {
            //   self.orderAllData.receivBaos.forEach(item => {
            //     if (item.receSkuProp) {
            //       item.receSkuProp.forEach(one => {
            //         one.goldWeight = undefined;
            //         one.netAmount = undefined;
            //         one.hairWeight = undefined;
            //       });
            //     }
            //   });
            // }
            self.modifierData(self.noPackageData);
            //
            //
          } else {
            self.$message.error(res.data.msg);
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
    //
    //
    // },

    getProduct(elem) {
      let self = this;
      //
      let params = {
        outstoreId: this.outstoreId,
        baoId: elem.baoId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/outstore/selectSkuBaoByExhibit",
        params,
        res => {
          self.packageData = res.data;
          self.viewBaoTF = true;
          // self.productIndex = index;
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

    //确定收货
    confirmFun() {
      let self = this;
      let _receivSku = [];
      let result = false;
      let result2 = false;

      this.orderAllData.receivSkus.forEach(item => {
        if (
          item.goldWeight == 0 ||
          item.goldWeight == undefined ||
          item.netAmount == 0 ||
          item.netAmount == undefined ||
          item.hairWeight == 0 ||
          item.hairWeight == undefined
        ) {
          result = true;
        }
      });

      if (this.orderAllData.jBaos.length != 0) {
        this.orderAllData.jBaos.forEach(item => {
          if (item.receivSkus) {
            item.receivSkus.forEach(one => {
              if (
                one.goldWeight == 0 ||
                one.goldWeight == undefined ||
                one.netAmount == 0 ||
                one.netAmount == undefined ||
                one.hairWeight == 0 ||
                one.hairWeight == undefined
              ) {
                result2 = true;
              }
            });
          }
        });
      }

      if (result2) {
        self.$message.warning("请填写包的复称的数量、毛重、净重!");
        return;
      }

      this.orderAllData.receivSkus.forEach(item => {
        _receivSku.push({
          receSkuId: item.receSkuId,
          secondConfirmGoldWeight: item.goldWeight,
          secondConfirmAmount: item.netAmount,
          secondConfirmWeight: item.hairWeight
        });
      });

      if (this.orderAllData.jBaos.length != 0) {
        this.orderAllData.jBaos.forEach(item => {
          if (item.receivSkus) {
            item.receivSkus.forEach(one => {
              _receivSku.push({
                receSkuId: one.receSkuId,
                secondConfirmGoldWeight: one.goldWeight,
                secondConfirmAmount: one.netAmount,
                secondConfirmWeight: one.hairWeight
              });
            });
          }
        });
      }

      if (result) {
        self.$message.warning("请填写复称的数量、毛重、净重!");
        return;
      }

      let params = {
        outstoreId: this.orderAllData.receId,
        _receivSku: JSON.stringify(_receivSku)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/receiv/order/confirmReceiv",
        params,
        res => {
          self.$message.success(res.msg);
          self.$router.push("repetition");
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    getSummaries(param) {
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
    //打印调拨
    allocationPrint() {
      let self = this;
      let orderAllData = JSON.parse(JSON.stringify(self.orderAllData));
      this.allocationAllData = orderAllData;
      this.allocationAllData.sponsorUnit = "尚金缘金库";
      this.$refs.myCompAllocation.compPrintFun();
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

    .title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(35, 36, 38, 1);
      margin-bottom: 8px;
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
    .dialogTitle {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(35, 36, 38, 1);
    }

    .infom-info {
      margin: 10px 0;
    }

    .infom-item {
      // display: flex;
    }

    .pro-item {
      // width: 60%;
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
      width: 100%;
      display: flex;
      // flex-flow: column;
      // justify-content: center;
      margin-left: 10px;

      .proUL {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 36, 38, 1);
        // margin-right: 224px;
        width: 30%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      // .SUKUL {
      // font-size: 14px;
      // font-family: Microsoft YaHei;
      // font-weight: 400;
      // color: rgba(34, 36, 38, 1);
      // }
      .proLI {
        margin-bottom: 6px;

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

    .packageWrap {
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
