D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>复称列表</el-breadcrumb-item>
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
          <!-- <span class="fontStyle">发起单位</span>
          <el-select
            v-model="initiatorId"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in repoListList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>-->
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="outstoreStatue"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in outstoreStatueData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="fontStyle">操作人</span>
          <el-select
            v-model="createNameTxt"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value />
            <el-option v-for="item in createNameList" :key="item" :label="item" :value="item"></el-option>
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
        height="650"
        class="top10"
        style="width: 100%;"
      >
        <el-table-column prop="bizNo" label="复称单号"></el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)"></el-table-column>
        <el-table-column prop="weight" label="毛重(g）"></el-table-column>
        <el-table-column prop="pcCreateName" label="操作人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop label="订单状态">
          <template slot-scope="scope">
            <span v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
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
      outstoreStatue: "",
      initiatorId: "全部",
      orderData: [],
      mock: "",
      data: [
        {
          label: "12"
        }
      ],
      outstoreStatueData: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待复检",
          value: "WAIT"
        },
        {
          label: "已复检",
          value: "FINISH"
        }
      ],
      repoListList: [],
      createNameTxt: "全部",
      createNameList: [], //操作人列表
      selectedDay: "",
      orderAllData: [],
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
      this.getReplyCreateName(); //操作人列表接口
      this.confRepoList(); // 获取仓库信息
    },
    displayAllData() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          invoiceStatu: this.outstoreStatue,
          replyName: this.createNameTxt != "全部" ? this.createNameTxt : "",
          initiatorId: this.initiatorId != "全部" ? this.initiatorId : "",
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/biz/replypick/getReplylist", params)
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
    //操作人列表接口
    getReplyCreateName() {
      let self = this;
      this.$axios
        .get(self.$portMain + "/biz/replypick/getReplyCreateName")
        .then(function(res) {
          if (res.data.code == 200) {
            self.createNameList = res.data.data;
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
    //新建调拨
    addAllot() {
      this.$router.push("allotOutAdd");
    },
    // 编辑单
    editGold(elem) {
      // console.log(elem.invoiceStatu)
      if (elem.invoiceStatu === "WAIT") {
        //待复称跳到编辑
        this.$router.push({
          path: "allotRecheckDet",
          query: { id: elem.id }
        });
      }
      if (elem.invoiceStatu === "FINISH") {
        //待复称跳到编辑
        this.$router.push({
          path: "allotRecheckView",
          query: { id: elem.id }
        });
      }

      // if (elem.outstoreStatue == "_wait") {
      //   //待审核
      //   this.$router.push({
      //     path: "allotOutDet",
      //     query: { outStoreId: elem.outStoreId }
      //   });
      // } else if (elem.outstoreStatue == "_finish") {
      //已完成

      // }
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
