<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="12">
          <div class="departTitle">下属部门</div>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="primary" size="small" @click="editDepart" v-if="powerEdit == 'true'">编辑</el-button>
        </el-col>
      </el-row>
      <div class="departWrap">
        <el-row>
          <el-col :span="12" v-for="item in branchAllData" :key="item.deptId" class="branchD">
            {{item.deptName}}
            <br />
            <div class="DepartD" @click="branchView(item)">部门成员共{{item.manNum}}人</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 查看部门信息 -->
    <el-dialog
      title="查看部门信息"
      :visible.sync="branchVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="dialogWrap">
        <div class="line"></div>
        <div>
          部门名称：
          {{branchSubData.deptName}}
          <!-- <el-input placeholder="请输入人名查找成员" v-model="manSearch" class="input50" size="small">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>-->
        </div>
        <div class="selectManDiv">
          <div v-if="branchSubData.members == undefined">此部门暂无员工！</div>
          <div v-else>
            <div
              v-for="(man,index) in branchSubData.members"
              :key="index"
              class="checkboxDiv"
            >{{index+1}}:{{man.concat}}</div>
          </div>
        </div>
      </div>
      <div class="layer" style="clear: both"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="branchVisible = false" size="small">取 消</el-button>
        <!-- <el-button type="primary" @click="selectManFun" size="small">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerEdit: "false", //编辑按钮权限
      manSearch: "", //员工搜索
      branchSubData: {}, //选择部门数据
      branchVisible: false, //部门人员信息弹出框
      branchAllData: [], //下属部门数据
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
      this.powerFun();
    },
    displayAllData() {
      let self = this;
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
          //self.$message.error(res.data.msg);
        }
      });
    },
    //看看部门
    branchView(elem) {
      var self = this;
      self.branchSubData = elem;
      self.branchVisible = true;
    },
    //编辑部门
    editDepart() {
      this.$router.push("departmentManageEdit");
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerEdit = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "company-edit-depart"
      );
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

  .departTitle {
    font-size: 16px;
    font-weight: bold;
    color: #2E3033;
  }

  .departWrap {
    margin-top: 28px;
    margin-left: 53px;

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
      height: 36px;
      line-height: 36px;
      margin-top: 10px;
    }
  }

  .input50 {
    margin-left: 50px;
    width: 50%;
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

  .dialogWrap {
    position: relative;
    margin-bottom: 48px;

    .line {
      width: 700px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }
  }
}
</style>
