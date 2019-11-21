<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>验料（测金）</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <div class="topMenuRight">
            <el-button size="small" icon="el-icon-printer">打印</el-button>
            <el-button size="small" icon="el-icon-upload2">导出</el-button>
            <el-date-picker
              v-model="selectedDay"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
            ></el-date-picker>
            <el-input
              placeholder="请输入内容"
              v-model="searchTxt"
              class="input-with-select searchTxt"
              size="small"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="checkGoldData"
        stripe
        height="700"
        @row-dblclick="editGold"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column type="index" header-align="center" align="center" width="50" label="序"></el-table-column>
        <el-table-column prop="order_code" label="验料单编号" width="180" sortable></el-table-column>
        <el-table-column
          prop="check_material_time"
          label="验料时间"
          sortable
          :filters="checkTimeFilter"
          :filter-method="filterHandler"
        ></el-table-column>
        <el-table-column prop="order_uid_name" label="测金员" sortable></el-table-column>
        <el-table-column prop="gross_weight" label="毛重" sortable></el-table-column>
        <el-table-column prop="net_weight" label="收料总净重" sortable></el-table-column>
        <el-table-column prop="status" label="单据状态" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.order_state == 1">创建</span>
            <span v-else-if="scope.row.order_state == 2">检验中</span>
            <span v-else-if="scope.row.order_state == 3">已检验</span>
            <span v-else-if="scope.row.order_state == 4">作废</span>
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
          :total="goldSize"
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
      checkGoldData: [],
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      checkTimeFilter: [], //时间过滤
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示多少条记录，默认12条
      goldSize: 0 //金料单总数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.goldDataDispFun(1, this.pageSize);
    },
    //分页显示金料列表事件
    goldDataDispFun(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/checkmaterial/order/checklist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.checkGoldData = res.data.data.data;
            self.goldSize = res.data.data.rowSize;
            var checkTimeList = [];
            var tempObj;
            for (var i = 0; i < self.checkGoldData.length; i++) {
              //日期格式化
              self.checkGoldData[i].check_material_time = self.$api.dateGetDay(
                self.checkGoldData[i].check_material_time
              );
              //时间筛选
              tempObj = {};
              tempObj.text = self.checkGoldData[i].check_material_time;
              tempObj.value = self.checkGoldData[i].check_material_time;
              checkTimeList.push(tempObj);
            }
            self.checkTimeFilter = checkTimeList.unique();
          } else {
            self.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          //
        });
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 3) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //点击查看验料单
    viewGold(elem) {
      var self = this;
      this.$router.push("editGoldTest?view&goldId=" + elem.id);
    },
    //点击编辑验料单
    editGold(elem) {
      var self = this;
      this.$router.push({ path: "editGoldTest", query: { editId: elem.id } });
    },
    //分页事件开始
    handleSizeChange(val) {
      //
    },
    handleCurrentChange(val) {
      //
    }
    //分页事件结束
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

  .topMenuRight {
    text-align: right;
  }

  .searchTxt {
    width: 200px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }
}
</style>