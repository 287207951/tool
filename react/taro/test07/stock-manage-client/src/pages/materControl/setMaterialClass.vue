<template>
  <div class="conBigDiv" ref="setMaterialClass" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>料类型</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row style="margin-top:20px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="createdFun" v-if="powerCreat == 'true'">新增</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column header-align="center" align="center" type="index" width="100px" label="序号"></el-table-column>
        <el-table-column header-align="center" align="center" prop="material_name" label="料类型"></el-table-column>
        <el-table-column header-align="center" align="center" prop="order_uid_name" label="创建人"></el-table-column>
        <el-table-column header-align="center" align="center" prop="update_time" label="创建时间"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <span style="color: #F20F34" v-if="scope.row.statue == 0" @click="editFun(scope.row)">编辑</span>
            <span style="color: #E8B409" v-if="scope.row.statue == 0" @click="delFun(scope.row)">删除</span>
            <span v-else>- -</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>-->
    </div>
    <!-- 新增料类型 -->
    <el-dialog
      title="新增料类型"
      :visible.sync="createdMaterialType"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="materialStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <span>料类型</span>
            <el-input
              v-model="material_name"
              placeholder="请输入料类型名称"
              size="small"
              style="width:240px"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdMaterialType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreated" size="small" :loading="btnSaveLoading">保存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑料种类 -->
    <el-dialog
      title="编辑料类型"
      :visible.sync="editMaterialType"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="materialStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <span>料类型</span>
            <el-input
              v-model="materialName"
              placeholder="请输入料种类名称"
              size="small"
              style="width:240px"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMaterialType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="small" :loading="editSaveLoading">保存</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerCreat: "false", //新增按钮权限控制
      btnSaveLoading: false,
      editSaveLoading: false,
      loading: false,
      materialName: "", //编辑类型的名称
      allData: [], //类型数据
      editDate: {}, //编辑金料类型数据
      material_name: "", //新增金料类型名称
      input: "", //模拟
      createdMaterialType: false, // 新增料类型状态
      editMaterialType: false, // 编辑料类型状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表

      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
    this.powerFun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.setMaterialClass;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.createdMaterialType == true && altKey && keyCode === 83) {
        self.saveCreated();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
    },
    displayAllData() {
      this.loading = true;
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.allData.forEach(item => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "paragraphRegisterEdit",
        query: { goldId: elem.id }
      });
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },
    // 新建发料
    createdFun() {
      this.createdMaterialType = true;
      this.material_name = "";
    },
    // 保存料类型
    saveCreated() {
      let self = this;
      if (this.material_name != undefined) {
        this.material_name = this.material_name.trim();
      }

      if (self.material_name == "") {
        self.$message.warning("请填写料类型!");
        return;
      }
      let params = {
        material_name: self.material_name
      };
      this.btnSaveLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/addstockSetType", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdMaterialType = false;
              self.btnSaveLoading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnSaveLoading = false;
          }
        });
    },
    // 删除类型
    delFun(item) {
      let self = this;
      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            stockSetId: item.id
          }
        };
        self.$axios
          .get(this.$portMain + "/stock/deletestockSet", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              // self.createdMaterialType = false;
              self.created_fun();
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    // 编辑类型
    editFun(item) {
      this.editMaterialType = true;
      this.editDate = item;
      this.materialName = this.editDate.material_name;
    },
    // 保存编辑
    saveEdit() {
      let self = this;
      if (this.materialName != undefined) {
        this.materialName = this.materialName.trim();
      }

      if (self.materialName == "") {
        self.$message.warning("请填写料类型!");
        return;
      }
      let params = {
        id: this.editDate.id,
        material_name: this.materialName
      };
      this.editSaveLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/updatestockSet", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.editMaterialType = false;
              self.editSaveLoading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.editSaveLoading = false;
          }
        });
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "stock-type-update"
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

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .materialStyle {
    position: relative;

    .line {
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }
  }
}
</style>
