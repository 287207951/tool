<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库列表</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>

      <div>
        <div style="text-align: right;margin-bottom: 20px;" v-if="orderAllData.billStatue == 'N'">
          <el-button size="small" type="primary" plain @click="rejectFun">驳回</el-button>
          <el-button size="small" type="primary" @click="confirmFun">确认收货</el-button>
        </div>
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="rCode" label="入库单据号" width="180"></el-table-column>
          <el-table-column prop="customerName" label="客户名称" width="180"></el-table-column>
          <el-table-column prop="receCode" label="调拨单号"></el-table-column>
          <!-- <el-table-column prop="orderCode" label="工单号"></el-table-column> -->
          <!-- <el-table-column prop="factoryName" label="工厂名称"></el-table-column> -->
          <el-table-column prop="realAmount" label="数量"></el-table-column>
          <el-table-column prop="realWeight" label="合计毛重(g)"></el-table-column>
          <el-table-column prop="realGoldWeight" label="合计净重(g)"></el-table-column>
          <el-table-column prop="reviewPersonName" label="操作人"></el-table-column>
          <el-table-column prop="checkTime" label="制单日期"></el-table-column>
          <el-table-column prop label="订单状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.billStatue == 'Y' || scope.row.billStatue == 'D'">已完成</span>
              <span v-else-if="scope.row.billStatue == 'N'">待确认</span>
              <span v-else-if="scope.row.billStatue == 'T'">已驳回</span>
              <span v-else-if="scope.row.billStatue == 'R'">已作废</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bigLine">
        <el-checkbox v-model="checked" v-show="false"></el-checkbox>
      </div>
    </div>

    <!-- 单据详情 -->
    <div class="tableDetailWrapOne">
      <div class="tableDetailTitle">
        <!-- <el-button plain type="primary" size="small">驳回</el-button> -->
      </div>

      <div class="billWrap">
        <el-row>
          <el-col :span="12">
            <div>
              入库单据号：
              <span>{{orderAllData.rCode}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              备注：
              <span>{{orderRemarks?orderRemarks:'--'}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="tableDetail"
        border
        show-summary
        :summary-method="getSummaries"
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

    <div class="ULWrap" v-if="orderAllData.receivBaos.length != 0">
      <div class="title">打包信息</div>
      <div
        class="LiWrap"
        v-for="(item,index) in orderAllData.receivBaos"
        :key="index"
        @click="getProduct(item.receivSkus)"
      >
        <div style="flex:2">
          <span class="liLeft">包号</span>
          <span>{{item.baoCode}}</span>
        </div>

        <div style="flex:3">
          <span class="liLeft">客户名称</span>
          <span>{{orderAllData.customerName}}</span>
        </div>
        <div style="flex:2">
          <span class="liLeft">订单编号</span>
          <span>{{orderAllData.orderCode}}</span>
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
        <div @click.stop="stopInput" v-if="orderAllData.billStatue == 'N'" style="flex:3">
          <span class="liLeft">入库毛重</span>
          <!-- <el-input
            v-model="item.comfirmPurWeight"
            placeholder="请输入"
            size="small"
            style="width:80px"
            @blur="numCheck(item)"
          ></el-input>-->
          <el-input-number
            v-model="item.enterWeight"
            placeholder="请输入"
            size="small"
            style="width:80px;"
            @focus="focusWeightFocus(item,index,'打包')"
            @blur="focusWeightBlur(item,'enterWeight')"
            :controls="false"
            :min="0"
          ></el-input-number>
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
                v-if="item.receSkuProp.skuPic"
                :src="$portImg+item.receSkuProp.skuPic"
                class="productPic"
              >
              <img v-else src="../../../../static/images/img-noimg.png" class="productPic">
              <div class="productDes">
                <div class="proUL">
                  <div class="proTitel">{{item.receSkuProp.skuName}}</div>
                  <div class="proLI">
                    <span class="left">编号：</span>
                    <!-- <span class="right">{{item.receSkuProp.skuCode}}</span> -->
                    <span class="right">{{item.skuId}}</span>
                  </div>

                  <div class="proLI" v-if="item.receSkuProp.Weight">
                    <span class="left">克重：</span>
                    <span class="right">{{item.receSkuProp.Weight}}g</span>
                  </div>
                </div>

                <!-- 完成 -->
                <div
                  class="proUL"
                  v-if="orderAllData.billStatue == 'Y' || orderAllData.billStatue == 'D'"
                >
                  <div class="proLI" v-if="item.receSkuProp.colorFormer">
                    <span class="left">产品成色：</span>
                    <span class="right">{{item.receSkuProp.colorFormer}}</span>
                  </div>

                  <div
                    class="proLI"
                    v-if="item.receSkuProp.texTure && (item.receSkuProp.productType != '套装')"
                  >
                    <span class="left">产品材质：</span>
                    <span class="right">{{item.receSkuProp.texTure}}</span>
                  </div>

                  <div
                    class="proLI"
                    v-if="item.receSkuProp.manufacturingTechnique && item.receSkuProp.productType != '套装'"
                  >
                    <span class="left">生产工艺：</span>
                    <span class="right">{{item.receSkuProp.manufacturingTechnique}}</span>
                  </div>
                </div>

                <div
                  class="proUL"
                  v-if="item.receSkuProp.productType && (orderAllData.billStatue == 'Y' || orderAllData.billStatue == 'D')"
                >
                  <div class="proLI">
                    <span class="left">产品类别：</span>
                    <span class="right">{{item.receSkuProp.productType}}</span>
                  </div>
                </div>

                <div
                  class="proUL"
                  v-if="item.skuRealAmount && (orderAllData.billStatue == 'Y' || orderAllData.billStatue == 'D')"
                >
                  <div class="proLI">
                    <span class="left">应收数量：</span>
                    <span class="right">{{item.skuRealAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.skuRealWeight">
                    <span class="left">应收毛重：</span>
                    <span class="right">{{item.skuRealWeight}}g</span>
                  </div>
                  <div class="proLI" v-if="item.skuRealGoldWeight">
                    <span class="left">应收净重：</span>
                    <span class="right">{{item.skuRealGoldWeight}}g</span>
                  </div>
                </div>

                <div
                  class="proUL"
                  v-if="item.firstConfirmAmount && (orderAllData.billStatue == 'Y' || orderAllData.billStatue == 'D')"
                >
                  <div class="proLI">
                    <span class="left">实收数量：</span>
                    <span class="right">{{item.firstConfirmAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.firstConfirmWeight">
                    <span class="left">实收毛重：</span>
                    <span class="right">{{item.firstConfirmWeight}}g</span>
                  </div>
                  <!-- <div class="proLI" >
                    <span class="left">实收净重-金库：</span>
                    <span class="right">{{item.firstConfirmWeight?item.firstConfirmWeight:0}}g</span>
                  </div>-->
                </div>

                <!-- 待审核 -->
                <div
                  class="proUL"
                  v-if="orderAllData.orderCode && (orderAllData.billStatue == 'N')"
                >
                  <div class="proLI">
                    <span class="left">工单号：</span>
                    <span class="right">{{orderAllData.orderCode}}</span>
                  </div>

                  <div class="proLI" v-if="item.receSkuProp.productType">
                    <span class="left">产品类别：</span>
                    <span class="right">{{item.receSkuProp.productType}}</span>
                  </div>

                  <div
                    class="proLI"
                    v-if="item.receSkuProp.texTure && (item.receSkuProp.productType != '套装')"
                  >
                    <span class="left">产品材质：</span>
                    <span class="right">{{item.receSkuProp.texTure}}</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'N'">
                  <div class="proLI" v-if="item.receSkuProp.colorFormer">
                    <span class="left">产品成色：</span>
                    <span class="right">{{item.receSkuProp.colorFormer}}</span>
                  </div>

                  <div
                    class="proLI"
                    v-if="item.receSkuProp.manufacturingTechnique && (item.receSkuProp.productType != '套装')"
                  >
                    <span class="left">生产工艺：</span>
                    <span class="right">{{item.receSkuProp.manufacturingTechnique}}</span>
                  </div>
                </div>

                <div class="proUL" v-if="orderAllData.billStatue == 'N'">
                  <div class="proLI" v-if="item.skuRealAmount">
                    <span class="left">应收数量：</span>
                    <span class="right">{{item.skuRealAmount}}</span>
                  </div>

                  <div class="proLI" v-if="item.skuRealWeight">
                    <span class="left">应收物流：</span>
                    <span class="right">{{item.skuRealWeight}}g</span>
                  </div>

                  <div class="proLI" v-if="item.skuRealGoldWeight">
                    <span class="left">应收净重：</span>
                    <span class="right">{{item.skuRealGoldWeight}}g</span>
                  </div>
                </div>

                <div class="SUKUL" v-if="orderAllData.billStatue == 'N'">
                  <div class="proLI">
                    <span class="left setLeft">实收数量：</span>
                    <!-- <el-input
                      v-model="item.firstConfirmAmount"
                      placeholder="请输入"
                      size="small"
                      style="width:80px"
                    ></el-input>-->
                    <el-input-number
                      v-model="item.netAmount"
                      placeholder="请输入"
                      size="small"
                      style="width:80px;"
                      :controls="false"
                      :min="0"
                      @blur="numberCheck(item)"
                    ></el-input-number>
                  </div>

                  <div class="proLI">
                    <span class="left setLeft">实收毛重：</span>
                    <!-- <el-input
                      v-model="item.firstConfirmWeight"
                      placeholder="请输入"
                      size="small"
                      style="width:80px"
                    ></el-input>-->
                    <el-input-number
                      v-model="item.netWeight"
                      placeholder="请输入"
                      size="small"
                      style="width:80px;"
                      :controls="false"
                      :min="0"
                      @focus="focusWeightFocus(item,index)"
                      @blur="focusWeightBlur(item,'netWeight')"
                    ></el-input-number>
                  </div>
                </div>

                <div
                  class="suitType"
                  v-if="item.receSkuProp.productType == '套装'"
                  @click="suitClick(item,index)"
                >
                  套装详情
                  <i class="el-icon-arrow-down" v-if="!item.suitStatu"></i>
                  <i class="el-icon-arrow-up" v-if="item.suitStatu"></i>
                </div>
              </div>
            </div>

            <!-- 套装数据 -->
            <div class="suitwrrap" v-if="item.receSkuProp.productType == '套装' && item.suitStatu">
              <div
                class="itemWrap"
                v-for="(project, num) in item.receSkuProp.map.proList"
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
                      :src="item.receSkuProp.skuPic?$portImg + item.receSkuProp.skuPic:'../../../static/images/img-noimg.png'"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">饰品名称:</span>
                        <span class="right">{{item.receSkuProp.skuName}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">编号:</span>
                        <!-- <span class="right">{{item.receSkuProp.skuCode}}</span> -->
                        <span class="right">{{item.skuId}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">产品类别:</span>
                        <span class="right">{{item.receSkuProp.productType}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">成色:</span>
                        <span
                          class="right"
                        >{{item.receSkuProp.colorFormer?item.receSkuProp.colorFormer:'--'}}</span>
                      </div>
                    </div>

                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">工单号:</span>
                        <span class="right">{{orderAllData.orderCode?orderAllData.orderCode:'--'}}</span>
                      </div>

                      <div class="proLI" v-if="item.receSkuProp.productType != '套装'">
                        <span class="left">材质：</span>
                        <span
                          class="right"
                        >{{item.receSkuProp.texTure?item.receSkuProp.texTure:'--'}}</span>
                      </div>

                      <div class="proLI" v-if="item.receSkuProp.productType != '套装'">
                        <span class="left">生产工艺:</span>
                        <span
                          class="right"
                        >{{item.receSkuProp.manufacturingTechnique?item.receSkuProp.manufacturingTechnique:'--'}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">克重(g):</span>
                        <span class="right">{{item.receSkuProp.Weight}}</span>
                      </div>
                    </div>

                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">选择数量:</span>
                        <span class="right">{{item.skuRealAmount?item.skuRealAmount:'--'}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">毛重(g):</span>
                        <span class="right">{{item.skuRealWeight}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">净重(g):</span>
                        <span class="right">{{item.skuRealGoldWeight}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 套装 -->
              <div v-if="item.receSkuProp.productType== '套装'" class="divThree">
                <el-row>
                  <el-col
                    :span="11"
                    class="divThreeSub"
                    v-for="(ielem,indOne) in item.receSkuProp.map.proList"
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
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: false,
      orderRemarks: "", //订单备注
      tableDetail: [], //单据数据
      loadingState: true,
      noPackageData: [], //没打包数据
      modifyData: [], //组装的数据
      packageData: [], //包弹框数据
      viewBaoTF: false, //点击包弹框
      orderAllData: {
        receivBaos: []
      },
      orderTable: [],
      receivId: "",
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
      inputIndOne: null,
      tempObj: {} //选择对象
    };
  },
  created() {
    let self = this;
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.receivId = this.$route.query.receivId;
      this.getOrderDetail();
      document.onkeydown = e => {
        let dom = self.$refs.creatSendMaterial;
        if (dom && e.code == "F9") {
          self.comFun();
        }
      };
      this.loopInit = this.loop();
    },
    //订单详情
    getOrderDetail() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          receivId: this.receivId
        }
      };
      this.$axios
        .get(this.$portMain + "/receiv/order/getReceivFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingState = false;
            self.orderAllData = res.data.data;
            if (self.orderAllData.receivFromDiv != undefined) {
              let receivFromDiv = JSON.parse(self.orderAllData.receivFromDiv);
              self.tableDetail = receivFromDiv.tabRight;
              self.orderRemarks = receivFromDiv.orderRemarks
                ? receivFromDiv.orderRemarks
                : "";
            }
            self.orderTable.push(self.orderAllData);
            self.orderTable.forEach(item => {
              item.checkTime = self.$api.dateGetDayTime(item.checkTime);
            });
            self.noPackageData = self.orderAllData.receivSkus;
            self.noPackageData.forEach(item => {
              item.suitStatu = false;
              item.netWeight = item.skuRealWeight;
              item.netAmount = item.skuRealAmount;
            });
            if (self.orderAllData.receivBaos.length != 0) {
              self.orderAllData.receivBaos.forEach(item => {
                item.enterWeight = "";
              });
            }
            self.modifierData(self.noPackageData);
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    //按照产品类别分类
    modifierData(elem) {
      let labelData = [];
      let packetData = [];
      elem.forEach(item => {
        let res = labelData.includes(item.receSkuProp.productType);
        if (!res) {
          labelData.push(item.receSkuProp.productType);
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
          if (item.receSkuProp.productType == one.label) {
            one.value.push(item);
          }
        });
      });

      this.modifyData = packetData;
    },

    //查询包产品数据
    getProduct(elem) {
      this.packageData = elem;
      this.viewBaoTF = true;
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
      let receivBaos = [];
      let receivSkus = [];
      this.orderAllData.receivBaos.forEach(item => {
        receivBaos.push({
          baoId: item.baoId,
          comfirmPurWeight: item.enterWeight
        });
      });

      this.orderAllData.receivSkus.forEach(item => {
        receivSkus.push({
          receSkuId: item.receSkuId,
          firstConfirmWeight: item.netWeight,
          firstConfirmAmount: item.netAmount
        });
      });

      let params = {
        receivId: this.orderAllData.receId,
        receivBaos: JSON.stringify(receivBaos),
        receivSkus: JSON.stringify(receivSkus)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/receiv/order/confirmReceivRough",
        params,
        res => {
          self.$message.success(res.msg);
          self.$router.push("outsideWarehousing");
        },
        err => {
          self.$message.error(err.msg);
        }
      );
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
    //驳回
    rejectFun() {
      let self = this;
      let params = {
        receivId: this.receivId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/receiv/order/rejectReceiv",
        params,
        res => {
          self.$message.success(res.msg);
          setTimeout(function() {
            self.$router.push("outsideWarehousing");
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "" || !self.inputIndOne) {
        self.$message.error("毛重-金库没有被焦点选中！");
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
      if (self.tempObj.baoId) {
        self.tempObj.enterWeight = parseFloat(elem);
      } else {
        self.modifyData.forEach(ielem => {
          ielem.value.forEach(jelem => {
            if (jelem.skuId === self.tempObj.skuId) {
              jelem.netWeight = parseFloat(elem);
            }
          });
        });
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
      // if(elem === '打包'){
      //   this.tempObj = e;
      //   this.inputIndOne = ind + 1;
      // }else{
      this.tempObj = e;
      this.inputIndOne = ind + 1;
      // }
    },
    //输入框丢去焦点
    focusWeightBlur(item, name) {
      this.inputIndOne = "";
      let self = this;
      if (name == "enterWeight") {
        if (item.baoStockWeight > item.enterWeight) {
          this.$message.error("抱歉，净重不能大于毛重！");
          this.$nextTick(() => {
            item.enterWeight = 0;
          });
        }
      } else if (name == "netWeight") {
        if (item.skuRealGoldWeight > item.netWeight) {
          this.$message.error("抱歉，净重不能大于毛重！");
          this.$nextTick(() => {
            item.netWeight = 0;
          });
        }
      }

      setTimeout(function() {
        self.checked = !self.checked;
      }, 0);
      this.$forceUpdate();
    },
    numberCheck(item) {
      let self = this;
      setTimeout(function() {
        if (item.netAmount != undefined) {
          item.netAmount = parseInt(item.netAmount);
        }
        self.checked = !self.checked;
      }, 0);
      this.$forceUpdate();
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

  .tableDetailWrapOne {
    padding-top: 30px;

    .tableDetailTitle {
      // display: flex;
      // justify-content: flex-end;
      text-align: right;
      margin-bottom: 6px;

      .titleDes {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(35, 36, 38, 1);
      }
    }

    .billWrap {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8A8E99;
      margin-bottom: 16px;

      div {
        flex: 1;

        span {
          color: #222426;
        }
      }
    }
  }
}
</style>
