<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>拣货验收列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">拣货人</span>
          <el-select
            v-model="orderManId"
            placeholder="请选择"
            size="small"
            style="width:100px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderManList"
              :key="item.pickPersonId"
              :label="item.pickPersonName"
              :value="item.pickPersonId"
            ></el-option>
          </el-select>
          <span class="fontStyle">收货来源</span>
          <el-select
            v-model="orderSourceCode"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderSourceSear"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">制单时间</span>
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
          <span class="fontStyle">订单编号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            style="width:190px"
            @keyup.enter.native="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>

        <!-- <el-col :span="4">
          <span class="fontStyle">排序</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:90px"
          >
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.code"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>-->
      </el-row>
      <el-table
        v-loading="loadingState"
        :data="orderAllData"
        stripe
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="(item,ind) in menuList"
          :type="item.key=='index'?'index':''"
          :prop="item.key"
          :label="item.menuName"
          :key="ind"
          :align="item.key=='index'?'center':''"
          :width="item.width?item.width:''"
        >
          <template slot-scope="scope">
            <span>
              <span v-if="scope.row.pickSatatue == 2 || scope.row.pickSatatue == 5">
                <!-- 包号 -->
                <span v-if="item.key == 'baoNumber'">-</span>
                <!-- 验收时间 -->
                <span v-else-if="item.key == 'checkTime'">-</span>
                <!-- 验收人 -->
                <span v-else-if="item.key == 'checkName'">-</span>
                <span v-else>{{scope.row[item.key]}}</span>
              </span>
              <span v-if="scope.row.pickSatatue == 4">
                <!-- 包号 -->
                <span v-if="item.key == 'pickAmount'">{{scope.row.checkAmount}}</span>
                <!-- 验收时间 -->
                <span v-else-if="item.key == 'pickWeight'">{{scope.row.checkWeight}}</span>
                <span v-else>{{scope.row[item.key]}}</span>
              </span>
            </span>
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
  </div>
</template>
<script>

export default {
  data() {
    return {
      loadingState: false,
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      orderManId: "", //拣货人id
      orderManList: [], //拣货人列表
      orderSourceCode: "",
      orderSourceSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "_reple",
          value: "调拨出库"
        },
        {
          code: "_spot",
          value: "现货"
        },
        {
          code: "_replefactory",
          value: "出库工厂"
        }
      ],
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
      tableMenuData: {}, //菜单显示
      // tableDisData: [
      //   {
      //     id: 1,
      //     code: "_reple",
      //     value:"调拨出库",
      menuList: [
        {
          key: "pickCode",
          menuName: "拣货单号"
        },
        {
          key: "pickPersonName",
          menuName: "拣货人"
        },
        {
          key: "pickTime",
          menuName: "拣货时间",
          width:'170px',
        },
        {
          key: "orderCode",
          menuName: "订单编号",
          width:'170px',
        },
        {
          key: "customerName",
          menuName: "客户名称"
        },
        {
          key: "pickAmount",
          menuName: "数量"
        },
        {
          key: "totalWeight",
          menuName: "毛重(g)"
        },
        {
          key: "pickWeight",
          menuName: "净重(g)"
        },
        {
          key: "baoNumber",
          menuName: "原单号"
        },
        {
          key: "checkName",
          menuName: "验收人",
          
        },
        {
          key: "checkTime",
          menuName: "验收时间",
          width:'170px',
        }
      ],
      //   },
      // ],
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      selectedDay: "", //日期选择
      options: [], //模拟
      orderAllData: [], //列表
      dialogTableVisible: false, //金料单弹出框
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      this.loadingState = true;
      // this.$api.dateGetDay()
      // this.menuData();
      this.$axios
        .get(this.$portMain + "/pick/order/getCheckPersons")
        .then(function(res) {
          if (res.data.code == 200) {
            if(res.data.data){
              self.orderManList = res.data.data;
            }else{
              self.orderManList = []
            }
            
            self.orderManList.unshift({
              pickPersonId: "",
              pickPersonName: "全部"
            });
            self.displayAllData(1, 12);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    displayAllData(num, size) {
      var self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          orderType: self.orderSourceCode,
          page: num,
          pickPersonId: self.orderManId,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/pick/order/getCheckPickOrders", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.orderAllData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.orderAllData.forEach((item, index) => {
              item.pickTime = self.$api.dateGetDayTime(item.pickTime);
              item.checkTime = self.$api.dateGetDayTime(item.checkTime);
              // console.log(item)
            });
            self.loadingState = false;
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },
    //菜单读取事件
    menuData() {
      var self = this;
      self.tableDisData.forEach(item => {
        if (self.orderSourceCode == item.code) {
          self.tableMenuData = item;
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
        path: "pickOrderDetail",
        query: { pickId: elem.pickId }
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

    //搜索
    searchFun() {
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, this.pageSize);
      // this.menuData();
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

  .txtRed {
    color: #F20F34;
  }
}
</style>
