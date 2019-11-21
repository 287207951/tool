<template>
  <div class="conBigDiv setTabel" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报管理</el-breadcrumb-item>
      <el-breadcrumb-item>往来对账单</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <span class="fontStyle" style="margin-left: 0px;">客户名称</span>
          <el-select
            v-model="companyName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入客户"
            :remote-method="remoteMethod"
            @keydown.native="customeSelect($event)"
            @change="changCustomer"
            :loading="searchLoading"
            size="small"
            class="width240"
          >
            <el-option
              v-for="item in customerData"
              :key="item.companyName"
              :label="item.companyName"
              :value="item.companyName"
            ></el-option>
          </el-select>
          <span class="fontStyle">所属区域</span>
          <el-select v-model="area" placeholder="请选择" size="small">
            <el-option v-for="item in areaData" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">所属省份</span>
          <el-select v-model="province" placeholder="请选择" size="small">
            <el-option
              v-for="item in provinceData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">客户类型</span>
          <el-select v-model="customerType" placeholder="请选择" size="small">
            <el-option
              v-for="item in customerTypeData"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="fontStyle">开票状态</span>
          <el-select v-model="statue" placeholder="请选择" size="small">
            <el-option
              v-for="item in statueList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <div style="margin-top: 10px;">
            <span class="fontStyle" style="margin-left: 0px">起止时间</span>
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
            <el-button type="primary" size="small" @click="queryFun">查询</el-button>
            <span v-if="tabelDataOne.length > 0">
              <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
              <el-button size="small" @click="excelOutOne">导出Excel1</el-button>
              <el-button size="small" @click="excelOutTwo">导出Excel2</el-button>
              <el-button size="small" @click="excelOutThree">导出Excel3</el-button>
              <el-button size="small" @click="excelOutCustom">生成客户对账单</el-button>
            </span>
          </div>
        </el-col>
      </el-row>

      <!-- <div class="tableSearchWrap">
        <div class="leftWrap">
          <el-input
            v-model="resoureCode"
            placeholder="请输入单号"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
        </div>
        <div class="rightWrap">
          <el-input
            v-model="debitCountWeight"
            placeholder="请输入重量"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="debitWeight"
            placeholder="请输入重量"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="debitMoney"
            placeholder="请输入金额"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="creditWeight"
            placeholder="请输入重量"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="creditMoney"
            placeholder="请输入金额"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="balanceWeight"
            placeholder="请输入重量"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="balanceMoney"
            placeholder="请输入金额"
            size="mini"
            class="inputWrap"
            @blur="tableBlur"
          ></el-input>
        </div>
      </div> -->
      <div class="txt16 top20">用户明细表一</div>
      <el-table
        :data="tabelDataOne"
        row-key="id"
        :summary-method="getSummaries"
        show-summary
        style="width:2500px"
        height="300"
      >

        <el-table-column label="财务编码" prop="finance_code"></el-table-column>
        <el-table-column label="区域" prop="area" width="180"></el-table-column>
        <el-table-column label="省份" prop="province"></el-table-column>
        <el-table-column label="客户名称" prop="customer_name" width="200"></el-table-column>
        <el-table-column label="日期" prop="create_time" width="180"></el-table-column>
        <el-table-column label="种类" prop="stockType"></el-table-column>
        <el-table-column label="单号" prop="order_code" width="150"></el-table-column>
        <el-table-column label="方式" prop="statueName" width="150"></el-table-column>
        <el-table-column label="开票类型" prop="invoiceType"></el-table-column>

        <el-table-column label="类型重量" prop="invoiceTypeWeight" width="120"></el-table-column>
        <el-table-column label="类型金额" prop="invoiceTypeMoney" width="120"></el-table-column>
        <el-table-column label="出货重量" prop="debit_count_weight" width="120"></el-table-column>
        <el-table-column label="借方重量" prop="debit_weight" width="120"></el-table-column>
        <el-table-column label="借方金额" prop="debit_money" width="120"></el-table-column>
        <el-table-column label="贷方重量" prop="credit_weight" width="120"></el-table-column>
        <el-table-column label="贷方金额" prop="credit_money" width="120"></el-table-column>
        <el-table-column label="余额重量" prop="balance_weight" width="120"></el-table-column>
        <el-table-column label="余额金额" prop="balance_money" width="120"></el-table-column>
        <el-table-column label="已开票重量" prop="invoice_weight" width="120"></el-table-column>
        <el-table-column label="已开票金额" prop="invoice_money" width="120"></el-table-column>
        <el-table-column label="未开票重量" prop="no_invoice_weight" width="120"></el-table-column>
        <el-table-column label="未开票金额" prop="no_invoice_money" width="120"></el-table-column>

        <el-table-column label="开票状态">
          <template slot-scope="scope">
              <span v-if="scope.row.is_invoice == 'N'" class="txtYellow">未开票</span>
              <span v-if="scope.row.is_invoice == 'Y'" class="txtBlack">已开票</span>
              <span v-if="scope.row.is_invoice == 'Z'" class="txtRed">半开票</span>
            </template>
        </el-table-column>
      </el-table>
      <!-- table -->
      <!-- <div class="pageD">
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
      </div> -->
      <div>
        <div class="txt16 top20">用户明细表2</div>
        <el-table
          :data="tabelDataTwo"
          row-key="id"
          @row-dblclick="rowClick"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%"
          height="300"
        >
          <el-table-column label="财务编码" prop="finance_code"></el-table-column>
          <el-table-column label="区域" prop="area" width="180"></el-table-column>
          <el-table-column label="省份" prop="province"></el-table-column>
          <el-table-column label="客户名称" prop="customer_name" width="200"></el-table-column>
          <el-table-column label="开票类型" prop="invoiceType"></el-table-column>

          <el-table-column label="类型重量" prop="invoiceTypeWeight" width="120"></el-table-column>
          <el-table-column label="类型金额" prop="invoiceTypeMoney" width="120"></el-table-column>
          <el-table-column label="结价重量" prop="adjustWeight" width="120"></el-table-column>
          <el-table-column label="结价金额" prop="adjustMoney" width="120"></el-table-column>
          <el-table-column label="转欠重量" prop="saveOweWeight" width="120"></el-table-column>
          <el-table-column label="转欠金额" prop="saveOweMoney" width="120"></el-table-column>
          <el-table-column label="结价单重量" prop="adjustOrderWeight" width="120"></el-table-column>
          <el-table-column label="结价单金额" prop="adjustOrderMoney" width="120"></el-table-column>
          <el-table-column label="来料克重" prop="comeStockWeight" width="120"></el-table-column>
          <el-table-column label="来料金额" prop="comeStockMoney" width="120"></el-table-column>
          <el-table-column label="来款金额" prop="comerAccountMoney" width="120"></el-table-column>
        </el-table>
        <a ref="xlsDownloadA"></a>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      showAllRow: false,
      loading: false,
      searchLoading: false,
      companyName: "", //客户名称
      customerData: [], //客户名称数据
      areaData: [], //所属区域数据
      provinceData: [], //省份数据
      province: "", //省份
      area: "全部", //区域
      tabelDataOne: [], //列表数据
      tabelDataTwo: [], //列表数据
      expands: [],
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间

      resoureCode: "", //单号
      debitCountWeight: "", //计价重量
      debitWeight: "", //借方重量
      debitMoney: "", //借方金额
      creditWeight: "", //贷方重量
      creditMoney: "", //贷方金额
      balanceWeight: "", //余额重量
      balanceMoney: "", //余额金额

      stockTypeId: "", //料类型
      billsStatue: "", //单据类型
      stockSetTypeList: [], // 料类型数据
      allData: [], //料转饰数据
      billsStatueData: [
        {
          id: "",
          label: "全部"
        },
        {
          // 单据状态
          id: 1,
          label: "待审核"
        },
        {
          id: 2,
          label: "审核通过"
        },
        {
          id: 3,
          label: "审核驳回"
        }
      ],
      value: "", //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      statue: "", // 单据方式
      statueList: [
        { id: "", label: "全部" },
        { id: 1, label: "已开票" },
        { id: 2, label: "未开票" },
        { id: 3, label: "半开票" },
      ],
      customerType: "", //客户类型
      customerTypeData: [],
      customerId:null,//客户ID
    };
  },
  created() {
    this.created_fun();
    this.getCustomerType();
  },
  methods: {
    //获取客户类型数据
    getCustomerType() {
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientTypeListRefined", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerTypeData = res.data.data;
            self.customerTypeData.unshift({
              value: "全部",
              key: ""
            });
          } else {
            // self.$message.error(res.data.msg);
          }
        });
    },
    created_fun() {
      // this.$api.dateGetDay()
      
      this.stockSetFun();
      this.getAreaData();
      this.provinceData = this.$publicData.provinceData;
      // this.displayAllData();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          // resoureCode: self.resoureCode, //单号
          // debitCountWeight: self.debitCountWeight, //计价重量
          // debitWeight: self.debitWeight, //借方重量
          // debitMoney: self.debitMoney, //借方金额
          // creditWeight: self.creditWeight, //贷方重量
          // creditMoney: self.creditMoney, //贷方金额
          // balanceWeight: self.balanceWeight, //余额重量
          // balanceMoney: self.balanceMoney, //余额金额
          search: self.companyName,
          startTime: self.startTime,
          endTime: self.endTime,
          province: self.province,
          // customerType: self.customerType == "全部" ? "" : self.customerType,
          // statue: self.statue,
          area: self.area == "全部" ? "" : self.area,
          // page: self.pageNum,
          // rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/currentAccountTotalNumber", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tabelDataOne = res.data.data.currentAccounDeailPropsList;
            self.tabelDataTwo = res.data.data.currentAccounDeailProList;
            self.tabelDataOne.forEach((item, index) => {
              item.create_time = self.$api.dateGetDayTime(item.create_time);
            });
            self.tabelDataTwo.forEach((item, index) => {
              item.create_time = self.$api.dateGetDayTime(item.create_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
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
          column.label === "类型重量" ||
          column.label === "类型金额" ||
          column.label === "出货重量" ||
          column.label === "借方重量" ||
          column.label === "借方金额" ||
          column.label === "贷方重量" ||
          column.label === "贷方金额" ||
          column.label === "余额重量" ||
          column.label === "余额金额" ||
          column.label === "已开票重量" ||
          column.label === "已开票金额" ||
          column.label === "未开票重量" ||
          column.label === "未开票金额" ||
          column.label === "结价重量" ||
          column.label === "结价金额" ||
          column.label === "转欠重量" ||
          column.label === "转欠金额" ||
          column.label === "结价单重量" ||
          column.label === "结价单金额" 
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
    //导出往来对账单，主表（两张都存在）
    excelOutOne(){
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.companyName,
          startTime: self.startTime,
          endTime: self.endTime,
          province: self.province,
          area: self.area == "全部" ? "" : self.area,
        }
      };
      this.$axios
        .get(this.$portMain + "/templateExcelstock/currentAccountTotalFrist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            var baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "往来对账单-主表." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //导出往来对账单，主表（两张都存在）
    excelOutTwo(){
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.companyName,
          startTime: self.startTime,
          endTime: self.endTime,
          province: self.province,
          area: self.area == "全部" ? "" : self.area,
        }
      };
      this.$axios
        .get(this.$portMain + "/templateExcelstock/currentAccountTotalSecond", params)
        .then(function(res) {
          if (res.data.code == 200) {
            var baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "往来对账单-副表1." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //导出往来对账单，主表（两张都存在）
    excelOutThree(){
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.companyName,
          startTime: self.startTime,
          endTime: self.endTime,
          province: self.province,
          area: self.area == "全部" ? "" : self.area,
        }
      };
      this.$axios
        .get(this.$portMain + "/templateExcelstock/currentAccountTotalThree", params)
        .then(function(res) {
          if (res.data.code == 200) {
            var baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "往来对账单-副表2." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //按客户导出模版
    excelOutCustom(){
      this.loading = true;
      var self = this;

      let params = {
        PRS: {
          customerId: self.companyId,
          startTime: self.startTime,
          endTime: self.endTime,
        }
      };
      // console.log(self.companyName)
      self.customerData.forEach(ielem=>{
        if(ielem.companyName === self.companyName){
          self.companyId = ielem.companyId
          return
        }
      })
      this.$axios
        .get(this.$portMain + "/templateExcelstock/currentAccountExcelBycoustomer", params)
        .then(function(res) {
          if (res.data.code == 200) {
            var baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "客户对账单." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 编辑单
    editGold(elem) {
      // this.$router.push({
      //   path: "financeMaterialTransferDetail",
      //   query: { stockToOrnamentId: elem.id }
      // });
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
    // 查询事件
    queryFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    // 新建发料
    createdFun() {
      this.$router.push("creatMaterialTransfer");
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
    },
    //查询金料类型
    stockSetFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetTypeList = res.data.data;
            //material_name
            self.stockSetTypeList.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //重置
    resetFun() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.province = "";
      this.area = "全部";
      this.selectedDay = "";
      this.statue = "";
      this.customerType = "全部";
      this.resoureCode = ""; //单号
      this.debitCountWeight = ""; //计价重量
      this.debitWeight = ""; //借方重量
      this.debitMoney = ""; //借方金额
      this.creditWeight = ""; //贷方重量
      this.creditMoney = ""; //贷方金额
      this.balanceWeight = ""; //余额重量
      this.balanceMoney = ""; //余额金额
      this.companyName = "";
      this.customerData = [];
      this.tabelDataOne = [];
      this.tabelDataTwo = [];
      // this.queryFun();
    },
    toggleRowShow() {
      this.expands = [];
      if (this.showAllRow) {
        this.showAllRow = false;
      } else {
        this.tabelDataOne.map(v => this.expands.push(v.id));
        this.showAllRow = true;
      }
    },
    rowClick(row, event, column) {
      Array.prototype.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      if (this.expands.indexOf(row.id) < 0) {
        this.expands.push(row.id);
      } else {
        this.expands.remove(row.id);
      }
    },

    //获取区域数据
    getAreaData() {
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientArea", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.areaData = res.data.data;
            self.areaData.unshift("全部");
          } else {
            // self.$message.error(res.data.msg);
          }
        });
    },

    //下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchLoading = true;
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
              self.searchLoading = false;
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
        this.companyName = "";
        this.customerData = [];
      }
    },
    //选择客户
    changCustomer(val) {
      // this.search = val;
    },
    //表格搜索
    tableBlur() {
      let patt = /^[A-Za-z0-9]+$/;
      if (this.resoureCode != "") {
        let result = patt.test(this.resoureCode);
        if (!result) {
          this.$message.error("请输入正确的订单号！");
          this.resoureCode = "";
          return;
        }
      }
      if (this.debitCountWeight != "") {
        if (isNaN(this.debitCountWeight)) {
          this.$message.error("抱歉只能输入数字！");
          this.debitCountWeight = "";
          return;
        }
      }

      if (this.debitWeight != "") {
        if (isNaN(this.debitWeight)) {
          this.$message.error("抱歉只能输入数字！");
          this.debitWeight = "";
          return;
        }
      }

      if (this.debitMoney != "") {
        if (isNaN(this.debitMoney)) {
          this.$message.error("抱歉只能输入数字！");
          this.debitMoney = "";
          return;
        }
      }

      if (this.creditWeight != "") {
        if (isNaN(this.creditWeight)) {
          this.$message.error("抱歉只能输入数字！");
          this.creditWeight = "";
          return;
        }
      }

      if (this.creditMoney != "") {
        if (isNaN(this.creditMoney)) {
          this.$message.error("抱歉只能输入数字！");
          this.creditMoney = "";
          return;
        }
      }

      if (this.balanceWeight != "") {
        if (isNaN(this.balanceWeight)) {
          this.$message.error("抱歉只能输入数字！");
          this.balanceWeight = "";
          return;
        }
      }

      if (this.balanceMoney != "") {
        if (isNaN(this.balanceMoney)) {
          this.$message.error("抱歉只能输入数字！");
          this.balanceMoney = "";
          return;
        }
      }
      this.pageNum = 1;
      this.pageSize = 12;
      this.displayAllData();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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

  .tableWrap {
    .thWrap {
      font-size: 14px;
      color: #8A8E99;
      display: flex;
      border-bottom: 1px solid #E4E7F0;
      height: 48px;
      align-items: center;

      span {
        flex: 1;
        padding-left: 10px;
        padding-right: 10px;
      }
    }

    .tbody {
      .tr {
        display: flex;
        min-height: 48px;
        align-items: center;
        border-bottom: 1px solid #E4E7F0;
        box-sizing: border-box;
        padding-top: 12px;
        padding-bottom: 12px;

        &:hover {
          background-color: #f5f7fa;
        }
      }

      .td {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 14px;
        color: rgb(90, 94, 102);

        .lastTd {
          position: relative;

          .el-icon-arrow-right {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }

  .tabelStyle {
    height: 48px;
    // overflow hidden
    border-bottom: 1px solid #E4E7F0;
    line-height: 48px;

    &:last-child {
      border-bottom: 0px solid #E4E7F0;
    }

    font-size: 0;

    .firstWrap {
      display: inline-block;
      width: 53%;
    }

    .secondWrap {
      display: inline-block;
      width: 47%;
      display: inline-flex;
      font-size: 14px;

      .tdt {
        flex: 1;
        padding: 0 6px;
      }
    }
  }

  .tableSearchWrap {
    display: flex;
    background: #f5f7fa;
    height: 48px;
    align-items: center;

    .leftWrap {
      // background: red;
      flex: 24;

      .inputWrap {
        margin-left: 45%;
        max-width: 110px;
        width: 13%;
      }
    }

    .rightWrap {
      // background: yellow;
      flex: 17;
      display: flex;

      .inputWrap {
        margin-right: 3%;
        max-width: 80px;
        width: 11%;
      }
    }
  }
}
</style>

<style>
.setTabel .el-table__expanded-cell {
  padding: 0px;
}
</style>

