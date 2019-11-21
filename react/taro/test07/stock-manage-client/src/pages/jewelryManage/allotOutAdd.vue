<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增调拨出库</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div>
      <OrnamentBizType
        title="新增调拨"
        mode="TRANSFER"
        :loadingTF="loadingTF"
        :proList="confirmProdcutData"
        :packagePro="packTableData"
        selectClick="1"
        @change="emitData"
        @submitData="submitData"
        @launchChange="launchChange"
        @cancelData="cancelData"
      ></OrnamentBizType>
      <div class="bigLine"></div>
    </div>

    <!-- 打包数据 -->
    <div class="packDataWrap" v-if="baoDisplayTF">
      <div class="packTitle">
        <div class="title">打包信息</div>
        <el-button type="primary" size="small" plain @click="addNewPackFun">添加新包</el-button>
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
              @change="selectConditi(scope.row)"
              :disabled="scope.row | selectDisabled"
            >
              <el-option
                v-for="item in basicData.condition_code"
                :key="item.val"
                :label="item.val"
                :value="item.val"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="类别">
          <template slot-scope="scope">
            <!-- <el-select
              v-model="scope.row.one"
              placeholder="请选择"
              size="mini"
              class="width100"
              @change="selectOne(scope.row)"
            >
              <el-option
                v-for="item in basicData.one_items_code"
                :key="item.val"
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
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入内容" size="mini" class="width100"></el-input>
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
        <el-button
          type="primary"
          size="small"
          plain
          @click="addProductDialog"
          :loading="loadingTF"
        >添加产品</el-button>
      </SkuScreen>
      <div style="height: 10px"></div>

      <!-- 产品 -->
      <div v-if="productItemOneType">
        <allotProductItemTwo
          v-for="(item,index) in confirmProdcutData"
          :key="index"
          :productData="item"
          @deleteProduct="deleteProduct"
          :addPackType="baoDisplayTF"
          @addPackFun="addPackFun"
        ></allotProductItemTwo>
      </div>

      <!-- 添加产品 -->
      <div v-if="dialogType">
        <AddProductsOne
          :dialogType="dialogType"
          :afferentData="afferentData"
          :companyName="searchData.sendItem?searchData.sendItem:''"
          :searchDataOld="searchData"
          :confirmProdcutData="backUpConfirmProdcutData"
          :loadingTF="loadingTF"
          mode="TRANSFER"
          @confirmProdcut="confirmProdcut"
          @close="closeFun"
        ></AddProductsOne>
      </div>
    </div>
    <!-- 包详情数据 -->
    <OutPackProductDetails
      :dialogType="dialogPackDetailType"
      :packBarData="packDetailData"
      @removeProductsFun="removeProductsFun"
      :pageStatus="false"
      ref="OutPackProductDetails"
    ></OutPackProductDetails>
    <!-- 打印sku开始 -->
    <div v-show="false">
      <printTPSkuSix :billData="printData" ref="printTPTwo"></printTPSkuSix>
    </div>
    <!-- 打印sku结束 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      oneData: [], //类别数据
      packDetailData: {}, //包详情数据
      dialogPackDetailType: "", //包详情状态
      searchData: {}, //发起单位和接收单位对象
      productItemOneType: true,
      afferentData: {},
      title: "出库",
      productData: [], //产品数据
      dialogType: "", //添加产品状态
      mock: "",
      mockData: [],
      packTableData: [],
      loadingState: false,
      currentRow: null, //选中的包
      basicData: [], //基础数据
      confirmProdcutData: [], // 确认的产品
      backUpConfirmProdcutData: [], //确认的产品
      baoDisplayTF: true,
      parentPack: {},
      loadingTF: false,
      orderInfo: {},
      printData: { proNumber: 1111111 }
    };
  },
  created() {
    this.created_fun();
  },
  filters: {
    selectDisabled(row) {
      if (row.packDetail.length == 0) {
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
      // console.log("新增");
      // console.log(this.searchData)
      if (this.checkSaveData(this.searchData)) {
        return;
      }
      this.afferentData = {
        storeId: "2"
      };
      this.dialogType = new Date().getTime();
    },
    //数据修改时传值
    emitData(options) {
      this.searchData = options;
      console.log("改变数据", options);
      //库位仓不用打包
      if (options.sendItem.type === "NORMAL") {
        this.baoDisplayTF = false;
      } else {
        this.baoDisplayTF = true;
      }
    },
    //点击“提交”传值
    submitData(options) {
      this.confirmFun(options);
    },
    //保存、提交公用方法
    confirmFun(options, elem) {
      let self = this;
      this.loadingTF = true;
      let numTF = true; //输入数量、净重、毛重
      if (
        !options.receive ||
        !options.send ||
        options.send === options.receive
      ) {
        self.$message.error(
          "发送单位和接收单位为必填并且不能相同，请重新填写提交！"
        );
        self.loadingTF = false;
        return false;
      }
      let prosList = []; //单据产品（打包和未打包都要）列表
      let newBackData = JSON.parse(
        JSON.stringify(this.backUpConfirmProdcutData)
      );
      newBackData.forEach(ielem => {
        if (
          ielem.skuNum <= 0 ||
          ielem.editSuttle <= 0 ||
          ielem.editWeight <= 0
        ) {
          numTF = false;
        }
        ielem.skuId = ielem.proNumber; //sku
        ielem.remark = ielem.skuRemarks ? ielem.skuRemarks : ielem.remark; //备注
        ielem.remarkReason = ielem.remarkReason.join();
        ielem.amount = ielem.skuNum ? parseInt(ielem.skuNum) : ielem.amount; //净重
        ielem.suttle = ielem.editSuttle
          ? parseFloat(ielem.editSuttle)
          : ielem.suttle; //净重
        ielem.weight = ielem.editWeight
          ? parseFloat(ielem.editWeight)
          : ielem.weight; //毛重
        prosList.push(ielem);
        // console.log('ielem：',ielem)
      });
      if (this.baoDisplayTF) {
        if (this.packTableData.length == 0) {
          this.$message.error("虚拟仓要打包才能提交，请打包后再提交！");
          this.loadingTF = false;
          return;
        }

        if (
          this.packTableData.length == 1 &&
          this.packTableData.every(item => item.packDetail.length == 0)
        ) {
          this.$message.error("请将产品添加到包后再提交");
          this.loadingTF = false;
          return;
        } else if (
          this.packTableData.length > 1 &&
          this.packTableData.every(item => item.packDetail.length == 0)
        ) {
          this.$message.error("请将产品添加到包后再提交");
          this.loadingTF = false;
          return;
        } else if (
          this.packTableData.some(item => item.packDetail.length == 0)
        ) {
          let newArr = [];
          newArr = this.packTableData.filter(item => {
            return item.packDetail.length > 0;
          });
          this.packTableData = newArr;
        }
        console.log("产品数据", this.packTableData);
      }
      let packsList = []; //包列表数据
      let newPackTableData = JSON.parse(JSON.stringify(this.packTableData));
      let emptyPackTF = false;

      newPackTableData.forEach(jelem => {
        // console.log(jelem)

        jelem.weightDif = jelem.weightDif ? parseFloat(jelem.weightDif) : null; //毛重差异字符转数值
        jelem.packNetTotalWeight = jelem.packNetTotalWeight
          ? parseFloat(jelem.packNetTotalWeight)
          : null; //包总毛重字符转数值
        if (jelem.packNetTotalWeight < jelem.packTotalSuttle) {
          numTF = false;
        }
        if (!jelem.packDetail || jelem.packDetail.length === 0) {
          emptyPackTF = true;
        }
        jelem.packDetail.forEach(kelem => {
          if (
            kelem.skuNum <= 0 ||
            kelem.editSuttle <= 0
            // || kelem.editWeight <= 0
          ) {
            numTF = false;
          }
          kelem.skuNumber = kelem.proNumber; //sku编号
          kelem.amount = kelem.skuNum
            ? parseInt(kelem.skuNum)
            : parseInt(kelem.amount); //数量
          kelem.suttle = kelem.editSuttle
            ? parseFloat(kelem.editSuttle)
            : parseFloat(kelem.suttle); //净重
          kelem.weight = kelem.editWeight
            ? parseFloat(kelem.editWeight)
            : parseFloat(kelem.weight); //毛重
          kelem.skuNumber = kelem.proNumber;
          kelem.remarkReason = kelem.remarkReason.join();
        });
        // console.
        packsList.push(jelem);
      });
      let invoiceStatuValueTxt = this.$api.orderNameFun(options.btnStatus);
      let bizObj = {
        initiatorId: options.sendItem.secId, //发起者ID
        initiator: options.sendItem.name, //发起者名称
        initiatorRepoType: options.sendItem.type, //发起仓库类型
        initiatorRepoId: options.sendItem.id, //发起仓库ID
        recipientId: options.receiveItem.secId, //接收者ID
        recipient: options.receiveItem.name, //接收者
        recipientRepoType: options.receiveItem.type, //接收者仓库类型
        recipientRepoId: options.receiveItem.id, //接收者仓库ID
        invoiceType: "TRANSFER", //单据类型
        invoiceMark: options.remark, //单据备注
        invoiceStatuValue: invoiceStatuValueTxt, //单据状态名称
        invoiceStatu: options.btnStatus, //单据状态
        pros: prosList, //单据产品（打包和未打包都要）列表
        packs: packsList, //单据产品（打包和未打包都要）列表
        tempNum: 0
      };
      //产品添加引用单据号
      if (this.orderInfo.orderNo) {
        bizObj.lineId = this.orderInfo.oriOrderNo;
        bizObj.sourceInvoiceType = this.orderInfo.orderType;
        bizObj.sourceInvoiceNo = this.orderInfo.orderNo;
      }
      //产品删除引用单据号
      if (this.backUpConfirmProdcutData.length == 0) {
        this.orderInfo = {};
        delete bizObj.lineId;
        delete bizObj.sourceInvoiceType;
        delete bizObj.sourceInvoiceNo;
      }
      let params = {
        biz: bizObj
      };

      if (!numTF) {
        self.$message.error(
          "输入数量、净重、毛重不能为负数或毛重不能小于净重，请重新输入提交！"
        );
        self.loadingTF = false;
        return false;
      }
      if (emptyPackTF) {
        self.$message.error("请将产品添加到包后再提交！");
        self.loadingTF = false;
        return false;
      }
      if (newPackTableData.some(n => n.one === "")) {
        self.$message.error("请选择每个包里的类别选项！");
        self.loadingTF = false;
        return false;
      }

      if (bizObj.packs.length > 0 && this.confirmProdcutData.length > 0) {
        self.$message.error("只能全打包或全不打包才能提交，请重新输入提交！");
        self.loadingTF = false;
        return false;
      }

      console.log("提交");
      // return;
      this.$axios
        .post(self.$portMain + "/transferController/addAllotData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // self.$message.success(`提交成功，正在返回调拨出库列表页！`);
            self.$message.success(`操作成功！`);
            self.loadingTF = false;
            setTimeout(function() {
              self.$router.push("allotOutList");
            }, 1000);
          } else {
            self.loadingTF = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    //包数量、统计毛重、净重
    sumBaofun(elem) {
      elem.packTotalAmount = 0;
      elem.packTotalSuttle = 0;
      elem.packNetTotalWeight = 0;
      elem.packDetail.forEach(ielem => {
        elem.packTotalAmount += parseInt(ielem.skuNum);
        elem.packTotalSuttle += parseFloat(ielem.editSuttle);
        elem.packNetTotalWeight += parseFloat(ielem.editWeight);
      });
      elem.packTotalAmount = this.$api.returnFloatNum(elem.packTotalAmount);
      elem.packTotalSuttle = this.$api.returnFloatNum(elem.packTotalSuttle);
      elem.packNetTotalWeight = this.$api.returnFloatNum(
        elem.packNetTotalWeight
      );
    },
    //取消返回出库列表页
    cancelData(options) {
        if(this.confirmProdcutData.length !== 0 ||  this.packTableData.length !== 0) {
            this.$api.refClick(this).then(res => {
                this.$router.push("allotOutList");
            });
        }else {
            this.$router.push("allotOutList");
        }
    },
    //sku筛选
    searchFun(elem) {
      // console.log(elem);
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
            arr[j].editSuttle =
              Number(arr[i].editSuttle) + Number(arr[j].editSuttle);
            arr[j].editWeight =
              Number(arr[i].editWeight) + Number(arr[j].editWeight);
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
      let self = this;
      this.loadingTF = true;
      setTimeout(function() {
        self.orderInfo = orderInfo;
        if (self.confirmProdcutData.length == 0) {
          self.confirmProdcutData = elem;
        } else {
          let newArr = [
            ...JSON.parse(JSON.stringify(self.confirmProdcutData)),
            ...JSON.parse(JSON.stringify(elem))
          ];
          self.confirmProdcutData = self.filterArr(newArr);
        }

        let backArr = [
          ...JSON.parse(JSON.stringify(self.backUpConfirmProdcutData)),
          ...JSON.parse(JSON.stringify(elem))
        ];
        self.backUpConfirmProdcutData = self.filterArr(backArr);

        self.productItemOneType = false;
        self.confirmProdcutData.forEach(ielem => {
          ielem.editSuttle = self.$api.returnFloatNum(ielem.editSuttle);
          ielem.editWeight = self.$api.returnFloatNum(ielem.editWeight);
          ielem.skuNoteWeight = self.$api.returnFloatNum(ielem.skuNoteWeight);
          ielem.skuWeight = self.$api.returnFloatNum(ielem.skuWeight);
        });
        self.$nextTick(() => {
          self.loadingTF = false;
          self.productItemOneType = true;
        });
      }, 500);
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
    },
    //表格选中行
    handleCurrentChange(val) {
      this.currentRow = val;
      // console.log(val);
    },
    //添加新包(表格)
    addNewPackFun() {
      if (this.checkSaveData(this.searchData)) {
        return;
      }
      this.packTableData.push({
        bizNo: "",
        packId: this.packTableData.length + 1,
        sup_pack_id: "",
        packTotalAmount: 0,
        packTotalSuttle: 0,
        packNetTotalWeight: 0,
        conditi: "",
        one: "",
        weightDif: 0,
        weightDifRemark: "",
        remark: "",
        packDetail: []
      });
      let tabIndex = this.packTableData.length - 1;
      this.$refs.singleTable.setCurrentRow(this.packTableData[tabIndex]);
      this.handleCurrentChange(this.packTableData[tabIndex]);
    },

    //包详情
    packDetailFun(index) {
      // console.log("产品数据", this.packTableData[index]);
      if (this.packTableData[index].packDetail == 0) {
        this.$message.error("抱歉，包里面没有产品，请添加产品！");
        return;
      }
      this.dialogPackDetailType = new Date().getTime();
      this.packDetailData = this.packTableData[index];
      this.packTableData[index].packDetails = this.packTableData[
        index
      ].packDetail;
    },

    // 删除包
    deleProPackge(index) {
      let newArr = [
        ...this.confirmProdcutData,
        ...this.packTableData[index].packDetail
      ];
      this.confirmProdcutData = this.filterArr(newArr);

      this.packTableData.splice(index, 1);
      this.productItemOneType = false;
      if (this.packTableData.length > 0) {
        this.$refs.singleTable.setCurrentRow(this.packTableData[0]);
        this.handleCurrentChange(this.packTableData[0]);
        this.currentRow = this.packTableData[0];
      } else {
        this.currentRow = null;
      }
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
          item.packDetail.forEach((it, num) => {
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

      this.packTableData[packIndex].packDetail.splice(productIndex, 1);
      //包数量、统计毛重、净重
      this.sumBaofun(this.packTableData[packIndex]);
      if (this.packTableData[packIndex].packDetail.length == 0) {
        this.$refs.OutPackProductDetails.clickFun();
        this.packTableData[packIndex].conditi = "";
      }
    },

    //添加到包
    addPackFun(elem) {
      // console.log(elem)
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
        ...JSON.parse(JSON.stringify(this.currentRow.packDetail)),
        JSON.parse(JSON.stringify(elem))
      ];
      this.currentRow.packDetail = this.filterArr(newArr);

      let deleteIndex;
      this.confirmProdcutData.forEach((item, index) => {
        if (item.proNumber == elem.proNumber) {
          deleteIndex = index;
        }
      });
      //包数量、统计毛重、净重
      this.sumBaofun(this.currentRow);
      this.currentRow.weightDif = (
        this.currentRow.packNetTotalWeight - this.currentRow.packTotalSuttle
      ).toFixed(2);
      this.confirmProdcutData.splice(deleteIndex, 1);
      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
      });
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
        this.$message.error("抱歉，打包的产品和未打包的产品不能同时存在！");
        return true;
      }

      // let result;
      // this.packTableData.forEach(item => {
      //   if (item.packDetail.length == 0) {
      //     result = true;
      //   }
      // });

      // if (result) {
      //   this.$message.error("抱歉，包里面没有产品请添加产品！");
      //   return true;
      // }

      let contentResult;
      this.packTableData.forEach(item => {
        if (
          item.conditi == "" ||
          item.one == "" ||
          item.packNetTotalWeight == 0
        ) {
          contentResult = true;
        }
      });

      if (contentResult) {
        this.$message.error("抱歉，成色、类别、毛重不能为空！");
        return true;
      }
    },
    //保存校验
    checkSaveData(options) {
      if (options.send == "" || !options.send) {
        this.$message.error("请选择发起单位！");
        return true;
      }
      if (options.receive == "" || !options.receive) {
        this.$message.error("请选择接收单位！");
        return true;
      }
    },
    //选择金料成色
    selectConditi(elem) {
      this.basicData.condition_code.forEach(item => {
        if (elem.conditi == item.code) {
          elem.conditiName = item.val;
        }
      });
    },
    //选择类别
    selectOne(elem) {
      this.basicData.one_items_code.forEach(item => {
        if (elem.one == item.code) {
          elem.oneName = item.txt;
        }
      });
    },
    //发起单位事件
    launchChange() {
      this.confirmProdcutData = []; //确认的产品
      this.backUpConfirmProdcutData = []; //确认的产品
      this.packTableData = [];
      this.parentPack.shopName = "";
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
æ
