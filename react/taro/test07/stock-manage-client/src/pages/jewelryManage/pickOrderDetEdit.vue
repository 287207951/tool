<template>
  <div class="outOfStock" ref="creatSendMaterial" v-loading="loadingState">
    <el-row>
      <el-col :span="16">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
          <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
          <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
          <el-breadcrumb-item>拣货验收单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="8" class="txtRight">
        <el-button type="primary" size="small" @click="returnFun" plain :loading="loadingTF">退回重拣</el-button>
        <el-button type="primary" size="small" @click="confirmFunOut" :loading="loadingTF">确认出库</el-button>
        <!-- <el-button type="warning" size="small" @click="cancelFun">作废</el-button> -->
      </el-col>
    </el-row>
    <div>
      <div>
        <el-table :data="orderTable" style="width: 100%" class="top10">
          <el-table-column prop="orderCode" label="拣货单号"></el-table-column>
          <el-table-column prop="ipadCreateName" label="拣货人"></el-table-column>
          <el-table-column prop="repoTypeName" label="仓库"></el-table-column>
          <el-table-column prop="ipadCreateTime" label="拣货时间" width="180px">
            <template slot-scope="scope">
              <span>{{$api.dateGetDayTime(scope.row.ipadCreateTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bizNo" label="源单据号"></el-table-column>
          <el-table-column prop="recipient" label="接收单位"></el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column prop="suttle" label="净重(g)"></el-table-column>
          <el-table-column prop="weight" label="毛重(g）"></el-table-column>
          <el-table-column prop="pcCreateName" label="验收人"></el-table-column>
          <el-table-column prop="pcCreateTime" label="验收时间" width="180px">
            <template slot-scope="scope">
              <span>{{$api.dateGetDayTime(scope.row.pcCreateTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="订单状态">
            <template slot-scope="scope">
              <span class="txtYellow" v-if="scope.row.invoiceStatu === 'WAIT'">待验收</span>
              <span class="txtHui" v-else-if="scope.row.invoiceStatu === 'FINISH'">已验收</span>
              <span class="txtRed" v-else-if="scope.row.invoiceStatu === 'CANCEL'">已作废</span>
              <span class="txtRed" v-else-if="scope.row.invoiceStatu === 'COMPLEX'">已退回</span>
              <span class="txtBlack" v-else>{{scope.row.invoiceStatu}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="txt14 txtHui lineHeight34 top10" v-if="editData.bizInvoice.invoiceMark && editData.bizInvoice.invoiceMark != ''">
          <div>
            出库备注：
            <span class="txtBlack">{{editData.bizInvoice.invoiceMark}}</span>
          </div>
        </div>-->
      </div>
      <div class="bigLine"></div>
    </div>

    <!-- 打包数据 -->
    <div class="packDataWrap" v-show="sponsorType != 'NORMAL'">
      <div class="packTitle">
        <div class="title">打包信息</div>
        <div>
          <el-select
            v-model="parentPackTxt"
            placeholder="请选择店铺"
            size="small"
            class="width200"
            v-show="searchData.bizType == 'SEND_CLIENT' && parentPackList.length > 0"
            @change="selectShopFun"
          >
            <el-option
              v-for="item in parentPackList"
              :key="item.packId"
              :label="item.shopName"
              :value="item.packId"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            size="small"
            plain
            @click="addNewPackFun"
            :loading="loadingTF"
          >添加新包</el-button>
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
              size="small"
              class="width100"
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
              size="small"
              class="width100"
              @blur="checkNumber(scope.row,'packNetTotalWeight')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="毛重差异(g)">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.weightDif"
              placeholder="请输入内容"
              size="small"
              class="width100"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="过重备注">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.weightDifRemark"
              placeholder="请输入内容"
              size="small"
              class="width100"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入内容" size="small" class="width100"></el-input>
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
      <SkuScreen @suitSearch="searchFun" :proList="confirmProdcutData"></SkuScreen>
      <div style="height: 10px"></div>

      <!-- 产品 -->
      <div v-if="productItemOneType">
        <ProductItemPickTwo
          v-for="(item,index) in confirmProdcutData"
          :key="index"
          :productData="item"
          :editTF="true"
          :indOne="index"
          :sumData="confirmProdcutData"
          :baoTF="false"
          @deleteProduct="deleteProduct"
          @addPackFun="addPackFun"
          :addPackType="sponsorType != 'NORMAL'"
          :bizInvoice="bizInvoice"
        ></ProductItemPickTwo>
      </div>
    </div>
    <!-- 包详情数据 -->
    <OutPackProductDetailsPick
      :dialogType="dialogPackDetailType"
      :packBarData="packDetailData"
      @removeProductsFun="removeProductsFun"
      :baoTF="true"
      ref="OutPackProductDetails"
    ></OutPackProductDetailsPick>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bizInvoice: {},
      selectShopPackId: "", //选中店铺包的id
      oneData: [], //类别数据
      id: "",
      sponsorType: "", //发起单位状态
      orderTable: [], //头部表格
      orderTableTwo: [], //拣货表格
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
      shopData: [],
      editData: {
        //编辑数据
        // bizPro: []
      },
      // 编辑
      packDetailData: {}, //包详情数据
      searchData: {}, //头部筛选数据
      dialogPackDetailType: "", //包详情状态
      productItemOneType: true,
      // afferentData: {},
      title: "出库",
      productData: [], //产品数据
      // dialogType: "", //添加产品状态
      packTableData: [],
      loadingState: false,
      currentRow: null, //选中的包
      basicData: [], //基础数据
      confirmProdcutData: [], //确认的产品
      backUpConfirmProdcutData: [], //备份确认的产品
      parentPackTxt: "", //选择店铺
      parentPackList: [], //店铺选择列表
      loadingTF: false,
      packIndex: 0,
      shopOneData: {},
      shopOneIndex: 0
      // editProductData: [] //编辑数据回填，需要在产品加库存使用
    };
  },
  created() {
    this.id = this.$route.query.id;
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
    add() {
      var args = arguments,
        lens = args.length,
        d = 0,
        sum = 0;
      for (var key in args) {
        var str = "" + args[key];
        if (str.indexOf(".") != -1) {
          var temp = str.split(".")[1].length;
          d = d < temp ? temp : d;
        }
      }
      var m = Math.pow(10, d);
      for (var key in args) {
        sum += args[key] * m;
      }
      return sum / m;
    },
    created_fun() {
      Promise.all([
        this.getCategory(),
        this.getBasicData(),
        this.displayAllData()
      ]);
    },
    //获取编辑数据
    displayAllData() {
      let self = this;
      let params = {
        PRS: {
          id: this.id
        }
      };
      this.$axios
        .get(this.$portMain + "/biz/replypick/getPickDeails", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.editData = res.data.data;
            self.orderTable = [res.data.data.bizInvoice];
            self.bizInvoice = res.data.data.bizInvoice;
            self.orderTableTwo = res.data.data.TransferSlip;
            self.backfillHeadFun();
            self.assemblePackData();
            self.assembleNotPackData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //数据组装(未打包)
    assemblePackData() {
      this.confirmProdcutData = [];
      this.editData.bizPro.forEach(item => {
        this.confirmProdcutData.push({
          proName: item.proName,
          proNumber: item.skuId,
          one: item.one,
          conditi: item.proSpecData.conditi,
          conditiName:
            item.proSpecData.conditi == "997"
              ? `足金`
              : `足金${item.proSpecData.conditi}`, //用于校验一包里面只能有同一个成色
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
          skuId: item.skuId,
          amount: item.amount,
          // newAmount: item.ipadAmount,
          // newSuttle: item.ipadAmount * item.proSpecData.weight,
          // newWeight: item.ipadAmount * item.proSpecData.weight,
          newAmount: 0,
          newSuttle: 0,
          newWeight: 0,
          ipadAmount: item.ipadAmount,
          skuSuttle: (item.ipadAmount * item.proSpecData.weight).toFixed(2),
          goldWeight: item.suttle,
          suttle: item.suttle,
          weight: item.weight,
          skuWeight: item.weight,
          remarkReason: item.remarkReason ? item.remarkReason.split(",") : "",
          remark: item.remark,
          proBasics: item.proBasics,
          proSpecData: item.proSpecData,
          map: {
            proList: item.proSpecData.ProList
          }
        });
      });
      this.backUpConfirmProdcutData = [...this.confirmProdcutData];
      if (this.editData.bizPack.length > 0) {
        this.confirmProdcutData = [];
      }
    },
    //组装数据(打包)
    assembleNotPackData() {
      let self = this;
      const { bizPack, bizPackDetails, bizPro } = this.editData;
      if (bizPack.length == 0) {
        return;
      }
      let parentPack = [];

      bizPack.forEach(item => {
        if (item.shopPack == 1) {
          parentPack.push(item);
        }
      });

      if (parentPack.length > 0) {
        parentPack.forEach(item => {
          item.packSkuNumbers = [];
          item.packDetails = [];
          bizPackDetails.forEach(one => {
            if (item.packId == one.packId) {
              item.packSkuNumbers.push(one);
            }
          });
        });

        parentPack.forEach(item => {
          item.nextPickPackList = [];
          item.packSkuNumbers.forEach(it => {
            this.backUpConfirmProdcutData.forEach(one => {
              if (it.skuNumber == one.proNumber) {
                item.packDetails.push(
                  Object.assign({}, one, it, {
                    // newAmount: it.ipadAmount,
                    // newSuttle: it.ipadAmount * one.proSpecData.weight,
                    // newWeight: it.ipadAmount * one.proSpecData.weight,
                    newAmount: 0,
                    newSuttle: 0,
                    newWeight: 0,
                    skuSuttle: (it.ipadAmount * one.proSpecData.weight).toFixed(
                      2
                    )
                  })
                );
              }
            });
          });
        });
        self.parentPackTxt = parentPack[0].packId;
        self.parentPackList = JSON.parse(JSON.stringify(parentPack));
        self.selectShopFun(self.parentPackList[0].packId);
      }
    },
    //头部数据回填
    backfillHeadFun() {
      this.searchData = {
        bizType: this.editData.bizInvoice.bizType,
        send: Number(this.editData.bizInvoice.initiatorRepoId),
        receive: Number(this.editData.bizInvoice.recipientId),
        remark: this.editData.bizInvoice.invoiceMark
          ? this.editData.bizInvoice.invoiceMark
          : "-",
        sendItem: {
          id: Number(this.editData.bizInvoice.initiatorRepoId),
          name: this.editData.bizInvoice.initiatorRepoTypel,
          type:
            Number(this.editData.bizInvoice.initiatorRepoId) == -1
              ? "NORMAL"
              : "FICTITIOUS"
        },
        receiveItem: {
          companyId: Number(this.editData.bizInvoice.recipientId),
          companyName: this.editData.bizInvoice.recipient
        }
      };
      this.sponsorType =
        Number(this.editData.bizInvoice.initiatorRepoId) == -1
          ? "NORMAL"
          : "FICTITIOUS";
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
    //数据修改时传值
    emitData(options) {
      this.searchData = options;
      this.sponsorType = options.sendItem.type;
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
        this.$message.error("抱歉，打包的产品和未打包的产品不能同时存在！");
        return true;
      }

      if (this.sponsorType == "FICTITIOUS") {
        if (this.confirmProdcutData.length > 0) {
          this.$message.error("抱歉，客单仓、售后仓必须要打包！");
          return true;
        }
      }

      let result, contentResult;
      this.packTableData.forEach(item => {
        if (item.packDetails.length == 0) {
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

      if (this.sponsorType == "FICTITIOUS") {
        if (this.confirmProdcutData.length > 0) {
          this.$message.error("抱歉，客单仓、售后仓必须要打包！");
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
        sponsorRepoName: options.sendItem.name,
        receiverDepId: options.receive,
        receiverDepName: options.receiveItem.companyName,
        remarks: options.remark,
        proInfo: "",
        packInfo: "",
        parentPack: "",
        opreateTyep: opreateTyep,
        bizNo: this.editData.bizInvoice.bizNo
      };

      //未打包
      if (this.backUpConfirmProdcutData.length > 0) {
        let proInfo = [];
        this.backUpConfirmProdcutData.forEach(item => {
          proInfo.push({
            skuNo: item.proNumber,
            skuNum: item.skuNum,
            skuWeight: item.skuWeight,
            skuNoteWeight: item.skuWeight,
            remarkReason: remarkReason ? item.remarkReason.join() : "",
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
        packTableData = JSON.parse(JSON.stringify(this.packTableData));
        packTableData.forEach(item => {
          item.packDetail = [];
          item.packDetails.forEach(it => {
            item.packDetail.push({
              bizNo: "",
              packId: item.packId,
              skuNumber: it.proNumber,
              amount: it.skuNum,
              suttle: it.skuWeight,
              weight: it.skuWeight,
              remarkReason: it.remarkReason.join(),
              remark: it.remark
            });
          });
        });
        packTableData.forEach(item => {
          delete item.packDetails;
          delete item.skuNumbers;
        });
        params.packInfo = JSON.stringify(packTableData);
      }

      //包中包数据
      if (this.parentPack.shopName != "") {
        this.parentPack.subPack = packTableData;
        this.parentPack.subPack.forEach(item => {
          this.parentPack.packTotalAmount += item.packTotalAmount;
          this.parentPack.packTotalSuttle += item.packTotalSuttle;
          this.parentPack.packNetTotalWeight += item.packNetTotalWeight;
        });
        params.parentPack = JSON.stringify([this.parentPack]);
        params.packInfo = "";
      }
      this.$api.formdataPostFun(
        this.$portMain + "/stockOutManager/stockOutUpdata",
        params,
        res => {
          self.$message.success(res.msg);
          this.$router.push("outOfStockRedoList");
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //取消返回出库列表页
    cancelData(options) {
      this.$router.push("outOfStockRedoList");
    },
    //sku筛选
    searchFun(elem) {
      const { backProList } = elem;
      this.confirmProdcutData = backProList;
      this.productItemOneType = false;
      this.$nextTick(() => {
        this.productItemOneType = true;
      });
      //   this.$forceUpdate();
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
            arr[j].skuWeight =
              Number(arr[i].skuWeight) + Number(arr[j].skuWeight);
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
    handleCurrentChange(val, packIndex) {
      this.currentRow = val;
      this.packIndex = packIndex;
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
        weightDif: "",
        weightDifRemark: "",
        remark: "",
        packDetails: []
      });
      this.parentPackList.forEach(ielem => {
        if (ielem.id === this.parentPack) {
          ielem.nextPickPackList = this.packTableData;
        }
      });

      this.parentPack.nextPickPackList = this.packTableData;
      let tabIndex = this.packTableData.length - 1;
      this.packTableData.forEach((ielem, indOne) => {
        ielem.ind = indOne + 1;
      });
      this.$refs.singleTable.setCurrentRow(this.packTableData[tabIndex]);
      this.handleCurrentChange(this.packTableData[tabIndex], tabIndex);
    },
    //添加到包
    addPackFun(elem) {
      if (this.currentRow == null) {
        this.$message.error("请选择包！");
        return;
      }

      if (
        !elem.newAmount ||
        !elem.newSuttle ||
        !elem.newWeight ||
        elem.newAmount === 0 ||
        elem.newSuttle === 0
      ) {
        this.$message.error("数量、净重不能为零或为空，请重新输入提交！");
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

      this.confirmProdcutData = JSON.parse(
        JSON.stringify(this.confirmProdcutData)
      );
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

      let delePackproductIndex, deleProductIndx;
      this.parentPackList.forEach((item, pIndex) => {
        if (item.packId == this.selectShopPackId) {
          delePackproductIndex = pIndex;

          item.packDetails.forEach((one, cIndex) => {
            if (one.skuNumber == elem.skuNumber) {
              deleProductIndx = cIndex;
            }
          });
        }
      });
      this.parentPackList[delePackproductIndex].packDetails.splice(
        deleProductIndx,
        1
      );
    },
    //包数量、统计毛重、净重
    sumBaofun(elem) {
      elem.packTotalAmount = 0;
      elem.packTotalSuttle = 0;
      elem.packNetTotalWeight = 0;
      elem.packDetails.forEach(ielem => {
        elem.packTotalAmount = this.add(elem.packTotalAmount, ielem.newAmount);
        elem.packTotalSuttle = this.add(elem.packTotalSuttle, ielem.newSuttle);
        elem.packNetTotalWeight = this.add(
          elem.packNetTotalWeight,
          ielem.newWeight
        );
      });
      elem.packTotalAmount = this.$api.returnFloatNum(elem.packTotalAmount);
      elem.packTotalSuttle = this.$api.returnFloatNum(elem.packTotalSuttle);
      elem.packNetTotalWeight = this.$api.returnFloatNum(
        elem.packNetTotalWeight
      );
    },
    //包详情
    packDetailFun(index) {
      if (this.packTableData[index].packDetails == 0) {
        this.$message.error("抱歉，包里面没有产品，请添加产品！");
        return;
      }
      this.packIndex = index;
      this.packDetailData = this.packTableData[index];
      this.packDetailData.packDetails.forEach(item => {
        item.showStatus = false;
      });

      this.dialogPackDetailType = new Date().getTime();
    },

    // 删除包
    deleProPackge(index) {
      let newArr = [
        ...this.confirmProdcutData,
        ...this.packTableData[index].packDetails
      ];
      this.confirmProdcutData = this.filterArr(newArr);
      if (this.parentPackList[this.shopOneIndex]) {
        this.parentPackList[
          this.shopOneIndex
        ].packDetails = this.confirmProdcutData;
      }
      this.packTableData.splice(index, 1);
      if (this.packTableData.length > 0) {
        let tabIndex = this.packTableData.length - 1;
        this.$refs.singleTable.setCurrentRow(this.packTableData[tabIndex]);
        this.handleCurrentChange(this.packTableData[tabIndex]);
      } else {
        this.currentRow = null;
      }
      this.productItemOneType = false;
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
      let productIndex, removeProduct;
      this.packTableData[this.packIndex].packDetails.forEach((it, num) => {
        if (it.proNumber == proNumber) {
          productIndex = num;
          removeProduct = it;
        }
      });

      let newArr = [
        ...this.confirmProdcutData,
        JSON.parse(JSON.stringify(removeProduct))
      ];
      this.confirmProdcutData = this.filterArr(newArr);

      if (this.parentPackList[this.shopOneIndex]) {
        this.parentPackList[
          this.shopOneIndex
        ].packDetails = this.confirmProdcutData;
      }
      this.packTableData[this.packIndex].packDetails.splice(productIndex, 1);
      this.sumBaofun(this.packTableData[this.packIndex]);
      if (this.packTableData[this.packIndex].packDetails.length == 0) {
        this.$refs.OutPackProductDetails.clickFun();
        this.packTableData[this.packIndex].conditi = "";
      }

      // return;
    },
    //选择店铺
    selectShopFun(elem) {
      this.parentPackList.forEach((ielem, indOne) => {
        if (ielem.packId === elem) {
          // console.log("aaa:",ielem)
          this.packTableData = ielem.nextPickPackList;
          let packDetailsList = ielem.packDetails;
          packDetailsList.forEach(ielem => {
            ielem.newSuttleOne = ielem.newSuttle
              ? ielem.newSuttle
              : ielem.suttle;
            ielem.newAmountOne = ielem.newAmount
              ? ielem.newAmount
              : ielem.ipadAmount;
          });
          this.confirmProdcutData = packDetailsList;
          this.shopOneData = ielem;
          this.shopOneIndex = indOne;
        }
      });
      this.selectShopPackId = elem;
      // this.confirmProdcutData = [...this.backUpConfirmProdcutData];
    },
    //校验数字
    checkNumber(item, name) {
      if (item.packNetTotalWeight < item.packTotalSuttle) {
        this.$message.error("净重不能大于毛重！");
        item.packNetTotalWeight = item.packTotalSuttle;
        item.weightDif = 0.0;
        this.$forceUpdate();
      }
      item[name] = String(item[name]).trim();
      let result = isNaN(item[name]);
      let result2 = Number(item[name]) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        item[name] = 0;
        return;
      }
      item[name] = Number(item[name]);
      item.weightDif = this.$api.returnFloatNum(
        item.packNetTotalWeight - item.packTotalSuttle
      );
    },

    //退回重拣按钮
    returnFun() {
      let self = this;
      self.loadingTF = true;
      this.$confirm("此操作将退回重拣此单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { PRS: { id: this.id } };
          this.$axios
            .get(self.$portMain + "/biz/replypick/repick", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success(
                  "退回重拣此单成功,正在返回拣货验收列表页！"
                );
                setTimeout(function() {
                  self.loadingTF = false;
                  self.$router.push("pickOrderList");
                }, 1000);
              } else {
                self.loadingTF = false;
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          self.loadingTF = false;
        });
    },

    // 确认出库按钮
    confirmFunOut() {
      this.$api.refClick(this).then(res => {
        this.confirmFun();
      });
    },

    // 确认出库按钮
    confirmFun() {
      let self = this;
      self.loadingTF = true;
      setTimeout(function() {
        var params = { id: self.id };
        let numTF = true; //数量、净重、克重有效
        if (self.parentPackList.length > 0) {
          let resultOne = false;
          // console.log('第二种情况，含有店铺的，进行打包')
          self.parentPackList.forEach(ielem => {
            // console.log(ielem)
            ielem.nextPickPackList.forEach(jelem => {
              jelem.sup_pack_id = ielem.packId;
              // console.log('packDetails:',jelem.packDetails)
              let proPack = [];
              jelem.packDetails.forEach(ielem => {
                if (
                  !ielem.newAmount ||
                  !ielem.newSuttle ||
                  !ielem.newWeight ||
                  ielem.newAmount === 0 ||
                  ielem.newSuttle > ielem.newWeight
                ) {
                  numTF = false;
                }
                proPack.push({
                  skuId: ielem.skuId,
                  amount: ielem.newAmount ? ielem.newAmount : ielem.skuNum,
                  ipadAmount: ielem.ipadAmount,
                  newAmount: ielem.newAmount,
                  newSuttle: ielem.newSuttle,
                  newWeight: ielem.newWeight,
                  ipadStaue: ielem.ipadStaue,
                  remark: ielem.remark,
                  remarkReason: ielem.remarkReason
                    ? ielem.remarkReason.join()
                    : ielem.remarkReason
                });
              });
              jelem.replyPickPros = proPack;
              // delete jelem.packDetails;
            });
            // delete ielem.packDetails;
            // delete ielem.packSkuNumbers;
          });
          let newParentPackList = JSON.parse(
            JSON.stringify(self.parentPackList)
          );

          newParentPackList.forEach(one => {
            let newArr = [];
            newArr = one.nextPickPackList.filter(two => {
              return two.replyPickPros.length > 0;
            });
            one.nextPickPackList = newArr;
          });

          newParentPackList.forEach(item => {
            delete item.packSkuNumbers;
            item.nextPickPackList.forEach(it => {
              delete it.packDetails;
              if (
                it.one == "" ||
                it.packNetTotalWeight == "" ||
                it.weightDif === ""
              ) {
                resultOne = true;
              }
            });
          });
          if (
            newParentPackList.some(
              one => one.shopPack == 1 && one.packDetails.length > 0
            )
          ) {
            self.$message.error(`还有产品没打包，请将产品打包好后在提交！`);
            self.loadingTF = false;
            return;
          }
          if (resultOne) {
            self.$message.error(`类别、毛重、毛重差异不能为空！`);
            self.loadingTF = false;
            return;
          }

          params.pickPack = JSON.stringify(newParentPackList);
        } else if (self.packTableData.length === 0) {
          let pickProList = [];
          self.confirmProdcutData.forEach(ielem => {
            if (
              !ielem.newAmount ||
              !ielem.newSuttle ||
              !ielem.newWeight ||
              ielem.newAmount === 0 ||
              ielem.newSuttle > ielem.newWeight
            ) {
              numTF = false;
            }
            pickProList.push({
              id: ielem.id,
              skuId: ielem.skuId,
              amount: ielem.skuNum,
              newAmount: ielem.newAmount,
              newSuttle: ielem.newSuttle,
              newWeight: ielem.newWeight
            });
          });
          params.pickPro = JSON.stringify(pickProList);
          self.loadingTF = false;
        } else {
          if (self.confirmProdcutData.length > 0) {
            self.$message.error(
              "还有未打包的产品,请将产品全部打包再重新提交！"
            );
            self.loadingTF = false;
            return false;
          } else {
            let pickPackList = [];
            let pass = true;
            if (self.editData.bizInvoice.invoiceType != "TRANSFER") {
              //除了调拨入库不需要打包，其他的都需要打包
              if (
                self.packTableData.every(item => item.packDetails.length == 0)
              ) {
                self.packTableData = [];
                self.$message.error("已经将空包清除了，请重新添加包和产品！");
                self.loadingTF = false;
                return;
              } else if (
                self.packTableData.some(item => item.packDetails.length == 0)
              ) {
                let newArr = [];
                newArr = self.packTableData.filter(item => {
                  return item.packDetails.length > 0;
                });
                self.packTableData = newArr;
              }
            }

            if (
              self.packTableData.some(
                ielem => ielem.one === "" || ielem.conditi === ""
              )
            ) {
              self.$message.error(
                "包的金料成色和品类不能为空,再重新选择提交！"
              );
              self.loadingTF = false;
              return false;
            }
            if (
              self.packTableData.some(ielem => ielem.packDetails.length === 0)
            ) {
              self.$message.error(
                "不允许有空包,请向空包里添加产品再重新提交！"
              );
              self.loadingTF = false;
              return false;
            }
            self.packTableData.forEach(ielem => {
              // if (ielem.one === "" || ielem.conditi === "") {
              //   self.$message.error(
              //     "包的金料成色和品类不能为空,再重新选择提交！"
              //   );
              //   self.loadingTF = false;
              //   return false;
              // }
              // if (ielem.packDetails.length === 0) {
              //   self.$message.error(
              //     "不允许有空包,请向空包里添加产品再重新提交！"
              //   );
              //   self.loadingTF = false;
              //   return false;
              // }

              // console.log(ielem)
              let replyPickProsList = [];
              ielem.packDetails.forEach(jelem => {
                if (
                  !jelem.newAmount ||
                  !jelem.newSuttle ||
                  !jelem.newWeight ||
                  jelem.newAmount === 0 ||
                  jelem.newSuttle > jelem.newWeight
                ) {
                  numTF = false;
                }
                replyPickProsList.push({
                  skuId: jelem.skuId,
                  amount: jelem.skuNum,
                  ipadAmount: jelem.ipadAmount,
                  newAmount: jelem.newAmount,
                  newSuttle: jelem.newSuttle,
                  newWeight: jelem.newWeight,
                  ipadStaue: jelem.ipadStaue,
                  remark: jelem.remark,
                  remarkReason: jelem.remarkReason
                    ? jelem.remarkReason.join()
                    : ""
                });
              });
              pickPackList.push({
                bizNo: ielem.bizNo,
                conditi: ielem.conditi,
                one: ielem.one,
                packTotalAmount: ielem.packTotalAmount,
                packTotalSuttle: ielem.packTotalSuttle,
                packNetTotalWeight: ielem.packNetTotalWeight,
                remark: ielem.remark,
                weightDif: ielem.weightDif,
                weightDifRemark: ielem.weightDifRemark,
                replyPickPros: replyPickProsList
              });
            });
            params.pickPack = JSON.stringify(pickPackList);
          }
        }
        if (!numTF) {
          self.$message.error(
            "数量、净重、克重未填或净重大于毛重，请重新输入提交！"
          );
          self.loadingTF = false;
          return;
        }
        // console.log(self.confirmProdcutData,self.confirmProdcutData.length > 0 && self.editData.bizInvoice.invoiceType != 'TRANSFER')
        if (
          self.confirmProdcutData.length > 0 &&
          self.editData.bizInvoice.invoiceType != "TRANSFER"
        ) {
          self.$message.error(
            "抱歉，还有未打包的产品,请将产品全部打包再重新提交！"
          );
          self.loadingTF = false;
          return false;
        }
        self.loadingTF = false;
        self.$api.formdataPostFun(
          self.$portMain + "/biz/replypick/confirmPick",
          params,
          res => {
            self.$message.success("确认拣货验收成功，正在返回拣货验收列表页！");
            setTimeout(function() {
              self.$router.push("pickOrderList");
              self.loadingTF = false;
            }, 1000);
          },
          err => {
            self.$message.error(err.msg);
            self.loadingTF = false;
          }
        );
      }, 500);
    },

    //作废按钮
    cancelFun() {
      let self = this;
      this.$confirm("此操作将作废此单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { PRS: { id: this.id } };
          this.$axios
            .get(self.$portMain + "/biz/replypick/cancelpick", params)
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message.success("作废此单成功,正在返回拣货验收列表页！");
                setTimeout(function() {
                  self.$router.push("pickOrderList");
                }, 1000);
              } else {
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
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
