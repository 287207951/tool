<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠低开</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入客户名称搜索"
            v-model="oriOrderNoTxt"
            class="input-with-select searchTxt"
            size="small"
            style="width:256px"
            @change="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">所属区域</span>
          <el-select
            v-model="areaDataTxt"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option v-for="item in areaData" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">所属省份</span>
          <el-select
            v-model="provinceTxt"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option
              v-for="item in provinceData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
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
            :picker-options="$publicData.pickerOptions2"
            style="width:300px"
            @change="searTimechFun"
          ></el-date-picker>
          <span class="txtRight">
            <el-button type="primary" size="small" @click="excelOut" :loading="loadingState">导出Excel</el-button>
          </span>
        </el-col>
      </el-row>
      <el-table :data="orderAllData" stripe style="width: 100%; margin-top: 20px">
        <el-table-column label="区域" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.area}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="province" label="省份"></el-table-column>
        <el-table-column prop="customer_name" label="客户名称"></el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">
            <span>{{$api.dateGetDay(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_code" label="单号"></el-table-column>
        <el-table-column label="营销品类">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.makeringType}}</div>
          </template>
        </el-table-column>
        <el-table-column label="重量">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.makeringTypeWeight}}</div>
          </template>
        </el-table-column>
        <el-table-column label="件数">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.makeringTypePrece}}</div>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.makeringTypeMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column label="原价">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.originalPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column label="高开优惠">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.highDiscount}}</div>
          </template>
        </el-table-column>
        <el-table-column label="高开单价（克/元）">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.highLowgPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column label="高开单价（件/元）">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.wagesHighLowOpenList"
              :key="index"
            >{{item.highLowjPrice}}</div>
          </template>
        </el-table-column>
      </el-table>
      <a ref="xlsDownloadA"></a>

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
      orderAllData: [],
      loadingState: false,
      oriOrderNoTxt: "", //原单号搜索
      selectedDay: "",
      startTime: "", //开始时间
      endTime: "", //结束时间
      provinceTxt: "全部", //所属省份选中填
      provinceData: [], //所属省份列表数据
      areaDataTxt: "全部", //所属区域选中填
      areaData: [], //所属区域列表数据
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      fname: ""
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
      this.provinceData = this.$publicData.provinceData;
      //获取区域数据
      this.getAreaData();
    },
    displayAllData() {
      var self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          startTime: self.startTime,
          endTime: self.endTime,
          area: self.areaDataTxt != "全部" ? self.areaDataTxt : "",
          province: self.provinceTxt != "全部" ? self.provinceTxt : "",
          search: self.oriOrderNoTxt,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(self.$portMain + "/WagesOpen/lowOpen", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingState = false;
            self.orderAllData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },
    //获取区域数据
    getAreaData() {
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientArea", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.areaData = res.data.data;
            self.areaData.unshift("全部");
          } else {
            // self.$message.error(res.data.msg);
          }
        });
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },

    // 编辑单
    editGold(elem) {
      if (elem.opreateType == "A") {
        this.$message.warning("抱歉，该单已被物流签收！");
        return;
      }
      this.$router.push({
        path: "vaultCollectFactoryDetail",
        query: { orderNo: elem.factoryOrderNo }
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

    //搜索
    screenFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    //时间搜索
    searTimechFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDay(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.screenFun();
    },
    //导出excel
    excelOut() {
      var self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          startTime: self.startTime,
          endTime: self.endTime,
          area: self.areaDataTxt != "全部" ? self.areaDataTxt : "",
          province: self.provinceTxt != "全部" ? self.provinceTxt : "",
          search: self.oriOrderNoTxt,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(
          self.$portMain + "/templateExcelstock/wagesLowOpenListExcel",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingState = false;
            var baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "优惠低开汇总表." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

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

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .width160 {
    width: 160px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth240 {
      width: 240px;
    }

    .inputWidth160 {
      width: 160px;
    }

    .itemRight {
      text-align: right;
    }

    .marginBottom {
      margin-bottom: 32px;
    }

    .fontTStyle {
      font-size: 14px;
      color: #8A9199;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .itemBottom {
      margin-bottom: 24px;
    }

    .titleStyle {
      color: #8A9199;
      font-size: 14px;
      text-align: right;
      padding-right: 24px;
    }

    .contentStyle {
      color: #2E2F33;
      font-size: 14px;
    }
  }

  .promptStyle {
    position: relative;

    .line {
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textAreaStyle {
      width: 433px;
      height: 120px;
      resize: none;
      background: rgba(240, 247, 255, 1);
    }
  }

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }

  .txtRed {
    color: #F20F34;
  }

  .txtBlack {
    color: #333;
  }

  .heiColor {
    color: #a6a7a9;
  }

  .txtRight {
    float: right;
  }
}
</style>
