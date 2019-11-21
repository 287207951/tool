<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>创建新账户</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" size="small" @click="submintMsg()">提交审核</el-button>
              <el-button size="small">保存</el-button>
              <el-button size="small">取消</el-button>
            </el-col>
          </el-row>
          <div class="content">
            <el-row>
              <el-col :span="8">
                <span class="gray_font marginButton10">开户公司</span>
                <el-input v-model="submintData.companyName" placeholder="请填写需要开户公司名称" size="small"></el-input>
              </el-col>
              <el-col :span="4">
                <span class="spaces"></span>
              </el-col>
              <el-col :span="8">
                <span class="gray_font marginButton10">开户银行</span>
                <el-input v-model="submintData.bankName" placeholder="请填写具体的开户银行" size="small"></el-input>
              </el-col>
              <el-col :span="4">
                <span class="spaces"></span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="gray_font marginButtonTop">开户行</span>
                <el-input v-model="submintData.bankOfDeposit" placeholder="请填写开户行" size="small"></el-input>
              </el-col>
              <el-col :span="4">
                <span class="spaces"></span>
              </el-col>
              <el-col :span="8">
                <span class="gray_font marginButtonTop">银行账号</span>
                <el-input v-model="submintData.accountNumber" placeholder="请填写开户银行的银行账号" size="small"></el-input>
              </el-col>
              <el-col :span="4">
                <span class="spaces"></span>
              </el-col>
            </el-row>
          </div>

	    </div>
    </div>
</template>
<script>
  export default {
  data() {
    return {
      submintData: {}, // 审核需要提交数据
      orderList: [],
      dialogTableVisible:false,//金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      documentState: ""  //单据状态
    };
  },
  created() {
    this.displayAllData(1, 12);
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
          this.$portMain + "/company/queryBankRecord",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum =  res.data.data.rowSize;
            self.orderList.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选中值
    handleSelectionChange(select) {
 
    },
    obsolete() {
       this.$axios
       .post(this.$portBYB + "purificationOrder/cancellation", {id: 1})
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
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    formatDate(row, column) {
      return this.$api.dateGetDay(row.update_time)
    },
    createdOrder() {
      this.$router.push({ path: 'editMaterToOrna', query: { created: 1}})
    },
    // 编辑提纯单
    editGold(elem) {
      // this.$router.push({ path: 'editMaterToOrna', query: { goldId: elem.id }})
    },
    // 提交审核
    submintMsg() {
      let self = this;
      this.$axios
        .post(this.$portMain + "/company/createBankRecord", this.submintData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$router.push('companyAccount')
          } else {
            self.$message.error(res.data.msg);
          }
        })
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
  .gray_font
    color $font-color
  .content
    margin-left 96px
    margin-top 34px
  .spaces
    margin-left 1px
  .marginButton10
    margin-bottom 10px
    display inline-block
  .marginButtonTop
    margin-top 20px
    margin-bottom 10px
    display inline-block
</style>
