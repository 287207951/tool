<template>
  <div class="conBigDiv"
       ref="creatSendMaterial">
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建料库存转换</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24"
                class="itemRight">
          <el-button type="danger"
                     size="small"
                     plain
                     @click="cancelFun">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="submitPrint"
                     :loading="btnLoadingType">提交并打印</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col>
          <div class="flexb">
            <div>
              <span>转换部门</span>
              <el-select v-model="submitData.departId"
                         placeholder="请选择转换部门"
                         size="small"
                         class="inputWidth240">
                <el-option v-for="item in stockpositionList"
                           :key="item.id"
                           :label="item.stockName"
                           :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="noteStyle">
              <span style="padding-right: 8px;">备注</span>
              <el-input class="textAreaStlye"
                        size="small"
                        placeholder="请输入备注信息"
                        v-model="submitData.note"></el-input>
            </div>
          </div>

          <div style="margin-top:20px"></div>
        </el-col>
      </el-row>

      <div style="display: flex;">
        <!-- 表格1 -->
        <el-table :data="arrParams"
                  style="width: 50%; margin-top: 20px">
          <el-table-column label="原库存"
                           header-align="center">
            <el-table-column prop="name"
                             label="存货柜">
              <template slot-scope="scope">
                <el-select v-model="scope.row.counter_id"
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in findPositionData"
                             :key="item.id"
                             :label="item.enter_counter"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="output_fur_weight"
                             label="料种类">
              <template slot-scope="scope">
                <el-select v-model="scope.row.stock_kind_id"
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in stockSetKindData"
                             :key="item.id"
                             :label="item.material_name"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="料类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.stock_type_id"
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in stockSetTypeList"
                             :key="item.id"
                             :label="item.material_name"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="毛重">
              <template slot-scope="scope">
                <el-input-number :min="0"
                                 controls-position="right"
                                 v-model="scope.row.output_pur_weight"
                                 placeholder="请输入"
                                 size="mini"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="净重">
              <template slot-scope="scope">
                <el-input-number :min="0"
                                 controls-position="right"
                                 v-model="scope.row.output_net_weight"
                                 placeholder="请输入"
                                 size="mini"></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>

        <!-- 表格2 -->
        <el-table :data="arrParamsOld"
                  style="width: 50%; margin-top: 20px">
          <el-table-column label="新库存"
                           header-align="center">
            <el-table-column label="存货柜">
              <template slot-scope="scope">
                <el-select v-model="scope.row.counter_id"
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in findPositionData"
                             :key="item.id"
                             :label="item.enter_counter"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="料种类">
              <template slot-scope="scope">
                <el-select v-model="scope.row.stock_kind_id"
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in stockSetKindData"
                             :key="item.id"
                             :label="item.material_name"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="料类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.stock_type_id"
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in stockSetTypeList"
                             :key="item.id"
                             :label="item.material_name"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="毛重">
              <template slot-scope="scope">
                <el-input-number :min="0"
                                 controls-position="right"
                                 v-model="scope.row.input_pur_weight"
                                 placeholder="请输入"
                                 size="mini"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="净重">
              <template slot-scope="scope">
                <el-input-number :min="0"
                                 controls-position="right"
                                 v-model="scope.row.input_net_weight"
                                 placeholder="请输入"
                                 size="mini"></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 打印 -->
    <div v-if="pritTypeShow">
      <printTPTen :billData="printData"
                  ref="myComp"></printTPTen>
    </div>
  </div>
</template>
<script>
import { OweStock } from "@/pages/acommon";

