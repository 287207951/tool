<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓储管理</el-breadcrumb-item>
      <el-breadcrumb-item>托盘管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />

      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" @click="createdFun">创建托盘</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe height="700" style="width: 100%; margin-top: 20px">
        <el-table-column prop="sarkName" label="托盘样式" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="tabThreeMain">
              <tabeDisplay
                class="tabThreeMain"
                :tabData="scope.row.plateSumNum"
                :width="scope.row.tabThreeWidth"
                :height="scope.row.tabThreeHeight"
                :lineHeight="scope.row.tabThreeHeight"
              ></tabeDisplay>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="plateName" label="托盘名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="depositType" label="托盘类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="plateRow" label="格子数量" header-align="center" align="center">
          <template slot-scope="scope">{{scope.row.plateRow}} - {{scope.row.plateCol}}</template>
        </el-table-column>
        <!-- <el-table-column prop="cellStore" label="单格最高容量(件)" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="cellStore" label header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="small" class="viewBtn" @click="editPallet(scope.row)">修改</el-button>
          </template>
        </el-table-column>
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
      title="创建托盘"
      :visible.sync="createdPalletTF"
      width="605px"
      :close-on-click-modal="false"
    >
      <div class="promptStyle">
        <div class="line"></div>
        <el-row class="addPLanLine">
          <el-col :span="5">托盘名称</el-col>
          <el-col :span="15">
            <el-input v-model="addPlanName" placeholder="请输入托盘名称" size="small"></el-input>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="5">托盘品类</el-col>
          <el-col :span="15">
            <el-select
              v-model="categorySelect"
              multiple
              placeholder="请选择"
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="padding-left:20px">可多选</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="5">行列数量</el-col>
          <el-col :span="15">
            <el-input-number
              v-model="palletData.rowSize"
              controls-position="right"
              :min="1"
              :max="5"
              class="addInputNum"
              :controls="false"
              size="small"
            ></el-input-number>(行)
            X
            <el-input-number
              v-model="palletData.lineSize"
              controls-position="right"
              :min="1"
              :max="5"
              class="addInputNum"
              :controls="false"
              size="small"
            ></el-input-number>(列)
            <el-button size="small" class="viewBtn" @click="viewPallet">预览</el-button>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine" v-if="viewPalletTF">
          <el-col :span="15">&nbsp;</el-col>
          <el-col :span="5">
            <div class="tabTwoMain">
              <tabeDisplay
                class="tabTwoMain"
                :tabData="palletSumNum"
                :width="tabTwoWidth"
                :height="tabTwoHeight"
                :lineHeight="tabTwoHeight"
              ></tabeDisplay>
            </div>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
        <!-- <el-row class="addPLanLine">
          <el-col :span="5">格子最高容量(件)</el-col>
          <el-col :span="14">
            <el-input-number
              v-model="addStore"
              controls-position="right"
              class="addInputNum"
              :min="1"
              :controls="false"
              size="small"
            ></el-input-number>
          </el-col>
          <el-col :span="5">&nbsp;</el-col>
        </el-row>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdPalletTF = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveNewPlate" size="small">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 提示 -->
    <el-dialog
      title="修改托盘"
      :visible.sync="editPalletTF"
      width="605px"
      :close-on-click-modal="false"
    >
      <div class="promptStyle">
        <div class="line"></div>
        <el-row class="addPLanLine">
          <el-col :span="5">托盘名称</el-col>
          <el-col :span="15">
            <el-input v-model="editPalletData.plateName" placeholder="请输入托盘名称" size="small"></el-input>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="5">托盘品类</el-col>
          <el-col :span="15">
            <el-select
              v-model="cateList"
              multiple
              placeholder="请选择"
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="padding-left:20px">可多选</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="5">行列数量</el-col>
          <el-col :span="9">
            {{editPalletData.plateRow}}
            X
            {{editPalletData.plateCol}}
          </el-col>
          <el-col :span="6">
            <div class="tabFourMain">
              <div
                class="tabFour"
                v-for="itemOne in editPalletData.plateSumNum"
                :style="{'width':editPalletData.tabThreeWidthTwo,'height':editPalletData.tabFourHeight,'lineHeight':editPalletData.tabFourHeight}"
                :key="itemOne"
              >{{returnTxt(itemOne-1)}}</div>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
        <!-- <el-row class="addPLanLine">
          <el-col :span="5">格子最高容量(件)</el-col>
          <el-col :span="14">
            <el-input-number
              v-model="editPalletData.newCellStore"
              controls-position="right"
              class="addInputNum"
              :min="1"
              :controls="false"
              size="small"
            ></el-input-number>
          </el-col>
          <el-col :span="5">&nbsp;</el-col>
        </el-row>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPalletTF = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editPalletFun" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      search: "", //搜素内容
      addPlanName: "", //新增托盘名称
      addPlanNum: "", //新增托盘编码
      addStore: "", //新增托盘格子最高容量
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      categoryList: [], //新建托盘品类数组
      categorySelect: "", //新建托盘品类选择
      tableData: [], // 托盘表格数据
      createdPalletTF: false, //创建
      selectList: [], //选择数组
      pageNum: 1, //默认第一页
      pageSize: 10, //每页显示条目个数
      priceSum: 0, //总条目数
      tabTwoWidth: "100%", //预览托盘表格宽
      tabTwoHeight: "120px", //预览表格高度
      palletData: {
        rowSize: 1,
        lineSize: 1
      }, //预览托盘样式
      palletSumNum: 0, //预览托盘总个数
      viewPalletTF: false,
      editPalletTF: false, //编辑托盘弹柜
      editPalletData: {}, //编辑托盘数据
      cateList: [] //编辑托盘品类
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      this.displayAllData(1, 12);
      this.$publicData
        .categoryFun()
        .then(function(res) {
          self.categoryList = res;
        })
        .catch(function(err) {
          self.categoryList = [];
          self.$message.error(err);
        });
    },
    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      let params = {
        search: self.search,
        page: num,
        rows: size
      };

      this.$api.formdataPostFun(
        self.$portMain + "/bizPlate/list",
        params,
        res => {
          self.pageNum = num;
          self.pageSize = size;
          self.priceSum = res.data.rowSize;
          self.tableData = res.data.data ? res.data.data : [];
          if (self.tableData) {
            self.tableData.forEach(ielem => {
              ielem.plateSumNum = ielem.plateRow * ielem.plateCol;
              if (ielem.plateCol < 4) {
                ielem.tabThreeWidth = `calc(${(
                  (1 / ielem.plateCol) *
                  100
                ).toFixed(2)}% - 1px)`;
                ielem.tabThreeWidthTwo = ielem.tabThreeWidth;
              } else {
                ielem.tabThreeWidth = `calc(${(
                  (1 / ielem.plateCol) *
                  100
                ).toFixed(2)}%)`;
                ielem.tabThreeWidthTwo = `calc(${(
                  (1 / ielem.plateCol) *
                  100
                ).toFixed(2)}% - 1px)`;
              }
              switch (ielem.plateRow) {
                case 1:
                  ielem.tabThreeHeight = "60px";
                  ielem.tabFourHeight = "90px";
                  break;
                case 2:
                  ielem.tabThreeHeight = "30px";
                  ielem.tabFourHeight = "45px";
                  break;
                case 3:
                  ielem.tabThreeHeight = "20px";
                  ielem.tabFourHeight = "30px";
                  break;
                case 4:
                  ielem.tabThreeHeight = "15px";
                  ielem.tabFourHeight = "22.5px";
                  break;
                case 5:
                  ielem.tabThreeHeight = "12px";
                  ielem.tabFourHeight = "18px";
                  break;
                default:
                  ielem.tabThreeHeight = "";
                  ielem.tabFourHeight = "60px";
                  break;
              }
            });
          }
          this.loading = false;
        },
        err => {
          self.$message.error(err.msg);
          this.loading = false;
        }
      );
    },
    // 选中值
    handleSelectionChange(select) {
      this.selectList = select;
    },
    //预览
    viewPallet() {
      var self = this;
      self.viewPalletTF = true;
      self.tableFun();
    },
    //数值转字母字符
    returnTxt(elem) {
      return this.$publicData.charData[elem].valueS;
    },
    // 编辑单
    editGold(elem) {
      localStorage.sarkData = JSON.stringify(elem);
      this.$router.push({
        // 编辑单
        path: "palletViewDetail"
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
      this.createdPalletTF = true;
      this.tableFun();
    },
    tableFun() {
      // this.tableData
      this.tabTwoWidth = `calc(${((1 / this.palletData.lineSize) * 100).toFixed(
        2
      )}% - 3px)`;
      switch (this.palletData.rowSize) {
        case 1:
          this.tabTwoHeight = "120px";
          break;
        case 2:
          this.tabTwoHeight = "60px";
          break;
        case 3:
          this.tabTwoHeight = "40px";
          break;
        case 4:
          this.tabTwoHeight = "30px";
          break;
        case 5:
          this.tabTwoHeight = "24px";
          break;
        default:
          this.tabTwoHeight = "";
          break;
      }
      this.palletSumNum = parseInt(
        this.palletData.rowSize * this.palletData.lineSize
      );
    },
    //保存新增托盘
    saveNewPlate() {
      var self = this;
      var sizeTF = false;
      self.addPlanName = self.addPlanName.replace(/\s+/g, "");
      self.tableData.forEach(item => {
        if (
          self.palletData.lineSize == item.plateCol &&
          self.palletData.rowSize == item.plateRow
        ) {
          sizeTF = true;
        }
        if (self.addPlanName == item.plateName) {
          sizeTF = true;
        }
      });
      // if (sizeTF) {
      //   self.$message.error(
      //     "已经有此名称或尺寸的托盘，不能重复添加，请重新填入再点击保存！"
      //   );
      //   return false;
      // }
      if (self.addPlanName.length == 0 || self.categorySelect.length == 0) {
        self.$message.error("有必填值未填入，请重新填入再点击保存！");
        return false;
      }

      let params = {
        name: self.addPlanName,
        type: self.categorySelect.join(","),
        r: self.palletData.rowSize,
        c: self.palletData.lineSize,
        store: self.addStore
      };
      self.$api.formdataPostFun(
        self.$portMain + "/bizPlate/add",
        params,
        res => {
          self.addPlanName = "";
          self.addPlanNum = "";
          self.categorySelect = [];
          self.store = "";
          self.palletData.rowSize = 1;
          self.palletData.lineSize = 1;
          self.addStore = "";
          self.viewPalletTF = false;
          self.$message.success("托盘创建成功");
          self.createdPalletTF = false;
          self.created_fun();
        },
        err => {
          self.$message.error("托盘创建失败");
        }
      );
    },
    editPalletFun() {
      var self = this;
      var sizeTF = false;
      self.addPlanName = self.addPlanName.replace(/\s+/g, "");
      self.tableData.forEach(item => {
        if (
          self.editPalletData.plateName == item.plateName &&
          self.editPalletData.id != item.id
        ) {
          sizeTF = true;
        }
      });
      if (sizeTF) {
        self.$message.error("已经有此名称的托盘，请重新填入再点击保存！");
        return false;
      }

      if (
        self.editPalletData.plateName.length == 0 ||
        self.cateList.length == 0
      ) {
        self.$message.error("有必填值未填入，请重新填入再点击保存！");
        return false;
      }
      let params = {
        id: self.editPalletData.id,
        name: self.editPalletData.plateName,
        type: self.cateList.join(",")
        // store: self.editPalletData.newCellStore
      };
      self.$api.formdataPostFun(
        self.$portMain + "/bizPlate/edit",
        params,
        res => {
          self.$message.success("托盘修改成功");
          self.editPalletTF = false;
          self.created_fun();
        },
        err => {
          self.$message.error("托盘修改失败");
        }
      );
    },
    //修改单个托盘
    editPallet(elem) {
      elem.newCellStore = elem.cellStore;
      this.editPalletData = elem;
      this.cateList = this.editPalletData.depositType.split(",");
      this.editPalletTF = true;
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

  .searchTxt {
    width: 320px;
    float: right;
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
      width: 70px;
      height: 20px;
    }

    .viewBtn {
      margin-left: 56px;
    }

    .addPLanLine {
      padding-left: 18px;
      min-height: 50px;
      line-height: 34px;
      color: #999;
      font-size: 14px;
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

  .tabTwoMain {
    width: 100%;
    display: -webkit-flex; /* Safari */
    -webkit-flex-flow: row wrap; /* Safari 6.1+ */
    display: flex;
    flex-flow: row wrap;

    // height 150px
    .tabTwo {
      border: 1px solid #333;
      text-align: center;
      font-size: 12px;
      margin-left: -1px;
      margin-top: -1px;
    }
  }

  .tabFourMain {
    width: 60px;
    display: -webkit-flex; /* Safari */
    -webkit-flex-flow: row wrap; /* Safari 6.1+ */
    display: flex;
    flex-flow: row wrap;

    .tabFour {
      border: 1px solid #333;
      text-align: center;
      font-size: 12px;
      margin-left: -1px;
      margin-top: -1px;
    }
  }

  .tabThreeMain {
    width: 40px;
    margin: 0 auto;
    display: -webkit-flex; /* Safari */
    -webkit-flex-flow: row wrap; /* Safari 6.1+ */
    display: flex;
    flex-flow: row wrap;
    padding-top: 3px;

    .tabThree {
      border: 1px solid #333;
      text-align: center;
      font-size: 12px;
      margin-left: -1px;
      margin-top: -1px;
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
}
</style>
