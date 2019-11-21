<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
      <el-breadcrumb-item>员工详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="12" class="topMenuTxt">基本资料</el-col>
          <el-col :span="12">
            <div class="textRight">
              <el-button type="primary" size="small" @click="editUser" v-if="powerEdit == 'true'">编辑</el-button>
            </div>
          </el-col>
        </el-row>

        <div>
          <!-- <div class="viewTable">
            <img
              src="../../../../static/images/img-noimg.png"
              alt
              style="width:100px;height:100px;"
            >
          </div>-->
          <table class="viewTable" cellspacing="0" cellpadding="0">
            <tr>
              <td class="tdLeft">员工账号</td>
              <td class="tdRight">{{userAllData.username}}</td>
            </tr>
            <tr>
              <td class="tdLeft">密码</td>
              <td class="tdRight">******</td>
            </tr>
            <tr>
              <td class="tdLeft">员工姓名</td>
              <td class="tdRight">{{userAllData.concat}}</td>
            </tr>
            <tr>
              <td class="tdLeft">员工状态</td>
              <td class="tdRight" v-if="userAllData.statu == 'E'">启动</td>
              <td class="tdRight" v-if="userAllData.statu == 'D'">禁用</td>
            </tr>
            <tr>
              <td class="tdLeft">手机号码</td>
              <td class="tdRight">{{userAllData.telephone}}</td>
            </tr>
            <tr>
              <td class="tdLeft">办公电话</td>
              <td
                class="tdRight"
                v-if="userAllData.phone != '' && userAllData.phone != undefined"
              >{{userAllData.phone}}</td>
              <td class="tdRight" v-else>暂无</td>
            </tr>
            <tr>
              <td class="tdLeft">邮箱地址</td>
              <td
                class="tdRight"
                v-if="userAllData.mail != '' && userAllData.mail != undefined"
              >{{userAllData.mail}}</td>
              <td class="tdRight" v-else>暂无</td>
            </tr>
            <tr>
              <td class="tdLeft">员工角色</td>
              <td
                class="tdRight"
                v-if="userAllData.roleName != '' && userAllData.roleName != undefined"
              >{{userAllData.roleName}}</td>
              <td class="tdRight" v-else>暂无</td>
            </tr>
            <tr>
              <td class="tdLeft">所属部门</td>
              <td
                class="tdRight"
                v-if="userAllData.deptName != '' && userAllData.deptName != undefined"
              >{{userAllData.deptName}}</td>
              <td class="tdRight" v-else>暂无</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerEdit: "false",
      userId: -1,
      userAllData: {}
    };
  },
  created() {
    this.created_fun();
    this.powerFun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.userAllData = this.$route.query;
    },
    //编辑员工按欣慰
    editUser() {
      var self = this;
      this.$router.push({
        path: "/Index/userManageEdit",
        query: self.userAllData
      });
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerEdit = this.$api.setPowerSpot(
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
}
</style>