<template>
  <div class="conBigDiv powerMange setpowerPage" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
    </div>
    <div>
      <el-row>
        <el-col :span="5" class="leftMenu">
          <div class="topMenu">权限模块</div>
          <el-menu default-active="0" class="el-menu-vertical-demo userMenu">
            <el-menu-item
              v-for="(item,index) in userLists"
              :key="item.catalogId"
              :index="index+''"
              class="userDiv"
              @click="queryPowerInfor(item.catalogId)"
            >
              <span slot="title">{{item.catalogName}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="19">
          <div class="topMenu">权限设置</div>
          <el-row>
            <el-col :span="8" class="topSecodeMenu">
              <el-button type="danger" size="small" @click="newPowerMange">新建</el-button>
            </el-col>
            <el-col :span="16" class="toRight" v-show="false">
              <span class="titleTip">状态</span>
              <el-select v-model="input" placeholder="请选择" size="small" disabled>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                class="width280"
                v-model="keyWord"
                placeholder="产品名称/产品编码"
                size="small"
                disabled
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="powerDetailData" border style="width: 99%;" height="642" class="tabMarg">
            <el-table-column type="index" width="40" header-align="center" align="center" label="序"></el-table-column>
            <el-table-column prop="authName" label="权限名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="authValue" label="值" header-align="center" align="center"></el-table-column>
            <el-table-column prop="authDesc" label="权限说明" header-align="center" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
            <el-table-column label="状态" width="170" header-align="center" align="center">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.statu" @change="selectStatu(scope.row)">
                  <el-radio label="E">启用</el-radio>
                  <el-radio label="D">禁用</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" header-align="center" align="center">
              <template slot-scope="scope">
                <span @click="delCode(scope.row)" style="color:#F2930F;cursor: pointer;">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 新增权限 -->
      <el-dialog
        title="新增权限项"
        :visible.sync="newPowerType"
        width="720px"
        :close-on-click-modal="false"
      >
        <div class="newPowerStyle">
          <div class="line"></div>
          <div class="item">
            <span class>权限名称</span>
            <el-input v-model="authName" placeholder="请填写权限名称" size="small" class="inputWidth"></el-input>
            <span class="red_font">*</span>
          </div>
          <div class="itemSecond">
            <span class>权限值</span>
            <el-input v-model="authValue" placeholder="请填写权限值" size="small" class="inputWidth"></el-input>
            <span class="red_font">*</span>
          </div>
          <div class="item marginTop textAreaStyle">
            <span class>权限说明</span>
            <textarea class="textWidth" name id placeholder="请对权限资源进行说明（100字以内）" v-model="authDesc"></textarea>
          </div>
        </div>
        <div class="layer"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newPowerType = false" size="small">取 消</el-button>
          <el-button type="primary" @click="newPowerFun" size="small">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      catalogId: "", // 权限目录ID
      authValue: "",
      authName: "",
      authDesc: "",
      keyWord: "", //搜索关键字
      pageIndex: 1, //当前页
      rows: 10, //每页行数
      rowSize: "", //总数据量
      options: [
        {
          value: "全部状态",
          label: "全部状态"
        },
        {
          value: "状态1",
          label: "状态1"
        },
        {
          value: "状态2",
          label: "状态2"
        }
      ],
      value: "全部状态",
      powerDetailData: [], //权限资源数据
      input: "", //暂时输入框数据
      userLists: [], //权限目录
      newPowerType: false // 新增权限弹出框状态
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.getList();
    },
    //获取目录
    getList() {
      this.loading = true;
      let self = this;
      this.$axios
        .get(this.$portMain + "/sys/queryAuthCatalog")
        .then(function(res) {
          if (res.data.code == 200) {
            self.userLists = res.data.data;
            self.catalogId = self.userLists[0].catalogId;
            self.queryPowerInfor(self.catalogId);
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        });
    },
    // 删除
    delCode(elem) {
      let self = this;
      this.$confirm("确定要删除该权限项吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            authId: elem.authId
          }
        };
        this.$axios
          .get(this.$portMain + "/sys/delAuth", params)
          .then(function(res) {
            if (res.data.code == 200 || res.data.code == 201) {
              self.$message.success(res.data.msg);
              setTimeout(function() {
                self.queryPowerInfor(self.catalogId);
              }, 2000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    // 新增权限项
    newPowerMange() {
      this.newPowerType = true;
      this.authValue = "";
      this.authName = "";
      this.authDesc = "";
    },
    //查询权限资源数据
    queryPowerInfor(id) {
      let self = this;
      this.catalogId = id;
      let params = {
        PRS: {
          catalogId: id
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/queryAuthsByCatalog", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.powerDetailData = res.data.data;
            self.powerDetailData.forEach(item => {
              item.createTime = self.$api.dateGetDayTime(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //创建权限资源
    newPowerFun() {
      let self = this;
      if (self.authName == "") {
        self.$message.error("请填写权限名称！");

        return;
      }
      if (self.authValue == "") {
        self.$message.error("请填写权限值！");
        return;
      }
      let params = {
        PRS: {
          catalogId: self.catalogId,
          authValue: self.authValue,
          authName: self.authName,
          authDesc: self.authDesc,
          statu: "E"
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/createAuth", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.newPowerType = false;
              self.queryPowerInfor(self.catalogId);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //选择状态
    selectStatu(item) {
      let self = this;
      let params = {
        PRS: {
          authId: item.authId,
          authValue: item.authValue,
          authName: item.authName,
          statu: item.statu
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/updateAuth", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.queryPowerInfor(self.catalogId);
          } else {
            self.$message.error(res.data.msg);
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
    height: 49px;
    font-size: 16px;
    padding: 10px;
    border-top: 1px solid #e9eef5;
    box-sizing: border-box;
    border-bottom: 1px solid #e9eef5;
  }

  .topSecodeMenu {
    height: 49px;
    font-size: 16px;
    padding: 10px;
    box-sizing: border-box;
  }

  .toRight {
    text-align: right;
    padding-top: 6px;
    padding-right: 10px;
    border-top: 1px solid #e9eef5;

    .width280 {
      width: 280px;
      margin-left: 24px;
    }

    .titleTip {
      font-size: 12px;
      color: #8A9199;
    }
  }

  .leftMenu {
    border: 1px solid #e9eef5;
    border-top: 0;

    .roleRightBtnSpan {
      color: $base-color;
      float: right;
    }

    .userMenu {
      height: 700px;
      border-top: 1px #f0f0f0 solid;
      overflow-y: scroll;

      .userDiv {
        border-bottom: 1px #f0f0f0 solid;
      }
    }
  }

  .tabMarg {
    margin: 10px 10px 0 10px;
  }

  .el-table .has-gutter th {
    background: #f4f4f4 !important;
    font-size: large;
  }

  .newPowerStyle {
    position: relative;

    .line {
      width: 720px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth {
      width: 240px;
    }

    .item {
      float: left;
    }

    .itemSecond {
      float: right;
    }

    .marginTop {
      margin-top: 30px;
    }

    .textAreaStyle {
      display: flex;

      .textWidth {
        margin-left: 8px;
        width: 586px;
        height: 60px;
        border-radius: 2px;
        border: 1px solid #CFD9E6;
        resize: none;
      }
    }
  }

  .layer {
    clear: both;
  }
}
</style>

<style>
.powerMange .el-table__header th {
  background-color: #dae5f2;
}

.setpowerPage .el-radio-group label:first-child {
  margin-right: 0px;
}
</style>
