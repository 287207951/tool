<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司账号(没做)</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="18">
          <div>
            <el-input
              placeholder="请输入内容"
              v-model="searchTxt"
              class="input-with-select searchTxt"
              size="small"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <span class="gray_font">时间筛选</span>
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
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top:16px;">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="createdOrder">新增账户</el-button>
          <el-button size="small" type="primary" plain>启用</el-button>
          <el-button size="small" type="primary" plain>禁用</el-button>
          <el-button type="warning" size="small">删除</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        height="700"
        @row-dblclick="editGold"
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-top:26px"
      >
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column prop="companyName" label="开户公司" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bankOfDeposit" label="开户行" header-align="center" align="center"></el-table-column>
        <!-- <el-table-column prop="bankName" label="开户银行" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="accountNumber" label="银行账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="verifier" label="审核人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="auditStatu" label="审核状态" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatu == '0'" class="draftColor">草稿</span>
            <span v-if="scope.row.auditStatu == '1'" class="awaitColor">待审核</span>
            <span v-if="scope.row.auditStatu == '2'" class="passColor">审核通过</span>
            <span v-if="scope.row.auditStatu == '3'" class="returnColor">驳回</span>
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
      orderList: [],
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      documentState: "", //单据状态
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
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
        .get(this.$portMain + "/company/queryBankRecord", params)
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
        });
    },
    // 选中值
    handleSelectionChange(select) {},
    obsolete() {
      this.$axios.post(this.$portBYB + "purificationOrder/cancellation", {
        id: 1
      });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    formatDate(row, column) {
      return this.$api.dateGetDay(row.update_time);
    },
    createdOrder() {
      this.$router.push({ path: "creatNewAccount", query: { created: 1 } });
    },
    // 编辑提纯单
    editGold(elem) {
      // this.$router.push({ path: 'editMaterToOrna', query: { goldId: elem.id }})
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
    margin-left: 24px;
  }

  .marignLeft8 {
    margin-left: 8px;
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
