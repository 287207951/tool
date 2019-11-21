<template>
  <div class="conBigDiv customTable" ref="vaultCreatGoldAllocation">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建调拨</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24" class="itemRight">
          <el-button type="danger" size="small" plain @click="queryFun">取消</el-button>
          <el-button type="primary" size="small" @click="submitPrint" :loading="btnLoadingTF">提交并打印</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>接收单位</span>
            <el-select
              v-model="submitData.customer_id"
              placeholder="请选择接收单位"
              size="small"
              style="width: 240px;"
              @change="selectCustomer"
            >
              <el-option
                v-for="item in customerData"
                :key="item.id"
                :label="item.stockName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:12px">
            <span>调拨部门</span>
            <el-select
              v-model="submitData.company_id"
              placeholder="请选择调拨公司"
              size="small"
              style="width: 240px;"
              disabled
            >
              <el-option
                v-for="item in companyData"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span style="margin-left: 13px;">料种类</span>
            <el-select
              v-model="submitData.stock_kind_id"
              placeholder="请选择库柜"
              size="small"
              style="width: 240px;"
              @change="selectStock"
            >
              <el-option
                v-for="item in stockSetKindData"
                :key="item.id"
                :label="item.material_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:12px">
            <span style="margin-left: 13px;">调拨柜</span>
            <el-select
              v-model="submitData.counter_id"
              placeholder="请选择库柜"
              size="small"
              style="width: 240px;"
              @change="selectPosition"
            >
              <el-option
                v-for="item in findPositionData"
                :key="item.id"
                :label="item.enter_counter"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注</span>
            <textarea name id class="textAreaStlye" placeholder="请输入备注信息" v-model="submitData.note"></textarea>
            <!-- <span class="completeDes">备注信息备注信息备注信息备注信息备注信息</span> -->
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="allotOrderLines"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          header-align="center"
          align="center"
          width="50px"
          prop="name"
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column header-align="center" align="center" prop="name" label="类型">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.stock_type_id"
              placeholder="请选择"
              size="small"
              @change="selectStockFun(scope.row.stock_type_id)"
            >
              <el-option
                v-for="item in stockSetTypeList"
                :key="item.id"
                :label="item.material_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="k_weight" label="重量">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.k_weight"
              placeholder="请输入内容"
              size="small"
              @input="comptMoney(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop label="克工费">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.k_wage"
              placeholder="请输入内容"
              size="small"
              @input="comptMoney(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop label="规格">
          <template slot-scope="scope">
            <el-input v-model="scope.row.p_standard" placeholder="请输入内容" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="p_amount" label="件数">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.p_amount"
              placeholder="请输入内容"
              size="small"
              @input="comptMoney(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop label="件工费">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.p_wage"
              placeholder="请输入内容"
              size="small"
              @input="comptMoney(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="money" label="金额"></el-table-column>
        <el-table-column header-align="center" align="center" prop="note" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.note" placeholder="请输入内容" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="name" label="操作">
          <template slot-scope="scope">
            <span style="color: #F20F34" @click="addFun">添加</span>
            <span style="color: #E8B409" @click="delItem(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      customerData: [], // 接收单位数据
      companyData: [
        {
          // 发料客户
          id: 91681,
          label: "尚金缘"
        }
      ],
      submitData: { company_id: 91681 }, //提交数据
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [], // 料类型数据
      findPositionData: [], //库柜数据
      allotOrderLines: [
        {
          //新增调拨集合
          stock_type_id: "",
          k_weight: "",
          k_wage: "",
          p_standard: "",
          p_amount: "",
          p_wage: "",
          money: "",
          note: ""
        }
      ],
      tableData: [{}], // 模拟
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      btnLoadingTF: false
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.vaultCreatGoldAllocation;
      if (dom != undefined && altKey && keyCode === 83) {
        self.submitPrint();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      // this.displayAllData(1, 15);
      this.findStockSetKind();
      this.stockSetFun();
      this.findPosition();
      this.customerDataFun();
    },
    displayAllData(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/accountregister/order/list", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.pay_time = self.$api.dateGetDay(item.pay_time);
              item.create_time = self.$api.dateGetDay(item.create_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    // 查询事件
    queryFun() {
      this.$router.push("vaultGoldAllocation");
    },
    // 查询金料种类
    findStockSetKind() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询金料类型
    stockSetFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选择料类型
    selectStockFun(item) {
      let self = this;
      this.stockSetTypeList.forEach(once => {
        if (once.id == item) {
          self.submitData.stock_type = once.material_name;
          self.submitData.stock_type_id = once.id;
        }
      });
      this.allotOrderLines.forEach(once => {
        once.stock_type_id = item;
      });
    },
    // 计算金额
    comptMoney(item) {
      if (
        item.p_amount != "" &&
        item.p_wage != "" &&
        item.k_wage != "" &&
        item.k_weight != ""
      ) {
        item.money = item.p_amount * item.p_wage + item.k_wage * item.k_weight;
      } else {
        if (item.k_wage != "" && item.k_weight != "") {
          item.money = item.k_wage * item.k_weight;
        } else if (item.p_amount != "" && item.p_wage != "") {
          item.money = item.p_amount * item.p_wage;
        } else {
          item.money = "";
        }
      }
    },
    // 新增一行
    addFun() {
      this.allotOrderLines.push({
        stock_type_id: "",
        k_weight: "",
        k_wage: "",
        p_standard: "",
        p_amount: "",
        p_wage: "",
        money: "",
        note: ""
      });
    },
    // 删除一行
    delItem(index) {
      let self = this;
      if (this.allotOrderLines.length > 1) {
        //self.$message.error('至少需要一条数据');
        this.allotOrderLines.splice(index, 1);
      } else {
        self.$message.error("至少需要一条数据");
      }
    },
    // 选择料种类
    selectStock(num) {
      let self = this;
      this.stockSetKindData.forEach(item => {
        if (item.id == num) {
          self.submitData.stock_kind = item.material_name;
        }
      });
    },
    // 提交打印
    submitPrint() {
      let self = this;
      self.btnLoadingTF = true;
      // this.submitData.company_id = '91681';
      this.submitData.company_name = "尚金缘";
      // this.submitData.customer_id = '91681';
      // this.submitData.customer_name = '物流中心';
      this.submitData.allotOrderLines = this.allotOrderLines;

      if (
        this.submitData.customer_id == "" ||
        this.submitData.customer_id == undefined
      ) {
        self.$message.error("请选择接收单位！");
        return;
      }

      if (
        this.submitData.stock_kind_id == "" ||
        this.submitData.stock_kind_id == undefined
      ) {
        self.$message.error("请选择料种类！");
        return;
      }

      if (
        this.submitData.counter_id == "" ||
        this.submitData.counter_id == undefined
      ) {
        self.$message.error("请选择调拨柜！");
        return;
      }

      if (
        this.submitData.stock_type_id == "" ||
        this.submitData.stock_type_id == undefined
      ) {
        self.$message.error("请选择料类型！");
        return;
      }

      let result = false;
      this.allotOrderLines.forEach(item => {
        if (item.k_weight == "") {
          result = true;
          return;
        }
      });
      if (result) {
        self.$message.error("请填写重量！");
        return;
      }

      self.customerData.forEach(item => {
        if (item.id == self.submitData.customer_id) {
          self.submitData.customer_name = item.stockName;
        }
      });

      let paramData = {
        jsonObjs: JSON.stringify(self.submitData)
      };

      self.$api.formdataPostFun(
        self.$portMain + "/stock/depart/addAllotOrder",
        paramData,
        res => {
          self.btnLoadingTF = false;
          if (res.code == 200) {
            self.$message.success(res.msg);
            setTimeout(function() {
              self.$router.push("vaultGoldAllocation");
            }, 2000);
          }
        },
        err => {
          self.btnLoadingTF = false;
          if (err.code == 202 && err.msg == "库存不足") {
            self
              .$confirm("库存不足，确定要提交么?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                let params = {
                  jsonObjs: JSON.stringify(self.submitData),
                  simple: "simple"
                };
                self.$api.formdataPostFun(
                  self.$portMain + "/stock/depart/addAllotOrder",
                  params,
                  resTwo => {
                    self.$message.success(resTwo.msg);
                    setTimeout(function() {
                      self.$router.push("vaultGoldAllocation");
                    }, 2000);
                  },
                  errTwo => {
                    self.$message.error(errTwo.msg);
                  }
                );
              });
          } else {
            self.$message.error(err.msg);
          }
        }
      );
      // this.$axios
      //     .post(this.$portMain + "/stock/addAllotOrder", self.submitData)
      //     .then(function(res) {
      //       if (res.data.code == 200) {
      //         self.$message.success(res.data.msg);
      //         setTimeout(function() {
      //           self.$router.push('goldAllocation')
      //         },2000)
      //       } else {
      //         self.$message.error(res.data.msg);
      //       }
      //     })
    },
    //查询柜信息
    findPosition() {
      let self = this;
      let params = {
        PRS: {
          departId: 19
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选择库柜
    selectPosition(num) {
      let self = this;
      this.findPositionData.forEach(item => {
        if (item.id == num) {
          self.submitData.output_counter = item.enter_counter;
        }
      });
    },
    // 获取接收单位数据
    customerDataFun() {
      let self = this;
      let params = {
        PRS: {
          statue: 1
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/stockposition/order/list", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //选择接收单位关联名称
    selectCustomer(id) {
      let self = this;
      this.customerData.forEach(item => {
        if (item.id == id) {
          self.submitData.customer_name = item.stockName;
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
}
</style>

<style>
.customTable .el-table__header th {
  background-color: #f5f7fa;
}
</style>
