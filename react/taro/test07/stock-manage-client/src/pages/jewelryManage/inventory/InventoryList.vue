D<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>盘点列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="searchParams.search"
            class="input-with-select searchTxt"
            size="small"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">盘点仓库</span>
          <el-select
            v-model="searchParams.wareId"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option value label="全部"></el-option>
            <el-option
              v-for="item in repoListList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">盘点结果</span>
          <el-select
            v-model="searchParams.cstatus"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in orderStatusData"
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

      <div style="margin-top:16px;">
        <el-button type="primary" size="small" @click="createdFun">新增盘点</el-button>
        <el-button type="primary" size="small" plain @click="inExcel">导入excel</el-button>
      </div>

      <el-table
        :data="orderData"
        stripe
        @row-dblclick="editGold"
        height="600"
        style="width: 100%;margin-top:25px;"
      >
        <el-table-column prop="bizNo" label="盘点单号"></el-table-column>
        <el-table-column prop="wareName" label="盘点仓库"></el-table-column>
        <el-table-column prop="sarkName" label="盘点库柜"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="creator" label="操作人"></el-table-column>
        <el-table-column prop label="盘点结果">
          <template slot-scope="scope">
            <span v-if="scope.row.checkStatus === 0" style="color: #333">正常</span>
            <span v-if="scope.row.checkStatus === 1" style="color: #F20F34">非正常</span>
          </template>
        </el-table-column>
        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <!-- 0 正常 1 已调差 2 已作废 3 待调差 -->
            <span v-if="scope.row.status === 0">--</span>
            <span v-if="scope.row.status === 1">已调差</span>
            <span v-if="scope.row.status === 2" style="color: #F2930F">已作废</span>
            <span v-if="scope.row.status === 3" style="color: #F26D0F">待调差</span>
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

    <InExcel
      :inExcelShow="inExcelShow"
      @upLoadSuccess="upLoadSuccess"
      @cancel="inExcelShow = false"
    ></InExcel>
  </div>
</template>
<script>
import { InExcel } from "./acommon";
import moment from "moment";
export default {
  components: {
    InExcel
  },
  data() {
    return {
      loadingState: false,
      bizNo: "",
      startTime: "",
      endTime: "",
      orderData: [],
      mock: "",
      inExcelShow: false,
      data: [
        {
          label: "12"
        }
      ],
      orderStatusData: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "正常",
          value: 0
        },
        {
          label: "非正常",
          value: 1
        }
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
      //   this.getSubsSimple(); // 获取操作人列表
      this.confRepoList(); // 获取仓库信息
    },
    displayAllData() {
      this.loadingState = true;
      let params = {
        PRS: {
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      Object.assign(params.PRS, this.searchParams);
      this.$axios.get(this.$portMain + "/checkStock/list", params).then(res => {
        this.loadingState = false;
        if (res.data.code == 200) {
          this.orderData = res.data.data.data;
          this.PageCount = res.data.data.rowSize;
          this.loadingState = false;
          this.orderData.forEach(item => {
            item.createTime = moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    upLoadSuccess() {
      this.inExcelShow = false;
      this.displayAllData();
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
        path: "inventoryDetail",
        query: { id: elem.id }
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
      this.searchParams.start = this.startTime;
      this.searchParams.end = this.endTime;
      this.screenFun();
    },

    // 查看当前用户部门的仓库
    confRepoList() {
      const self = this;
      let params = {
        PRS: {
          type: `NORMAL`
        }
      };
      this.$axios
        .get(this.$portMain + "/bizWare/select", params)
        .then(function(res) {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              item.name = item.wareName;
            });
            self.repoListList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 查看操作人
    getSubsSimple() {
      const self = this;
      this.$axios
        .get(this.$portMain + "/account/subsSimple")
        .then(function(res) {
          if (res.data.code == 200) {
            self.subsSimpleList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    inExcel() {
      this.inExcelShow = new Date().getTime();
    },

    //新增入库
    createdFun() {
      this.$router.push("inventoryEdit");
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
