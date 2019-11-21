<template>
  <div class="tzWrap" style="flex:5">
    <div class="uLOne" style="flex:5">
      <div style="margin-right: 10px;" v-show="handle">
        <el-checkbox
          v-model="addProOBj.checked"
          style="margin-top: 38px;"
          @change="changeFun"
          :disabled="(addProOBj.amount <= 0 || addProOBj.storeAmount <= 0) && !isDisabled"
        ></el-checkbox>
      </div>
      <img
        :src="addProOBj.proBasics.pic?$portImg+addProOBj.proBasics.pic:'../../../../../static/images/img-noimg.png'"
        v-if="addProOBj.proBasics"
        @click="showPic(addProOBj.proBasics.pic?$portImg+addProOBj.proBasics.pic:'../../../../../static/images/img-noimg.png')"
        alt
      />
      <img
        :src="addProOBj.url?$portImg+addProOBj.url:'../../../../../static/images/img-noimg.png'"
        v-else
        @click="showPic(addProOBj.url?$portImg+addProOBj.url:'../../../../../static/images/img-noimg.png')"
        alt
      />
      <div class="liDes">
        <div>{{addProOBj.proName}}</div>
        <div>
          <span class="grayCol">编号：</span>
          <span
            v-if="addProOBj.proBasics"
          >{{addProOBj.skuId?addProOBj.skuId:addProOBj.proBasics.proNumber}}</span>
          <span v-else>{{addProOBj.proNumber}}</span>
        </div>

        <div
          v-if="(addProOBj.oneItemsCode?addProOBj.oneItemsCode:addProOBj.proBasics.oneItemsCode) != 'TZ' "
        >
          <span class="grayCol">属性：</span>
          <span v-if="addProOBj.proBasics">
            <span v-if="addProOBj.proBasics.goldCode">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="getAttributes(addProOBj.proBasics)"
              >
                <span
                  class="txtBlack overflowHidden"
                  slot="reference"
                >{{getAttributes(addProOBj.proBasics).length < 8?getAttributes(addProOBj.proBasics):getAttributes(addProOBj.proBasics).substr(0, 8)+'...'}}</span>
              </el-popover>
            </span>
            <span v-else>-</span>
          </span>
          <span v-else>
            <span v-if="addProOBj.goldCode">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="getAttributes(addProOBj)"
              >
                <span
                  class="txtBlack overflowHidden"
                  slot="reference"
                >{{getAttributes(addProOBj).length < 8?getAttributes(addProOBj):getAttributes(addProOBj).substr(0, 8)+'...'}}</span>
              </el-popover>
            </span>
            <span v-else>-</span>
          </span>
        </div>
        <div
          v-if="(addProOBj.oneItemsCode?addProOBj.oneItemsCode:addProOBj.proBasics.oneItemsCode) == 'TZ' "
          class="redCol"
          style="cursor: pointer;"
          @click="TZShow(addProOBj)"
        >
          套装详情
          <i class="el-icon-arrow-up" v-show="addProOBj.TZShow"></i>
          <i class="el-icon-arrow-down" v-show="!addProOBj.TZShow"></i>
        </div>
      </div>
    </div>
    <div class="uLTwo" style="flex:2">
      <div>
        <span class="grayCol">成色：</span>
        <span
          v-if="addProOBj.proBasics"
        >{{addProOBj.proSpecData.conditi?addProOBj.proSpecData.conditi:'-'}}</span>
        <span v-else>{{addProOBj.conditi}}</span>
      </div>
      <div>
        <span class="grayCol">克重：</span>
        <span v-if="addProOBj.proBasics">{{addProOBj.proSpecData.weight}}g</span>
        <span v-else>{{addProOBj.weights?addProOBj.weights:addProOBj.weight}}g</span>
      </div>
      <div>
        <!-- 扩展属性（手寸，链长） -->
        <span v-if="addProOBj.proBasics">
          <b
            v-if="addProOBj.proBasics.one && addProOBj.proSpecData.extendAttr"
            v-html="$api.getAttachProperty(addProOBj.proBasics.one,addProOBj.proSpecData.extendAttr)"
          ></b>
        </span>
        <span v-else>
          <b
            v-if="addProOBj.extendAttr && addProOBj.one"
            v-html="$api.getAttachProperty(addProOBj.one,addProOBj.extendAttr)"
          ></b>
        </span>
        &nbsp;
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
    addProOBj: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      arrowType: false,
      mock: "",
      // addProOBj: {},
      selectTF: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    addProOBj: function(newVal, oldVal) {
      this.$forceUpdate();
    }
  },
  computed: {},
  methods: {
    //套装隐藏打开
    TZShow(elem) {
      // elem.TZShow = !elem.TZShow;
      // this.$forceUpdate()
      this.arrowType = !this.arrowType;
      this.$emit("suitDes", {
        arrowType: this.arrowType,
        proNumber: elem.proNumber
      });
    },
    getTzAttrs(data) {
      const arr = ["goldCode", "condit", "oneName", "effect", "processCode"];
      const arr2 = [];
      arr.forEach(item => {
        if (data[item]) {
          arr2.push(data[item]);
        }
      });
      return arr2.join(",");
    },
    //选择
    changeFun(val) {
      this.$forceUpdate();
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
