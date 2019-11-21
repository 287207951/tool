<template>
  <div class="conBigDiv" ref="customerPrice" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户结价</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <div>
            <el-input
              placeholder="结价单号/客户名称"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keyup.enter.native="queryFun"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="gray_font marignLeft8">到账时间</span>
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
            <span class="gray_font marignLeft8">单据类型</span>
            <el-select v-model="auditStatue" placeholder="请选择" size="small">
              <el-option
                v-for="item in auditStatueData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="gray_font marignLeft8">料类型</span>
            <el-select v-model="stockType" placeholder="请选择" size="small">
              <el-option
                v-for="item in materialDataOne"
                :key="item.stockTypeName"
                :label="item.stockTypeName"
                :value="item.stockTypeName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 24px;margin-bottom: 12px;">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="creatPrice">创建</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        height="700"
        @row-dblclick="editGold"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="knotPriceCode" label="结价单号" width="150"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200"></el-table-column>
        <el-table-column prop="stockType" label="料类型"></el-table-column>
        <el-table-column prop="knotPriceWeight" label="结价净重(g)"></el-table-column>
        <el-table-column prop="goldPrice" label="金价"></el-table-column>
        <el-table-column prop="returnWage" label="退工费"></el-table-column>
        <el-table-column prop="knotPriceMoney" label="结价金额(￥)">
          <template slot-scope="scope">
            <span v-if="scope.row.knotPriceMoney != ''">{{scope.row.knotPriceMoney.toFixed(2)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="结价备注"></el-table-column>
        <el-table-column prop="createTime" label="结价时间"></el-table-column>
        <el-table-column prop="creatorName" label="操作人"></el-table-column>
        <el-table-column prop="hc" label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.hc == '0'" style="color:#8A9199">红冲</span>
            <span v-if="scope.row.hc == '1'" style="color:#8A9199">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="printCount" label="打印"></el-table-column>
        <el-table-column prop="auditStatue" label="单据状态">
          <template slot-scope="scope">
            <span
              v-if="scope.row.auditStatue == '1' && scope.row.hcOrder != 'HC'"
              style="color:#F26D0F"
            >待审核</span>
            <span
              v-else-if="scope.row.auditStatue == '2' && scope.row.hcOrder != 'HC'"
              style="color:#222426"
            >已审核</span>
            <span
              v-else-if="scope.row.auditStatue == '3' && scope.row.hcOrder != 'HC'"
              style="color:#F20F34"
            >已驳回</span>
            <span
              v-else-if="scope.row.auditStatue == '4' && scope.row.hcOrder != 'HC'"
              style="color:#8A9199"
            >作废</span>
            <span v-else style="color:#8A9199">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatu" label="操作">
          <template slot-scope="scope">
            <div
              v-if="(scope.row.auditStatue == '2' || scope.row.auditStatue == '5') && scope.row.hc == '1' && scope.row.hcOrder != 'HC'"
            >
              <!-- <span style="color:#F20F34;cursor:pointer;" @click="printFun(scope.row)">打印</span> -->
              <span style="color:#F20F34;cursor:pointer;" @click="hcFun(scope.row)">红冲</span>
            </div>

            <div
              v-else-if="scope.row.auditStatue == '3' && scope.row.hc == '1' && scope.row.hcOrder != 'HC'"
            >
              <span style="color:#F2930F;cursor:pointer;" @click="toVoidFun(scope.row)">作废</span>
              <span style="color:#F20F34;cursor:pointer;" @click="editFun(scope.row)">编辑</span>
            </div>
            <div v-else>--</div>
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
    <!-- 创建结价单 -->
    <el-dialog title="创建结价单" :visible.sync="newPrice" width="760px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>

        <div class="once">
          <div class="leftWrap">
            <div class="onceTitle">客户名称</div>
            <div class="onceInput">
              <el-select
                v-model="subPrice.customerId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户"
                :remote-method="remoteMethod"
                @keydown.native="customeSelect($event)"
                @change="changCustomer"
                :loading="searchLoading"
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in customerData"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="rightWrap">
            <div class="onceTitle">料类型</div>
            <div class="onceInput">
              <el-select
                v-model="subPrice.stockType"
                placeholder="请选择"
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in materialData"
                  :key="item.stockTypeName"
                  :label="item.stockTypeName"
                  :value="item.stockTypeName"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="once">
          <div class="leftWrap">
            <div class="onceTitle">结价金重</div>
            <div class="onceInput">
              <el-input
                v-model="subPrice.knotPriceWeight"
                placeholder="请填写结价金重"
                size="small"
                @blur="computeFunOne"
              ></el-input>
            </div>
          </div>
          <div class="rightWrap">
            <div class="onceTitle">金价</div>
            <div class="onceInput">
              <el-input
                v-model="subPrice.goldPrice"
                placeholder="请填写结价金价"
                size="small"
                @blur="computeFunTwo"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="once">
          <div class="leftWrap">
            <div class="onceTitle">结价金额</div>
            <div class="onceInput">
              <el-input v-model="amountMoney" placeholder="请填写结价金额" size="small" disabled></el-input>
            </div>
          </div>
          <div class="rightWrap">
            <div class="onceTitle">退工费</div>
            <div class="onceInput">
              <el-input
                v-model="subPrice.returnWage"
                placeholder="请填写退工费"
                size="small"
                @blur="computeFunThree"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="textWrap">
          <div class="onceTitle">结价备注</div>
          <textarea class="textAreaSty" placeholder="请填写结价备注" v-model="subPrice.note"></textarea>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="newPrice = false" size="small">取 消</el-button>
        <el-button type="primary" @click="creatPriceFun" size="small" :loading="createBtnloading">提交</el-button>
      </span>
    </el-dialog>
    <!-- 编辑结价单 -->
    <el-dialog title="编辑结价单" :visible.sync="editPrice" width="760px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>

        <div class="once">
          <div class="leftWrap">
            <div class="onceTitle">客户名称</div>
            <div class="onceInput">
              <el-select
                v-model="subEditPrice.customerId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户"
                :remote-method="remoteMethod"
                @keydown.native="customeSelectEdit($event)"
                @change="editChangCustomer"
                :loading="searchLoading"
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in customerData"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="rightWrap">
            <div class="onceTitle">料类型</div>
            <div class="onceInput">
              <el-select
                v-model="subEditPrice.stockType"
                placeholder="请选择"
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="item in materialData"
                  :key="item.stockTypeName"
                  :label="item.stockTypeName"
                  :value="item.stockTypeName"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="once">
          <div class="leftWrap">
            <div class="onceTitle">结价金重</div>
            <div class="onceInput">
              <el-input
                v-model="subEditPrice.knotPriceWeight"
                placeholder="请填写结价金重"
                size="small"
                @blur="editComputeFunOne"
              ></el-input>
            </div>
          </div>
          <div class="rightWrap">
            <div class="onceTitle">金价</div>
            <div class="onceInput">
              <el-input
                v-model="subEditPrice.goldPrice"
                placeholder="请填写结价金价"
                size="small"
                @blur="editComputeFunTwo"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="once">
          <div class="leftWrap">
            <div class="onceTitle">结价金额</div>
            <div class="onceInput">
              <el-input v-model="editAmountMoney" placeholder="请填写结价金额" size="small" disabled></el-input>
            </div>
          </div>
          <div class="rightWrap">
            <div class="onceTitle">退工费</div>
            <div class="onceInput">
              <el-input
                v-model="subEditPrice.returnWage"
                placeholder="请填写退工费"
                size="small"
                @blur="editComputeFunThree"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="textWrap">
          <div class="onceTitle">结价备注</div>
          <textarea class="textAreaSty" placeholder="请填写结价备注" v-model="subEditPrice.note"></textarea>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPrice = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editPriceFun" size="small" :loading="editBtnLoading">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      createBtnloading: false,
      editBtnLoading: false,
      customerData: [], //客户数据
      loading: false,
      searchLoading: false,
      editAmountMoney: "", //结价金额（编辑）
      amountMoney: "", //结价金额（新增）
      materialData: [], //料纯度数据
      materialDataOne: [], //料纯度数据(有全部)
      customerList: [], //客户数据
      subPrice: {
        //新增结价单
        customerId: "",
        customerIdName: "",
        stockType: "",
        knotPriceWeight: "",
        goldPrice: "",
        returnWage: "",
        note: ""
      },
      subEditPrice: {
        //编辑结价单
        id: "",
        customerId: "",
        customerIdName: "",
        stockType: "",
        knotPriceWeight: "",
        goldPrice: "",
        returnWage: "",
        note: ""
      },
      search: "", //关键字
      startTime: "",
      endTime: "",
      auditStatue: "",
      stockType: "全部",
      auditStatueData: [
        //单据状态数据
        {
          label: "全部",
          value: ""
        },
        {
          label: "待审核",
          value: 1
        },
        {
          label: "已审核",
          value: 2
        },
        {
          label: "已驳回",
          value: 3
        },
        {
          label: "已作废",
          value: 4
        }
      ],
      input: "", //模拟
      newPrice: false, //新增结价单
      editPrice: false, //编辑结价单
      orderList: [],
      selectedDay: "", //日期选择属性
      documentState: "", //单据状态
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.displayAllData();
    this.customerListFun();
    this.materialFun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.customerPrice;
      if (dom != undefined && altKey && keyCode === 78) {
        self.creatPrice();
      }

      if (this.newPrice == true && altKey && keyCode === 83) {
        self.creatPriceFun();
      }
    };
  },
  methods: {
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          auditStatue: self.auditStatue,
          stockType: self.stockType != "全部" ? self.stockType : "",
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/knotPriceList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            if (self.orderList.length > 0) {
              self.orderList.forEach((item, index) => {
                item.createTime = self.$api.dateGetDay(item.createTime);
                item.hcOrder = item.knotPriceCode.slice(0, 2);
              });
            }
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = fasle));
    },
    //调整款查询客户
    customerListFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/saveOweCustomerList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //料纯度数据
    materialFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/knotPriceTypeAllList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.materialData = res.data.data;
            self.materialDataOne = [...res.data.data];
            self.materialDataOne.unshift({
              stockTypeName: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //选择客户
    // changCustomer() {
    //   let self = this;
    //   this.customerList.forEach(item => {
    //     if (item.customerId == self.subPrice.customerId) {
    //       self.subPrice.customerName = item.customerName;
    //     }
    //   });
    // },

    //选择客户
    changCustomer(val) {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == val) {
          self.subPrice.customerName = item.companyName;
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
    // 编辑提纯单
    editGold(elem) {
      //
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    //查询
    queryFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.auditStatue = this.selectedDay =
        "";
      this.stockType = "全部";
      this.queryFun();
    },
    //计算1
    computeFunOne() {
      let self = this;
      if (self.subPrice.knotPriceWeight != undefined) {
        self.subPrice.knotPriceWeight = self.subPrice.knotPriceWeight.trim();
      }

      let result = isNaN(self.subPrice.knotPriceWeight);
      let result2 = Number(self.subPrice.knotPriceWeight) < 0;
      if (result || result2) {
        self.$message.warning("请输入有效数字！");
        self.subPrice.knotPriceWeight = "";
        return;
      }
      this.computeFun();
    },
    //计算2
    computeFunTwo() {
      let self = this;
      if (self.subPrice.goldPrice != undefined) {
        self.subPrice.goldPrice = self.subPrice.goldPrice.trim();
      }

      let result = isNaN(self.subPrice.goldPrice);
      let result2 = Number(self.subPrice.goldPrice) < 0;
      if (result || result2) {
        self.$message.warning("请输入有效数字！");
        self.subPrice.goldPrice = "";
        return;
      }
      this.computeFun();
    },
    //计算3
    computeFunThree() {
      let self = this;
      if (self.subPrice.returnWage != undefined) {
        self.subPrice.returnWage = self.subPrice.returnWage.trim();
      }

      let result = isNaN(self.subPrice.returnWage);
      let result2 = Number(self.subPrice.returnWage) < 0;
      if (result || result2) {
        self.$message.warning("请输入有效数字！");
        self.subPrice.returnWage = "";
        return;
      }
      this.computeFun();
    },
    //计算方法
    computeFun() {
      let self = this;
      if (!isNaN(self.subPrice.goldPrice) && !isNaN(self.subPrice.returnWage)) {
        this.amountMoney =
          this.subPrice.knotPriceWeight * self.subPrice.goldPrice -
          this.subPrice.knotPriceWeight * self.subPrice.returnWage;
        this.amountMoney = Math.round(this.amountMoney);
      } else if (!isNaN(self.subPrice.goldPrice)) {
        this.amountMoney =
          this.subPrice.knotPriceWeight * self.subPrice.goldPrice;
        this.amountMoney = Math.round(this.amountMoney);
      } else if (!isNaN(self.subPrice.returnWage)) {
        this.amountMoney =
          this.subPrice.knotPriceWeight * self.subPrice.returnWage;
        this.amountMoney = Math.round(this.amountMoney);
      }
    },
    //新增调整款
    creatPrice() {
      this.newPrice = true;
      this.createBtnloading = false;
      this.amountMoney = "";
      this.subPrice = {
        customerId: "",
        customerIdName: "",
        stockType: "",
        knotPriceWeight: "",
        goldPrice: "",
        returnWage: "",
        note: ""
      };
      this.customerData = [];
    },
    //提交创建结价
    creatPriceFun() {
      let self = this;
      if (this.subPrice.customerId == "") {
        self.$message.warning("请选择客户名称！");
        return;
      }
      if (this.subPrice.stockType == "") {
        self.$message.warning("请选择料类型！");
        return;
      }
      if (this.subPrice.knotPriceWeight != undefined) {
        this.subPrice.knotPriceWeight = this.subPrice.knotPriceWeight.trim();
      }

      if (this.subPrice.knotPriceWeight == "") {
        self.$message.warning("请填写结价金重！");
        return;
      }
      if (this.subPrice.goldPrice != undefined) {
        this.subPrice.goldPrice = this.subPrice.goldPrice.trim();
      }

      if (this.subPrice.goldPrice == "") {
        self.$message.warning("请填写金价！");
        return;
      }

      if (this.subPrice.returnWage != undefined) {
        this.subPrice.returnWage = this.subPrice.returnWage.trim();
      }

      if (this.subPrice.note != undefined) {
        this.subPrice.note = this.subPrice.note.trim();
      }

      let parems = { knotPrice: JSON.stringify(self.subPrice) };
      this.createBtnloading = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/insertknotPrice",
        parems,
        res => {
          self.$message.success(res.msg);
          self.newPrice = false;
          self.createBtnloading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.createBtnloading = false;
        }
      );
    },
    //打印
    printFun(elem) {
      let self = this;
      let params = {
        PRS: {
          knotPriceId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/printKnotPrice", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //红冲
    hcFun(elem) {
      let self = this;
      let params = {
        PRS: {
          knotPriceId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/HCKnotPrice", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //编辑
    editFun(elem) {
      this.editPrice = true;
      this.customerData = [
        {
          companyId: elem.customerId,
          companyName: elem.customerName
        }
      ];
      this.subEditPrice = {
        //编辑结价单
        id: elem.id,
        customerId: elem.customerId,
        customerIdName: elem.customerName,
        stockType: elem.stockType,
        knotPriceWeight: elem.knotPriceWeight,
        goldPrice: elem.goldPrice,
        returnWage: elem.returnWage,
        note: elem.note
      };
      this.editComputeFun();
    },
    //计算1
    editComputeFunOne() {
      let self = this;
      if (self.subEditPrice.knotPriceWeight != undefined) {
        self.subEditPrice.knotPriceWeight = self.subEditPrice.knotPriceWeight.trim();
      }

      let result = isNaN(self.subEditPrice.knotPriceWeight);
      let result2 = Number(self.subEditPrice.knotPriceWeight) < 0;
      if (result || result2) {
        self.$message.warning("请输入有效数字！");
        self.subEditPrice.knotPriceWeight = "";
        return;
      }
      this.editComputeFun();
    },
    //计算2
    editComputeFunTwo() {
      let self = this;
      if (self.subEditPrice.goldPrice != undefined) {
        self.subEditPrice.goldPrice = self.subEditPrice.goldPrice.trim();
      }

      let result = isNaN(self.subEditPrice.goldPrice);
      let result2 = Number(self.subEditPrice.goldPrice) < 0;
      if (result || result2) {
        self.$message.warning("请输入有效数字！");
        self.subEditPrice.goldPrice = "";
        return;
      }
      this.editComputeFun();
    },
    //计算3
    editComputeFunThree() {
      let self = this;
      if (self.subEditPrice.returnWage != undefined) {
        self.subEditPrice.returnWage = self.subEditPrice.returnWage.trim();
      }

      let result = isNaN(self.subEditPrice.returnWage);
      let result2 = Number(self.subEditPrice.returnWage) < 0;
      if (result || result2) {
        self.$message.warning("请输入有效数字！");
        self.subEditPrice.returnWage = "";
        return;
      }
      this.editComputeFun();
    },
    //计算方
    editComputeFun() {
      let self = this;
      if (
        !isNaN(self.subEditPrice.goldPrice) &&
        !isNaN(self.subEditPrice.returnWage)
      ) {
        this.editAmountMoney =
          this.subEditPrice.knotPriceWeight * self.subEditPrice.goldPrice -
          this.subEditPrice.knotPriceWeight * self.subEditPrice.returnWage;
        this.editAmountMoney = Math.round(this.editAmountMoney);
      } else if (!isNaN(self.subEditPrice.goldPrice)) {
        this.editAmountMoney =
          this.subEditPrice.knotPriceWeight * self.subEditPrice.goldPrice;
        this.editAmountMoney = Math.round(this.editAmountMoney);
      } else if (!isNaN(self.subEditPrice.returnWage)) {
        this.editAmountMoney =
          this.subEditPrice.knotPriceWeight * self.subEditPrice.returnWage;
        this.editAmountMoney = Math.round(this.editAmountMoney);
      }
    },
    //提交编辑结价单
    editPriceFun() {
      let self = this;
      if (this.subEditPrice.customerId == "") {
        self.$message.warning("请选择客户名称！");
        return;
      }
      if (this.subEditPrice.stockType == "") {
        self.$message.warning("请选择料纯度！");
        return;
      }
      if (this.subEditPrice.knotPriceWeight != undefined) {
        this.subEditPrice.knotPriceWeight = `${this.subEditPrice.knotPriceWeight} `.trim();
      }

      if (this.subEditPrice.knotPriceWeight == "") {
        self.$message.warning("请填写结价金重！");
        return;
      }
      if (this.subEditPrice.goldPrice != undefined) {
        this.subEditPrice.goldPrice = `${this.subEditPrice.goldPrice} `.trim();
      }

      if (this.subEditPrice.goldPrice == "") {
        self.$message.warning("请填写金价！");
        return;
      }

      if (this.subEditPrice.returnWage != undefined) {
        this.subEditPrice.returnWage = `${this.subEditPrice.returnWage} `.trim();
      }

      if (this.subEditPrice.note != undefined) {
        this.subEditPrice.note = this.subEditPrice.note.trim();
      }

      let parems = { knotPrice: JSON.stringify(self.subEditPrice) };
      this.editBtnLoading = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/updateKnotPrice",
        parems,
        res => {
          self.$message.success(res.msg);
          self.editPrice = false;
          self.editBtnLoading = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
          self.editBtnLoading = false;
        }
      );
    },
    //作废
    toVoidFun(elem) {
      let self = this;
      let params = {
        PRS: {
          knotPriceId: elem.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/invalidKnotPrice", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            self.displayAllData();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchLoading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        //client/clientListSimple
        self.$axios
          .get(self.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.searchLoading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },
    // 客户删除(新增)
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.subPrice.customerId = "";
        this.customerData = [];
      }
    },
    //客户删除(编辑)
    customeSelectEdit(e) {
      if (e.keyCode == 8) {
        this.subEditPrice.customerId = "";
        this.customerData = [];
      }
    },
    //编辑选择客户
    editChangCustomer() {
      let self = this;
      this.customerData.forEach(item => {
        if (item.companyId == self.subEditPrice.customerId) {
          self.subEditPrice.customerName = item.companyName;
        }
      });
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
    font-size: 12px;
  }

  .marignLeft8 {
    margin-left: 24px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
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

  .draftColor {
    color: #F2B90F;
  }

  .cancelColor {
    color: #8A9199;
  }

  .promptStyle {
    position: relative;

    .line {
      width: 760px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .once {
      display: flex;
      margin-bottom: 32px;

      .leftWrap {
        flex: 1;
        display: flex;
        align-items: center;

        .onceTitle {
          color: #8A9199;
          font-size: 14px;
          width: 56px;
        }

        .onceInput {
          width: 240px;
          margin-left: 16px;
        }
      }

      .rightWrap {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .onceTitle {
          color: #8A9199;
          font-size: 14px;
        }

        .onceInput {
          width: 240px;
          margin-left: 16px;
        }
      }
    }

    .textWrap {
      display: flex;

      .onceTitle {
        color: #8A9199;
        font-size: 14px;
        width: 56px;
      }

      .textAreaSty {
        width: 624px;
        height: 60px;
        resize: none;
        border-radius: 2px;
        border: 1px solid #CFD9E6;
        margin-left: 18px;
        padding: 10px;

        &::-webkit-input-placeholder {
          color: rgb(180, 188, 204);
        }

        &:-moz-placeholder {
          color: rgb(180, 188, 204);
        }

        &::-moz-placeholder {
          color: rgb(180, 188, 204);
        }

        &:-ms-input-placeholder {
          color: rgb(180, 188, 204);
        }
      }
    }
  }
}
</style>
