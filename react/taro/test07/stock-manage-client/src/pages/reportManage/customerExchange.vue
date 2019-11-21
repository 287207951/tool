 <template>
  <div class="conBigDiv setTabel" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>报管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户饰品往来(明细)</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <span class="fontStyle" style="margin-left: 0px;">客户名称</span>
          <el-select
            v-model="customerId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入客户"
            :remote-method="remoteMethod"
            @keydown.native="customeSelect($event)"
            @change="changCustomer"
            :loading="searchLoading"
            size="small"
            class="width240"
          >
            <el-option
              v-for="item in customerData"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
          <span class="fontStyle">种类</span>
          <el-select v-model="stockType" placeholder="请选择" size="small">
            <el-option label="全部" value></el-option>
            <el-option v-for="item in cateList" :key="item.val" :label="item.txt" :value="item.val"></el-option>
          </el-select>
          <span class="fontStyle">业务类型</span>
          <el-select v-model="statue" placeholder="请选择" size="small">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in businessList"
              :key="item.val"
              :label="item.txt"
              :value="item.val"
            ></el-option>
          </el-select>
          <span class="fontStyle">开票类型</span>
          <el-select v-model="categoryName" placeholder="请选择" size="small">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in oweTypeList"
              :key="item.id"
              :label="item.type"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">营销品类</span>
          <el-select v-model="makeingType" placeholder="请选择" size="small">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in marketingCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <div style="margin-top: 10px;">
            <span class="fontStyle" style="margin-left: 0px">起止时间</span>
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
            <el-button type="primary" size="small" @click="queryFun">查询</el-button>
            <span v-if="tabelDataOne.length > 0">
              <el-button type="danger" size="small" plain @click="resetFun">重置</el-button>
              <el-button size="small" @click="excelOutOne">导出Excel</el-button>
            </span>
          </div>
        </el-col>
      </el-row>

      <div class="txt16 top20 custTit">
        <div v-if="customerName">{{customerName}} （财务编码：{{financeCode}}）</div>
      </div>
      <div class="detailInformation">明细信息</div>
      <el-table :data="tabelDataOne" row-key="id" style="width:2500px" height="300">
        <el-table-column label="日期" prop="createTime"></el-table-column>
        <el-table-column label="单号" prop="orderCode"></el-table-column>
        <el-table-column label="种类" prop="stockType" width="200"></el-table-column>
        <el-table-column label="业务类型" prop="statueName" width="180"></el-table-column>
        <el-table-column label="开票类型" prop="categoryName"></el-table-column>
        <el-table-column label="营销品类" prop="makeingType" width="150"></el-table-column>
        <el-table-column label="重量" prop="weight" width="150"></el-table-column>
        <el-table-column label="件数" prop="amount"></el-table-column>
        <el-table-column label="金额" prop="money" width="120"></el-table-column>
        <el-table-column label="备注" prop="note" width="120"></el-table-column>
      </el-table>
    </div>
    <a ref="xlsDownloadA"></a>
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
</template>
<script>
export default {
  data() {
    return {
      customerId: ``,
      stockType: ``,
      categoryName: ``,
      makeingType: ``,
      statue: ``,

      // 种类
      cateList: [
        {
          txt: `足金999`,
          val: `足金999`
        },
        {
          txt: `足金9999`,
          val: `足金9999`
        },
        {
          txt: `足金(硬金)`,
          val: `足金(硬金)`
        }
      ],

      // 业务类型
      businessList: [
        {
          txt: `收工厂饰`,
          val: `9`
        },
        {
          txt: `出客户饰`,
          val: `7`
        },
        {
          txt: `物流入饰`,
          val: `11`
        },
        {
          txt: `物流出饰`,
          val: `12`
        },
        {
          txt: `收客户饰`,
          val: `10`
        }
      ],

      // 营销品类
      marketingCategoryList: [],

      // 开票类型
      oweTypeList: [],

      // 公司名称
      customerName: ``,

      // 财务编码
      financeCode: ``,

      showAllRow: false,
      loading: false,
      searchLoading: false,
      companyName: "", //客户名称
      customerData: [], //客户名称数据
      tabelDataOne: [], //列表数据
      expands: [],
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间

      resoureCode: "", //单号
      debitCountWeight: "", //计价重量
      debitWeight: "", //借方重量
      debitMoney: "", //借方金额
      creditWeight: "", //贷方重量
      creditMoney: "", //贷方金额
      balanceWeight: "", //余额重量
      balanceMoney: "", //余额金额

      stockTypeId: "", //料类型
      billsStatue: "", //单据类型
      stockSetTypeList: [], // 料类型数据
      allData: [], //料转饰数据
      value: "", //模拟
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      statue: "", // 单据方式
      customerType: "", //客户类型
      customerTypeData: []
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      //   获取营销品目
      this.getMarketingCategoryList();

      // 获取开票类型
      this.getOweTypeList();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          customerId: self.customerId,
          stockType: self.stockType,
          categoryName: self.categoryName,
          makeingType: self.makeingType,
          statue: self.statue,
          startTime: self.startTime,
          endTime: self.endTime,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/currentAccountBycomterName", params)
        .then(function(res) {
          if (res.data.code == 200) {
            res.data.data.data.forEach(item => {
              item.createTime = self
                .$moment(item.createTime)
                .format("YYYY/MM/DD");
            });
            self.tabelDataOne = res.data.data.data;
            self.customerName = self.tabelDataOne[0].customerName;
            self.financeCode = self.tabelDataOne[0].financeCode;
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },

    // 获取营销品目
    getMarketingCategoryList() {
      const self = this;
      this.$axios
        .get(this.$portMain + "/product/findMarketingCategoryList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.marketingCategoryList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 获取开票类型
    getOweTypeList() {
      const self = this;
      this.$axios
        .get(this.$portMain + "/discount/selectSaveOweTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.oweTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "类型重量" ||
          column.label === "类型金额" ||
          column.label === "出货重量" ||
          column.label === "借方重量" ||
          column.label === "借方金额" ||
          column.label === "贷方重量" ||
          column.label === "贷方金额" ||
          column.label === "余额重量" ||
          column.label === "余额金额" ||
          column.label === "已开票重量" ||
          column.label === "已开票金额" ||
          column.label === "未开票重量" ||
          column.label === "未开票金额" ||
          column.label === "结价重量" ||
          column.label === "结价金额" ||
          column.label === "转欠重量" ||
          column.label === "转欠金额" ||
          column.label === "结价单重量" ||
          column.label === "结价单金额"
        ) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                let res = (Number(prev) + Number(curr)).toFixed(2);
                return res;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    },

    //导出todo
    excelOutOne() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          customerId: self.customerId,
          stockType: self.stockType,
          categoryName: self.categoryName,
          makeingType: self.makeingType,
          statue: self.statue,
          startTime: self.startTime,
          endTime: self.endTime
        }
      };
      this.$axios
        .get(
          this.$portMain + "/templateExcelstock/currentAccountBycomterName",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            var baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "往来对账单-主表." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },

    // 编辑单
    editGold(elem) {},

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

    // 查询事件
    queryFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //每页显示条目个数
      this.displayAllData();
    },

    // 新建发料
    createdFun() {
      this.$router.push("creatMaterialTransfer");
    },

    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = self.$moment(self.selectedDay[0]).format("YYYY/MM/DD");
        this.endTime = self.$moment(self.selectedDay[1]).format("YYYY/MM/DD");
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },

    //重置
    resetFun() {
      this.customerId = ``;
      this.stockType = ``;
      this.categoryName = ``;
      this.makeingType = ``;
      this.statue = ``;
      this.startTime = ``;
      this.endTime = ``;
      this.customerData = [];
      this.tabelDataOne = [];
    },

    //下拉搜索
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

    //客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.companyName = "";
        this.customerData = [];
      }
    },
    //选择客户
    changCustomer(val) {
      // this.search = val;
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

  .tableWrap {
    .thWrap {
      font-size: 14px;
      color: #8A8E99;
      display: flex;
      border-bottom: 1px solid #E4E7F0;
      height: 48px;
      align-items: center;

      span {
        flex: 1;
        padding-left: 10px;
        padding-right: 10px;
      }
    }

    .tbody {
      .tr {
        display: flex;
        min-height: 48px;
        align-items: center;
        border-bottom: 1px solid #E4E7F0;
        box-sizing: border-box;
        padding-top: 12px;
        padding-bottom: 12px;

        &:hover {
          background-color: #f5f7fa;
        }
      }

      .td {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 14px;
        color: rgb(90, 94, 102);

        .lastTd {
          position: relative;

          .el-icon-arrow-right {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }

  .tabelStyle {
    height: 48px;
    // overflow hidden
    border-bottom: 1px solid #E4E7F0;
    line-height: 48px;

    &:last-child {
      border-bottom: 0px solid #E4E7F0;
    }

    font-size: 0;

    .firstWrap {
      display: inline-block;
      width: 53%;
    }

    .secondWrap {
      display: inline-block;
      width: 47%;
      display: inline-flex;
      font-size: 14px;

      .tdt {
        flex: 1;
        padding: 0 6px;
      }
    }
  }

  .tableSearchWrap {
    display: flex;
    background: #f5f7fa;
    height: 48px;
    align-items: center;

    .leftWrap {
      // background: red;
      flex: 24;

      .inputWrap {
        margin-left: 45%;
        max-width: 110px;
        width: 13%;
      }
    }

    .rightWrap {
      // background: yellow;
      flex: 17;
      display: flex;

      .inputWrap {
        margin-right: 3%;
        max-width: 80px;
        width: 11%;
      }
    }
  }
}

.custTit {
  margin-top: 30px;
  font-size: 18px;
  margin-bottom: 10px;
}

.detailInformation {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>

<style>
.setTabel .el-table__expanded-cell {
  padding: 0px;
}
</style>

