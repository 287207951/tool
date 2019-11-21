<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <!-- 分割线 S -->
      <section class="top">
        <figure>
          <h2>确认补货详情</h2>
          <div class="btn">
            <el-button size="small" type="primary" @click="editReple">确认补货</el-button>
            <el-button size="small" type="warning" @click="delReple">删除</el-button>
          </div>
        </figure>
        <ul class="search">
          <li>
            <el-input
              placeholder="请输入关键字搜索"
              size="small"
              prefix-icon="el-icon-search"
              @keyup.enter.native="searchFun"
              v-model="search"
            ></el-input>
          </li>
          <li>
            <span>材质</span>
            <el-select size="small" v-model="goldCodeId" @change="searchFun">
              <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </li>
          <li>
            <span>分类</span>
            <el-select size="small" v-model="stockTypeId" @change="searchFun">
              <el-option
                v-for="item in categoryNewList"
                :key="item.value"
                :label="item.value"
                :value="item.label"
              ></el-option>
            </el-select>
          </li>
          <li>
            <span>生产工艺</span>
            <el-select size="small" v-model="processCodeId" @change="searchFun">
              <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </li>
          <li>
            <span>生产工厂</span>
            <el-select size="small" v-model="factory" @change="searchFun">
              <el-option
                v-for="item in factoryList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </section>
      <section class="list" v-if="parageraphList.length > 0">
        <header>
          <el-checkbox v-model="selectAll" @change="changeSelectAll"></el-checkbox>
          <span>全选</span>
        </header>
        <ul>
          <li v-for="(goods, index) in parageraphList" :key="goods.id">
            <div class="comm">
              <div class="option">
                <el-checkbox v-model="goods.selectTF" @change="updateSelectAll"></el-checkbox>
                <img
                  :src="$portImg+goods.productImg"
                  alt
                  @click="showPic($portImg+goods.productImg)"
                />
              </div>
              <div class="option">
                <p>
                  <b>{{ goods.productName }}</b>
                </p>
                <p>
                  <span>编号：</span>
                  <b>{{ goods.productNo }}</b>
                </p>
                <p v-if="goods.suit === 1">
                  <span>属性：</span>
                  <b>{{ goods | getAttributes }}</b>
                </p>
                <p v-else @click="editSuit(goods)">
                  <strong>
                    套装详情
                    <i :class="goods.viewSuit ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </strong>
                </p>
              </div>
              <div class="option">
                <p>
                  <span>类别：</span>
                  <b>{{ goods.productTypeName }}</b>
                </p>
                <p>
                  <span>工厂：</span>
                  <b>{{ goods.factoryName }}</b>
                </p>
              </div>
              <div class="option">
                <p>
                  <span>成色：</span>
                  <b>{{ goods.productCS }}</b>
                </p>
                <p v-if="goods.extendAttr && goods.extendAttr !== '{}'">
                  <span>{{ goods.productTypeName | getProductTypeName }}</span>
                  <b>{{ goods.productTypeName | getProductTypeValue(goods.extendAttr) }}</b>
                </p>
              </div>
              <div class="option">
                <p>
                  <span>克重：</span>
                  <b>{{ $api.returnFloatNum(goods.weight || goods.sumWeight) }}</b>
                </p>
                <el-input-number
                  v-model="goods.Number"
                  :min="1"
                  size="small"
                  @change="handSelect(goods, index)"
                ></el-input-number>
              </div>
              <div class="orderRemark">
                <span>下单备注：</span>
                <textarea
                  name
                  id
                  class="textAreaStlye"
                  placeholder="请输入备注信息"
                  v-model="goods.productRemarks"
                  @blur="remarkFun(goods)"
                ></textarea>
              </div>
            </div>
            <div class="suit" :class="{ show: goods.viewSuit }" v-if="goods.suit === 2">
              <figure v-for="item in goods.relpishCartSuitFroms" :key="item.productNo">
                <img :src="$portImg+item.productImg" @click="showPic($portImg+item.productImg)" alt />
                <div class="option">
                  <p>
                    <b>{{ item.productName }}</b>
                  </p>
                  <p>
                    <span>编号：</span>
                    <b>{{ item.productNo }}</b>
                  </p>
                  <p>
                    <span>属性：</span>
                    <b>{{ item | getAttributes }}</b>
                  </p>
                </div>
                <div class="option">
                  <p>
                    <span>克重：</span>
                    <b>{{ item.weight }}</b>
                  </p>
                  <p>
                    <span>成色：</span>
                    <b>{{ item.productCS }}</b>
                  </p>
                  <p>
                    <span>{{ item.productTypeName | getProductTypeName }}</span>
                    <b>{{ item.productTypeName | getProductTypeValue(item.extendAttr) }}</b>
                  </p>
                </div>
              </figure>
            </div>
          </li>
          <infinite-loading
            @infinite="infiniteHandler"
            :identifier="infiniteId"
            ref="infiniteLoading"
            :direction="bottom"
            :distance="100"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </ul>
      </section>

      <section class="noProduct" v-else>暂无数据</section>
      <!-- 分割线 E -->
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
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      bottom: "bottom", //infinite-loading组件需要
      loading: false,
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      categoryList: [], //新建托盘品类数组
      categoryNewList: [], //新建托盘品类数组(加全部)
      orderSourceSear: [
        {
          code: "1",
          value: "网络单"
        },
        {
          code: "2",
          value: "展厅单"
        }
      ],

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
      priceSum: 0, //总条目数
      checkList: [], //选中
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      goldCodeList: [], //材质列表
      goldCodeId: "全部", //材质选择
      processCodeList: [], //生产工艺列表
      processCodeId: "全部", //生产工艺选择项
      selectAll: false, // 是否全选
      factory: "", // 选择工厂
      factoryList: [], // 工厂列表
      goodsType: ["手镯", "项链", "手链", "戒指"],
      infiniteId: +new Date()
    };
  },
  created() {
    this.created_fun();
    this.getFactoryList();
  },
  methods: {
    created_fun() {
      var self = this;
      // this.$api.dateGetDay()
      this.displayAllData();
      this.codeDisplay();
      this.$publicData
        .categoryFun()
        .then(function(res) {
          self.categoryList = res;
          self.categoryNewList = JSON.parse(JSON.stringify(self.categoryList));
          self.categoryNewList.unshift({
            value: "全部",
            label: "",
            editedTF: false
          });
        })
        .catch(function(err) {
          self.categoryList = [
            {
              value: "全部",
              label: "",
              editedTF: false
            }
          ];
          self.$message.error(err);
        });
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          proName: self.search,
          goldCode: self.goldCodeId != "全部" ? self.goldCodeId : "",
          craft: self.processCodeId != "全部" ? self.processCodeId : "",
          productType: self.stockTypeId,
          factoryId: self.factory,
          page: this.pageNum,
          rows: this.pageSize
        }
      };
      if (this.pageNum === 1 && this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.scrollParent.scrollTop = 0;
      }
      return new Promise((resolve, reject) => {
        this.$axios
          .get(this.$portMain + "/order/selectReplenishCart", params)
          .then(function(res) {
            if (res.data.code == 200) {
              // self.pageNum = num;
              // self.pageSize = size;
              self.selectAll = false;
              if (res.data.data.data) {
                let listOne = res.data.data.data;
                listOne.map(v => (v.selectTF = false));
                self.priceSum = res.data.data.rowSize;

                listOne.forEach((item, index) => {
                  item.Number = item.skuSum;
                  if (item.relpishCartSuitFroms) {
                    item.viewSuit = false;
                    let sumWeight = 0;
                    item.relpishCartSuitFroms.forEach(ielem => {
                      sumWeight += ielem.weight;
                    });
                    item.sumWeight = sumWeight;
                  } else {
                    item.sumWeight = item.weight;
                  }
                  item.sizeData =
                    item.extendAttr && JSON.parse(item.extendAttr);
                  // item.update_time = self.$api.dateGetDayTime(item.update_time);
                });

                if (listOne && listOne.length > 0) {
                  self.parageraphList =
                    self.pageNum === 1
                      ? listOne
                      : self.parageraphList.concat(listOne);
                  resolve();
                } else {
                  self.parageraphList = [];
                }
              } else {
                self.parageraphList = [];
                reject();
              }
            } else {
              self.$message.error(res.data.msg);
            }
            self.loading = false;
          })
          .catch(() => (self.loading = false));
      });
    },
    // 更新全选
    updateSelectAll(val) {
      const { parageraphList } = this;
      let status = true;
      for (let v of parageraphList) {
        if (!v.selectTF) {
          status = false;
          break;
        }
      }
      this.selectAll = status;
      // 解决先选择全选后，再选择商品会出现参数变更而页面没有渲染的问题。
      // 原理：给列表赋予相同内容但不同内存指向的值，触发Vue的渲染。
      this.parageraphList = [...parageraphList];
    },
    // 修改全选状态
    changeSelectAll() {
      const status = this.selectAll;
      let list = [...this.parageraphList];
      list.map(v => (v.selectTF = status));
      this.parageraphList = list;
    },
    codeDisplay() {
      var self = this;
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
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    //修改编码
    searchFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.priceSum = ""; //总条目数
      this.parageraphList = []; //列表

      this.displayAllData();
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "repleOrderDetail",
        query: { outputStockId: elem.id }
      });
    },
    //确定补货事件
    editReple() {
      let self = this;
      var selectIdList = [];
      self.parageraphList.forEach(item => {
        if (item.selectTF == true) {
          selectIdList.push(item);
        }
      });
      self.checkList = selectIdList;
      if (self.checkList.length == 0) {
        self.$message.error("未选择补货产品，请重新输入提交!");
      } else {
        //
        let transfSkuNoteFroms = [];
        self.checkList.forEach(item => {
          transfSkuNoteFroms.push({
            cartId: item.id,
            productRemarks: item.backup != undefined ? item.backup : "",
            productSum: item.Number,
            // totailWeight: item.goldWeight,
            // goldWeight: item.goldWeight,
            suit: item.suit
          });
        });
        // console.log(transfSkuNoteFroms)
        let params = { transfSkuNoteFroms: transfSkuNoteFroms, method: 2 };
        this.$axios
          .post(this.$portMain + "/order/sureReplenishOrders", params)
          .then(res => {
            if (res.data.code == 200) {
              // localStorage.sarkData = JSON.stringify(res.data.data);
              // self.$message.success("确定补货成功，现跳转到补货单！");
              // setTimeout(function() {
              //   self.$router.push("repleOrder");
              // }, 1000);
              localStorage.sarkData = JSON.stringify(res.data.data);
              setTimeout(function() {
                self.$router.push("repleCartDetail");
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    },
    //删除
    delReple() {
      let self = this;
      var selectIdList = [];
      self.parageraphList.forEach(item => {
        if (item.selectTF == true) {
          selectIdList.push(item);
        }
      });
      self.checkList = selectIdList;
      if (self.checkList.length == 0) {
        self.$message.error("未选择补货产品，请重新输入提交!");
      } else {
        let ids = [];
        self.checkList.forEach(ielem => {
          ids.push(ielem.id);
        });
        var params = { PRS: { ids: ids.join(",") } };
        this.$confirm("是否确认操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleCartApi(params);
        });
      }
    },

    deleCartApi(params) {
      this.$axios
        .get(this.$portMain + "/order/deleteReplenishCart", params)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("删除补物购物车产品成功，正在刷新购物车！");
            setTimeout(() => {
              this.infiniteId += 1;
              this.pageNum = 1;
              this.created_fun();
            }, 1000);
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
    //手动修改数量
    handSelect(item, index) {
      let _item = { ...item, Number: ~~item.Number };
      this.parageraphList = [...this.parageraphList];
      this.$nextTick(() => {
        this.$set(this.parageraphList, index, _item);
        this.$Api.get({
          url: "/order/updateReplenishCart",
          data: { repCartId: _item.id, sum: _item.Number }
        });
      });
    },
    //下单备注
    remarkFun(elem) {
      let self = this;
      let params = {
        id: elem.id,
        productRemarks: elem.productRemarks ? elem.productRemarks : ""
      };

      this.$api.formdataPostFun(
        this.$portMain + "/order/cartUpdate",
        params,
        res => {
          // self.$message.success(res.msg);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
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
    //下拉滚动
    infiniteHandler($state) {
      if (this.priceSum != "" && this.parageraphList.length >= this.priceSum) {
        $state.complete();
      } else {
        this.displayAllData()
          .then(res => {
            this.pageNum = this.pageNum + 1;
            $state.loaded();
          })
          .catch(err => {
            $state.complete();
          });
      }
    }
  },
  filters: {
    getAttributes(item) {
      const { craft, goldCode, pait } = item;
      let arr = [];
      Object.values({ craft, goldCode, pait }).map(
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

  .orderBigDiv {
    padding: 20px;
    min-height: 126px;
    border-bottom: #E9ECF5 1px solid;

    .orderBigDivOne {
      color: #333;
    }
  }

  .txtOne {
    font-size: 12px;
    color: #333;
  }

  .txtTwo {
    font-size: 12px;
    color: #999;
  }

  .txtThree {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .txtFour {
    font-size: 14px;
    color: #F20F34;
    font-weight: bold;
  }

  .txtRed {
    font-size: 12px;
    color: #F20F34;
  }

  .tabOne {
    display: flex;
  }

  .tabOneLeft {
    width: 174px;
  }

  .tabOneRight {
    width: calc(100% - 174px);
  }

  .txtAlginRight {
    text-algin: right;
  }

  .tabThree {
    padding: 10px 20px;
    background: rgba(250, 250, 250, 1);

    .tabThreeSubDiv {
      margin: 10px 10px;
      width: calc(50% - 20px);
      padding: 10px 5px;
      background: #fff;
      display: flex;
      border: 1px solid #f0f0f0;

      .tabThreeLeft {
        width: 170px;
        text-align: center;
      }

      .tabThreeRight {
        width: calc(100% - 170px);
        line-height: 30px;
      }
    }
  }

  .redTxtOne {
    color: #F20F34;
    font-weight: bold;
  }
}

.top {
  figure {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 35px;

    h2 {
      font-size: 14px;
      font-weight: bold;
      color: #222426;
    }
  }

  .search {
    display: flex;

    li {
      white-space: nowrap;
      padding-right: 24px;
      font-size: 12px;
      color: #8A8E99;

      span {
        padding-right: 8px;
      }

      .el-input {
        width: 256px;
      }

      .el-select {
        width: 200px;
      }
    }
  }
}

.list {
  header {
    padding: 14px 0 0;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #8A9199;

    span {
      padding-left: 8px;
    }
  }

  ul {
    height: 650px;
    overflow: auto;

    li {
      display: flex;
      flex-wrap: wrap;
      margin-top: 8px;
      box-sizing: border-box;
      border: 1px solid #E5F1FF;
      padding: 15px 0;

      .comm {
        display: flex;
        width: 100%;

        .option {
          flex: 2;
          font-size: 14px;
          color: #8A9199;
          line-height: 30px;
          box-sizing: border-box;

          b {
            color: #222426;
          }

          strong {
            color: #F20F34;
            cursor: pointer;
          }

          img {
            width: 120px;
            height: 90px;
            object-fit: cover;
            background: #eee;
          }

          &:first-of-type, &:last-of-type {
            flex: 1;
          }

          &:first-of-type {
            display: flex;
            align-items: center;
            padding-right: 16px;

            .el-checkbox {
              padding: 0 16px;
            }
          }
        }

        .orderRemark {
          flex: 2;
          display: flex;
          flex-wrap: nowrap;

          span {
            white-space: nowrap;
            font-size: 14px;
            color: #8a9199;
            line-height: 30px;
          }
        }
      }

      .suit {
        display: none;
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
    }
  }
}

.noProduct {
  color: #8A9199;
  font-size: 16px;
  height: 567px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.textAreaStlye {
  width: 86%;
  height: 76px;
  border-radius: 4px;
  border: 1px solid #CFD4E6;
  resize: none;
}
</style>
