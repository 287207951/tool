<template>
  <div class="conBigDiv" ref="creatSendMaterial" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>入饰单列表</el-breadcrumb-item>
      <el-breadcrumb-item>入饰单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24" class="itemRight">
          <!-- <el-button type="danger" size="small" plain @click="hcFun" v-if="orderAllData.status == 1" >红冲</el-button> -->
          <el-button type="primary" size="small" @click="printTabOneFun">打印({{orderAllData.print}})</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div v-if="orderAllData.invoicesNumber">
            <span>原单据号：</span>
            <span>{{ orderAllData.invoicesNumber }}</span>
          </div>
          <div style="margin-top:14px" v-if="orderAllData.stockNumber">
            <span>入饰单号：</span>
            <span>{{ orderAllData.stockNumber }}</span>
          </div>
          <div style="margin-top:14px" v-if="orderAllData.factoryNumber">
            <span>工单号：</span>
            <span>{{orderAllData.factoryNumber}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div v-if="orderAllData.reapUnit">
            <span>接收单位：</span>
            <span>{{ orderAllData.reapUnit }}</span>
          </div>
          <div style="margin-top:14px" v-if="orderAllData.factoryName">
            <span>工厂名称：</span>
            <span>{{orderAllData.factoryName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div v-if="orderAllData.status">
            <span>订单状态：</span>
            <span>
              <span v-if="orderAllData.status === 1">已完成</span>
              <span v-if="orderAllData.status === 2" class="redColor">红冲</span>
            </span>
          </div>
          <div style="margin-top:14px" v-if="mock">
            <span>备注：</span>
            <span>{{mock?mock:'-'}}</span>
            <!-- <textarea
              name
              id
              class="textAreaStlye"
              placeholder="请输入备注信息"
              v-model="mock"
            ></textarea>-->
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
          <el-table-column header-align="center" align="center" label="入货明细">
            <el-table-column
              header-align="center"
              align="center"
              prop="label"
              type="index"
              label="序号"
              width="50"
            ></el-table-column>
            <el-table-column header-align="center" align="center" prop="conditi" label="种类"></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="marketingCategoryName"
              label="营销品类"
            ></el-table-column>
            <el-table-column header-align="center" align="center" prop="weight" label="实收重量"></el-table-column>
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
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="desWrap">
      <div class="desLi">
        <span>{{$moment(orderAllData.createTime).format('YYYY年MM月DD日')}}</span>
        <span class="desName">{{orderAllData.userName}}</span>
        <span>对新建提交操作</span>
      </div>
    </div>
    <!-- 19/4/3 添加SKU详情 —— Made In 大雄君。  -->
    <section class="detail" v-if="proList.length > 0">
      <h2 :class="{ show: showInfo }" @click="showInfo = !showInfo">SKU明细</h2>
      <figure :class="{ show: showInfo }" v-for="item in proList" :key="item.proNumber">
        <img :src="item.url ? $portImg+item.url : ''" :alt="item.proName" />
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
              <el-table-column header-align="center" align="center" label="入货明细">
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="label"
                  type="index"
                  label="序号"
                  width="50"
                ></el-table-column>
                <el-table-column header-align="center" align="center" prop="conditi" label="种类"></el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="marketingCategoryName"
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
                <el-table-column header-align="center" align="center" prop="ceditNote" label="备注"></el-table-column>
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
      <printTPFive :billData="printOutData" ref="myComp"></printTPFive>
    </div>
  </div>
</template>
<script>
var Nzh = require("nzh");
export default {
  data() {
    return {
      printOutData: {}, //出饰单数据
      stockNumber: "",
      mock: "",
      orderAllData: {}, //订单所有数据
      tabLeftData: [], //入货明细
      tabRightData: [], //账款明细
      tabLeftDataHC: [], //入货明细-红冲单
      tabRightDataHC: [], //账款明细-红冲单
      ceditSumNumHC: 0,
      skuCeditSumHC: 0,
      options: [], //结费方式
      HCWinTF: false, //紅沖弹框
      nowTime: "",
      ceditSumNum: 0,
      skuCeditSum: 0,
      priceTxt: "",
      btnLoading: false, //按钮加载中
      webLoadingTF: false,
      showInfo: false, // 显示SKU详情
      proList: []
    };
  },
  created() {
    this.stockNumber = this.$route.query.stockNumber;
    this.created_fun();
    //查看方式列表事件
    this.viewWay();
  },
  methods: {
    created_fun() {
      let self = this;
      self.webLoadingTF = true;
      var params = { PRS: { stockNumber: this.stockNumber } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findFactoryNumber", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.webLoadingTF = false;
            self.tabLeftData = res.data.data.list;
            self.tabRightData = res.data.data.listCredit;
            self.orderAllData = res.data.data;
            self.proList = self.orderAllData.proList;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查看方式列表事件
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
            self.options = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
    hcFun() {
      let self = this;
      this.$confirm("此操作将进行红冲操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(self.$refs.printTabTwoHC.innerHTML)
          var params = { PRS: { stockNumber: self.stockNumber } };
          this.$axios
            .get(self.$portMain + "/stockManagement/findOffsets", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.tabLeftDataHC = res.data.data.list;
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
        stockNumber: self.stockNumber,
        // fromDiv: self.$refs.printTabTwoHC.innerHTML,
        fromDiv: JSON.stringify({
          name: "入货明细",
          value: "物流",
          tabLeft: self.tabLeftDataHC,
          tabRight: self.tabRightDataHC,
          orderRemarks: null
        })
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/offsets",
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
      this.tabRightDataHC.forEach(jelem => {
        this.ceditSumNumHC += this.$api.returnFloatNum(
          jelem.ceditMoney ? jelem.ceditMoney : 0
        );
      });
      this.skuCeditSumHC = 0;
      this.tabLeftDataHC.forEach(jelem => {
        this.skuCeditSumHC += this.$api.returnFloatNum(
          jelem.weight ? jelem.weight : 0
        );
      });
      this.ceditSumNumHC = this.$api.returnFloatNum(this.ceditSumNumHC);
    },
    printTabOneFun() {
      let self = this;
      this.nowTime = this.$moment().format("YYYY年MM月DD日 HH:mm:ss");
      self.changeSumNum();
      self.tabLeftData.forEach(ielem => {
        ielem.productCs = ielem.conditi;
        ielem.marketName = ielem.marketingCategoryName;
      });
      self.printOutData = {
        receCode: self.orderAllData.factoryNumber,
        receiver: self.orderAllData.reapUnit,
        rCode: self.orderAllData.stockNumber,
        customerName: self.orderAllData.factoryName,
        checkTime: self.orderAllData.createTime,
        skuCeditGroups: self.tabLeftData,
        outstoreCedits: self.tabRightData,
        note: self.mock
      };
      this.printFun();
    },

    //打印事件
    printFun() {
      let self = this;
      self.$refs.myComp.compPrintFun();
      if (!self.$refs.myComp.LODOP) {
        return;
      }
      let params = {
        type: 3,
        number: self.stockNumber
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stockManagement/print",
        params,
        res => {
          //   self.$refs.myComp.compPrintFun();
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

    CreateOneFormPage() {
      this.LODOP = this.$getLodop();
      this.LODOP.PRINT_INIT("");
      this.LODOP.SET_PRINT_STYLE("FontSize", 10);
      this.LODOP.SET_PRINT_STYLE("Bold", 1);
      // this.LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
      this.LODOP.SET_PRINT_PAGESIZE(1, "0", "136mm", "Env12");
      this.LODOP.ADD_PRINT_HTM(
        10,
        0,
        760,
        600,
        this.$refs.printTabTwo.innerHTML
      );
    },

    changeSumNum() {
      // console.log('changeSumNum')
      this.ceditSumNum = 0;
      this.tabRightData.forEach(jelem => {
        this.ceditSumNum += this.$api.returnFloatNum(
          jelem.ceditMoney ? jelem.ceditMoney : 0
        );
      });
      this.skuCeditSum = 0;
      this.tabLeftData.forEach(jelem => {
        this.skuCeditSum += this.$api.returnFloatNum(
          jelem.weight ? jelem.weight : 0
        );
      });
      this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
      var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
      this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    }
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

  .yellowColor {
    color: #F26D0F;
  }

  .redColor {
    color: #F20F34;
  }

  .blackColor {
    color: #2E2F33;
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


