<template>
  <div
    class="conBigDiv"
    id="prodedit"
  >
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓储管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存水位设置</el-breadcrumb-item>
      <el-breadcrumb-item>库存水位详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"></div>

    <!-- 上传图片 -->
    <div class="proimg">
      <div class="proimg-tit">
        <p
          class="pro-tit"
          v-show="activeName === 'first'"
        >生产图片</p>
        <p
          class="pro-tit"
          v-show="activeName === 'second'"
        >销售图片</p>
        <span class="saveSpan" v-show="activeName === 'second'">
          <el-button
            @click="cancelStock"
            size="small"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="saveStock"
            size="small"
          >保 存</el-button>
        </span>
      </div>
      <div
        class="proimg-img"
        v-show="activeName === 'first'"
      >
        <!-- <draggable
          v-model="prewImg"
          @end="onEnd"
          :options="{animation: 300,handle:'.iactive'}"
        > -->
          <!-- <transition-group> -->
            <div
              class="proii-i iactive"
              v-for="(item, index) in prewImg"
              :key="index"
            >
              <img
                class="proii-img"
                :src="$portImg + item"
                height="180"
                @click.stop="showPic($portImg + item)"
              >
            </div>
          <!-- </transition-group> -->
        <!-- </draggable> -->
      </div>
      <div
        class="proimg-img"
        v-show="activeName === 'second'"
      >
        <!-- <draggable
          v-model="imgList"
          @end="onEnd"
          :options="{animation: 300,handle:'.iactive'}"
        > -->
          <!-- <transition-group> -->
            <div
              class="proii-i iactive"
              v-for="(item, index) in imgList"
              :key="index"
            >
              <img
                class="proii-img"
                :src="$portImg + item "
                height="180"
                @click.stop="showPic($portImg + item)"
              >
            </div>
          <!-- </transition-group> -->
        <!-- </draggable> -->
      </div>
    </div>

    <!-- tabs -->
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="生产资料"
        name="first"
      >
        <div class="flexWrap">
          <div v-if="backDataPro.factoryNumber">
            <span class="fw-left">工厂产品编号</span>
            <span class="fw-right">{{backDataPro.factoryNumber}}</span>
          </div>
          <div v-if="backDataPro.one">
            <span class="fw-left">产品类别</span>
            <span class="fw-right">{{backDataPro.one}}</span>
          </div>
          <div v-if="backDataPro.proName">
            <span class="fw-left">产品名称</span>
            <span class="fw-right">{{backDataPro.proName}}</span>
          </div>
          <div v-if="backDataPro.goldCode">
            <span class="fw-left">产品材质</span>
            <span class="fw-right">{{backDataPro.goldCode}}</span>
          </div>
          <div v-if="backDataPro.processCode">
            <span class="fw-left">制造工艺</span>
            <span class="fw-right">{{backDataPro.processCode}}</span>
          </div>
          <div v-if="backDataPro.effectCode">
            <span class="fw-left">表面工艺</span>
            <span class="fw-right">{{backDataPro.effectCode}}</span>
          </div>
          <div v-if="backDataPro.carCode">
            <span class="fw-left">车花</span>
            <span class="fw-right">{{backDataPro.carCode}}</span>
          </div>

          <div v-if="backDataPro.patentNumber">
            <span class="fw-left">专利号</span>
            <span class="fw-right">{{backDataPro.patentNumber}}</span>
          </div>
          <div v-if="backDataPro.patentEndTime">
            <span class="fw-left">专利截止日期</span>
            <span class="fw-right">{{backDataPro.patentEndTime}}</span>
          </div>
          <div v-if="backDataPro.openType">
            <span class="fw-left">开口类型</span>
            <span
              class="fw-right"
              v-if="backDataPro.openType === 1"
            >固口</span>
            <span
              class="fw-right"
              v-if="backDataPro.openType === 2"
            >开口</span>
          </div>
          <div v-if="backDataPro.buckleCode">
            <span class="fw-left">链扣类型</span>
            <span class="fw-right">{{backDataPro.buckleCode}}</span>
          </div>
        </div>
        <el-row>
          <div class="pro-tit option-left">标准规格</div>
          <el-col
            :span="23"
            :offset="1"
          >
            <el-table
              :data="backList"
              stripe
              border
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column
                v-for="item in tableCols"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                header-align='center'
                align='center'
              >
              </el-table-column>
              <el-table-column
                prop="price"
                label="规格工费"
                header-align='center'
                align='center'
              >
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <div class="pro-tit option-left">自定义规格</div>
          <el-col
            :span="23"
            :offset="1"
          >
            <div class="flex">
              <span class="flex-left">产品克重</span>
              <span class="flex-right">{{backDataPro.customWeight}}</span>
            </div>
          </el-col>
          <el-col
            :span="23"
            :offset="1"
          >
            <div class="flex">
              <span class="flex-left">产品成色</span>
              <span class="flex-right">{{backDataPro.customCondition}}</span>
            </div>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane
        label="销售资料"
        name="second"
      >
        <div class="flexWrap">
          <div v-if="backDataEdit.proNumber">
            <span class="fw-left">销售产品编号</span>
            <span class="fw-right">{{backDataEdit.proNumber}}</span>
          </div>
          <div v-if="backDataEdit.proName">
            <span class="fw-left">产品名称</span>
            <span class="fw-right">{{backDataEdit.proName}}</span>
          </div>
          <div v-if="backDataEdit.theme">
            <span class="fw-left"></span>
            <span class="fw-right">{{backDataEdit.theme}}</span>
          </div>
          <div v-if="backDataEdit.series">
            <span class="fw-left">所属系列</span>
            <span class="fw-right">{{backDataEdit.series}}</span>
          </div>
          <div v-if="backDataEdit.exterior">
            <span class="fw-left">外观形状</span>
            <span class="fw-right">{{backDataEdit.exterior}}</span>
          </div>
          <div v-if="backDataEdit.crowd">
            <span class="fw-left">适合人群</span>
            <span class="fw-right">{{backDataEdit.crowd}}</span>
          </div>
          <div v-if="backDataEdit.age">
            <span class="fw-left">适合年龄</span>
            <span class="fw-right">{{backDataEdit.age}}</span>
          </div>
          <div v-if="backDataEdit.openTicket">
            <span class="fw-left">开票名称</span>
            <span class="fw-right">{{backDataEdit.openTicket}}</span>
          </div>
          <div
            class="fw-one"
            v-if="backDataEdit.proDesc"
          >
            <span class="fw-oneleft">产品描述</span>
            <span class="fw-oneright"> {{backDataEdit.proDesc}}
            </span>
          </div>
        </div>

        <el-row>
          <div class="pro-tit option-left">标准规格</div>
          <el-col
            :span="23"
            :offset="1"
          >
            <el-table
              :data="backList"
              stripe
              border
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column
                v-for="item in tableCols"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                header-align='center'
                align='center'
              >
              </el-table-column>
              <el-table-column
                prop="feeType"
                label="工费类型"
                header-align='center'
                align='center'
              >
                <template slot-scope="scope">
                  <p v-if="scope.row.feeType === 1">每克</p>
                  <p v-if="scope.row.feeType === 2">每件</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="采购工费"
                header-align='center'
                align='center'
              >
              </el-table-column>
              <el-table-column
                prop="additionPrice"
                label="附加工费"
                header-align='center'
                align='center'
              >
              </el-table-column>
              <el-table-column
                prop="feePrice"
                label="件工费"
                header-align='center'
                align='center'
              >
              </el-table-column>
              <el-table-column
                prop="lowerLimit"
                label="库存下线"
                header-align='center'
                align='center'
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-show="activeName === 'first'">
                    {{scope.row.lowerLimit}}
                  </span>
                  <el-input-number
                    v-show="activeName === 'second'"
                    v-model="scope.row.lowerLimit"
                    :controls="false"
                    size="small"
                    class="width80"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="upperLimit"
                label="库存上线"
                header-align='center'
                align='center'
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-show="activeName === 'first'">
                    {{scope.row.upperLimit}}
                  </span>
                  <el-input-number
                    v-show="activeName === 'second'"
                    v-model="scope.row.upperLimit"
                    :controls="false"
                    size="small"
                    class="width80"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="packageNumber"
                label="每包数量"
                header-align='center'
                align='center'
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-show="activeName === 'first'">
                    {{scope.row.packageNumber}}
                  </span>
                  <el-input-number
                    v-show="activeName === 'second'"
                    v-model="scope.row.packageNumber"
                    :controls="false"
                    size="small"
                    class="width80"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

      </el-tab-pane>
    </el-tabs>
    <!-- 图片放大 -->
    <Popoverpic
      v-show="modelType"
      @callback="cancelModel"
      :imgSrc="modelImgSrc"
    ></Popoverpic>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableCols: [
        {
          prop: "specNumber",
          label: "SKU编号"
        },
        {
          prop: "conditi",
          label: "成色"
        },
        {
          prop: "weight",
          label: "标准克重(g)"
        },
        {
          prop: "weightRange",
          label: "误差范围(g)"
        }
      ],
      result: {},
      imgList: [],
      prewImg: [],
      activeName: "",
      oneTit: `戒指`,
      backDataPro: ``,
      backDataEdit: {},
      backList: [],
      tableList: [{}],

      open_type_code: [
        {
          code: "",
          val: "请选择"
        },
        {
          code: 1,
          val: "固口"
        },
        {
          code: 2,
          val: "开口"
        }
      ],
      fee_type_code: [
        {
          code: 1,
          val: "每克"
        },
        {
          code: 2,
          val: "每件"
        }
      ],
      backData: {}, //库存产品全部数据
      modelType: false, //图片显示
      modelImgSrc: "" //图片放大显示路径
    };
  },
  created() {
    this.activeName = this.$route.query.activeName
    this.outputStockId = this.$route.query.outputStockId;
    this.created_fun();
  },
  methods: {
    created_fun() {
      let self = this;
      this.getProFrom();
    },

    getProFrom() {
      let self = this;
      let params = {
        id: this.outputStockId
      };
      this.$api.formdataPostFun(self.$portMain + "/product/get", params, res => {
        this.backData = res.data;
        this.backDataPro = this.backData.produce;
        this.backDataEdit = this.backData.pro;
        this.backList = this.backData.produceSku;
        this.tableList = this.backData.proSku;
        this.backData.produceSku.forEach(item => {
          if (item.weight_start) {
            item.weightRange = `${item.weight_start}-${item.weight_end}`;
          }
          if (item.faceWidthStart) {
            item.faceWidthRange = `${item.faceWidthStart}-${item.faceWidthEnd}`;
          }
          if (item.diameterWidthStart) {
            item.diameterWidthRange = `${item.diameterWidthStart}-${
              item.diameterWidthEnd
            }`;
          }
          if (item.diameterLengthStart) {
            item.diameterLengthRange = `${item.diameterLengthStart}-${
              item.diameterLengthEnd
            }`;
          }
          if (item.lengthStart) {
            item.lengthRange = `${item.lengthStart}-${item.lengthEnd}`;
          }
          item.condition = item.conditi;
        });
        this.backData.produceSku.forEach(item => {
          this.backData.proSku.forEach(it => {
            if (item.id === it.specId) {
              Object.assign(item, it);
            }
          });
        });
        this.prewImg = this.backData.producePic;
        this.imgList = this.backData.pic;
        this.oneTit = this.backDataPro.one;
        this.backDataPro.patentEndTime = this.$day(
          this.backDataPro.patentEndTime
        ).format("YYYY-MM-DD");
        this.changeOneTit();
      });
      // return this.$axios
      //   .get(this.$portMain + "/pro/sale/get", params)
      //   .then(res => {
      //
    },

    changeOneTit() {
      let ringList = [
        {
          prop: "ringHand",
          label: "手寸(cm)"
        }
      ];
      let bracelet = [
        {
          prop: "diameterLength",
          label: "标准内径长(cm)"
        },
        {
          prop: "diameterLengthRange",
          label: "内经长范围(cm)"
        },
        {
          prop: "diameterWidth",
          label: "标准内径宽(cm)"
        },
        {
          prop: "diameterWidthRange",
          label: "内径宽范围(cm)"
        },
        {
          prop: "faceWidth",
          label: "标准面宽(cm)"
        },
        {
          prop: "faceWidthRange",
          label: "面宽范围(cm)"
        }
      ];
      let necklace = [
        {
          prop: "length",
          label: "标准链长(cm)"
        },
        {
          prop: "lengthRange",
          label: "链长范围(cm)"
        }
      ];

      switch (this.oneTit) {
        case `戒指`:
          this.tableCols = this.tableCols.concat(ringList);
          break;
        case `手镯`:
          this.tableCols = this.tableCols.concat(bracelet);
          break;
        case `项链`:
          this.tableCols = this.tableCols.concat(necklace);
          break;
        default:
          break;
      }
    },

    onEnd() {},

    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    },
    //取消保存，返回库位
    cancelStock() {
      let self = this;
      self.$router.push({
        path: "stockStockLevel"
      }); 
    },
    //保存上线下线和包数量事件
    saveStock() {
      let self = this;
      let params = [];
      self.backList.forEach(item => { 
        if (item.specNumber && item.specNumber.length > 0) {
          // console.log(item)
          params.push({
            specNumber: item.specNumber,
            lowerLimit: item.lowerLimit,
            upperLimit: item.upperLimit,
            packageNumber: item.packageNumber
          });
        }
      });
      this.$axios
        .post(this.$portMain + "/product/individualSet", params)
        .then(function(res) {
          self.$router.push({
            path: "stockStockLevel"
          });
        });
    }
  }
};
</script>

