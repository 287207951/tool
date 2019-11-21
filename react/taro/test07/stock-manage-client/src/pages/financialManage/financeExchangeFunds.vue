<template>
  <div class="conBigDiv setTabel" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>款往来</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <!-- <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>-->
          <span class="fontStyle" style="margin-left: 0px;">客户名称</span>
          <el-select
            v-model="search"
            filterable
            remote
            reserve-keyword
            placeholder="请输入客户"
            :remote-method="remoteMethod"
            @keydown.native="customeSelect($event)"
            @change="changCustomer"
            :loading="searchLoading"
            size="small"
            class="width200"
          >
            <el-option
              v-for="item in customerData"
              :key="item.companyName"
              :label="item.companyName"
              :value="item.companyName"
            ></el-option>
          </el-select>

          <span class="fontStyle">所属区域</span>
          <el-select v-model="area" placeholder="请选择" size="small" class="width200">
            <el-option v-for="item in areaData" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
          <span class="fontStyle">所属省份</span>
          <el-select v-model="province" placeholder="请选择" size="small" class="width200">
            <el-option
              v-for="item in provinceData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>

          <span class="fontStyle">支付方式</span>
          <el-select v-model="account_type" placeholder="请选择" size="small" class="width200">
            <el-option
              v-for="item in paymentData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <span class="fontStyle">来款性质</span>
          <el-select v-model="pay_type" placeholder="请选择" size="small" class="width200">
            <el-option
              v-for="item in incomingMoneyData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="margin-top:20px">
        <el-col :span="24">
          <span class="fontStyle" style="margin-left: 0px;">起止时间</span>
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
        </el-col>
      </el-row>

      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
          <el-button type="danger" plain size="small" @click="exportFun">导出Excel</el-button>
        </el-col>
      </el-row>

      <div class="tableSearchWrap">
        <div class="leftWrap">
          <el-input
            v-model="resoureCode"
            placeholder="请输入单号"
            size="mini"
            class="inputWrap"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
        </div>
        <div class="rightWrap">
          <el-input
            v-model="debitWeight"
            placeholder="请输入"
            size="mini"
            class="inputWrap"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="debitMoney"
            placeholder="请输入"
            size="mini"
            class="inputWrap"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="creditWeight"
            placeholder="请输入"
            size="mini"
            class="inputWrap"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="creditMoney"
            placeholder="请输入"
            size="mini"
            class="inputWrap"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="balanceWeight"
            placeholder="请输入"
            size="mini"
            class="inputWrap"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
          <el-input
            v-model="balanceMoney"
            placeholder="请输入"
            size="mini"
            class="inputWrap"
            style="margin-right:0px"
            @keyup.enter.native="tableBlur"
            @blur="tableBlur"
          ></el-input>
        </div>
      </div>
      <el-table
        :data="tabelDta"
        :cell-style="rowClass"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%"
        height="630"
      >
        <el-table-column label="区域" prop="area"></el-table-column>
        <el-table-column label="省份" prop="province"></el-table-column>
        <el-table-column label="客户名称" prop="customer_name" width="200"></el-table-column>
        <el-table-column label="日期" prop="create_time" width="180"></el-table-column>
        <el-table-column label="单据单号" prop="order_code" width="150"></el-table-column>
        <!-- <el-table-column label="客户类型" prop="customer_type"></el-table-column> -->
        <el-table-column label="单据方式">
          <template slot-scope="scope">
            <span v-if="scope.row.statue == '1'">收料</span>
            <span v-if="scope.row.statue == '2'">发料</span>
            <span v-if="scope.row.statue == '3'">来款</span>
            <span v-if="scope.row.statue == '4'">退款</span>
            <span v-if="scope.row.statue == '5'">调整款</span>
            <span v-if="scope.row.statue == '6'">客户结价</span>
            <span v-if="scope.row.statue == '7'">出客户饰</span>
            <span v-if="scope.row.statue == '8'">金库入饰品</span>
            <span v-if="scope.row.statue == '9'">金库出饰</span>
            <span v-if="scope.row.statue == '10'">收客户饰</span>
            <span v-if="scope.row.statue == '11'">物流入饰</span>
            <span v-if="scope.row.statue == '12'">物流出饰</span>
          </template>
        </el-table-column>
        <el-table-column label="来款性质">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type == '1'">公对公</span>
            <span v-else-if="scope.row.pay_type == '2'">私对公</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.account_type == '1'">现金</span>
            <span v-else-if="scope.row.account_type == '2'">转账</span>
            <span v-else-if="scope.row.account_type == '3'">支付宝</span>
            <span v-else-if="scope.row.account_type == '4'">微信</span>
            <span v-else-if="scope.row.account_type == '5'">调整款</span>
            <span v-else-if="scope.row.account_type == '6'">刷卡</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="来款银行" prop="account_bank"></el-table-column>
        <el-table-column label="借方重量" prop="debit_weight"></el-table-column>
        <el-table-column label="借方金额" prop="debit_money"></el-table-column>
        <el-table-column label="贷方重量" prop="credit_weight"></el-table-column>
        <el-table-column label="贷方金额" prop="credit_money"></el-table-column>
        <el-table-column label="余额重量" prop="balance_weight"></el-table-column>
        <el-table-column label="余额金额" prop="balance_money"></el-table-column>
      </el-table>
      <!-- table -->
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
    </div>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      resoureCode: "", //单号
      debitWeight: "", //借方重量
      debitMoney: "", //借方金额
      creditWeight: "", //贷方重量
      creditMoney: "", //贷方金额
      balanceWeight: "", //余额重量
      balanceMoney: "", //余额金额

      loading: false,
      searchLoading: false,
      customerData: [], //客户名称
      paymentData: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "现金"
        },
        {
          value: 2,
          label: "转账"
        },
        {
          value: 3,
          label: "支付宝"
        },
        {
          value: 4,
          label: "微信"
        },
        {
          value: 5,
          label: "调整款"
        },
        {
          value: 6,
          label: "刷卡"
        }
      ], //支付方式
      incomingMoneyData: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "公对公"
        },
        {
          value: 2,
          label: "私对公"
        }
      ], //来款性质
      areaData: [], //所属区域数据
      provinceData: [], //省份数据
      province: "", //省份
      area: "", //区域
      tabelDta: [], //列表数据
      expands: [],
      search: "", //客户名称
      account_type: "", //支付方式
      pay_type: "", //来款性质
      startTime: "", //开始时间
      endTime: "", //结束时间
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
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
      this.stockSetFun();
      this.areaData = [{ id: "", label: "全部" }];
      this.areaDataFun();
      this.provinceData = this.$publicData.provinceData;
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          resoureCode: this.resoureCode, //单号
          debitWeight: this.debitWeight, //借方重量
          debitMoney: this.debitMoney, //借方金额
          creditWeight: this.creditWeight, //贷方重量
          creditMoney: this.creditMoney, //贷方金额
          balanceWeight: this.balanceWeight, //余额重量
          balanceMoney: this.balanceMoney, //余额金额
          account_type: this.account_type,
          pay_type: this.pay_type,
          search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          province: this.province,
          area: this.area,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/CurrentAccountMoneyList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tabelDta = res.data.data.data;
            // self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.tabelDta.forEach((item, index) => {
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "借方重量" ||
          column.label === "借方金额" ||
          column.label === "贷方重量" ||
          column.label === "贷方金额" ||
          column.label === "余额重量" ||
          column.label === "余额金额"
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
      this.created_fun();
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
        this.queryFun();
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
      this.resoureCode = ""; //单号
      this.debitWeight = ""; //借方重量
      this.debitMoney = ""; //借方金额
      this.creditWeight = ""; //贷方重量
      this.creditMoney = ""; //贷方金额
      this.balanceWeight = ""; //余额重量
      this.balanceMoney = ""; //余额金额
      this.account_type = "";
      this.pay_type = "";
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.province = "";
      this.area = "";
      this.selectedDay = "";
      this.queryFun();
    },

    // rowClick(row, event, column) {
    //   Array.prototype.remove = function(val) {
    //     let index = this.indexOf(val);
    //     if (index > -1) {
    //       this.splice(index, 1);
    //     }
    //   };

    //   if (this.expands.indexOf(row.id) < 0) {
    //     this.expands.push(row.id);
    //   } else {
    //     this.expands.remove(row.id);
    //   }
    // },
    //获取所属区域数据
    areaDataFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/client/clientArea")
        .then(function(res) {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              self.areaData.push({
                id: item,
                label: item
              });
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    rowClass({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex == 9 ||
        columnIndex == 10 ||
        columnIndex == 13 ||
        columnIndex == 14
      ) {
        return "background-color: #F5F7FA;";
      }
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
        this.search = "";
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
      this.displayAllData();
    },
    //导出
    exportFun() {
      let self = this;
      let params = {
        PRS: {
          excelTypeName: "moneyComeAndGo"
        }
      };

      this.$axios
        .get(
          this.$portMain + "/templateExcelstock/currentAccountMoneyListExcel",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "款往来." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            let xlsDownloadA = document.createElement("a");
            xlsDownloadA.download = self.fname;
            xlsDownloadA.href = URL.createObjectURL(blob);
            xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
          }
        });
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

  .width200 {
    width: 200px;
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

  .tableSearchWrap {
    display: flex;
    background: #f5f7fa;
    height: 48px;
    align-items: center;

    .leftWrap {
      // background: red;
      flex: 27;

      .inputWrap {
        margin-left: 52%;
        max-width: 110px;
        width: 13%;
      }
    }

    .rightWrap {
      // background: yellow;
      flex: 14;
      display: flex;

      .inputWrap {
        margin-right: 6%;
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

