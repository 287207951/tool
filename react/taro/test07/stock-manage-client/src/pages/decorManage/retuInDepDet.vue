<template>
  <div class="conBigDiv" ref="creatSendMaterial" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>出饰单列表</el-breadcrumb-item>
      <el-breadcrumb-item>出饰单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/> 
      <el-row>
        <el-col :span="24" class="itemRight">
          <!-- <el-button type="danger" size="small" plain @click="hcFun"  v-if="orderAllData.status == 1">红冲</el-button> -->
          <el-button type="primary" size="small" @click="printTabOneFun">打印({{orderAllData.print}})</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div v-if="orderAllData.returnReasonVal">
            <span>退饰原因：</span>
            <span>{{orderAllData.returnReasonVal}}</span>
          </div>
          <div :style="orderAllData.returnReasonVal?'margin-top:14px':''">
            <span>退饰单号：</span>
            <span>{{returnNumber}}</span>
          </div>
          <div style="margin-top:14px">
            <span v-if="orderAllData.type === 1">工单号：</span>
            <span v-if="orderAllData.type === 2">出库工号：</span>
            <span>{{orderAllData.factoryNumber}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>发起单位：</span>
            <span>{{orderAllData.reapUnit?orderAllData.reapUnit:''}}</span>
          </div>
          <div style="margin-top:14px">
            <span>接收单位：</span>
            <span>{{orderAllData.sponsorDepartment?orderAllData.sponsorDepartment:''}}</span>
          </div>
          <!-- <div>
            <span>客户名称：</span>
            <span></span>
          </div>-->
        </el-col>
        <el-col :span="8">
          <div>
            <span>订单状态：</span>
            <span v-if="orderAllData.status === 1">完成</span>
            <span v-if="orderAllData.status === 2">红冲</span>
          </div>
          <div style="margin-top:14px">
            <span>备注：</span>
            <span>{{orderAllData.remark?orderAllData.remark:'-'}}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div style="display:flex">
      <div style="width: 32%;" class="tableWrapOne">
        <el-table
          :data="tabLeftData"
          border
          show-summary
          :summary-method="getSummaries"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column header-align="center" align="center" label="出货明细">
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              label="序号"
              width="50"
            ></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="marketingCategoryName"
              label="营销品类"
            ></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="conditi"
              label="种类"
              width="80"
            ></el-table-column>
            <el-table-column header-align="center" align="center" prop="weight" label="重量"></el-table-column>
          </el-table-column>
        </el-table>
      </div>

      <div style="width: 68%;" class="tableWrapTwo">
        <el-table
          :data="tabRightData"
          border
          show-summary
          :summary-method="getSummaries"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column header-align="center" align="center" label="账款明细">
            <el-table-column header-align="center" align="center" prop="ceditWayName" label="结费方式">
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
            <el-table-column header-align="center" align="center" prop="ceditProject" label="项目"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditWeight" label="重量"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditPriceG" label="单价/克"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditAmount" label="数量"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditPriceJ" label="单价/件"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditMoney" label="金额"></el-table-column>
            <el-table-column header-align="center" align="center" prop="ceditNote" label="备注"></el-table-column>
            <!-- <el-table-column header-align="center" align="center" label="操作">
              <template slot-scope="scope">
                <span style="color:#F20F34" @click="addDataOne(scope.$index, tabRightData)">添加</span>
                <span style="color:#F2930F" @click="delDataOne(scope.$index, tabRightData)">删除</span>
              </template>
            </el-table-column>-->
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="desWrap">
      <div class="desLi">
        <span>{{$moment(orderAllData.createTime).format('YYYY年MM月DD日')}}</span>
        <span class="desName">{{orderAllData.userName}}</span>
        <span>新建对提交操作</span>
      </div>
    </div>

    <!-- 19/4/3 添加SKU详情 —— Made In 大雄君。  -->
    <section class="detail" v-if="orderAllData.proList.length > 0">
      <h2 :class="{ show: showInfo }" @click="showInfo = !showInfo">SKU明细</h2>
      <figure
        :class="{ show: showInfo }"
        v-for="item in orderAllData.proList"
        :key="item.proNumber"
      >
        <img :src="item.url ? $portImg+item.url : ''" :alt="item.proName">
        <ul>
          <li>
            <span></span>
            <b>{{ item.proName || '商品名称' }}</b>
          </li>
          <li v-if="item.conditi">
            <span>产品成色：</span>
            <b>{{ item.conditi }}</b>
          </li>
          <li v-if="item.one">
            <span>产品类别：</span>
            <b>{{ item.one }}</b>
          </li>
          <!-- <li><span>实收数量：</span><b>{{ item.realityNumber || '-' }}</b></li> -->
          <li>
            <span>编号：</span>
            <b>{{ item.proNumber || '-' }}</b>
          </li>
          <li v-if="item.goldCode">
            <span>产品材质：</span>
            <b>{{ item.goldCode }}</b>
          </li>
          <li>
            <span>工费：</span>
            <b>{{ item.feeType == 1 ? item.additionPrice : item.feePrice }}</b>
          </li>
          <!-- <li><span>实收重量：</span><b>{{ item.realityWeight || '-' }}</b></li> -->
          <li>
            <span>克重：</span>
            <b>{{ item.weight || '-' }}</b>
          </li>
          <li v-if="item.processCode">
            <span>生产工艺：</span>
            <b>{{ item.processCode }}</b>
          </li>
        </ul>
      </figure>
      <div></div>
    </section>

    <!-- 红冲开始 -->
    <div v-show="false">
      <div style="display:flex;padding:10px 0;font-size:11px" ref="printTabTwoHC">
        <div style="width:42%;border:1px solid #000;text-align:center">
          <div style="height:30px;line-height:30px">出货明细</div>
          <div
            class="tr"
            style="display:flex;border-top:1px solid #000;height:30px;line-height:30px"
          >
            <div style="width:15%;border:1px dashed #000;border-top:0;border-left:0;">序号</div>
            <div style="width:35%;border:1px dashed #000;border-top:0;border-left:0;">营销品类</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;padding-right:5px"
            >种类</div>
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
            <div style="width:25%;border:1px dashed #000;border-top:0;border-left:0;">{{indOne+1}}</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;"
            >{{ielem.marketingCategoryName}}</div>
            <div
              style="width:25%;border:1px dashed #000;border-top:0;border-left:0;text-align:right;padding-right:5px"
            >{{ielem.conditi}}</div>
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
            >{{ielem.ceditNote?ielem.ceditNote:'-'}}</div>
          </div>

          <div style="display:flex;height:30px;line-height:30px">
            <div style="width:83%">合计</div>
            <div style="width:18%;text-align:right;">{{ceditSumNumHC}}</div>
            <div style="width:12%"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="红冲数据" :visible.sync="HCWinTF" :close-on-click-modal="false" width="1200px">
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
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="marketingCategoryName"
                  label="营销品类"
                ></el-table-column>
                <el-table-column header-align="center" align="center" prop="conditi" label="种类"></el-table-column>
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
                <el-table-column header-align="center" align="center" prop="ceditNote" label="备注"></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="HCWinTF = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addHCFun" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 红冲结束 -->
    <div v-show="false">
      <PrintTPOne :billData="printData" ref="myComp"></PrintTPOne> 
    </div>
  </div>
</template>
<script>

var Nzh = require("nzh");
export default {
  data() {
    return {
      printData: {},
      returnNumber: "", //退饰单号
      HCpromptType: false, //红冲弹框状态
      orderAllData: {
        proList: []
      },
      tabLeftData: [],
      tabRightData: [],
      options: [],
      nowTime: "",
      ceditSumNum: 0,
      skuCeditSum: 0,
      priceTxt: "",
      tabLeftDataHC: [], //出货明细-红冲单
      tabRightDataHC: [], //账款明细-红冲单
      HCWinTF: false, //紅沖弹框
      webLoadingTF: false,
      showInfo: false, // 显示SKU详情
      ceditSumNumHC: 0,
      skuCeditSumHC: 0
    };
  },
  created() {
    this.returnNumber = this.$route.query.returnNumber;
    this.created_fun();
  },
  methods: {
    created_fun() {
      let self = this;
      self.webLoadingTF = true;
      this.viewWay();
      var params = { PRS: { returnNumber: this.returnNumber } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findReturnNumber", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.webLoadingTF = false;
            self.tabLeftData = res.data.data.dataList;
            self.tabRightData = res.data.data.listCredit;
            self.orderAllData = res.data.data;
            self.reformPrintData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //组装打印数据
    reformPrintData() {
      let {
        factoryNumber,
        reapUnit,
        sponsorDepartment,
        createTime,
        remark
      } = this.orderAllData;
      let tabLeftData = [];
      this.tabLeftData.forEach(item => {
        tabLeftData.push({
          sku_product_type: item.conditi,
          marketing_type: item.marketingCategoryName,
          sku_check_weight: item.weight
        });
      });
      this.printData = {
        factoryNumber: factoryNumber,
        customerName: reapUnit,
        outstoreCode: this.returnNumber,
        sponsorUnit: sponsorDepartment,
        createTime: createTime,
        note: remark,
        skuCeditGroups: tabLeftData,
        outstoreCedits: this.tabRightData
      };
      // this.$refs.myComp.compPrintFun();
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
        if (column.label === "金额") {
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

    //打印事件
    printFun() {
      let self = this;
      let params = {
        type: 1,
        number: self.returnNumber
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
    printTabOneFun() {
      let self = this;
      //   this.nowTime = this.$moment().format("YYYY年MM月DD日 HH:mm:ss");
      //   self.changeSumNum();
      //   setTimeout(function() {
      //     self.CreateOneFormPage();
      //     self.LODOP.PREVIEW();
      //     self.printFun();
      //   }, 100);
      // },
      // CreateOneFormPage() {
      //   this.LODOP = this.$getLodop();
      //   this.LODOP.PRINT_INIT("");
      //   this.LODOP.SET_PRINT_STYLE("FontSize", 10);
      //   this.LODOP.SET_PRINT_STYLE("Bold", 1);
      //   this.LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
      //   this.LODOP.ADD_PRINT_HTM(
      //     10,
      //     0,
      //     760,
      //     600,
      //     this.$refs.printTabTwo.innerHTML
      //   );
      self.printFun();
      this.$refs.myComp.compPrintFun();
    },
    // changeSumNum() {
    //   // console.log('changeSumNum')
    //   this.ceditSumNum = 0;
    //   this.tabRightData.forEach(jelem => {
    //     this.ceditSumNum += parseFloat(jelem.ceditMoney ? jelem.ceditMoney : 0);
    //   });
    //   this.skuCeditSum = 0;
    //   this.tabLeftData.forEach(jelem => {
    //     this.skuCeditSum += parseFloat(jelem.weight ? jelem.weight : 0);
    //   });
    //   this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
    //   var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
    //   this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    // },
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
    //查看方式列表事件
    viewWay() {
      let self = this;
      let params = {
        PRS: {
          billType: "outWay"
        }
      };
      this.$axios
        .get(this.$portMain + "/discount/getALLWay", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.options = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //红冲
    // hcFun() {
    //   let self = this;
    //   this.$confirm("此操作将进行红冲操作, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       // console.log(self.$refs.printTabTwoHC.innerHTML)
    //       var params = { PRS: { returnNumber: self.returnNumber } };
    //       this.$axios
    //         .get(self.$portMain + "/stockManagement/RCWreturnListData", params)
    //         .then(function(res) {
    //           if (res.data.code == 200) {
    //             self.tabLeftDataHC = res.data.data.dataList;
    //             self.tabRightDataHC = res.data.data.listCredit;
    //             self.changeSumNumHC();
    //             self.HCWinTF = true;
    //           } else {
    //             self.$message.error(res.data.msg);
    //           }
    //         });

    //       // this.$message({
    //       //   type: 'success',
    //       //   message: '删除成功!'
    //       // });
    //     })
    //     .catch(() => {});
    // },

    //确认红冲
    addHCFun() {
      let self = this;
      let params = {
        returnNumber: self.returnNumber,
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
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    }

    // changeSumNumHC() {
    //   // console.log('changeSumNum')
    //   this.ceditSumNumHC = 0;
    //   this.tabRightDataHC.forEach(jelem => {
    //     this.ceditSumNumHC += parseFloat(
    //       jelem.ceditMoney ? jelem.ceditMoney : 0
    //     );
    //   });
    //   this.skuCeditSumHC = 0;
    //   this.tabLeftDataHC.forEach(jelem => {
    //     this.skuCeditSumHC += parseFloat(jelem.weight ? jelem.weight : 0);
    //   });
    //   this.ceditSumNumHC = this.$api.returnFloatNum(this.ceditSumNumHC);
    // },
    // printTabOneFun() {
    //   let self = this;
    //   this.nowTime = this.$moment().format("YYYY年MM月DD日 HH:mm:ss");
    //   self.changeSumNum();
    //   setTimeout(function() {
    //     self.CreateOneFormPage();
    //     self.LODOP.PREVIEW();
    //     self.printFun();
    //   }, 100);
    // }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .itemRight {
    text-align: right;
  }

  .itemFirst {
    margin-top: 22px;
    margin-bottom: 20px;
    line-height: 32px;
    font-size: 14px;

    span:first-child {
      color: #8A9199;
    }

    span:last-child {
      color: #222426;
    }

    .noteStyle {
      display: flex;
      justify-content: flex-end;
      // margin-top 10px
    }

    .textAreaStlye {
      width: 86%;
      height: 76px;
      border-radius: 4px;
      border: 1px solid #CFD4E6;
      resize: none;
    }
  }

  .desWrap {
    margin-top: 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(138, 145, 153, 1);

    .desLi {
      margin-bottom: 20px;

      .desName {
        color: #000;
      }
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
}

.detail {
  margin-top: 12px;

  h2 {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    color: #2E2F33;

    &:after {
      position: absolute;
      left: 80px;
      top: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      content: '>';
      transform: translate(0, -50%) rotate(-90deg);
      transition: transform 0.3s;
    }

    &.show:after {
      transform: translate(0, -50%) rotate(90deg);
    }
  }

  figure {
    display: none;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #E5F1FF;
    padding: 15px 24px;
    margin-bottom: 20px;

    &.show {
      display: flex;
    }

    img {
      width: 120px;
      height: 90px;
      background: #ccc;
      margin-right: 16px;
    }

    ul {
      width: calc(100% - 136px);
      display: flex;
      flex-wrap: wrap;

      li {
        width: calc((100% / 3));
        line-height: 30px;
        font-size: 14px;
        color: #222426;

        span {
          color: #889199;
        }
      }
    }
  }
}
</style>

<style>
.tableWrapTwo .el-table--border td:first-child {
  padding: 0px 0px;
}
</style>


