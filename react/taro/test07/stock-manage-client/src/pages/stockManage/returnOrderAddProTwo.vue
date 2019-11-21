<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>退货单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div class="info">
      <div class="info-top txtOne">
        <el-row>
          <el-col :span="6">
            退饰总数：
            <span class="redTxt">{{$api.returnFloatNum(orderSum)}}</span>
          </el-col>
          <el-col :span="10">
            退饰总重：
            <span class="redTxt">{{$api.returnFloat(orderWeight)}}</span>
          </el-col>
          <el-col :span="8" class="txtRight">
            <el-button size="small" @click="addReturnOrder" :loading="btnLoadingTF">生成退货单</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="info-middle">
          <!-- 单品start -->
          <div
            class="infom-info"
            v-for="(item,ind) in orderAllData"
            :key="ind"
          >
            <div class="infom-item">
              <div class="pro-item iitem-left">
                <div class="pro-imgs">
                  <img
                    :src="$portImg + item.productImg"
                    width="153"
                    height="116"
                  >
                </div>
                <div class="pro-right">
                  <el-row>
                    <el-col :span="24" class="pro-tit">{{item.productName}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="pro-middle">编号：{{item.productNo}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="pro-bottom">成色：
                      <span v-if="item.orderStandPerFroms">
                        {{item.productCS}}
                      </span>
                      <span v-if="item.relpishCartSuitFroms">
                        {{item.relpishCartSuitFroms[0].productCS}}
                      </span>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="iitem-right">
                <div class="order-th">
                  <div class="oth">克重(g)</div>
                  <!-- <div
                    class="oth"
                    v-if="item.styleKey.name == '圈号'"
                  >圈号(#)</div>
                  <div
                    class="oth"
                    v-if="item.styleKey.name == '长度'"
                  >链长(cm)</div>
                  <div
                    class="oth"
                    v-if="item.styleKey.name == '内径长'"
                  >内径长(cm)</div>
                  <div
                    class="oth"
                    v-if="item.styleKey.name == '圈口'"
                  >圈口(cm)</div> -->
                  <div class="oth" v-if="item.orderStandPerFroms">重量范围(g)</div>
                  <div class="oth">工费类型</div>
                  <div class="oth">基础工费</div>
                  <div class="oth">退货数量</div>
                  <div class="oth">退货重量</div>
                  <div class="oth">实收工费</div>
                </div>
                <div class="order-item" v-if="item.orderStandPerFroms">
                  <div
                    class="order-tr"
                    v-for="(it,index) in item.orderStandPerFroms"
                    :key="index"
                  >
                    <div
                      class="otd"
                    >{{$api.returnFloatNum(it.weight)}}</div>
                    <div
                      class="otd"
                       >{{it.weightStart}} - {{it.weightEnd}}</div>
                    <div class="otd">{{it.feeType === 1?"每克":'每件'}}</div>  
                    <div class="otd">{{it.basePrice}}</div>  
                    <div class="otd">{{it.skuSum}}</div>
                    <div class="otd">{{it.goldWeiht}}</div>
                    <div class="otd">{{it.receiablePrice}}</div>
                  </div>
                </div>
                <div class="order-item" v-if="item.relpishCartSuitFroms">
                  <div
                    class="order-tr"
                  >
                    <div
                      class="otd"
                    >{{$api.returnFloatNum(item.suitSkuWeight)}}</div>
                    <div class="otd">{{item.feeType === 1?"每克":'每件'}}</div>  
                    <div class="otd">{{item.suitBasePrice}}</div>  
                    <div class="otd">{{item.productSum}}</div>
                    <div class="otd">{{item.suitSkuGoldWeiht}}</div>
                    <div class="otd">{{item.suitReceiablePrice}}</div>
                  </div>
                </div>
              </div>
            </div>
            <el-row v-if="item.relpishCartSuitFroms">
              <el-col
                :span="24"
                class="suitDiv" 
              >
                <el-row>
                  <el-col span="11" class="suitSubDiv" v-for="(ielem,indTwo) in item.relpishCartSuitFroms" :key="indTwo+''">
                    <div class="pro-itemTwo">
                      <div class="pro-imgs">
                        <img
                          :src="ielem.productImg?$portImg+ielem.productImg:'../../../../static/images/img-noimg.png'"
                          width="153"
                          height="116"
                        />
                      </div>
                      <div class="pro-right">
                        <el-row>
                          <el-col
                            :span="24"
                            class="pro-tit"
                          >{{ielem.productName}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="24"
                            class="pro-middle"
                          >编号：{{ielem.productNo}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="24"
                            class="pro-middle"
                          >{{ielem.craft}}{{ielem.pait?','+ielem.pait:''}}{{ielem.extendAttr?','+ielem.extendAttr:''}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="11"
                            class="pro-bottom"
                          >克重(g):{{$api.returnFloatNum(ielem.weight)}}</el-col>
                          <el-col
                            :span="5"
                            class="pro-bottom"
                          >
                          <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>  
            </el-row>
          </div>
          <!-- 单品end -->

          <!-- 套装start -->
          <!-- <div
            class="suit"
            v-for="(item,ind) in iitem.suitProductFroms"
            :key="ind"
          >
            <div class="infom-info ">
              <div class="infom-item">
                <div class="pro-item iitem-left">
                  <div class="pro-imgs">
                    <img
                      :src="$portImg + item.productImg"
                      width="153"
                      height="116"
                    >
                  </div>
                  <div class="pro-right">
                    <p class="pro-tit">{{item.productName}}</p>
                    <p class="pro-middle">编号：{{item.productNo}}</p>
                    <p class="pro-bottom">{{item.productPey}}</p>
                  </div>
                </div>
                <div class="iitem-right">
                  <div class="order-th">
                    <div class="oth">克重(g)</div>
                    <div class="oth">重量范围(g)</div>
                    <div class="oth">退货数量</div>
                    <div class="oth">备注</div>
                  </div>
                  <div class="order-item">
                    <div class="order-tr">
                      <div
                        class="otd"
                        v-if="item.standardGold"
                      >{{item.standardGold.toFixed(2)}}</div>
                      <div class="otd">{{item.innerWeight}}</div>
                      <div class="otd">{{item.orderSum}}</div>
                      <div class="otd">{{item.productRemarks}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="suit-info">
              <div
                class="infom-info suiti-item"
                v-for="(it, ix) in item.suitProdctPeyFroms"
                :key="ix"
              >
                <div class="infom-item">
                  <div class="pro-item iitem-left">
                    <div class="pro-imgs">
                      <img
                        :src="$portImg + it.productImg"
                        width="153"
                        height="116"
                      >
                    </div>
                    <div class="pro-right">
                      <p class="pro-tit">{{it.productName}}</p>
                      <p class="pro-bottom">{{it.productPey}}</p>
                      <p class="pro-feetype">
                        <span>工费类型: {{it.fee}}</span>
                        <span>基本工费: {{it.basicFee}}</span>
                        <span v-if="it.additionFee">附加工费: {{it.additionFee}}</span>
                      </p>
                      <p class="pro-weight">
                        <span v-if="Number(it.suitStandardGold)">克重(g): {{it.suitStandardGold.toFixed(2)}}</span>
                        <span v-if="it.innerWeight">误差范围(g): {{it.innerWeight}}</span>
                        <span v-if="it.styleKey.name === '长度'">链长(cm): {{it.lengthStart}}-{{it.lengthEnd}}</span>
                        <span v-if="it.diameterLength">圈口(cm): {{it.diameterLength}}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div> -->
          <!-- 套装end -->

        <!-- </div> -->

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderSum:0,
      orderWeight:0,
      orderAllData: {},
      customerCompanyId:'',
      btnLoadingTF:false,
    };
  },

  created() {
    this.created_fun();
  },

  methods: {
    created_fun() {
      let self = this;
      self.orderAllData = JSON.parse(localStorage.sarkData)
      self.orderSum = 0
      self.orderWeight = 0
      self.orderAllData.forEach(ielem => {
        if(!ielem.relpishCartSuitFroms){
          self.customerCompanyId = ielem.customerCompanyId
          ielem.orderStandPerFroms.forEach(jelem=>{
              self.orderSum +=jelem.skuSum
              self.orderWeight +=jelem.goldWeiht
          })
        }else{
          self.customerCompanyId= ielem.customerCompanyId
          self.orderSum +=ielem.productSum
          self.orderWeight +=ielem.suitSkuGoldWeiht
        }
      });
      // console.log(self.orderAllData) 
    },


    //生成退货单
    addReturnOrder(){
      let self = this
      self.btnLoadingTF = true
      let backOrderFromsList = [];
      self.orderAllData.forEach(ielem=>{
        if(ielem.orderStandPerFroms){
          ielem.orderStandPerFroms.forEach(jelem=>{
            backOrderFromsList.push({
              skuNum:jelem.skuNum,
              suit:1,
              productSum:jelem.skuSum,
              goldWeight:jelem.goldWeiht,
              receiablePrice:jelem.receiablePrice
            })
          })
        }else{
          backOrderFromsList.push({
            skuNum:ielem.productNo,
            suit:2,
            productSum:ielem.productSum,
            goldWeight:ielem.suitSkuGoldWeiht,
            receiablePrice:ielem.suitReceiablePrice
          })
        }
      })
      let params = {
        customerCompanyId: self.customerCompanyId,
        backOrderFroms:backOrderFromsList
      };
      // console.log(JSON.stringify(params))
      this.$axios
        .post(this.$portMain + "/order/overBackOrdersInfo", params)
        .then(function(res) {
          self.btnLoadingTF = false
          if (res.data.code == 200) {
            self.$message.success('生成退货单成功，正在返回退货列表页！')
            setTimeout(function(){
              self.$router.push({ path: "returnOrderOpera" });
            },100)
          } else {
            self.$message.error(res.data.msg);
          }
        })      
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  color #333
  padding-bottom 200px
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
  .topMenuRight
    text-align right
  .searchTxt
    flex 1
    width 100%
  .top-select
    display flex
    justify-content center
    align-items center
  .info
    min-height 500px
    background #f5f5f5
    .info-top
      width 100%
      padding 10px 20px
      background #fff
      box-sizing border-box
      .infot-table
        .tr
          display flex
          width 100%
          border 1px solid #E9ECF5
          .th
            display flex
            align-items center
            justify-content center
            height 30px
            width 16%
            text-align center
            background #999999
            color #fff
          .td
            display flex
            justify-content center
            align-items center
            height 80px
            width 16%
            text-align center
          .handle
            display flex
            flex-direction column
            .el-button
              min-width 80px
              margin-left 0
    .info-middle
      margin 20px
      .infom-tit
        padding 0 20px
        line-height 40px
        background #fff
      .infom-info
        margin 10px
        .infom-item
          display flex
  .pro-item
    width 60%
    display flex
    align-items center
    padding 15px 20px
    background #fff
    border 1px solid #E9ECF5
  .pro-itemTwo
    width 90%
    display flex
    align-items center
    padding 15px 20px
    background #fff
    border 1px solid #E9ECF5
  .pro-imgs
    position relative
    width 153px
    height 116px
  .proimgs-add
    position absolute
    display flex
    top -10px
    left -10px
    padding 10px
    background rgba(0, 0, 0, 0.4)
  .proimgs-add > div > img
    padding-left 10px
  .proimgs-add > div > img:nth-of-type(1)
    padding-left 0
  .pro-item > img
    width 153px
    height 116px
  .pro-right
    width 75%
    display flex
    flex-flow column
    justify-content center
    margin-left 10px
  .pro-tit
    margin 10px 0
    font-size 14px
  .pro-middle
    margin 10px 0
    font-size 12px
    color #999
  .pro-bottom
    margin 10px 0
    font-size 12px
    line-height 14px
    color #333
    
  .iitem-right
    min-width 0%
    flex 1
    min-height 146px
    display flex
    flex-direction column
    font-size 12px
  .order-item
    flex 1
    display flex
    justify-content space-between
    flex-direction column
    .order-tr
      flex 1
      box-sizing border-box
      padding-left 40px
      display flex
      align-items center
      height 30px
      border-bottom 1px solid #E9ECF5
      .otd
        width 200px
        text-align center
    .order-tr:nth-of-type(odd)
      background #FAFAFA
    .order-tr:nth-of-type(even)
      background #ffffff
  .order-th
    box-sizing border-box
    padding-left 40px
    display flex
    align-items center
    height 30px
    background #E9ECF5
    color #666
    .oth
      width 200px
      text-align center
  .redTxt
    color #F20F34
  .txtRight
    text-align right
  .txtOne
    font-size 16px
    color #666
  .steps-list
    margin 20px
  .suit-info
    display flex
    flex-wrap wrap
    padding 20px 50px
    .suiti-item
      width 48%
      .pro-item
        width 100%
        .pro-right
          &> p
            margin-bottom 8px
        .pro-feetype
          font-size 12px
          line-height 14px
          color #999
          span
            margin-right 20px
        .pro-weight
          font-size 12px
          line-height 14px
          color #999
          span
            margin-right 20px
  .suitDiv
    border 1px solid #E9ECF5
    border-top 0
    background #FAFAFA
    padding 10px
    .suitSubDiv
      padding 10px
      margin 0px 10px  
</style>
