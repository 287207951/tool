<template>
  <div class="conBigDiv">
    <el-row>
      <el-col :span="12">
        <span class="menuTitle">新增开票1</span>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="danger" size="small" @click="submintFun" :loading="btnSubmintLoading">提交</el-button>
        <el-button type="danger" size="small" plain @click="deductionFun">自动扣减</el-button>
        <el-button type="danger" size="small" @click="btnSummaryFun">生成汇总</el-button>
        <el-button type="warning" size="small" @click="toVoid">作废</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top:10px">
      <el-col :span="8">
        <span class="leftTitle">开票客户</span>
        <el-select
          v-model="customerId"
          filterable
          remote
          reserve-keyword
          placeholder="请选择开票的客户"
          :remote-method="remoteMethod"
          @keydown.native="customeSelect($event)"
          @change="changCustomer"
          :loading="loading"
          size="small"
          class="width200"
        >
          <el-option
            v-for="item in customerData"
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span class="leftTitle">发票号</span>
        <el-input
          placeholder="请输入发票号"
          v-model="invoiceCode"
          class="width200"
          size="small"
          @blur="checkCode"
        ></el-input>
      </el-col>
      <el-col :span="8" style="text-align:right">
        <span class="leftTitle">备注</span>
        <el-input
          placeholder="请输入备注信息"
          v-model="invoiceNote"
          style="width:400px"
          size="small"
          @blur="goEmpty"
        ></el-input>
      </el-col>
      <el-col :span="8" style="margin-top:16px">
        <span class="leftTitle">开票类型</span>
        <el-select v-model="invoiceType" placeholder="请选择开票类型" size="small" class="width200">
          <el-option
            v-for="item in invoiceData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>

    <div style="margin-top:16px;" class="createInvoice">
      <el-table
        :data="invoiceCollectList"
        style="width: 100%"
        border
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="明细" header-align="center">
          <el-table-column
            prop="categoryName"
            label="明细"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="detailWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="detailMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="转欠" header-align="center">
          <el-table-column
            prop="oramqWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="oramqMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="oramqPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="结价" header-align="center">
          <el-table-column
            prop="knotWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="knotMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="knotPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="结价单" header-align="center">
          <el-table-column
            prop="kontorderWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="kontorderMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="kontorderPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="批发" header-align="center">
          <el-table-column
            prop="wholesaleWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="wholesaleAmount"
            label="件数"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="wholesaleMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="wholesalePrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="加工" header-align="center">
          <el-table-column
            prop="processWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="processMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="processPrice"
            label="单价"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="开票总计" header-align="center">
          <el-table-column
            prop="invoiceCollectWeight"
            label="克重(g)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="invoiceCollectMoney"
            label="金额(￥)"
            header-align="center"
            align="center"
            width="76"
          ></el-table-column>
          <el-table-column
            prop="invoiceCollectPrice"
            label="单价"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <div class="hr" />

    <div class="createInvoice">
      <el-row style="margin-bottom: 8px;">
        <el-col :span="12">
          <span class="jewelryListTitle">饰品单</span>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="danger" size="small" plain @click="ornamentsFun">选择饰品单</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableDataOrnament"
        style="width: 100%"
        height="242"
        border
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="明细" header-align="center">
          <el-table-column prop="orderCode" label="出库单号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="明细" header-align="center" align="center"></el-table-column>
        </el-table-column>

        <el-table-column label="结价" header-align="center">
          <el-table-column
            prop="j_invoiceNoWeight"
            label="未开票克重(g)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.j_invoiceNoWeight}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="j_invoiceNoMoney"
            label="未开票金额(￥)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.j_invoiceNoMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="j_invoicePassWeight"
            label="开票克重(g)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="showStatu">
                <input
                  v-if="scope.row.j_invoiceType !== ''"
                  v-model="scope.row.j_invoicePassWeight"
                  placeholder="请输入内容"
                  class="inputStyle"
                />
                <span v-else>0</span>
              </span>
              <span v-else>{{scope.row.j_invoicePassWeight}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="j_invoicePassMoney"
            label="开票金额(￥)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="showStatu">
                <input
                  v-if="scope.row.j_invoiceType !== ''"
                  v-model="scope.row.j_invoicePassMoney"
                  placeholder="请输入内容"
                  class="inputStyle"
                  @blur="comptMoneyJ(scope.row,'j_invoicePassMoney')"
                />
                <span v-else>0</span>
              </span>
              <span v-else>{{scope.row.j_invoicePassMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="j_adjustMoneyLine"
            label="调整金额(￥)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="showStatu">
                <input
                  v-if="scope.row.j_invoiceType !== ''"
                  v-model="scope.row.j_adjustMoneyLine"
                  placeholder="请输入内容"
                  class="inputStyle"
                  @blur="comptMoneyQ(scope.row,'j_adjustMoneyLine')"
                />
                <span v-else>0</span>
              </span>
              <span v-else>{{scope.row.j_adjustMoneyLine}}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="转欠" header-align="center">
          <el-table-column
            prop="q_invoiceNoWeight"
            label="未开票克重(g)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.q_invoiceNoWeight}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="q_invoiceNoMoney"
            label="未开票金额(￥)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.q_invoiceNoMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="q_invoicePassWeight"
            label="开票克重(g)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="showStatu">
                <input
                  v-if="scope.row.q_invoiceType !== ''"
                  v-model="scope.row.q_invoicePassWeight"
                  placeholder="请输入内容"
                  class="inputStyle"
                />
                <span v-else>0</span>
              </span>
              <span v-else>{{scope.row.q_invoicePassWeight}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="q_invoicePassMoney"
            label="开票金额(￥)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="showStatu">
                <input
                  v-if="scope.row.q_invoiceType !== ''"
                  v-model="scope.row.q_invoicePassMoney"
                  placeholder="请输入内容"
                  class="inputStyle"
                  @blur="comptMoneyQ(scope.row,'q_invoicePassMoney')"
                />
                <span v-else>0</span>
              </span>
              <span v-else>{{scope.row.q_invoicePassMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="q_adjustMoneyLine"
            label="调整金额(￥)"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="showStatu">
                <input
                  v-if="scope.row.q_invoiceType !== ''"
                  v-model="scope.row.q_adjustMoneyLine"
                  placeholder="请输入内容"
                  class="inputStyle"
                  @blur="comptMoneyJ(scope.row,'q_adjustMoneyLine')"
                />
                <span v-else>0</span>
              </span>
              <span v-else>{{scope.row.q_adjustMoneyLine}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <div class="hr" />
    <!-- 结价单 -->
    <div style="display:flex" class="createInvoice">
      <div style="flex:1">
        <el-row style="margin-bottom: 8px;">
          <el-col :span="12">
            <span class="jewelryListTitle">结价单</span>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="danger" size="small" plain @click="junctionPriceFun">选择结价单</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableJunctionPrice"
          style="width: 100%"
          height="242"
          border
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column label="明细" header-align="center">
            <el-table-column prop="orderCode" label="结价单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="j_invoiceToalWeight"
              label="结价克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceToalMoney"
              label="结价金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="未开票" header-align="center">
            <el-table-column
              prop="j_invoiceNoWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceNoMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="开票" header-align="center">
            <el-table-column
              prop="j_invoicePassWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="showStatu">
                  <input
                    v-model="scope.row.j_invoicePassWeight"
                    placeholder="请输入内容"
                    class="inputStyle"
                  />
                </span>
                <span v-else>{{scope.row.j_invoicePassWeight}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="j_invoicePassMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="showStatu">
                  <input
                    v-model="scope.row.j_invoicePassMoney"
                    placeholder="请输入内容"
                    class="inputStyle"
                  />
                </span>
                <span v-else>{{scope.row.j_invoicePassMoney}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>

      <div class="vline"></div>
      <!-- 来料单 -->
      <div style="flex:1" class="createInvoice">
        <el-row style="margin-bottom: 8px;">
          <el-col :span="12">
            <span class="jewelryListTitle">来料单</span>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="danger" size="small" plain @click="incomingFun">选择来料单</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableIncoming"
          style="width: 100%"
          height="242"
          border
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column label="明细" header-align="center">
            <el-table-column prop="orderCode" label="来料单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="j_invoiceToalWeight"
              label="来料克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceToalMoney"
              label="来料金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="未开票" header-align="center">
            <el-table-column
              prop="j_invoiceNoWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="j_invoiceNoMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="开票" header-align="center">
            <el-table-column
              prop="j_invoicePassWeight"
              label="克重(g)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="showStatu">
                  <input
                    v-model="scope.row.j_invoicePassWeight"
                    placeholder="请输入内容"
                    class="inputStyle"
                  />
                </span>
                <span v-else>{{scope.row.j_invoicePassWeight}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="j_invoicePassMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="showStatu">
                  <input
                    v-model="scope.row.j_invoicePassMoney"
                    placeholder="请输入内容"
                    class="inputStyle"
                  />
                </span>
                <span v-else>{{scope.row.j_invoicePassMoney}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 自动减扣 -->
    <el-dialog
      title="自动减扣"
      :visible.sync="deductionType"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="12">
            <el-radio label="1" v-model="radio2" @change="selectRadio">先减结价，再减来料</el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio label="2" v-model="radio2" @change="selectRadio">先减来料，再减结价</el-radio>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="deductionType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="deductionConfirm" size="small">确定</el-button>
      </span>
    </el-dialog>

    <!-- 饰品单 -->
    <el-dialog
      title="选择饰品单"
      :visible.sync="ornamentsType"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="ornamentsStyle">
        <div class="line"></div>
        <div>
          <el-table
            :data="ornamentsDialogData"
            style="width: 100%"
            @selection-change="handleSelectOrnaments"
            :header-cell-style="tableHeaderColor"
            border
            :summary-method="getSummariesDialog"
            show-summary
          >
            <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
            <el-table-column prop="orderCode" label="出库单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="invoiceToalWeight"
              label="出库折重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceToalMoney"
              label="金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceNoWeight"
              label="未开票克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceNoMoney"
              label="未开票金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ornamentsType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="ornamentsConfirm" size="small">确定</el-button>
      </span>
    </el-dialog>

    <!-- 选择结价单 -->
    <el-dialog
      title="选择结价单"
      :visible.sync="junctionPriceType"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="ornamentsStyle">
        <div class="line"></div>
        <div>
          <el-table
            :data="junctionPriceDialogData"
            style="width: 100%"
            @selection-change="handleSelectJunctionPrice"
            :header-cell-style="tableHeaderColor"
            border
            :summary-method="getSummariesDialog"
            show-summary
          >
            <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
            <el-table-column prop="orderCode" label="结价单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="invoiceToalWeight"
              label="结价单克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceToalMoney"
              label="结价单金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceNoWeight"
              label="未开票克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceNoMoney"
              label="未开票金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="junctionPriceType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="junctionPriceConfirm" size="small">确定</el-button>
      </span>
    </el-dialog>

    <!-- 选择来料单 -->
    <el-dialog
      title="选择来料单"
      :visible.sync="incomingType"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="ornamentsStyle">
        <div class="line"></div>
        <div>
          <el-table
            :data="incomingDialogData"
            style="width: 100%"
            @selection-change="handleSelectIncoming"
            :header-cell-style="tableHeaderColor"
            border
            :summary-method="getSummariesDialog"
            show-summary
          >
            <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
            <el-table-column prop="orderCode" label="来料单号" header-align="center" align="center"></el-table-column>
            <el-table-column
              prop="invoiceToalWeight"
              label="来料单克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceToalMoney"
              label="来料单金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceNoWeight"
              label="未开票克重(g)"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="invoiceNoMoney"
              label="未开票金额(￥)"
              header-align="center"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="incomingType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="incomingConfirm" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnSubmintLoading: false,
      customerData: [], //客户数据
      loading: false,

      showStatu: true, //表格显示状态
      customerList: [], //客户数据

      customerId: "", //客户id
      customerName: "", //客户名称
      invoiceCode: "", //开票编号
      invoiceNote: "", //备注
      invoiceType: "", //开票类型

      invoiceType: "", //查询_order 订单 _comestock 来料,_knotprice 结价
      incomingType: false, //来料弹框
      junctionPriceType: false, //结价弹框
      ornamentsType: false, //饰品弹框
      radio2: "1", //自动扣减
      deductionType: false, //自动扣减状态

      ornamentsDialogData: [], //饰品单弹框数据
      ornamentsSelect: [], //饰品单全选数据
      tableDataOrnament: [], //饰品单表格数据
      subTableDataOrnament: [], //饰品单表格数据(原始)

      junctionPriceDialogData: [], //结价单弹框数据
      junctionPriceSelect: [], //结价单全选数据
      tableJunctionPrice: [], //结价单表格数据
      subTableJunctionPrice: [], //结价单表格数据(原始)

      incomingDialogData: [], //来料单弹框数据
      incomingSelect: [], //来料单全选数据
      tableIncoming: [], //来料单表格数据
      subTableIncoming: [], //来料单表格数据(原始)

      invoiceCollectList: [], //第一个表格数据

      summaryData: {}, //生成汇总数据

      invoiceData: [
        {
          //开票类型数据
          value: "_major",
          label: "专票"
        },
        {
          value: "_general ",
          label: "普票"
        }
      ],

      tableData11: [],
      tableData1: [
        {
          moni: 78
        },
        {
          moni: 78
        },
        {
          moni: 78
        },
        {
          moni: 78
        }
      ],
      tableData: [
        {
          moni: 78
        },
        {
          moni: 78
        },
        {
          moni: 78
        },
        {
          moni: 78
        },
        {
          moni: 78
        }
      ],
      moni: "", //
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.customerListFun();
  },
  methods: {
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = (Number(prev) + Number(curr)).toFixed(2);
              return res;
            } else {
              return prev.toFixed(2);
            }
          }, 0);
          sums[index] += " ";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    //弹框合计
    getSummariesDialog(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = (Number(prev) + Number(curr)).toFixed(2);
              return res;
            } else {
              return prev.toFixed(2);
            }
          }, 0);
          sums[index] += " ";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    //自动扣减
    deductionFun() {
      if (this.subTableDataOrnament.length == 0) {
        this.$message.warning("请先生成饰品单！");
      } else if (
        this.subTableJunctionPrice.length > 0 &&
        this.subTableIncoming.length == 0
      ) {
        //先减结价
        this.radio2 = "1";
        this.summaryFun();
      } else if (
        this.subTableIncoming.length > 0 &&
        this.subTableJunctionPrice.length == 0
      ) {
        //先减来料
        this.radio2 = "2";
        this.summaryFun();
      } else if (
        this.subTableJunctionPrice.length > 0 &&
        this.subTableIncoming.length > 0
      ) {
        //弹框选择先减结价还是先减来料
        this.radio2 = "1";
        this.deductionType = true; //自动扣减状态
      } else if (
        this.subTableJunctionPrice.length == 0 &&
        this.subTableIncoming.length == 0
      ) {
        //没选结价、来料
        this.radio2 = "1";
        this.summaryFun();
      }
    },

    // 修改table header的背景色
    tableHeaderColor() {
      return "background-color: #EBF1F7;";
    },
    //选中饰品
    ornamentsFun() {
      let self = this;
      if (this.customerId == "") {
        this.$message.warning("请选择开票客户！");
        return;
      }
      this.ornamentsType = true;
      let params = {
        PRS: {
          customerId: self.customerId,
          invoiceType: "_order"
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/invoice/differentOrderList", params)
        .then(function(res) {
          self.ornamentsDialogData = res.data.data;
        });
    },
    //选中结价单
    junctionPriceFun() {
      let self = this;
      if (this.customerId == "") {
        this.$message.warning("请选择开票客户！");
        return;
      }
      this.junctionPriceType = true;
      let params = {
        PRS: {
          customerId: self.customerId,
          invoiceType: "_knotprice"
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/invoice/differentOrderList", params)
        .then(function(res) {
          self.junctionPriceDialogData = res.data.data;
        });
    },
    //选中来料
    incomingFun() {
      let self = this;
      if (this.customerId == "") {
        this.$message.warning("请选择开票客户！");
        return;
      }
      this.incomingType = true;
      let params = {
        PRS: {
          customerId: self.customerId,
          invoiceType: "_comestock"
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/invoice/differentOrderList", params)
        .then(function(res) {
          self.incomingDialogData = res.data.data;
        });
    },
    //调整款查询客户
    customerListFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/saveOweCustomerList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //饰品单全选
    handleSelectOrnaments(val) {
      this.ornamentsSelect = val;
    },
    //饰品单保存
    ornamentsConfirm() {
      let self = this;
      if (this.ornamentsSelect.length == 0) {
        this.$message.warning("请选择数据！");
        return;
      }
      this.ornamentsType = false;
      let accountIds = [];
      this.ornamentsSelect.forEach(item => {
        accountIds.push(item.accountId);
      });
      let params = {
        invoiceType: "_order",
        accountIds: JSON.stringify(accountIds)
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/differentOrderFromList",
        params,
        res => {
          self.showStatu = true;
          self.assembleOrnament(res.data);
          self.subAssembleOrnament(res.data); //自动扣减、生成汇总需要原始数据
        },
        err => {
          //
        }
      );
    },
    //组装饰品表格数据
    assembleOrnament(val) {
      let _oramj = [];
      let _oramq = [];
      this.tableDataOrnament = [];
      if (val == undefined) {
        return;
      }
      val.forEach(item => {
        if (item.accountInvoicePages.length > 0) {
          //结价
          item.j_currentLineId = "";
          item.j_invoiceToalWeight = 0;
          item.j_invoiceToalMoney = 0;
          item.j_invoiceNoWeight = 0;
          item.j_invoiceNoMoney = 0;
          item.j_addWageAndReturnMoney = 0;
          item.j_invoiceType = "";
          item.j_invoicePassWeight = 0;
          item.j_invoicePassMoney = 0;
          item.j_adjustMoneyLine = 0;
          //转欠
          item.q_currentLineId = "";
          item.q_invoiceToalWeight = 0;
          item.q_invoiceToalMoney = 0;
          item.q_invoiceNoWeight = 0;
          item.q_invoiceNoMoney = 0;
          item.q_addWageAndReturnMoney = 0;
          item.q_invoiceType = "";
          item.q_invoicePassWeight = 0;
          item.q_invoicePassMoney = 0;
          item.q_adjustMoneyLine = 0;
          item.accountInvoicePages.forEach(one => {
            if (one.invoiceType == "_oramj") {
              item.j_currentLineId = one.currentLineId;
              item.j_invoiceToalWeight = one.invoiceToalWeight;
              item.j_invoiceToalMoney = one.invoiceToalMoney;
              item.j_invoiceNoWeight = one.invoiceNoWeight;
              item.j_invoiceNoMoney = one.invoiceNoMoney;
              item.j_addWageAndReturnMoney = one.addWageAndReturnMoney;
              item.j_invoiceType = one.invoiceType;
              item.j_invoicePassWeight = one.invoiceNoWeight;
              item.j_invoicePassMoney = one.invoiceNoMoney;
              item.j_adjustMoneyLine = 0;
              if (one.invoicePassWeight != undefined) {
                item.j_invoicePassWeight = one.invoicePassWeight;
                item.j_invoicePassMoney = one.invoicePassMoney;
                item.j_adjustMoneyLine = one.adjustMoneyLine;
              }
            } else if (one.invoiceType == "_oramq") {
              item.q_currentLineId = one.currentLineId;
              item.q_invoiceToalWeight = one.invoiceToalWeight;
              item.q_invoiceToalMoney = one.invoiceToalMoney;
              item.q_invoiceNoWeight = one.invoiceNoWeight;
              item.q_invoiceNoMoney = one.invoiceNoMoney;
              item.q_addWageAndReturnMoney = one.addWageAndReturnMoney;
              item.q_invoiceType = one.invoiceType;
              item.q_invoicePassWeight = one.invoiceNoWeight;
              item.q_invoicePassMoney = one.invoiceNoMoney;
              item.q_adjustMoneyLine = 0;
              if (one.invoicePassWeight != undefined) {
                item.q_invoicePassWeight = one.invoicePassWeight;
                item.q_invoicePassMoney = one.invoicePassMoney;
                item.q_adjustMoneyLine = one.adjustMoneyLine;
              }
            }
          });
        }
      });
      this.tableDataOrnament = val;
    },
    //组装饰品表格数据（原始）
    subAssembleOrnament(val) {
      let _oramj = [];
      let _oramq = [];
      this.subTableDataOrnament = [];
      if (val == undefined) {
        return;
      }
      val.forEach(item => {
        if (item.accountInvoicePages.length > 0) {
          //结价
          item.j_currentLineId = "";
          item.j_invoiceToalWeight = 0;
          item.j_invoiceToalMoney = 0;
          item.j_invoiceNoWeight = 0;
          item.j_invoiceNoMoney = 0;
          item.j_addWageAndReturnMoney = 0;
          item.j_invoiceType = "";
          item.j_invoicePassWeight = 0;
          item.j_invoicePassMoney = 0;
          item.j_adjustMoneyLine = 0;
          //转欠
          item.q_currentLineId = "";
          item.q_invoiceToalWeight = 0;
          item.q_invoiceToalMoney = 0;
          item.q_invoiceNoWeight = 0;
          item.q_invoiceNoMoney = 0;
          item.q_addWageAndReturnMoney = 0;
          item.q_invoiceType = "";
          item.q_invoicePassWeight = 0;
          item.q_invoicePassMoney = 0;
          item.q_adjustMoneyLine = 0;
          item.accountInvoicePages.forEach(one => {
            if (one.invoiceType == "_oramj") {
              item.j_currentLineId = one.currentLineId;
              item.j_invoiceToalWeight = one.invoiceToalWeight;
              item.j_invoiceToalMoney = one.invoiceToalMoney;
              item.j_invoiceNoWeight = one.invoiceNoWeight;
              item.j_invoiceNoMoney = one.invoiceNoMoney;
              item.j_addWageAndReturnMoney = one.addWageAndReturnMoney;
              item.j_invoiceType = one.invoiceType;
              item.j_invoicePassWeight = one.invoiceNoWeight;
              item.j_invoicePassMoney = one.invoiceNoMoney;
              item.j_adjustMoneyLine = 0;
              if (one.invoicePassWeight != undefined) {
                item.j_invoicePassWeight = one.invoicePassWeight;
                item.j_invoicePassMoney = one.invoicePassMoney;
                item.j_adjustMoneyLine = one.adjustMoneyLine;
              }
            } else if (one.invoiceType == "_oramq") {
              item.q_currentLineId = one.currentLineId;
              item.q_invoiceToalWeight = one.invoiceToalWeight;
              item.q_invoiceToalMoney = one.invoiceToalMoney;
              item.q_invoiceNoWeight = one.invoiceNoWeight;
              item.q_invoiceNoMoney = one.invoiceNoMoney;
              item.q_addWageAndReturnMoney = one.addWageAndReturnMoney;
              item.q_invoiceType = one.invoiceType;
              item.q_invoicePassWeight = one.invoiceNoWeight;
              item.q_invoicePassMoney = one.invoiceNoMoney;
              item.q_adjustMoneyLine = 0;
              if (one.invoicePassWeight != undefined) {
                item.q_invoicePassWeight = one.invoicePassWeight;
                item.q_invoicePassMoney = one.invoicePassMoney;
                item.q_adjustMoneyLine = one.adjustMoneyLine;
              }
            }
          });
        }
      });
      this.subTableDataOrnament = [...val];
    },
    //全选结价单
    handleSelectJunctionPrice(val) {
      this.junctionPriceSelect = val;
    },
    //结价单保存
    junctionPriceConfirm() {
      let self = this;
      if (this.junctionPriceSelect.length == 0) {
        this.$message.warning("请选择数据！");
        return;
      }
      this.junctionPriceType = false;
      let accountIds = [];
      this.junctionPriceSelect.forEach(item => {
        accountIds.push(item.accountId);
      });
      let params = {
        invoiceType: "_knotprice",
        accountIds: JSON.stringify(accountIds)
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/differentOrderFromList",
        params,
        res => {
          self.showStatu = true;
          self.assemblejunctionPrice(res.data);
          self.subAssemblejunctionPrice(res.data);
        },
        err => {
          //
        }
      );
    },
    //组件结价表格数据
    assemblejunctionPrice(val) {
      this.tableJunctionPrice = [];
      if (val == undefined) {
        return;
      }
      val.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoiceNoWeight;
          item.j_invoicePassMoney = one.invoiceNoMoney;
          if (one.invoicePassWeight != undefined) {
            item.j_invoicePassWeight = one.invoicePassWeight;
            item.j_invoicePassMoney = one.invoicePassMoney;
          }
        });
      });

      this.tableJunctionPrice = val;
    },
    //组件结价表格数据（原始）
    subAssemblejunctionPrice(val) {
      this.subTableJunctionPrice = [];
      if (val == undefined) {
        return;
      }
      val.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoiceNoWeight;
          item.j_invoicePassMoney = one.invoiceNoMoney;
          if (one.invoicePassWeight != undefined) {
            item.j_invoicePassWeight = one.invoicePassWeight;
            item.j_invoicePassMoney = one.invoicePassMoney;
          }
        });
      });

      this.subTableJunctionPrice = [...val];
    },
    //选择来料单
    handleSelectIncoming(val) {
      this.incomingSelect = val;
    },
    //来料单保存
    incomingConfirm() {
      let self = this;
      if (this.incomingSelect.length == 0) {
        this.$message.warning("请选择数据！");
        return;
      }
      this.incomingType = false;
      let accountIds = [];
      this.incomingSelect.forEach(item => {
        accountIds.push(item.accountId);
      });
      let params = {
        invoiceType: "_comestock",
        accountIds: JSON.stringify(accountIds)
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/differentOrderFromList",
        params,
        res => {
          self.showStatu = true;
          self.assembleIncoming(res.data);
          self.subAssembleIncoming(res.data);
        },
        err => {
          //
        }
      );
    },
    //组装来料表格数据
    assembleIncoming(val) {
      this.tableIncoming = [];
      if (val == undefined) {
        return;
      }
      val.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoiceNoWeight;
          item.j_invoicePassMoney = one.invoiceNoMoney;
          if (one.invoicePassWeight != undefined) {
            item.j_invoicePassWeight = one.invoicePassWeight;
            item.j_invoicePassMoney = one.invoicePassMoney;
          }
        });
      });

      this.tableIncoming = val;
    },
    //组装来料表格数据(原始)
    subAssembleIncoming(val) {
      this.subTableIncoming = [];
      if (val == undefined) {
        return;
      }
      val.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoiceNoWeight;
          item.j_invoicePassMoney = one.invoiceNoMoney;
          if (one.invoicePassWeight != undefined) {
            item.j_invoicePassWeight = one.invoicePassWeight;
            item.j_invoicePassMoney = one.invoicePassMoney;
          }
        });
      });

      this.subTableIncoming = [...val];
    },

    //组装汇总表格数据
    assembleInvoiceCollectList(val) {
      this.invoiceCollectList = [];
      if (val == undefined) {
        return;
      }
      let invoiceCollectList = [];
      val.forEach(item => {
        let arr = {
          categoryName: "",
          detailWeight: 0,
          detailMoney: 0,
          oramqWeight: 0,
          oramqMoney: 0,
          oramqPrice: 0,
          knotWeight: 0,
          knotMoney: 0,
          knotPrice: 0,
          kontorderWeight: 0,
          kontorderMoney: 0,
          kontorderPrice: 0,
          wholesaleWeight: 0,
          wholesaleMoney: 0,
          wholesalePrice: 0,
          wholesaleAmount: 0,
          processWeight: 0,
          processMoney: 0,
          processPrice: 0,
          invoiceCollectWeight: 0,
          invoiceCollectMoney: 0,
          invoiceCollectPrice: 0
        };

        let newObj = Object.assign(arr, item);
        invoiceCollectList.push(newObj);
      });

      this.invoiceCollectList = invoiceCollectList;
    },
    //生成汇总按钮事件
    btnSummaryFun() {
      if (this.subTableDataOrnament.length == 0) {
        this.$message.warning("请先生成饰品单！");
      } else if (
        this.subTableJunctionPrice.length > 0 &&
        this.subTableIncoming.length == 0
      ) {
        //先减结价
        this.radio2 = "1";
        this.summaryFun();
      } else if (
        this.subTableIncoming.length > 0 &&
        this.subTableJunctionPrice.length == 0
      ) {
        //先减来料
        this.radio2 = "2";
        this.summaryFun();
      } else {
        this.radio2 = "1";
        this.summaryFun();
      }
    },

    //提交生成汇总
    summaryFun() {
      // subTableDataOrnament:[],//饰品单表格数据
      // subTableJunctionPrice:[],//结价单表格数据
      // subTableIncoming:[],//来料单表格数据
      let self = this;
      let invoiceComeOrder = []; //饰品数据
      this.subTableDataOrnament.forEach(item => {
        let arr = [];
        if (item.j_invoiceType !== "") {
          arr.push({
            currentLineId: item.j_currentLineId,
            invoiceToalWeight: item.j_invoiceToalWeight,
            invoiceToalMoney: item.j_invoiceToalMoney,
            invoiceNoWeight: item.j_invoiceNoWeight,
            invoiceNoMoney: item.j_invoiceNoMoney,
            addWageAndReturnMoney: item.j_addWageAndReturnMoney,
            invoiceType: item.j_invoiceType,
            invoicePassWeight: item.j_invoicePassWeight,
            invoicePassMoney: item.j_invoicePassMoney,
            adjustMoneyLine: item.j_adjustMoneyLine
          });
        }
        if (item.q_invoiceType !== "") {
          arr.push({
            currentLineId: item.q_currentLineId,
            invoiceToalWeight: item.q_invoiceToalWeight,
            invoiceToalMoney: item.q_invoiceToalMoney,
            invoiceNoWeight: item.q_invoiceNoWeight,
            invoiceNoMoney: item.q_invoiceNoMoney,
            addWageAndReturnMoney: item.q_addWageAndReturnMoney,
            invoiceType: item.q_invoiceType,
            invoicePassWeight: item.q_invoicePassWeight,
            invoicePassMoney: item.q_invoicePassMoney,
            adjustMoneyLine: item.q_adjustMoneyLine
          });
        }
        invoiceComeOrder.push({
          accountId: item.accountId,
          orderCode: item.orderCode,
          categoryName: item.categoryName,
          accountInvoicePages: arr
        });
      });

      let InvoiceComeKnot = []; //结价单数据
      this.subTableJunctionPrice.forEach(item => {
        let arr = [];
        arr.push({
          invoiceToalWeight: item.j_invoiceToalWeight,
          invoiceToalMoney: item.j_invoiceToalMoney,
          invoiceNoWeight: item.j_invoiceNoWeight,
          invoiceNoMoney: item.j_invoiceNoMoney,
          invoicePassWeight: item.j_invoicePassWeight,
          invoicePassMoney: item.j_invoicePassMoney
        });

        InvoiceComeKnot.push({
          accountId: item.accountId,
          orderCode: item.orderCode,
          accountInvoicePages: arr
        });
      });

      let InvoiceComeStock = []; //来料单数据
      this.subTableIncoming.forEach(item => {
        let arr = [];
        arr.push({
          invoiceToalWeight: item.j_invoiceToalWeight,
          invoiceToalMoney: item.j_invoiceToalMoney,
          invoiceNoWeight: item.j_invoiceNoWeight,
          invoiceNoMoney: item.j_invoiceNoMoney,
          invoicePassWeight: item.j_invoicePassWeight,
          invoicePassMoney: item.j_invoicePassMoney
        });
        InvoiceComeStock.push({
          accountId: item.accountId,
          orderCode: item.orderCode,
          accountInvoicePages: arr
        });
      });

      if (invoiceComeOrder.length == 0) {
        self.$message.warning("请先生成饰品单！");
        return;
      }

      let params = {
        type: self.radio2,
        invoiceComeOrder: JSON.stringify(invoiceComeOrder),
        InvoiceComeKnot: JSON.stringify(InvoiceComeKnot),
        InvoiceComeStock: JSON.stringify(InvoiceComeStock)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/getInvoiceDeail",
        params,
        res => {
          self.showStatu = false;
          self.summaryData = JSON.parse(JSON.stringify(res.data));
          // self.invoiceCollectList = res.data.InvoiceCollectList
          self.assembleInvoiceCollectList(res.data.InvoiceCollectList);
          self.assembleOrnament(res.data.invoiceComeOrderList);
          self.assemblejunctionPrice(res.data.invoiceComeKnotList);
          self.assembleIncoming(res.data.invoiceComeStockList);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //选择客户
    selectCustomer(val) {
      let self = this;
      this.customerList.forEach(item => {
        if (item.customerId == val) {
          self.customerName = item.customerName;
        }
      });
    },
    //提交
    submintFun() {
      let self = this;
      if (this.invoiceCollectList.length == 0) {
        this.$message.warning("请先生成汇总票据！");
        return;
      }

      if (this.invoiceCode == "") {
        this.$message.warning("请输入发票号！");
        return;
      }

      if (this.invoiceType == "") {
        this.$message.warning("请选择开票类型！");
        return;
      }

      let reg = /^[0-9a-zA-Z]+$/;
      let res = reg.test(self.invoiceCode);
      if (!res) {
        this.$message.warning("请输入正确的发票号！");
        return;
      }

      let invoice = {
        invoiceCode: self.invoiceCode,
        customerId: self.customerId,
        customerName: self.customerName,
        invoiceNote: self.invoiceNote,
        invoiceType: self.invoiceType
      };
      let params = {
        invoice: JSON.stringify(invoice),
        invoiceTotal: JSON.stringify(self.summaryData)
      };

      this.btnSubmintLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/insertInvoice",
        params,
        res => {
          self.$message.success(res.msg);
          self.btnSubmintLoading = false;
          self.$router.push("InvoiceSummary");
        },
        err => {
          self.$message.warning(err.msg);
          self.btnSubmintLoading = false;
        }
      );
    },
    //单选
    selectRadio(val) {
      this.radio2 = val;
      // this.summaryFun();
    },
    //自动扣减确定
    deductionConfirm() {
      this.summaryFun();
      this.deductionType = false;
    },
    //作废
    toVoid() {
      let self = this;
      this.$confirm("确定要作废这条票据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.$router.push("InvoiceSummary");
      });
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.loading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        //client/clientListSimple
        self.$axios
          .get(self.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.loading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },
    // 来料客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.customerId = "";
        this.customerData = [];
      }
    },
    //选择客户
    changCustomer(val) {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == val) {
          self.customerName = item.companyName;
        }
      });
    },
    //结价未开票金额校验（结价未开票金额 = 结价开票金额 + 转欠调整金额）
    comptMoneyJ(item, name) {
      if (name == "j_invoicePassMoney") {
        if (
          Number(item.j_invoicePassMoney) + Number(item.q_adjustMoneyLine) >
          item.j_invoiceNoMoney
        ) {
          this.$message.warning(
            "抱歉，结价开票金额加上转欠调整金额不能大于结价未开票金额"
          );
          item.j_invoicePassMoney = 0;
        }
      } else if (name == "q_adjustMoneyLine") {
        if (
          Number(item.j_invoicePassMoney) + Number(item.q_adjustMoneyLine) >
          item.j_invoiceNoMoney
        ) {
          this.$message.warning(
            "抱歉，结价开票金额加上转欠调整金额不能大于结价未开票金额"
          );
          item.q_adjustMoneyLine = 0;
        }
      }
    },
    //转欠未开票金额校验（转欠未开票金额 = 结价调整金额 + 转欠开票金额）
    comptMoneyQ(item, name) {
      if (name == "j_adjustMoneyLine") {
        if (
          Number(item.j_adjustMoneyLine) + Number(item.q_invoicePassMoney) >
          item.q_invoiceNoMoney
        ) {
          this.$message.warning(
            "抱歉，结价调整金额加上转欠未开票金额不能大于转欠未开票金额"
          );
          item.j_adjustMoneyLine = 0;
        }
      } else if (name == "q_invoicePassMoney") {
        if (
          Number(item.j_adjustMoneyLine) + Number(item.q_invoicePassMoney) >
          item.q_invoiceNoMoney
        ) {
          this.$message.warning(
            "抱歉，结价调整金额加上转欠未开票金额不能大于转欠未开票金额"
          );
          item.q_invoicePassMoney = 0;
        }
      }
    },
    //校验发票号
    checkCode() {
      if (this.invoiceCode != undefined) {
        this.invoiceCode = this.invoiceCode.trim();
      }

      let reg = /^[0-9a-zA-Z]+$/;
      let res = reg.test(this.invoiceCode);
      if (!res) {
        this.$message.warning("抱歉，发票号只能有数字和英文组成！");
        this.invoiceCode = "";
      }
    },
    //去空
    goEmpty() {
      if (this.invoiceNote != undefined) {
        this.invoiceNote = this.invoiceNote.trim();
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .menuTitle {
    font-size: 16px;
    color: #2E2F33;
    font-weight: bold;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 20px 0;
  }

  .inputStyle {
    width: 100%;
    height: 18px;
    // padding: 0 15px;
    text-align: center;
  }

  .leftTitle {
    font-size: 12px;
    color: #8A8E99;
  }

  .width200 {
    width: 250px;
  }

  .jewelryListTitle {
    font-size: 16px;
    color: #2E2F33;
    font-weight: bold;
  }

  .vline {
    width: 3px;
    border-left: 1px solid #d9d9d9;
    margin: 0 15px;
  }

  // 扣减
  .promptStyle {
    position: relative;

    .line {
      width: 450px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }
  }

  // 饰品
  .ornamentsStyle {
    position: relative;

    .line {
      width: 800px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }
  }

  .inputStyle::-webkit-input-placeholder {
    color: #aab2bd;
    font-size: 14px;
  }
}
</style>

<style>
.createInvoice .el-table .cell,
.createInvoice .el-table th div,
.createInvoice .el-table--border td:first-child .cell,
.createInvoice.el-table--border th:first-child .cell {
  padding-left: 0px;
}

.createInvoice .el-table .cell {
  padding: 0px;
}

.createInvoice .el-table th,
.createInvoice .el-table td {
  padding: 8px 0px;
}
</style>

