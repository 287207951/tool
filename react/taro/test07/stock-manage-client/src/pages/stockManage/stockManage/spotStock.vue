<template>
  <div class="conBigDiv" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="关键字搜索"
            v-model="search"
            class="input-with-select searchTxt fontStyle width256"
            size="small"
            style="width: 140px"
            @keyup.enter.native="changeCode"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">材质</span>
          <el-select
            v-model="goldCodeId"
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCode"
          >
            <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">产品类别</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCode"
          >
            <el-option
              v-for="item in categoryNewList"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
          <span class="fontStyle">生产工艺</span>
          <el-select
            v-model="processCodeId"
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCode"
          >
            <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>

          <!-- <span class="fontStyle">部门</span>
          <el-select
            v-model="departmentId"
            filterable
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCode"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>-->

          <span class="fontStyle">仓库</span>
          <el-select
            v-model="wareId"
            filterable
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="getWare"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in stockList"
              :key="item.id"
              :label="item.wareName"
              :value="item.id"
            ></el-option>
          </el-select>

          <span class="fontStyle">货柜</span>
          <el-select
            v-model="sarkId"
            filterable
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCode"
          >
            <el-option
              v-for="item in sarkList"
              :key="item.id"
              :label="item.sarkName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div style="height: 10px"></div>
      <!-- <el-row v-if="departmentId === `2`">
        <el-col style="margin-left: 20px">
          <el-button
            type="primary"
            size="small"
            @click="excelInputFun"
            :loading="xlsLoadTF"
            v-if="xlsUploadTF"
          >导入EXCEL</el-button>
          <input
            type="file"
            ref="excelInput"
            accept=".xls, .xlsx"
            @change="excelFun" 
            v-show="false"
            v-if="inputTF"
          >
        </el-col>
      </el-row>-->
      <div class="all-count">
        <div>
          部门总数量：
          <span class="fontW600">{{allCount.amount}}</span>
        </div>
        <div class="left20">
          部门总克重：
          <span class="fontW600">{{allCount.goldWeight}}g</span>
        </div>
      </div>
      <div style="height: 10px"></div>
      <div v-if="departmentId === `1`">
        <SpotList :stockPro="stockPro"></SpotList>
      </div>

      <!-- <div v-if="departmentId === `2`">
        <RoomList :stockPro="stockPro"></RoomList>
      </div>

      <div v-if="departmentId === `3`">
        <DecoLogList :stockPro="stockPro"></DecoLogList>
      </div>-->

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

    <!-- 添加补货单弹窗end -->
  </div>
</template>

<script>
import { RoomList, SpotList, DecoLogList } from "./acommon";

