<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>出库-编辑出库</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div>
      <OrnamentBizType
        title="调拨"
        editStatus="编辑"
        :orderDetail="searchData"
        :proList="confirmProdcutData"
        :packagePro="packTableData"
        selectClick="1"
        mode="TRANSFER"
        ref="ornamentBizType"
        :loadingTF="loadingTF"
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
            <!-- <el-select v-model="scope.row.one" placeholder="请选择" size="mini" class="width100">
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
              @blur="changeNumber(scope.row)"
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
              @input="updateFun"
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
        <el-button type="primary" size="small" plain @click="addProductDialog">添加产品</el-button>
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
          :companyName="searchData"
          :afferentData="afferentData"
          :confirmProdcutData="backUpConfirmProdcutData"
          :editProductData="editProductData"
          mode="TRANSFER"
          :loadingTF="loadingTF"
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      oneData: [], //类别数据
      editData: {
        //编辑数据
        // bizPro: []
      },
      // 编辑
      packDetailData: {}, //包详情数据
      searchData: {}, //头部筛选数据
      dialogPackDetailType: "", //包详情状态
      productItemOneType: true,
      afferentData: {},
      title: "出库",
      productData: [], //产品数据
      dialogType: "", //添加产品状态
      packTableData: [],
      loadingState: false,
      currentRow: null, //选中的包
      basicData: [], //基础数据
      confirmProdcutData: [], //确认的产品
      backUpConfirmProdcutData: [], //备份确认的产品
      editProductData: [], //编辑数据回填，需要在产品加库存使用
      loadingTF: false,
      orderInfo: {},
      baoDisplayTF: true
    };
  },
  created() {
    this.bizNo = this.$route.query.bizNo;
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
      Promise.all([
        this.getCategory(),
        this.getBasicData(),
        this.displayAllData()
      ]);
    },
    closeFun() {
      this.dialogType = false;
    },
    //获取编辑数据
    displayAllData() {
      let self = this;
      let params = {
        PRS: {
          bizNo: this.bizNo
        }
      };
      this.$axios
        .get(this.$portMain + "/transferController/findAllotData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.editData = res.data.data;
            self.backfillHeadFun();
            self.assemblePackData();
            self.assembleNotPackData();
            // console.log('editData',self.editData,self.editData.bizInvoice.initiatorRepoType)
            //库位仓不用打包
            if (self.editData.bizInvoice.initiatorRepoType === "NORMAL") {
              self.baoDisplayTF = false;
            } else {
              self.baoDisplayTF = true;
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //数据组装(未打包)
    assemblePackData() {
      this.confirmProdcutData = [];
      this.editData.bizPro.forEach(item => {
        // console.log('item',item.proSpecData.weight)

        this.confirmProdcutData.push({
          amount: item.amount,
          proName: item.proName,
          proNumber: item.skuId,
          one: "",
          oneItemsCode: item.proBasics.oneItemsCode,
          conditi: item.proSpecData.conditi,
          conditiName:
            item.proSpecData.conditi == "997"
              ? `足金`
              : `足金${item.proSpecData.conditi}`, //用于校验一包里面只能有同一个成色
          // weight: item.proSpecData.weight,
          price: item.proSpecData.price,
          extendAttr: item.proSpecData.extendAttr,
          url: item.proBasics.pic,
          id: item.proBasics.id,
          feeType: item.proSpecData.feeType,
          additionPrice: item.proSpecData.additionPrice,
          factoryName: "",
          factoryId: "",
          goldCode: item.proBasics.goldCode,
          skuNum: item.amount,
          goldWeight: item.suttle,
          suttle: item.suttle,
          weight: item.proSpecData.weight,
          editSuttle: item.suttle,
          editWeight: item.weight,
          remarkReason: item.remarkReason.split(","),
          remark: item.remark,
          map: {
            proList: item.proSpecData.ProList
          }
        });
      });
      this.backUpConfirmProdcutData = [...this.confirmProdcutData];
      // console.log(JSON.parse(JSON.stringify(this.editData.bizPro)));
      this.editProductData = JSON.parse(
        JSON.stringify(this.confirmProdcutData)
      );
      if (this.editData.bizPack.length > 0) {
        this.confirmProdcutData = [];
      }
    },

    // 将产品详情明细 赋值给分包详情 替换数量克重
    setPackSingle(optionsBefore, optionsAfter) {
      optionsAfter.skuNum = optionsAfter.amount;
      optionsAfter.editSuttle = optionsAfter.suttle;
      optionsAfter.editWeight = optionsAfter.weight;
      let obj = { ...optionsBefore, ...optionsAfter };
      return obj;
    },

    // 绑定分包与分包详情
    bindBizPack() {
      // let {bizPack}
      var { bizPack, bizPackDetails, bizPro } = this.editData;
      bizPack.forEach(item => {
        item.packDetail = [];
        bizPackDetails.forEach(it => {
          if (item.packId === it.packId) {
            bizPro.forEach(ielem => {
              if (it.skuNumber === ielem.skuId) {
                if (ielem.proSpecData) {
                  it.weights = ielem.proSpecData.weight;
                }
              }
            });
            item.packDetail.push(it);
            item.weightDif = item.weightDif ? item.weightDif : 0;
          }
        });
      });
      this.packTableData = bizPack;
    },

    // 给分包详情赋值
    setBizPackDetail() {
      for (let key in this.packTableData) {
        for (let ke in this.packTableData[key].packDetail) {
          this.backUpConfirmProdcutData.forEach(item => {
            if (
              this.packTableData[key].packDetail[ke].skuNumber ===
              item.proNumber
            ) {
              this.packTableData[key].packDetail[ke] = this.setPackSingle(
                item,
                this.packTableData[key].packDetail[ke]
              );
            }
          });
        }
      }
      //   console.log(this.packTableData);
    },

    //组装数据(打包)
    assembleNotPackData() {
      let self = this;
      if (this.editData.bizPack.length == 0) {
        return;
      }

      this.bindBizPack();

      this.setBizPackDetail();
    },

    //头部数据回填
    backfillHeadFun() {
      this.searchData = {
        bizType: this.editData.bizInvoice.bizType,
        send: Number(this.editData.bizInvoice.initiatorRepoId),
        type: this.editData.bizInvoice.initiatorRepoType,
        sendName: this.editData.bizInvoice.initiator,
        receive: this.editData.bizInvoice.recipient,
        recipientId: Number(this.editData.bizInvoice.recipientId),
        receiveName: this.editData.bizInvoice.recipient,
        remark: this.editData.bizInvoice.invoiceMark
      };
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
      // console.log("发送单位值:", options);
      this.searchData = options;
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

      let result, contentResult;
      this.packTableData.forEach(item => {
        if (item.packDetail.length == 0) {
          result = true;
        }
      });

      if (result) {
        this.$message.error("抱歉，包里面没有产品请添加产品！");
        return true;
      }

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
        this.$message.error("抱歉，打包的产品和未打包的产品不能同时存在！");
        return true;
      }
    },

    confirmFun(options, elem) {
      let self = this;
      let invoiceStatuValueTxt = this.$api.orderNameFun(options.btnStatus);
      self.loadingTF = true;
      let params = {
        outType: options.bizType,
        sponsorRepoId: options.sendItem ? options.sendItem.val : options.send,
        sponsorRepoName: options.sendItem
          ? options.sendItem.txt
          : options.sendName,
        receiverDepId: options.receiveItem
          ? options.receiveItem.val
          : options.receive,
        receiverDepName: options.receiveItem
          ? options.receiveItem.txt
          : options.receiveName,
        remarks: options.remark,
        proInfo: "",
        packInfo: "",
        // opreateTyep: opreateTyep,
        bizNo: this.editData.bizInvoice.bizNo
      };

      //未打包
      if (this.backUpConfirmProdcutData.length > 0) {
        let proInfo = [];
        this.backUpConfirmProdcutData.forEach(item => {
          proInfo.push({
            skuNo: item.proNumber,
            skuNum: item.skuNum,
            skuWeight: item.goldWeight,
            skuNoteWeight: item.goldWeight,
            resion:
              typeof item.remarkReason === "string"
                ? item.remarkReason
                : item.remarkReason.join(),
            skuRemarks: item.skuRemarks
          });
        });
        params.proInfo = JSON.stringify(proInfo);
      }
      let numTF = true;
      let emptyPackTF = false;
      //已打包
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
          this.$message.error("请将产品添加到包后再提交！");
          this.loadingTF = false;
          return;
        } else if (
          this.packTableData.length > 1 &&
          this.packTableData.every(item => item.packDetail.length == 0)
        ) {
          this.$message.error("请将产品添加到包后再提交！");
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
      }
      if (this.packTableData.length > 0) {
        let packDetail = [];
        let packTableData = JSON.parse(JSON.stringify(this.packTableData));
        packTableData.forEach(item => {
          if (item.packNetTotalWeight < item.packTotalSuttle) {
            numTF = false;
          }
          if (!item.packDetail || item.packDetail.length === 0) {
            emptyPackTF = true;
          }
          item.weightDif = item.weightDif ? parseFloat(item.weightDif) : null;
          item.packDetail.forEach(it => {
            it.bizNo = "";
            it.packId = item.packId;
            it.packName = "";
            it.skuNumber = it.proNumber;
            it.amount = it.skuNum;
            it.suttle = it.editSuttle;
            it.weight = it.editWeight;
            it.remarkReason =
              typeof it.remarkReason === "string"
                ? it.remarkReason
                : it.remarkReason.join();
          });
        });
        params.packInfo = JSON.stringify(packTableData);
      }

      let prosList = []; //单据产品（打包和未打包都要）列表
      let backUpConfirmProdcutData = JSON.parse(
        JSON.stringify(this.backUpConfirmProdcutData)
      );
      backUpConfirmProdcutData.forEach(ielem => {
        // console.log('ielem:',ielem)
        ielem.skuId = ielem.proNumber; //sku
        // ielem.remark = ielem.skuRemarks; //备注
        ielem.remarkReason =
          typeof ielem.remarkReason === "string"
            ? ielem.remarkReason
            : ielem.remarkReason.join();
        ielem.amount = ielem.skuNum ? parseInt(ielem.skuNum) : ielem.amount; //数量
        ielem.suttle = ielem.editSuttle
          ? parseFloat(ielem.editSuttle)
          : ielem.suttle; //净重
        ielem.weight = ielem.editWeight
          ? parseFloat(ielem.editWeight)
          : ielem.weight; //毛重
        ielem.remark = ielem.skuRemarks ? ielem.skuRemarks : ielem.remark; //备注
        prosList.push(ielem);
      });

      // console.log('options:',options,this.editData.bizInvoice)
      let bizObj = {
        bizNo: this.bizNo,
        initiatorId: options.sendItem
          ? JSON.stringify(options.sendItem.secId)
          : this.editData.bizInvoice.initiatorId, //发起者ID
        initiator: options.sendItem
          ? options.sendItem.txt
          : this.editData.bizInvoice.initiator, //发起者名称
        initiatorRepoType: options.sendItem
          ? options.sendItem.type
          : this.editData.bizInvoice.initiatorRepoType, //发起仓库类型
        initiatorRepoId: options.sendItem
          ? JSON.stringify(options.sendItem.val)
          : this.editData.bizInvoice.initiatorRepoId, //发起仓库ID
        recipientId: options.receiveItem
          ? JSON.stringify(options.receiveItem.secId)
          : this.editData.bizInvoice.recipientId, //接收者ID
        recipient: options.receiveItem
          ? options.receiveItem.txt
          : this.editData.bizInvoice.recipient, //接收者
        recipientRepoType: options.receiveItem
          ? options.receiveItem.type
          : this.editData.bizInvoice.recipientRepoType, //接收者仓库类型
        recipientRepoId: options.receiveItem
          ? JSON.stringify(options.receiveItem.val)
          : this.editData.bizInvoice.recipientRepoId, //接收者仓库ID
        invoiceType: "TRANSFER", //单据类型
        invoiceMark: options.remark
          ? options.remark
          : this.editData.invoiceMark, //单据备注
        invoiceStatuValue: invoiceStatuValueTxt, //单据状态名称
        invoiceStatu: options.btnStatus, //单据状态
        pros: prosList, //单据产品（打包和未打包都要）列表
        packs: params.packInfo ? JSON.parse(params.packInfo) : [] //单据产品（打包和未打包都要）列表
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
      //产品添加引用单据号
      if (this.orderInfo.orderNo) {
        bizObj.lineId = this.orderInfo.orderNo;
        bizObj.sourceInvoiceType = this.orderInfo.orderType;
        bizObj.sourceInvoiceNo = this.orderInfo.oriOrderNo;
      }
      let paramsOne = {
        biz: bizObj
      };

      if (!numTF) {
        self.$message.error("包的毛重不能小于净重，请重新输入提交！");
        self.loadingTF = false;
        return false;
      }
      if (self.packTableData.some(n => n.one === "")) {
        self.$message.error("请选择每个包里的类别选项！");
        self.loadingTF = false;
        return false;
      }
      if (bizObj.packs.length > 0 && this.confirmProdcutData.length > 0) {
        self.$message.error("只能全打包或全不打包才能提交，请重新输入提交！");
        self.loadingTF = false;
        return false;
      }
      if (bizObj.recipientRepoId === bizObj.initiatorRepoId) {
        self.$message.error("发送单位和接收单位不能相同，请重新输入提交！");
        self.loadingTF = false;
        return false;
      }
      if (emptyPackTF) {
        self.$message.error("请将产品添加到包后再提交！");
        self.loadingTF = false;
        return false;
      }

      self.loadingTF = false;
      this.$axios
        .post(self.$portMain + "/transferController/update", paramsOne)
        .then(function(res) {
          if (res.data.code == 200) {
            self.loadingTF = false;
            // self.$message.success(`${invoiceStatuValueTxt}成功，正在返回！`);
            self.$message.success(`操作成功！`);
            setTimeout(function() {
              self.$router.push({
                path: "allotOutDet",
                query: { bizNo: self.bizNo }
              });
            }, 1000);
          } else {
            self.loadingTF = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    //取消返回出库列表页
    cancelData(options) {
      this.$router.push("allotOutList");
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
            arr[j].editSuttle = this.$api.returnFloatNum(
              Number(arr[i].editSuttle) + Number(arr[j].editSuttle)
            );

            arr[j].editWeight = this.$api.returnFloatNum(
              Number(arr[i].editWeight) + Number(arr[j].editWeight)
            );
            arr[j].remark = `${arr[i].remark ? `${arr[i].remark};` : ``}${
              arr[j].remark
            }`;
            let remarkReason = [
              ...new Set(arr[j].remarkReason.concat(arr[i].remarkReason))
            ];

            arr[j].remarkReason = remarkReason.filter(function(s) {
              return s && s.trim();
            });
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
        elem.forEach(ielem => {
          ielem.newTF = true;
        });
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
        self.$nextTick(() => {
          self.productItemOneType = true;
          self.loadingTF = false;
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
          // if (item.newTF) {
          item.skuNum = this.$api.returnFloatNum(
            item.skuNum - deleteProduct.skuNum
          );
          // }else{
          //   item.skuNum = 0
          // }
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
    },
    //添加新包(表格)
    addNewPackFun() {
      this.packTableData.push({
        bizNo: "",
        packId: "",
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
        ...JSON.parse(JSON.stringify(this.currentRow.packDetail)),
        JSON.parse(JSON.stringify(elem))
      ];
      elem.remarkReason =
        typeof elem.remarkReason === "string"
          ? elem.remarkReason
          : elem.remarkReason.join();
      // console.log("pppp", newArr);
      // return;
      this.currentRow.packDetail = this.filterArr(newArr);
      // console.log(this.currentRow.packDetail)

      let deleteIndex;
      this.confirmProdcutData.forEach((item, index) => {
        if (item.proNumber == elem.proNumber) {
          deleteIndex = index;
        }
      });
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

    //包详情
    packDetailFun(index) {
      if (this.packTableData[index].packDetail == 0) {
        this.$message.error("抱歉，包里面没有产品，请添加产品！");
        return;
      }
      console.log(this.packTableData[index].packDetail);
      this.dialogPackDetailType = new Date().getTime();
      this.packDetailData = this.packTableData[index];
      this.packTableData[index].packDetails = this.packTableData[
        index
      ].packDetail;
    },

    // 给所有的提交按钮加上二次确定
    reTrue() {
      return Promise.resolve(
        this.$confirm("是否确认操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
      );
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
    //发起单位事件
    launchChange() {
      this.confirmProdcutData = []; //确认的产品
      this.backUpConfirmProdcutData = []; //确认的产品
      this.packTableData = [];
      const selected = this.$refs.ornamentBizType.params.send;
      const selectedObj = this.$refs.ornamentBizType.selectObj.sendList.filter(
        n => n.val === selected
      )[0];
      this.$set(this.searchData, "sendName", selectedObj.txt);
      // this.parentPack.shopName = "";
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
    // 修改包的毛重、自動生成包的毛重差异
    changeNumber(ielem, ind) {
      // ielem.weightDif = this.$api.returnFloat(Number(ielem.packNetTotalWeight) - ielem.packTotalSuttle)
      this.$forceUpdate();
    },
    updateFun() {
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
