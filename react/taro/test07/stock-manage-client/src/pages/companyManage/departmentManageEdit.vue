<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="12">
          <div class="departTitle">下属部门</div>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="primary" size="small" @click="saveFun">保存</el-button>
        </el-col>
      </el-row>
      <div class="departWrap">
        <el-row>
          <el-col :span="12" v-for="(item,index) in branchAllData" :key="index" class="branchD">
            {{item.deptName}}
            <br />
            <div class="departItem">
              <div class="DepartD" @click="branchView(item)">部门成员共{{item.manNum}}人</div>
              <i class="el-icon-edit-outline red_font" @click="branchView(item)"></i>
              <i class="el-icon-delete red_font" @click="delDepart(item)"></i>
            </div>
          </el-col>
          <el-col :span="12" class="branchBtn">
            <div class="DepartD" @click="branchCreate">
              <i class="el-icon-circle-plus-outline"></i> 创建新部门
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 修改部门信息 -->
    <el-dialog
      title="修改部门信息"
      :visible.sync="branchVisible"
      width="700px"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div>
        <div>
          部门名称：
          <el-input
            placeholder="请输入内容"
            v-model="branchSubData.deptName"
            class="input50"
            size="small"
          ></el-input>
          <!-- <el-input
            v-show="false"
            placeholder="请输入人名查找成员"
            v-model="manSearch"
            class="input50"
            size="small"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>-->
        </div>
        <div class="selectManDiv">
          <div v-if="branchSubData.members == undefined">
            此部门暂无员工！
            <br />
            <el-checkbox-group v-model="selectManList">
              <div v-for="item in noSelectManList" :key="item.userId" class="checkboxDiv">
                <el-checkbox :label="item.userId">{{item.concat}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div v-else>
            <el-checkbox-group v-model="selectManList">
              <div v-for="man in branchSubData.members" :key="man.userId" class="checkboxDiv">
                <el-checkbox :label="man.userId">{{man.concat}}</el-checkbox>
              </div>
              <div v-for="(item,index) in noSelectManList" :key="index" class="checkboxDiv">
                <el-checkbox :label="item.userId">{{item.concat}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="layer" style="clear: both"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="branchVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectManFun" size="small" :loading="editBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建新部门 -->
    <el-dialog
      title="创建新部门"
      :visible.sync="branchCreateVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <div>
        <div>
          部门名称：
          <el-input
            placeholder="请输入内容"
            v-model="branchCreateData.deptName"
            class="input50"
            size="small"
          ></el-input>
          <el-input
            placeholder="请输入人名查找成员"
            v-model="manSearch"
            class="input50"
            size="small"
            @blur="searchTeamMember"
            @keydown.enter.native="searchTeamMember"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="selectManDiv" v-if="filterNoSelectManList.length > 0">
          <el-checkbox-group v-model="branchCreateList">
            <div v-for="item in filterNoSelectManList" :key="item.userId" class="checkboxDiv">
              <el-checkbox :label="item.userId">{{item.concat}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div v-else class="noMember">抱歉，没有找到您要找的成员！</div>
      </div>
      <div class="layer" style="clear: both"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="branchCreateVisible = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="branchCreateFun"
          size="small"
          :loading="creatBtnLoading"
        >创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      creatBtnLoading: false,
      editBtnLoading: false,
      branchCreateList: [], //创建新部门员工选择数组
      manSearch: "", //员工搜索
      branchCreateVisible: false, //创建新部门信息弹出框
      branchCreateData: {}, //创建新部门数据
      noSelectManList: [], //无部门选择人员数组
      filterNoSelectManList: [], //过滤无部门人员
      selectManList: [], //部门选择人员数组
      branchAllData: [], //下属部门数据
      branchSubData: {}, //选择部门数据
      branchVisible: false //部门人员信息弹出框
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
    },
    displayAllData() {
      let self = this;
      //部门列表
      this.$axios.get(this.$portMain + "/company/deptLst").then(function(res) {
        if (res.data.code == 200) {
          self.branchAllData = res.data.data;
          for (var i = 0; i < self.branchAllData.length; i++) {
            if (self.branchAllData[i].members == undefined) {
              self.branchAllData[i].manNum = 0;
            } else {
              self.branchAllData[i].manNum =
                self.branchAllData[i].members.length;
            }
          }
        } else {
          self.$message.error(res.data.msg);
        }
      });
      //查询不在任何一个部门的职员
      this.$axios
        .get(this.$portMain + "/company/queryOutMembers")
        .then(function(res) {
          if (res.data.code == 200) {
            if (res.data.data.length > 0) {
              self.noSelectManList = res.data.data;
              self.filterNoSelectManList = [...self.noSelectManList];
            } else {
              self.noSelectManList = [];
              self.filterNoSelectManList = [];
            }
          } else {
            //self.$message.error(res.data.msg);
          }
        });
    },
    //部分信息查看
    branchView(elem) {
      console.log("编辑数据", elem);
      var self = this;
      self.branchSubData = elem;
      self.selectManList = [];
      if (elem.members != undefined) {
        for (let i = 0; i < elem.members.length; i++) {
          self.selectManList.push(elem.members[i].userId);
        }
      }
      self.branchVisible = true;
    },
    //修改用户确认按钮
    selectManFun() {
      var self = this;
      let memberList = [...self.selectManList];
      if (self.branchSubData.deptName != undefined) {
        self.branchSubData.deptName = self.branchSubData.deptName.trim();
      }

      if (
        self.branchSubData.deptName == undefined ||
        self.branchSubData.deptName == ""
      ) {
        self.$message.warning("请填写部门名称！");
        return;
      }

      let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]{2,6}$");
      if (!reg.test(self.branchSubData.deptName)) {
        self.$message.warning("请输入2-6位英文大小写/数字/中文");
        return;
      }

      let params = {
        deptId: self.branchSubData.deptId,
        deptName: self.branchSubData.deptName,
        memberList: JSON.stringify(memberList)
      };
      this.editBtnLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/company/updateDept",
        params,
        res => {
          self.branchVisible = false;
          self.editBtnLoading = false;
          self.$message.success(res.msg);
          setTimeout(function() {
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
          self.editBtnLoading = false;
        }
      );
    },
    //创建新部门
    branchCreate() {
      this.branchCreateData = {};
      this.branchCreateList = [];
      this.branchCreateVisible = true;
      this.manSearch = "";
      this.filterNoSelectManList = [...this.noSelectManList];
    },
    //创建新部门确认按钮
    branchCreateFun() {
      let self = this;
      if (self.branchCreateData.deptName != undefined) {
        self.branchCreateData.deptName = self.branchCreateData.deptName.trim();
      }

      if (
        self.branchCreateData.deptName == undefined ||
        self.branchCreateData.deptName == ""
      ) {
        self.$message.warning("请填写部门名称！");
        return;
      }

      let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]{2,6}$");
      if (!reg.test(self.branchCreateData.deptName)) {
        self.$message.warning("请输入2-6位英文大小写/数字/中文");
        return;
      }

      let params = {
        deptName: self.branchCreateData.deptName,
        deptMembers: JSON.stringify(self.branchCreateList)
      };
      this.creatBtnLoading = true;
      this.$api.formdataPostFun(
        this.$portMain + "/company/createDept",
        params,
        res => {
          self.$message.success(res.msg);
          self.branchCreateVisible = false;
          self.creatBtnLoading = false;
          setTimeout(function() {
            self.created_fun();
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
          self.creatBtnLoading = false;
        }
      );
      // self.branchCreateVisible = false
    },
    // 删除下属部门
    delDepart(item) {
      let self = this;
      let params = {
        PRS: {
          deptId: item.deptId
        }
      };
      this.$confirm("确定要删除该部门么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.$axios
          .get(this.$portMain + "/company/delDept", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("删除成功！");
              setTimeout(function() {
                self.created_fun();
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    //保存
    saveFun() {
      let self = this;
      self.$message.success("保存成功！");
      setTimeout(function() {
        self.$router.push("departmentManage");
      }, 1000);
    },
    //查询组员
    searchTeamMember() {
      let self = this;
      let nreArr = [];
      if (this.manSearch != undefined) {
        this.manSearch = this.manSearch.trim();
      }
      if (this.noSelectManList.length > 0 && this.manSearch != "") {
        nreArr = this.noSelectManList.filter(item => {
          if (item.concat.includes(self.manSearch)) {
            return item;
          }
        });
      } else if (this.noSelectManList.length > 0 && this.manSearch == "") {
        nreArr = [...self.noSelectManList];
      }
      this.filterNoSelectManList = nreArr;
      this.branchCreateList = [];
    },
    //编辑关闭
    closeFun() {
      this.created_fun();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .red_font {
    color: $base-color;
  }

  .departTitle {
    font-size: 16px;
    font-weight: bold;
    color: #2E3033;
  }

  .departWrap {
    margin-top: 28px;
    margin-left: 53px;

    .departItem {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }

    .branchD {
      margin-top: 20px;
      color: #8A9199;
      font-size: 14px;
    }

    .DepartD {
      width: 70%;
      border-radius: 5px;
      border: 1px #CFD4E5 solid;
      padding-left: 15px;
      cursor: pointer;
      float: left;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
    }

    .branchBtn {
      margin-top: 38px;
      font-size: 14px;

      .DepartD {
        width: 70%;
        color: $base-color;
        border-radius: 5px;
        border: 1px #CFD4E5 solid;
        padding-left: 15px;
        cursor: pointer;
      }
    }
  }

  .input50 {
    width: 38%;
    margin-right: 5%;
  }

  .selectManDiv {
    margin-top: 20px;
    border-top: 1px #f0f0f0 solid;
    padding-top: 20px;

    .checkboxDiv {
      width: 25%;
      float: left;
    }
  }

  .noMember {
    color: #888;
    padding-top: 20px;
    font-size: 18px;
  }
}
</style>
