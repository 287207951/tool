<template>
  <div class="conBigDiv stytemResource" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统资源</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="18">
          <div class="topMenuLeft">
            <el-input
              class="width140"
              v-model="keyWord"
              placeholder="资源名称/路径"
              size="small"
              @blur="searchFun"
              @keydown.enter.native="searchFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="titleTip">状态</span>
            <el-select v-model="expired" placeholder="请选择" size="small" @change="searchFun">
              <el-option v-for="item in expiredData" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="topMenuRight">
            <el-button type="primary" size="small" @click="newItem">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="systemData"
        border
        stripe
        height="700"
        :summary-method="getSummaries"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="resourceName" header-align="center" align="center" label="资源名称"></el-table-column>
        <el-table-column prop="resourcePath" label="路径" header-align="center" align="center"></el-table-column>
        <el-table-column prop="resourceDesc" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="authName" label="所需权限" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="expired" label="状态" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="edit" @click.stop="editFun(scope.row)">编辑</span>
            <span class="del" @click.stop="delFun(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>
      <!-- 新增资源 -->
      <el-dialog
        title="新增资源"
        :visible.sync="newTemplateType"
        width="720px"
        :close-on-click-modal="false"
      >
        <div class="newTemplateStyle">
          <div class="line"></div>
          <el-row>
            <el-col :span="12" class="item">
              <span class>资源名称</span>
              <el-input
                v-model="resourceName"
                placeholder="请填写编码类型的值"
                size="small"
                class="inputWidth"
              ></el-input>
              <span class="red_font">*</span>
            </el-col>
            <el-col :span="12" class="item">
              <span style="margin-left: 26px;">所需权限</span>
              <el-select
                v-model="authValue"
                filterable
                placeholder="请选择权限值"
                size="small"
                class="selectWidth"
              >
                <el-option
                  v-for="item in needPowerData"
                  :key="item.authId"
                  :label="item.authName"
                  :value="item.authValue"
                ></el-option>
              </el-select>
              <span class="red_font">*</span>
            </el-col>
            <el-col :span="24">
              <span class>访问路径</span>
              <el-input
                v-model="resourcePath"
                placeholder="请填写访问路径"
                size="small"
                class="inputWidth566"
              ></el-input>
              <span class="red_font">*</span>
            </el-col>
            <el-col :span="24" style="display:flex;margin-top: 40px;">
              <span class>资源说明</span>
              <textarea
                name
                id
                class="textAreaStyle"
                v-model="resourceDesc"
                placeholder="请对系统资源进行说明（100字以内）"
              ></textarea>
            </el-col>
          </el-row>
        </div>
        <div class="layer"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newTemplateType = false" size="small">取 消</el-button>
          <el-button type="primary" @click="saveCreat" size="small">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 编辑资源 -->
      <el-dialog
        title="编辑资源"
        :visible.sync="editTemplateType"
        width="720px"
        :close-on-click-modal="false"
      >
        <div class="newTemplateStyle">
          <div class="line"></div>
          <el-row>
            <el-col :span="12" class="item">
              <span class>资源名称</span>
              <el-input
                v-model="editResourceName"
                placeholder="请填写编码类型的值"
                size="small"
                class="inputWidth"
              ></el-input>
              <span class="red_font">*</span>
            </el-col>
            <el-col :span="12" class="item">
              <span style="margin-left: 26px;">所需权限</span>
              <el-select
                v-model="editAuthValue"
                filterable
                placeholder="请选择权限值"
                size="small"
                class="selectWidth"
              >
                <el-option
                  v-for="item in needPowerData"
                  :key="item.authId"
                  :label="item.authName"
                  :value="item.authValue"
                ></el-option>
              </el-select>
              <span class="red_font">*</span>
            </el-col>
            <el-col :span="24">
              <span class>访问路径</span>
              <el-input
                v-model="editResourcePath"
                placeholder="请填写访问路径"
                size="small"
                class="inputWidth566"
              ></el-input>
              <span class="red_font">*</span>
            </el-col>
            <el-col :span="24" style="display:flex;margin-top: 40px;">
              <span class>资源说明</span>
              <textarea
                name
                id
                class="textAreaStyle"
                v-model="editResourceDesc"
                placeholder="请对系统资源进行说明（100字以内）"
              ></textarea>
            </el-col>
          </el-row>
        </div>
        <div class="layer"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editTemplateType = false" size="small">取 消</el-button>
          <el-button type="primary" @click="saveEdit" size="small">保 存</el-button>
        </span>
      </el-dialog>
      <!--  -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      editResourceName: "", //资源名称
      editResourcePath: "", //访问路径
      editResourceDesc: "", //资源说明
      editAuthValue: "", //编辑所需权限值
      editData: [], //编辑数据
      resourceName: "", //资源名称
      authValue: "", //所需权限
      resourcePath: "", //访问路径
      resourceDesc: "", //资源说明
      needPowerData: [], //所需权限数据
      input: "", //模拟
      keyWord: "", //关键字搜索
      editImgUrl: "", //编辑图片路径
      pcode: "", //数据回填一级品目和一级系列
      logoImg: "", //新增系列图片
      expiredData: ["全部", "已失效", "有效"], //状态
      expired: "", //状态值
      codeFilterData: "", // 编码筛选条件数据
      options: [],
      systemData: [], //系统资源数据
      newTemplateType: false, //新增编码管理弹出框状态
      editTemplateType: false, // 编辑编码管理弹出框状态
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData();
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let expiredValue = "";
      if (self.expired == "全部") {
        expiredValue = "";
      } else {
        expiredValue = self.expired;
      }

      let params = {
        PRS: {
          keyWord: self.keyWord,
          expired: expiredValue,
          pageIndex: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/queryRes", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.systemData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.systemData.forEach(item => {
              item.createTime = self.$api.dateGetDayTime(item.createTime);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 获取编码筛选
    getCodeFilterData() {
      var self = this;
      this.$axios.post(this.$portMain + "/code/sys").then(function(res) {
        if (res.data.code == 200) {
          self.codeFilterData = res.data.data;
        }
      });
    },
    // 新增保存
    saveCreat() {
      let self = this;
      if (self.resourceName == "") {
        self.$message.error("请输入资源名称！");
        return;
      }

      if (self.authValue == "") {
        self.$message.error("请选择权限值！");
        return;
      }

      if (self.resourcePath == "") {
        self.$message.error("请填写权限路径！");
        return;
      }

      let params = {
        PRS: {
          resourceName: self.resourceName,
          authValue: self.authValue,
          resourcePath: self.resourcePath,
          resourceDesc: self.resourceDesc
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/addRes", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.newTemplateType = false;
              self.displayAllData();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 编辑保存
    saveEdit() {
      let self = this;
      if (self.editResourceName == "") {
        self.$message.error("请输入资源名称！");
        return;
      }

      if (self.editAuthValue == "") {
        self.$message.error("请选择权限值！");
        return;
      }

      if (self.editResourcePath == "") {
        self.$message.error("请填写权限路径！");
        return;
      }

      let params = {
        PRS: {
          resourceId: this.editData.resourceId,
          resourceName: this.editResourceName,
          authValue: this.editAuthValue,
          resourcePath: this.editResourcePath,
          resourceDesc: this.editResourceDesc
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/updateRes", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.editTemplateType = false;
              self.displayAllData(1, 12);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 删除
    delFun(item) {
      let self = this;
      this.$confirm("确定要删除该条资源么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            resourceId: item.resourceId
          }
        };
        this.$axios
          .get(this.$portMain + "/sys/delRes", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              setTimeout(function() {
                self.displayAllData(1, 12);
              }, 2000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 7) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    //编辑
    editFun(elem) {
      this.getNeedPowerData();
      this.editData = elem;
      var self = this;
      this.editTemplateType = true;
      this.editAuthValue = elem.authValue;
      this.editResourceName = elem.resourceName; //资源名称
      this.editResourcePath = elem.resourcePath; //访问路径
      this.editResourceDesc = elem.resourceDesc; //资源说明
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    // 新增
    newItem() {
      this.getNeedPowerData();
      this.resourceName = "";
      this.authValue = "";
      this.resourcePath = "";
      this.resourceDesc = "";
      this.newTemplateType = true;
    },
    //获取所需权限数据
    getNeedPowerData() {
      let self = this;
      let params = {
        PRS: {
          pageIndex: 1,
          rows: 1000,
          keyWord: ""
        }
      };
      this.$axios
        .get(this.$portMain + "/sys/queryAuths", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.needPowerData = res.data.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //搜索
    searchFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
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

  .topMenuLeft {
    .width140 {
      width: 200px;
    }

    .titleTip {
      margin-left: 24px;
      font-size: 12px;
      color: #8A9199;
    }
  }

  .topMenuRight {
    text-align: right;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontSize {
    color: #8A9199;
    font-size: 12px;
  }

  .edit {
    color: #F20F34;
    cursor: pointer;
  }

  .del {
    color: rgb(230, 162, 60);
    cursor: pointer;
  }

  .newTemplateStyle {
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
      width: 200px;
    }

    .inputWidth566 {
      width: 566px;
    }

    .item {
      margin-bottom: 40px;

      .titleWidth {
        display: inline-block;
        width: 57px;
        height: 14px;
        text-align: right;
      }
    }

    .textAreaStyle {
      width: 560px;
      height: 60px;
      border-radius: 2px;
      margin-left: 8px;
      border: 1px solid #CFD9E6;
      resize: none;
    }
  }

  .layer {
    clear: both;
  }

  .selectWidth {
    width: 200px;
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

<style>
.stytemResource .el-table__header th {
  background-color: #dae5f2;
}
</style>

