D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="searchParams.bizNo"
            class="input-with-select searchTxt"
            size="small"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">接收单位</span>
          <el-select
            v-model="searchParams.recipientId"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in repoListList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="searchParams.invoiceStatu"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in orderStatusData"
              :key="item.value"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">操作人</span>
          <el-select
            v-model="searchParams.creatorId"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in subsSimpleList"
              :key="item.userId"
              :label="item.concat"
              :value="item.userId"
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

      <div style="margin-top:16px;">
        <el-button type="primary" size="small" @click="createdFun" v-if="addAllotTF">新增入库</el-button>
      </div>

      <el-table
        :data="orderData"
        stripe
        @row-dblclick="editGold"
        height="600"
        style="width: 100%;margin-top:25px;"
      >
        <el-table-column prop="bizNo" label="入库单号"></el-table-column>
        <el-table-column prop="bizTypeName" label="入库类型"></el-table-column>
        <el-table-column prop label="源单号">
          <template slot-scope="scope">
            <span>{{ scope.row.sourceInvoiceNo ? scope.row.sourceInvoiceNo : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column prop="suttle" label="净重(g）"></el-table-column>
        <!-- <el-table-column prop="weight" label="毛重(g)"></el-table-column> -->
        <!-- <el-table-column prop label="工费(￥）">
          <template slot-scope="scope">
            <span>--</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="creator" label="操作人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop label="订单状态">
          <template slot-scope="scope">
            <span class="blackColor" v-html="$api.orderStatus(scope.row.invoiceStatu)"></span>
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
import moment from "moment";
var Nzh = require("nzh");
export default {
  data() {
    return {
      addAllotTF: false, //新增按钮显示权限
      loadingState: false,
      bizNo: "",
      startTime: "",
      endTime: "",
      orderData: [],
      mock: "",
      data: [
        {
          label: "12"
        }
      ],
      orderStatusData: [
        { code: "CONFIRMED", name: "已审核" },
        { code: "DRAFT", name: "制单" },
        { code: "RCW", name: "已红冲" },
        { code: "REJECT", name: "已驳回" },
        { code: "WAITCONFIRM", name: "待审核" },
        { code: "STOCKIN", name: "复称中" },
        { code: "RECEIVED", name: "已入库" },
        { code: "DISCARD", name: "已作废" }
      ],
      repoListList: [],
      subsSimpleList: [],
      initiatorList: [],
      searchParams: {},
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
      this.confRepoList(); // 获取仓库信息
      this.getOrderStatusList();
      this.addAllotTF = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "stock-in-create"
      );
    },
    displayAllData() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      Object.assign(params.PRS, this.searchParams);
      this.$axios
        .get(this.$portMain + "/putStock/initiatorList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderData = res.data.data.data;
            self.PageCount = res.data.data.rowSize;
            self.loadingState = false;
            self.orderData.forEach(item => {
              item.createDate = moment(item.createDate).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },

    orderStatus(val) {
      let obj = {
        DRAFT: "yellowColor",
        DISCARD: "lightYellowColor",
        WAITCONFIRM: "yellowColor",
        REJECT: "redColor",
        RECEIVED: "RECEIVED",
        RCW: "redColor"
      };
      let name = this.orderStatusData.filter(item => item.code === val)[0].name;
      return `<span class=${obj[val]}>${name}</span>`;
    },

    // 获取筛选列表
    getOrderStatusList() {
      let params = {
        PRS: {
          type: `STOCK_IN`
        }
      };
      this.$axios
        .get(this.$portMain + "/biz/conf/getBizStatu", params)
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              item.label = item.name;
              item.value = item.code;
            });
            this.orderStatusData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
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

    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "joinStoreDetail",
        query: { bizNo: elem.bizNo }
      });
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
        this.startTime = moment(this.selectedDay[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.endTime = moment(this.selectedDay[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.searchParams.dateStart = this.startTime;
      this.searchParams.dateEnd = this.endTime;
      this.screenFun();
    },

    // 查看当前用户部门的仓库
    confRepoList() {
      const self = this;
      this.$axios
        .get(this.$portMain + "/biz/conf/repoList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.repoListList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //新增入库
    createdFun() {
      this.$router.push("joinStoreEdit");
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
</style>
