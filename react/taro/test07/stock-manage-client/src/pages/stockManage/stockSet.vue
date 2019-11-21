<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓储管理</el-breadcrumb-item>
      <el-breadcrumb-item>库位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />

      <!-- 筛选 -->
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字查询"
            v-model="searObj.search"
            class="searchTxt"
            size="small"
            @keydown.enter.native="getList"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>

          <span class="fontGray marginLeft24">仓库状态</span>
          <el-select
            v-model="searObj.status"
            @change="getList"
            placeholder="请选择"
            size="small"
            class="width200"
          >
            <el-option
              v-for="item in stockStatusList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>

          <span class="fontGray marginLeft24">仓库类型</span>
          <el-select
            v-model="searObj.type"
            @change="getList"
            placeholder="请选择"
            size="small"
            class="width200"
          >
            <el-option
              v-for="item in stockTypeList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row class="marginTop10">
        <el-col :span="12">
          <el-button type="primary" size="small" @click="createdFun">新增</el-button>
          <!-- <el-button type="danger" size="small" plain @click="delFun">删除</el-button> -->
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="secName" label="仓库名称"></el-table-column>
        <el-table-column prop="wareName" label="仓库类型"></el-table-column>
        <el-table-column prop="secId" label="所属部门"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createTimeTxt" label="创建时间"></el-table-column>
        <el-table-column prop="statusTime" label="盘点时间"></el-table-column>
        <el-table-column prop="typeTxt" label="可用状态"></el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[12, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>

    <!-- 提示 -->
    <el-dialog
      title="创建仓库"
      :visible.sync="createdPlanType"
      :close-on-click-modal="false"
      width="605px"
    >
      <div class="promptStyle">
        <div class="line"></div>
        <el-row class="addPLanLine">
          <el-col :span="4">仓库名称</el-col>
          <el-col :span="14">
            <el-input v-model="editStockParams.name" placeholder="请输入仓库名称" size="small"></el-input>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="4">仓库类型</el-col>
          <el-col :span="14">
            <el-select
              style="width: 100%"
              v-model="editStockParams.type"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in stockTypeList"
                :key="item.val"
                :label="item.txt"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>

        <el-row class="addPLanLine">
          <el-col :span="4">所属部门</el-col>
          <el-col :span="14">
            <el-select
              style="width: 100%"
              v-model="editStockParams.sid"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in deptList"
                :key="item.val"
                :label="item.txt"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdPlanType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveNewPlan" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 搜索对象
      searObj: {
        search: ``,
        status: ``,
        type: ``
      },

      // 操作仓库
      editStockParams: {
        name: ``,
        type: ``,
        sid: ``
      },

      // 仓库状态
      stockStatusList: [
        {
          txt: `全部`,
          val: ``
        },
        {
          txt: `正常`,
          val: `0`
        },
        {
          txt: `盘点中`,
          val: `1`
        }
      ],

      // 仓库类型
      stockTypeList: [
        {
          txt: `全部`,
          val: ``
        },
        {
          txt: `货柜`,
          val: `NORMAL`
        },
        {
          txt: `虚拟`,
          val: `FICTITIOUS`
        }
      ],

      // 部门列表
      deptList: [],

      loading: false,
      search: "", //搜素内容
      addPlanName: "", //新增货柜名称
      addPlanNum: "", //新增货柜编码

      stockTypeId: "", //料类型
      categorySelect: "", //新建货柜品类选择
      tableData: [], // 货柜表格数据
      createdPlanType: false, //创建
      selectList: [], //选择数组
      pageNum: 1, //默认第一页
      pageSize: 10, //每页显示条目个数
      priceSum: 0, //总条目数
      palletData: [], //读取托盘接口数据
      plateSelectId: -1, //托盘设
      sarkEditTF: false
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData(1, 12);

      // 获取所属部门
      this.getDeptList();
      this.sarkEditTF = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "sark-edit"
      );
    },

    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      const {
        searObj: { search, status, type }
      } = this;
      let params = {
        search,
        status,
        type,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        self.$portMain + "/bizWare/list",
        params,
        res => {
          self.pageNum = num;
          self.pageSize = size;
          self.pageNum = num;
          self.priceSum = res.data.rowSize;
          self.tableData = res.data.data;
          if (self.tableData) {
            self.tableData.forEach(item => {
              item.createTimeTxt = item.createTime
                ? this.$moment(item.createTime).format(`YYYY-MM-DD HH:mm:ss`)
                : `----`;
              item.statusTimeTxt = item.statusTime
                ? this.$moment(item.statusTime).format(`YYYY-MM-DD HH:mm:ss`)
                : `----`;
              item.typeTxt = this.changeType(item.status);
            });
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      );
    },

    changeType(options) {
      return this.stockStatusList.filter(
        item => item.val === options.toString()
      )[0].txt;
    },

    getDeptList() {
      this.$axios.get(`${this.$portMain}/company/deptList`).then(res => {
        this.deptList = res.data.data.map(item => {
          const { deptName: txt, deptId: val } = item;
          return {
            txt,
            val
          };
        });
      });
    },

    getList() {
      this.displayAllData(1, this.pageSize);
    },

    // 选中值
    handleSelectionChange(select) {
      this.selectList = select;
    },
    // 编辑单
    editGold(elem) {
      //   localStorage.sarkData = JSON.stringify(elem);
      //   this.$router.push({
      //     path: "positionViewDetail"
      //   });
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
      this.palletTab();
      this.createdPlanType = true;
    },
    palletTab() {},

    //保存新增货柜
    saveNewPlan() {
      const {
        editStockParams: { name, type, sid }
      } = this;
      let params = { name, type, sid };

      this.$api.formdataPostFun(
        this.$portMain + "/bizWare/add",
        params,
        res => {
          this.$message.success("仓库创建成功");
          this.createdPlanType = false;
          this.created_fun();
        },
        err => {
          this.$message.error(err.msg);
        }
      );
    },

    //查找产品
    searchFun() {
      this.displayAllData(1, this.pageSize);
    },

    // 查询事件
    delFun() {
      //   var self = this;
      //   self
      //     .$confirm("此操作将永久删除该货柜, 是否继续?", "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     })
      //     .then(() => {
      //       let idList = [];
      //       self.selectList.forEach(ielem => {
      //         idList.push(ielem.id);
      //       });
      //       let params = {
      //         id: idList.join(",")
      //       };
      //       this.$api.formdataPostFun(
      //         self.$portMain + "/bizSark/del",
      //         params,
      //         res => {
      //           self.$message.success("货柜删除成功");
      //           self.created_fun();
      //         },
      //         err => {
      //           self.$message.error(err.msg);
      //         }
      //       );
      //     })
      //     .catch(() => {
      //       self.$message({
      //         type: "info",
      //         message: "已取消删除"
      //       });
      //     });
    },
    //数值转字母字符
    returnTxt(elem) {
      return this.$publicData.charData[elem].valueS;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .yellowColor {
    color: #F26D0F;
  }

  .redColor {
    color: #F20F34;
  }

  .blackColor {
    color: #2E2F33;
  }

  .grayColor {
    color: #8a9199;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .width160 {
    width: 160px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth240 {
      width: 240px;
    }

    .inputWidth160 {
      width: 160px;
    }

    .itemRight {
      text-align: right;
    }

    .marginBottom {
      margin-bottom: 32px;
    }

    .fontTStyle {
      font-size: 14px;
      color: #8A9199;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .itemBottom {
      margin-bottom: 24px;
    }

    .titleStyle {
      color: #8A9199;
      font-size: 14px;
      text-align: right;
      padding-right: 24px;
    }

    .contentStyle {
      color: #2E2F33;
      font-size: 14px;
    }
  }

  .promptStyle {
    position: relative;

    .addInputNum {
      width: 90px;
      height: 20px;
    }

    .addPLanLine {
      padding-left: 30px;
      min-height: 50px;
      line-height: 34px;
    }

    .line {
      width: 605px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textAreaStyle {
      width: 433px;
      height: 120px;
      resize: none;
      background: rgba(240, 247, 255, 1);
    }
  }

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }

  .tabTwoDiv {
    height: 130px;

    .tabTwoTxt {
      margin: 0 auto;
      // width 60px
      text-align: center;
      color: #999;
      font-size: 8px;
      line-height: 20px;
    }
  }

  .tabTwoMain {
    margin: 0 auto;
    width: 60px;
    display: -webkit-flex; /* Safari */
    -webkit-flex-flow: row wrap; /* Safari 6.1+ */
    display: flex;
    flex-flow: row wrap;

    .tabTwo {
      border: 1px solid #333;
      text-align: center;
      font-size: 12px;
      margin-left: -1px;
      margin-top: -1px;
    }

    .tabTwoSelect {
      padding-top: 1px;
      margin: 0 auto;
      padding-left: 17px;
    }
  }
}

.searchTxt {
  width: 256px;
}

.marginLeft24 {
  margin-left: 24px;
}

.fontGray {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(138, 142, 153, 1);
}

.marginTop10 {
  margin-top: 10px;
}
</style>
