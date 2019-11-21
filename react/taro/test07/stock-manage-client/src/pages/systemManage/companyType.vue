<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司类型</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
    </div>
    <div>
      <el-row>
        <el-col :span="5" class="leftMenu">
          <div class="topMenu">公司类型</div>
          <ul class="menuWrap">
            <li
              v-for="(userList, index ) in userLists"
              :key="userList.typeName"
              @click="selectRole(userList.typeName, index)"
              :class="{'hoverStyle':firstActiveIndex == index}"
            >{{userList.typeAbbr}}</li>
          </ul>
        </el-col>
        <el-col :span="19">
          <div class="topMenu">角色权限设置</div>
          <div class="conentStyle">
            <el-row>
              <el-col :span="4" class="roleStyle">
                <ul class="ulWrap">
                  <li
                    v-for="(authoList, index) in authoLists"
                    @click="anchors(authoList.catalogId,index)"
                    :class="{'hoverStyle':secondActiveIndex == index}"
                    :key="index"
                  >{{authoList.catalogName}}</li>
                </ul>
              </el-col>
              <el-col :span="20" class="rightBottomMenu">
                <div
                  class="roleAuthoDiv"
                  v-for="authoList in authoLists"
                  :key="authoList.catalogId"
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
            <el-button type="primary" size="small" @click="saveEditPower">保存</el-button>
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
      loading: false,
      userLists: [], // 公司初始数据
      authoLists: [], // 公司权限列表数据
      firstActiveIndex: "0", // 一级菜单
      secondActiveIndex: "0", //二级菜单
      companyTypeName: "", // 公司类型名
      saveType: false, // 底部状态
      oldAuthIds: [] // 原始的authIds数据
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    ...mapMutations(["updataQueryVerify"]),
    // 初始化数据
    created_fun() {
      this.loading = true;
      let self = this;
      this.$axios.get(this.$portMain + "/sys/typeList").then(function(res) {
        if (res.data.code == 200) {
          self.userLists = res.data.data.data;
          self.companyTypeName = res.data.data.data[0].typeName;
          self.companyPower(res.data.data.data[0].typeName);
          // self.activeIndex = "0";
        } else {
          self.$message.error(res.data.msg);
        }
        self.loading = false;
      });
    },
    // 查询角色的权限
    companyPower(name) {
      let self = this;
      let params = {
        PRS: {
          typeName: name
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/typeAuths", params)
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
      this.saveShow();
      this.$forceUpdate();
    },
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
          typeName: self.companyTypeName,
          authIds: authIds
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/updateAuths", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            // self.created_fun();
            self.getPower();
            self.secondActiveIndex = "0";
            self.companyPower(self.companyTypeName);
            self.backTop();
            self.saveType = false;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 保存的状态
    saveShow() {
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
      this.created_fun();
      this.saveType = false;
      // this.activeIndex = '0';
    },
    // 手动选择角色权限
    selectRole(name, index) {
      this.companyTypeName = name;
      this.companyPower(name);
      this.firstActiveIndex = index + "";
      this.secondActiveIndex = "0";
      this.$forceUpdate();
    },
    // 锚点
    anchors(elem, index) {
      this.secondActiveIndex = index;
      // this.secondActiveIndex = index + "";
      let domId = "hash" + elem;
      document.getElementById(domId).scrollIntoView();
      // this.$forceUpdate();
    },
    //三级模块回到顶部authoLists
    backTop() {
      let domId = "hash" + this.authoLists[0].catalogId;
      document.getElementById(domId).scrollIntoView();
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

    .roleRightBtnSpan {
      color: $base-color;
      float: right;
    }

    .roleLeftBtnSpan {
      float: left;
    }

    .userMenu {
      height: 774px;
      border-top: 1px #f0f0f0 solid;
      overflow-y: scroll;

      .userDiv {
        border-bottom: 1px #f0f0f0 solid;
        overflow: hidden;
      }
    }
  }

  .rightBottomMenu {
    height: 676px;
    overflow-x: auto;
    // margin-bottom: 26px;
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

  .footerStyle {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 55.4%;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 6px 0px 10px rgba(0, 0, 0, 0.1);
    text-align: right;
    line-height: 50px;
    padding-right: 25px;
  }

  .roleStyle {
    border-right: solid 1px #e6e6e6;
    border-bottom: solid 1px #e6e6e6;
    height: 775px;
    // overflow-y: scroll;
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
    height: 774px;

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
      border-bottom: 1px #f0f0f0 solid;

      &:hover {
        background: rgb(253, 231, 235);
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