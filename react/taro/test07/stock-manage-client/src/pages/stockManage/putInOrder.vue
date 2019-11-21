<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库验收单</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="20">
          <span class="fontStyle">验收来源</span>
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
          <span class="fontStyle">验收人</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:160px"
          >
            <el-option
              v-for="item in orderManList"
              :key="item.code"
              :label="item.value"
              :value="item.value"
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
          >
          </el-date-picker>
          <span class="fontStyle">订单编号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchFun"
            ></el-button>
          </el-input>

        </el-col>

        <el-col :span="4">
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
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="(item,ind) in tableMenuData.menuList"
          :type="item.key=='index'?'index':''"
          :prop="item.key"
          :label="item.menuName"
          :key="ind"
          :align="item.key=='index'?'center':''"
          :width="item.key=='index'?50:''"
        >
          <template slot-scope="scope">
            <span>
              <span
                class="txtRed"
                v-if="item.key =='billStatue'"
              >
                <span v-if="scope.row.billStatue == 'Y'">已收货</span>
                <span v-if="scope.row.billStatue == 'N'">未收货</span>
                <span v-if="scope.row.billStatue == 'X'">退回</span>
              </span>

              <span v-if="item.key != 'billStatue'">{{scope.row[item.key]}}</span>
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
      tableMenuData: {}, //菜单显示
      tableDisData: [
        {
          id: 1,
          code: "_cus",
          value: "工厂来货-客单",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "customerName",
              menuName: "客户名称"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "baoCode",
              menuName: "包号"
            },
            {
              key: "factoryName",
              menuName: "工厂名称"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间"
            }
          ]
        },
        {
          id: 2,
          code: "_reple",
          value: "工厂来货-补货",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "baoCode",
              menuName: "包号"
            },
            {
              key: "factoryName",
              menuName: "工厂名称"
            },
            {
              key: "nonono",
              menuName: "质检人"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间"
            }
          ]
        },
        {
          id: 3,
          code: "_stock",
          value: "料转饰",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "baoCode",
              menuName: "包号"
            },
            {
              key: "stockType",
              menuName: "金料"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间"
            }
          ]
        },
        {
          id: 4,
          code: "_allotput",
          value: "调拨入库",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "baoCode",
              menuName: "包号"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间"
            }
          ]
        },
        {
          id: 5,
          code: "_allotputExhibi",
          value: "展厅入库单",
          menuList: [
            {
              key: "index",
              menuName: "序号"
            },
            {
              key: "orderCode",
              menuName: "单据号"
            },
            {
              key: "rCode",
              menuName: "入库单号"
            },
            {
              key: "receCode",
              menuName: "收货单号"
            },
            {
              key: "baoCode",
              menuName: "包号"
            },
            {
              key: "realAmount",
              menuName: "验收总数"
            },
            {
              key: "realWeight",
              menuName: "验收毛重(g)"
            },
            {
              key: "realGoldWeight",
              menuName: "验收净重(g)"
            },
            {
              key: "checkName",
              menuName: "验收人"
            },
            {
              key: "checkTime",
              menuName: "验收时间"
            }
          ]
        }
      ],
      orderSourceCode: "_allotput",
      orderSourceSear: [
        {
          code: "_cus",
          value: "工厂来货-客单"
        },
        {
          code: "_reple",
          value: "工厂来货-补货"
        },
        {
          code: "_stock",
          value: "料转饰"
        },
        {
          code: "_allotput",
          value: "调拨入库"
        },
        {
          code: "_allotputExhibi",
          value: "展厅入库单"
        }
      ],
      orderManList: [],
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
      customerTypeData: [
        {
          //客户类型数据
          id: "",
          label: "全部"
        },
        {
          id: "大客户",
          label: "大客户"
        },
        {
          id: "集团",
          label: "集团"
        },
        {
          id: "门店",
          label: " 门店"
        },
        {
          id: "子公司",
          label: "子公司"
        },
        {
          id: "银行",
          label: "银行"
        },
        {
          id: "内厂",
          label: "内厂"
        },
        {
          id: "外厂",
          label: "外厂"
        },
        {
          id: "提纯厂",
          label: "提纯厂"
        },
        {
          id: "内部",
          label: "内部"
        }
      ],
      outputStatueData: [
        {
          // 出库状态数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "完成"
        },
        {
          id: 2,
          label: "作废"
        }
      ],
      billsStatueData: [
        {
          // 单据状态
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "待审核"
        },
        {
          id: 2,
          label: "审核通过"
        },
        {
          id: 3,
          label: "审核驳回"
        }
      ],
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
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      
      if(localStorage.orderSourceCode === '2'){
        localStorage.orderSourceCode = '_cus'
      }
      if(localStorage.orderSourceCode === '1'){
        localStorage.orderSourceCode = '_reple'
      }
      if(localStorage.orderSourceCode === '3'){
        localStorage.orderSourceCode = '_allotput'
      }
      this.orderSourceCode = localStorage.orderSourceCode
        ? localStorage.orderSourceCode
        : "_cus";
      this.menuData();
      this.displayAllData(1, 12);
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          workSatue: self.orderSourceCode,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/receiv/order/getReceivList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.checkTime = self.$api.dateGetDayTime(item.checkTime);
              item.index = index + 1;
              item.baoCode = item.receivBaos[0].baoCode
            });
          } else {
            self.$message.error(res.data.msg);
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
      // console.log(elem)
      localStorage.sarkData = JSON.stringify(elem);
      localStorage.orderSourceCode = elem.workSatue;
      this.$router.push({
        path: "putInOrderDetail",
        query: { receId: elem.receId }
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
      this.menuData();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .yellowColor
    color #F26D0F
  .redColor
    color #F20F34
  .blackColor
    color #2E2F33
  .grayColor
    color #8a9199
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .searchTxt
    width 320px
  .pageD
    margin-top 20px
    text-align center
  .fontStyle
    color #8A8E99
    font-size 14px
    margin-left 31px
  .titleFont
    color #8A8E99
    font-size 14px
  .width160
    width 160px
  .creatStyle
    position relative
    .line
      width 640px
      height 1px
      background-color #E6E6E6
      position absolute
      top -33px
      left -20px
    .inputWidth240
      width 240px
    .inputWidth160
      width 160px
    .itemRight
      text-align right
    .marginBottom
      margin-bottom 32px
    .fontTStyle
      font-size 14px
      color #8A9199
  .detailStyle
    position relative
    .line
      width 640px
      height 1px
      background-color #E6E6E6
      position absolute
      top -33px
      left -20px
    .itemBottom
      margin-bottom 24px
    .titleStyle
      color #8A9199
      font-size 14px
      text-align right
      padding-right 24px
    .contentStyle
      color #2E2F33
      font-size 14px
  .promptStyle
    position relative
    .line
      width 480px
      height 1px
      background-color #E6E6E6
      position absolute
      top -33px
      left -20px
    .textAreaStyle
      width 433px
      height 120px
      resize none
      background rgba(240, 247, 255, 1)
  .totalDes
    color #F20F34
    font-size 14px
    text-align right
    span
      display inline-block
      margin-right 24px
</style>
