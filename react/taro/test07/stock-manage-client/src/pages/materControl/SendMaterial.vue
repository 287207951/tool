<template>
  <div class="conBigDiv" ref="SendMaterial" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>发料</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :md="12" :lg="6" :xl="5" class="marginBottom20">
          <el-input
            placeholder="发料单号/收料单位"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :md="12" :lg="8" :xl="7" class="marginBottom20">
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
        </el-col>
        <el-col :md="12" :lg="5" :xl="4" class="marginBottom20">
          <span class="fontStyle">客户类型</span>
          <el-select v-model="customerType" placeholder="请选择" size="small">
            <el-option
              v-for="item in customerTypeData"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :md="12" :lg="5" :xl="4" class="marginBottom20">
          <span class="fontStyle">料种类</span>
          <el-select v-model="stockKindId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetKindData"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :md="12" :lg="5" :xl="4" class="marginBottom20">
          <span class="fontStyle">料类型</span>
          <el-select v-model="stockTypeId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :md="12" :lg="5" :xl="4" class="marginBottom20">
          <span class="titleFont">出库状态</span>
          <el-select v-model="outputStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in outputStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :md="12" :lg="5" :xl="4" class="marginBottom20">
          <span class="titleFont">单据状态</span>
          <el-select v-model="billsStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in billsStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <!-- <span class="titleFont">出库状态</span>
          <el-select v-model="outputStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in outputStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="titleFont" style="margin-left:31px">单据状态</span>
          <el-select v-model="billsStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in billsStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <!-- <span class="titleFont" style="margin-left:31px">收料公司</span>
            <el-select v-model="value" placeholder="请选择" size="small" class="width160">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary"
            size="small"
            @click="createdFun"
            v-if="powerCreat == 'true'"
          >新建发料</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
        <el-col :span="12" class="totalDes" v-show="false">
          <span>总计：出库总毛重{{firstWeight}}</span>
          <span>出库总折重{{finalWeight}}</span>
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="output_code" label="发料单号" width="150"></el-table-column>
        <el-table-column prop="company_name" label="发料单位"></el-table-column>
        <el-table-column prop="customer_name" label="收料单位" width="180"></el-table-column>
        <el-table-column prop="customer_type" label="类型">
          <template slot-scope="scope">
            <span>{{analysisCustomerType(scope.row.customer_type)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock_kind" label="料种类"></el-table-column>
        <el-table-column prop="stock_type" label="料类型"></el-table-column>
        <el-table-column prop="output_fur_total_weight" label="出库毛重(g)" width="100"></el-table-column>
        <el-table-column prop="output_discount_weight" label="出库折重(g)" width="100"></el-table-column>
        <el-table-column prop="total_money" label="金额(￥)" 　width="100"></el-table-column>
        <el-table-column prop="output_counter" label="出库柜"></el-table-column>
        <el-table-column prop="note" label="备注信息"></el-table-column>
        <el-table-column prop="output_statue" label="出库状态">
          <template slot-scope="scope">
            <span v-if="scope.row.output_statue == '1'" class="blackColor">完成</span>
            <span v-if="scope.row.output_statue == '2'" class="yellowColor">作废</span>
          </template>
        </el-table-column>
        <el-table-column label="性质">
          <template slot-scope="scope">
            <span v-if="scope.row.nature == 'OUT_FACTORY'">出工厂料</span>
            <span v-else-if="scope.row.nature == 'RETURN_STOCK'">还料</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="order_uid_name" label="操作人" width="120"></el-table-column>
        <el-table-column prop="print_count" label="打印次数"></el-table-column>
        <el-table-column prop="HC" label="红冲" width="70">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.HC == '0' || scope.row.HC == undefined">--</span> -->
            <span
              v-if="scope.row.HC != '1' && scope.row.HCType != 'HC' && scope.row.bills_statue != 2"
            >红冲</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="bills_statue" label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.bills_statue == undefined">- -</span>
            <span v-if="scope.row.bills_statue == '1'" class="yellowColor">待审核</span>
            <span v-if="scope.row.bills_statue == '2'" class="blackColor">已通过</span>
            <span v-if="scope.row.bills_statue == '3'" class="redColor">被驳回</span>
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
    </div>
    <!-- 创建预收单 -->
    <!-- <el-dialog
      title="创建预收单"
      :visible.sync="createdPlanType"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>

          <el-col :span="14" class="fontTStyle">
            <div class="marginBottom">
              <span>来料单位</span>
              <el-select v-model="value" placeholder="请选择" size="small" class="inputWidth240">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="marginBottom">
              <span>收料单位</span>
              <el-select v-model="value" placeholder="请选择" size="small" class="inputWidth240">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>


          <el-col :span="10" class="itemRight fontTStyle">
            <div class="marginBottom">
              <span>来款性质</span>
              <el-select v-model="value" placeholder="请选择" size="small" class="inputWidth160">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table ref="singleTable" :data="tableData2" style="width: 100%">
        <el-table-column type="index" width="100" label="盘号"></el-table-column>
        <el-table-column label="熔前毛重" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.a" placeholder="请输入内容" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="熔后毛重" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.b" placeholder="请输入内容" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <img
              v-if="scope.$index == 0"
              src="../../../static/images/jiahao.png"
              alt
              @click="addItem"
            >
            <img v-else src="../../../static/images/shanchu@2x.png" alt @click="addItem">
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="createdPlanType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="createdPlanType = false" size="small">保 存</el-button>
      </span>
    </el-dialog>-->
    <!-- 测金详情 -->
    <!-- <el-dialog
      title="测金详情"
      :visible.sync="goldDetailType"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="detailStyle">
        <div class="line"></div>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">来料单位</el-col>
          <el-col :span="9" class="contentStyle">郑州市裕源珠宝首饰有限公司</el-col>
          <el-col :span="4" class="titleStyle">流水号</el-col>
          <el-col :span="7" class="contentStyle">071201</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">收料单位</el-col>
          <el-col :span="9" class="contentStyle">和合百泰</el-col>
          <el-col :span="4" class="titleStyle">和合百泰</el-col>
          <el-col :span="7" class="contentStyle">板料</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">收料日期</el-col>
          <el-col :span="9" class="contentStyle">2018-07-24 10:32:53</el-col>
        </el-row>
      </div>
      <el-table ref="singleTable" :data="tableData" style="width: 100%">
        <el-table-column type="index" width="100" label="盘号"></el-table-column>
        <el-table-column prop="date" label="熔前毛重" header-align="center" align="center"></el-table-column>
        <el-table-column props="name" label="熔后毛重" header-align="center" align="center"></el-table-column>
      </el-table>
    </el-dialog>-->
    <!-- 提示 -->
    <!-- <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因"></textarea>
          </el-col>
        </el-row>
      </div>
     
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="promptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>-->
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerCreat: "false", //新增编辑按钮权限控制
      loading: false,
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [], // 料类型数据
      customerTypeData: [], //客户类型数据
      outputStatueData: [
        {
          // 出库状态数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "完成"
        },
        {
          id: 2,
          label: "作废"
        }
      ],
      billsStatueData: [
        {
          // 单据状态
          id: "",
          label: "全部"
        },
        {
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
      // promptType: false, //提示状态
      // goldDetailType: false, // 测金详情状态
      // createdPlanType: false, // 创建预收单状态
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
    this.powerFun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.SendMaterial;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.getCustomerType();
      this.displayAllData(1, 15);
      this.findStockSetKind();
      this.stockSetFun();
    },
    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          customerType: self.customerType,
          stockKindId: self.stockKindId,
          stockTypeId: self.stockTypeId,
          outputStatue: self.outputStatue,
          billsStatue: self.billsStatue,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NoutputStockList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
              item.HCType = item.output_code.substr(0, 2);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
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
            self.customerTypeData.unshift({
              value: "全部",
              key: ""
            });
          } else {
            self.customerTypeData = [];
          }
        });
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
          column.label === "出库毛重(g)" ||
          column.label === "出库折重(g)" ||
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
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "SendMaterialDetail",
        query: { outputStockId: elem.id }
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
    //添加一行
    // addItem() {
    //   this.tableData2.unshift({
    //     a: "",
    //     b: ""
    //   });
    // },
    // 新建发料
    createdFun() {
      this.$router.push("creatSendMaterial");
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
    // 查询事件
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.customerType = this.ustomerType = this.stockKindId = this.stockTypeId = this.outputStatue = this.billsStatue = this.selectedDay =
        "";
      this.queryFun();
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "stock-output-add"
      );
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

  .marginBottom20 {
    margin-bottom: 20px;
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
    // margin-left: 31px;
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
}
</style>
