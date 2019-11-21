<template>
  <div class="conBigDiv" ref="repleOrder" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货申请列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="19">
          <span class="fontStyle">下单时间</span>
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
            style="width:300px"
            @change="selectDayFun"
          ></el-date-picker>
          <span class="fontStyle">订单编号</span>
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            style="width:220px"
            @keyup.enter.native="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!-- <el-button ref="comFunBtn" @click="comFun" size="small">电子称读数</el-button>
          <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>-->
        </el-col>

        <el-col :span="5">
          <el-button type="primary" size="small" @click="addProFun">添加补货购物车</el-button>
          <span class="fontStyle">排序</span>
          <el-select
            v-model="rankById"
            placeholder="请选择"
            size="small"
            style="width:110px"
            @change="searchFun"
          >
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="orderTotalSum" label="总数量"></el-table-column>
        <el-table-column prop="endOrderTotalWeight" label="总重量(g)"></el-table-column>
        <el-table-column prop="operateUser" label="操作人"></el-table-column>
        <el-table-column prop="orderCreateTime" label="下单日期"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == undefined">- -</span>
            <span v-if="scope.row.orderStatus == '1'" class="yellowColor">待审核</span>
            <span v-if="scope.row.orderStatus == '2'" class="blackColor">已通过</span>
            <span v-if="scope.row.orderStatus == '4'" class="redColor">已驳回</span>
            <span v-if="scope.row.orderStatus == '7'" class="yellowColor">审核中</span>
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
      <!-- 添加补货单弹窗start -->
      <el-dialog
        :visible.sync="addProTF"
        width="1200px"
        height="720px"
        :close-on-click-modal="false"
        @close="closeFun"
      >
        <span>
          <div>
            <el-row>
              <el-col :span="20">
                <span>分类</span>
                <el-select
                  v-model="stockTypeId"
                  placeholder="请选择"
                  size="small"
                  style="width:100px"
                  @change="searchAddProFun"
                >
                  <el-option
                    v-for="item in categoryNewList"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  ></el-option>
                </el-select>
                <span>表面工艺</span>
                <el-select
                  v-model="effectCode"
                  placeholder="请选择"
                  size="small"
                  style="width:100px"
                  @change="searchAddProFun"
                >
                  <el-option v-for="item in effectCodeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span>生产工艺</span>
                <el-select
                  v-model="processCodeId"
                  placeholder="请选择"
                  size="small"
                  style="width:100px"
                  @change="searchAddProFun"
                >
                  <el-option
                    v-for="item in processCodeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <span>生产工厂</span>
                <el-select
                  v-model="factory"
                  placeholder="请选择"
                  size="small"
                  style="width:100px"
                  @change="searchAddProFun"
                >
                  <el-option
                    v-for="item in factoryList"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
                <span>商品搜索</span>
                <el-input
                  placeholder="请输入关键字搜索"
                  v-model="searchOne"
                  class="input-with-select searchTxt"
                  size="small"
                  style="width:220px"
                  @keyup.enter.native="searchAddProFun"
                >
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="addProRepair" size="small">添加补货</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="addProDiv" v-if="parageraphListModal.length > 0">
            <el-row v-for="(item, ind) in parageraphListModal" :key="ind" class="orderBigDiv">
              <!-- <el-col
              :span="1"
              class="checkboxDiv"
            >
              <el-radio
                :label="item.proNumber"
                v-model="selectProId"
              >&nbsp;</el-radio>
              </el-col>-->
              <el-col :span="23">
                <div class="tabTwo">
                  <div class="tabTwoLeft">
                    <img
                      v-if="item.url"
                      :src="$portImg + item.url"
                      style="height:116px; width:153px;"
                      @click.stop="showPic(item.url?$portImg+item.url:'../../../static/images/img-noimg.png')"
                    />
                    <img
                      v-else
                      src="/static/images/img-noimg.png"
                      style="height:116px; width:153px;"
                    />
                  </div>

                  <el-row style="line-height:30px;" class="tabTwoRight">
                    <el-col :span="24">{{ item.proName }}</el-col>
                    <!-- <el-col
                  :span="8"
                  class="txtRed"
                >
                  库位：-
                    </el-col>-->
                    <el-col :span="8" class="txtTwo" v-if="item.proNumber">编号：{{ item.proNumber }}</el-col>
                    <el-col :span="8" class="txtTwo" v-if="item.one">类别：{{ item.one }}</el-col>
                    <el-col :span="8" class="txtOne" v-if="item.conditi">成色：{{ item.conditi }}</el-col>
                    <el-col :span="8" class="txtOne" v-if="item.weight">克重：{{ item.weight }}</el-col>
                    <el-col
                      :span="8"
                      class="txtTwo"
                      v-if="item.factoryName"
                    >工厂：{{ item.factoryName }}</el-col>
                    <el-col
                      :span="8"
                      class="txtTwo"
                      v-if="item.one !== '套装'"
                      v-html="$api.getAttachProperty(item.one,item.extendAttr)"
                    ></el-col>
                    <el-col
                      :span="8"
                      class="txtTwo"
                      v-if="item.effectCode && item.one !== '套装'"
                    >属性：{{ item | getAttributes }}</el-col>
                    <el-col :span="16" style="color:red" v-if="item.one == '套装'">
                      <p @click="editSuit(item)">
                        <strong>
                          套装详情
                          <i :class="item.viewSuit ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                        </strong>
                      </p>
                    </el-col>
                  </el-row>

                  <el-input-number
                    style="align-self: flex-end;"
                    v-model="item.productSum"
                    size="mini"
                    :min="0"
                    @change="handSelect(item)"
                  ></el-input-number>
                </div>

                <!-- 套装详情 -->
                <div class="suit" v-if="item.map && item.viewSuit ">
                  <figure v-for="it in item.map.proList" :key="it.id">
                    <img :src="$portImg+it.pic" @click="showPic($portImg+it.pic)" alt />
                    <div class="option">
                      <p>
                        <b>{{ it.proName }}</b>
                      </p>
                      <p>
                        <span>编号：</span>
                        <b>{{ it.factoryNumber }}</b>
                      </p>
                      <p>
                        <span>属性：</span>
                        <b>{{ it | getAttributes }}</b>
                      </p>
                    </div>
                    <div class="option">
                      <p>
                        <span>克重：</span>
                        <b>{{ it.weight }}</b>
                      </p>
                      <p>
                        <span>成色：</span>
                        <b>{{ it.condit }}</b>
                      </p>
                      <p v-if="it.extendAttr">
                        <span>{{ it.oneName | getProductTypeName }}</span>
                        <b>{{ it.oneName | getProductTypeValue(it.extendAttr) }}</b>
                      </p>
                    </div>
                  </figure>
                </div>
              </el-col>
            </el-row>
            <infinite-loading
              @infinite="infiniteHandler"
              ref="infiniteLoading"
              :direction="bottom"
              :identifier="infiniteId"
              :distance="100"
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>

          <div class="noProduct" v-else>没有找到您要的产品！</div>

          <!-- <div class="pageD">
            <el-pagination
              @size-change="handleSizeChangeAdd"
              @current-change="handleCurrentChangeAdd"
              :current-page="pageNumModal"
              :page-sizes="[12, 30, 50, 100]"
              :page-size="pageSizeModal"
              layout="total, sizes, prev, pager, next, jumper"
              :total="priceSumModal"
              background
            ></el-pagination>
          </div>-->
        </span>
        <!-- <span slot="footer" class="dialog-footer"></span> -->
      </el-dialog>
      <!-- 添加补货单弹窗end -->
    </div>
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>
<script>
export default {
  data() {
    return {
      infiniteId: +new Date(),
      bottom: "bottom", //infinite-loading组件需要
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      firstWeight: 0, //出库总重
      loading: false,
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      searchOne: "", //
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      MIME: {
        "application/x-zip-compressed": "zip",
        "application/javascript": "js",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "xlsx",
        "text/css": "css",
        "text/plain": "txt",
        "text/html": "html",
        "text/xml": "xml",
        "image/jpeg": "jpeg",
        "image/png": "png",
        "image/gif": "gif",
        "image/svg+xml": "svg"
      },
      stockSetKindData: [], //料种类下拉数据
      stockSetTypeList: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ], // 排序
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数.
      rankById: "1",
      pageNumModal: 1,
      pageSizeModal: 12,
      priceSumModal: "",
      parageraphListModal: [], //列表
      goldCodeList: [],
      categoryNewList: [],
      processCodeList: [],
      goldCodeId: "全部",
      processCodeId: "全部",
      stockTypeId: "",
      addProTF: false,
      factory: "", // 选择工厂
      factoryList: [], // 工厂列表
      effectCodeList: [], // 表面工艺列表
      effectCode: "" // 表面工艺
    };
  },
  created() {
    var self = this;
    this.created_fun();
    // this.codeDisplay();
    // this.getFactoryList();
  },
  methods: {
    created_fun() {
      this.displayAllData(1, 12);
    },
    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      let params = {
        orderNo: self.search,
        startTime: self.startTime,
        endTime: self.endTime,
        rankBy: self.rankById,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/selectReplenishOrderList",
        params,
        res => {
          if (res.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.parageraphList = res.data.data;
            self.priceSum = res.data.pageSize;
            // if()
            // self.parageraphList.forEach((item, index) => {
            //   item.update_time = self.$api.dateGetDayTime(item.update_time);
            // });
          } else {
            self.$message.error(res.msg);
          }
          self.loading = false;
        }
      );
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "repleOrderOperaDetail",
        query: { orderNo: elem.orderNo }
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
      this.displayAllData(1, 12);
    },

    //搜索
    searchFun() {
      this.displayAllData(1, 12);
    },
    //搜索
    searchAddProFun() {
      this.pageNumModal = 1;
      this.pageSizeModal = 12;
      this.priceSumModal = "";
      this.parageraphListModal = [];

      this.displayAddProData();
    },
    addProFun() {
      this.addProTF = true;
      this.factoryList.length === 0 && this.getFactoryList();
      this.categoryNewList.length === 0 && this.codeDisplay();
      this.displayAddProData();
    },

    displayAddProData() {
      var self = this;
      let params = {
        proName: self.searchOne,
        one: self.stockTypeId,
        processCode: self.processCodeId === "全部" ? "" : self.processCodeId,
        goldCode: self.goldCodeId === "全部" ? "" : self.goldCodeId,
        effectCode: self.effectCode === "全部" ? "" : self.effectCode,
        factoryId: self.factory,
        page: this.pageNumModal,
        rows: this.pageSizeModal
      };
      if (this.pageNumModal === 1 && this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      }
      return new Promise((resolve, reject) => {
        this.$api.formdataPostFun(
          this.$portMain + "/product/proReplenishment",
          // this.$portMain + "/product/proList",
          params,
          res => {
            let listOne = res.data.data ? res.data.data : [];
            self.firstWeight = res.data.firstWeight;
            self.finalWeight = res.data.finalWeight;
            // self.parageraphListModal = res.data.data;
            self.priceSumModal = res.data.rowSize;
            listOne.forEach((item, index) => {
              item.productSum = item.productSum ? item.productSum : 0;
              item.update_time = self.$api.dateGetDayTime(item.update_time);
              item.sizeData = item.extendAttr && JSON.parse(item.extendAttr);
              item.viewSuit = false;
            });

            if (listOne && listOne.length > 0) {
              self.parageraphListModal =
                self.pageNumModal === 1
                  ? listOne
                  : self.parageraphListModal.concat(listOne);
              // console.log("产品数据数据", self.parageraphListModal);
              this.pageNumModal = this.pageNumModal + 1;
              resolve();
            } else {
              reject();
            }
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      });
    },
    addProRepair() {
      let addTF = false;
      this.parageraphListModal.forEach(item => {
        if (item.productSum > 0) {
          addTF = true;
        }
      });
      if (!addTF) {
        this.$message.error("未选择产品，请输入产品数量提交！");
        return;
      }
      this.$confirm("是否加入补货购物车?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.editAddPro();
        })
        .catch(() => {});
    },

    //确定补货事件 todo
    editAddPro() {
      const self = this;
      const { parageraphListModal } = this;
      let params = {},
        relCartFroms = [];
      parageraphListModal.forEach(item => {
        if (item.one === "套装") {
          item.suit = 2;
        }
        if (item.one !== "套装") {
          item.suit = 1;
        }
      });
      relCartFroms = parageraphListModal
        .filter(item => item.productSum > 0)
        .map(item => {
          return {
            skuNum: item.proNumber,
            sum: item.productSum,
            suit: item.suit
          };
        });
      params = Object.assign({}, { relCartFroms: relCartFroms });
      //
      this.$axios
        .post(this.$portMain + "/order/addReplenishCartList", params)
        .then(res => {
          if (res.data.code == 200) {
            self.$message.success("添加到补货购物车成功！");
            setTimeout(function() {
              //初始化数据
              self.stockTypeId = "";
              self.effectCode = "";
              self.processCodeId = "";
              self.factory = "";
              self.searchOne = "";
              self.pageNumModal = 1;
              self.pageSizeModal = 12;
              self.priceSumModal = "";
              self.parageraphListModal = []; //列表
              self.displayAddProData();
              // console.log("编辑数据12123");
            }, 1000);
          }
        });
    },
    //手动修改数量
    handSelect(item) {
      //
      this.$forceUpdate();
    },
    codeDisplay() {
      var self = this;
      this.$publicData
        .categoryFun()
        .then(function(res) {
          // console.log(res)
          self.categoryNewList = res;
          self.categoryNewList.unshift({ label: "", value: "全部" });
          // if (
          //   JSON.stringify(self.categoryNewList[0]) !==
          //   JSON.stringify(self.allSelectObj)
          // ) {
          //   self.categoryNewList.unshift(self.allSelectObj);
          // }
        })
        .catch(function(err) {
          self.categoryList = [];
          self.$message.error(err);
        });
      this.$axios.get(this.$portMain + "/product/code", {}).then(function(res) {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            //材质
            if (item.goldCode == "产品材质") {
              self.goldCodeList = item.list;
              self.goldCodeList.unshift("全部");
            }
            //生产工艺
            if (item.processCode == "制作工艺") {
              self.processCodeList = item.list;
              self.processCodeList.unshift("全部");
            }
            // 表面工艺
            if (item.effectCode === "表面工艺") {
              self.effectCodeList = item.list;
              self.effectCodeList.unshift("全部");
            }
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    // 获取工厂列表
    getFactoryList() {
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", {
          PRS: { keyWord: "" }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.factoryList = res.data.data;
            this.factoryList.unshift({ companyId: "", companyName: "全部" });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    },
    //下拉滚动
    infiniteHandler($state) {
      console.log(this.parageraphListModal.length, this.parageraphListModal);
      if (
        this.priceSumModal != "" &&
        this.parageraphListModal.length >= this.priceSumModal
      ) {
        $state.complete();
      } else {
        this.displayAddProData()
          .then(res => {
            // this.pageNumModal = this.pageNumModal + 1;
            $state.loaded();
          })
          .catch(err => {
            $state.complete();
          });
      }
    },
    //关闭弹框
    closeFun() {
      // this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      // this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");

      this.stockTypeId = "";
      this.effectCode = "";
      this.processCodeId = "";
      this.factory = "";
      this.searchOne = "";

      this.pageNumModal = 1;
      this.pageSizeModal = 12;
      this.priceSumModal = "";
      this.parageraphListModal = []; //列表
    },
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    }
  },
  filters: {
    // 获取列表标题
    getItemTitle(item) {
      const { one } = item;
      switch (one) {
        case "手镯":
          return "内径长：";
        case "戒指":
          return "手寸：";
        case "手链":
          return "链长：";
        case "项链":
          return "链长：";
        // default:
        //   return '--';
      }
    },
    getAttributes(item) {
      const { carCode, effectCode, goldCode, processCode } = item;

      let arr = [];
      Object.values({ carCode, effectCode, goldCode, processCode }).map(
        v => v && v !== "" && arr.push(v)
      );

      // 开口类型
      switch (item.productTypeName) {
        case "手镯":
          item.openType === 2 && arr.push("开口");
          item.openType === 1 && arr.push("固口");
          break;
        case "戒指":
          item.openType === 2 && arr.push("开口");
          item.openType === 1 && arr.push("固口");
          break;
      }
      return arr.join("、");
    },
    getProductTypeName(type) {
      switch (type) {
        case "手镯":
          return "内径长：";
        case "戒指":
          return "手寸：";
        case "手链":
          return "链长：";
        case "项链":
          return "链长：";
      }
    },
    getProductTypeValue(type, attr) {
      let { length, diameterLength, ringHand } = JSON.parse(attr);
      switch (type) {
        case "手镯":
          return diameterLength || "--";
        case "戒指":
          return ringHand || "--";
        case "手链":
          return length || "--";
        case "项链":
          return length || "--";
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.addProDiv {
  max-height: 600px;
  overflow: auto;
}

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

  .orderBigDiv {
    padding: 20px;
    min-height: 126px;
    border-bottom: #E9ECF5 1px solid;

    .orderBigDivOne {
      color: #333;
    }
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

  .tabTwo {
    display: flex;
  }

  .tabTwoLeft {
    width: 174px;
  }

  .tabTwoRight {
    width: calc(100% - 174px);
    margin-left: 20px;
  }

  .txtAlginRight {
    text-algin: right;
  }

  .noProduct {
    color: #8A9199;
    font-size: 16px;
    height: 567px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.suit {
  // display: none;
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #DADFE6;
  width: 100%;
  margin: 8px 16px 0;

  &.show {
    display: flex;
  }

  figure {
    display: flex;
    width: 50%;
    margin-top: 16px;

    img {
      width: 120px;
      height: 90px;
      margin: 0 16px 0 30px;
      background: #eee;
      object-fit: cover;
    }

    .option {
      font-size: 14px;
      color: #8A9199;
      line-height: 30px;
      box-sizing: border-box;

      b {
        color: #222426;
      }
    }

    .option:first-of-type {
      width: 50%;
    }
  }
}
</style>