export default {
  components: {
    OweStock
  },
  data () {
    return {
      printData: {}, //打印数据
      btnLoadingType: false, //提交并打印按钮状态
      arrParams: [{}],
      arrParamsOld: [{}],
      submitData: {},
      stockpositionList: [], // 客户列表
      stockSetKindData: [], //料种类数据
      stockSetTypeList: [], // 料类型数据
      findPositionData: [], //库柜数据
      parageraphList: [], //列表

      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      list: [],
      loading: false,
      pritTypeShow: false,
      nowTime: ""
    };
  },

  created () {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      // 组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.creatSendMaterial;
      if (dom != undefined && altKey && keyCode === 83) {
        self.submitPrint();
      }
    };
  },

  methods: {
    created_fun () {
      this.findPosition(); // 查询柜信息
      this.findStockSetKind(); // 查询金料种类
      this.stockSetFun(); // 查询金料类型
      this.getStockposition(); // 获取部门
    },

    findPosition () {
      let self = this;
      let params = {
        PRS: {
          departId: 20
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function (res) {
          if (res.data.code == 200) {
            self.findPositionData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    findStockSetKind () {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function (res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 料种类
    stockSetFun () {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function (res) {
          if (res.data.code == 200) {
            self.stockSetTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 获取部门
    getStockposition () {
      let self = this;
      let params = {
        PRS: {
          statue: 5
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/stockposition/order/list", params)
        .then(function (res) {
          if (res.data.code == 200) {
            self.stockpositionList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //   stockpositionList: [], // 客户列表
    //   stockSetKindData: [], //料种类数据
    //   stockSetTypeList: [], // 料类型数据
    //   findPositionData: [], //库柜数据
    // 获取部门名称
    getDeartName (option) {
      if (!option) {
        return "";
      }
      return this.stockpositionList.filter(item => item.id === option)[0]
        .stockName;
    },

    // 获取库位名称
    getCountName (option) {
      if (!option) {
        return "";
      }
      return this.findPositionData.filter(item => item.id === option)[0]
        .enter_counter;
    },

    // 获取种类
    getKindName (option) {
      if (!option) {
        return "";
      }
      return this.stockSetKindData.filter(item => item.id === option)[0]
        .material_name;
    },

    // 获取料类型
    getTypeName (option) {
      if (!option) {
        return "";
      }
      return this.stockSetTypeList.filter(item => item.id === option)[0]
        .material_name;
    },

    valiData (options) {
      const {
        departId,
        orig: {
          counter_id: old_counter_id,
          stock_type_id: old_stock_type_id,
          stock_kind_id: old_stock_kind_id,
          output_pur_weight,
          output_net_weight
        },
        dest: {
          counter_id,
          stock_type_id,
          stock_kind_id,
          input_pur_weight,
          input_net_weight
        }
      } = options;

      if (!departId) {
        this.$message.error(`请选择转换部门`);
        return;
      }

      if (!old_counter_id || !counter_id) {
        this.$message.error(`请选择存货柜`);
        return;
      }

      if (!old_stock_type_id || !stock_type_id) {
        this.$message.error(`请选择料类型`);
        return;
      }

      if (!old_stock_kind_id || !stock_kind_id) {
        this.$message.error(`请选择料种类`);
        return;
      }

      if (input_pur_weight !== output_pur_weight) {
        this.$message.error(`请输入相同的毛重`);
        return;
      }

      if (input_net_weight !== output_net_weight) {
        this.$message.error(`请输入相同的净重`);
        return;
      }

      return true;
    },

    // 获取原料信息
    getOrig () {
      const {
        counter_id,
        stock_type_id,
        stock_kind_id,
        output_pur_weight,
        output_net_weight
      } = this.arrParams[0];
      let obj = {
        counter_id,
        output_counter: this.getCountName(counter_id),
        stock_type_id,
        stock_type: this.getTypeName(stock_type_id),
        output_pur_weight,
        output_net_weight,
        stock_kind_id,
        stock_kind: this.getKindName(stock_kind_id)
      };

      return obj;
    },

    // 获取现料信息
    getDest () {
      const {
        counter_id,
        stock_type_id,
        stock_kind_id,
        input_pur_weight,
        input_net_weight
      } = this.arrParamsOld[0];
      let obj = {
        counter_id,
        output_counter: this.getCountName(counter_id),
        stock_type_id,
        stock_type: this.getTypeName(stock_type_id),
        input_pur_weight,
        input_net_weight,
        stock_kind_id,
        stock_kind: this.getKindName(stock_kind_id)
      };

      return obj;
    },

    getParams () {
      const { departId, note } = this.submitData;
      let paramsChild, orig, dest;
      orig = this.getOrig();
      dest = this.getDest();
      paramsChild = {
        departId,
        departName: this.getDeartName(departId),
        note,
        orig,
        dest
      };
      console.log(paramsChild);
      return paramsChild;
    },

    // 提交
    submitPrint () {
      if (!this.valiData(this.getParams())) {
        return;
      }

      let params = {
        stockNowStoreRelas: JSON.stringify(this.getParams())
      };
      this.$api
        .urlPost(this.$portMain + "/stock/createNowStockTrans", params)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.modifyPrintData(res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    //组装打印数据
    modifyPrintData (options) {
      const { code: orderCode, create: createName } = options;
      const {
        departName,
        note,
        orig: {
          output_counter,
          stock_type,
          stock_kind,
          output_net_weight,
          output_pur_weight
        },
        dest: {
          output_counter: new_output_counter,
          stock_type: new_stock_type,
          stock_kind: new_stock_kind,
          input_pur_weight,
          input_net_weight
        }
      } = this.getParams();

      let self = this;
      let orig = {
        output_counter,
        stock_kind,
        stock_type,
        output_net_weight,
        output_pur_weight
      };
      let dest = {
        output_counter: new_output_counter,
        stock_kind: new_stock_type,
        stock_type: new_stock_kind,
        input_pur_weight,
        input_net_weight
      };

      this.printData = {
        createName,
        departName,
        note,
        orderCode,
        dest,
        orig
      };
      this.pritTypeShow = true;
      this.$nextTick(() => {
        this.$refs.myComp.compPrintFun();
      });
    },

    // 取消
    cancelFun () {
      this.$router.push("SendMaterial");
    },

    //根据项目id查询项目
    findPropKind (keyWord, id, index) {
      let self = this;
      let params = {
        PRS: {
          paypayVal: id,
          search: keyWord
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPropKind", params)
        .then(function (res) {
          if (res.data.code == 200) {
            self.arrParamsOld[index].findPropKindData = res.data.data;
            self.loading = false;
            //self.$forceUpdate();
          } else {
            self.$message.error(res.data.msg);
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
      resize: none;
      width: 842px;
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

  .flexb {
    display: flex;
    justify-content: space-between;
  }
}
</style>
