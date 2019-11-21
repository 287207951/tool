D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库列表</el-breadcrumb-item>
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
          <span class="fontStyle">接收单位</span>
          <el-select
            v-model="orderType"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in bizAllData.receiveRepos"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
              :label="item.name"
              :value="item.code"
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
        <el-col :span="24" class="top10">
          <el-button type="primary" size="small" @click="addAllot" v-if="addAllotTF">新建调拨</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderData"
        stripe
        @row-dblclick="editGold"
        height="600"
        class="top10"
        style="width: 100%;"
      >
        <el-table-column prop="bizNo" label="调拨单号"></el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g)"></el-table-column>
        <el-table-column prop="weight" label="毛重(g）"></el-table-column>
        <el-table-column prop="creator" label="操作人"></el-table-column>
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
      outstoreStatue: "全部",
      orderType: "全部",
      orderData: [],
      mock: "",
      data: [
        {
          label: "12"
        }
      ],
      outstoreStatueData: [
        { code: "CONFIRMED", name: "已审核" },
        { code: "DRAFT", name: "制单" },
        { code: "EXREPO", name: "已出库" },
        { code: "REFUSAL", name: "已拒签" },
        { code: "SIGNIN", name: "已签收" },
        { code: "REJECT", name: "已驳回" },
        { code: "WAITCONFIRM", name: "待审核" },
        { code: "STOCKUP", name: "待出库" },
        { code: "RECEIVED", name: "已入库" },
        { code: "DISCARD", name: "已作废" }
      ],
      orderTypeData: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "尚金缘展厅",
          value: "_allotout"
        },
        {
          label: "尚金缘物流",
          value: "_replelogistics"
        }
      ],
      bizAllData: {}, //biz单据所有状态接口
      selectedDay: "",
      orderAllData: [],
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0, //总条目数
      addAllotTF: false //新增调拨按钮显示权限
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    getorderStatusData() {
      let params = {
        type: "TRANSFER_OUT"
      };
      this.$api.formdataPostFun(
        this.$portMain + "/biz/conf/getBizStatu",
        params,
        res => {
          this.outstoreStatueData = res.data;
          if (this.outstoreStatueData.length > 0) {
            this.outstoreStatueData.unshift({
              code: "",
              name: "全部"
            });
          }
        },
        err => {
          this.orderStatusData = [];
        }
      );
    },
    created_fun() {
      this.displayAllData();
      this.addAllotTF = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "transfer-out-create"
      );
      this.bizFormConf();
      this.getorderStatusData();
    },
    displayAllData() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          bizNo: this.search,
          dateStart: this.startTime,
          dateEnd: this.endTime,
          recipientRepoId: this.orderType != "全部" ? this.orderType : "",
          invoiceStatu:
            this.outstoreStatue != "全部" ? this.outstoreStatue : "",
          // orderType: this.orderType,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(
          this.$portMain + "/transferController/selectInitiatorTransfer",
          params
        )
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
    //biz单所有状态
    bizFormConf() {
      let self = this;
      var params = { PRS: { invoiceType: "TRANSFER" } };
      this.$axios
        .get(self.$portMain + "/biz/conf/bizFormConf", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.bizAllData = res.data.data;
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
      // if (elem.outstoreStatue == "_wait") {
      //   //待审核
      //   this.$router.push({
      //     path: "allotOutDet",
      //     query: { outStoreId: elem.outStoreId }
      //   });
      // } else if (elem.outstoreStatue == "_finish") {
      //已完成
      this.$router.push({
        path: "allotOutDet",
        query: { bizNo: elem.bizNo }
      });
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
