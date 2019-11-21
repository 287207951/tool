<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>认款</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="来款客户/来款账户/认款单号"
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
          <span class="fontStyle">支付方式</span>
          <el-select v-model="account_type" placeholder="请选择" size="small">
            <el-option
              v-for="item in accountTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">收款银行</span>
          <el-select v-model="receive_account" placeholder="请选择" size="small">
            <el-option v-for="item in fandBankfanceData" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">认款状态</span>
          <el-select v-model="account_state" placeholder="请选择" size="small">
            <el-option
              v-for="item in accountStateData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <span class="titleFont">是否红冲</span>
          <el-select v-model="HC" placeholder="请选择" size="small">
            <el-option v-for="item in HCData" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
        <!-- <el-col :span="12" class="totalDes">
          <span>总计：待认总金额￥{{priceNum}}</span>
        </el-col>-->
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <!-- <el-table-column prop="order_code" label="系统单号"></el-table-column> -->
        <el-table-column prop="account_partner" label="来款客户"></el-table-column>
        <el-table-column prop="payment_account" label="来款账户"></el-table-column>
        <el-table-column prop="payment_money" label="来款金额(￥)">
          <template slot-scope="scope">
            <span>{{$api.returnFloat(scope.row.payment_money)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.account_type == '1'">现金</span>
            <span v-if="scope.row.account_type == '2'">转账</span>
            <span v-if="scope.row.account_type == '3'">支付宝</span>
            <span v-if="scope.row.account_type == '4'">微信</span>
            <span v-if="scope.row.account_type == '5'">调整款</span>
            <span v-if="scope.row.account_type == '6'">刷卡</span>
          </template>
        </el-table-column>
        <el-table-column prop="receive_account" label="收款银行"></el-table-column>
        <el-table-column label="认款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.account_state == '0'">- -</span>
            <span v-if="scope.row.account_state == '1'" class="yellowColor">待认款</span>
            <span v-if="scope.row.account_state == '2'" class="blackColor">已认款</span>
            <span v-if="scope.row.account_state == '3'" class="yellowColor">待确定</span>
            <span v-if="scope.row.account_state == '4'" class="blackColor">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="confirm_uid_name" label="认款人"></el-table-column>
        <el-table-column prop="confirm_code" label="认款单号"></el-table-column>
        <el-table-column prop="pay_time" label="到账时间"></el-table-column>
        <el-table-column prop="note" label="来款备注"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column prop="order_uid_name" label="记录人"></el-table-column>
        <el-table-column prop label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.HC == '0'" class="fontColor2">未红冲</span>
            <span v-if="scope.row.HC == '1'" class="fontColor2">已红冲</span>
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
    <!--认款单详情 -->
    <el-dialog
      title="认款"
      @close="cancelFun"
      :visible.sync="moneyDetailType"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="detailStyle">
        <div class="line"></div>

        <div
          class="upLoadWrap"
          v-if="detailData.account_state == 1 || detailData.account_state == 4"
        >
          <div class="bgImg" v-show="ImgUrl == ''">上传认款凭证</div>
          <img :src="ImgUrl" v-show="ImgUrl != ''" alt style="width:100px; height:75px" />
          <input type="file" class="upLoadLogo" accept="image/*" ref="pic" @input="loadImg" />
        </div>

        <div v-else style="margin-left: 20px;margin-bottom: 24px;">
          <img :src="$portImg + customerImg" style="width:100px; height:75px" />
        </div>

        <!-- 可以搜索的下拉框 -->
        <el-row
          class="itemBottom"
          v-if="detailData.account_state == 1 || detailData.account_state == 4"
        >
          <el-col :span="21" style="padding-left:20px">
            来款客户：
            <el-select
              v-model="account_partner_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="searchLoading"
              @keydown.native="customeSelect($event)"
              @change="changCustomer"
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
            <span class="redTxt">*</span>
          </el-col>
        </el-row>
        <el-row class="itemBottom" v-else>
          <el-col :span="3" class="titleStyle">来款客户</el-col>
          <el-col :span="21">
            <span>{{customerName}}</span>
          </el-col>
        </el-row>

        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">支付方式</el-col>
          <el-col :span="9" class="contentStyle" v-if="detailData.account_type == 1">现金</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 2">转账</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 3">支付宝</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 4">微信</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 5">调整款</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 6">刷卡</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">来款性质</el-col>
          <el-col :span="9" class="contentStyle" v-if="detailData.pay_type == 1">公对公</el-col>
          <el-col :span="9" class="contentStyle" v-else-if="detailData.pay_type == 2">私对公</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">来款金额</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.payment_money != '' && detailData.payment_money != undefined"
          >￥{{detailData.payment_money}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">到账时间</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.pay_time != '' && detailData.pay_time != undefined"
          >{{detailData.pay_time}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">来款银行</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.account_bank != '' && detailData.account_bank != undefined"
          >{{detailData.account_bank}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">收款银行</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.receive_account != '' && detailData.receive_account != undefined"
          >{{detailData.receive_account}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">来款账号</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.payment_account != '' && detailData.payment_account != undefined"
          >{{detailData.payment_account}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">备注信息</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.note != '' && detailData.note != undefined"
          >{{detailData.note}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span
        slot="footer"
        class="dialog-footer"
        v-show="detailData.account_state == 1 || detailData.account_state == 4"
      >
        <el-button size="small" type="primary" plain @click="cancelFun">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small" :loading="btnLoadingType">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      searchLoading: false,
      btnLoadingType: false,
      customerName: "", //客户名称(已认款完显示)
      customerImg: "", //上传图片(已认款完显示)
      ImgUrl: "", //上传认款凭证（显示）
      submitImgUrl: "", //上传认款凭证（提交）
      fandBankfanceData: [], //银行数据
      account_partner_id: "", //来款客户id
      account_partner: "", //来款客户名称
      customerData: [], //来料客户数据
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      HC: "", //红冲
      receive_account: "全部", //收款银行
      account_type: "", //支付方式
      account_state: "", //认款状态
      detailData: {}, //详情数据
      HCData: [
        {
          id: "",
          label: "全部"
        },
        {
          //红冲数据
          id: 0,
          label: "未红冲"
        },
        {
          id: 1,
          label: "红冲"
        }
      ],
      payTypeData: [
        {
          //来款性质
          id: 1,
          label: "公对公"
        },
        {
          id: 2,
          label: "私对公"
        }
      ],
      accountStateData: [
        {
          id: "",
          label: "全部"
        },
        {
          // 认款状态数据
          id: 1,
          label: "待认款"
        },
        {
          id: 2,
          label: "已认款 "
        },
        {
          id: 3,
          label: "待确定 "
        }
        // {
        //   id: 4,
        //   label: "作废"
        // }
      ],
      accountTypeData: [
        {
          id: "",
          label: "全部"
        },
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
        },
        {
          id: 6,
          label: "刷卡"
        }
      ],
      moneyDetailType: false, // 认款单详情
      value: "", //模拟
      options: [], //模拟
      allData: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      loading: false,
      priceNum: 0
    };
  },
  created() {
    this.created_fun();
    this.fandBankfance();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let brank = "";
      if (self.receive_account == "全部") {
        brank = "";
      } else {
        brank = self.receive_account;
      }
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          HC: self.HC,
          account_type: self.account_type,
          account_state: self.account_state,
          company_bank: brank,
          simple: "simple",
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/comeAccountSalesManlist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.priceNum = res.data.data.totalMoney;
            self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach((item, index) => {
              item.pay_time != ""
                ? (item.pay_time = self.$api.dateGetDayTime(item.pay_time))
                : "";
              item.create_time != ""
                ? (item.create_time = self.$api.dateGetDayTime(
                    item.create_time
                  ))
                : "";
              item.account_partner = "";
              if (item.comeAccountOrderLines.length != 0) {
                item.account_partner =
                  item.comeAccountOrderLines[0].account_partner;
              }
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
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
        if (column.label === "来款金额(￥)") {
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
    // 编辑单
    editGold(elem) {
      let self = this;
      this.moneyDetailType = true;
      self.detailData = elem;
      // this.customerData = [];
      // self.account_partner_id = '';
      // self.bakCustomerData(self.detailData);
      self.account_partner_id = self.detailData.account_partner_id;
      if (this.detailData.comeAccountOrderLines.length != 0) {
        this.customerName = this.detailData.comeAccountOrderLines[0].account_partner;
        this.customerImg = this.detailData.comeAccountOrderLines[0].proof_url;
      }
    },
    // 编辑上传系列图片
    loadImg() {
      let self = this;
      let file = this.$refs.pic.files[0];
      let url = this.$portMain + "/common/uploadImg";
      let size = file.size / 1024;
      if (size > 2000) {
        self.$message.error("您上传的图片大小不能大于2M");
        return;
      }
      let params = {
        file: file,
        uploadType: "3"
      };
      this.$api.formdataPostFun(
        url,
        params,
        res => {
          self.submitImgUrl = res.data;
          let imgUrl = self.getObjectURL(file);
          self.ImgUrl = imgUrl;
          self.$refs.pic.value = "";
        },
        err => {
          self.$message.error("上传失败");
        }
      );
    },
    //建立一個可存取到该file的url
    getObjectURL(file) {
      var url = null;
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    //来款客户数据回填
    bakCustomerData(item) {
      this.customerData.push({
        company_id: item.account_partner_id,
        company_name: item.account_partner
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
    // 选择日期
    selectDate(item) {
      //
    },
    // 确定认款
    confirm() {
      let self = this;
      // let account_partner = "";
      // this.customerData.forEach(item => {
      //   if (self.account_partner_id == item.company_id) {
      //     account_partner = item.company_name;
      //   }
      // });
      if (!self.account_partner_id) {
        self.$message.error("来款客户不能为空，请重新输入！");
        return false;
      }
      let params = {
        confirm_code: self.detailData.confirm_code,
        proof_url: self.submitImgUrl,
        account_partner_id: self.account_partner_id,
        account_partner: self.account_partner
      };
      this.btnLoadingType = true;
      this.$axios
        .post(this.$portMain + "/stock/editComeAccountOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.moneyDetailType = false;
              self.btnLoadingType = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnLoadingType = false;
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
    // 充值
    resetQueryFun() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.account_type = "";
      this.receive_account = "全部";
      this.account_state = "";
      this.HC = "";
      this.selectedDay = "";
      this.queryFun();
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
        //client/clientListSimple
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
    //选择客户
    changCustomer(val) {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == val) {
          self.account_partner = item.companyName;
        }
      });
    },
    //收款银行
    fandBankfance() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/fandBankfance")
        .then(function(res) {
          if (res.data.code == 200) {
            self.fandBankfanceData = res.data.data;
            self.fandBankfanceData.unshift("全部");
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //取消
    cancelFun() {
      this.moneyDetailType = false;
      this.submitImgUrl = "";
      this.ImgUrl = "";
      this.customerData = [];
      this.account_partner_id = "";
      this.account_partner = "";
    },
    // 来料客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.account_partner_id = "";
        this.account_partner = "";
        this.customerData = [];
      }
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
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
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

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }

  .upLoadWrap {
    margin-left: 20px;
    margin-bottom: 24px;
    position: relative;

    .bgImg {
      width: 100px;
      height: 75px;
      // border: 1px solid red;
      background: url('../../../static/images/img-upload.png') no-repeat center center;
      background-size: 100px 75px;
      color: #E60E32;
      font-size: 12px;
      text-align: center;
      line-height: 104px;
      cursor: pointer;
    }

    .upLoadLogo {
      width: 100px;
      height: 75px;
      // border: 1px solid green;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .redTxt {
    color: #F20F34;
  }
}
</style>