<style>
#prodedit .el-tabs__nav-scroll {
  margin-left: 24px;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = #e60e32
$font-color = #999
.input-range-item
  margin-bottom 18px
  & > p
    padding 8px 2px
    font-size 14px
    color #888
  & > .inpurai-info
    display flex
    justify-content space-between
    width 400px
    & > .el-input
      width 260px
.select-item
  margin-bottom 18px
  & > .el-select
    width 400px
  & > p
    padding 8px 2px
    font-size 14px
    color #888
    & > span
      color red
.input-item
  margin-bottom 18px
  & > .el-input
    width 400px
  & > .el-textarea, & > p
    padding 8px 2px
    font-size 14px
    color #888
    & > span
      color red
.proimg
  padding 24px
  .proimg-tit
    width 100%
    display flex
    justify-content space-between
    margin-bottom 20px
  .proimg-img
    display flex
    .proii-i
      // position: relative;
      margin-right 20px
      // width: 240px;
      height 180px
      margin-bottom 10px
      &.iactive
        // border: 1px solid $base-color;
      .proii-img
        &:hover
          border 1px solid red
      .proii-badge
        position absolute
        top 0
        right 0
    .proii-bor
      box-sizing border-box
      padding-top 86px
      width 240px
      height 180px
      // background: url('../../../../static/images/img-addimg.png') no-repeat;
      background-size 100% 100%
      & > p
        text-align center
        line-height 1.5
        color $base-color
      &:hover
        cursor pointer
