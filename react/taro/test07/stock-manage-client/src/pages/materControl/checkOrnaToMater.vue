<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            <el-breadcrumb-item>饰转料</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
          <el-row>
            <el-col :span="6">
              <el-button type="primary" icon="el-icon-plus" size="small">创建</el-button>
              <el-button type="warning" icon="el-icon-circle-close-outline" size="small">作废</el-button>
            </el-col>
            <el-col :span="18">
              <div class="topMenuRight">
                <el-button size="small" icon="el-icon-printer" >打印</el-button>
                <el-button size="small" icon="el-icon-upload2" >导出</el-button>
                <el-date-picker
                  v-model="selectedDay"
                  type="daterange"
                  align="right"
                  unlink-panels
                  size="small"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="$publicData.pickerOptions2">
                </el-date-picker>
                <el-input placeholder="请输入内容" v-model="searchTxt" class="input-with-select searchTxt" size="small">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="orderList"
            stripe
            height="700"
            @row-dblclick = "editGold"
            :summary-method="getSummaries"
            show-summary
            style="width: 100%; margin-top: 20px">
            <el-table-column
              type="selection"
              header-align='center'
              align='center'
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              header-align='center'
              align='center'
              width="50"
              label="序"
              >
            </el-table-column>
            <el-table-column
              prop="material_turn_ornament_code"
              label="单据编号"
              header-align='center'
              align='center'
              >
            </el-table-column>
            <el-table-column
              prop="update_time"
              label="创建时间"
              header-align='center'
              align='center'
              :formatter="formatDate"
              :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
              :filter-method="filterHandler"
              >
            </el-table-column>
            <el-table-column
              prop="order_uid_name"
              label="制单人"
              header-align='center'
              align='center'
              :filters="[{ text: '张三', value: '张三' }, { text: '李四', value: '李四' }]"
              :filter-method="filterHandler"
              >
            </el-table-column>
            <el-table-column
              prop="material_total_weight"
              label="净重"
              header-align='center'
              align='center'
              >
            </el-table-column>
            <el-table-column
              prop="stock_position_name"
              label="转入仓"
              header-align='center'
              align='center'
              >
            </el-table-column>
            <el-table-column
              prop="store_issue_state"
              label="单据状态"
              header-align='center'
              align='center'
              >
              <template slot-scope="scope">
                <span v-if="scope.row.store_issue_state == '1'">创建</span>
                <span v-if="scope.row.store_issue_state == '2'">待审核</span>
                <span v-if="scope.row.store_issue_state == '3'">已审核</span>
                <span v-if="scope.row.store_issue_state == '4'">已驳回</span>
                <span v-if="scope.row.store_issue_state == '5'">已作废</span>
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
              background>
            </el-pagination>
          </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: [],
      dialogTableVisible:false,//金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData(1, 15);
  },
  methods: {
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(
          this.$portBYB + "OrnamentTurnMaterial/orderList",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 7) {
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
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    formatDate(row, column) {
      return this.$api.dateGetDay(row.update_time)
    },
    //点击检料单
    editGold(elem){
      var self = this
      this.$router.push('editOrnaToMater?goldId='+elem.id)
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
  .topMenuRight
    text-align right
  .searchTxt
    width 200px
  .pageD
    margin-top 20px
    text-align center
</style>
