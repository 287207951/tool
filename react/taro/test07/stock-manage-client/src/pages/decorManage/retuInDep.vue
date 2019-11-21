<template>
  <div class="conBigDiv" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>出饰单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">单据状态</span>
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
          <!-- <span class="fontStyle">调拨状态</span>
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
          </el-select>-->
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
          总计：入库总毛重 {{totalWeight}} g     入库总净重 {{totalSuttle}} g
        </el-col>-->
      </el-row>
      <el-table :data="orderAllData" @row-dblclick="editGold" style="width: 100%">
        <el-table-column prop="returnNumber" label="退饰单号" width="150px"></el-table-column>
        <el-table-column prop="factoryNumber" label="工单号" width="186px"></el-table-column>
        <el-table-column prop="reapUnit" label="工厂名称" width="190px"></el-table-column>
        <el-table-column prop="sponsorDepartment" label="客户名称"></el-table-column>
        <el-table-column prop="totalWeight" label="总毛重"></el-table-column>
        <el-table-column prop="totalSuttle" label="总净重"></el-table-column>
        <el-table-column prop="sum" label="总数量"></el-table-column>
        <el-table-column prop="totalMoney" label="总金额"></el-table-column>
        <el-table-column prop="returnReasonVal" width="130" label="退饰原因"></el-table-column>
        <el-table-column prop="remark" width="130" label="备注信息">
          <template slot-scope="scope">
            <span>{{scope.row.remark != ''?scope.row.remark:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="退饰状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == undefined">- -</span>
            <span v-if="scope.row.status == 1">已完成</span>
            <span class="redColor" v-if="scope.row.status == 2">红冲</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="200px">
          <template slot-scope="scope">
            <span>{{$api.dateGetDayTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="操作人"></el-table-column>
        <el-table-column prop="print" label="打印"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="redColor" @click="orderPrintFun(scope.row)">打印</span>
            <!-- <span class="redColor" @click="hcFun(scope.row)" v-if="scope.row.status == 1">红冲</span> -->
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
    <!-- 红冲开始 -->
    <div v-show="false">
      <div style="display:flex;padding:10px 0;font-size:11px" ref="printTabTwoHC">
        <div style="width:42%;border:1px solid #000;text-align:center">
          <div style="height:30px;line-height:30px">出货明细</div>
          <div
            class="tr"
            style="display:flex;border-top:1px solid #000;height:30px;line-height:30px"
          >
            <div style="width:25%;border:1px dashed #000;border-top:0;border-left:0;">SKU编号</div>
            <div style="width:25%;border:1px dashed #000;border-top:0;border-left:0;">种类</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >营销品类</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
            >重量</div>
          </div>
          <div
            class="td"
            style="display:flex;height:30px;line-height:30px"
            v-for="(ielem,indOne) in tabLeftDataHC"
            :key="indOne"
          >
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;"
            >{{ielem.skuNmber}}</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;"
            >{{ielem.productCs}}</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.marketName}}</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
            >{{ielem.weight}}</div>
          </div>
          <div style="display:flex;height:30px;line-height:30px">
            <div style="width:60%">合计</div>
            <div style="width:25%;text-align:right;">{{skuCeditSumHC}}</div>
            <div style="width:25%"></div>
          </div>
        </div>
        <div style="width:1%">&nbsp;</div>
        <div style="width:57%;border:1px solid #000;text-align:center">
          <div style="height:30px;line-height:30px">账款明细</div>
          <div
            class="tr"
            style="display:flex;border-top:1px solid #000;height:30px;line-height:30px"
          >
            <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">方式</div>
            <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">项目</div>
            <div
              style="width:15%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >重量</div>
            <div
              style="width:15%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >单价/克</div>
            <div
              style="width:10%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >数量</div>
            <div
              style="width:13%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >单价/件</div>
            <div
              style="width:18%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >金额</div>
            <div
              style="width:12%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
            >备注</div>
          </div>
          <div
            class="td"
            style="display:flex;height:30px;line-height:30px"
            v-for="(ielem,indOne) in tabRightDataHC"
            :key="indOne"
          >
            <div
              style="width:15%;border:1px dashed #000;border-top:0;border-left:0;"
            >{{ielem.ceditWayName?ielem.ceditWayName:'-'}}</div>
            <div
              style="width:15%;border:1px dashed #000;border-top:0;border-left:0;"
            >{{ielem.ceditProject?ielem.ceditProject:'-'}}</div>
            <div
              style="width:15%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.ceditWeight?$api.returnFloat(ielem.ceditWeight):'-'}}</div>
            <div
              style="width:15%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.ceditPriceG?$api.returnFloat(ielem.ceditPriceG):'-'}}</div>
            <div
              style="width:10%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.ceditAmount?ielem.ceditAmount:'-'}}</div>
            <div
              style="width:13%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.ceditPriceJ?$api.returnFloat(ielem.ceditPriceJ):'-'}}</div>
            <div
              style="width:18%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.ceditMoney?$api.returnFloat(ielem.ceditMoney):'-'}}</div>
            <div
              style="width:12%;border:1px dashed #000;border-top:0;border-left:0;border-right:0"
            >{{ielem.remark?ielem.remark:'-'}}</div>
          </div>

          <div style="display:flex;height:30px;line-height:30px">
            <div style="width:83%">合计</div>
            <div style="width:18%;text-align:right;">{{ceditSumNumHC}}</div>
            <div style="width:12%"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="红冲数据" :visible.sync="HCWinTF" width="1200px" :close-on-click-modal="false">
      <span>
        <div style="display:flex">
          <div style="width: 32%;" class="tableWrapOne">
            <el-table
              :data="tabLeftDataHC"
              border
              show-summary
              :summary-method="getSummaries"
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column header-align="center" align="center" label="出货明细">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="label"
                  type="index"
                  label="序号"
                  width="50"
                ></el-table-column>
                <!-- <el-table-column
                  header-align="center"
                  align="center"
                  prop="skuNmber"
                  label="SKU编号"
                ></el-table-column>-->
                <el-table-column header-align="center" align="center" prop="conditi" label="种类"></el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="marketName"
                  label="营销品类"
                ></el-table-column>
                <el-table-column header-align="center" align="center" prop="weight" label="实收重量"></el-table-column>
              </el-table-column>
            </el-table>
          </div>

          <div style="width: 68%;" class="tableWrapTwo">
            <el-table
              :data="tabRightDataHC"
              border
              show-summary
              :summary-method="getSummaries"
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column header-align="center" align="center" label="账款明细">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="ceditWayName"
                  label="结费方式"
                >
                  <!-- <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.ceditWayName"
                      placeholder="请选择"
                      size="small"
                      class="inputSmallTwo"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.ceditWayId"
                        :label="item.ceditWayName"
                        :value="item.ceditWayName"
                      >
                      </el-option>
                    </el-select>
                  </template>-->
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="ceditProject"
                  label="项目"
                ></el-table-column>
                <el-table-column header-align="center" align="center" prop="ceditWeight" label="重量"></el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="ceditPriceG"
                  label="单价/克"
                ></el-table-column>
                <el-table-column header-align="center" align="center" prop="ceditAmount" label="数量"></el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="ceditPriceJ"
                  label="单价/件"
                ></el-table-column>
                <el-table-column header-align="center" align="center" prop="ceditMoney" label="金额"></el-table-column>
                <el-table-column header-align="center" align="center" prop="remark" label="备注"></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="HCWinTF = false" size="small" :loading="btnLoading">取 消</el-button>
        <el-button type="primary" @click="addHCFun" size="small" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 红冲结束 -->
    <div v-show="false">
      <PrintTPOne :billData="orderData" ref="myComp"></PrintTPOne>
    </div>
  </div>
</template>
<script>
var Nzh = require("nzh");
export default {
  data() {
    return {
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      oriOrderNoTxt: "", //原单号搜索
      orderNoTxt: "", //收货单号搜索
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      orderStatusCode: "",
      selectedDay: "",
      startTime: "", //开始时间
      endTime: "", //结束时间
      baoList: [{ newTF: true, sum: 0, roughWeight: 0, suttle: 0, baoNo: "" }], //包的数组
      baoListNew: {}, //空闲未确认打包
      selectProId: [],
      winOneTF: false, //调拨出库弹框
      proListOne: [], //未选择产品列表
      orderStatusSear: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "已完成"
        },
        {
          code: "2",
          value: "红冲"
        }
      ],
      orderSourceCode: "",
      orderSourceSear: [
        {
          code: "",
          value: "全部"
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
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      allChecked: false, //全选多选框
      options: [], //模拟
      orderAllData: [], //列表
      dialogTableVisible: false, //金料单弹出框
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      totalWeight: 0, //总毛重
      totalSuttle: 0, //总净重
      priceTxt: "",
      tabLeftData: [],
      tabRightData: [],
      tabLeftDataHC: [],
      tabRightDataHC: [],
      orderData: {},
      ceditSumNum: 0,
      skuCeditSum: 0,
      HCWinTF: false,
      nowTime: "",
      HCData: {},
      operaMan: "全部", //操作人
      operaManList: ["全部"], //操作人列表
      btnLoading: false, //按钮加载中
      webLoadingTF: false,
      ceditSumNumHC: 0,
      skuCeditSumHC: 0
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData(1, 12);
      //操作人列表调用接口
      this.operaManFun();
      this.menuData();
    },
    displayAllData(num, size) {
      var self = this;
      self.webLoadingTF = true;
      let orderStatusTxt = "";
      // if(self.orderStatusCode === 'N'){
      //   orderStatusTxt = 1
      // }
      // if(self.orderStatusCode === 'Y'){
      //   orderStatusTxt = 2
      // }
      let params = {
        returnNumber: self.oriOrderNoTxt,
        userName: self.operaMan === "全部" ? "" : self.operaMan,
        // orderType: self.orderSourceCode,
        startDate: self.startTime,
        endDate: self.endTime,
        type: self.orderStatusCode,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/returnJewelryList",
        params,
        res => {
          self.webLoadingTF = false;
          self.totalSuttle = res.data.totalSuttle;
          self.totalWeight = res.data.totalWeight;
          self.pageNum = num;
          self.pageSize = size;
          self.priceSum = res.data.pageList.rowSize;
          self.orderAllData = res.data.pageList.data;
          // console.log(self.orderAllData)
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
      let params = { PRS: { type: 2 } };
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
    //退饰单打印
    orderPrintFun(elem) {
      let self = this;

      var params = { PRS: { returnNumber: elem.returnNumber } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findReturnNumber", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tabLeftData = res.data.data.dataList;
            self.tabRightData = res.data.data.listCredit;
            self.orderData = res.data.data;
            self.orderData.outstoreCedits = self.tabRightData;
            self.tabLeftData.forEach(ielem => {
              ielem.sku_product_type = ielem.marketingCategoryName;
              ielem.marketing_type = ielem.conditi;
              ielem.sku_check_weight = ielem.weight;
            });
            self.orderData.skuCeditGroups = self.tabLeftData;
            self.orderData.note = self.orderData.returnReasonVal;
            self.orderData.outstoreCode = self.orderData.returnNumber;
            self.orderData.customerName = self.orderData.sponsorDepartment;
            self.orderData.sponsorUnit = "物流中心";
            self.nowTime = self.$moment().format("YYYY年MM月DD日 HH:mm:ss");
            self.changeSumNum();
            setTimeout(function() {
              self.$refs.myComp.compPrintFun();
              if (!self.$refs.myComp.LODOP) {
                return;
              }
              self.printFun(elem.returnNumber);
            }, 100);
            //
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    changeSumNum() {
      // console.log('changeSumNum')
      this.ceditSumNum = 0;
      this.tabRightData.forEach(jelem => {
        this.ceditSumNum += parseFloat(jelem.ceditMoney ? jelem.ceditMoney : 0);
      });
      this.skuCeditSum = 0;
      this.tabLeftData.forEach(jelem => {
        this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    //打印事件
    printFun(elem) {
      let self = this;
      let params = {
        type: 1,
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
    //菜单读取事件
    menuData() {
      var self = this;
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "retuInDepDet",
        query: { returnNumber: elem.returnNumber }
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
        this.startTime = this.$api.dateGetDay(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, this.pageSize);
      this.menuData();
    },
    //多选择单
    handleSelectionChange(val) {
      this.selectProId = val;
    },
    //调拨出库
    stockOutFun() {
      let self = this;
      if (this.selectProId.length === 0) {
        this.$message.error("未选择入饰单，请重新选择并提交!");
        return;
      }
      let selectIdList = [];
      this.selectProId.forEach(ielem => {
        selectIdList.push(ielem.number);
      });
      var params = { PRS: { stockNumber: selectIdList.join(",") } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findStockNumberData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // self.DepartList = res.data.data;
            self.proListOne = res.data.data;
            self.winOneTF = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //退货出库
    returnOutFun() {
      if (this.selectProId.length === 0) {
        this.$message.error("未选择入饰单，请重新选择并提交!");
        return;
      }
    },
    //空闲包计算
    skuListNum(elem) {
      elem.sum = 0;
      elem.roughWeight = 0;
      elem.suttle = 0;
      elem.skuList.forEach(ielem => {
        elem.sum += parseFloat(ielem.editNum);
        elem.roughWeight += parseFloat(ielem.editRoughWeight);
        elem.suttle += parseFloat(ielem.editSuttle);
      });
      // console.log(elem.skuList)
    },
    //确认打包
    confirmBao(elem) {
      let self = this;
      if (!elem.skuList || elem.skuList.length === 0) {
        self.$message.error("此包未添加产品，请添加产品再进行确认操作！");
        return;
      }
      this.$axios
        .get(self.$portMain + "/stockManagement/findNumber")
        .then(function(res) {
          if (res.data.code == 200) {
            elem.newTF = false;
            elem.baoNo = res.data.data;
            if (self.proListOne.length > 0) {
              self.baoList.push({
                newTF: true,
                sum: 0,
                roughWeight: 0,
                suttle: 0,
                baoNo: ""
              });
            }
            self.$forceUpdate();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //添加款账明细
    addDataOne(index, tabData) {
      tabData.splice(index + 1, 0, {
        ceditAmount: "",
        ceditId: "",
        ceditMoney: "",
        ceditNote: "",
        ceditPriceG: "",
        ceditProject: "",
        ceditWayId: "",
        ceditWayName: "转存",
        ceditWeight: ""
      });
    },
    //删除款账明细
    delDataOne(index, tabData) {
      if (tabData.length > 1) {
        tabData.splice(index, 1);
      } else {
        this.$message.error("款账明细不能全删！");
      }
    },
    changeSumNum() {
      // console.log('changeSumNum')
      this.ceditSumNum = 0;
      this.tabRightData.forEach(jelem => {
        this.ceditSumNum += parseFloat(jelem.ceditMoney ? jelem.ceditMoney : 0);
      });
      this.skuCeditSum = 0;
      this.tabLeftData.forEach(jelem => {
        this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    },
    //表格1底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "实收重量" || column.label === "金额") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                let res = (Number(prev) + Number(curr)).toFixed(2);
                return res;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    },

    //红冲
    hcFun(elem) {
      let self = this;
      self.HCData = elem;
      this.$confirm("此操作将进行红冲操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(self.$refs.printTabTwoHC.innerHTML)
          var params = { PRS: { returnNumber: elem.returnNumber } };
          this.$axios
            .get(self.$portMain + "/stockManagement/RCWreturnListData", params)
            .then(function(res) {
              if (res.data.code == 200) {
                // console.log(res.data.data)
                self.tabLeftDataHC = res.data.data.dataList;
                self.tabRightDataHC = res.data.data.listCredit;
                self.changeSumNumHC();
                self.HCWinTF = true;
              } else {
                self.$message.error(res.data.msg);
              }
            });

          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {});
    },
    //确认红冲
    addHCFun() {
      let self = this;
      self.btnLoading = true;
      let params = {
        returnNumber: self.HCData.returnNumber,
        fromDiv: JSON.stringify({
          name: "出货明细",
          value: "退货",
          tabLeft: self.tabLeftDataHC,
          tabRight: self.tabRightDataHC,
          orderRemarks: null
        })
        // fromDiv: self.$refs.printTabTwoHC.innerHTML,
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/addRCWreturnListData",
        params,
        res => {
          self.$message.success("红冲此单成功，正在刷新！");
          self.HCWinTF = false;
          setTimeout(function() {
            self.btnLoading = false;
            self.created_fun();
          }, 1000);
        },
        err => {
          self.btnLoading = false;
          self.$message.error(err.msg);
        }
      );
    },

    changeSumNumHC() {
      // console.log('changeSumNum')
      this.ceditSumNumHC = 0;
      if (this.tabRightDataHC) {
        this.tabRightDataHC.forEach(jelem => {
          this.ceditSumNumHC += parseFloat(
            jelem.ceditMoney ? jelem.ceditMoney : 0
          );
        });
      }

      this.skuCeditSumHC = 0;
      if (this.tabLeftDataHC) {
        this.tabLeftDataHC.forEach(jelem => {
          this.skuCeditSumHC += parseFloat(jelem.weight ? jelem.weight : 0);
        });
      }
      this.ceditSumNumHC = this.$api.returnFloatNum(this.ceditSumNumHC);
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

  .width70 {
    width: 80px;
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

  .padding10 {
    padding: 10px;
  }

  .padding20 {
    padding: 20px;
    font-size: 14px;
  }

  .baoTabOne {
    background: #E4EAF0;
    margin: 5px 0;
    padding: 10px;
    color: #8A8E99;
  }

  .baoProOne {
    border: 1px solid #E5F1FF;
    padding: 5px;
    margin-top: 10px;
    color: #8A8E99;

    .checkboxOne {
      line-height: 90px;
      text-align: center;
    }
  }
}
</style>
