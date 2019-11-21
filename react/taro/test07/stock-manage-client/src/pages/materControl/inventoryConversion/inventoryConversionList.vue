<template>
  <div class="conBigDiv" ref="goldAllocation" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>料库存转换</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">料种类</span>
          <el-select v-model="searParams.stockKindId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetKindData"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">料类型</span>
          <el-select v-model="searParams.stockTypeId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">转换部门</span>
          <el-select v-model="searParams.departId" placeholder="请选择" size="small">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in stockpositionList"
              :key="item.id"
              :label="item.stockName"
              :value="item.id"
            ></el-option>
          </el-select>
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
      </el-row>
      <div style="height: 20px"></div>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="small" @click="createdFun">新建转换</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="orderCode" label="转换单号" width="150"></el-table-column>
        <el-table-column prop="departName" label="转换单位"></el-table-column>
        <el-table-column prop="old_output_counter" label="原库存-存货柜" width="150"></el-table-column>
        <el-table-column prop="old_stock_kind" label="原库存-料种类"></el-table-column>
        <el-table-column prop="old_stock_type" label="原库存-料类型"></el-table-column>
        <el-table-column prop="old_input_pur_weight" label="原库存-毛重(g)"></el-table-column>
        <el-table-column prop="old_input_net_weight" label="原库存-净重(g)"></el-table-column>
        <el-table-column prop="new_output_counter" label="新库存-存货柜"></el-table-column>
        <el-table-column prop="new_stock_kind" label="新库存-料种类"></el-table-column>
        <el-table-column prop="new_stock_type" label="新库存-料类型"></el-table-column>
        <el-table-column prop="new_output_pur_weight" label="新库存-毛重(g)"></el-table-column>
        <el-table-column prop="new_output_net_weight" label="新库存-净重(g)"></el-table-column>
        <el-table-column prop="createName" label="操作人"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
        <!-- <el-table-column label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.HC == 0">--</span>
            <span v-if="scope.row.HC == 1">红冲</span>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      loading: false,
      searParams: {
        search: "", // 搜素内容
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        stockKindId: "", // 料种类
        stockTypeId: "", // 料类型
        departId: ""
      },
      stockSetKindData: [], // 料种类下拉数据
      stockSetTypeList: [], // 料类型数据

      allData: [],
      selectedDay: "", // 日期选择属性
      searchTxt: "", // 搜索字段
      pageNum: 1, // 默认第一页
      pageSize: 12, // 每页显示条目个数
      priceSum: 0 // 总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
      this.findStockSetKind();
      this.stockSetFun();
      this.getStockposition();
    },

    displayAllData() {
      this.loading = true;
      let self = this;
      let params = {
        PRS: {
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      Object.assign(params.PRS, this.searParams);
      this.$axios
        .get(this.$portMain + "/stock/nowStockTransList", params)
        .then(res => {
          if (res.data.code == 200) {
            const { data } = res.data.data;
            for (let item of data) {
              item = self.changeList(item);
              item.createTime = moment(item.createTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            }
            self.allData = data;
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },

    // 转换列表数据
    changeList(options) {
      for (let key in options) {
        for (let destKey in options.dest) {
          options["old_" + destKey] = options.dest[destKey];
        }
        for (let origKey in options.orig) {
          options["new_" + origKey] = options.orig[origKey];
        }
      }

      return options;
    },

    // 编辑单
    editGold(item) {
      this.$router.push({
        name: "inventoryConversionDetail",
        params: { item: JSON.stringify(item) }
      });
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
      this.searParams = {};
      this.queryFun();
    },

    // 新建发料
    createdFun() {
      this.$router.push("inventoryConversionEdit");
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

    // 获取部门
    getStockposition() {
      let self = this;
      let params = {
        PRS: {
          statue: 5
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/stockposition/order/list", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockpositionList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.searParams.startTime = this.$api.dateGetDayTime(
          self.selectedDay[0]
        );
        this.searParams.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.searParams.startTime = "";
        this.searParams.endTime = "";
      }
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
