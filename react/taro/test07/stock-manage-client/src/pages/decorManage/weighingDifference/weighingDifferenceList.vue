<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>称差单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"></div>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入单号搜索"
            v-model="searchForm.search"
            class="input-with-select searchTxt"
            size="small"
            @keydown.enter.native="screenFun"
            @blur="screenFun"
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
            :picker-options="$publicData.pickerOptions3"
            style="width:300px"
            @change="searTimechFun"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        @row-dblclick="dblClickRow"
        ref="table"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="weigerrorCode" width="500" label="称差单号"></el-table-column>
        <el-table-column prop="recipient" sortable label="接收单位"></el-table-column>
        <el-table-column prop="initiator" sortable label="发起单位" width="180"></el-table-column>
        <el-table-column prop="differAmount" align="center" label="差异数量"></el-table-column>
        <el-table-column prop="differWeight" align="center" label="差异重量(g)"></el-table-column>
        <el-table-column prop="differMoney" align="center" label="金额(¥)"></el-table-column>
        <el-table-column prop="createTime" align="center" label="操作时间">
          <tempalate slot-scope="scope">
            <div>{{$api.dateGetDayTime(scope.row.createTime)}}</div>
          </tempalate>
        </el-table-column>
        <el-table-column prop="createName" align="center" label="操作人"></el-table-column>
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
    <el-dialog title="生成称差单详情" width="1266px" :visible.sync="dialogView">
      <product-list
        idKey="proId"
        :imgBaseUrl="$portImg"
        titleKey="proBasics.proName"
        imgUrlKey="proBasics.pic"
        :layoutSetting="dialogProductLayout"
        :listData="selectedData"
      ></product-list>
    </el-dialog>
  </div>
</template>

<script>
import productList from "@/components/product-list.vue";
import productRow from "@/components/product-row.vue";
export default {
  data() {
    return {
      selectedDay: "",
      searchForm: {
        search: "",
        startTime: "",
        endTime: ""
      },
      loadingState: false,
      tableData: [],
      productLayout: [
        [
          {
            label: "编码",
            valueKey: "proSpecData.specNumber"
          },
          {
            label: "属性",
            valueKey: "proBasics.goldCode"
          }
        ],
        [
          {
            label: "成色",
            valueKey: "proSpecData.conditi"
          },
          {
            label: "克重",
            valueKey: "proSpecData.weight"
          },
          {
            specialFn: data => {
              return data.proSpecData.factFeeType === 1
                ? {
                    label: "工费",
                    valueKey: "proSpecData.price"
                  }
                : {
                    label: "工费",
                    valueKey: "proSpecData.piecePrice"
                  };
            }
          }
        ]
      ],
      selectOptionsData: {},
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0 //总条目数
    };
  },
  methods: {
    dblClickRow(row, column, event) {
      this.$router.push({
        path: "weighingDifferenceDetail",
        query: {
          id: row.id
        }
      });
    },
    statueFormat(value) {
      return value === "1" ? "待处理" : "已处理";
    },
    getSelectOptions() {
      this.$axios
        .get(this.$portMain + "/proCommonController/code")
        .then(res => {
          if (res.data.code == 200) {
            this.selectOptionsData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    searTimechFun() {
      if (this.selectedDay != null) {
        this.searchForm.startTime = this.$api.dateGetDayTime(
          this.selectedDay[0]
        );
        this.searchForm.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
      this.screenFun();
    },
    screenFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.tableRender();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.tableRender();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.tableRender();
    },
    tableRender() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          ...this.searchForm,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/biz/differ/getWeigErrorOrderlist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tableData = res.data.data.data;
            self.PageCount = res.data.data.rowSize;
            self.loadingState = false;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    }
  },
  created() {
    this.getSelectOptions();
    this.tableRender();
  },
  components: {
    "product-row": productRow,
    "product-list": productList
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

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
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
    margin-left: 20px;
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

  .orderBigDiv {
    padding: 13px;
    min-height: 80px;
    border: #E5F1FF 1px solid;
    margin: 20px 8px;
    color: #222426;
    font-size: 14px;

    .orderBigDivOne {
      color: #333;
    }
  }

  .txtOne {
    font-size: 14px;
    color: #889199;

    span {
      color: #222426;
    }
  }

  .txtTwo {
    font-size: 14px;
    color: #222426;
  }

  .txtTwoBold {
    font-size: 14px;
    color: #222426;
    font-weight: bold;
  }

  .txtThree {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .txtThreeRed {
    font-size: 14px;
    color: $base-color;
    font-weight: bold;
  }

  .txtFour {
    font-size: 14px;
    color: #F20F34;
    font-weight: bold;
  }

  .txtFive {
    font-size: 14px;
    color: #919599;
    font-weight: bold;
  }

  .txtRed {
    color: #F20F34;
  }

  .tabOne {
    display: flex;
  }

  .tabOneLeft {
    width: 140px;
  }

  .tabOneRight {
    width: calc(100% - 140px);
  }

  .paddingRight30 {
    padding-right: 30px;
    margin-top: 10px;
  }

  .marginTop10 {
    margin-top: 10px;
    padding-left: 20px;
  }

  .suitDiv {
    padding-bottom: 10px;
    border-top: 1px solid #DADFE6;
    margin-top: 10px;

    .suitSubDiv {
      margin: 10px 0px;
    }
  }

  .pro-item {
    display: flex;
    align-items: center;
    background: #fff;
    line-height: 30px;

    .pro-right {
      width: 75%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-left: 10px;
    }
  }

  .redTxtOne {
    color: #F20F34;
    font-weight: bold;
  }

  .width240 {
    width: 240px;
  }

  .floatRight {
    float: right;
  }

  .left20 {
    margin-left: 20px;
  }

  .tabTwo {
    display: flex;
  }

  .tabTwoLeft {
    width: 174px;
  }

  .tabTwoRight {
    width: calc(100% - 174px);
    margin-left: 20px;
  }

  .txtAlginRight {
    text-algin: right;
  }

  .txt12px {
    font-size: 12px;
  }
}
</style>
