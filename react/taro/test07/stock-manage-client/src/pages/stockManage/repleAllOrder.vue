<template>
  <div class="conBigDiv" ref="repleOrder">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货管理</el-breadcrumb-item>
      <el-breadcrumb-item>一键补货审批列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="19">
          <span class="fontStyle">下单时间</span>
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
            @change="selectDayFun"
          ></el-date-picker>
          <span class="fontStyle">订单编号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            style="width:220px"
            @keyup.enter.native="displayAllData(1,12)"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">订单状态</span>
          <el-select v-model="orderStatus" @change="displayAllData(1, 12)" size="small">
            <el-option
              v-for="orderStatu in orderStatusList"
              :key="orderStatu.value"
              :label="orderStatu.label"
              :value="orderStatu.value"
            ></el-option>
          </el-select>
          <span class="fontStyle">排序</span>
          <el-select
            v-model="rankById"
            placeholder="请选择"
            size="small"
            style="width:110px"
            @change="searchFun"
          >
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-button
            size="small"
            type="danger"
            @click="resetAllData"
            :style="{marginLeft: '20px'}"
          >重置</el-button>
          <!-- <el-button ref="comFunBtn" @click="comFun" size="small">电子称读数</el-button>
          <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>-->
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="orderTotalSum" label="总数量"></el-table-column>
        <el-table-column prop="endOrderTotalWeight" label="总重量(g)"></el-table-column>
        <el-table-column prop="operateUser" label="操作人"></el-table-column>
        <el-table-column prop="orderCreateTime" label="下单日期"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == undefined">- -</span>
            <span v-if="scope.row.orderStatus == '1'" class="yellowColor">待审核</span>
            <span v-if="scope.row.orderStatus == '2'" class="blackColor">已通过</span>
            <span v-if="scope.row.orderStatus == '4'" class="redColor">被驳回</span>
            <span v-if="scope.row.orderStatus == '7'" class="yellowColor">审核中</span>
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

    <!-- 添加补货单弹窗start -->
    <el-dialog :visible.sync="addProTF" :close-on-click-modal="false" width="1200px">
      <span>
        <div>
          <el-row>
            <el-col :span="20">
              <span>材质</span>
              <el-select
                v-model="goldCodeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span>分类</span>
              <el-select
                v-model="stockTypeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option
                  v-for="item in categoryNewList"
                  :key="item.label"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
              <span>生产工艺</span>
              <el-select
                v-model="processCodeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>

              <span>商品搜索</span>
              <el-input
                placeholder="请输入关键字搜索"
                v-model="search"
                class="input-with-select searchTxt"
                size="small"
                style="width:220px"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchFun" />
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="addProRepair" size="small">添加到补货购物车</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="addProDiv">
          <el-row v-for="(item,ind) in parageraphListModal" :key="ind" class="orderBigDiv">
            <!-- <el-col
              :span="1"
              class="checkboxDiv"
            >
              <el-radio
                :label="item.proNumber"
                v-model="selectProId"
              >&nbsp;</el-radio>
            </el-col>-->
            <el-col :span="23" class="tabTwo">
              <div class="tabTwoLeft">
                <img v-if="item.url" :src="$portImg+item.url" style="height:116px; width:153px;" />
                <img v-else src="/static/images/img-noimg.png" style="height:116px; width:153px;" />
              </div>

              <el-row style="line-height:30px;" class="tabTwoRight">
                <el-col :span="24">{{item.proName}}</el-col>
                <!-- <el-col
                  :span="8"
                  class="txtRed"
                >
                  库位：-
                </el-col>-->
                <el-col :span="8" class="txtTwo">编号：{{item.proNumber}}</el-col>
                <el-col :span="8" class="txtTwo">材质：{{item.goldCode}}</el-col>
                <el-col :span="8" class="txtTwo">表面工艺：{{item.effectCode}}</el-col>
                <el-col :span="8" class="txtTwo">产品类别：{{item.one}}</el-col>
                <el-col :span="8" class="txtTwo">生产工艺：{{item.processCode}}</el-col>
                <el-col :span="8" class="txtTwo">车花：{{item.carCode}}</el-col>
                <el-col :span="8" class="txtOne">成色：{{item.conditi}}</el-col>
                <el-col :span="8" class="txtOne">克重：{{item.weight}}</el-col>
                <el-col :span="8" class="txtOne">
                  <span v-if="item.sizeData.length">链长：{{item.sizeData.length}}</span>
                  <span v-if="item.sizeData.diameterLength">圈口：{{item.sizeData.diameterLength}}</span>
                  <span v-if="item.sizeData.ringHand">圈口：{{item.sizeData.ringHand}}</span>
                  <span v-if="item.sizeData.height">高：{{item.sizeData.height}}</span>
                </el-col>
              </el-row>

              <el-input-number
                style="align-self: flex-end;"
                v-model="item.productSum"
                size="mini"
                :min="0"
                @change="handSelect(item)"
              ></el-input-number>
            </el-col>
          </el-row>
        </div>

        <div class="pageD">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNumModal"
            :page-sizes="[12, 30, 50, 100]"
            :page-size="pageSizeModal"
            layout="total, sizes, prev, pager, next, jumper"
            :total="priceSumModal"
            background
          ></el-pagination>
        </div>
      </span>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 添加补货单弹窗end -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      // stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      orderStatus: "",
      orderStatusList: [
        { value: 1, label: "待审核" },
        { value: 7, label: "审核中" },
        { value: 2, label: "已通过" },
        { value: 4, label: "驳回" }
      ],
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ], // 排序
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数.
      rankById: "1",

      pageNumModal: 1,
      pageSizeModal: 12,
      priceSumModal: 0,
      parageraphListModal: [], //列表

      goldCodeList: [],
      categoryNewList: [],
      processCodeList: [],
      goldCodeId: "全部",
      processCodeId: "全部",
      stockTypeId: "",

      allSelectObj: {
        label: "",
        value: "全部"
      },

      addProTF: false
    };
  },
  created() {
    var self = this;
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData(1, 12);
      // this.codeDisplay();
    },
    resetAllData() {
      this.search = this.startTime = this.endTime = this.rankById = this.orderStatus =
        "";
      this.displayAllData(1, 12);
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        orderNo: self.search,
        startTime: self.startTime,
        endTime: self.endTime,
        rankBy: self.rankById,
        orderStatus: self.orderStatus,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/approveReplenishOrderList",
        params,
        res => {
          if (res.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.parageraphList = res.data.data;
            self.priceSum = res.data.pageSize;
            // if()
            // self.parageraphList.forEach((item, index) => {
            //   item.update_time = self.$api.dateGetDayTime(item.update_time);
            // });
          } else {
            self.$message.error(res.msg);
          }
        }
      );
    },

    codeDisplay() {
      var self = this;
      this.$publicData
        .categoryFun()
        .then(function(res) {
          self.categoryNewList = res;
          if (
            JSON.stringify(self.categoryNewList[0]) !==
            JSON.stringify(self.allSelectObj)
          ) {
            self.categoryNewList.unshift(self.allSelectObj);
          }
        })
        .catch(function(err) {
          self.categoryList = [];
          self.$message.error(err);
        });
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
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },

    addProRepair() {
      this.$confirm("是否加入补货购物车?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.editAddPro();
        })
        .catch(() => {});
    },

    //确定补货事件 todo
    editAddPro() {
      const self = this;
      const { parageraphListModal } = this;
      let params = {},
        relCartFroms = [];
      parageraphListModal.forEach(item => {
        if (item.one === "套装") {
          item.suit = 2;
        }
        if (item.one !== "套装") {
          item.suit = 1;
        }
      });
      relCartFroms = parageraphListModal
        .filter(item => item.productSum > 0)
        .map(item => {
          return {
            skuNum: item.proNumber,
            sum: item.productSum,
            suit: item.suit
          };
        });
      params = Object.assign({}, { relCartFroms: relCartFroms });
      //
      this.$axios
        .post(this.$portMain + "/order/addReplenishCartList", params)
        .then(res => {
          if (res.data.code == 200) {
            // self.displayAllData(1, this.pageSize)
            self.$message.success("添加到补货购物车成功！");
            self.addProTF = false;
            setTimeout(function() {
              self.$router.push("repleCart");
            }, 1000);
          }
        });
    },

    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "repleAllOrderDetail",
        query: { orderNo: elem.orderNo }
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
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, 12);
    },

    searchFun() {
      this.displayAllData(1, 12);
    },

    addProFun() {
      this.addProTF = true;
      this.displayAllData(1, 12);
    },

    handSelect(item) {
      //
      this.$forceUpdate();
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
}

.orderBigDiv {
  padding: 20px;
  min-height: 126px;
  border-bottom: #E9ECF5 1px solid;

  .orderBigDivOne {
    color: #333;
  }
}

.txtOne {
  font-size: 12px;
  color: #333;
}

.txtTwo {
  font-size: 12px;
  color: #999;
}

.txtRed {
  font-size: 12px;
  color: #F20F34;
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
</style>
