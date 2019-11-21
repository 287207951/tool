<template>
  <div class="container">
    <div class="productWarp" v-for="(item,index) in stockPro" :key="index">
      <img
        v-if="item.url"
        :src="item.url?$portImg+item.url:'/static/images/img-noimg.png'"
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
            <span class="right">{{item.conditi | $conditiNameFilter}}</span>
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

          <div class="proLI" v-if="item.goldWeight">
            <span class="left">库存净重：</span>
            <span class="right">{{item.goldWeight?item.goldWeight:0}}g</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [`stockPro`],
  data() {
    return {};
  },
  methods: {
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },

    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="stylus" scoped>
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
</style>
