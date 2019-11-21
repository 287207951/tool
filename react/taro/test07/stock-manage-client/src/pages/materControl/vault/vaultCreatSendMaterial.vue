<template>
  <div class="conBigDiv" ref="vaultCreatSendMaterial">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建发料</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24" class="itemRight">
          <el-button type="danger" size="small" plain @click="cancelFun">取消</el-button>
          <el-button type="primary" size="small" @click="submitPrint" :loading="btnLoadingTF">提交并打印</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>发料部门</span>
            <el-select
              v-model="submitData.customer_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              size="small"
              class="inputWidth240"
            >
              <el-option
                v-for="item in customerData"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:12px">
            <span>收料客户</span>
            <el-select
              v-model="submitData.company_id"
              placeholder="请选择发料客户"
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
            <span style="margin-left: 13px;">发料柜</span>
            <el-select
              v-model="submitData.counter_id"
              placeholder="请选择发料柜"
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
          <div style="margin-top:12px">
            <span>发料种类</span>
            <el-select
              v-model="submitData.stock_kind_id"
              placeholder="请选择发料种类"
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
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注</span>
            <textarea name id class="textAreaStlye" placeholder="请输入备注信息" v-model="submitData.note"></textarea>
            <!-- <span class="completeDes">备注信息备注信息备注信息备注信息备注信息</span> -->
          </div>
        </el-col>
      </el-row>
      <div style="display: flex;">
        <!-- 表格1 -->
        <el-table
          :data="outputStockOrderLines"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="出货明细" header-align="center">
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="料类型">
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
            <el-table-column prop="output_fur_weight" label="出库毛重">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.output_fur_weight"
                  placeholder="请输入内容"
                  size="small"
                  @input="comptFurWeight(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="出库成色">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.output_quality"
                  placeholder="请输入内容"
                  size="small"
                  @input="comptFurWeight(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="output_discount_weight" label="出库折重"></el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.o_note" placeholder="请输入内容" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="colorRed" @click="addFun">添加</span>
                <span class="colorYeLLow" @click="delItem(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- 表格2 -->
        <el-table
          :data="creditLines"
          show-summary
          :summary-method="getTwoSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="账款明细" header-align="center">
            <el-table-column label="结费方式">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.expense_way_id"
                  placeholder="请选择"
                  size="small"
                  @change="selectWayFun(scope.row,scope.$index)"
                >
                  <el-option
                    v-for="item in expenseWayData"
                    :key="item.paypayVal"
                    :label="item.paypayTxt"
                    :value="item.paypayVal"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="项目">
              <template slot-scope="scope">
                <!-- <el-select v-model="scope.row.project" filterable placeholder="请选择" size="small">
                    <el-option
                      v-for="item in scope.row.findPropKindData"
                      :key="item.kindId"
                      :label="item.kindName"
                      :value="item.kindName">
                    </el-option>
                </el-select>-->
                <el-select
                  v-model="scope.row.project"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入内容"
                  :remote-method="sreachProct"
                  @focus="sreachProctData(scope.row,scope.$index)"
                  :loading="loading"
                  size="small"
                >
                  <el-option
                    v-for="item in scope.row.findPropKindData"
                    :key="item.kindId"
                    :label="item.kindName"
                    :value="item.kindName"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="重量">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.k_weight"
                  placeholder="请输入内容"
                  size="small"
                  @input="comptMoney(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.k_price"
                  placeholder="请输入内容"
                  size="small"
                  @input="comptMoney(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="money" label="金额"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <span class="colorRed" @click="addAccounts">添加</span>
                <span class="colorYeLLow" @click="delAccounts(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      sreachWayId: "", //结算方式id
      sreachCurrentIndex: "", //当前需要搜索的项目
      customerData: [], //发料客户数据
      expenseWayData: [], //结费方式
      companyData: [
        {
          // 发料客户
          id: 91681,
          label: "尚金缘"
        }
      ],
      creditLines: [
        {
          // 账款明细
          expense_way_id: "",
          expense_way: "",
          project: "",
          k_weight: "",
          k_price: "",
          money: "",
          findPropKindData: ""
        }
      ],
      outputStockOrderLines: [
        {
          // 出库明细
          output_fur_weight: "",
          output_quality: "",
          output_discount_weight: "",
          o_note: ""
        }
      ], //出库明细
      submitData: { company_id: 91681, customer_id: "" }, //新增提交数据
      stockSetKindData: [], //料种类数据
      stockSetTypeList: [], // 料类型数据
      findPositionData: [], //库柜数据
      tableData: [{}], // 模拟
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      pickerOptions2: {
        //日期选择期关键字
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      options4: [],
      value9: [],
      list: [],
      loading: false,
      btnLoadingTF:false,
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.vaultCreatSendMaterial;
      if (dom != undefined && altKey && keyCode === 80) {
        self.submitPrint();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      //this.displayAllData(1, 15);
      this.findPosition();
      this.findStockSetKind();
      this.stockSetFun();
      this.findPropPay();
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
      });
      return sums;
    },
    //表格2底部数据统计
    getTwoSummaries(param) {
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
              let res = (Number(prev) + Number(curr)).toFixed(2);
              //let res = this.$api.returnFloat()
              return res;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
        if (index === 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = this.$api.returnFloat(Number(prev) + Number(curr));
              //let res = this.$api.returnFloat()
              return res;
              //return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
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
    // 查询事件
    queryFun() {
      //
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
    // 选择库柜
    selectPosition(num) {
      let self = this;
      this.findPositionData.forEach(item => {
        if (item.id == num) {
          self.submitData.output_counter = item.enter_counter;
        }
      });
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
      this.outputStockOrderLines.forEach(once => {
        once.stock_type_id = item;
      });
    },
    // 计算出库折重
    comptFurWeight(item) {
      if (item.output_fur_weight != "" && item.output_quality != "") {
        item.output_discount_weight = (
          item.output_fur_weight * item.output_quality
        ).toFixed(4);
      } else {
        item.output_discount_weight = "";
      }
    },
    // 出库添加一行
    addFun() {
      this.outputStockOrderLines.push({
        output_fur_weight: "",
        output_quality: "",
        output_discount_weight: "",
        note: ""
      });
    },
    // 出库删除一行
    delItem(index) {
      let self = this;
      if (this.outputStockOrderLines.length > 1) {
        this.outputStockOrderLines.splice(index, 1);
      } else {
        self.$message.error("至少需要一条数据");
      }
    },
    //选择结费方式
    selectWayFun(item, index) {
      //item.expense_way = '全部转存'
      item.project = "";
      //this.findPropKind(item.expense_way_id,index);
      this.expenseWayData.forEach(one => {
        if (item.expense_way_id == one.paypayVal) {
          item.expense_way = one.paypayTxt;
        }
      });
      this.creditLines[index].findPropKindData = [];
      //this.$forceUpdate();
    },
    // 下拉搜索
    sreachProct(query) {
      let self = this;
      if (
        query !== "" &&
        self.sreachWayId !== "" &&
        self.sreachCurrentIndex !== ""
      ) {
        self.loading = true;
        self.findPropKind(query, self.sreachWayId, self.sreachCurrentIndex);
      } else {
        self.creditLines[self.sreachCurrentIndex].findPropKindData = [];
      }
      //findPropKind(item.expense_way_id,index)
    },
    // 获取搜索的需要传递的参数
    sreachProctData(item, index) {
      this.sreachWayId = item.expense_way_id;
      this.sreachCurrentIndex = index;
    },
    // 账款添加一行
    addAccounts() {
      this.creditLines.push({
        expense_way_id: "",
        expense_way: "",
        project: "",
        k_weight: "",
        k_price: "",
        money: "",
        findPropKindData: ""
      });
    },
    // 账款删除一行
    delAccounts(index) {
      let self = this;
      if (this.creditLines.length > 1) {
        //self.$message.error('至少需要一条数据');
        this.creditLines.splice(index, 1);
      } else {
        self.$message.error("至少需要一条数据");
      }
    },
    // 计算金额
    comptMoney(item) {
      if (item.k_price != "" && item.k_weight != "") {
        item.money = (item.k_price * item.k_weight).toFixed(2);
      } else {
        item.money = "";
      }
    },
    // 提交并打印
    submitPrint() {
      let self = this;
      //模拟
      self.btnLoadingTF = true
      // this.submitData.customer_id = '97301';
      // this.submitData.customer_name = 'GSK-7';
      // this.submitData.company_id = '91681';
      this.submitData.company_name = "尚金缘";
      // this.submitData.customer_type = "内厂";
      this.customerData.forEach(item => {});
      if (this.submitData.customer_id != "") {
        this.customerData.forEach(item => {
          if (item.companyId == self.submitData.customer_id) {
            self.submitData.customer_name = item.companyName;
          }
        });
      }
      //模拟
      this.submitData.outputStockOrderLines = this.outputStockOrderLines;
      this.submitData.creditLines = this.creditLines;
      let params = self.submitData;
      params.creditLines.forEach(item => {
        if (item.findPropKindData != "" || item.findPropKindData != undefined) {
          delete item["findPropKindData"];
        }
      });
      if (
        this.submitData.customer_id == "" ||
        this.submitData.customer_id == undefined
      ) {
        self.$message.error("请选择发料客户！");
        return;
      }

      if (
        this.submitData.counter_id == "" ||
        this.submitData.counter_id == undefined
      ) {
        self.$message.error("请选择收发柜！");
        return;
      }

      if (
        this.submitData.stock_kind_id == "" ||
        this.submitData.stock_kind_id == undefined
      ) {
        self.$message.error("请选择收发种类！");
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
      this.submitData.outputStockOrderLines.forEach(item => {
        if (item.output_fur_weight == "" || item.output_quality == "") {
          result = true;
        }
      });

      if (result) {
        self.$message.error("请填写出库明细！");
        return;
      }
      let paramData = {
        jsonObjs: JSON.stringify(self.submitData)
      };
      self.$api.formdataPostFun(
        self.$portMain + "/stock/depart/NaddOutputStock",
        paramData,
        res => {
          self.btnLoadingTF = false
          if (res.code == 200) {
            self.$message.success(res.msg);
            setTimeout(function() {
              self.$router.push("vaultSendMaterial");
            }, 2000);
          }
        },
        err => {
          self.btnLoadingTF = false
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
                  self.$portMain + "/stock/depart/NaddOutputStock",
                  params,
                  resTwo => {
                    self.$message.success(resTwo.msg);
                    setTimeout(function() {
                      self.$router.push("vaultSendMaterial");
                    }, 2000);
                  },
                  errTwo => {
                    self.$message.error(errTwo.msg);
                  }
                );
              });
          } else {
            self.btnLoadingTF = false
            self.$message.error(err.msg);
          }
        }
      );
    },
    // 取消
    cancelFun() {
      this.$router.push("vaultSendMaterial");
    },
    //查询结费方式
    findPropPay() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/findPropPayout")
        .then(function(res) {
          if (res.data.code == 200) {
            self.expenseWayData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //根据项目id查询项目
    findPropKind(keyWord, id, index) {
      let self = this;
      let params = {
        PRS: {
          paypayVal: id,
          search: keyWord
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPropKind", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.creditLines[index].findPropKindData = res.data.data;
            self.loading = false;
            //self.$forceUpdate();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.loading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        self.$axios
          .get(self.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.loading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .colorYeLLow {
    color: #F2930F;
  }

  .colorRed {
    color: #F20F34;
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

  .inputWidth240 {
    width: 240px;
  }
}
</style>
