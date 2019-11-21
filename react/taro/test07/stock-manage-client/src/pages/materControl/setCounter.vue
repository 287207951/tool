<template>
  <div class="conBigDiv" ref="setCounter">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>柜台</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row style="margin-top:20px">
        <el-col :span="16">
          <span style="font-size:12px; color:#8A8E99">选择公司</span>
          <el-select
            v-model="selectCompanyId"
            placeholder="请选择"
            size="small"
            style="width:240px"
            disabled
          >
            <el-option
              v-for="item in companyData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span style="font-size:12px; color:#8A8E99;margin-left:20px">选择部门</span>
          <el-select
            v-model="departId"
            placeholder="请选择"
            size="small"
            style="width:240px"
            @change="changeDepartFun"
          >
            <el-option
              v-for="item in departList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="createdFun" v-if="powerCreat == 'true'">新增</el-button>
        </el-col>
      </el-row>
      <div class="contenStyle">
        <div class="itemStyle" v-for="(item) in allData" :key="item.id">
          <div class="pictureBar" v-if="powerCreat == 'true'">
            <img src="../../../static/images/bianji@2x.png" alt @click="editFun(item)" />
            <img
              src="../../../static/images/shanchu@2x.png"
              alt
              v-if="item.statue == 0"
              @click="delFun(item)"
            />
          </div>
          <div class="title">
            <!-- <span>{{item.company_name}}</span> -->
            <span>深圳尚金缘有限公司</span>
          </div>
          <div class="textCont">
            <div class="group margBottom">
              <span class="leftBar">柜台名：</span>
              <span>{{item.enter_counter}}</span>
            </div>
            <div class="group margBottom">
              <span class="leftBar">料种类：</span>
              <span>{{item.stock_kind}}</span>
            </div>
            <div class="group margBottom">
              <span class="leftBar">部门：</span>
              <span>{{item.depart_name}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
    <!-- 新增柜台 -->
    <el-dialog
      title="新增柜台"
      :visible.sync="createdCountType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="countStyle">
        <div class="line"></div>
        <el-row class="marginBotton">
          <el-col :span="2" class="leftTitle">
            <span>部门名称</span>
          </el-col>
          <el-col :span="12">
            <el-select
              v-model="position.depart_id"
              placeholder="请选择"
              size="small"
              style="width:280px"
              class="selectStyle"
              @change="changeDepart"
            >
              <el-option
                v-for="item in departList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <span>柜台名称</span>
            <el-input
              v-model="position.enter_counter"
              placeholder="请输入内容"
              style="width:200px"
              size="small"
              @change="changeEnterCounter"
            ></el-input>
          </el-col>
        </el-row>

        <el-row class="marginBotton">
          <el-col :span="2" class="leftTitle">
            <span>料种类</span>
          </el-col>
          <el-col :span="12">
            <el-select
              style="width:280px"
              class="selectStyle"
              v-model="stockSetKindList"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in stockSetKindData"
                :key="item.id"
                :label="item.material_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdCountType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreated" size="small" :loading="btnCreateLoading">保存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑柜台 -->
    <el-dialog
      title="编辑柜台"
      :visible.sync="editCountType"
      width="720px"
      :close-on-click-modal="false"
    >
      <div class="countStyle">
        <div class="line"></div>
        <el-row class="marginBotton">
          <el-col :span="3" class="leftTitle">
            <span>部门名称:</span>
          </el-col>
          <el-col :span="11">
            <!-- {{editData.depart_name}} -->
            <el-select
              v-model="editData.depart_id"
              placeholder="请选择"
              size="small"
              style="width:280px"
              class="selectStyle"
              disabled
              @change="changeEditDataDepartId"
            >
              <el-option
                v-for="item in departList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <span>柜台名称</span>
            <el-input
              v-model="editData.enter_counter"
              placeholder="请输入内容"
              style="width:200px"
              size="small"
            ></el-input>
          </el-col>
        </el-row>

        <el-row class="marginBotton">
          <el-col :span="3" class="leftTitle">
            <span>料种类</span>
          </el-col>
          <el-col :span="11" id="modify">
            <el-select
              size="small"
              @remove-tag="selectStock"
              style="width:280px"
              class="selectStyle"
              v-model="editstockSetKindList"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in stockSetKindData"
                :disabled="item.editStatue == 1"
                :key="item.id"
                :label="item.material_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCountType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveFun" size="small" :loading="btnEditLoading">保存</el-button>
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
      btnCreateLoading: false,
      btnEditLoading: false,
      selectCompanyId: "91681", //选择公司id
      addstock_kind: [], //添加料种类的数据
      delestock_kind: [], //删除料种类id对象
      deleId: [],
      editItemData: {}, //需要编辑的柜数据
      editData: {
        position: {
          enter_counter: "",
          company_id: "",
          company_name: "",
          depart_id: "",
          depart_name: ""
        }
      }, // 编辑的数据
      editstockSetKindList: [], //编辑料种类id集合
      stockSetKindList: [], //新增料种类id集合
      stockSetKindData: [], //料种类数据
      position: {
        enter_counter: "",
        company_id: "",
        company_name: "",
        depart_id: "",
        depart_name: ""
      }, //柜台数据
      companyData: [
        {
          // 公司数据
          id: "91681",
          name: "尚金缘"
        }
      ],
      departList: [
        {
          // 部门数据
          id: 20,
          name: "金库收料部"
        },
        {
          id: 17,
          name: "物流中心"
        }
      ],
      departId: 20, //选择部门id
      allData: [], //库柜数据
      createdCountType: false, // 新增柜台状态
      editCountType: false, // 编辑柜台状态
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
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.setCounter;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.createdCountType == true && altKey && keyCode === 83) {
        self.saveCreated();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
      this.findStockSetKind();
      this.powerFun();
    },
    displayAllData() {
      let self = this;
      let params = {
        PRS: {
          departId: self.departId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/findPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.allData = res.data.data;
            self.allData.forEach(item => {
              item.stock_kind = [];
              item.positionDeails.forEach(one => {
                item.stock_kind.push(one.stock_kind);
              });
            });
            self.allData.forEach(item => {
              item.stock_kind = self.$api
                .listUniqueTwo(item.stock_kind)
                .join("、");
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 新建发料
    createdFun() {
      this.createdCountType = true;
      this.stockSetKindList = [];
      this.position.enter_counter = "";
      this.position.company_id = "";
      this.position.company_name = "";
      this.position.depart_id = "";
      this.position.depart_name = "";
    },
    // 编辑柜台
    editFun(item) {
      let self = this;
      this.editItemData = item;
      this.editstockSetKindList = [];
      this.addstock_kind = [];
      this.delestock_kind = [];
      this.deleId = [];
      this.editCountType = true;
      this.editData = {
        company_id: String(item.company_id),
        company_name: item.company_name,
        id: item.id,
        enter_counter: item.enter_counter,
        depart_id: item.depart_id,
        depart_name: item.depart_name
      };
      // this.editstockSetKindList
      item.positionDeails.forEach(one => {
        self.editstockSetKindList.push(Number(one.stock_kind_id));
      });

      setTimeout(function() {
        item.positionDeails.forEach((one, index) => {
          if (one.statue == 1) {
            let lis = document
              .querySelector("#modify")
              .querySelectorAll(".el-icon-close");
            lis[index].style.display = "none";
          }
        });
      }, 0);

      this.stockSetKindData.forEach(one => {
        one.editStatue = 0;
      });

      item.positionDeails.forEach(one => {
        self.stockSetKindData.forEach(two => {
          if (one.stock_kind_id == two.id && one.statue == 1) {
            two.editStatue = 1;
          }
        });
      });
    },
    // 查询金料种类
    findStockSetKind() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //改变新增柜台名称
    changeEnterCounter() {
      this.$forceUpdate();
    },
    //选择公司
    selectCompany() {
      this.position.company_name = "尚金缘";
      this.$forceUpdate();
    },
    //改变部门
    changeDepart() {
      this.departList.forEach(ielem => {
        if (ielem.id === this.position.depart_id) {
          this.position.depart_name = ielem.name;
        }
      });
    },
    //选择料种料
    selectStock(index) {
      let self = this;
      // 提取删除项的id
      this.editItemData.positionDeails.forEach(item => {
        if (item.stock_kind_id == index) {
          self.delestock_kind.push({ stock_kind_id: item.id });
          self.deleId.push(index);
        }
      });
    },
    //修改部门
    changeDepartFun() {
      // let self = this
      // self.departList.forEach(ielem=>{
      //   if(self.departId === ielem){
      //     console.log(ielem)
      //   }
      // })
      this.displayAllData();
      // console.log(self.departList)
    },
    //编辑修改柜台部门
    changeEditDataDepartId() {
      this.departList.forEach(ielem => {
        if (ielem.id === this.editData.depart_id) {
          this.editData.depart_name = ielem.name;
        }
      });
    },
    // 编辑保存
    saveFun() {
      let self = this;
      // if (self.editData.company_id == "") {
      //   self.$message.warning("请选择公司名称！");
      //   return;
      // }
      if (self.editData.depart_id == "") {
        self.$message.warning("请选择部门名称！");
        return;
      }
      if (self.editData.enter_counter != undefined) {
        self.editData.enter_counter = self.editData.enter_counter.trim();
      }

      if (self.editData.enter_counter == "") {
        self.$message.warning("请填写柜台名称！");
        return;
      }

      if (self.editstockSetKindList.length == 0) {
        self.$message.warning("请选择料种类！");
        return;
      }
      this.addstock_kind = [];
      this.stockSetKindData.forEach(item => {
        self.editstockSetKindList.forEach(one => {
          if (item.id == one) {
            self.addstock_kind.push({
              stock_kind_id: item.id,
              stock_kind: item.material_name
            });
          }
        });
      });
      let params = {
        position: self.editData,
        addstock_kind: self.addstock_kind,
        delestock_kind: self.delestock_kind
      };
      this.btnEditLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/updatePosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.editCountType = false;
              self.btnEditLoading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnEditLoading = false;
          }
        });
    },
    // 保存新增
    saveCreated() {
      let self = this;
      if (self.position.depart_id == "") {
        self.$message.warning("请选择部门名称！");
        return;
      }
      if (self.position.enter_counter != undefined) {
        self.position.enter_counter = self.position.enter_counter.trim();
      }

      if (self.position.enter_counter == "") {
        self.$message.warning("请填写柜台名称！");
        return;
      }

      if (self.stockSetKindList.length == 0) {
        self.$message.warning("请选择料种类！");
        return;
      }
      let stock_kind = [];
      this.stockSetKindList.forEach(item => {
        this.stockSetKindData.forEach(one => {
          if (item == one.id) {
            stock_kind.push({
              stock_kind_id: one.id,
              stock_kind: one.material_name
            });
          }
        });
      });
      let params = {
        position: this.position,
        stock_kind: stock_kind
      };
      this.btnCreateLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/addPosition", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdCountType = false;
              self.btnCreateLoading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnCreateLoading = false;
          }
        });
    },
    //删除
    delFun(item) {
      let self = this;
      this.$confirm("确定要删除该条数据么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          PRS: {
            positionId: item.id
          }
        };
        self.$axios
          .get(this.$portMain + "/stock/deletePosition", params)
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
    //提取数据中差异值
    diff(arr1, arr2) {
      var newArr = [];
      var arr3 = [];
      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) arr3.push(arr1[i]);
      }
      var arr4 = [];
      for (var j = 0; j < arr2.length; j++) {
        if (arr1.indexOf(arr2[j]) === -1) arr4.push(arr2[j]);
      }
      newArr = arr3.concat(arr4);
      return newArr;
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "stock-position-add"
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

  .countStyle {
    position: relative;

    .line {
      width: 720px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .leftTitle {
      color: #8A8E99;
      font-size: 14px;
      text-align: right;
    }

    .selectStyle {
      margin-left: 10px;
    }

    .marginBotton {
      margin-bottom: 36px;
    }
  }

  .contenStyle {
    margin-top: 32px;
    padding-left: 25px;
    padding-right: 18px;
    display: flex;
    flex-wrap: wrap;

    .itemStyle {
      width: 520px;
      height: 160px;
      border-radius: 2px;
      border: 1px solid #CFD9E6;
      padding: 8px 8px 27px 23px;
      box-sizing: border-box;
      margin-right: 23px;
      margin-bottom: 23px;

      .pictureBar {
        text-align: right;

        img {
          width: 14px;
          height: 14px;
        }
      }

      .title {
        font-size: 14px;
        color: #222426;
        font-weight: bold;
      }

      .textCont {
        margin-top: 24px;

        .group {
          font-size: 14px;
          color: #222426;

          .leftBar {
            color: #8A9199;
          }
        }

        .margBottom {
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>
