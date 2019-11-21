<template>
  <div class="conBigDiv" ref="basicLaborCost" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>款料计划</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top10">
      <span class="fontStyle" style="margin-left: 0px;">客户名称</span>
      <el-select
        v-model="search"
        filterable
        remote
        reserve-keyword
        clearable
        placeholder="请输入客户"
        :remote-method="remoteMethod"
        @change="changCustomer"
        :loading="searchLoading"
        size="small"
        class="width240"
      >
        <el-option
          v-for="item in customerData"
          :key="item.companyName"
          :label="item.companyName"
          :value="item.companyName"
        ></el-option>
      </el-select>
      <span class="fontStyle">时间筛选</span>
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
        @change="searchFun"
      ></el-date-picker>

    </div>
    <div class="tabOne">
      <el-row class="tabTop">
        <el-col :span="4">客户名称</el-col>
        <el-col :span="5">计划来款(￥)</el-col>
        <el-col :span="5">计划来料(g)</el-col>
        <el-col :span="4">生效时间</el-col>
        <el-col :span="4">发布人</el-col>
        <el-col :span="2">发布时间</el-col>
      </el-row>
      <el-row class="tabCenter" v-for="(ielem,indOne) in tabAllData" :key="indOne">
        <el-col :span="4">
          {{ielem.userName}}
        </el-col>
        <el-col :span="5">{{ielem.backMoney}}</el-col>
        <el-col :span="5">{{ielem.backGold}}</el-col>
        <el-col
          :span="4"
        >{{$api.dateGetDay(ielem.backDate)}} - {{$api.dateGetDay(ielem.endDate)}}</el-col>
        <el-col :span="4">{{ielem.myName}}</el-col>
        <el-col :span="2">{{$api.dateGetDayTime(ielem.createTime)}}</el-col>
      </el-row>
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
</template>
<script>

