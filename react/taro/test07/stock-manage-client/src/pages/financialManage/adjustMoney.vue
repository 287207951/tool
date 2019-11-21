<template>
  <div class="conBigDiv" ref="adjustMoney" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>出纳</el-breadcrumb-item>
      <el-breadcrumb-item>调整款</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <div>
            <el-input
              placeholder="调整款单号/客户名称"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keyup.enter.native="queryFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="gray_font marignLeft8">时间筛选</span>
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
            <span class="gray_font marignLeft8">单据状态</span>
            <el-select v-model="auditStatue" placeholder="请选择" size="small">
              <el-option
                v-for="item in auditStatueData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="creatAdjust">新增调整</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="adjustData"
        stripe
        height="700"
        @row-dblclick="editGold"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="adjustCode" label="调整款单号" width="150"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="150"></el-table-column>
        <el-table-column prop="adjustMoney" label="调整金额(￥)"></el-table-column>
        <el-table-column prop="note" label="调整备注"></el-table-column>
        <el-table-column prop="createTime" label="记录时间"></el-table-column>
        <el-table-column prop="creatorName" label="操作人"></el-table-column>
        <el-table-column prop label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.hc == '0'" style="color:#8A9199">红冲</span>
            <span v-if="scope.row.hc == '1'" style="color:#8A9199">--</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="printCount" label="打印"></el-table-column> -->
        <el-table-column prop label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustCode.slice(0, 2) !== 'HC'">
              <span v-if="scope.row.auditStatue == '1'" style="color:#F26D0F">待审核</span>
              <span v-else-if="scope.row.auditStatue == '2'" style="color:#222426">已审核</span>
              <span v-else-if="scope.row.auditStatue == '3'" style="color:#F20F34">已驳回</span>
              <span v-else-if="scope.row.auditStatue == '4'" style="color:#F20F34">已作废</span>
              <span v-else-if="scope.row.auditStatue == '5'" style="color:#F20F34">再次驳回</span>
              <span v-else style="color:#8A9199">--</span>
            </span>
            <span v-else style="color:#8A9199">--</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <div
              v-if="(scope.row.auditStatue == '2' || scope.row.auditStatue == '5') && scope.row.hc == '1'"
            >
              <!-- <span style="color:#F20F34;cursor:pointer;" @click="printFun(scope.row)">打印</span> -->
              <span style="color:#F20F34;cursor:pointer;" @click="hcFun(scope.row)">红冲</span>
            </div>
            <div v-else-if="scope.row.auditStatue == '3' && scope.row.hc == '1'">
              <span style="color:#F2930F;cursor:pointer;" @click="toVoidFun(scope.row)">作废</span>
              <span style="color:#F20F34;cursor:pointer;" @click="editFun(scope.row)">编辑</span>
            </div>
            <div v-else>--</div>
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
    <!-- 新增调整款 -->
    <el-dialog title="新增调整款" :visible.sync="newAdjust" width="560px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>

        <div class="once">
          <div class="onceTitle">客户名称</div>
          <div class="onceInput">
            <el-select
              v-model="adjust.customerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户"
              :remote-method="remoteMethod"
              @keydown.native="customeSelect($event)"
              @change="changCustomer"
              :loading="searchLoading"
              size="small"
              style="width:320px"
            >
              <el-option
                v-for="item in customerData"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="once">
          <div class="onceTitle">调整金额</div>
          <div class="onceInput">
            <el-input
              v-model="adjust.adjustMoney"
              placeholder="请填写调整金额"
              size="small"
              @blur="adjustMoneyCheck"
            ></el-input>
          </div>
        </div>
        <div class="once">
          <div class="onceTitle">备注</div>
          <div class="onceInput">
            <el-input v-model="adjust.note" placeholder="请填写备注信息" size="small"></el-input>
          </div>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun" size="small">取 消</el-button>
        <el-button type="primary" @click="newAdjustFun" size="small" :loading="comfirmBtnLoading">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑调整款 -->
    <el-dialog title="编辑调整款" :visible.sync="editAdjust" width="560px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>

        <div class="once">
          <div class="onceTitle">客户名称</div>
          <div class="onceInput">
            <el-select
              v-model="editAdjustData.customerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户"
              :remote-method="remoteMethod"
              @keydown.native="customeSelectEdit($event)"
              @change="editChangCustomer"
              :loading="searchLoading"
              size="small"
              style="width:320px"
            >
              <el-option
                v-for="item in customerData"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="once">
          <div class="onceTitle">调整金额</div>
          <div class="onceInput">
            <el-input
              v-model="editAdjustData.adjustMoney"
              placeholder="请填写调整金额"
              size="small"
              @blur="editAdjustMoney"
            ></el-input>
          </div>
        </div>
        <div class="once">
          <div class="onceTitle">备注</div>
          <div class="onceInput">
            <el-input v-model="editAdjustData.note" placeholder="请填写备注信息" size="small"></el-input>
          </div>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancelFun" size="small">取 消</el-button>
        <el-button type="primary" @click="editAdjustFun" size="small" :loading="editBtnLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customerData: [], //客户数据
      loading: false,
      searchLoading: false,
      comfirmBtnLoading: false,
      editBtnLoading: false,
      auditStatueData: [
        //单据状态数据
        {
          label: "全部",
          value: ""
        },
        {
          label: "待审核",
          value: 1
        },
        {
          label: "已审核",
          value: 2
        },
        {
          label: "已驳回",
          value: 3
        },
        {
          label: "已作废",
          value: 4
        }
      ],
      search: "", //搜索
      auditStatue: "", //审核状态
      startTime: "",
      endTime: "",
      adjust: {
        //新增调整款数据
        customerId: "",
        customerName: "",
        adjustMoney: "",
        note: ""
      },
      editAdjustData: {
        //编辑调整款数据
        id: "",
        customerId: "",
        customerName: "",
        adjustMoney: "",
        note: ""
      },
      customerList: [], //客户数据
      input: "", //模拟
      newAdjust: false, //新增调整款
      editAdjust: false, //编辑调整款
      adjustData: [],
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData();
    this.customerListFun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.adjustMoney;
      if (dom != undefined && altKey && keyCode === 78) {
        self.creatAdjust();
      }

      if (this.newAdjust == true && altKey && keyCode === 83) {
        self.newAdjustFun();
      }
    };
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          auditStatue: self.auditStatue,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/adjustList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.adjustData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.adjustData.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 编辑提纯单
    editGold(elem) {
      //
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageNum = 1; //默认第一页
      this.pageSize = val; //每页显示条目个数
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val; //默认第一页
      this.displayAllData();
    },
    //查询
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.displayAllData();
    },
    // 重置
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.auditStatue = this.selectedDay =
        "";
      this.queryFun();
    },
    //新增调整款
    creatAdjust() {
      this.newAdjust = true;
      this.adjust = {
        customerId: "",
        customerName: "",
        adjustMoney: "",
        note: ""
      };
    },
    //调整款查询客户
    customerListFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/saveOweCustomerList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //选择客户
    changCustomer(val) {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == val) {
          self.adjust.customerName = item.companyName;
        }
      });
    },
    //选择客户
    // changCustomer() {
    //   let self = this;
    //   this.customerList.forEach(item => {
    //     if (item.customerId == self.adjust.customerId) {
    //       self.adjust.customerName = item.customerName;
    //     }
    //   });
    // },
    //创建调整款
    newAdjustFun() {
      let self = this;
      let params = { adjust: JSON.stringify(self.adjust) };
      if (this.adjust.customerId == "") {
        self.$message.warning("请选择客户名称！");
        return;
      }
      if (this.adjust.adjustMoney != undefined) {
        this.adjust.adjustMoney = this.adjust.adjustMoney.trim();
      }

      if (this.adjust.adjustMoney == "") {
        self.$message.warning("请填写调整款金额！");
        return;
      }
      if (this.adjust.note != undefined) {
        this.adjust.note = this.adjust.note.trim();
      }

      this.comfirmBtnLoading = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/insertAdjust",
        params,
        res => {
          self.$message.success(res.msg);
          self.newAdjust = false;
          self.comfirmBtnLoading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.comfirmBtnLoading = false;
        }
      );
    },
    //打印
    printFun(elem) {
      let self = this;
      let params = {
        PRS: {
          adjustId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/printAdjust", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //红冲
    hcFun(elem) {
      let self = this;
      let params = {
        PRS: {
          adjustId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/HCAdjust", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //编辑
    editFun(elem) {
      this.editAdjust = true;
      this.customerData = [
        {
          companyId: elem.customerId,
          companyName: elem.customerName
        }
      ];
      this.editAdjustData = {
        id: elem.id,
        customerId: elem.customerId,
        customerName: elem.customerName,
        adjustMoney: elem.adjustMoney,
        note: elem.note
      };
    },
    //提交编辑数据
    editAdjustFun() {
      let self = this;
      if (this.editAdjustData.customerId == "") {
        self.$message.warning("请选择客户名称！");
        return;
      }
      console.log(this.editAdjustData);
      if (this.editAdjustData.adjustMoney != undefined) {
        this.editAdjustData.adjustMoney = String(
          this.editAdjustData.adjustMoney
        ).trim();
      }

      if (this.editAdjustData.adjustMoney == "") {
        self.$message.warning("请填写调整款金额！");
        return;
      }
      if (this.editAdjustData.note != undefined) {
        this.editAdjustData.note = String(this.editAdjustData.note).trim();
      }

      let params = { adjust: JSON.stringify(self.editAdjustData) };

      this.editBtnLoading = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/updateAdjust",
        params,
        res => {
          self.$message.success(res.msg);
          self.editAdjust = false;
          self.editBtnLoading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.editBtnLoading = false;
        }
      );
    },
    //编辑选择客户
    editChangCustomer() {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == self.editAdjustData.customerId) {
          self.editAdjustData.customerName = item.companyName;
        }
      });
    },
    //作废
    toVoidFun(elem) {
      let self = this;
      this.$confirm("确定要作废这条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            PRS: {
              adjustId: elem.id
            }
          };
          this.$axios
            .get(this.$portMain + "/stock/invalidAdjust", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success(res.data.msg);
                self.displayAllData();
              } else {
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
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
    // 客户删除(编辑)
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.adjust.customerId = "";
        this.customerData = [];
      }
    },
    //
    customeSelectEdit(e) {
      if (e.keyCode == 8) {
        this.editAdjustData.customerId = "";
        this.customerData = [];
      }
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchLoading = true;
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
              self.searchLoading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },
    //取消新增
    cancelFun() {
      this.newAdjust = false;
      this.customerData = [];
    },
    //取消编辑
    editCancelFun() {
      this.editAdjust = false;
      this.customerData = [];
    },
    //新增调整金额校验
    adjustMoneyCheck() {
      if (this.adjust.adjustMoney != undefined) {
        this.adjust.adjustMoney = this.adjust.adjustMoney.trim();
      }

      let result = isNaN(this.adjust.adjustMoney);
      let result2 = Number(this.adjust.adjustMoney) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数字");
        this.adjust.adjustMoney = "";
      }
    },
    //编辑调整金额校验
    editAdjustMoney() {
      if (this.editAdjustData.adjustMoney != undefined) {
        this.editAdjustData.adjustMoney = this.editAdjustData.adjustMoney.trim();
      }

      let result = isNaN(this.editAdjustData.adjustMoney);
      let result2 = Number(this.editAdjustData.adjustMoney) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数字");
        this.editAdjustData.adjustMoney = "";
      }
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
    font-size: 12px;
  }

  .marignLeft8 {
    margin-left: 24px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
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

  .draftColor {
    color: #F2B90F;
  }

  .cancelColor {
    color: #8A9199;
  }

  .promptStyle {
    position: relative;

    .line {
      width: 560px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .once {
      display: flex;
      align-items: center;
      margin-bottom: 32px;

      .onceTitle {
        color: #8A9199;
        font-size: 14px;
        width: 56px;
        text-align: right;
      }

      .onceInput {
        width: 320px;
        margin-left: 16px;
      }
    }
  }
}
</style>
