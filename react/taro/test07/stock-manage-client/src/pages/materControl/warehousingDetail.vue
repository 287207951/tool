<template>
  <div class="conBigDiv feedIn" ref="warehousingDetail">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>收料</el-breadcrumb-item>
      <el-breadcrumb-item>收料入库</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24" class="itemRight" v-if="powerCreat == 'true'">
          <el-button
            type="danger"
            size="small"
            plain
            @click="rejectFun"
            v-if="parageraphList.stock_kind != '板料'"
          >驳回</el-button>
          <el-button type="warning" size="small" @click="toVoid">作废</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitPrint"
            :loading="btnLoadingType"
          >提交并打印</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>流水号:</span>
            <span>{{parageraphList.serial_number}}</span>
          </div>
          <div>
            <span>收料单位:</span>
            <span>{{parageraphList.company_name}}</span>
          </div>
          <div>
            <span>收料种类:</span>
            <span>{{parageraphList.stock_kind}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>来料单位：</span>
            <span>{{parageraphList.customer_name}}</span>
          </div>
          <div>
            <span>所属区域：</span>
            <span
              v-if="parageraphList.area || parageraphList.province || parageraphList.finance_code"
            >
              {{parageraphList.area}}
              <span v-if="parageraphList.area">-</span>
              {{parageraphList.province}}({{parageraphList.finance_code}})
            </span>
            <span v-else>--</span>
          </div>
          <div>
            <span>结费方式：</span>
            <el-select
              v-model="numWay"
              placeholder="请选择"
              size="small"
              style="width:200px"
              @change="selectWayGetData"
            >
              <el-option
                v-for="item in wayData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="color:#8a9199">
            依次差价快捷键：
            <span class="colorYeLLow">ALT+i</span>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div>
            <span>库柜选择</span>
            <el-select
              v-model="counter_id"
              placeholder="请选择库柜"
              size="small"
              style="width: 82.5%;"
              @change="positionFun"
            >
              <el-option
                v-for="item in findPositionData"
                :key="item.id"
                :label="item.enter_counter"
                :value="item.id"
              ></el-option>
            </el-select>
            <!-- <span class="completeDes">旧料柜</span> -->
          </div>
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注</span>
            <textarea name v-model="note" class="textAreaStlye" placeholder="请输入备注信息"></textarea>
          </div>
        </el-col>
      </el-row>
      <div style="display: flex;">
        <!-- 表格一 -->
        <el-table
          :data="inputStockOrderLines"
          show-summary
          :summary-method="getSummaries"
          min-height="220"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="入货明细" header-align="center">
            <el-table-column prop="sequence" label="盘号"></el-table-column>
            <el-table-column width="135px" label="料类型">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.stock_type_id"
                  placeholder="请选择"
                  size="small"
                  @change="selectStockFun(scope.row)"
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
            <el-table-column prop="before_weight" label="熔前毛重(g)"></el-table-column>
            <el-table-column prop="after_weight" label="熔后毛重(g)"></el-table-column>
            <el-table-column prop="check_quality" label="检验成色"></el-table-column>
            <el-table-column prop="reality_quality" width="100px" label="实际成色">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.reality_quality"
                  placeholder="请输入"
                  size="small"
                  @blur="comptFootWeight(scope.row,scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="FootWeight" label="折千足重(g)"></el-table-column>
            <el-table-column prop width="95px" label="备注">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.note"
                  placeholder="请输入"
                  size="small"
                  type="textarea"
                  :rows="1"
                  :autosize="{ minRows: 1}"
                  @blur="goEmpty(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="colorYeLLow" @click="delGoods(scope.row)">删除</span>
              </template>
            </el-table-column>-->
          </el-table-column>
        </el-table>
        <!-- 表格二 -->
        <el-table
          :data="creditLines"
          min-height="220"
          show-summary
          :summary-method="getSummaries"
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
            <el-table-column label="项目">
              <template slot-scope="scope">
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
            <el-table-column prop="k_weight" label="折重(g)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.k_weight"
                  placeholder="请输入内容"
                  size="small"
                  @blur="comptMoney(scope.row,'k_weight')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="k_price" label="单价">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.k_price"
                  placeholder="请输入内容"
                  size="small"
                  @blur="comptMoney(scope.row,'k_price')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="money" label="金额(￥)"></el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.note"
                  placeholder="请输入"
                  size="small"
                  type="textarea"
                  :rows="1"
                  :autosize="{ minRows: 1}"
                  @blur="goEmpty(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <span class="colorRed" @click="addFun">添加</span>
                <span class="colorYeLLow" @click="delItem(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <el-row class="footInfo">
        <el-col
          :span="24"
          style="margin-bottom:20px"
          v-for="(item, index) in parageraphList.inputStockProcesss"
          :key="index"
        >
          <span style="color:#8A9199">{{item.create_time}}</span>
          <span style="color:#222426">{{item.order_uid_name}}</span>
          <span style="color:#8A9199">对{{item.result1}}{{item.result2}}操作</span>
        </el-col>
      </el-row>
    </div>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因"></textarea>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="promptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <div v-show="false">
      <PrintTPSix :billData="printData" ref="myComp"></PrintTPSix>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerCreat: "false",
      LODOP: {}, //打印对象
      printData: {}, //打印数据
      btnLoadingType: false, //提交按钮状态
      credit_after_weight: "",
      credit_reality_quality: "",
      numWay: "", //结费方式
      wayData: [
        //结费方式数据
        {
          label: "依次差价",
          value: 1
        },
        {
          label: "依次退工费",
          value: 2
        },
        {
          label: "依次附加项",
          value: 3
        }
      ],
      sreachWayId: "", //结算方式id
      sreachCurrentIndex: "", //当前需要搜索的项目
      tabelHeight: "100%",
      stock_type_id: "", //金料类型id
      stock_type: "", //金料类型
      note: "", //备注
      counter_id: "", // 库位id
      enter_counter: "", //库位名称
      findPositionData: [], //库柜数据
      inputStockId: "", //订单id
      promptType: false, //提示状态
      value: "", //模拟
      parageraphList: {}, //详情数据
      inputStockOrderLines: [], //入库明细
      stockSetTypeList: [], // 料类型数据
      creditLines: [
        {
          //账款明细
          expense_way_id: "",
          expense_way: "",
          project: "",
          k_weight: "0",
          k_price: "0",
          money: "",
          note: "",
          findPropKindData: ""
        }
      ],
      expenseWayData: [], //结费方式
      findPropKindData: [], //项目数据

      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      loading: false
    };
  },
  created() {
    this.created_fun();
    this.powerFun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.warehousingDetail;
      if (dom != undefined && altKey && keyCode === 73) {
        self.numWay = 1;
        self.selectWayGetData();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.inputStockId = this.$route.query.inputStockId;
      this.displayAllData();
      this.findPosition();
      this.findPropPay();
    },
    displayAllData() {
      var self = this;
      let params = {
        PRS: {
          inputStockId: this.inputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NinputStockFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.parageraphList = res.data.data;
            self.inputStockOrderLines = res.data.data.inputStockOrderLines;
            // self.inputStockOrderLines.forEach(item => {
            //   item.stock_type_id = "";
            //   item.stock_type = "";
            // });
            self.parageraphList.inputStockProcesss.forEach(item => {
              item.create_time = self.$api.dateGetDayTime(item.create_time);
              if (item.enter_statue == 1) {
                item.result1 = "新建";
              } else if (item.enter_statue == 2) {
                item.result1 = "测金";
              } else if (item.enter_statue == 3) {
                item.result1 = "入库";
              } else if (item.enter_statue == 4) {
                item.result1 = "红冲";
              }

              if (item.bills_statue == 1) {
                item.result2 = "保存 ";
              } else if (item.bills_statue == 2) {
                item.result2 = "提交 ";
              } else if (item.bills_statue == 3) {
                item.result2 = "作废 ";
              }
            });

            self.stockSetFun();
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
    //查询柜信息
    findPosition() {
      //findPositionData
      let self = this;
      let params = {
        PRS: {
          departId: 20
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
            self.counter_id = self.findPositionData[0].id;
            self.enter_counter = self.findPositionData[0].enter_counter;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "熔前毛重(g)" ||
          column.label === "熔后毛重(g)" ||
          column.label === "折千足重(g)" ||
          column.label === "金额(￥)"
        ) {
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
    // 计算折千足重
    comptFootWeight(item, index) {
      if (item.reality_quality == undefined) {
        return;
      }
      item.reality_quality = item.reality_quality.trim();
      if (isNaN(item.reality_quality)) {
        this.$message.warning("请输入正确的成色！");
        item.reality_quality = 0;
        return;
      }
      if (
        item.reality_quality <= 1 &&
        item.reality_quality >= 0 &&
        item.after_weight != ""
      ) {
        item.FootWeight = (item.after_weight * item.reality_quality).toFixed(2);
        this.inputStockOrderLines.splice(index, 1, item);
      } else {
        this.$message.warning("成色不能大于1且不能小于0！");
        item.reality_quality = 0;
        item.FootWeight = 0;
      }
      this.$forceUpdate();
    },
    //选择结费方式
    selectWayFun(item, index) {
      //item.expense_way = '全部转存'
      item.project = "";
      item.k_price = "";
      item.k_weight = "";
      item.money = "";
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
    // 计算金额
    comptMoney(item, name) {
      if (name == "k_weight") {
        if (item.k_weight == undefined) {
          return;
        }
        item.k_weight = item.k_weight.trim();
        if (isNaN(item.k_weight)) {
          this.$message.error("请输入数字！");
          item.k_weight = "";
          item.money = "";
          return;
        }
      }
      if (name == "k_price") {
        if (item.k_price == undefined) {
          return;
        }
        item.k_price = item.k_price.trim();
        if (isNaN(item.k_price)) {
          this.$message.error("请输入数字！");
          item.k_price = "";
          item.money = "";
          return;
        }
      }
      if (item.k_price != "" && item.k_weight != "") {
        item.money = Math.round(item.k_price * item.k_weight);
      } else {
        item.money = 0;
      }
    },
    // 选择料类型
    selectStockFun(item) {
      let self = this;
      // this.stock_type_id = item;
      // this.inputStockOrderLines.forEach(once => {
      //   once.stock_kind = item;
      // });
      this.stockSetTypeList.forEach(group => {
        if (item.stock_type_id == group.id) {
          item.stock_type = group.material_name;
        }
      });
    },
    //入库删除
    delGoods(item) {
      let self = this;
      let params = {
        PRS: {
          inputStockLineId: item.id
        }
      };
      if (this.inputStockOrderLines.length == 1) {
        self.$message.error("必须保留一条入库明细!");
        return;
      }
      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.$axios
          .get(this.$portMain + "/stock/NdeleteInputStockLine", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              setTimeout(function() {
                self.created_fun();
              }, 2000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    // 添加一行
    addFun() {
      this.creditLines.push({
        expense_way_id: "",
        expense_way: "",
        project: "",
        k_weight: "0",
        k_price: "0",
        money: "",
        note: "",
        findPropKindData: ""
      });
    },
    // 删除一行
    delItem(index) {
      let self = this;
      if (this.creditLines.length > 1) {
        //self.$message.error('至少需要一条数据');
        this.creditLines.splice(index, 1);
      } else {
        self.$message.error("至少需要一条数据");
      }
    },
    // 提交并打印
    submitPrint() {
      let self = this;
      if (this.counter_id == "") {
        self.$message.error("请选择库柜！");
        return;
      }

      let result = false;
      let resType = false;
      this.inputStockOrderLines.forEach(item => {
        if (item.reality_quality == undefined || item.reality_quality == "") {
          result = true;
        }
        if (item.stock_type_id == undefined || item.stock_type_id == "") {
          resType = true;
        }
      });

      if (resType) {
        self.$message.error("请选择料类型！");
        return;
      }

      if (result) {
        self.$message.error("请填写实际成色！");
        return;
      }

      let result2 = false;
      this.creditLines.forEach(item => {
        if (
          item.expense_way_id == "" ||
          item.project == "" ||
          item.k_price === "" ||
          item.k_weight === ""
        ) {
          result2 = true;
          return;
        }
      });

      if (result2) {
        self.$message.error("账款明细信息不能为空！");
        return;
      }

      this.parageraphList.counter_id = this.counter_id;
      this.parageraphList.enter_counter = this.enter_counter;
      if (this.parageraphList.note != undefined) {
        this.parageraphList.note = this.note.trim();
      }

      // this.parageraphList.stock_type_id = this.stock_type_id;
      // this.parageraphList.stock_type = this.stock_type;
      this.parageraphList.inputStockOrderLines = this.inputStockOrderLines;
      this.parageraphList.creditLines = this.creditLines;
      let param = self.parageraphList;
      param.creditLines.forEach(item => {
        if (item.findPropKindData != "" || item.findPropKindData != undefined) {
          delete item["findPropKindData"];
        }
      });
      param.note = this.note;
      this.btnLoadingType = true;
      this.$axios
        .post(this.$portMain + "/stock/NputInputStock", param)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            let enter_code = res.data.data.enter_code
              ? res.data.data.enter_code
              : "--";
            self.modifyPrintData(param, enter_code);
            setTimeout(function() {
              self.btnLoadingType = false;
              self.$router.push("recharge");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnLoadingType = false;
          }
        });
    },

    // 作废
    toVoid() {
      let self = this;
      let params = {
        PRS: {
          inputStockId: this.inputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NcancellationInputStock", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.$router.push("recharge");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 驳回
    rejectFun() {
      let self = this;
      let params = {
        PRS: {
          inputStockId: this.inputStockId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NrejectInputStockR", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.$router.push("recharge");
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选择库位
    positionFun() {
      let self = this;
      this.findPositionData.forEach(item => {
        if (self.counter_id == item.id) {
          self.enter_counter = item.enter_counter;
        }
      });
    },
    //查询结费方式
    findPropPay() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/findPropPay")
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
    //选择结费方式获取账款明细数据
    selectWayGetData() {
      let self = this;
      if (self.numWay == "") {
        self.$message.error("请选择结价方式！");
        return;
      }

      let subData = [];
      this.inputStockOrderLines.forEach(item => {
        subData.push({
          stock_type_id: item.stock_type_id,
          stock_type: item.stock_type,
          after_weight: item.after_weight,
          reality_quality: item.reality_quality
        });
      });
      let params = {
        numWay: self.numWay,
        InputStockOrderLines: JSON.stringify(subData)
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/getCredits",
        params,
        res => {
          if (res.data.length > 0) {
            self.creditLines = [];
            res.data.forEach(item => {
              self.creditLines.push({
                expense_way_id: item.expense_way_id,
                expense_way: item.expense_way,
                project: item.project,
                k_weight: item.k_weight,
                k_price: item.k_price,
                money: (item.k_weight * item.k_price).toFixed(2),
                note: item.note,
                findPropKindData: [{ kindName: item.project }]
              });
            });
          } else {
            self.creditLines = [];
            this.creditLines.push({
              expense_way_id: "",
              expense_way: "",
              project: "",
              k_weight: 0,
              k_price: 0,
              money: "",
              note: "",
              findPropKindData: ""
            });
          }
        },
        err => {
          //
        }
      );
    },
    //组装打印数据
    modifyPrintData(param, enter_code) {
      let self = this;
      this.printData = JSON.parse(JSON.stringify(param));
      this.printData.enter_code = enter_code;
      this.printData.inputStockOrderLines.forEach(item => {
        item.check_quality = item.reality_quality;
        item.discount_weight = item.FootWeight;
      });
      this.printData.creditLines.forEach(item => {
        item.k_money = item.money;
      });

      this.$refs.myComp.compPrintFun();
    },
    //去空
    goEmpty(item) {
      if (item.note == undefined) {
        return;
      }
      item.note = item.note.trim();
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "stock-input-add"
      );
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

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
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
      width: 81.5%;
      height: 60px;
      border-radius: 4px;
      border: 1px solid #CFD4E6;
      resize: none;
      margin-top: 10px;
    }

    .completeDes {
      width: 82.5%;
      display: inline-block;
      text-align: left;
    }
  }

  .footInfo {
    margin-top: 36px;
    font-size: 14px;
  }
}
</style>

<style>
.feedIn .el-table__footer-wrapper .has-gutter tr td {
  height: 49px;
}

.feedIn .el-table .cell,
.feedIn .el-table th div,
.feedIn .el-table--border td:first-child .cell,
.feedIn.el-table--border th:first-child .cell {
  padding-left: 0px;
  padding-right: 0px;
}
</style>

