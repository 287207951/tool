<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>来款登记</el-breadcrumb-item>
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
        :data="parageraphList"
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
          prop="order_code"
          label="单据编号"
        >
        </el-table-column>
        <el-table-column
          prop="account_partner"
          label="来款客户"
        >
        </el-table-column>
        <el-table-column
          prop="payment_account_name"
          label="来款账户名"
        >
        </el-table-column>
        <el-table-column
          prop="payment_money"
          label="来款金额"
        >
        </el-table-column>
        <el-table-column
          prop="pay_mode"
          label="支付方式"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.pay_mode == '1'">微信转账</span>
            <span v-if="scope.row.pay_mode == '2'">支付宝转账</span>
            <span v-if="scope.row.pay_mode == '3'">银行卡转账</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_time"
          label="到账时间"
        >
        </el-table-column>
        <el-table-column
          prop="note"
          label="来款备注"
        >
        </el-table-column>
        <el-table-column
          prop="receive_account_name"
          label="到款账户名"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="confirm_uid_name"
          label="认款人"
        >
        </el-table-column>
        <el-table-column
          label="认款状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.order_state == '1'" class="fontColor2">草稿</span>
            <span v-if="scope.row.order_state == '2'" class="fontColor2">待认款</span>
            <span v-if="scope.row.order_state == '3'" class="fontColor4">已认款</span>
            <span v-if="scope.row.order_state == '4'" class="fontColor1">驳回</span>
            <span v-if="scope.row.order_state == '5'" class="fontColor3">已作废</span>
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
    },
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
          this.$portMain + "/stock/accountregister/order/list",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.pay_time = self.$api.dateGetDay(item.pay_time);
              item.create_time = self.$api.dateGetDay(item.create_time);
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
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "paragraphRegisterEdit",
        query: { goldId: elem.id }
      });
    },
    // 创建提存单
    createdOrder() {
      this.$router.push({
        path: "paragraphRegisterEdit",
        query: { goldId: "create" }
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
