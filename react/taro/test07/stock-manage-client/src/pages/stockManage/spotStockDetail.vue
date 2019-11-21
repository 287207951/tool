<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库库存查看</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <div class="hr" /> -->

    <!-- head -->
    <figure class="head">
      <div class="desc">
        <p><span>补货总数量：</span><b>{{ orderSum }}</b></p>
        <p><span>补货总重量：</span><b>{{ orderTotalWeight }}g</b></p>
      </div>
      <el-button size="small" type="primary" @click="toReplenishment">生成补货单</el-button>
    </figure>
    <!-- 列表信息 -->
    <orderTable :order="order" v-for="order in orderAllData" :key="order.factoryNo">
      <header @dblclick="order.toggleInfo = !order.toggleInfo">
        <ul>
          <li><span>生产工厂：</span><b>{{ order.factoryName }}</b></li>
          <li><span>补货总数量：</span><b>{{ order.totailSum }}</b></li>
          <li><span>补货总重量：</span><b>{{ order.totailWeight }}</b></li>
          <li>
            <span>交货日期：</span>
            <el-date-picker
              v-model="order.deliveryDate"
              type="date"
              size="small"
              @change="changeDeliveryDate(order)"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </li>
        </ul>
        <div class="option">
          <p @click.stop="order.toggleInfo = !order.toggleInfo">详情 <i :class="order.toggleInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></p>
        </div>
      </header>
    </orderTable>
  </div>
