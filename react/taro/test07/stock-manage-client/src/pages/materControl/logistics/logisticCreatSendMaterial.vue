<template>
  <div class="conBigDiv" ref="logisticCreatSendMaterial">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>发料</el-breadcrumb-item>
      <el-breadcrumb-item>新建发料</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24" class="itemRight">
          <el-button type="danger" size="small" plain @click="cancelFun">取消</el-button>
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
            <span>收料单位</span>
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
            <span>发料单位</span>
            <el-select
              v-model="submitData.departId"
              placeholder="请选择"
              size="small"
              style="width: 240px;"
              disabled
            >
              <el-option
                v-for="item in departList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:20px">
            <OweStock :customerId="submitData.customer_id"></OweStock>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span style="margin-left: 13px;">发料柜</span>
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
          <div style="margin-top:12px">
            <span>发料种类</span>
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
          <div style="margin-top:20px;margin-left: 28px;">
            <span>性质</span>
            <el-select
              v-model="submitData.nature"
              placeholder="请选择性质"
              size="small"
              style="width: 240px;"
              @change="selectStock"
            >
              <el-option
                v-for="item in natureData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注</span>
            <textarea name id class="textAreaStlye" placeholder="请输入备注信息" v-model="submitData.note"></textarea>
          </div>
        </el-col>
      </el-row>
      <!-- <OweStock :customerId="submitData.customer_id"></OweStock> -->
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
            <el-table-column prop="output_fur_weight" label="出库毛重(g)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.output_fur_weight"
                  placeholder="请输入内容"
                  size="small"
                  @blur="comptFurWeight(scope.row,'output_fur_weight')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="出库成色">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.output_quality"
                  placeholder="请输入内容"
                  size="small"
                  ref="ckcs"
                  @blur="comptFurWeight(scope.row,'output_quality')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="output_discount_weight" label="出库折重(g)"></el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.o_note"
                  placeholder="请输入内容"
                  size="small"
                  type="textarea"
                  :rows="1"
                  @blur="goEmpty(scope.row)"
                ></el-input>
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
            <el-table-column prop="name" label="项目">
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
            <el-table-column label="重量(g)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.k_weight"
                  placeholder="请输入内容"
                  size="small"
                  @blur="comptMoney(scope.row,'k_weight')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单价">
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
    <!-- 打印 -->
    <div v-show="false">
      <PrintTPSeven :billData="printData" ref="myComp"></PrintTPSeven>
    </div>
  </div>
</template>
<script>
import { OweStock } from "@/pages/acommon";

