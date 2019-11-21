<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建转料</el-breadcrumb-item>
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
            <span style="width:56px;display:inline-block">出库柜</span>
            <el-select
              v-model="submitData.customer_id"
              placeholder="请选择库柜"
              size="small"
              style="width: 240px;"
            >
              <el-option
                v-for="item in outData"
                :key="item.id"
                :label="item.stockName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:12px">
            <span>转料公司</span>
            <el-select
              v-model="submitData.company_id"
              placeholder="请选择库柜"
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
            <span style="margin-left: 13px;">入库柜</span>
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
            <div style="margin-top:12px;margin-left: 13px;">
              <span>料种类</span>
              <el-select
                v-model="submitData.stock_kind_id"
                placeholder="请选择"
                size="small"
                style="width: 240px;"
                @change="selectStockSetKind"
              >
                <el-option
                  v-for="item in stockSetKindData"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注</span>
            <textarea name id class="textAreaStlye" placeholder="请输入备注信息" v-model="submitData.note"></textarea>
          </div>
        </el-col>
      </el-row>
      <div style="display:flex" class="tableWrap">
        <!-- 表格2 -->
        <el-table
          :data="stockTooramentOrnalines"
          show-summary
          :summary-method="getTwoSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="饰明细" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column label="产品大类">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.to_ornament_project"
                  placeholder="请选择"
                  size="small"
                  @change="getproduct(scope.row,scope.$index)"
                  @focus="selectData(scope.row)"
                >
                  <el-option
                    v-for="item in toOrnamentProject"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="产品名称">
              <template slot-scope="scope">{{scope.row.ornament_name}}</template>
            </el-table-column>
            <el-table-column label="产品编号">
              <template slot-scope="scope">{{scope.row.product_code}}</template>
            </el-table-column>
            <el-table-column prop="product_amount" label="数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.product_amount" placeholder="请输入内容" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="product_weight" label="重量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.product_weight" placeholder="请输入内容" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="colorRed" @click="addAccounts">添加</span>
                <span class="colorYeLLow" @click="delAccounts(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- 表格1 -->
        <el-table
          :data="stockToOrnamentLines"
          show-summary
          :summary-method="getSummaries"
          style="width: 50%; margin-top: 20px"
        >
          <el-table-column label="料明细" header-align="center">
            <el-table-column label="料类型">
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
            <el-table-column prop="fur_weight" label="毛重">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.fur_weight"
                  placeholder="请输入内容"
                  size="small"
                  @input="comptFurWeight(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="成色">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.quality"
                  placeholder="请输入内容"
                  size="small"
                  @input="comptFurWeight(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="discount_weight" label="折千足重"></el-table-column>
            <el-table-column prop="name" label="备注">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.note"
                  placeholder="请输入内容"
                  size="small"
                  type="textarea"
                  :rows="1"
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
      <div class="tableFooter">
        <div class="itemOne">合计</div>
        <div class="itemTwo">
          <span v-for="(item, index) in tableTwoTotal" :Key="index">{{item}}</span>
        </div>
        <div class="itemThree">
          <span v-for="(item, index) in tableOneTotal" :key="index">{{item}}</span>
        </div>
      </div>
    </div>
    <!-- 提示 -->
    <el-dialog title="选择产品编号" :visible.sync="productType" width="588px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <div
              class="liItem"
              v-for="(item,index) in productData"
              :key="index"
              @click="selectProct(item)"
            >
              <img :src="$portImg + item.pic" alt style="width:120px;height:90px">
              <div style="margin-left:16px">
                <div style="color:#8A9199">{{item.proName}}</div>
                <div style="color:#222426">编号：{{item.batarNum}}</div>
                <span style="color:#8A9199">克重：{{item.weight}}</span>
              </div>
              <div style="margin-left:112px">
                <div style="color:#8A9199">成色：{{item.condit}}</div>
                <div style="color:#8A9199">车花：{{item.car}}</div>
                <div style="color:#8A9199">工艺：{{item.effectProc}}</div>
              </div>
            </div>
            <!-- <div class="liItem">
                      <img src="../../../static/images/img-newpro.png" alt="" style="width:120px;height:90px">
                      <div style="margin-left:16px">
                        <div style="color:#8A9199">时尚蝴蝶项链</div>
                        <div style="color:#222426">编号：AUZ00002</div>
                        <span style="color:#8A9199">克重：6g</span>
                      </div>
                      <div style="margin-left:112px">
                        <div style="color:#8A9199">成色：9999</div>
                        <div style="color:#8A9199">车花：满天星</div>
                        <div style="color:#8A9199">工艺：钉砂</div>
                      </div>
            </div>-->
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableTwoTotal: [], //表格2合计
      tableOneTotal: [], //表格1合计
      tableHeight: "202",
      stockSetKindData: [], //料种类下拉数据
      proctIndex: "", //产品列表的下标
      productData: [], //产品数据
      productType: false, //产品显示状态
      toOrnamentProject: [
        {
          id: "JT",
          label: "金条"
        }
      ], //产品大类数据
      outData: [], // 入库柜数据
      companyData: [
        {
          // 转饰公司
          id: 91681,
          label: "尚金缘"
        }
      ],
      stockTooramentOrnalines: [
        {
          //饰明细数据
          to_ornament_project: "",
          ornament_name: "",
          product_code: "",
          product_amount: 0,
          product_weight: 0
        }
      ],
      stockSetTypeList: [], // 料类型数据
      findPositionData: [], //出库柜数据
      stockToOrnamentLines: [
        {
          //料明细
          stock_type_id: "",
          fur_weight: "",
          quality: "",
          discount_weight: "",
          note: ""
        }
      ],
      submitData: {
        //需要提交的数据
        company_id: 91681,
        stock_kind_id: ""
      },
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      btnLoadingTF:false,
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      // this.displayAllData(1, 15);
      this.stockSetFun();
      this.findPosition();
      this.outDataFun();
      this.findStockSetKind();
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
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              //return (Number(prev) + Number(curr)).toFixed(2);
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
      this.tableOneTotal = sums;
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
              //return (Number(prev) + Number(curr)).toFixed(2);
              let res = (Number(prev) + Number(curr)).toFixed(4);
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
      let arr = [...sums];
      arr.shift();
      this.tableTwoTotal = arr;
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
    // 取消
    cancelFun() {
      this.$router.push("ornament");
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
    // 计算折千足重
    comptFurWeight(item) {
      if (item.fur_weight != "" && item.quality != "") {
        item.discount_weight = (item.fur_weight * item.quality).toFixed(4);
      } else {
        item.discount_weight = "";
      }
    },
    // 料明细添加一行
    addFun() {
      this.stockToOrnamentLines.push({
        stock_type_id: "",
        fur_weight: "",
        quality: "",
        discount_weight: "",
        note: ""
      });
    },
    // 料明细删除一行
    delItem(index) {
      let self = this;
      if (this.stockToOrnamentLines.length > 1) {
        //self.$message.error('至少需要一条数据');
        this.stockToOrnamentLines.splice(index, 1);
      } else {
        self.$message.error("至少需要一条数据");
      }
    },
    // 料明细添加一行
    addAccounts() {
      this.stockTooramentOrnalines.push({
        to_ornament_project: "",
        ornament_name: "",
        product_code: "",
        product_amount: 0,
        product_weight: 0
      });
      // this.tableHeight = tableTwo.offsetHeight + 57;
    },
    // 料明细删除一行
    delAccounts(index) {
      let self = this;
      if (this.stockTooramentOrnalines.length > 1) {
        //self.$message.error('至少需要一条数据');
        this.stockTooramentOrnalines.splice(index, 1);
      } else {
        self.$message.error("至少需要一条数据");
      }
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
      this.stockToOrnamentLines.forEach(once => {
        once.stock_type_id = item;
      });
    },
    //查询出柜信息
    findPosition() {
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
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 选择出库柜
    selectPosition(num) {
      let self = this;
      this.findPositionData.forEach(item => {
        if (item.id == num) {
          self.submitData.output_counter = item.enter_counter;
        }
      });
    },
    // 提交并打印
    submitPrint() {
      let self = this;
      self.btnLoadingTF = true
      // this.submitData.company_id = '91681';
      this.submitData.company_name = "尚金缘";

      // this.submitData.customer_id = '91681';
      // this.submitData.customer_name = '展厅';

      // this.submitData.stock_kind_id = '22';
      // this.submitData.stock_kind = '板料';

      // this.submitData.counter_id = '4';
      // this.submitData.output_counter = '旧料柜';

      this.outData.forEach(item => {
        if (self.submitData.customer_id == item.id) {
          self.submitData.customer_name = item.stock_name;
        }
      });

      this.submitData.stockToOrnamentLines = self.stockToOrnamentLines;
      this.submitData.stockTooramentOrnalines = self.stockTooramentOrnalines;

      if (this.submitData.customer_id == undefined) {
        self.$message.error("请选择接出库柜！");
        return;
      }
      if (this.submitData.counter_id == undefined) {
        self.$message.error("请选择入库柜！");
        return;
      }
      if (
        this.submitData.stock_kind_id == undefined ||
        this.submitData.stock_kind_id == ""
      ) {
        self.$message.error("请选择料种类！");
        return;
      }

      let result = false;
      self.stockToOrnamentLines.forEach(item => {
        if (
          item.stock_type_id == "" ||
          item.fur_weight == "" ||
          item.quality == ""
        ) {
          result = true;
        }
      });
      if (result) {
        self.$message.error("请填写料明细数据！");
        return;
      }

      let result2 = false;
      self.stockTooramentOrnalines.forEach(item => {
        if (item.to_ornament_project == "") {
          result2 = true;
        }
      });
      if (result2) {
        self.$message.error("请填写饰明细！");
        return;
      }

      let params = {
        jsonObjs: JSON.stringify(self.submitData),
        toAudit: 2
      };

      self.$api.formdataPostFun(
        self.$portMain + "/stock/addStockToOrnament",
        params,
        res => {
          if (res.code == 200) {
            self.btnLoadingTF = false
            self.$message.success(res.msg);
            setTimeout(function() {
              self.$router.push("ornament");
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
                  self.$portMain + "/stock/addStockToOrnament",
                  params,
                  resTwo => {
                    self.$message.success(resTwo.msg);
                    setTimeout(function() {
                      self.$router.push("ornament");
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
    },
    // 获取入库柜数据
    outDataFun() {
      let self = this;
      let params = {
        PRS: {
          statue: 2
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/stockposition/order/list", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.outData = res.data.data;
            self.outData.unshift({
              id: "",
              stockName: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 获取产品
    getproduct(item, index) {
      this.proctIndex = index;
      let self = this;
      let params = {
        one: item.to_ornament_project,
        page: 1,
        rows: 15
      };
      this.$api.formdataPostFun(
        this.$portMain + "/product/materialTransfer",
        params,
        res => {
          if (res.code == 200) {
            self.productData = res.data.data;
            if (self.productData.length != 0) {
              self.productType = true;
            }
          }
        }
      );
    },
    selectData(item) {
      item.to_ornament_project = "";
      item.ornament_name = "";
      item.product_code = "";
    },
    //选择产品sku
    selectProct(item) {
      let self = this;
      this.stockTooramentOrnalines[self.proctIndex].ornament_name =
        item.proName;
      this.stockTooramentOrnalines[self.proctIndex].product_code =
        item.batarNum;
      this.productType = false;
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
    //关联料种类名
    selectStockSetKind() {
      let self = this;
      if (self.submitData.stock_kind_id != "") {
        self.stockSetKindData.forEach(item => {
          if (item.id == self.submitData.stock_kind_id) {
            self.submitData.stock_kind = item.material_name;
          }
        });
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

  .promptStyle {
    position: relative;

    .line {
      width: 588px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .liItem {
      border: 1px solid #CFD9E6;
      width: 540px;
      height: 120px;
      display: flex;
      box-sizing: border-box;
      padding: 15px;
      margin-bottom: 8px;

      &:hover {
        background-color: #CFD9E6;
      }
    }
  }

  .tableFooter {
    display: flex;
    align-items: center;
    height: 48px;
    border-bottom: 1px solid #e6ebf5;
    border-left: 1px solid #e6ebf5;
    border-right: 1px solid #e6ebf5;
    background: #f5f7fa;
    color: rgb(135, 141, 153);
    font-size: 14px;

    .itemOne {
      flex: 0 0 50px;
      text-align: center;
    }

    .itemTwo {
      flex: 15;
      display: flex;
      align-items: center;
      height: 100%;

      // border-right: 1px solid red;
      span {
        flex: 1;
        padding-left: 12px;
      }
    }

    .itemThree {
      display: flex;
      flex: 16;

      span {
        flex: 1;
        padding-left: 16px;
      }
    }
  }
}
</style>

<style>
.el-table__footer-wrapper .has-gutter tr td {
  height: 49px;
}

.conBigDiv .tableWrap .el-table__footer-wrapper {
  display: none;
}
</style>

