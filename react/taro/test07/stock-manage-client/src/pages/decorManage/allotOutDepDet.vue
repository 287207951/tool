<template>
  <div class="conBigDiv" ref="creatSendMaterial" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库列表</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24" class="itemRight">
          <el-button
            type="danger"
            size="small"
            plain
            v-if="orderAllData.numberType == 3 ||orderAllData.numberType == 1"
            @click="cancelDataOne()"
          >作废</el-button>
          <el-button type="primary" size="small" @click="printFunTwo">打印({{orderAllData.print}})</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>调拨单号：</span>
            <span>{{retreatNumber}}</span>
          </div>
          <div style="margin-top:14px">
            <span>调拨部门：</span>
            <span>{{orderAllData.sponsorDepartment}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>调拨状态：</span>
            <span style="color:#F26D0F">
              <span v-if="orderAllData.numberType == undefined">- -</span>
              <span style="color:#F26D0F" v-if="orderAllData.numberType == 1">待签收</span>
              <span class="redColor" v-if="orderAllData.numberType == 2">已签收</span>
              <span class="redColor" v-if="orderAllData.numberType == 3">驳回</span>
              <span class="redColor" v-if="orderAllData.numberType == 4">作废</span>
            </span>
          </div>
          <div style="margin-top:14px">
            <span>接收单位：</span>
            <span>{{orderAllData.reapUnit}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>备注：</span>
            <span>{{orderAllData.remark?orderAllData.remark:'-'}}</span>
            <!-- <textarea
              name
              id
              class="textAreaStlye"
              placeholder="请输入备注信息"
              v-model="orderAllData.remark"
            ></textarea>-->
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="orderAllData.transferSlipList"
      border
      show-summary
      :summary-method="getSummaries"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{background:'#f5f7fa'}"
    >
      <!-- <el-table-column header-align="center" align="center" prop="code" width="100px" label="包号"></el-table-column> -->
      <el-table-column header-align="center" align="center" prop="species" label="种类"></el-table-column>
      <el-table-column header-align="center" align="center" prop="category" label="营销品类"></el-table-column>
      <el-table-column header-align="center" align="center" prop="purWeight" label="毛重(g)"></el-table-column>
      <el-table-column header-align="center" align="center" prop="weight" label="净重(g)"></el-table-column>
      <el-table-column header-align="center" align="center" prop="purity" label="成色"></el-table-column>
      <el-table-column header-align="center" align="center" prop="suttleWeight" label="折重"></el-table-column>
      <el-table-column header-align="center" align="center" prop="priceG" label="单价/克"></el-table-column>
      <el-table-column header-align="center" align="center" prop="sum" label="数量">
        <template slot-scope="scope">
          <span>{{ scope.row.sum || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="单价/件">
        <template slot-scope="scope">
          <span>{{ scope.row.priceJ || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="money" label="金额(￥)"></el-table-column>
      <el-table-column header-align="center" align="center" prop="remark" label="备注"></el-table-column>
    </el-table>

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
          <li v-if="item.proNumber">
            <span>编号：</span>
            <b>{{ item.proNumber || '-' }}</b>
          </li>
          <li v-if="item.goldCode">
            <span>产品材质：</span>
            <b>{{ item.goldCode }}</b>
          </li>
          <li v-if="item.feeType">
            <span>工费：</span>
            <b>{{ item.feeType == 1 ? item.additionPrice : item.feePrice }}</b>
          </li>
          <!-- <li><span>实收重量：</span><b>{{ item.realityWeight || '-' }}</b></li> -->
          <li v-if="item.weight">
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
    <!-- 打印调拨单 -->
    <div v-show="false">
      <PrintTPFour :billData="printData" ref="myCompAllocation"></PrintTPFour>
    </div>
  </div>
</template>
<script>
var Nzh = require("nzh");
export default {
  data() {
    return {
      printData: {},
      orderAllData: {
        proList: []
      },
      retreatNumber: "",
      data: [
        {
          label: 1
        }
      ],
      totalWeight: 0,
      nowTime: "",
      priceTxt: "",
      ceditSumNum: 0,
      webLoadingTF: false,
      showInfo: false // 显示SKU详情
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      let self = this;
      self.webLoadingTF = true;
      this.retreatNumber = this.$route.query.stockNumber;
      var params = { PRS: { retreatNumber: this.retreatNumber } };
      this.$axios
        .get(self.$portMain + "/stockManagement/findAllot", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.webLoadingTF = false;
            // self.tabLeftData = res.data.data.dataList;
            // self.tabRightData = res.data.data.listCredit;
            self.orderAllData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //调拨打印事件
    printFunTwo() {
      let self = this;
      // self.changeSumNum();
      self.printFun();

      this.printData = {
        customerName: this.orderAllData.reapUnit,
        orderCode: this.retreatNumber,
        sponsorUnit: this.orderAllData.sponsorDepartment,
        createTime: this.orderAllData.createTime,
        note: this.orderAllData.remark,
        transferSlips: this.orderAllData.transferSlipList
      };
      this.$refs.myCompAllocation.compPrintFun();
    },

    //打印事件
    printFun() {
      let self = this;
      let params = {
        type: 2,
        number: self.retreatNumber
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
    cancelDataOne() {
      let self = this;
      this.$confirm("此操作将进行作废操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = { PRS: { returnNumber: self.retreatNumber } };
          this.$axios
            .get(self.$portMain + "/stockManagement/updateAllot", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success("此单作废成功！");
                setTimeout(function() {
                  self.created_fun();
                }, 1000);
              } else {
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
    },

    // changeSumNum() {
    //   this.ceditSumNum = 0;
    //   this.orderAllData.transferSlipList.forEach(jelem => {
    //     if (jelem.ceditMoney) {
    //       this.ceditSumNum += parseFloat(
    //         jelem.ceditMoney ? jelem.ceditMoney : 0
    //       );
    //     }
    //     if (jelem.money) {
    //       this.ceditSumNum += parseFloat(jelem.money ? jelem.money : 0);
    //     }
    //   });
    //   this.ceditSumNum = this.$api.returnFloatNum(this.ceditSumNum);
    //   var nzhcn = Nzh.cn; // 使用简体中文,  另外有 Nzh.hk -- 繁体中文
    //   this.priceTxt = nzhcn.toMoney(this.ceditSumNum);
    // },
    //表格1底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          column.label === "毛重(g)" ||
          column.label === "净重(g)" ||
          column.label === "折重" ||
          // column.label === "数量" ||
          column.label === "金额(￥)"
        ) {
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
