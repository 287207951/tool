<template>
  <div class="tzWrap" style="flex:6">
    <div class="uLOne" style="flex:3">
      <div style="margin-right: 10px;" v-show="handle">
        <el-checkbox v-model="mock" style="margin-top: 38px;"></el-checkbox>
      </div>
      <img
        v-if="baoData.proBasics"
        :src="baoData.proBasics.pic?$portImg+baoData.proBasics.pic:'../../../../../static/images/img-noimg.png'"
        @click="showPic(baoData.proBasics.pic?$portImg+baoData.proBasics.pic:'../../../../../static/images/img-noimg.png')"
        alt
      />
      <img
        v-else
        :src="baoData.url?$portImg+baoData.url:'../../../../../static/images/img-noimg.png'"
        @click="showPic(baoData.url?$portImg+baoData.url:'../../../../../static/images/img-noimg.png')"
        alt
      />
      <div class="liDes">
        <div>{{baoData.proName}}</div>
        <div>
          <span class="grayCol">编号：</span>
          <span>{{baoData.skuId}}</span>
        </div>
        <div v-if="baoData.proBasics.oneItemsCode != 'TZ'">
          <span class="grayCol">属性：</span>
          <span v-if="baoData.proBasics.goldCode">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="getAttributes(baoData.proBasics)"
            >
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{getAttributes(baoData.proBasics).length < 8?getAttributes(baoData.proBasics):getAttributes(baoData.proBasics).substr(0, 8)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else>-</span>
        </div>
        <div
          v-if="baoData.proBasics.oneItemsCode === 'TZ'"
          class="redCol"
          style="cursor: pointer;"
          @click="TZShow(baoData)"
        >
          套装详情
          <i class="el-icon-arrow-up" v-show="baoData.TZShow"></i>
          <i class="el-icon-arrow-down" v-show="!baoData.TZShow"></i>
        </div>
      </div>
    </div>
    <div class="uLTwo" style="flex:2">
      <div>
        <span class="grayCol">成色：</span>
        <span>{{baoData.proSpecData.conditi}}</span>
      </div>
      <div>
        <span class="grayCol">克重：</span>
        <span>{{baoData.proSpecData.weight}}g</span>
      </div>
      <div>
        <!-- 扩展属性（手寸，链长） -->
        <b
          v-if="baoData.proSpecData.extendAttr && baoData.proBasics.one"
          v-html="$api.getAttachProperty(baoData.proBasics.one,baoData.proSpecData.extendAttr)"
        ></b>&nbsp;
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
    },
    baoData: {
      required: true
    }
  },
  data() {
    return {
      arrowType: false,
      mock: ""
      // baoData: {}
    };
  },
  created() {},
  mounted() {},
  watch: {
    baoData: function(newVal, oldVal) {
      this.baoData = newVal;
      // this.baoData.forEach(ielem => {
      //   ielem.TZShow = false;
      // });
    }
  },
  computed: {},
  methods: {
    //套装隐藏打开
    TZShow(elem) {
      elem.TZShow = !elem.TZShow;
      this.arrowType = !this.arrowType;
      this.$forceUpdate();
      this.$emit("suitDes", this.arrowType);
    },
    //查看大图
    showPic(item) {
      this.$emit("showPic", item);
    },
    // 获取产品属性
    getAttributes(data) {
      let arr = [];
      return [
        data.goldCode,
        // data.conditi,
        data.one,
        data.effectCode,
        data.processCode,
        data.craft,
        data.pait
      ]
        .filter(n => n)
        .join(",");
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
  flex: 1;

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
