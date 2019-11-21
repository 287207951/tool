<template>
  <div class="conBigDiv customTable">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务审核</el-breadcrumb-item>
      <el-breadcrumb-item>饰出库</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24" class="itemRight" v-if="allData.bizInvoice.financialAudit === 0">
          <!-- <el-button type="danger" size="small" plain @click="rejectFun">审核驳回</el-button> -->
          <el-button type="danger" size="small" plain @click="saveFun">审核驳回</el-button>
          <el-button type="primary" size="small" @click="passFun" :loading="btnLoadingPass">审核通过</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-row>
          <el-col :span="8">
            <div>
              <span>出库单号：</span>
              <span>{{allData.bizInvoice.bizNo}}</span>
            </div>
          </el-col>
          <!-- <el-col :span="8">
            <div>
              <span class="grayColor">打单公司：</span>
              <span>{{allData.bizInvoice.recipient}}</span>
            </div>
          </el-col>-->
          <el-col :span="8">
            <div>
              <span class="grayColor">发起单位：</span>
              <span>{{allData.bizInvoice.initiator}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span class="grayColor">接收单位：</span>
              <span>{{allData.bizInvoice.recipient}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="remarkWrap">
              <span class="grayColor">备注：</span>
              <span>{{allData.bizInvoice.invoiceMark}}</span>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <div style="display: flex;">
        <!-- 表格1 -->
        <el-table
          :data="allData.bizPackShop"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="出库明细" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="packId" label="包号" header-align="center" align="center"></el-table-column>
            <el-table-column prop="conditi" label="种类" header-align="center" align="center"></el-table-column>
            <el-table-column prop="one" label="类别" header-align="center" align="center"></el-table-column>
            <el-table-column prop="packTotalSuttle" label="重量" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
          </el-table-column>
        </el-table>
        <!-- 表格2 -->
        <el-table
          :data="allData.proStockDetail"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="账款明细" header-align="center">
            <el-table-column prop="ceditWayName" label="结费方式"></el-table-column>
            <el-table-column prop="ceditProject" label="项目"></el-table-column>
            <el-table-column prop="ceditWeight" label="重量 "></el-table-column>
            <el-table-column prop="ceditPriceG" label="单价/克"></el-table-column>
            <el-table-column prop="ceditAmount" label="数量"></el-table-column>
            <el-table-column prop="ceditPriceJ" label="单价/件"></el-table-column>
            <el-table-column prop="ceditMoney" label="金额(￥)"></el-table-column>
            <el-table-column prop="ceditNote" label="备注"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入驳回的原因" v-model="reason"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveFun" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      bizNo: "",
      btnLoadingPass: false,
      reason: "", //驳回原因
      allData: {
        bizInvoice: {
          bizNo: ``
        }
      }, //调拨详细数据
      promptType: false, //提示状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金饰单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
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
      this.bizNo = this.$route.query.bizNo;

      this.displayAllData();
    },
    displayAllData() {
      var self = this;
      let params = {
        bizNo: self.bizNo
      };
      this.$api
        .urlPost(this.$portMain + "/financialAudit/findOutData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.allData.bizPackShop = self.allData.bizPack.filter(
              item => item.shopPack === 2
            );
            self.allData.bizPro.forEach(item => {
              item.remark = item.remark ? item.remark.split(",") : "";
              item.marketingCategoryName = item.proBasics.marketingCategoryName;
              item.conditi = item.proSpecData.conditi;
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "金额(￥)" || column.label === `重量`) {
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
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },
    //审核通过
    passFun() {
      let self = this;
      let params = {
        bizNo: this.bizNo
      };
      this.btnLoadingPass = true;
      this.$api.formdataPostFun(
        self.$portMain + "/financialAudit/approveOutData",
        params,
        res => {
          self.$message.success(res.msg);
          self.btnLoadingPass = false;
          self.$router.go(-1);
        },
        err => {
          self.$message.error(err.msg);
          self.btnLoadingPass = false;
        }
      );
    },

    // 驳回
    rejectFun() {
      this.promptType = true;
      this.reason = "";
    },
    // 确定驳回
    saveFun() {
      let self = this;
      let params = {
        bizNo: self.bizNo
        // reason: self.reason
      };
      this.$api.formdataPostFun(
        self.$portMain + "/financialAudit/rejectOutData",
        params,
        res => {
          self.$message.success(res.msg);
          self.$router.go(-1);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
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

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
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

    .completeDes {
      width: 82.5%;
      display: inline-block;
      text-align: left;
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
</style>

<style>
.customTable .el-table__header th {
  background-color: #f5f7fa;
}
</style>
