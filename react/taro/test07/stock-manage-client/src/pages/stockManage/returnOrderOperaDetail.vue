<template>
  <div class="conBigDiv collectCustomer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>收客户饰</el-breadcrumb-item>
      <el-breadcrumb-item>收客户饰详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"/>
    <div class="info" v-loading="loadingState">
      <div class="info-top">
        <div class="infot-table">
          <div class="tr">
            <div class="th">订单编号</div>
            <div class="th">客户名称</div>
            <div class="th">总数量</div>
            <div class="th">总重量(g)</div>
            <div class="th">金额(¥)</div>
            <div class="th">操作人</div>
            <div class="th">操作日期</div>
            <div class="th">订单状态</div>
            <div class="th"></div>
          </div>
          <div style="height: 10px; background: #fff"></div>
          <div class="tr">
            <div class="td">{{orderAllData.orderNo}}</div>
            <div class="td">{{orderAllData.customerName}}</div>
            <div class="td">{{orderAllData.orderTotalSum}}</div>
            <!-- <div class="td">{{orderAllData.endOrderTotalWeight}}</div> -->
            <div class="td">{{orderAllData.orderGoldWeight}}</div>
            <div class="td">{{orderAllData.endOrderTotalMoney}}</div>
            <div class="td">{{orderAllData.operateUser}}</div>
            <div class="td">{{orderAllData.orderCreateTime}}</div>

            <div class="td" style="color: #F20F34" v-if="orderAllData.insertStatus == 2">已入库</div>
            <div
              class="td"
              style="color: #F20F34"
              v-if="orderAllData.orderStatus == 1 && orderAllData.insertStatus != 2"
            >待审核</div>
            <div
              class="td"
              style="color: #F20F34"
              v-if="orderAllData.orderStatus == 7 && orderAllData.insertStatus != 2"
            >审核中</div>
            <div
              class="td"
              style="color: #199C3C"
              v-if="orderAllData.orderStatus == 2 && orderAllData.insertStatus != 2"
            >已通过</div>
            <div
              class="td"
              style="color: #E8B409"
              v-if="orderAllData.orderStatus == 4 && orderAllData.insertStatus != 2"
            >被驳回</div>

            <div class="td handle">
              <el-button
                type="primary"
                size="small"
                @click="WarehousingFun"
                v-if="orderAllData.orderStatus == 2 && orderAllData.insertStatus != 2"
              >入库</el-button>
            </div>
          </div>
          <div class="tr" style="border: none">

            <el-col :span="16">
              <div
                class="txtRemark"
                v-if="orderAllData.backRemarks"
              >调拨原因：<span>{{orderAllData.backRemarks}}</span></div>
              <Steps :data="orderAllData.perFroms" v-if="orderAllData.perFroms" style="padding: 15px 0"></Steps>
            </el-col>
          </div>
        </div>
      </div>
      <!--表格-->
      <div class="tableDetailWrap" v-if="orderAllData.fromDiv != undefined">
        <div class="leftWrap">
          <div class="tableTitle">入货明细</div>
          <el-table
            :data="tableDetailOne"
            show-summary
            :summary-method="getSummariesOne"
            border
            :header-cell-style="{background:'#f5f7fa'}"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              header-align="center"
              align="center"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column prop="productCs" label="种类" header-align="center" align="center"></el-table-column>
            <el-table-column prop="marketName" label="营销品类" header-align="center" align="center"></el-table-column>
            <el-table-column prop="weight" label="实收重量" header-align="center" align="center"></el-table-column>
          </el-table>
        </div>

        <div class="rightWrap">
          <div class="tableTitle">账款明细</div>
          <el-table
            :data="tableDetailTwo"
            show-summary
            :summary-method="getSummariesTwo"
            border
            :header-cell-style="{background:'#f5f7fa'}"
            style="width: 100%"
          >
            <el-table-column prop="ceditWayName" align="center" label="结费方式" width="100"></el-table-column>
            <el-table-column prop="ceditProject" align="center" label="项目" width="110"></el-table-column>
            <el-table-column prop="ceditWeight" align="center" label="重量"></el-table-column>
            <el-table-column prop="ceditPriceG" align="center" label="单价/克"></el-table-column>
            <el-table-column prop="ceditAmount" align="center" label="数量"></el-table-column>
            <el-table-column prop="ceditPriceJ" align="center" label="单价/件"></el-table-column>
            <el-table-column prop="ceditMoney" align="center" label="金额"></el-table-column>
            <el-table-column prop="ceditNote" align="center" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
      <!--  -->
      <div class="info-middle">
        <div
          v-for="(iitem,indOne) in orderAllData.factoryProductFroms"
          :key="indOne"
          class="tabOne"
        >
          <div class="factoryTopDiv">
            <span>{{iitem.factoryName}}</span>
            <span style="margin-left: 100px">总重量(g): {{iitem.sumWeight}}</span>
            <!-- <span style="margin-left: 100px">金额(¥): -</span> -->
            <span style="float:right;">
              <span style="width:200px;" v-if="iitem.viewTF" @click="changeView(iitem)">
                <i class="el-icon-arrow-down"></i>
              </span>
              <span style="width:200px;" v-if="!iitem.viewTF" @click="changeView(iitem)">
                <i class="el-icon-arrow-up"></i>
              </span>
            </span>
          </div>
          <div v-show="iitem.viewTF">
            <!-- 单品start -->
            <div
              class="infom-info"
              v-for="(item,ind) in iitem.orderProperties"
              :key="ind"
              v-show="iitem.viewTF"
            >
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img :src="$portImg + item.productImg" width="153" height="116">
                  </div>
                  <div class="pro-right">
                    <el-row>
                      <el-col :span="24" class="pro-tit">{{item.productName}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="pro-middle">编号：{{item.productNo}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col
                        :span="24"
                        class="pro-bottom"
                      >成色：{{item.orderPeoductPerties?item.orderPeoductPerties[0].productCs:item.goldCode}}</el-col>
                    </el-row>
                  </div>
                </div>
                <div class="iitem-right">
                  <div class="order-th">
                    <div class="oth">克重(g)</div>
                    <div class="oth">重量范围(g)</div>
                    <div class="oth">工费类型</div>
                    <div class="oth">基础工费</div>
                    <div class="oth">附加工费</div>
                    <div class="oth">退货数量</div>
                    <div class="oth">实收工费(¥)</div>
                    <div class="oth">退货重量</div>
                    <!-- <div class="oth">备注</div> -->
                  </div>
                  <div class="order-item">
                    <div
                      class="order-tr"
                      v-for="(it,index) in item.orderPeoductPerties"
                      :key="index"
                    >
                      <div class="otd" v-if="it.standardGold">{{it.standardGold}}</div>
                      <div class="otd">{{it.weightStart}} - {{it.weightEnd}}</div>
                      <div class="otd">{{it.feeType === 1?'每克':''}}{{it.feeType === 2?'每件':''}}</div>
                      <div class="otd">{{it.basicFee}}</div>
                      <div class="otd">{{it.additionFee}}</div>
                      <div class="otd">{{it.orderSum}}</div>
                      <div class="otd">{{it.receiablePrice?it.receiablePrice:'-'}}</div>
                      <div class="otd">{{it.goldWeight}}</div>
                      <!--<div class="otd">
                         <el-tooltip class="item" effect="dark" :content="it.productRemarks" placement="top">
                          <span v-if="it.productRemarks">查看备注>></span>
                        </el-tooltip> 
                         {{it.productRemarks?it.productRemarks:'-'}}
                      </div>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单品end -->

            <!-- 套装start -->
            <div
              class="suit"
              v-for="(item,ind) in iitem.suitProductFroms"
              :key="ind"
              v-show="iitem.viewTF"
            >
              <div class="infom-info">
                <div class="infom-item">
                  <div class="pro-item iitem-left">
                    <div class="pro-imgs">
                      <img :src="$portImg + item.productImg" width="153" height="116">
                    </div>
                    <div class="pro-right">
                      <p class="pro-tit">{{item.productName}}</p>
                      <p class="pro-middle">编号：{{item.productNo}}</p>
                      <p class="pro-bottom">{{item.productPey}}</p>
                    </div>
                  </div>
                  <div class="iitem-right">
                    <div class="order-th">
                      <div class="oth">退货数量</div>
                      <div class="oth">金重(g)</div>
                      <div class="oth">实收工费(¥)</div>
                      <div class="oth">退货重量</div>
                      <!-- <div class="oth">备注</div> -->
                    </div>
                    <div class="order-item">
                      <div class="order-tr">
                        <div class="otd">{{item.suitSum}}</div>
                        <div class="otd">{{item.suitWeight}}</div>
                        <div class="otd">{{item.suitSkuReceiPrice}}</div>
                        <div class="otd">{{item.suitGoldWeigh}}</div>
                        <!-- <div class="otd">{{item.productRemarks?item.productRemarks:'-'}}</div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="suit-info">
                <div
                  class="infom-info suiti-item"
                  v-for="(it, ix) in item.suitProdctPeyFroms"
                  :key="ix"
                >
                  <div class="infom-item">
                    <div class="pro-item iitem-left">
                      <div class="pro-imgs">
                        <img :src="$portImg + it.productImg" width="153" height="116">
                      </div>
                      <div class="pro-right">
                        <p class="pro-tit">{{it.productName}}</p>
                        <p class="pro-feetype">编号：{{it.skuNum}}</p>
                        <p class="pro-feetype">{{it.craft}}{{it.pait?','+it.pait:''}}</p>
                        <p class="pro-feetype">克重：{{it.standardGold}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 套装end -->
          </div>
        </div>
      </div>
    </div>
    <!-- 入库弹框 -->
    <el-dialog
      title="入库单详情"
      :visible.sync="dialogType"
      width="1500px"
      class="modelWrap"
      :close-on-click-modal="false"
    >
      <div class="tableWrap">
        <div class="orderTitle">
          <div>
            入库单号：
            <span>{{orderAllData.orderNo}}</span>
          </div>
          <div>
            入库单位：
            <span>尚金缘金库</span>
          </div>
          <div>
            客户名称：
            <span>{{orderAllData.customerName}}</span>
          </div>
        </div>
        <div class="table">
          <!-- 入货明细 -->
          <div class="goodsWrap">
            <div class="goodsTitle">入货明细</div>
            <el-table
              :data="tableLeft"
              show-summary
              :summary-method="getSummaries"
              :header-cell-style="{background:'#f5f7fa'}"
              border
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                header-align="center"
                align="center"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column prop="marketName" label="营销品类" header-align="center" align="center"></el-table-column>
              <el-table-column prop="productCs" label="种类" header-align="center" align="center"></el-table-column>
              <el-table-column
                prop="orderGoldWeight"
                label="重量"
                header-align="center"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
          <!-- 账款明细 -->
          <div class="account">
            <div class="accountTitle">账款明细</div>
            <el-table
              :data="tableRight"
              show-summary
              :header-cell-style="{background:'#f5f7fa'}"
              :summary-method="getSummariesTwo"
              border
              style="width: 100%"
            >
              <el-table-column prop="orderCode" label="结费方式" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.ceditWayId"
                    placeholder="请选择"
                    size="mini"
                    class="inputSmallTwo"
                    @change="selectPro(scope.row)"
                  >
                    <el-option
                      v-for="item in viewWayData"
                      :key="item.ceditWayId"
                      :label="item.ceditWayName"
                      :value="item.ceditWayId"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop label="项目" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ceditProject" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ceditWeight" label="重量" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ceditWeight"
                    placeholder="请输入"
                    size="mini"
                    @blur="compWeightFun(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop label="单价/克" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ceditPriceG"
                    placeholder="请输入"
                    size="mini"
                    :disabled="scope.row.gdisabled"
                    @blur="blurFun(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ceditAmount" label="数量" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ceditAmount"
                    placeholder="请输入"
                    size="mini"
                    @blur="compNumberFun(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop label="单价/件" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ceditPriceJ"
                    placeholder="请输入"
                    size="mini"
                    :disabled="scope.row.jdisabled"
                    @blur="blurFun(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ceditMoney" label="金额" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.ceditMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column prop label="备注" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ceditNote" placeholder="请输入" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <span style="color:red;cursor: pointer;" @click="addFun">添加</span>
                  <span
                    style="color:#F26D0F;cursor: pointer;"
                    @click="delFun(scope.$index)"
                    v-if="scope.$index != 0"
                  >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div class="txtRight top24">
        <el-button size="small" @click="dialogType = false">取消</el-button>
        <el-button size="small" type="primary" @click="subData" :loading="btnLoadingTF">提交并打印</el-button>
      </div>
    </el-dialog>
        <!-- 打印入饰单 -->
    <div v-show="false">
      <PrintTPFive :billData="PrintData" ref="myCompDecoration"></PrintTPFive>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableDetailOne: [], //出货明细
      tableDetailTwo: [], //账款明细
      tableLeft: [], //入货明细
      tableRight: [], //账款明细
      tableData: [{}], // 模拟
      viewWayData: [], //方式数据
      dialogType: false,
      loadingState: false,
      stepsActive: 1,
      orderList: [],
      orderNo: "",
      orderAllData: {},
      btnLoadingTF:false,
      PrintData:{},
    };
  },

  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
    this.viewWay();
  },

  methods: {
    created_fun() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          orderNo: this.orderNo
        }
      };
      this.$axios
        .get(this.$portMain + "/order/selectBackOrderByOrderNo", params)
        .then(res => {
          self.orderAllData = res.data.data;
          self.loadingState = false;
          let stepAc = "";
          if (!self.orderAllData.perFroms) {
            self.orderAllData.perFroms = [];
          }
          for (var i = 0; i < self.orderAllData.perFroms.length; i++) {
            if (self.orderAllData.perFroms[i].orderStatus === 1) {
              stepAc = i + 1;
              break;
            }
          }
          if (stepAc) {
            this.stepsActive = stepAc;
          } else {
            this.stepsActive = self.orderAllData.perFroms.length + 1;
          }
          self.orderAllData.perFroms.unshift({
            prcessName: "客户",
            step: 1,
            orderStatus: 2,
            processTypeFroms: [
              {
                operateName: self.orderAllData.customerName
              }
            ]
          });
          if (self.orderAllData.factoryProductFroms) {
            self.orderAllData.factoryProductFroms.forEach((iitem, indOne) => {
              if (indOne == 0) {
                iitem.viewTF = true;
              } else {
                iitem.viewTF = false;
              }
              iitem.sumWeight = 0;
              //单品统计金重
              if (iitem.orderProperties && iitem.orderProperties.length > 0) {
                iitem.orderProperties.forEach(ielem => {
                  if (
                    ielem.orderPeoductPerties &&
                    ielem.orderPeoductPerties.length > 0
                  ) {
                    ielem.orderPeoductPerties.forEach(jelem => {
                      // iitem.sumWeight += jelem.orderSum * jelem.standardGold;
                      iitem.sumWeight += jelem.goldWeight;
                    });
                  }
                });
              }
              //套装统计金重
              if (iitem.suitProductFroms && iitem.suitProductFroms.length > 0) {
                iitem.suitProductFroms.forEach(ielem => {
                  iitem.sumWeight += ielem.suitGoldWeigh;
                });
              }
            });
          }

          if (res.data.data.fromDiv != undefined) {
            let receivFromDiv = JSON.parse(res.data.data.fromDiv);
            if (receivFromDiv.name == "入货明细") {
              self.tableDetailOne = receivFromDiv.tabLeft;
              self.tableDetailOne.forEach(item => {
                item.weight = item.orderGoldWeight;
              });
              self.tableDetailTwo = receivFromDiv.tabRight;
            }
          }
        })
        .catch(function() {
          self.loadingState = false;
        });
    },

    //添加退货单
    addProFun() {
      var self = this;
      self.addProTF = true;
      self.displayAddProData(1, 12);
    },
    displayAddProData(num, size) {
      var self = this;
      let params = {
        PRS: {
          proName: self.search,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/product/proList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //改变查看当差
    changeView(elem) {
      elem.viewTF = !elem.viewTF;
      this.$forceUpdate();
    },

    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
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
        // if (index === 5 || index === 3) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return "";
        //     }
        //   }, 0);
        //   //sums[index] += "";
        // }
      });
      return sums;
    },

    getSummariesTwo(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 2 || index === 4) {
          sums[index] = "";
          return;
        }
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
        // if (index === 6) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return "";
        //     }
        //   }, 0);
        //   sums[index] += "";
        // }
      });
      return sums;
    },
    //查看方式事件
    viewWay() {
      let self = this;
      let params = {
        PRS: {
          billType: "intWay"
        }
      };
      this.$axios
        .get(this.$portMain + "/discount/getALLWay", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.viewWayData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //添加
    addFun() {
      this.tableRight.push({
        ceditWayId: 22,
        ceditWayName: "转存",
        ceditProject: "",
        ceditWeight: "",
        ceditAmount: "",
        ceditMoney: "",
        ceditPriceJ: "",
        ceditPriceG: "",
        ceditNote: "",
        gdisabled: false,
        jdisabled: false
      });
    },
    //删除
    delFun(index) {
      this.$confirm("你确定要删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableRight.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          //
        });
    },
    //焦点事件
    blurFun(elem) {
      if (elem.ceditPriceG != "" && elem.ceditPriceJ == "") {
        //单价/克
        elem.gdisabled = false;
        elem.jdisabled = true;

        if (isNaN(elem.ceditPriceG)) {
          this.$message.warning("请输入数字");
          elem.ceditPriceG = 0;
          if (elem.ceditPriceG !== "" && elem.ceditPriceJ == "") {
            elem.ceditMoney = 0;
          }
          this.$forceUpdate();
          return;
        }
        if (elem.ceditPriceG !== "" && elem.ceditPriceJ == "") {
          let money = this.$api.returnFloat(elem.ceditWeight * elem.ceditPriceG);
          console.log('money:',money)
          elem.ceditMoney = money.toFixed(2);
        }
      } else if (elem.ceditPriceG == "" && elem.ceditPriceJ != "") {
        //单价/件
        elem.gdisabled = true;
        elem.jdisabled = false;

        if (isNaN(elem.ceditPriceJ)) {
          this.$message.warning("请输入数字");
          elem.ceditPriceJ = 0;
          if (elem.ceditPriceG == "" && elem.ceditPriceJ !== "") {
            elem.ceditMoney = 0;
          }
          this.$forceUpdate();
          return;
        }

        if (elem.ceditPriceG == "" && elem.ceditPriceJ !== "") {
          let money = this.$api.returnFloatNum(elem.ceditAmount * elem.ceditPriceJ);
          elem.ceditMoney = money.toFixed(2);
        }
      } else if (elem.ceditPriceG == "" && elem.ceditPriceJ == "") {
        elem.gdisabled = false;
        elem.jdisabled = false;
        elem.ceditMoney = 0;
      }
    },
    //入库
    WarehousingFun() {
      let self = this;
      let receiptPackInfos = [];
      if (this.orderAllData.factoryProductFroms.length > 0) {
        this.orderAllData.factoryProductFroms.forEach((item, index) => {
          if (
            item.orderProperties != undefined &&
            item.orderProperties.length > 0
          ) {
            item.orderProperties.forEach(one => {
              receiptPackInfos.push({
                skuNo: one.orderPeoductPerties[0].skuNum,
                nowSkuSum: one.orderPeoductPerties[0].orderSum,
                suit: 1,
                nowPrice: one.orderPeoductPerties[0].receiablePrice,
                nowSkuGoldWeight: one.orderPeoductPerties[0].goldWeight
              });
            });
          }

          if (
            item.suitProductFroms != undefined &&
            item.suitProductFroms.length > 0
          ) {
            item.suitProductFroms.forEach(two => {
              receiptPackInfos.push({
                skuNo: two.suitSkuNum,
                nowSkuSum: two.suitSum,
                suit: 2,
                nowPrice: two.suitSkuReceiPrice,
                nowSkuGoldWeight: two.suitGoldWeigh
              });
            });
          }
        });
      }

      let params = {
        receiptPackInfos
      };
      this.$axios
        .post(this.$portMain + "/order/selectSureProductMarkmerty", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.dialogType = true;
            self.tableLeft = res.data.data.mFroms;
            self.tableRight = [];
            res.data.data.mNewSingleFroms.forEach(item => {
              self.tableRight.push({
                ceditWayId: 22,
                ceditWayName: "转存",
                ceditProject: item.ceditProject ? item.ceditProject : "",
                ceditWeight: item.ceditWeight ? item.ceditWeight : "",
                ceditAmount: item.ceditAmount ? item.ceditAmount : "",
                ceditMoney: item.ceditMoney ? item.ceditMoney : "",
                ceditPriceJ: item.ceditPriceJ ? item.ceditPriceJ : "",
                ceditPriceG: item.ceditPriceG ? item.ceditPriceG : "",
                ceditNote: "",
                gdisabled: item.ceditPriceG ? false : true,
                jdisabled: item.ceditPriceJ ? false : true
              });
            });
            
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //计算重量
    compWeightFun(elem) {
      if (isNaN(elem.ceditWeight)) {
        this.$message.warning("请输入数字");
        elem.ceditWeight = 0;
        if (elem.ceditPriceG !== "" && elem.ceditPriceJ == "") {
          elem.ceditMoney = 0;
        }
        this.$forceUpdate();
        return;
      }

      if (elem.ceditPriceG !== "" && elem.ceditPriceJ == "") {
        let money = this.$api.returnFloatNum(elem.ceditWeight * elem.ceditPriceG);
        elem.ceditMoney = money.toFixed(2);
      }
    },
    //计算数量
    compNumberFun(elem) {
      if(elem.ceditAmount){
        elem.ceditAmount = parseInt(elem.ceditAmount)
        if(elem.ceditAmount<0){
          elem.ceditAmount = 0
        }
      }
      if (isNaN(elem.ceditAmount)) {
        this.$message.warning("请输入数字");
        elem.ceditAmount = 0;
        if (elem.ceditPriceG == "" && elem.ceditPriceJ !== "") {
          elem.ceditMoney = 0;
        }
        this.$forceUpdate();
        return;
      }
      if (elem.ceditPriceG == "" && elem.ceditPriceJ !== "") {
        let money = this.$api.returnFloatNum(elem.ceditAmount * elem.ceditPriceJ);
        elem.ceditMoney = money.toFixed(2);
      }
    },
    getSummariesOne(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
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
        if (index === 1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return "";
            }
          }, 0);
          //sums[index] += "";
        }
      });
      return sums;
    },
    getSummariesTwo(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
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
        if (
          index === 2 ||
          index === 3 ||
          index === 4 ||
          index === 5 ||
          index === 7
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return "";
            }
          }, 0);
          //sums[index] += "";
        }
      });
      return sums;
    },
    //提交打印
    subData() {
      let self = this;
      self.btnLoadingTF = true
      if (this.tableRight.length == 0) {
        this.$message.warning("请选择账款明细！");
        return;
      }

      let result = false;
      this.tableRight.forEach(item => {
        if (item.ceditProject == "" || item.ceditMoney == "") {
          result = true;
        }
      });

      if (result) {
        this.$message.warning("请填写账款明细！");
        return;
      }

      let tableLeft = JSON.parse(JSON.stringify(this.tableLeft));
      let tableRight = JSON.parse(JSON.stringify(this.tableRight));

      tableRight.forEach(item => {
        delete item.gdisabled;
        delete item.jdisabled;
      });

      let tL = JSON.parse(JSON.stringify(tableLeft));
      tL.forEach(item => {
        item.weight = item.orderGoldWeight;
      });

      let tR = JSON.parse(JSON.stringify(tableRight));
      tR.forEach(item => {
        item.weight = item.ceditWeight;
      });

      let params = {
        orderNo: this.orderAllData.orderNo,
        outstore: JSON.stringify(tableRight),
        fromDiv: JSON.stringify({
          name: "入货明细",
          value: "物流",
          tabLeft: tL,
          tabRight: tR,
          orderRemarks: null
        })
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/addInspectionOrder",
        params,
        res => {
          self.$message.success(res.msg);
          self.btnLoadingTF = false
          //入饰单打印
          self.compPrint();
          setTimeout(function() {
            self.$router.push("returnOrderOpera");
          }, 1000);
        },
        err => {
          self.btnLoadingTF = false
          self.$message.error(err.msg);
        }
      );
    },
    //入饰单打印
    compPrint(){
      this.PrintData = {
        skuCeditGroups:this.tableLeft,//入货明细
        outstoreCedits:this.tableRight,//账款明细
        customerName:this.orderAllData.customerName,//发起单位
        receiver:'尚金缘金库',//接收单位
        checkTime:this.orderAllData.orderCreateTime,//日期
        rCode:this.orderAllData.orderNo,//入饰单号
        receCode:'-',//工单号
      }
      this.$refs.myCompDecoration.compPrintFun();
    },
    //选择项目
    selectPro(elem) {
      this.viewWayData.forEach(item => {
        if (elem.ceditWayId == item.ceditWayId) {
          elem.ceditWayName = item.ceditWayName;
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
  color: #333;
  padding-bottom: 200px;

  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .topMenuRight {
    text-align: right;
  }

  .searchTxt {
    flex: 1;
    width: 100%;
  }

  .top-select {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info {
    min-height: 500px;
    background: #f5f5f5;

    .info-top {
      width: 100%;
      padding: 10px 20px;
      background: #fff;
      box-sizing: border-box;

      .infot-table {
        .tr {
          display: flex;
          width: 100%;
          border: 1px solid #E9ECF5;

          .th {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            width: 16%;
            text-align: center;
            background: #999999;
            color: #fff;
          }

          .td {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80px;
            width: 16%;
            text-align: center;
          }

          .handle {
            display: flex;
            flex-direction: column;

            .el-button {
              min-width: 80px;
              margin-left: 0;
            }
          }
        }
      }
    }

    .info-middle {
      margin: 20px;

      .infom-tit {
        padding: 0 20px;
        line-height: 40px;
        background: #fff;
      }

      .infom-info {
        margin: 10px;

        .infom-item {
          display: flex;
        }
      }
    }
  }

  .pro-item {
    width: 60%;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background: #fff;
    border: 1px solid #E9ECF5;
  }

  .pro-imgs {
    position: relative;
    width: 153px;
    height: 116px;
  }

  .proimgs-add {
    position: absolute;
    display: flex;
    top: -10px;
    left: -10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.4);
  }

  .proimgs-add > div > img {
    padding-left: 10px;
  }

  .proimgs-add > div > img:nth-of-type(1) {
    padding-left: 0;
  }

  .pro-item > img {
    width: 153px;
    height: 116px;
  }

  .pro-right {
    width: 75%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin-left: 10px;
  }

  .pro-tit {
    margin: 10px 0;
    font-size: 14px;
  }

  .pro-middle {
    margin: 10px 0;
    font-size: 12px;
    color: #999;
  }

  .pro-bottom {
    margin: 10px 0;
    font-size: 12px;
    line-height: 14px;
    color: #333;
  }

  .iitem-right {
    min-width: 0%;
    flex: 1;
    min-height: 146px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }

  .order-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .order-tr {
      flex: 1;
      box-sizing: border-box;
      padding-left: 40px;
      display: flex;
      align-items: center;
      height: 30px;
      border-bottom: 1px solid #E9ECF5;

      .otd {
        width: 200px;
        text-align: center;
      }
    }

    .order-tr:nth-of-type(odd) {
      background: #FAFAFA;
    }

    .order-tr:nth-of-type(even) {
      background: #ffffff;
    }
  }

  .order-th {
    box-sizing: border-box;
    padding-left: 40px;
    display: flex;
    align-items: center;
    height: 30px;
    background: #E9ECF5;
    color: #666;

    .oth {
      width: 200px;
      text-align: center;
    }
  }

  .redTxt {
    color: #F20F34;
  }

  .steps-list {
    margin: 20px;
  }

  .suit-info {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 50px;

    .suiti-item {
      width: 48%;

      .pro-item {
        width: 100%;

        .pro-right {
          &> p {
            margin-bottom: 8px;
          }
        }

        .pro-feetype {
          font-size: 12px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }

        .pro-weight {
          font-size: 12px;
          line-height: 14px;
          color: #999;

          span {
            margin-right: 20px;
          }
        }
      }
    }
  }

  .tabOne {
    border: 1px solid #CCCCCC;
    background: #FAFAFA 100%;
    margin-bottom: 10px;

    .factoryTopDiv {
      background: #fff;
      border-bottom: 1px solid #ccc;
      padding: 10px;
      padding-left: 20px;
      color: #333333;
      font-size: 16px;
    }
  }

  .modelWrap {
    .tableWrap {
      .orderTitle {
        display: flex;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 25px;
        color: #8A8E99;
        margin-bottom: 16px;

        div {
          margin-right: 200px;
        }

        span {
          color: #222426;
        }
      }
    }

    .top24 {
      margin-top: 24px;
    }

    .table {
      display: flex;

      .goodsWrap {
        width: 25%;

        .goodsTitle {
          text-align: center;
          height: 50px;
          background: #f5f7fa;
          line-height: 50px;
        }
      }

      .account {
        width: 75%;

        .accountTitle {
          text-align: center;
          height: 50px;
          background: #f5f7fa;
          line-height: 50px;
        }
      }
    }
  }

  .tableDetailWrap {
    display: flex;
    background: #fff;
    padding-bottom: 40px;

    .tableTitle {
      text-align: center;
      height: 48px;
      line-height: 48px;
      background: #f5f7fa;
      border: 1px solid #e6ebf5;
      border-bottom: 0px;
    }

    .leftWrap {
      width: 30%;
    }

    .rightWrap {
      width: 70%;
    }

  }
  .txtRemark{
    height:30px; 
    padding:10px;
    font-size:14px;
    color:#8A9199;
    span{
      color:#232426;
    }
  }
}
</style>

<style>
/* .collectCustomer .el-table .cell,
.collectCustomer .el-table th div,
.collectCustomer .el-table--border td:first-child .cell,
.collectCustomer.el-table--border th:first-child .cell {
  padding-left: 0px;
}

.collectCustomer .el-table .cell {
  padding: 0px;
} */

/* .collectCustomer .goodsWrap .el-table th, */
.collectCustomer .goodsWrap .el-table td {
  padding: 13px 0px;
}
.collectCustomer .goodsWrap .el-table td {
  padding-top: 16px;
}

.collectCustomer .goodsWrap .has-gutter td {
  padding: 12px 0px;
}

</style>

