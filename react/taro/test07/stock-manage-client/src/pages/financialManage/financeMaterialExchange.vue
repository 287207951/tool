<template>
  <div class="conBigDiv setTabel" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>料往来</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="客户名称/单号"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">起止时间</span>
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
          <!-- <span class="fontStyle">收料公司</span>
            <el-select v-model="value" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <!-- <span class="fontStyle">料类型</span>
            <el-select v-model="stockTypeId" placeholder="请选择" size="small">
              <el-option
                v-for="item in stockSetTypeList"
                :key="item.id"
                :label="item.material_name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="fontStyle">单据状态</span>
            <el-select v-model="billsStatue" placeholder="请选择" size="small">
              <el-option
                v-for="item in billsStatueData"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
          </el-select>-->
          <span class="fontStyle">所属区域</span>
          <el-select v-model="area" placeholder="请选择" size="small">
            <el-option v-for="item in areaData" :key="item.id" :label="item.label" :value="item.id"></el-option>
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
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tabelDta"
        row-key="id"
        :expand-row-keys="expands"
        @row-dblclick="rowClick"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%"
        height="630"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div
              class="tabelStyle"
              v-for="(item,index) in  props.row.currentAccountDeaillines"
              :key="index"
            >
              <div class="firstWrap">1</div>
              <div class="secondWrap">
                <div class="tdt">{{item.expense_way}}</div>
                <div class="tdt">{{item.debit_weight}}</div>
                <div class="tdt">{{item.debit_money}}</div>
                <div class="tdt">{{item.credit_weight}}</div>
                <div class="tdt">{{item.credit_money}}</div>
                <div class="tdt">{{item.balance_weight}}</div>
                <div class="tdt">{{item.balance_money}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="区域" prop="area"></el-table-column>
        <el-table-column label="省份" prop="province"></el-table-column>
        <el-table-column label="客户名称" prop="customer_name" width="200"></el-table-column>
        <el-table-column label="单号" prop="order_code" width="150"></el-table-column>
        <el-table-column label="客户类型" prop="customer_type">
          <template slot-scope="scope">{{analysisCustomerType(scope.row.customer_type)}}</template>
        </el-table-column>
        <el-table-column label="日期" prop="create_time" width="180"></el-table-column>
        <el-table-column label="方式">
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
      customerTypeData: [], //客户类型数据
      loading: false,
      areaData: [], //所属区域数据
      provinceData: [], //省份数据
      province: "", //省份
      area: "", //区域
      tabelDta: [], //列表数据
      expands: [],
      search: "", //搜素内容
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
      Promise.all([this.getCustomerType(), this.displayAllData()]);
      // this.displayAllData();
      this.stockSetFun();
      this.areaData = [{ id: "", label: "全部" }];
      this.areaDataFun();
      this.provinceData = this.$publicData.provinceData;
    },
    analysisCustomerType(row) {
      let name = "";
      this.customerTypeData.forEach(item => {
        if (item.key == row) {
          name = item.value;
        }
      });
      if (name == "") {
        name = row;
      }
      return name;
    },
    //获取客户类型数据
    getCustomerType() {
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientTypeListRefined", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerTypeData = res.data.data;
          } else {
            // self.$message.error(res.data.msg);
          }
        });
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          province: this.province,
          area: this.area,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/CurrentAccountStockList", params)
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
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.province = "";
      this.area = "";
      this.selectedDay = "";
      this.queryFun();
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
      width: 54%;
    }

    .secondWrap {
      display: inline-block;
      width: 46%;
      display: inline-flex;
      font-size: 14px;

      .tdt {
        flex: 1;
        padding: 0 2%;
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

