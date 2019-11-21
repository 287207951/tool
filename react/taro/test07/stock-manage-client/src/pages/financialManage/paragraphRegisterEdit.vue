<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>来款登记</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <el-row>
             <el-col :span="16" class="leftHeight">
                <el-button type="danger" size="small" plain @click="save()" v-show="order_state == '-1' || order_state == '1'">保存</el-button>
                <el-button type="danger" size="small" plain @click="aplication()" v-if="order_state == '1'">申请认款</el-button>
                <el-button type="danger" size="small" plain @click="del()" v-if="order_state == '1'">作废</el-button>
                <el-button type="primary" size="small" @click="confirm()" v-if="order_state == '2'">确认</el-button>
                <!-- <el-button type="danger" size="small" plain @click="del()" v-if="codeData !== 'create'">删除</el-button> -->
                <el-button type="danger" size="small" plain @click="back()" v-if="order_state == '2'">驳回</el-button>
             </el-col>
             <el-col :span="8">
                <el-steps :space="200" :active="order_state" finish-status="success" size="small">
                    <el-step title="草稿"></el-step>
                    <el-step title="待认款"></el-step>
                    <el-step title="已认款"></el-step>
                </el-steps>
             </el-col>

        </el-row>
        <div class="tabD">
          <el-row>
            <el-col :span="12" class="tabTop">
              来款金额<span class="red_font">*</span><br/>
              <el-input v-model="codeAllData.payment_money" placeholder="请填写客户来款金额" class="inputD" :disabled="order_state == '2' || order_state == '3'"></el-input>
            </el-col>
            <el-col :span="12" class="tabTop">
              到账时间<span class="red_font">*</span><br/>
               <el-date-picker v-model="codeAllData.pay_time" type="date" placeholder="选择日期" class="inputD" :disabled="order_state == '2' || order_state == '3'"></el-date-picker>
            </el-col>
            <el-col :span="12" class="tabTop">
              付款账号<span class="red_font">*</span><br/>
              <el-input v-model="codeAllData.payment_account_name" placeholder="请填写付款的账号" class="inputD" :disabled="order_state == '2' || order_state == '3'"></el-input>
            </el-col>
            <el-col :span="12" class="tabTop">
              收款账号<span class="red_font">*</span><br/>
              <el-input v-model="codeAllData.receive_account_name" placeholder="请填写收款账号名称" class="inputD" :disabled="order_state == '2' || order_state == '3'"></el-input>
            </el-col>
            <el-col :span="12" class="tabTop">
              支付方式<span class="red_font">*</span><br/>
              <el-select v-model="codeAllData.pay_mode" placeholder="请选择" class="inputD" :disabled="order_state == '2' || order_state == '3'">
                <el-option v-for="item in menthodOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12" class="tabTop">
              支付类型<span class="red_font">*</span><br/>
              <el-select v-model="codeAllData.pay_type" placeholder="请选择" class="inputD" :disabled="order_state == '2' || order_state == '3'">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12" class="tabTop">
              备注<span class="red_font"></span><br/>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请填写备注信息"
                class="inputD"
                :disabled="order_state == '2' || order_state == '3'"
                v-model="codeAllData.note">
              </el-input>
            </el-col>
          </el-row>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      codeData: "", //当前查看编辑id
      activeName: "first", //选项卡默认第几项
      codeAllData: {}, //当前编辑规则的所有数据
      createTf: false, //创建状态（“创建新规则”）
      codeFormatList: [
        //编辑格式数据列表
        { key: "X+YYMMDD+NUM", value: "前缀+YYMMDD+流水码" },
        { key: "X+YYMMDD", value: "前缀+YYMMDD" },
        { key: "X+NUM", value: "前缀+流水码" },
        { key: "X+NUM+Z", value: "前缀+流水码+后缀" },
        { key: "NUM", value: "流水码" }
      ],
      codeFormatPower: { prefix: true, suffix: true, digit: true }, //编辑格式权限列表
      modeList: [
        //模式数据列表
        { key: "1", value: "非智能" },
        { key: "2", value: "智能" }
      ],
      menthodOptions: [
        {
          // 支付方式
          value: "1",
          label: "微信转账"
        },
        {
          value: "2",
          label: "支付宝转账"
        },
        {
          value: "3",
          label: "银行卡转账"
        }
      ],
      typeOptions: [
        {
          value: "1",
          label: "对公转账"
        },
        {
          value: "2",
          label: "对私转账"
        }
      ],
      order_state: -1, //验料单状态
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.codeData = window.location.hash.split("=")[1];
      if (self.codeData == "create") {
        self.codeAllData = {};
      } else {
        let params = {
          PRS: {
            orderId: self.codeData
          }
        };
        this.$axios
          .get(
            this.$portMain + "/stock/accountregister/order/form",
            params
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.codeAllData = res.data.data;
              self.order_state = parseInt(res.data.data.order_state);
              // self.codeFormat();
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    },
    confirm() {
      //确认
      var self = this;
      if (self.codeData) {
        let payment_money = self.$v.valiNull(self.codeAllData.payment_money);
        let pay_time = self.$v.valiNull(self.codeAllData.pay_time);
        let payment_account_name = self.$v.valiNull(
          self.codeAllData.payment_account_name
        );
        let receive_account_name = self.$v.valiNull(
          self.codeAllData.receive_account_name
        );
        let pay_mode = self.$v.valiNull(self.codeAllData.pay_mode);
        let pay_type = self.$v.valiNull(self.codeAllData.pay_type);
        self.codeAllData.pay_time = this.$api.dateGetDay(
          self.codeAllData.pay_time
        );
        self.codeAllData.order_state = "3";
        if (
          payment_money &&
          pay_time &&
          payment_account_name &&
          receive_account_name &&
          pay_mode &&
          pay_type
        ) {
          this.$axios
            .post(
              this.$portMain +
                "/stock/accountregister/order/confirm",
              self.codeAllData
            )
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success(res.data.msg);
                // self.$router.push('paragraphRegister')
                setTimeout(() =>{
                  self.$router.push('paragraphRegister')
                }, 2000)
              } else {
                self.$message.error(res.data.msg);
              }
            });
        }
      }
    },
    save() { // 保存
      var self = this;
      if (self.codeData) {
        let payment_money = self.$v.valiNull(self.codeAllData.payment_money);
        let pay_time = self.$v.valiNull(self.codeAllData.pay_time);
        let payment_account_name = self.$v.valiNull(
          self.codeAllData.payment_account_name
        );
        let receive_account_name = self.$v.valiNull(
          self.codeAllData.receive_account_name
        );
        let pay_mode = self.$v.valiNull(self.codeAllData.pay_mode);
        let pay_type = self.$v.valiNull(self.codeAllData.pay_type);
        self.codeAllData.pay_time = this.$api.dateGetDay(
          self.codeAllData.pay_time
        );
        self.codeAllData.order_state = "1";
        if (
          payment_money &&
          pay_time &&
          payment_account_name &&
          receive_account_name &&
          pay_mode &&
          pay_type
        ) {
          this.$axios
            .post(
              this.$portMain +
                "/stock/accountregister/order/save",
              self.codeAllData
            )
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success(res.data.msg);
                // self.$router.push('paragraphRegister')
                setTimeout(() => {
                  self.$router.push({ 
                    path: "paragraphRegisterEdit",
                    query: { goldId: res.data.data.id }
                  });
                  window.location.reload();
                }, 2000)
              } else {
                self.$message.error(res.data.msg);
              }
            });
        }
      } 
    },
    del() { // 作废
      let self = this;
      let params = {
        id: self.codeData
      };
      this.$axios
        .post(this.$portMain + "/stock/accountregister/order/delete", self.codeAllData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(() => {
              self.$router.push('paragraphRegister');
            }, 2000)
          } else {
            self.$message.error(res.data.msg);
          }
        })
    },
    aplication() {  //申请认款
      let self = this;
      this.$axios
        .post(this.$portMain + "/stock/accountregister/order/apply", self.codeAllData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(() => {
              self.$router.push({
                path: "paragraphRegisterEdit",
                query: { goldId: res.data.data.id }
              });
              window.location.reload();
            }, 2000)
          } else {
            self.$message.error(res.data.msg);
          }
        })
    },
    back() {  //驳回
    let self = this;
      this.$axios
        .post(this.$portMain + "/stock/accountregister/order/reject", self.codeAllData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(() => {
              self.$router.push({
                path: "paragraphRegisterEdit",
                query: { goldId: res.data.data.id }
              });
              window.location.reload();
            }, 2000)
          } else {
            self.$message.error(res.data.msg);
          }
        })
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
    padding-left 8px
  .tabD
    padding 20px 80px
    .tabTop
      margin-top 20px
      color #8A9199
      font-size 14px
      padding-bottom 10px
      line-height 30px
    .blackFont
      color #333333
  .inputD
    width 90%
  .red_font
    padding-left 0
  .leftHeight
    height 12px
</style>