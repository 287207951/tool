<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>报表(金库收料部)</el-breadcrumb-item>
      <el-breadcrumb-item>料出入库</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="接收单位"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">时间筛选</span>
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
          <!-- <span class="fontStyle">所属区域</span>
            <el-select v-model="customerType" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="fontStyle">所属省份</span>
            <el-select v-model="stockType" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <span class="fontStyle">料种类</span>
          <el-select v-model="stockKindId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetKindData"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">料类型</span>
          <el-select v-model="stockTypeId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetTypeList"
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
          <span class="fontStyle">客户类型</span>
          <el-select v-model="customer_type" placeholder="请选择" size="small">
            <el-option
              v-for="item in customerTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <span class="titleFont">所属区域</span>
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
          <!-- <span class="fontStyle">客户类型</span>
          <el-select v-model="customer_type" placeholder="请选择" size="small">
            <el-option
              v-for="item in customerTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>-->
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="12">
          <el-button type="primary" size="small" @click="queryFun">查询</el-button>
          <el-button type="primary" size="small" @click="resetQueryFun" plain>重置</el-button>
        </el-col>
        <el-col :span="12" class="totalDes" v-show="false">
          <span>总计：来款总金额￥36598544.36</span>
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        :summary-method="getSummaries"
        show-summary
        @selection-change="handleSelectionChange"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="create_time" label="日期"></el-table-column>
        <el-table-column prop="depart_name" label="部门名称" width="150"></el-table-column>
        <el-table-column prop="customer_name" label="客户名称" width="150"></el-table-column>
        <el-table-column prop="area" label="区域"></el-table-column>
        <el-table-column prop="province" label="省份"></el-table-column>
        <el-table-column prop="customer_type" label="客户类型"></el-table-column>
        <el-table-column prop="stock_kind" label="料种类"></el-table-column>
        <el-table-column prop="stock_type" label="料类型"></el-table-column>
        <el-table-column label="入料净重(g)" prop="input_pur_weight"></el-table-column>
        <el-table-column prop="input_net_weight" label="入料折重(g)"></el-table-column>
        <el-table-column prop="output_pur_weight" label="出料净重(g)"></el-table-column>
        <el-table-column label="出料折重(g)" prop="output_net_weight"></el-table-column>
        <el-table-column label="现存净重(g)" prop="pur_remainder"></el-table-column>
        <el-table-column label="现存折重(g)" prop="net_remainder"></el-table-column>
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
      areaData: [], //所属区域数据
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customer_type: "", //客户类型
      stockTypeId: "", //料类型
      stockKindId: "", //料种类
      province: "", //省份
      area: "", //区域
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
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [], // 料类型数据
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
      customerTypeData: [
        {
          //客户类型数据
          id: "",
          label: "全部"
        },
        {
          id: "大客户",
          label: "大客户"
        },
        {
          id: "集团",
          label: "集团"
        },
        {
          id: "门店",
          label: " 门店"
        },
        {
          id: "子公司",
          label: "子公司"
        },
        {
          id: "银行",
          label: "银行"
        },
        {
          id: "内厂",
          label: "内厂"
        },
        {
          id: "外厂",
          label: "外厂"
        },
        {
          id: "提纯厂",
          label: "提纯厂"
        },
        {
          id: "内部",
          label: "内部"
        }
      ],
      provinceData: [], //省份数据
      tableData: [{}], // 模拟
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
      this.displayAllData();
      this.stockSetFun();
      this.findStockSetKind();
      this.areaData = [{ id: "", label: "全部" }];
      this.areaDataFun();
      this.provinceData = this.$publicData.provinceData;
      // this.departDataFun();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          customerType: this.customer_type,
          stockTypeId: this.stockTypeId,
          stockKindId: this.stockKindId,
          province: this.province,
          area: this.area,
          departId: this.departId,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NStockIntoutputListComeDepart", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.create_time = self.$api.dateGetDay(item.create_time);
            });
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
          column.label === "入料净重(g)" ||
          column.label === "入料折重(g)" ||
          column.label === "出料净重(g)" ||
          column.label === "出料折重(g)" ||
          column.label === "现存净重(g)" ||
          column.label === "现存折重(g)"
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
    // 重置
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.customer_type = this.stockTypeId = this.stockKindId = this.province = this.departId = this.area = this.selectedDay =
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

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }
}
</style>
