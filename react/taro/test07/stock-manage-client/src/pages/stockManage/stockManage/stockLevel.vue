<template>
  <div class="conBigDiv"
       v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓储管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存水位设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="18">
          <span class="fontStyle">上架时间</span>
          <el-date-picker v-model="selectedDay"
                          type="daterange"
                          align="right"
                          size="small"
                          @change="selectDayFun"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="$publicData.pickerOptions2"
                          style="width:300px"></el-date-picker>

          <span class="fontStyle">产品类别</span>
          <el-select v-model="stockTypeId"
                     placeholder="请选择"
                     size="small"
                     style="width:160px"
                     @change="changeOneFun">
            <el-option v-for="item in categoryNewList"
                       :key="item.value"
                       :label="item.value"
                       :value="item.label"></el-option>
          </el-select>
          <el-input placeholder="产品名称/产品编码"
                    v-model="search"
                    class="input-with-select searchTxt"
                    size="small"
                    style="width:250px"
                    @keyup.enter.native="searchFun">
            <i slot="prefix"
               class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>

        <el-col :span="6"
                class="txtRight">
          <el-button size="small"
                     class="btnOne"
                     :disabled="disabledTF"
                     @click="updataStockFun">同步线上产品</el-button>
          <el-button size="small"
                     type="primary"
                     class="btnOne"
                     @click="setStockFun">设置产品水位</el-button>
        </el-col>
      </el-row>
      <el-table :data="parageraphList"
                stripe
                @row-dblclick="editGold"
                border
                class="tabOne"
                height="700"
                style="width: 100%; margin-top: 20px">
        <el-table-column prop="output_code"
                         label="图片"
                         header-align="center"
                         align="center"
                         width="180">
          <template slot-scope="scope">
            <div class="proImg">
              <img v-if="scope.row.listUrl[0].length >0"
                   :src="$portImg+scope.row.listUrl[0]"
                   class="proImgOne"
                   @click.stop="showPic($portImg+scope.row.listUrl[0])">
              <img v-else
                   src="/static/images/img-noimg.png"
                   class="proImg">
              <div class="imgDel"
                   v-if="scope.row.statu == 2">商品已删除</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="proName"
                         label="名称"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="proNumber"
                         label="编码"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="oneTxt"
                         label="分类"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="theme"
                         label="所属主题"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="series"
                         label="所属系列"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="statu"
                         label="状态"
                         header-align="center"
                         align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.statu == 1">已上架</span>
            <span v-if="scope.row.statu == 0">未上架</span>
            <span v-if="scope.row.statu == 2">已删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="upTime"
                         label="上架时间"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="bills_statue"
                         label="操作"
                         header-align="center"
                         align="center">
          <template slot-scope="scope">
            <el-button size="small"
                       type="primary"
                       @click="editStockLevel(scope.row)">设置产品水位</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNum"
                       :page-sizes="[12, 30, 50, 100]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="priceSum"
                       background></el-pagination>
      </div>
    </div>

    <!-- 设置产品水位弹框 -->
    <el-dialog title="设置产品水位"
               :visible.sync="setStockLevelTF"
               :close-on-click-modal="false"
               width="560px">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="4"
                  v-for="(item,index) in categorySetData"
                  :key="index"
                  class="editCateDivTop">
            <el-radio v-model="cateSelectId"
                      :label="item.code"
                      size="small"
                      @change="changeCateSelect">
              <span :class="item.map?'txtOne':'txtTwo'">{{item.one}}</span>
            </el-radio>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"
                  class="editCateDiv">每包数量</el-col>
          <el-col :span="6"
                  class="editCateDiv">
            <el-input v-model="packageNumber"
                      placeholder="请输入每包数量"
                      size="small"></el-input>
          </el-col>
          <el-col :span="14"
                  class="editCateDiv">&nbsp;</el-col>
          <el-col :span="4"
                  class="editCateDiv">库存水位</el-col>
          <el-col :span="6"
                  class="editCateDiv">
            <el-input v-model="lowerLimit"
                      placeholder="库存下限位"
                      size="small"></el-input>
          </el-col>
          <el-col :span="2"
                  class="editCateDiv">&nbsp;</el-col>
          <el-col :span="6"
                  class="editCateDiv">
            <el-input v-model="upperLimit"
                      placeholder="库存上限位"
                      size="small"></el-input>
          </el-col>
          <el-col :span="6"
                  class="editCateDiv">&nbsp;</el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancelsetStockOne"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="setStockOne"
                   size="small">确定</el-button>
      </span>
    </el-dialog>

    <!-- 图片放大 -->
    <Popoverpic v-show="modelType"
                @callback="cancelModel"
                :imgSrc="modelImgSrc"></Popoverpic>
    <!--  -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      categoryList: [], //新建托盘品类数组
      categorySetData: [], //品类设置数组
      categoryNewList: [], //新建托盘品类数组(加全部)
      tableData: [{}], // 模拟
      setStockLevelTF: false, //提示状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      modelType: false, //图片显示
      modelImgSrc: "", //图片放大显示路径
      cateSelectId: "", //品类选择Id
      packageNumber: "", //包数
      upperLimit: "", //上限水位
      lowerLimit: "", //下限水位
      disabledTF: false //同步产品水位按钮禁用
    };
  },
  created () {
    this.created_fun();
  },
  methods: {
    created_fun () {
      var self = this;
      this.displayAllData(1, 12);
      this.$publicData
        .categoryFun()
        .then(function (res) {
          self.categoryList = res;
          self.categoryNewList = JSON.parse(JSON.stringify(self.categoryList));
          self.categoryNewList.unshift({
            value: "全部",
            label: "",
            editedTF: false
          });
        })
        .catch(function (err) {
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
    displayAllData (num, size) {
      this.loading = true;
      var self = this;
      let params = {
        proName: self.search,
        dateStart: self.startTime,
        dateEnd: self.endTime,
        one: self.stockTypeId,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        self.$portMain + "/product/list",
        params,
        res => {
          self.priceSum = res.data.rowSize;
          self.pageNum = num;
          self.pageSize = size;
          if (res.data.data) {
            res.data.data.forEach((item, index) => {
              item.oneTxt = self.returnOneTxt(item.one);
              if (!item.listUrl) {
                item.listUrl = [""];
              }
            });
            self.parageraphList = res.data.data;
          } else {
            self.parageraphList = [];
          }
          self.loading = false;
        },
        err => {
          self.$message.error(err.msg);
          self.loading = false;
        }
      );
    },

    // 编辑单
    editGold (elem) {
      this.$router.push({
        path: "stockStockLevelDetail",
        query: { outputStockId: elem.id, activeName: "first" }
      });
    },
    //分页事件开始
    handleSizeChange (val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange (val) {
      this.displayAllData(val, this.pageSize);
    },

    //搜索
    searchFun () {
      var self = this;
      self.displayAllData(1, self.pageSize);
    },

    //查看图片
    showPic (imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel (e) {
      this.modelType = e;
    },
    //设置产品水位
    setStockFun () {
      let self = this;
      self.$api.formdataPostFun(
        self.$portMain + "/product/show",
        {},
        res => {
          self.categorySetData = res.data;
          self.setStockLevelTF = true;
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //品类反回
    returnOneTxt (elem) {
      var self = this;
      var outTxt = "";
      this.categoryList.forEach(item => {
        if (elem == item.label) {
          outTxt = item.value;
        }
      });
      return outTxt;
    },
    //设置
    editStockLevel (elem) {
      this.$router.push({
        path: "stockStockLevelDetail",
        query: { outputStockId: elem.id, activeName: "second" }
      });
    },
    //时间选择
    selectDayFun () {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      self.displayAllData(1, self.pageSize);
    },
    //品类选择
    changeOneFun () {
      let self = this;
      self.displayAllData(1, self.pageSize);
    },
    //批量品类设置上下线
    setStockOne () {
      let self = this;
      if (
        self.cateSelectId == "" ||
        // self.packageNumber == "" ||
        self.lowerLimit == "" ||
        self.upperLimit == ""
      ) {
        self.$message.error("还有必填值未填入，不能提交！");
        return false;
      }
      let params = {
        one: self.cateSelectId,
        lowerLimit: self.lowerLimit,
        upperLimit: self.upperLimit,
        packageNumber: self.packageNumber?self.packageNumber:'',
      };
      // console.log(params)
      self.$api.formdataPostFun(
        self.$portMain + "/product/set",
        params,
        res => {
          self.$message.success("一键设置产品水位成功！");
          self.setStockLevelTF = false;
          self.cateSelectId = "";
          self.packageNumber = "";
          self.lowerLimit = "";
          self.upperLimit = "";
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //批量品类设置上下线
    cancelsetStockOne () {
      let self = this;
      self.cateSelectId = "";
      self.packageNumber = "";
      self.lowerLimit = "";
      self.upperLimit = "";
      self.setStockLevelTF = false;
    },
    //改变一键设置水位设置事件
    changeCateSelect (value) {
      let self = this;
      self.categorySetData.forEach(item => {
        if (item.code == value) {
          if (item.map) {
            self.packageNumber = item.map.packageNumber;
            self.lowerLimit = item.map.lowerLimit;
            self.upperLimit = item.map.upperLimit;
          } else {
            self.packageNumber = "";
            self.lowerLimit = "";
            self.upperLimit = "";
          }
        }
      });
    },
    //同步产品水位
    updataStockFun () {
      let self = this;
      this.$axios
        .get(self.$portMain + "/products/getProSynchronization")
        .then(function (res) {
          if (res.data.code == 200) {
            self.disabledTF = true;
            self.$message.success("同步线上产品成功，正在刷新页面！");
            setTimeout(function () {
              self.created_fun();
            }, 1000);
          } else {
            self.$message.error(res.data.msg);
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
      width: 560px;
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

  th {
    background: #666;
  }

  .btnOne {
    margin-right: 20px;
  }

  .txtOne {
    color: #333;
    font-weight: bold;
  }

  .txtTwo {
    color: #999;
  }

  .editCateDivTop {
    height: 40px;
    line-height: 40px;
  }

  .editCateDiv {
    height: 60px;
    line-height: 60px;
  }

  .proImg {
    height: 90px;
    width: 120px;
    position: relative;
    margin: 0 auto;
  }

  .proImgOne {
    height: 90px;
    width: 120px;
  }

  .imgDel {
    position: absolute;
    top: 35px;
    color: #ffffff;
    text-align: center;
    background: #666;
    opacity: 0.4;
    width: 100%;
  }
}
</style>
<style>
.tabOne .el-table__header th {
  background: #e9eff4;
  color: #8a9199;
}
</style>
