<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>通讯录管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
    </div>
    <div>
      <el-row>
        <el-col :span="6" class="leftMenu">
          <div class="topMenu">角色列表</div>
          <div class="createRoleDiv">
            <el-button
              plain
              class="createRoleBtn"
              icon="el-icon-circle-plus-outline"
              @click="createGroupFun"
            >创建新分组</el-button>
          </div>
          <el-menu :default-active="activeIndex" class="el-menu-vertical-demo userMenu">
            <el-menu-item
              v-for="(item, index ) in groupingLists"
              :key="item.id"
              :index="index + ''"
              @click="selectGroup(item,index)"
              @mouseover.native="teamManOver(item.id)"
              @mouseout.native="teamManOut"
              class="userDiv"
            >
              <span slot="title" class="roleLeftBtnSpan">{{item.departName}}</span>
              <span class="roleRightBtnSpan" v-show="groupOverId == item.id">
                <i class="iconfont icon-bianji red_font" @click.stop="editGroup(item)"></i>
                <i class="iconfont icon-xingzhuang1 red_font" @click="deleGroup(item)"></i>
              </span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <!-- 新建分组 -->
        <el-dialog
          title="新建分组"
          :visible.sync="newGroupType"
          width="480px"
          :close-on-click-modal="false"
        >
          <div class="newRole">
            <div class="line"></div>
            <div style="padding-top: 20px;padding-bottom: 20px;">
              <span style="font-size:14px;color:#8A9199">分组名称</span>
              <el-input v-model="newGroupName" placeholder="请填写新建分组名称" size="small" class="newName"></el-input>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="newGroupType = false" size="small">取 消</el-button>
            <el-button type="primary" @click="saveCreatedGroup" size="small">保 存</el-button>
          </span>
        </el-dialog>
        <!-- 编辑分组 -->
        <el-dialog
          title="编辑分组"
          :visible.sync="editGroupType"
          width="480px"
          :close-on-click-modal="false"
        >
          <div class="newRole">
            <div class="line"></div>
            <div style="padding-top: 20px;padding-bottom: 20px;">
              <span style="font-size:14px;color:#8A9199">分组名称</span>
              <el-input
                v-model="editGroupName"
                placeholder="请填写新建分组名称"
                size="small"
                class="newName"
              ></el-input>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editGroupType = false" size="small">取 消</el-button>
            <el-button type="primary" @click="saveEditGroup" size="small">保 存</el-button>
          </span>
        </el-dialog>
        <!--  -->
        <el-col :span="18">
          <div class="topMenu">
            <div class="topMenuWrap">
              <span>人员管理</span>
              <el-button type="primary" size="small" @click="newStaffFun">新增人员</el-button>
            </div>
          </div>
          <div class="conentStyle">
            <!-- <div class="item">
              李大红 163 3654 6865
              <i class="iconfont icon-bianji red_font"></i>
              <i class="iconfont icon-xingzhuang1 red_font"></i>
            </div>-->
            <div v-if="personnelData.length != 0">
              <div class="item" v-for="(item,index) in personnelData" :key="index">
                <span class="itemLeft">{{item.personName}} {{item.personTelephone}}</span>
                <span class="itemRight">
                  <i class="iconfont icon-bianji red_font" @click="editPeopleFun(item)"></i>
                  <i class="iconfont icon-xingzhuang1 red_font" @click="delePeople(item)"></i>
                </span>
              </div>
            </div>

            <div class="itemTwo" v-else>暂无人员数据</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 新建人员-->
    <el-dialog
      title="新建人员"
      :visible.sync="newStaffType"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="newRole">
        <div class="line"></div>
        <div style="padding-top: 10px;padding-bottom: 28px;">
          <span class="staffLeft">姓名</span>
          <el-input
            v-model="newPeople.personName"
            placeholder="请填写新增人员的姓名"
            size="small"
            class="newName"
          ></el-input>
        </div>
        <div style="padding-top: 10px;padding-bottom: 10px;">
          <span class="staffLeft">联系电话</span>
          <el-input
            v-model="newPeople.personTelephone"
            placeholder="请填写新增人员的联系电话"
            size="small"
            class="newName"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newStaffType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreatedPeople" size="small">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 编辑人员-->
    <el-dialog
      title="编辑人员"
      :visible.sync="editStaffType"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="newRole">
        <div class="line"></div>
        <div style="padding-top: 10px;padding-bottom: 28px;">
          <span class="staffLeft">姓名</span>
          <el-input
            v-model="editPeople.personName"
            placeholder="请填写新增人员的姓名"
            size="small"
            class="newName"
          ></el-input>
        </div>
        <div style="padding-top: 10px;padding-bottom: 10px;">
          <span class="staffLeft">联系电话</span>
          <el-input
            v-model="editPeople.personTelephone"
            placeholder="请填写新增人员的联系电话"
            size="small"
            class="newName"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editStaffType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveEditPeople" size="small">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editPeople: {
        //编辑人员数据
        departId: "",
        personName: "",
        personTelephone: ""
      },
      newPeople: {
        //新增人员数据
        departId: "",
        personName: "",
        personTelephone: ""
      },
      personnelData: [], //人员数据
      selectDepartId: "", //选中的部门id
      editData: {}, //
      editGroupName: "", //编辑分组名称
      newGroupName: "", //创建新分组名称
      newStaffType: false, //新增人员状态
      editStaffType: false, //编辑人员状态
      groupingLists: [], // 分组数据
      groupOverId: "", //鼠标移动到哪个分组
      newGroupType: false, // 创建分组弹出框的状态
      editGroupType: false, // 编辑分组出框的状态
      activeIndex: "0" // 当前激活菜单的
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    // 初始化数据
    created_fun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/getAllGroupManage")
        .then(function(res) {
          if (res.data.code == 200) {
            if (res.data.data != undefined) {
              self.groupingLists = res.data.data;
              if (self.groupingLists.length != 0) {
                let num = Number(self.activeIndex);
                self.groupingLists[num].messageManages != undefined
                  ? (self.personnelData =
                      self.groupingLists[num].messageManages)
                  : (self.personnelData = []);
                self.selectDepartId = self.groupingLists[num].id;
              }
            } else {
              self.groupingLists = [];
              self.personnelData = [];
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //创建新用户
    createGroupFun() {
      this.newGroupType = true;
      this.newGroupName = "";
    },
    //保存新建分组
    saveCreatedGroup() {
      let self = this;
      if (self.newGroupName != undefined) {
        self.newGroupName = self.newGroupName.trim();
      }

      if (this.newGroupName == "") {
        this.$message.warning("请填写分组名称！");
        return;
      }
      let params = {
        departName: self.newGroupName
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/createGroupDepart",
        params,
        res => {
          self.$message.success(res.msg);
          self.newGroupType = false;
          self.created_fun();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //编辑分组
    editGroup(item) {
      this.editData = item;
      this.editGroupType = true;
      this.editGroupName = item.departName;
    },
    //保存编辑
    saveEditGroup() {
      let self = this;
      if (this.editGroupName != undefined) {
        this.editGroupName = this.editGroupName.trim();
      }

      if (this.editGroupName == "") {
        this.$message.warning("请填写分组名称！");
        return;
      }
      let params = {
        id: self.editData.id,
        departName: self.editGroupName
      };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/updateGroupDepart",
        params,
        res => {
          self.$message.success(res.msg);
          self.editGroupType = false;
          self.created_fun();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //删除分组
    deleGroup(item) {
      let self = this;
      this.$confirm("确定要删除该分组么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            departId: item.id
          }
        };
        self.$axios
          .get(self.$portMain + "/stock/deleteGroupDepart", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              self.created_fun();
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    //选中分组
    selectGroup(item, index) {
      this.activeIndex = String(index);
      this.selectDepartId = item.id;
      if (item.messageManages != undefined) {
        this.personnelData = item.messageManages;
      } else {
        this.personnelData = [];
      }
    },
    //鼠标移动移入事件
    teamManOver(id) {
      this.groupOverId = id;
    },
    //鼠标移动移出事件
    teamManOut() {
      this.groupOverId = "";
    },
    //新增人员
    newStaffFun() {
      let self = this;
      this.newStaffType = true;
      this.newPeople = {
        //新增人员数据
        departId: self.selectDepartId,
        personName: "",
        personTelephone: ""
      };
    },
    //保存新增人员
    saveCreatedPeople() {
      let self = this;
      if (this.newPeople.personName != undefined) {
        this.newPeople.personName = this.newPeople.personName.trim();
      }

      if (this.newPeople.personName == "") {
        self.$message.warning("请填写新增人员的姓名!");
        return;
      }
      if (this.newPeople.personTelephone != undefined) {
        this.newPeople.personTelephone = this.newPeople.personTelephone.trim();
      }

      if (this.newPeople.personTelephone == "") {
        self.$message.warning("请填写新增人员的联系电话!");
        return;
      }

      if (!this.$v.verifyMobile(self.newPeople.personTelephone)) {
        self.$message.warning("请填写正确的电话号码!");
        return;
      }

      this.$api.formdataPostFun(
        self.$portMain + "/stock/createGroupPerson",
        self.newPeople,
        res => {
          self.$message.success(res.msg);
          self.newStaffType = false;
          self.created_fun();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //编辑人员
    editPeopleFun(elem) {
      let self = this;
      this.editStaffType = true;
      this.editPeople = {
        //编辑人员数据
        id: elem.id,
        personName: elem.personName,
        personTelephone: elem.personTelephone
      };
    },
    //提交编辑
    saveEditPeople() {
      let self = this;
      if (this.editPeople.personName != undefined) {
        this.editPeople.personName = this.editPeople.personName.trim();
      }

      if (this.editPeople.personName == "") {
        self.$message.warning("请填写新增人员的姓名!");
        return;
      }
      if (this.editPeople.personTelephone != undefined) {
        this.editPeople.personTelephone = this.editPeople.personTelephone.trim();
      }

      if (this.editPeople.personTelephone == "") {
        self.$message.warning("请填写新增人员的联系电话!");
        return;
      }

      if (!this.$v.verifyMobile(self.editPeople.personTelephone)) {
        self.$message.warning("请填写正确的电话号码!");
        return;
      }

      this.$api.formdataPostFun(
        self.$portMain + "/stock/updateGroupPerson",
        self.editPeople,
        res => {
          self.$message.success(res.msg);
          self.editStaffType = false;
          self.created_fun();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //删除人员
    delePeople(item) {
      let self = this;
      this.$confirm("确定要删除该人员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            personId: item.id
          }
        };
        self.$axios
          .get(this.$portMain + "/stock/deleteGroupPerson", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              self.created_fun();
              // self.$forceUpdate();
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
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

    .topMenuWrap {
      display: flex;
      justify-content: space-between;
    }
  }

  .leftMenu {
    border: 1px solid #e9eef5;
    border-top: 0;
    overflow-y: scroll;

    .roleRightBtnSpan {
      color: $base-color;
      float: right;
    }

    .roleLeftBtnSpan {
      float: left;
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

  .rightBottomMenu {
    height: 728px;
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
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .newName {
      width: 240px;
    }
  }

  .conentStyle {
    margin-top: 20px;

    // padding-left: 62px;
    // padding-right: 86px;
    .item {
      color: #232426;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      margin-left: 69px;
      margin-right: 30px;
      margin-bottom: 24px;

      .itemLeft {
        width: 126px;
      }

      .itemRight {
        width: 59px;
      }

      // width: 178px;
      i {
        cursor: pointer;
      }
    }

    .itemTwo {
      text-align: center;
      color: #8A9199;
      font-size: 23px;
      padding-top: 80px;
    }
  }

  .staffLeft {
    display: inline-block;
    font-size: 14px;
    color: #8A9199;
    width: 56px;
    text-align: right;
  }
}
</style>