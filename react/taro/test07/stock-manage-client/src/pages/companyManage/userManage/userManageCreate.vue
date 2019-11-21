<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
      <el-breadcrumb-item>创建新用户</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="12" class="topMenuTxt">基本资料</el-col>
          <el-col :span="12">
            <div class="textRight">
              <el-button type="primary" size="small" @click="saveUser" v-if="powerSave == 'true'">保存</el-button>
              <el-button size="small" @click="cancelUser" plain>取消</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="editUserTab">
          <!-- <div>
            <div style="position:relative" v-show="!logoImg">
              <img
                src="../../../../static/images/img-upload(2).png"
                alt
                style="width:100px; height:100px"
              >
              <input type="file" class="upLoadLogo" accept="image/*" ref="pic1" @input="loadImg1">
            </div>

            <div class="pictrue" v-show="logoImg">
              <img :src="logoImg" alt style="width:100px; height:100px">
              <input type="file" class="addBorder" accept="image/*" ref="pic2" @input="loadImg2">
            </div>
          </div>-->
          <el-row>
            <el-col :span="11">
              <div class="inputName">员工账号</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.username"
                  placeholder="请设置登录员工账号"
                  class="editInp"
                  size="small"
                ></el-input>
                <span class="red_font">*</span>
              </div>
              <div class="inputName">密码</div>
              <div class="inputDiv">
                <el-input
                  type="password"
                  v-model="userAllData.password"
                  placeholder="请填写登录密码"
                  class="editInp"
                  size="small"
                ></el-input>
                <span class="red_font">*</span>
              </div>
              <div class="inputName">姓名</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.concat"
                  placeholder="请输入员工姓名"
                  class="editInp"
                  size="small"
                ></el-input>
                <span class="red_font">*</span>
              </div>
              <div class="inputName">角色</div>
              <div class="inputDiv">
                <el-select
                  v-model="userAllData.roleId"
                  placeholder="请选择角色"
                  class="editInp"
                  size="small"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  ></el-option>
                </el-select>
                <span class="red_font">*</span>
              </div>
              <div class="inputName">所属部门</div>
              <div class="inputDiv">
                <el-select
                  v-model="userAllData.deptId"
                  placeholder="请选择部门"
                  class="editInp"
                  size="small"
                >
                  <el-option
                    v-for="item in DepartList"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <div class="inputName">状态</div>
              <div class="inputDiv">
                <el-select
                  v-model="userAllData.statu"
                  placeholder="请选择员工状态"
                  class="editInp"
                  size="small"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="inputName">手机号码</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.telephone"
                  placeholder="请填写手机号码"
                  class="editInp"
                  size="small"
                ></el-input>
              </div>
              <div class="inputName">办公电话</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.phone"
                  placeholder="请填写办公电话"
                  class="editInp"
                  size="small"
                ></el-input>
              </div>
              <div class="inputName">邮箱地址</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.mail"
                  placeholder="请填写邮箱地址"
                  class="editInp"
                  size="small"
                ></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerSave: "false", //保存按钮权限
      logoImg: "", //上传的图片
      input: "",
      userAllData: {
        //员工的所有信息
        username: "",
        password: "",
        concat: "",
        roleId: "",
        deptId: "",
        telephone: "",
        phone: "",
        mail: "",
        statu: "E" //员工状态默认为“启用”
      },
      statusList: [
        //员工状态
        { value: "E", label: "启用" },
        { value: "D", label: "禁用" }
      ],
      DepartList: [], //部门列表
      DepartValue: "", //部门属性
      roleList: [], //角色列表
      roleId: "" //角色属性
    };
  },
  created() {
    this.created_fun();
    this.powerFun();
  },
  methods: {
    created_fun() {
      var self = this;
      var params = { accessToken: localStorage.accessToken };
      //部门信息接口
      this.$axios
        .get(self.$portMain + "/company/deptLst", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.DepartList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
      //角色列表接口
      this.$axios
        .get(self.$portMain + "/company/queryRoles", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.roleList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //创建员工事件接口
    saveUser() {
      var self = this;
      self.userAllData.accessToken = localStorage.accessToken;
      if (self.userAllData.username != undefined) {
        self.userAllData.username = self.userAllData.username.trim();
      }

      if (self.userAllData.username == "") {
        self.$message.error("员工账号不能为空！");
        return;
      }
      if (!self.$v.verifyUserName(self.userAllData.username)) {
        self.$message.error("员工账号请输入3~18位的，小写字母或者数字！");
        return;
      }
      if (self.userAllData.password != undefined) {
        self.userAllData.password = self.userAllData.password.trim();
      }

      if (self.userAllData.password == "") {
        self.$message.error("密码不能为空！");
        return;
      }
      if (self.userAllData.mail != undefined) {
        self.userAllData.mail = self.userAllData.mail.trim();
      }

      if (self.userAllData.mail != "") {
        if (!self.$v.verifyEmail(self.userAllData.mail)) {
          self.$message.error("请正确填写邮箱地址！");
          return;
        }
      }
      if (!self.userAllData.roleId || self.userAllData.roleId === "") {
        self.$message.error("请选择角色!");
        return;
      }
      if (self.userAllData.concat != undefined) {
        self.userAllData.concat = self.userAllData.concat.trim();
      }
      if (self.userAllData.concat == "") {
        self.$message.error("员工姓名不能为空！");
        return;
      }
      if (self.userAllData.telephone != undefined) {
        self.userAllData.telephone = self.userAllData.telephone.trim();
      }
      if (self.userAllData.phone != undefined) {
        self.userAllData.phone = self.userAllData.phone.trim();
      }

      if (self.userAllData.telephone != "") {
        if (!this.$v.verifyMobile(self.userAllData.telephone)) {
          self.$message.error("请填写正确的手机号，例如：手机（13999187627)");
          return;
        }
      }

      if (self.userAllData.phone != "") {
        if (!this.$v.verifyMobileNew(self.userAllData.phone)) {
          self.$message.error(
            "请填写正确的公司电话，例如：手机（13999187627）、固话（021-8726372、0218726372）"
          );
          return;
        }
      }
      this.$api.formdataPostFun(
        self.$portMain + "/account/createSub",
        self.userAllData,
        res => {
          self.$message.success(res.msg);
          setTimeout(function() {
            self.$router.push("userManageDisp");
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //取消按钮
    cancelUser() {
      this.$router.push({ path: "userManageDisp" });
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
    // 上传系列图片1
    loadImg1() {
      let self = this;
      let file = this.$refs.pic1.files[0];

      let url = this.$portMain + "/common/uploadImg";
      let size = file.size / 1024;
      if (size > 2000) {
        self.$message.error("您上传的图片大小不能大于2M");
        return;
      }
      let params = {
        file: file,
        uploadType: "5"
      };
      this.$api.formdataPostFun(
        url,
        params,
        res => {
          // self.submitCreatData.pic = res.data;
          let imgUrl = self.getObjectURL(file);
          self.logoImg = imgUrl;
          self.$refs.pic1.value = "";
        },
        err => {
          self.$message.error("上传失败");
        }
      );
    },
    // 上传系列图片2
    loadImg2() {
      let self = this;
      let file = this.$refs.pic2.files[0];

      let url = this.$portMain + "/common/uploadImg";
      let size = file.size / 1024;
      if (size > 2000) {
        self.$message.error("您上传的图片大小不能大于2M");
        return;
      }
      let params = {
        file: file,
        uploadType: "5"
      };
      this.$api.formdataPostFun(
        url,
        params,
        res => {
          // self.submitCreatData.pic = res.data;
          let imgUrl = self.getObjectURL(file);
          self.logoImg = imgUrl;
          self.$refs.pic2.value = "";
        },
        err => {
          self.$message.error("上传失败");
        }
      );
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerSave = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "company-edit-cherk"
      );
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
    padding-left: 10px;
    color: $base-color;
  }

  .viewTable {
    margin: 30px 0 0 100px;

    .tdLeft {
      width: 180px;
      color: #9198a0;
      font-size: 14px;
      height: 40px;
    }

    .tdRight {
      color: #000;
    }
  }

  .topMenuTxt {
    font-size: 16px;
    color: #2E3033;
    font-weight: bold;
  }

  .textRight {
    text-align: right;
  }

  .editUserTab {
    padding: 50px;
    line-height: 30px;

    .inputName {
      margin-top: 15px;
      color: #8A9199;
    }

    .inputDiv {
      .editInp {
        width: 80%;
      }
    }
  }

  .upLoadLogo {
    width: 100px;
    height: 100px;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  .pictrue {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #d8dce5;

    img {
      width: 100px;
      height: 100px;
    }

    .addBorder {
      width: 100px;
      height: 100px;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }
}
</style>