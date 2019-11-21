<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库2</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryFun"></el-button>
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
          <!-- <span class="fontStyle">发料公司</span>
            <el-select v-model="value" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <!-- <span class="titleFont" style="margin-left:31px">出库状态</span>
          <el-select v-model="outputStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in outputStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <span class="fontStyle">单据状态</span>
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
          <!-- <span class="titleFont">接收单位</span>
            <el-select v-model="value" placeholder="请选择" size="small" class="width160">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>-->
          <!-- <span class="titleFont">单据状态</span>
          <el-select v-model="billsStatue" placeholder="请选择" size="small" class="width160">
            <el-option
              v-for="item in billsStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-button type="primary" size="small" @click="createdFun">新建调拨</el-button> -->
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
        </el-col>
        <el-col :span="12" class="totalDes" v-show="false">
          <span>总计：调拨总重量{{refinementWeight}}</span>
          <span>总金额{{totalMoney}}</span>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="allot_code" label="调拨单号"></el-table-column>
        <el-table-column prop="company_name" label="调拨部门"></el-table-column>
        <el-table-column prop="customer_name" label="接收单位"></el-table-column>
        <el-table-column prop="stock_kind" label="料种类"></el-table-column>
        <el-table-column prop="stock_type" label="料类型"></el-table-column>
        <el-table-column prop="total_weight" label="重量(g)"></el-table-column>
        <el-table-column prop="total_money" label="金额(￥)"></el-table-column>
        <el-table-column prop="output_counter" label="出库柜"></el-table-column>
        <el-table-column label="出库状态">
          <template slot-scope="scope">
            <span v-if="scope.row.output_statue == 1">待签收</span>
            <span v-if="scope.row.output_statue == 2" class="redColor">已签收</span>
            <span v-if="scope.row.output_statue == 3" class="redColor">已驳回</span>
            <span v-if="scope.row.output_statue == 4" class="redColor">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注信息"></el-table-column>
        <el-table-column prop="update_time" label="操作时间"></el-table-column>
        <el-table-column prop="order_uid_name" label="操作人"></el-table-column>
        <el-table-column prop="print_count" label="打印"></el-table-column>
        <el-table-column label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.HC == 0">--</span>
            <span v-if="scope.row.HC == 1">红冲</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.output_statue == 1">
              <el-button type="danger" size="mini" plain @click.stop="rejectFun(scope.row)">驳回</el-button>
              <el-button type="primary" size="mini" @click.stop="passDialog(scope.row)">通过</el-button>
            </div>
            <div v-if="scope.row.output_statue == 2">
              <el-button
                type="primary"
                size="mini"
                @click.stop="printFun(scope.row)"
                v-if="scope.row.input_print_count == '' || scope.row.input_print_count == 0 || scope.row.input_print_count == undefined"
              >打印</el-button>
              <el-button
                type="primary"
                size="mini"
                @click.stop="printFun(scope.row)"
                v-else
              >打印({{scope.row.input_print_count}})</el-button>
            </div>
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
    <el-dialog title="创建预收单" :visible.sync="createdPlanType" width="640px" :close-on-click-modal="false">
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左 -->
          <el-col :span="14" class="fontTStyle">
            <div class="marginBottom">
              <span>来料客户</span>
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
              <span>收料公司</span>
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

          <!-- 右 -->
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
              src="../../../../static/images/jiahao.png"
              alt
              @click="addItem"
            >
            <img v-else src="../../../../static/images/shanchu@2x.png" alt @click="addItem">
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdPlanType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="createdPlanType = false" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 测金详情 -->
    <el-dialog title="测金详情" :visible.sync="goldDetailType" width="640px" :close-on-click-modal="false">
      <div class="detailStyle">
        <div class="line"></div>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">来料客户</el-col>
          <el-col :span="9" class="contentStyle">郑州市裕源珠宝首饰有限公司</el-col>
          <el-col :span="4" class="titleStyle">流水号</el-col>
          <el-col :span="7" class="contentStyle">071201</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">收料公司</el-col>
          <el-col :span="9" class="contentStyle">和合百泰</el-col>
          <el-col :span="4" class="titleStyle">和合百泰</el-col>
          <el-col :span="7" class="contentStyle">板料</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">收料日期</el-col>
          <el-col :span="9" class="contentStyle">2018-07-24 10:32:53</el-col>
          <!-- <el-col :span="3" class="titleStyle">认款人</el-col>
          <el-col :span="9" class="contentStyle">李晓</el-col>-->
        </el-row>
      </div>
      <el-table ref="singleTable" :data="tableData" style="width: 100%">
        <el-table-column type="index" width="100" label="盘号"></el-table-column>
        <el-table-column prop="date" label="熔前毛重" header-align="center" align="center"></el-table-column>
        <el-table-column props="name" label="熔后毛重" header-align="center" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="promptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <!-- 审核入库 -->
    <el-dialog title="审核入库" :visible.sync="findPositionVisible" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24" style="padding-top:20px">
            <span style="font-size:12px;color:#8A9199;margin-left: 21px;margin-right: 10px;">入库柜</span>
            <el-select v-model="positionId" placeholder="请选择库柜" size="small" style="width: 256px;">
              <el-option
                v-for="item in findPositionData"
                :key="item.id"
                :label="item.enter_counter"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="findPositionVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="passFun" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      allotOrderId: "", //被选中的调拨单id
      findPositionVisible: false, //入库状态弹框
      findPositionData: [], //入库柜数据
      positionId: "", //入库柜id
      refinementWeight: 0, //调拨总重
      totalMoney: 0, //总金额
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [], // 料类型数据
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
      allData: [], //调拨数据
      tableData2: [
        {
          a: "1121",
          b: "1222"
        },
        {
          a: "1121",
          b: "1222"
        }
      ], //模拟
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
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
      this.displayAllData(1, 15);
      this.findStockSetKind();
      this.stockSetFun();
      this.findPosition();
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          stockKindId: self.stockKindId,
          stockTypeId: self.stockTypeId,
          outputStatue: self.outputStatue,
          billsStatue: self.billsStatue,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/depart/allotInputList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            (self.refinementWeight = res.data.data.refinementWeight), //调拨总重
              (self.totalMoney = res.data.data.totalMoney), //总金额
              (self.allData = res.data.data.data);
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach(item => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询入柜信息
    findPosition() {
      let self = this;
      let params = {
        PRS: {
          departId: 19
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
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
          sums[index] = "";
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
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
        if (index === 6) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = this.$api.returnFloat(Number(prev) + Number(curr));
              return res;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        }
        if (index === 9 || index == 12) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return "";
            }
          }, 0);
          //sums[index] += "";
        }
      });
      return sums;
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "vaultAllocationWarehousingDetail",
        query: { allotOrderId: elem.id }
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
    addItem() {
      this.tableData2.unshift({
        a: "",
        b: ""
      });
    },
    // 查询事件
    queryFun() {
      //this.$router.push('goldAllocationDetail')
      this.created_fun();
    },
    // 新建发料
    createdFun() {
      this.$router.push("creatGoldAllocation");
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
    //打印
    printFun(item) {
      let self = this;
      let params = {
        PRS: {
          allotOrderId: item.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/depart/printAllotInput", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.created_fun();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //审核通过弹框
    passDialog(item) {
      this.positionId = "";
      this.allotOrderId = item.id;
      this.findPositionVisible = true;
    },
    //审核通过
    passFun() {
      let self = this;
      if (self.positionId == "") {
        self.$message.warning("请选择库柜！");
        return;
      }
      let params = {
        PRS: {
          allotOrderId: self.allotOrderId,
          positionId: self.positionId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/depart/passAllotInput", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.findPositionVisible = false;
            self.created_fun();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //驳回
    rejectFun(item) {
      let self = this;
      let params = {
        PRS: {
          allotOrderId: item.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/depart/rejectAllotInput", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.created_fun();
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
}
</style>
