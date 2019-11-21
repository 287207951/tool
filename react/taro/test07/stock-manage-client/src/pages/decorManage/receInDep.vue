<template>
  <div class="conBigDiv" ref="repleOrder" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>入饰单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">单据状态</span>
          <el-select
            v-model="orderStatusCode"
            placeholder="请选择"
            size="small"
            style="width:100px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderStatusSear"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">工厂名称</span>
          <el-select v-model="customerName" filterable size="small" @change="searchFun">
            <el-option
              v-for="item in customerList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyName"
            ></el-option>
          </el-select>
          <!-- <span class="fontStyle">调拨状态</span>
          <el-select
            v-model="operaMan"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderSourceSear"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>-->
          <span class="fontStyle">操作人</span>
          <el-select
            v-model="operaMan"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <el-option v-for="item in operaManList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-input
            placeholder="请输入单号搜索"
            v-model="oriOrderNoTxt"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">时间选择</span>
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
            style="width:300px"
            @change="searchFun"
          ></el-date-picker>
        </el-col>
        <el-col :span="12" class="padding10">
          <el-button size="small" type="primary" @click="stockOutFun" v-if="logisticsAllot">调拨出库</el-button>
          <el-button size="small" @click="returnOutFun" v-if="logisticsRefund">退货出库</el-button>
        </el-col>
        <!-- <el-col :span="12" class="txtRed txtRight padding20">
          总计：入库总毛重 {{totalWeight}} g     入库总净重 {{totalSuttle}} g
        </el-col>-->
      </el-row>
      <el-table
        :data="orderAllData"
        @row-dblclick="editGold"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
        <el-table-column prop="number" label="入饰单号" width="150"></el-table-column>
        <el-table-column prop="reapUnit" label="接收单位"></el-table-column>
        <el-table-column prop="factoryName" label="工厂名称"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="invoicesNumber" label="原单号" width="140"></el-table-column>
        <el-table-column prop="factoryNumber" label="工单号" width="170"></el-table-column>

        <el-table-column prop="totalSuttle" width="80" label="总重量"></el-table-column>
        <el-table-column prop="sum" width="80" label="入饰数量"></el-table-column>
        <el-table-column prop="surplusSum" width="100" label="结余" :render-header="renderHeader"></el-table-column>
        <el-table-column prop="totalMoney" width="80" label="总金额"></el-table-column>
        <!-- <el-table-column
          prop="creatorName"
          label="备注信息">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="orderType" width="100" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已完成</span>
            <span class="redColor" v-if="scope.row.status == 2">红冲</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="orderStatus"
          label="调拨状态">
        </el-table-column>-->
        <el-table-column prop="createTime" label="操作时间" width="200px">
          <template slot-scope="scope">
            <span>{{$api.dateGetDayTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" width="100" label="操作人"></el-table-column>
        <el-table-column prop="print" width="80" label="打印"></el-table-column>

        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <span class="redColor" @click="orderPrintFun(scope.row)">打印</span>
            <!-- <span class="redColor" @click="hcFun(scope.row)" v-if="scope.row.status == 1">红冲</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>

      <!-- 红冲开始 -->
      <div v-show="false">
        <div style="display:flex;padding:10px 0;font-size:11px" ref="printTabTwoHC">
          <div style="width:42%;border:1px solid #000;text-align:center">
            <div style="height:30px;line-height:30px">出货明细</div>
            <div
              class="tr"
              style="display:flex;border-top:1px solid #000;height:30px;line-height:30px"
            >
              <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">序号</div>
              <div style="width:35%;border:1px dashed #000;border-top:0;border-left:0;">营销品类</div>
              <div
                style="width:25%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
              >种类</div>
              <div
                style="width:25%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
              >重量</div>
            </div>
            <div
              class="td"
              style="display:flex;height:30px;line-height:30px"
              v-for="(ielem,indOne) in tabLeftDataHC"
              :key="indOne"
            >
              <div style="width:25%;border:1px dashed #000;border-top:0;border-left:0;">{{indOne+1}}</div>
              <div
                style="width:25%;border:1px dashed #000;border-top:0;border-left:0;"
              >{{ielem.marketingCategoryName}}</div>
              <div
                style="width:25%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
              >{{ielem.conditi}}</div>
              <div
                style="width:25%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
              >{{ielem.weight}}</div>
            </div>
            <div style="display:flex;height:30px;line-height:30px">
              <div style="width:60%">合计</div>
              <div style="width:25%;text-align:right;">{{skuCeditSumHC}}</div>
              <div style="width:25%"></div>
            </div>
          </div>
          <div style="width:1%">&nbsp;</div>
          <div style="width:57%;border:1px solid #000;text-align:center">
            <div style="height:30px;line-height:30px">账款明细</div>
            <div
              class="tr"
              style="display:flex;border-top:1px solid #000;height:30px;line-height:30px"
            >
              <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">方式</div>
              <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">项目</div>
              <div
                style="width:15%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
              >重量</div>
              <div
                style="width:15%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
              >单价/克</div>
              <div
                style="width:10%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
              >数量</div>
              <div
                style="width:13%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
              >单价/件</div>
              <div
                style="width:18%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
              >金额</div>
              <div
                style="width:12%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
              >备注</div>
            </div>
            <div
              class="td"
              style="display:flex;height:30px;line-height:30px"
              v-for="(ielem,indOne) in tabRightDataHC"
              :key="indOne"
            >
              <div
                style="width:15%;border:1px dashed #000;border-top:0;border-left:0;"
              >{{ielem.ceditWayName?ielem.ceditWayName:'-'}}</div>
              <div
                style="width:15%;border:1px dashed #000;border-top:0;border-left:0;"
              >{{ielem.ceditProject?ielem.ceditProject:'-'}}</div>
              <div
                style="width:15%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
              >{{ielem.ceditWeight?$api.returnFloat(ielem.ceditWeight):'-'}}</div>
              <div
                style="width:15%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
              >{{ielem.ceditPriceG?$api.returnFloat(ielem.ceditPriceG):'-'}}</div>
              <div
                style="width:10%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
              >{{ielem.ceditAmount?ielem.ceditAmount:'-'}}</div>
              <div
                style="width:13%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
              >{{ielem.ceditPriceJ?$api.returnFloat(ielem.ceditPriceJ):'-'}}</div>
              <div
                style="width:18%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
              >{{ielem.ceditMoney?$api.returnFloat(ielem.ceditMoney):'-'}}</div>
              <div
                style="width:12%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
              >{{ielem.ceditNote?ielem.ceditNote:'-'}}</div>
            </div>

            <div style="display:flex;height:30px;line-height:30px">
              <div style="width:83%">合计</div>
              <div style="width:18%;text-align:right;">{{ceditSumNumHC}}</div>
              <div style="width:12%"></div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="红冲数据" :visible.sync="HCWinTF" width="1400px" :close-on-click-modal="false">
        <span>
          <div style="display:flex">
            <div style="width: 32%;" class="tableWrapOne">
              <el-table
                :data="tabLeftDataHC"
                border
                show-summary
                :summary-method="getSummaries"
                style="width: 100%; margin-top: 20px"
              >
                <el-table-column header-align="center" align="center" label="出货明细">
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="label"
                    type="index"
                    label="序号"
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="marketingCategoryName"
                    label="营销品类"
                  ></el-table-column>
                  <el-table-column header-align="center" align="center" prop="conditi" label="种类"></el-table-column>
                  <el-table-column header-align="center" align="center" prop="weight" label="实收重量"></el-table-column>
                </el-table-column>
              </el-table>
            </div>

            <div style="width: 68%;" class="tableWrapTwo">
              <el-table
                :data="tabRightDataHC"
                border
                show-summary
                :summary-method="getSummaries"
                style="width: 100%; margin-top: 20px"
              >
                <el-table-column header-align="center" align="center" label="账款明细">
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditWayName"
                    label="结费方式"
                  >
                    <!-- <template slot-scope="scope">
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
                        >
                        </el-option>
                      </el-select>
                    </template>-->
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditProject"
                    label="项目"
                  ></el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditWeight"
                    label="重量"
                  ></el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditPriceG"
                    label="单价/克"
                  ></el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditAmount"
                    label="数量"
                  ></el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditPriceJ"
                    label="单价/件"
                  ></el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="ceditMoney"
                    label="金额"
                  ></el-table-column>
                  <el-table-column header-align="center" align="center" prop="ceditNote" label="备注"></el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="HCWinTF = false" size="small" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="addHCFun" size="small" :loading="btnLoading">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 红冲结束 -->

      <div ref="printTabOne" v-show="false" style="width:750px">
        <div
          style="line-height:24px;font-weight:bold;font-family:'SimHei';font-size:12px;padding-top:30px"
        >
          <div style="display:flex;font-weight:bold;">
            <div
              style="width:37%;text-align:right"
            >{{orderAllData.areaProvonce?orderAllData.areaProvonce:'-'}}</div>
            <div style="width:30%;font-size:20px;padding-left:35px;">出饰单</div>
            <div style="width:33%;margin-left:-35px;"></div>
          </div>
          <!-- {{orderAllData}} -->
          <div style="display:flex;font-weight:bold;">
            <div style="width:67%">尚金缘</div>
            <div style="width:33%">单 号：{{tableData.retreatNumber?tableData.retreatNumber:'-'}}</div>
          </div>
          <div style="display:flex;font-weight:bold;">
            <div style="width:67%">
              客户名称：
              <span style="font-size:14px;">{{tableData.reapUnit?tableData.reapUnit:'-'}}</span>
            </div>
            <div style="width:33%">日 期：</div>
          </div>
          <div style="display:flex;border-bottom:1px solid #000;font-weight:bold;">
            <div style="width:67%">备 注：{{mock}}</div>
            <div style="width:33%">打印时间：{{this.$moment().format("YYYY年MM月DD日 HH:mm:ss")}}</div>
          </div>
          <div style="display:flex;padding:10px 0;font-size:11px">
            <div style="width:42%;border:1px solid #000;text-align:center">
              <div>入货明细</div>
              <div class="tr" style="display:flex;border-top:1px solid #000">
                <div style="width:25%;border:1px dashed #000;border-top:0;border-left:0;">序号</div>
                <div style="width:25%;border:1px dashed #000;border-top:0;border-left:0;">营销品类</div>
                <div
                  style="width:25%;border:1px dashed #000;border-top:0;border-left:0;;padding-right:5px"
                >种类</div>
                <div
                  style="width:25%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
                >重量</div>
              </div>
              <div
                class="td"
                style="display:flex"
                v-for="(ielem,indOne) in tableLeftData"
                :key="indOne"
              >
                <div
                  style="width:25%;border:1px dashed #000;border-top:0;border-left:0;"
                >{{indOne+1}}</div>
                <div
                  style="width:25%;border:1px dashed #000;border-top:0;border-left:0;"
                >{{ielem.marketingCategoryName}}</div>
                <div
                  style="width:25%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
                >{{ielem.conditi}}</div>
                <div
                  style="width:25%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
                >{{ielem.weight}}</div>
              </div>
              <div style="display:flex">
                <div style="width:60%">合计</div>
                <div style="width:25%;text-align:right;">{{skuCeditSum}}</div>
                <div style="width:25%"></div>
              </div>
            </div>
            <div style="width:1%">&nbsp;</div>
            <div style="width:57%;border:1px solid #000;text-align:center">
              <div>账款明细</div>
              <div class="tr" style="display:flex;border-top:1px solid #000">
                <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">方式</div>
                <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">项目</div>
                <div
                  style="width:15%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
                >重量</div>
                <div
                  style="width:15%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
                >单价/克</div>
                <div
                  style="width:10%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
                >数量</div>
                <div
                  style="width:13%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
                >单价/件</div>
                <div
                  style="width:18%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
                >金额</div>
                <div
                  style="width:12%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
                >备注</div>
              </div>
              <div
                class="td"
                style="display:flex"
                v-for="(ielem,indOne) in tableRightData"
                :key="indOne"
              >
                <div
                  style="width:15%;border:1px dashed #000;border-top:0;border-left:0;"
                >{{ielem.ceditWayName?ielem.ceditWayName:'-'}}</div>
                <div
                  style="width:15%;border:1px dashed #000;border-top:0;border-left:0;"
                >{{ielem.ceditProject?ielem.ceditProject:'-'}}</div>
                <div
                  style="width:15%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
                >{{ielem.ceditWeight?$api.returnFloat(ielem.ceditWeight):'-'}}</div>
                <div
                  style="width:15%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
                >{{ielem.ceditPriceG?$api.returnFloat(ielem.ceditPriceG):'-'}}</div>
                <div
                  style="width:10%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
                >{{ielem.ceditAmount?ielem.ceditAmount:'-'}}</div>
                <div
                  style="width:13%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
                >{{ielem.ceditPriceJ?$api.returnFloat(ielem.ceditPriceJ):'-'}}</div>
                <div
                  style="width:18%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
                >{{ielem.ceditMoney?$api.returnFloat(ielem.ceditMoney):'-'}}</div>
                <div
                  style="width:12%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
                >{{ielem.ceditNote?ielem.ceditNote:'-'}}</div>
              </div>

              <div style="display:flex">
                <div style="width:83%">合计</div>
                <div style="width:18%;text-align:right;">{{ceditSumNum}}</div>
                <div style="width:12%"></div>
              </div>
            </div>
          </div>
          <div style="display:flex;padding-bottom:7px;border-bottom:2px solid #000;">
            <div style="width:7%">总计</div>
            <div style="width:13%">金额大写</div>
            <div style="width:7%">应收</div>
            <div style="width:33%">{{priceTxt}}</div>
            <div style="width:7%">金额合计</div>
            <div style="width:13%">应收RMB</div>
            <div style="width:10%">{{ceditSumNum}}</div>
            <div style="width:10%"></div>
          </div>
          <div style="display:flex;padding:7px 0;border-bottom:2px solid #000;">
            <div style="width:7%">制单:</div>
            <div style="width:13%">{{orderAllData.operateName}}</div>
            <div style="width:7%">复核：</div>
            <div style="width:13%"></div>
            <div style="width:10%">客户签名：</div>
            <div style="width:10%"></div>
            <div style="width:7%">经理：</div>
            <div style="width:13%"></div>
            <div style="width:7%">副总：</div>
            <div style="width:13%"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="已选清单" :visible.sync="winOneTF" :close-on-click-modal="false" width="1500px">
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
                  @blur="focusWeightBlurTwo()"
                ></el-input>
              </span>
              <span v-else class="blackColor">{{$api.returnFloatNum(ielem.suttle)}}</span>
            </el-col>
            <el-col :span="4" class="divOne">
              打包毛重：
              <span v-if="ielem.newTF">
                <el-input
                  v-model="ielem.roughWeight"
                  placeholder
                  size="small"
                  class="width70"
                  @focus="focusWeightFocusTwo(ielem,indOne,'毛重')"
                  @blur="focusWeightBlurTwo()"
                ></el-input>
              </span>
              <span v-else class="blackColor">{{$api.returnFloatNum(ielem.roughWeight)}}</span>
            </el-col>
            <el-col :span="4" class="divOne">
              打包状态：
              <span class="yellowColor" v-if="ielem.newTF">待打包</span>
              <span v-else class="blackColor">已打包</span>
            </el-col>
            <el-col :span="6" class="divOne">
              操作：
              <!-- <span class="yellowColor" @click="cancelBao(ielem)">取消打包</span>  -->
              <span
                class="redColor"
                v-if="ielem.newTF"
                @click="confirmBao(ielem)"
                v-show="ielem.skuList && ielem.skuList.length > 0"
              >确认打包</span>
              <span class="redColor floatRight" v-if="!ielem.newTF" @click="printBao(ielem)">打印包条码</span>
              <span v-if="ielem.skuList.length > 0" class="divTwo">
                <i class="el-icon-arrow-up" v-if="ielem.viewSuit" @click="editSuit(ielem)"></i>
                <i class="el-icon-arrow-down" v-if="!ielem.viewSuit" @click="editSuit(ielem)"></i>
              </span>
            </el-col>

            <el-col :span="24" v-if="ielem.viewSuit && ielem.skuList.length > 0" class="baoTabTwo">
              <el-row
                :class="indOne==0?'baoProTwo':'baoProThree'"
                v-for="(jelem,indOne) in ielem.skuList"
                :key="indOne"
              >
                <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
                <el-col :span="3">
                  <img
                    :src="jelem.img?$portImg+jelem.img:'../../../static/images/img-noimg.png'"
                    style="height:90px; width:120px;margin-top:10px"
                    @click.stop="showPic(jelem.img?$portImg+jelem.img:'../../../static/images/img-noimg.png')"
                  />
                </el-col>
                <el-col :span="20" style="line-height:36px;">
                  <el-row>
                    <el-col :span="4">
                      <span class="blackColor">{{jelem.proName}}</span>
                    </el-col>
                    <el-col :span="5">
                      入饰单号：
                      <span class="blackColor">{{jelem.stockNumber}}</span>
                    </el-col>
                    <el-col :span="3">
                      产品成色：
                      <span class="blackColor">{{jelem.conditi}}</span>
                    </el-col>
                    <el-col :span="4">
                      剩余数量：
                      <span class="blackColor">{{jelem.num}}</span>
                    </el-col>
                    <el-col :span="8">
                      选择数量：
                      <span class="blackColor">
                        <span v-if="!jelem.editTF">{{jelem.editNum}}</span>
                        <el-input-number
                          v-if="jelem.editTF"
                          :disabled="jelem.num <= 0"
                          :controls="false"
                          v-model="jelem.editNum"
                          placeholder
                          size="small"
                          class="width70"
                          :min="0"
                          :max="jelem.num"
                          @blur="changeNum(jelem)"
                        ></el-input-number>
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      编号：
                      <span class="blackColor">{{jelem.proSkuNmber}}</span>
                    </el-col>
                    <el-col :span="4">
                      产品类别：
                      <span class="blackColor">{{jelem.one}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span v-if="jelem.one != '套装'">
                        生产工艺：
                        <span class="blackColor">{{jelem.processCode}}</span>
                      </span>&nbsp;
                    </el-col>
                    <el-col :span="4">
                      <!-- 库存毛重：<span class="blackColor">{{jelem.roughWeight}}g</span> -->
                      &nbsp;
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
                      克重：
                      <span class="blackColor">{{jelem.weight}}g</span>
                    </el-col>
                    <el-col :span="4">
                      入饰数量：
                      <span class="blackColor">{{jelem.sum}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span v-if="jelem.one != '套装'">
                        产品材质：
                        <span class="blackColor">{{jelem.goldCode}}</span>
                      </span>&nbsp;
                    </el-col>
                    <el-col :span="4">
                      库存净重：
                      <span class="blackColor">{{jelem.suttle}}g</span>
                    </el-col>
                    <el-col :span="4">
                      复核毛重：
                      <span class="blackColor">
                        <span v-if="!jelem.editTF">{{$api.returnFloatNum(jelem.editRoughWeight)}}</span>
                        <el-input-number
                          v-if="jelem.editTF && checkInputWeightTF"
                          :disabled="jelem.num <= 0"
                          :controls="false"
                          v-model="jelem.editRoughWeight"
                          placeholder
                          size="small"
                          class="width70"
                          :min="1"
                          @change="checkInputWeight(jelem,indOne)"
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
        <div>
          <el-row>
            <el-col :span="12" v-if="orderStatus === '退饰出库'">
              <span class="fontStyle">接收单位</span>
              {{inCompanyName}}
              <!-- <el-select
                v-model="inCompanyName"
                placeholder="请选择"
                size="small"
                style="width:100px"
                @change="searchFun"
              >
                <el-option
                  v-for="item in factoryList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyName"
                ></el-option>
              </el-select>-->
              <span class="fontStyle">退饰出库</span>
              物流中心
            </el-col>
            <el-col :span="12" v-if="orderStatus === '调拨出库'">
              <span class="fontStyle">接收单位</span>
              尚金缘金库
              <span class="fontStyle">发出部门</span>
              物流中心
            </el-col>
            <el-col :span="12" class="txtRight">
              <el-button
                size="small"
                v-if="orderStatus === '调拨出库'"
                type="primary"
                @click="stockOutFunTwo"
                :disabled="disabledTF"
              >调拨出库</el-button>
              <el-button
                size="small"
                v-if="orderStatus === '退饰出库'"
                type="primary"
                @click="returnOutFunTwo"
                :disabled="disabledTF"
              >确认退饰</el-button>
            </el-col>
          </el-row>
          <el-row class="baoProOne" v-for="(ielem,indOne) in proListOne" :key="indOne">
            <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
            <el-col :span="3">
              <img
                :src="ielem.img?$portImg+ielem.img:'../../../static/images/img-noimg.png'"
                style="height:90px; width:120px;margin-top:10px"
                @click.stop="showPic(ielem.img?$portImg+ielem.img:'../../../static/images/img-noimg.png')"
              />
            </el-col>
            <el-col :span="20" style="line-height:36px;">
              <el-row>
                <el-col :span="4">
                  <span class="blackColor">{{ielem.proName}}</span>
                </el-col>
                <el-col :span="5">
                  <span v-if="ielem.stockNumber">
                    入饰单号：
                    <span class="blackColor">{{ielem.stockNumber}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="3">
                  <span v-if="ielem.conditi">
                    产品成色：
                    <span class="blackColor">{{ielem.conditi}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <span v-if="ielem.num">
                    剩余数量：
                    <span class="blackColor">{{ielem.num}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="8">
                  选择数量：
                  <span class="blackColor">
                    <el-input-number
                      :disabled="ielem.num <= 0"
                      :controls="false"
                      v-model="ielem.editNum"
                      placeholder
                      size="small"
                      class="width70"
                      :min="0"
                      :max="ielem.num"
                      @blur="changeNum(ielem)"
                    ></el-input-number>
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span v-if="ielem.proSkuNmber">
                    编号：
                    <span class="blackColor">{{ielem.proSkuNmber}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <span v-if="ielem.one">
                    产品类别：
                    <span class="blackColor">{{ielem.one}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <span v-if="ielem.one != '套装'">
                    生产工艺：
                    <span class="blackColor">{{ielem.processCode}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <!-- 库存毛重：<span class="blackColor">{{ielem.roughWeight}}g</span> -->
                  &nbsp;
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
                      @change="checkInputWeight(ielem,indOne)"
                    ></el-input-number>
g
                  </span>
                </el-col>
                <el-col :span="4">
                  <span class="redColor" v-if="ielem.num > 0" @click="printPro(ielem)">打印条码</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span v-if="ielem.weight">
                    克重：
                    <span class="blackColor">{{ielem.weight}}g</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <span v-if="ielem.sum">
                    入饰数量：
                    <span class="blackColor">{{ielem.sum}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <span v-if="ielem.one != '套装'">
                    产品材质：
                    <span class="blackColor">{{ielem.goldCode}}</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  <span v-if="ielem.suttle">
                    库存净重：
                    <span class="blackColor">{{ielem.suttle}}g</span>
                  </span>&nbsp;
                </el-col>
                <el-col :span="4">
                  复核毛重：
                  <span class="blackColor">
                    <el-input-number
                      v-if="checkInputWeightTF"
                      :disabled="ielem.num <= 0"
                      :controls="false"
                      v-model="ielem.editRoughWeight"
                      placeholder
                      size="small"
                      class="width70"
                      @focus="focusWeightFocus(ielem,indOne,'复核毛重')"
                      @blur="focusWeightBlur()"
                      @change="checkInputWeight(ielem,indOne)"
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
      :visible.sync="viewBaoTFTwo"
      width="1400px"
      :close-on-click-modal="false"
    >
      <span>
        <div class="baoProFour">
          <el-row>
            <el-col :span="8">退饰单号：{{tableData.retreatNumber}}</el-col>
            <el-col :span="8">接收单位：{{inCompanyName}}</el-col>

            <el-col :span="8">
              备注：
              <el-input v-model="mock" placeholder size="small" class="width240"></el-input>
            </el-col>
            <el-col :span="8">
              退饰单位：
              物流中心
              <!-- <el-select
                  v-model="inCompanyName"
                  placeholder="请选择"
                  size="small"
                  style="width:100px"
                  @change="searchFun"
                >
                  <el-option
                    v-for="item in factoryList"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyName"
                  ></el-option>
              </el-select>-->
            </el-col>
            <el-col :span="16">
              退饰原因：
              <el-select v-model="returnReason" placeholder="请选择" size="small" style="width:200px">
                <el-option
                  v-for="item in reasonList"
                  :key="item.order"
                  :label="item.val"
                  :value="item.order"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div>
          <div style="display:flex">
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
                <el-table-column align="center" label="营销品类" width="150">
                  <template slot-scope="scope">
                    <p
                      style="height: 32px; line-height: 30px;"
                    >{{ scope.row.marketingCategoryName }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="conditi" align="center" label="种类"></el-table-column>
                <el-table-column prop="weight" align="center" label="重量"></el-table-column>
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
                      @change="changeWayName(scope.row,tableRightData)"
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
                      v-model="scope.row.ceditWeight"
                      :disabled="scope.row.ceditAmount > 0 && scope.row.ceditPriceJ > 0"
                      placeholder
                      size="small"
                      class="width70"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditPriceG" align="center" label="单价/克">
                  <template slot-scope="scope">
                    <el-input-number
                      :controls="false"
                      v-model="scope.row.ceditPriceG"
                      :disabled="scope.row.ceditAmount > 0 && scope.row.ceditPriceJ > 0"
                      placeholder
                      size="small"
                      class="width70"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditAmount" align="center" label="数量">
                  <template slot-scope="scope">
                    <el-input-number
                      :controls="false"
                      v-model="scope.row.ceditAmount"
                      :disabled="scope.row.ceditPriceG > 0 && scope.row.ceditWeight > 0"
                      placeholder
                      size="small"
                      class="width70"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditPriceJ" align="center" label="单价/件">
                  <template slot-scope="scope">
                    <el-input-number
                      :controls="false"
                      v-model="scope.row.ceditPriceJ"
                      :disabled="scope.row.ceditPriceG > 0 && scope.row.ceditWeight > 0"
                      placeholder
                      size="small"
                      class="width70"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditMoney" align="center" label="金额">
                  <template slot-scope="scope">
                    <el-input-number
                      :controls="false"
                      :value="scope.row | getCeditMoney"
                      placeholder
                      size="small"
                      class="width70"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="ceditNote" align="center" label="备注">
                  <template slot-scope="scope">
                    <!-- <el-input v-model="scope.row.ceditNote" placeholder="" size="small"></el-input> -->
                    <input
                      v-model="scope.row.ceditNote"
                      :title="scope.row.ceditNote"
                      class="input_bz"
                    />
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
        </div>

        <div class="txtRight top10">
          <el-button size="small" @click="cancelFunOne()" :loading="btnLoadingTF">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="submitFunOne()"
            :loading="btnLoadingTF"
          >提交并打印</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      title="出饰单详情"
      :visible.sync="viewBaoTFThree"
      width="1400px"
      :close-on-click-modal="false"
    >
      <span>
        <div style="display:flex">
          <div style="width:32%">
            <div class="tableTop">出库明细</div>
            <el-table
              :data="tableLeftData"
              show-summary
              :summary-method="getSummaries"
              border
              style="width: 100%;"
            >
              <el-table-column align="center" type="index" label="序号"></el-table-column>
              <el-table-column prop="marketingCategoryName" align="center" label="营销品类" width="150"></el-table-column>
              <el-table-column prop="conditi" align="center" label="种类"></el-table-column>
              <el-table-column prop="weight" align="center" label="重量"></el-table-column>
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
        <div class="txtRight top10">
          <el-button size="small" type="primary" @click="printOutFun">打印</el-button>
          <el-button size="small" type="primary" @click="$router.push('retuInDep')">关闭</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 调拨单弹框 -->
    <el-dialog
      title="已选清单"
      :visible.sync="viewBaoTFFour"
      :close-on-click-modal="false"
      width="1400px"
    >
      <span>
        <div class="baoProFour">
          <el-row>
            <el-col :span="6">调拨单号：{{tableProData.retreatNumber}}</el-col>
            <el-col :span="6">
              调拨部门：{{tableProData.sponsorDepartment}}
              <!-- <el-select
                  v-model="inCompanyName"
                  placeholder="请选择"
                  size="small"
                  style="width:100px"
                  @change="searchFun"
                >
                  <el-option
                    v-for="item in factoryList"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyName"
                  ></el-option>
              </el-select>-->
            </el-col>
            <el-col :span="6">接收单位：{{tableProData.reapUnit}}</el-col>
            <el-col :span="6">
              备注：
              <el-input v-model="mock" placeholder size="small" class="width240"></el-input>
            </el-col>
          </el-row>
        </div>
        <div>
          <div ref="printTabThreeTab">
            <!-- <div class="tableTop">
                账款明细
            </div>-->
            <el-table
              :data="tableRightData"
              show-summary
              :summary-method="getSummariesTwo"
              border
              style="width: 100%"
            >
              <el-table-column prop="species" align="center" label="种类" width="100"></el-table-column>
              <el-table-column prop="category" align="center" label="营销品类" width="110"></el-table-column>
              <el-table-column prop="purWeight" align="center" label="毛重"></el-table-column>
              <el-table-column prop="weight" align="center" label="净重"></el-table-column>
              <el-table-column prop align="center" label="成色">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.purity"
                    @change="changeNum(scope.row)"
                    :min="0"
                    :max="1"
                    placeholder
                    size="small"
                    class="width90"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="suttleWeight" align="center" label="折重">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.suttleWeight"
                    placeholder
                    size="small"
                    class="width70"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="priceG" align="center" label="单价/克">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.priceG"
                    placeholder
                    size="small"
                    class="width70"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="sum" align="center" label="数量">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.sum"
                    placeholder
                    size="small"
                    class="width70"
                    disabled
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="priceJ" align="center" label="单价/件">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.priceJ"
                    placeholder
                    size="small"
                    class="width70"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="money" align="center" label="金额">
                <template slot-scope="scope">
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.money"
                    placeholder
                    size="small"
                    class="width90"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="remark" align="center" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" placeholder size="small"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="txtRight top10">
          <el-button size="small" @click="viewBaoTFFour = false" :loading="btnLoadingTF">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="printFunTwo()"
            :loading="btnLoadingTF"
          >提交并打印</el-button>
        </div>
      </span>
    </el-dialog>

    <!-- 打印入饰单 -->
    <div v-show="false">
      <PrintTPFive :billData="decorationAllData" ref="myCompDecoration"></PrintTPFive>
    </div>
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>

    <!-- 打印sku开始 -->
    <div v-show="false">
      <printTPSkuOne :billData="printData" ref="printTPTwo"></printTPSkuOne>
    </div>
    <!-- 打印sku结束 -->
    <!-- 打印包二维码开始 -->
    <div v-show="false">
      <printTPThree :billData="printBaoData" ref="printTPThree"></printTPThree>
    </div>
    <!-- 打印包二维码结束 -->
    <!-- 打印出饰单 -->
    <div v-show="false">
      <PrintTPOne :billData="printOutData" ref="myComp"></PrintTPOne>
    </div>
    <div v-show="false">
      <PrintTPFour :billData="tableProData" ref="myCompTwo"></PrintTPFour>
    </div>
  </div>
</template>
<script>
var Nzh = require("nzh");
export default {
  data() {
    return {
      printOutData: {}, //出饰单数据
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      oriOrderNoTxt: "", //原单号搜索
      orderNoTxt: "", //收货单号搜索
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      orderStatusCode: "",
      inCompanyName: "", //接收单位名称
      inCompanyId: null, //接收单位ID
      selectedDay: "",
      startTime: "", //开始时间
      endTime: "", //结束时间
      baoList: [
        {
          newTF: true,
          sum: 0,
          roughWeight: 0,
          suttle: 0,
          baoNo: "",
          viewSuit: false,
          skuList: []
        }
      ], //包的数组
      baoListNew: {}, //空闲未确认打包
      selectProId: [],
      winOneTF: false, //调拨出库弹框
      proListOne: [], //未选择产品列表
      factoryList: [], //工厂列表
      orderStatus: "", //区分‘调拨出库’，‘确认退饰’
      ceditNote: "", //备注
      ceditSumNum: 0,
      logisticsRefund: false,
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "已完成"
        },
        {
          code: "2",
          value: "红冲"
        }
      ],
      orderSourceSear: [
        {
          code: "",
          value: "全部"
        }
      ],
      stockSetTypeList: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ], // 排序
      promptType: false, //提示状态
      nowTime: "",
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      allChecked: false, //全选多选框
      options: [], //模拟
      orderAllData: [], //列表
      dialogTableVisible: false, //金料单弹出框
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      totalWeight: 0, //总毛重
      totalSuttle: 0, //总净重
      viewBaoTFTwo: false, //确认退饰后弹框
      viewBaoTFThree: false, //打印后弹框
      viewBaoTFFour: false,
      tableLeftData: {}, //入货明细表格属性
      tableRightData: {}, //账款明细表格属性
      tabLeftDataHC: [],
      tabRightDataHC: [],
      tableProData: {}, //入饰产品数据
      tableData: {},
      priceTxt: "",
      skuCeditSum: 0,
      tabLeftData: [], //出货明细
      tabRightData: [], //账款明细
      tabData: {},
      mock: "", //备注
      orderData: {},
      ceditSumNum: 0,
      skuCeditSum: 0,
      HCWinTF: false,
      nowTime: "",
      HCData: {},
      stockStatus: "", //调拨出库，退饰出库
      queryData: {}, //权限列表
      skuCeditSumHC: [],
      ceditSumNumHC: 0,
      logisticsAllot: false,
      logisticsAllot: false,
      operaMan: "全部", //操作人
      operaManList: ["全部"], //操作人列表
      disabledTF: false, //按钮禁用
      inputIndOne: "",
      enterStatus: "",
      viewBaoHead: {},
      btnLoading: false, //按钮加载中
      webLoadingTF: false,
      btnLoadingTF: false,
      returnReason: null,
      returnReasonVal: "质量问题,要回",
      reasonList: [],
      printData: {}, //打印sku一维码
      printBaoData: {}, //打印包条码
      typeTxt: 1, //1为显示，2为隐藏
      weightTF: false, //毛重比淨重大
      customerName: "", //工厂选择
      customerList: [], //工厂列表
      checkInputWeightTF: true,
      decorationAllData: {}
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    checkInputWeight(elem, index) {
      let self = this;
      let errorStatus = false;
      const { editRoughWeight, editSuttle } = elem;
      if (editRoughWeight <= 0) {
        self.checkInputWeightTF = false;
        errorStatus = false;
        elem.editRoughWeight = editSuttle;

        setTimeout(() => {
          self.checkInputWeightTF = true;
          self.$forceUpdate();
        }, 100);
      } else if (editSuttle > editRoughWeight) {
        self.checkInputWeightTF = false;
        errorStatus = true;
        elem.editRoughWeight = undefined;
        setTimeout(() => {
          self.checkInputWeightTF = true;
          self.$forceUpdate();
        }, 100);
      }
      this.weightTF = errorStatus;
      if (errorStatus) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
      }
    },
    created_fun() {
      // this.$api.dateGetDay()
      let self = this;

      this.displayAllData(1, 12);
      //工厂列表调接口
      // this.factoryListFun();

      //查询用户权限接口
      this.queryVerify();
      //工厂列表读取
      self.factoryLoad();
      //操作人列表调用接口
      this.operaManFun();
      document.onkeydown = e => {
        let dom = self.$refs.repleOrder;
        if (dom && e.code == "F9") {
          self.comFun();
        }
      };
      this.loopInit = this.loop();
    },
    displayAllData(num, size) {
      var self = this;
      self.webLoadingTF = true;
      let orderStatusTxt = "";
      // if(self.orderStatusCode === 'N'){
      //   orderStatusTxt = 1
      // }
      // if(self.orderStatusCode === 'Y'){
      //   orderStatusTxt = 2
      // }
      // console.log(self.customerName)
      let params = {
        orderNo: self.oriOrderNoTxt,
        userName: self.operaMan === "全部" ? "" : self.operaMan,
        factoryName: self.customerName === "全部" ? "" : self.customerName,
        startDate: self.startTime,
        endDate: self.endTime,
        allotType: self.orderStatusCode,
        type: self.typeTxt,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/receiveJewelry",
        params,
        res => {
          self.webLoadingTF = false;
          self.totalSuttle = res.data.totalSuttle;
          self.totalWeight = res.data.totalWeight;
          self.pageNum = num;
          self.pageSize = size;
          self.priceSum = res.data.dataList.rowSize;
          self.orderAllData = res.data.dataList.data;
        },
        err => {
          self.webLoadingTF = false;
          self.$message.error(err.msg);
        }
      );
    },
    //退饰原因类型调接口
    returnReasonFun() {
      let self = this;
      this.$axios
        .get(self.$portMain + "/stockManagement/returnReason")
        .then(function(res) {
          if (res.data.code == 200) {
            self.reasonList = res.data.data;
            self.reasonList.forEach(ielem => {
              if (ielem.val === self.returnReasonVal) {
                self.returnReason = ielem.order;
              }
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //工厂列表搜索
    factoryLoad() {
      let self = this;
      var params = { PRS: { keyWord: "" } };
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
            self.customerList.unshift({ companyId: "", companyName: "全部" });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //权限点调接口
    queryVerify() {
      let self = this;
      self.logisticsAllot = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "logistics-allot"
      );
      self.logisticsRefund = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "logistics-refund"
      );
    },
    //操作人列表调用方法
    operaManFun() {
      let self = this;
      let params = { PRS: { type: 1 } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findUserName", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.operaManList = self.operaManList.concat(res.data.data);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "receInDepDet",
        query: { stockNumber: elem.number }
      });
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },

    //搜索
    searchFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDay(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, this.pageSize);
    },
    //多选择单
    handleSelectionChange(val) {
      this.selectProId = val;
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      self.$refs.comA.click();
      self.loopInit();
    },

    //改变电子称输入框数量
    changeWeight(elem) {
      let self = this;
      if (self.inputIndOne == "") {
        self.$message.error("实收金重没有被焦点选中！");
      }
      if (self.inputIndOne) {
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
            url:
              "http://localhost:5000/BalanceResult/result.js?t=" +
              new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              // console.log(json,json.weight);
              count++;
              var weightNum = json.weight ? json.weight : null;
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
    focusWeightBlurTwo() {
      this.inputIndOne = "";
    },
    //收饰单打印
    orderPrintFun(elem) {
      let self = this;

      var params = { PRS: { stockNumber: elem.number } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findFactoryNumber", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tabLeftData = res.data.data.list;
            self.tabRightData = res.data.data.listCredit;
            self.tabData = res.data.data;
            self.nowTime = self.$moment().format("YYYY年MM月DD日 HH:mm:ss");
            self.changeSumNumTwo();

            let tabLeftData = [];
            if (self.tabLeftData.length > 0) {
              tabLeftData = JSON.parse(JSON.stringify(self.tabLeftData));
              tabLeftData.forEach(item => {
                item.productCs = item.conditi;
                item.marketName = item.marketingCategoryName;
              });
            }
            // console.log(elem)
            self.decorationAllData = {
              receCode: elem.number,
              receiver: elem.reapUnit,
              rCode: elem.number,
              customerName: elem.factoryName,
              checkTime: elem.createTime,
              skuCeditGroups: tabLeftData,
              outstoreCedits: self.tabRightData
            };

            setTimeout(function() {
              // self.CreateOneFormPage();
              // self.LODOP.PREVIEW();
              self.$refs.myCompDecoration.compPrintFun();
    
              // self.printFun();
            }, 100);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    changeSumNumTwo() {
      this.ceditSumNum = 0;

      this.tabRightData.forEach(jelem => {
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
      this.tabLeftData.forEach(jelem => {
        this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },

    //退饰打印事件
    printFun() {
      let self = this;
      let params = {
        type: 3,
        number: self.tabData.stockNumber
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/print",
        params,
        res => {
          self.$message.success("打印成功！");
          setTimeout(function() {
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //调拨打印事件
    printFunTwo() {
      let self = this;
      self.btnLoadingTF = true;

      let paramsOne = self.tableProData;
      self.changeSumNum();
      paramsOne.remark = self.mock;
      paramsOne.transferSlipList = self.tableRightData;
      // paramsOne.fromDiv = self.$refs.printTabThreeTab.innerHTML;
      (paramsOne.fromDiv = JSON.stringify({
        name: "调拨",
        value: "物流",
        tabRight: self.tableRightData,
        orderRemarks: self.mock
      })),
        this.$axios
          .post(self.$portMain + "/stockManagement/addAllot", paramsOne)
          .then(function(res) {
            if (res.data.code == 200) {
              self.btnLoadingTF = false;
              self.$message.success("调拨单提交成功,正在打印中,请稍等!");
              self.nowTime = self.$moment().format("YYYY年MM月DD日 HH:mm:ss");
              self.tableProData.customerName = self.tableProData.reapUnit;
              self.tableProData.sponsorUnit =
                self.tableProData.sponsorDepartment;
              self.tableProData.orderCode = self.tableProData.retreatNumber;
              self.tableProData.note = self.tableProData.remark;
              self.tableProData.transferSlips =
                self.tableProData.transferSlipList;

              self.$refs.myCompTwo.compPrintFun();
              if (!self.$refs.myCompTwo.LODOP) {
                 return;
              }
              setTimeout(function() {
                self.created_fun();
              }, 1000);
              self.viewBaoTFFour = false;
              self.mock = "";
            } else {
              self.btnLoadingTF = false;
              self.$message.error(res.data.msg);
            }
          });
    },
    CreateOneFormPage() {
      this.LODOP = this.$getLodop();
      this.LODOP.PRINT_INIT("");
      this.LODOP.SET_PRINT_STYLE("FontSize", 10);
      this.LODOP.SET_PRINT_STYLE("Bold", 1);
      // this.LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
      this.LODOP.SET_PRINT_PAGESIZE(1, "0", "136mm", "Env12");
      this.LODOP.ADD_PRINT_HTM(
        10,
        0,
        760,
        600,
        this.$refs.printTabTwo.innerHTML
      );
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
      this.tabLeftData.forEach(jelem => {
        this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    changeSumNumThree() {
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
        this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    selectable(row, index) {
      if (row.status === 1 && row.type === 1) {
        return true;
      }
      if (row.status === 2 || row.type === 2) {
        return false;
      }
    },

    //调拨出库
    stockOutFun() {
      let self = this;
      if (this.selectProId.length === 0) {
        this.$message.error("未选择入饰单，请重新选择并提交!");
        return;
      }
      let selectIdList = [];
      this.selectProId.forEach(ielem => {
        selectIdList.push(ielem.number);
      });
      var params = { PRS: { stockNumber: selectIdList.join(","), type: 1 } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findStockNumberData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderStatus = "调拨出库";
            self.inCompanyId = res.data.data.factoryId;
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
            self.proListOne = res.data.data.lists;
            let disabledTF = true;
            self.proListOne.forEach(ielem => {
              ielem.editNum = ielem.num;
              ielem.editRoughWeight = ielem.roughWeight;
              ielem.editSuttle = ielem.suttle;
              if (ielem.num > 0) {
                disabledTF = false;
              }
            });
            self.disabledTF = disabledTF;
            self.$forceUpdate();
            self.winOneTF = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //调拨出库按钮
    stockOutFunTwo() {
      let self = this;

      let baoList = [];
      let errorTF = false;
      self.baoList.forEach(ielem => {
        if (ielem.newTF && ielem.skuList.length > 0) {
          errorTF = true;
          return false;
        }
        if (ielem.skuList.length > 0) {
          let skuList = [];
          ielem.skuList.forEach(jelem => {
            //包里的产品列表
            skuList.push({
              proName: jelem.proName,
              proSkuNmber: jelem.proSkuNmber,
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
            weight: ielem.suttle,
            sum: ielem.sum,
            list: skuList
          });
        }
      });
      if (errorTF) {
        self.$message.error("请确认打包信息后，再进行调拨出库操作！");
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
            noBaoList.push({
              proName: jelem.proName,
              proSkuNmber: jelem.proSkuNmber,
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
          }
        });

        baoList.push({
          packageNumber: "",
          suttle: noBaoSuttle,
          roughWeight: noBaoRoughWeight,
          sum: noBaoSum,
          list: noBaoList
        });
      }
      if (baoList[0].list.length === 0) {
        self.$message.error(
          "调拨出库产品为空，还有未填入“复核毛重”和“复核净重”字，请重新输入提交!"
        );
        return false;
      }
      let params = {
        sponsorDepartment: "物流中心",
        reapUnit: "尚金缘金库",
        // customerId:self.inCompanyId,
        list: baoList
      };

      this.$axios
        .post(self.$portMain + "/stockManagement/allotListData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tableLeftData = res.data.data.retreatOrnament.list;
            self.tableRightData = res.data.data.transferSlipList;
            self.tableRightData.forEach(ielem => {
              ielem.purity = 1;
              self.changeNum(ielem);
            });
            self.tableProData = res.data.data.retreatOrnament;
            self.winOneTF = false;
            self.viewBaoTFFour = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //退货出库
    returnOutFun() {
      let self = this;
      //查看出货明细项目列表
      this.viewWay();
      //退回原因列表读取
      this.returnReasonFun();
      if (this.selectProId.length === 0) {
        this.$message.error("未选择入饰单，请重新选择并提交!");
        return;
      }
      let selectIdList = [];
      this.selectProId.forEach(ielem => {
        selectIdList.push(ielem.number);
      });
      var params = { PRS: { stockNumber: selectIdList.join(","), type: 2 } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findStockNumberData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderStatus = "退饰出库";
            self.inCompanyId = res.data.data.factoryId;
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
            self.inCompanyName = res.data.data.factoryName;
            self.proListOne = res.data.data.lists;
            let disabledTF = true;
            self.proListOne.forEach(ielem => {
              ielem.editNum = ielem.num;
              ielem.editRoughWeight = ielem.roughWeight;
              ielem.editSuttle = ielem.suttle;
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
    //确认退饰按钮
    returnOutFunTwo() {
      let self = this;
      if (self.inCompanyName === "") {
        self.$message.error("接收单位未确，无法确认退饰操作！");
        return false;
      }
      self.factoryList.forEach(ielem => {
        if (ielem.companyName === self.inCompanyName) {
          self.inCompanyId = ielem.companyId;
        }
      });

      let baoList = [];
      let errorTF = false;
      self.baoList.forEach(ielem => {
        if (ielem.newTF && ielem.skuList.length > 0) {
          errorTF = true;
          return false;
        }
        if (ielem.skuList.length > 0) {
          let skuList = [];
          ielem.skuList.forEach(jelem => {
            //包里的产品列表
            skuList.push({
              proName: jelem.proName,
              proSkuNmber: jelem.proSkuNmber,
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
            weight: ielem.suttle,
            sum: ielem.sum,
            list: skuList
          });
        }
      });
      if (errorTF) {
        self.$message.error("请确认打包信息后，再进行确认退饰操作！");
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
            noBaoList.push({
              proName: jelem.proName,
              proSkuNmber: jelem.proSkuNmber,
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
          }
        });

        baoList.push({
          packageNumber: "",
          weight: noBaoSuttle,
          roughWeight: noBaoRoughWeight,
          sum: noBaoSum,
          list: noBaoList
        });
      }
      if (baoList[0].list.length === 0) {
        self.$message.error(
          "退货产品为空，还有未填入“复核毛重”和“复核净重”字，请重新输入提交!"
        );
        return false;
      }
      let params = {
        sponsorDepartment: "物流中心",
        reapUnit: self.inCompanyName,
        customerId: self.inCompanyId,
        list: baoList
      };

      this.$axios
        .post(self.$portMain + "/stockManagement/findRetreatPackage", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tableLeftData = res.data.data.data.dataList;
            self.tableRightData = res.data.data.data.billingDetails;
            self.tableRightData.forEach(ielem => {
              ielem.purity = 1;
              self.changeNum(ielem);
            });

            self.tableProData = res.data.data.data.list;
            self.tableData = res.data.data;
            self.nowTime = self.$moment().format("YYYY年MM月DD日 HH:mm:ss");
            self.changeSumNumThree();

            self.winOneTF = false;
            self.viewBaoTFTwo = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //编辑和保存
    editJelem(elem, baoElem) {
      if (this.weightTF) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
        return false;
      } else {
        elem.editTF = !elem.editTF;
        this.skuListNum(baoElem);
        this.$forceUpdate();
      }
    },
    //移出
    delJelem(index, elem, baoElem) {
      this.proListOne.push(elem[index]);
      elem.splice(index, 1);
      this.skuListNum(baoElem);
    },
    //添加到包事件
    addToBaoFun(elem) {
      let self = this;
      if (this.weightTF) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
        return false;
      }

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
      let indexNum = null;
      self.proListOne.forEach((jelem, indOne) => {
        if (
          jelem.proSkuNmber === elem.proSkuNmber &&
          jelem.stockNumber === elem.stockNumber
        ) {
          indexNum = indOne;
          self.proListOne.splice(indOne, 1);
          self.$forceUpdate();
          return false;
          // self.proListOne = JSON.parse(JSON.stringify(self.proListOne.splice(indOne, 1)))
          // setTimeout(()=>{
          //   console.log('1111')

          //   self.$forceUpdate();
          //   return;
          // },1000)
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
        elem.sum = this.$api.returnFloatNum(elem.sum);
        elem.roughWeight = this.$api.returnFloatNum(elem.roughWeight);
        elem.suttle = this.$api.returnFloatNum(elem.suttle);
      });
    },
    //确认打包
    confirmBao(elem) {
      let self = this;
      if (!elem.skuList || elem.skuList.length === 0) {
        self.$message.error("此包未添加产品，请添加产品再进行确认操作！");
        return;
      }
      if (elem.roughWeight < elem.suttle) {
        this.$message.warning("毛重不可小于净重，请检查!");
        return;
      }
      let typeNum = "";
      if (self.orderStatus === "调拨出库") {
        typeNum = 2;
      }
      if (self.orderStatus === "退饰出库") {
        typeNum = 1;
      }
      var params = {
        PRS: { stockNumber: elem.skuList[0].stockNumber, type: typeNum }
      };
      this.$axios
        .get(self.$portMain + "/stockManagement/findNumber", params)
        .then(function(res) {
          if (res.data.code == 200) {
            elem.newTF = false;
            elem.baoNo = res.data.data;
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
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        // console.log(column)
        if (column.label === "金额") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              // console.log(values)
              const value = Number(curr);
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
    //调拨合计
    getSummariesTwo(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        // console.log(column)
        if (
          column.label === "毛重" ||
          column.label === "净重" ||
          column.label === "折重" ||
          column.label === "数量" ||
          column.label === "金额"
        ) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              // console.log(values)
              const value = Number(curr);
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
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    //取消
    cancelFunOne() {
      this.viewBaoTFTwo = false;
      this.btnLoadingTF = false;
    },
    //打印包号
    printBao(elem) {
      // console.log(elem)
      elem.nowSkuWeight = elem.roughWeight;
      elem.nowSkuGoldWeight = elem.suttle;
      // console.log(this.orderStatus)
      if (this.orderStatus === "退饰出库") {
        elem.customerName = this.inCompanyName;
        elem.customerTxt = "接收单位";
      }
      if (this.orderStatus === "调拨出库") {
        elem.customerName = "尚金缘金库";
        elem.customerTxt = "接收单位";
      }
      // elem.customerName = ""
      this.printBaoData = elem;
      this.$refs.printTPThree.compPrintFun();
    },
    //打印产品
    printPro(elem) {
      this.printData = elem;
      this.$refs.printTPTwo.compPrintFun();
      this.viewBaoHead = elem;
      // let self = this;
      // let dom = document.querySelector("#imgcode");
      // console.log(elem)
      // JsBarcode(dom, elem.proSkuNmber, {
      //   format: "CODE128", //选择要使用的条形码类型
      //   width: 1, //设置条之间的宽度
      //   height: 35, //高度
      //   displayValue: false, //是否在条形码下方显示文字
      //   font: "fantasy", //设置文本的字体
      //   textAlign: "center", //设置文本的水平对齐方式
      //   textPosition: "bottom", //设置文本的垂直位置
      //   textMargin: 0, //设置条形码和文本之间的间距
      //   fontSize: 15, //设置文本的大小
      //   background: "#fff", //设置条形码的背景
      //   lineColor: "#000", //设置条和文本的颜色。
      //   margin: 3 //设置条形码周围的空白边距
      // });
      // setTimeout(function() {
      //   self.LODOP = this.$getLodop();
      //   self.LODOP.PRINT_INIT("");
      //   self.LODOP.SET_PRINT_STYLE("FontSize", 10);
      //   self.LODOP.SET_PRINT_STYLE("Bold", 1);
      //   self.LODOP.SET_PRINT_PAGESIZE(1, "60mm", "40mm", "");
      //   console.log(self.$refs.printTPTwo.$el.innerHTML)
      //   self.LODOP.ADD_PRINT_HTM(
      //     10,
      //     0,
      //     760,
      //     600,
      //     self.$refs.printTPTwo.$el.innerHTML
      //   );
      //   self.LODOP.PREVIEW();
      // }, 500);
    },

    //提交并打印按钮
    submitFunOne() {
      let self = this;
      self.btnLoadingTF = true;
      // console.log(self.tableLeftData)
      // console.log(self.tableRightData)
      self.tableRightData.forEach(ielem => {
        ielem.ceditId = null;
      });
      let baoList = [];
      self.baoList.forEach(ielem => {
        let skuList = [];
        // console.log(ielem)
        ielem.skuList.forEach(jelem => {
          //包里的产品列表
          skuList.push({
            proName: jelem.proName,
            proSkuNmber: jelem.proSkuNmber,
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
      self.reasonList.forEach(ielem => {
        if (ielem.order === self.returnReason) {
          self.returnReasonVal = ielem.val;
        }
      });
      let params = {
        sponsorDepartment: "物流中心",
        reapUnit: self.inCompanyName,
        factoryId: self.inCompanyId,
        list: self.tableProData,
        billingDetails: self.tableRightData,
        // fromDiv:self.$refs.printTabOne.innerHTML,
        fromDiv: JSON.stringify({
          name: "入货明细",
          value: "物流",
          tabLeft: self.tableLeftData,
          tabRight: self.tableRightData,
          orderRemarks: self.mock
        }),
        retreatNumber: self.tableData.retreatNumber,
        returnReasonVal: self.returnReasonVal,
        returnReason: self.returnReason,
        remark: self.mock
      };
      // console.log(params)

      //  self.viewBaoTFThree = true;
      this.$axios
        .post(self.$portMain + "/stockManagement/addRetreatPackage", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.btnLoadingTF = false;
            self.returnReason = null;
            self.returnReasonVal = "";
            self.$message.success("退饰成功，正在预览打印！");

            setTimeout(function() {
              // self.mock = ''
              self.btnLoadingTF = false;
              // self.viewBaoTFThree = true;
              self.viewBaoTFTwo = false;
              self.modifyData();
              self.$refs.myComp.compPrintFun();
              // self.created_fun();
            }, 1000);
          } else {
            self.btnLoadingTF = false;
            self.$message.error(res.data.msg);
          }
        });
    },

    //组装出饰单数据
    modifyData() {
      let self = this;
      let tableLeftData = JSON.parse(JSON.stringify(self.tableLeftData));
      if (tableLeftData.length > 0) {
        tableLeftData.forEach(item => {
          (item.sku_product_type = item.conditi),
            (item.marketing_type = item.marketingCategoryName),
            (item.sku_check_weight = item.weight);
        });
      }
      self.printOutData = {
        customerName: self.tableData.reapUnit,
        outstoreCode: self.tableData.retreatNumber,
        sponsorUnit: self.tableData.sponsorDepartment,
        factoryNumber: self.tableData.factoryNumber,
        createTime: self.tableData.createTime,
        note: self.mock,
        skuCeditGroups: tableLeftData,
        outstoreCedits: self.tableRightData
      };
    },
    //打印出饰单
    printOutFun() {
      this.modifyData();
      this.$refs.myComp.compPrintFun();
      this.btnLoadingTF = false;
      this.viewBaoTFThree = false;
      this.viewBaoTFTwo = false;
      this.created_fun();
    },
    //调拨单打印
    submitFunTwo() {
      let self = this;
      this.printFun();
      // console.log(self.tableProData)
      this.viewBaoTFFour = false;
    },
    //工厂列表调接口
    factoryListFun() {
      let self = this;
      this.$axios
        .get(self.$portMain + "/supplier/supplierListSimple")
        .then(function(res) {
          if (res.data.code == 200) {
            self.factoryList = res.data.data;
            // console.log(self.factoryList)
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
    //打印sku
    skuPrintFun() {
      let self = this;

      // self.CreateOneFormPageTwo();
      // self.LODOP.PREVIEW();
      // setTimeout(function(){
      //   self.$router.push('retuInDep')
      // },1000)
    },
    CreateOneFormPageTwo() {
      this.LODOP = this.$getLodop();
      this.LODOP.PRINT_INIT("");
      this.LODOP.SET_PRINT_STYLE("FontSize", 10);
      this.LODOP.SET_PRINT_STYLE("Bold", 1);
      // this.LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
      this.LODOP.SET_PRINT_PAGESIZE(1, "0", "136mm", "Env12");
      this.LODOP.ADD_PRINT_HTM(
        10,
        0,
        760,
        600,
        this.$refs.printTabOne.innerHTML
      );
    },

    //红冲
    hcFun(elem) {
      let self = this;
      self.HCData = elem;
      this.$confirm("此操作将进行红冲操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(self.$refs.printTabTwoHC.innerHTML)
          var params = { PRS: { stockNumber: elem.number } };
          this.$axios
            .get(self.$portMain + "/stockManagement/findOffsets", params)
            .then(function(res) {
              if (res.data.code == 200) {
                // console.log(res.data.data)
                self.tabLeftDataHC = res.data.data.list;
                self.tabRightDataHC = res.data.data.listCredit;
                self.changeSumNumHC();
                self.HCWinTF = true;
              } else {
                self.$message.error(res.data.msg);
              }
            });

          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {});
    },
    //修改结算方式
    changeWayName(elem, tableData) {
      this.options.forEach(ielem => {
        if (ielem.ceditWayName === elem.ceditWayName) {
          elem.ceditWayId = ielem.ceditWayId;
          return false;
        }
      });
    },
    //确认红冲
    addHCFun() {
      let self = this;
      self.btnLoading = true;
      // console.log(self.HCData)
      let params = {
        stockNumber: self.HCData.number,
        // fromDiv: self.$refs.printTabTwoHC.innerHTML,
        fromDiv: JSON.stringify({
          name: "出货明细",
          value: "物流",
          tabLeft: self.tabLeftDataHC,
          tabRight: self.tabRightDataHC,
          orderRemarks: null
        })
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/offsets",
        params,
        res => {
          self.$message.success("红冲此单成功，正在刷新！");
          self.HCWinTF = false;
          setTimeout(function() {
            self.btnLoading = false;
            self.created_fun();
          }, 1000);
        },
        err => {
          self.btnLoading = false;
          self.$message.error(err.msg);
        }
      );
    },

    changeSumNumHC() {
      // console.log('changeSumNum')
      this.ceditSumNumHC = 0;
      if (this.tabRightDataHC) {
        this.tabRightDataHC.forEach(jelem => {
          this.ceditSumNumHC += parseFloat(
            jelem.ceditMoney ? jelem.ceditMoney : 0
          );
        });
      }

      this.skuCeditSumHC = 0;
      if (this.tabLeftDataHC) {
        this.tabLeftDataHC.forEach(jelem => {
          this.skuCeditSumHC += parseFloat(jelem.weight ? jelem.weight : 0);
        });
      }
      this.ceditSumNumHC = this.$api.returnFloatNum(this.ceditSumNumHC);
    },

    //自动算折重数量
    changeNum(elem) {
      let self = this;
      //校验数量不能为负数和小数
      if (elem.editNum) {
        elem.editNum = parseInt(elem.editNum);
        if (elem.editNum < 0) {
          elem.editNum = 0;
        }
      }
      setTimeout(() => {
        elem.suttleWeight = self.$api.returnFloatNum(elem.purity * elem.weight);
      }, 500);
      this.$forceUpdate();
    },

    renderHeader(h, para) {
      let self = this;
      return h("span", [
        h("span", para.column.label),
        h(
          "el-button",
          {
            attrs: { type: "text", style: "margin-left:10px" },
            on: {
              click: () => {
                self.typeTxt = self.typeTxt === 1 ? 2 : 1;
                self.displayAllData(1, self.pageSize);
              }
            }
          },
          self.typeTxt === 1 ? "隐藏" : "显示"
        )
      ]);
    }
  },
  filters: {
    getCeditMoney(row) {
      const { ceditWeight, ceditPriceG, ceditAmount, ceditPriceJ } = row;
      if (ceditWeight > 0 && ceditPriceG > 0) {
        const ceditMoney = Number((ceditWeight * ceditPriceG).toFixed(2));
        row.ceditMoney = ceditMoney;
        return ceditMoney;
      }
      if (ceditAmount > 0 && ceditPriceJ > 0) {
        const ceditMoney = Number((ceditAmount * ceditPriceJ).toFixed(2));
        row.ceditMoney = ceditMoney;
        return ceditMoney;
      }
      return undefined;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.input_bz {
  width: 100%;
  height: 32px;
  text-align: center;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgb(216, 220, 229);
  font-size: 13px;
  color: #5a5e66;
}

$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
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

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .width160 {
    width: 160px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth240 {
      width: 240px;
    }

    .inputWidth160 {
      width: 160px;
    }

    .itemRight {
      text-align: right;
    }

    .marginBottom {
      margin-bottom: 32px;
    }

    .fontTStyle {
      font-size: 14px;
      color: #8A9199;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .itemBottom {
      margin-bottom: 24px;
    }

    .titleStyle {
      color: #8A9199;
      font-size: 14px;
      text-align: right;
      padding-right: 24px;
    }

    .contentStyle {
      color: #2E2F33;
      font-size: 14px;
    }
  }

  .promptStyle {
    position: relative;

    .line {
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textAreaStyle {
      width: 433px;
      height: 120px;
      resize: none;
      background: rgba(240, 247, 255, 1);
    }
  }

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }

  .width70 {
    width: 80px;
  }

  .width90 {
    width: 90px;
  }

  .width240 {
    width: 240px;
  }

  .txtRed {
    color: #F20F34;
  }

  .txtBlack {
    color: #333;
  }

  .heiColor {
    color: #a6a7a9;
  }

  .padding10 {
    padding: 10px;
  }

  .padding20 {
    padding: 20px;
    font-size: 14px;
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

  .baoTabTwo {
    background: #fff;
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
    padding: 10px;
    color: #8A8E99;
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

  .top10 {
    margin-top: 10px;
  }

  .floatRight {
    float: right;
  }
}
</style>
