<template>
  <div class="conBigDiv" ref="refundRegister" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>出纳</el-breadcrumb-item>
      <el-breadcrumb-item>退款登记</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="系统单号/客户名称/转入账户"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">到账时间</span>
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
          <!-- <span class="fontStyle">单据状态</span>
            <el-select v-model="bills_statue" placeholder="请选择" size="small">
              <el-option
                v-for="item in billsStatueData"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
          </el-select>-->
          <span class="fontStyle">退款银行</span>
          <el-select v-model="payment_account_bank" placeholder="请选择" size="small">
            <el-option
              v-for="item in PageFandBankfanceData"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span class="fontStyle">支付方式</span>
          <el-select v-model="account_type" placeholder="请选择" size="small">
            <el-option
              v-for="item in pageAccountTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">是否红冲</span>
          <el-select v-model="HC" placeholder="请选择" size="small">
            <el-option v-for="item in HCData" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="createdFun" v-if="addAllotTF">新增</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="order_code" label="系统单号"></el-table-column>
        <el-table-column prop="account_partner" label="客户名称"></el-table-column>
        <el-table-column prop="payment_account" label="转入账户" width="180"></el-table-column>
        <el-table-column prop="payment_money" label="转入金额(￥)">
          <template slot-scope="scope">
            <span>{{$api.returnFloat(scope.row.payment_money)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.account_type == '1'">现金</span>
            <span v-if="scope.row.account_type == '2'">转账</span>
            <span v-if="scope.row.account_type == '3'">支付宝</span>
            <span v-if="scope.row.account_type == '4'">微信</span>
            <span v-if="scope.row.account_type == '5'">调整款</span>
          </template>
        </el-table-column>
        <el-table-column prop="payment_account_bank" label="退款银行"></el-table-column>
        <el-table-column prop="confirm_uid_name" label="申请人"></el-table-column>
        <el-table-column prop="pay_time" label="退款时间" width="180"></el-table-column>
        <el-table-column prop="note" label="退款备注"></el-table-column>
        <el-table-column prop="update_time" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="order_uid_name" label="记录人"></el-table-column>
        <el-table-column label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.HC == '0'" class="fontColor2">- -</span>
            <span v-if="scope.row.HC == '1'" class="fontColor2">红冲</span>
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
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 新建退款单 -->
    <el-dialog
      title="新建退款单"
      :visible.sync="createdRefundType"
      width="840px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左 -->
          <el-col :span="12" class="fontTStyle">
            <div class="marginBottom">
              <span>支付类型</span>
              <el-select
                v-model="refundsData.account_type"
                placeholder="请选择"
                size="small"
                class="inputWidth280"
                @change="selectAccount"
              >
                <el-option
                  v-for="item in accountTypeData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom">
              <span>客户名称</span>
              <!-- 搜索下拉框 -->
              <!-- <el-input v-model="refundsData.account_partner_id"  size="small" class="inputWidth280" placeholder="请填写收款账户名称"></el-input> -->
              <el-select
                v-model="refundsData.account_partner_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户名称"
                :remote-method="remoteMethod"
                @keydown.native="customeSelect($event)"
                :loading="searchLoading"
                size="small"
                class="inputWidth280"
              >
                <el-option
                  v-for="item in customerData"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom" v-show="refundsData.account_type == 2">
              <span>转入银行</span>
              <el-input
                v-model="refundsData.receive_account_bank"
                size="small"
                class="inputWidth280"
                placeholder="请填写银行名称"
              ></el-input>
              <span class="redColor">*</span>
            </div>
            <div
              class="marginBottom"
              v-show="refundsData.account_type == 2 || refundsData.account_type == 3 || refundsData.account_type == 4"
            >
              <span>转入账号</span>
              <el-input
                v-model="refundsData.payment_account"
                size="small"
                class="inputWidth280"
                placeholder="请填写账号"
              ></el-input>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom" v-show="refundsData.account_type == 2">
              <span>退款性质</span>
              <el-select
                v-model="refundsData.pay_type"
                placeholder="请选择"
                size="small"
                class="inputWidth280"
                disabled
              >
                <el-option
                  v-for="item in payTypeData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>

            <div class="marginBottom" v-show="refundsData.account_type != 2">
              <span style="margin-left: 29PX;">备注</span>
              <el-input
                v-model="refundsData.note"
                size="small"
                class="inputWidth280"
                placeholder="请填写备注信息"
              ></el-input>
            </div>
          </el-col>

          <!-- 右 -->
          <el-col :span="12" class="itemRight fontTStyle">
            <div class="marginBottom">
              <span>申请人</span>
              <el-input
                v-model="refundsData.confirm_uid_name"
                size="small"
                class="inputWidth280"
                placeholder="请填写收款账户名称"
              ></el-input>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom">
              <span>退款金额</span>
              <el-input
                v-model="refundsData.payment_money"
                size="small"
                class="inputWidth280"
                placeholder="请填写退款金额"
                @blur="moneyCheck"
              ></el-input>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom" v-show="refundsData.account_type == 2">
              <span>退款银行</span>
              <!-- <el-input v-model="refundsData.payment_account_bank"  size="small" class="inputWidth280" placeholder="请填写收款账户名称"></el-input> -->
              <el-select
                v-model="refundsData.payment_account_bank"
                placeholder="请选择"
                size="small"
                class="inputWidth280"
              >
                <el-option
                  v-for="item in fandBankfanceData"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom paddingRigth">
              <span class>支付时间</span>
              <el-date-picker
                v-model="refundsData.pay_time"
                type="datetime"
                placeholder="选择日期时间"
                size="small"
                class="inputWidth280"
                value-format=" yyyy-MM-dd HH:mm:ss"
                :picker-options="$publicData.pickerOptions1"
              ></el-date-picker>
            </div>
            <div class="marginBottom paddingRigth" v-show="refundsData.account_type == 2">
              <span>备注</span>
              <el-input
                v-model="refundsData.note"
                size="small"
                class="inputWidth280"
                placeholder="请填写备注信息"
              ></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdRefundType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmFun" size="small" :loading="loadingTF">确定</el-button>
      </span>
    </el-dialog>
    <!-- 退款单详情 -->
    <el-dialog
      title="退款单详情"
      :visible.sync="moneyDetailType"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="detailStyle">
        <div class="line"></div>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">系统单号</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.order_code != '' && detailData.order_code != undefined"
          >{{detailData.order_code}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">来款账号</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.payment_account != '' && detailData.payment_account != undefined"
          >{{detailData.payment_account}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">退款客户</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.account_partner != '' && detailData.account_partner != undefined"
          >{{detailData.account_partner}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">来款性质</el-col>
          <el-col :span="9" class="contentStyle" v-if="detailData.pay_type == 1">公对公</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.pay_type == 2">私对公</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">支付方式</el-col>
          <el-col :span="9" class="contentStyle" v-if="detailData.account_type == 1">现金</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 2">转账</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 3">支付宝</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 4">微信</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 5">调整款</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">申请人</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.confirm_uid_name != '' && detailData.confirm_uid_name != undefined"
          >{{detailData.confirm_uid_name}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">退款金额</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.payment_money != '' && detailData.payment_money != undefined"
          >{{detailData.payment_money}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">支付时间</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.pay_time != '' && detailData.pay_time != undefined"
          >{{detailData.pay_time}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>

        <el-row class="itemBottom">
          <span v-if="detailData.account_type == '2'">
            <el-col :span="3" class="titleStyle">转入银行</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.receive_account_bank != '' && detailData.receive_account_bank != undefined"
            >{{detailData.receive_account_bank}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </span>

          <span>
            <el-col :span="3" class="titleStyle">备注信息</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.note != '' && detailData.note != undefined"
            >{{detailData.note}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </span>
        </el-row>
        <el-row class="itemBottom">
          <span v-if="detailData.account_type == '2'">
            <el-col :span="3" class="titleStyle">退款银行</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.payment_account_bank != '' && detailData.payment_account_bank != undefined"
            >{{detailData.payment_account_bank}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </span>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer" v-show="detailData.HC == 0 && showHC != 'HC'">
        <el-button @click="moneyDetailType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="redflushFun" size="small">红冲</el-button>
      </span>
    </el-dialog>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea
              name
              id
              style="width:433px; height:120px;resize:none"
              placeholder="请输入红冲的原因"
              v-model="HCnote"
            ></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="ConfirmRedflush" size="small" :loading="btnHCloading">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      showHC: "", //order_code状态是显示红冲
      loading: false,
      searchLoading: false,
      btnHCloading: false,
      customerData: [], //客户数据
      fandBankfanceData: [], //银行数据
      PageFandBankfanceData: [], //页面银行数据
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      account_type: "", //支付方式
      bills_statue: "", //单据状态
      HCnote: "", //红冲原因
      HC: "", //红冲
      loadingTF: false, //按钮加载中
      payment_account_bank: "全部", //退款银行
      HCData: [
        {
          //红冲数据
          id: "",
          label: "全部"
        },
        {
          id: 0,
          label: "否"
        },
        {
          id: 1,
          label: "是"
        }
      ],
      payTypeData: [
        {
          //退款性质
          id: 1,
          label: "公对公"
        },
        {
          id: 2,
          label: "私对公"
        }
      ],
      pageAccountTypeData: [
        {
          //页面支付类型数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "现金 "
        },
        {
          id: 2,
          label: "转账 "
        },
        {
          id: 3,
          label: "支付宝 "
        },
        {
          id: 4,
          label: "微信 "
        },
        {
          id: 5,
          label: "调整款 "
        }
      ],
      accountTypeData: [
        {
          //支付类型数据
          id: 1,
          label: "现金 "
        },
        {
          id: 2,
          label: "转账 "
        },
        {
          id: 3,
          label: "支付宝 "
        },
        {
          id: 4,
          label: "微信 "
        },
        {
          id: 5,
          label: "调整款 "
        }
      ],
      billsStatueData: [
        {
          // 单据状态数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "待审核"
        },
        {
          id: 2,
          label: "审核通过"
        },
        {
          id: 3,
          label: "审核驳回"
        }
      ],
      detailData: {}, //退款详情数据
      refundsData: {
        //新增退款数据
        account_type: 2,
        account_partner_id: "",
        receive_account_bank: "",
        payment_account: "",
        note: "",
        confirm_uid_name: "",
        payment_money: "",
        payment_account_bank: "",
        pay_time: "",
        pay_type: 1,
        account_partner: ""
      },
      promptType: false, // 提示状态
      moneyDetailType: false, // 来款单详情
      createdRefundType: false, // 新建退款状态
      value: "", //模拟
      options: [], //模拟
      allData: [], //退款列表数据
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      loading: false,
      addAllotTF: false //新增调拨按钮显示权限
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.refundRegister;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.createdRefundType == true && altKey && keyCode === 83) {
        self.confirmFun();
      }
    };
    this.addAllotTF = this.$api.setPowerSpotThree(
      sessionStorage.verify,
      "return-account-update"
    );
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
      this.fandBankfance();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let brank = "";
      if (self.payment_account_bank == "全部") {
        brank = "";
      } else {
        brank = self.payment_account_bank;
      }
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          account_type: self.account_type,
          // bills_statue: self.bills_statue,
          company_bank: brank,
          HC: self.HC,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/ReturnAccountlist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach((item, index) => {
              item.pay_time = self.$api.dateGetDayTime(item.pay_time);
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      let self = this;
      this.moneyDetailType = true;
      this.showHC = "";
      let params = {
        PRS: {
          orderId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/ReturnAccountform", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.detailData = res.data.data;
            self.detailData.pay_time = self.$api.dateGetDayTime(
              self.detailData.pay_time
            );
            self.showHC = self.detailData.order_code.slice(0, 2);
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
    // 新增
    createdFun() {
      this.createdRefundType = true;
      this.refundsData.account_type = 2;
      this.refundsData.account_partner_id = "";
      this.refundsData.account_partner = "";
      this.refundsData.receive_account_bank = "";
      this.refundsData.payment_account = "";
      this.refundsData.pay_type = 1;
      this.refundsData.confirm_uid_name = "";
      this.refundsData.payment_money = "";
      this.refundsData.payment_account_bank = "";
      this.refundsData.pay_time = "";
      this.refundsData.note = "";
      //this.refundsData = {};
      this.customerData = [];
    },
    // 选择支付类型
    selectAccount() {
      this.refundsData.account_partner_id = "";
      this.refundsData.account_partner = "";
      this.refundsData.receive_account_bank = "";
      this.refundsData.payment_account = "";
      this.refundsData.pay_type = 1;
      this.refundsData.confirm_uid_name = "";
      this.refundsData.payment_money = "";
      this.refundsData.payment_account_bank = "";
      this.refundsData.pay_time = "";
      this.refundsData.note = "";
    },
    // 新增确定
    confirmFun() {
      let self = this;
      //  this.refundsData.account_partner = '衢州市周福生珠宝有限公司';
      //  this.refundsData.account_partner_id = '96511';
      if (this.refundsData.account_partner_id == "") {
        self.$message.error("请填写客户名称！");
        return;
      }
      if (this.refundsData.confirm_uid_name != undefined) {
        this.refundsData.confirm_uid_name = this.refundsData.confirm_uid_name.trim();
      }
      if (this.refundsData.confirm_uid_name == "") {
        self.$message.error("请填写申请人！");
        return;
      }
      if (this.refundsData.payment_money != undefined) {
        this.refundsData.payment_money = this.refundsData.payment_money.trim();
      }

      if (this.refundsData.payment_money == "") {
        self.$message.error("请填写退款金额！");
        return;
      }
      if (this.refundsData.account_type == 2) {
        if (this.refundsData.receive_account_bank != undefined) {
          this.refundsData.receive_account_bank = this.refundsData.receive_account_bank.trim();
        }

        if (this.refundsData.receive_account_bank == "") {
          self.$message.error("请填写转入银行！");
          return;
        }
        if (this.refundsData.payment_account != undefined) {
          this.refundsData.payment_account = this.refundsData.payment_account.trim();
        }

        if (this.refundsData.payment_account == "") {
          self.$message.error("请填写转入账号！");
          return;
        }
        if (this.refundsData.payment_account_bank == "") {
          self.$message.error("请填写退款银行！");
          return;
        }
      }

      if (
        this.refundsData.account_type == 3 ||
        this.refundsData.account_type == 4
      ) {
        if (this.refundsData.payment_account != undefined) {
          this.refundsData.payment_account = this.refundsData.payment_account.trim();
        }

        if (this.refundsData.payment_account == "") {
          self.$message.error("请填写转入账号！");
          return;
        }
      }

      this.customerData.forEach(item => {
        if (self.refundsData.account_partner_id == item.companyId) {
          self.refundsData.account_partner = item.companyName;
        }
      });
      if (this.refundsData.note != undefined) {
        this.refundsData.note = this.refundsData.note.trim();
      }

      this.loadingTF = true;
      this.$axios
        .post(this.$portMain + "/stock/createReturnAccount", self.refundsData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdRefundType = false;
              self.loadingTF = false;
              self.created_fun();
            }, 2000);
          } else {
            self.loadingTF = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    //红冲
    redflushFun() {
      this.promptType = true;
      this.btnHCloading = false;
      this.HCnote = "";
    },
    // 红冲
    ConfirmRedflush() {
      let self = this;
      let params = {
        PRS: {
          ReturnAccountId: self.detailData.id,
          HCnote: self.HCnote
        }
      };
      this.btnHCloading = true;
      this.$axios
        .get(this.$portMain + "/stock/HCReturnAccountOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.moneyDetailType = false;
              self.promptType = false;
              self.btnHCloading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnHCloading = false;
          }
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
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.account_type = this.selectedDay = this.HC =
        "";
      this.payment_account_bank = "全部";
      this.queryFun();
    },
    //收款银行
    fandBankfance() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/fandBankfance")
        .then(function(res) {
          if (res.data.code == 200) {
            self.fandBankfanceData = res.data.data;
            self.PageFandBankfanceData = [...res.data.data];
            self.PageFandBankfanceData.unshift("全部");
            //self.fandBankfanceData.unshift('全部')
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 来料客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.refundsData.account_partner_id = "";
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
        this.$axios
          .get(this.$portMain + "/client/rawClientSimple", params)
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
    //退款金额校验
    moneyCheck() {
      if (this.refundsData.payment_money != undefined) {
        this.refundsData.payment_money = this.refundsData.payment_money.trim();
      }

      let result = isNaN(this.refundsData.payment_money);
      let result2 = Number(this.refundsData.payment_money) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数字");
        this.refundsData.payment_money = "";
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .redColor {
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

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 840px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth280 {
      width: 280px;
    }

    .itemRight {
      text-align: right;
    }

    .marginBottom {
      margin-bottom: 32px;
    }

    .paddingRigth {
      margin-right: 14px;
    }

    .fontTStyle {
      font-size: 14px;
      color: #8A9199;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 840px;
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
  }
}
</style>
