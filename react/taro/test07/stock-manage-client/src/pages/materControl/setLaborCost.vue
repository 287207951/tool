<template>
  <div class="conBigDiv" ref="setLaborCost" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>收旧工费</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="titleFont marginLeft24">时间筛选</span>
          <el-date-picker
            class="marginRight"
            v-model="selectedDay"
            @change="selectDayFun"
            type="daterange"
            align="right"
            unlink-panels
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
          ></el-date-picker>
          <span class="titleFont marginLeft24">类型</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="selectStockType"
          >
            <el-option
              v-for="item in stockSetTypeListShow"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="titleFont marginLeft24">状态</span>
          <el-select
            v-model="isactive"
            placeholder="请选择"
            size="small"
            style="width:200px"
            @change="selectStockType"
          >
            <el-option
              v-for="item in isactiveData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="margin-top:20px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="createdFun">新增</el-button>
          <el-button type="danger" size="small" plain @click="enableFun">启用</el-button>
          <el-button type="danger" size="small" plain @click="noEnableFun">禁用</el-button>
          <el-button type="warning" size="small" @click="deleFun">删除</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column header-align="center" align="center" prop="stock_type_name" label="料类型"></el-table-column>
        <el-table-column header-align="center" align="center" prop="quality" label="成色"></el-table-column>
        <el-table-column header-align="center" align="center" prop="expense_way" label="结费方式"></el-table-column>
        <el-table-column header-align="center" align="center" prop="inold_wage" label="工费"></el-table-column>
        <el-table-column header-align="center" align="center" prop="note" label="备注"></el-table-column>
        <el-table-column header-align="center" align="center" prop="is_active" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.is_active == '1'">启用</span>
            <span v-if="scope.row.is_active == '0'">禁用</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="order_uid_name" label="创建人"></el-table-column>
        <el-table-column header-align="center" align="center" prop="create_time" label="创建时间"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <span style="color: #F20F34" @click="editFun(scope.row)">编辑</span>
            <!-- <span style="color: #E8B409" @click="delFun(scope.row)" v-if="scope.row.statue == 0">删除</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
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
      </div>
    </div>
    <!-- 新增料工费 -->
    <el-dialog
      title="新增收旧工费设置"
      :visible.sync="createdCostType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="costStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左边 -->
          <el-col :span="12">
            <div style="margin-bottom:20px">
              <span style="margin-left: 13px;" class="createTitle">料类型</span>
              <el-select
                v-model="createdCostData.stock_type_id"
                placeholder="请选择"
                size="small"
                style="width:240px"
                @change="selectType"
              >
                <el-option
                  v-for="item in stockSetTypeList"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <div style="margin-bottom:20px">
              <span style="margin-left:-1px;" class="createTitle">结费方式</span>
              <el-select
                v-model="createdCostData.expense_way_id"
                placeholder="请选择"
                size="small"
                style="width:240px"
                @change="selectWay"
              >
                <el-option
                  v-for="item in expenseWayData"
                  :key="item.paypayVal"
                  :label="item.paypayTxt"
                  :value="item.paypayVal"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
          </el-col>
          <!-- 右边 -->
          <el-col :span="12" style="text-align: right">
            <div style="margin-bottom:20px">
              <span class="createTitle">成色</span>
              <el-input
                v-model="createdCostData.quality"
                placeholder="请设置成色"
                style="width:240px"
                size="small"
                @blur="qualityCheck"
              ></el-input>
              <span class="redColor">*</span>
            </div>
            <div>
              <span class="createTitle">工费</span>
              <el-input
                v-model="createdCostData.inold_wage"
                placeholder="请设置工费"
                style="width:240px"
                size="small"
                @blur="wageCheck"
              ></el-input>
              <span class="redColor">*</span>
            </div>
          </el-col>
          <!-- 底部 -->
          <el-col :span="24">
            <div style="margin-bottom:20px;display:flex;">
              <span style="margin-left:28px;" class="createTitle">备注</span>
              <textarea class="textAreaStlye" placeholder="请输入备注信息" v-model="createdCostData.note"></textarea>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdCostType = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="saveCreatedCost"
          size="small"
          :loading="createBtnLoading"
        >保存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑新旧工费设置 -->
    <el-dialog
      title="编辑料工费"
      :visible.sync="editCostType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="costStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左边 -->
          <el-col :span="12">
            <div style="margin-bottom:20px">
              <span style="margin-left: 13px;" class="createTitle">料类型</span>
              <el-select
                v-model="editCostData.stock_type_id"
                placeholder="请选择"
                size="small"
                style="width:240px"
                @change="editSelectType"
              >
                <el-option
                  v-for="item in stockSetTypeList"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <div style="margin-bottom:20px">
              <span style="margin-left:-1px;" class="createTitle">结费方式</span>
              <el-select
                v-model="editCostData.expense_way_id"
                placeholder="请选择"
                size="small"
                style="width:240px"
                @change="editSelectWay"
              >
                <el-option
                  v-for="item in expenseWayData"
                  :key="item.paypayVal"
                  :label="item.paypayTxt"
                  :value="item.paypayVal"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
          </el-col>
          <!-- 右边 -->
          <el-col :span="12" style="text-align: right">
            <div style="margin-bottom:20px">
              <span class="createTitle">成色</span>
              <el-input
                v-model="editCostData.quality"
                placeholder="请设置成色"
                style="width:240px"
                size="small"
                :clearable="true"
                @blur="editQualityCheck"
              ></el-input>
              <!-- <el-slider 
                v-model="editCostData.quality" 
                :max="1" :step="0.001" :min="0" 
                style="width: 230px; display: inline-block; margin: 0 10px 0 0;"
              ></el-slider>-->
              <span class="redColor">*</span>
            </div>
            <div>
              <span class="createTitle">工费</span>
              <el-input
                v-model="editCostData.inold_wage"
                placeholder="请设置工费"
                style="width:240px"
                size="small"
                @blur="editWageCheck"
              ></el-input>
              <span class="redColor">*</span>
            </div>
          </el-col>
          <!-- 底部 -->
          <el-col :span="24">
            <div style="margin-bottom:20px;display:flex;">
              <span style="margin-left:28px;" class="createTitle">备注</span>
              <textarea class="textAreaStlye" placeholder="请输入备注信息" v-model="editCostData.note"></textarea>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCostType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveEdit" size="small" :loading="editBtnLoading">保存</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      createBtnLoading: false,
      editBtnLoading: false,
      loading: false,
      selectData: [], //选中的数据
      enableData: [], //启用的数据
      noEnableData: [], //禁用的数据
      search: "",
      startTime: "",
      endTime: "",
      stockTypeId: "",
      isactive: "",
      isactiveData: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 0
        }
      ],
      moni: "", //模拟
      expenseWayData: [], //结费方式
      allData: [], //工费数据
      createdCostData: {
        //新增料工费数据
        stock_type_id: "",
        stock_type_name: "",
        quality: "",
        inold_wage: "",
        note: "",
        expense_way_id: "",
        expense_way: ""
      },
      editCostData: {
        //编辑料工费数据
        id: "",
        stock_type_id: "",
        stock_type_name: "",
        quality: "",
        inold_wage: "",
        note: "",
        expense_way_id: "",
        expense_way: ""
      },
      stock_type_name: "", //金料类型id
      quality: "", //金料类型名称
      inold_wage: "", //收旧工费
      stockSetKindData: [], //料种类数据
      stockSetTypeList: [], // 料类型数据
      stockSetTypeListShow: [], // 显示料类型数据
      createdCostType: false, //新增工费状态
      editCostType: false, // 编辑工费状态
      value: "", //模拟
      parageraphList: [], //列表

      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.setLaborCost;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.createdCostType == true && altKey && keyCode === 83) {
        self.saveCreatedCost();
      }

      if (dom != undefined && altKey && keyCode === 68) {
        self.deleFun();
      }
    };
  },
  methods: {
    // changeEditCostDataQuality(val) {
    //   if (isNaN(val) || val > 1) {
    //     this.$message.warning("输入有误，成色有效值为：0~1");
    //   }
    // },
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
      this.findStockSetKind();
      this.stockSetFun();
      this.stockSetFunShow();
      this.findPropPay();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          stockTypeId: self.stockTypeId,
          isactive: self.isactive
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/StockWagelist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.priceSum = res.data.data.length;
            self.allData.forEach(item => {
              item.create_time = self.$api.dateGetDayTime(item.create_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(val) {
      this.selectData = val;
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
    // 查询事件
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.displayAllData();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.stockTypeId = this.isactive = this.selectedDay =
        "";
      this.queryFun();
    },
    // 新建发料
    createdFun() {
      this.createdCostType = true;
      this.createdCostData = {
        //新增料工费数据
        stock_type_id: "",
        stock_type_name: "",
        quality: "",
        inold_wage: "",
        note: "",
        expense_way_id: "",
        expense_way: ""
      };
    },
    // 查询金料种类
    findStockSetKind() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
            self.stockSetKindData.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询金料类型
    stockSetFunShow() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetTypeListShow = res.data.data;
            self.stockSetTypeListShow.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
    // 选择料种类
    selectStockType() {
      let self = this;
      this.stockSetKindData.forEach(item => {
        if (self.stock_type_name == item.id) {
          self.quality = item.material_name;
        }
      });
    },
    //选择料类型
    selectType(num) {
      let self = this;
      this.stockSetTypeList.forEach(item => {
        if (item.id == num) {
          self.createdCostData.stock_type_name = item.material_name;
        }
      });
    },
    //编辑选择料类型
    editSelectType(num) {
      let self = this;
      this.stockSetTypeList.forEach(item => {
        if (item.id == num) {
          self.editCostData.stock_type_name = item.material_name;
        }
      });
    },
    //选择结价方式
    selectWay(num) {
      let self = this;
      this.expenseWayData.forEach(item => {
        if (item.paypayVal == num) {
          self.createdCostData.expense_way = item.paypayTxt;
        }
      });
    },
    //编辑选择结价方式
    editSelectWay(num) {
      let self = this;
      this.expenseWayData.forEach(item => {
        if (item.paypayVal == num) {
          self.editCostData.expense_way = item.paypayTxt;
        }
      });
    },
    // 保存新增料工费
    saveCreatedCost() {
      let self = this;
      if (this.createdCostData.note != undefined) {
        this.createdCostData.note = this.createdCostData.note.trim();
      }

      if (self.createdCostData.stock_type_id == "") {
        self.$message.warning("请选择料类型！");
        return;
      }
      if (self.createdCostData.quality == "") {
        self.$message.warning("请填写成色！");
        return;
      }
      if (self.createdCostData.expense_way_id == "") {
        self.$message.warning("请选择结价方式！");
        return;
      }
      if (self.createdCostData.inold_wage == "") {
        self.$message.warning("请填写工费！");
        return;
      }

      if (isNaN(self.createdCostData.quality)) {
        self.$message.warning("抱歉，成色只能输入数字！");
        return;
      }

      if (isNaN(self.createdCostData.inold_wage)) {
        self.$message.warning("抱歉，工费只能输入数字！");
        return;
      }
      self.createBtnLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/addStockWage", self.createdCostData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdCostType = false;
              self.createBtnLoading = false;
              self.displayAllData();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.createBtnLoading = false;
          }
        });
    },
    //工费删除
    delFun(item) {
      let self = this;
      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            stockWageId: item.id
          }
        };
        self.$axios
          .get(self.$portMain + "/stock/deleteStockWage", params)
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
    // 工费编辑
    editFun(item) {
      this.editCostType = true;
      this.editCostData = item;
      this.editCostData = {
        id: item.id,
        stock_type_id: item.stock_type_id,
        stock_type_name: item.stock_type_name,
        quality: item.quality,
        inold_wage: item.inold_wage,
        note: item.note,
        expense_way_id: item.expense_way_id,
        expense_way: item.expense_way
      };
    },
    //编辑料类型
    selectEditType() {
      let self = this;
      this.stockSetTypeList.forEach(item => {
        if (self.editCostData.stock_type_id == item.id) {
          self.editCostData.stock_type_name = item.material_name;
        }
      });
    },
    // 保存编辑
    saveEdit() {
      let self = this;
      if (this.editCostData.note != undefined) {
        this.editCostData.note = this.editCostData.note.trim();
      }
      if (self.editCostData.stock_type_id == "") {
        self.$message.warning("请选择料类型！");
        return;
      }
      if (this.$api.trim(self.editCostData.quality) == "") {
        self.$message.warning("请填写成色！");
        return;
      }
      if (self.editCostData.expense_way_id == "") {
        self.$message.warning("请选择结价方式！");
        return;
      }
      if (this.$api.trim(self.editCostData.inold_wage) == "") {
        self.$message.warning("请填写工费！");
        return;
      }

      if (isNaN(self.editCostData.quality)) {
        self.$message.warning("抱歉，成色只能输入数字！");
        return;
      }

      if (isNaN(self.editCostData.inold_wage)) {
        self.$message.warning("抱歉，工费只能输入数字！");
        return;
      }

      self.editBtnLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/updateStockWage", self.editCostData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.editCostType = false;
              self.editBtnLoading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.editBtnLoading = false;
          }
        });
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
        this.queryFun();
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },
    //查询结费方式
    findPropPay() {
      let self = this;
      this.$axios.get(this.$portMain + "/stock/findPropPay").then(function(res) {
        if (res.data.code == 200) {
          self.expenseWayData = res.data.data;
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    //启用
    enableFun() {
      let self = this;
      if (self.selectData.length == 0) {
        self.$message.warning("请选择数据！");
        return;
      }
      let ressult = false;
      let noEnableData = [];
      self.selectData.forEach(item => {
        if (item.is_active == 0) {
          noEnableData.push(item.id);
        }
        if (item.is_active == 1) {
          ressult = true;
        }
      });
      if (ressult) {
        self.$message.warning("抱歉，你选中的数据中有已启用的，请重新选择！");
        return;
      }
      let params = {
        stockWageIds: JSON.stringify(noEnableData),
        isActive: 1
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/UpdateStockWageSatue",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //禁用
    noEnableFun() {
      let self = this;
      if (self.selectData.length == 0) {
        self.$message.warning("请选择数据！");
        return;
      }
      let ressult = false;
      let enableData = [];
      self.selectData.forEach(item => {
        if (item.is_active == 1) {
          enableData.push(item.id);
        }
        if (item.is_active == 0) {
          ressult = true;
        }
      });
      if (ressult) {
        self.$message.warning("抱歉，你选中的数据中有已禁用的，请重新选择！");
        return;
      }
      let params = {
        stockWageIds: JSON.stringify(enableData),
        isActive: 0
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/UpdateStockWageSatue",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //删除
    deleFun() {
      let self = this;
      if (self.selectData.length == 0) {
        self.$message.warning("请选择数据！");
        return;
      }
      let deleData = [];
      self.selectData.forEach(item => {
        deleData.push(item.id);
      });
      let params = {
        stockWageIds: JSON.stringify(deleData)
      };
      this.$api.formdataPostFun(
        this.$portMain + "/stock/deleteStockWage",
        params,
        res => {
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //成色校验
    qualityCheck() {
      if (this.createdCostData.quality != undefined) {
        this.createdCostData.quality = this.createdCostData.quality.trim();
      }

      if (isNaN(this.createdCostData.quality)) {
        this.$message.error("请输入数字！");
        this.createdCostData.quality = "";
        return;
      }

      if (
        this.createdCostData.quality > 1 ||
        this.createdCostData.quality < 0
      ) {
        this.$message.error("抱歉，成色只能在0到1之间！");
        this.createdCostData.quality = "";
        return;
      }
    },
    //工费校验
    wageCheck() {
      if (this.createdCostData.inold_wage != undefined) {
        this.createdCostData.inold_wage = this.createdCostData.inold_wage.trim();
      }

      let result = isNaN(this.createdCostData.inold_wage);
      let result2 = Number(this.createdCostData.inold_wage) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数字！");
        this.createdCostData.inold_wage = "";
        return;
      }
    },
    //编辑成色校验
    editQualityCheck() {
      if (this.editCostData.quality != undefined) {
        this.editCostData.quality = this.editCostData.quality.trim();
      }

      if (isNaN(this.editCostData.quality)) {
        this.$message.error("请输入数字！");
        this.editCostData.quality = "";
        return;
      }

      if (this.editCostData.quality > 1 || this.editCostData.quality < 0) {
        this.$message.error("抱歉，成色只能在0到1之间！");
        this.editCostData.quality = "";
        return;
      }
    },
    //编辑工费校验
    editWageCheck() {
      if (this.editCostData.inold_wage != undefined) {
        this.editCostData.inold_wage = this.editCostData.inold_wage.trim();
      }

      let result = isNaN(this.editCostData.inold_wage);
      let result2 = Number(this.editCostData.inold_wage) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数字！");
        this.editCostData.inold_wage = "";
        return;
      }
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

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .redColor {
    color: #F20F34;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 12px;
  }

  .createTitle {
    font-size: 14px;
    color: #8A8E99;
  }

  .marginLeft24 {
    margin-left: 24px;
  }

  .searchTxt {
    width: 256px;
  }

  .costStyle {
    position: relative;

    .line {
      width: 720px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }
  }

  .textAreaStlye {
    width: 617px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #CFD4E6;
    resize: none;
    margin-left: 7px;
    box-sizing: border-box;
    padding: 7px;
  }
}
</style>
