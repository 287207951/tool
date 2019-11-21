<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>入饰单列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{BillTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-show="BillState == 'allocation'">
      <div class="hr"/>

      <div>
        <!-- <div style="text-align: right;margin-bottom: 20px;" v-if="orderAllData.billStatue == 'N'">
          <el-button size="small" type="primary" plain>驳回</el-button>
          <el-button size="small" type="primary" @click="confirmFun">确认收货</el-button>
        </div>-->
        <el-table :data="orderTable" style="width: 100%">
          <el-table-column prop="rCode" label="入库单据号" width="180"></el-table-column>
          <el-table-column prop="customerName" label="发起单位" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.workSatue == '_cus' || scope.row.workSatue == '_reple'">尚金缘物流</span>
              <span v-else-if="scope.row.workSatue == '_stock'">尚金缘金库收料部</span>
              <span
                v-else-if="scope.row.workSatue == '_allotput' || scope.row.workSatue == '_allotputExhibi'"
              >尚金缘展厅</span>
              <span v-else-if="scope.row.workSatue == '_return'">{{scope.row.customerName}}</span>
              <span
                v-else-if="scope.row.workSatue == '_cusfac' || scope.row.workSatue == '_replefac'"
              >{{scope.row.factoryName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="receCode" label="调拨单号"></el-table-column>
          <!-- <el-table-column prop="orderCode" label="工单号">
            <template slot-scope="scope">
              <span
                v-if="scope.row.workSatue !== '_return' && scope.row.workSatue !== '_allotputExhibi'"
              >{{scope.row.orderCode}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="factoryName" label="工厂名称"></el-table-column>
          <el-table-column prop="realAmount" label="数量"></el-table-column>
          <el-table-column prop="realWeight" label="合计毛重(g)"></el-table-column>
          <el-table-column prop="realGoldWeight" label="合计净重(g)"></el-table-column>
          <el-table-column prop="reviewPersonName" label="操作人"></el-table-column>
          <el-table-column prop="checkTime" label="制单日期"></el-table-column>
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

    <!-- 调拨 -->
    <div class="tableDetailWrapOne" v-show="BillState == 'allocation'">
      <div class="tableDetailTitle">
        <!-- <el-button plain type="primary" size="small">驳回</el-button> -->
        <el-button type="primary" size="small" @click="allocationPrint">打印</el-button>
      </div>

      <div class="billWrap">
        <el-row>
          <el-col :span="12">
            <div>
              原单据号：
              <span>{{orderAllData.orderCode}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              备注：
              <span>--</span>
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
      </el-table>
    </div>

    <!--入饰 -->
    <div class="tableDetailWrapTwo" v-show="BillState == 'customer' || BillState == 'factory'">
      <div class="hr"/>
      <div class="tableDetailTitle">
        <!-- <el-button plain type="primary" size="small">红冲</el-button> -->
        <el-button type="primary" size="small" @click="decorationPrint">打印</el-button>
      </div>

      <div class="billDetail">
        <!-- 收工厂饰 -->
        <el-row v-show="BillState == 'factory'">
          <el-col :span="8" class="billItem">
            <div>
              原单据号：
              <span>{{orderAllData.orderCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              接收单位：
              <span>尚金缘金库</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              订单状态：
              <span>已完成</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              入饰单号：
              <span>{{orderAllData.rCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              工厂名称：
              <span>{{orderAllData.factoryName}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              备注：
              <span>--</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              工单号：
              <span>{{orderAllData.receCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              发起单位：
              <span>{{orderAllData.customerName}}</span>
            </div>
          </el-col>
        </el-row>
        <!-- 收客户饰 -->
        <el-row v-show="BillState == 'customer'">
          <el-col :span="8" class="billItem">
            <div>
              入饰单号：
              <span>{{orderAllData.rCode}}</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              订单状态：
              <span>已完成</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              备注：
              <span>--</span>
            </div>
          </el-col>

          <el-col :span="8" class="billItem">
            <div>
              接收单位：
              <span>尚金缘金库</span>
            </div>
          </el-col>
          <el-col :span="8" class="billItem">
            <div>
              发起单位：
              <span>{{orderAllData.customerName}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="tableWrap">
        <div class="leftWrap">
          <div class="tableTitle">入货明细</div>
          <el-table
            :data="tableDetailOne"
            show-summary
            :summary-method="getSummariesTwo"
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
            <el-table-column prop="productCs" label="种类" header-align="center" align="center"></el-table-column>
            <el-table-column prop="marketName" label="营销品类" header-align="center" align="center"></el-table-column>
            <el-table-column prop="weight" label="实收重量(g)" header-align="center" align="center"></el-table-column>
          </el-table>
        </div>

        <div class="rightWrap">
          <div class="tableTitle">账款明细</div>
          <el-table
            :data="tableDetailTwo"
            show-summary
            :summary-method="getSummariesTwo"
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
                    <span class="right">{{item.skuId}}</span>
                  </div>

                  <div class="proLI" v-if="item.receSkuProp.Weight">
                    <span class="left">克重：</span>
                    <span class="right">{{item.receSkuProp.Weight}}g</span>
                  </div>
                </div>

                <!-- 完成 -->
                <div class="proUL">
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
                    v-if="item.receSkuProp.manufacturingTechnique && (item.receSkuProp.productType != '套装')"
                  >
                    <span class="left">生产工艺：</span>
                    <span class="right">{{item.receSkuProp.manufacturingTechnique}}</span>
                  </div>
                </div>

                <div class="proUL">
                  <div class="proLI" v-if="item.secondConfirmAmount">
                    <span class="left">实收数量-金库：</span>
                    <span class="right">{{item.secondConfirmAmount}}</span>
                  </div>

                  <!-- <div class="proLI">
                    <span class="left">实收毛重-金库：</span>
                    <span class="right">{{orderAllData.realWeight?orderAllData.realWeight:0}}g</span>
                  </div>-->
                  <div class="proLI" v-if="item.secondConfirmGoldWeight">
                    <span class="left">实收净重-金库：</span>
                    <span class="right">{{item.secondConfirmGoldWeight}}g</span>
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
                        <span class="right">{{item.skuId}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">产品类别:</span>
                        <span class="right">{{item.receSkuProp.productType}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">成色:</span>
                        <span class="right">{{item.receSkuProp.colorFormer}}</span>
                      </div>
                    </div>

                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">工单号:</span>
                        <span class="right">{{orderAllData.orderCode?orderAllData.orderCode:'--'}}</span>
                      </div>

                      <div class="proLI" v-if="item.receSkuProp.productType != '套装'">
                        <span class="left">材质：</span>
                        <span class="right">{{item.receSkuProp.texTure}}</span>
                      </div>

                      <div class="proLI" v-if="item.receSkuProp.productType != '套装'">
                        <span class="left">生产工艺:</span>
                        <span class="right">{{item.receSkuProp.manufacturingTechnique}}</span>
                      </div>

                      <div class="proLI">
                        <span class="left">克重(g):</span>
                        <span class="right">{{item.receSkuProp.Weight}}</span>
                      </div>
                    </div>

                    <div class="proUL">
                      <div class="proLI">
                        <span class="left">选择数量:</span>
                        <span class="right">{{item.skuRealAmount}}</span>
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
                      <div class="txtOne">编号：{{ielem.proNum}}</div>
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
    <!-- 打印入饰单 -->
    <div v-show="false">
      <PrintTPFive :billData="decorationAllData" ref="myCompDecoration"></PrintTPFive>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allocationAllData: {}, //打印调拨数据
      decorationAllData: {}, //打印入饰数据
      loadingState: false,
      tableDetail: [], //表格明细
      tableDetailOne: [], //出货明细
      tableDetailTwo: [], //账款明细
      noPackageData: [], //没打包数据
      modifyData: [], //组装的数据
      packageData: [], //包弹框数据
      viewBaoTF: false, //点击包弹框
      BillState: "", //单据状态
      BillTitle: "", //单据标题
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
        this.BillTitle = "调拨入库单详情";
      } else if (this.BillState == "customer") {
        this.BillTitle = "客户退饰单详情";
      } else if (this.BillState == "factory") {
        this.BillTitle = "工厂入饰单详情";
      }
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
            self.orderAllData = res.data.data;
            if (res.data.data.receivFromDiv != undefined) {
              let receivFromDiv = JSON.parse(res.data.data.receivFromDiv);
              if (receivFromDiv.name == "调拨") {
                self.tableDetail = receivFromDiv.tabRight;
              } else if (receivFromDiv.name == "入货明细") {
                self.tableDetailOne = receivFromDiv.tabLeft;
                self.tableDetailTwo = receivFromDiv.tabRight;
              }
            }
            self.orderTable.push(self.orderAllData);
            self.orderTable.forEach(item => {
              item.checkTime = self.$api.dateGetDayTime(item.checkTime);
            });
            self.noPackageData = self.orderAllData.receivSkus;
            self.noPackageData.forEach(item => {
              item.suitStatu = false;
              item.netWeight = "";
              item.netAmount = "";
            });
            if (self.orderAllData.receivBaos.length != 0) {
              self.orderAllData.receivBaos.forEach(item => {
                item.enterWeight = "";
              });
            }
            self.modifierData(self.noPackageData);
            self.loadingState = false;
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

    //表格1底部数据统计
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
    getSummariesTwo(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "实收重量(g)" || column.label === "金额(￥)") {
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
      this.allocationAllData.customerName = "尚金缘金库";
      // this.allocationAllData.sponsorUnit = self.orderAllData.customerName;
      this.allocationAllData.createTime = orderAllData.checkTime;
      this.allocationAllData.transferSlips = JSON.parse(
        orderAllData.receivFromDiv
      ).tabRight;
      switch (self.orderAllData.workSatue) {
        case "_cus":
        case "_reple":
          self.allocationAllData.sponsorUnit = "尚金缘物流";
          break;
        case "_stock":
          self.allocationAllData.sponsorUnit = "尚金缘金库收料部";
          break;
        case "_allotput":
        case "_allotputExhibi":
          self.allocationAllData.sponsorUnit = "尚金缘展厅";
          break;
        case "_return":
          self.allocationAllData.sponsorUnit = self.orderAllData.customerName;
          break;
        case "_cusfac":
        case "_replefac":
          self.allocationAllData.sponsorUnit = self.orderAllData.factoryName;
          break;
        default:
          self.allocationAllData.sponsorUnit = "--";
          break;
      }
      this.$refs.myCompAllocation.compPrintFun();
    },
    //打印入饰
    decorationPrint() {
      let self = this;
      let orderAllData = JSON.parse(JSON.stringify(self.orderAllData));
      this.decorationAllData = orderAllData;
      this.decorationAllData.receiver = "尚金缘金库";
      this.decorationAllData.skuCeditGroups = JSON.parse(
        orderAllData.receivFromDiv
      ).tabLeft;
      this.decorationAllData.outstoreCedits = JSON.parse(
        orderAllData.receivFromDiv
      ).tabRight;
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
    padding-top: 20px;

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

  .tableDetailWrapTwo {
    .tableDetailTitle {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;

      .titleDes {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(35, 36, 38, 1);
      }
    }

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
</style>

<style>
.outOfStock .tableDetailWrapTwo .el-table__empty-block {
  min-height: 49px;
}
</style>

