D<template>
  <div class="conBigDiv" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">调拨状态</span>
          <el-select
            v-model="orderStatusCode"
            placeholder="请选择"
            size="small"
            style="width:100px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderStatusSear"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">操作人</span>
          <el-select
            v-model="operaMan"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <el-option v-for="item in operaManList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-input
            placeholder="请输入单号搜索"
            v-model="oriOrderNoTxt"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
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
            :picker-options="$publicData.pickerOptions2"
            style="width:300px"
            @change="searchFun"
          ></el-date-picker>
        </el-col>
        <!-- <el-col :span="24" class="txtRed txtRight padding20">
          总计：总重量 {{totalWeight}} g     总折重 {{totalSuttle}} g
        </el-col>-->
      </el-row>

      <el-table
        :data="orderAllData"
        stripe
        @row-dblclick="editGold"
        height="600"
        style="width: 100%; "
      >
        <el-table-column prop="returnNumber" label="调拨单号" width="180"></el-table-column>
        <el-table-column prop="sponsorDepartment" label="调拨部门"></el-table-column>
        <el-table-column prop="reapUnit" label="接收单位"></el-table-column>
        <el-table-column prop="totalWeight" label="总毛重(g)"></el-table-column>
        <el-table-column prop="totalSuttle" label="总净重(g)"></el-table-column>
        <el-table-column prop="sum" label="数量"></el-table-column>
        <el-table-column prop="totalMoney" label="总金额(￥)"></el-table-column>
        <el-table-column prop="remark" label="备注信息"></el-table-column>
        <el-table-column prop="numberType" label="调拨状态">
          <template slot-scope="scope">
            <span v-if="scope.row.numberType == undefined">- -</span>
            <span style="color:#F26D0F" v-if="scope.row.numberType == 1">待签收</span>
            <span class="redColor" v-if="scope.row.numberType == 2">已签收</span>
            <span class="redColor" v-if="scope.row.numberType == 3">驳回</span>
            <span class="redColor" v-if="scope.row.numberType == 4">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="180px">
          <template slot-scope="scope">
            <span>{{$api.dateGetDayTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="操作人"></el-table-column>
        <el-table-column prop="print" label="打印"></el-table-column>
        <!-- <el-table-column prop="label" label="驳回">
          <template slot-scope="scope">
            <span v-if="scope.row.status == undefined">-</span>
            <span v-if="scope.row.status == 1">已完成</span>
            <span class="redColor" v-if="scope.row.status == 2">驳回</span>
          </template>
        </el-table-column>-->
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <span class="redColor" @click="orderPrintFun(scope.row)">打印</span>
            <span
              class="redColor"
              @click="cancelDataOne(scope.row)"
              v-if="scope.row.numberType == 3 ||scope.row.numberType == 1"
            >作废</span>
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
    <!-- 打印-->
    <div v-show="false">
      <printTPFour :billData="orderData" ref="myComp"></printTPFour>
    </div>
  </div>
</template>
<script>
var Nzh = require("nzh");
export default {
  data() {
    return {
      printData: {},
      data: [
        {
          label: "12"
        }
      ],
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待签收"
        },
        {
          code: "2",
          value: "已签收"
        },
        {
          code: "3",
          value: "驳回"
        },
        {
          code: "4",
          value: "作废"
        }
      ],
      orderSourceSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "B",
          value: "补货单"
        },
        {
          code: "A",
          value: "客制单"
        }
      ],
      selectedDay: "",
      orderAllData: [],
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      totalWeight: 0,
      totalSuttle: 0,
      orderData: {},
      nowTime: "",
      priceTxt: "",
      oriOrderNoTxt: "",
      orderSourceCode: "",
      startTime: "",
      endTime: "",
      orderStatusCode: "",
      ceditSumNum: 0,
      operaMan: "全部", //操作人
      operaManList: ["全部"], //操作人列表
      webLoadingTF: false
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData(1, 12);
      //操作人列表读取
      this.operaManFun();
    },
    displayAllData(num, size) {
      var self = this;
      self.webLoadingTF = true;
      let orderStatusTxt = "";
      let params = {
        returnNumber: self.oriOrderNoTxt,
        type: self.orderStatusCode,
        startDate: self.startTime,
        endDate: self.endTime,
        userName: self.operaMan === "全部" ? "" : self.operaMan,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/allotList",
        params,
        res => {
          self.webLoadingTF = false;
          self.totalSuttle = res.data.totalSuttle;
          self.totalWeight = res.data.totalWeight;
          self.pageNum = num;
          self.pageSize = size;
          self.priceSum = res.data.pageList.rowSize;
          self.orderAllData = res.data.pageList.data;
        },
        err => {
          self.$message.error(err.msg);
          self.webLoadingTF = false;
        }
      );
    },
    //操作人列表调用方法
    operaManFun() {
      let self = this;
      let params = { PRS: { type: 3 } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findUserName", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.operaManList = self.operaManList.concat(res.data.data);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },

    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "allotOutDepDet",
        query: { stockNumber: elem.returnNumber }
      });
    },
    //搜索
    searchFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDay(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, this.pageSize);
    },
    //收饰单打印
    orderPrintFun(elem) {
      let self = this;
      var params = { PRS: { retreatNumber: elem.returnNumber } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findAllot", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderData = res.data.data;
            self.orderData.orderCode = self.orderData.returnNumber; //单号
            self.orderData.note = self.orderData.remark; //备注
            self.orderData.customerName = self.orderData.reapUnit; //接收单位
            self.orderData.sponsorUnit = self.orderData.sponsorDepartment; //发起单位
            self.orderData.transferSlips = self.orderData.transferSlipList;
            self.$refs.myComp.compPrintFun();
            if (!self.$refs.myComp.LODOP) {
              return;
            }
            self.printFun(elem.returnNumber);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //打印事件
    printFun(elem) {
      let self = this;
      let params = {
        type: 2,
        number: elem
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/print",
        params,
        res => {
          self.$message.success("打印成功！");
          setTimeout(function() {
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //组装打印数据
    remakePrint() {
      this.printData = {
        customerName: this.orderData.reapUnit,
        orderCode: this.orderData.returnNumber,
        sponsorUnit: this.orderData.sponsorDepartment,
        createTime: this.orderData.createTime,
        note: this.orderData.remark,
        transferSlips: this.orderData.transferSlipList
      };
      this.$refs.myCompAllocation.compPrintFun();
    },
    changeSumNum() {
      this.ceditSumNum = 0;
      this.orderData.transferSlipList.forEach(jelem => {
        if (jelem.ceditMoney) {
          this.ceditSumNum += parseFloat(
            jelem.ceditMoney ? jelem.ceditMoney : 0
          );
        }
        if (jelem.money) {
          this.ceditSumNum += parseFloat(jelem.money ? jelem.money : 0);
        }
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    //打印事件
    printFun(elem) {
      let self = this;
      let params = {
        type: 2,
        number: elem
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/print",
        params,
        res => {
          self.$message.success("打印成功！");
          setTimeout(function() {
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //作废
    cancelDataOne(elem) {
      let self = this;
      this.$confirm("此操作将进行作废操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = { PRS: { returnNumber: elem.returnNumber } };
          this.$axios
            .get(self.$portMain + "/stockManagement/updateAllot", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success("作废此单成功！");
                setTimeout(function() {
                  self.created_fun();
                }, 1000);
              } else {
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
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

  .padding10 {
    padding: 10px;
  }

  .padding20 {
    padding: 20px;
    font-size: 14px;
  }
}
</style>
