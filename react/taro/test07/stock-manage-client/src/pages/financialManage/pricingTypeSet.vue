<template>
  <div class="conBigDiv" ref="pricingTypeSet" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>结价种类设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="18">
          <div>
            <el-input
              placeholder="种类名称"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keyup.enter.native="queryFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="gray_font">时间筛选</span>
            <el-date-picker
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
            <span class="gray_font">状态</span>
            <el-select v-model="isActive" placeholder="请选择" size="small">
              <el-option
                v-for="item in statueData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top:16px;">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="createdFun">新增</el-button>
          <el-button size="small" type="primary" plain @click="enableFun">启用</el-button>
          <el-button size="small" type="primary" plain @click="noEnableFun">禁用</el-button>
          <el-button type="warning" size="small" @click="deleFun">删除</el-button>
          <el-button size="small" type="primary" plain @click="queryFun">查询</el-button>
          <el-button size="small" type="primary" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        height="700"
        @row-dblclick="editGold"
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-top:26px"
      >
        <el-table-column type="selection" header-align="center" align="center" width="60"></el-table-column>
        <el-table-column prop="stockTypeName" label="种类名称"></el-table-column>
        <el-table-column prop="creatorName" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="isActive" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.isActive == '_on'">启用</span>
            <span v-else-if="scope.row.isActive == '_off'">禁用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 创建结价单 -->
    <el-dialog title="创建结价单" :visible.sync="newType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>

        <div style="padding-top:20px;padding-bottom:20px;">
          <span style="font-size:14px;color:#8A9199">种类名称</span>
          <el-input
            v-model="stockTypeName"
            placeholder="请填写新增种类名称"
            size="small"
            style="width:240px"
          ></el-input>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="newType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="subFun" size="small" :loading="btnLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnLoading: false,
      loading: false,
      selectionData: "", //选中数据
      stockTypeName: "", //新增种类名称
      newType: false,
      orderList: [],
      isActive: "", //状态
      search: "", //搜索
      startTime: "",
      endTime: "",
      statueData: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "_on",
          label: "启用"
        },
        {
          value: "_off",
          label: "禁用"
        }
      ],
      selectedDay: "" //日期选择属性
    };
  },
  created() {
    this.displayAllData();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.pricingTypeSet;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.newType == true && altKey && keyCode === 83) {
        self.subFun();
      }

      if (dom != undefined && altKey && keyCode === 68) {
        self.deleFun();
      }
    };
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          isActive: self.isActive, //状态
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/knotPriceTypeList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data;
            self.orderList.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
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
      this.selectionData = val;
    },
    createdFun() {
      this.newType = true;
      this.stockTypeName = "";
      this.btnLoading = false;
    },
    // 编辑提纯单
    editGold(elem) {
      // this.$router.push({ path: 'editMaterToOrna', query: { goldId: elem.id }})
    },
    //提交新增
    subFun() {
      let self = this;
      if (this.stockTypeName != undefined) {
        this.stockTypeName = this.stockTypeName.trim();
      }

      if (this.stockTypeName == "") {
        this.$message.warning("请填写种类名称！ ");
        return;
      }
      let parems = { stockTypeName: self.stockTypeName };
      this.btnLoading = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/insertknotPriceType",
        parems,
        res => {
          self.newType = false;
          self.btnLoading = false;
          self.$message.success(res.msg);
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.btnLoading = false;
        }
      );
    },
    //启用
    enableFun() {
      let self = this;
      let noEnable = [];
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择结价种类！");
        return;
      }
      let result = false;
      this.selectionData.forEach(item => {
        if (item.isActive == "_off") {
          noEnable.push(item.id);
        }
        if (item.isActive == "_on") {
          result = true;
        }
      });

      if (result) {
        this.$message.warning("抱歉，您选中的结价种类有已启用的，请重新选择！");
        return;
      }

      let params = { ids: JSON.stringify(noEnable) };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/updateOn",
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
      let enable = [];
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择结价种类！");
        return;
      }
      let result = false;
      this.selectionData.forEach(item => {
        if (item.isActive == "_on") {
          enable.push(item.id);
        }
        if (item.isActive == "_off") {
          result = true;
        }
      });

      if (result) {
        this.$message.warning("抱歉，您选中的结价种类有已禁用的，请重新选择！");
        return;
      }

      let params = { ids: JSON.stringify(enable) };
      this.$api.formdataPostFun(
        self.$portMain + "/stock/updateOff",
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
      if (this.selectionData.length == 0) {
        this.$message.warning("请选择结价种类！");
        return;
      }
      this.$confirm("您确定要删除选中的结价种类么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let deleData = [];
        this.selectionData.forEach(item => {
          deleData.push(item.id);
        });

        let params = { ids: JSON.stringify(deleData) };
        this.$api.formdataPostFun(
          self.$portMain + "/stock/deleteknotPriceType",
          params,
          res => {
            self.$message.success(res.msg);
            self.displayAllData();
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      });
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },
    //查询
    queryFun() {
      this.displayAllData();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.isActive = this.selectedDay =
        "";
      this.queryFun();
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

  .searchTxt {
    width: 320px;
  }

  .gray_font {
    color: $font-color;
    margin-left: 24px;
  }

  .marignLeft8 {
    margin-left: 8px;
  }

  .returnColor {
    color: #F20F34;
  }

  .passColor {
    color: #222426;
  }

  .awaitColor {
    color: #F26D0F;
  }

  .cancelColor {
    color: #8A9199;
  }

  .promptStyle {
    position: relative;

    .line {
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .once {
      display: flex;
      margin-bottom: 32px;
    }
  }
}
</style>