export default {
  components: {
    OweStock
  },
  data() {
    return {
      natureData: [
        {
          //性质数据
          label: "出工厂料",
          value: "OUT_FACTORY"
        },
        {
          label: "还料",
          value: "RETURN_STOCK"
        }
      ],
      btnLoadingType: false, //提交打印状态
      printData: {}, //打印数据
      sreachWayId: "", //结算方式id
      sreachCurrentIndex: "", //当前需要搜索的项目
      customerData: [], //发料客户数据
      expenseWayData: [], //结费方式
      companyData: [
        {
          // 发料单位
          id: 91681,
          label: "尚金缘"
        }
      ],
      departList: [
        {
          // 部门数据
          id: 20,
          name: "金库收料部"
        },
        {
          id: 17,
          name: "物流中心"
        }
      ],
      submitData: { company_id: 91681, customer_id: "", departId: 17 }, //提交数据

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
      // submitData: { company_id: 91681, customer_id: "" }, //新增提交数据
      stockSetKindData: [], //料种类数据
      stockSetTypeList: [], // 料类型数据
      findPositionData: [], //库柜数据
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
      options4: [],
      value9: [],
      list: [],
      loading: false
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.logisticCreatSendMaterial;
      if (dom != undefined && altKey && keyCode === 83) {
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
          column.label === "出库毛重(g)" ||
          column.label === "出库折重(g)" ||
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
          departId: 17
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
    comptFurWeight(item, name) {
      const { output_quality, output_fur_weight } = item;
      if (name == "output_fur_weight") {
        if (item.output_fur_weight != undefined) {
          item.output_fur_weight = item.output_fur_weight.trim();
        }

        let result = isNaN(output_fur_weight);
        let result2 = Number(output_fur_weight) < 0;
        if (result || result2) {
          this.$message.error("请输入有效数字！");
          item.output_fur_weight = "";
          item.output_discount_weight = "";
          return;
        }
      }
      if (name == "output_quality") {
        if (item.output_quality != undefined) {
          item.output_quality = item.output_quality.trim();
        }

        let result = isNaN(output_quality);
        let result2 = Number(output_quality) < 0;
        if (result || result2) {
          this.$message.error("请输入有效数字！");
          item.output_quality = "";
          item.output_discount_weight = "";
          return;
        }
      }
      if (Number(output_quality) > 1) {
        this.$message.error("抱歉，出库成色不能大于1");
        item.output_quality = 0;
        this.$refs.ckcs.focus();
        this.$refs.ckcs.select();
      }
      item.output_quality = Number(item.output_quality);
      if (item.output_fur_weight != "" && item.output_quality != "") {
        item.output_discount_weight = (
          item.output_fur_weight * item.output_quality
        ).toFixed(2);
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
    comptMoney(item, name) {
      if (name == "k_weight") {
        if (item.k_weight != undefined) {
          item.k_weight = item.k_weight.trim();
        }

        let result = isNaN(item.k_weight);
        let result2 = Number(item.k_weight) < 0;
        if (result || result2) {
          this.$message.error("请输入有效数字！");
          item.k_weight = "";
          item.money = "";
          return;
        }
      }
      if (name == "k_price") {
        if (item.k_price != undefined) {
          item.k_price = item.k_price.trim();
        }

        let result = isNaN(item.k_price);
        let result2 = Number(item.k_price) < 0;
        if (result || result2) {
          this.$message.error("请输入有效数字！");
          item.k_price = "";
          item.money = "";
          return;
        }
      }
      if (item.k_price != "" && item.k_weight != "") {
        item.money = Math.round(item.k_price * item.k_weight);
      } else {
        item.money = "";
      }
    },
    // 提交并打印
    submitPrint() {
      let self = this;
      //模拟
      // this.submitData.customer_id = '97301';
      // this.submitData.customer_name = 'GSK-7';
      // this.submitData.company_id = '91681';
      this.submitData.company_name = "尚金缘";
      // this.submitData.customer_type = "内厂";
      if (this.submitData.note != undefined) {
        this.submitData.note = this.submitData.note.trim();
      }
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
        self.$message.error("请选择收料单位！");
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

      let result2 = false;
      this.creditLines.forEach(item => {
        if (
          item.expense_way == "" ||
          item.project == "" ||
          item.k_price == "" ||
          item.k_weight == "" ||
          item.money == ""
        ) {
          result2 = true;
        }
      });

      if (result2) {
        self.$message.error("请填写账款明细！");
        return;
      }

      let paramData = {
        jsonObjs: JSON.stringify(self.submitData)
      };
      self.btnLoadingType = true;
      self.$api.formdataPostFun(
        self.$portMain + "/stock/logistics/NaddOutputStock",
        paramData,
        res => {
          if (res.code == 200) {
            self.$message.success(res.msg);
            let output_code = res.data.output_code
              ? res.data.output_code
              : "--";
            self.modifyPrintData(self.submitData, output_code);
            setTimeout(function() {
              self.btnLoadingType = false;
              self.$router.push("logisticSendMaterial");
            }, 2000);
          }
        },
        err => {
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
                  self.$portMain + "/stock/NaddOutputStock",
                  params,
                  resTwo => {
                    self.$message.success(resTwo.msg);
                    let output_code = resTwo.data.output_code
                      ? resTwo.data.output_code
                      : "--";
                    self.modifyPrintData(self.submitData, output_code);
                    setTimeout(function() {
                      self.btnLoadingType = false;
                      self.$router.push("logisticSendMaterial");
                    }, 2000);
                  },
                  errTwo => {
                    self.$message.error(errTwo.msg);
                    self.btnLoadingType = false;
                  }
                );
              })
              .catch(() => {
                //
                self.btnLoadingType = false;
              });
          } else {
            self.$message.error(err.msg);
            self.btnLoadingType = false;
          }
        }
      );
      // this.$axios
      //     .post(this.$portMain + "/stock/NaddOutputStock", params)
      //     .then(function(res) {
      //       if (res.data.code == 200) {
      //         self.$message.success(res.data.msg);
      //         setTimeout(function() {
      //           self.$router.push('SendMaterial')
      //         },2000)
      //       } else {
      //         self.$message.error(res.data.msg);
      //       }
      //     })
    },
    // 取消
    cancelFun() {
      this.$router.push("logisticSendMaterial");
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
    },
    //组装打印数据
    modifyPrintData(param, output_code) {
      let self = this;
      this.printData = JSON.parse(JSON.stringify(param));
      this.printData.output_code = output_code;
      this.printData.outputStockOrderLines.forEach(item => {
        // item.check_quality = item.reality_quality;
        item.discount_weight = item.output_discount_weight;
        item.stock_type = self.printData.stock_type;
      });
      this.printData.creditLines.forEach(item => {
        item.k_money = item.money;
      });

      self.$refs.myComp.compPrintFun();
    },
    //去空
    goEmpty(item) {
      if (item.o_note != undefined) {
        item.o_note = item.o_note.trim();
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
