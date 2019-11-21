<template>
  <div class="conBigDiv" v-loading="loading" ref="toExamine">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务审核</el-breadcrumb-item>
      <el-breadcrumb-item>客户结价</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <div>
            <el-input
              placeholder="结价单号/客户名称"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keyup.enter.native="queryFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="gray_font marignLeft8">到账时间</span>
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
            <span class="gray_font marignLeft8">单据状态</span>
            <el-select v-model="auditStatue" placeholder="请选择" size="small">
              <el-option
                v-for="item in auditStatueData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="gray_font marignLeft8">料类型</span>
            <el-select v-model="stockType" placeholder="请选择" size="small">
              <el-option
                v-for="item in materialDataOne"
                :key="item.stockTypeName"
                :label="item.stockTypeName"
                :value="item.stockTypeName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="passFun">通过审核</el-button>
          <el-button type="danger" size="small" plain @click="RejectFun">驳回审核</el-button>
          <el-button type="danger" size="small" plain @click="againRejectFun">再次驳回</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <!-- :cell-class-name="cellcb" -->
      <el-table
        ref="multipleTable"
        :data="orderList"
        stripe
        height="700"
        @selection-change="changCheckFun"
        @cell-mouse-enter="mouseFun"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="45" :selectable="checkboxInit"></el-table-column>
        <el-table-column prop="knotPriceCode" label="结价单号" width="150"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="150"></el-table-column>
        <el-table-column prop="stockType" label="料类型"></el-table-column>
        <el-table-column prop="knotPriceWeight" label="结价净重(g)"></el-table-column>
        <el-table-column prop="goldPrice" label="金价"></el-table-column>
        <el-table-column prop="returnWage" label="退工费"></el-table-column>
        <el-table-column prop="knotPriceMoney" label="结价金额(￥)">
          <template slot-scope="scope">
            <span v-if="scope.row.knotPriceMoney != ''">{{scope.row.knotPriceMoney.toFixed(2)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="结价备注"></el-table-column>
        <el-table-column prop="createTime" label="结价时间"></el-table-column>
        <el-table-column prop="creatorName" label="操作人"></el-table-column>
        <el-table-column prop="hc" label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.hc == '0'" style="color:#8A9199">红冲</span>
            <span v-if="scope.row.hc == '1'" style="color:#8A9199">--</span>
          </template>
        </el-table-column>

        <el-table-column prop="printCount" label="打印"></el-table-column>
        <el-table-column prop="auditStatue" label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatue == '1'" style="color:#F26D0F">待审核</span>
            <span v-else-if="scope.row.auditStatue == '2'" style="color:#222426">已审核</span>
            <span v-else-if="scope.row.auditStatue == '3'" style="color:#F20F34">已驳回</span>
            <span v-else-if="scope.row.auditStatue == '4'" style="color:#8A9199">作废</span>
            <span v-else-if="scope.row.auditStatue == '5'" style="color:#F20F34">再次驳回</span>
            <span v-else style="color:#F20F34">--</span>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      shortcutData: "",
      loading: false,
      selectionData: [], //选中数据
      editAmountMoney: "", //结价金额（编辑）
      amountMoney: "", //结价金额（新增）
      materialData: [], //料纯度数据
      materialDataOne: [], //料纯度数据(有全部)
      subPrice: {
        //新增结价单
        customerId: "",
        customerIdName: "",
        stockType: "",
        knotPriceWeight: "",
        goldPrice: "",
        returnWage: "",
        note: ""
      },
      subEditPrice: {
        //编辑结价单
        id: "",
        customerId: "",
        customerIdName: "",
        stockType: "",
        knotPriceWeight: "",
        goldPrice: "",
        returnWage: "",
        note: ""
      },
      search: "", //关键字
      startTime: "",
      endTime: "",
      auditStatue: "",
      stockType: "全部",
      auditStatueData: [
        //单据状态数据
        {
          label: "全部",
          value: ""
        },
        {
          label: "待审核",
          value: 1
        },
        {
          label: "已审核",
          value: 2
        },
        {
          label: "已驳回",
          value: 3
        },
        {
          label: "已作废",
          value: 4
        }
      ],
      input: "", //模拟
      newPrice: false, //新增结价单
      editPrice: false, //编辑结价单
      orderList: [],
      selectedDay: "", //日期选择属性
      documentState: "", //单据状态
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData();
    this.materialFun();
    this.shortcutKey();
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          auditStatue: self.auditStatue,
          stockType: self.stockType != "全部" ? self.stockType : "",
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/knotPriceList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.orderList.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //禁用checkbox
    checkboxInit(row, index) {
      let showHC = row.knotPriceCode.slice(0, 2);
      if ((row.auditStatue === 1 || row.auditStatue === 2) && showHC != "HC") {
        //你需要判断的条件
        return 1; //可勾选
      } else {
        return 0; //不可勾选
      }
    },
    //隐藏checkbox
    cellcb(row) {
      if (row.row.auditStatue != 1) {
        return "myCell";
      }
    },
    //料纯度数据
    materialFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/knotPriceTypeAllList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.materialData = res.data.data;
            self.materialDataOne = [...res.data.data];
            self.materialDataOne.unshift({
              stockTypeName: "全部"
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
    // 编辑提纯单
    editGold(elem) {
      //
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
    //查询
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.displayAllData();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.auditStatue = this.selectedDay =
        "";
      this.stockType = "全部";
      this.queryFun();
    },
    //表格选择
    changCheckFun(val) {
      this.selectionData = val;
    },
    //审核通过
    passFun() {
      let self = this,
        result = false;
      let knotPriceIds = [];
      if (this.selectionData.length == 0) {
        self.$message.error("请选择结价单!");
        return;
      }

      result = this.selectionData.some(item => {
        return item.auditStatue != 1;
      });

      if (result) {
        self.$message.error("抱歉，只有待审核的单据才能进行审核，请重新选择！");
        return;
      }

      this.selectionData.forEach(item => {
        knotPriceIds.push(item.id);
      });
      let params = {
        knotPriceIds: JSON.stringify(knotPriceIds)
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/auditKnotPrice",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //驳回
    RejectFun() {
      let self = this,
        result = false;
      let knotPriceIds = [];
      if (this.selectionData.length == 0) {
        self.$message.error("请选择结价单!");
        return;
      }

      result = this.selectionData.some(item => {
        return item.auditStatue != 1;
      });

      if (result) {
        self.$message.error("抱歉，只有待审核的单据才能进行驳回，请重新选择！");
        return;
      }

      this.selectionData.forEach(item => {
        knotPriceIds.push(item.id);
      });
      let params = {
        knotPriceIds: JSON.stringify(knotPriceIds)
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/auditNoKnotPrice",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //再次驳回
    againRejectFun() {
      let self = this,
        result = false;
      let knotPriceIds = [];
      if (this.selectionData.length == 0) {
        self.$message.error("请选择结价单!");
        return;
      }

      result = this.selectionData.some(item => {
        return item.auditStatue != 2;
      });

      if (result) {
        self.$message.error("抱歉，只有已审核的单据才能再次驳回，请重新选择！");
        return;
      }

      this.selectionData.forEach(item => {
        knotPriceIds.push(item.id);
      });

      let params = {
        knotPriceIds: JSON.stringify(knotPriceIds),
        statue: true
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/auditNoKnotPrice",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //快速选中ALT+F1
    mouseFun(row) {
      let showHC = row.knotPriceCode.slice(0, 2);
      if ((row.auditStatue === 1 || row.auditStatue === 2) && showHC != "HC") {
        this.shortcutData = row; //可勾选
      } else {
        this.shortcutData = ""; //不可勾选
      }
    },
    //快捷键
    shortcutKey() {
      let self = this;
      document.onkeydown = e => {
        //组合键
        let altKey = e.altKey || e.metaKey;
        let keyCode = e.keyCode || e.which || e.charCode;
        let dom = this.$refs.toExamine;
        if (
          dom != undefined &&
          altKey &&
          keyCode === 112 &&
          self.shortcutData != ""
        ) {
          self.$refs.multipleTable.toggleRowSelection(self.shortcutData);
        }
      };
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

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .searchTxt {
    width: 320px;
  }

  .gray_font {
    color: $font-color;
    font-size: 12px;
  }

  .marignLeft8 {
    margin-left: 24px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .returnColor {
    color: #F20F34;
  }

  .passColor {
    color: #222426;
  }

  .awaitColor {
    color: #F26D0F;
  }

  .draftColor {
    color: #F2B90F;
  }

  .cancelColor {
    color: #8A9199;
  }
}
</style>

<style>
.myCell .el-checkbox__input {
  display: none;
}
</style>
