<template>
  <div class="conBigDiv" ref="basicLaborCost" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>工费设置</el-breadcrumb-item>
      <el-breadcrumb-item>平台附加费用维护</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <div>
            <!-- <el-input
              placeholder="请输入关键字搜索"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keydown.enter.native="displayAllData"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>-->
            <!-- <span class="fontGray marginLeft24">时间筛选</span>
            <el-date-picker
              class="marginRight"
              v-model="selectedDay"
              @change="selectDayFun"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
            ></el-date-picker>-->
            <!-- <span class="fontGray marginLeft24">发布人</span>
            <el-select v-model="mock" placeholder="请选择" size="small">
              <el-option
                v-for="item in provinceData"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>-->
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:24px">
        <el-col :span="24">
          <div class="topMenuLeft">
            <el-button type="primary" size="small" @click="creatTable()">创建</el-button>
            <el-button type="danger" size="small" plain @click="enable">启用</el-button>
            <el-button type="danger" size="small" plain @click="noEnable">禁用</el-button>
            <el-button type="warning" size="small" @click="deleFun">删除</el-button>
            <!-- <el-button type="danger" size="small" @click="displayAllData">查询</el-button> -->
            <!-- <el-button type="danger" size="small" @click="resetAllData">重置</el-button> -->
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="costData"
        @row-dblclick="getDetails"
        stripe
        height="700"
        style="width: 100%; margin-top: 20px"
        @selection-change="handleCheckAllChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column prop="paypayTxt" label="名称"></el-table-column>
        <el-table-column prop="price" label="费用单价"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.statue == 'Y'">启用</span>
            <span v-if="scope.row.statue == 'N'" style="color:#8A9199">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注信息"></el-table-column>
        <el-table-column prop="createName" label="发布人"></el-table-column>
        <el-table-column prop="createTime" label="发布时间"></el-table-column>
      </el-table>
    </div>
    <!-- 新增 -->
    <el-dialog
      title="新增附加费用设置"
      :close-on-click-modal="false"
      :visible.sync="costType"
      width="720px"
    >
      <div class="newFrame">
        <div class="line"></div>
        <div class="liModular">
          <div>
            <span class="leftModular">费用名称</span>
            <el-input v-model="paypayTxt" size="small" class="width200" placeholder="请填写费用名称"></el-input>
            <span style="color:red">*</span>
          </div>

          <div>
            <span class="leftModular">计费方式</span>
            <el-select v-model="billingWay" placeholder="请选择计费方式" size="small" class="width200">
              <el-option
                v-for="item in billingWayData"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="color:red">*</span>
          </div>
        </div>

        <div class="liModular">
          <div>
            <span class="leftModular">费用</span>
            <el-input
              v-model="price"
              size="small"
              class="width200"
              placeholder="请填写费用"
              @blur="checkNumber"
              :maxlength="6"
            ></el-input>
            <span style="color:red">*</span>
          </div>

          <div>
            <span class="leftModular">备注</span>
            <el-input v-model="note" size="small" class="width200" placeholder="请填写备注"></el-input>
            <span style="opacity: 0;">*</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="costType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreate" size="small" :loading="saveBtnLoading">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      title="编辑附加费用"
      :visible.sync="editCostType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="newFrame">
        <div class="line"></div>
        <div class="liModular">
          <div>
            <span class="leftModular">费用名称</span>
            <el-input
              v-model="editData.paypayTxt"
              size="small"
              class="width200"
              placeholder="请填写费用名称"
              
            ></el-input>
            <span style="color:red">*</span>
          </div>

          <div>
            <span class="leftModular">计费方式</span>
            <el-select
              v-model="editData.billingWay"
              placeholder="请选择计费方式"
              size="small"
              class="width200"
            >
              <el-option
                v-for="item in billingWayData"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="color:red">*</span>
          </div>
        </div>

        <div class="liModular">
          <div>
            <span class="leftModular">费用</span>
            <el-input
              v-model="editData.price"
              size="small"
              class="width200"
              placeholder="请填写费用"
              @blur="editCheckNum"
              :maxlength="6"
            ></el-input>
            <span style="color:red">*</span>
          </div>

          <div>
            <span class="leftModular">备注</span>
            <el-input v-model="editData.note" size="small" class="width200" placeholder="请填写备注"></el-input>
            <span style="opacity: 0;">*</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCostType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="small" :loading="editBtnLoading">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      saveBtnLoading: false,
      editBtnLoading: false,
      changData: [], //选中的数据
      editData: {
        //编辑数据
        paypayTxt: "",
        billingWay: "",
        price: "",
        note: ""
      },
      paypayTxt: "", //费用名称
      billingWay: "", //计费方式
      price: "", //费用
      note: "", //备注
      billingWayData: [
        {
          name: "按件收",
          value: "j"
        },
        {
          name: "按克收",
          value: "k"
        },
        {
          name: "按单收",
          value: "d"
        }
      ],
      costData: [],
      costType: false, //创建弹出框状态
      editCostType: false, //编辑弹出框状态
      selectedDay: "", //日期选择属性
      search: "", //搜索字段
      startTime: "",
      endTime: "",
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
      this.displayAllData();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      this.$axios
        .get(this.$portMain + "/discount/getCarepriceList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.costData = res.data.data;
            self.costData.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    resetAllData() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.displayAllData();
    },
    creatTable() {
      this.costType = true;
      this.paypayTxt = ""; //费用名称
      this.billingWay = ""; //计费方式
      this.price = ""; //费用
      this.note = ""; //备注
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData();
    },

    //全选
    handleCheckAllChange(item) {
      this.changData = item;
    },
    //保存创建
    saveCreate() {
      let self = this;
      if (this.paypayTxt != undefined) {
        this.paypayTxt = this.paypayTxt.trim();
      }

      if (this.paypayTxt == "") {
        self.$message.warning("请填写费用名称！");
        return;
      }
      if (this.billingWay == "") {
        self.$message.warning("请选择计费方式！");
        return;
      }
      if (this.price != undefined) {
        this.price = this.price.trim();
      }
      if (this.price == "") {
        self.$message.warning("请填写费用！");
        return;
      }
      // if (this.note == '') {
      //   self.$message.warning('请填写备注！');
      //   return;
      // }

      let platformCareprice = {
        paypayTxt: self.paypayTxt,
        billingWay: self.billingWay,
        price: self.price,
        note: self.note != undefined ? self.note.trim() : ""
      };

      let params = {
        platformCareprice: JSON.stringify(platformCareprice)
      };

      this.saveBtnLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/discount/insertPlatformCareprice",
        params,
        res => {
          self.$message.success(res.msg);
          self.costType = false;
          self.saveBtnLoading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.saveBtnLoading = false;
        }
      );
    },

    //保存编辑
    saveEdit() {
      console.log(this.editData);
      let self = this;
      if (this.editData.paypayTxt != undefined) {
        this.editData.paypayTxt = this.editData.paypayTxt.trim();
      }

      if (this.editData.paypayTxt == "") {
        self.$message.warning("请填写费用名称！");
        return;
      }
      if (this.editData.billingWay == "") {
        self.$message.warning("请选择计费方式！");
        return;
      }
      if (this.editData.price != undefined) {
        this.editData.price = String(this.editData.price).trim();
      }

      if (this.editData.price == "") {
        self.$message.warning("请填写费用！");
        return;
      }
      // if (this.editData.note == '') {
      //   self.$message.warning('请填写备注！');
      //   return;
      // }
      if (self.editData.note != undefined) {
        self.editData.note = self.editData.note.trim();
      }

      let params = {
        platformCareprice: JSON.stringify(self.editData)
      };

      this.editBtnLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/discount/insertPlatformCareprice",
        params,
        res => {
          self.$message.success(res.msg);
          self.editCostType = false;
          self.editBtnLoading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.editBtnLoading = false;
        }
      );
    },
    //获取详情数据
    getDetails(item) {
      let self = this;
      this.editCostType = true;
      this.editData = {
        paypayVal: item.paypayVal,
        paypayTxt: item.paypayTxt,
        billingWay: item.billingWay,
        price: item.price,
        note: item.note
      };
    },

    //启用
    enable() {
      let self = this;
      if (this.changData.length == 0) {
        this.$message.warning("请选择需要启用的数据！");
        return;
      }

      let result = false;
      let arr = [];
      this.changData.forEach(item => {
        if (item.statue == "Y") {
          result = true;
        }

        if (item.statue == "N") {
          arr.push(item.paypayVal);
        }
      });

      if (result) {
        this.$message.warning("抱歉，已经启用的数据不能重复启用！");
        return;
      }

      let params = {
        paypayVals: JSON.stringify(arr),
        statue: "Y"
      };
      this.$api.formdataPostFun(
        this.$portMain + "/discount/updatePlatformStatue",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //禁启用
    noEnable() {
      let self = this;
      if (this.changData.length == 0) {
        this.$message.warning("请选择需要禁用的数据！");
        return;
      }

      let result = false;
      let arr = [];
      this.changData.forEach(item => {
        if (item.statue == "N") {
          result = true;
        }

        if (item.statue == "Y") {
          arr.push(item.paypayVal);
        }
      });

      if (result) {
        this.$message.warning("抱歉，已经禁用的数据不能重复禁用！");
        return;
      }

      let params = {
        paypayVals: JSON.stringify(arr),
        statue: "N"
      };
      this.$api.formdataPostFun(
        this.$portMain + "/discount/updatePlatformStatue",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //删除
    deleFun() {
      let self = this;
      if (this.changData.length == 0) {
        this.$message.warning("请选择要删除的数据！");
        return;
      }

      this.$confirm("是否要执行删除操作？！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let arr = [];
        this.changData.forEach(item => {
          arr.push(item.paypayVal);
        });

        let params = {
          paypayVals: JSON.stringify(arr)
        };
        this.$api.formdataPostFun(
          this.$portMain + "/discount/deletePlatform",
          params,
          res => {
            self.$message.success(res.msg);
            self.displayAllData();
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      });
    },
    //费用校验(创建)
    checkNumber() {
      if (this.price != undefined) {
        this.price = this.price.trim();
      }
      let result = isNaN(this.price);
      let result2 = Number(this.price) < 0;
      if (result || result2) {
        this.$message.warning("请输入正确的费用！");
        this.price = "";
        return;
      }
      this.price = Number(this.price).toFixed(2);
    },
    //费用校验编辑
    editCheckNum() {
      if (this.editData.price != undefined) {
        this.editData.price = this.editData.price.trim();
      }

      let result = isNaN(this.editData.price);
      let result2 = Number(this.editData.price) < 0;
      if (result || result2) {
        this.$message.warning("请输入正确的费用！");
        this.editData.price = "";
        return;
      }

      this.editData.price = Number(this.editData.price).toFixed(2);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .width200 {
    width: 200px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .topMenuLeft {
    display: inline-block;
  }

  .searchTxt {
    width: 256px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontGray {
    color: $font-color;
  }

  .marginRight {
    margin-right: 8px;
  }

  .width40 {
    width: 40%;
    display: inline-block;
  }

  .marginLeft24 {
    margin-left: 24px;
  }

  .marginLeft18 {
    margin-left: 18%;
  }

  .marginTop6 {
    margin-top: 6%;
  }

  .newFrame {
    position: relative;

    .line {
      width: 720px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .liModular {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .leftModular {
      width: 56px;
      display: inline-block;
      margin-right: 2px;
      font-size: 14px;
      color: #8A9199;
      text-align: right;
    }
  }
}
</style>

<style>
.itemTwoWrap .checkWrap .el-checkbox {
  margin-left: 0px;
  width: 230px;
}
</style>
