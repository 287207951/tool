<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="12">
            <el-input
              @keyup.enter.native="searchKeyWord"
              placeholder="请输入内容"
              style="width:320px"
              size="small"
              v-model="searchTxt"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>

            <span style="margin-left:24px;color:#8A8E99;font-size:12px;">可用状态：</span>
            <el-select
              v-model="statuValue"
              placeholder="请选择"
              size="small"
              @change="searchKeyWord"
              style="width:160px"
            >
              <el-option
                v-for="item in statuList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button
              type="primary"
              size="small"
              @click="updateCustomers"
              :loading="btnUpdateLoading"
              v-if="powerUpdate == 'true'"
            >更新列表</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table
          :data="customerAllData.data"
          stripe
          height="700"
          @row-dblclick="goCustomerDetail"
          style="width: 100%;margin-top:32px"
        >
          <el-table-column prop="companyId" label="客户ID"></el-table-column>
          <el-table-column prop="companyCode" label="客户编码" width="150"></el-table-column>
          <el-table-column prop="companyName" label="客户名称" width="200"></el-table-column>

          <el-table-column prop="financePerson" label="财务联系人" width="120"></el-table-column>
          <el-table-column prop="financePhone" label="财务电话" width="140"></el-table-column>

          <el-table-column prop="financeCode" label="财务编码" width="140"></el-table-column>

          <el-table-column prop="financeFax" label="财务传真" width="140"></el-table-column>

          <el-table-column prop="concat" label="公司负责人" width="120"></el-table-column>

          <el-table-column prop="lawPerson" label="法人代表" width="120"></el-table-column>
          <el-table-column prop="phone" label="公司电话" width="140"></el-table-column>
          <el-table-column prop="businessLicense" label="信用代码" width="120"></el-table-column>
          <el-table-column prop="issuingDateOfLicense" label="营业执照发证日期" width="150">
            <template slot-scope="scope">{{$api.dateGetDay(scope.row.issuingDateOfLicense)}}</template>
          </el-table-column>
          <el-table-column prop="endDateOfLicense" label="营业执照到期日期" width="150">
            <template slot-scope="scope">{{$api.dateGetDay(scope.row.endDateOfLicense)}}</template>
          </el-table-column>
          <el-table-column prop="typeName" label="公司类型" width="120"></el-table-column>
          <el-table-column prop="province" label="省份城市" width="120"></el-table-column>
          <el-table-column prop="clientArea" label="区域" width="120"></el-table-column>
          <el-table-column prop="clerk" label="关联业务员" width="120"></el-table-column>

          <!-- <el-table-column prop="creator" label="创建人" width="120"></el-table-column> -->
          <el-table-column prop="createTime" label="创建时间" width="120">
            <template slot-scope="scope">{{$api.dateGetDay(scope.row.createTime)}}</template>
          </el-table-column>

          <el-table-column prop="statu" label="可用状态">
            <template slot-scope="scope">
              <span v-if="scope.row.statu =='E'" class="black_font">已启用</span>
              <span v-else-if="scope.row.statu =='D'" class="hui_font">已禁用</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="customerSize"
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
      loading: true,
      btnUpdateLoading: false,
      powerUpdate: "false", //更新
      source: "",
      searchTxt: "",
      statuList: [
        //公司状态列表
        {
          value: "",
          label: "全部"
        },
        {
          value: "E",
          label: "已启用"
        },
        {
          value: "D",
          label: "已禁用"
        }
      ],
      statuValue: "", //公司状态状态值
      customerAllData: [], //客户数据列表
      customerSize: 0, //客户数据记录
      pageSize: 12, //每页显示客户记录数
      pageNum: 1 //分页页码默认为1
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    ...mapMutations(["customerManage/changaActiveName"]),
    created_fun() {
      var self = this;
      self.viewCustomer();
      this.powerFun();
    },
    //获取客户列表数据
    viewCustomer() {
      this.loading = true;
      var self = this;
      let params = {
        keyWord: self.searchTxt,
        statu: self.statuValue,
        page: self.pageNum,
        rows: self.pageSize
      };
      this.$api.formdataPostFun(
        this.$portMain + "/client/clients",
        params,
        res => {
          self.customerAllData = res.data;
          self.customerSize = res.data.rowSize;
          self.loading = false;
        },
        err => {
          self.$message.error(err.msg);
          self.loading = false;
        }
      );
    },
    //查看客户列表详情
    goCustomerDetail(elem) {
      this["customerManage/changaActiveName"]("");
      let params = {
        companyId: elem.companyId
      };
      this.$router.push({
        path: "customerManageView",
        query: params
      });
    },

    // 分页功能
    handleSizeChange(val) {
      this.pageNum = 1; //默认第一页
      this.pageSize = val; //改变每页显示多少条记录
      this.viewCustomer();
    },
    handleCurrentChange(val) {
      this.pageNum = val; //默认第一页
      this.viewCustomer();
      //self.goldDataDispFun(val, self.pageSize);
    },
    // 关键字搜索
    searchKeyWord() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //改变每页显示多少条记录
      this.viewCustomer();
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerUpdate = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "client_sync"
      );
    },
    updateCustomers() {
      let self = this;
      this.btnUpdateLoading = true;
      this.$axios
        .get(this.$portMain + "/client/syncClients")
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.btnUpdateLoading = false;
            self.viewCustomer();
          } else {
            self.$message.error(res.data.msg);
            self.btnUpdateLoading = false;
          }
        });
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

  .orange_font {
    color: #F2930F;
  }

  .black_font {
    color: #2E3033;
  }

  .hui_font {
    color: #8A9199;
  }

  .topMenuRight {
    text-align: right;
    margin-bottom: 20px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }
}
</style>