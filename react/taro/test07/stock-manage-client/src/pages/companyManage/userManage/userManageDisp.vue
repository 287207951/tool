<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="20">
            <el-input
              @keyup.enter.native="searchFun"
              placeholder="请输入关键字搜索"
              style="width:265px"
              size="small"
              v-model="searchTxt"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="topTitle">可用状态：</span>
            <el-select v-model="statu" placeholder="请选择" size="small" @change="searchFun">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="topBtn">
            <el-button
              type="primary"
              size="small"
              @click="createUserFun"
              v-if="powerCreat == 'true'"
            >新建</el-button>
            <!-- <el-button type="warning" size="small" v-show="delBtnTF">删除</el-button> -->
          </el-col>
        </el-row>
      </div>
      <div>
        <!-- @selection-change="handleSelectionChange" -->
        <el-table :data="userData" @row-dblclick="editUser" style="width: 100%;margin-top:30px">
          <!-- <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column> -->
          <!-- <el-table-column prop label="头像">
            <template slot-scope="scope">
              <img src="../../../../static/images/img-noimg.png" alt class="headImage">
            </template>
          </el-table-column>-->
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="concat" label="姓名"></el-table-column>
          <el-table-column prop="telephone" label="手机号"></el-table-column>
          <el-table-column prop="mail" label="邮箱地址"></el-table-column>
          <el-table-column prop="phone" label="办公电话"></el-table-column>
          <el-table-column prop="roleName" label="用户角色"></el-table-column>
          <el-table-column prop="deptName" label="所属部门"></el-table-column>
          <el-table-column prop="statu" label="可用状态">
            <template slot-scope="scope">
              <span v-if="scope.row.statu == 'E'">已启用</span>
              <span v-if="scope.row.statu == 'D'" style="color:#8A9199">被禁用</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="customerSize"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerCreat: "false", //新增按钮权限
      loading: true,
      searchTxt: "", // 查询条件
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "E",
          label: "启用"
        },
        {
          value: "D",
          label: "禁用"
        }
      ],
      statu: "",
      multipleSelection: [], //选择多选择框数据
      delBtnTF: false, //删除按钮显示/隐藏默认隐藏
      userData: [], //员工数据列表
      customerSize: 0, //客户数据记录
      pageSize: 12, //每页显示客户记录数
      pageNum: 1 //分页页码默认为1
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.userViewFun();
      this.powerFun();
    },
    //查询所有职员信息(列表数据)
    userViewFun() {
      this.loading = true;
      var self = this;
      let params = {
        page: self.pageNum,
        rows: self.pageSize,
        keyWord: self.searchTxt,
        statu: self.statu
      };
      this.$api.formdataPostFun(
        self.$portMain + "/account/sub",
        params,
        res => {
          if (res.code == 200) {
            if (res.data.data != undefined) {
              self.userData = res.data.data;
              self.customerSize = res.data.rowSize;
            } else {
              self.userData = [];
              self.customerSize = 0;
            }
          } else {
            self.$message.error(res.msg);
          }
          self.loading = false;
        },
        err => {
          self.$message.error(err.msg);
          self.loading = false;
        }
      );
      // this.$axios
      //   .post(self.$portMain + "/account/sub", self.userPortInfo)
      //   .then(function(res) {
      //     if (res.data.code == 200) {
      //       if (res.data.data != undefined) {
      //         self.userData = res.data.data.data;
      //         self.customerSize = res.data.data.rowSize;
      //       } else {
      //         self.userData = [];
      //         self.customerSize = 0;
      //       }
      //     } else {
      //       self.$message.error(res.data.msg);
      //     }
      //   });
    },
    //创建新员工
    createUserFun() {
      this.$router.push("/Index/userManageCreate");
    },
    //改变多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.multipleSelection == 0) {
        this.delBtnTF = false;
      } else {
        this.delBtnTF = true;
      }
    },
    //员工详细编辑
    editUser(elem) {
      this.$router.push({
        path: "/Index/userManageView",
        query: elem
      });
    },
    handleSizeChange(val) {
      this.pageNum = 1; //默认第一页
      this.pageSize = val; //改变每页显示多少条记录
      this.userViewFun();
    },
    handleCurrentChange(val) {
      this.pageNum = val; //默认第一页
      this.userViewFun();
    },
    // 按条件筛选
    searchFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //改变每页显示多少条记录
      this.userViewFun();
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
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

  .topBtn {
    text-align: right;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .topTitle {
    color: #8A9199;
    font-size: 12px;
    margin-left: 24px;
  }

  .headImage {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #CFD9E5;
  }
}
</style>