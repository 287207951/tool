<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>收货单</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="20">
          <span class="fontStyle">订单状态</span>
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
          <span class="fontStyle">原单据号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="oriOrderNoTxt"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @change="searchFun"
            @blur="searchFun"
          >
          </el-input>  
          <span class="fontStyle">收货单号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="orderNoTxt"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @change="searchFun"
            @blur="searchFun"
          >
          </el-input>

        </el-col>

        <el-col :span="4">
          <span class="fontStyle">排序</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:90px"
            disabled
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
        :data="orderAllData"
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
              <span v-if="item.key =='billStatue'">
                <span v-if="scope.row.billStatue == 'Y'" class="txtBlack">已收货</span>
                <span v-if="scope.row.billStatue == 'N'" class="txtRed">未收货</span>
                <span v-if="scope.row.billStatue == 'X'" class="txtRed">退回</span>
              </span>
              <span v-if="item.key ==='orderStatus'">
                <span v-if="scope.row.orderStatus == 2" class="txtBlack">已收货</span>
                <span v-if="scope.row.orderStatus == 1" class="txtRed">未收货</span>
              </span>
              <span v-if="item.key != 'billStatue' && item.key != 'orderStatus'">{{scope.row[item.key]}}</span>
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
      oriOrderNoTxt: "", //原单号搜索
      orderNoTxt:'',//收货单号搜索
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      orderStatusCode: "",
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "N",
          value: "未收货"
        },
        {
          code: "Y",
          value: "已收货"
        },
        {
          code: "X",
          value: "退回"
        }
      ],
      orderSourceCode: "_cus",
      orderSourceSear: [
        {
          code: "2",
          value: "工厂来货-客单"
        },
        {
          code: "1",
          value: "工厂来货-补货"
        },
        {
          code: "_stock",
          value: "料转饰"
        },
        {
          code: "3",
          value: "调拨入库"
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
      tableMenuData:{},//菜单显示
      tableDisData: [
        {
          id: 1,
          code: "2",
          value:"工厂来货-客单",
          menuList: [
            {
              key: "index",
              menuName:
                "序号"
            },
            {
              key: "oriOrderNo",
              menuName:
                "单据号"
            },
            {
              key: "customerName",
              menuName:
                "客户名称"
            },
            {
              key: "orderNo",
              menuName:
                "收货单号"
            },
            {
              key: "factoryName",
              menuName:
                "工厂名称"
            },
            {
              key: "orderSum",
              menuName:
                "订单数量"
            },
            {
              key: "totailOrderWeight",
              menuName:
                "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName:
                "净重(g)"
            },
            {
              key: "creatorName",
              menuName:
                "制单人"
            },
            {
              key: "orderCreateTime",
              menuName:
                "制单日期"
            },
            {
              key: "orderStatus",
              menuName:
                "订单状态"
            },
          ]
        },
        {
          id: 2,
          code: "1",
          value:"工厂来货-补货",
          menuList: [
            {
              key: "index",
              menuName:
                "序号"
            },
            {
              key: "oriOrderNo",
              menuName:
                "单据号"
            },

            {
              key: "orderNo",
              menuName:
                "收货单号"
            },
            {
              key: "factoryName",
              menuName:
                "工厂名称"
            },
            {
              key: "nonono",
              menuName:
                "质检人"
            },
            {
              key: "orderSum",
              menuName:
                "订单数量"
            },
            {
              key: "totailOrderWeight",
              menuName:
                "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName:
                "净重(g)"
            },
            {
              key: "creatorName",
              menuName:
                "制单人"
            },
            {
              key: "orderCreateTime",
              menuName:
                "制单日期"
            },
            {
              key: "orderStatus",
              menuName:
                "订单状态"
            },
          ]
        },
        {
          id: 3,
          code: "_stock",
          value:"料转饰",
          menuList: [
            {
              key: "index",
              menuName:
                "序号"
            },
            {
              key: "oriOrderNo",
              menuName:
                "单据号"
            },
            {
              key: "orderNo",
              menuName:
                "收货单号"
            },
            {
              key: "stockType",
              menuName:
                "金料"
            },

            {
              key: "totailOrderWeight",
              menuName:
                "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName:
                "净重(g)"
            },
            {
              key: "creatorName",
              menuName:
                "制单人"
            },
            {
              key: "orderCreateTime",
              menuName:
                "制单日期"
            },
            {
              key: "orderStatus",
              menuName:
                "订单状态"
            },
          ]
        },
        {
          id: 4,
          code: "3",
          value:"调拨入库",
          menuList: [
            {
              key: "index",
              menuName:
                "序号"
            },
            {
              key: "oriOrderNo",
              menuName:
                "单据号"
            },
            {
              key: "orderNo",
              menuName:
                "收货单号"
            },
            {
              key: "orderSum",
              menuName:
                "订单数量"
            },
            {
              key: "totailOrderWeight",
              menuName:
                "毛重(g)"
            },
            {
              key: "totailGoldWeight",
              menuName:
                "净重(g)"
            },
            {
              key: "creatorName",
              menuName:
                "制单人"
            },
            {
              key: "orderCreateTime",
              menuName:
                "制单日期"
            },
            {
              key: "orderStatus",
              menuName:
                "订单状态"
            },
          ]
        },
      ],
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
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
      // this.$api.dateGetDay()
      if(localStorage.orderSourceCode === '_cus'){
        localStorage.orderSourceCode = '2'
      }
      if(localStorage.orderSourceCode === '_reple'){
        localStorage.orderSourceCode = '1'
      }
      if(localStorage.orderSourceCode === '_allotput'){
        localStorage.orderSourceCode = '3'
      }
      if(localStorage.orderSourceCode === '_allotputExhibi'){
        localStorage.orderSourceCode = '3'
      }
      
      this.orderSourceCode = localStorage.orderSourceCode?localStorage.orderSourceCode:'2';
      this.displayAllData(1, 12);
      this.menuData();
    },
    displayAllData(num, size) {
      var self = this;
      //料转饰、调拨入库调接口
      // if(self.orderSourceCode === '_allotput' || self.orderSourceCode === '_stock'){
      //   let params = {
      //     PRS: {
      //       search: self.orderNoTxt,
      //       workSatue: self.orderSourceCode,
      //       billStatue: self.orderStatusCode,
      //       page: num,
      //       rows: size
      //     }
      //   };
      //   this.$axios
      //     .get(this.$portMain + "/receiv/order/getReceivOrders", params)
      //     .then(function(res) {
      //       if (res.data.code == 200) {
      //         self.pageNum = num;
      //         self.pageSize = size;
      //         self.firstWeight = res.data.data.firstWeight;
      //         self.finalWeight = res.data.data.finalWeight;
      //         self.orderAllData = res.data.data.data;
      //         self.priceSum = res.data.data.rowSize;
      //         self.orderAllData.forEach((item, index) => {
      //           item.crearorTime = self.$api.dateGetDayTime(item.crearorTime);
      //           item.index = index+1
      //         });
      //       } else {
      //         self.$message.error(res.data.msg);
      //       }
      //     });
      // }
      //工厂来货-客单、工厂来货-补货调接口
      // if(self.orderSourceCode === '1' || self.orderSourceCode === '2'){
        let orderStatusTxt = ''
        if(self.orderStatusCode === 'N'){
          orderStatusTxt = 1
        }
        if(self.orderStatusCode === 'Y'){
          orderStatusTxt = 2
        }
        let params = {
            orderNo: self.orderNoTxt,
            orderType: self.orderSourceCode,
            orderStatus: orderStatusTxt,
            oriOrderNo:self.oriOrderNoTxt,
            page: num,
            rows: size
        };
        this.$api.formdataPostFun(
          this.$portMain + "/order/selectReceiptOrders",
          params,
          res => {
            self.pageNum = num;
            self.pageSize = size;
            self.priceSum = res.data.rowSize
            self.orderAllData = res.data.data;
            self.orderAllData.forEach((item, index) => {
              // item.orderCreateTime = self.$api.dateGetDayTime(item.orderCreateTime);
              item.index = index+1
            });
          },
          err => {
            self.$message.error(err.msg);
          }
        );
        // this.$axios
        //   .get(this.$portMain + "/receiv/order/getReceivOrders", params)
        //   .then(function(res) {
        //     if (res.data.code == 200) {
        //       self.pageNum = num;
        //       self.pageSize = size;
        //       self.firstWeight = res.data.data.firstWeight;
        //       self.finalWeight = res.data.data.finalWeight;
        //       self.orderAllData = res.data.data.data;
        //       self.priceSum = res.data.data.rowSize;
        //       self.orderAllData.forEach((item, index) => {
        //         item.crearorTime = self.$api.dateGetDayTime(item.crearorTime);
        //         item.index = index+1
        //       });
        //     } else {
        //       self.$message.error(res.data.msg);
        //     }
        //   });
      // }

    },
    //菜单读取事件
    menuData(){
      var self = this;
      self.tableDisData.forEach(item=>{
        if(self.orderSourceCode == item.code){
          self.tableMenuData = item
        }
      })
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      // console.log(this.orderSourceCode)
      localStorage.orderSourceCode = this.orderSourceCode
      this.$router.push({
        path: "deliveryOrderDetail",
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

    //搜索
    searchFun() {
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
  .txtRed
    color #F20F34
  .txtBlack
    color #333
</style>
