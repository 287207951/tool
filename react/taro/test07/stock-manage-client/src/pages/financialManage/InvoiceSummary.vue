<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>开票登记</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <div>
            <el-input
              placeholder="登记单号/发票号"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @blur="selectInvoicet"
              @keyup.enter.native="selectInvoicet"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="gray_font marignLeft8">时间筛选</span>
            <el-date-picker
              v-model="selectedDay"
              @change="selectDayFun"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
            ></el-date-picker>
            <!-- <span class="gray_font marignLeft8">客户</span>
            <el-select v-model="moni" placeholder="请选择" size="small" class="width200">
              <el-option></el-option>
            </el-select>-->
            <span class="gray_font marignLeft8">发票类型</span>
            <el-select
              v-model="invoiceType"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="selectInvoicet"
            >
              <el-option
                v-for="item in invoiceData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="gray_font marignLeft8">单据类型</span>
            <el-select
              v-model="statue"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="selectInvoicet"
            >
              <el-option
                v-for="item in statueData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="gray_font marignLeft8">客户名称</span>
            <el-select
              v-model="customerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户"
              :remote-method="remoteMethod"
              @keydown.native="customeSelect($event)"
              :loading="searchloading"
              @change="changCustomer"
              size="small"
              class="width240"
            >
              <el-option
                v-for="item in customerData"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="24">
          <el-button type="danger" size="small" @click="createFun">新增</el-button>
          <el-button type="danger" size="small" plain @click="passFun">通过</el-button>
          <el-button type="danger" size="small" plain @click="rejectFun">驳回</el-button>
          <el-button type="warning" size="small" @click="toVoid">作废</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        :row-class-name="tableRowClassName"
        :row-style="selectedHighlight"
        @row-click="rowClick"
        @row-dblclick="rowdblclick"
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop label="登记单号" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.registrationCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="客户名称" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="财务编码" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.financeCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="类型" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap" v-if="scope.row.invoiceType == '_major'">专票</span>
            <span class="nowrap" v-else-if="scope.row.invoiceType == '_general'">普票</span>
            <span class="nowrap" v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop label="发票号" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.invoiceCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="备注信息" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.invoiceNote}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceTime" label="登记时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop label="登记人员" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.invoiceName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="公司" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="nowrap">{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statue" label="单据状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.statue == '_wait'" style="color:#F26D0F">待审核</span>
            <span v-if="scope.row.statue == '_finish'">已完成</span>
            <span v-if="scope.row.statue == '_cancell'" style="color:#899199">已作废</span>
            <span v-if="scope.row.statue == '_return'" style="color:#F20F34">已驳回</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="priceSum"
          small
          background
        ></el-pagination>
      </div>
    </div>

    <div class="InvoiceWrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="开票总汇" name="first">
          <el-table
            :data="summaryData"
            style="width: 100%"
            height="320"
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
              <el-table-column prop label="件数" header-align="center" align="center" width="76"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="饰品总汇" name="second">
          <el-table
            :data="tableDataOrnament"
            style="width: 100%"
            height="320"
            border
            :summary-method="getSummaries"
            show-summary
          >
            <el-table-column label="明细" header-align="center">
              <el-table-column prop="orderCode" label="出库单号" header-align="center" align="center"></el-table-column>
              <el-table-column prop="categoryName" label="明细" header-align="center" align="center"></el-table-column>
            </el-table-column>

            <el-table-column label="转欠" header-align="center">
              <el-table-column
                prop="q_invoiceNoWeight"
                label="未开票克重(g)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="q_invoiceNoMoney"
                label="未开票金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="q_invoicePassWeight"
                label="开票克重(g)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="q_invoicePassMoney"
                label="开票金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="q_adjustMoneyLine"
                label="调整金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
            </el-table-column>

            <el-table-column label="结价" header-align="center">
              <el-table-column
                prop="j_invoiceNoWeight"
                label="未开票克重(g)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="j_invoiceNoMoney"
                label="未开票金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="j_invoicePassWeight"
                label="开票克重(g)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="j_invoicePassMoney"
                label="开票金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="j_adjustMoneyLine"
                label="调整金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="结价单" name="three">
          <el-table
            :data="tableJunctionPrice"
            style="width: 100%"
            height="320"
            border
            :summary-method="getSummaries"
            show-summary
          >
            <el-table-column label="明细" header-align="center">
              <el-table-column prop="orderCode" label="结价单号" header-align="center" align="center"></el-table-column>
              <el-table-column
                prop="j_invoiceToalWeight"
                label="结价单克重(g)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="j_invoiceToalMoney"
                label="结价单金额(￥)"
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
              ></el-table-column>
              <el-table-column
                prop="j_invoicePassMoney"
                label="金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="来料单" name="four">
          <el-table
            :data="tableIncoming"
            style="width: 100%"
            height="320"
            border
            :summary-method="getSummaries"
            show-summary
          >
            <el-table-column label="明细" header-align="center">
              <el-table-column prop="orderCode" label="来料单号" header-align="center" align="center"></el-table-column>
              <el-table-column
                prop="j_invoiceToalWeight"
                label="来料单克重(g)"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="j_invoiceToalMoney"
                label="来料单金额(￥)"
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
              ></el-table-column>
              <el-table-column
                prop="j_invoicePassMoney"
                label="金额(￥)"
                header-align="center"
                align="center"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customerId: "", //客户名称id
      customerData: [], //客户名称数据
      searchloading: false,
      loading: false,
      selectData: [], //表格选中数据
      summaryData: [], //汇总数据
      tableDataOrnament: [], //饰品表格数据
      tableJunctionPrice: [], //结价表格数据
      tableIncoming: [], //来料表格数据

      search: "", //搜索内容
      startTime: "",
      endTime: "",
      invoiceType: "",
      statue: "",

      invoiceId: "", //订单id
      getIndex: "", //选中的行的下标
      activeName: "first",
      invoiceData: [
        {
          //发票类型数据
          value: "",
          label: "全部"
        },
        {
          value: "_major",
          label: "专票"
        },
        {
          value: "_general ",
          label: "普票"
        }
      ],
      statueData: [
        {
          //单据类型数据
          value: "",
          label: "全部"
        },
        {
          value: "_wait",
          label: "待审核"
        },
        {
          value: "_finish",
          label: "完成"
        },
        {
          value: "_cancell",
          label: "作废"
        },
        {
          value: "_return",
          label: "驳回"
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
        }
      ],
      moni: "", //
      orderList: [],

      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 5, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData();
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          customerId: self.customerId,
          startTime: self.startTime,
          endTime: self.endTime,
          invoiceType: self.invoiceType,
          statue: self.statue,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.summaryData = []; //汇总数据
      this.tableDataOrnament = []; //饰品表格数据
      this.tableJunctionPrice = []; //结价表格数据
      this.tableIncoming = []; //来料表格数据

      this.$axios
        .get(this.$portMain + "/stock/invoice/invoiceList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            if (self.orderList.length > 0) {
              if (res.data.data.data[0].statue != "_cancell") {
                self.invoiceId = res.data.data.data[0].invoiceId;
                self.getOderDetail();
              }
              self.orderList.forEach((item, index) => {
                item.invoiceTime = self.$api.dateGetDayTime(item.invoiceTime);
              });
            }
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
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
    // 选中值
    handleSelectionChange(select) {
      this.selectData = select;
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    selectedHighlight({ row, rowIndex }) {
      if (this.getIndex === rowIndex) {
        return {
          "background-color": "#F2F8FF"
        };
      }
    },

    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    rowClick(row) {
      if (row.statue == "_cancell") {
        return;
      }
      this.invoiceId = row.invoiceId;
      this.getOderDetail();
    },
    //新增
    createFun() {
      this.$router.push("createInvoice");
    },
    //查看详情开票详情
    getOderDetail() {
      var self = this;
      let params = {
        PRS: {
          invoiceId: self.invoiceId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/invoice/invoiceFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // self.summaryData = res.data.data.invoiceCollects;
            self.arrangeSummaryData(res.data.data.invoiceCollects);
            self.arrangeOrnaments(res.data.data.invoicePorps);
            self.assemblejunctionPrice(res.data.data.invoicePorps);
            self.assembleIncoming(res.data.data.invoicePorps);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //处理开票汇总数据
    arrangeSummaryData(val) {
      let summaryData = [];
      val.forEach(item => {
        let startData = {
          categoryName: 0,
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
          processWeight: 0,
          processMoney: 0,
          invoiceCollectWeight: 0,
          invoiceCollectMoney: 0,
          invoiceCollectPrice: 0,
          processPrice: 0
        };
        let newObj = Object.assign(startData, item);
        summaryData.push(newObj);
      });

      this.summaryData = summaryData;
    },
    //组装饰品表格数据
    arrangeOrnaments(val) {
      let ornamentsArr = [];
      val.forEach(item => {
        if (
          item.accountInvoicePages[0].invoiceType == "_oramj" ||
          item.accountInvoicePages[0].invoiceType == "_oramq"
        ) {
          ornamentsArr.push(item);
        }
      });

      ornamentsArr.forEach(item => {
        //结价
        item.j_invoiceToalWeight = 0;
        item.j_invoiceToalMoney = 0;
        item.j_invoiceNoWeight = 0;
        item.j_invoiceNoMoney = 0;
        item.j_invoicePassWeight = 0;
        item.j_invoicePassMoney = 45850;
        item.j_invoiceType = 0;
        item.j_adjustMoneyLine = 0;
        //转欠
        item.q_invoiceToalWeight = 0;
        item.q_invoiceToalMoney = 0;
        item.q_invoiceNoWeight = 0;
        item.q_invoiceNoMoney = 0;
        item.q_invoicePassWeight = 0;
        item.q_invoicePassMoney = 0;
        item.q_invoiceType = 0;
        item.q_adjustMoneyLine = 0;

        item.accountInvoicePages.forEach(one => {
          if (one.invoiceType == "_oramj") {
            item.j_invoiceToalWeight = one.invoiceToalWeight;
            item.j_invoiceToalMoney = one.invoiceToalMoney;
            item.j_invoiceNoWeight = one.invoiceNoWeight;
            item.j_invoiceNoMoney = one.invoiceNoMoney;
            item.j_invoicePassWeight = one.invoicePassWeight;
            item.j_invoicePassMoney = one.invoicePassMoney;
            item.j_invoiceType = one.invoiceType;
            item.j_adjustMoneyLine = one.adjustMoneyLine
              ? one.adjustMoneyLine
              : 0;
          } else if (one.invoiceType == "_oramq") {
            item.q_invoiceToalWeight = one.invoiceToalWeight;
            item.q_invoiceToalMoney = one.invoiceToalMoney;
            item.q_invoiceNoWeight = one.invoiceNoWeight;
            item.q_invoiceNoMoney = one.invoiceNoMoney;
            item.q_invoicePassWeight = one.invoicePassWeight;
            item.q_invoicePassMoney = one.invoicePassMoney;
            item.q_invoiceType = one.invoiceType;
            item.q_adjustMoneyLine = one.adjustMoneyLine
              ? one.adjustMoneyLine
              : 0;
          }
        });
      });

      this.tableDataOrnament = ornamentsArr;
    },
    //组装结价表格数据
    assemblejunctionPrice(val) {
      let junctionPrice = [];
      val.forEach(item => {
        if (item.accountInvoicePages[0].invoiceType == "_knotprice") {
          junctionPrice.push(item);
        }
      });

      junctionPrice.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoicePassWeight;
          item.j_invoicePassMoney = one.invoicePassMoney;
          item.j_invoiceType = "_knotprice";
        });
      });

      this.tableJunctionPrice = junctionPrice;
    },
    //组装来料表格数据
    assembleIncoming(val) {
      let Incoming = [];
      val.forEach(item => {
        if (item.accountInvoicePages[0].invoiceType == "_comestock") {
          Incoming.push(item);
        }
      });
      Incoming.forEach(item => {
        item.accountInvoicePages.forEach(one => {
          item.j_invoiceToalWeight = one.invoiceToalWeight;
          item.j_invoiceToalMoney = one.invoiceToalMoney;
          item.j_invoiceNoWeight = one.invoiceNoWeight;
          item.j_invoiceNoMoney = one.invoiceNoMoney;
          item.j_invoicePassWeight = one.invoicePassWeight;
          item.j_invoicePassMoney = one.invoicePassMoney;
          item.j_invoiceType = "_comestock";
        });
      });

      this.tableIncoming = Incoming;
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData();
    },
    //选择发票类型
    selectInvoicet() {
      this.displayAllData();
    },
    //双击跳转事件
    rowdblclick(row) {
      if (row.statue == "_cancell") {
        return;
      }
      this.$router.push({
        path: "InvoiceDetails",
        query: { invoiceI: row.invoiceId }
      });
    },
    //通过
    passFun() {
      let self = this;
      if (this.selectData.length == 0) {
        self.$message.warning("请选择票据！");
        return;
      }

      let invoiceIds = [];
      let res = false;
      this.selectData.forEach(item => {
        if (item.statue == "_wait") {
          invoiceIds.push(item.invoiceId);
        }
        if (item.statue != "_wait") {
          res = true;
        }
      });

      if (res) {
        self.$message.warning(
          "抱歉，只有待审核的状态下才能进行审核，请重新选择！"
        );
        return;
      }

      // if (invoiceIds.length == 0) {
      //   self.$message.warning("抱歉，只有待审核的状态下才能进行审核！");
      //   return;
      // }

      let params = {
        statue: "_finish",
        invoiceIds: JSON.stringify(invoiceIds)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/updateStatue",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          //
        }
      );
    },
    //作废
    toVoid() {
      let self = this;
      if (this.selectData.length == 0) {
        self.$message.warning("请选择票据！");
        return;
      }

      let invoiceIds = [];
      let res = false;
      this.selectData.forEach(item => {
        if (item.statue == "_return") {
          invoiceIds.push(item.invoiceId);
        }

        if (item.statue != "_return") {
          res = true;
        }
      });

      if (res) {
        self.$message.warning(
          "抱歉，只有驳回的状态下才能进行作废，请重新选择！"
        );
        return;
      }

      // if (invoiceIds.length == 0) {
      //   self.$message.warning("抱歉，只有驳回的状态下才能进行作废！");
      //   return;
      // }

      let params = {
        invoiceIds: JSON.stringify(invoiceIds)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/updateCancell",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          //
        }
      );
    },
    //驳回
    rejectFun() {
      let self = this;
      if (this.selectData.length == 0) {
        self.$message.warning("请选择票据！");
        return;
      }

      let invoiceIds = [];
      let res = false;
      this.selectData.forEach(item => {
        if (item.statue == "_finish") {
          invoiceIds.push(item.invoiceId);
        }
        if (item.statue != "_finish") {
          res = true;
        }
      });

      if (res) {
        self.$message.warning(
          "抱歉，只有已完成的状态下才能进行驳回操作，请重新选择！"
        );
        return;
      }

      // if (invoiceIds.length == 0) {
      //   self.$message.warning("抱歉，只有已完成的状态下才能进行驳回操作！");
      //   return;
      // }

      let params = {
        statue: "_return",
        invoiceIds: JSON.stringify(invoiceIds)
      };

      this.$api.formdataPostFun(
        this.$portMain + "/stock/invoice/updateStatue",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          //
        }
      );
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchloading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        self.$axios
          .get(self.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.searchloading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },
    //客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.customerId = "";
        this.customerData = [];
        this.displayAllData();
      }
    },
    //选择客户
    changCustomer() {
      this.displayAllData();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
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

  .searchTxt {
    width: 256px;
  }

  .gray_font {
    color: $font-color;
    font-size: 12px;
  }

  .marignLeft8 {
    margin-left: 24px;
  }

  .pageD {
    margin-top: 8px;
    text-align: center;
  }

  .width200 {
    width: 200px;
  }

  .nowrap {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

<style>
.InvoiceWrap .el-table .cell,
.InvoiceWrap .el-table th div,
.InvoiceWrap .el-table--border td:first-child .cell,
.InvoiceWrap .el-table--border th:first-child .cell {
  padding-left: 0px;
}

.InvoiceWrap .el-table .cell {
  padding: 0px;
}

.InvoiceWrap .el-table th,
.InvoiceWrap .el-table td {
  padding: 8px 0px;
}
</style>