export default {
  components: {
    RoomList,
    SpotList,
    DecoLogList
  },
  data() {
    return {
      departmentId: `1`,
      // 部门列表
      departmentList: [
        {
          txt: `金库`,
          val: `1`
        },
        {
          txt: `展厅`,
          val: `2`
        },
        {
          txt: `物流`,
          val: `3`
        }
      ],

      allCount: { amount: 0, goldWeight: 0 }, // 汇总

      stockList: [], // 仓库列表
      wareId: ``, // 仓库id

      xlsLoadTF: false, //excel上传按钮加载
      inputTF: true,
      xlsUploadTF: true,

      factoryName: "", //工厂名称
      factoryList: ["全部", "内厂", "外厂"],
      search: "", //搜素内容
      stockTypeId: "", //料类型
      categoryList: [], //新建托盘品类数组
      categoryNewList: [], //新建托盘品类数组(加全部)
      goldCodeList: [], //材质列表
      goldCodeId: "全部", //材质选择
      processCodeList: [], //生产工艺列表
      processCodeId: "全部", //生产工艺选择项
      effectCodeList: [], //表面工艺列表
      value: "", //模拟
      stockPro: [], //列表
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      webLoadingTF: false, //页面加载中
      companyName: "", //客户名称、
      companySear: [], //客户列表
      customerName: "", //工厂选择
      customerList: [], //工厂列表
      sarkId: "", //货柜选择
      sarkList: [], //货柜列表
      factory: "", // 选择工厂
      factoryList: [], // 工厂列表
      orderTrandOut: false,
      orderTrandFactory: false,
      orderReplenish: false
    };
  },
  created() {
    this.created_fun();
    this.$publicData
      .checkVerify([
        "order-trand-factory",
        "order-replenish",
        "order-trand-out"
      ])
      .then(res => {
        this.orderTrandOut = res["order-trand-out"];
        this.orderTrandFactory = res["order-trand-factory"];
        this.orderReplenish = res["order-replenish"];
      });
  },

  methods: {
    created_fun() {
      var self = this;
      this.displayAllData(1, 12);
      this.codeDisplay();
      this.sarkLoad();

      //   this.getFactoryList();

      //  获取仓库列表
      this.getStockList();

      this.$publicData
        .categoryFun()
        .then(res => {
          self.categoryList = res;
          self.categoryNewList = JSON.parse(JSON.stringify(self.categoryList));
          self.categoryNewList.unshift({
            value: "全部",
            label: "",
            editedTF: false
          });
        })
        .catch(function(err) {
          self.categoryList = [
            {
              value: "全部",
              label: "",
              editedTF: false
            }
          ];
          self.$message.error(err);
        });
    },

    getAllCount(options) {
      let params = {
        PRS: options
      };
      this.$axios
        .get(this.$portMain + "/bizWare/sumStock", params)
        .then(res => {
          const {
            data,
            data: { amount, goldWeight }
          } = res.data;
          if (!data) {
            return;
          }
          this.allCount = {
            ...this.allCount,
            ...{
              amount,
              goldWeight
            }
          };
        });
    },

    //excel上传按钮
    excelInputFun() {
      this.$refs.excelInput.click();
    },

    //excel上传
    excelFun(e) {
      var self = this;
      self.xlsLoadTF = true;
      let params = {
        files: e.target.files[0]
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/updataExeclToOrder",
        params,
        res => {
          self.inputTF = false;
          self.$message.success(res.msg);
          setTimeout(function() {
            self.inputTF = true;
            self.xlsLoadTF = false;
            self.$router.push("allotOrderOpera");
            // self.created_fun();
          }, 1000);
        },
        err => {
          self.inputTF = false;
          self.xlsLoadTF = false;
          setTimeout(function() {
            self.inputTF = true;
          }, 1000);
          self.$message.error(err.msg);
        }
      );
    },

    // 获取仓库列表
    getStockList() {
      this.$axios.get(this.$portMain + "/bizWare/select").then(res => {
        if (!res.data.data) {
          this.stockList = [];
        }
        this.stockList = res.data.data;
      });
    },

    displayAllData(num, size) {
      var self = this;
      self.selectAll = false;
      self.webLoadingTF = false;
      let params = {
        proName: self.search,
        goldCode: self.goldCodeId,
        one: self.stockTypeId,
        processCode: self.processCodeId,
        factoryId: self.customerName,
        wareId: self.wareId,
        sarkId: self.sarkId,
        page: num,
        rows: size
      };
      this.getAllCount(params);
      this.$api.formdataPostFun(
        self.$portMain + "/product/repertoryList",
        params,
        res => {
          if (res.code == 200) {
            self.webLoadingTF = false;
            self.pageNum = num;
            self.pageSize = size;
            self.stockPro = res.data.data;
            self.priceSum = res.data.rowSize;

            self.stockPro.forEach(item => {
              if (item.one != "套装") {
                //单品suit为1
                item.suit = 1;
              } else {
                //套装suit为2
                item.suit = 2;
                item.viewSuit = false;
              }
              item.Number = 0;
              if (item.extendAttr == "{}" || !item.extendAttr) {
                item.sizeData = {};
                item.sizeTF = false;
              } else {
                item.sizeData = JSON.parse(item.extendAttr);
                item.sizeTF = true;
              }
              item.selectTF = false;
            });
          } else {
            self.webLoadingTF = false;
            self.$message.error(res.data.msg);
          }
        },
        err => {
          self.webLoadingTF = false;
          self.$message.error(err.data.msg);
        }
      );
    },

    codeDisplay() {
      var self = this;
      this.$axios.get(this.$portMain + "/product/code", {}).then(function(res) {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            //材质
            if (item.goldCode == "产品材质") {
              self.goldCodeList = item.list;
              self.goldCodeList.unshift("全部");
            }
            //生产工艺
            if (item.processCode == "制作工艺") {
              self.processCodeList = item.list;
              self.processCodeList.unshift("全部");
            }
            //生产工艺
            if (item.effectCode == "表面工艺") {
              self.effectCodeList = item.list;
              self.effectCodeList.unshift("全部");
            }
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },

    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
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

    // 获取工厂列表
    getFactoryList() {
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", {
          PRS: { keyWord: "" }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.factoryList = res.data.data;
            this.factoryList.unshift({ companyId: "", companyName: "全部" });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    getWare() {
      this.sarkId = ``;
      this.sarkLoad();
      this.changeCode();
    },

    //修改品类
    changeCode() {
      let self = this;
      self.displayAllData(1, self.pageSize);
    },

    //工厂列表搜索
    factoryLoad() {
      let self = this;
      var params = { PRS: { keyWord: "" } };
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
            self.customerList.unshift({ companyId: "", companyName: "全部" });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //货柜列表搜索
    sarkLoad() {
      let self = this;
      let params = {
        wareId: this.wareId
      };
      this.$api.formdataPostFun(
        self.$portMain + "/bizSark/select",
        params,
        res => {
          self.sarkList = res.data;
        }
      );
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
    margin-bottom: 50px;
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

  .flex {
    display: flex;
  }

  .all-count {
    display: flex;
    padding-left: 8px;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
