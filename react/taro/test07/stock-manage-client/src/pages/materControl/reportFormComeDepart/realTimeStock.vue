<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>报表(金库收料部)</el-breadcrumb-item>
      <el-breadcrumb-item>料实时库存</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <!-- <el-input placeholder="请输入关键字搜索" v-model="search" class="input-with-select searchTxt" size="small">
              <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>-->
          <span class="titleStyle">时间筛选</span>
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
          <span class="fontStyle">存货柜</span>
          <el-select v-model="counter_id" placeholder="请选择" size="small">
            <el-option
              v-for="item in findPositionData"
              :key="item.id"
              :label="item.enter_counter"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">料类型</span>
          <el-select v-model="stock_type_id" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">料种类</span>
          <el-select v-model="stock_kind_id" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetKindData"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <span class="fontStyle">所属部门</span>
          <el-select v-model="departId" placeholder="请选择" size="small">
            <el-option
              v-for="item in departData"
              :key="item.id"
              :label="item.stockName"
              :value="item.id"
            ></el-option>
          </el-select>-->
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="queryFun">查询</el-button>
          <el-button type="primary" size="small" @click="resetQueryFun" plain>重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        @selection-change="handleSelectionChange"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="depart_name" label="部门"></el-table-column>
        <el-table-column prop="output_counter" label="存货柜"></el-table-column>
        <el-table-column prop="stock_kind" label="料种类"></el-table-column>
        <el-table-column prop="stock_type" label="料类型"></el-table-column>
        <el-table-column prop="deposit_pur_weight" label="上存净重(g)"></el-table-column>
        <el-table-column prop="deposit_net_weight" label="上存折重(g)"></el-table-column>
        <el-table-column prop="input_pur_weight" label="入库净重(g)"></el-table-column>
        <el-table-column prop="input_net_weight" label="入库折重(g)"></el-table-column>
        <el-table-column label="出库净重(g)" prop="output_pur_weight"></el-table-column>
        <el-table-column prop="output_net_weight" label="出库折重(g)"></el-table-column>
        <el-table-column prop="now_save_pur_weight" label="现存净重(g)"></el-table-column>
        <el-table-column label="现存折重(g)" prop="now_save_net_weight"></el-table-column>
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
    </div>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      departId: "20", //所属部门id
      departData: [], //所属部门数据
      search: "", //搜素内容
      stock_kind_id: "", // 金料种类
      startTime: "", //开始时间
      endTime: "", //结束时间
      stock_type_id: "", //金料类型
      counter_id: "", //柜id
      goldTableData: [], //测金表格数据
      goldDetail: {}, //测金数据
      editTableData: [], // 提交编辑熔前后数据
      editData: {}, //提交编辑的数据
      inputStockOrderLines: [
        {
          // 提交创建熔前后数据
          number: "1",
          before_weight: "",
          after_weight: ""
        }
      ],
      findPositionData: [], //库柜数据
      stockSetTypeList: [], // 料类型数据
      stockSetKindData: [], //料种类下拉数据
      submitCreatData: {
        // 提交创建预收单数据
        customer_id: 96511,
        customer_name: "衢州市周福生珠宝有限公司",
        stock_kind_id: 21,
        stock_kind: "旧料",
        company_id: 91681,
        company_name: "尚金缘",
        customer_type: "客户",
        area: "西南",
        province: "河南",
        finance_code: "02315",
        inputStockOrderLines: []
      },
      stockData: [
        {
          // 料种类
          id: 21,
          name: "旧料"
        },
        {
          id: 22,
          name: "板料"
        }
      ],
      companyData: [
        {
          // 公司数据
          id: 91681,
          name: "尚金缘"
        }
      ],
      customerData: [
        {
          // 客户数据
          id: 96511,
          name: "衢州市周福生珠宝有限公司"
        }
      ],
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      editPlanType: false, // 编辑预收单
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
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
      this.findPosition();
      this.findStockSetKind();
      // this.departDataFun();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          // search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          counter_id: this.counter_id,
          stock_type_id: this.stock_type_id,
          stock_kind_id: this.stock_kind_id,
          departId: this.departId,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/stockNowStoreListComeDepart", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            // self.parageraphList.forEach((item, index) => {
            //   item.create_time = self.$api.dateGetDay(item.create_time);
            // });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 获取所属部门数据
    departDataFun() {
      let self = this;
      let params = {
        PRS: {
          statue: 1
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/stockposition/order/list", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.departData = res.data.data;
            self.departData.unshift({
              id: "",
              stockName: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
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
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.stock_type_id = this.stock_kind_id = this.counter_id = this.selectedDay =
        "";
      this.queryFun();
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
            self.stockSetTypeList.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询柜信息
    findPosition() {
      //findPositionData
      let self = this;
      let params = {
        PRS: {
          departId: 20
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
            self.findPositionData.unshift({
              id: "",
              enter_counter: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 查询金料种类
    findStockSetKind() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
            self.stockSetKindData.unshift({
              id: "",
              material_name: "全部"
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

  .titleStyle {
    color: #8A8E99;
    font-size: 14px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }
}
</style>
