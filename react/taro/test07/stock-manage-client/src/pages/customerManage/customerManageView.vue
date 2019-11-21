s<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>Batar订单销售管理后台</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户详细资料</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="2">
            <div class="imgTemp">
              <img :src="logoUrl" alt class="logoStyle">
            </div>
          </el-col>
          <el-col :span="14">
            <div class="customerName">{{basicsAllData.companyName}}</div>
            <div class="customerState">
              <span v-if="basicsAllData.statu =='E'">启用状态</span>
              <span v-else-if="basicsAllData.statu =='D'">禁用状态</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="menuDiv">
              <el-button type="primary" plain size="small" @click="backFun">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <hr>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础资料" name="first">
            <div class="IDWrap">
              <div class="uploadIDWrap" v-for="(item,index) in licenseImgs" :Key="index">
                <img :src="$portImg + item" alt class="uploadID">
              </div>
            </div>
            <table class="viewTable" cellspacing="0" cellpadding="0">
              <tr>
                <td class="tdLeft">财务联系人</td>
                <td class="tdRight">{{basicsAllData.financePerson}}</td>
              </tr>
              <tr>
                <td class="tdLeft">财务联系电话</td>
                <td class="tdRight">{{basicsAllData.financePhone}}</td>
              </tr>
              <tr>
                <td class="tdLeft">财务编码</td>
                <td class="tdRight">{{basicsAllData.financeCode}}</td>
              </tr>
              <tr>
                <td class="tdLeft">财务传真</td>
                <td class="tdRight">{{basicsAllData.financeFax}}</td>
              </tr>
              <tr>
                <td class="tdLeft">公司负责人</td>
                <td class="tdRight">{{basicsAllData.concat}}</td>
              </tr>
              <tr>
                <td class="tdLeft">法人代表</td>
                <td class="tdRight">{{basicsAllData.lawPerson}}</td>
              </tr>
              <tr>
                <td class="tdLeft">公司电话</td>
                <td class="tdRight">{{basicsAllData.phone}}</td>
              </tr>
              <tr>
                <td class="tdLeft">所属省份/城市</td>
                <td class="tdRight">{{companyAddr}}</td>
              </tr>
              <tr>
                <td class="tdLeft">公司地址</td>
                <td class="tdRight">{{basicsAllData.address}}</td>
              </tr>
              <tr>
                <td class="tdLeft">公司简称</td>
                <td class="tdRight">{{basicsAllData.abbr}}</td>
              </tr>
              <tr>
                <td class="tdLeft">信用代码</td>
                <td class="tdRight">{{basicsAllData.businessLicense}}</td>
              </tr>
              <tr>
                <td class="tdLeft">公司类型</td>
                <td class="tdRight">{{basicsAllData.typeName}}</td>
              </tr>
              <tr>
                <td class="tdLeft">公司账户/客户编码</td>
                <td class="tdRight">{{basicsAllData.companyCode}}</td>
              </tr>
              <tr>
                <td class="tdLeft">登录密码</td>
                <td class="tdRight">* * * * * *</td>
              </tr>
              <!-- <tr>
                  <td class="tdLeft">所属区域</td>
                  <td class="tdRight">华南区*</td>
              </tr>-->
              <tr>
                <td class="tdLeft">关联业务员</td>
                <td class="tdRight">{{basicsAllData.clerkName}}</td>
              </tr>
              <tr>
                <td class="tdLeft">营业执照发证日期</td>
                <td class="tdRight">{{$api.dateGetDay(basicsAllData.issuingDateOfLicense)}}</td>
              </tr>
              <tr>
                <td class="tdLeft">营业执照到期日期</td>
                <td class="tdRight">{{$api.dateGetDay(basicsAllData.endDateOfLicense)}}</td>
              </tr>
            </table>
          </el-tab-pane>
          <el-tab-pane label="合同书" name="second">
            <table
              class="viewTable"
              cellspacing="0"
              cellpadding="0"
              v-if="ContractAllData != undefined && ContractAllData != ''"
            >
              <tr>
                <td class="tdLeft">信用额度</td>
                <td class="tdRight">{{ContractAllData.creditLine}}</td>
              </tr>
              <tr>
                <td class="tdLeft">额度审批人</td>
                <td class="tdRight">{{ContractAllData.limitApprover}}</td>
              </tr>
              <tr>
                <td class="tdLeft">信用等级</td>
                <td class="tdRight">{{ContractAllData.creditLine}}</td>
              </tr>
              <tr>
                <td class="tdLeft">产品购销合同编码</td>
                <td class="tdRight">{{ContractAllData.purchasesSalesContractNo}}</td>
              </tr>
              <tr>
                <td class="tdLeft">产品委托加工合同编码</td>
                <td class="tdRight">{{ContractAllData.manufacturingCnsignmentNo}}</td>
              </tr>
              <tr>
                <td class="tdLeft">第一委托人</td>
                <td class="tdRight">{{ContractAllData.bailee}}</td>
              </tr>
              <tr>
                <td class="tdLeft">身份证号</td>
                <td class="tdRight">{{ContractAllData.baileeCardNo}}</td>
              </tr>
              <tr>
                <td class="tdLeft">手机号码</td>
                <td class="tdRight">{{ContractAllData.baileeTelephone}}</td>
              </tr>
              <tr>
                <td class="tdLeft">第二委托人</td>
                <td class="tdRight">{{ContractAllData.secondBailee}}</td>
              </tr>
              <tr>
                <td class="tdLeft">身份证号</td>
                <td class="tdRight">{{ContractAllData.secondBaileeCardNo}}</td>
              </tr>
              <tr>
                <td class="tdLeft">手机号码</td>
                <td class="tdRight">{{ContractAllData.secondBaileeTelephone}}</td>
              </tr>
              <tr>
                <td class="tdLeft">优惠政策</td>
                <td class="tdRight">{{ContractAllData.preferentialPolicy}}</td>
              </tr>
              <tr>
                <td class="tdLeft">委托方开户行</td>
                <td class="tdRight">{{ContractAllData.bankOfDeposit}}</td>
              </tr>
              <tr>
                <td class="tdLeft">委托方银行账号</td>
                <td class="tdRight">{{ContractAllData.accountNumber}}</td>
              </tr>
              <tr>
                <td class="tdLeft">开始时间~结束时间</td>
                <td class="tdRight">{{ContractStartTime + '~' + ContractEndTime}}</td>
              </tr>
            </table>
            <div class="noDataStyle" v-else>暂无合同书数据</div>
          </el-tab-pane>
          <el-tab-pane label="授权书" name="third">
            <table
              class="viewTable"
              cellspacing="0"
              cellpadding="0"
              v-if="ProxyAllData != undefined && ProxyAllData != ''"
            >
              <tr>
                <td class="tdLeft">授权委托书编号</td>
                <td class="tdRight">{{ProxyAllData.powerOfAttorneyNo}}</td>
              </tr>
              <tr>
                <td class="tdLeft">客户委托人</td>
                <td class="tdRight">{{ProxyAllData.bailor}}</td>
              </tr>
              <tr>
                <td class="tdLeft">委托项目</td>
                <td class="tdRight">{{ProxyAllData.entrustItem}}</td>
              </tr>
              <tr>
                <td class="tdLeft">传真机号</td>
                <td class="tdRight">{{ProxyAllData.fax}}</td>
              </tr>
              <tr>
                <td class="tdLeft">委托日期</td>
                <td class="tdRight">{{ProxyentrustDate}}</td>
              </tr>
              <tr>
                <td class="tdLeft">受托日期</td>
                <td class="tdRight">{{ProxyacceptDate}}</td>
              </tr>
              <tr>
                <td class="tdLeft">客户受托人</td>
                <td class="tdRight">
                  <div v-for="(item, index) in ProxyManAllData" :key="index">{{item}}</div>
                </td>
              </tr>
            </table>
            <div class="noDataStyle" v-else>暂无授权书数据</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      licenseImgs: [], //证件图片
      companyAddr: "", // 公司省市
      activeName: "first",
      customerId: "", //客户ID
      customerName: "", // 公司名称
      auditState: "", // 审核状态
      customerAllData: {}, //客户数据
      basicsAllData: {}, // 基础资料
      ContractAllData: {}, // 合同书数据
      ProxyAllData: {}, // 授权书数据
      ContractStartTime: "", // 合同生效时间
      ContractEndTime: "", // 合同失效时间
      ProxyentrustDate: "", // 委托日期
      ProxyacceptDate: "", // 接受委托日期
      ProxyManAllData: "", // 客户受委托人数据(Array)
      logoUrl: "" // logo地址
    };
  },
  created() {
    this.created_fun();
    this.clientDetail();
    this.queryContract();
    this.queryClientProxy();
  },
  methods: {
    created_fun() {
      var self = this;
      self.customerAllData = this.$route.query;
      // self.customerId = window.location.hash.split("=")[1];
      this.customerId = self.customerAllData.companyId;
      // this.customerName = self.customerAllData.companyName;
      // this.auditState = self.customerAllData.auditState;
    },

    // 基础资料
    clientDetail() {
      let self = this;
      let params = {
        PRS: {
          clientId: this.customerId
        }
      };
      this.$axios
        .get(this.$portMain + "/client/detail", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.basicsAllData = res.data.data;
            // 公司logo
            if (
              res.data.data.logoUrl != "" &&
              res.data.data.logoUrl != undefined
            ) {
              self.logoUrl = self.$portImg + res.data.data.logoUrl;
            } else {
              self.logoUrl = "";
            }
            // self.basicsUsername = self.basicsAllData.mainUser.username;
            // 关联业务员
            // if (res.data.data.clerk != "" && res.data.data.clerk != undefined) {
            //   self.basicsClerks = res.data.data.clerk.concat;
            // }
            // 公司地址
            if (
              self.basicsAllData.province != undefined &&
              self.basicsAllData.city != undefined
            ) {
              self.companyAddr =
                self.basicsAllData.province + "/" + self.basicsAllData.city;
            }
            if (
              self.basicsAllData.licenseImg != undefined &&
              self.basicsAllData.licenseImg != ""
            ) {
              self.licenseImgs = self.basicsAllData.licenseImg.split(",");
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 合同书数据
    queryContract() {
      let self = this;
      let params = {
        PRS: {
          clientId: this.customerId
        }
      };
      this.$axios
        .get(this.$portMain + "/client/queryContract", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.ContractAllData = res.data.data;
            if (self.ContractAllData != undefined) {
              self.ContractStartTime = self.$api.dateGetDay(
                self.ContractAllData.startTime
              );
              self.ContractEndTime = self.$api.dateGetDay(
                self.ContractAllData.endTime
              );
            }
          } else {
            //self.$message.error(res.data.msg);
          }
        });
    },
    // 授权书数据
    queryClientProxy() {
      let self = this;
      let params = {
        PRS: {
          clientId: this.customerId
        }
      };
      this.$axios
        .get(this.$portMain + "/client/queryClientProxy", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.ProxyAllData = res.data.data;
            if (self.ProxyAllData != undefined) {
              self.ProxyentrustDate = self.$api.dateGetDay(
                self.ProxyAllData.entrustDate
              );
              self.ProxyacceptDate = self.$api.dateGetDay(
                self.ProxyAllData.acceptDate
              );
              self.ProxyManAllData = self.ProxyAllData.proxyBailee?self.ProxyAllData.proxyBailee.split(","):[];
              if (self.ProxyAllData.entrustItem != undefined) {
                self.ProxyAllData.entrustItem = JSON.parse(
                  self.ProxyAllData.entrustItem
                ).join();
              }
            }
          } else {
            //self.$message.error(res.data.msg);
          }
        });
    },
    //选项卡切换事件
    handleClick(tab, event) {
      //
    },
    backFun() {
      this.$router.push("customerManageDisp");
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

  .imgTemp {
    width: 80px;
    height: 80px;
    text-align: center;
    font-size: 16px;
    color: #9198a0;
    background: #e4e7f0;
    font-size: 16px;

    .logoStyle {
      width: 80px;
      height: 80px;
    }
  }

  .customerName {
    font-size: 24px;
    color: #2E3033;
    padding-bottom: 24px;
  }

  .customerState {
    font-size: 14px;
    color: #2E3033;
  }

  .menuDiv {
    text-align: right;
  }

  .viewTable {
    margin: 30px 0 0 100px;

    .tdLeft {
      width: 180px;
      color: #9198a0;
      font-size: 14px;
      line-height: 40px;
      height: 20px;
    }

    .tdRight {
      color: #000;
      line-height: 40px;
      font-size: 14px;
    }
  }

  .noDataStyle {
    color: #9198a0;
    font-size: 25px;
    text-align: center;
    margin-top: 25px;
  }

  .IDWrap {
    display: flex;
    margin: 30px 0 0 100px;

    .uploadIDWrap {
      margin-right: 16px;
      position: relative;
      width: 120px;
      height: 167px;

      .uploadID {
        width: 120px;
        height: 167px;
        object-fit: fill;
      }
    }
  }
}
</style>
