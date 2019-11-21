<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>出库-新增出库</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div>
      <OrnamentBizType
        title="出库"
        mode="STOCK_OUT"
        :loadingTF="loadingTF"
        :proList="confirmProdcutData"
        :packagePro="packTableData"
        selectClick="1"
        @change="emitData"
        @submitData="submitData"
        @cancelData="cancelData"
        @launchChange="launchChange"
        @typeFun="typeFun"
      ></OrnamentBizType>
      <div class="bigLine"></div>
    </div>

    <!-- 打包数据 -->
    <div class="packDataWrap" v-show="sponsorType != 'NORMAL'">
      <div class="packTitle">
        <div class="title">打包信息</div>
        <div>
          <!-- v-show="searchData.bizType == 'SEND_CLIENT'" -->
          <el-select
            v-model="parentPack.shopName"
            placeholder="请选择店铺"
            size="mini"
            class="width200"
            v-show="false"
            @change="selectShopFun"
          >
            <el-option
              v-for="item in shopData"
              :key="item.shopId"
              :label="item.shopName"
              :value="item.shopId"
            ></el-option>
          </el-select>
          <el-button type="primary" size="small" plain @click="addNewPackFun">添加新包</el-button>
        </div>
      </div>

      <el-table
        ref="singleTable"
        :data="packTableData"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column prop="date" label="金料成色">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.conditi"
              placeholder="请选择"
              size="mini"
              class="width140"
              :disabled="scope.row | selectDisabled"
            >
              <el-option
                v-for="item in basicData.condition_code"
                :key="item.code"
                :label="item.val"
                :value="item.val"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="类别">
          <template slot-scope="scope">
            <!-- <el-select v-model="scope.row.one" placeholder="请选择" size="mini" class="width100">
              <el-option
                v-for="item in basicData.one_items_code"
                :key="item.code"
                :label="item.val"
                :value="item.val"
              ></el-option>
            </el-select>-->
            <el-select
              v-model="scope.row.one"
              filterable
              placeholder="请输入类别"
              size="small"
              class="width140"
            >
              <el-option
                v-for="item in oneData"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="packTotalAmount" label="总数量"></el-table-column>
        <el-table-column prop="packTotalSuttle" label="净重(g)"></el-table-column>
        <el-table-column label="毛重(g)">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.packNetTotalWeight"
              placeholder="请输入内容"
              size="mini"
              class="width100"
              @input="inputRendering"
              @blur="checkNumber(scope.row,'packNetTotalWeight')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="毛重差异(g)">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.weightDif"
              placeholder="请输入内容"
              size="mini"
              class="width100"
              @input="inputRendering"
              @blur="checkNumber(scope.row,'weightDif')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="过重备注">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.weightDifRemark"
              placeholder="请输入内容"
              size="mini"
              class="width100"
              @input="inputRendering"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="备注">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              placeholder="请输入内容"
              size="mini"
              class="width100"
              @input="inputRendering"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <span
              style="color:#F20F34;cursor: pointer;"
              @click.stop="packDetailFun(scope.$index)"
            >详情</span>
            <span
              style="color:#F2930F;cursor: pointer;"
              @click.stop="deleteProductFun(scope.$index)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="hr"></div> -->
    </div>

    <div class="productWrap">
      <div class="skuTitel">已选SKU</div>
      <SkuScreen @suitSearch="searchFun" :proList="confirmProdcutData">
        <el-button type="primary" size="small" plain @click="addProductDialog">添加产品</el-button>
      </SkuScreen>
      <div style="height: 10px"></div>
      <!-- 产品 -->
      <div v-if="productItemOneType">
        <ProductItemOne
          v-for="(item,index) in confirmProdcutData"
          :key="index"
          :productData="item"
          :addPackType="sponsorType != 'NORMAL'"
          @deleteProduct="deleteProduct"
          @addPackFun="addPackFun"
          :companyName="searchData"
        ></ProductItemOne>
      </div>

      <!-- 添加产品 -->
      <div v-if="dialogType">
        <AddProductsOne
          :dialogType="dialogType"
          :companyName="searchData"
          :afferentData="afferentData"
          :searchDataOld="searchData"
          :confirmProdcutData="backUpConfirmProdcutData"
          :loadingTF="loadingTF"
          @confirmProdcut="confirmProdcut"
          @close="closeFun"
        ></AddProductsOne>
      </div>
    </div>
    <!-- 包详情数据 -->
    <OutPackProductDetails
      :companyName="searchData"
      :dialogType="dialogPackDetailType"
      :packBarData="packDetailData"
      @removeProductsFun="removeProductsFun"
      ref="OutPackProductDetails"
    ></OutPackProductDetails>
  </div>
