<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠策略</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <div>
        <el-row>
          <el-col :span="24">
            <el-input
              @keyup.enter.native="searchKeyWord"
              placeholder="请输入内容"
              style="width:320px"
              size="small"
              v-model="search"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>

            <span style="margin-left:24px;color:#8A8E99;font-size:12px;margin-right:10px;">时间筛选</span>
            <el-date-picker
              v-model="selectedDay"
              type="daterange"
              align="right"
              size="small"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
              style="width:300px"
              @change="searchFun"
            ></el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div class="marginTop10">
        <el-button type="primary" size="small" @click="addFun">创建</el-button>
        <el-button type="warning" size="small" @click="delFun">删除</el-button>
      </div>
      <div>
        <el-table
          :data="customerAllData.data"
          @row-dblclick="goCustomerDetail"
          @selection-change="handleCheckAllChange"
          style="width: 100%;margin-top:32px"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="customerName" label="客户名称"></el-table-column>
          <el-table-column prop="gold999" label="千足金基础优惠"></el-table-column>
          <el-table-column prop="gold9999" label="万足金基础优惠"></el-table-column>
          <el-table-column prop="createName" label="发布人"></el-table-column>
          <el-table-column prop="createTime" label="发布时间">
            <template slot-scope="scope">{{$api.dateGetDay(scope.row.createTime)}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="txtCenter">
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
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      loading: false,
      checkData: [], //选中的数据
      powerControlImport: "false", //权限控制导入
      powerControlEdit: "false", //新建、编辑、申请审核
      searchTxt: "",
      customerAllData: [], //客户数据列表
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      selectedDay: "", //日期选择属性
      pageSize: 12, //每页显示客户记录数
      pageNum: 1, //分页页码默认为1
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    ...mapMutations(["customerManage/changaActiveName"]),
    created_fun() {
      var self = this;
      this.displayAllData();
      this.powerFun();
    },
    //获取客户列表数据
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/discount/getCustomerlist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.priceSum = res.data.data.rowSize;
            self.customerAllData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //搜索
    searchFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      (this.pageNum = 1), //分页页码默认为1
        (this.pageSize = 12), //每页显示客户记录数
        this.displayAllData();
    },
    //查看客户列表详情
    goCustomerDetail(elem) {
      this["customerManage/changaActiveName"]("");
      this.$router.push({
        path: "preferentialStrategyEdit",
        query: { customerId: elem.customerId }
      });
    },

    // 分页功能
    handleSizeChange(val) {
      this.pageSize = val; //改变每页显示多少条记录
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val; //默认第一页
      this.displayAllData();
      //self.goldDataDispFun(val, self.pageSize);
    },
    // 关键字搜索
    searchKeyWord() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //改变每页显示多少条记录
      this.displayAllData();
    },
    //权限判断
    powerFun() {
      let self = this;
      // this.powerControlImport = this.$api.setPowerSpot(
      //   self.$store.state.queryVerify,
      //   "client-add-batch"
      // );
      // this.powerControlEdit = this.$api.setPowerSpot(
      //   self.$store.state.queryVerify,
      //   "client-edit"
      // );
    },
    //创建优惠
    addFun() {
      this.$router.push({
        path: "preferentialStrategyView",
        query: { customerId: "new" }
      });
    },
    //全选
    handleCheckAllChange(val) {
      this.checkData = val;
    },
    //删除优惠
    delFun() {
      let self = this;
      if (this.checkData.length == 0) {
        this.$message.error("请选择优惠数据！");
        return;
      }

      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.checkData.forEach(item => {
            ids.push(item.customerDiscountId);
          });

          let params = {
            customerDiscountIds: JSON.stringify(ids)
          };
          this.$api.formdataPostFun(
            this.$portMain + "/discount/deleteStatue",
            params,
            res => {
              self.$message.success(res.msg);
              self.displayAllData();
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        })
        .catch(() => {});
    }
  },
  computed: {
    ...mapState(["queryVerify"])
  },
  watch: {
    queryVerify: function() {
      this.powerFun();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .marginTop10 {
    margin-top: 16px;
  }

  .txtCenter {
    text-align: center;
    margin: 10px auto;
  }
}
</style>