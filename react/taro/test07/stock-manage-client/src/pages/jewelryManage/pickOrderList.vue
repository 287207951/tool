D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>拣货验收列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keydown.enter.native="screenFun"
            @blur="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">拣货人</span>
          <el-select
            v-model="createName"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option v-for="item in createNameList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="invoiceStatu"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in invoiceStatuData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <span class="fontStyle">时间选择</span>
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions3"
            style="width:300px"
            @change="searTimechFun"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-table
        :data="orderData"
        stripe
        @row-dblclick="editGold"
        height="700"
        class="top10"
        style="width: 100%;"
      >
        <el-table-column prop="orderCode" label="拣货单号" width="140"></el-table-column>
        <el-table-column prop="ipadCreateName" label="拣货人"></el-table-column>
        <el-table-column prop="repoTypeName" label="仓库"></el-table-column>
        <el-table-column prop="ipadCreateTime" label="拣货时间" width="180px">
          <template slot-scope="scope">
            <span>{{$api.dateGetDayTime(scope.row.ipadCreateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bizNo" label="源单据号" width="140px"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)"></el-table-column>
        <el-table-column prop="weight" label="毛重(g）"></el-table-column>
        <el-table-column prop="pcCreateName" label="验收人"></el-table-column>
        <el-table-column prop="pcCreateTime" label="验收时间" width="180px">
          <template slot-scope="scope">
            <span>{{$api.dateGetDayTime(scope.row.pcCreateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="订单状态">
          <template slot-scope="scope">
            <span class="txtYellow" v-if="scope.row.invoiceStatu === 'WAIT'">待验收</span>
            <span class="txtHui" v-else-if="scope.row.invoiceStatu === 'FINISH'">已验收</span>
            <span class="txtRed" v-else-if="scope.row.invoiceStatu === 'CANCEL'">已作废</span>
            <span class="txtRed" v-else-if="scope.row.invoiceStatu === 'COMPLEX'">已退回</span>
            <span class="txtBlack" v-else>{{scope.row.invoiceStatu}}</span>
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
          :total="PageCount"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
var Nzh = require("nzh");
export default {
  data() {
    return {
      loadingState: false,
      search: "",
      startTime: "",
      endTime: "",
      invoiceStatu: "",
      initiatorId: "全部",
      orderData: [],
      mock: "",
      data: [
        {
          label: "12"
        }
      ],
      invoiceStatuData: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待验收",
          value: "WAIT"
        },
        {
          label: "已验收",
          value: "FINISH"
        },
        {
          label: "已退回",
          value: "COMPLEX"
        },
        {
          label: "已作废",
          value: "CANCEL"
        }
      ],
      repoListList: [],
      selectedDay: "",
      orderAllData: [],
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0, //总条目数
      createNameList: [], //操作人列表
      createName: "全部" //操作人名称
    };
  },
  created() {
    this.created_fun();
    this.getCreateName();
    this.confRepoList(); // 获取仓库信息
  },
  methods: {
    created_fun() {
      this.displayAllData();
    },
    displayAllData() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          invoiceStatu: this.invoiceStatu,
          ipadCreateName: this.createName != "全部" ? this.createName : "",
          orderType: this.orderType,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/biz/replypick/getPicklist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderData = res.data.data.data;
            self.PageCount = res.data.data.rowSize;
            self.loadingState = false;
            self.orderData.forEach(item => {
              item.createDate = self.$api.dateGetDayTime(item.createDate);
            });
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },
    // 查看当前用户部门的仓库
    confRepoList() {
      const self = this;
      this.$axios
        .get(this.$portMain + "/client/rawClientSimple")
        .then(function(res) {
          if (res.data.code == 200) {
            self.repoListList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
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
    //新建拣货
    addAllot() {
      this.$router.push("allotOutAdd");
    },
    //操作人列表读取
    getCreateName() {
      let self = this;
      this.$axios
        .get(self.$portMain + "/biz/replypick/getIpadCreateName")
        .then(function(res) {
          if (res.data.code == 200) {
            self.createNameList = res.data.data;
            self.createNameList.unshift("全部");
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 编辑单
    editGold(elem) {
      //拣货验收详情(待验收)
      if (elem.invoiceStatu == "WAIT") {
        this.$router.push({
          path: "pickOrderDetEdit",
          query: { id: elem.id }
        });
      }
      //拣货验收详情(已验收、已退回、已作废)
      if (elem.invoiceStatu != "WAIT") {
        this.$router.push({
          path: "pickOrderDetView",
          query: { id: elem.id }
        });
      }
    },
    //搜索
    screenFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    //时间搜索
    searTimechFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.screenFun();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.orange {
  color: #F26D0F;
}

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

  .grayColor {
    color: #8a9199;
  }

  .txtRed {
    color: #F20F34;
  }

  .searchTxt {
    width: 256px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 24px;
  }
}
</style>
