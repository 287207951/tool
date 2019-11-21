<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>合作银行</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="12">
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="searchFun"
            @blur="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>

          <span class="leftTitel">起止时间</span>
          <el-date-picker
            v-model="selectedDay"
            @change="selectDayFun"
            type="datetimerange"
            align="right"
            unlink-panels
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>

        <!-- <el-col :span="12" style="text-align: right;">
          <el-button type="primary" size="small" @click="createdBank">新增银行</el-button>
        </el-col>-->
      </el-row>
      <el-row style="margin-top:16px">
        <el-col :span="24" v-if="powerShow == 'true'">
          <el-button type="primary" size="small" @click="createdBank">新增</el-button>
          <el-button type="primary" size="small" plain @click="enable">启用</el-button>
          <el-button type="primary" size="small" plain @click="noEnable">禁用</el-button>
          <el-button type="warning" size="small" @click="deleFun">删除</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="BankData"
        stripe
        @selection-change="handleSelectionChange"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="50px"></el-table-column>
        <el-table-column prop="bankId" label="客户ID"></el-table-column>
        <el-table-column prop="bankName" label="客户名称"></el-table-column>
        <el-table-column prop="bankCode" label="客户编码"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.statu == 'E'">启用</span>
            <span v-if="scope.row.statu == 'D'" style="color:#8A9199;font-size:14px">禁用</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 选择工厂类型 -->
    <el-dialog
      title="新增合作银行"
      :visible.sync="createdBankType"
      width="760px"
      :close-on-click-modal="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="12">
            <span class="textColor">客户名称</span>
            <el-input v-model="bankName" placeholder="请输入客户名称" size="small" class="width240"></el-input>
            <span class="redColor">*</span>
          </el-col>
          <el-col :span="12" class="textRight">
            <span class="textColor">客户编码</span>
            <el-input v-model="bankCode" placeholder="请填写客户编码" size="small" class="width240"></el-input>
          </el-col>
        </el-row>
        <el-row class="marginTop41">
          <el-col :span="12">
            <span class="textColor">财务编码</span>
            <el-input v-model="financeCode" placeholder="请输入财务编码" size="small" class="width240"></el-input>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdBankType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveFun" size="small" :loading="saveBtnLoading">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerShow: "false",
      loading: true,
      saveBtnLoading: false,
      selectDatas: [], //选中数据
      selectedDay: "", //日期选择属性
      startTime: "",
      endTime: "",
      bankName: "", //银行名称
      bankCode: "", //客户编码
      financeCode: "", //财务编码
      assState: "", //关联状态
      BankData: [], //银行数据
      editData: "", //编辑的数据
      delEditData: "", //取消关联的数据
      allData: {}, //测金详情数据
      search: "", //搜索
      createdBankType: false, // 弹框状态
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
      this.displayAllData();
      this.powerFun();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          keyWord: self.search, //搜索
          startTime: self.startTime,
          endTime: self.endTime,
          pageIndex: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/company/queryBank", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.BankData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.BankData.forEach(item => {
              item.createTime = self.$api.dateGetDayTime(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(err => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(val) {
      this.selectDatas = val;
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    // 保存新建银行
    saveFun() {
      let self = this;

      //客户名称校验
      if (this.bankName != undefined) {
        this.bankName = this.bankName.trim();
      }

      if (this.bankName == "") {
        this.$message.warning("客户名称不能为空！");
        return;
      }

      let patt = /^[\u4e00-\u9fa5_a-zA-Z0-9$&*()\-,.#]{2,50}$/g;
      let bankNameRes = patt.test(self.bankName);
      if (!bankNameRes) {
        self.$message.warning(
          "客户名称输入错误,请输入2-50位英文大小写/数字/中文(可包含 $ & * ( ) - , . #)"
        );
        return;
      }

      //客户编码
      if (this.bankCode != undefined) {
        this.bankCode = this.bankCode.trim();
      }

      if (self.bankCode != "") {
        let pattCode = /^[a-zA-Z]{1}[a-zA-Z0-9]{3,9}$/g;
        let bankCodeRes = pattCode.test(self.bankCode);

        if (!bankCodeRes) {
          self.$message.warning(
            "客户编码格式错误,请输入4-10位字母或数字,第一位必须为字母"
          );
          return;
        }
      }

      //财务编码
      if (this.financeCode != undefined) {
        this.financeCode = this.financeCode.trim();
      }
      if (this.financeCode != "") {
        if (this.financeCode.length > 50) {
          this.$message.warning("财务编码不能大于50位");
          return;
        }
      }

      let params = {
        bankName: self.bankName,
        bankCode: self.bankCode,
        financeCode: self.financeCode
      };
      this.saveBtnLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/company/createBank",
        params,
        res => {
          self.$message.success(res.msg);
          setTimeout(function() {
            self.createdBankType = false;
            self.saveBtnLoading = false;
            self.created_fun();
          }, 2000);
        },
        err => {
          self.$message.error(err.msg);
          self.saveBtnLoading = false;
        }
      );
    },
    //关联事假
    checkBoxFun(elem) {
      if (!elem) {
        this.assState = "";
      }
    },
    // 新增银行
    createdBank() {
      this.createdBankType = true;
      this.bankName = "";
      this.bankCode = "";
      this.financeCode = "";
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
      this.searchFun();
    },
    //查询
    searchFun() {
      this.pageSize = 12;
      this.pageNum = 1;
      this.displayAllData();
    },
    //启用
    enable() {
      let self = this;
      let noEnableData = [];
      let res = false;
      if (this.selectDatas.length == 0) {
        self.$message.warning("请选择数据！");
        return;
      }
      this.selectDatas.forEach(item => {
        if (item.statu == "D") {
          noEnableData.push(item.bankId);
        }

        if (item.statu == "E") {
          res = true;
        }
      });

      if (res) {
        self.$message.warning("抱歉，您选中的数据有已启用的，请重新选择！");
        return;
      }

      let params = {
        statu: "E",
        bankIds: noEnableData.join()
      };
      this.$api.formdataPostFun(
        this.$portMain + "/company/updateStatuBatch",
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
    //禁用
    noEnable() {
      let self = this;
      let enableData = [];
      let res = false;
      if (this.selectDatas.length == 0) {
        self.$message.warning("请选择数据！");
        return;
      }
      this.selectDatas.forEach(item => {
        if (item.statu == "E") {
          enableData.push(item.bankId);
        }

        if (item.statu == "D") {
          res = true;
        }
      });

      if (res) {
        self.$message.warning("抱歉，您选中的数据有已禁用的，请重新选择！");
        return;
      }

      let params = {
        statu: "D",
        bankIds: enableData.join()
      };
      this.$api.formdataPostFun(
        this.$portMain + "/company/updateStatuBatch",
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
    //删除1
    deleFun() {
      let self = this;
      if (this.selectDatas.length == 0) {
        self.$message.warning("请选择数据！");
        return;
      }
      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let deleData = [];
          this.selectDatas.forEach(item => {
            deleData.push(item.bankId);
          });

          let params = {
            bankIds: deleData.join()
          };
          this.$api.formdataPostFun(
            this.$portMain + "/company/delBankBatch",
            params,
            res => {
              self.$message.success(res.msg);
              self.displayAllData();
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        })
        .catch(() => {});
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerShow = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "company-edit-bank"
      );
    }
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

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .searchTxt {
    width: 256px;
  }

  .leftTitel {
    color: #8A8E99;
    font-size: 12px;
    margin-left: 24px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .width160 {
    width: 160px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 760px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textColor {
      color: #8A9199;
      font-size: 14px;
    }

    .textRight {
      text-align: right;
    }

    .marginTop41 {
      margin-top: 41px;
    }

    .textAreaSty {
      width: 650px;
      height: 60px;
      resize: none;
      border-radius: 2px;
      border: 1px solid #CFD9E6;
      margin-left: 7px;
    }
  }

  .width240 {
    width: 240px;
  }
}
</style>
