<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
      <el-breadcrumb-item>员工详情</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="12" class="topMenuTxt">基本资料</el-col>
          <el-col :span="12">
            <div class="textRight">
              <el-button type="primary" size="small" @click="saveUser">保存</el-button>
              <el-button size="small" @click="cancelUser" plain>取消</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="editUserTab">
          <!-- <div>
            <div class="pictrue">
              <img v-if="logoImg != ''" :src="logoImg" alt style="width:100px; height:100px">
              <img
                v-else
                src="../../../../static/images/img-noimg.png"
                style="width:100px; height:100px"
              >
              <span class="tipDes">点击更换头像</span>
              <input type="file" class="addBorder" accept="image/*" ref="pic" @input="loadImg">
            </div>
          </div> -->
          <el-row>
            <el-col :span="11">
              <div class="inputName">员工账号</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.username"
                  :disabled="true"
                  placeholder="请设置登录员工名"
                  class="editInp"
                  size="small"
                ></el-input>
                <span class="red_font">*</span>
              </div>
              <!-- <div class="inputName">
                  原密码
                </div>
                <div class="inputDiv">
                  <el-input type="password" v-model="userAllData.oldPassword" placeholder="请填写原密码" class="editInp" size="small"></el-input>
              </div>-->
              <div class="inputName">新密码</div>
              <div class="inputDivSub">
                <el-row>
                  <el-col :span="12">
                    <el-input
                      type="password"
                      v-model="userAllData.password"
                      placeholder="请填写新密码"
                      class="editInp"
                      size="small"
                    ></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input
                      type="password"
                      v-model="userAllData.passwordTwo"
                      placeholder="请重新输入一次"
                      class="editInp"
                      size="small"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
              <div class="inputName">姓名</div>
              <div class="inputDiv">
                <el-input
                  v-model="userAllData.concat"
                  placeholder="请输入员工姓名"
                  class="editInp"
                  size="small"
                ></el-input>
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
              <!-- <div class="inputName">
                  所属部门
                </div>
                <div class="inputDiv">
                  <el-select v-model="userAllData.deptId" placeholder="请选择部门" class="editInp" size="small">
                    <el-option
                      v-for="item in DepartList"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId">
                    </el-option>
                  </el-select>
              </div>-->
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
      logoImg: "", //上传图片
      userAllData: {}, //员工的所有信息
      statusList: [
        //员工状态
        { value: "E", label: "启用" },
        { value: "D", label: "禁用" }
      ],
      statu: "E", //员工状态属性
      DepartList: [], //部门列表
      DepartValue: "", //部门属性
      roleList: [], //角色列表
      roleId: "" //角色属性
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.userAllData = this.$route.query;
      // var params = { accessToken: localStorage.accessToken };
      //部门信息接口
      this.$axios.get(self.$portMain + "/company/deptLst").then(function(res) {
        if (res.data.code == 200) {
          self.DepartList = res.data.data;
        } else {
          self.$message.error(res.data.message);
        }
      });
      //角色列表接口
      this.$axios
        .get(self.$portMain + "/company/queryRoles")
        .then(function(res) {
          if (res.data.code == 200) {
            self.roleList = res.data.data;
          } else {
            self.$message.error(res.data.message);
          }
        });
    },
    //保存客户信息
    saveUser() {
      var self = this;
      //密码校验
      if (
        self.userAllData.password != undefined &&
        self.userAllData.password != ""
      ) {
        if (
          self.userAllData.password != self.userAllData.passwordTwo ||
          !self.$v.verifyPassword(self.userAllData.password)
        ) {
          self.$message.error(
            "两个新密码输入不相同或密码少于6位，请重新输入！"
          );
          return;
        }
      }

      if (
        self.userAllData.passwordTwo != undefined &&
        self.userAllData.passwordTwo != ""
      ) {
        if (
          self.userAllData.password == undefined ||
          self.userAllData.password == ""
        ) {
          self.$message.error(
            "两个新密码输入不相同或密码少于6位，请重新输入！"
          );
          return;
        }
      }

      delete self.userAllData.createTime;
      let parem = JSON.parse(JSON.stringify(self.userAllData));
      delete parem.passwordTwo;

      this.$api.formdataPostFun(
        self.$portMain + "/account/updateSub",
        parem,
        res => {
          self.$message.success(res.msg);
          setTimeout(function() {
            self.$router.push({ path: "userManageDisp" });
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
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
    // 上传系列图片
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
        uploadType: "5"
      };
      this.$api.formdataPostFun(
        url,
        params,
        res => {
          // self.submitCreatData.pic = res.data;
          let imgUrl = self.getObjectURL(file);
          self.logoImg = imgUrl;
          self.$refs.pic.value = "";
        },
        err => {
          self.$message.error("上传失败");
        }
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
    padding-left: 2px;
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

    .inputDivSub {
      width: 85%;

      .editInp {
        width: 90%;
      }
    }
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
      cursor: pointer;
    }

    .tipDes {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100px;
      height: 24px;
      background-color: #000000;
      opacity: 0.5;
      color: #FFFFFF;
      font-size: 12px;
      text-align: center;
      line-height: 24px;
    }
  }
}
</style>