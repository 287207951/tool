<template>
  <div class="conBigDiv" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>差异单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"></div>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="搜索发起单位"
            v-model="searchForm.search"
            class="input-with-select searchTxt"
            size="small"
            @keydown.enter.native="screenFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">材质</span>
          <el-select
            v-model="searchForm.goldCode"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in selectOptionsData.gold_material_code"
              :key="item.code"
              :label="item.val"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">成色</span>
          <el-select
            v-model="searchForm.conditi"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in selectOptionsData.condition_code"
              :key="item.code"
              :label="item.val"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">生产工艺</span>
          <el-select
            v-model="searchForm.processCode"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="screenFun"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in selectOptionsData.pro_process_code"
              :key="item.code"
              :label="item.val"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">时间选择</span>
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions3"
            style="width:300px"
            @change="searTimechFun"
          ></el-date-picker>
        </el-col>
        <el-col :span="24" class="top10">
          <el-button type="danger" size="small" plain @click="resetAllData">重置</el-button>
          <el-button type="primary" size="small" @click="createBalanceSlip">生成称差单</el-button>
        </el-col>
      </el-row>
      <div style="height: 10px"></div>
      <el-table
        :data="tableData"
        @select="selectionChange"
        ref="table"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="expand" width="1">
          <template slot-scope="scope" v-if="scope.row.proBasics.oneItemsCode === 'TZ'">
            <div class="dropdown-container">
              <product-row
                class="dropdown-item"
                v-for="proItem in scope.row.proSpecData.ProList"
                :key="proItem.proNum"
                :imgBaseUrl="$portImg"
                :productData="proItem"
                :layoutSetting="tzLayout"
                titleKey="name"
                imgUrlKey="pic"
              ></product-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" :selectable="isDisabled" align="center" width="55"></el-table-column>
        <el-table-column prop="date" width="500" label="SKU信息">
          <template slot-scope="scope">
            <product-row
              style="padding:0 0;border:0"
              @clickDtail="clickDtail(scope)"
              :layoutSetting="productLayout"
              :imgBaseUrl="$portImg"
              :productData="scope.row"
              titleKey="proBasics.proName"
              imgUrlKey="proBasics.pic"
            >
              <!-- <div class="dropdown-container"
                   slot="dropdown">
                <product-row class="dropdown-item"
                             v-for="proItem in scope.row.proSpecData.ProList"
                             :key="proItem.proNum"
                             :imgBaseUrl="$portImg"
                             :productData="proItem"
                             :layoutSetting="tzLayout"
                             titleKey="name"
                             imgUrlKey="pic"></product-row>
              </div>-->
            </product-row>
          </template>
        </el-table-column>
        <el-table-column prop="initiator" sortable label="发起单位" width="180"></el-table-column>
        <el-table-column prop="recipient" sortable label="接收单位"></el-table-column>
        <el-table-column prop="bizNo" width="130" label="源单号"></el-table-column>
        <el-table-column prop="totalAmount" align="center" label="合计数量"></el-table-column>
        <el-table-column prop="differAmount" align="center" label="差异数量"></el-table-column>
        <el-table-column prop="differWeight" align="center" label="差异重量(g)"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
          <tempalate slot-scope="scope">
            <div>{{$api.dateGetDayTime(scope.row.createTime).split(' ')[0]}}</div>
            <div>{{$api.dateGetDayTime(scope.row.createTime).split(' ')[1]}}</div>
          </tempalate>
        </el-table-column>
        <el-table-column prop="createName" align="center" label="创建人"></el-table-column>
        <el-table-column prop="statue" align="center" sortable label="单据状态">
          <template slot-scope="scope">
            <span
              :class="scope.row.statue === '1' ? 'yellowColor' : ''"
            >{{statueFormat(scope.row.statue)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="PageCount"
          background
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="生成称差单详情" width="1266px" :visible.sync="dialogView">
      <el-row>
        <el-col :span="24">
          <span>发起单位：</span>
          <span>{{selectedData[0] && selectedData[0].initiator || ''}}</span>
          <el-button type="primary" size="small" style="float:right" @click="dialogCreateBill">生成称差单</el-button>
        </el-col>
      </el-row>
      <product-list
        idKey="proId"
        :imgBaseUrl="$portImg"
        titleKey="proBasics.proName"
        imgUrlKey="proBasics.pic"
        :layoutSetting="productLayout"
        :listData="selectedData"
      ></product-list>
    </el-dialog>
  </div>
</template>

<script>
import productList from "@/components/product-list.vue";
import productRow from "@/components/product-row.vue";
export default {
  data() {
    return {
      tzLayout: [
        [
          {
            label: "编号",
            valueKey: "factoryNumber"
          },
          {
            label: "属性",
            valueFormat(data) {
              return [
                data.goldCode,
                data.condit,
                data.oneName,
                data.effect,
                data.processCode
              ]
                .filter(n => n)
                .join(",");
            },
            valueKey: "proBasics.goldCode"
          }
        ],
        [
          {
            label: "克重",
            valueKey: "weight",
            company: "g"
          }
        ]
      ],
      selectedData: [],
      dialogView: false,
      selectedDay: "",
      searchForm: {
        search: "",
        goldCode: "",
        conditi: "",
        processCode: "",
        startTime: "",
        endTime: ""
      },
      loadingState: false,
      searchloading: false,
      tableData: [],
      customerData: [],
      productLayout: [
        [
          {
            label: "编码",
            valueKey: "proSpecData.specNumber"
          },
          {
            label: "属性",
            valueKey: "proBasics.goldCode",
            valueFormats(data) {
              return [
                data.goldCode,
                data.condit,
                data.oneName,
                data.effect,
                data.processCode
              ]
                .filter(n => n)
                .join(",");
            },
            custom: function(data) {
              if (data.proBasics.oneItemsCode === "TZ") {
                return "套装详情";
              }
            }
          }
        ],
        [
          {
            label: "成色",
            valueKey: "proSpecData.conditi"
          },
          {
            label: "克重",
            valueKey: "proSpecData.weight",
            company: "g"
          },
          {
            specialFn: data => {
              return data.proSpecData.factFeeType === 1
                ? {
                    label: "工费",
                    valueKey: "proSpecData.price",
                    company: "元/g"
                  }
                : {
                    label: "工费",
                    valueKey: "proSpecData.piecePrice",
                    company: "元/g"
                  };
            }
          }
        ]
      ],
      dialogProductLayout: [
        [
          {
            label: "编码",
            valueKey: "proSpecData.specNumber"
          },
          {
            label: "属性",
            valueKey: "proBasics.goldCode"
          }
        ],
        [
          {
            label: "成色",
            valueKey: "proSpecData.conditi"
          },
          {
            label: "克重",
            valueKey: "proSpecData.weight",
            company: "g"
          },
          {
            specialFn: data => {
              return data.proSpecData.factFeeType === 1
                ? {
                    label: "工费",
                    valueKey: "proSpecData.price",
                    company: "元/g"
                  }
                : {
                    label: "工费",
                    valueKey: "proSpecData.piecePrice",
                    company: "元/g"
                  };
            }
          }
        ],
        [
          {
            label: "合计数量",
            valueKey: "totalAmount"
          },
          {
            label: "差异数量",
            valueKey: "differAmount"
          },
          {
            label: "差异重量(g)",
            valueKey: "differWeight"
          }
        ]
      ],
      selectOptionsData: {},
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      PageCount: 0 //总条目数
    };
  },
  methods: {
    clickDtail(scope) {
      this.$refs.table.toggleRowExpansion(scope.row);
    },
    // 生成称差单
    createdBillDialog() {
      const ids = this.$refs.table.selection.map(n => n.id);
      let params = ids;
      //   this.$api
      //     .urlPost(this.$portMain + "/biz/differ/createDifferOrder", params, true)
      //     .then(res => {
      //       if (res.data.code == 200) {
      //         this.$message.success("已生成称差单,跳转到称差单列表");
      //         this.$router.push("weighingDifferenceList");
      //       } else {
      //         this.$message.error(res.data.msg);
      //       }
      //     });
      this.$axios({
        url: this.$portMain + "/biz/differ/createDifferOrder",
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          clientType: "HT"
        },
        data: ids
      }).then(res => {
        if (res.data.code == 200) {
          this.$message.success("已生成称差单,跳转到称差单列表");
          this.$router.push("weighingDifferenceList");
          // this.dialogView = false
          // this.handleSizeChange()
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    dialogCreateBill() {
      this.$api.refClick(this).then(res => {
        this.createdBillDialog();
      });
    },
    isDisabled(row, index) {
      return row.statue === "1";
    },
    createBalanceSlip() {
      const selectedData = this.$refs.table.selection;
      const arr = selectedData.map(n => n.initiatorId);
      if (arr.length) {
        const flag = arr.every(item => {
          return arr.indexOf(item) === 0;
        });
        if (flag) {
          this.$set(this, "selectedData", selectedData);
          this.$nextTick(() => {
            this.dialogView = true;
          });
        } else {
          this.$message.warning(" 必须选择发起单位相同的条目!");
        }
      } else {
        this.$message.warning("请先选择条目!");
      }
    },
    statueFormat(value) {
      return value === "1" ? "待处理" : "已处理";
    },
    getSelectOptions() {
      this.$axios
        .get(this.$portMain + "/proCommonController/code")
        .then(res => {
          if (res.data.code == 200) {
            this.selectOptionsData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    searTimechFun() {
      if (this.selectedDay != null) {
        this.searchForm.startTime = this.$api.dateGetDayTime(
          this.selectedDay[0]
        );
        this.searchForm.endTime = this.$api.dateGetDayTime(this.selectedDay[1]);
      } else {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
      this.screenFun();
    },
    screenFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.tableRender();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.tableRender();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.tableRender();
    },
    selectionChange(selectedData, row) {
      const arr = selectedData.map(n => n.initiatorId);
      const flag = arr.every(item => {
        return arr.indexOf(item) === 0;
      });
      if (!flag) {
        this.$message.warning(" 必须选择发起单位相同的条目!");
        this.$refs.table.toggleRowSelection(row, false);
      }
    },
    tableRender() {
      let self = this;
      this.loadingState = true;
      let params = {
        PRS: {
          ...this.searchForm,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/biz/differ/getDifferOrderlist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.tableData = res.data.data.data;
            self.PageCount = res.data.data.rowSize;
            self.loadingState = false;
            self.$nextTick(() => {
              const $container = self.$$(self.$refs.table.$el);
              $container.find(".el-table__expand-column .cell").remove();
            });
          } else {
            self.$message.error(res.data.msg);
            self.loadingState = false;
          }
        });
    },
    resetAllData() {
      this.searchForm = {};
      this.selectedDay = ``;
      this.screenFun();
    },
    // 选择客户
    changCustomer(val) {
      this.screenFun();
    },
    remoteMethod(query) {
      if (!query) {
        this.customerData = [];
        return;
      }
      this.searchloading = true;
      let params = {
        PRS: {
          clientScope: "",
          keyWord: query
        }
      };
      this.$axios
        .get(this.$portMain + "/client/rawClientSimple", params)
        .then(res => {
          if (res.data.code == 200) {
            this.customerData = res.data.data;
            this.searchloading = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  },
  created() {
    this.getSelectOptions();
    this.tableRender();
  },
  components: {
    "product-row": productRow,
    "product-list": productList
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .yellowColor {
    color: #F26D0F;
  }

  .redColor {
    color: #F20F34;
  }

  .blackColor {
    color: #2E2F33;
  }

  .grayColor {
    color: #8a9199;
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

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 20px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .width160 {
    width: 160px;
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

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }

  .orderBigDiv {
    padding: 13px;
    min-height: 80px;
    border: #E5F1FF 1px solid;
    margin: 20px 8px;
    color: #222426;
    font-size: 14px;

    .orderBigDivOne {
      color: #333;
    }
  }

  .txtOne {
    font-size: 14px;
    color: #889199;

    span {
      color: #222426;
    }
  }

  .txtTwo {
    font-size: 14px;
    color: #222426;
  }

  .txtTwoBold {
    font-size: 14px;
    color: #222426;
    font-weight: bold;
  }

  .txtThree {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .txtThreeRed {
    font-size: 14px;
    color: $base-color;
    font-weight: bold;
  }

  .txtFour {
    font-size: 14px;
    color: #F20F34;
    font-weight: bold;
  }

  .txtFive {
    font-size: 14px;
    color: #919599;
    font-weight: bold;
  }

  .txtRed {
    color: #F20F34;
  }

  .tabOne {
    display: flex;
  }

  .tabOneLeft {
    width: 140px;
  }

  .tabOneRight {
    width: calc(100% - 140px);
  }

  .paddingRight30 {
    padding-right: 30px;
    margin-top: 10px;
  }

  .marginTop10 {
    margin-top: 10px;
    padding-left: 20px;
  }

  .suitDiv {
    padding-bottom: 10px;
    border-top: 1px solid #DADFE6;
    margin-top: 10px;

    .suitSubDiv {
      margin: 10px 0px;
    }
  }

  .pro-item {
    display: flex;
    align-items: center;
    background: #fff;
    line-height: 30px;

    .pro-right {
      width: 75%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-left: 10px;
    }
  }

  .redTxtOne {
    color: #F20F34;
    font-weight: bold;
  }

  .width240 {
    width: 240px;
  }

  .floatRight {
    float: right;
  }

  .left20 {
    margin-left: 20px;
  }

  .tabTwo {
    display: flex;
  }

  .tabTwoLeft {
    width: 174px;
  }

  .tabTwoRight {
    width: calc(100% - 174px);
    margin-left: 20px;
  }

  .txtAlginRight {
    text-algin: right;
  }

  .txt12px {
    font-size: 12px;
  }
}

.dropdown-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;

  .dropdown-item {
    width: 50%;
    box-sizing: border-box;
  }
}
</style>
