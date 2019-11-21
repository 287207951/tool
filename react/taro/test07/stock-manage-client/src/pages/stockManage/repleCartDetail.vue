<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>补货购物车确认</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <figure class="head">
      <div class="desc">
        <p>
          <span>总数量：</span>
          <b>{{ orderSum }}</b>
        </p>
        <p>
          <span>总重量：</span>
          <b>约{{ orderTotalWeight }}g</b>
        </p>
      </div>
      <el-button size="small" type="primary" @click="toReplenishment" :loading="btnLoadingTF">生成补货单</el-button>
    </figure>
    <!-- 列表信息 -->

    <div class="tableHead">
      <ul class="tableUL">
        <li>工厂名称</li>
        <li>金料成色</li>
        <li>总数量</li>
        <li>总重量(g)</li>
        <li style="width:30%">期望交货日期</li>
        <li>字印</li>
      </ul>
    </div>

    <orderTable :order="order" v-for="order in orderAllData" :key="order.factoryNo">
      <header @dblclick="order.toggleInfo = !order.toggleInfo">
        <ul>
          <li>
            <!-- <span>生产工厂：</span> -->
            <b>{{ order.factoryName }}</b>
          </li>
          <li>
            <!-- <span>成色：</span> -->
            <b>{{ order.productCs }}</b>
          </li>
          <li>
            <!-- <span>总数量：</span> -->
            <b>{{ order.totailSum }}</b>
          </li>
          <li>
            <!-- <span>总重量：</span> -->
            <b>约{{ order.totailWeight.toFixed(2) }}g</b>
          </li>
          <!-- <li><span>成色：</span><b>{{ order.productCs }}</b></li> -->
          <li style="width:30%">
            <!-- <span>交货日期：</span> -->
            <el-date-picker
              v-model="order.deliveryDate"
              type="date"
              size="small"
              @change="changeDeliveryDate(order)"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            ></el-date-picker>
          </li>
          <li>
            <!-- <span>字印：</span> -->
            <el-input
              v-model="order.marking"
              placeholder="请输入字印"
              size="small"
              class="width160"
              @blur="goEmptyFun(order)"
            ></el-input>
          </li>
        </ul>
        <div class="option">
          <p @click.stop="order.toggleInfo = !order.toggleInfo">
            <!-- 详情 -->
            <i :class="order.toggleInfo ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
          </p>
        </div>
      </header>
    </orderTable>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mock: "",
      orderAllData: [],
      orderSum: 0, // 补货总数量
      orderTotalWeight: 0, // 补货总重量
      btnLoadingTF: false
    };
  },

  created() {
    let sarkData = JSON.parse(localStorage.sarkData),
      orderSum = 0,
      orderTotalWeight = 0;
    for (let v of sarkData) {
      orderSum += v.totailSum;
      orderTotalWeight += v.totailWeight;
      v.deliveryDate = null; // 添加交货日期字段
      v.toggleInfo = false; // 添加控制显示详情
      v.marking = "厂印"; //字印默认是厂印
      v.orderStandFroms.map(o => o.suit === 2 && (o.showList = true)); // 添加控制显示套装详情
    }
    this.orderAllData = sarkData;
    console.log("数123123", this.orderAllData);
    this.orderSum = orderSum;
    this.orderTotalWeight = orderTotalWeight.toFixed(2);
  },

  methods: {
    // 检查输入的日期
    changeDeliveryDate(order) {
      const inNow = Date.parse(new Date());
      const date = Date.parse(order.deliveryDate);
      if (date < inNow) {
        this.$message.warning("交货日期有误，交货日期不可小于当前时间。");
        order.deliveryDate = "";
      }
    },
    // 生成补货单
    toReplenishment() {
      this.btnLoadingTF = true;
      const { orderAllData } = this;
      let transfSkuNoteFroms = [], // 商品信息
        factoryInfoFroms = [], // 工厂信息
        method = 2,
        status = true,
        markingStatus = true;
      orderAllData.map(v => {
        v.deliveryDate || (status = false);
        v.marking || (markingStatus = false);
        // 获取购物车id和备注
        v.orderStandFroms.map(info => {
          info.orderStandPerFroms
            ? info.orderStandPerFroms.map(from =>
                transfSkuNoteFroms.push({
                  cartId: from.cartId,
                  productRemarks: from.productRemarks
                })
              )
            : transfSkuNoteFroms.push({
                cartId: info.cartId,
                productRemarks: info.productRemarks
              });
        });
        // 获取工厂和交货信息
        factoryInfoFroms.push({
          factoryNo: v.factoryNo,
          deliveryTime: v.deliveryDate,
          productCs: v.productCs,
          marking: v.marking.trim()
        });
      });

      // 交货日期校验
      // if (!status) {
      //   this.$message.warning("请核实并填写交货日期！");
      //   this.btnLoadingTF = false;
      //   return;
      // }

      //字印校验
      if (!markingStatus) {
        this.$message.warning("请输入字印！");
        this.btnLoadingTF = false;
        return;
      }

      //字印校验

      // console.log("transfSkuNoteFroms", transfSkuNoteFroms);
      // console.log("factoryInfoFroms", factoryInfoFroms);
      // console.log("method", method);
      // console.log("提交补货");
      // // return;
      this.$axios
        .post(this.$portMain + "/order/overReplenishOrders", {
          transfSkuNoteFroms,
          factoryInfoFroms,
          method
        })
        .then(res => {
          if (res.data.code === 200) {
            this.btnLoadingTF = false;
            localStorage.sarkData = "";
            this.$message.success("补货单生成成功！");
            setTimeout(() => this.$router.push("repleOrderOpera"), 1000);
          } else {
            this.btnLoadingTF = false;
            this.$message.error(res.data.msg);
          }
        });
    },
    //去空
    goEmptyFun(elem) {
      elem.marking = elem.marking.trim();
      console.log("去空", elem);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.width160 {
  width: 160px;
}

.head {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 64px;
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  padding-bottom: 10px;

  // margin-top: 15px;
  &:after {
    content: '';
    position: absolute;
    left: -15px;
    width: calc(100% + 30px);
    height: 10px;
    background: #f4f4f4;
  }

  // &:before {
  // top: 0;
  // }
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
    height: 50px;

    ul {
      display: flex;
      width: 95%;

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
      width: 5%;

      // background: red;
      p {
        font-size: 16px;
        font-weight: bold;
        color: #F20F34;
        cursor: pointer;
      }
    }
  }
}

.tableHead {
  .tableUL {
    // margin-top: 27px;
    height: 57px;
    display: flex;
    width: 95%;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(138, 142, 153, 1);

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

  &:after {
    content: '';
    display: block;
    margin-left: -20px;
    width: calc(100% + 40px);
    height: 1px;
    border-bottom: 1px solid rgba(228, 231, 240, 1);
    // background: #f4f4f4;
    // box-shadow: -1px 0 0 #ebebeb;
  }
}
</style>