export default {
  data() {
    return {
      loading: false,
      tabAllData: [], //条目所有数据
      tabDelData: [], //删除数据条目
      optionOne: [
        {
          value: "足金999",
          label: "足金999"
        },
        {
          value: "足金9999",
          label: "足金9999"
        }
      ], //饰品成色
      optionTwo: [], //饰品品类
      addProTF: false, //托盘添加Sku弹框
      proList: [],
      selectProId: "",
      pageSize: 0,
      selectedDay: "",
      startTime: "", //开始时间
      endTime: "", //结束时间
      pageNum: 0,
      priceSum: 0,
      goldCodeId: "全部",
      goldCodeList: [],
      stockTypeId: "",
      search: "",
      processCodeList: [],
      processCodeId: "全部",
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      customerData: [], //客户名称数据
      searchLoading: false,
    };
  },
  created() {
    this.created_fun();
    // this.codeDisplay();
    //饰品品类读取
    // this.cateLoad();
  },
  methods: {
    created_fun() {
      this.displayAddProData(1, 12);
    },
    displayAddProData(num, size) {
      this.loading = true;
      var self = this;
      // console.log(self.search)
      let params = {
        // search: self.search,
        // start:self.startTime,
        // end:self.endTime,
        page: num,
        rows: size
      };
      if(self.search){
        params.search = self.search
      }
      if(self.startTime){
        params.start = self.startTime
      }
      if(self.endTime){
        params.end = self.endTime
      }
      this.$api.formdataPostFun(
        this.$portMain + "/order/bm/list",
        params,
        res => {
          self.pageNum = num;
          self.pageSize = size;
          self.priceSum = res.data.data.rowSize;
          self.tabAllData = res.data.data.data;
          self.tabAllData.forEach(ielem => {
            ielem.editTF = false;
          });
          self.loading = false;
        },
        err => {
          self.$message.error(err.msg);
          self.loading = false;
        }
      );
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAddProData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAddProData(val, this.pageSize);
    },
    
    //下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchLoading = true;
        let params = {
          PRS: {
            companyId: 91681,
            keyWord: query
          }
        };
        self.$axios
          .get(self.$portMain + "/company/queryRawClients", params)
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
    searchFun() {
      var self = this;
      if (this.selectedDay != null) {
        this.startTime = this.$api.dateGetDay(this.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(this.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      self.displayAddProData(1, 12);
    },
    //选择客户
    changCustomer(val) {
      this.search = val;
      this.searchFun();
    },
    codeDisplay() {
      var self = this;
      // let categoryListTwo = self.sarkData.depositType.split(",");
      self.categoryNewList = [];
      // //
      this.$publicData
        .categoryFun()
        .then(function(res) {
          self.categoryNewList = res;
          self.categoryNewList.unshift({ label: "", value: "全部" });
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
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    //防止优惠价格冒泡事件
    changeNum(e) {},
    //饰品品类读取
    // cateLoad() {
    //   let self = this;
    //   this.$axios
    //     .get(this.$portMain + "/product/findMarketingCategoryList")
    //     .then(function(res) {
    //       if (res.data.code === 200) {
    //         self.optionTwo = res.data.data;
    //       } else {
    //         self.$message.error(res.data.msg);
    //       }
    //     });
    // },
    //添加新条目事件
    addFun() {
      let self = this;
      self.selectProId = "";
      self.addProTF = true;
      self.displayAddProData(1, 12);
      // this.tabAllData.push({
      //   marketingDiscountPrice: 0,
      //   marketingName: "",
      //   stockType: "足金999",
      //   editTF: true
      // });
    },

    //刪除条目事件
    delFun(index) {
      let self = this;
      this.$confirm("此操作将永久删除该特价饰品优惠, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // self.tabDelData.push(self.tabAllData[index]);
          // self.tabAllData.splice(index, 1);
          // self.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //新增优惠产品取消按钮
    cancelAdd() {
      this.addProTF = false;
    },
    //新增优惠产品确认按钮
    confirmAdd() {
      let self = this;
      let confirmList = [];
      this.proList.forEach(ielem => {
        if (ielem.selectTF === true && ielem.skuDiscountPrice) {
          confirmList.push(ielem);
        }
      });
      if (confirmList.length > 0) {
        let tskuDiscountlist = [];
        confirmList.forEach(ielem => {
          tskuDiscountlist.push({
            skuCode: ielem.proNumber,
            skuDiscountPrice: ielem.skuDiscountPrice,
            wagePrice: 2
          });
        });
        let params = {
          tskuDiscountlist: JSON.stringify(tskuDiscountlist)
        };
        this.$api.formdataPostFun(
          this.$portMain + "/discount/insertTskuDiscountList",
          params,
          res => {
            self.$message.success("新增优惠产品成功，正在刷新！");

            setTimeout(function() {
              self.addProTF = false;
              self.created_fun();
            }, 1000);
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      } else {
        this.$message.error("未选择产品或选择产品未填入优惠价，请重新提交!");
      }
      // this.addProTF = false;
    },
    //新增优惠产品选择产品
    selectPro(elem) {
      if (elem.selectTF == undefined) {
        elem.selectTF = true;
      } else {
        elem.selectTF = !elem.selectTF;
      }
      this.$forceUpdate();
    },
    //查看图片
    //查看图片
    showPic(imgSrc) {
      // this.modelType = true;
      // this.modelImgSrc = imgSrc;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  font-size: 14px;

  .tabOne {
    margin-top: 30px;

    .tabTop {
      color: #8A8E99;
      border-bottom: 1px #E4E9F0 solid;
      line-height: 50px;
    }

    .tabCenter {
      color: #2E3033;
      border-bottom: 1px #E4E9F0 solid;
      line-height: 50px;
    }

    .txtDel {
      color: #F2930F;
    }

    .txtRed {
      color: #F20F34;
    }
  }

  .width120 {
    width: 120px;
  }

  .orderBigDiv {
    margin-top: 10px;
    padding: 10px 20px;
    min-height: 126px;
    border: #E9ECF5 1px solid;
  }

  .orderBigDivTwo {
    margin-top: 10px;
    padding: 10px 20px;
    min-height: 126px;
    background-color: #f2f8ff;
    border: #cfd9e5 1px solid;
  }

  .tabTwo {
    display: flex;
  }

  .tabTwoLeft {
    width: 174px;
  }

  .tabTwoRight {
    width: calc(100% - 174px);
  }

  .inputRight {
    font-family: 'Microsoft YaHei';
    font-style: normal;
  }

  .width70 {
    width: 70px;
  }
  .pageD {
    margin-top: 20px;
    text-align: center;
  }
  .top10{
    margin-top:10px
  }

}
</style>
