<template>
  <div class="tzWrap" style="flex:6">
    <div class="uLOne" style="flex:3">
      <div style="margin-right: 10px;" v-show="handle">
        <el-checkbox v-model="mock" style="margin-top: 38px;"></el-checkbox>
      </div>
      <img src="../../../../../static/images/img-noimg.png" alt>
      <div class="liDes">
        <div>时尚精品珠花戒指</div>
        <div>
          <span class="grayCol">编号：</span>
          <span>AUZ00002</span>
        </div>
        <div class="redCol" style="cursor: pointer;" @click="suitDes">
          套装详情
          <i class="el-icon-arrow-up" v-show="arrowType"></i>
          <i class="el-icon-arrow-down" v-show="!arrowType"></i>
        </div>
      </div>
    </div>
    <div class="uLTwo" style="flex:2">
      <div>
        <span class="grayCol">成色：</span>
        <span>999</span>
      </div>
      <div>
        <span class="grayCol">克重：</span>
        <span>8.2g</span>
      </div>
      <div>
        <span class="grayCol">手寸：</span>
        <span>15#</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    handle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      arrowType: false,
      mock: ""
    };
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //关闭
    suitDes() {
      this.arrowType = !this.arrowType;
      // this.$parent.suitDes();
      // console.log(this.$parent.closeFun);
      this.$emit("suitDes", this.arrowType);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tzWrap {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;
  display: flex;

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  .uLOne {
    display: flex;

    img {
      width: 120px;
      height: 90px;
    }

    .liDes {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  .uLTwo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  // 更多
  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;

    strong {
      color: #df343d;
      font-weight: bold;
    }

    .dialog {
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 100%;
      width: 250px;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;

      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #37393b;
      }

      p {
        padding-top: 10px;
        line-height: 1.4;
        font-size: 12px;
        color: #3c3c3c;
      }
    }

    &:hover .dialog {
      visibility: visible;
    }
  }
}
</style>
