<template>
  <div class="tzDetails">
    <div class="uLOne" style="flex:16">
      <img
        :src="suitDetailData.pic?$portImg+suitDetailData.pic:'../../../../../static/images/img-noimg.png'"
        :class="{'mL22':styleType}"
        @click="showPic(suitDetailData.pic?$portImg+suitDetailData.pic:'../../../../../static/images/img-noimg.png')"
        alt
      />
      <!-- <img src="../../../../../static/images/img-noimg.png" :class="{'mL22':styleType}" alt> -->
      <div class="liDes">
        <div>{{suitDetailData.name}}</div>
        <div>
          <span class="grayCol">编号：</span>
          <!-- <span>{{suitDetailData.proNum || suitDetailData.factoryNumber}}</span> -->
          <span>{{suitDetailData.factoryNumber}}</span>
        </div>

        <div>
          <span class="grayCol">属性：</span>
          <span v-if="suitDetailData.codeTxt">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="suitDetailData.codeTxt"
            >
              <span
                class="txtBlack overflowHidden"
                slot="reference"
              >{{suitDetailData.codeTxt.length < 8?suitDetailData.codeTxt:suitDetailData.codeTxt.substr(0, 8)+'...'}}</span>
            </el-popover>
          </span>
          <span v-else>-</span>
        </div>
      </div>
    </div>
    <div class="uLTwo" style="flex:10">
      <div>
        <span class="grayCol">克重：</span>
        <span>{{suitDetailData.weight}}g</span>
      </div>
      <div>
        <!-- <span class="grayCol">手寸：</span>
        <span>15#</span>-->

        <!-- 扩展属性（手寸，链长） -->
        <b
          v-if="suitDetailData.extend && suitDetailData.one"
          v-html="$api.getAttachProperty(suitDetailData.one,suitDetailData.extend)"
        ></b>&nbsp;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    styleType: {
      type: Boolean,
      default: false
    },
    suitDetailData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      arrowType: false
    };
  },
  created() {
    let newVal = this.suitDetailData;
  },
  mounted() {},
  watch: {
    suitDetailData(newVal, oldVal) {
      newVal.codeList = [];
      if (newVal.goldCode) {
        //材质
        newVal.codeList.push(newVal.goldCode);
      }
      if (newVal.condit) {
        //成色
        newVal.codeList.push(newVal.condit);
      }
      if (newVal.oneName) {
        //类别
        newVal.codeList.push(newVal.oneName);
      }
      if (newVal.effect) {
        //工艺
        newVal.codeList.push(newVal.effect);
      }
      if (newVal.processCode) {
        //生产工艺
        newVal.codeList.push(newVal.processCode);
      }
      newVal.codeTxt = newVal.codeList.join(",");
      this.suitDetailData = newVal;
    }
  },
  computed: {},
  methods: {
    //关闭
    suitDes() {
      this.arrowType = !this.arrowType;
      // this.$parent.suitDes();
      // console.log(this.$parent);
    },
    //查看大图
    showPic(item) {
      this.$emit("showPic", item);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tzDetails {
  width: 49%;
  display: inline-flex;
  margin-bottom: 20px;

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

  .mL22 {
    margin-left: 22px;
  }
}
</style>
