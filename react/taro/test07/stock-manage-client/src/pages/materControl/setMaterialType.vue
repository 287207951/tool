<template>
  <div class="conBigDiv" ref="setMaterialType" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>料种类</el-breadcrumb-item>
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
        <el-table-column header-align="center" align="center" prop="kind_name" label="料种类"></el-table-column>
        <el-table-column header-align="center" align="center" prop="type_name" label="料类型"></el-table-column>
        <el-table-column header-align="center" align="center" prop="createname" label="创建人"></el-table-column>
        <el-table-column header-align="center" align="center" prop="createtime" label="创建时间"></el-table-column>
        <el-table-column header-align="center" align="center" prop="e" label="操作">
          <template slot-scope="scope">
            <span style="color: #E8B409" @click="delFun(scope.row)" v-if="powerCreat == 'true'">删除</span>
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
    <!-- 新增料种类 -->
    <el-dialog
      title="新增料种类"
      :visible.sync="createdMaterialType"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="materialStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <span>料种类</span>
            <el-input
              v-model="stockSetKind"
              placeholder="请输入料种类名称"
              size="small"
              style="width:240px"
            ></el-input>
          </el-col>
          <el-col :span="24" style="margin-top:32px">
            <span>料类型</span>
            <el-select
              size="small"
              style="width:240px"
              v-model="setTypelist"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in stockSetTypeList"
                :key="item.id"
                :label="item.material_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdMaterialType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreated" size="small" :loading="btnSaveLoading">保存</el-button>
      </span>
    </el-dialog>
    <!-- 提示删除 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="materialStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <span>确定要删除此选项？</span>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="promptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerCreat: "false", //新增编辑按钮权限控制
      btnSaveLoading: false,
      loading: false,
      stockSetKind: "", //金料种类名称
      setTypelist: [], //关联金料类型的id
      stockSetTypeList: [], //料类型数据
      allData: [], //料种类数据
      data3: [
        {
          //模拟
          a: "071104",
          b: "1",
          c: "0.9990",
          d: "李莫北",
          e: "2018-07-13 10:23:56",
          f: "j",
          g: false
        },
        {
          a: "071104",
          b: "1",
          c: "0.9990",
          d: "李莫北",
          e: "2018-07-13 10:23:56",
          f: "c",
          g: false
        },
        {
          a: "071104",
          b: "1",
          c: "0.9990",
          d: "李莫北",
          e: "2018-07-13 10:23:56",
          f: "b",
          g: false
        }
      ],
      tableData2: [
        {
          a: "1121",
          b: "1222"
        },
        {
          a: "1121",
          b: "1222"
        }
      ], //模拟
      tableData: [{}], // 模拟
      input: "", //模拟
      createdMaterialType: false, // 新增料种类状态
      promptType: false, // 删除提示状态
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

      let dom = this.$refs.setMaterialType;
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
      this.displayAllData(1, 15);
    },
    displayAllData() {
      this.loading = true;
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.allData.forEach(item => {
              item.createtime = self.$api.dateGetDayTime(item.createtime);
            });
          } else {
            self.$message.error(res.data.msg);
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
      this.stockSetKind = "";
      this.setTypelist = [];
      this.stockSetFun();
    },
    //查询金料类型
    stockSetFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 保存新建
    saveCreated() {
      let self = this;
      let arr = [];
      this.setTypelist.forEach(item => {
        arr.push(String(item));
      });
      if (this.stockSetKind != undefined) {
        this.stockSetKind = this.stockSetKind.trim();
      }

      if (self.stockSetKind == "" || arr.length == 0) {
        self.$message.error("请填写数据！");
        return;
      }
      let params = {
        stockSetKind: self.stockSetKind,
        setTypelist: arr
      };
      this.btnSaveLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/addstockSetKind", params)
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
    // 删除料种类
    delFun(item) {
      let self = this;
      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            reve_id: item.reve_id
          }
        };
        self.$axios
          .get(self.$portMain + "/stock/deletestockKind", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success(res.data.msg);
              setTimeout(function() {
                self.created_fun();
              }, 2000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
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