</template>
<script>
export default {
  data() {
    return {
      oneData: [], //类别数据
      orderInfoData: {}, //引用单据号需要返回数据
      sponsorType: "", //发起单位状态(货柜仓、虚拟仓)
      parentPack: {
        packTotalAmount: "",
        packTotalSuttle: "",
        packNetTotalWeight: "",
        weightDif: "",
        weightDifRemark: "",
        remark: "",
        shopName: "",
        shopTelepone: "18254858589",
        shopAdr: "深圳市罗湖水贝",
        mailWay: "1",
        subPack: []
      },
      shopData: [
        //店铺数据
        {
          shopName: "请选择",
          shopId: ""
        },
        {
          shopName: "店铺A",
          shopId: "店铺A"
        },
        {
          shopName: "店铺B",
          shopId: "店铺B"
        },
        {
          shopName: "店铺C",
          shopId: "店铺C"
        }
      ],
      packDetailData: {}, //包详情数据
      searchData: {}, //头部筛选数据
      dialogPackDetailType: "", //包详情状态
      productItemOneType: true,
      afferentData: {},
      title: "出库",
      productData: [], //产品数据
      dialogType: "", //添加产品状态
      mock: "",
      packTableData: [],
      loadingState: false,
      currentRow: null, //选中的包
      basicData: [], //基础数据
      confirmProdcutData: [], //确认的产品
      backUpConfirmProdcutData: [], //确认的产品
      loadingTF: false
    };
  },
  created() {
    this.created_fun();
  },
  filters: {
    selectDisabled(row) {
      if (row.packDetails.length == 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    created_fun() {
      // this.outStoreId = this.$route.query.outStoreId;
      this.getBasicData();
      this.getCategory();
    },

    closeFun() {
      this.dialogType = false;
    },

    //获取基础数据
    getBasicData() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/proCommonController/code")
        .then(function(res) {
          if (res.data.code == 200) {
            self.basicData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //添加产品(弹框)
    addProductDialog() {
      if (!this.searchData.bizType) {
        this.$message.error("请选择出库类型！");
        return;
      }
      if (!this.searchData.send) {
        this.$message.error("请选择发起单位！");
        return;
      }

      this.afferentData = {
        storeId: this.searchData.send
      };
      this.dialogType = new Date().getTime();
    },
    //数据修改时传值
    emitData(options) {
      this.searchData = options;
      this.sponsorType = options.sendItem.type;
      this.searchData.sendName = options.sendItem.name;
      this.searchData.type = this.sponsorType;
    },
    //发起单位事件
    launchChange() {
      this.confirmProdcutData = []; //确认的产品
      this.backUpConfirmProdcutData = []; //确认的产品
      this.packTableData = [];
      this.parentPack.shopName = "";
    },
    //出库类型事件
    typeFun() {
      this.parentPack.shopName = "";
    },
    //点击“提交”传值
    submitData(options) {
      this.submitFun(options, options.btnStatus);
    },
    //校验提交
    checkSubmitData(options) {
      if (options.bizType == "") {
        this.$message.error("请选择出库类型！");
        return true;
      }
      if (options.send == "") {
        this.$message.error("请选择发起单位！");
        return true;
      }
      if (options.receive == "") {
        this.$message.error("请选择接收单位！");
        return true;
      }
      if (
        this.confirmProdcutData.length == 0 &&
        this.packTableData.length == 0
      ) {
        this.$message.error("请选择出库的产品！");
        return true;
      }
      if (this.confirmProdcutData.length > 0 && this.packTableData.length > 0) {
        this.$message.error("抱歉，还有产品没有添加到包，请添加后再提交！");
        return true;
      }

      if (this.sponsorType == "FICTITIOUS") {
        if (this.confirmProdcutData.length > 0) {
          this.$message.error("请打包后再提交！");
          return true;
        }

        if (this.packTableData.every(item => item.packDetails.length == 0)) {
          this.packTableData = [];
          this.$message.error("已经将空包清除了，请重新添加包和产品！");
          return true;
        } else if (
          this.packTableData.some(item => item.packDetails.length == 0)
        ) {
          let newArr = [];
          newArr = this.packTableData.filter(item => {
            return item.packDetails.length > 0;
          });
          this.packTableData = newArr;
        }
      }

      // let result;
      // this.packTableData.forEach(item => {
      //   if (item.packDetails.length == 0) {
      //     result = true;
      //   }
      // });

      // if (result) {
      //   this.$message.error("已经将空包清楚了！");
      //   return true;
      // }

      let contentResult;
      this.packTableData.forEach(item => {
        if (
          item.conditi == "" ||
          item.one == "" ||
          item.packNetTotalWeight == ""
        ) {
          contentResult = true;
        }
      });

      if (contentResult) {
        this.$message.error("抱歉，成色、类别、毛重不能为空！");
        return true;
      }

      //校验毛重不能小于净重
      let weightResult = false;
      this.packTableData.forEach(item => {
        if (Number(item.packNetTotalWeight) < Number(item.packTotalSuttle)) {
          weightResult = true;
        }
      });

      if (weightResult) {
        this.$message.error("抱歉，毛重不能小于净重！");
        return true;
      }
    },
    //保存校验
    checkSaveData(options) {
      if (options.bizType == "") {
        this.$message.error("请选择出库类型！");
        return true;
      }
      if (options.send == "") {
        this.$message.error("请选择发起单位！");
        return true;
      }
      if (options.receive == "") {
        this.$message.error("请选择接收单位！");
        return true;
      }
      if (this.confirmProdcutData.length > 0 && this.packTableData.length > 0) {
        this.$message.error("抱歉，还有产品没有添加到包，请添加后再提交！");
        return true;
      }

      if (this.sponsorType == "FICTITIOUS") {
        if (this.confirmProdcutData.length > 0) {
          this.$message.error("请打包后再提交！");
          return true;
        }
      }

      this.packTableData.forEach(item => {
        if (item.packNetTotalWeight == "") {
          item.packNetTotalWeight = 0;
        }
      });
    },

    submitFun(options, opreateTyep) {
      let self = this;

      if (opreateTyep == "WAITCONFIRM" && this.checkSubmitData(options)) {
        return;
      }

      if (opreateTyep == "DRAFT" && this.checkSubmitData(options)) {
        return;
      }

      let params = {
        outType: options.bizType,
        sponsorRepoId: options.send,
        sponsorRepoName: options.sendItem.type,
        receiverDepId: options.receive,
        receiverDepName: options.receiveItem.companyName,
        remarks: options.remark,
        proInfo: "",
        packInfo: "",
        parentPack: "",
        opreateTyep: opreateTyep,
        orderNo: this.orderInfoData.orderNo ? this.orderInfoData.orderNo : "",
        oriOrderNo: this.orderInfoData.oriOrderNo
          ? this.orderInfoData.oriOrderNo
          : "",
        orderType: this.orderInfoData.orderType
          ? this.orderInfoData.orderType
          : ""
      };

      //未打包（全部产品）
      if (this.backUpConfirmProdcutData.length > 0) {
        let proInfo = [];
        this.backUpConfirmProdcutData.forEach(item => {
          proInfo.push({
            skuNo: item.proNumber,
            skuNum: item.skuNum,
            skuWeight: item.editSuttle,
            skuNoteWeight: item.editWeight,
            remarkReason: item.remarkReason.join(),
            remark: item.remark
          });
        });
        if (this.packTableData.length > 0) {
          proInfo.forEach(item => {
            item.remarkReason = "";
            item.remark = "";
          });
        }
        params.proInfo = JSON.stringify(proInfo);
      }

      //已打包
      let packTableData;
      if (this.packTableData.length > 0) {
        let packDetail = [];
        packTableData = JSON.parse(JSON.stringify(this.packTableData));
        packTableData.forEach(item => {
          item.packDetail = [];
          item.packDetails.forEach(it => {
            item.packDetail.push({
              bizNo: "",
              packId: item.packId,
              skuNumber: it.proNumber,
              amount: it.skuNum,
              suttle: it.editSuttle,
              weight: it.editWeight,
              remarkReason: it.remarkReason.join(),
              remark: it.remark
            });
          });
        });
        packTableData.forEach(item => {
          delete item.packDetails;
        });
        params.packInfo = JSON.stringify(packTableData);
      }

      //包中包数据
      // if (this.parentPack.shopName != "") {
      //   this.parentPack.subPack = packTableData;
      //   this.parentPack.subPack.forEach(item => {
      //     this.parentPack.packTotalAmount += item.packTotalAmount;
      //     this.parentPack.packTotalSuttle += item.packTotalSuttle;
      //     this.parentPack.packNetTotalWeight += item.packNetTotalWeight;
      //   });
      //   params.parentPack = JSON.stringify([this.parentPack]);
      //   params.packInfo = "";
      // }

      this.loadingTF = true;
      this.$api.formdataPostFun(
        this.$portMain + "/stockOutManager/stockOutInsert",
        params,
        res => {
          self.$message.success(res.msg);
          self.loadingTF = false;
          self.$router.push("outOfStockRedoList");
        },
        err => {
          self.$message.error(err.msg);
          self.loadingTF = false;
        }
      );
    },
    //取消返回出库列表页
    cancelData(options) {
      if (
        this.confirmProdcutData.length !== 0 ||
        this.packTableData.length !== 0
      ) {
        this.$api.refClick(this).then(res => {
          this.$router.push("outOfStockRedoList");
        });
      } else {
        this.$router.push("outOfStockRedoList");
      }
    },
    //sku筛选
    searchFun(elem) {
      this.confirmProdcutData = elem.backProList;
    },
    // 合并产品列表
    filterArr(elem) {
      let arr = [...elem];
      var ret = [];
      for (var i = 0; i <= arr.length - 1; i++) {
        var textTF = true;
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].proNumber == arr[j].proNumber) {
            arr[j].skuNum = Number(arr[i].skuNum) + Number(arr[j].skuNum);
            arr[j].editSuttle = (
              Number(arr[i].editSuttle) + Number(arr[j].editSuttle)
            ).toFixed(2);
            arr[j].editWeight = (
              Number(arr[i].editWeight) + Number(arr[j].editWeight)
            ).toFixed(2);
            arr[j].remark = `${arr[i].remark ? `${arr[i].remark};` : ``}${
              arr[j].remark
            }`;
            arr[j].remarkReason = [
              ...new Set(arr[i].remarkReason.concat(arr[j].remarkReason))
            ];
            textTF = false;
            break;
          }
        }
        if (textTF) {
          ret.push(arr[i]);
        }
      }
      return ret;
    },
    //确认选中
    confirmProdcut(elem, orderInfo) {
      this.loadingTF = true;
      elem.forEach(item => {
        item.showStatus = false;
      });
      if (this.confirmProdcutData.length == 0) {
        this.confirmProdcutData = elem;
      } else {
        let newArr = [
          ...JSON.parse(JSON.stringify(this.confirmProdcutData)),
          ...JSON.parse(JSON.stringify(elem))
        ];
        this.confirmProdcutData = this.filterArr(newArr);
      }

      this.confirmProdcutData.forEach(item => {
        item.editSuttle = Number(item.editSuttle).toFixed(2);
        item.editWeight = Number(item.editWeight).toFixed(2);
      });

      let backArr = [
        ...JSON.parse(JSON.stringify(this.backUpConfirmProdcutData)),
        ...JSON.parse(JSON.stringify(elem))
      ];
      this.backUpConfirmProdcutData = this.filterArr(backArr);

      //引入单据号
      if (orderInfo.orderNo) {
        this.orderInfoData = orderInfo;
      }

      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
        this.loadingTF = false;
      });
    },

    //删除产品
    deleteProduct(val) {
      let deleteIndex;
      this.confirmProdcutData.forEach((item, index) => {
        if (item.proNumber == val) {
          deleteIndex = index;
        }
      });

      let deleteProduct = this.confirmProdcutData[deleteIndex];
      this.backUpConfirmProdcutData.forEach(item => {
        if (item.proNumber == val) {
          item.skuNum = item.skuNum - deleteProduct.skuNum;
        }
      });

      let newBackArr = this.backUpConfirmProdcutData.filter(item => {
        return item.skuNum > 0;
      });
      this.backUpConfirmProdcutData = newBackArr;
      this.confirmProdcutData.splice(deleteIndex, 1);

      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
      });

      //产品删除引用单据号
      if (this.backUpConfirmProdcutData.length == 0) {
        this.orderInfoData = {};
      }
    },
    //表格选中行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    //添加新包(表格)
    addNewPackFun() {
      this.packTableData.push({
        bizNo: "",
        packId: this.packTableData.length + 1,
        supPackId: "",
        packTotalAmount: 0,
        packTotalSuttle: 0,
        packNetTotalWeight: 0,
        conditi: "",
        one: "",
        weightDif: "",
        weightDifRemark: "",
        remark: "",
        packDetails: []
      });
      let tabIndex = this.packTableData.length - 1;
      this.$refs.singleTable.setCurrentRow(this.packTableData[tabIndex]);
      this.handleCurrentChange(this.packTableData[tabIndex]);
      this.$forceUpdate();
    },

    //添加到包
    addPackFun(elem) {
      if (this.currentRow == null) {
        this.$message.error("请选择包！");
        return;
      }

      if (this.currentRow.conditi == "") {
        this.currentRow.conditi = elem.conditiName;
      } else if (this.currentRow.conditi != elem.conditiName) {
        this.$message.error("添加失败，该包成色不匹配，请重新添加！");
        return;
      }
      elem.showStatus = false;
      let newArr = [
        ...JSON.parse(JSON.stringify(this.currentRow.packDetails)),
        JSON.parse(JSON.stringify(elem))
      ];

      this.currentRow.packDetails = this.filterArr(newArr);

      let deleteIndex;
      this.confirmProdcutData.forEach((item, index) => {
        if (item.proNumber == elem.proNumber) {
          deleteIndex = index;
        }
      });
      this.currentRow.packTotalAmount =
        Number(this.currentRow.packTotalAmount) + Number(elem.skuNum);
      this.currentRow.packTotalSuttle = (
        Number(this.currentRow.packTotalSuttle) + Number(elem.editSuttle)
      ).toFixed(2);
      this.currentRow.packNetTotalWeight = (
        Number(this.currentRow.packNetTotalWeight) + Number(elem.editWeight)
      ).toFixed(2);
      this.currentRow.weightDif = (
        this.currentRow.packNetTotalWeight - this.currentRow.packTotalSuttle
      ).toFixed(2);
      this.confirmProdcutData.splice(deleteIndex, 1);
      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
      });
    },
    //包详情
    packDetailFun(index) {
      if (this.packTableData[index].packDetails.length == 0) {
        this.$message.error("抱歉，包里面没有产品，请添加产品！");
        return;
      }
      this.dialogPackDetailType = new Date().getTime();
      this.packDetailData = this.packTableData[index];
    },

    // 删除包
    deleProPackge(index) {
      let newArr = [
        ...this.confirmProdcutData,
        ...this.packTableData[index].packDetails
      ];
      this.confirmProdcutData = this.filterArr(newArr);

      this.packTableData.splice(index, 1);

      if (this.packTableData.length > 0) {
        let tabIndex = this.packTableData.length - 1;
        this.$refs.singleTable.setCurrentRow(this.packTableData[tabIndex]);
        this.handleCurrentChange(this.packTableData[tabIndex]);
      } else {
        this.currentRow = null;
      }

      // this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
      });
    },

    //删除包详情
    deleteProductFun(index) {
      this.$api.refClick(this).then(res => {
        this.deleProPackge(index);
      });
    },
    //包中移除产品
    removeProductsFun(val) {
      let { packId, proNumber } = val;
      let packIndex, productIndex, removeProduct;
      this.packTableData.forEach((item, index) => {
        if (item.packId == packId) {
          packIndex = index;
          item.packDetails.forEach((it, num) => {
            if (it.proNumber == proNumber) {
              productIndex = num;
              removeProduct = it;
            }
          });
        }
      });
      let newArr = [
        ...this.confirmProdcutData,
        JSON.parse(JSON.stringify(removeProduct))
      ];
      this.confirmProdcutData = this.filterArr(newArr);

      this.packTableData[packIndex].packDetails.splice(productIndex, 1);

      this.packTableData[packIndex].packTotalAmount =
        Number(this.packTableData[packIndex].packTotalAmount) -
        Number(removeProduct.skuNum);
      this.packTableData[packIndex].packTotalSuttle = (
        Number(this.packTableData[packIndex].packTotalSuttle) -
        Number(removeProduct.editSuttle)
      ).toFixed(2);
      // this.packTableData[packIndex].packNetTotalWeight =
      //   Number(this.packTableData[packIndex].packNetTotalWeight) -
      //   Number(removeProduct.skuWeight);
      if (this.packTableData[packIndex].packDetails.length == 0) {
        this.$refs.OutPackProductDetails.clickFun();
        this.packTableData[packIndex].packNetTotalWeight = 0;
        this.packTableData[packIndex].conditi = "";
      }
    },
    //选择店铺
    selectShopFun() {
      this.packTableData = [];
      this.confirmProdcutData = [...this.backUpConfirmProdcutData];
    },
    //校验数字
    checkNumber(item, name) {
      item[name] = String(item[name]).trim();
      let result = isNaN(item[name]);
      let result2 = Number(item[name]) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        item[name] = 0;
        return;
      }

      // 校验毛重不能小于净重
      if (
        name == "packNetTotalWeight" &&
        Number(item.packTotalSuttle) > Number(item.packNetTotalWeight)
      ) {
        this.$message.error("抱歉，输入的毛重不能小于净重!");
        item[name] = 0;
        return;
      }

      item[name] = Number(item[name]);
    },
    //类别
    getCategory() {
      let self = this;
      let params = {};
      this.$axios
        .get(self.$portMain + "/proCommonController/findMarket", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.oneData = res.data.data;
          } else {
            self.oneData = [];
          }
        });
    },
    //输入渲染
    inputRendering() {
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.outOfStock {
  font-family: Microsoft YaHei;

  .smallTitle {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8A8E99;
  }

  .width200 {
    width: 200px;
  }

  .width240 {
    width: 240px;
  }

  .width100 {
    width: 100px;
  }

  .width140 {
    width: 140px;
  }

  .productWrap {
    margin-top: 29px;
    margin-bottom: 20px;

    .skuTitel {
      font-size: 16px;
      font-weight: bold;
      color: #232426;
      margin-bottom: 16px;
    }
  }

  .packDataWrap {
    margin-top: 29px;

    .packTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 19px;

      .title {
        font-size: 16px;
        font-weight: bold;
        color: #232426;
      }
    }
  }
}
</style>
