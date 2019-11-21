<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>发料</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="createdOrder">创建</el-button>
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
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick = "editGold"
        height="700"
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
          prop="store_issue_code"
          label="收料单编号"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="client_name"
          label="客户"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          :formatter="formatDate"
        >
        </el-table-column>
        <el-table-column
          prop="order_uid_name"
          label="制单人"
        >
        </el-table-column>
        <el-table-column
          prop="store_issue_total_weight"
          label="发料总净重"
        >
        </el-table-column>
        <el-table-column
          prop="store_issue_state"
          label="单据状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.store_issue_state == '1'">创建</span>
            <span v-if="scope.row.store_issue_state == '2'">已发料</span>
            <span v-if="scope.row.store_issue_state == '3'">作废</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        orderList: [], //列表
        dialogTableVisible: false,//金料单弹出框
        selectedDay: "", //日期选择属性
        searchTxt: "" //搜索字段
      };
    },
    created() {
      this.created_fun()
    },
    methods: {
      created_fun() {
        let self = this
        this.$axios
          .get(this.$portBYB + "storeIssueOrder/OrderList")
          .then(function(res) {
            self.orderList = res.data.data
          })
      },
      // 选中值
      handleSelectionChange(select) {
        select.forEach(item => {
        })
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
                return (Number(prev) + Number(curr)).toFixed(2);;
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
      formatDate(row, column) {
        return this.$api.dateGetDay(row.create_time)
      },
      viewGold(elem){
        this.$router.push({ path: 'editSendMater', query: { goldId: elem.id, view: 1 }})
      },
      // 编辑提纯单
      editGold(elem) {
        this.$router.push({ path: 'editSendMater', query: { goldId: elem.id }})
      },
      // 创建提存单
      createdOrder() {
        this.$router.push({ path: 'editSendMater', query: { created: 1}})
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
</style>
