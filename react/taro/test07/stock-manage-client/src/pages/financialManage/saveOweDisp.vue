<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>存欠表</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
          <el-row>
            <el-col :span="6">
              <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="createReceive">创建</el-button>
              <el-button type="warning" icon="el-icon-circle-close-outline" size="small">作废</el-button> -->
              <div style="color:transparent">.</div>
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
            :data="receiveMaterData"
            stripe
            height="700"
            @row-dblclick="editGold"
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
              prop="partner_name"
              label="客户"
              width="180"
              sortable
              :filters="customerFilter"
              :filter-method="filterHandler"               
              >
            </el-table-column>
            <el-table-column
              prop="partner_id"
              label="客户编码"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="province_name"
              label="省份"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="checkMan"
              label="所属团队"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="charge_name"
              label="主负责员"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="material_weight"
              label="最新到料"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="material_account"
              label="最新到款"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="balance_material"
              label="当前料"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="balance_account"
              label="当前款"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="partner_state"
              label="客户状态"
              sortable
              >
              <template slot-scope="scope">
                <span v-if="scope.row.partner_state == '0'">禁用</span>
                <span v-else-if="scope.row.partner_state == '1'">启用</span>
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
      receiveMaterData: [],
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      customerFilter: [], //客戶过滤
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
      var self = this;
      self.goldDataDispFun(1, self.pageSize);
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
        .get(
          this.$portMain + "/stock/account/order/list",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.receiveMaterData = res.data.data.data;
            self.goldSize = res.data.data.rowSize;
            var customerList = [];
            var tempCustomer;
            for (var i = 0; i < self.receiveMaterData.length; i++) {
              //客户过滤
              tempCustomer = {};
              tempCustomer.text = self.receiveMaterData[i].partner_name;
              tempCustomer.value = self.receiveMaterData[i].partner_name;
              customerList.push(tempCustomer);
            }
            self.customerFilter = customerList.unique();
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
    //点击查看收料单
    viewGold(elem) {
      var self = this;
      this.$router.push("saveOweEdit?view&goldId=" + elem.id);
    },
    //点击编辑收料单
    editGold(elem) {
      var self = this;
      this.$router.push({ path: "saveOweEdit", query: { editId: elem.id } });
    },
    //创建新收料单
    createReceive() {
      var self = this;
      this.$router.push({
        path: "saveOweEdit",
        query: { editId: "createData" }
      });
    },
    //分页事件开始
    handleSizeChange(val) {
      var self = this;
      self.pageNum = 1; //默认第一页
      self.pageSize = val; //改变每页显示多少条记录
      self.goldDataDispFun(1, self.pageSize);
    },
    handleCurrentChange(val) {
      var self = this;
      self.goldDataDispFun(val, self.pageSize);
    }
    //分页事件结束
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