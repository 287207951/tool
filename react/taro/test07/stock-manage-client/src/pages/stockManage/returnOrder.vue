<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>退货单</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">订单状态</span>
          <el-select
            v-model="orderStatus"
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
          >
          </el-date-picker>
          <span class="fontStyle">订单编号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="orderNo"
            class="input-with-select searchTxt"
            size="small"
            style="width:160px"
            @blur="searchFun"
          >
          </el-input>
          <span style="float:right">
            <span class="fontStyle">排序</span>
            <el-select
              v-model="rankBy"
              placeholder="请选择"
              size="small"
              style="width:90px"
              @change="searchFun"
            >
              <el-option
                v-for="item in stockSetTypeList"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </span>
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
          prop="orderNo"
          label="订单编号"
        ></el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
        ></el-table-column>
        <el-table-column
          prop="orderTotalSum"
          label="总数量"
        ></el-table-column>
        <el-table-column
          prop="operateUser"
          label="操作人"
        ></el-table-column>
        <el-table-column
          prop="orderCreateTime"
          label="操作日期"
        ></el-table-column>
        <el-table-column
          prop="orderStatus"
          label="订单状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == undefined">- -</span>
            <span
              v-if="scope.row.orderStatus == 1"
              class="yellowColor"
            >待审核</span>
            <span
              v-if="scope.row.orderStatus == 7"
              class="yellowColor"
            >审核中</span>
            <span
              v-if="scope.row.orderStatus == 2"
              class="blackColor"
            >已通过</span>
            <span
              v-if="scope.row.orderStatus == 4"
              class="redColor"
            >被驳回</span>
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
      orderStatus:'',//订单状态
      orderNo: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      rankBy: "", //料类型
      addProTF: false, //添加退货单弹框
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待审核"
        },
        {
          code: "7",
          value: "审核中"
        },
        {
          code: "2",
          value: "已通过"
        },
        {
          code: "4",
          value: "未通过"
        },
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
      this.displayAllData(1, 12);
    },
    

    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          orderNo: self.orderNo,
          orderStatus:self.orderStatus,
          startTime: self.startTime,
          endTime: self.endTime,
          rankBy: self.rankBy,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/order/selectBackManageOrderDetail", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            // self.parageraphList.forEach((item, index) => {
            //   item.update_time = self.$api.dateGetDayTime(item.update_time);
            // });
            if(self.parageraphList){
              self.parageraphList.forEach((item, index) => {
                item.update_time = self.$api.dateGetDayTime(item.update_time);
              });
            }else{
              self.parageraphList = []
            }            
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
      this.searchFun();
    },
    //查询
    searchFun() {

      this.pageSize = 12;
      this.pageNum = 1;
      this.displayAllData(1,12);
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "returnOrderDetail",
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

    addProFun(){
      this.$router.push({path:'returnOrderAddProOne'})
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
  .tabOne
    display flex
    border 1px solid #f0f0f0
    padding 15px 15px 10px 15px
  .tabOneLeft
    width 174px
  .tabOneRight
    width calc(100% - 174px)
  .orderBigDiv
    padding-bottom 20px
    min-height 126px
    .orderBigDivOne
      color #333
  .totalDes
    color #F20F34
    font-size 14px
    text-align right
    span
      display inline-block
      margin-right 24px
</style>
