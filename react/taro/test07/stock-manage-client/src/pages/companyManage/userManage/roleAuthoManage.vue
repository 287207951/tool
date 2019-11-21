<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
    </div>
    <div>
      <el-row>
        <el-col :span="6" class="leftMenu">
          <div class="topMenu">角色列表</div>
          <div class="createRoleDiv" v-show="powerCreat == 'true'">
            <el-button
              plain
              class="createRoleBtn"
              icon="el-icon-circle-plus-outline"
              @click="createUserFun"
            >创建新角色</el-button>
          </div>

          <ul class="menuWrap">
            <li
              v-for="(userList, index ) in userLists"
              :key="userList.roleId"
              @click="selectRole(userList.roleId, index);relationThree()"
              @mouseover="teamManOver(userList.roleId)"
              @mouseout="teamManOut"
              :class="{'hoverStyle':firstActiveIndex == index}"
            >
              <span slot="title" class="roleLeftBtnSpan">
                {{userList.roleName}}
                <i
                  class="iconfont icon-xingzhuangkaobei red_font"
                  v-show="userList.statu == 'D'"
                ></i>
              </span>
              <span class="roleRightBtnSpan" v-show="roleOverId == userList.roleId">
                <i
                  class="iconfont icon-xingzhuang red_font"
                  @click.stop="editState(userList)"
                  v-show="userList.statu == 'D'"
                ></i>
                <i
                  class="iconfont icon-xingzhuangkaobei red_font"
                  @click.stop="editState(userList)"
                  v-show="userList.statu == 'E'"
                ></i>
                <i class="iconfont icon-bianji red_font" @click.stop="editUserTF(userList,index)"></i>
                <i class="iconfont icon-xingzhuang1 red_font" @click.stop="delFun(userList,index)"></i>
              </span>
            </li>
          </ul>
        </el-col>
        <!-- 创建新角色 -->
        <el-dialog
          title="创建新角色"
          :visible.sync="newRoleType"
          width="520px"
          :close-on-click-modal="false"
        >
          <div class="newRole">
            <div class="line"></div>
            <div>
              <el-input v-model="newRoleName" placeholder="请输入新增角色名称" size="small" class="newName"></el-input>
              <span class="red_font">*</span>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="newRoleType = false" size="small">取 消</el-button>
            <el-button
              type="primary"
              @click="saveCreated"
              size="small"
              :loading="newRoleSaveBtnLoading"
            >保 存</el-button>
          </span>
        </el-dialog>
        <!-- 修改角色名称 -->
        <el-dialog
          title="修改角色名称"
          :visible.sync="editRoleType"
          width="520px"
          :close-on-click-modal="false"
        >
          <div class="newRole">
            <div class="line"></div>
            <div>
              <el-input v-model="editRoleName" placeholder="请输入新的角色名称" size="small" class="newName"></el-input>
              <span class="red_font">*</span>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editRoleType = false" size="small">取 消</el-button>
            <el-button
              type="primary"
              @click="saveEdit"
              size="small"
              :loading="editRoleSaveLoading"
            >保 存</el-button>
          </span>
        </el-dialog>
        <el-col :span="18">
          <div class="topMenu">
            角色权限设置
            <!-- <el-checkbox v-model="checked" v-show="false"></el-checkbox> -->
          </div>
          <div class="conentStyle">
            <el-row>
              <el-col :span="4" class="menuItemWrap">
                <ul class="ulWrap">
                  <li
                    v-for="(authoList, index) in authoLists"
                    :key="authoList.catalogId"
                    @click="anchors(authoList.catalogId,index)"
                    :class="{'hoverStyle':secondActiveIndex == index}"
                  >{{authoList.catalogName}}</li>
                </ul>
              </el-col>
              <el-col :span="20" class="rightBottomMenu">
                <div
                  class="roleAuthoDiv"
                  v-for="authoList in authoLists"
                  :key="authoList.id"
                  :id="'hash' + authoList.catalogId"
                >
                  <el-checkbox
                    v-model="authoList.itemCheckAll"
                    @change="handleCheckAllChange(authoList)"
                  >{{authoList.catalogName}}</el-checkbox>
                  <div>
                    <el-checkbox-group
                      v-model="authoList.checkList"
                      @change="handleCheckedCitiesChange(authoList)"
                    >
                      <el-checkbox
                        :label="item.authId"
                        v-for="item in authoList.auths"
                        class="checkboxClass"
                        :key="item.authId"
                      >{{item.authName}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="footerStyle" v-show="saveType">
            <el-button type="primary" plain size="small" @click="cancelSave">取消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="saveEditPower"
              :loading="qowerSaveBtnLoading"
              v-show="powerCreat == 'true'"
            >保存</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      powerCreat: "false", //新增创建角色权限
      loading: true,
      qowerSaveBtnLoading: false,
      newRoleSaveBtnLoading: false,
      editRoleSaveLoading: false,
      // checked: false, // 模拟渲染的状态
      value: "全部状态",
      editUserState: false, //编辑用户状态（false为查看状态，true为编辑状态）
      userLists: [], // 角色初始数据
      roleOverId: "", //鼠标移动到哪个角色
      authoLists: [], // 角色权限列表数据
      newRoleType: false, // 创建角色弹出框的状态
      newRoleName: "", // 创建新角色
      editRoleType: false, // 修改角色弹出框的状态
      editRoleName: "", // 修改角色
      editItem: "", // 要修改的角色项
      firstActiveIndex: "0", // 一级菜单
      secondActiveIndex: "0", //二级菜单
      roleId: "", // 角色ID
      saveType: false, // 底部状态
      oldAuthIds: [] // 原始的authIds数据
    };
  },
  created() {
    this.created_fun();
    this.powerFun();
  },
  methods: {
    ...mapMutations(["updataQueryVerify"]),
    // 初始化数据
    created_fun() {
      this.loading = true;
      let self = this;
      this.$axios.get(this.$portMain + "/auth/queryRoles").then(function(res) {
        if (res.data.code == 200) {
          self.userLists = res.data.data;
          self.roleId = res.data.data[0].roleId;
          self.rolePower(res.data.data[0].roleId);
          // self.firstActiveIndex = "0";
        } else {
          self.$message.error(res.data.msg);
        }
        self.loading = false;
      });
    },
    // 编辑完初始化数据
    edit_created_fun() {
      let self = this;
      this.$axios.get(this.$portMain + "/auth/queryRoles").then(function(res) {
        if (res.data.code == 200) {
          self.userLists = res.data.data;
          self.rolePower(self.roleId);
          // self.firstActiveIndex = "0";
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    //创建新用户
    createUserFun() {
      this.newRoleType = true;
      this.newRoleName = "";
    },
    // 保存创建新用户
    saveCreated() {
      let self = this;
      if (this.newRoleName != undefined) {
          this.newRoleName = this.newRoleName.trim();
      }

      if (this.newRoleName == "") {
        self.$message.error("角色名称不能为空！");
        return;
      }
      let params = {
        PRS: {
          roleName: self.newRoleName
        }
      };
      this.newRoleSaveBtnLoading = true;
      this.$axios
        .get(this.$portMain + "/auth/createRole", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.newRoleType = false;
            self.newRoleSaveBtnLoading = false;
            // self.created_fun();
            self.edit_created_fun();
          } else {
            self.$message.error(res.data.msg);
            self.newRoleSaveBtnLoading = false;
          }
        });
    },
    // 修改角色名称
    saveEdit() {
      let self = this;
      if (this.editRoleName != undefined) {
          this.editRoleName = this.editRoleName.trim();
      }
      if (this.editRoleName == "") {
        self.$message.error("角色名称不能为空！");
        return;
      }
      let params = {
        PRS: {
          roleName: self.editRoleName,
          roleId: self.editItem.roleId
        }
      };
      this.editRoleSaveLoading = true;
      this.$axios
        .get(this.$portMain + "/auth/editRole", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.editRoleType = false;
            self.editRoleSaveLoading = false;
            // self.created_fun();
            self.edit_created_fun();
          } else {
            self.$message.error(res.data.msg);
            self.editRoleSaveLoading = false;
          }
        });
    },
    // 更改角色状态
    editState(item) {
      let state;
      let self = this;
      self.roleId = item.roleId;
      if (item.statu == "E") {
        state = "D";
      } else if (item.statu == "D") {
        state = "E";
      }
      let params = {
        PRS: {
          roleId: item.roleId,
          statu: state
        }
      };
      this.$axios
        .get(this.$portMain + "/auth/editRole", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            // self.created_fun();
            self.edit_created_fun();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 查询角色的权限
    rolePower(id) {
      let self = this;
      let params = {
        PRS: {
          roleId: id
        }
      };
      this.$axios
        .get(this.$portMain + "/auth/queryAuthList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.authoLists = res.data.data;

            // 创建itemCheckAll属性判断局部选中状态
            self.authoLists.forEach(item => {
              item.itemCheckAll = false;
              item.checkList = [];
            });
            self.authoLists.forEach(item => {
              item.auths.forEach(arr => {
                if (arr.isChecked == true) {
                  item.checkList.push(arr.authId);
                  self.oldAuthIds.push(arr.authId);
                }
              });
            });

            self.authoLists.forEach(item => {
              if (item.auths.length === item.checkList.length) {
                item.itemCheckAll = true;
              }
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
      // let domId = "hash" + elem;
      // document.getElementById(domId).scrollIntoView();
    },
    // 局部全选
    handleCheckAllChange(val) {
      let self = this;
      self.authoLists.forEach(item => {
        if (item.catalogId == val.catalogId) {
          item.itemCheckAll = val.itemCheckAll;
        }
      });
      if (val.itemCheckAll == true) {
        self.authoLists.forEach(item => {
          if (item.catalogId == val.catalogId) {
            item.checkList = [];
            item.auths.forEach(arr => {
              arr.isChecked = true;
              item.checkList.push(arr.authId);
            });
          }
        });
      } else if (val.itemCheckAll == false) {
        self.authoLists.forEach(item => {
          if (item.catalogId == val.catalogId) {
            item.auths.forEach(arr => {
              arr.isChecked = false;
              item.checkList = [];
            });
          }
        });
      }
      // this.rend();
      this.saveShow();
      this.$forceUpdate();
    },
    // 模重新拟渲染
    // rend() {
    //   if (this.checked == false) {
    //     this.checked = true;
    //   } else {
    //     this.checked = false;
    //   }
    // },
    // 单项选中
    handleCheckedCitiesChange(val) {
      let self = this;
      self.authoLists.forEach(item => {
        if (item.auths.length == item.checkList.length) {
          item.itemCheckAll = true;
        } else {
          item.itemCheckAll = false;
        }
      });
      // this.rend();
      this.saveShow();
      this.$forceUpdate();
    },
    // 角色权限修改保存
    saveEditPower() {
      let self = this;
      let authIds = [];
      this.authoLists.forEach(item => {
        if (item.checkList.length != 0) {
          item.checkList.forEach(arr => {
            authIds.push(arr);
          });
        }
      });
      let params = {
        PRS: {
          roleId: self.roleId,
          authIds: authIds
        }
      };
      this.qowerSaveBtnLoading = true;
      this.$axios
        .get(this.$portMain + "/auth/updateRoleAuths", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            // self.created_fun();
            self.getPower();
            self.edit_created_fun();
            self.saveType = false;
            self.qowerSaveBtnLoading = false;
            // document.location.reload();
          } else {
            self.$message.error(res.data.msg);
            self.qowerSaveBtnLoading = false;
          }
        });
    },
    // 保存的状态
    saveShow() {
      let a = [1, 2];
      let b = [1, 2];
      let newAuthIds = [];
      this.authoLists.forEach(item => {
        newAuthIds.push(...item.checkList);
      });
      let saveType =
        newAuthIds.sort().toString() == this.oldAuthIds.sort().toString();
      this.saveType = !saveType;
    },
    // 取消保存
    cancelSave() {
      // this.created_fun();
      this.edit_created_fun();
      this.saveType = false;
      //this.firstActiveIndex = '3';
    },
    // 手动选择角色权限
    selectRole(id, index) {
      this.roleId = id;
      this.rolePower(id);
      this.firstActiveIndex = index + "";
      this.secondActiveIndex = "0";
      this.$forceUpdate();
      this.saveType = false;
    },
    //用户详细编辑
    editUser(elem) {
      this.$router.push({
        path: "/Index/userManageEdit",
        query: { userId: elem.id }
      });
    },
    //鼠标移动移入事件
    teamManOver(id) {
      this.roleOverId = id;
    },
    //鼠标移动移出事件
    teamManOut() {
      this.roleOverId = "";
    },
    //点击编辑事件
    editUserFun() {
      var self = this;
      self.editUserState = true;
    },
    // 锚点关联
    anchors(elem, index) {
      let domId = "hash" + elem;
      document.getElementById(domId).scrollIntoView();
      this.secondActiveIndex = index + ""; //二级菜单
      this.$forceUpdate();
    },
    //
    editUserTF(elem, index) {
      this.roleId = elem.roleId;
      this.editRoleName = "";
      this.editItem = elem;
      this.editRoleType = true;
      this.firstActiveIndex = index + "";
      this.secondActiveIndex = "0";
      this.edit_created_fun();
    },
    //点击一级菜单关联三级页面
    relationThree() {
      let self = this;
      let domId = "hash" + self.authoLists[0].catalogId;
      if (document.getElementById(domId) != null) {
        document.getElementById(domId).scrollIntoView();
      }
    },
    //删除角色
    delFun(elem, index) {
      let self = this;
      this.$confirm("删除后该角色下的用户将无法登录！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            roleId: elem.roleId
          }
        };
        this.$axios
          .get(this.$portMain + "/auth/delRole", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              self.created_fun();
              self.firstActiveIndex = "0";
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    //获取权限点
    getPower() {
      var self = this;
      this.$axios
        .get(this.$portMain + "/account/queryVerify")
        .then(function(res) {
          if (res.data.code == 200) {
            self.updataQueryVerify(res.data.data);
          }
        });
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "company-edit-role"
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
    margin-left: 10px;
  }

  .topBtn {
    text-align: right;
  }

  .createRoleDiv {
    text-align: center;
    padding: 10px;

    .createRoleBtn {
      width: 90%;
    }
  }

  .topMenu {
    height: 30px;
    font-size: 16px;
    padding: 10px;
    border-top: 1px solid #e9eef5;
    border-bottom: 1px solid #e9eef5;
    border-right: 1px solid #e9eef5;
  }

  .leftMenu {
    border: 1px solid #e9eef5;
    border-top: 0;

    // overflow-y: scroll;
    .roleRightBtnSpan {
      color: $base-color;
      float: right;
    }

    .roleLeftBtnSpan {
      // float: left;
    }

    .userMenu {
      height: 700px;
      border-top: 1px #f0f0f0 solid;

      .userDiv {
        border-bottom: 1px #f0f0f0 solid;
        overflow: hidden;
      }
    }
  }

  .menuItemWrap {
    height: 775px;
    border-right: 1px solid #e9eef5;
    border-bottom: 1px solid #e9eef5;
  }

  .rightBottomMenu {
    height: 676px;
    overflow-x: auto;
  }

  .roleAuthoDiv {
    padding: 10px;
    line-height: 40px;
    color: #2E3033;
    font-size: 14px;
  }

  .checkboxClass {
    width: 20%;
    margin-left: 20px;
  }

  .editUserDiv {
    line-height: 40px;

    .editUserLeft {
      color: #999999;
    }

    .editUserRight {
      color: #333333;

      .userInp {
        width: 200px;
        margin-right: 30px;
        float: left;
      }
    }
  }

  .newRole {
    position: relative;

    .line {
      width: 520px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .newName {
      width: 320px;
    }
  }

  .footerStyle {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 53.4%;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 6px 0px 10px rgba(0, 0, 0, 0.1);
    text-align: right;
    line-height: 50px;
    padding-right: 25px;
  }

  .ulWrap {
    li {
      box-sizing: border-box;
      width: 100%;
      height: 56px;
      text-align: left;
      line-height: 56px;
      color: #2d2f33;
      cursor: pointer;
      padding-left: 20px;
      font-size: 14px;

      &:hover {
        background: rgb(253, 231, 235);
      }
    }
  }

  .menuWrap {
    height: 715px;

    li {
      box-sizing: border-box;
      width: 100%;
      height: 56px;
      text-align: left;
      line-height: 56px;
      color: #2d2f33;
      cursor: pointer;
      padding-left: 20px;
      padding-right: 20px;
      font-size: 14px;
      border-bottom: 1px #f0f0f0 solid;

      &:hover {
        background: rgb(253, 231, 235);
      }

      &:first-child {
        border-top: 1px #f0f0f0 solid;
      }
    }

    overflow-y: scroll;
  }

  .hoverStyle {
    background: rgb(253, 231, 235);
    color: #e60e32 !important;
  }
}
</style>