</template>
<script>
export default {
  data() {
    return {
      stepsActive: 1,
      orderList: [],
      orderNo: "",
      // orderSum: 0,
      // orderTotalWeight: 0,
      // orderAllData: {},
      btnLoadingTF:false,


      orderAllData: [],
      orderSum: 0, // 补货总数量
      orderTotalWeight: 0, // 补货总重量
    };
  },

  created() {
    // this.orderAllData = JSON.parse(localStorage.sarkData);
    // this.created_fun();
    // 
    let sarkData = JSON.parse(localStorage.sarkData),
        orderSum = 0,
        orderTotalWeight = 0;
    for ( let v of sarkData ) {
      orderSum += v.totailSum;
      orderTotalWeight += v.totailWeight;
      v.deliveryDate = null; // 添加交货日期字段
      v.toggleInfo = false; // 添加控制显示详情
      v.orderStandFroms.map(o => o.suit === 2 && (o.showList = true)); // 添加控制显示套装详情
    }
    this.orderAllData = sarkData;
    this.orderSum = orderSum;
    this.orderTotalWeight = orderTotalWeight.toFixed(2);
  },

  methods: {
    // 检查输入的日期
    changeDeliveryDate (order) {
      const inNow = Date.parse(new Date());
      const date = Date.parse(order.deliveryDate);
      if ( date < inNow ) {
        this.$message.warning('交货日期有误，交货日期不可小于当前时间。');
        order.deliveryDate = '';
      }
    },
    // 生成补货单
    toReplenishment () {
      const { orderAllData } = this;
      let transfSkuNoteFroms = [], // 商品信息
          factoryInfoFroms = [], // 工厂信息
          method = 1,
          status = true;

      orderAllData.map(v => {
        v.deliveryDate || (status = false);
        // 获取购物车id
        v.orderStandFroms.map(info => {
          info.orderStandPerFroms ? 
          info.orderStandPerFroms.map(o => {
            transfSkuNoteFroms.push({ skuNum: o.skuNum, productRemarks: o.productRemarks, productSum: o.skuSum, suit: info.suit });
          }) :
          transfSkuNoteFroms.push({ skuNum: info.productNo, productRemarks: info.productRemarks, productSum: info.productSum, suit: info.suit });
        });
        // 获取工厂和交货信息
        factoryInfoFroms.push({ factoryNo: v.factoryNo, deliveryTime: v.deliveryDate });
      });

      // 交货日期校验
      if ( !status ) {
        this.$message.warning('请核实并填写交货日期！');
        return;
      }

      this.$axios.post(this.$portMain+'/order/overReplenishOrders', { transfSkuNoteFroms, factoryInfoFroms, method })
      .then(res => {
        if ( res.data.code === 200 ) {
          localStorage.sarkData = "";
          this.$message.success("补货单生成成功！");
          setTimeout(() => this.$router.push("repleOrderOpera"), 1000);
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },

    created_fun() {
      let self = this;
      self.orderSum = 0
      self.orderTotalWeight = 0
      this.orderAllData.forEach(ielem=>{
        // console.log(ielem)
        if(ielem.orderStandPerFroms){
          ielem.orderStandPerFroms.forEach(jelem=>{
            self.orderSum += jelem.skuSum 
            self.orderTotalWeight += self.$api.returnFloatNum(jelem.skuSum*jelem.weight);
          })
        }
        if(ielem.relpishCartSuitFroms){
          // ielem.relpishCartSuitFroms.forEach(jelem=>{
            // console.log(ielem)
            self.orderSum += ielem.productSum 
            self.orderTotalWeight += self.$api.returnFloatNum(ielem.productSum*ielem.suitSkuWeight);
          // })

        }
      })
      
    },

    upAudit() {
      var self = this;
      self.btnLoadingTF = true
      let transfSkuNoteFroms = [];
      self.orderAllData.forEach(item => {
        if(item.orderStandPerFroms){
          item.orderStandPerFroms.forEach(iitem => {
            transfSkuNoteFroms.push({
              skuNum: iitem.skuNum,
              productRemarks: iitem.productRemarks,
              productSum: iitem.skuSum,
              totailWeight: iitem.weight,
              goldWeight: iitem.weight,
              suit:1,
            });
          });
        }
        if(item.relpishCartSuitFroms){
          // console.log(item)
          // item.relpishCartSuitFroms.forEach(iitem => {
            // console.log(iitem)
            transfSkuNoteFroms.push({
              skuNum: item.productNo,
              productRemarks: item.productRemarks,
              productSum: item.productSum,
              suit:2,
            });
          // });
        }
        // console.log(item)
      });
      // console.log(transfSkuNoteFroms)
      let params = { transfSkuNoteFroms: transfSkuNoteFroms,method:1};
      // console.log(JSON.stringify(params))
      this.$axios
        .post(this.$portMain + "/order/overReplenishOrders", params)
        .then(res => {
          if (res.data.code == 200) {
            self.btnLoadingTF =false;
            localStorage.sarkData = '';
            self.$message.success("补货单生成成功！");
            setTimeout(function() {
              self.$router.push("repleOrderOpera");
            }, 1000);
          }
        });
    },

    backOrder() {
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let params = {
          PRS: {
            backRemarks: value,
            orderNo: this.orderNo
          }
        };
        this.$axios
          .get(this.$portMain + "/orderManage/backOrdersRemarks", params)
          .then(res => {
            if (res.data.code === 200) {
              // console.log(res.data.data)
              // this.result.orderStatus = 4;
            }
          });
      });
    },

    addImg() {}
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999

.head {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 64px;
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  padding: 10px 0;
  margin-top: 15px;
  &:before, &:after {
    content: '';
    position: absolute;
    left: -15px;
    width: calc(100% + 30px);
    height: 10px;
    background: #f4f4f4;
  }
  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }
  .desc {
    display: flex;
    align-items: center;
    width: 85%;
    p {
      width: 25%;
    }
    span {
      color: #8A9199;
    }
    b {
      color: #232426;
      font-weight: bloder;
    }
  }
}

.goods {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 57px;
    ul {
      display: flex;
      width: 85%;
      li {
        display: inline-flex;
        align-items: center;
        width: 25%;
        font-size: 16px;
        font-weight: bold;
        span {
          color: #8A9199;
          white-space: nowrap;
        }
        b {
          color: #232426;
          font-weight: bloder;
        }
      }
    }
    .option {
      display: inline-flex;
      justify-content: flex-end;
      width: 15%;
      p {
        font-size: 16px;
        font-weight: bold;
        color: #F20F34;
        cursor: pointer;
      }
    }
  }
}


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
        font-size 14px
        div
          font-weight bold
        span
          font-weight bold
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
  .txtRed
    color #F20F34
  .tabThree
    padding 10px 10px
    background rgba(250, 250, 250, 1)
    border 1px solid #eee
    border-top 0
    .tabThreeSubDiv
      margin 10px
      width calc(50% - 20px)
      padding 10px 5px
      background #fff
      display flex
      border 1px solid #f0f0f0
      .tabThreeLeft
        width 170px
        text-align center
      .tabThreeRight
        width calc(100% - 170px)
        line-height 30px
</style>
