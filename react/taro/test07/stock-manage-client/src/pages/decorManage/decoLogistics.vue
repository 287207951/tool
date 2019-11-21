<template>
  <div class="conBigDiv" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流库存</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字查询"
            v-model="search"
            class="searchTxt"
            size="small"
            @keydown.enter.native="getOrderList"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>

          <span class="fontGray marginLeft24">产品材质</span>
          <el-select
            v-model="goldCodeId"
            placeholder="请选择"
            size="small"
            class="width200"
            @change="getOrderList"
          >
            <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>

          <span class="fontGray marginLeft24">产品类别</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            class="width200"
            @change="getOrderList"
          >
            <el-option
              v-for="item in categoryNewList"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>

          <span class="fontGray marginLeft24">生产工艺</span>
          <el-select v-model="processCodeId" size="small" class="width200" @change="getOrderList">
            <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <!-- <span class="fontStyle">工厂</span>
          <el-select
            v-model="customerName"
            filterable
            size="small"
            @change="getOrderList"
          >
            <el-option
              v-for="item in customerList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>-->
        </el-col>
      </el-row>

      <div class="container">
        <div class="productWarp" v-for="(item,index) in stockPro" :key="index">
          <img
            v-if="item.url"
            :src="item.url?$portImg+item.url:'../../../static/images/img-noimg.png'"
            class="productPic"
          >
          <div class="productDes">
            <div class="proUL">
              <div class="proTitel">{{item.proName}}</div>
              <div class="proLI" v-if="item.proNumber">
                <span class="left">编号：</span>
                <span class="right">{{item.proNumber}}</span>
              </div>
              <div class="proLI" v-if="item.one">
                <span class="left">类别：</span>
                <span class="right">{{item.one}}</span>
              </div>
            </div>

            <div class="proUL">
              <div class="proLI" v-if="item.effectCode">
                <span class="left">表面工艺：</span>
                <span class="right">{{item.effectCode}}</span>
              </div>

              <div class="proLI" v-if="item.goldCode">
                <span class="left">产品材质：</span>
                <span class="right">{{item.goldCode}}</span>
              </div>

              <div class="proLI" v-if="item.processCode">
                <span class="left">生产工艺：</span>
                <span class="right">{{item.processCode}}</span>
              </div>
            </div>
            <div class="proUL">
              <div class="proLI">
                <span class="left">工厂：</span>
                <span class="right">{{item.factoryName}}</span>
              </div>
              <div class="proLI" v-if="item.carCode">
                <span class="left">车花：</span>
                <span class="right">{{item.carCode}}</span>
              </div>
            </div>
            <div class="proUL">
              <div class="proLI" v-if="item.conditi">
                <span class="left">成色：</span>
                <span class="right">{{item.conditi}}</span>
              </div>
              <div class="proLI" v-if="item.weight">
                <span class="left">克重：</span>
                <span class="right">{{item.weight}}g</span>
              </div>
            </div>

            <div class="proUL">
              <div class="proLI" v-if="item.amount">
                <span class="left">库存数量：</span>
                <span class="right">{{item.amount?item.amount:0}}</span>
              </div>

              <!-- <div class="proLI" v-if="item.goldWeight">
                <span class="left">库存毛重：</span>
                <span class="right">{{item.goldWeight?item.goldWeight:0}}g</span>
              </div>-->

              <div class="proLI" v-if="item.goldWeight">
                <span class="left">库存净重：</span>
                <span class="right">{{item.goldWeight?item.goldWeight:0}}g</span>
              </div>
            </div>

            <!-- <div class="SUKUL">
              <div class="proLI">
                <span class="left">库存数据：</span>
                <span class="right">6</span>
              </div>

              <div class="proLI">
                <span class="left">库存毛重：</span>
                <span class="right">120.36g</span>
              </div>

              <div class="proLI">
                <span class="left">库存净重：</span>
                <span class="right">118.12g</span>
              </div>
            </div>-->
          </div>
        </div>
      </div>

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
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      search: "",
      stockPro: [], //订单数据
      mock: "",
      goldCodeList: [], //生产材质
      processCodeList: [], //生产工艺
      categoryList: [],
      categoryNewList: [], //生产类别
      goldCodeId: "", //生产材质
      stockTypeId: "", //生产类别
      processCodeId: "", //生产工艺
      customerName: "", //工厂选择
      customerList: [], //工厂列表
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0 //总条目数
    };
  },
  created() {
    this.getOrderList();
    this.codeDisplay();
    this.getCategoryData();
    // this.getFactoryList();
    //工厂列表读取
    // this.factoryLoad();
  },
  methods: {
    searchFun() {},
    getOrderList() {
      this.loading = true;
      let self = this;
      let params = {
        proName: self.search,
        goldCode: self.goldCodeId,
        one: self.stockTypeId,
        processCode: self.processCodeId,
        page: self.pageNum,
        rows: self.pageSize
      };
      this.$api.formdataPostFun(
        self.$portMain + "/product/logisticsHall",
        params,
        res => {
          if (res.code == 200) {
            self.stockPro = res.data.data;
            self.priceSum = res.data.rowSize;

            // self.stockPro.forEach(item => {
            //   if (item.one != "套装") {
            //     //单品suit为1
            //     item.suit = 1;
            //   } else {
            //     //套装suit为2
            //     item.suit = 2;
            //   }
            //   item.Number = 0;
            //   if (item.extendAttr == "{}" || !item.extendAttr) {
            //     item.sizeList = {};
            //   } else {
            //     item.sizeList = JSON.parse(item.extendAttr);
            //   }
            // });
          } else {
            self.$message.error(res.data.msg);
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      );
    }, 
    //工厂列表搜索
    factoryLoad() {
      let self = this;
      var params = { PRS: { keyWord: "" } };
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
            self.customerList.unshift({ companyId: "", companyName: "全部" });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //获取材质、工艺数据
    codeDisplay() {
      let self = this;
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
    //获取类别数据
    getCategoryData() {
      let self = this;
      this.$publicData
        .categoryFun()
        .then(function(res) {
          self.categoryList = res;
          self.categoryNewList = JSON.parse(JSON.stringify(self.categoryList));
          self.categoryNewList.unshift({
            value: "全部",
            label: ""
          });
        })
        .catch(function(err) {
          self.categoryList = [
            {
              value: "全部",
              label: ""
            }
          ];
          self.$message.error(err);
        });
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getOrderList();
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

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .searchTxt {
    width: 256px;
  }

  .marginLeft24 {
    margin-left: 24px;
  }

  .fontGray {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(138, 142, 153, 1);
  }

  .container {
    padding-top: 24px;

    .productWarp {
      // width: 1px;
      height: 120px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 241, 255, 1);
      box-sizing: border-box;
      display: flex;
      padding: 16px 24px 14px 24px;
      margin-bottom: 8px;

      .productPic {
        width: 120px;
        height: 90px;
      }

      .productDes {
        // display: inline-block;
        margin-left: 16px;
        width: 100%;
        display: flex;

        .proTitel {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          margin-bottom: 11px;
        }

        .proUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          // margin-right: 224px;
          width: 24%;
          overflow: hidden;
          line-height: 19px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .SUKUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
        }

        .proLI {
          margin-bottom: 11px;

          .left {
            color: #889199;
          }

          .right {
          }
        }
      }
    }
  }
}
</style>
