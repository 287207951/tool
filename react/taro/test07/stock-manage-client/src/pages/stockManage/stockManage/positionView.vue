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
      <el-row>
        <el-col :span="12" v-if="sarkEditTF">
          <el-button type="primary" size="small" @click="createdFun">创建货柜</el-button>
          <el-button type="danger" size="small" plain @click="delFun">删除</el-button>

          <span class="fontStyle">仓库</span>
          <el-select
            v-model="wareId"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="changStock"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in stockList"
              :key="item.id"
              :label="item.wareName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="sarkEditTF?12:24">
          <el-input
            placeholder="请输入编号搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
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
        <el-table-column type="selection" width="55" v-if="sarkEditTF"></el-table-column>
        <el-table-column prop="sarkName" label="货柜名称"></el-table-column>
        <el-table-column prop="sarkNum" label="货柜编号"></el-table-column>
        <el-table-column prop="depositType" label="存放品类"></el-table-column>
        <el-table-column prop="sarkRow" label="库位数量（个）">
          <template slot-scope="scope">{{scope.row.sarkRow}} - {{scope.row.sarkCol}}</template>
        </el-table-column>
        <el-table-column prop="createTimeTxt" label="创建时间"></el-table-column>
        <el-table-column prop="operationName" label="操作人"></el-table-column>
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
      title="创建货柜"
      :visible.sync="createdPlanType"
      :close-on-click-modal="false"
      width="605px"
    >
      <div class="promptStyle">
        <div class="line"></div>
        <el-row class="addPLanLine">
          <el-col :span="4">货柜名称</el-col>
          <el-col :span="14">
            <el-input v-model="addPlanName" placeholder="请输入货柜名称" size="small"></el-input>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="4">货柜编号</el-col>
          <el-col :span="14">
            <el-input v-model="addPlanNum" placeholder="请输入货柜编号" size="small"></el-input>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="4">仓库</el-col>
          <el-col :span="14">
            <el-select v-model="addWareId" placeholder="请选择" size="small" style="width:160px">
              <el-option
                v-for="item in stockList"
                :key="item.id"
                :label="item.wareName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="4">库位数量(个)</el-col>
          <el-col :span="14">
            <el-input-number
              v-model="addR"
              controls-position="right"
              :min="1"
              :max="60"
              class="addInputNum"
              :controls="false"
              size="small"
            ></el-input-number>(行)
            X
            <el-input-number
              v-model="addC"
              controls-position="right"
              :min="1"
              :max="10"
              class="addInputNum"
              :controls="false"
              size="small"
            ></el-input-number>(列)
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row class="addPLanLine">
          <el-col :span="4">选择托盘</el-col>
          <el-col :span="14">
            <el-row>
              <el-col :span="11" v-for="item in palletData" :key="item.id" class="tabTwoDiv">
                <div class="tabTwoTxt">{{item.depositType}}</div>
                <div class="tabTwoMain">
                  <div
                    class="tabTwo"
                    v-for="itemOne in item.plateSumNum"
                    :style="{'width':item.tabTwoWidth,'height':item.tabTwoHeight,'lineHeight':item.tabTwoHeight}"
                    :key="itemOne"
                  >{{returnTxt(itemOne-1)}}</div>
                  <div class="tabTwoSelect">
                    <el-radio v-model="plateSelectId" :label="item.id">&nbsp;</el-radio>
                  </div>
                </div>
              </el-col>
            </el-row>
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
      // 仓库列表
      stockList: [],

      // 仓库id
      wareId: ``,

      //   弹窗新增id
      addWareId: ``,

      loading: false,
      search: "", //搜素内容
      addPlanName: "", //新增货柜名称
      addPlanNum: "", //新增货柜编码
      addR: "", //新增货柜行值
      addC: "", //新增货柜列值
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
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
      this.getStockList();
      this.sarkEditTF = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "sark-edit"
      );
    },
    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      let params = {
        search: self.search,
        wareId: self.wareId,
        page: num,
        rows: size
      };

      this.$api.formdataPostFun(
        self.$portMain + "/bizSark/list",
        params,
        res => {
          self.pageNum = num;
          self.pageSize = size;
          self.pageNum = num;
          self.priceSum = res.data.rowSize;
          self.tableData = res.data.data;
          if (self.tableData) {
            self.tableData.forEach(ielem => {
              ielem.createTimeTxt = ielem.createTime
                ? this.$moment(ielem.createTime).format(`YYYY-MM-DD HH:mm:ss`)
                : `----`;
              ielem.createTimeTxt = self.$api.dateGetDay(ielem.createTime);
            });
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      );
    },

    // 获取仓库列表
    getStockList() {
      let params = {
        PRS: {
          type: `NORMAL`
        }
      };
      this.$axios.get(this.$portMain + "/bizWare/select", params).then(res => {
        if (!res.data.data) {
          this.stockList = [];
        }
        this.stockList = res.data.data;
      });
    },

    // 切换仓库
    changStock(e) {
      this.displayAllData(1, 12);
    },

    // 选中值
    handleSelectionChange(select) {
      this.selectList = select;
    },
    // 编辑单
    editGold(elem) {
      localStorage.sarkData = JSON.stringify(elem);
      this.$router.push({
        // 编辑单
        path: "stockPositionViewDetail"
        // query: { sarkData: JSON.stringify(elem) }
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
      this.palletTab();
      this.createdPlanType = true;
    },
    palletTab() {
      var self = this;
      this.$api.formdataPostFun(
        self.$portMain + "/bizPlate/select",
        {},
        res => {
          self.palletData = res.data;
          self.palletData.forEach(ielem => {
            ielem.plateSumNum = ielem.plateRow * ielem.plateCol;
            ielem.tabTwoWidth = `calc(${((1 / ielem.plateCol) * 100).toFixed(
              2
            )}% - 2px)`;
            switch (ielem.plateRow) {
              case 1:
                ielem.tabTwoHeight = "60px";
                break;
              case 2:
                ielem.tabTwoHeight = "30px";
                break;
              case 3:
                ielem.tabTwoHeight = "20px";
                break;
              case 4:
                ielem.tabTwoHeight = "15px";
                break;
              case 5:
                ielem.tabTwoHeight = "12px";
                break;
              default:
                ielem.tabTwoHeight = "";
                break;
            }
          });
          //
          // console.log(res.data.data)
        }
      );
    },
    //保存新增货柜
    saveNewPlan() {
      var self = this;
      if (self.plateSelectId === -1) {
        this.$message.error("请选择托盘重新提交！");
        return false;
      }
      let params = {
        name: self.addPlanName,
        num: self.addPlanNum.replace(/\s*/g, ""),
        // type: self.categorySelect.join(","),
        wareId: self.addWareId,
        r: self.addR,
        c: self.addC,
        pid: self.plateSelectId
      };
      this.$api.formdataPostFun(
        self.$portMain + "/bizSark/add",
        params,
        res => {
          self.addPlanName = "";
          self.addPlanNum = "";
          self.categorySelect = [];
          self.addR = "";
          self.addC = "";
          self.$message.success("货柜创建成功");
          self.createdPlanType = false;
          self.created_fun();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //查找产品
    searchFun() {
      var self = this;
      self.displayAllData(1, this.pageSize);
    },
    // 查询事件
    delFun() {
      var self = this;
      self
        .$confirm("此操作将永久删除该货柜, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let idList = [];
          self.selectList.forEach(ielem => {
            idList.push(ielem.id);
          });
          let params = {
            id: idList.join(",")
          };
          this.$api.formdataPostFun(
            self.$portMain + "/bizSark/del",
            params,
            res => {
              self.$message.success("货柜删除成功");
              self.created_fun();
            },
            err => {
              self.$message.error(err.msg);
            }
          );
        })
        .catch(() => {
          self.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
</style>
