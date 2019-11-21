<template>
  <div class="conBigDiv" ref="bankAccountSet" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>银行账号设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="18">
          <div>
            <el-input
              placeholder="开户公司/开户行/银行账号"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keyup.enter.native="queryFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="gray_font">时间筛选</span>
            <el-date-picker
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
            ></el-date-picker>
            <!-- <span class="gray_font">状态</span>
            <el-select v-model="isActive" placeholder="请选择" size="small">
              <el-option
                v-for="item in statueData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>-->
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top:16px;">
        <el-col :span="24" v-if="addAllotTF">
          <el-button type="primary" size="small" @click="createdFun">新增账户</el-button>
          <el-button size="small" type="primary" plain @click="enableFun">启用</el-button>
          <el-button size="small" type="primary" plain @click="noEnableFun">禁用</el-button>
          <el-button type="warning" size="small" @click="deleFun">删除</el-button>
          <el-button size="small" type="primary" plain @click="queryFun">查询</el-button>
          <el-button size="small" type="primary" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        height="700"
        @row-dblclick="editGold"
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-top:26px"
      >
        <el-table-column type="selection" header-align="center" align="center" width="60"></el-table-column>
        <el-table-column prop="companyName" label="开户公司"></el-table-column>
        <el-table-column prop="bankOfDeposit" label="开户行"></el-table-column>
        <el-table-column prop="accountNumber" label="银行账号"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.statu == '0'">启用</span>
            <span v-else-if="scope.row.statu == '1'" style="color:#889199">禁用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增公司账户 -->
    <el-dialog title="新增公司账户" :visible.sync="newType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>

        <div class="itemWrap">
          <span class="itemTitle">开户公司</span>
          <el-input v-model="companyName" placeholder="请填写开户公司" size="small" style="width:280px"></el-input>
          <span class="redColor">*</span>
        </div>

        <div class="itemWrap">
          <span class="itemTitle definTitle">开户行</span>
          <el-input
            v-model="bankOfDeposit"
            placeholder="请设置银行简称例：中国银行6231"
            size="small"
            style="width:280px"
          ></el-input>
          <span class="redColor">*</span>
        </div>

        <div>
          <span class="itemTitle">银行账号</span>
          <el-input
            v-model="accountNumber"
            placeholder="请填写银行银行账号"
            size="small"
            style="width:280px"
          ></el-input>
          <span class="redColor">*</span>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="newType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="subFun" size="small" :loading="btnSubLoading">确定</el-button>
      </span>
    </el-dialog>
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
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      btnSubLoading: false,
      companyName: "", //开户公司
      bankOfDeposit: "", //开户行
      accountNumber: "", //银行帐号
      selectionData: "", //选中数据
      stockTypeName: "", //新增种类名称
      newType: false,
      orderList: [],
      isActive: "", //状态
      search: "", //搜索
      startTime: "",
      endTime: "",
      statueData: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "_on",
          label: "启用"
        },
        {
          value: "_off",
          label: "禁用"
        }
      ],
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      addAllotTF: false //新增调拨按钮显示权限
    };
  },
  created() {
    this.displayAllData();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.bankAccountSet;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.newType == true && altKey && keyCode === 83) {
        self.subFun();
      }

      if (dom != undefined && altKey && keyCode === 68) {
        self.deleFun();
      }
    };
    this.addAllotTF = this.$api.setPowerSpotThree(
      sessionStorage.verify,
      "company-edit-bankaccount"
    );
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          start: self.startTime,
          end: self.endTime,
          keyWord: self.search,
          paging: "Y",
          pageIndex: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/company/queryBankRecord", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.orderList.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(val) {
      this.selectionData = val;
    },
    createdFun() {
      this.newType = true;
      this.companyName = ""; //开户公司
      this.bankOfDeposit = ""; //开户行
      this.accountNumber = ""; //银行帐号
    },
    // 编辑提纯单
    editGold(elem) {
      // this.$router.push({ path: 'editMaterToOrna', query: { goldId: elem.id }})
    },
    //提交新增
    subFun() {
      let self = this;
      if (this.companyName != undefined) {
        this.companyName = this.companyName.trim();
      }

      if (this.companyName == "") {
        this.$message.warning("请输入开户公司");
        return;
      }
      if (this.bankOfDeposit != undefined) {
        this.bankOfDeposit = this.bankOfDeposit.trim();
      }

      if (this.bankOfDeposit == "") {
        this.$message.warning("请输入开户行");
        return;
      }
      if (this.accountNumber != undefined) {
        this.accountNumber = this.accountNumber.trim();
      }

      if (this.accountNumber == "") {
        this.$message.warning("请输入银行账号");
        return;
      }

      if (isNaN(self.accountNumber)) {
        self.$message.warning("抱歉，银行卡号只能是数字！");
        return;
      }

      let parems = {
        companyName: self.companyName,
        bankOfDeposit: self.bankOfDeposit,
        accountNumber: self.accountNumber
      };

      this.btnSubLoading = true;
      this.$api.formdataPostFun(
        self.$portMain + "/company/createBankRecord",
        parems,
        res => {
          self.newType = false;
          self.$message.success(res.msg);
          self.btnSubLoading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.btnSubLoading = false;
        }
      );
    },
    //启用
    enableFun() {
      let self = this;
      let noEnable = [];
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择要启用的账号！");
        return;
      }
      let result = false;
      this.selectionData.forEach(item => {
        if (item.statu == "1") {
          noEnable.push(item.accountNumber);
        }
        if (item.statu == "0") {
          result = true;
        }
      });

      if (result) {
        this.$message.warning("抱歉，您选中的账号有已启用的，请重新选择！");
        return;
      }

      let params = {
        PRS: {
          accountNumber: noEnable.join(),
          statu: "0"
        }
      };

      this.$axios
        .get(this.$portMain + "/company/updateBankRecordStatu", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //禁用
    noEnableFun() {
      let self = this;
      let enable = [];
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择账号！");
        return;
      }
      let result = false;
      this.selectionData.forEach(item => {
        if (item.statu == "0") {
          enable.push(item.accountNumber);
        }
        if (item.statu == "1") {
          result = true;
        }
      });

      if (result) {
        this.$message.warning("抱歉，您选中的账号有已禁用的，请重新选择！");
        return;
      }

      let params = {
        PRS: {
          accountNumber: enable.join(),
          statu: "1"
        }
      };

      this.$axios
        .get(this.$portMain + "/company/updateBankRecordStatu", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //删除
    deleFun() {
      let self = this;
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择账号！");
        return;
      }
      this.$confirm("您确定要删除选中的账号么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let deleData = [];
        this.selectionData.forEach(item => {
          deleData.push(item.accountNumber);
        });

        let params = {
          PRS: {
            accountNumber: deleData.join()
          }
        };

        this.$axios
          .get(this.$portMain + "/company/delBankRecordPhysics", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              self.displayAllData();
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
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
    },
    //查询
    queryFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.selectedDay = "";
      this.queryFun();
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

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
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

  .searchTxt {
    width: 320px;
  }

  .gray_font {
    color: $font-color;
    margin-left: 24px;
  }

  .marignLeft8 {
    margin-left: 8px;
  }

  .returnColor {
    color: #F20F34;
  }

  .passColor {
    color: #222426;
  }

  .awaitColor {
    color: #F26D0F;
  }

  .cancelColor {
    color: #8A9199;
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

    .once {
      display: flex;
      margin-bottom: 32px;
    }

    .itemWrap {
      // padding-top: 20px;
      padding-bottom: 24px;
    }

    .itemTitle {
      font-size: 14px;
      color: #8A9199;
    }

    .definTitle {
      display: inline-block;
      width: 56px;
      text-align: right;
    }

    .redColor {
      color: red;
    }
  }
}
</style>