.conBigDiv
  padding-bottom 80px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .proimg-img > div > span
    display flex
    flex-wrap wrap
#exFile
  opacity 0
  width 0
  height 0
.pro-tit
  font-size 18px
.option-left
  margin-left 24px
  margin-top 36px
  margin-bottom 20px
// 输入框
.input-item
  margin-bottom 18px
  & > .el-input
    width 400px
  & > .el-textarea, & > p
    padding 8px 2px
    font-size 14px
    color #888
    & > span
      color red
.flex
  font-size 14px
  display flex
  padding 10px 0
  line-height 1.6
  .flex-left
    flex 1
    text-align right
    margin-right 48px
    color #999
  .flex-right
    flex 11
    color #666
.sizeinfo
  max-width 1500px
  .el-select
    flex 1
    margin-left 30px
    margin-bottom 14px
  .el-input
    flex 1
    margin-left 30px
    margin-bottom 14px
  .size-th
    display flex
    justify-content space-between
    font-size 14px
    color #666
    margin-bottom 20px
    > p
      flex 1
      margin-left 30px
  .size-tr
    // position: relative;
    display flex
    justify-content space-between
  .keypoint
    // position: relative;
    &:after
      content '*'
      position absolute
      right -10px
      top 8px
      color red
  .noline
    margin-top 10px
    font-size 14px
    color #999
    text-align center
  .rulesdel
    position absolute
    right -80px
    font-size 20px
    margin-top -4px
    line-height 2
    cursor pointer
  .rulesdel:hover
    color red
.flexWrap
  display flex
  flex-wrap wrap
  font-size 14px
  padding-left 50px
  > div
    display flex
    width 32%
    line-height 2.6
    .fw-left
      text-align right
      flex 3
      color #999
      margin-right 40px
    .fw-right
      flex 7
  .fw-one
    width 100%
    .fw-oneleft
      text-align right
      flex 1
      color #999
      margin-right 40px
    .fw-oneright
      flex 10
      margin-right 40px
      margin-top 4px
  .width80
    width 80px
  .saveSpan
    width 400px
    float right
</style>
