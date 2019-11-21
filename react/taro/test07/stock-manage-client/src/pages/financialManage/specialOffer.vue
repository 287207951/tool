<template>
  <div class="conBigDiv" ref="basicLaborCost" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>工费设置</el-breadcrumb-item>
      <el-breadcrumb-item>特价饰品优惠</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="txtRight">
      <el-button size="small" @click="addFun">新增优惠饰品</el-button>
      <el-button type="primary" size="small" @click="confirmSave">确认保存</el-button>
    </div>
    <div class="tabOne">
      <el-table
        :data="tabAllData"
        border
        :header-cell-style="{background:'#E9EFF4',border:'1px solid #CFD9E5',borderLeft:'0'}"
        style="width: 100%"
      >
        <el-table-column align="center" label="图片">
          <template slot-scope="scope">
            <span v-if="scope.row.receSkuPrice">
              <img
                :src="scope.row.receSkuPrice.skuPic?$portImg + scope.row.receSkuPrice.skuPic:'../../../static/images/img-noimg.png'"
                width="120"
                height="90"
              />
            </span>
            <span v-if="scope.row.url">
              <img
                :src="scope.row.url?$portImg + scope.row.url:'../../../static/images/img-noimg.png'"
                width="120"
                height="90"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            <span v-if="scope.row.receSkuPrice">{{scope.row.receSkuPrice.skuName}}</span>
            <span v-else>{{scope.row.proName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="skuCode" align="center" label="编号">
          <template slot-scope="scope">
            <span v-if="scope.row.skuCode">{{scope.row.skuCode}}</span>
            <span v-else>{{scope.row.proNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receSkuPrice.colorFormer" align="center" label="成色">
          <template slot-scope="scope">
            <span v-if="scope.row.receSkuPrice">{{scope.row.receSkuPrice.colorFormer}}</span>
            <span v-else>{{scope.row.conditi}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receSkuPrice.Weight" align="center" label="克重">
          <template slot-scope="scope">
            <span v-if="scope.row.receSkuPrice">{{scope.row.receSkuPrice.Weight}}/g</span>
            <span v-else>{{scope.row.weight}}/g</span>
          </template>
        </el-table-column>
        <el-table-column prop="wagePrice" align="center" label="原工费">
          <template slot-scope="scope">
            <span v-if="scope.row.receSkuPrice">{{scope.row.wagePrice}}/g</span>
            <span v-else>
              <span v-if="scope.row.feeType === 1">{{scope.row.additionPrice}}/g</span>
              <span v-if="scope.row.feeType === 2">{{scope.row.feePrice}}/g</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="skuDiscountPrice" align="center" label="优惠工费">
          <template slot-scope="scope">
            <span>{{scope.row.skuDiscountPrice}}/g</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="delFun(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="addProTF" :close-on-click-modal="false" width="1200px">
      <span>
        <div>
          <el-row>
            <el-col :span="20">
              <span class="fontStyle">材质</span>
              <el-select
                v-model="goldCodeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span class="fontStyle">分类</span>
              <el-select
                v-model="stockTypeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option
                  v-for="item in categoryNewList"
                  :key="item.label"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
              <span class="fontStyle">生产工艺</span>
              <el-select
                v-model="processCodeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>

              <span class="fontStyle">商品搜索</span>
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
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </div>
        <div class="addProDiv" v-loading="proList.length == 0">
          <el-row
            v-for="(item,ind) in proList"
            :key="ind"
            @click.native="selectPro(item,2)"
            :class="item.selectTF?'orderBigDivTwo':'orderBigDiv'"
          >
            <el-col :span="24" class="tabTwo">
              <div class="tabTwoLeft">
                <img v-if="item.url" :src="$portImg+item.url" style="height:90px; width:120px;" />
                <img
                  v-else
                  src="../../../static/images/img-noimg.png"
                  style="height:90px; width:120px;"
                />
              </div>

              <el-row style="line-height:30px;" class="tabTwoRight">
                <el-col :span="24">{{item.proName}}</el-col>
                <el-col :span="8" class="txtTwo">编号：{{item.proNumber}}</el-col>
                <el-col :span="8" class="txtTwo">
                  原附加工费：
                  <span v-if="item.feeType === 1">{{item.additionPrice}}</span>
                  <span v-if="item.feeType === 2">{{item.feePrice}}</span>
                </el-col>
                <el-col :span="8" class="txtTwo">
                  现优惠：
                  <el-input-number
                    v-model="item.skuDiscountPrice"
                    placeholder="设置优惠"
                    size="small"
                    style="width:160px;"
                    :controls="false"
                    :min="0"
                    @focus="editDiscountPrice(item)"
                    @blur="checkNumber(item)"
                    @click.stop.native
                  >
                    <i slot="suffix" class="inputRight">/g</i>
                  </el-input-number>
                </el-col>
                <el-col :span="8" class="txtTwo">材质：{{item.goldCode}}</el-col>
                <el-col :span="8" class="txtTwo">产品类别：{{item.one}}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div>
          <span :span="24" class="pageD">
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
          </span>
          <span :span="20">
            已选择
            <span class="txtRed txtMargin5">{{proNum}}</span>款特价优惠产品
          </span>
          <span :span="4" style="float:right">
            <el-button size="small" class="width70" @click="cancelAdd">取消</el-button>
            <el-button type="primary" size="small" class="width70" @click="confirmAdd">确认</el-button>
          </span>
        </div>
      </span>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" :imgSrc="modelImgSrc"></Popoverpic>
    <!--  -->
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
      proNum: 0 //新增产品个数
    };
  },
  created() {
    this.created_fun();
    this.codeDisplay();
    //饰品品类读取
    // this.cateLoad();
  },
  methods: {
    created_fun() {
      this.loading = true;
      let self = this;
      this.$axios
        .get(this.$portMain + "/discount/getTskuDiscountList")
        .then(function(res) {
          if (res.data.code === 200) {
            self.tabAllData = res.data.data;
            self.tabAllData.forEach(ielem => {
              ielem.editTF = false;
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    displayAddProData(num, size) {
      var self = this;
      let params = {
        PRS: {
          proName: self.search,
          one: self.stockTypeId,
          processCode: self.processCodeId,
          goldCode: self.goldCodeId,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/product/proList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.proList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.proNum = 0;
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
    searchFun() {
      var self = this;
      self.displayAddProData(1, 12);
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
    //添加新条目事件
    addFun() {
      let self = this;
      self.selectProId = "";
      self.addProTF = true;
      self.displayAddProData(1, 12);
    },

    //刪除条目事件
    delFun(elem) {
      let self = this;
      this.$confirm(
        "此操作将删除该特价饰品优惠,还需要点击“确认保存”才能真正删除该特价饰品优惠, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let skuInd = -1;
          self.tabAllData.forEach((ielem, indOne) => {
            if (ielem.skuCode === elem.skuCode) {
              skuInd = indOne;
            }
          });
          self.tabAllData.splice(skuInd, 1);
          self.$message({
            type: "warning",
            message: "还需要点击“确认保存”才能真正删除该特价饰品优惠!"
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    //新增优惠产品取消按钮
    cancelAdd() {
      this.addProTF = false;
    },
    //编辑优惠价格输入框
    editDiscountPrice(ielem) {
      ielem.selectTF = true;
      this.selectPro(ielem, 1);
      this.$forceUpdate();
    },

    checkNumber(ielem) {
      ielem.skuDiscountPrice = Number(ielem.skuDiscountPrice).toFixed(2);
      this.$forceUpdate();
    },

    //新增优惠产品确认按钮
    confirmAdd() {
      // console.log(this.proList)
      let self = this;
      let confirmList = [];
      let confirmSkuList = [];
      this.proList.forEach(ielem => {
        if (ielem.selectTF === true && ielem.skuDiscountPrice) {
          confirmList.push(ielem);
          confirmSkuList.push(ielem.proNumber);
        }
      });

      let allDataSkuList = [];
      this.tabAllData.map(v =>
        allDataSkuList.push(v.skuCode ? v.skuCode : v.proNumber)
      );
      let repeatSkuList = [];

      for (let confirmSku of confirmSkuList) {
        allDataSkuList.indexOf(confirmSku) > -1 &&
          repeatSkuList.push(confirmSku);
      }
      if (repeatSkuList.length > 0) {
        this.$message.error(
          "添加失败！有重复的sku：【" + repeatSkuList.join(" / ") + "】"
        );
        return;
      }

      if (confirmList.length > 0) {
        self.tabAllData = confirmList.concat(self.tabAllData);
        self.addProTF = false;
      } else {
        this.$message.error("未选择产品或选择产品未填入优惠价，请重新提交!");
      }
      // this.addProTF = false;
    },
    //确认保存按钮
    confirmSave() {
      // console.log(this.tabAllData)
      let self = this;
      let confirmList = [];
      let tskuDiscountlist = [];
      this.tabAllData.forEach(ielem => {
        // console.log(ielem.wagePrice)
        tskuDiscountlist.push({
          skuCode: ielem.skuCode ? ielem.skuCode : ielem.proNumber,
          skuDiscountPrice: ielem.skuDiscountPrice,
          wagePrice:
            ielem.wagePrice || ielem.wagePrice === 0
              ? parseFloat(JSON.stringify(ielem.wagePrice))
              : ielem.additionPrice
        });
      });

      // if (tskuDiscountlist.length == 0) {
      //   this.$message.warning("抱歉，暂无数据不能保存！");
      //   return;
      // }
      let params = {
        tskuDiscountlist: JSON.stringify(tskuDiscountlist)
      };
      // console.log(tskuDiscountlist)
      this.$api.formdataPostFun(
        this.$portMain + "/discount/insertTskuDiscountList",
        params,
        res => {
          self.$message.success("确认保存优惠饰品成功，正在刷新！");
          setTimeout(function() {
            self.created_fun();
            self.$router.push("specialOffer");
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //新增优惠产品选择产品
    selectPro(elem, num) {
      if (num === 2) {
        if (elem.selectTF == undefined) {
          elem.selectTF = true;
        } else {
          elem.selectTF = !elem.selectTF;
        }
      }

      this.proNum = 0;
      this.proList.forEach(ielem => {
        if (ielem.selectTF === true) {
          this.proNum++;
        }
      });

      this.$forceUpdate();
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
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
      cursor: pointer;
    }
  }

  .txtRed {
    color: #F20F34;
  }

  .txtMargin5 {
    margin: 0 5px;
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
    width: 80px;
  }

  .pageD {
    padding-top: 20px;
  }
}
</style>
